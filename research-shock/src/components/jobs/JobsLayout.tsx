'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/jobs/SearchBar';
import { FilterDropdowns } from '@/components/jobs/FilterDropdowns';
import { JobDetail } from '@/components/jobs/JobDetail';
import { websiteJobsAPI, type Job } from '@/hooks/api/website/jobs.api';
import { useBreakpoint } from '@/hooks/use-mobile'; // Import enhanced hook
import type { SearchFilters } from '@/types/jobs/job';

interface JobsLayoutProps {
  selectedJob?: Job;
  selectedJobId?: string;
}

const sanitizeStringArray = (data: any[]): string[] => {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item != null && typeof item === 'string' && item.trim() !== '')
    .map(item => item.trim())
    .filter((item, index, arr) => arr.indexOf(item) === index);
};

export const JobsLayout = ({ selectedJob, selectedJobId }: JobsLayoutProps) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
  const [showJobDetail, setShowJobDetail] = useState(false); // Mobile job detail toggle
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    modeOfWork: '',
    datePosted: '',
    experienceLevel: '',
    jobType: '',
    applicationMethod: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  
  // Filter options
  const [locations, setLocations] = useState<string[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [modesOfWork, setModesOfWork] = useState<string[]>([]);

  // Show job detail when selectedJob changes on mobile
  useEffect(() => {
    if (selectedJob && isMobile) {
      setShowJobDetail(true);
    }
  }, [selectedJob, isMobile]);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [locationsData, employmentTypesData, experienceLevelsData, modesOfWorkData] = await Promise.all([
          websiteJobsAPI.fetchLocations(),
          websiteJobsAPI.fetchEmploymentTypes(),
          websiteJobsAPI.fetchExperienceLevels(),
          websiteJobsAPI.fetchModesOfWork(),
        ]);
        
        setLocations(sanitizeStringArray(locationsData));
        setEmploymentTypes(sanitizeStringArray(employmentTypesData));
        setExperienceLevels(sanitizeStringArray(experienceLevelsData));
        setModesOfWork(sanitizeStringArray(modesOfWorkData));
      } catch (err) {
        console.error('Error fetching filter options:', err);
        // Set fallback options if API fails
        setEmploymentTypes(['Full-time', 'Part-time', 'Contract', 'Internship']);
        setExperienceLevels(['Entry Level', 'Mid Level', 'Senior Level', 'Executive']);
        setModesOfWork(['Onsite', 'Remote', 'Hybrid']);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch jobs when filters change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: any = {};

        if (filters.query && filters.query.trim()) {
          params.search = filters.query.trim();
        }

        if (filters.modeOfWork) params.modeOfWork = filters.modeOfWork;
        if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
        if (filters.jobType) params.employmentType = filters.jobType;
        
        console.log('Fetching jobs with params:', params);
        
        const response = await websiteJobsAPI.fetchJobs(params);
        
        const transformedJobs = response.data.map(job => ({
          ...job,
          displayTitle: job.displayTitle || job.title,
          displayLocation: job.displayLocation || job.location,
          organization: job.organization || job.university?.university_name || 'Unknown Organization',
          datePosted: job.datePosted || 'Recently posted',
          jobType: job.jobType || job.employmentType || 'Full Time'
        }));
        
        setJobs(transformedJobs);
        setTotalJobs(response.total);
        
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err?.response?.data?.message || 'Failed to load jobs. Please try again later.');
        setJobs([]);
        setTotalJobs(0);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleBackToList = () => {
    setShowJobDetail(false);
  };

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
            {showJobDetail && selectedJob && (
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Jobs
                </button>
              </div>
            )}

            {/* Mobile Content */}
            {showJobDetail && selectedJob ? (
              <div className="flex-1 overflow-auto">
                <JobDetail job={selectedJob} />
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                {/* Mobile Search Bar */}
                <div className="p-4 bg-white border-b border-gray-200">
                  <SearchBar onSearch={handleSearch} />
                </div>

                {/* Mobile Filter Toggle */}
                <div className="p-4 bg-white border-b border-gray-200">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-between w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                  >
                    <span className="font-medium">Filters & Jobs</span>
                    <svg 
                      className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Filters and Job List */}
                {showFilters && (
                  <div className="flex-1 overflow-auto p-4">
                    <FilterDropdowns 
                      filters={filters} 
                      onFiltersChange={handleFiltersChange}
                      modesOfWork={modesOfWork}
                      experienceLevels={experienceLevels}
                      employmentTypes={employmentTypes}
                      jobs={jobs}
                      loading={loading}
                      totalJobs={totalJobs}
                      selectedJobId={selectedJobId}
                      isMobile={true}
                      onJobSelect={() => setShowJobDetail(true)}
                    />
                  </div>
                )}

                {/* Mobile Welcome Screen */}
                {!showFilters && (
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
          <div className={`gap-6 px-6 flex flex-1 justify-center py-5 ${
            isTablet ? 'flex-col' : ''
          }`}>
            {/* Left Sidebar - Search, Filters & Job Listings */}
            <div className={`layout-content-container flex flex-col ${
              isTablet ? 'max-w-full mb-6' : 'max-w-md'
            }`}>
              <SearchBar onSearch={handleSearch} />
              <FilterDropdowns 
                filters={filters} 
                onFiltersChange={handleFiltersChange}
                modesOfWork={modesOfWork}
                experienceLevels={experienceLevels}
                employmentTypes={employmentTypes}
                jobs={jobs}
                loading={loading}
                totalJobs={totalJobs}
                selectedJobId={selectedJobId}
                isTablet={isTablet}
              />
            </div>
            
            {/* Right Main Content */}
            <div className={`layout-content-container flex flex-col flex-1 ${
              isTablet ? 'max-w-full' : 'max-w-[960px]'
            }`}>
              {selectedJob ? (
                <JobDetail job={selectedJob} />
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
