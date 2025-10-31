import React from 'react';

const UniversitySkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header Skeleton */}
      <div className="bg-gray-200 h-48 w-full rounded-lg"></div>
      <div className="flex items-center space-x-4">
        <div className="bg-gray-200 rounded-full h-24 w-24"></div>
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex space-x-4 mt-8">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4 mt-8">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Card Grid Skeleton (for listing page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversitySkeleton;
