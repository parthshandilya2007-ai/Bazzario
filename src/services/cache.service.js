import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

class InMemoryStore {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlSeconds = 300) {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  del(key) {
    return this.store.delete(key);
  }

  invalidate(pattern) {
    // Convert glob wildcard pattern (e.g. "products:*") to RegExp
    const regexPattern = new RegExp(
      '^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'
    );

    let count = 0;
    for (const key of this.store.keys()) {
      if (regexPattern.test(key)) {
        this.store.delete(key);
        count++;
      }
    }
    logger.info(`[Cache] Memory invalidated ${count} key(s) matching pattern: "${pattern}"`);
    return count;
  }

  flushAll() {
    this.store.clear();
  }
}

class CacheService {
  constructor() {
    this.memoryStore = new InMemoryStore();
    this.redisClient = null;
    this.isRedisConnected = false;

    if (env.USE_REDIS) {
      this.initRedis();
    }
  }

  async initRedis() {
    try {
      const { createClient } = await import('redis');
      this.redisClient = createClient({ url: env.REDIS_URL });

      this.redisClient.on('error', (err) => {
        logger.warn(`[Cache] Redis error, falling back to memory store: ${err.message}`);
        this.isRedisConnected = false;
      });

      this.redisClient.on('connect', () => {
        logger.info('[Cache] Connected to Redis instance');
        this.isRedisConnected = true;
      });

      await this.redisClient.connect();
    } catch (err) {
      logger.warn(`[Cache] Redis unavailable, using robust in-memory cache: ${err.message}`);
      this.isRedisConnected = false;
    }
  }

  async get(key) {
    try {
      if (this.isRedisConnected && this.redisClient) {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
      }
      return this.memoryStore.get(key);
    } catch (err) {
      logger.error(`[Cache] get error on key ${key}: ${err.message}`);
      return this.memoryStore.get(key);
    }
  }

  async set(key, value, ttlSeconds = 300) {
    try {
      if (this.isRedisConnected && this.redisClient) {
        await this.redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
        return;
      }
      this.memoryStore.set(key, value, ttlSeconds);
    } catch (err) {
      logger.error(`[Cache] set error on key ${key}: ${err.message}`);
      this.memoryStore.set(key, value, ttlSeconds);
    }
  }

  async del(key) {
    try {
      if (this.isRedisConnected && this.redisClient) {
        await this.redisClient.del(key);
      }
      this.memoryStore.del(key);
    } catch (err) {
      logger.error(`[Cache] del error on key ${key}: ${err.message}`);
      this.memoryStore.del(key);
    }
  }

  /**
   * Wildcard cache invalidation helper
   * Examples:
   *   await cache.invalidate('products:*');
   *   await cache.invalidate('categories:*');
   *   await cache.invalidate('orders:*');
   */
  async invalidate(pattern) {
    try {
      if (this.isRedisConnected && this.redisClient) {
        // Use SCAN to avoid blocking Redis on large keysets
        const keys = [];
        let cursor = 0;
        do {
          const reply = await this.redisClient.scan(cursor, { MATCH: pattern, COUNT: 100 });
          cursor = reply.cursor;
          keys.push(...reply.keys);
        } while (cursor !== 0);

        if (keys.length > 0) {
          await this.redisClient.del(keys);
          logger.info(`[Cache] Redis invalidated ${keys.length} key(s) matching pattern: "${pattern}"`);
        }
      }
      // Invalidate memory store as well
      this.memoryStore.invalidate(pattern);
    } catch (err) {
      logger.error(`[Cache] Invalidation error for pattern "${pattern}": ${err.message}`);
      this.memoryStore.invalidate(pattern);
    }
  }
}

export const cache = new CacheService();
