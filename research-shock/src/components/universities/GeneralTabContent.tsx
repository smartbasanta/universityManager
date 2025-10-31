"use client";

import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import type { UniversityBasicInfo } from '@/hooks/api/website/university.api';

// import { CampusLifeSection } from './sections/CampusLifeSection'; // Assuming we create this
// import { SportsSection } from './sections/SportsSection'; // Assuming we create this
// import { ResearchSection } from './sections/ResearchSection'; // New section
// import { AlumniSection } from './sections/AlumniSection'; // New section
import { ReviewsSection } from './ReviewsSection';
import { UniversitySidebar } from './UniversitySidebar';
import { motion } from 'framer-motion';

// Updated transformer with more robust data handling
const transformGeneralSectionData = (data: any) => {
  const sportsData = data?.sports?.university_sports || {};
  const studentLifeData = data?.studentLife || {};
  const researchData = data?.research || [];
  const alumniData = data?.alumni || [];

  const campusLifeInfo = {
    housing: {
      title: 'Student Housing',
      description: studentLifeData.housing?.description || 'Diverse on-campus housing options available.',
      options: studentLifeData.housing?.options || [],
    },
    dining: {
      title: 'Dining Services',
      description: studentLifeData.dining?.description || 'Variety of meal plans and dining facilities.',
      options: studentLifeData.dining?.options || [],
    },
    recreation: {
      title: 'Recreation & Wellness',
      description: sportsData.description || 'State-of-the-art recreation facilities.',
      facilities: sportsData.facilities?.map((f: any) => f.name) || [],
    },
    organizations: {
      title: 'Student Organizations',
      description: studentLifeData.description || 'Vibrant student community with numerous clubs.',
      count: parseInt(studentLifeData.no_of_students_organisation || '0', 10),
      examples: studentLifeData.category?.map((c: any) => c.name) || [],
    },
  };

  const sportsInfo = {
    overview: sportsData.description || 'Competitive athletics program.',
    teams: [
      ...(sportsData.men_sports_teams || []).map((team: string) => ({ name: `Men's ${team}`, league: 'NCAA' })),
      ...(sportsData.women_sports_teams || []).map((team: string) => ({ name: `Women's ${team}`, league: 'NCAA' })),
    ],
    facilities: sportsData.facilities?.map((facility: any) => ({
      name: facility.name,
      description: facility.description || `Premier facility for ${facility.name}.`,
      website: facility.website,
    })) || [],
    intramurals: sportsData.intramural_sports?.map((sport: any) => sport.name) || [],
  };

  return { campusLifeInfo, sportsInfo, researchData, alumniData };
};

export function GeneralTabContent({ universityId, initialData }: { universityId: string, initialData: UniversityBasicInfo }) {
  const { data: sectionsData, isLoading, error } = useQuery({
    queryKey: ['universityGeneralSections', universityId],
    queryFn: async () => {
      const [sports, studentLife, research, alumni] = await Promise.all([
        websiteUniversityAPI.fetchUniversitySportsSection(universityId),
        websiteUniversityAPI.fetchUniversityStudentLifeSection(universityId),
        websiteUniversityAPI.fetchUniversityResearchSection(universityId),
        websiteUniversityAPI.fetchUniversityAlumniSection(universityId),
      ]);
      return { sports, studentLife, research, alumni };
    },
    staleTime: 1000 * 60 * 5,
  });

  const { campusLifeInfo, sportsInfo, researchData, alumniData } = transformGeneralSectionData(sectionsData);

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      <div className="hidden lg:block w-72 flex-shrink-0 sticky top-20 self-start">
        <UniversitySidebar />
      </div>  
      <motion.div 
        className="flex-1 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Overview from initial data */}
        {initialData.overview && (
          <section id="university-overview" className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">University Overview</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{initialData.overview.description}</p>
          </section>
        )}

        {isLoading && <div className="text-center py-10 text-gray-500">Loading additional sections...</div>}
        {error && <div className="text-center py-10 text-red-600">Failed to load sections. Please try again.</div>}

        {sectionsData?.studentLife && <CampusLifeSection campusLifeInfo={campusLifeInfo} />}
        {sectionsData?.sports && <SportsSection sportsInfo={sportsInfo} />}
        {sectionsData?.research && <ResearchSection researchData={researchData} />}
        {sectionsData?.alumni && <AlumniSection alumniData={alumniData} />}
        
        <ReviewsSection universityId={universityId} />
      </motion.div>
    </div>
  );
}