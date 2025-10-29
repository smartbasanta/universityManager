'use client';

import { useMobile } from '@/hooks/use-mobile'; // Import your hook

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // Mobile-specific props
  isMobile?: boolean;
  maxVisiblePages?: number;
  showPageNumbers?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isMobile: propIsMobile,
  maxVisiblePages,
  showPageNumbers = true,
  variant = 'default'
}: PaginationProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;
  
  // Determine how many page numbers to show based on screen size
  const getMaxVisiblePages = () => {
    if (maxVisiblePages) return maxVisiblePages;
    if (isMobile) return 3;
    return 7;
  };

  const maxVisible = getMaxVisiblePages();

  // Auto-select variant based on screen size and total pages
  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (isMobile && totalPages > 5) return 'compact';
    if (isMobile) return 'minimal';
    return 'default';
  };

  const currentVariant = getVariant();

  // Calculate which pages to show
  const getVisiblePages = () => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

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

  // Default variant with responsive page numbers
  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 rounded-full transition-colors ${
          isMobile ? 'size-8 mr-1' : 'size-10 mr-2'
        }`}
        aria-label="Previous page"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={isMobile ? "16px" : "18px"} 
          height={isMobile ? "16px" : "18px"} 
          fill="currentColor" 
          viewBox="0 0 256 256"
        >
          <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
        </svg>
      </button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-0'}`}>
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className={`flex items-center justify-center text-gray-400 ${
                  isMobile ? 'size-8 text-sm' : 'size-10 text-sm'
                }`}>
                  ...
                </span>
              ) : (
                <button
                  onClick={() => handlePageClick(page)}
                  className={`font-normal leading-normal tracking-[0.015em] flex items-center justify-center text-[#101418] rounded-full hover:bg-gray-100 transition-colors ${
                    isMobile ? 'size-8 text-sm' : 'size-10 text-sm'
                  } ${
                    page === currentPage 
                      ? 'bg-[#eaedf1] font-bold' 
                      : ''
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mobile: Simple page info when page numbers are hidden */}
      {isMobile && !showPageNumbers && (
        <div className="flex items-center mx-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 rounded-full transition-colors ${
          isMobile ? 'size-8 ml-1' : 'size-10 ml-2'
        }`}
        aria-label="Next page"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={isMobile ? "16px" : "18px"} 
          height={isMobile ? "16px" : "18px"} 
          fill="currentColor" 
          viewBox="0 0 256 256"
        >
          <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
        </svg>
      </button>

      {/* Mobile: Jump to page input for large pagination */}
      {isMobile && totalPages > 10 && (
        <div className="ml-4">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className="w-12 h-8 text-center text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            aria-label="Jump to page"
          />
        </div>
      )}
    </div>
  );
};
