'use client';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import { Sidebar } from './sections/common/Sidebar';
import { RankingSection } from './sections/RankingSection';
import { SchoolsSection } from './sections/SchoolsSection';
import { AdmissionSection } from './sections/AdmissionSection';
import { TuitionSection } from './sections/TuitionSection';
// You would also create and import a GraduateResearchSection here if needed

const sidebarItems = [
  { id: 'graduate-rankings', label: 'Rankings' },
  { id: 'graduate-programs', label: 'Programs' },
  { id: 'graduate-admissions', label: 'Admissions' },
  { id: 'graduate-tuition', label: 'Tuition' },
];

export function GraduateTab({ universityId }: { universityId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['universityGraduateData', universityId],
    queryFn: () => websiteUniversityAPI.fetchGraduateSectionData(universityId),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) return <div className="text-center py-10">Loading Graduate Information...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Failed to load graduate data.</div>;
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      <div className="w-full lg:w-64 flex-shrink-0">
        <Sidebar items={sidebarItems} title="Graduate" theme="purple" />
      </div>
      <div className="flex-1 space-y-8">
        <RankingSection rankings={data?.rankings} level="GRADUATE" />
        <SchoolsSection departments={data?.departments} level="GRADUATE" />
        <AdmissionSection admissions={data?.admissions} level="GRADUATE" />
        <TuitionSection tuitions={data?.tuition_fees} level="GRADUATE" />
        {/* <GraduateResearchSection researchData={data?.graduate_research} /> */}
      </div>
    </div>
  );
}