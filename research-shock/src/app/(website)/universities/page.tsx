"use client";
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { PageLayout } from '@/components/layout/page-layout';
import { SearchBar } from '@/components/universities/SearchBar';
import { FilterSection } from '@/components/universities/FilterSection';
import { UniversityCard } from '@/components/universities/UniversityCard';
import UniversitySkeleton from '@/components/universities/UniversitySkeleton';

import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import type { University, UniversityQueryParams } from '@/hooks/api/website/university.api';
import type { SearchFilters } from '@/types/universities/university';
import type { UniversityListItem } from '@/types/universities/university';
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
    establishedYear: 0,
    studentCount: 0,
    ranking: 0,
    phone: '',
    email: '',
  }));
};

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
  }, []);

  useEffect(() => {
    const query = createQueryString({
      search: debouncedSearch,
      countries: filters.countries,
      locations: filters.locations,
      types: filters.types,
    });
    router.replace(`${pathname}?${query}`, { scroll: false });
  }, [debouncedSearch, filters.countries, filters.locations, filters.types, pathname, router]);

  const { data: universityResponse, isLoading, isError } = useQuery({
    queryKey: ['universities', debouncedSearch, filters.countries, filters.locations, filters.types],
    queryFn: () => {
      const apiParams: UniversityQueryParams = {
        search: debouncedSearch,
        country: filters.countries.join(','),
        area_type: filters.locations.join(','),
        type: filters.types.join(','),
      };
      return websiteUniversityAPI.fetchUniversities(apiParams);
    },
    placeholderData: keepPreviousData,
  });

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
    <PageLayout
      title="Find Your University"
      description="Explore institutions from around the world."
    >
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {isLoading ? (
            'Loading universities...'
          ) : (
            `Showing ${universityResponse?.data?.length || 0} ${
              universityResponse?.data?.length === 1 ? 'university' : 'universities'
            }`
          )}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters Column */}
        <aside className="lg:col-span-1 mb-8 lg:mb-0">
          <div className="sticky top-24 space-y-6">
            <SearchBar onSearch={handleSearch} initialValue={filters.search} />
            <FilterSection 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              countries={filterOptions.countries}
              areaTypes={filterOptions.areaTypes}
              universityTypes={filterOptions.universityTypes}
            />
          </div>
        </aside>

        {/* Grid Column */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <UniversitySkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 font-medium">Failed to load universities</p>
              <p className="text-red-500 text-sm mt-1">Please try again later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridUniversities.map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}