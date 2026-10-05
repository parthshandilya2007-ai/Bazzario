import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1.5 py-6', className)}
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-9 h-9 rounded-input border border-border bg-surface hover:bg-background text-text-primary flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {startPage > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-input border border-border bg-surface hover:bg-background text-xs font-semibold text-text-primary flex items-center justify-center"
          >
            1
          </button>
          {startPage > 2 && <span className="px-1 text-text-muted">...</span>}
        </>
      )}

      {pages.map((p) => {
        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              'w-9 h-9 rounded-input text-xs font-bold flex items-center justify-center transition-colors',
              isCurrent
                ? 'bg-primary text-surface shadow-xs'
                : 'border border-border bg-surface hover:bg-background text-text-primary'
            )}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-1 text-text-muted">...</span>}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-input border border-border bg-surface hover:bg-background text-xs font-semibold text-text-primary flex items-center justify-center"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-9 h-9 rounded-input border border-border bg-surface hover:bg-background text-text-primary flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};
