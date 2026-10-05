import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

export interface CategoryTileProps {
  category: Category;
  className?: string;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({ category, className }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className={cn(
        'group flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-card p-1.5 transition-transform hover:-translate-y-1',
        className
      )}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-pill overflow-hidden bg-surface border-2 border-border group-hover:border-accent shadow-sm group-hover:shadow-md transition-all p-0.5">
        <img
          src={
            category.image?.url ||
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'
          }
          alt={category.name}
          className="w-full h-full object-cover rounded-pill group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <span className="mt-2 text-xs font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-1 max-w-[90px]">
        {category.name}
      </span>
    </Link>
  );
};
