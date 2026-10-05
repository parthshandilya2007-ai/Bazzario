import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { CartDrawer } from '@/components/shared/CartDrawer';
import { cn } from '@/lib/utils';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar />
      <main className={cn('flex-1 w-full', !isHomePage && 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6')}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
