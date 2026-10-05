import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-surface hover:bg-primary-hover active:scale-[0.98]',
        accent: 'bg-accent text-surface hover:bg-accent-hover shadow-sm active:scale-[0.98]',
        outline:
          'border border-border bg-surface text-text-primary hover:bg-background hover:text-text-primary active:scale-[0.98]',
        'outline-primary':
          'border border-primary text-primary bg-surface hover:bg-primary hover:text-surface active:scale-[0.98]',
        'outline-accent':
          'border border-accent text-accent bg-surface hover:bg-accent hover:text-surface active:scale-[0.98]',
        'outline-light':
          'border border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white active:scale-[0.98] backdrop-blur-xs',
        secondary: 'bg-border text-text-primary hover:bg-[#DDD9D2]',
        ghost: 'hover:bg-background text-text-primary hover:text-primary',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-input',
        sm: 'h-8 px-3 text-xs rounded-input',
        lg: 'h-12 px-6 text-base rounded-input',
        pill: 'h-10 px-5 rounded-pill',
        'pill-sm': 'h-7 px-3 text-xs rounded-pill',
        icon: 'h-10 w-10 rounded-input',
        'icon-sm': 'h-8 w-8 rounded-input',
        'icon-pill': 'h-9 w-9 rounded-pill',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
