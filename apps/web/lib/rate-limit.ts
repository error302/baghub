import { NextRequest } from "next/server";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max unique tokens per interval
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory store for rate limiting (use Redis in production)
const tokenCache = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tokenCache.entries()) {
    if (now > value.resetTime) {
      tokenCache.delete(key);
    }
  }
}, 60000); // Clean every minute

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (
      request: NextRequest,
      limit: number,
      token?: string
    ): Promise<RateLimitResult> => {
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0] || request.ip || "unknown";
      const key = token || `${ip}:${request.nextUrl.pathname}`;

      const now = Date.now();
      const entry = tokenCache.get(key);

      if (!entry || now > entry.resetTime) {
        // New entry or expired
        tokenCache.set(key, {
          count: 1,
          resetTime: now + config.interval,
        });

        return {
          success: true,
          limit,
          remaining: limit - 1,
          reset: now + config.interval,
        };
      }

      if (entry.count >= limit) {
        // Rate limited
        return {
          success: false,
          limit,
          remaining: 0,
          reset: entry.resetTime,
        };
      }

      // Increment count
      entry.count++;

      return {
        success: true,
        limit,
        remaining: limit - entry.count,
        reset: entry.resetTime,
      };
    },
  };
}

// Pre-configured rate limiters
export const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const authLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 100,
});

export const checkoutLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50,
});

// Helper to get rate limit headers
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.reset / 1000).toString(),
  };
}