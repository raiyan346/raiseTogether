import { cn } from '@/utils/helpers';
import { forwardRef, useId } from 'react';

const Input = forwardRef(({ className, label, error, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm text-muted font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          'flex h-11 w-full rounded-xl glass px-4 py-2 text-sm text-foreground placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300',
          error && 'ring-2 ring-white/30',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-white/60">
          {error}
        </p>
      )}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
