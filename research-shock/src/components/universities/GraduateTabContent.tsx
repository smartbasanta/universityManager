'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import { GraduateSidebar } from './GraduateSidebar';

// CORRECTED: Import from the new barrel file
import { RankingSection, SchoolsSection, AdmissionSection, TuitionSection } from './sections';

// You would also create and import a GraduateResearchSection here

export function GraduateTabContent({ universityId }: { universityId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universityGraduate', universityId],
    queryFn: () => websiteUniversityAPI.fetchUniversityGraduateSection(universityId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div className="text-center py-10">Loading Graduate Information...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load graduate data.</div>;
  if (!data) return null;

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <GraduateSidebar />
      </div>
      <div className="flex-1">
        <RankingSection level="GRADUATE" rankings={data.ranking || []} />
        <SchoolsSection level="GRADUATE" majors={data.graduate_majors || []} />
        <AdmissionSection level="GRADUATE" admissionData={data.university_graduate_admission} />
        <TuitionSection level="GRADUATE" tuitionData={data.gradtution?.[0]} />
        {/* <GraduateResearchSection researchData={data.graduate_research} /> */}
      </div>
    </div>
  );
}