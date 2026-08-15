import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Configuration
 * Separated from server.js to avoid circular imports with route files.
 */

// Global rate limiter — 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for report submissions (spam prevention)
export const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Report submission limit reached. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for login attempts (brute-force prevention)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
