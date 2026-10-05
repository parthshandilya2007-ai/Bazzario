import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/api/orders.api';
import { useLiveInvalidate } from '@/hooks/useLiveInvalidate';
import { StatusPill } from '@/components/shared/StatusPill';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/formatters';
import {
  Package,
  Truck,
  ChevronRight,
  Download,
  Calendar,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { data: orders, isLoading } = useOrders();
  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'delivered' | 'cancelled'>('all');

  // Real-time Push Updates: Refresh order list on status updates
  useLiveInvalidate(
    'global:catalog',
    ['order:statusChanged', 'catalog:updated'],
    () => [['orders']]
  );

  const filteredOrders = (orders || []).filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in_transit') {
      return ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery'].includes(order.orderStatus);
    }
    if (activeTab === 'delivered') return order.orderStatus === 'delivered';
    if (activeTab === 'cancelled') return ['cancelled', 'returned', 'refunded'].includes(order.orderStatus);
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'My Account', path: '/account/profile' }, { label: 'My Orders' }]} />

      {/* Header & Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              My Orders
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Track packages, download invoices, and manage 7-day returns
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'in_transit', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled & Returns' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-pill text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-surface shadow-xs'
                  : 'bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-background'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-surface rounded-card border border-border space-y-4 animate-pulse">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description="You don't have any orders under this category. Start browsing our trending styles!"
          actionText="Browse Trending Products"
          actionLink="/"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const firstItem = order.items[0];
            const isDelivered = order.orderStatus === 'delivered';

            return (
              <div
                key={order._id}
                className="bg-surface rounded-card border border-border shadow-card overflow-hidden transition-all hover:border-accent/40"
              >
                {/* Order Card Top Bar */}
                <div className="p-4 bg-background border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Order Placed</span>
                      <p className="font-extrabold text-text-primary mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Order #</span>
                      <p className="font-extrabold text-primary mt-0.5">{order.orderNumber}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Total</span>
                      <p className="font-extrabold text-accent mt-0.5">{formatPrice(order.pricing.grandTotal)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusPill status={order.orderStatus} />
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-0.5"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Items & Delivery Status */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={firstItem.imageSnapshot}
                        alt={firstItem.titleSnapshot}
                        className="w-16 h-20 sm:w-20 sm:h-24 rounded-input object-cover bg-background border border-border shrink-0"
                      />
                      <div className="space-y-1">
                        <Link
                          to={`/orders/${order._id}`}
                          className="text-sm font-extrabold text-text-primary line-clamp-1 hover:text-primary transition-colors"
                        >
                          {firstItem.titleSnapshot}
                        </Link>
                        <p className="text-xs text-text-muted">
                          Qty: <strong className="text-text-primary">{firstItem.qty}</strong>
                          {firstItem.sizeSnapshot && ` • Size: ${firstItem.sizeSnapshot}`}
                          {firstItem.colourSnapshot && ` • Colour: ${firstItem.colourSnapshot}`}
                        </p>
                        <p className="text-xs font-extrabold text-text-primary pt-0.5">
                          {formatPrice(firstItem.priceSnapshot * firstItem.qty)}
                        </p>
                      </div>
                    </div>

                    {/* Delivery ETA / Delivered Date info */}
                    <div className="sm:text-right space-y-1">
                      <p className="text-xs font-bold text-text-primary flex sm:justify-end items-center gap-1.5">
                        <Truck className="h-4 w-4 text-accent" />
                        {isDelivered ? 'Delivered on 19 Sep 2026' : `Expected by: ${order.deliveryEstimate || 'In 3-4 days'}`}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {isDelivered
                          ? 'Return window open until 26 Sep 2026'
                          : 'Package in transit via BlueDart'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Actions Bar */}
                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-text-muted text-[11px]">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>
                        Paid via {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online UPI'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/orders/${order._id}`}
                        className="px-3 py-1.5 rounded-input border border-primary text-primary hover:bg-primary hover:text-surface text-xs font-bold transition-colors"
                      >
                        Track Status
                      </Link>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading Invoice for ${order.orderNumber}...`)}
                        className="px-3 py-1.5 rounded-input border border-border bg-surface hover:bg-background text-text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
