/**
 * Centralized Not Found (404) handler
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - Endpoint ${req.originalUrl} does not exist.`,
  });
};

/**
 * Centralized Error (500) handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
