import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Store, User as UserIcon } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { name, email, phone, password, role },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-primary tracking-tight">Create Account</h2>
        <p className="text-xs text-text-muted">Join millions of smart shoppers and suppliers on Bazaario</p>
      </div>

      {/* Account Type Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`p-3 rounded-input border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            role === 'customer'
              ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent'
              : 'border-border bg-surface text-text-muted hover:bg-background'
          }`}
        >
          <UserIcon className="h-4 w-4" /> Customer
        </button>
        <button
          type="button"
          onClick={() => setRole('seller')}
          className={`p-3 rounded-input border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            role === 'seller'
              ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent'
              : 'border-border bg-surface text-text-muted hover:bg-background'
          }`}
        >
          <Store className="h-4 w-4" /> Supplier / Seller
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary">Full Name</label>
          <Input
            type="text"
            required
            placeholder="e.g. Ramesh Patel"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary">Email Address</label>
          <Input
            type="email"
            required
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary">10-Digit Mobile Number</label>
          <Input
            type="text"
            required
            maxLength={10}
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary">Password</label>
          <Input
            type="password"
            required
            minLength={8}
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="accent" size="lg" className="w-full font-bold shadow-md">
            Create {role === 'seller' ? 'Seller Account' : 'Account'}
          </Button>
        </div>
      </form>

      <p className="text-xs text-center text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-accent hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};
