'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchFilters } from '@/types/jobs/job';
import { Job } from '@/hooks/api/website/jobs.api';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/common/Pagination';
import { useBreakpoint } from '@/hooks/use-mobile'; // Import the enhanced hook

interface FilterDropdownsProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  modesOfWork?: string[];
  experienceLevels?: string[];
  employmentTypes?: string[];
  // Job listings props
  jobs?: Job[];
  loading?: boolean;
  totalJobs?: number;
  selectedJobId?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Mobile-specific props
  isMobile?: boolean;
  isTablet?: boolean;
  onJobSelect?: () => void; // Callback for mobile job selection
}

export const FilterDropdowns = ({ 
  filters, 
  onFiltersChange, 
  modesOfWork = [],
  experienceLevels = [],
  employmentTypes = [],
  jobs = [],
  loading = false,
  totalJobs = 0,
  selectedJobId,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  isMobile: propIsMobile,
  isTablet: propIsTablet,
  onJobSelect
}: FilterDropdownsProps) => {
  const { isMobile: hookIsMobile, isTablet: hookIsTablet } = useBreakpoint();
  const isMobile = propIsMobile ?? hookIsMobile;
  const isTablet = propIsTablet ?? hookIsTablet;
  
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
      modeOfWork: '',
      datePosted: '',
      experienceLevel: '',
      jobType: '',
      applicationMethod: ''
    };
    onFiltersChange(clearedFilters);
    setActiveDropdown(null);
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  // Handle job card click
  const handleJobClick = (jobId: string) => {
    if (isMobile && onJobSelect) {
      onJobSelect();
    }
    router.push(`/jobs/${jobId}`);
  };

  // Helper functions
  const getOrganizationName = (job: Job): string => {
    return job.organization || job.university?.university_name || 'Unknown Organization';
  };

  const formatDate = (job: Job): string => {
    if (job.datePosted) return job.datePosted;
    if (job.createdAt) {
      const date = new Date(job.createdAt);
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

  // Helper to truncate text for mobile
  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Check if any filters are active
  const hasActiveFilters = filters.modeOfWork || filters.datePosted || 
                          filters.experienceLevel || filters.jobType || 
                          filters.applicationMethod;

  const activeFiltersCount = [
    filters.modeOfWork,
    filters.datePosted,
    filters.experienceLevel,
    filters.jobType,
    filters.applicationMethod
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
              {isMobile ? 'Filter Jobs' : 'Filters'}
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
              id="modeOfWork"
              label="Mode of Work"
              options={modesOfWork.length > 0 ? modesOfWork : ['Onsite', 'Hybrid', 'Online']}
            />
            
            <SimpleDropdown
              id="datePosted"
              label="Date Posted"
              options={['Last 24 hours', 'Last 7 days', 'Last 30 days']}
            />
            
            <SimpleDropdown
              id="experienceLevel"
              label="Experience Level"
              options={experienceLevels.length > 0 ? experienceLevels : ['Entry Level', 'Mid Level', 'Senior Level', 'Executive Level']}
            />
            
            <SimpleDropdown
              id="jobType"
              label="Job Type"
              options={employmentTypes.length > 0 ? employmentTypes : ['Full Time', 'Part Time', 'Internship', 'Contract', 'Temporary']}
            />
          </div>

          {/* Active filters summary - Enhanced for mobile */}
          {hasActiveFilters && (
            <div className={`pt-3 border-t border-gray-200 ${isMobile ? 'mt-4' : 'mt-3'}`}>
              <p className={`text-gray-600 mb-2 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                Active filters:
              </p>
              <div className={`flex gap-1 ${isMobile ? 'flex-col space-y-1' : 'flex-wrap'}`}>
                {filters.modeOfWork && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Mode: {filters.modeOfWork}</span>
                    <button
                      onClick={() => clearFilter('modeOfWork')}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.experienceLevel && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Level: {filters.experienceLevel}</span>
                    <button
                      onClick={() => clearFilter('experienceLevel')}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </span>
                )}
                {filters.jobType && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Type: {filters.jobType}</span>
                    <button
                      onClick={() => clearFilter('jobType')}
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
                {filters.applicationMethod && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 ${
                    isMobile ? 'text-sm justify-between' : 'text-xs'
                  }`}>
                    <span>Apply: {filters.applicationMethod}</span>
                    <button
                      onClick={() => clearFilter('applicationMethod')}
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

      {/* Job Results Section */}
      <div className={`pt-4 border-t border-gray-200 ${isMobile ? 'mt-4' : 'mt-6'}`}>
        <h2 className={`text-[#101518] font-bold leading-tight tracking-[-0.015em] px-1 pb-3 ${
          isMobile ? 'text-lg' : 'text-[22px]'
        }`}>
          {loading ? 'Loading...' : `${totalJobs.toLocaleString()} job result${totalJobs !== 1 ? 's' : ''}`}
        </h2>

        {/* Job Listings */}
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
          ) : jobs.length > 0 ? (
            // Job cards
            jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                className={`flex items-center gap-4 px-4 py-2 justify-between border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                  isMobile ? 'min-h-[80px]' : 'min-h-[72px]'
                } ${
                  selectedJobId === job.id 
                    ? 'bg-[#f3f4f6] border-l-4 border-gray-800' 
                    : 'bg-white'
                }`}
              >
                {/* Company Logo placeholder */}
                <div className={`bg-gray-200 rounded flex items-center justify-center flex-shrink-0 ${
                  isMobile ? 'w-8 h-8' : 'w-10 h-10'
                }`}>
                  <svg className={`text-gray-500 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <p className={`text-[#0000FF] font-medium leading-normal truncate ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>
                    {isMobile 
                      ? truncateText(job.displayTitle || job.title, 40)
                      : job.displayTitle || job.title
                    }
                  </p>
                  <p className={`text-[#101418] font-medium leading-snug truncate ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    {isMobile 
                      ? truncateText(getOrganizationName(job), 30)
                      : getOrganizationName(job)
                    }
                  </p>
                  <p className={`text-[#6a7581] font-normal leading-normal truncate ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {isMobile 
                      ? truncateText(`${job.displayLocation || job.location} (${job.modeOfWork || 'On-site'})`, 35)
                      : `${job.displayLocation || job.location} (${job.modeOfWork || 'On-site'})`
                    }
                  </p>
                  <p className={`text-[#6a7581] font-normal leading-normal truncate ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {job.employmentType || job.jobType || 'Full-time'} · {job.experienceLevel || 'Entry level'}
                  </p>
                  {!isMobile && (
                    <p className="text-[#6a7581] text-sm font-normal leading-normal truncate">
                      {formatDate(job)}
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
            // No jobs state
            <div className="text-center py-8">
              <div className={`bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
              }`}>
                <svg className={`text-gray-400 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                </svg>
              </div>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>No jobs found</p>
              <p className={`text-gray-400 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {!loading && jobs.length > 0 && totalPages > 1 && (
          <div className={isMobile ? 'mt-4' : 'mt-6'}>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>
    </div>
  );
};
