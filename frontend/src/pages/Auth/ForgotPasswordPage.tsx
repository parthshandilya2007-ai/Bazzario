import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOrPhone.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-primary tracking-tight">Forgot Password</h2>
        <p className="text-xs text-text-muted">
          Enter your registered email or phone to receive reset instructions
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-4 bg-success/10 border border-success/30 rounded-card text-center space-y-3">
          <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
          <h3 className="text-sm font-bold text-success">Reset Link Sent</h3>
          <p className="text-xs text-text-primary">
            We have dispatched password recovery instructions to <strong>{emailOrPhone}</strong>.
          </p>
          <Button asChild variant="outline" size="sm" className="font-bold text-xs mt-2">
            <Link to="/login">Back to Sign In</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">Registered Email or Phone</label>
            <Input
              type="text"
              required
              placeholder="e.g. name@domain.com or 9876543210"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>

          <Button type="submit" variant="accent" size="lg" className="w-full font-bold shadow-md">
            Send Reset Instructions
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs font-bold text-text-muted hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
