import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  emitMutation: (room: string, event: string, data?: unknown) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  emitMutation: () => {},
});

// Module-level reference to allow emitting from API mutation onSuccess handlers
let globalSocket: Socket | null = null;

export const emitGlobalSocketMutation = (room: string, event: string, data: unknown = {}) => {
  if (globalSocket && globalSocket.connected) {
    globalSocket.emit('broadcast:mutate', { room, event, data });
  }
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const activeRoomsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Connect to WebSocket server via proxy or explicit URL
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (typeof window !== 'undefined' && window.location.port === '3000'
        ? 'http://localhost:5000'
        : typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:5000');

    const socketInstance: Socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
      auth: (cb) => {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('bazaario_access_token') : null;
        cb({ token: token || '' });
      },
    });

    globalSocket = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      // On connect or reconnect, automatically re-join all currently active rooms
      activeRoomsRef.current.forEach((room) => {
        socketInstance.emit('join', room);
      });
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', () => {
      // Gracefully handle connect error without crashing UI
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
      globalSocket = null;
    };
  }, []);

  const joinRoom = useCallback(
    (room: string) => {
      if (!room) return;
      activeRoomsRef.current.add(room);
      if (socket && isConnected) {
        socket.emit('join', room);
      }
    },
    [socket, isConnected]
  );

  const leaveRoom = useCallback(
    (room: string) => {
      if (!room) return;
      activeRoomsRef.current.delete(room);
      if (socket && isConnected) {
        socket.emit('leave', room);
      }
    },
    [socket, isConnected]
  );

  const emitMutation = useCallback(
    (room: string, event: string, data: unknown = {}) => {
      if (socket && isConnected) {
        socket.emit('broadcast:mutate', { room, event, data });
      }
    },
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinRoom,
        leaveRoom,
        emitMutation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
