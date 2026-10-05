import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-input bg-accent flex items-center justify-center font-extrabold text-2xl text-surface shadow-sm">
            B
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-primary">Bazaario</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 shadow-card rounded-card border border-border sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
