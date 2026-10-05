import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  delta?: {
    percent: number;
    isPositive: boolean;
    period?: string;
  };
  icon?: LucideIcon;
  sparklineData?: number[];
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  icon: Icon,
  sparklineData = [20, 40, 35, 50, 45, 70, 65, 90],
  className,
}) => {
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  // Simple clean SVG sparkline
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 100;
      const y = 30 - ((val - min) / range) * 25;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className={cn(
        'bg-surface rounded-card border border-border p-5 shadow-card flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-input bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="my-3 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">{value}</h3>

        {delta && (
          <div
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[11px] font-extrabold border shadow-xs',
              delta.isPositive
                ? 'bg-success/10 text-success border-success/30'
                : 'bg-danger/10 text-danger border-danger/30'
            )}
          >
            {delta.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{delta.percent}%</span>
          </div>
        )}
      </div>

      {/* Mini SVG Sparkline Chart */}
      <div className="w-full h-8 pt-1 flex items-end">
        <svg viewBox="0 0 100 32" className="w-full h-full overflow-visible">
          <polyline
            fill="none"
            stroke={delta?.isPositive !== false ? '#12855F' : '#C0392B'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      {delta?.period && <p className="text-[10px] text-text-muted mt-2">{delta.period}</p>}
    </div>
  );
};
