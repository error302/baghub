# BagHub Security Documentation

## Overview

BagHub implements industry-standard security practices to protect user data and prevent common web vulnerabilities.

## Security Measures Implemented

### 1. HTTP Security Headers

All responses include the following security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | max-age=63072000; includeSubDomains; preload | Forces HTTPS connections |
| `X-Content-Type-Options` | nosniff | Prevents MIME-type sniffing |
| `X-Frame-Options` | DENY | Prevents clickjacking |
| `X-XSS-Protection` | 1; mode=block | Enables XSS filter |
| `Referrer-Policy` | strict-origin-when-cross-origin | Controls referrer information |
| `Permissions-Policy` | camera=(), microphone=(), geolocation=() | Restricts browser features |
| `Content-Security-Policy` | (see below) | Controls resource loading |

### 2. Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'nonce-{random}' 'strict-dynamic' https://js.stripe.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' blob: data: https://res.cloudinary.com;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://api.stripe.com;
frame-src 'self' https://js.stripe.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

### 3. Authentication & Session Security

- **Password Hashing**: bcrypt with cost factor 12
- **Session Management**: JWT with 15-minute access tokens
- **Secure Cookies**: httpOnly, secure, SameSite=strict
- **PKCE Flow**: For OAuth providers (Google)

### 4. Input Validation

All user inputs are validated using Zod schemas:

- **Email**: Format validation, max 255 chars, lowercase normalization
- **Password**: Min 8 chars, requires uppercase, lowercase, and number
- **Names**: Min 2 chars, max 100 chars, HTML stripped
- **Addresses**: Validated format, length limits, country codes

### 5. Rate Limiting

API endpoints are protected with rate limiting:

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 1 minute |
| Authentication | 10 requests | 15 minutes |
| Checkout | 20 requests | 1 minute |

### 6. CSRF Protection

- Tokens generated with HMAC-SHA256
- Tokens expire after 1 hour
- Validated on all POST/PUT/DELETE requests
- Double-submit cookie pattern

### 7. SQL Injection Prevention

- Prisma ORM with parameterized queries
- No raw SQL in application code
- Input sanitization before database operations

### 8. XSS Prevention

- Content Security Policy blocks inline scripts
- HTML entity encoding for user-generated content
- DOMPurify for rich text content
- React's built-in XSS protection

## OWASP Top 10 Mitigations

| Vulnerability | Mitigation |
|---------------|------------|
| A01: Broken Access Control | Role-based access, JWT validation, RLS |
| A02: Cryptographic Failures | HTTPS everywhere, bcrypt, secure cookies |
| A03: Injection | Parameterized queries, input validation |
| A04: Insecure Design | Threat modeling, secure defaults |
| A05: Security Misconfiguration | Security headers, minimal permissions |
| A06: Vulnerable Components | Regular dependency updates |
| A07: Auth Failures | Rate limiting, secure sessions |
| A08: Data Integrity | CSRF protection, signed webhooks |
| A09: Logging Failures | Sentry error tracking |
| A10: SSRF | URL allowlists, no user-controlled URLs |

## Security Checklist for Deployment

- [ ] Set `NEXTAUTH_SECRET` to a strong random string
- [ ] Enable HTTPS on custom domain
- [ ] Configure CORS for API endpoints
- [ ] Set up CSP reporting endpoint
- [ ] Enable Stripe webhook signature verification
- [ ] Configure rate limiting with Redis
- [ ] Set up security monitoring alerts
- [ ] Review and rotate API keys regularly
- [ ] Enable 2FA for admin accounts
- [ ] Conduct security audit before launch

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email security@baghub.com.

Do not open a public GitHub issue for security vulnerabilities.

## Security Contacts

- **Security Team**: security@baghub.com
- **Bug Bounty**: Not currently available

## Compliance

- **GDPR**: Cookie consent, data export, right to deletion
- **PCI DSS**: SAQ-A compliant via Stripe Checkout
- **CCPA**: Privacy policy, opt-out mechanisms