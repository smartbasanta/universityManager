'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { 
  websiteResearchNewsAPI, type ResearchArticle 
} from '@/hooks/api/website/research-news.api';
import { websiteUniversityAPI, type University } from '@/hooks/api/website/university.api';
import { websiteScholarshipsAPI, type Scholarship } from '@/hooks/api/website/scholarships.api';
import { websiteJobsAPI, type Job } from '@/hooks/api/website/jobs.api';
import { websiteOpportunitiesAPI, type Opportunity } from '@/hooks/api/website/opportunity.api';
import { websiteStudentAmbassadorAPI, type Ambassador } from '@/hooks/api/website/student-ambassador.api';
import { websiteMentorAPI, type Mentor } from '@/hooks/api/website/mentors.api';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Award, 
  Briefcase,
  GraduationCap 
} from 'lucide-react';

// TestimonialSlider Component (Moved up)
interface Testimonial {
  quote: string;
  author: string;
  rating: number;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => (
  <div className="max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-center text-foreground mb-8">What Students Say</h2>
    <div className="relative">
      {/* Simple testimonial cards; can extend your Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.slice(0, 4).map((testimonial, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-card rounded-xl border border-border shadow-sm"
          >
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
            <p className="text-sm font-semibold text-foreground">- {testimonial.author}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// Enhanced Section Component
interface SectionProps {
  children: React.ReactNode;
  description?: string;
  variant?: 'default' | 'light' | 'gradient';
  className?: string;
}

const Section = ({ children, description, variant = 'default', className = '' }: SectionProps) => {
  const backgrounds = {
    default: 'bg-background',
    light: 'bg-muted',
    gradient: 'bg-gradient-to-br from-primary/5 to-secondary/5'
  };

  return (
    <div className={`mb-16 sm:mb-20 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 ${backgrounds[variant]} ${className}`}>
      <div className="w-full">
        {children}
        {description && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Dashboard Component
const StatsDashboard = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
  >
    {[
      { num: '500+', label: 'Universities', icon: GraduationCap },
      { num: '2K+', label: 'Scholarships', icon: Award },
      { num: '1K+', label: 'Jobs', icon: Briefcase },
      { num: '50K+', label: 'Students', icon: Users }
    ].map((stat, idx) => {
      const Icon = stat.icon;
      return (
        <motion.div 
          key={idx}
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          className="text-center p-4 bg-card rounded-xl border border-border shadow-sm"
        >
          <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{stat.num}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      );
    })}
  </motion.div>
);

// Filter Chips Component (Example for Scholarships)
const FilterChips = ({ onFilter, activeFilter }: { onFilter: (filter: string) => void; activeFilter: string }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {['All', 'STEM', 'International', 'Undergrad'].map((filter) => (
      <button
        key={filter}
        onClick={() => onFilter(filter)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeFilter === filter
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-muted text-muted-foreground hover:bg-accent'
        }`}
      >
        {filter}
      </button>
    ))}
  </div>
);

const HomePage = () => {
  // States (existing + new for filters)
  const [researchArticles, setResearchArticles] = useState<ResearchArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [universitiesError, setUniversitiesError] = useState<string | null>(null);
  
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loadingScholarships, setLoadingScholarships] = useState(true);
  const [scholarshipsError, setScholarshipsError] = useState<string | null>(null);
  const [scholarshipFilter, setScholarshipFilter] = useState('All'); // New filter state

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

  // Testimonials Data (Hardcoded; pull from API later)
  const testimonials = [
    { quote: "Landed my dream research internship through the Opportunity Hub! 🌟", author: "Sarah, MIT Student", rating: 5 },
    { quote: "Found a full scholarship in under a week—life-changing!", author: "Raj, UC Berkeley", rating: 5 },
    { quote: "Connected with amazing mentors who guided my thesis.", author: "Elena, Oxford", rating: 5 },
    { quote: "Best platform for academic jobs—applied and got hired!", author: "Mike, Stanford", rating: 5 },
  ];

  // Fetch data (existing)
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

  // Filter handler (example for scholarships)
  const handleScholarshipFilter = (filter: string) => {
    setScholarshipFilter(filter);
    // TODO: Filter scholarships based on filter (e.g., API call or client-side)
  };

  const filteredScholarships = scholarships; // Placeholder; implement actual filtering

  // Render helper (existing + filter support)
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
      <div className="col-span-full text-center py-12 bg-muted rounded-2xl border-2 border-dashed border-border">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No {getDisplayType(type)} available</p>
          <p className="text-sm text-muted-foreground/70">Check back soon for updates</p>
        </div>
      </div>
    );
  };

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

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto">
        {/* Stats Dashboard */}
        <StatsDashboard />

      
        {/* Prioritized: Scholarships First */}
        <Section 
          variant="gradient"
          description="Access thousands of scholarship opportunities from institutions worldwide. Filter by your field of study, destination, and funding amount to find the perfect match."
        >
          <div className="mb-4">
            <FilterChips onFilter={handleScholarshipFilter} activeFilter={scholarshipFilter} />
          </div>
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
              filteredScholarships,
              'scholarship',
              3,
              (s: Scholarship) => <ScholarshipCardHomepage key={s.id} scholarship={s} />
            )}
          </Slider>
        </Section>

        {/* Jobs Next */}
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

        {/* Community Section: Ambassadors + Mentors (Grouped) */}
        <Section variant="light">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
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
            </div>
            <div>
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
            </div>
          </div>
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

          {/* Testimonials Carousel - New Addition */}
        <Section variant="light" className="border-t border-border">
          <TestimonialSlider testimonials={testimonials} />
        </Section>

      </main>

      <Footer />
    </div>
  );
};

export default HomePage;