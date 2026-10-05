import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/formatters';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-260920-83921';
  const amount = Number(searchParams.get('amount')) || 1761;

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-center space-y-6">
      {/* Success Animation / Badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-20 h-20 rounded-pill bg-success/15 text-success flex items-center justify-center shadow-lg">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>
        <div className="absolute -top-1 -right-1 text-accent animate-pulse">
          <Sparkles className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-success uppercase tracking-wider">
          Payment & Order Confirmed
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Thank You for Shopping with Bazaario!
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
          Your order has been placed successfully and has been sent to our verified supplier for dispatch.
        </p>
      </div>

      {/* Order Snapshot Card */}
      <div className="p-6 bg-surface rounded-card border border-border shadow-card text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <span className="text-xs font-bold text-text-muted">Order Number</span>
            <p className="text-sm font-extrabold text-primary mt-0.5">{orderNumber}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-text-muted">Amount Paid</span>
            <p className="text-base font-extrabold text-accent mt-0.5">{formatPrice(amount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <Truck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text-primary">Estimated Delivery</span>
              <p className="text-text-muted mt-0.5">Thursday, 24 Sep 2026</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text-primary">7-Day Easy Return Policy</span>
              <p className="text-text-muted mt-0.5">Doorstep pickup upon delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button asChild variant="accent" size="lg" className="w-full sm:w-auto font-bold shadow-md gap-2">
          <Link to="/orders">
            <Package className="h-4 w-4" /> Track Order Status
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-bold gap-2">
          <Link to="/">
            <ShoppingBag className="h-4 w-4" /> Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
