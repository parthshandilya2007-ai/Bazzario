import React, { useState } from 'react';
import { Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Plus, Trash2, Home, Building, CheckCircle2 } from 'lucide-react';

const INITIAL_ADDRESSES: Address[] = [
  {
    _id: 'addr-1',
    fullName: 'Parth Shandilya',
    phone: '9876543210',
    line1: 'Flat 402, Sunshine Heights, 100ft Road',
    line2: 'Near Indiranagar Metro Station',
    landmark: 'Behind Sony Center',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    type: 'home',
    isDefault: true,
  },
  {
    _id: 'addr-2',
    fullName: 'Parth Shandilya (Work)',
    phone: '9876543210',
    line1: 'Tech Park Tower B, 5th Floor',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    type: 'work',
    isDefault: false,
  },
];

export const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    type: 'home' as 'home' | 'work' | 'other',
  });

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a._id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a._id !== id));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Address = {
      _id: `addr-${Date.now()}`,
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, created]);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-primary">Saved Addresses</h2>
          <p className="text-xs text-text-muted mt-0.5">Manage your delivery addresses (up to 10)</p>
        </div>
        {!isAdding && (
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="font-bold gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Add Address
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-5 bg-background rounded-card border border-border space-y-4">
          <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">
            Add New Address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Full Name *"
              required
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
            />
            <Input
              placeholder="10-digit Phone *"
              required
              maxLength={10}
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '') })}
            />
            <Input
              placeholder="Pincode *"
              required
              maxLength={6}
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '') })}
            />
            <Input
              placeholder="City *"
              required
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
          </div>
          <Input
            placeholder="Address Line 1 (Flat, Building, Street) *"
            required
            value={newAddress.line1}
            onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
          />
          <div className="flex gap-3">
            <Button type="submit" variant="accent" size="default" className="font-bold text-xs">
              Save Address
            </Button>
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setIsAdding(false)}
              className="font-bold text-xs"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="p-4 rounded-card border border-border bg-surface shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-text-primary">{addr.fullName}</span>
                <span className="px-2 py-0.5 rounded-pill bg-background border border-border text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                  {addr.type === 'home' ? <Home className="h-3 w-3" /> : <Building className="h-3 w-3" />}
                  {addr.type}
                </span>
              </div>
              <p className="text-xs text-text-primary leading-relaxed">{addr.line1}</p>
              <p className="text-xs text-text-muted">
                {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
              </p>
              <p className="text-xs text-text-muted">Mobile: +91 {addr.phone}</p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              {addr.isDefault ? (
                <span className="text-[11px] font-bold text-success flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Default Address
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr._id)}
                  className="text-[11px] font-bold text-accent hover:underline"
                >
                  Set as Default
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(addr._id)}
                className="text-text-muted hover:text-danger p-1"
                title="Delete address"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
