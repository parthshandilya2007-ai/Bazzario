import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import { mongoSanitizeMiddleware } from './middlewares/mongoSanitize.js';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ApiError } from './utils/ApiError.js';

// Route Imports
import healthRouter from './routes/health.routes.js';

const app = express();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Set to false to support Swagger docs if needed
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Requested-With'],
  })
);

// Request body parsers (10MB body limit)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection & HTTP Parameter Pollution
app.use(mongoSanitizeMiddleware);
app.use(hpp());

// HTTP Request Logger
const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Base API v1 Routes
app.use('/api/v1', healthRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'VerveMarket E-Commerce Marketplace API',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/api/v1/health',
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  next(new ApiError(404, `Resource not found: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
});

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
