'use client';

import { Flame } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook

interface TrendingButtonProps {
  isActive: boolean;
  onClick: () => void;
  // Mobile-specific props
  isMobile?: boolean;
  variant?: 'default' | 'compact' | 'icon-only';
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const TrendingButton = ({ 
  isActive, 
  onClick,
  isMobile: propIsMobile,
  variant = 'default',
  showLabel = true,
  size = 'medium'
}: TrendingButtonProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;

  // Auto-select variant based on screen size
  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (isMobile) return 'compact';
    return 'default';
  };

  const currentVariant = getVariant();

  // Get responsive sizing
  const getSizeClasses = () => {
    const sizeMap = {
      small: {
        button: isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs',
        icon: 'w-3 h-3',
        gap: 'gap-1'
      },
      medium: {
        button: isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm',
        icon: 'w-4 h-4',
        gap: 'gap-2'
      },
      large: {
        button: isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base',
        icon: 'w-5 h-5',
        gap: 'gap-2'
      }
    };
    return sizeMap[size];
  };

  const sizeClasses = getSizeClasses();

  // Icon-only variant for very small screens
  if (currentVariant === 'icon-only') {
    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-center rounded-full transition-all shadow-md hover:shadow-lg ${
          isMobile ? 'size-8' : 'size-10'
        } ${
          isActive
            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
        }`}
        aria-label="Toggle trending filter"
        title="Trending Now"
      >
        <Flame className={sizeClasses.icon} />
      </button>
    );
  }

  // Compact variant for mobile
  if (currentVariant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`flex items-center ${sizeClasses.gap} ${sizeClasses.button} font-medium rounded-full whitespace-nowrap transition-all shadow-sm hover:shadow-md ${
          isActive
            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
            : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
        }`}
        aria-label={isActive ? 'Remove trending filter' : 'Show trending articles'}
      >
        <Flame className={`${sizeClasses.icon} ${isActive ? 'text-gray-600' : 'text-white'}`} />
        {showLabel && (
          <span className="truncate">
            {isMobile ? 'Trending' : 'Trending Now'}
          </span>
        )}
        {/* Visual indicator for active state on mobile */}
        {isMobile && isActive && (
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
    );
  }

  // Default variant (desktop)
  return (
    <button
      onClick={onClick}
      className={`flex items-center ${sizeClasses.gap} ${sizeClasses.button} font-medium rounded-full whitespace-nowrap transition-all shadow-md hover:shadow-lg ${
        isActive
          ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
          : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
      }`}
      aria-label={isActive ? 'Remove trending filter' : 'Show trending articles'}
    >
      <Flame className={`${sizeClasses.icon} ${
        isActive ? 'text-gray-600' : 'text-white'
      }`} />
      {showLabel && 'Trending Now'}
    </button>
  );
};
