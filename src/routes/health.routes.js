import { Router } from 'express';
import { getDBStatus } from '../config/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/health', (req, res) => {
  const db = getDBStatus();
  const memoryUsage = process.memoryUsage();

  const healthData = {
    service: 'VerveMarket E-Commerce Marketplace API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    status: db.status === 'connected' ? 'healthy' : 'degraded',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: db,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
    },
  };

  return ApiResponse.send(res, 200, 'Health check passed', healthData);
});

export default router;
