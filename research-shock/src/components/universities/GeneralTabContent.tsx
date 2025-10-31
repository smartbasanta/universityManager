import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import type { UniversityBasicInfo } from '@/hooks/api/website/university.api';
import { CampusLifeSection } from './CampusLifeSection';
import { SportsSection } from './SportsSection';
import { ReviewsSection } from './ReviewsSection';
// import { UniversitySidebar } from './UniversitySidebar';
import UniversitySkeleton from '@/components/universities/UniversitySkeleton';
import { Building, Mail, Phone } from 'lucide-react';
import { GeneralInfoSlider } from './sections/GeneralInfoSlider';

const OverviewSection = ({ overview }: { overview: UniversityBasicInfo['overview'] }) => (
  <div id="university-overview" className="py-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">University Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 text-lg mb-2">Established</h3>
        <p className="text-gray-800 text-xl font-bold">{overview?.established_in || 'N/A'}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 text-lg mb-2">Type</h3>
        <p className="text-gray-800 text-xl font-bold">{overview?.university_type || 'N/A'}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-1 md:col-span-2">
        <h3 className="font-semibold text-gray-700 text-lg mb-2">Mission Statement</h3>
        <p className="text-gray-800 leading-relaxed">{overview?.mission_statement || 'No mission statement available.'}</p>
      </div>
    </div>
  </div>
);

const ContactSection = ({ contact }: { contact: UniversityBasicInfo['overview'] }) => (
  <div id="contacts" className="py-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex items-start bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <Mail className="w-6 h-6 mr-4 text-blue-600 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-gray-700 text-lg mb-1">Email</h3>
          <a href={`mailto:${contact?.email}`} className="text-blue-600 hover:underline text-base break-all">{contact?.email || 'N/A'}</a>
        </div>
      </div>
      <div className="flex items-start bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <Phone className="w-6 h-6 mr-4 text-green-600 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-gray-700 text-lg mb-1">Phone</h3>
          <p className="text-gray-800 text-base">{contact?.phone_number || 'N/A'}</p>
        </div>
      </div>
      <div className="flex items-start bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <Building className="w-6 h-6 mr-4 text-purple-600 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-gray-700 text-lg mb-1">Address</h3>
          <p className="text-gray-800 text-base">{`${contact?.address || ''}, ${contact?.city || ''}, ${contact?.state || ''}, ${contact?.country || ''}`.replace(/, ,/g, ',').replace(/^, /,'').replace(/, $/, '') || 'N/A'}</p>
        </div>
      </div>
    </div>
  </div>
);

export function GeneralTabContent({ universityId, initialData }: { universityId: string, initialData: UniversityBasicInfo }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universityGeneralSections', universityId],
    queryFn: () => websiteUniversityAPI.fetchGeneralSectionData(universityId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <UniversitySkeleton />;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load general sections.</div>;
  if (!data) return <div className="text-center py-10 text-gray-500">No general information available.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-64 flex-shrink-0">
        <UniversitySidebar />
      </div>
      <div className="flex-1 min-w-0 space-y-8">
        <GeneralInfoSlider>
          {data.overview && <OverviewSection overview={data.overview} />}
          {data.overview && <ContactSection contact={data.overview} />}
        </GeneralInfoSlider>
        
        {data.student_life && <CampusLifeSection studentLife={data.student_life} />}
        {data.sports && <SportsSection sports={data.sports} />}
        
        <ReviewsSection universityId={universityId} reviews={data.reviews} isLoading={isLoading} error={!!error} />
      </div>
    </div>
  );
}