import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDB, disconnectDB } from './config/db.js';
import { initSocket } from './config/socket.js';

let server;

const startServer = async () => {
  try {
    // Connect to MongoDB
    try {
      await connectDB();
    } catch (dbErr) {
      logger.warn(`Database connection deferred or failed: ${dbErr.message}`);
    }

    const httpServer = http.createServer(app);
    initSocket(httpServer);

    server = httpServer.listen(env.PORT, () => {
      logger.info(`🚀 VerveMarket Server running in [${env.NODE_ENV}] mode on port: ${env.PORT}`);
      logger.info(`👉 Healthcheck endpoint: http://localhost:${env.PORT}/api/v1/health`);
      logger.info(`⚡ Socket.io enabled on port: ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

const handleShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      logger.info('Process terminated cleanly.');
      process.exit(0);
    });

    // Force close if graceful shutdown takes longer than 10s
    setTimeout(() => {
      logger.error('Graceful shutdown timed out, force terminating.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

startServer();

export default server;
