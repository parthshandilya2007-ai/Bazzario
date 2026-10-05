import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import {
  User as UserIcon,
  MapPin,
  Heart,
  Package,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const ACCOUNT_NAV = [
  { label: 'My Profile', path: '/account/profile', icon: UserIcon },
  { label: 'Saved Addresses', path: '/account/addresses', icon: MapPin },
  { label: 'My Wishlist', path: '/account/wishlist', icon: Heart },
  { label: 'My Orders', path: '/orders', icon: Package },
];

export const AccountLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Account User Header Card */}
      <div className="bg-primary text-surface p-6 rounded-card shadow-card flex items-center gap-4">
        <div className="w-14 h-14 rounded-pill bg-accent text-surface flex items-center justify-center font-extrabold text-xl shadow-md border-2 border-surface/20">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">{user?.name || 'Parth Shandilya'}</h1>
          <p className="text-xs text-surface/75">{user?.email || 'parth@bazaario.in'} • {user?.phone || '+91 98765 43210'}</p>
        </div>
      </div>

      {/* Main Grid: Left Sidebar (4 Cols) + Outlet Content (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Nav */}
        <aside className="lg:col-span-4 bg-surface rounded-card border border-border p-4 shadow-card space-y-1">
          {ACCOUNT_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-input text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-accent text-surface shadow-xs'
                    : 'text-text-primary hover:bg-background hover:text-accent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`h-4 w-4 ${isActive ? 'text-surface' : 'text-text-muted'}`} />
              </Link>
            );
          })}

          <div className="pt-2 border-t border-border mt-2">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-input text-xs font-bold text-danger hover:bg-danger/10 transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Dynamic Page Content */}
        <div className="lg:col-span-8 bg-surface rounded-card border border-border p-6 shadow-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
