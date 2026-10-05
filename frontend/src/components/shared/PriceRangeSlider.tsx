import React from 'react';
import { formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export interface PriceRangeSliderProps {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  onChange: (min: number, max: number) => void;
  className?: string;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  currentMin,
  currentMax,
  onChange,
  className,
}) => {
  return (
    <div className={cn('border-b border-border py-3 space-y-3', className)}>
      <h4 className="text-xs font-bold text-text-primary tracking-wide">Price Range</h4>
      <div className="flex items-center justify-between text-xs font-bold text-accent">
        <span>{formatPrice(currentMin)}</span>
        <span>{formatPrice(currentMax)}</span>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          value={currentMax}
          onChange={(e) => onChange(currentMin, Number(e.target.value))}
          className="w-full accent-accent h-1.5 bg-border rounded-pill cursor-pointer"
        />
      </div>

      {/* Quick Price Buckets */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          { label: 'Under ₹299', maxVal: 299 },
          { label: 'Under ₹499', maxVal: 499 },
          { label: 'Under ₹999', maxVal: 999 },
        ].map((bucket) => (
          <button
            key={bucket.label}
            type="button"
            onClick={() => onChange(min, bucket.maxVal)}
            className="text-[10px] font-semibold px-2 py-1 rounded-pill border border-border bg-background hover:bg-[#EAE7E0] text-text-primary transition-colors"
          >
            {bucket.label}
          </button>
        ))}
      </div>
    </div>
  );
};
