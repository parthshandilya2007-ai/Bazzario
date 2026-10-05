import { useEffect, useRef } from 'react';
import { useQueryClient, QueryKey } from '@tanstack/react-query';
import { useSocket } from '@/context/SocketContext';
import { toast } from '@/components/ui/toast';

export interface UseLiveInvalidateOptions<T = any> {
  onEvent?: (payload: T) => void;
  toastMessage?:
    | string
    | { title: string; description?: string }
    | ((payload: T) => string | { title: string; description?: string });
  forceRefetchOnReconnect?: boolean;
}

/**
 * useLiveInvalidate
 *
 * Joins a specific Socket.io room on mount, leaves on unmount.
 * When the specified event(s) arrive, it invalidates the specified React Query keys,
 * triggers an optional subtle non-blocking toast, and calls optional custom callbacks.
 * Also handles reconnection gracefully by refetching on reconnect.
 */
export function useLiveInvalidate<T = any>(
  room: string | null | undefined,
  event: string | string[],
  queryKeys: QueryKey | QueryKey[] | (() => QueryKey | QueryKey[]),
  options: UseLiveInvalidateOptions<T> = {}
) {
  const { socket, joinRoom, leaveRoom } = useSocket();
  const queryClient = useQueryClient();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const queryKeysRef = useRef(queryKeys);
  queryKeysRef.current = queryKeys;

  useEffect(() => {
    if (!room) return;

    // Join room on mount or room change
    joinRoom(room);

    return () => {
      leaveRoom(room);
    };
  }, [room, joinRoom, leaveRoom]);

  useEffect(() => {
    if (!socket) return;

    const events = Array.isArray(event) ? event : [event];

    const invalidateTargetQueries = () => {
      const target = typeof queryKeysRef.current === 'function' ? queryKeysRef.current() : queryKeysRef.current;
      if (Array.isArray(target) && target.length > 0 && Array.isArray(target[0])) {
        (target as QueryKey[]).forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
      } else if (Array.isArray(target) && target.length > 0) {
        queryClient.invalidateQueries({ queryKey: target as QueryKey });
      }
    };

    const handleEvent = (payload: T) => {
      // Invalidate queries so REST remains single source of truth
      invalidateTargetQueries();

      // Show subtle non-blocking toast if configured
      if (optionsRef.current.toastMessage) {
        if (typeof optionsRef.current.toastMessage === 'function') {
          const res = optionsRef.current.toastMessage(payload);
          if (typeof res === 'string') {
            toast.info('Catalog Updated', res);
          } else if (res && typeof res === 'object') {
            toast.info(res.title, res.description);
          }
        } else if (typeof optionsRef.current.toastMessage === 'object') {
          toast.info(optionsRef.current.toastMessage.title, optionsRef.current.toastMessage.description);
        } else {
          toast.info('Live Update', optionsRef.current.toastMessage);
        }
      }

      // Execute custom callback if provided
      if (optionsRef.current.onEvent) {
        optionsRef.current.onEvent(payload);
      }
    };

    // Reconnection handling: refetch once on reconnect to catch missed updates
    const handleReconnect = () => {
      if (optionsRef.current.forceRefetchOnReconnect !== false) {
        invalidateTargetQueries();
      }
    };

    events.forEach((evt) => {
      socket.on(evt, handleEvent);
    });

    socket.on('connect', handleReconnect);

    return () => {
      events.forEach((evt) => {
        socket.off(evt, handleEvent);
      });
      socket.off('connect', handleReconnect);
    };
  }, [socket, event, queryClient]);
}
