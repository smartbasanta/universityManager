"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import { GeneralTabContent } from './GeneralTabContent';
import { UndergraduateTabContent } from './UndergraduateTabContent';
import { GraduateTabContent } from './GraduateTabContent';
import { CareerOutcomesSection } from './sections/CareerOutcomesSection';
import { ReviewsSection } from './ReviewsSection';
import type { UniversityBasicInfo } from '@/hooks/api/website/university.api';

interface SchoolTabsProps {
  universityId: string;
  initialData: UniversityBasicInfo;
}

export const SchoolTabs = ({ universityId, initialData }: SchoolTabsProps) => {
  const [activeTab, setActiveTab] = useState('general');

  const { data: careerOutcomes, isLoading: isLoadingCareer, error: errorCareer } = useQuery({
    queryKey: ['universityCareerOutcomes', universityId],
    queryFn: () => websiteUniversityAPI.fetchCareerOutcomes(universityId),
    staleTime: 1000 * 60 * 5,
  });

  const tabs = [
    { id: 'general', label: 'General Info', content: <GeneralTabContent universityId={universityId} initialData={initialData} /> },
    { id: 'undergraduate', label: 'Undergraduate', content: <UndergraduateTabContent universityId={universityId} /> },
    { id: 'graduate', label: 'Graduate', content: <GraduateTabContent universityId={universityId} /> },
    { id: 'career', label: 'Career Outcomes', content: <CareerOutcomesSection careerOutcomes={careerOutcomes} isLoading={isLoadingCareer} error={errorCareer} /> },
    { id: 'reviews', label: 'Reviews', content: <ReviewsSection universityId={universityId} /> },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 md:gap-4 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};
