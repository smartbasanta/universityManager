import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-bold leading-normal tracking-[0.015em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'bg-[#f3e7e8] text-[#1b0e0e] hover:bg-[#e8d4d6]',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Icon Button variant for specific use cases like notification button
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <Button
        className={cn(
          'flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden gap-2 min-w-0 px-2.5',
          className
        )}
        ref={ref}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
