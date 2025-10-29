'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/scholarships/SearchBar';
import { FilterDropdowns } from '@/components/scholarships/FilterDropdowns';
import { ScholarshipDetail } from '@/components/scholarships/ScholarshipDetail';
import { websiteScholarshipsAPI, type Scholarship } from '@/hooks/api/website/scholarships.api';
import { useMobile } from '@/hooks/use-mobile';
import type { SearchFilters } from '@/types/scholarships/scholarship';

interface ScholarshipsLayoutProps {
  selectedScholarship?: Scholarship;
  selectedScholarshipId?: string;
}

const sanitizeStringArray = (data: any[]): string[] => {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item != null && typeof item === 'string' && item.trim() !== '')
    .map(item => item.trim())
    .filter((item, index, arr) => arr.indexOf(item) === index);
};

export const ScholarshipsLayout = ({ selectedScholarship, selectedScholarshipId }: ScholarshipsLayoutProps) => {
  const isMobile = useMobile();
  const [showFilters, setShowFilters] = useState(false);
  const [showScholarshipDetail, setShowScholarshipDetail] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    educationalLevel: '',
    datePosted: '',
    fieldOfStudy: '',
    nationalityRequirement: '',
    scholarshipType: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [totalScholarships, setTotalScholarships] = useState(0);
  
  // Filter options
  const [educationalLevels, setEducationalLevels] = useState<string[]>([]);
  const [fieldsOfStudy, setFieldsOfStudy] = useState<string[]>([]);
  const [nationalityRequirements, setNationalityRequirements] = useState<string[]>([]);
  const [scholarshipTypes, setScholarshipTypes] = useState<string[]>([]);

  // Show scholarship detail when selectedScholarship changes on mobile
  useEffect(() => {
    if (selectedScholarship && isMobile) {
      setShowScholarshipDetail(true);
    }
  }, [selectedScholarship, isMobile]);

  // Mobile-specific: Auto-hide filters when scholarship is selected
  useEffect(() => {
    if (isMobile && showScholarshipDetail) {
      setShowFilters(false);
    }
  }, [isMobile, showScholarshipDetail]);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [educationalLevelsData, fieldsOfStudyData, nationalityRequirementsData, scholarshipTypesData] = await Promise.all([
          websiteScholarshipsAPI.fetchEducationalLevels(),
          websiteScholarshipsAPI.fetchFieldsOfStudy(),
          websiteScholarshipsAPI.fetchNationalityRequirements(),
          websiteScholarshipsAPI.fetchScholarshipTypes(),
        ]);
        
        setEducationalLevels(sanitizeStringArray(educationalLevelsData));
        setFieldsOfStudy(sanitizeStringArray(fieldsOfStudyData));
        setNationalityRequirements(sanitizeStringArray(nationalityRequirementsData));
        setScholarshipTypes(sanitizeStringArray(scholarshipTypesData));
      } catch (err) {
        console.error('Error fetching filter options:', err);
        // Enhanced fallback options
        setEducationalLevels(['Undergraduate', 'Graduate', 'PhD', 'Postdoc', 'Open to All']);
        setFieldsOfStudy(['Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Sciences', 'Law', 'Education']);
        setNationalityRequirements(['Any Nationality', 'International Students', 'Developing Countries', 'Specific Countries']);
        setScholarshipTypes(['Merit Based', 'Need Based', 'Sports', 'Research', 'Minority', 'Women', 'STEM']);
      }
    };

    fetchFilterOptions();
  }, []);

  // Optimized fetch function with debouncing for mobile
  const fetchScholarships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};

      if (filters.query && filters.query.trim()) {
        params.search = filters.query.trim();
      }

      if (filters.educationalLevel) params.educationalLevel = filters.educationalLevel;
      if (filters.fieldOfStudy) params.fieldOfStudy = filters.fieldOfStudy;
      if (filters.nationalityRequirement) params.nationalityRequirement = filters.nationalityRequirement;
      if (filters.scholarshipType) params.scholarshipType = filters.scholarshipType;
      
      console.log('Fetching scholarships with params:', params);
      
      const response = await websiteScholarshipsAPI.fetchScholarships(params);
      
      const transformedScholarships = response.data.map(scholarship => ({
        ...scholarship,
        displayTitle: scholarship.displayTitle || scholarship.title,
        displayLocation: scholarship.displayLocation || scholarship.university?.country || 'Global',
        organization: scholarship.organization || scholarship.university?.university_name || 'Unknown Organization',
        datePosted: scholarship.datePosted || 'Recently posted',
        amountDisplay: scholarship.amountDisplay || scholarship.amount || 'Not specified',
        deadlineDisplay: scholarship.deadlineDisplay || scholarship.deadline || 'No deadline specified'
      }));
      
      setScholarships(transformedScholarships);
      setTotalScholarships(response.total);
      
    } catch (err: any) {
      console.error('Error fetching scholarships:', err);
      setError(err?.response?.data?.message || 'Failed to load scholarships. Please try again later.');
      setScholarships([]);
      setTotalScholarships(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced effect for mobile performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchScholarships();
    }, isMobile ? 500 : 0); // 500ms debounce on mobile

    return () => clearTimeout(timeoutId);
  }, [fetchScholarships, isMobile]);

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
    setShowScholarshipDetail(false);
    if (isMobile) {
      // Auto-show filters when returning to list on mobile
      setShowFilters(true);
    }
  };

  const handleScholarshipSelect = () => {
    if (isMobile) {
      setShowScholarshipDetail(true);
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
    filters.fieldOfStudy,
    filters.nationalityRequirement,
    filters.scholarshipType,
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
            {showScholarshipDetail && selectedScholarship && (
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleBackToList}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Scholarships
                  </button>
                  <span className="text-sm text-gray-600">
                    {scholarships.length > 0 && `${scholarships.length} found`}
                  </span>
                </div>
              </div>
            )}

            {/* Mobile Content */}
            {showScholarshipDetail && selectedScholarship ? (
              <div className="flex-1 overflow-auto">
                <ScholarshipDetail scholarship={selectedScholarship} />
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                {/* Mobile Search Bar */}
                <div className="p-4 bg-white border-b border-gray-200">
                  <SearchBar 
                    onSearch={handleSearch} 
                    isMobile={isMobile}
                    placeholder="Search scholarships..."
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>

                {/* Mobile Quick Filters */}
                {!showFilters && !isSearchFocused && (
                  <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleQuickFilter('educationalLevel', 'Undergraduate')}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        Undergraduate
                      </button>
                      <button
                        onClick={() => handleQuickFilter('educationalLevel', 'Graduate')}
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                      >
                        Graduate
                      </button>
                      <button
                        onClick={() => handleQuickFilter('scholarshipType', 'Merit Based')}
                        className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                      >
                        Merit Based
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
                    className="flex items-center justify-between w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <span className="font-medium">
                      Filters & Scholarships {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </span>
                    <svg 
                      className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Filters and Scholarship List */}
                {showFilters && (
                  <div className="flex-1 overflow-auto p-4">
                    <FilterDropdowns 
                      filters={filters} 
                      onFiltersChange={handleFiltersChange}
                      educationalLevels={educationalLevels}
                      fieldsOfStudy={fieldsOfStudy}
                      nationalityRequirements={nationalityRequirements}
                      scholarshipTypes={scholarshipTypes}
                      scholarships={scholarships}
                      loading={loading}
                      totalScholarships={totalScholarships}
                      selectedScholarshipId={selectedScholarshipId}
                      isMobile={true}
                      onScholarshipSelect={handleScholarshipSelect}
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
            {/* Left Sidebar - Search, Filters & Scholarship Listings */}
            <div className="layout-content-container flex flex-col max-w-md">
              <SearchBar onSearch={handleSearch} />
              <FilterDropdowns 
                filters={filters} 
                onFiltersChange={handleFiltersChange}
                educationalLevels={educationalLevels}
                fieldsOfStudy={fieldsOfStudy}
                nationalityRequirements={nationalityRequirements}
                scholarshipTypes={scholarshipTypes}
                scholarships={scholarships}
                loading={loading}
                totalScholarships={totalScholarships}
                selectedScholarshipId={selectedScholarshipId}
              />
            </div>
            
            {/* Right Main Content */}
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              {selectedScholarship ? (
                <ScholarshipDetail scholarship={selectedScholarship} />
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
