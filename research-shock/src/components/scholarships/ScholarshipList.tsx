import { Scholarship } from '@/hooks/api/website/scholarships.api';
import { ScholarshipCard } from './ScholarshipCard';

interface ScholarshipListProps {
  scholarships: Scholarship[];
  loading?: boolean;
  totalCount?: number;
  noResultsMessage?: string;
  searchQuery?: string;
}

export const ScholarshipList = ({ 
  scholarships, 
  loading = false, 
  totalCount = 0, 
  noResultsMessage,
  searchQuery
}: ScholarshipListProps) => {
  
  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">
              {searchQuery ? `Searching for "${searchQuery}"...` : 'Loading scholarships...'}
            </span>
          </div>
        </div>
        
        {/* Loading skeleton */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No results state
  if (scholarships.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        {searchQuery && searchQuery.trim() ? (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No scholarships found for "{searchQuery}"
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any scholarships matching your search. Try:
            </p>
            <ul className="text-sm text-gray-500 space-y-1 max-w-md mx-auto">
              <li>• Check your spelling</li>
              <li>• Try different keywords</li>
              <li>• Search by scholarship title or university name</li>
              <li>• Use broader search terms</li>
              <li>• Remove filters to see more results</li>
            </ul>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Scholarships Available
            </h3>
            <p className="text-gray-600">
              {noResultsMessage || 'There are currently no scholarship postings. Please check back later.'}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Results found
  return (
    <div>
      {/* Search results summary */}
      {searchQuery && searchQuery.trim() && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-blue-700">
            <span className="font-medium">{totalCount} scholarship{totalCount !== 1 ? 's' : ''} found</span> for "{searchQuery}"
          </p>
        </div>
      )}
      
      {/* Scholarship cards */}
      <div className="space-y-4">
        {scholarships.map((scholarship, index) => (
          <div key={scholarship.id} className="relative">
            <ScholarshipCard scholarship={scholarship} />
            {/* Show search match indicator if searching */}
            {searchQuery && searchQuery.trim() && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Match
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results footer for search */}
      {searchQuery && searchQuery.trim() && scholarships.length > 0 && (
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Showing {scholarships.length} of {totalCount} scholarships matching "{searchQuery}"
          </p>
          {scholarships.length < totalCount && (
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your filters to see more results
            </p>
          )}
        </div>
      )}
    </div>
  );
};
