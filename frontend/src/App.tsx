import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { Toaster } from '@/components/ui/toast';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { SocketProvider } from '@/context/SocketContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Real-time storefront freshness: query is considered immediately stale so tab focus/mount refetches
      retry: 1,
      refetchOnWindowFocus: true, // Auto-refresh when user tabs back into the store
      refetchOnMount: true,
    },
  },
});

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <RouterProvider router={router} />
          <Toaster />
        </SocketProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

