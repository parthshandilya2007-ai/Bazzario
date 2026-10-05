import React from 'react';
import { cn } from '@/lib/utils';

export interface DiscountBadgeProps {
  percent: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  percent,
  size = 'default',
  className,
}) => {
  if (!percent || percent <= 0) return null;

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 font-bold',
    default: 'text-[11px] px-2 py-0.5 font-extrabold',
    lg: 'text-xs px-3 py-1 font-extrabold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-pill bg-accent text-surface uppercase tracking-wider shadow-sm select-none',
        sizeClasses[size],
        className
      )}
    >
      {percent}% OFF
    </span>
  );
};
