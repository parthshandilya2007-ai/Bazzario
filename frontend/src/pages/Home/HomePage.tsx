import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/api/categories.api';
import { useProductRail, useProducts } from '@/api/products.api';
import { useAddToCart } from '@/api/cart.api';
import { useLiveInvalidate } from '@/hooks/useLiveInvalidate';
import { HeroCarousel } from '@/components/shared/HeroCarousel';
import { TrustStripItem } from '@/components/shared/TrustStripItem';
import { CategoryTile } from '@/components/shared/CategoryTile';
import { ProductRail } from '@/components/shared/ProductRail';
import { ProductCard } from '@/components/shared/ProductCard';
import { Pagination } from '@/components/shared/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Store,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [activeCatalogPage, setActiveCatalogPage] = useState(1);

  // TanStack React Query Hooks
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: trendingProducts, isLoading: isTrendingLoading, isError: isTrendingError, refetch: refetchTrending } =
    useProductRail('trending');
  const { data: budgetProducts, isLoading: isBudgetLoading } = useProductRail('under_499');
  const { data: topRatedProducts, isLoading: isTopRatedLoading } = useProductRail('top_rated');
  const { data: allCatalogData, isLoading: isCatalogLoading } = useProducts({
    page: activeCatalogPage,
    limit: 8,
    sort: 'popular',
  });

  // Real-time Push Updates: Subscribe to global catalog room for rail-level & catalog changes
  useLiveInvalidate(
    'global:catalog',
    ['catalog:updated', 'product:updated', 'product:deleted', 'category:updated'],
    () => [['products'], ['categories']],
    {
      toastMessage: {
        title: 'Storefront Updated',
        description: 'New arrivals & catalog changes have been applied live.',
      },
    }
  );

  const addToCartMutation = useAddToCart();

  const handleAddToCart = (product: Product) => {
    addToCartMutation.mutate({ product, qty: 1 });
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-16">
      {/* 1. Full-Screen Width Hero Carousel */}
      <HeroCarousel />

      {/* Main Content Sections Container */}
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* 2. Trust Strip (4-Item Value Proposition Bar) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <TrustStripItem
          icon={Truck}
          title="Free Delivery"
          subtitle="On all orders above ₹499"
          iconBgColor="bg-success/15"
          iconColor="text-success"
        />
        <TrustStripItem
          icon={
            <span className="font-extrabold text-sm text-accent">COD</span>
          }
          title="Cash on Delivery"
          subtitle="Pay after doorstep check"
          iconBgColor="bg-accent/15"
          iconColor="text-accent"
        />
        <TrustStripItem
          icon={RefreshCw}
          title="7-Day Easy Returns"
          subtitle="Instant replacement / refund"
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />
        <TrustStripItem
          icon={ShieldCheck}
          title="100% Genuine"
          subtitle="Direct from verified makers"
          iconBgColor="bg-success/15"
          iconColor="text-success"
        />
      </section>

      {/* 3. Top Categories (8-Across Circular Grid) */}
      <section className="bg-surface p-5 sm:p-6 rounded-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-primary tracking-tight">
              Top Categories to Explore
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Handpicked collections at factory-direct rates</p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isCategoriesLoading ? (
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 py-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-pill" />
                <Skeleton className="w-14 h-3 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 py-1">
            {categories?.slice(0, 8).map((category) => (
              <CategoryTile key={category._id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Trending Now Product Rail */}
      {isTrendingLoading ? (
        <div className="space-y-4 py-4">
          <Skeleton className="w-48 h-6 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-[220px] shrink-0 p-3 bg-surface rounded-card border border-border space-y-2">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full rounded-input mt-2" />
              </div>
            ))}
          </div>
        </div>
      ) : isTrendingError ? (
        <div className="p-6 bg-surface rounded-card border border-danger/30 text-center space-y-2">
          <AlertCircle className="h-6 w-6 text-danger mx-auto" />
          <p className="text-xs text-danger font-semibold">Failed to load trending items</p>
          <Button variant="outline" size="sm" onClick={() => refetchTrending()}>
            Retry
          </Button>
        </div>
      ) : (
        trendingProducts && (
          <ProductRail
            emoji="🔥"
            title="Trending Now"
            subtitle="Most loved styles this festive season"
            seeAllLink="/search?sort=popular"
            products={trendingProducts}
            onAddToCart={handleAddToCart}
          />
        )
      )}

      {/* 5. Spotlight Promotional Banner */}
      <section className="relative overflow-hidden rounded-card bg-gradient-to-r from-[#282A66] to-[#3B3E8C] text-surface p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-accent text-surface rounded-pill text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Budget Corner
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Everything Under ₹499 + Free Delivery
          </h3>
          <p className="text-xs sm:text-sm text-surface/85 max-w-xl">
            Direct factory clearance deals on kurtis, shirts, kitchen utilities and jewelry without any middleman markup.
          </p>
        </div>
        <Button asChild variant="accent" size="lg" className="font-bold shadow-md shrink-0 z-10">
          <Link to="/search?maxPrice=499">
            Shop Under ₹499 <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/20 rounded-pill blur-2xl pointer-events-none" />
      </section>

      {/* 6. Budget Buys Under ₹499 Product Rail */}
      {isBudgetLoading ? (
        <div className="space-y-4 py-4">
          <Skeleton className="w-48 h-6 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-[220px] shrink-0 p-3 bg-surface rounded-card border border-border space-y-2">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full rounded-input mt-2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        budgetProducts && (
          <ProductRail
            emoji="💰"
            title="Budget Buys Under ₹499"
            subtitle="Top quality essentials at honest factory rates"
            seeAllLink="/search?maxPrice=499"
            products={budgetProducts}
            onAddToCart={handleAddToCart}
          />
        )
      )}

      {/* 7. Top Rated Picks Product Rail */}
      {isTopRatedLoading ? (
        <div className="space-y-4 py-4">
          <Skeleton className="w-48 h-6 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-[220px] shrink-0 p-3 bg-surface rounded-card border border-border space-y-2">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full rounded-input mt-2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        topRatedProducts && (
          <ProductRail
            emoji="⭐"
            title="Top Rated Picks"
            subtitle="Verified 4.4+ star ratings from real buyers"
            seeAllLink="/search?sort=rating"
            products={topRatedProducts}
            onAddToCart={handleAddToCart}
          />
        )
      )}

      {/* 8. Full Explore Catalog Grid (4-Across Responsive Cards) */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛍️</span>
              <h2 className="text-xl font-extrabold text-primary tracking-tight">Explore More Products</h2>
            </div>
            <p className="text-xs text-text-muted mt-0.5">Discover newly added products across all categories</p>
          </div>
        </div>

        {isCatalogLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="p-3.5 bg-surface rounded-card border border-border space-y-2.5">
                <Skeleton className="aspect-[4/5] w-full rounded-md" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full rounded-input mt-3" />
              </div>
            ))}
          </div>
        ) : (
          allCatalogData && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {allCatalogData.items.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={allCatalogData.page}
                totalPages={allCatalogData.totalPages}
                onPageChange={(page) => setActiveCatalogPage(page)}
              />
            </>
          )
        )}
      </section>

      {/* 9. Seller / Supplier Registration Callout */}
      <section className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-pill bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-primary tracking-tight">
              Grow Your Business — Sell on Bazaario at 0% Commission
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed max-w-xl">
              Connect directly with 10+ Crore buyers across 28,000+ Indian pincodes with timely 7-day bank payouts.
            </p>
          </div>
        </div>
        <Button asChild variant="outline-accent" size="lg" className="font-bold shrink-0">
          <Link to="/seller/register">
            Register as Supplier <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
        </section>
      </div>
    </div>
  );
};
