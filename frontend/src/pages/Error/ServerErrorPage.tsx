import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerCrash, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="text-[110px] sm:text-[140px] font-black tracking-tighter text-danger/10 select-none">
            500
          </div>
          <div className="absolute flex flex-col items-center">
            <div className="h-20 w-20 rounded-2xl bg-danger/10 border-2 border-danger/30 flex items-center justify-center text-danger shadow-lg mb-2">
              <ServerCrash className="h-10 w-10 animate-pulse" />
            </div>
            <span className="px-3 py-1 rounded-pill bg-danger text-white text-[11px] font-extrabold uppercase tracking-wider shadow">
              Internal Server Error
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">
            Our servers ran into an issue
          </h1>
          <p className="text-xs text-text-muted leading-relaxed">
            We are already looking into this problem. Please try refreshing the page or head back to the marketplace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border">
          <Button
            variant="accent"
            size="default"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto font-bold text-xs"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto font-bold text-xs"
          >
            <Home className="h-4 w-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ServerErrorPage;
