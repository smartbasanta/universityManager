'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SearchFilters } from '@/types/scholarships/scholarship';
import { Scholarship } from '@/hooks/api/website/scholarships.api';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/common/Pagination';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook

interface FilterDropdownsProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  educationalLevels?: string[];
  fieldsOfStudy?: string[];
  nationalityRequirements?: string[];
  scholarshipTypes?: string[];
  // New props for scholarship listings
  scholarships?: Scholarship[];
  loading?: boolean;
  totalScholarships?: number;
  selectedScholarshipId?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Mobile-specific props
  isMobile?: boolean;
  isTablet?: boolean;
  onScholarshipSelect?: () => void;
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
  fieldsOfStudy = [],
  nationalityRequirements = [],
  scholarshipTypes = [],
  scholarships = [],
  loading = false,
  totalScholarships = 0,
  selectedScholarshipId,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  isMobile: propIsMobile,
  isTablet: propIsTablet,
  onScholarshipSelect,
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
      fieldOfStudy: '',
      nationalityRequirement: '',
      scholarshipType: ''
    };
    onFiltersChange(clearedFilters);
    setActiveDropdown(null);
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  // Handle scholarship card click with mobile optimization
  const handleScholarshipClick = useCallback((scholarshipId: string) => {
    if (isMobile && onScholarshipSelect) {
      onScholarshipSelect();
    }
    router.push(`/scholarships/${scholarshipId}`);
  }, [isMobile, onScholarshipSelect, router]);

  // Helper functions
  const getOrganizationName = (scholarship: Scholarship): string => {
    return scholarship.organization || scholarship.university?.university_name || 'Unknown Organization';
  };

  const formatDate = (scholarship: Scholarship): string => {
    if (scholarship.datePosted) return scholarship.datePosted;
    if (scholarship.createdAt) {
      const date = new Date(scholarship.createdAt);
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

  const formatDeadline = (scholarship: Scholarship): string => {
    if (scholarship.deadline) {
      const deadline = new Date(scholarship.deadline);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Deadline passed';
      if (diffDays === 0) return 'Deadline today';
      if (diffDays === 1) return 'Deadline tomorrow';
      if (diffDays < 7) return `${diffDays} days left`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} left`;
      return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} left`;
    }
    return 'No deadline specified';
  };

  // Check if any filters are active
  const hasActiveFilters = filters.educationalLevel || filters.datePosted || 
                          filters.fieldOfStudy || filters.nationalityRequirement || 
                          filters.scholarshipType;

  const activeFiltersCount = [
    filters.educationalLevel,
    filters.datePosted,
    filters.fieldOfStudy,
    filters.nationalityRequirement,
    filters.scholarshipType
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
              ? 'bg-blue-100 border border-blue-300 text-blue-800' 
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
              className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
                    currentValue === option ? 'bg-blue-50 text-blue-700 font-medium' : ''
                  }`}
                  onClick={() => handleFilterSelect(id, option)}
                >
                  <span className="flex items-center justify-between">
                    {option}
                    {currentValue === option && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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
              {isMobile ? 'Filter Scholarships' : 'Filters'}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className={`text-blue-600 hover:text-blue-800 font-medium transition-colors ${
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
              options={educationalLevels.length > 0 ? educationalLevels : ['Undergrad', 'Grad', 'PhD', 'Open to All']}
            />
            
            <SimpleDropdown
              id="datePosted"
              label="Date Posted"
              options={['Last 24 hours', 'Last 7 days', 'Last 30 days']}
            />
            
            <SimpleDropdown
              id="fieldOfStudy"
              label="Field of Study"
              options={fieldsOfStudy.length > 0 ? fieldsOfStudy : ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Sciences']}
            />
            
            <SimpleDropdown
              id="scholarshipType"
              label="Scholarship Type"
              options={scholarshipTypes.length > 0 ? scholarshipTypes : ['Merit Based', 'Need Based', 'Sports', 'Research', 'Minority']}
            />
            
            <SimpleDropdown
              id="nationalityRequirement"
              label="Nationality"
              options={nationalityRequirements.length > 0 ? nationalityRequirements : ['Nepali', 'International', 'Any']}
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
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Level: {filters.educationalLevel}</span>
                    <button
                      onClick={() => clearFilter('educationalLevel')}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.fieldOfStudy && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Field: {filters.fieldOfStudy}</span>
                    <button
                      onClick={() => clearFilter('fieldOfStudy')}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.scholarshipType && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Type: {filters.scholarshipType}</span>
                    <button
                      onClick={() => clearFilter('scholarshipType')}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.nationalityRequirement && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Nationality: {filters.nationalityRequirement}</span>
                    <button
                      onClick={() => clearFilter('nationalityRequirement')}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.datePosted && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Date: {filters.datePosted}</span>
                    <button
                      onClick={() => clearFilter('datePosted')}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
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

      {/* Scholarship Results Count and Scholarship Listings Section */}
      <div className={`pt-4 border-t border-gray-200 ${isMobile ? 'mt-4' : 'mt-6'}`}>
        <h2 className={`text-[#101518] font-bold leading-tight tracking-[-0.015em] px-1 pb-3 ${
          isMobile ? 'text-lg' : 'text-[22px]'
        }`}>
          {loading ? 'Loading...' : `${totalScholarships.toLocaleString()} scholarship result${totalScholarships !== 1 ? 's' : ''}`}
        </h2>

        {/* Scholarship Listings */}
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
          ) : scholarships.length > 0 ? (
            // Scholarship cards
            scholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                onClick={() => handleScholarshipClick(scholarship.id)}
                className={`flex items-center gap-4 px-4 py-2 justify-between border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                  isMobile ? 'min-h-[80px]' : 'min-h-[72px]'
                } ${
                  selectedScholarshipId === scholarship.id 
                    ? 'bg-[#f3f4f6] border-l-4 border-gray-800' 
                    : 'bg-white'
                }`}
              >
                {/* Scholarship Icon placeholder */}
                <div className={`bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0 ${
                  isMobile ? 'w-8 h-8' : 'w-10 h-10'
                }`}>
                  <svg className={`text-blue-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <p className={`text-[#0000FF] font-medium leading-normal truncate ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>
                    {isMobile 
                      ? truncateText(scholarship.displayTitle || scholarship.title, 40)
                      : scholarship.displayTitle || scholarship.title
                    }
                  </p>
                  <p className={`text-[#101418] font-medium leading-snug truncate ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    {isMobile 
                      ? truncateText(getOrganizationName(scholarship), 30)
                      : getOrganizationName(scholarship)
                    }
                  </p>
                  <p className={`text-[#6a7581] font-normal leading-normal truncate ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {scholarship.amount && `Amount: ${scholarship.amount}`}
                    {scholarship.amount && scholarship.scholarshipType && ' • '}
                    {scholarship.scholarshipType || 'Merit Based'}
                  </p>
                  <p className={`text-[#6a7581] font-normal leading-normal truncate ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {scholarship.educationalLevel || 'All Levels'} • {scholarship.fieldOfStudy || 'All Fields'}
                  </p>
                  {!isMobile && (
                    <p className={`font-normal leading-normal truncate ${
                      scholarship.deadline && new Date(scholarship.deadline) < new Date() 
                        ? 'text-red-500 text-sm' 
                        : 'text-[#6a7581] text-sm'
                    }`}>
                      {formatDeadline(scholarship)} • {formatDate(scholarship)}
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
            // No scholarships state
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <div className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
              }`}>
                <svg className={`text-blue-400 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>No scholarships found</p>
              <p className={`text-gray-400 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {!loading && scholarships.length > 0 && totalPages > 1 && (
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
