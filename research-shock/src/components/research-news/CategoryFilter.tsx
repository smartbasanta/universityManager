'use client';

import { useState } from 'react';
import { useMobile } from '@/hooks/use-mobile';

interface CategoryFilterType {
  id: string;
  label: string;
  count: number;
  isActive?: boolean;
}

interface CategoryFilterProps {
  categories: CategoryFilterType[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  hasResults: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  showCounts?: boolean;
  variant?: 'horizontal' | 'grid' | 'dropdown' | 'chips';
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const CategoryFilter = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  hasResults,
  isMobile: propIsMobile,
  isTablet: propIsTablet,
  showCounts = false,
  variant = 'horizontal'
}: CategoryFilterProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Get the active category object
  const activeCategoryObj = categories.find(cat => cat.id === activeCategory);

  // Auto-select variant and limit for mobile
  const getVariant = () => {
    if (variant !== 'horizontal') return variant;
    if (isMobile) return 'chips';
    return 'horizontal';
  };

  const currentVariant = getVariant();
  const visibleCategories = isMobile && !showAllCategories ? categories.slice(0, 4) : categories;
  const hasMoreCategories = isMobile && categories.length > 4;

  // Chips variant - compact for mobile
  if (currentVariant === 'chips') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          {hasMoreCategories && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllCategories ? 'Show Less' : `+${categories.length - 4} More`}
            </button>
          )}
        </div>
        
        {/* Selected category display on mobile */}
        {isMobile && activeCategoryObj && activeCategory !== 'all' && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Selected: {activeCategoryObj.label}
              </span>
              <button
                onClick={() => onCategoryChange('all')}
                className="text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((category: CategoryFilterType) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeCategory === category.id
                  ? 'text-white bg-blue-600'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span>{truncateText(category.label, 12)}</span>
              {showCounts && category.count > 0 && (
                <span className={`ml-1 text-xs ${
                  activeCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown variant for very small screens
  if (currentVariant === 'dropdown') {
    return (
      <div className="w-full">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
          >
            {categories.map((category: CategoryFilterType) => (
              <option key={category.id} value={category.id}>
                {category.label} {showCounts && category.count > 0 && `(${category.count})`}
              </option>
            ))}
          </select>
          <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  // Grid variant
  if (currentVariant === 'grid') {
    return (
      <div className="w-full">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Categories</h3>
        <div className={`grid gap-2 ${
          isMobile ? 'grid-cols-2' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        }`}>
          {categories.map((category: CategoryFilterType) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-3 py-2 text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none transition-colors text-left ${
                activeCategory === category.id
                  ? 'text-white bg-blue-600'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="truncate">
                {truncateText(category.label, isMobile ? 12 : 18)}
              </div>
              {showCounts && category.count > 0 && (
                <div className="text-xs opacity-75 mt-1">
                  {category.count} items
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default horizontal variant (desktop)
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category: CategoryFilterType) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full hover:bg-blue-700 focus:outline-none whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'text-white bg-blue-600'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>{category.label}</span>
            {showCounts && category.count > 0 && (
              <span className={`ml-2 text-xs ${
                activeCategory === category.id ? 'text-blue-100' : 'text-gray-500'
              }`}>
                ({category.count})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
