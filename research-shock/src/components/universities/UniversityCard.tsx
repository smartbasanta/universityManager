import Link from 'next/link';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook

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

interface UniversityCardProps {
  university: UniversityListItem;
  // Mobile-specific props
  isMobile?: boolean;
  isTablet?: boolean;
  variant?: 'default' | 'compact' | 'list';
  onClick?: () => void;
  showFullDescription?: boolean;
  priority?: boolean; // For image loading optimization
}

// Helper function to truncate text for mobile
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const UniversityCard = ({ 
  university,
  isMobile: propIsMobile,
  isTablet: propIsTablet,
  variant = 'default',
  onClick,
  showFullDescription = false,
  priority = false
}: UniversityCardProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;

  // Handle card click for mobile
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Get responsive classes
  const getCardClasses = () => {
    const baseClasses = "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300";
    
    if (variant === 'list') {
      return `${baseClasses} ${isMobile ? 'p-3' : 'p-4'} flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`;
    }
    
    if (variant === 'compact') {
      return `${baseClasses} flex flex-col gap-2 pb-2 ${
        isMobile ? 'hover:scale-[1.02]' : 'transform hover:scale-105'
      } cursor-pointer`;
    }
    
    // Default variant
    return `${baseClasses} flex flex-col gap-3 pb-3 ${
      isMobile ? 'hover:scale-[1.02]' : 'transform hover:scale-105'
    } cursor-pointer`;
  };

  const getImageClasses = () => {
    if (variant === 'list') {
      return isMobile ? 'w-full aspect-[16/10]' : 'w-48 aspect-square';
    }
    
    if (variant === 'compact') {
      return isMobile ? 'aspect-[16/10]' : 'aspect-[4/3]';
    }
    
    // Default aspect ratio
    return isMobile ? 'aspect-[16/10]' : 'aspect-square';
  };

  const getPaddingClasses = () => {
    if (variant === 'compact') {
      return isMobile ? 'p-3' : 'p-4';
    }
    return isMobile ? 'p-3' : 'p-4';
  };

  // Enhanced image error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.style.backgroundImage = `url("/no-image.jpg")`;
    target.style.backgroundColor = '#f3f4f6';
  };

  // Render badges with responsive sizing
  const renderBadge = (text: string, colorClass: string, position: 'left' | 'right' = 'left') => (
    <div className={`absolute top-2 ${position === 'left' ? 'left-2' : 'right-2'} ${isMobile ? 'top-2' : 'top-3'}`}>
      <span className={`${colorClass} text-white font-medium rounded-full ${
        isMobile ? 'text-xs px-2 py-0.5' : 'text-xs px-2 py-1'
      }`}>
        {text}
      </span>
    </div>
  );

  // List variant for mobile/tablet
  if (variant === 'list') {
    return (
      <Link href={`/universities/${university.id}`} onClick={handleCardClick}>
        <div className={getCardClasses()}>
          {/* Image Section */}
          <div className="relative flex-shrink-0">
            <div
              className={`${getImageClasses()} bg-center bg-no-repeat bg-cover rounded-lg bg-gray-200`}
              style={{ backgroundImage: `url("${university.image}")` }}
              onError={handleImageError}
            >
              {/* Loading placeholder */}
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" 
                   style={{ display: university.image ? 'none' : 'block' }} />
            </div>
            
            {/* Badges for list view */}
            {university.type && university.type !== 'unknown' && 
              renderBadge(university.type.charAt(0).toUpperCase() + university.type.slice(1), 'bg-blue-600', 'left')
            }
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-[#101418] mb-2 line-clamp-2 ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>
              {university.name}
            </h3>
            
            <div className="space-y-1 mb-3">
              <p className={`text-[#5c728a] font-normal flex items-center ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isMobile ? truncateText(university.location, 30) : university.location}
              </p>
              
              {university.country && university.country !== 'Unknown Country' && (
                <p className={`text-[#5c728a] font-normal flex items-center ${
                  isMobile ? 'text-sm' : 'text-sm'
                }`}>
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  {university.country.charAt(0).toUpperCase() + university.country.slice(1)}
                </p>
              )}
            </div>

            {/* Description for list view */}
            {university.description && university.description !== 'No description available' && (
              <p className={`text-[#5c728a] leading-normal mb-3 ${
                isMobile ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'
              }`}>
                {isMobile && !showFullDescription 
                  ? truncateText(university.description, 100)
                  : university.description
                }
              </p>
            )}

            {/* Website link for list view */}
            {university.website && (
              <div className="mt-2">
                <span className={`inline-flex items-center text-blue-600 font-medium hover:text-blue-800 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  Visit Website
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default and Compact variants
  return (
    <Link href={`/universities/${university.id}`} onClick={handleCardClick}>
      <div className={getCardClasses()}>
        <div className="relative">
          <div
            className={`w-full ${getImageClasses()} bg-center bg-no-repeat bg-cover rounded-t-lg bg-gray-200`}
            style={{ 
              backgroundImage: `url("${university.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onError={handleImageError}
          >
            {/* Loading placeholder */}
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg" 
                 style={{ display: university.image ? 'none' : 'block' }} />
          </div>
          
          {/* University Type Badge */}
          {university.type && university.type !== 'unknown' && 
            renderBadge(university.type.charAt(0).toUpperCase() + university.type.slice(1), 'bg-blue-600', 'left')
          }
          
          {/* Area Setting Badge */}
          {university.setting && university.setting !== 'unknown' && 
            renderBadge(university.setting.charAt(0).toUpperCase() + university.setting.slice(1), 'bg-green-600', 'right')
          }
        </div>
        
        <div className={`${getPaddingClasses()} flex flex-col items-center justify-center text-center`}>
          <h3 className={`text-[#101418] font-semibold leading-snug mb-2 line-clamp-2 ${
            isMobile ? 'text-base' : 'text-lg'
          }`}>
            {isMobile ? truncateText(university.name, 40) : university.name}
          </h3>
          
          <div className="space-y-1 mb-3 w-full">
            <p className={`text-[#5c728a] font-normal leading-normal flex items-center justify-center ${
              isMobile ? 'text-sm' : 'text-sm'
            }`}>
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {isMobile ? truncateText(university.location, 25) : university.location}
            </p>
            
            {university.country && university.country !== 'Unknown Country' && (
              <p className={`text-[#5c728a] font-normal leading-normal flex items-center justify-center ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                {university.country.charAt(0).toUpperCase() + university.country.slice(1)}
              </p>
            )}
          </div>

          {/* Description (truncated) */}
          {university.description && university.description !== 'No description available' && (
            <p className={`text-[#5c728a] leading-normal mb-3 ${
              isMobile ? 'text-xs line-clamp-2' : 'text-xs line-clamp-3'
            }`}>
              {isMobile 
                ? truncateText(university.description, 80)
                : university.description
              }
            </p>
          )}

          {/* Website Link */}
          {university.website && (
            <div className="mt-3">
              <span className={`inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors ${
                isMobile ? 'text-xs' : 'text-xs'
              }`}>
                Visit Website
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
            </div>
          )}
        </div>

        {/* Mobile: Touch indicator */}
        {isMobile && (
          <div className="absolute bottom-2 right-2 opacity-30">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
};
