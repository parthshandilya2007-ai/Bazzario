import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlightText?: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  imageAlt: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: '1',
    eyebrow: '⚡ Festive Mega Savings Live',
    title: 'Lowest Wholesale Prices,',
    highlightText: 'Direct From Makers.',
    subtext:
      'Shop lakhs of verified supplier styles in Kurtis, Sarees, Western, Shirts & Footwear with Free Delivery.',
    ctaText: 'Shop Trending Now',
    ctaLink: '/search?sort=popular',
    secondaryCtaText: 'Under ₹499 Store',
    secondaryCtaLink: '/search?maxPrice=499',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Ethnic Fashion Festive Collection',
  },
  {
    id: '2',
    eyebrow: '🔥 Season Clearance Specials',
    title: 'Men & Women Casuals,',
    highlightText: 'Up to 70% Off.',
    subtext:
      'Pure combed cotton shirts, dresses, sneakers and gym wear starting at just ₹299 with Cash on Delivery.',
    ctaText: 'Explore Casuals',
    ctaLink: '/category/men-fashion',
    secondaryCtaText: 'Women Western',
    secondaryCtaLink: '/category/women-western',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Western Wear Collection',
  },
  {
    id: '3',
    eyebrow: '✨ Kitchen & Home Revamp',
    title: 'Transform Your Home,',
    highlightText: 'Unbeatable Factory Rates.',
    subtext: 'Bedsheets, cookware sets, organizer storage, and ambient lighting with 7-day doorstep return.',
    ctaText: 'Shop Home Decor',
    ctaLink: '/category/home-kitchen',
    secondaryCtaText: 'Best Sellers',
    secondaryCtaLink: '/search?sort=rating',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Home Decor Collection',
  },
];

export interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number;
  className?: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 6000,
  className,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <section className={cn('relative overflow-hidden w-full bg-primary text-surface shadow-md', className)}>
      {/* Fullscreen Toggle Button */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-9 h-9 rounded-pill bg-primary/60 hover:bg-primary/90 text-surface/80 hover:text-surface flex items-center justify-center backdrop-blur-xs transition-colors border border-surface/20 shadow-xs"
        title={isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen'}
        aria-label="Toggle Full Screen"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] px-6 sm:px-10 lg:px-16 py-12 sm:py-16 gap-8">
        {/* Left Text & CTA Content (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-accent/20 text-accent border border-accent/40 rounded-pill text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{active.eyebrow}</span>
          </div>

          {/* H1 Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-surface leading-[1.12]">
            {active.title} <br className="hidden sm:block" />
            {active.highlightText && <span className="text-accent">{active.highlightText}</span>}
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-surface/85 max-w-xl leading-relaxed font-normal">
            {active.subtext}
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Button asChild variant="accent" size="lg" className="font-bold shadow-md gap-2 px-7 h-12 text-base">
              <Link to={active.ctaLink}>
                {active.ctaText} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {active.secondaryCtaText && (
              <Button
                asChild
                variant="outline-light"
                size="lg"
                className="font-semibold shadow-sm px-6 h-12 text-base"
              >
                <Link to={active.secondaryCtaLink || '/'}>{active.secondaryCtaText}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Right Hero Image Card (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[480px] aspect-[4/4] rounded-card overflow-hidden border-2 border-surface/20 shadow-2xl">
            <img
              src={active.imageUrl}
              alt={active.imageAlt}
              className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Slide Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-pill bg-primary/70 hover:bg-primary text-surface/90 hover:text-surface flex items-center justify-center backdrop-blur-sm transition-all border border-surface/20 shadow-lg hidden sm:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-pill bg-primary/70 hover:bg-primary text-surface/90 hover:text-surface flex items-center justify-center backdrop-blur-sm transition-all border border-surface/20 shadow-lg hidden sm:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2.5 rounded-pill transition-all duration-300',
              currentSlide === index ? 'w-8 bg-accent' : 'w-2.5 bg-surface/40 hover:bg-surface/70'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
