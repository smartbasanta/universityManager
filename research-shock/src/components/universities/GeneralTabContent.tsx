'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import type { UniversityBasicInfo } from '@/hooks/api/website/university.api';

import { CampusLifeSection } from './CampusLifeSection';
import { SportsSection } from './SportsSection';
import { ReviewsSection } from './ReviewsSection';
import { UniversitySidebar } from './UniversitySidebar';

// A smaller, focused transformer for just the general tab sections
const transformGeneralSectionData = (sportsData: any, studentLifeData: any) => {
  const campusLifeInfo = {
    housing: {
      title: 'Student Housing',
      description: 'On-campus housing options are available.',
      options: [],
    },
    dining: {
      title: 'Dining Services',
      description: 'A variety of meal plans and dining halls are available.',
      options: [],
    },
    recreation: {
      title: 'Recreation & Sports',
      description: sportsData?.description || 'Recreation facilities available.',
      facilities: (sportsData?.facilities || []).map((f: any) => f.name),
    },
    organizations: {
      title: 'Student Organizations',
      description: studentLifeData?.description || 'Over 300 student clubs and organizations.',
      count: parseInt(studentLifeData?.no_of_students_organisation || '0', 10),
      examples: (studentLifeData?.category || []).map((c: any) => c.name),
    },
  };

  const sportsInfo = {
    overview: sportsData?.description || 'A proud member of its athletic conference.',
    teams: [
      ...(sportsData?.men_sports_teams || []).map((team: string) => ({ name: `Men's ${team}`, league: 'NCAA' })),
      ...(sportsData?.women_sports_teams || []).map((team: string) => ({ name: `Women's ${team}`, league: 'NCAA' })),
    ],
    facilities: (sportsData?.facilities || []).map((facility: any) => ({
      name: facility.name,
      description: `State-of-the-art facility for ${facility.name}.`,
      website: facility.website,
    })),
    intramurals: (sportsData?.intramural_sports || []).map((sport: any) => sport.name),
  };
  
  return { campusLifeInfo, sportsInfo };
};

export function GeneralTabContent({ universityId, initialData }: { universityId: string, initialData: UniversityBasicInfo }) {
  // Fetch the remaining general sections on the client
  const { data: sectionsData, isLoading, error } = useQuery({
    queryKey: ['universityGeneralSections', universityId],
    queryFn: async () => {
      const [sports, studentLife, research, alumni] = await Promise.all([
        websiteUniversityAPI.fetchUniversitySportsSection(universityId),
        // Add other API calls as you create them in university.api.ts
        // For now, let's assume they exist
        websiteUniversityAPI.fetchUniversityStudentLifeSection(universityId), 
        websiteUniversityAPI.fetchUniversityResearchSection(universityId),
        websiteUniversityAPI.fetchUniversityAlumniSection(universityId),
      ]);
      // A placeholder for the other sections until their API calls are added
      return { sports, studentLife, research, alumni };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { campusLifeInfo, sportsInfo } = transformGeneralSectionData(sectionsData?.sports?.university_sports, sectionsData?.studentLife);

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <UniversitySidebar />
      </div>
      <div className="flex-1">
        {/* Contact & Overview (from initial data) */}
        <div id="contacts" className="py-8">
          {/* ... Contact JSX from old page ... */}
        </div>
        {initialData.university_overview && (
          <div id="university-overview" className="py-8">
            {/* ... University Overview JSX from old page ... */}
          </div>
        )}
        
        {/* Sections loaded on the client */}
        {isLoading && <div>Loading more sections...</div>}
        {error && <div>Could not load all sections.</div>}

        {sectionsData?.studentLife && <CampusLifeSection campusLifeInfo={campusLifeInfo} />}
        {sectionsData?.sports && <SportsSection sportsInfo={sportsInfo} />}
        {/* {sectionsData?.studentLife && <Alu campusLifeInfo={campusLifeInfo} />} */}
        
        <ReviewsSection universityId={universityId} />
      </div>
    </div>
  );
}