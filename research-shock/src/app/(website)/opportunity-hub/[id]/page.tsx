import { notFound } from 'next/navigation';
import { OpportunitiesLayout } from '@/components/opportunity-hub/OpportunitiesLayout';
import type { Opportunity } from '@/hooks/api/website/opportunity.api';
import { websiteOpportunitiesAPI } from '@/hooks/api/website/opportunity.api';

interface PageProps {
  params: {
    id: string;
  };
}

// Server-side function to get opportunity by ID
async function getOpportunityById(id: string): Promise<Opportunity | null> {
  try {
    const opportunity = await websiteOpportunitiesAPI.fetchOpportunityById(id);
    return opportunity;
  } catch (error: any) {
    console.error('Error fetching opportunity:', error);
    return null;
  }
}

export default async function OpportunityPage({ params }: PageProps) {
  const opportunity = await getOpportunityById(params.id);

  if (!opportunity) {
    notFound();
  }

  return <OpportunitiesLayout selectedOpportunity={opportunity} selectedOpportunityId={params.id} />;
}

export async function generateMetadata({ params }: PageProps) {
  const opportunity = await getOpportunityById(params.id);
  
  if (!opportunity) {
    return {
      title: 'Opportunity Not Found',
      description: 'The requested opportunity could not be found.',
    };
  }

  // Clean HTML from description for meta description
  const cleanDescription = opportunity.description 
    ? opportunity.description.replace(/<[^>]*>/g, '').substring(0, 160)
    : 'Opportunity details';

  // Use the fixed university name
  const universityName = opportunity.university?.university_name || opportunity.organization || 'Institution';
  const opportunityTitle = opportunity.displayTitle || opportunity.title;

  return {
    title: `${opportunityTitle} - ${universityName} | ResearchShock Opportunities`,
    description: cleanDescription,
    keywords: [
      opportunityTitle,
      universityName,
      opportunity.type || opportunity.type,
      opportunity.educationalLevel,
      opportunity.location,
      opportunity.duration,
      'opportunities',
      'academic opportunities',
      'research programs',
      'competitions',
      'hackathons',
      'bootcamps'
    ].filter(Boolean).join(', '),
    openGraph: {
      title: `${opportunityTitle} - ${universityName}`,
      description: cleanDescription,
      type: 'website',
      url: `/opportunity-hub/${params.id}`,
      siteName: 'ResearchShock',
      images: [
        {
          url: opportunity.university?.logo || opportunity.university?.banner || '/og-opportunity-default.jpg',
          width: 1200,
          height: 630,
          alt: `${opportunityTitle} at ${universityName}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opportunityTitle} - ${universityName}`,
      description: cleanDescription,
      images: [opportunity.university?.logo || opportunity.university?.banner || '/og-opportunity-default.jpg'],
      creator: '@ResearchShock',
      site: '@ResearchShock',
    },
    robots: {
      index: opportunity.status === 'Live',
      follow: true,
    },
    alternates: {
      canonical: `/opportunity-hub/${params.id}`,
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
