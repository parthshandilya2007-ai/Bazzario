import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useApplyCoupon,
  useRemoveCoupon,
} from '@/api/cart.api';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  Trash2,
  Heart,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const updateQtyMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const freeThreshold = cart?.freeDeliveryThreshold || 499;
  const neededForFree = Math.max(0, freeThreshold - subtotal);
  const freeProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim();
    if (!code) return;
    setCouponError(null);
    applyCouponMutation.mutate(code, {
      onError: (err: any) => {
        setCouponError(err.message || 'Invalid coupon code');
      },
      onSuccess: () => {
        setCouponInput('');
        setCouponError(null);
      },
    });
  };

  const handleRemoveCoupon = () => {
    removeCouponMutation.mutate();
    setCouponError(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-8 animate-pulse">
        <div className="h-8 w-48 bg-border rounded-input" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-surface rounded-card border border-border" />
            ))}
          </div>
          <div className="lg:col-span-4 h-64 bg-surface rounded-card border border-border" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any items to your cart yet. Explore thousands of trending products at factory-direct prices!"
          actionText="Start Shopping"
          actionLink="/search"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Count */}
      <div className="flex items-baseline justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link
          to="/search"
          className="text-xs font-bold text-accent hover:text-accent-hover transition-colors hidden sm:block"
        >
          + Add more items
        </Link>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 rounded-card bg-surface border border-border shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-accent" />
            {neededForFree === 0 ? (
              <span className="text-success font-extrabold">
                🎉 Congratulations! You have unlocked FREE Delivery!
              </span>
            ) : (
              <span>
                Add items worth <strong className="text-accent">{formatPrice(neededForFree)}</strong> more
                to qualify for <strong className="text-success">FREE Delivery</strong>
              </span>
            )}
          </div>
          <span className="text-xs text-text-muted font-bold">{freeProgress}%</span>
        </div>
        <div className="w-full h-2 rounded-pill bg-background overflow-hidden border border-border">
          <div
            className="h-full bg-accent rounded-pill transition-all duration-300"
            style={{ width: `${freeProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Line Items (Left 8 Cols) & Summary Box (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Line Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const prod = item.product;
            const imgUrl = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80';
            const unitPrice = item.priceSnapshot || prod.finalPrice;

            return (
              <div
                key={item._id}
                className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card flex flex-col sm:flex-row gap-4 transition-all hover:border-accent/40"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${prod.slug}`}
                  className="w-24 sm:w-28 aspect-[4/5] rounded-input overflow-hidden bg-background shrink-0 border border-border self-center sm:self-start"
                >
                  <img src={imgUrl} alt={prod.title} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                          {prod.brand || 'Bazaario Select'}
                        </span>
                        <Link
                          to={`/product/${prod.slug}`}
                          className="text-sm font-extrabold text-text-primary line-clamp-2 hover:text-primary transition-colors mt-0.5"
                        >
                          {prod.title}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItemMutation.mutate(item._id)}
                        className="text-text-muted hover:text-danger p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                      <span>Size: <strong className="text-text-primary">{item.variant?.size || 'Free Size'}</strong></span>
                      <span>•</span>
                      <span>Delivery: <strong className="text-success">In 3-4 Days</strong></span>
                      <span>•</span>
                      <span>7-Day Return</span>
                    </div>
                  </div>

                  {/* Price Row & Quantity */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-border/70">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-text-primary">
                        {formatPrice(unitPrice * item.qty)}
                      </span>
                      {prod.basePrice > unitPrice && (
                        <span className="text-xs font-semibold text-text-muted line-through">
                          {formatPrice(prod.basePrice * item.qty)}
                        </span>
                      )}
                      {prod.discountPercent > 0 && (
                        <span className="text-xs font-extrabold text-accent">
                          {prod.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls & Wishlist Action */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-input bg-background shadow-xs">
                        <button
                          type="button"
                          onClick={() =>
                            updateQtyMutation.mutate({ itemId: item._id, qty: item.qty - 1 })
                          }
                          className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface rounded-l-input transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-text-primary select-none">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQtyMutation.mutate({ itemId: item._id, qty: item.qty + 1 })
                          }
                          className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface rounded-r-input transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItemMutation.mutate(item._id)}
                        className="text-xs font-semibold text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Save for Later</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Sticky Order Summary & Coupon Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          {/* Coupon Box */}
          <div className="p-5 rounded-card bg-surface border border-border shadow-card space-y-3">
            <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
              <Tag className="h-4 w-4 text-accent" />
              <span>Apply Discount Coupon</span>
            </h3>

            {cart?.couponCode ? (
              <div className="p-3 bg-success/10 border border-success/30 rounded-input flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-success">
                      &apos;{cart.couponCode}&apos; Applied!
                    </span>
                    <p className="text-[11px] text-text-muted">
                      You saved {formatPrice(cart.couponDiscount)} on this order.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-danger hover:underline ml-2 shrink-0"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="h-9 text-xs uppercase font-bold"
                  />
                  <Button
                    type="button"
                    variant="accent"
                    size="sm"
                    onClick={() => handleApplyCoupon()}
                    className="font-bold"
                  >
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="text-xs text-danger flex items-center gap-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" /> {couponError}
                  </p>
                )}

                {/* Available Quick Coupon Chips */}
                <div className="pt-2">
                  <p className="text-[11px] text-text-muted mb-1.5 font-semibold">Available Offers:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('WELCOME50')}
                      className="text-[11px] px-2.5 py-1 rounded-pill bg-accent/10 border border-accent/30 text-accent font-bold hover:bg-accent hover:text-surface transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" /> WELCOME50 (Flat ₹50 OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('FESTIVE100')}
                      className="text-[11px] px-2.5 py-1 rounded-pill bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary hover:text-surface transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" /> FESTIVE100 (Flat ₹100 OFF)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="p-5 rounded-card bg-surface border border-border shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-primary border-b border-border pb-3">
              Price Details ({items.length} {items.length === 1 ? 'Item' : 'Items'})
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Total Product Price</span>
                <span className="text-text-primary font-bold">{formatPrice(subtotal)}</span>
              </div>

              {cart?.couponDiscount ? (
                <div className="flex justify-between text-success font-bold">
                  <span>Coupon Discount</span>
                  <span>- {formatPrice(cart.couponDiscount)}</span>
                </div>
              ) : null}

              <div className="flex justify-between text-text-muted">
                <span>Estimated Taxes (5% GST)</span>
                <span className="text-text-primary font-bold">{formatPrice(cart?.tax || 0)}</span>
              </div>

              <div className="flex justify-between text-text-muted">
                <span>Shipping & Handling</span>
                <span
                  className={
                    cart?.shippingFee === 0 ? 'text-success font-bold' : 'text-text-primary font-bold'
                  }
                >
                  {cart?.shippingFee === 0 ? 'FREE' : formatPrice(cart?.shippingFee || 49)}
                </span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline text-sm font-extrabold text-primary">
                <span>Grand Total</span>
                <span className="text-xl text-accent font-extrabold">
                  {formatPrice(cart?.grandTotal || subtotal)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <Button
              type="button"
              variant="accent"
              size="lg"
              onClick={() => navigate('/checkout')}
              className="w-full font-bold shadow-md gap-2 mt-2"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Safety Guarantee */}
            <div className="pt-2 border-t border-border space-y-2 text-[11px] text-text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                <span>Safe and Secure Payments • 256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-accent shrink-0" />
                <span>7 Days Hassle-Free Doorstep Return Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
