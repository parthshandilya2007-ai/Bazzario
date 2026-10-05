/**
 * Wrapper for Express async route handlers to forward unhandled rejections to the global error middleware.
 * @param {Function} requestHandler
 * @returns {import('express').RequestHandler}
 */
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
