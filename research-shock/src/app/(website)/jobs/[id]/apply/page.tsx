import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JobApplicationForm } from '@/components/jobs/JobApplicationForm';
import type { Job } from '@/hooks/api/website/jobs.api';
import { websiteJobsAPI } from '@/hooks/api/website/jobs.api';

interface PageProps {
  params: {
    id: string;
  };
}

// Server-side function to get job by ID
async function getJobById(id: string): Promise<Job | null> {
  try {
    const job = await websiteJobsAPI.fetchJobById(id);
    return job;
  } catch (error: any) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export default async function JobApplicationPage({ params }: PageProps) {
  const job = await getJobById(params.id);

  if (!job || !job.hasApplicationForm) {
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
          <JobApplicationForm job={job} />
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const job = await getJobById(params.id);
  
  if (!job) {
    return {
      title: 'Application Form Not Found',
      description: 'The requested job application form could not be found.',
    };
  }

  return {
    title: `Apply for ${job.title} - ${job.university?.university_name}`,
    description: `Submit your application for ${job.title} position`,
  };
}
