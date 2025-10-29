'use client';
import { useState } from "react";
import { GeneralTab } from './GeneralTab';
import { UndergraduateTab } from './UndergraduateTab';
import { GraduateTab } from './GraduateTab';
import { UniversityBasicInfo } from '@/hooks/api/website/university.api';

export const SchoolTabs = ({ universityId, initialData }: { universityId: string, initialData: UniversityBasicInfo }) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
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
        <div>
          {activeTab === 'general' && <GeneralTab universityId={universityId} initialData={initialData} />}
          {activeTab === 'undergraduate' && <UndergraduateTab universityId={universityId} />}
          {activeTab === 'graduate' && <GraduateTab universityId={universityId} />}
        </div>
      </div>
    </div>
  );
};