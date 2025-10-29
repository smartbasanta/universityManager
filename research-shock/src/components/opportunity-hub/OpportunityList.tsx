import { Opportunity } from '@/hooks/api/website/opportunity.api';
import { OpportunityCard } from './OpportunityCard';

interface OpportunityListProps {
  opportunities: Opportunity[];
  loading?: boolean;
  totalCount?: number;
  noResultsMessage?: string;
  searchQuery?: string;
}

export const OpportunityList = ({ 
  opportunities, 
  loading = false, 
  totalCount = 0, 
  noResultsMessage,
  searchQuery
}: OpportunityListProps) => {
  
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
              {searchQuery ? `Searching for "${searchQuery}"...` : 'Loading opportunities...'}
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
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        
        {searchQuery && searchQuery.trim() ? (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No opportunities found for "{searchQuery}"
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any opportunities matching your search. Try:
            </p>
            <ul className="text-sm text-gray-500 space-y-1 max-w-md mx-auto">
              <li>• Check your spelling</li>
              <li>• Try different keywords</li>
              <li>• Search by opportunity title or university name</li>
              <li>• Use broader search terms</li>
              <li>• Remove filters to see more results</li>
            </ul>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Opportunities Available
            </h3>
            <p className="text-gray-600">
              {noResultsMessage || 'There are currently no opportunity postings. Please check back later.'}
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
            <span className="font-medium">{totalCount} opportunit{totalCount !== 1 ? 'ies' : 'y'} found</span> for "{searchQuery}"
          </p>
        </div>
      )}
      
      {/* Opportunity cards */}
      <div className="space-y-4">
        {opportunities.map((opportunity, index) => (
          <div key={opportunity.id} className="relative">
            <OpportunityCard opportunity={opportunity} />
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
      {searchQuery && searchQuery.trim() && opportunities.length > 0 && (
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Showing {opportunities.length} of {totalCount} opportunities matching "{searchQuery}"
          </p>
          {opportunities.length < totalCount && (
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your filters to see more results
            </p>
          )}
        </div>
      )}
    </div>
  );
};
