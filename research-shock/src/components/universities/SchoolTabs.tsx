'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Building2, Award } from 'lucide-react';
import { GeneralTabContent } from './GeneralTabContent';
import { UndergraduateTabContent } from './UndergraduateTabContent';
import { GraduateTabContent } from './GraduateTabContent';
import type { UniversityBasicInfo } from '@/hooks/api/website/university.api';

interface SchoolTabsProps {
  universityId: string;
  initialData: UniversityBasicInfo;
}

type TabType = 'general' | 'undergraduate' | 'graduate';

interface Tab {
  id: TabType;
  label: string;
  icon: typeof GraduationCap;
  color: string;
}

const tabs: Tab[] = [
  {
    id: 'general',
    label: 'General Information',
    icon: Building2,
    color: 'blue'
  },
  {
    id: 'undergraduate',
    label: 'Undergraduate',
    icon: GraduationCap,
    color: 'green'
  },
  {
    id: 'graduate',
    label: 'Graduate',
    icon: Award,
    color: 'purple'
  }
];

export const SchoolTabs = ({ universityId, initialData }: SchoolTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? 'border-blue-600 text-blue-600 bg-blue-50' 
        : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300',
      green: isActive 
        ? 'border-green-600 text-green-600 bg-green-50' 
        : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300',
      purple: isActive 
        ? 'border-purple-600 text-purple-600 bg-purple-50' 
        : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 mb-8 -mx-4 px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative py-4 px-6 border-b-3 font-semibold text-sm
                    transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                    ${getColorClasses(tab.color, isActive)}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'general' && (
              <GeneralTabContent universityId={universityId} initialData={initialData} />
            )}
            {activeTab === 'undergraduate' && (
              <UndergraduateTabContent universityId={universityId} />
            )}
            {activeTab === 'graduate' && (
              <GraduateTabContent universityId={universityId} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};