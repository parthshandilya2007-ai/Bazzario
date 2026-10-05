import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-surface/90 pt-12 pb-8 border-t border-primary/40 mt-auto">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Blurb */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-input bg-accent flex items-center justify-center font-extrabold text-xl text-surface shadow-sm">
                B
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-surface">Bazaario</span>
            </div>
            <p className="text-xs text-surface/70 leading-relaxed">
              India&apos;s trusted multi-category marketplace. Discover authentic fashion, home essentials,
              beauty, and electronics direct from verified suppliers at unbeatable factory prices.
            </p>
            <div className="pt-2 space-y-2 text-xs text-surface/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span>Indiranagar 100ft Rd, Bengaluru, KA 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>support@bazaario.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>1800-889-2299 (Toll Free)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Categories */}
          <div>
            <h4 className="text-sm font-bold text-surface tracking-wider uppercase mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-surface/75">
              <li>
                <Link to="/category/women-ethnic" className="hover:text-accent transition-colors">
                  Women Ethnic & Sarees
                </Link>
              </li>
              <li>
                <Link to="/category/women-western" className="hover:text-accent transition-colors">
                  Western Wear & Dresses
                </Link>
              </li>
              <li>
                <Link to="/category/men-fashion" className="hover:text-accent transition-colors">
                  Men&apos;s Shirts & Jeans
                </Link>
              </li>
              <li>
                <Link to="/category/kids-baby" className="hover:text-accent transition-colors">
                  Baby Care & Kids Fashion
                </Link>
              </li>
              <li>
                <Link to="/category/home-kitchen" className="hover:text-accent transition-colors">
                  Home Decor & Kitchen
                </Link>
              </li>
              <li>
                <Link to="/category/beauty-health" className="hover:text-accent transition-colors">
                  Beauty & Personal Care
                </Link>
              </li>
              <li>
                <Link to="/category/budget-buys" className="hover:text-accent transition-colors">
                  Budget Buys Under ₹499
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Help & Policies */}
          <div>
            <h4 className="text-sm font-bold text-surface tracking-wider uppercase mb-4">
              Customer Help
            </h4>
            <ul className="space-y-2 text-xs text-surface/75">
              <li>
                <Link to="/orders" className="hover:text-accent transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/help/returns" className="hover:text-accent transition-colors">
                  7-Day Return Policy
                </Link>
              </li>
              <li>
                <Link to="/help/shipping" className="hover:text-accent transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link to="/help/cod" className="hover:text-accent transition-colors">
                  Cash on Delivery (COD) Rules
                </Link>
              </li>
              <li>
                <Link to="/help/faq" className="hover:text-accent transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/help/contact" className="hover:text-accent transition-colors">
                  Customer Grievances
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Sell On Bazaario */}
          <div>
            <h4 className="text-sm font-bold text-surface tracking-wider uppercase mb-4">
              Partner & Company
            </h4>
            <ul className="space-y-2 text-xs text-surface/75">
              <li>
                <Link to="/seller/register" className="hover:text-accent transition-colors">
                  Become a Seller (0% Commission)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  About Bazaario
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-accent transition-colors">
                  Careers & Hiring
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Value Prop Badges */}
        <div className="py-6 border-t border-b border-surface/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Truck className="h-5 w-5 text-accent" />
            <span className="text-xs font-semibold text-surface">Free Delivery Above ₹499</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="h-5 w-5 text-accent" />
            <span className="text-xs font-semibold text-surface">7 Days Easy Return</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="text-xs font-semibold text-surface">100% Genuine Products</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-base font-bold text-accent">₹</span>
            <span className="text-xs font-semibold text-surface">Cash on Delivery Available</span>
          </div>
        </div>

        {/* Bottom Bar: Payment Logos & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-surface/60">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-surface/80">Secure Payments:</span>
            <span className="px-2 py-0.5 bg-surface text-text-primary rounded font-bold text-[10px]">UPI</span>
            <span className="px-2 py-0.5 bg-surface text-text-primary rounded font-bold text-[10px]">VISA</span>
            <span className="px-2 py-0.5 bg-surface text-text-primary rounded font-bold text-[10px]">MASTERCARD</span>
            <span className="px-2 py-0.5 bg-surface text-text-primary rounded font-bold text-[10px]">RUPAY</span>
            <span className="px-2 py-0.5 bg-surface text-text-primary rounded font-bold text-[10px]">COD</span>
          </div>
          <p>© {new Date().getFullYear()} Bazaario Marketplace Technologies Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
