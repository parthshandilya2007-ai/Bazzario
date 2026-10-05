import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '@/api/orders.api';
import { useLiveInvalidate } from '@/hooks/useLiveInvalidate';
import { Stepper } from '@/components/shared/Stepper';
import { StatusPill } from '@/components/shared/StatusPill';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/formatters';
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  Download,
  RotateCcw,
  CheckCircle2,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id || '');

  // Real-time Push Updates: Subscribe to specific order tracking room
  useLiveInvalidate(
    id ? `order:${id}` : null,
    'order:statusChanged',
    () => [['order', id], ['orders']],
    {
      toastMessage: (payload) => {
        const newStatus = payload?.status ? String(payload.status).toUpperCase() : 'UPDATED';
        return {
          title: 'Order Status Updated',
          description: `Order is now marked as ${newStatus}.`,
        };
      },
    }
  );

  useLiveInvalidate(
    order?.orderNumber && order.orderNumber !== id ? `order:${order.orderNumber}` : null,
    'order:statusChanged',
    () => [['order', id], ['orders']],
    {
      toastMessage: (payload) => {
        const newStatus = payload?.status ? String(payload.status).toUpperCase() : 'UPDATED';
        return {
          title: 'Order Status Updated',
          description: `Order #${payload?.orderNumber || order?.orderNumber || id} is now ${newStatus}.`,
        };
      },
    }
  );

  const currentStepIndex = React.useMemo(() => {
    switch (order?.orderStatus) {
      case 'placed':
        return 0;
      case 'confirmed':
      case 'packed':
        return 1;
      case 'shipped':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  }, [order?.orderStatus]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 animate-pulse">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full rounded-card" />
        <Skeleton className="h-60 w-full rounded-card" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-primary">Order Not Found</h2>
        <Button asChild variant="accent">
          <Link to="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const timelineSteps = [
    {
      id: 1,
      label: 'Order Placed',
      timestamp: '15 Sep 2026, 10:00 AM',
      description: 'Order confirmed with seller Vandana Creations Surat',
    },
    {
      id: 2,
      label: 'Order Packed',
      timestamp: '16 Sep 2026, 09:00 AM',
      description: 'Quality checked and packed at Surat Logistics Hub',
    },
    {
      id: 3,
      label: 'Shipped & In Transit',
      timestamp: '17 Sep 2026, 02:00 PM',
      description: 'Dispatched via BlueDart Express (AWB: BL83920194)',
    },
    {
      id: 4,
      label: 'Out for Delivery',
      timestamp: '19 Sep 2026, 08:30 AM',
      description: 'Delivery Agent: Ramesh Kumar (+91 98765 43210)',
    },
    {
      id: 5,
      label: 'Delivered',
      timestamp: '19 Sep 2026, 04:45 PM',
      description: 'Package handed over at doorstep with OTP verification',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <Breadcrumb
        items={[
          { label: 'My Orders', path: '/orders' },
          { label: `Order ${order.orderNumber}` },
        ]}
      />

      {/* Order Top Banner */}
      <div className="bg-surface rounded-card border border-border p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary">
                Order {order.orderNumber}
              </h1>
              <StatusPill status={order.orderStatus} />
            </div>
            <p className="text-xs text-text-muted mt-1">
              Placed on {formatDate(order.createdAt)} • Total Amount: <strong className="text-accent">{formatPrice(order.pricing.grandTotal)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`Downloading Tax Invoice for ${order.orderNumber}...`)}
              className="px-3.5 py-2 rounded-input border border-border bg-background hover:bg-surface text-xs font-bold text-text-primary flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="h-4 w-4 text-accent" />
              <span>Download Invoice</span>
            </button>
            <button
              type="button"
              onClick={() => alert('7-day return request submitted. Our courier partner will schedule a doorstep pickup.')}
              className="px-3.5 py-2 rounded-input border border-accent/40 bg-accent/10 hover:bg-accent hover:text-surface text-xs font-bold text-accent flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Return / Exchange</span>
            </button>
          </div>
        </div>

        {/* Vertical Delivery Timeline */}
        <div className="pt-2">
          <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-4">
            Delivery Status Timeline
          </h3>
          <div className="p-4 bg-background rounded-card border border-border">
            <Stepper steps={timelineSteps} currentStepIndex={currentStepIndex} variant="vertical" />
          </div>
        </div>
      </div>

      {/* Order Items List */}
      <div className="bg-surface rounded-card border border-border p-6 shadow-card space-y-4">
        <h3 className="text-sm font-extrabold text-primary border-b border-border pb-3">
          Ordered Items ({order.items.length})
        </h3>

        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-input bg-background border border-border"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={item.imageSnapshot}
                  alt={item.titleSnapshot}
                  className="w-16 h-20 rounded-input object-cover bg-surface border border-border shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-text-primary line-clamp-1">
                    {item.titleSnapshot}
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    Qty: <strong className="text-text-primary">{item.qty}</strong>
                    {item.sizeSnapshot && ` • Size: ${item.sizeSnapshot}`}
                    {item.colourSnapshot && ` • Colour: ${item.colourSnapshot}`}
                  </p>
                  <p className="text-xs font-extrabold text-text-primary mt-1">
                    {formatPrice(item.priceSnapshot * item.qty)}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <span className="text-[11px] font-bold text-success flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Delivered & Verified
                </span>
                <button
                  type="button"
                  onClick={() => alert('Redirecting to write review modal...')}
                  className="text-xs font-bold text-accent hover:underline"
                >
                  Write Product Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address & Payment Breakdown Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-surface rounded-card border border-border p-5 shadow-card space-y-3">
          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            <span>Delivery Address</span>
          </h3>
          <div className="text-xs text-text-primary space-y-1">
            <p className="font-extrabold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.line1}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-text-muted pt-1 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> +91 {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Payment & Price Summary */}
        <div className="bg-surface rounded-card border border-border p-5 shadow-card space-y-3">
          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-accent" />
            <span>Payment Breakdown</span>
          </h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-text-muted">
              <span>Payment Mode:</span>
              <span className="font-bold text-text-primary">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Items Subtotal:</span>
              <span className="font-bold text-text-primary">{formatPrice(order.pricing.subtotal)}</span>
            </div>
            {order.pricing.couponDiscount ? (
              <div className="flex justify-between text-success font-bold">
                <span>Coupon ({order.pricing.couponCode}):</span>
                <span>- {formatPrice(order.pricing.couponDiscount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-text-muted">
              <span>Shipping Fee:</span>
              <span className="font-bold text-success">FREE</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-baseline font-extrabold text-sm text-primary">
              <span>Total Paid:</span>
              <span className="text-base text-accent">{formatPrice(order.pricing.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
