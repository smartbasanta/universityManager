import Link from 'next/link';
import { Scholarship } from '@/hooks/api/website/scholarships.api';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard = ({ scholarship }: ScholarshipCardProps) => {
  return (
    <Link href={`/scholarships/${scholarship.id}`}>
      <div className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 truncate transition-colors mb-1">
              {scholarship.displayTitle || scholarship.title}
            </h3>
            <p className="text-base font-medium text-gray-900 truncate mb-2">
              {scholarship.organization || scholarship.university?.university_name}
            </p>
            <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {scholarship.displayLocation || scholarship.university?.country}
              </span>
              <span>•</span>
              <span>{scholarship.educationalLevel}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-600">
              <span>{scholarship.typeDisplay || scholarship.scholarshipType}</span>
              <span>•</span>
              <span>{scholarship.fieldOfStudy}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {scholarship.amountDisplay || `NPR ${scholarship.amount}`}
              </span>
              <span>•</span>
              <span className={`flex items-center ${scholarship.isUrgent ? 'text-red-600 font-medium' : ''}`}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {scholarship.deadlineDisplay}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {scholarship.datePosted || 'Recently posted'}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2 ml-4">
            {scholarship.status === 'Live' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Live
              </span>
            )}
            
            {scholarship.isUrgent && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                Urgent
              </span>
            )}
            
            {scholarship.hasApplicationForm && (
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
