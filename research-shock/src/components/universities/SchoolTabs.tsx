
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OverviewCard } from './OverViewCard';
import { RankingsCard } from './RankingsCard';
import { StudentLifeCard } from './StudentLifeCard';
import { SportsCard } from './SportsCard';
import { University } from '@/types/university';
import { UndergraduateCard } from './UndergraduateCard';
import { GraduateCard } from './GraduateCard';
import { CareerOutcomesCard } from './CareerOutcomesCard';

interface SchoolTabsProps {
  university: University;
}

export const SchoolTabs = ({ university }: SchoolTabsProps) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    {
      id: 'general',
      label: 'General Info',
      content: <OverviewCard overview={university.overview} />,
    },
    {
      id: 'undergraduate',
      label: 'Undergraduate',
      content: <UndergraduateCard admissions={university.undergraduate_admissions} tuition={university.undergraduate_tuition_fees} departments={university.undergraduate_departments} />,
    },
    {
      id: 'graduate',
      label: 'Graduate',
      content: <GraduateCard admissions={university.graduate_admissions} tuition={university.graduate_tuition_fees} departments={university.graduate_departments} />,
    },
    {
      id: 'career-outcomes',
      label: 'Career Outcomes',
      content: <CareerOutcomesCard careerOutcomes={university.career_outcomes} />,
    },
    {
      id: 'rankings',
      label: 'Rankings',
      content: <RankingsCard rankings={university.rankings} />,
    },
    {
      id: 'student-life',
      label: 'Student Life',
      content: <StudentLifeCard studentLife={university.student_life} />,
    },
    {
      id: 'sports',
      label: 'Sports',
      content: <SportsCard sports={university.sports} />,
    },
  ];

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <div className="flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative whitespace-nowrap py-4 px-6 font-semibold text-base transition-all duration-300 text-left 
                                ${
                                activeTab === tab.id
                                    ? 'text-blue-600 bg-blue-50 rounded-lg'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-3">
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
        </div>
    </div>
  );
};
