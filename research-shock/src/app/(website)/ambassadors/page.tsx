'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/ambassadors/SearchBar';
import { FilterDropdowns } from '@/components/ambassadors/FilterDropdowns';
import { Pagination } from '@/components/ambassadors/Pagination';
import { websiteStudentAmbassadorAPI, type Ambassador } from '@/hooks/api/website/student-ambassador.api';

// Ambassador List Item type for display
interface AmbassadorListItem {
  id: string;
  name: string;
  university: string;
  major: string;
  image: string;
}

// Updated ambassador card with linking
const AmbassadorCard = ({ ambassador }: { ambassador: AmbassadorListItem }) => {
  return (
    <Link href={`/ambassadors/${ambassador.id}`}>
      <div className="flex flex-col gap-5 text-center pb-5 transform transition duration-300 ease-in-out hover:scale-110 cursor-pointer">
        <div className="px-8">
          <div
            className="w-48 h-48 bg-center bg-no-repeat bg-cover rounded-full mx-auto"
            style={{ backgroundImage: `url("${ambassador.image}")` }}
          />
        </div>
        <div>
          <p className="text-[#101418] text-xl font-semibold leading-snug">{ambassador.name}</p>
          <p className="text-[#5c738a] text-lg font-normal leading-snug">
            {ambassador.university}, {ambassador.major}
          </p>
        </div>
      </div>
    </Link>
  );
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
    </div>
  </div>
);

export default function AmbassadorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Filter options state
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  
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
        const [focusAreasData, languagesData, universitiesData] = await Promise.all([
          websiteStudentAmbassadorAPI.fetchFocusAreas(),
          websiteStudentAmbassadorAPI.fetchLanguages(),
          websiteStudentAmbassadorAPI.fetchUniversities(),
        ]);
        
        // Ensure all items are strings and filter out invalid values
        setFocusAreas(sanitizeStringArray(focusAreasData));
        setLanguages(sanitizeStringArray(languagesData));
        setUniversities(sanitizeStringArray(universitiesData));
      } catch (err) {
        console.error('Error fetching filter options:', err);
        // Set empty arrays as fallback
        setFocusAreas([]);
        setLanguages([]);
        setUniversities([]);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch ambassadors data
  useEffect(() => {
    const fetchAmbassadors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if any filters are applied (excluding search)
        const hasFilters = Object.values(filters).some(value => value && value !== '');
        
        // Always use GET endpoint
        const response = await websiteStudentAmbassadorAPI.fetchAmbassadors({
          page: hasFilters ? 1 : currentPage,
          limit: hasFilters ? 1000 : itemsPerPage, // Get more data when filtering
          search: searchQuery.trim() || undefined,
          department: filters.focused_area || undefined,
          university: filters.university || undefined,
        });
        
        setAmbassadors(response.data);
        setInitialLoad(false);
        
      } catch (err) {
        console.error('Error fetching ambassadors:', err);
        setError('Failed to load ambassadors. Please try again later.');
        setInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAmbassadors();
  }, [currentPage, searchQuery, filters]);

  // Transform and search ambassadors
  const transformedAndSearchedAmbassadors: AmbassadorListItem[] = useMemo(() => {
    // First transform the data
    const transformed = ambassadors.map(ambassador => ({
      id: ambassador.id,
      name: ambassador.name,
      university: ambassador.university?.university_name || 
                 ambassador.universityName || 
                 'Unknown University',
      major: ambassador.department?.dept_name || 
             ambassador.departmentName || 
             'Unknown Department',
      image: ambassador.image || '/ambassador-default.png',
    }));

    // Then apply search if there's a query (client-side search for better UX)
    if (searchQuery.trim()) {
      return transformed.filter(ambassador => {
        const searchTerm = searchQuery.toLowerCase().trim();
        return ambassador.name.toLowerCase().includes(searchTerm) ||
               ambassador.university.toLowerCase().includes(searchTerm) ||
               ambassador.major.toLowerCase().includes(searchTerm);
      });
    }

    return transformed;
  }, [ambassadors, searchQuery]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Determine if we should show pagination
  const hasFiltersOrSearch = Object.values(filters).some(value => value && value !== '') || searchQuery.trim();
  const shouldShowPagination = !hasFiltersOrSearch && transformedAndSearchedAmbassadors.length > itemsPerPage;
  const totalPages = Math.ceil(transformedAndSearchedAmbassadors.length / itemsPerPage);

  // Paginate results only when no filters/search
  const paginatedAmbassadors = useMemo(() => {
    if (hasFiltersOrSearch) {
      return transformedAndSearchedAmbassadors;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transformedAndSearchedAmbassadors.slice(startIndex, startIndex + itemsPerPage);
  }, [transformedAndSearchedAmbassadors, currentPage, hasFiltersOrSearch]);

  // Determine what message to show when no results
  const getNoResultsMessage = () => {
    if (searchQuery.trim()) {
      return 'Ambassador does not exist';
    }
    if (Object.values(filters).some(value => value && value !== '')) {
      return 'No ambassadors found matching your filter criteria.';
    }
    return 'No ambassadors available at the moment.';
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
                  Meet Our Ambassadors
                </p>
                <p className="text-[#5c738a] text-sm md:text-base font-normal leading-normal">
                  Connect with our student ambassadors to learn more about research opportunities and campus life.
                </p>
              </div>
            </div>
            
            <SearchBar onSearch={setSearchQuery} />
            <FilterDropdowns 
              onFilterChange={setFilters}
              focusAreas={focusAreas}
              languages={languages}
              universities={universities}
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
              ) : paginatedAmbassadors.length > 0 ? (
                // Show ambassador cards
                paginatedAmbassadors.map((ambassador) => (
                  <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
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
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33C7.76 10.91 9.81 10 12 10s4.24.91 6.08 2.67A7.963 7.963 0 0112 15z"
                      />
                    </svg>
                    <p className="text-[#5c738a] text-lg font-medium">
                      {getNoResultsMessage()}
                    </p>
                    {searchQuery.trim() && (
                      <p className="text-[#5c738a] text-sm">
                        Try searching for a different name or university
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
