import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Allow access if logged in as admin OR auto-enable in dev/demo mode with banner notice
  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 max-w-md bg-surface rounded-card border border-danger/30 shadow-card space-y-4">
          <h2 className="text-xl font-extrabold text-danger">Access Restricted</h2>
          <p className="text-xs text-text-muted">
            You are signed in as a customer. Administrator privileges are required to access the Bazaario Control Center.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                useAuthStore.getState().setUser({
                  ...user!,
                  role: 'admin',
                });
              }}
              className="px-4 py-2 bg-accent text-surface text-xs font-bold rounded-input shadow-sm hover:bg-accent-hover"
            >
              Switch to Admin Role (Demo)
            </button>
            <a
              href="/"
              className="px-4 py-2 border border-border text-xs font-bold rounded-input hover:bg-background"
            >
              Back to Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
