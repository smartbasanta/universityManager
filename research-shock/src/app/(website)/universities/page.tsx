"use client";
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchBar } from '@/components/universities/SearchBar';
import { FilterSection } from '@/components/universities/FilterSection';
import { UniversityGrid } from '@/components/universities/UniversityGrid';

import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import type { University, UniversityQueryParams } from '@/hooks/api/website/university.api';
import type { SearchFilters } from '@/types/universities/university'; // Assuming you have this type
import type { UniversityListItem } from '@/types/universities/university'; // Make sure both are imported
import { useDebounce } from '@/hooks/useDebounce';

const transformApiDataToGridItems = (universities: University[]): UniversityListItem[] => {
  if (!universities) return [];
  return universities.map(uni => ({
    id: uni.id,
    name: uni.university_name,
    location: `${uni.overview?.city || ''}, ${uni.overview?.state || ''}`.trim() || uni.overview?.country || 'N/A',
    country: uni.overview?.country || 'N/A',
    type: uni.overview?.university_type || 'Unknown',
    setting: uni.overview?.campus_setting || 'Unknown',
    image: uni.logo || uni.banner || '/no-image.jpg',
    description: uni.description || uni.overview?.description || 'No description available.',
    website: uni.website || '',
    address: uni.address || '',
    researchAreas: uni.research_hubs?.map(h => h.research_center) || [],
    establishedYear: 0, // Default value
    studentCount: 0, // Default value
    ranking: 0, // Default value
    phone: '', // Default value
    email: '', // Default value
  }));
};

// A helper to create a URL-safe query string from the filter state
function createQueryString(params: Record<string, string | string[]>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && value.length > 0) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.set(key, value);
      }
    }
  }
  return searchParams.toString();
}

export default function UniversitiesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for filter options, fetched once
  const [filterOptions, setFilterOptions] = useState({
    countries: [] as string[],
    areaTypes: [] as string[],
    universityTypes: [] as string[],
  });

  const [filters, setFilters] = useState<SearchFilters>(() => {
    return {
      search: searchParams.get('search') || '',
      countries: searchParams.getAll('countries') || [],
      locations: searchParams.getAll('locations') || [],
      types: searchParams.getAll('types') || [],
      researchAreas: [],
    };
  });

  const debouncedSearch = useDebounce(filters.search, 500);


  // Use a useEffect to fetch the consolidated filter options ONCE
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await websiteUniversityAPI.fetchFilterOptions();
        setFilterOptions({
          countries: options.countries,
          areaTypes: options.area_types,
          universityTypes: options.university_types,
        });
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };
    fetchOptions();
  }, []); // Empty dependency array means this runs only once on mount
  // ===================================

  // Update the URL whenever the filters change
  useEffect(() => {
    const query = createQueryString({
      search: debouncedSearch, // Use the debounced search
      countries: filters.countries,
      locations: filters.locations,
      types: filters.types,
    });
    router.replace(`${pathname}?${query}`, { scroll: false });
  }, [debouncedSearch, filters.countries, filters.locations, filters.types, pathname, router]);


  // Use React Query to fetch data. The key is now an array of stable values.
  // It will only refetch when one of these values actually changes.
  const { data: universityResponse, isLoading, isError } = useQuery({
    queryKey: ['universities', debouncedSearch, filters.countries, filters.locations, filters.types],
    queryFn: () => {
        // The mapping from UI state to API params is now 1:1
        const apiParams: UniversityQueryParams = {
            search: debouncedSearch,
            country: filters.countries.join(','),
            area_type: filters.locations.join(','), // 'locations' in UI maps to 'area_type' in API
            type: filters.types.join(','),
        };
        return websiteUniversityAPI.fetchUniversities(apiParams);
    },
    placeholderData: keepPreviousData,
  });


  // Use useMemo to transform the data only when it changes
  const gridUniversities = useMemo(
    () => transformApiDataToGridItems(universityResponse?.data || []),
    [universityResponse?.data]
  );

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };
  
  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Find Your University</h1>
          <p className="text-lg text-gray-600 mt-2">Explore institutions from around the world.</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Column */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="sticky top-24 space-y-6">
              <SearchBar onSearch={handleSearch} />
              <FilterSection 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                // Pass the fetched options down to the filter component
                countries={filterOptions.countries}
                areaTypes={filterOptions.areaTypes}
                universityTypes={filterOptions.universityTypes}
              />
            </div>
          </aside>

          {/* Grid Column */}
          <div className="lg:col-span-3">
            {isError ? (
              <div className="text-center py-10 text-red-500">Failed to load universities. Please try again.</div>
            ) : (
              <UniversityGrid 
                universities={gridUniversities}
                loading={isLoading}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
