import React, { useState } from 'react';
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
} from '@/lib/mockData';
import { RatingPill } from '@/components/shared/RatingPill';
import { DiscountBadge } from '@/components/shared/DiscountBadge';
import { StatusPill } from '@/components/shared/StatusPill';
import { TrustStripItem } from '@/components/shared/TrustStripItem';
import { CategoryTile } from '@/components/shared/CategoryTile';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductRail } from '@/components/shared/ProductRail';
import { HeroCarousel } from '@/components/shared/HeroCarousel';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { FilterAccordionItem } from '@/components/shared/FilterAccordionItem';
import { PriceRangeSlider } from '@/components/shared/PriceRangeSlider';
import { SortDropdown } from '@/components/shared/SortDropdown';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { Stepper } from '@/components/shared/Stepper';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  Headphones,
  DollarSign,
  Package,
  Users,
  Layers,
} from 'lucide-react';

export const ComponentShowcasePage: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Libas']);
  const [priceRange, setPriceRange] = useState({ min: 199, max: 1499 });

  const brandOptions = [
    { label: 'Libas Trendz', value: 'Libas', count: 48 },
    { label: 'Dennis Lingo', value: 'Dennis', count: 32 },
    { label: 'Kashvi Sarees', value: 'Kashvi', count: 65 },
    { label: 'Asian Footwear', value: 'Asian', count: 19 },
    { label: 'Berrylush', value: 'Berrylush', count: 27 },
  ];

  const checkoutSteps = [
    { id: 1, label: 'Delivery Address' },
    { id: 2, label: 'Payment Method' },
    { id: 3, label: 'Order Review' },
  ];

  const orderTrackingSteps = [
    { id: 1, label: 'Order Placed', timestamp: '15 Sep 2026, 10:00 AM', description: 'Payment confirmed via UPI' },
    { id: 2, label: 'Packed by Seller', timestamp: '16 Sep 2026, 09:00 AM', description: 'Surat Garments Hub' },
    { id: 3, label: 'Shipped', timestamp: '17 Sep 2026, 02:00 PM', description: 'BlueDart Tracking #BL938201' },
    { id: 4, label: 'Out for Delivery', timestamp: '19 Sep 2026, 08:30 AM', description: 'Agent: Ramesh (9876543210)' },
    { id: 5, label: 'Delivered', timestamp: '19 Sep 2026, 04:45 PM', description: 'Delivered with OTP verification' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-primary text-surface p-6 sm:p-8 rounded-card shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/20 text-accent border border-accent/40 rounded-pill text-xs font-bold uppercase mb-2">
            <Layers className="h-3.5 w-3.5" /> Component Design System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-surface">
            Bazaario UI Component Library
          </h1>
          <p className="text-xs sm:text-sm text-surface/80 mt-1 max-w-xl">
            All Phase 1 reusable UI components rendered in isolation with mock data and exact design tokens.
          </p>
        </div>
      </div>

      {/* 1. Hero Carousel */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          1. Hero Carousel (Indigo Panel + Coral CTA + Auto-Slide)
        </h2>
        <HeroCarousel />
      </section>

      {/* 2. Category Grid (8-across) */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          2. Category Tiles (8-Across Grid with Circular Images)
        </h2>
        <div className="bg-surface p-6 rounded-card border border-border shadow-card">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {MOCK_CATEGORIES.map((cat) => (
              <CategoryTile key={cat._id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Rails */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          3. Product Rails (Horizontal Scroll with Header & See All)
        </h2>
        <div className="space-y-6">
          <ProductRail
            emoji="🔥"
            title="Trending Now"
            subtitle="Most loved styles this festive season"
            seeAllLink="/search?sort=popular"
            products={MOCK_PRODUCTS}
          />
          <ProductRail
            emoji="💰"
            title="Budget Buys Under ₹499"
            subtitle="Factory direct deals with Free Delivery"
            seeAllLink="/search?maxPrice=499"
            products={MOCK_PRODUCTS.slice(1).concat(MOCK_PRODUCTS.slice(0, 1))}
          />
        </div>
      </section>

      {/* 4. Product Card Grid & Details */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          4. Product Card Grid (4-Across Responsive Cards)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_PRODUCTS.slice(0, 4).map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Trust Strip Items */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          5. Trust Strip Items (Value Proposition Icons)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TrustStripItem
            icon={Truck}
            title="Free Delivery"
            subtitle="On all orders above ₹499"
            iconBgColor="bg-success/15"
            iconColor="text-success"
          />
          <TrustStripItem
            icon={RefreshCw}
            title="7-Day Returns"
            subtitle="Hassle-free doorstep pickup"
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
          <TrustStripItem
            icon={ShieldCheck}
            title="100% Genuine"
            subtitle="Verified manufacturers only"
            iconBgColor="bg-accent/15"
            iconColor="text-accent"
          />
          <TrustStripItem
            icon={Headphones}
            title="24/7 Support"
            subtitle="Toll-free customer hotline"
            iconBgColor="bg-warning/15"
            iconColor="text-warning"
          />
        </div>
      </section>

      {/* 6. Atom Pills & Badges */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          6. Rating Pills, Discount Badges & Order Status Pills
        </h2>
        <div className="bg-surface p-6 rounded-card border border-border shadow-card space-y-6">
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase mb-3">Rating Pills</h4>
            <div className="flex flex-wrap items-center gap-3">
              <RatingPill rating={4.8} count={5412} size="lg" />
              <RatingPill rating={4.3} count={2847} size="default" />
              <RatingPill rating={3.9} count={410} size="sm" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase mb-3">Discount Badges</h4>
            <div className="flex flex-wrap items-center gap-3">
              <DiscountBadge percent={75} size="lg" />
              <DiscountBadge percent={62} size="default" />
              <DiscountBadge percent={40} size="sm" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase mb-3">Order Status Pills</h4>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status="placed" />
              <StatusPill status="confirmed" />
              <StatusPill status="packed" />
              <StatusPill status="shipped" />
              <StatusPill status="out_for_delivery" />
              <StatusPill status="delivered" />
              <StatusPill status="return_requested" />
              <StatusPill status="returned" />
              <StatusPill status="cancelled" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Steppers (Horizontal & Vertical) */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          7. Steppers (Checkout 3-Step & Order Tracking Timeline)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-surface p-6 rounded-card border border-border shadow-card">
            <h4 className="text-xs font-bold text-text-muted uppercase mb-4">Checkout Horizontal Stepper</h4>
            <Stepper steps={checkoutSteps} currentStepIndex={1} variant="horizontal" />
          </div>

          <div className="lg:col-span-6 bg-surface p-6 rounded-card border border-border shadow-card">
            <h4 className="text-xs font-bold text-text-muted uppercase mb-4">Order Tracking Vertical Timeline</h4>
            <Stepper steps={orderTrackingSteps} currentStepIndex={3} variant="vertical" />
          </div>
        </div>
      </section>

      {/* 8. Filter, Sort, Breadcrumb & Pagination Controls */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          8. Breadcrumbs, Filters, Sort & Pagination
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Filter Sidebar Mock */}
          <div className="lg:col-span-4 bg-surface p-5 rounded-card border border-border shadow-card space-y-2">
            <h3 className="text-sm font-extrabold text-primary pb-2 border-b border-border">Filters</h3>
            <PriceRangeSlider
              min={99}
              max={2999}
              currentMin={priceRange.min}
              currentMax={priceRange.max}
              onChange={(min, max) => setPriceRange({ min, max })}
            />
            <FilterAccordionItem
              title="Brand"
              options={brandOptions}
              selectedValues={selectedBrands}
              onChange={(vals) => setSelectedBrands(vals)}
            />
          </div>

          {/* Right: Controls & Pagination */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface p-4 rounded-card border border-border shadow-card flex flex-wrap items-center justify-between gap-4">
              <Breadcrumb
                items={[
                  { label: 'Women Fashion', path: '/category/women' },
                  { label: 'Ethnic Wear', path: '/category/women-ethnic' },
                  { label: 'Anarkali Kurta Sets' },
                ]}
              />
              <SortDropdown value={selectedSort} onChange={(val) => setSelectedSort(val)} />
            </div>

            <div className="bg-surface p-6 rounded-card border border-border shadow-card">
              <h4 className="text-xs font-bold text-text-muted uppercase mb-2">Pagination Component</h4>
              <Pagination
                currentPage={currentPage}
                totalPages={8}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Admin Stat Cards */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          9. Admin Dashboard Stat Cards (KPIs + Sparklines + Delta Chips)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Revenue"
            value="₹1,84,320"
            delta={{ percent: 18.4, isPositive: true, period: '+18.4% vs last week' }}
            icon={DollarSign}
            sparklineData={[30, 45, 40, 60, 55, 80, 75, 95]}
          />
          <StatCard
            title="Total Orders"
            value="1,429"
            delta={{ percent: 12.1, isPositive: true, period: '+12.1% vs yesterday' }}
            icon={Package}
            sparklineData={[50, 40, 60, 70, 65, 85, 90, 110]}
          />
          <StatCard
            title="Active Customers"
            value="48,290"
            delta={{ percent: 8.5, isPositive: true, period: 'New signups this week' }}
            icon={Users}
            sparklineData={[80, 85, 90, 95, 100, 105, 110, 120]}
          />
          <StatCard
            title="Cancellation Rate"
            value="2.1%"
            delta={{ percent: 0.8, isPositive: false, period: '-0.8% return requests' }}
            icon={RefreshCw}
            sparklineData={[40, 35, 30, 28, 25, 22, 20, 18]}
          />
        </div>
      </section>

      {/* 10. Buttons, Inputs & Skeletons */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          10. Buttons, Inputs & Loading Skeletons
        </h2>
        <div className="bg-surface p-6 rounded-card border border-border shadow-card space-y-6">
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase mb-3">Button Variants</h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">Primary Button</Button>
              <Button variant="accent">Accent CTA Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="outline-primary">Outline Primary</Button>
              <Button variant="outline-accent">Outline Accent</Button>
              <Button variant="accent" size="pill">
                Pill Button
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase mb-3">Input Fields</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              <Input placeholder="Enter 6-digit Pincode" />
              <Input placeholder="Apply Coupon Code" />
              <Input placeholder="Phone Number" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase mb-3">Loading Skeletons</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 bg-surface rounded-card border border-border space-y-2.5">
                  <Skeleton className="h-44 w-full rounded-md" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-full rounded-input mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Empty State Component */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-primary uppercase tracking-wider">
          11. Empty State Component
        </h2>
        <EmptyState
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any items to your cart yet. Explore thousands of budget buys now!"
          actionText="Start Shopping"
          actionLink="/"
        />
      </section>
    </div>
  );
};
