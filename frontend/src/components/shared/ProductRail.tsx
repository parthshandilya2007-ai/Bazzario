import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

export interface ProductRailProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  seeAllLink?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  className?: string;
}

export const ProductRail: React.FC<ProductRailProps> = ({
  emoji = '🔥',
  title,
  subtitle,
  seeAllLink,
  products,
  onAddToCart,
  onWishlist,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className={cn('py-4', className)}>
      {/* Rail Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{emoji}</span>
            <h2 className="text-lg sm:text-xl font-extrabold text-primary tracking-tight">{title}</h2>
          </div>
          {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Action Arrows (Desktop) */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-pill border border-border bg-surface hover:bg-background flex items-center justify-center text-text-primary shadow-xs transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-pill border border-border bg-surface hover:bg-background flex items-center justify-center text-text-primary shadow-xs transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {seeAllLink && (
            <Link
              to={seeAllLink}
              className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors group ml-2"
            >
              <span>See all</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[200px] sm:w-[220px] lg:w-[240px] shrink-0 snap-start"
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
