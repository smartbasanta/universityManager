"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import { GeneralTabContent } from './GeneralTabContent';
import { UndergraduateTabContent } from './UndergraduateTabContent';
import { GraduateTabContent } from './GraduateTabContent';
import { CareerOutcomesSection } from './sections/CareerOutcomesSection';
import { ReviewsSection } from './ReviewsSection';
import type { UniversityBasicInfo } from '@/hooks/api/website/university.api';
import { motion, AnimatePresence } from 'framer-motion'; // Added for tab animations

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
    <div className="w-full bg-white rounded-3xl shadow-xl p-6 md:p-8">
      <div className="flex flex-wrap gap-2 md:gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative whitespace-nowrap py-4 px-6 font-semibold text-base transition-all duration-300 
                ${activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="py-4"
        >
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};