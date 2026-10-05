import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TrustStripItemProps {
  icon: LucideIcon | React.ReactNode;
  title: string;
  subtitle: string;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export const TrustStripItem: React.FC<TrustStripItemProps> = ({
  icon: Icon,
  title,
  subtitle,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
  className,
}) => {
  const renderIcon = () => {
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    if (Icon) {
      const IconComponent = Icon as React.ElementType;
      return <IconComponent className="h-5 w-5" />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        'bg-surface p-4 rounded-card border border-border shadow-card flex items-center gap-3.5 transition-transform hover:-translate-y-0.5',
        className
      )}
    >
      <div
        className={cn(
          'w-11 h-11 rounded-pill flex items-center justify-center shrink-0 shadow-xs',
          iconBgColor,
          iconColor
        )}
      >
        {renderIcon()}
      </div>
      <div>
        <h4 className="text-xs font-bold text-text-primary tracking-tight">{title}</h4>
        <p className="text-[11px] text-text-muted mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
};
