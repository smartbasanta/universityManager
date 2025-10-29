'use client';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import { Sidebar } from './sections/common/Sidebar';
import { RankingSection } from './sections/RankingSection';
import { SchoolsSection } from './sections/SchoolsSection';
import { AdmissionSection } from './sections/AdmissionSection';
import { TuitionSection } from './sections/TuitionSection';

const sidebarItems = [
  { id: 'undergraduate-rankings', label: 'Rankings' },
  { id: 'undergraduate-programs', label: 'Programs' },
  { id: 'undergraduate-admissions', label: 'Admissions' },
  { id: 'undergraduate-tuition', label: 'Tuition' },
];

export function UndergraduateTab({ universityId }: { universityId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['universityUndergraduateData', universityId],
    queryFn: () => websiteUniversityAPI.fetchUndergraduateSectionData(universityId),
  });

  if (isLoading) return <div className="text-center py-10">Loading Undergraduate Information...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Failed to load data.</div>;
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      <div className="w-full lg:w-64 flex-shrink-0">
        <Sidebar items={sidebarItems} title="Undergraduate" theme="green" />
      </div>
      <div className="flex-1 space-y-8">
        <RankingSection rankings={data?.rankings} level="UNDERGRADUATE" />
        <SchoolsSection departments={data?.departments} level="UNDERGRADUATE" />
        <AdmissionSection admissions={data?.admissions} level="UNDERGRADUATE" />
        <TuitionSection tuitions={data?.tuition_fees} level="UNDERGRADUATE" />
      </div>
    </div>
  );
}