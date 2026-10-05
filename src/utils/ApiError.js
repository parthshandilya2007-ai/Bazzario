/**
 * Standardized Custom API Error class.
 * Ensures all operational errors have a consistent structure and machine-readable code.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP Status Code (e.g. 400, 401, 403, 404, 409, 422, 500)
   * @param {string} message - Human-readable error description
   * @param {string} [errorCode="INTERNAL_ERROR"] - Machine-readable error code for frontend logic
   * @param {Array<any>} [errors=[]] - Field-level validation errors or sub-errors
   * @param {string} [stack=""] - Optional custom stack trace
   */
  constructor(
    statusCode,
    message = 'Something went wrong',
    errorCode = 'INTERNAL_ERROR',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.success = false;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
