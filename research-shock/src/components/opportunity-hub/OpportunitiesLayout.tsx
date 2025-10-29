'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/opportunity-hub/SearchBar';
import { FilterDropdowns } from '@/components/opportunity-hub/FilterDropdowns';
import { OpportunityDetail } from '@/components/opportunity-hub/OpportunityDetail';
import { websiteOpportunitiesAPI, type Opportunity } from '@/hooks/api/website/opportunity.api';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook
import type { SearchFilters } from '@/types/opportunities/opportunity';

interface OpportunitiesLayoutProps {
  selectedOpportunity?: Opportunity;
  selectedOpportunityId?: string;
}

const sanitizeStringArray = (data: any[]): string[] => {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item != null && typeof item === 'string' && item.trim() !== '')
    .map(item => item.trim())
    .filter((item, index, arr) => arr.indexOf(item) === index);
};

export const OpportunitiesLayout = ({ selectedOpportunity, selectedOpportunityId }: OpportunitiesLayoutProps) => {
  const isMobile = useMobile();
  const [showFilters, setShowFilters] = useState(false);
  const [showOpportunityDetail, setShowOpportunityDetail] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    educationalLevel: '',
    datePosted: '',
    OpportunityType: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  
  // Filter options
  const [educationalLevels, setEducationalLevels] = useState<string[]>([]);
  const [opportunityTypes, setOpportunityTypes] = useState<string[]>([]);

  // Show opportunity detail when selectedOpportunity changes on mobile
  useEffect(() => {
    if (selectedOpportunity && isMobile) {
      setShowOpportunityDetail(true);
    }
  }, [selectedOpportunity, isMobile]);

  // Mobile-specific: Auto-hide filters when opportunity is selected
  useEffect(() => {
    if (isMobile && showOpportunityDetail) {
      setShowFilters(false);
    }
  }, [isMobile, showOpportunityDetail]);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [educationalLevelsData, opportunityTypesData] = await Promise.all([
          websiteOpportunitiesAPI.fetchEducationalLevels(),
          websiteOpportunitiesAPI.fetchOpportunityTypes(),
        ]);
        
        setEducationalLevels(sanitizeStringArray(educationalLevelsData));
        setOpportunityTypes(sanitizeStringArray(opportunityTypesData));
      } catch (err) {
        console.error('Error fetching filter options:', err);
        // Enhanced fallback options
        setEducationalLevels(['Undergraduate', 'Graduate', 'PhD', 'Postdoc', 'Open to All']);
        setOpportunityTypes(['Bootcamp', 'Research Program', 'Symposium', 'Startup Accelerator', 'Incubation Program', 'Competition', 'Hackathon', 'Workshop', 'Conference', 'Other']);
      }
    };

    fetchFilterOptions();
  }, []);

  // Optimized fetch function with debouncing for mobile
  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};

      if (filters.query && filters.query.trim()) {
        params.search = filters.query.trim();
      }

      if (filters.educationalLevel) params.educationalLevel = filters.educationalLevel;
      if (filters.OpportunityType) params.OpportunityType = filters.OpportunityType;
      if (filters.location) params.location = filters.location;
      
      console.log('Fetching opportunities with params:', params);
      
      const response = await websiteOpportunitiesAPI.fetchOpportunities(params);
      
      const transformedOpportunities = response.data.map(opportunity => ({
        ...opportunity,
        displayTitle: opportunity.displayTitle || opportunity.title,
        displayLocation: opportunity.displayLocation || opportunity.location || 'Multiple Locations',
        organization: opportunity.organization || opportunity.university?.university_name || 'Unknown Organization',
        datePosted: opportunity.datePosted || 'Recently posted',
        duration: opportunity.duration || 'Variable Duration'
      }));
      
      setOpportunities(transformedOpportunities);
      setTotalOpportunities(response.total);
      
    } catch (err: any) {
      console.error('Error fetching opportunities:', err);
      setError(err?.response?.data?.message || 'Failed to load opportunities. Please try again later.');
      setOpportunities([]);
      setTotalOpportunities(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced effect for mobile performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOpportunities();
    }, isMobile ? 500 : 0); // 500ms debounce on mobile

    return () => clearTimeout(timeoutId);
  }, [fetchOpportunities, isMobile]);

  // Search handler with mobile optimization
  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    if (isMobile && query.length > 0) {
      setShowFilters(true); // Auto-show filters when searching on mobile
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleBackToList = () => {
    setShowOpportunityDetail(false);
    if (isMobile) {
      // Auto-show filters when returning to list on mobile
      setShowFilters(true);
    }
  };

  const handleOpportunitySelect = () => {
    if (isMobile) {
      setShowOpportunityDetail(true);
      setShowFilters(false);
    }
  };

  // Mobile quick actions
  const handleQuickFilter = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setShowFilters(true);
  };

  // Count active filters for mobile display
  const activeFiltersCount = [
    filters.educationalLevel,
    filters.OpportunityType,
    filters.location,
    filters.query ? 1 : 0
  ].filter(Boolean).length;

  return (
    <div 
      className="relative flex flex-col bg-slate-50 min-h-screen" 
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex flex-col">
        <Header />
        
        {/* Mobile: Stack layout with navigation */}
        {isMobile ? (
          <div className="flex flex-col flex-1">
            {/* Mobile Header with Back Button */}
            {showOpportunityDetail && selectedOpportunity && (
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleBackToList}
                    className="flex items-center text-green-600 hover:text-green-800 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Opportunities
                  </button>
                  <span className="text-sm text-gray-600">
                    {opportunities.length > 0 && `${opportunities.length} found`}
                  </span>
                </div>
              </div>
            )}

            {/* Mobile Content */}
            {showOpportunityDetail && selectedOpportunity ? (
              <div className="flex-1 overflow-auto">
                <OpportunityDetail opportunity={selectedOpportunity} />
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                {/* Mobile Search Bar */}
                <div className="p-4 bg-white border-b border-gray-200">
                  <SearchBar 
                    onSearch={handleSearch} 
                    isMobile={isMobile}
                    placeholder="Search opportunities..."
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>

                {/* Mobile Quick Filters */}
                {!showFilters && !isSearchFocused && (
                  <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleQuickFilter('OpportunityType', 'Competition')}
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                      >
                        Competitions
                      </button>
                      <button
                        onClick={() => handleQuickFilter('OpportunityType', 'Research Program')}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        Research
                      </button>
                      <button
                        onClick={() => handleQuickFilter('OpportunityType', 'Hackathon')}
                        className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                      >
                        Hackathons
                      </button>
                      <button
                        onClick={() => setShowFilters(true)}
                        className="px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        All Filters
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile Filter Toggle */}
                <div className="p-4 bg-white border-b border-gray-200">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                  >
                    <span className="font-medium">
                      Filters & Opportunities {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </span>
                    <svg 
                      className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Filters and Opportunity List */}
                {showFilters && (
                  <div className="flex-1 overflow-auto p-4">
                    <FilterDropdowns 
                      filters={filters} 
                      onFiltersChange={handleFiltersChange}
                      educationalLevels={educationalLevels}
                      opportunityTypes={opportunityTypes}
                      opportunities={opportunities}
                      loading={loading}
                      totalOpportunities={totalOpportunities}
                      selectedOpportunityId={selectedOpportunityId}
                      isMobile={true}
                      onOpportunitySelect={handleOpportunitySelect}
                    />
                  </div>
                )}

                {/* Mobile Welcome Screen */}
                {!showFilters && !isSearchFocused && (
                  <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                   {/* Logo */}
                    <div className="flex items-center">
                      <a href="/" className={`font-bold text-gray-800 ${
                        isMobile ? 'text-lg' : 'text-xl'
                      }`}>
                        ResearchShock
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Desktop/Tablet: Side-by-side layout */
          <div className="gap-6 px-6 flex flex-1 justify-center py-5">
            {/* Left Sidebar - Search, Filters & Opportunity Listings */}
            <div className="layout-content-container flex flex-col max-w-md">
              <SearchBar onSearch={handleSearch} />
              <FilterDropdowns 
                filters={filters} 
                onFiltersChange={handleFiltersChange}
                educationalLevels={educationalLevels}
                opportunityTypes={opportunityTypes}
                opportunities={opportunities}
                loading={loading}
                totalOpportunities={totalOpportunities}
                selectedOpportunityId={selectedOpportunityId}
              />
            </div>
            
            {/* Right Main Content */}
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              {selectedOpportunity ? (
                <OpportunityDetail opportunity={selectedOpportunity} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 px-8">
                   {/* Logo */}
                  <div className="flex items-center">
                    <a href="/" className={`font-bold text-gray-800 ${
                      isMobile ? 'text-lg' : 'text-xl'
                    }`}>
                      ResearchShock
                    </a>
                  </div>
    
                </div>
              )}
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    </div>
  );
};
