import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { RatingPill } from './RatingPill';
import { DiscountBadge } from './DiscountBadge';
import { formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
  className,
}) => {
  const [wishlistActive, setWishlistActive] = useState(isWishlisted);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistActive(!wishlistActive);
    if (onWishlist) onWishlist(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedAnimation(true);
    if (onAddToCart) onAddToCart(product);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      className={cn(
        'group bg-surface rounded-card border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col',
        className
      )}
    >
      {/* Product Image Container with Top-Left Badge & Top-Right Wishlist Heart */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-background">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-Left: Coral Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <DiscountBadge percent={product.discountPercent} size="default" />
          </div>
        )}

        {/* Top-Right: Wishlist Heart Overlay */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={wishlistActive ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-pill bg-surface/90 backdrop-blur-xs flex items-center justify-center text-text-primary hover:text-accent shadow-sm transition-transform active:scale-90"
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              wishlistActive ? 'fill-accent text-accent' : 'text-text-primary hover:text-accent'
            )}
          />
        </button>
      </Link>

      {/* Product Information Body */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Brand Name (muted, small) */}
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider line-clamp-1">
          {product.brand || 'Bazaario Select'}
        </p>

        {/* Product Title (2-line clamp) */}
        <Link
          to={`/product/${product.slug}`}
          className="mt-0.5 text-xs sm:text-sm font-semibold text-text-primary line-clamp-2 hover:text-primary transition-colors min-h-[36px]"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Rating Pill Row */}
        <div className="mt-2 flex items-center">
          <RatingPill rating={product.ratingAvg} count={product.ratingCount} size="sm" />
        </div>

        {/* Price Row: Discounted Bold Black, MRP Line-through */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-extrabold text-text-primary tracking-tight">
            {formatPrice(product.finalPrice)}
          </span>
          {product.basePrice > product.finalPrice && (
            <span className="text-xs font-medium text-text-muted line-through">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>

        {/* Free Delivery Caption in Green */}
        <p className="mt-1 text-[11px] font-bold text-success flex items-center gap-1">
          {product.stock === 0 ? (
            <span className="text-danger font-extrabold">Out of Stock</span>
          ) : (
            <span>Free Delivery</span>
          )}
        </p>

        {/* Full-width Outlined "Add to Cart" Button */}
        <div className="mt-3 pt-1">
          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={addedAnimation || product.stock === 0}
            className={cn(
              'w-full h-9 rounded-input font-bold text-xs flex items-center justify-center gap-1.5 transition-all border shadow-xs',
              product.stock === 0
                ? 'bg-background text-text-muted border-border cursor-not-allowed opacity-60'
                : addedAnimation
                ? 'bg-success text-surface border-success'
                : 'border-primary text-primary bg-surface hover:bg-primary hover:text-surface active:scale-[0.98]'
            )}
          >
            {product.stock === 0 ? (
              'Out of Stock'
            ) : addedAnimation ? (
              <>
                <Check className="h-4 w-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
