import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct, useProductRail } from '@/api/products.api';
import { useAddToCart } from '@/api/cart.api';
import { useLiveInvalidate } from '@/hooks/useLiveInvalidate';
import { RatingPill } from '@/components/shared/RatingPill';
import { DiscountBadge } from '@/components/shared/DiscountBadge';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ProductRail } from '@/components/shared/ProductRail';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RefreshCw,
  ShieldCheck,
  MapPin,
  Star,
  CheckCircle2,
  Store,
  Share2,
  ThumbsUp,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLOURS = [
  { name: 'Maroon', hex: '#800000' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Olive Green', hex: '#556B2F' },
  { name: 'Jet Black', hex: '#1A1A1F' },
];

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useProduct(slug || '');
  const { data: similarProducts } = useProductRail('trending');
  const addToCartMutation = useAddToCart();

  // State
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColour, setSelectedColour] = useState('Maroon');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    deliverable: boolean;
    eta?: string;
    isCOD?: boolean;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'seller'>('details');
  const [helpfulUpvotes, setHelpfulUpvotes] = useState<Record<string, number>>({
    'rev-1': 142,
    'rev-2': 89,
  });

  const targetProductId = product?._id || slug || '';

  // Real-time Push Updates: PDP Room Subscription
  useLiveInvalidate(
    targetProductId ? `product:${targetProductId}` : null,
    'product:updated',
    () => [['product', slug], ['product', product?._id]],
    {
      toastMessage: (payload) => {
        if (payload?.stock === 0) {
          return { title: 'Inventory Alert', description: 'This item just went out of stock.' };
        }
        return { title: 'Live Update', description: 'Product details or pricing were updated live.' };
      },
    }
  );

  useLiveInvalidate(
    targetProductId ? `product:${targetProductId}` : null,
    'product:deleted',
    () => [['product', slug], ['product', product?._id]],
    {
      onEvent: () => {
        setIsDeleted(true);
      },
      toastMessage: {
        title: 'Product Unavailable',
        description: 'This product is no longer available in the catalog.',
      },
    }
  );

  // Fallback listener for slug-based room if different from _id
  useLiveInvalidate(
    slug && product?._id && product._id !== slug ? `product:${slug}` : null,
    'product:updated',
    () => [['product', slug], ['product', product?._id]]
  );
  useLiveInvalidate(
    slug && product?._id && product._id !== slug ? `product:${slug}` : null,
    'product:deleted',
    () => [['product', slug], ['product', product?._id]],
    {
      onEvent: () => setIsDeleted(true),
    }
  );

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus({
        checked: true,
        deliverable: true,
        eta: 'Thursday, 24 Sep',
        isCOD: true,
      });
    }
  };

  const handleAddToCart = () => {
    if (product && !isDeleted && (product.stock ?? 0) > 0) {
      addToCartMutation.mutate({ product, qty: 1 });
    }
  };

  const handleBuyNow = () => {
    if (product && !isDeleted && (product.stock ?? 0) > 0) {
      addToCartMutation.mutate({ product, qty: 1 });
      navigate('/checkout');
    }
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulUpvotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-8 py-6">
        <Skeleton className="h-6 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-card" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-input" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-32 w-full rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-primary">Product Not Found</h2>
        <Button asChild variant="accent">
          <Link to="/">Back to Homepage</Link>
        </Button>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' }];

  return (
    <div className="space-y-12 pb-24 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Catalog', path: '/search' },
          {
            label: typeof product.category === 'object' ? product.category.name : 'Ethnic Wear',
            path: `/category/${typeof product.category === 'object' ? product.category.slug : 'women-ethnic'}`,
          },
          { label: product.title },
        ]}
      />

      {/* Real-time Product Removed / Unavailable Banner */}
      {isDeleted && (
        <div className="p-4 sm:p-5 rounded-card bg-danger/10 border-2 border-danger text-danger flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 shrink-0 text-danger" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">This product is no longer available</h3>
              <p className="text-xs text-text-muted mt-0.5">
                This item has been removed from the catalog. Orders cannot be placed for this item.
              </p>
            </div>
          </div>
          <Link to="/search">
            <Button size="sm" variant="outline-primary" className="text-xs font-bold shrink-0 w-full sm:w-auto">
              Browse Other Products
            </Button>
          </Link>
        </div>
      )}

      {/* Main Product Showcase: Gallery (Left) & Buy Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image Box */}
          <div className="relative aspect-[4/5] bg-surface rounded-card border border-border overflow-hidden shadow-card group">
            <img
              src={images[selectedImageIndex]?.url || images[0].url}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top-Left Discount Badge */}
            {product.discountPercent > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <DiscountBadge percent={product.discountPercent} size="lg" />
              </div>
            )}

            {/* Top-Right Action Badges */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-10 h-10 rounded-pill bg-surface/90 backdrop-blur-xs flex items-center justify-center text-text-primary hover:text-accent shadow-sm transition-transform active:scale-90"
                aria-label="Wishlist"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-accent text-accent' : 'text-text-primary'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.title, url: window.location.href });
                  }
                }}
                className="w-10 h-10 rounded-pill bg-surface/90 backdrop-blur-xs flex items-center justify-center text-text-primary hover:text-primary shadow-sm transition-transform active:scale-90"
                aria-label="Share product"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-16 h-20 rounded-input overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImageIndex === idx
                    ? 'border-accent shadow-sm scale-105'
                    : 'border-border opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Buy Box & Details */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              {product.brand || 'Bazaario Prime'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight mt-1 leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Rating Pill & Verified Badge */}
          <div className="flex items-center gap-3">
            <RatingPill rating={product.ratingAvg} count={product.ratingCount} size="default" />
            <span className="text-xs text-text-muted flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Verified Purchase Ratings
            </span>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-surface rounded-card border border-border shadow-xs space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-text-primary tracking-tight">
                {formatPrice(product.finalPrice)}
              </span>
              {product.basePrice > product.finalPrice && (
                <span className="text-sm font-semibold text-text-muted line-through">
                  {formatPrice(product.basePrice)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="text-xs font-extrabold text-accent">
                  Save {formatPrice(product.basePrice - product.finalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted">Inclusive of all taxes • Free Shipping</p>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-text-primary">Select Size:</span>
              <button type="button" className="text-accent font-semibold hover:underline">
                Size Chart
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[44px] h-10 px-3 rounded-input text-xs font-bold transition-all border ${
                    selectedSize === size
                      ? 'border-accent bg-accent/10 text-accent ring-2 ring-accent/30 shadow-xs'
                      : 'border-border bg-surface text-text-primary hover:bg-background'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colour Selector */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-text-primary">
              Select Colour: <span className="text-text-muted font-normal">{selectedColour}</span>
            </span>
            <div className="flex items-center gap-3">
              {COLOURS.map((col) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColour(col.name)}
                  className={`w-7 h-7 rounded-pill border-2 transition-transform ${
                    selectedColour === col.name
                      ? 'border-accent scale-110 shadow-sm ring-2 ring-accent/30'
                      : 'border-surface'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                  aria-label={col.name}
                />
              ))}
            </div>
          </div>

          {/* Pincode & Delivery Serviceability Check */}
          <div className="p-4 bg-background rounded-card border border-border space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <MapPin className="h-4 w-4 text-accent" />
              <span>Check Delivery & COD Availability</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <Input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className="max-w-[200px] h-9 text-xs"
              />
              <Button type="submit" variant="outline-accent" size="sm" className="font-bold">
                Check
              </Button>
            </form>

            {pincodeStatus?.checked && (
              <div className="pt-2 text-xs text-success font-semibold space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Deliverable by {pincodeStatus.eta}</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted text-[11px]">
                  <span>• Cash on Delivery Available</span>
                  <span>• 7-Day Doorstep Returns</span>
                </div>
              </div>
            )}
          </div>

          {product.stock === 0 && (
            <div className="p-3 rounded-card bg-danger/10 border border-danger/30 text-danger text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Currently Out of Stock. Please check back later or explore similar products.</span>
            </div>
          )}

          {/* Primary Action Buttons (Desktop) */}
          <div className="hidden lg:grid grid-cols-2 gap-4 pt-2">
            <Button
              type="button"
              variant="outline-primary"
              size="lg"
              disabled={product.stock === 0 || isDeleted}
              onClick={handleAddToCart}
              className={cn(
                'font-bold gap-2 text-sm shadow-xs',
                (product.stock === 0 || isDeleted) && 'opacity-60 cursor-not-allowed bg-background text-text-muted border-border hover:bg-background hover:text-text-muted'
              )}
            >
              <ShoppingBag className="h-4 w-4" /> {isDeleted ? 'No Longer Available' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              type="button"
              variant="accent"
              size="lg"
              disabled={product.stock === 0 || isDeleted}
              onClick={handleBuyNow}
              className={cn(
                'font-bold gap-2 text-sm shadow-md',
                (product.stock === 0 || isDeleted) && 'opacity-60 cursor-not-allowed bg-border text-text-muted shadow-none hover:bg-border'
              )}
            >
              <Zap className="h-4 w-4" /> {isDeleted ? 'Unavailable' : product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
            <div className="flex flex-col items-center p-2 rounded-input bg-surface border border-border">
              <Truck className="h-4 w-4 text-accent mb-1" />
              <span className="text-[10px] font-bold text-text-primary">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-input bg-surface border border-border">
              <RefreshCw className="h-4 w-4 text-accent mb-1" />
              <span className="text-[10px] font-bold text-text-primary">7-Day Returns</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-input bg-surface border border-border">
              <ShieldCheck className="h-4 w-4 text-accent mb-1" />
              <span className="text-[10px] font-bold text-text-primary">100% Genuine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Product Details, Reviews, Seller Info */}
      <section className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <div className="flex border-b border-border bg-background px-4 sm:px-6">
          {[
            { id: 'details', label: 'Product Details' },
            { id: 'reviews', label: `Ratings & Reviews (${product.ratingCount})` },
            { id: 'seller', label: 'Seller Information' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'details' | 'reviews' | 'seller')}
              className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-extrabold transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-accent text-accent bg-surface'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-extrabold text-primary mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-input bg-background border border-border">
                  <span className="text-[11px] text-text-muted">Fabric / Material</span>
                  <p className="text-xs font-bold text-text-primary mt-0.5">100% Rayon Cotton</p>
                </div>
                <div className="p-3 rounded-input bg-background border border-border">
                  <span className="text-[11px] text-text-muted">Pattern</span>
                  <p className="text-xs font-bold text-text-primary mt-0.5">Embroidered Floral</p>
                </div>
                <div className="p-3 rounded-input bg-background border border-border">
                  <span className="text-[11px] text-text-muted">Fit Type</span>
                  <p className="text-xs font-bold text-text-primary mt-0.5">Regular Fit Anarkali</p>
                </div>
                <div className="p-3 rounded-input bg-background border border-border">
                  <span className="text-[11px] text-text-muted">Wash Care</span>
                  <p className="text-xs font-bold text-text-primary mt-0.5">Gentle Machine Wash</p>
                </div>
                <div className="p-3 rounded-input bg-background border border-border">
                  <span className="text-[11px] text-text-muted">Country of Origin</span>
                  <p className="text-xs font-bold text-text-primary mt-0.5">India (Make in India)</p>
                </div>
                <div className="p-3 rounded-input bg-background border border-border">
                  <span className="text-[11px] text-text-muted">Return Window</span>
                  <p className="text-xs font-bold text-text-primary mt-0.5">7 Days Doorstep</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Rating Overview & Distribution Bars */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-6 border-b border-border">
                <div className="md:col-span-4 text-center md:text-left space-y-1">
                  <div className="text-4xl font-extrabold text-primary">{product.ratingAvg.toFixed(1)}</div>
                  <div className="flex justify-center md:justify-start text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted">
                    Based on {product.ratingCount.toLocaleString('en-IN')} verified customer reviews
                  </p>
                </div>

                {/* 5-Star Distribution Bars */}
                <div className="md:col-span-8 space-y-1.5 max-w-md">
                  {[
                    { stars: 5, pct: 68 },
                    { stars: 4, pct: 20 },
                    { stars: 3, pct: 7 },
                    { stars: 2, pct: 3 },
                    { stars: 1, pct: 2 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2 text-xs">
                      <span className="w-6 font-bold text-text-muted text-right">{row.stars}★</span>
                      <div className="flex-1 h-2 rounded-pill bg-background overflow-hidden border border-border">
                        <div
                          className="h-full bg-success rounded-pill"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-[11px] text-text-muted">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Customer Reviews List */}
              <div className="space-y-4">
                {[
                  {
                    id: 'rev-1',
                    author: 'Priya Sharma',
                    date: '18 Sep 2026',
                    rating: 5,
                    title: 'Superb quality and exactly like the picture!',
                    comment:
                      'The fabric is very soft and comfortable for daily wear. Stitching is neat and fitting is perfect. Delivered within 3 days in Bengaluru. Highly recommended!',
                    verified: true,
                  },
                  {
                    id: 'rev-2',
                    author: 'Ritu Verma',
                    date: '12 Sep 2026',
                    rating: 4,
                    title: 'Value for money product',
                    comment:
                      'Good color, doesn’t fade after first wash. Dupatta length is also generous. Overall great purchase at this price point.',
                    verified: true,
                  },
                ].map((rev) => (
                  <div key={rev.id} className="p-4 rounded-card bg-background border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RatingPill rating={rev.rating} size="sm" />
                        <span className="text-xs font-bold text-text-primary">{rev.title}</span>
                      </div>
                      <span className="text-[11px] text-text-muted">{rev.date}</span>
                    </div>
                    <p className="text-xs text-text-primary leading-relaxed">{rev.comment}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-success font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified Purchase • {rev.author}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleHelpful(rev.id)}
                        className="text-[11px] font-bold text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
                      >
                        <ThumbsUp className="h-3 w-3" /> Helpful ({helpfulUpvotes[rev.id] || 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seller' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3.5 p-4 rounded-card bg-background border border-border">
                <div className="w-12 h-12 rounded-pill bg-accent/15 text-accent flex items-center justify-center font-bold">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-primary">
                    {typeof product.seller === 'object' ? product.seller.storeName : 'Vandana Creations Surat'}
                  </h4>
                  <p className="text-xs text-text-muted">
                    Surat Garments Hub • Verified Manufacturer on Bazaario
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-background rounded-input border border-border">
                  <span className="text-base font-extrabold text-success">4.6 ★</span>
                  <p className="text-[10px] text-text-muted uppercase mt-0.5">Supplier Rating</p>
                </div>
                <div className="p-3 bg-background rounded-input border border-border">
                  <span className="text-base font-extrabold text-primary">12,500+</span>
                  <p className="text-[10px] text-text-muted uppercase mt-0.5">Total Orders</p>
                </div>
                <div className="p-3 bg-background rounded-input border border-border">
                  <span className="text-base font-extrabold text-accent">98%</span>
                  <p className="text-[10px] text-text-muted uppercase mt-0.5">On-Time Dispatch</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Similar Products Rail */}
      {similarProducts && (
        <ProductRail
          emoji="✨"
          title="Similar Styles You May Like"
          subtitle="Customers who viewed this also loved these picks"
          seeAllLink="/search"
          products={similarProducts}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 px-4 flex items-center justify-between gap-3 shadow-2xl lg:hidden">
        <div className="flex flex-col">
          <span className="text-lg font-extrabold text-text-primary leading-tight">
            {formatPrice(product.finalPrice)}
          </span>
          <span className="text-[10px] text-success font-bold">Free Delivery</span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Button
            type="button"
            variant="outline-primary"
            size="default"
            disabled={product.stock === 0 || isDeleted}
            onClick={handleAddToCart}
            className={cn(
              'font-bold text-xs flex-1 max-w-[140px]',
              (product.stock === 0 || isDeleted) && 'opacity-60 cursor-not-allowed bg-background text-text-muted border-border'
            )}
          >
            {isDeleted ? 'Unavailable' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button
            type="button"
            variant="accent"
            size="default"
            disabled={product.stock === 0 || isDeleted}
            onClick={handleBuyNow}
            className={cn(
              'font-bold text-xs flex-1 max-w-[140px]',
              (product.stock === 0 || isDeleted) && 'opacity-60 cursor-not-allowed bg-border text-text-muted shadow-none'
            )}
          >
            {isDeleted ? 'Unavailable' : product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};
