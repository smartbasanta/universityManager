import { notFound } from 'next/navigation';
import { ScholarshipsLayout } from '@/components/scholarships/ScholarshipsLayout';
import type { Scholarship } from '@/hooks/api/website/scholarships.api';
import { websiteScholarshipsAPI } from '@/hooks/api/website/scholarships.api';

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

export default async function ScholarshipPage({ params }: PageProps) {
  const scholarship = await getScholarshipById(params.id);

  if (!scholarship) {
    notFound();
  }

  return <ScholarshipsLayout selectedScholarship={scholarship} selectedScholarshipId={params.id} />;
}

export async function generateMetadata({ params }: PageProps) {
  const scholarship = await getScholarshipById(params.id);
  
  if (!scholarship) {
    return {
      title: 'Scholarship Not Found',
      description: 'The requested scholarship could not be found.',
    };
  }

  // Clean HTML from description for meta description
  const cleanDescription = scholarship.description 
    ? scholarship.description.replace(/<[^>]*>/g, '').substring(0, 160)
    : 'Scholarship details';

  // Use the fixed university name
  const universityName = scholarship.university?.university_name || scholarship.organization || 'University';
  const scholarshipTitle = scholarship.displayTitle || scholarship.title;

  return {
    title: `${scholarshipTitle} - ${universityName} | ResearchShock Scholarships`,
    description: cleanDescription,
    keywords: [
      scholarshipTitle,
      universityName,
      scholarship.scholarshipType,
      scholarship.educationalLevel,
      scholarship.fieldOfStudy,
      scholarship.amountDisplay,
      'scholarships',
      'research funding',
      'university scholarships',
      'academic funding'
    ].filter(Boolean).join(', '),
    openGraph: {
      title: `${scholarshipTitle} - ${universityName}`,
      description: cleanDescription,
      type: 'website',
      url: `/scholarships/${params.id}`,
      siteName: 'ResearchShock',
      images: [
        {
          url: scholarship.university?.logo || scholarship.university?.banner || '/og-scholarship-default.jpg',
          width: 1200,
          height: 630,
          alt: `${scholarshipTitle} at ${universityName}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${scholarshipTitle} - ${universityName}`,
      description: cleanDescription,
      images: [scholarship.university?.logo || scholarship.university?.banner || '/og-scholarship-default.jpg'],
      creator: '@ResearchShock',
      site: '@ResearchShock',
    },
    robots: {
      index: scholarship.status === 'Live',
      follow: true,
    },
    alternates: {
      canonical: `/scholarships/${params.id}`,
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
