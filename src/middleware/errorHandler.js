const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Prisma errors
  if (err.code === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
