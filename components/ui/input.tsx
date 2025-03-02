import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Check, AlertCircle } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  status?: 'default' | 'valid' | 'error';
  statusMessage?: string;
  animation?: 'none' | 'slide' | 'fade';
  showStatusMessage?: boolean;
}

const inputVariants = cva(
  'flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm transition-all duration-200 ease-in-out',
  {
    variants: {
      status: {
        default: 'border-input focus-visible:border-primary',
        valid: 'border-green-500 pr-10',
        error: 'border-red-500 pr-10',
      },
      animation: {
        none: '',
        slide: 'transform-gpu focus-visible:translate-y-[-2px]',
        fade: 'opacity-90 focus-visible:opacity-100',
      },
    },
    defaultVariants: {
      status: 'default',
      animation: 'slide',
    },
  }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, status = 'default', statusMessage, animation = 'slide', showStatusMessage = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ status, animation }),
            icon && 'pl-10',
            'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            isFocused && 'shadow-sm',
            hasValue && status === 'default' && 'border-gray-400',
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {status === 'valid' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <Check className="h-5 w-5" />
          </div>
        )}
        {status === 'error' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
        {showStatusMessage && statusMessage && status !== 'default' && (
          <p className={`mt-1 text-xs ${status === 'valid' ? 'text-green-500' : 'text-red-500'}`}>
            {statusMessage}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
