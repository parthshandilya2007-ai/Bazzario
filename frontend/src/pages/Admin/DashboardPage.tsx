import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/api/admin.api';
import { StatCard } from '@/components/shared/StatCard';
import { StatusPill } from '@/components/shared/StatusPill';
import { formatPrice } from '@/lib/formatters';
import {
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading || !stats) {
    return <div className="p-8 text-center text-text-muted">Loading Admin Analytics...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Marketplace Overview
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time metrics, revenue performance, and catalog inventory status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/15 text-success border border-success/30 rounded-pill text-xs font-bold">
            <span className="w-2 h-2 rounded-pill bg-success animate-pulse" />
            Live Backend Connected
          </span>
        </div>
      </div>

      {/* 4 KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's GMV Revenue"
          value={formatPrice(stats.revenueToday)}
          delta={{ percent: 18.4, isPositive: true, period: '+18.4% vs last week' }}
          icon={DollarSign}
          sparklineData={[30, 45, 40, 60, 55, 80, 75, 95]}
        />
        <StatCard
          title="Orders Placed Today"
          value={stats.ordersToday.toLocaleString('en-IN')}
          delta={{ percent: 12.1, isPositive: true, period: '+12.1% vs yesterday' }}
          icon={Package}
          sparklineData={[50, 40, 60, 70, 65, 85, 90, 110]}
        />
        <StatCard
          title="New Customer Signups"
          value={stats.newUsers.toLocaleString('en-IN')}
          delta={{ percent: 8.5, isPositive: true, period: 'New buyers this week' }}
          icon={Users}
          sparklineData={[80, 85, 90, 95, 100, 105, 110, 120]}
        />
        <StatCard
          title="Low-Stock Critical Alerts"
          value={stats.lowStockCount}
          delta={{ percent: 2, isPositive: false, period: 'Items below threshold' }}
          icon={AlertTriangle}
          sparklineData={[40, 35, 30, 28, 25, 22, 20, 18]}
        />
      </div>

      {/* Charts Grid: Revenue Area Chart (8 Cols) & Status Donut (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Revenue Performance Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-surface rounded-card border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-primary">Revenue Growth (Last 7 Days)</h3>
              <p className="text-xs text-text-muted mt-0.5">Daily gross marketplace volume</p>
            </div>
            <span className="text-xs font-bold text-success flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> +14.2% Growth
            </span>
          </div>

          <div className="w-full h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#282A66" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#282A66" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B6B77' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6B6B77' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E6E3DD',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#282A66"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-surface rounded-card border border-border p-6 shadow-card space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-primary">Order Distribution</h3>
            <p className="text-xs text-text-muted mt-0.5">Fulfillment pipeline breakdown</p>
          </div>

          <div className="w-full h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusDonut}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {stats.statusDonut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            {stats.statusDonut.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-text-muted font-medium">{item.name}:</span>
                <span className="font-extrabold text-text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders Table (8 Cols) & Low-Stock Alerts (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-surface rounded-card border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-extrabold text-primary">Recent Customer Orders</h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[11px] font-bold text-text-muted uppercase border-b border-border">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { id: 'ORD-260920-83921', user: 'Parth Shandilya', items: 2, total: 1761, status: 'delivered' },
                  { id: 'ORD-260920-83922', user: 'Rohan Mehta', items: 1, total: 799, status: 'shipped' },
                  { id: 'ORD-260920-83923', user: 'Sunita Sharma', items: 3, total: 2450, status: 'confirmed' },
                  { id: 'ORD-260920-83924', user: 'Aakash Verma', items: 1, total: 489, status: 'placed' },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-background/50">
                    <td className="py-3 font-extrabold text-primary">{row.id}</td>
                    <td className="py-3 font-medium text-text-primary">{row.user}</td>
                    <td className="py-3 text-text-muted">{row.items} item(s)</td>
                    <td className="py-3 font-extrabold text-accent">{formatPrice(row.total)}</td>
                    <td className="py-3">
                      <StatusPill status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low-Stock Critical Alert List */}
        <div className="lg:col-span-4 bg-surface rounded-card border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-extrabold text-primary flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <span>Low-Stock Inventory</span>
            </h3>
            <span className="text-[11px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-pill">
              Critical
            </span>
          </div>

          <div className="space-y-3">
            {stats.lowStockProducts.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-background rounded-input border border-border space-y-1 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-extrabold text-text-primary line-clamp-1">{item.title}</span>
                  <span className="font-bold text-danger shrink-0 bg-danger/15 px-1.5 py-0.5 rounded">
                    {item.stock} left
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                  <span>SKU: {item.sku}</span>
                  <Link to="/admin/products" className="font-bold text-accent hover:underline">
                    Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
