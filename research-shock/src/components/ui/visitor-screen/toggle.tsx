'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked = false, onChange, disabled = false, className }, ref) => {
    return (
      <label
        className={cn(
          'relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 transition-colors',
          checked ? 'justify-end bg-[#1383eb]' : 'justify-start bg-[#f0f2f4]',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div 
          className="h-full w-[27px] rounded-full bg-white transition-transform"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}
        />
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="invisible absolute"
        />
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
