/**
 * Input sanitization utilities
 * Prevents XSS attacks by cleaning user input
 */

// Simple HTML entity encoding for server-side use
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Remove any HTML tags from a string
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

// Sanitize a string for safe display
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return escapeHtml(stripHtml(input.trim()));
}

// Sanitize an email address
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  return email.toLowerCase().trim().replace(/[<>]/g, "");
}

// Sanitize a URL
export function sanitizeUrl(url: string): string {
  if (typeof url !== "string") return "";

  // Only allow http, https, and relative URLs
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed.replace(/[<>"{}|\\^`]/g, "");
  }

  return "";
}

// Sanitize an object's string fields
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  stringFields: (keyof T)[]
): T {
  const sanitized = { ...obj };

  for (const field of stringFields) {
    if (typeof sanitized[field] === "string") {
      (sanitized[field] as unknown) = sanitizeString(
        sanitized[field] as string
      );
    }
  }

  return sanitized;
}

// Validate and sanitize a phone number
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") return "";
  return phone.replace(/[^\d\s\-+()]/g, "").trim();
}

// Sanitize search query
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== "string") return "";
  return query
    .replace(/[<>\"'&]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200); // Limit length
}