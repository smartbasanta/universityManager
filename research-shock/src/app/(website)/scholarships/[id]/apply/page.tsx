import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScholarshipApplicationForm } from '@/components/scholarships/ScholarshipApplicationForm';
import { websiteScholarshipsAPI } from '@/hooks/api/website/scholarships.api';
import type { Scholarship } from '@/hooks/api/website/scholarships.api';

interface PageProps {
  params: {
    id: string;
  };
}

// Server-side function to get scholarship by ID
async function getScholarshipById(id: string): Promise<Scholarship | null> {
  try {
    const scholarship = await websiteScholarshipsAPI.fetchScholarshipById(id);
    return scholarship;
  } catch (error: any) {
    console.error('Error fetching scholarship:', error);
    return null;
  }
}

export default async function ScholarshipApplicationPage({ params }: PageProps) {
  const scholarship = await getScholarshipById(params.id);

  if (!scholarship) {
    notFound();
  }

  // If no application form available, redirect to scholarship detail
  if (!scholarship.hasApplicationForm) {
    notFound();
  }

  return (
    <div 
      className="relative flex flex-col bg-slate-50 min-h-screen" 
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex flex-col">
        <Header />
        
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <ScholarshipApplicationForm scholarship={scholarship} />
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const scholarship = await getScholarshipById(params.id);
  
  if (!scholarship) {
    return {
      title: 'Scholarship Application Not Found',
      description: 'The requested scholarship application could not be found.',
    };
  }

  return {
    title: `Apply for ${scholarship.displayTitle || scholarship.title} - ${scholarship.organization || scholarship.university?.university_name}`,
    description: `Submit your application for the ${scholarship.title} scholarship`,
    openGraph: {
      title: `Apply for ${scholarship.displayTitle || scholarship.title}`,
      description: `Submit your application for the ${scholarship.title} scholarship`,
      type: 'website',
      url: `/scholarships/${params.id}/apply`,
    },
    twitter: {
      card: 'summary',
      title: `Apply for ${scholarship.displayTitle || scholarship.title}`,
      description: `Submit your application for the ${scholarship.title} scholarship`,
    },
  };
}
