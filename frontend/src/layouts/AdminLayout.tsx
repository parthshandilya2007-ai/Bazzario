import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Tag,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { label: 'Categories', path: '/admin/categories', icon: FolderTree },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Coupons', path: '/admin/coupons', icon: Tag },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-primary text-surface transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } border-r border-primary/50 shrink-0 sticky top-0 h-screen`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-surface/10">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-input bg-accent flex items-center justify-center font-bold text-lg text-surface">
                B
              </div>
              <span className="font-extrabold text-xl tracking-tight text-surface">Bazaario</span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto w-8 h-8 rounded-input bg-accent flex items-center justify-center font-bold text-lg text-surface">
              B
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-surface/10 text-surface/80"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-input text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent text-surface shadow-sm'
                    : 'text-surface/80 hover:bg-surface/10 hover:text-surface'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-surface/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-input text-xs font-medium text-surface/70 hover:bg-surface/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-input text-xs font-medium text-danger hover:bg-surface/10 transition-colors text-left"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-primary text-surface flex items-center justify-between px-4 md:hidden sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 rounded-md">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <span className="font-bold text-lg">Admin Portal</span>
          </div>
          <Link to="/" className="text-xs text-accent font-semibold">
            Store
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
