import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SortOption {
  label: string;
  value: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Popularity', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Newest Arrivals', value: 'newest' },
];

export interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange, className }) => {
  return (
    <div className={cn('relative inline-flex items-center gap-2', className)}>
      <label htmlFor="sort-select" className="text-xs font-semibold text-text-muted flex items-center gap-1">
        <ArrowUpDown className="h-3.5 w-3.5" />
        <span>Sort By:</span>
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 px-3 pr-8 rounded-input border border-border bg-surface text-xs font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
