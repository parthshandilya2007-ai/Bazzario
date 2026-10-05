import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/api/cart.api';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/button';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { data: cart } = useCart();
  const updateQtyMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();

  if (!isCartDrawerOpen) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const freeThreshold = cart?.freeDeliveryThreshold || 499;
  const neededForFree = Math.max(0, freeThreshold - subtotal);
  const freeProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/60 backdrop-blur-xs transition-opacity"
        onClick={closeCartDrawer}
      />

      {/* Slide-over Content Container */}
      <aside className="relative w-full max-w-md bg-surface h-full shadow-2xl z-10 flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-background/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent" />
            <h3 className="font-extrabold text-base text-primary">Your Shopping Cart</h3>
            <span className="text-xs font-bold text-text-muted bg-surface px-2 py-0.5 rounded-pill border border-border">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            className="p-1.5 rounded-pill hover:bg-background text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="px-4 sm:px-5 py-3 bg-primary/5 border-b border-border">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <div className="flex items-center gap-1.5 text-text-primary">
              <Truck className="h-4 w-4 text-accent" />
              {neededForFree === 0 ? (
                <span className="text-success font-extrabold">🎉 You unlocked FREE Delivery!</span>
              ) : (
                <span>
                  Add <strong className="text-accent">{formatPrice(neededForFree)}</strong> more for{' '}
                  <strong className="text-success">FREE Delivery</strong>
                </span>
              )}
            </div>
            <span className="text-[11px] text-text-muted">{freeProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-pill bg-border overflow-hidden">
            <div
              className="h-full bg-accent rounded-pill transition-all duration-300"
              style={{ width: `${freeProgress}%` }}
            />
          </div>
        </div>

        {/* Line Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-pill bg-background border border-border flex items-center justify-center text-accent">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-extrabold text-primary">Your cart is empty</h4>
              <p className="text-xs text-text-muted max-w-xs">
                Browse our trending styles and super-saver factory deals today!
              </p>
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  closeCartDrawer();
                  navigate('/search');
                }}
                className="mt-2 font-bold"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const prod = item.product;
              const imgUrl = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80';

              return (
                <div
                  key={item._id}
                  className="flex gap-3.5 p-3 rounded-card bg-surface border border-border shadow-xs hover:border-accent/40 transition-colors"
                >
                  <Link
                    to={`/product/${prod.slug}`}
                    onClick={closeCartDrawer}
                    className="w-18 h-22 rounded-input overflow-hidden bg-background shrink-0 border border-border"
                  >
                    <img src={imgUrl} alt={prod.title} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${prod.slug}`}
                          onClick={closeCartDrawer}
                          className="text-xs font-bold text-text-primary line-clamp-2 hover:text-primary transition-colors"
                        >
                          {prod.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItemMutation.mutate(item._id)}
                          className="text-text-muted hover:text-danger p-1 shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-text-muted font-medium mt-0.5">
                        {prod.brand || 'Bazaario Select'} {item.variant?.size ? `• Size: ${item.variant.size}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/50">
                      {/* Price */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold text-text-primary">
                          {formatPrice(item.priceSnapshot || prod.finalPrice)}
                        </span>
                        {prod.basePrice > (item.priceSnapshot || prod.finalPrice) && (
                          <span className="text-[10px] text-text-muted line-through font-normal">
                            {formatPrice(prod.basePrice)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-input bg-background">
                        <button
                          type="button"
                          onClick={() =>
                            updateQtyMutation.mutate({ itemId: item._id, qty: item.qty - 1 })
                          }
                          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface rounded-l-input transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-text-primary select-none">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQtyMutation.mutate({ itemId: item._id, qty: item.qty + 1 })
                          }
                          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface rounded-r-input transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Subtotal & Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border bg-background/50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-text-muted font-medium">
                <span>Subtotal</span>
                <span className="text-text-primary font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-muted font-medium">
                <span>Shipping Fee</span>
                <span className={cart?.shippingFee === 0 ? 'text-success font-bold' : 'text-text-primary font-bold'}>
                  {cart?.shippingFee === 0 ? 'FREE' : formatPrice(cart?.shippingFee || 49)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-primary pt-2 border-t border-border">
                <span>Total Amount</span>
                <span className="text-base text-accent">{formatPrice(cart?.grandTotal || subtotal)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                variant="accent"
                size="lg"
                onClick={handleCheckout}
                className="w-full font-bold shadow-md gap-2"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={handleViewCart}
                className="w-full font-bold text-xs"
              >
                View Detailed Cart
              </Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
