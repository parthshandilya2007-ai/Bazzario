import React from 'react';
import { LucideIcon, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionText,
  actionLink,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-surface rounded-card border border-border p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-card my-6',
        className
      )}
    >
      <div className="w-16 h-16 rounded-pill bg-background border border-border flex items-center justify-center text-accent mb-4 shadow-inner">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-extrabold text-primary tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-text-muted mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>

      {(actionText && (actionLink || onAction)) && (
        <div className="mt-6">
          {actionLink ? (
            <Button asChild variant="accent" size="default" className="font-bold">
              <Link to={actionLink}>{actionText}</Link>
            </Button>
          ) : (
            <Button variant="accent" size="default" onClick={onAction} className="font-bold">
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
