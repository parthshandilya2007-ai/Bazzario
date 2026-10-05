import React from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';

export const PageLoader: React.FC<{ message?: string }> = ({
  message = 'Loading Bazaario...',
}) => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer glowing pulsing ring */}
        <div className="absolute h-20 w-20 rounded-full bg-accent/15 animate-ping" />
        <div className="absolute h-16 w-16 rounded-full bg-primary/10 animate-pulse" />

        {/* Center Brand Icon */}
        <div className="relative h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg text-white">
          <ShoppingBag className="h-7 w-7 text-accent" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-primary font-bold text-base tracking-tight">
        <Loader2 className="h-4 w-4 animate-spin text-accent" />
        <span>{message}</span>
      </div>
      <p className="text-xs text-text-muted mt-1 font-medium">Please wait a moment</p>
    </div>
  );
};
