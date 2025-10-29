'use client';

import { useState, ReactNode } from "react";
// Import the new tab content components
import { GeneralTabContent } from './GeneralTabContent';
import { UndergraduateTabContent } from './UndergraduateTabContent';
import { GraduateTabContent } from './GraduateTabContent';
import { UniversityBasicInfo } from '@/hooks/api/website/university.api';

interface SchoolTabsProps {
  universityId: string;
  initialData: UniversityBasicInfo; // It receives the pre-fetched basic data
}

export const SchoolTabs = ({ universityId, initialData }: SchoolTabsProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'undergraduate' | 'graduate'>('general');

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-gray-500 text-gray-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General Information
            </button>
            <button
              onClick={() => setActiveTab('undergraduate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'undergraduate'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Undergraduate
            </button>
            <button
              onClick={() => setActiveTab('graduate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'graduate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Graduate
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'general' && <GeneralTabContent universityId={universityId} initialData={initialData} />}
          {activeTab === 'undergraduate' && <UndergraduateTabContent universityId={universityId} />}
          {activeTab === 'graduate' && <GraduateTabContent universityId={universityId} />}
        </div>
      </div>
    </div>
  );
};