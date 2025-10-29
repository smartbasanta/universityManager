import { UniversityCard } from './UniversityCard';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook
import { Pagination } from '@/components/common/Pagination';

interface UniversityListItem {
  id: string;
  name: string;
  location: string;
  country: string;
  type: string;
  setting: string;
  researchAreas: string[];
  image: string;
  description: string;
  establishedYear: number;
  studentCount: number;
  ranking: number;
  website: string;
  address: string;
  phone: string;
  email: string;
}

interface UniversityGridProps {
  universities: UniversityListItem[];
  loading?: boolean;
  noResultsMessage?: string;
  // Mobile-specific props
  isMobile?: boolean;
  isTablet?: boolean;
  variant?: 'default' | 'compact' | 'list';
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  infiniteScroll?: boolean;
  onUniversitySelect?: (university: UniversityListItem) => void;
}

export const UniversityGrid = ({ 
  universities, 
  loading = false, 
  noResultsMessage = "No universities found",
  isMobile: propIsMobile,
  isTablet: propIsTablet,
  variant = 'default',
  showLoadMore = false,
  onLoadMore,
  hasMore = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  infiniteScroll = false,
  onUniversitySelect
}: UniversityGridProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;

  // Loading state with original grid sizing
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full aspect-square bg-gray-300 rounded-t-lg"></div>
            <div className="p-4 text-center">
              <div className="h-5 bg-gray-300 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="mt-3">
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/5 mx-auto"></div>
              </div>
              <div className="mt-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (universities.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center px-4 ${
        isMobile ? 'py-8' : 'py-12'
      }`}>
        <div className={`text-gray-400 mb-4 ${isMobile ? 'mb-3' : 'mb-4'}`}>
          <svg className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className={`font-medium text-gray-900 mb-2 ${
          isMobile ? 'text-base' : 'text-lg'
        }`}>
          {noResultsMessage}
        </h3>
        <p className={`text-gray-500 text-center max-w-md ${
          isMobile ? 'text-sm' : 'text-base'
        }`}>
          Try adjusting your search criteria or filters to find universities that match your preferences.
        </p>
        
        {/* Mobile: Helpful action buttons */}
        {isMobile && (
          <div className="mt-4 flex flex-col gap-2 w-full max-w-xs">
            <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
              Browse All Universities
            </button>
            <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  // Main grid render with original sizing
  return (
    <div className="w-full">
      {/* Results count */}
      <div className="mb-4 px-4">
        <div className="flex items-center justify-between">
          <p className={`text-[#5c738a] ${isMobile ? 'text-sm' : 'text-sm'}`}>
            Showing {universities.length} {universities.length === 1 ? 'university' : 'universities'}
          </p>
          {/* Mobile: View toggle buttons */}
          {isMobile && variant !== 'list' && (
            <div className="flex items-center gap-1">
              <button
                className={`p-2 rounded-md ${variant === 'default' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
                aria-label="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-2 rounded-md  'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
                aria-label="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Grid - Using Original Sizing: 1 col mobile, 2 cols sm, 3 cols md */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {universities.map((university, index) => (
          <div
            key={university.id}
            className={variant === 'list' && !isMobile ? 'col-span-full' : ''}
            style={infiniteScroll ? { animationDelay: `${index * 50}ms` } : undefined}
          >
            <UniversityCard 
              university={university}
              variant={variant === 'list' ? 'list' : 'default'}
              isMobile={isMobile}
              isTablet={propIsTablet}
              onClick={onUniversitySelect ? () => onUniversitySelect(university) : undefined}
            />
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {showLoadMore && hasMore && !infiniteScroll && (
        <div className={`flex justify-center mt-8 ${isMobile ? 'px-4' : 'px-0'}`}>
          <button
            onClick={onLoadMore}
            className={`font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors ${
              isMobile 
                ? 'px-6 py-3 text-sm w-full max-w-sm' 
                : 'px-8 py-3 text-base'
            }`}
          >
            {isMobile ? 'Load More Universities' : 'Load More Universities'}
          </button>
        </div>
      )}

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className={`flex justify-center mt-8 ${isMobile ? 'px-4' : 'px-0'}`}>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isMobile={isMobile}
            variant={isMobile ? 'compact' : 'default'}
          />
        </div>
      )}
      
      {/* Mobile: Scroll to top button */}
      {isMobile && universities.length > 6 && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
