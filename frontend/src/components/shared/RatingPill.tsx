import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingPillProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const RatingPill: React.FC<RatingPillProps> = ({
  rating,
  count,
  size = 'default',
  className,
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    default: 'text-xs px-2 py-0.5 gap-1',
    lg: 'text-sm px-3 py-1 gap-1.5',
  };

  const starSizes = {
    sm: 'h-2.5 w-2.5',
    default: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-pill bg-success text-surface font-bold tracking-tight shadow-xs',
        sizeClasses[size],
        className
      )}
    >
      <span>{rating.toFixed(1)}</span>
      <Star className={cn('fill-surface text-surface shrink-0', starSizes[size])} />
      {count !== undefined && (
        <span className="text-surface/85 font-normal ml-0.5">
          ({count.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};
