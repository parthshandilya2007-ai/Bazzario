import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useRemoveCartItem } from '@/api/cart.api';
import { usePlaceOrder } from '@/api/orders.api';
import { Stepper } from '@/components/shared/Stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/formatters';
import { Address } from '@/types';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Building,
  Home,
  QrCode,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

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

const CHECKOUT_STEPS = [
  { id: 1, label: 'Delivery Address' },
  { id: 2, label: 'Payment Method' },
  { id: 3, label: 'Review & Place Order' },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const placeOrderMutation = usePlaceOrder();

  const [currentStep, setCurrentStep] = useState(0); // 0 = Address, 1 = Payment, 2 = Review
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New address form state
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

  // Payment selection
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [onlineType, setOnlineType] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const items = cart?.items || [];
  const selectedAddress = addresses.find((a) => a._id === selectedAddressId) || addresses[0];

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.line1 || !newAddress.pincode) return;

    const created: Address = {
      _id: `addr-${Date.now()}`,
      ...newAddress,
      isDefault: false,
    };

    setAddresses([created, ...addresses]);
    setSelectedAddressId(created._id);
    setIsAddingNewAddress(false);
  };

  const handleCompleteOrder = () => {
    setIsPlacingOrder(true);
    placeOrderMutation.mutate(
      {
        shippingAddress: selectedAddress,
        paymentMethod,
        items,
        couponCode: cart?.couponCode,
      },
      {
        onSuccess: (order) => {
          setIsPlacingOrder(false);
          navigate(`/checkout/success?orderNumber=${order.orderNumber}&amount=${order.pricing.grandTotal}`);
        },
        onError: () => {
          setIsPlacingOrder(false);
        },
      }
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Checkout Header & Progress Stepper */}
      <div className="bg-surface rounded-card border border-border p-4 sm:p-6 shadow-card">
        <h1 className="text-xl sm:text-2xl font-extrabold text-primary text-center tracking-tight mb-2">
          Secure Checkout
        </h1>
        <Stepper steps={CHECKOUT_STEPS} currentStepIndex={currentStep} variant="horizontal" />
      </div>

      {/* Main Checkout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Step Content (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address */}
          {currentStep === 0 && (
            <div className="bg-surface rounded-card border border-border p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  <h2 className="text-base sm:text-lg font-extrabold text-primary">
                    1. Select Delivery Address
                  </h2>
                </div>
                {!isAddingNewAddress && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New Address
                  </button>
                )}
              </div>

              {/* Add New Address Form */}
              {isAddingNewAddress ? (
                <form onSubmit={handleSaveNewAddress} className="p-4 bg-background rounded-card border border-border space-y-4">
                  <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">
                    Add New Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Full Name *"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    />
                    <Input
                      placeholder="10-digit Mobile Number *"
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
                      placeholder="City / District *"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                  </div>

                  <Input
                    placeholder="Flat, House no., Building, Apartment *"
                    required
                    value={newAddress.line1}
                    onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                  />
                  <Input
                    placeholder="Area, Street, Sector, Village"
                    value={newAddress.line2}
                    onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                  />

                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-xs font-bold text-text-muted">Address Type:</span>
                    {(['home', 'work', 'other'] as const).map((type) => (
                      <label key={type} className="flex items-center gap-1.5 text-xs text-text-primary capitalize cursor-pointer">
                        <input
                          type="radio"
                          name="addrType"
                          checked={newAddress.type === type}
                          onChange={() => setNewAddress({ ...newAddress, type })}
                          className="text-accent focus:ring-accent"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="accent" size="default" className="font-bold">
                      Save & Deliver Here
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="font-bold text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                /* Address Radio Cards */
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;

                    return (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`p-4 rounded-card border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-accent bg-accent/5 ring-1 ring-accent'
                            : 'border-border bg-surface hover:bg-background'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className="mt-1 text-accent focus:ring-accent"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-text-primary">
                              {addr.fullName}
                            </span>
                            <span className="px-2 py-0.5 rounded-pill bg-background border border-border text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                              {addr.type === 'home' ? <Home className="h-3 w-3" /> : <Building className="h-3 w-3" />}
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded-pill bg-primary/10 text-primary text-[10px] font-extrabold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-primary">
                            {addr.line1} {addr.line2 ? `, ${addr.line2}` : ''}
                          </p>
                          <p className="text-xs text-text-muted">
                            {addr.city}, {addr.state} - <strong className="text-text-primary">{addr.pincode}</strong>
                          </p>
                          <p className="text-xs text-text-muted pt-1">
                            Mobile: <strong className="text-text-primary">{addr.phone}</strong>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Continue Button */}
              {!isAddingNewAddress && (
                <div className="pt-4 border-t border-border flex justify-end">
                  <Button
                    type="button"
                    variant="accent"
                    size="lg"
                    onClick={() => setCurrentStep(1)}
                    className="font-bold shadow-md gap-2"
                  >
                    Deliver to this Address <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {currentStep === 1 && (
            <div className="bg-surface rounded-card border border-border p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  <h2 className="text-base sm:text-lg font-extrabold text-primary">
                    2. Select Payment Method
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="text-xs font-bold text-text-muted hover:text-text-primary flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Address
                </button>
              </div>

              {/* Payment Option Cards */}
              <div className="space-y-3">
                {/* Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-card border transition-all cursor-pointer flex items-start gap-3.5 ${
                    paymentMethod === 'cod'
                      ? 'border-accent bg-accent/5 ring-1 ring-accent'
                      : 'border-border bg-surface hover:bg-background'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-accent focus:ring-accent"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-text-primary flex items-center gap-2">
                        <span>Cash on Delivery (COD)</span>
                        <span className="text-[10px] bg-success/15 text-success px-2 py-0.5 rounded-pill font-bold">
                          Recommended
                        </span>
                      </span>
                      <DollarSign className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-xs text-text-muted">
                      Pay in cash or UPI QR directly to the delivery agent when your order arrives.
                    </p>
                  </div>
                </div>

                {/* Instant Online Payment (UPI, Cards) */}
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-card border transition-all cursor-pointer flex items-start gap-3.5 ${
                    paymentMethod === 'online'
                      ? 'border-accent bg-accent/5 ring-1 ring-accent'
                      : 'border-border bg-surface hover:bg-background'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-1 text-accent focus:ring-accent"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-text-primary">
                        Pay Online (UPI / Credit & Debit Card / Net Banking)
                      </span>
                      <QrCode className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs text-text-muted">
                      Fast & contactless payment with instant refund capability if returned.
                    </p>

                    {/* Online payment sub-tabs */}
                    {paymentMethod === 'online' && (
                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setOnlineType('upi')}
                          className={`text-xs px-3 py-1.5 rounded-input border font-bold ${
                            onlineType === 'upi' ? 'bg-primary text-surface border-primary' : 'bg-surface border-border text-text-muted'
                          }`}
                        >
                          UPI (GPay / PhonePe / Paytm)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineType('card')}
                          className={`text-xs px-3 py-1.5 rounded-input border font-bold ${
                            onlineType === 'card' ? 'bg-primary text-surface border-primary' : 'bg-surface border-border text-text-muted'
                          }`}
                        >
                          Cards (Visa, RuPay, Master)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setCurrentStep(0)}
                  className="font-bold text-xs"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  type="button"
                  variant="accent"
                  size="lg"
                  onClick={() => setCurrentStep(2)}
                  className="font-bold shadow-md gap-2"
                >
                  Review Order <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Place Order */}
          {currentStep === 2 && (
            <div className="bg-surface rounded-card border border-border p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <h2 className="text-base sm:text-lg font-extrabold text-primary">
                    3. Review & Confirm Order
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-text-muted hover:text-text-primary flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Change Payment
                </button>
              </div>

              {/* Delivery Address Snapshot */}
              <div className="p-4 rounded-card bg-background border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> Shipping To:
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="text-[11px] font-bold text-accent hover:underline"
                  >
                    Change
                  </button>
                </div>
                <p className="text-xs font-bold text-text-primary">{selectedAddress.fullName} ({selectedAddress.phone})</p>
                <p className="text-xs text-text-muted">
                  {selectedAddress.line1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                </p>
              </div>

              {/* Payment Method Snapshot */}
              <div className="p-4 rounded-card bg-background border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-accent" />
                  <div>
                    <span className="text-xs font-bold text-text-primary">
                      Payment Mode: {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : `Online (${onlineType.toUpperCase()})`}
                    </span>
                    <p className="text-[11px] text-text-muted">7-Day doorstep replacement / refund guarantee</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-[11px] font-bold text-accent hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Order Items Review */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider">
                  Items Ordered ({items.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="p-3 bg-surface rounded-input border border-border flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images?.[0]?.url || ''}
                          alt=""
                          className="w-12 h-14 object-cover rounded-input bg-background"
                        />
                        <div>
                          <p className="font-bold text-text-primary line-clamp-1">{item.product.title}</p>
                          <p className="text-[11px] text-text-muted">
                            Qty: <strong className="text-text-primary">{item.qty}</strong> • Size: {item.variant?.size || 'Free Size'}
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-text-primary">
                        {formatPrice((item.priceSnapshot || item.product.finalPrice) * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Place Order CTA */}
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setCurrentStep(1)}
                  className="font-bold text-xs"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  type="button"
                  variant="accent"
                  size="lg"
                  disabled={isPlacingOrder}
                  onClick={handleCompleteOrder}
                  className="font-bold shadow-lg gap-2 text-sm px-8"
                >
                  {isPlacingOrder ? 'Processing Order...' : 'Place Order & Pay'}
                  {!isPlacingOrder && <CheckCircle2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Order Summary (4 Cols) */}
        <div className="lg:col-span-4 bg-surface rounded-card border border-border p-5 shadow-card space-y-4 sticky top-24">
          <h3 className="text-sm font-extrabold text-primary border-b border-border pb-3">
            Order Summary
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-text-muted">
              <span>Items Total ({items.length})</span>
              <span className="text-text-primary font-bold">{formatPrice(cart?.subtotal || 0)}</span>
            </div>

            {cart?.couponDiscount ? (
              <div className="flex justify-between text-success font-bold">
                <span>Coupon Discount ({cart.couponCode})</span>
                <span>- {formatPrice(cart.couponDiscount)}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-text-muted">
              <span>Taxes (5% GST)</span>
              <span className="text-text-primary font-bold">{formatPrice(cart?.tax || 0)}</span>
            </div>

            <div className="flex justify-between text-text-muted">
              <span>Delivery Fee</span>
              <span className={cart?.shippingFee === 0 ? 'text-success font-bold' : 'text-text-primary font-bold'}>
                {cart?.shippingFee === 0 ? 'FREE' : formatPrice(cart?.shippingFee || 49)}
              </span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-baseline text-sm font-extrabold text-primary">
              <span>Grand Total</span>
              <span className="text-xl text-accent font-extrabold">
                {formatPrice(cart?.grandTotal || 0)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border space-y-2 text-[11px] text-text-muted">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent shrink-0" />
              <span>Estimated Delivery: 3-4 Business Days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success shrink-0" />
              <span>100% Genuine Products Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
