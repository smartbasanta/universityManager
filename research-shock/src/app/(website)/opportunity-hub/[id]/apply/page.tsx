import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OpportunityApplicationForm } from '@/components/opportunity-hub/OpportunityApplicationForm';
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

export default async function OpportunityApplicationPage({ params }: PageProps) {
  const opportunity = await getOpportunityById(params.id);

  if (!opportunity || !opportunity.hasApplicationForm) {
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
          <OpportunityApplicationForm opportunity={opportunity} />
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const opportunity = await getOpportunityById(params.id);
  
  if (!opportunity) {
    return {
      title: 'Application Form Not Found',
      description: 'The requested opportunity application form could not be found.',
    };
  }

  return {
    title: `Apply for ${opportunity.title} - ${opportunity.university?.university_name}`,
    description: `Submit your application for ${opportunity.title} opportunity`,
  };
}
