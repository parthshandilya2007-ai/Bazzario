import React from 'react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAddToCart } from '@/api/cart.api';
import { ProductCard } from '@/components/shared/ProductCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { items: wishlistItems, removeItem } = useWishlistStore();
  const addToCartMutation = useAddToCart();

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const handleAddToCart = (product: any) => {
    addToCartMutation.mutate({ product, qty: 1 });
    removeItem(product._id);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-extrabold text-primary flex items-center gap-2">
          <Heart className="h-5 w-5 text-accent" />
          <span>My Saved Wishlist</span>
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save styles you love by tapping the heart icon on any product card."
          actionText="Discover Trending Items"
          actionLink="/"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {wishlistItems.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              isWishlisted={true}
              onWishlist={() => handleRemove(prod._id)}
              onAddToCart={() => handleAddToCart(prod)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
