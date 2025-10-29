import { notFound } from 'next/navigation';
import { JobsLayout } from '@/components/jobs/JobsLayout';
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

export default async function JobPage({ params }: PageProps) {
  const job = await getJobById(params.id);

  if (!job) {
    notFound();
  }

  return <JobsLayout selectedJob={job} selectedJobId={params.id} />;
}

export async function generateMetadata({ params }: PageProps) {
  const job = await getJobById(params.id);
  
  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'The requested job posting could not be found.',
    };
  }

  // Clean HTML from description for meta description
  const cleanDescription = job.description 
    ? job.description.replace(/<[^>]*>/g, '').substring(0, 160)
    : 'Job posting details';

  // Use the fixed university name (no more "Unknown Organization")
  const universityName = job.university?.university_name || job.organization || 'University';
  const jobTitle = job.displayTitle || job.title;

  return {
    title: `${jobTitle} - ${universityName} | ResearchShock Jobs`,
    description: cleanDescription,
    keywords: [
      jobTitle,
      universityName,
      job.employmentType,
      job.experienceLevel,
      job.modeOfWork,
      job.location,
      'academic jobs',
      'research positions',
      'university careers'
    ].filter(Boolean).join(', '),
    openGraph: {
      title: `${jobTitle} - ${universityName}`,
      description: cleanDescription,
      type: 'website',
      url: `/jobs/${params.id}`,
      siteName: 'ResearchShock',
      images: [
        {
          url: job.university?.logo || job.university?.banner || '/og-job-default.jpg',
          width: 1200,
          height: 630,
          alt: `${jobTitle} at ${universityName}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${jobTitle} - ${universityName}`,
      description: cleanDescription,
      images: [job.university?.logo || job.university?.banner || '/og-job-default.jpg'],
      creator: '@ResearchShock',
      site: '@ResearchShock',
    },
    robots: {
      index: job.status === 'Live',
      follow: true,
    },
    alternates: {
      canonical: `/jobs/${params.id}`,
    },
  };
}

// Optional: Generate static params for better performance
export async function generateStaticParams() {
  try {
    // For now, return empty array to enable dynamic generation
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
