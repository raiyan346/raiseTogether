import { cn } from '@/utils/helpers';
import { motion } from 'framer-motion';

export function Card({ className, children, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-2xl border border-border bg-surface p-6 shadow-sm transition-colors hover:bg-surface-hover hover:border-white/12',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-semibold tracking-tight', className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-sm text-muted mt-1', className)}>{children}</p>;
}

export function CardContent({ className, children }) {
  return <div className={cn('', className)}>{children}</div>;
}
