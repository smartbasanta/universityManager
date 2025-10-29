'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SearchFilters } from '@/types/opportunities/opportunity';
import { Opportunity } from '@/hooks/api/website/opportunity.api';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/common/Pagination';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook

interface FilterDropdownsProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  educationalLevels?: string[];
  opportunityTypes?: string[];
  // New props for opportunity listings
  opportunities?: Opportunity[];
  loading?: boolean;
  totalOpportunities?: number;
  selectedOpportunityId?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Mobile-specific props
  isMobile?: boolean;
  isTablet?: boolean;
  onOpportunitySelect?: () => void;
  variant?: 'default' | 'compact' | 'modal';
}

// Helper function to truncate text for mobile
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const FilterDropdowns = ({ 
  filters, 
  onFiltersChange, 
  educationalLevels = [],
  opportunityTypes = [],
  opportunities = [],
  loading = false,
  totalOpportunities = 0,
  selectedOpportunityId,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  isMobile: propIsMobile,
  isTablet: propIsTablet,
  onOpportunitySelect,
  variant = 'default'
}: FilterDropdownsProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;
  const isTablet = propIsTablet ?? false;
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [compactView, setCompactView] = useState(isMobile);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const router = useRouter();

  useEffect(() => {
    setCompactView(isMobile);
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && dropdownRefs.current[activeDropdown] && 
          !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const handleFilterSelect = (filterType: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    onFiltersChange(newFilters);
    setActiveDropdown(null);
    
    // Auto-hide mobile filters after selection
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  const clearFilter = (filterType: keyof SearchFilters) => {
    const newFilters = { ...filters, [filterType]: '' };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      query: filters.query, // Keep search query
      educationalLevel: '',
      datePosted: '',
      OpportunityType: '',
      location: '',
    };
    onFiltersChange(clearedFilters);
    setActiveDropdown(null);
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  // Handle opportunity card click with mobile optimization
  const handleOpportunityClick = useCallback((opportunityId: string) => {
    if (isMobile && onOpportunitySelect) {
      onOpportunitySelect();
    }
    router.push(`/opportunity-hub/${opportunityId}`);
  }, [isMobile, onOpportunitySelect, router]);

  // Helper functions
  const getOrganizationName = (opportunity: Opportunity): string => {
    return opportunity.organization || opportunity.university?.university_name || 'Unknown Organization';
  };

  const formatDate = (opportunity: Opportunity): string => {
    if (opportunity.datePosted) return opportunity.datePosted;
    if (opportunity.createdAt) {
      const date = new Date(opportunity.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
      return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
    }
    return 'Recently posted';
  };

  // Check if any filters are active
  const hasActiveFilters = filters.educationalLevel || filters.datePosted || 
                          filters.OpportunityType;

  const activeFiltersCount = [
    filters.educationalLevel,
    filters.datePosted,
    filters.OpportunityType
  ].filter(Boolean).length;

  const SimpleDropdown = ({ 
    id, 
    label, 
    options, 
    showClear = true 
  }: { 
    id: keyof SearchFilters; 
    label: string; 
    options: string[];
    showClear?: boolean;
  }) => {
    const currentValue = filters[id];
    const displayLabel = currentValue || label;
    const hasValue = Boolean(currentValue);

    return (
      <div className="relative" ref={(el: HTMLDivElement | null) => {
        dropdownRefs.current[id] = el;
      }}>
        <button
          onClick={() => toggleDropdown(id)}
          className={`flex shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-2 transition-colors ${
            isMobile ? 'h-9 text-xs' : 'h-8 text-sm'
          } ${
            hasValue 
              ? 'bg-green-100 border border-green-300 text-green-800' 
              : 'bg-[#eaedf1] text-[#101518]'
          }`}
        >
          <p className={`font-medium leading-normal truncate ${
            isMobile ? 'max-w-20' : 'max-w-32'
          }`}>
            {isMobile && displayLabel.length > 12 
              ? truncateText(displayLabel, 12) 
              : displayLabel
            }
          </p>
          {hasValue && showClear && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilter(id);
              }}
              className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
              title="Clear filter"
            >
              <svg width={isMobile ? "10" : "12"} height={isMobile ? "10" : "12"} fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
              </svg>
            </button>
          )}
          {!hasValue && (
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16px" : "20px"} height={isMobile ? "16px" : "20px"} fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
            </svg>
          )}
        </button>
        
        {activeDropdown === id && (
          <div className={`absolute mt-1 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10 max-h-60 overflow-y-auto ${
            isMobile ? 'w-screen max-w-xs right-0' : 'w-48'
          }`}>
            <ul className="py-1 text-gray-700">
              {/* Clear option */}
              <li
                className={`px-4 hover:bg-gray-100 cursor-pointer text-gray-500 border-b border-gray-100 ${
                  isMobile ? 'py-3 text-sm' : 'py-2'
                }`}
                onClick={() => clearFilter(id)}
              >
                <span className="flex items-center">
                  <svg className={`mr-2 ${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear {label}
                </span>
              </li>
              
              {/* Options */}
              {options.map((option) => (
                <li
                  key={option}
                  className={`px-4 hover:bg-gray-100 cursor-pointer ${
                    isMobile ? 'py-3 text-sm' : 'py-2'
                  } ${
                    currentValue === option ? 'bg-green-50 text-green-700 font-medium' : ''
                  }`}
                  onClick={() => handleFilterSelect(id, option)}
                >
                  <span className="flex items-center justify-between">
                    {option.replace('_', ' ')}
                    {currentValue === option && (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={isMobile ? 'p-2' : 'p-3'}>
      {/* Mobile Filter Toggle Button */}
      {isMobile && (
        <div className="mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Filters Section */}
      {(!isMobile || showMobileFilters) && (
        <>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-[#101518] font-semibold ${isMobile ? 'text-sm' : 'text-sm'}`}>
              {isMobile ? 'Filter Opportunities' : 'Filters'}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className={`text-green-600 hover:text-green-800 font-medium transition-colors ${
                  isMobile ? 'text-sm' : 'text-xs'
                }`}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className={`flex gap-2 ${isMobile ? 'flex-col space-y-2' : 'flex-wrap'}`}>
            <SimpleDropdown
              id="educationalLevel"
              label="Educational Level"
              options={educationalLevels.length > 0 ? educationalLevels : ['Undergrad', 'Grad', 'PhD', 'open_to_all']}
            />
            
            <SimpleDropdown
              id="datePosted"
              label="Date Posted"
              options={['Last_24_hours', 'Last_week', 'Last_month']}
            />
            
            <SimpleDropdown
              id="OpportunityType"
              label="Opportunity Type"
              options={opportunityTypes.length > 0 ? opportunityTypes : ['Bootcamp', 'Research', 'Symposium', 'Startup', 'Incubation', 'Competition', 'Hackathon', 'Other']}
            />
          </div>

          {/* Active filters summary - Enhanced for mobile */}
          {hasActiveFilters && (
            <div className={`pt-3 border-t border-gray-200 ${isMobile ? 'mt-4' : 'mt-3'}`}>
              <p className={`text-gray-600 mb-2 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                Active filters:
              </p>
              <div className={`flex gap-1 ${isMobile ? 'flex-col space-y-1' : 'flex-wrap'}`}>
                {filters.educationalLevel && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Level: {filters.educationalLevel}</span>
                    <button
                      onClick={() => clearFilter('educationalLevel')}
                      className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.OpportunityType && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Type: {filters.OpportunityType}</span>
                    <button
                      onClick={() => clearFilter('OpportunityType')}
                      className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.datePosted && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Date: {filters.datePosted.replace('_', ' ')}</span>
                    <button
                      onClick={() => clearFilter('datePosted')}
                      className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Opportunity Results Count and Opportunity Listings Section */}
      <div className={`pt-4 border-t border-gray-200 ${isMobile ? 'mt-4' : 'mt-6'}`}>
        <h2 className={`text-[#101518] font-bold leading-tight tracking-[-0.015em] px-1 pb-3 ${
          isMobile ? 'text-lg' : 'text-[22px]'
        }`}>
          {loading ? 'Loading...' : `${totalOpportunities.toLocaleString()} opportunity result${totalOpportunities !== 1 ? 's' : ''}`}
        </h2>

        {/* Opportunity Listings */}
        <div className="space-y-0">
          {loading ? (
            // Loading state
            <div className="space-y-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center gap-4 bg-white px-4 py-2 justify-between border-b border-gray-200 animate-pulse ${
                  isMobile ? 'min-h-[80px]' : 'min-h-[72px]'
                }`}>
                  <div className={`bg-gray-200 rounded ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}></div>
                  <div className="flex flex-col justify-center flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : opportunities.length > 0 ? (
            // Opportunity cards
            opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                onClick={() => handleOpportunityClick(opportunity.id)}
                className={`flex items-center gap-4 px-4 py-2 justify-between border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                  isMobile ? 'min-h-[80px]' : 'min-h-[72px]'
                } ${
                  selectedOpportunityId === opportunity.id 
                    ? 'bg-[#f3f4f6] border-l-4 border-gray-800' 
                    : 'bg-white'
                }`}
              >
                {/* Opportunity Icon */}
                <div className={`bg-gradient-to-br from-green-100 to-teal-100 rounded flex items-center justify-center flex-shrink-0 ${
                  isMobile ? 'w-8 h-8' : 'w-10 h-10'
                }`}>
                  <svg className={`text-green-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <p className={`text-[#0000FF] font-medium leading-normal truncate ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>
                    {isMobile 
                      ? truncateText(opportunity.displayTitle || opportunity.title, 40)
                      : opportunity.displayTitle || opportunity.title
                    }
                  </p>
                  <p className={`text-[#101418] font-medium leading-snug truncate ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    {isMobile 
                      ? truncateText(getOrganizationName(opportunity), 30)
                      : getOrganizationName(opportunity)
                    }
                  </p>
                  <p className={`text-[#6a7581] font-normal leading-normal truncate ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {opportunity.type || 'General'} • {opportunity.educationalLevel || 'All Levels'}
                  </p>
                  <p className={`text-[#6a7581] font-normal leading-normal truncate ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {opportunity.location || 'Multiple Locations'} • {opportunity.duration || 'Variable Duration'}
                  </p>
                  {!isMobile && (
                    <p className="text-[#6a7581] text-sm font-normal leading-normal truncate">
                      {formatDate(opportunity)}
                    </p>
                  )}
                </div>
                
                {/* Mobile: Show arrow indicator */}
                {isMobile && (
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))
          ) : (
            // No opportunities state
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <div className={`bg-gradient-to-br from-green-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
              }`}>
                <svg className={`text-green-400 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>No opportunities found</p>
              <p className={`text-gray-400 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {!loading && opportunities.length > 0 && totalPages > 1 && (
          <div className={isMobile ? 'mt-4' : 'mt-6'}>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              isMobile={isMobile}
              variant={isMobile ? 'compact' : 'default'}
            />
          </div>
        )}
      </div>
    </div>
  );
};
