'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/ui/visitor-screen/hero-section';
import { Slider } from '@/components/ui/visitor-screen/Slider';
import { 
  ResearchCardHomepage,
  UniversityCardHomepage,
  ScholarshipCardHomepage,
  JobCardHomepage,
  OpportunityCardHomepage,
  AmbassadorCardHomepage,
  MentorCardHomepage
} from '@/components/ui/visitor-screen/Cards';
import { 
  LoadingCards,
  ErrorCards 
} from '@/components/ui/visitor-screen/loading-states';

import { websiteResearchNewsAPI, type ResearchArticle } from '@/hooks/api/website/research-news.api';
import { websiteUniversityAPI, type University } from '@/hooks/api/website/university.api';
import { websiteScholarshipsAPI, type Scholarship } from '@/hooks/api/website/scholarships.api';
import { websiteJobsAPI, type Job } from '@/hooks/api/website/jobs.api';
import { websiteOpportunitiesAPI, type Opportunity } from '@/hooks/api/website/opportunity.api';
import { websiteStudentAmbassadorAPI, type Ambassador } from '@/hooks/api/website/student-ambassador.api';
import { websiteMentorAPI, type Mentor } from '@/hooks/api/website/mentors.api';

// Enhanced Section Component with background variants
interface SectionProps {
  children: React.ReactNode;
  description?: string;
  variant?: 'default' | 'light' | 'gradient';
  className?: string;
}

const Section = ({ children, description, variant = 'default', className = '' }: SectionProps) => {
  const backgrounds = {
    default: 'bg-white',
    light: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50'
  };

  return (
    <div className={`mb-16 sm:mb-20 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 ${backgrounds[variant]} ${className}`}>
      <div className="w-full">
        {children}
        
        {description && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  // All state definitions
  const [researchArticles, setResearchArticles] = useState<ResearchArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [universitiesError, setUniversitiesError] = useState<string | null>(null);
  
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loadingScholarships, setLoadingScholarships] = useState(true);
  const [scholarshipsError, setScholarshipsError] = useState<string | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [opportunitiesError, setOpportunitiesError] = useState<string | null>(null);
  
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loadingAmbassadors, setLoadingAmbassadors] = useState(true);
  const [ambassadorsError, setAmbassadorsError] = useState<string | null>(null);

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [mentorsError, setMentorsError] = useState<string | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      // Fetch Research News
      try {
        setLoadingNews(true);
        const response = await websiteResearchNewsAPI.fetchResearchNews({ limit: 6 });
        setResearchArticles(response.data);
      } catch (error) { 
        setNewsError('Failed to load news'); 
      } finally { 
        setLoadingNews(false); 
      }

      // Fetch Universities
      try {
        setLoadingUniversities(true);
        const response = await websiteUniversityAPI.fetchFeaturedUniversities({ limit: 6 });
        setUniversities(response.data);
      } catch (error) { 
        setUniversitiesError('Failed to load universities'); 
      } finally { 
        setLoadingUniversities(false); 
      }
      
      // Fetch Scholarships
      try {
        setLoadingScholarships(true);
        const response = await websiteScholarshipsAPI.fetchScholarships({ limit: 6 });
        setScholarships(response.data);
      } catch (error) { 
        setScholarshipsError('Failed to load scholarships'); 
      } finally { 
        setLoadingScholarships(false); 
      }
      
      // Fetch Jobs
      try {
        setLoadingJobs(true);
        const response = await websiteJobsAPI.fetchJobs({ limit: 6 });
        setJobs(response.data);
      } catch (error) { 
        setJobsError('Failed to load jobs'); 
      } finally { 
        setLoadingJobs(false); 
      }
      
      // Fetch Opportunities
      try {
        setLoadingOpportunities(true);
        const response = await websiteOpportunitiesAPI.fetchOpportunities({ limit: 6 });
        setOpportunities(response.data);
      } catch (error) { 
        setOpportunitiesError('Failed to load opportunities'); 
      } finally { 
        setLoadingOpportunities(false); 
      }

      // Fetch Ambassadors
      try {
        setLoadingAmbassadors(true);
        const response = await websiteStudentAmbassadorAPI.fetchAmbassadors({ limit: 8 });
        setAmbassadors(response.data);
      } catch (error) { 
        setAmbassadorsError('Failed to load ambassadors'); 
      } finally { 
        setLoadingAmbassadors(false); 
      }
      
      // Fetch Mentors
      try {
        setLoadingMentors(true);
        const response = await websiteMentorAPI.fetchMentors({ limit: 8 });
        setMentors(response.data);
      } catch (error) { 
        setMentorsError('Failed to load mentors'); 
      } finally { 
        setLoadingMentors(false); 
      }
    };

    fetchAllData();
  }, []);

  // Helper to map short type to display-friendly string
  const getDisplayType = (type: string) => {
    const displayMap: Record<string, string> = {
      news: 'research news',
      university: 'universities',
      scholarship: 'scholarships',
      job: 'job opportunities',
      opportunity: 'research opportunities',
      ambassador: 'student ambassadors',
      mentor: 'expert mentors',
    };
    return displayMap[type] || type;
  };

  // Render content helper
  const renderSectionContent = (
    loading: boolean, 
    error: string | null, 
    items: any[], 
    type: string, 
    count: number, 
    mapper: (item: any) => JSX.Element
  ) => {
    if (loading) {
      return <LoadingCards count={count} type={type as any} />;
    }
    if (error) {
      return <ErrorCards count={count} type={type as any} />;
    }
    if (items.length > 0) {
      return items.map(mapper);
    }
    return (
      <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No {getDisplayType(type)} available</p>
          <p className="text-sm text-gray-400">Check back soon for updates</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto">
        {/* Featured Research News */}
        <Section variant="default">
          <Slider 
            title="Featured Research News" 
            itemsPerView={3} 
            viewAllLink="/research-news" 
            viewAllText="Explore All News"
            autoplay={true}
            autoplayDelay={6000}
          >
            {renderSectionContent(
              loadingNews,
              newsError,
              researchArticles,
              'news',
              3,
              (article: ResearchArticle) => <ResearchCardHomepage key={article.id} article={article} />
            )}
          </Slider>
        </Section>

        {/* Featured Universities */}
        <Section variant="light">
          <Slider 
            title="Top Universities Worldwide" 
            itemsPerView={3} 
            viewAllLink="/universities" 
            viewAllText="Discover Universities"
          >
            {renderSectionContent(
              loadingUniversities,
              universitiesError,
              universities,
              'university',
              3,
              (university: University) => <UniversityCardHomepage key={university.id} university={university} />
            )}
          </Slider>
        </Section>

        {/* Scholarships */}
        <Section 
          variant="gradient"
          description="Access thousands of scholarship opportunities from institutions worldwide. Filter by your field of study, destination, and funding amount to find the perfect match."
        >
          <Slider 
            title="Available Scholarships" 
            itemsPerView={3} 
            viewAllLink="/scholarships" 
            viewAllText="Browse Scholarships"
            autoplay={true}
            autoplayDelay={7000}
          >
            {renderSectionContent(
              loadingScholarships,
              scholarshipsError,
              scholarships,
              'scholarship',
              3,
              (s: Scholarship) => <ScholarshipCardHomepage key={s.id} scholarship={s} />
            )}
          </Slider>
        </Section>

        {/* Jobs */}
        <Section variant="default">
          <Slider 
            title="Academic & Research Positions" 
            itemsPerView={3} 
            viewAllLink="/jobs" 
            viewAllText="View All Positions"
          >
            {renderSectionContent(
              loadingJobs,
              jobsError,
              jobs,
              'job',
              3,
              (job: Job) => <JobCardHomepage key={job.id} job={job} />
            )}
          </Slider>
        </Section>

        {/* Ambassadors */}
        <Section variant="light">
          <Slider 
            title="Student Ambassadors" 
            itemsPerView={4} 
            viewAllLink="/ambassadors" 
            viewAllText="Meet Ambassadors"
            autoplay={true}
            autoplayDelay={8000}
          >
            {renderSectionContent(
              loadingAmbassadors,
              ambassadorsError,
              ambassadors,
              'ambassador',
              4,
              (ambassador: Ambassador) => <AmbassadorCardHomepage key={ambassador.id} ambassador={ambassador} />
            )}
          </Slider>
        </Section>

        {/* Mentors */}
        <Section variant="default">
          <Slider 
            title="Connect with Expert Mentors" 
            itemsPerView={4} 
            viewAllLink="/mentors" 
            viewAllText="Find Your Mentor"
          >
            {renderSectionContent(
              loadingMentors,
              mentorsError,
              mentors,
              'mentor',
              4,
              (mentor: Mentor) => <MentorCardHomepage key={mentor.id} mentor={mentor} />
            )}
          </Slider>
        </Section>

        {/* Opportunity Hub */}
        <Section 
          variant="gradient"
          description="Explore a wide range of research opportunities, including internships, grants, and collaborations. Connect with leading researchers and institutions to advance your career."
        >
          <Slider 
            title="Research Opportunities" 
            itemsPerView={3} 
            viewAllLink="/opportunity-hub" 
            viewAllText="Discover Opportunities"
            autoplay={true}
            autoplayDelay={7000}
          >
            {renderSectionContent(
              loadingOpportunities,
              opportunitiesError,
              opportunities,
              'opportunity',
              3,
              (opportunity: Opportunity) => <OpportunityCardHomepage key={opportunity.id} opportunity={opportunity} />
            )}
          </Slider>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;