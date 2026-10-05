import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Sparkles, Phone, Lock, ArrowRight, Check } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email: emailOrPhone, password },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  const handleSendOtp = () => {
    if (emailOrPhone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { phone: emailOrPhone, otp: otpCode.join('') },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  const handleQuickDemoLogin = (role: 'customer' | 'admin') => {
    loginMutation.mutate(
      {
        email: role === 'admin' ? 'admin@bazaario.in' : 'parth@bazaario.in',
        password: 'password123',
      },
      {
        onSuccess: () => navigate(role === 'admin' ? '/admin' : '/'),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-primary tracking-tight">Welcome Back</h2>
        <p className="text-xs text-text-muted">Sign in to track orders and view saved addresses</p>
      </div>

      {/* Tabs: Password vs Mobile OTP */}
      <div className="flex border border-border rounded-input bg-background p-1">
        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`flex-1 py-1.5 rounded-input text-xs font-bold transition-colors ${
            activeTab === 'password'
              ? 'bg-surface text-primary shadow-xs'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('otp')}
          className={`flex-1 py-1.5 rounded-input text-xs font-bold transition-colors ${
            activeTab === 'otp'
              ? 'bg-surface text-primary shadow-xs'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Instant OTP
        </button>
      </div>

      {/* Password Tab Form */}
      {activeTab === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">Email or Mobile Number</label>
            <Input
              type="text"
              required
              placeholder="e.g. name@domain.com or 9876543210"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-text-primary">Password</label>
              <Link to="/forgot-password" className="text-accent font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="accent" size="lg" className="w-full font-bold shadow-md">
            Sign In
          </Button>
        </form>
      ) : (
        /* OTP Tab Form */
        <form onSubmit={handleOtpLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">10-Digit Mobile Number</label>
            <div className="flex gap-2">
              <Input
                type="text"
                maxLength={10}
                required
                placeholder="9876543210"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value.replace(/\D/g, ''))}
              />
              <Button
                type="button"
                variant="outline-accent"
                size="default"
                onClick={handleSendOtp}
                className="font-bold text-xs shrink-0"
              >
                {otpSent ? 'Resend' : 'Send OTP'}
              </Button>
            </div>
          </div>

          {otpSent && (
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-success font-bold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> OTP sent to +91 {emailOrPhone}
              </p>
              <label className="text-xs font-bold text-text-primary block">Enter 4-Digit OTP</label>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={otpCode[idx]}
                    onChange={(e) => {
                      const updated = [...otpCode];
                      updated[idx] = e.target.value;
                      setOtpCode(updated);
                    }}
                    className="w-12 h-12 text-center text-lg font-extrabold rounded-input border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                ))}
              </div>
              <Button type="submit" variant="accent" size="lg" className="w-full font-bold shadow-md mt-4">
                Verify OTP & Login
              </Button>
            </div>
          )}
        </form>
      )}

      {/* Quick Demo One-Click Logins */}
      <div className="pt-2 border-t border-border space-y-2">
        <p className="text-[10px] text-text-muted text-center uppercase tracking-wider font-bold">
          Quick Demo Credentials
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDemoLogin('customer')}
            className="text-xs font-bold"
          >
            Demo Customer
          </Button>
          <Button
            type="button"
            variant="outline-accent"
            size="sm"
            onClick={() => handleQuickDemoLogin('admin')}
            className="text-xs font-bold"
          >
            Demo Admin
          </Button>
        </div>
      </div>

      <p className="text-xs text-center text-text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-bold text-accent hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
};
