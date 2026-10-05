import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import {
  Store,
  Percent,
  Truck,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Building2,
  Award,
  Sparkles,
  ChevronDown,
  Lock,
} from 'lucide-react';

export const SellerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  // Form State
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gstin, setGstin] = useState('');
  const [hasNoGstin, setHasNoGstin] = useState(false);
  const [pickupPincode, setPickupPincode] = useState('');
  const [category, setCategory] = useState('Women Ethnic Wear');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error('Terms Agreement Required', 'Please accept the supplier terms to proceed.');
      return;
    }

    if (phone.length !== 10) {
      toast.error('Invalid Phone Number', 'Please provide a valid 10-digit Indian mobile number.');
      return;
    }

    registerMutation.mutate(
      {
        name: ownerName || storeName,
        email,
        phone,
        password,
        role: 'seller',
      },
      {
        onSuccess: () => {
          setIsSuccessSubmitted(true);
          toast.success(
            'Supplier Application Received! 🎉',
            `Welcome aboard, ${storeName || ownerName}! Your supplier portal is ready.`
          );
        },
        onError: (err: any) => {
          toast.error('Registration Failed', err?.message || 'Could not complete supplier registration.');
        },
      }
    );
  };

  const FAQS = [
    {
      q: 'Do I need a GSTIN to register as a supplier on Bazaario?',
      a: 'If you sell taxable goods intra-state with an annual turnover under ₹40 Lakhs (or ₹20 Lakhs for services/specified states), you can register without GST under the composite / exempted scheme using your PAN. For inter-state shipping, a valid GSTIN is recommended.',
    },
    {
      q: 'How does the 0% commission structure work?',
      a: 'Bazaario does not charge any commission on your sales volume. You receive the exact price you list for your products, minus applicable government taxes and standard shipping fees.',
    },
    {
      q: 'When and how do I receive my payments?',
      a: 'Payments are deposited directly into your verified bank account on a strict 7-day payment cycle from the date of order delivery.',
    },
    {
      q: 'Who handles shipping and courier pickup?',
      a: 'Bazaario partners with leading logistics providers (Delhivery, BlueDart, Shadowfax). Our courier partner will pick up packed parcels directly from your registered doorstep pincode.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero & Value Proposition Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary-dark text-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/10 backdrop-blur-md border border-white/15 text-accent text-xs font-extrabold uppercase tracking-wider shadow-inner">
            <Sparkles className="h-3.5 w-3.5" /> India's Lowest Cost Marketplace for Suppliers
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Grow Your Business — Sell on Bazaario at{' '}
            <span className="text-accent underline decoration-accent/60 underline-offset-8">
              0% Commission
            </span>
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
            Join over 6,00,000+ manufacturers, distributors, and direct sellers reaching 10+ Crore buyers
            across 28,000+ Indian pincodes with timely 7-day bank deposits.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div>
              <p className="text-2xl font-black text-accent">0%</p>
              <p className="text-xs text-white/70 font-medium">Commission Rate</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">28,000+</p>
              <p className="text-xs text-white/70 font-medium">Pincodes Covered</p>
            </div>
            <div>
              <p className="text-2xl font-black text-accent">7 Days</p>
              <p className="text-xs text-white/70 font-medium">Bank Settlement</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">₹0</p>
              <p className="text-xs text-white/70 font-medium">Registration Fee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Registration Form & Key Perks Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-7xl mx-auto px-2">
        {/* Left Form Card */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          {isSuccessSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-black text-primary">Registration Successful!</h2>
              <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                Your supplier account for <strong>"{storeName || ownerName}"</strong> has been created.
                You can now log in, upload your product catalog, and manage inventory.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="accent" size="lg" className="font-bold">
                  <Link to="/admin/products">Go to Catalog Manager</Link>
                </Button>
                <Button asChild variant="outline-primary" size="lg" className="font-bold">
                  <Link to="/">Back to Storefront</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-border pb-4">
                <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                  <Store className="h-5 w-5 text-accent" /> Register as a Supplier
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Fill in your store details below to start selling within 10 minutes.
                </p>
              </div>

              {/* Step 1: Business Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-muted">
                  1. Store & Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Store / Company Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Vandana Creations"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Contact Person Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Ramesh Shandilya"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Business Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="supplier@yourbusiness.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Mobile Number (OTP Verified) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-text-muted font-bold">+91</span>
                      <Input
                        required
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        className="pl-12"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">
                    Account Password *
                  </label>
                  <Input
                    required
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Step 2: Tax & Logistics */}
              <div className="space-y-4 pt-2 border-t border-border">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-muted">
                  2. Tax & Logistics Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-text-primary">
                        GSTIN Number {!hasNoGstin && '*'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setHasNoGstin(!hasNoGstin)}
                        className="text-[11px] font-bold text-accent hover:underline"
                      >
                        {hasNoGstin ? 'I have GSTIN' : "Don't have GSTIN?"}
                      </button>
                    </div>
                    <Input
                      disabled={hasNoGstin}
                      required={!hasNoGstin}
                      placeholder={hasNoGstin ? 'Exempted / Composite Seller' : '22AAAAA0000A1Z5'}
                      className="uppercase"
                      value={hasNoGstin ? '' : gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Pickup Pincode *
                    </label>
                    <Input
                      required
                      maxLength={6}
                      placeholder="e.g. 395003 (Surat)"
                      value={pickupPincode}
                      onChange={(e) => setPickupPincode(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">
                    Primary Selling Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-input border border-border bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="Women Ethnic Wear">Women Ethnic Wear (Sarees, Kurtas, Lehengas)</option>
                    <option value="Men Western Wear">Men Western Wear (Shirts, Jeans, Trousers)</option>
                    <option value="Footwear">Footwear (Casual, Sports Shoes, Sandals)</option>
                    <option value="Electronics & Gadgets">Electronics & Smart Gadgets</option>
                    <option value="Home & Kitchen">Home & Kitchen Decor</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Bank Settlement Details */}
              <div className="space-y-4 pt-2 border-t border-border">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-muted">
                  3. Bank Details for 7-Day Payouts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Bank Account Number *
                    </label>
                    <Input
                      required
                      type="text"
                      placeholder="e.g. 50100239481923"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">
                      Bank IFSC Code *
                    </label>
                    <Input
                      required
                      placeholder="e.g. HDFC0001234"
                      className="uppercase"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="supplier-terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-border text-accent focus:ring-accent"
                />
                <label htmlFor="supplier-terms" className="text-xs text-text-muted leading-relaxed cursor-pointer">
                  I agree to Bazaario's Supplier Code of Conduct, 0% Commission Policy, and 7-day payout terms.
                </label>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={registerMutation.isPending}
                className="w-full font-bold text-sm shadow-md"
              >
                {registerMutation.isPending ? 'Creating Supplier Portal...' : 'Register & Start Selling'}
              </Button>

              <div className="text-center text-xs text-text-muted pt-2">
                Already registered as a seller?{' '}
                <Link to="/login" className="font-bold text-accent hover:underline">
                  Log in to Supplier Central
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Right Info / Perks Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Perk 1 */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-primary">0% Commission Fee</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Unlike traditional marketplaces that charge 15-30% on every sale, Bazaario lets you keep 100%
                of your product profit.
              </p>
            </div>
          </div>

          {/* Perk 2 */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-primary">Timely 7-Day Bank Payouts</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Direct deposits into your verified account 7 days after order delivery without hidden deductions
                or delayed payout penalties.
              </p>
            </div>
          </div>

          {/* Perk 3 */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-primary">Pan-India Doorstep Pickup</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Automated shipping label generation and doorstep package pickups through top logistics
                partners across 28,000+ pincodes.
              </p>
            </div>
          </div>

          {/* Perk 4 */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-primary">Zero Penalty on Return Deficiencies</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Fair returns policy and comprehensive damage compensation protection for suppliers on transit issues.
              </p>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="p-5 rounded-2xl bg-accent/10 border border-accent/25 space-y-3">
            <h4 className="text-xs font-extrabold text-accent uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" /> Need Assistance?
            </h4>
            <p className="text-xs text-text-primary leading-relaxed">
              Our dedicated supplier onboarding desk is available Monday to Saturday (9 AM - 7 PM).
            </p>
            <div className="text-xs font-bold text-text-primary">
              📞 Toll Free: 1800-266-9090 &bull; ✉️ supplier@bazaario.in
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Simple Steps to Start Selling */}
      <section className="bg-surface border border-border rounded-3xl p-8 sm:p-12 max-w-7xl mx-auto shadow-card space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Start Selling in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            From registration to your first customer order in less than 24 hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 rounded-2xl bg-background border border-border relative space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-accent text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h3 className="font-extrabold text-sm text-primary">Register & Upload Catalog</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Complete your profile with bank details and list your products with photos, descriptions, and prices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-background border border-border relative space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h3 className="font-extrabold text-sm text-primary">Receive Orders & Pack</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Get notified of incoming customer orders. Pack the items, and our courier partner will pick them up.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-background border border-border relative space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-success text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h3 className="font-extrabold text-sm text-primary">Get Paid in 7 Days</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Payments are directly credited to your registered bank account on our reliable 7-day payment cycle.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Everything you need to know about becoming a supplier on Bazaario
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-primary flex items-center justify-between gap-4 hover:bg-background/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-text-muted leading-relaxed border-t border-border/50 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
