import React from 'react';

// Loading Card Components
export const NewsLoadingCard = () => (
  <div className="cursor-pointer h-full">
    <div className="flex flex-col gap-4 rounded-lg">
      <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-xl" />
      <div>
        <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-3 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
        </div>
      </div>
    </div>
  </div>
);

export const UniversityLoadingCard = () => (
  <div className="bg-white h-full">
    <div className="flex flex-col gap-4 rounded-lg">
      <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-xl" />
      <div className="flex flex-col gap-1">
        <div className="h-4 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
        <div className="flex items-center justify-between mt-1">
          <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-12" />
        </div>
      </div>
    </div>
  </div>
);

export const ScholarshipLoadingCard = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 h-full">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-blue-200 rounded-full animate-pulse mr-4" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-blue-200 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-blue-200 animate-pulse rounded w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-blue-200 animate-pulse rounded" />
      <div className="h-3 bg-blue-200 animate-pulse rounded" />
      <div className="h-3 bg-blue-200 animate-pulse rounded" />
    </div>
  </div>
);

export const JobLoadingCard = () => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 h-full">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-green-200 rounded-full animate-pulse mr-4" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-green-200 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-green-200 animate-pulse rounded w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-green-200 animate-pulse rounded" />
      <div className="h-3 bg-green-200 animate-pulse rounded" />
      <div className="h-3 bg-green-200 animate-pulse rounded" />
    </div>
  </div>
);

export const OpportunityLoadingCard = () => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 h-full">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-purple-200 rounded-full animate-pulse mr-4" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-purple-200 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-purple-200 animate-pulse rounded w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-purple-200 animate-pulse rounded" />
      <div className="h-3 bg-purple-200 animate-pulse rounded" />
      <div className="h-3 bg-purple-200 animate-pulse rounded" />
      <div className="h-3 bg-purple-200 animate-pulse rounded" />
    </div>
  </div>
);

export const AmbassadorLoadingCard = () => (
  <div className="flex flex-col gap-4 text-center rounded-lg pt-4 h-full">
    <div className="bg-gray-200 animate-pulse aspect-square rounded-full mx-auto w-32 h-32" />
    <div>
      <div className="h-4 bg-gray-200 animate-pulse rounded mx-auto w-24 mb-2" />
      <div className="h-3 bg-gray-200 animate-pulse rounded mx-auto w-32 mb-1" />
      <div className="h-3 bg-gray-200 animate-pulse rounded mx-auto w-20" />
    </div>
  </div>
);

export const MentorLoadingCard = () => (
  <div className="flex flex-col gap-4 text-center rounded-lg pt-4 h-full">
    <div className="bg-gray-200 animate-pulse aspect-square rounded-full mx-auto w-32 h-32" />
    <div>
      <div className="h-4 bg-gray-200 animate-pulse rounded mx-auto w-24 mb-2" />
      <div className="h-3 bg-gray-200 animate-pulse rounded mx-auto w-32" />
    </div>
  </div>
);

// Error Card Components
export const NewsErrorCard = () => (
  <div className="cursor-pointer h-full">
    <div className="flex flex-col gap-4 rounded-lg p-4 bg-red-50 border border-red-200">
      <div className="w-full aspect-video bg-red-100 rounded-xl flex items-center justify-center">
        <span className="text-red-500 text-sm">Failed to load</span>
      </div>
      <div>
        <p className="text-red-700 text-base font-medium">Unable to load news</p>
        <p className="text-red-600 text-sm">Please try again later</p>
      </div>
    </div>
  </div>
);

export const UniversityErrorCard = () => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 h-full flex items-center justify-center">
    <span className="text-red-600 text-sm">Failed to load universities</span>
  </div>
);

export const ScholarshipErrorCard = () => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 h-full flex items-center justify-center">
    <span className="text-red-600 text-sm">Failed to load scholarships</span>
  </div>
);

export const JobErrorCard = () => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 h-full flex items-center justify-center">
    <span className="text-red-600 text-sm">Failed to load jobs</span>
  </div>
);

export const OpportunityErrorCard = () => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 h-full flex items-center justify-center">
    <span className="text-red-600 text-sm">Failed to load opportunities</span>
  </div>
);

export const AmbassadorErrorCard = () => (
  <div className="flex flex-col gap-4 text-center rounded-lg pt-4 h-full">
    <div className="bg-red-100 aspect-square rounded-full mx-auto w-32 h-32 flex items-center justify-center">
      <span className="text-red-500 text-xs">Failed to load</span>
    </div>
    <div>
      <p className="text-red-700 text-base font-medium">Unable to load</p>
      <p className="text-red-600 text-sm">Please try again later</p>
    </div>
  </div>
);

export const MentorErrorCard = () => (
  <div className="flex flex-col gap-4 text-center rounded-lg pt-4 h-full">
    <div className="bg-red-100 aspect-square rounded-full mx-auto w-32 h-32 flex items-center justify-center">
      <span className="text-red-500 text-xs">Failed to load</span>
    </div>
    <div>
      <p className="text-red-700 text-base font-medium">Unable to load</p>
      <p className="text-red-600 text-sm">Please try again later</p>
    </div>
  </div>
);

// Helper component to render multiple cards
interface LoadingCardsProps {
  count: number;
  type: 'news' | 'university' | 'scholarship' | 'job' | 'opportunity' | 'ambassador' | 'mentor';
}

export const LoadingCards = ({ count, type }: LoadingCardsProps) => {
  const components = {
    news: NewsLoadingCard,
    university: UniversityLoadingCard,
    scholarship: ScholarshipLoadingCard,
    job: JobLoadingCard,
    opportunity: OpportunityLoadingCard,
    ambassador: AmbassadorLoadingCard,
    mentor: MentorLoadingCard,
  };

  const Component = components[type];
  
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <Component key={index} />
      ))}
    </>
  );
};

interface ErrorCardsProps {
  count: number;
  type: 'news' | 'university' | 'scholarship' | 'job' | 'opportunity' | 'ambassador' | 'mentor';
}

export const ErrorCards = ({ count, type }: ErrorCardsProps) => {
  const components = {
    news: NewsErrorCard,
    university: UniversityErrorCard,
    scholarship: ScholarshipErrorCard,
    job: JobErrorCard,
    opportunity: OpportunityErrorCard,
    ambassador: AmbassadorErrorCard,
    mentor: MentorErrorCard,
  };

  const Component = components[type];
  
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <Component key={index} />
      ))}
    </>
  );
};