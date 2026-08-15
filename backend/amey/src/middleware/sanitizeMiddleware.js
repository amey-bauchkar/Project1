/**
 * Input Sanitization Middleware
 * Strips dangerous characters from user input to prevent XSS and injection attacks.
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body.description) {
    req.body.description = req.body.description
      .replace(/<[^>]*>/g, '')     // Strip HTML tags
      .replace(/[<>'"]/g, '')       // Strip dangerous characters
      .trim()
      .slice(0, 1000);             // Max 1000 characters
  }
  next();
};
