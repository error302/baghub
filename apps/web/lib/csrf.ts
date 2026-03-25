import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex");
const CSRF_TOKEN_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

// Generate a CSRF token
export function generateCsrfToken(): string {
  const timestamp = Date.now().toString();
  const hash = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(timestamp)
    .digest("hex");

  return `${timestamp}.${hash}`;
}

// Verify a CSRF token
export function verifyCsrfToken(token: string): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, hash] = parts;

  // Check if token is expired (1 hour max)
  const tokenAge = Date.now() - parseInt(timestamp, 10);
  if (tokenAge > 60 * 60 * 1000) return false;

  // Verify hash
  const expectedHash = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(timestamp)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

// Check CSRF token from request
export function validateCsrf(request: NextRequest): boolean {
  // Skip CSRF check for GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true;
  }

  // Check header first, then body
  const tokenFromHeader = request.headers.get(CSRF_HEADER_NAME);
  const tokenFromCookie = request.cookies.get(CSRF_TOKEN_NAME)?.value;

  if (!tokenFromHeader || !tokenFromCookie) {
    return false;
  }

  // Verify both tokens match and are valid
  return (
    tokenFromHeader === tokenFromCookie && verifyCsrfToken(tokenFromHeader)
  );
}

// Get CSRF token from cookies (for client-side use)
export function getCsrfToken(): string | undefined {
  return cookies().get(CSRF_TOKEN_NAME)?.value;
}

// Set CSRF token cookie
export function setCsrfTokenCookie(): string {
  const token = generateCsrfToken();
  cookies().set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  return token;
}