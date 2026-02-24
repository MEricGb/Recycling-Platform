// Custom error class for API errors
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handling middleware
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;

  console.log(`[${statusCode}] ${req.method} ${req.path}: ${err.message}`);

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Eroare server' : err.message
  });
}

// Async handler wrapper to catch errors automatically
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { ApiError, errorHandler, asyncHandler };
