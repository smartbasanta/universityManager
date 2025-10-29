import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, description, error, type = 'text', ...props }, ref) => {
    return (
      <div className="flex flex-col min-w-40 flex-1">
        {label && (
          <label className="text-[#111518] text-base font-medium leading-normal pb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border border-[#dbe1e6] bg-white focus:border-[#dbe1e6] h-14 placeholder:text-[#617689] p-[15px] text-base font-normal leading-normal',
            error && 'border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {description && (
          <p className="text-[#617689] text-sm font-normal leading-normal pb-3 pt-1">
            {description}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm font-normal leading-normal pt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
