'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export const Dropdown = ({ trigger, items, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={cn(
          "absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50",
          className
        )}>
          {items.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    'block px-4 py-2 text-sm hover:bg-gray-100',
                    item.className || 'text-gray-700'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm hover:bg-gray-100',
                    item.className || 'text-gray-700'
                  )}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
