"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import UniversitySkeleton from '@/components/universities/UniversitySkeleton';
import { RankingSection, SchoolsSection, AdmissionSection, TuitionSection } from './sections';

export function GraduateTabContent({ universityId }: { universityId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universityGraduate', universityId],
    queryFn: () => websiteUniversityAPI.fetchGraduateSectionData(universityId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <UniversitySkeleton />;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load graduate data.</div>;
  if (!data) return <div className="text-center py-10 text-gray-500">No graduate information available.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-64 flex-shrink-0">
        {/* <GraduateSidebar /> */}
      </div>
      <div className="flex-1 min-w-0 space-y-8">
        <RankingSection rankings={data.rankings || []} />
        <SchoolsSection departments={data.departments || []} level="GRADUATE" />
        <AdmissionSection admissionData={data.admissions?.find(adm => adm.level === 'graduate')} level="GRADUATE" />
        <TuitionSection tuitionData={data.tuition_fees?.find(t => t.level === 'graduate')} level="GRADUATE" />
      </div>
    </div>
  );
}