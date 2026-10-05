import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, ArrowLeft, ShoppingBag, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickLinks = [
    { label: 'Smartphones', path: '/category/smartphones' },
    { label: 'Laptops', path: '/category/laptops' },
    { label: "Men's Fashion", path: '/category/mens-fashion' },
    { label: 'Headphones', path: '/category/headphones' },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Visual 404 Badge */}
        <div className="relative flex items-center justify-center">
          <div className="text-[110px] sm:text-[140px] font-black tracking-tighter text-primary/10 select-none">
            404
          </div>
          <div className="absolute flex flex-col items-center">
            <div className="h-20 w-20 rounded-2xl bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-accent shadow-lg mb-2">
              <ShoppingBag className="h-10 w-10 animate-bounce" />
            </div>
            <span className="px-3 py-1 rounded-pill bg-accent text-white text-[11px] font-extrabold uppercase tracking-wider shadow">
              Page Not Found
            </span>
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Oops! This product or page went out of stock
          </h1>
          <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              type="search"
              placeholder="Search products, brands and categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11 text-xs"
            />
          </div>
          <Button type="submit" variant="accent" size="default" className="font-bold text-xs px-5">
            Search
          </Button>
        </form>

        {/* Popular Shortcuts */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-text-muted flex items-center justify-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-accent" /> Popular categories to explore:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((ql) => (
              <Link
                key={ql.path}
                to={ql.path}
                className="px-3 py-1.5 rounded-pill bg-surface border border-border text-xs font-semibold text-text-primary hover:border-primary hover:text-primary hover:shadow-sm transition-all"
              >
                {ql.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto font-bold text-xs"
          >
            <Home className="h-4 w-4 mr-2" /> Back to Bazaario Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto font-bold text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Go to Previous Page
          </Button>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
