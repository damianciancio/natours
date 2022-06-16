const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please login again', 401);

const handleJWTExpiredError = () =>
  new AppError(
    `Your token has expired, please log in again`,
    401
  );

const handleDuplicatedFieldsErrorDB = (err) => {
  const value = err.errmsg.match(
    /(["'])(?:(?=(\\?))\2.)*?\1/
  )[0];
  const message = `Duplicate field value ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((er) => er.message)
    .join('. ');

  const message = `Invalid input data. ${errors}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Don't leak data for client.

    console.error(err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';
  error.message = err.message;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (error.name === 'CastError')
      error = handleCastErrorDB(error);
    if (error.code === 11000)
      error = handleDuplicatedFieldsErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};
