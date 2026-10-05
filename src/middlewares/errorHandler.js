import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/**
 * Global centralized error handling middleware
 */
export const errorHandler = (err, req, res, _next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let errorCode = 'INTERNAL_ERROR';
    const errors = [];

    // Mongoose Bad ObjectId (CastError)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid format for field '${error.path}': '${error.value}'`;
      errorCode = 'INVALID_ID';
    }

    // Mongoose Schema Validation Error
    else if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
      errorCode = 'VALIDATION_ERROR';
      if (error.errors) {
        Object.keys(error.errors).forEach((key) => {
          errors.push({
            field: key,
            message: error.errors[key].message,
          });
        });
      }
    }

    // Mongoose Duplicate Key Error (E11000)
    else if (error.code === 11000) {
      statusCode = 409;
      errorCode = 'DUPLICATE_KEY';
      const duplicateFields = Object.keys(error.keyValue || {}).join(', ');
      message = `Duplicate value entered for unique field: ${duplicateFields}`;
    }

    // JWT Token Errors
    else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token';
      errorCode = 'INVALID_TOKEN';
    } else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Authentication token has expired';
      errorCode = 'TOKEN_EXPIRED';
    }

    // Zod Schema Validation Error
    else if (error.name === 'ZodError') {
      statusCode = 400;
      message = 'Request validation failed';
      errorCode = 'VALIDATION_ERROR';
      if (Array.isArray(error.errors)) {
        error.errors.forEach((e) => {
          errors.push({
            field: e.path.join('.'),
            message: e.message,
          });
        });
      }
    }

    error = new ApiError(statusCode, message, errorCode, errors, error.stack);
  }

  // Log non-operational (500) errors with stack traces
  if (error.statusCode >= 500) {
    logger.error(`[500 Server Error] ${req.method} ${req.originalUrl}: ${error.message}`, {
      stack: error.stack,
    });
  } else {
    logger.warn(`[${error.statusCode} ${error.errorCode}] ${req.method} ${req.originalUrl}: ${error.message}`);
  }

  const responsePayload = {
    success: false,
    message: error.message,
    errorCode: error.errorCode || 'INTERNAL_ERROR',
    errors: error.errors && error.errors.length > 0 ? error.errors : undefined,
    data: null,
  };

  // Only include stack trace in local development environment
  if (env.NODE_ENV === 'development') {
    responsePayload.stack = error.stack;
  }

  return res.status(error.statusCode).json(responsePayload);
};
