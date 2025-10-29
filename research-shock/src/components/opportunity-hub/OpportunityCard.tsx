import Link from 'next/link';
import { Opportunity } from '@/hooks/api/website/opportunity.api';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export const OpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  return (
    <Link href={`/opportunity-hub/${opportunity.id}`}>
      <div className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 truncate transition-colors mb-1">
              {opportunity.displayTitle || opportunity.title}
            </h3>
            <p className="text-base font-medium text-gray-900 truncate mb-2">
              {opportunity.organization || opportunity.university?.university_name}
            </p>
            <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {opportunity.displayLocation || opportunity.location}
              </span>
              <span>•</span>
              <span>{opportunity.educationalLevel}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-600">
              <span>{opportunity.typeDisplay || opportunity.type}</span>
              <span>•</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12l-1-7h2l-1 7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9z" />
                </svg>
                {opportunity.venue}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-4H8v4h4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v6m0 0L9 4m3 3l3-3" />
                </svg>
                {opportunity.startDate}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {opportunity.duration}
              </span>
            </div>
            
            {/* Tags */}
            {opportunity.tags && opportunity.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {opportunity.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                {opportunity.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    +{opportunity.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              {opportunity.datePosted || 'Recently posted'}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2 ml-4">
            {opportunity.status === 'Live' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Live
              </span>
            )}
            
            {opportunity.isOngoing && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                Ongoing
              </span>
            )}
            
            {opportunity.isUpcoming && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                Upcoming
              </span>
            )}
            
            {opportunity.isPast && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Past
              </span>
            )}
            
            {opportunity.hasApplicationForm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                Apply Online
              </span>
            )}
            
            {/* Arrow indicator */}
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
