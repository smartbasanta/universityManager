'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/mentors/SearchBar';
import { FilterDropdowns } from '@/components/mentors/FilterDropdowns';
import { Pagination } from '@/components/mentors/Pagination';
import { websiteMentorAPI, type Mentor } from '@/hooks/api/website/mentors.api';

// Mentor List Item type for display
interface MentorListItem {
  id: string;
  name: string;
  company: string;
  position: string;
  university: string;
  image: string;
}

// Updated mentor card with linking
const MentorCard = ({ mentor, isClickable = false }: { mentor: MentorListItem; isClickable?: boolean }) => {
  const CardContent = () => (
    <div className="flex flex-col gap-5 text-center pb-5 transform transition duration-300 ease-in-out hover:scale-110 cursor-pointer">
      <div className="px-8">
        <div
          className="w-48 h-48 bg-center bg-no-repeat bg-cover rounded-full mx-auto"
          style={{ backgroundImage: `url("${mentor.image}")` }}
        />
      </div>
      <div>
        <p className="text-[#101418] text-xl font-semibold leading-snug">{mentor.name}</p>
        <p className="text-[#5c738a] text-lg font-normal leading-snug">
          {mentor.company}, {mentor.position}
        </p>
        <p className="text-[#5c738a] text-lg font-normal leading-snug">
          Alumni of {mentor.university}
        </p>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link href={`/mentors/${mentor.id}`}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

// Loading component
const LoadingCard = () => (
  <div className="flex flex-col gap-5 text-center pb-5 animate-pulse">
    <div className="px-8">
      <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto" />
    </div>
    <div>
      <div className="h-6 bg-gray-300 rounded mb-2 mx-auto w-32" />
      <div className="h-4 bg-gray-200 rounded mx-auto w-40" />
      <div className="h-4 bg-gray-200 rounded mx-auto w-36" />
    </div>
  </div>
);

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Filter options state
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [majors, setMajors] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  
  const itemsPerPage = 12;

  // Helper function to sanitize and filter string arrays
  const sanitizeStringArray = (data: any[]): string[] => {
    if (!Array.isArray(data)) return [];
    
    return data
      .filter(item => item != null && typeof item === 'string' && item.trim() !== '')
      .map(item => item.trim())
      .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
  };

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [
          focusAreasData, 
          languagesData, 
          universitiesData, 
        ] = await Promise.all([
          websiteMentorAPI.fetchFocusAreas(),
          websiteMentorAPI.fetchLanguages(),
          websiteMentorAPI.fetchUniversities(),
        ]);
        
        // Ensure all items are strings and filter out invalid values
        setFocusAreas(sanitizeStringArray(focusAreasData));
        setLanguages(sanitizeStringArray(languagesData));
        setUniversities(sanitizeStringArray(universitiesData));
        setMajors([]); // Set to empty since commented out
        setEducationLevels([]); // Set to empty since commented out
      } catch (err) {
        console.error('Error fetching filter options:', err);
        // Set empty arrays as fallback
        setFocusAreas([]);
        setLanguages([]);
        setUniversities([]);
        setMajors([]);
        setEducationLevels([]);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch mentors data - Using only GET endpoint
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if any filters are applied (excluding search)
        const hasFilters = Object.values(filters).some(value => value && value !== '');
        
        // Always use GET endpoint to avoid 404 errors
        const response = await websiteMentorAPI.fetchMentors({
          page: hasFilters ? 1 : currentPage,
          limit: hasFilters ? 1000 : itemsPerPage, // Get more data when filtering
          search: searchQuery.trim() || undefined,
          department: filters.focusArea || undefined,
          university: filters.university || undefined,
        });
        
        setMentors(response.data);
        setInitialLoad(false);
        
      } catch (err) {
        console.error('Error fetching mentors:', err);
        setError('Failed to load mentors. Please try again later.');
        setInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [currentPage, searchQuery, filters]);

  // Transform and search mentors
  const transformedAndSearchedMentors: MentorListItem[] = useMemo(() => {
    // First transform the data
    const transformed = mentors.map(mentor => ({
      id: mentor.id,
      name: mentor.name,
      company: mentor.company || mentor.universityName || 'Unknown Company',
      position: mentor.position || mentor.departmentName || 'Unknown Position',
      university: mentor.universityName || 'Unknown University',
      image: mentor.image || '/mentor-default.png',
    }));

    // Then apply search if there's a query (client-side search for better UX)
    if (searchQuery.trim()) {
      return transformed.filter(mentor => {
        const searchTerm = searchQuery.toLowerCase().trim();
        return mentor.name.toLowerCase().includes(searchTerm) ||
               mentor.company.toLowerCase().includes(searchTerm) ||
               mentor.position.toLowerCase().includes(searchTerm) ||
               mentor.university.toLowerCase().includes(searchTerm);
      });
    }

    return transformed;
  }, [mentors, searchQuery]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Determine if we should show pagination
  const hasFiltersOrSearch = Object.values(filters).some(value => value && value !== '') || searchQuery.trim();
  const shouldShowPagination = !hasFiltersOrSearch && transformedAndSearchedMentors.length > itemsPerPage;
  const totalPages = Math.ceil(transformedAndSearchedMentors.length / itemsPerPage);

  // Paginate results only when no filters/search
  const paginatedMentors = useMemo(() => {
    if (hasFiltersOrSearch) {
      return transformedAndSearchedMentors;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transformedAndSearchedMentors.slice(startIndex, startIndex + itemsPerPage);
  }, [transformedAndSearchedMentors, currentPage, hasFiltersOrSearch]);

  // Determine what message to show when no results
  const getNoResultsMessage = () => {
    if (searchQuery.trim()) {
      return 'Mentor does not exist';
    }
    if (Object.values(filters).some(value => value && value !== '')) {
      return 'No mentors found matching your filter criteria.';
    }
    return 'No mentors available at the moment.';
  };

  return (
    <div className="relative flex flex-col bg-slate-50 min-h-screen" style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex flex-col">
        <Header />
        
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1600px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#101418] tracking-light text-2xl md:text-[32px] font-bold leading-tight">
                  Meet Our Mentors in Residence
                </p>
                <p className="text-[#5c738a] text-sm md:text-base font-normal leading-normal">
                  Connect with our alumni mentors working in various companies, ready to provide networking opportunities and guidance.
                </p>
              </div>
            </div>
            
            <SearchBar onSearch={setSearchQuery} />
            <FilterDropdowns 
              onFilterChange={setFilters}
              focusAreas={focusAreas}
              languages={languages}
              universities={universities}
              majors={majors}
              educationLevels={educationLevels}
            />
            
            {error && (
              <div className="p-4 mx-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-4 md:p-8">
              {loading ? (
                // Show loading skeletons
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <LoadingCard key={index} />
                ))
              ) : paginatedMentors.length > 0 ? (
                // Show mentor cards
                paginatedMentors.map((mentor) => (
                  <MentorCard 
                    key={mentor.id} 
                    mentor={mentor} 
                    isClickable={true}
                  />
                ))
              ) : (
                // Show no results message
                <div className="col-span-full text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <svg 
                      className="w-16 h-16 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p className="text-[#5c738a] text-lg font-medium">
                      {getNoResultsMessage()}
                    </p>
                    {searchQuery.trim() && (
                      <p className="text-[#5c738a] text-sm">
                        Try searching for a different name, company, or university
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {!loading && shouldShowPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
