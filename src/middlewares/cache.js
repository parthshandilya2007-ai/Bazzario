import { cache } from '../services/cache.service.js';

/**
 * Express middleware for caching GET responses
 * @param {string} prefix - e.g. "products:list", "categories:tree"
 * @param {number} ttlSeconds - Cache TTL in seconds (default 300)
 */
export const cacheResponse = (prefix, ttlSeconds = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `${prefix}:${req.originalUrl}`;
    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached);
      }

      res.setHeader('X-Cache', 'MISS');

      // Intercept res.json to populate cache
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful 200 responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(cacheKey, body, ttlSeconds).catch(() => {});
        }
        return originalJson(body);
      };

      next();
    } catch {
      next();
    }
  };
};
