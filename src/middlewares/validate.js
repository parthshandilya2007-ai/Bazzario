import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware factory for validating Express requests against a Zod schema.
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} [source='body']
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      const fieldErrors = error.errors
        ? error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        : [];
      next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', fieldErrors));
    }
  };
};
