import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
  timestamp?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  variant = 'horizontal',
  className,
}) => {
  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-6', className)}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative flex items-start gap-4 group">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-4 top-8 -bottom-6 w-0.5 -translate-x-1/2',
                    isCompleted ? 'bg-success' : 'bg-border'
                  )}
                />
              )}

              {/* Step indicator circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-pill flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-colors shadow-xs',
                  isCompleted
                    ? 'bg-success text-surface'
                    : isCurrent
                    ? 'bg-accent text-surface ring-4 ring-accent/20'
                    : 'bg-surface border-2 border-border text-text-muted'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>

              {/* Step label & details */}
              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={cn(
                      'text-xs font-bold',
                      isCurrent ? 'text-accent' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                    )}
                  >
                    {step.label}
                  </h4>
                  {step.timestamp && (
                    <span className="text-[10px] text-text-muted font-normal">
                      {step.timestamp}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-[11px] text-text-muted mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (e.g. 3-step Checkout: Address -> Payment -> Review)
  return (
    <div className={cn('w-full py-4', className)}>
      <div className="flex items-center justify-between relative max-w-xl mx-auto">
        {/* Background connector bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />

        {/* Active progress bar */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-accent -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 sm:w-9 sm:h-9 rounded-pill flex items-center justify-center font-extrabold text-xs transition-colors shadow-xs',
                  isCompleted
                    ? 'bg-success text-surface'
                    : isCurrent
                    ? 'bg-accent text-surface ring-4 ring-accent/20'
                    : 'bg-surface border-2 border-border text-text-muted'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-[11px] sm:text-xs font-bold tracking-tight text-center',
                  isCurrent ? 'text-accent' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
