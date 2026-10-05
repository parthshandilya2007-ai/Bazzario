import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded'
  | 'pending'
  | 'paid'
  | 'failed';

export interface StatusPillProps {
  status: StatusType | string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, className }) => {
  const normalized = status.toLowerCase();

  const getStatusStyles = () => {
    switch (normalized) {
      case 'delivered':
      case 'paid':
      case 'active':
        return 'bg-success/15 text-success border-success/30';
      case 'shipped':
      case 'out_for_delivery':
      case 'packed':
        return 'bg-warning/15 text-warning border-warning/30';
      case 'confirmed':
      case 'placed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled':
      case 'failed':
      case 'rejected':
        return 'bg-danger/15 text-danger border-danger/30';
      case 'return_requested':
      case 'returned':
      case 'refunded':
        return 'bg-accent/15 text-accent border-accent/30';
      default:
        return 'bg-border text-text-muted border-border';
    }
  };

  const getStatusLabel = () => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-pill text-[11px] font-bold tracking-wide border',
        getStatusStyles(),
        className
      )}
    >
      {getStatusLabel()}
    </span>
  );
};
