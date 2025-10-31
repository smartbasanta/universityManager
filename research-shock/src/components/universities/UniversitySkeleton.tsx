import React from 'react';
const UniversitySkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Banner Skeleton */}
      <div className="bg-gray-200 h-96 w-full rounded-3xl"></div>
      {/* Header Info */}
      <div className="flex items-center space-x-6">
        <div className="bg-gray-200 rounded-full h-32 w-32"></div>
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      {/* Tabs Skeleton */}
      <div className="flex space-x-6 mt-12">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-full w-32"></div>
        ))}
      </div>
      {/* Content Sections */}
      <div className="space-y-6 mt-12">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-48 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};
export default UniversitySkeleton;