import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '@/api/products.api';
import { useCategories } from '@/api/categories.api';
import { useAddToCart } from '@/api/cart.api';
import { useLiveInvalidate } from '@/hooks/useLiveInvalidate';
import { ProductCard } from '@/components/shared/ProductCard';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { FilterAccordionItem } from '@/components/shared/FilterAccordionItem';
import { PriceRangeSlider } from '@/components/shared/PriceRangeSlider';
import { SortDropdown } from '@/components/shared/SortDropdown';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import {
  SlidersHorizontal,
  X,
  Star,
  Check,
  RotateCcw,
} from 'lucide-react';

export const ListingPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const initialCategory = slug || searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') || 'popular';

  // Filters state
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 3000,
  });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [codOnly, setCodOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync sort to URL params
  useEffect(() => {
    setSelectedSort(initialSort);
  }, [initialSort]);

  // Fetch categories for sidebar
  const { data: categories } = useCategories();

  // Active Category metadata
  const currentCategoryObj = useMemo(() => {
    if (!categories) return null;
    return categories.find((c) => c.slug === slug);
  }, [categories, slug]);

  const pageTitle = useMemo(() => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (currentCategoryObj) return currentCategoryObj.name;
    if (slug) return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return 'All Products';
  }, [searchQuery, currentCategoryObj, slug]);

  // Fetch products query
  const { data: productsData, isLoading, isFetching } = useProducts({
    search: searchQuery,
    category: slug || (initialCategory !== 'All' ? initialCategory : undefined),
    brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
    minPrice: priceRange.min > 0 ? priceRange.min : undefined,
    maxPrice: priceRange.max < 3000 ? priceRange.max : undefined,
    rating: selectedRating !== null ? selectedRating : undefined,
    sort: selectedSort,
    page: currentPage,
    limit: 12,
  });

  // Real-time Push Updates: Subscribe to category room (if viewing a category) and global catalog room
  useLiveInvalidate(
    slug ? `category:${slug}` : null,
    'category:updated',
    () => [['products'], ['categories']],
    {
      toastMessage: {
        title: 'Category Updated',
        description: 'Product listing refreshed with recent catalog changes.',
      },
    }
  );

  useLiveInvalidate(
    'global:catalog',
    ['catalog:updated', 'product:updated', 'product:deleted'],
    () => [['products'], ['categories']],
    {
      toastMessage: {
        title: 'Catalog Updated',
        description: 'Listing refreshed with live inventory and pricing changes.',
      },
    }
  );

  const addToCartMutation = useAddToCart();

  const handleAddToCart = (product: Product) => {
    addToCartMutation.mutate({ product, qty: 1 });
  };

  const handleSortChange = (newSort: string) => {
    setSelectedSort(newSort);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 3000 });
    setSelectedRating(null);
    setSelectedDiscount(null);
    setCodOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 3000 ||
    selectedRating !== null ||
    selectedDiscount !== null ||
    codOnly;

  // Mock brands list with dynamic counts
  const availableBrands = [
    { label: 'Libas Trendz', value: 'Libas', count: 42 },
    { label: 'Dennis Lingo', value: 'Dennis', count: 35 },
    { label: 'Kashvi Sarees', value: 'Kashvi', count: 58 },
    { label: 'Asian Footwear', value: 'Asian', count: 21 },
    { label: 'Berrylush', value: 'Berrylush', count: 29 },
    { label: 'boAt Lifestyle', value: 'boAt', count: 18 },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumb & Header */}
      <div className="space-y-2">
        <Breadcrumb
          items={[
            ...(slug
              ? [
                  { label: 'Categories', path: '/search' },
                  { label: currentCategoryObj?.name || pageTitle },
                ]
              : searchQuery
              ? [{ label: 'Search Results' }]
              : [{ label: 'All Catalog' }]),
          ]}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
              {pageTitle}
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Showing {productsData?.total || 0} items at lowest factory prices
            </p>
          </div>

          {/* Top Sort Selector (Desktop) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-input border border-border bg-surface text-xs font-bold text-text-primary shadow-xs"
            >
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            <SortDropdown value={selectedSort} onChange={handleSortChange} />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-border">
          <span className="text-xs font-bold text-text-muted mr-1">Active Filters:</span>

          {selectedBrands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-surface border border-border text-xs font-semibold text-text-primary shadow-xs"
            >
              <span>Brand: {brand}</span>
              <button
                type="button"
                onClick={() => setSelectedBrands(selectedBrands.filter((b) => b !== brand))}
                className="text-text-muted hover:text-danger ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {(priceRange.min > 0 || priceRange.max < 3000) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-surface border border-border text-xs font-semibold text-text-primary shadow-xs">
              <span>
                Price: ₹{priceRange.min} - ₹{priceRange.max}
              </span>
              <button
                type="button"
                onClick={() => setPriceRange({ min: 0, max: 3000 })}
                className="text-text-muted hover:text-danger ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedRating !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-surface border border-border text-xs font-semibold text-text-primary shadow-xs">
              <span>Rating: {selectedRating}★ & above</span>
              <button
                type="button"
                onClick={() => setSelectedRating(null)}
                className="text-text-muted hover:text-danger ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {codOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-surface border border-border text-xs font-semibold text-text-primary shadow-xs">
              <span>COD Available</span>
              <button
                type="button"
                onClick={() => setCodOnly(false)}
                className="text-text-muted hover:text-danger ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="text-xs font-bold text-accent hover:text-accent-hover ml-2 flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 bg-surface rounded-card border border-border p-5 shadow-card sticky top-24 space-y-1">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-extrabold text-primary flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-accent hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories List */}
          <div className="py-3 border-b border-border">
            <h4 className="text-xs font-bold text-text-primary tracking-wide mb-2.5">
              Categories
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <Link
                to="/search"
                className={`block text-xs py-1 transition-colors ${
                  !slug ? 'font-bold text-accent' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                All Categories
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className={`block text-xs py-1 transition-colors ${
                    slug === cat.slug
                      ? 'font-bold text-accent'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <PriceRangeSlider
            min={0}
            max={3000}
            currentMin={priceRange.min}
            currentMax={priceRange.max}
            onChange={(min, max) => {
              setPriceRange({ min, max });
              setCurrentPage(1);
            }}
          />

          {/* Brand Checkboxes */}
          <FilterAccordionItem
            title="Brand"
            options={availableBrands}
            selectedValues={selectedBrands}
            onChange={(vals) => {
              setSelectedBrands(vals);
              setCurrentPage(1);
            }}
          />

          {/* Customer Rating Filter */}
          <div className="py-3 border-b border-border space-y-2">
            <h4 className="text-xs font-bold text-text-primary tracking-wide">Customer Rating</h4>
            <div className="space-y-1.5">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedRating(selectedRating === r ? null : r);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between text-xs py-1 px-2 rounded-input transition-colors ${
                    selectedRating === r
                      ? 'bg-accent/10 font-bold text-accent'
                      : 'hover:bg-background text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{r}★ & above</span>
                    <div className="flex text-amber-500">
                      {[...Array(r)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  {selectedRating === r && <Check className="h-3.5 w-3.5 text-accent" />}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Percentage Filter */}
          <div className="py-3 border-b border-border space-y-2">
            <h4 className="text-xs font-bold text-text-primary tracking-wide">Discount</h4>
            <div className="space-y-1">
              {[
                { label: '50% or more', val: 50 },
                { label: '60% or more', val: 60 },
                { label: '70% or more', val: 70 },
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => {
                    setSelectedDiscount(selectedDiscount === d.val ? null : d.val);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left text-xs py-1 px-2 rounded-input transition-colors ${
                    selectedDiscount === d.val
                      ? 'bg-accent/10 font-bold text-accent'
                      : 'hover:bg-background text-text-primary'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cash On Delivery Checkbox */}
          <div className="pt-3">
            <label className="flex items-center gap-2 text-xs font-bold text-text-primary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={codOnly}
                onChange={(e) => {
                  setCodOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded-sm border-border text-accent focus:ring-accent"
              />
              <span>Cash on Delivery Only</span>
            </label>
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {isLoading || isFetching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="p-3.5 bg-surface rounded-card border border-border space-y-2.5">
                  <Skeleton className="aspect-[4/5] w-full rounded-md" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-full rounded-input mt-3" />
                </div>
              ))}
            </div>
          ) : productsData && productsData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {productsData.items.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Numerical Pagination */}
              <Pagination
                currentPage={productsData.page}
                totalPages={productsData.totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          ) : (
            <EmptyState
              title="No Products Match Your Filters"
              description="Try clearing some of your selected filters or searching with a different term to explore our catalog."
              actionText="Reset All Filters"
              onAction={resetAllFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer / Sheet */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-primary/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-surface h-full shadow-2xl p-5 flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-accent" />
                <span>Filters</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-4">
              <PriceRangeSlider
                min={0}
                max={3000}
                currentMin={priceRange.min}
                currentMax={priceRange.max}
                onChange={(min, max) => setPriceRange({ min, max })}
              />

              <FilterAccordionItem
                title="Brand"
                options={availableBrands}
                selectedValues={selectedBrands}
                onChange={(vals) => setSelectedBrands(vals)}
              />

              <div className="py-3 border-b border-border space-y-2">
                <h4 className="text-xs font-bold text-text-primary tracking-wide">Rating</h4>
                <div className="space-y-1">
                  {[4, 3, 2].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRating(selectedRating === r ? null : r)}
                      className={`w-full flex items-center justify-between text-xs py-1 px-2 rounded-input ${
                        selectedRating === r ? 'bg-accent/10 font-bold text-accent' : 'text-text-primary'
                      }`}
                    >
                      <span>{r}★ & above</span>
                      {selectedRating === r && <Check className="h-3.5 w-3.5 text-accent" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-border flex gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={resetAllFilters}
                className="flex-1 font-bold text-xs"
              >
                Reset
              </Button>
              <Button
                variant="accent"
                size="default"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 font-bold text-xs"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
