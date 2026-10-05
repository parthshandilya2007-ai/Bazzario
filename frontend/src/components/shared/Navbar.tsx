import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Package,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useCart } from '@/api/cart.api';
import { useWishlistStore } from '@/store/useWishlistStore';

const CATEGORIES = [
  'All',
  'Women Ethnic',
  'Women Western',
  'Men Fashion',
  'Kids & Baby',
  'Home & Kitchen',
  'Beauty & Health',
  'Electronics',
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, role, logout } = useAuthStore();
  const {
    openCartDrawer,
    searchQuery,
    setSearchQuery,
    selectedSearchCategory,
    setSelectedSearchCategory,
    isMobileMenuOpen,
    setMobileMenuOpen,
  } = useUIStore();

  // Real-time Cart and Wishlist Queries & Stores
  const { data: cart } = useCart();
  const wishlistItems = useWishlistStore((state) => state.items);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Dynamic real-time cart badge calculation (sums all quantities or items)
  const cartCount = cart?.items?.reduce((total, item) => total + (item.qty || 1), 0) ?? 0;
  const wishlistCount = wishlistItems.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const catParam =
        selectedSearchCategory !== 'All' ? `&category=${encodeURIComponent(selectedSearchCategory)}` : '';
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}${catParam}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-surface shadow-md">
      {/* Top Banner / Announcement */}
      <div className="bg-[#1E2050] py-1 px-4 text-center text-xs font-medium text-surface/90 border-b border-primary/40 hidden sm:block">
        ⚡ Super Saver Deals: Free Delivery on orders over ₹499 • 7 Days Easy Returns
      </div>

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 -ml-1 text-surface hover:text-accent lg:hidden focus:outline-none focus:ring-2 focus:ring-accent rounded-md"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-input bg-accent flex items-center justify-center font-extrabold text-2xl text-surface shadow-sm group-hover:scale-105 transition-transform">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-surface">
                  Bazaario
                </span>
                <span className="text-[10px] text-surface/70 uppercase tracking-wider font-semibold -mt-1 hidden sm:block">
                  Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Centre: Category-Scoped Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl hidden md:flex items-center relative"
          >
            <div className="flex w-full rounded-pill bg-surface text-text-primary p-1 shadow-inner border border-border focus-within:ring-2 focus-within:ring-accent">
              {/* Category selector dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="h-9 px-3.5 bg-background rounded-l-pill text-xs font-semibold text-text-primary flex items-center gap-1.5 hover:bg-[#EAE7E0] transition-colors border-r border-border"
                >
                  <span className="truncate max-w-[100px]">{selectedSearchCategory}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-11 left-0 w-48 bg-surface rounded-card shadow-xl border border-border py-1.5 z-50 text-xs">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedSearchCategory(cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-background transition-colors ${
                          selectedSearchCategory === cat ? 'font-bold text-accent' : 'text-text-primary'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search text input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Kurtis, T-shirts, Saree, Shoes, Home decor..."
                className="flex-1 px-4 py-1 text-sm bg-transparent outline-none placeholder:text-text-muted text-text-primary"
              />

              {/* Search action button */}
              <button
                type="submit"
                className="h-9 px-4 bg-accent hover:bg-accent-hover text-surface rounded-r-pill flex items-center justify-center transition-colors font-medium"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right Action Icons: Admin Pill, Wishlist, Cart, Account */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Admin Pill Button (Visible if role === 'admin' or for demo testing) */}
            {(role === 'admin' || user?.role === 'admin') && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-surface text-xs font-bold rounded-pill shadow-sm transition-transform active:scale-95"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Wishlist Link */}
            <Link
              to="/account/wishlist"
              className="relative p-2 text-surface hover:text-accent transition-colors rounded-pill hover:bg-surface/10 flex flex-col items-center"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-surface text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-pill flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[10px] font-medium hidden lg:block mt-0.5">Wishlist</span>
            </Link>

            {/* Cart Button / Drawer trigger */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 text-surface hover:text-accent transition-colors rounded-pill hover:bg-surface/10 flex flex-col items-center"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-surface text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-pill flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-[10px] font-medium hidden lg:block mt-0.5">Cart</span>
            </button>

            {/* Account / User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-2 text-surface hover:text-accent transition-colors rounded-pill hover:bg-surface/10"
                aria-label="User Account"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-pill bg-surface/20 flex items-center justify-center text-surface font-semibold text-xs border border-surface/30">
                  {isAuthenticated && user?.name ? user.name[0].toUpperCase() : <UserIcon className="h-4 w-4" />}
                </div>
                <ChevronDown className="h-3.5 w-3.5 hidden sm:block text-surface/80" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-surface rounded-card shadow-xl border border-border py-2 z-50 text-text-primary">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs text-text-muted">Signed in as</p>
                        <p className="text-sm font-bold truncate">{user?.name || 'Customer'}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/account/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium hover:bg-background transition-colors"
                      >
                        <UserIcon className="h-4 w-4 text-text-muted" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium hover:bg-background transition-colors"
                      >
                        <Package className="h-4 w-4 text-text-muted" />
                        My Orders
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-accent hover:bg-background transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        Admin Portal
                      </Link>
                      <div className="border-t border-border mt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-danger hover:bg-background transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs text-text-muted">Welcome to Bazaario</p>
                        <p className="text-xs font-semibold text-text-primary">Access account & track orders</p>
                      </div>
                      <div className="p-3 flex flex-col gap-2">
                        <Link
                          to="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full text-center py-2 bg-accent hover:bg-accent-hover text-surface text-xs font-bold rounded-input shadow-sm transition-colors"
                        >
                          Sign In / Register
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Below main row on small screens) */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex w-full">
            <div className="flex w-full rounded-pill bg-surface text-text-primary p-1 shadow-inner border border-border">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 px-3 py-1 text-xs bg-transparent outline-none text-text-primary placeholder:text-text-muted"
              />
              <button
                type="submit"
                className="h-8 px-3 bg-accent text-surface rounded-pill flex items-center justify-center font-medium"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
