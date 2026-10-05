/**
 * Custom MongoDB Sanitizer middleware compatible with Express 5.
 * Strips keys starting with '$' or containing '.' to prevent NoSQL query injection attacks.
 */
const sanitizeObject = (target) => {
  if (!target || typeof target !== 'object') {
    return target;
  }

  if (Array.isArray(target)) {
    return target.map((item) => sanitizeObject(item));
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(target)) {
    // Strip forbidden MongoDB operator characters
    const sanitizedKey = key.replace(/^\$|\./g, '_');
    cleaned[sanitizedKey] = sanitizeObject(value);
  }
  return cleaned;
};

export const mongoSanitizeMiddleware = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  // In Express 5, req.query is a getter over the parsed query object. We mutate properties in-place.
  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (key.startsWith('$') || key.includes('.')) {
        const sanitizedKey = key.replace(/^\$|\./g, '_');
        req.query[sanitizedKey] = sanitizeObject(req.query[key]);
        delete req.query[key];
      } else {
        req.query[key] = sanitizeObject(req.query[key]);
      }
    }
  }

  next();
};
