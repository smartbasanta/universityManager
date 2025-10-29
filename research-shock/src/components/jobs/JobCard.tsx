import Link from 'next/link';
import { useBreakpoint } from '@/hooks/use-mobile';
import { Job } from '@/hooks/api/website/jobs.api';

interface JobCardProps {
  job: Job;
  onJobSelect?: () => void;
  variant?: 'vertical' | 'horizontal'; // Layout variant
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const JobCard = ({ job, onJobSelect, variant = 'vertical' }: JobCardProps) => {
  const { isMobile, isTablet } = useBreakpoint();
  
  // Auto-detect layout based on screen size
  const useHorizontalLayout = isMobile && variant === 'horizontal';

  const handleClick = () => {
    if (onJobSelect && isMobile) {
      onJobSelect();
    }
  };

  return (
    <Link href={`/jobs/${job.id}`} onClick={handleClick}>
      <div className={`group border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white ${
        isMobile ? 'p-3' : 'p-4'
      }`}>
        <div className={`flex ${
          useHorizontalLayout 
            ? 'flex-row gap-3 items-start' 
            : isMobile 
              ? 'flex-col gap-3' 
              : 'justify-between items-start'
        }`}>
          
          {/* Company Logo Placeholder (for horizontal layout) */}
          {useHorizontalLayout && (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
          )}

          {/* Main Content */}
          <div className={`flex-1 min-w-0 ${
            useHorizontalLayout ? '' : isMobile ? 'w-full' : ''
          }`}>
            {/* Job Title */}
            <h3 className={`font-semibold text-blue-600 group-hover:text-blue-800 transition-colors mb-1 ${
              useHorizontalLayout ? 'text-sm line-clamp-1' :
              isMobile ? 'text-base line-clamp-2' : 'text-lg truncate'
            }`}>
              {truncateText(
                job.displayTitle || job.title, 
                useHorizontalLayout ? 40 : isMobile ? 60 : 80
              )}
            </h3>
            
            {/* Organization */}
            <p className={`font-medium text-gray-900 mb-1 ${
              useHorizontalLayout ? 'text-xs line-clamp-1' :
              isMobile ? 'text-sm line-clamp-1' : 'text-base truncate'
            }`}>
              {truncateText(
                job.organization || job.university?.university_name || 'Unknown Organization',
                useHorizontalLayout ? 25 : isMobile ? 30 : 50
              )}
            </p>
            
            {/* Job Details - Compact for horizontal */}
            <div className={`flex gap-1 text-gray-600 ${
              useHorizontalLayout ? 'text-xs flex-wrap' :
              isMobile ? 'text-xs flex-col gap-1' : 'text-sm flex-wrap gap-2'
            }`}>
              <div className="flex items-center gap-1">
                <svg className={`flex-shrink-0 ${
                  useHorizontalLayout ? 'w-3 h-3' : isMobile ? 'w-3 h-3' : 'w-4 h-4'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">
                  {truncateText(job.displayLocation || 'Remote', useHorizontalLayout ? 15 : 20)}
                </span>
              </div>
              
              {!useHorizontalLayout && (
                <>
                  <span className="text-xs">•</span>
                  <span>{job.modeOfWork}</span>
                  <span className="text-xs">•</span>
                  <span>{job.jobType}</span>
                </>
              )}
            </div>
            
            {/* Date - Only show if not horizontal or on larger mobile screens */}
            {!useHorizontalLayout && (
              <p className="text-xs text-gray-500 mt-1">
                {job.datePosted || 'Recently posted'}
              </p>
            )}
          </div>
          
          {/* Status Badges and Arrow */}
          <div className={`flex ${
            useHorizontalLayout 
              ? 'flex-col items-end gap-1' 
              : isMobile 
                ? 'w-full justify-between items-center' 
                : 'flex-col items-end gap-2 ml-4'
          }`}>
            {/* Status Badges */}
            <div className={`flex gap-1 ${
              useHorizontalLayout ? 'flex-col items-end' :
              isMobile ? 'flex-row' : 'flex-col items-end gap-2'
            }`}>
              {job.status === 'Live' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Live
                </span>
              )}
              
              {job.hasApplicationForm && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                  {useHorizontalLayout ? 'Apply' : 'Apply Online'}
                </span>
              )}
            </div>
            
            {/* Arrow indicator */}
            <svg className={`text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ${
              useHorizontalLayout ? 'w-4 h-4' : isMobile ? 'w-4 h-4' : 'w-5 h-5'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
