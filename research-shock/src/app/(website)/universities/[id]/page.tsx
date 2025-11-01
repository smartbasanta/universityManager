import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UniversityHeader } from '@/components/universities/UniversityHeader';
import { SchoolTabs } from '@/components/universities/SchoolTabs';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';

interface PageProps {
  params: {
    id: string;
  };
}

// This is a lean SERVER COMPONENT
export default async function UniversityPage({ params }: PageProps) {
  try {
    const { id } = await params;
    const basicInfo = await websiteUniversityAPI.fetchUniversityBasicInfo(id);
    console.log(basicInfo);
    return (
      <div className="relative flex flex-col bg-white min-h-screen">
        <Header />
        <main>
          {/* just the clean basicInfo. */}
          <UniversityHeader basicInfo={basicInfo} />
          
          <SchoolTabs 
            universityId={id}
            initialData={basicInfo}
          />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    const idForLogging = (await params)?.id || 'unknown ID';
    console.error(`Failed to load university ${idForLogging}:`, error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  try {
        const { id } = await params;
    const basicInfo = await websiteUniversityAPI.fetchUniversityBasicInfo(id);
    
    return {
      title: `${basicInfo.university_name} - ResearchShock`,
      description: basicInfo.description || basicInfo.overview?.description || `Learn more about ${basicInfo.university_name}`,
    };
  } catch (error) {
    return {
      title: 'University Not Found - ResearchShock',
      description: 'The requested university could not be found.',
    };
  }
}
