'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  // Mobile-specific props
  isMobile?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  showClearButton?: boolean;
  debounceMs?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  recentSearches?: string[];
  onRecentSearchSelect?: (query: string) => void;
  showSearchSuggestions?: boolean;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search scholarships",
  isMobile: propIsMobile,
  variant = 'default',
  showClearButton = true,
  debounceMs = 300,
  onFocus,
  onBlur,
  autoFocus = false,
  recentSearches = [],
  onRecentSearchSelect,
  showSearchSuggestions = false
}: SearchBarProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Auto-focus on mobile when needed
  useEffect(() => {
    if (autoFocus && isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, isMobile]);

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, isMobile ? debounceMs : 0); // Only debounce on mobile
  }, [onSearch, debounceMs, isMobile]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
    
    // Show suggestions on mobile when typing
    if (isMobile && showSearchSuggestions && query.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
    
    // Show recent searches on focus if available
    if (isMobile && recentSearches.length > 0 && !searchQuery) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
    
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setShowSuggestions(false);
    if (onRecentSearchSelect) {
      onRecentSearchSelect(query);
    }
  };

  // Get responsive classes
  const getContainerClasses = () => {
    const baseClasses = "relative w-full";
    if (variant === 'minimal') return `${baseClasses} ${isMobile ? 'px-2 py-2' : 'px-4 py-3'}`;
    if (variant === 'compact') return `${baseClasses} ${isMobile ? 'px-3 py-2' : 'px-4 py-3'}`;
    return `${baseClasses} ${isMobile ? 'px-3 py-3' : 'px-4 py-3'}`;
  };

  const getInputContainerClasses = () => {
    const baseClasses = "flex w-full flex-1 items-stretch rounded-xl transition-all duration-200";
    const heightClass = isMobile ? 'h-11' : 'h-12';
    const focusClasses = isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : '';
    return `${baseClasses} ${heightClass} ${focusClasses}`;
  };

  const getIconContainerClasses = () => {
    const baseClasses = "text-[#6a7581] flex border-none bg-[#f1f2f4] items-center justify-center rounded-l-xl border-r-0 transition-colors";
    const paddingClass = isMobile ? 'pl-3' : 'pl-4';
    const focusClasses = isFocused ? 'bg-[#e8eaed]' : '';
    return `${baseClasses} ${paddingClass} ${focusClasses}`;
  };

  const getInputClasses = () => {
    const baseClasses = "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none placeholder:text-[#6a7581] rounded-l-none border-l-0 font-normal leading-normal transition-colors";
    const sizeClasses = isMobile ? 'px-3 pl-2 text-base' : 'px-4 pl-2 text-base';
    const focusClasses = isFocused ? 'bg-[#e8eaed]' : '';
    return `${baseClasses} ${sizeClasses} ${focusClasses}`;
  };

  // Minimal variant for mobile
  if (variant === 'minimal') {
    return (
      <div className={getContainerClasses()}>
        <div className="flex items-center w-full bg-[#f1f2f4] rounded-full px-3 py-2">
          <svg className="w-4 h-4 text-[#6a7581] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 256 256">
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
          </svg>
          <input
            ref={inputRef}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-[#121416] placeholder:text-[#6a7581] text-sm"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchQuery && showClearButton && (
            <button
              onClick={clearSearch}
              className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4 text-[#6a7581]" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={getContainerClasses()}>
        <div className={getInputContainerClasses()}>
          <div className={getIconContainerClasses()}>
            <svg width={isMobile ? "20px" : "24px"} height={isMobile ? "20px" : "24px"} fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              placeholder={placeholder}
              className={getInputClasses()}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {searchQuery && showClearButton && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4 text-[#6a7581]" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant (enhanced)
  return (
    <div className={getContainerClasses()}>
      <label className="flex flex-col min-w-40 w-full">
        <div className={getInputContainerClasses()}>
          <div className={getIconContainerClasses()}>
            <svg width={isMobile ? "20px" : "24px"} height={isMobile ? "20px" : "24px"} fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              placeholder={placeholder}
              className={getInputClasses()}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {/* Clear button */}
            {searchQuery && showClearButton && (
              <button
                onClick={clearSearch}
                className={`absolute top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors ${
                  isMobile ? 'right-2' : 'right-3'
                }`}
                aria-label="Clear search"
              >
                <svg className={`text-[#6a7581] ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </label>

      {/* Mobile Search Suggestions */}
      {isMobile && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {searchQuery.length === 0 && recentSearches.length > 0 ? (
            /* Recent searches */
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2 px-2">Recent searches</div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {search}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Search suggestions could go here */
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2">
                Search for "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile: Search status indicator */}
      {isMobile && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1 px-2">
          <div className="text-xs text-gray-500">
            {searchQuery ? `Searching for "${searchQuery}"` : 'Start typing to search scholarships'}
          </div>
        </div>
      )}
    </div>
  );
};
