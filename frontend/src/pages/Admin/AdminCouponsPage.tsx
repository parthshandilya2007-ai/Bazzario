import React, { useState } from 'react';
import { useAdminCoupons, useCreateCoupon, useToggleCoupon } from '@/api/admin.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, Plus, CheckCircle2, X } from 'lucide-react';

export const AdminCouponsPage: React.FC = () => {
  const { data: coupons } = useAdminCoupons();
  const createCouponMutation = useCreateCoupon();
  const toggleCouponMutation = useToggleCoupon();

  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'flat' as 'flat' | 'percent',
    value: '',
    minOrder: '',
    usageLimit: '1000',
  });

  const toggleStatus = (id: string) => {
    toggleCouponMutation.mutate(id);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCoupon.code.trim()) {
      createCouponMutation.mutate({
        code: newCoupon.code.toUpperCase().trim(),
        type: newCoupon.type,
        value: Number(newCoupon.value) || 50,
        minOrder: Number(newCoupon.minOrder) || 299,
        usageLimit: Number(newCoupon.usageLimit) || 1000,
      });
      setNewCoupon({
        code: '',
        type: 'flat',
        value: '',
        minOrder: '',
        usageLimit: '1000',
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Coupons & Campaigns</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Create promotional discount codes and track customer redemptions
          </p>
        </div>
        <Button
          type="button"
          variant="accent"
          size="default"
          onClick={() => setIsAdding(true)}
          className="font-bold gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-5 bg-surface rounded-card border border-border shadow-card space-y-4 max-w-lg text-xs">
          <h3 className="font-extrabold text-primary uppercase">New Discount Promotion</h3>
          <div className="space-y-1">
            <label className="font-bold">Coupon Code *</label>
            <Input
              required
              placeholder="e.g. DIWALI150"
              className="uppercase font-bold"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold">Discount Value (₹) *</label>
              <Input
                type="number"
                required
                placeholder="100"
                value={newCoupon.value}
                onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold">Min Order Value (₹) *</label>
              <Input
                type="number"
                required
                placeholder="499"
                value={newCoupon.minOrder}
                onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="accent" size="sm" className="font-bold">
              Save & Activate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="font-bold"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-[11px] font-bold text-text-muted uppercase bg-background border-b border-border">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Min Order</th>
              <th className="p-4">Used / Limit</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(coupons || []).map((c) => (
              <tr key={c.id} className="hover:bg-background/40">
                <td className="p-4 font-mono font-extrabold text-accent">{c.code}</td>
                <td className="p-4 font-bold text-text-primary">
                  {c.type === 'flat' ? `Flat ₹${c.value} OFF` : `${c.value}% OFF`}
                </td>
                <td className="p-4 font-bold text-text-muted">₹{c.minOrder}</td>
                <td className="p-4 font-mono">
                  {c.usedCount} / {c.usageLimit}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded-pill text-[10px] font-bold ${
                      c.isActive ? 'bg-success/15 text-success' : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Expired'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => toggleStatus(c.id)}
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    {c.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
