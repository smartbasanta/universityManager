'use client';

import { useBreakpoint } from '@/hooks/use-mobile';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'compact' | 'minimal';
  isMobile?: boolean;
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  variant = 'default',
  isMobile: propIsMobile
}: PaginationProps) => {
  const { isMobile: hookIsMobile, isTablet } = useBreakpoint();
  const isMobile = propIsMobile ?? hookIsMobile;
  
  // Auto-select variant based on screen size
  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (isMobile && totalPages > 5) return 'compact';
    if (isMobile) return 'minimal';
    return 'default';
  };

  const currentVariant = getVariant();

  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  // Minimal variant for mobile
  if (currentVariant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center size-8 disabled:opacity-50 hover:bg-gray-100 rounded-full transition-colors mr-2"
          aria-label="Previous page"
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
          </svg>
        </button>
        
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
          <span className="text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </span>
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center size-8 disabled:opacity-50 hover:bg-gray-100 rounded-full transition-colors ml-2"
          aria-label="Next page"
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
        </button>
      </div>
    );
  }

  // Compact variant with dropdown
  if (currentVariant === 'compact') {
    return (
      <div className="flex items-center justify-center p-2 gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center size-8 disabled:opacity-50 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous page"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
          </svg>
        </button>

        <select
          value={currentPage}
          onChange={(e) => onPageChange(parseInt(e.target.value))}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          aria-label="Select page"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center size-8 disabled:opacity-50 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next page"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
        </button>
      </div>
    );
  }

  // Default variant (same as the first implementation above)
  // ... (include the full default implementation from above)
};
