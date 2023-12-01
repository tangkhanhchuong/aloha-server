const { StatusCodes } = require("http-status-codes");

const { logger } = require("../core/logger/logger");

const errorHandler = (err, req, res, next) => {
  if (!err.status) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  logger.error({
    msg: err.message,
    status: err.status,
  });
  return res.status(err.status).json({ msg: err.message });
};

const notFoundHandler = (req, res, next) => {
  const err = new Error("Not found");
  err.status = StatusCodes.NOT_FOUND;
  throw err;
};

module.exports = { errorHandler, notFoundHandler };
