import { Server } from 'socket.io';
import { env } from './env.js';
import { logger } from './logger.js';

let io = null;

/**
 * Initializes Socket.io on top of the shared Node HTTP server instance
 * @param {import('http').Server} httpServer
 */
export const initSocket = (httpServer) => {
  const allowedOrigins =
    env.CORS_ORIGIN === '*'
      ? '*'
      : env.CORS_ORIGIN.split(',').map((o) => o.trim());

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  // NOTE FOR HORIZONTAL MULTI-INSTANCE SCALING:
  // If scaling to multiple backend instances across nodes or containers, attach
  // the Redis adapter to broadcast events across all nodes:
  //   import { createAdapter } from '@socket.io/redis-adapter';
  //   const pubClient = redisClient.duplicate();
  //   const subClient = redisClient.duplicate();
  //   io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    logger.info(`[Socket.io] Client connected: ${socket.id}`);

    // Join room for targeted notifications
    // e.g. "product:prod-1", "category:women-ethnic", "order:ord-1", "global:catalog"
    socket.on('join', (room) => {
      if (room && typeof room === 'string') {
        socket.join(room);
        logger.info(`[Socket.io] ${socket.id} joined room: "${room}"`);
      }
    });

    // Leave room on navigation away
    socket.on('leave', (room) => {
      if (room && typeof room === 'string') {
        socket.leave(room);
        logger.info(`[Socket.io] ${socket.id} left room: "${room}"`);
      }
    });

    // Client broadcast relay (allows mutations to broadcast to all clients in rooms)
    socket.on('broadcast:mutate', ({ room, event, data }) => {
      if (room && event) {
        logger.info(`[Socket.io] Relaying event "${event}" to room "${room}"`);
        socket.to(room).emit(event, data);
      }
    });

    socket.on('disconnect', (reason) => {
      logger.info(`[Socket.io] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

/**
 * Get active Socket.io instance
 * @returns {import('socket.io').Server | null}
 */
export const getIO = () => {
  return io;
};

/**
 * Emit lightweight "go refetch" event to a specific room or globally
 * @param {string} room - e.g. "product:prod-1", "category:women-ethnic", "order:ord-1", "global:catalog"
 * @param {string} event - e.g. "product:updated", "product:deleted", "category:updated", "catalog:updated", "order:statusChanged"
 * @param {object} payload - lightweight metadata
 */
export const emitEvent = (room, event, payload = {}) => {
  if (!io) {
    logger.warn('[Socket.io] Cannot emit, Socket.io is not yet initialized');
    return;
  }

  if (room) {
    io.to(room).emit(event, payload);
    logger.info(`[Socket.io] Emitted "${event}" to room "${room}" with payload:`, payload);
  } else {
    io.emit(event, payload);
    logger.info(`[Socket.io] Emitted global "${event}" with payload:`, payload);
  }
};
