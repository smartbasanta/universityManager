'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import { UndergraduateSidebar } from './UndergraduateSidebar';

// CORRECTED: Import from the new barrel file
import { RankingSection, SchoolsSection, AdmissionSection, TuitionSection } from './sections';

export function UndergraduateTabContent({ universityId }: { universityId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universityUndergraduate', universityId],
    queryFn: () => websiteUniversityAPI.fetchUniversityUndergraduateSection(universityId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div className="text-center py-10">Loading Undergraduate Information...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load undergraduate data.</div>;
  if (!data) return null;

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <UndergraduateSidebar />
      </div>
      <div className="flex-1">
        <RankingSection level="UNDERGRADUATE" rankings={data.ranking || []} />
        <SchoolsSection level="UNDERGRADUATE" majors={data.university_major || []} />
        <AdmissionSection level="UNDERGRADUATE" admissionData={data.university_admission} />
        <TuitionSection level="UNDERGRADUATE" tuitionData={data.tution?.[0]} />
      </div>
    </div>
  );
}