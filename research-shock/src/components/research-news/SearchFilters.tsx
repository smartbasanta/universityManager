'use client';

import { useState, useEffect, useRef } from 'react';
import { useMobile } from '@/hooks/use-mobile';

interface SearchFiltersType {
  query: string;
  category: string;
  sortBy: string;
}

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  isMobile?: boolean;
  placeholder?: string;
  showSortOnMobile?: boolean;
  showQuickFilters?: boolean;
  recentSearches?: string[];
  onRecentSearch?: (query: string) => void;
}

export const SearchFilters = ({ 
  filters, 
  onFiltersChange,
  isMobile: propIsMobile,
  placeholder = "Search research articles...",
  showSortOnMobile = true,
  showQuickFilters = false,
  recentSearches = [],
  onRecentSearch
}: SearchFiltersProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvancedSort, setShowAdvancedSort] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleQueryChange = (query: string): void => {
    const newFilters = { ...localFilters, query };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Show suggestions on mobile when typing
    if (isMobile && query.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSortChange = (sortBy: 'date' | 'relevance' | 'popularity'): void => {
    const newFilters = { ...localFilters, sortBy };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearSearch = (): void => {
    handleQueryChange('');
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleRecentSearchClick = (query: string): void => {
    handleQueryChange(query);
    setShowSuggestions(false);
    if (onRecentSearch) {
      onRecentSearch(query);
    }
  };

  const handleSearchFocus = (): void => {
    if (isMobile && recentSearches.length > 0 && !localFilters.query) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = (): void => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div className={`bg-white border-b border-[#f0f2f5] ${
      isMobile ? 'p-3' : 'p-4'
    }`}>
      <div className={`flex gap-4 ${
        isMobile ? 'flex-col' : 'flex-col md:flex-row'
      }`}>
        {/* Search Input Container */}
        <div className="flex-1 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`text-gray-400 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={localFilters.query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className={`block w-full border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                isMobile 
                  ? 'pl-9 pr-10 py-2.5 text-sm' 
                  : 'pl-10 pr-12 py-2 text-base'
              }`}
            />
            {/* Clear button */}
            {localFilters.query && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <svg className={`text-gray-400 hover:text-gray-600 transition-colors ${
                  isMobile ? 'h-4 w-4' : 'h-5 w-5'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile: Search suggestions dropdown */}
          {isMobile && showSuggestions && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2">Recent searches</div>
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
            </div>
          )}
        </div>

        {/* Sort Controls */}
        {showSortOnMobile && (
          <div className={`flex items-center gap-2 ${
            isMobile ? 'justify-between' : 'flex-shrink-0'
          }`}>
            <label className={`font-medium text-gray-700 ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              Sort by:
            </label>
            
            {isMobile ? (
              <div className="relative">
                <button
                  onClick={() => setShowAdvancedSort(!showAdvancedSort)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>
                    {localFilters.sortBy === 'date' ? 'Latest' : 
                     localFilters.sortBy === 'relevance' ? 'Relevance' : 'Most Popular'}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showAdvancedSort ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showAdvancedSort && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                    <div className="p-1">
                      {[
                        { value: 'date', label: 'Latest', icon: '🕒' },
                        { value: 'relevance', label: 'Relevance', icon: '🎯' },
                        { value: 'popularity', label: 'Most Popular', icon: '⭐' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleSortChange(option.value as 'date' | 'relevance' | 'popularity');
                            setShowAdvancedSort(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            localFilters.sortBy === option.value
                              ? 'bg-blue-100 text-blue-800 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <select
                value={localFilters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'date' | 'relevance' | 'popularity')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Latest</option>
                <option value="relevance">Relevance</option>
                <option value="popularity">Most Popular</option>
              </select>
            )}
          </div>
        )}
      </div>

      {/* Mobile: Quick filters */}
      {isMobile && showQuickFilters && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {['AI', 'Research', 'Technology', 'Science'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleQueryChange(tag)}
              className="flex-shrink-0 px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Search feedback */}
      {localFilters.query && (
        <div className={`text-gray-500 ${isMobile ? 'mt-2 text-xs' : 'mt-1 text-sm'}`}>
          Searching for "<span className="font-medium">{localFilters.query}</span>"
        </div>
      )}
    </div>
  );
};
