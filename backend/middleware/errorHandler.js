const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.path} — ${err.message}`);

  const statusCode = err.statusCode || 500;
  const code = err.code || "SERVER_ERROR";

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    code,
  });
};

module.exports = errorHandler;
