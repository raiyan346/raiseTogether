import { cn } from '@/utils/helpers';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]',
        glass: 'glass glass-hover text-foreground',
        outline: 'border border-border bg-transparent hover:bg-foreground/5',
        ghost: 'hover:bg-foreground/5',
        destructive: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
      },
      size: {
        default: 'h-11 px-6 py-2 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

const Button = forwardRef(({ className, variant, size, type = 'button', ...props }, ref) => (
  <button type={type} className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
));
Button.displayName = 'Button';

export { Button, buttonVariants };
