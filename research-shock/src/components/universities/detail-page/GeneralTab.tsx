'use client';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI, type UniversityBasicInfo } from '@/hooks/api/website/university.api';
import { Sidebar } from './sections/common/Sidebar';
import { CampusLifeSection } from './sections/CampusLifeSection';
import { SportsSection } from './sections/SportsSection';
import { NotableAlumniSection } from './sections/NotableAlumniSection';
import { ResearchSection } from './sections/ResearchSection';
import { ReviewsSection } from './sections/ReviewsSection';

const sidebarItems = [
  { id: 'campus-life', label: 'Campus Life' },
  { id: 'sports', label: 'Sports' },
  { id: 'notable-alumni', label: 'Notable Alumni' },
  { id: 'research-hubs', label: 'Research' },
  { id: 'reviews', label: 'Reviews' },
];

export function GeneralTab({ universityId, initialData }: { universityId: string, initialData: UniversityBasicInfo }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['universityGeneralData', universityId],
    queryFn: () => websiteUniversityAPI.fetchGeneralSectionData(universityId),
  });

  if (isLoading) return <div className="text-center py-10">Loading General Information...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Failed to load data.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      <div className="w-full lg:w-64 flex-shrink-0">
        <Sidebar items={sidebarItems} title="General Navigation" />
      </div>
      <div className="flex-1 space-y-8">
        {/* Pass the correct data slice to each section */}
        <CampusLifeSection studentLife={data?.student_life} />
        <SportsSection sports={data?.sports} />
        <NotableAlumniSection alumni={data?.notable_alumni} />
        <ResearchSection hubs={data?.research_hubs} />
        <ReviewsSection initialReviews={data?.reviews || []} universityId={universityId} />
      </div>
    </div>
  );
}