import React, { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '@/api/orders.api';
import { StatusPill } from '@/components/shared/StatusPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice, formatDate } from '@/lib/formatters';
import { Download, Search, CheckCircle2 } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { data: orders } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredOrders = (orders || []).filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      return o.orderNumber.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleExportCSV = () => {
    alert('Exporting marketplace orders to orders_report.csv...');
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Marketplace Orders</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor fulfillment stages, trigger refunds, and override order statuses
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={handleExportCSV}
          className="font-bold text-xs gap-1.5 shadow-xs"
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filter Row */}
      <div className="bg-surface p-4 rounded-card border border-border shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search by order number (e.g. ORD-260920)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-pill text-xs font-bold capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-surface'
                  : 'bg-background text-text-muted hover:text-text-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[11px] font-bold text-text-muted uppercase bg-background border-b border-border">
                <th className="p-4">Order Details</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Grand Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-background/40 transition-colors">
                  <td className="p-4">
                    <p className="font-extrabold text-primary">{order.orderNumber}</p>
                    <span className="text-[11px] text-text-muted">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-text-primary">{order.shippingAddress.fullName}</p>
                    <span className="text-[11px] text-text-muted">
                      {order.shippingAddress.city}, {order.shippingAddress.pincode}
                    </span>
                  </td>
                  <td className="p-4 uppercase font-bold text-text-muted">
                    {order.paymentMethod} • <span className="text-success">{order.paymentStatus}</span>
                  </td>
                  <td className="p-4 font-extrabold text-accent">
                    {formatPrice(order.pricing.grandTotal)}
                  </td>
                  <td className="p-4">
                    <StatusPill status={order.orderStatus} />
                  </td>
                  <td className="p-4 text-right">
                    <select
                      className="px-2 py-1 bg-background border border-border rounded-input text-xs font-bold cursor-pointer hover:border-accent transition-colors"
                      value={order.orderStatus}
                      disabled={updateStatusMutation.isPending}
                      onChange={(e) =>
                        updateStatusMutation.mutate({
                          orderId: order._id,
                          status: e.target.value as any,
                        })
                      }
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
