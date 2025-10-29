'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Award, Briefcase, Target, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import { websiteResearchNewsAPI, type ResearchArticle } from '@/hooks/api/website/research-news.api';
import { websiteUniversityAPI, type University } from '@/hooks/api/website/university.api';
import { websiteScholarshipsAPI, type Scholarship } from '@/hooks/api/website/scholarships.api';
import { websiteJobsAPI, type Job } from '@/hooks/api/website/jobs.api';
import { websiteOpportunitiesAPI, type Opportunity } from '@/hooks/api/website/opportunity.api';
import { websiteStudentAmbassadorAPI, type Ambassador } from '@/hooks/api/website/student-ambassador.api';
import { websiteMentorAPI, type Mentor } from '@/hooks/api/website/mentors.api';


// Slider Component
const Slider = ({ children, title, itemsPerView = 3 }: { 
  children: React.ReactNode; 
  title: string; 
  itemsPerView?: number;
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [currentItemsPerView, setCurrentItemsPerView] = React.useState(itemsPerView);

 
  React.useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setCurrentItemsPerView(1); 
      } else if (width <= 768) {
        setCurrentItemsPerView(2); 
      } else if (width <= 1024) {
        setCurrentItemsPerView(Math.min(itemsPerView, 3)); 
      } else {
        setCurrentItemsPerView(itemsPerView); 
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [itemsPerView]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8;
      const currentScroll = scrollRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const itemWidth = `calc(${100 / currentItemsPerView}% - ${20 * (currentItemsPerView - 1) / currentItemsPerView}px)`;


  return (
    <div className="relative">
      <div className="mb-4 md:mb-6">
        <h2 className="text-[#0e141b] text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em]">
          {title}
        </h2>
      </div>
      
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all border border-gray-200"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-5 pb-4 scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div 
              key={index}
              className="flex-shrink-0"
              style={{ width: itemWidth }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const sanitizeHtmlToText = (html?: string | null): string => {
  if (!html) return '';
  const withoutTags = html.replace(/<[^>]*>/g, '');
  return withoutTags.replace(/\s+/g, ' ').trim();
};

// Custom Research Card matching the screenshot design
const ResearchCardHomepage = ({ article }: { article: ResearchArticle }) => {
  const imageUrl = article.featuredImage?.url;
  const displayDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  // const readTime = `${Math.ceil((article.article?.length || 2000) / 1500)} min read`;

  return (
    <Link href={`/research-news/${article.id}`}>
      <div className="cursor-pointer hover:opacity-90 transition-opacity bg-white">
        <div className="flex flex-col gap-3">
          <div className="w-full aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url("${imageUrl}")` }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19l3.5-4.5 2.5 3.01L14.5 12l4.5 6H5z"/>
                </svg>
                <span className="text-sm">No image</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded uppercase tracking-wide">
                {article.category || 'RESEARCH'}
              </span>
              {article.status === 'featured' && (
                <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded uppercase tracking-wide">
                  Live
                </span>
              )}
            </div>
            <h3 className="text-[#111418] text-base font-medium leading-normal line-clamp-2">
              {article.title}
            </h3>
            <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">
              {article.abstract}
            </p>
            {/* <span className="text-[#637588] text-xs">{readTime}</span> */}
            <span className="text-[#637588] text-xs">{displayDate}</span>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {article.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-[#637588] text-xs">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
// Custom University Card Component
const UniversityCardHomepage = ({ university }: { university: University }) => {
  const ranking = university.ranking?.[0]?.rank || 'N/A';
  
  return (
    <Link href={`/universities/${university.id}`}>
      <div className="cursor-pointer hover:opacity-90 transition-opacity bg-white">
        <div className="flex flex-col gap-4 rounded-lg">
          <div className="w-full aspect-square relative bg-gray-100 rounded-xl overflow-hidden">
            {university.logo ? (
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url("${university.logo}")` }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
                <span className="text-sm">No Logo</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[#0e141b] text-base font-medium leading-normal line-clamp-2">
              {university.university_name}
            </p>
            <p className="text-[#4e7097] text-sm font-normal leading-normal">
              {university.overview?.country || 'Unknown Location'}
            </p>
            <div className="flex items-center justify-between mt-1 text-xs text-[#4e7097]">
              <span className="capitalize">
                {university.overview?.university_type?.toLowerCase() || 'University'}
              </span>
              {ranking !== 'N/A' && <span>Rank #{ranking}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};


export const ScholarshipCardHomepage = ({ scholarship }: { scholarship: Scholarship }) => {
  const deadlineDate = new Date(scholarship.deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const deadlineDisplay = diffDays > 0 ? `${diffDays} days left` : 'Expired';
  const isUrgent = diffDays > 0 && diffDays <= 7;
  const amountDisplay = `$${scholarship.amount.toLocaleString()}`;
  const typeDisplay = scholarship.university?.university_name || 'General';

  return (
    <Link href={`/scholarships/${scholarship.id}`}>
      <div className="cursor-pointer hover:opacity-90 transition-opacity">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 h-full flex flex-col">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#0e141b] text-base font-medium leading-normal line-clamp-2">
                {sanitizeHtmlToText(scholarship.name)}
              </h3>
              <p className="text-[#4e7097] text-sm font-normal leading-normal line-clamp-2">
                {sanitizeHtmlToText(scholarship.description)}
              </p>
            </div>
          </div>
          <div className="space-y-2 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-lg font-bold text-blue-600">{amountDisplay}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Deadline:</span>
              <span className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
                {deadlineDisplay}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Type:</span>
              <span className="text-sm font-medium text-blue-600">{typeDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};


export const JobCardHomepage = ({ job }: { job: Job }) => {
    const organization = job.university?.university_name || job.institution?.name || 'Unknown';

    return (
        <Link href={`/jobs/${job.id}`}>
            <div className="cursor-pointer hover:opacity-90 transition-opacity">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#0e141b] text-base font-medium leading-normal line-clamp-2">
                                {sanitizeHtmlToText(job.title)}
                            </h3>
                            <p className="text-[#4e7097] text-sm font-normal leading-normal line-clamp-2">
                                {sanitizeHtmlToText(job.description)}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 mt-auto">
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>{job.employmentType}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{organization}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {job.employmentType}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};


export const OpportunityCardHomepage = ({ opportunity }: { opportunity: Opportunity }) => {
    const now = new Date();
    const start = new Date(opportunity.startDateTime);
    const end = new Date(opportunity.endDateTime);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const duration = `${diffDays} days`;
    const isOngoing = now >= start && now <= end;
    const isUpcoming = now < start;
    const startDate = start.toLocaleDateString();
    const organization = opportunity.university?.university_name || 'General';

    return (
        <Link href={`/opportunity-hub/${opportunity.id}`}>
            <div className="cursor-pointer hover:opacity-90 transition-opacity">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#0e141b] text-base font-medium leading-normal line-clamp-2">
                                {sanitizeHtmlToText(opportunity.title)}
                            </h3>
                            <p className="text-[#4e7097] text-sm font-normal leading-normal line-clamp-2">
                                {sanitizeHtmlToText(opportunity.description)}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 mt-auto">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Type:</span>
                            <span className="text-sm font-medium text-purple-600">{opportunity.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Duration:</span>
                            <span className="text-sm font-medium text-gray-900">{duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Provider:</span>
                            <span className="text-sm font-medium text-gray-900 line-clamp-1">{organization}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className={`text-sm font-medium ${isOngoing ? 'text-green-600' : isUpcoming ? 'text-blue-600' : 'text-red-600'}`}>
                                {isOngoing ? 'Ongoing' : isUpcoming ? 'Upcoming' : 'Past'}
                            </span>
                        </div>
                        {startDate && (
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{startDate}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const AmbassadorCardHomepage = ({ ambassador }: { ambassador: Ambassador }) => (
  <Link href={`/ambassadors/${ambassador.id}`}>
    <div className="cursor-pointer hover:opacity-90 transition-opacity">
      <div className="flex flex-col gap-4 text-center rounded-lg pt-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full mx-auto w-32 h-32"
          style={{ backgroundImage: `url("${ambassador.photo || '/ambassador-default.png'}")` }}
        />
        <div>
          <p className="text-[#0e141b] text-base font-medium leading-normal">{ambassador.name}</p>
          <p className="text-[#4e7097] text-sm font-normal leading-normal">{ambassador.university?.university_name || 'N/A'}</p>
          <div className="mt-1 text-xs text-[#4e7097]">
            <p>{ambassador.department?.name || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export const MentorCardHomepage = ({ mentor }: { mentor: Mentor }) => (
  <Link href={`/mentors/${mentor.id}`}>
    <div className="cursor-pointer hover:opacity-90 transition-opacity">
      <div className="flex flex-col gap-4 text-center rounded-lg pt-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full mx-auto w-32 h-32"
          style={{ backgroundImage: `url("${mentor.photo || '/mentor-default.png'}")` }}
        />
        <div>
          <p className="text-[#0e141b] text-base font-medium leading-normal">{mentor.name}</p>
          <div className="mt-1 text-xs text-[#4e7097]">
            <p>{mentor.university?.university_name || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  </Link>
);


const HomePage = () => {
  // All state definitions remain the same
  const [researchArticles, setResearchArticles] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  
  const [universities, setUniversities] = useState<any[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [universitiesError, setUniversitiesError] = useState<string | null>(null);
  
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loadingScholarships, setLoadingScholarships] = useState(true);
  const [scholarshipsError, setScholarshipsError] = useState<string | null>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [opportunitiesError, setOpportunitiesError] = useState<string | null>(null);
  
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [loadingAmbassadors, setLoadingAmbassadors] = useState(true);
  const [ambassadorsError, setAmbassadorsError] = useState<string | null>(null);

  const [mentors, setMentors] = useState<any[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [mentorsError, setMentorsError] = useState<string | null>(null);

  // --- FULLY UPDATED useEffect HOOKS ---
  
  useEffect(() => {
    const fetchAllData = async () => {
      // Fetch Research News
      try {
        setLoadingNews(true);
        const response = await websiteResearchNewsAPI.fetchResearchNews({ limit: 6 });
        setResearchArticles(response.data);
      } catch (error) { setNewsError('Failed to load news'); } 
      finally { setLoadingNews(false); }

      // Fetch Universities
      try {
        setLoadingUniversities(true);
        const response = await websiteUniversityAPI.fetchFeaturedUniversities({ limit: 6 });
        setUniversities(response.data);
      } catch (error) { setUniversitiesError('Failed to load universities'); } 
      finally { setLoadingUniversities(false); }
      
      // Fetch Scholarships
      try {
        setLoadingScholarships(true);
        const response = await websiteScholarshipsAPI.fetchScholarships({ limit: 6 });
        setScholarships(response.data);
      } catch (error) { setScholarshipsError('Failed to load scholarships'); }
      finally { setLoadingScholarships(false); }
      
      // Fetch Jobs
      try {
        setLoadingJobs(true);
        const response = await websiteJobsAPI.fetchJobs({ limit: 6 });
        setJobs(response.data);
      } catch (error) { setJobsError('Failed to load jobs'); }
      finally { setLoadingJobs(false); }
      
      // Fetch Opportunities
      try {
        setLoadingOpportunities(true);
        const response = await websiteOpportunitiesAPI.fetchOpportunities({ limit: 6 });
        setOpportunities(response.data);
      } catch (error) { setOpportunitiesError('Failed to load opportunities'); }
      finally { setLoadingOpportunities(false); }

      // Fetch Ambassadors
      try {
        setLoadingAmbassadors(true);
        const response = await websiteStudentAmbassadorAPI.fetchAmbassadors({ limit: 8 });
        setAmbassadors(response.data);
      } catch (error) { setAmbassadorsError('Failed to load ambassadors'); }
      finally { setLoadingAmbassadors(false); }
      
      // Fetch Mentors
      try {
        setLoadingMentors(true);
        const response = await websiteMentorAPI.fetchMentors({ limit: 8 });
        setMentors(response.data);
      } catch (error) { setMentorsError('Failed to load mentors'); }
      finally { setLoadingMentors(false); }
    };

    fetchAllData();
  }, []);
 
  
   const NewsLoadingCard = () => (
    <div className="cursor-pointer">
      <div className="flex flex-col gap-4 rounded-lg">
        <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-xl" />
        <div>
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-3 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="flex items-center justify-between mt-2">
            <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
   const UniversityLoadingCard = () => (
    <div className="bg-white">
      <div className="flex flex-col gap-4 rounded-lg">
        <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-xl" />
        <div className="flex flex-col gap-1">
          <div className="h-4 bg-gray-200 animate-pulse rounded" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
          <div className="flex items-center justify-between mt-1">
            <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
            <div className="h-3 bg-gray-200 animate-pulse rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );

  // Error component for research news
  const NewsErrorCard = () => (
    <div className="cursor-pointer">
      <div className="flex flex-col gap-4 rounded-lg p-4 bg-red-50 border border-red-200">
        <div className="w-full aspect-video bg-red-100 rounded-xl flex items-center justify-center">
          <span className="text-red-500 text-sm">Failed to load</span>
        </div>
        <div>
          <p className="text-red-700 text-base font-medium">Unable to load news</p>
          <p className="text-red-600 text-sm">Please try again later</p>
        </div>
      </div>
    </div>
  );
  const ScholarshipLoadingCard = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 h-full">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-blue-200 rounded-full animate-pulse mr-4" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-blue-200 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-blue-200 animate-pulse rounded w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-blue-200 animate-pulse rounded" />
      <div className="h-3 bg-blue-200 animate-pulse rounded" />
      <div className="h-3 bg-blue-200 animate-pulse rounded" />
    </div>
  </div>
);

const ScholarshipErrorCard = () => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 h-full flex items-center justify-center">
    <span className="text-red-600 text-sm">Failed to load scholarships</span>
  </div>
);
const JobLoadingCard = () => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 h-full">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-green-200 rounded-full animate-pulse mr-4" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-green-200 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-green-200 animate-pulse rounded w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-green-200 animate-pulse rounded" />
      <div className="h-3 bg-green-200 animate-pulse rounded" />
      <div className="h-3 bg-green-200 animate-pulse rounded" />
    </div>
  </div>
);

const JobErrorCard = () => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 h-full flex items-center justify-center">
    <span className="text-red-600 text-sm">Failed to load jobs</span>
  </div>
);
const OpportunityLoadingCard = () => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 h-full">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-purple-200 rounded-full animate-pulse mr-4" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-purple-200 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-purple-200 animate-pulse rounded w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-purple-200 animate-pulse rounded" />
      <div className="h-3 bg-purple-200 animate-pulse rounded" />
      <div className="h-3 bg-purple-200 animate-pulse rounded" />
      <div className="h-3 bg-purple-200 animate-pulse rounded" />
    </div>
  </div>
);

const OpportunityErrorCard = () => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 h-full flex items-center justify-center">
    <span className="text-red-600 text-sm">Failed to load opportunities</span>
  </div>
);
const AmbassadorLoadingCard = () => (
  <div className="flex flex-col gap-4 text-center rounded-lg pt-4">
    <div className="bg-gray-200 animate-pulse aspect-square rounded-full mx-auto w-32 h-32" />
    <div>
      <div className="h-4 bg-gray-200 animate-pulse rounded mx-auto w-24 mb-2" />
      <div className="h-3 bg-gray-200 animate-pulse rounded mx-auto w-32 mb-1" />
      <div className="h-3 bg-gray-200 animate-pulse rounded mx-auto w-20" />
    </div>
  </div>
);

const AmbassadorErrorCard = () => (
  <div className="flex flex-col gap-4 text-center rounded-lg pt-4">
    <div className="bg-red-100 aspect-square rounded-full mx-auto w-32 h-32 flex items-center justify-center">
      <span className="text-red-500 text-xs">Failed to load</span>
    </div>
    <div>
      <p className="text-red-700 text-base font-medium">Unable to load</p>
      <p className="text-red-600 text-sm">Please try again later</p>
    </div>
  </div>
);
const MentorLoadingCard = () => (
  <div className="flex flex-col gap-4 text-center rounded-lg pt-4">
    <div className="bg-gray-200 animate-pulse aspect-square rounded-full mx-auto w-32 h-32" />
    <div>
      <div className="h-4 bg-gray-200 animate-pulse rounded mx-auto w-24 mb-2" />
      <div className="h-3 bg-gray-200 animate-pulse rounded mx-auto w-32" />
    </div>
  </div>
);

const MentorErrorCard = () => (
  <div className="flex flex-col gap-4 text-center rounded-lg pt-4">
    <div className="bg-red-100 aspect-square rounded-full mx-auto w-32 h-32 flex items-center justify-center">
      <span className="text-red-500 text-xs">Failed to load</span>
    </div>
    <div>
      <p className="text-red-700 text-base font-medium">Unable to load</p>
      <p className="text-red-600 text-sm">Please try again later</p>
    </div>
  </div>
);





  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-40 py-5">
          <div className="layout-content-container flex flex-col max-w-[1260px] flex-1">
        
           {/* Featured Research News */}
              <div className="mb-12">
              <Slider title="Featured News" itemsPerView={3}>
                {loadingNews ? (
                  Array(3).fill(0).map((_, index) => (
                    <NewsLoadingCard key={index} />
                  ))
                ) : researchArticles.length > 0 ? (
                  researchArticles.map((article) => (
                    <ResearchCardHomepage key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No research articles available at the moment.</p>
                  </div>
                )}
              </Slider>
              
              <div className="flex justify-center mt-6">
                <Link href="/research-news">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1978e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1565c0] transition-colors">
                    <span className="truncate">View All News</span>
                  </button>
                </Link>
              </div>
            </div>


           {/* Featured Universities */}
          <div className="mb-12">
              <Slider title="Featured Universities" itemsPerView={3}>
                {loadingUniversities ? (
                  Array(3).fill(0).map((_, index) => (
                    <UniversityLoadingCard key={index} />
                  ))
                ) : universities.length > 0 ? (
                  universities.map((university) => (
                    <UniversityCardHomepage key={university.id} university={university} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No universities available at the moment.</p>
                  </div>
                )}
              </Slider>

              <div className="flex justify-center mt-6">
                <Link href="/universities">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1978e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1565c0] transition-colors">
                    <span className="truncate">View All Universities</span>
                  </button>
                </Link>
              </div>
            </div>


          {/* Scholarships */}
     <div className="mb-12">
  <Slider title="Scholarships" itemsPerView={3}>
    {loadingScholarships ? (
      Array(3).fill(0).map((_, i) => <ScholarshipLoadingCard key={i} />)
    ) : scholarshipsError ? (
      Array(3).fill(0).map((_, i) => <ScholarshipErrorCard key={i} />)
    ) : scholarships.length ? (
      scholarships.map(s => <ScholarshipCardHomepage key={s.id} scholarship={s} />)
    ) : (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500">No scholarships available at the moment.</p>
      </div>
    )}
  </Slider>

  <div className="flex justify-center mt-6">
    <Link href="/scholarships">
      <button className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-full h-10 px-4 bg-[#1978e5] text-slate-50 text-sm font-bold hover:bg-[#1565c0] transition-colors">
        View All Scholarships
      </button>
    </Link>
  </div>
</div>
    
         {/* Jobs */}
<div className="mb-12">
  <Slider title="Jobs" itemsPerView={3}>
    {loadingJobs ? (
      Array(3).fill(0).map((_, index) => (
        <JobLoadingCard key={index} />
      ))
    ) : jobsError ? (
      Array(3).fill(0).map((_, index) => (
        <JobErrorCard key={index} />
      ))
    ) : jobs.length > 0 ? (
      jobs.map((job) => (
        <JobCardHomepage key={job.id} job={job} />
      ))
    ) : (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500">No jobs available at the moment.</p>
      </div>
    )}
  </Slider>

  <div className="flex justify-center mt-6">
    <Link href="/jobs">
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1978e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1565c0] transition-colors">
        <span className="truncate">View All Jobs</span>
      </button>
    </Link>
  </div>
</div>


           {/* Ambassadors */}
           
<div className="mb-12">
  <Slider title="Ambassadors" itemsPerView={4}>
    {loadingAmbassadors ? (
      Array(4).fill(0).map((_, index) => (
        <AmbassadorLoadingCard key={index} />
      ))
    ) : ambassadorsError ? (
      Array(4).fill(0).map((_, index) => (
        <AmbassadorErrorCard key={index} />
      ))
    ) : ambassadors.length > 0 ? (
      ambassadors.map((ambassador) => (
        <AmbassadorCardHomepage key={ambassador.id} ambassador={ambassador} />
      ))
    ) : (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500">No ambassadors available at the moment.</p>
      </div>
    )}
  </Slider>

  <div className="flex justify-center mt-6">
    <Link href="/ambassadors">
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1978e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1565c0] transition-colors">
        <span className="truncate">View All Ambassadors</span>
      </button>
    </Link>
  </div>
</div>

{/* Mentors */}
<div className="mb-12">
  <Slider title="Mentors" itemsPerView={4}>
    {loadingMentors ? (
      Array(4).fill(0).map((_, index) => (
        <MentorLoadingCard key={index} />
      ))
    ) : mentorsError ? (
      Array(4).fill(0).map((_, index) => (
        <MentorErrorCard key={index} />
      ))
    ) : mentors.length > 0 ? (
      mentors.map((mentor) => (
        <MentorCardHomepage key={mentor.id} mentor={mentor} />
      ))
    ) : (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500">No mentors available at the moment.</p>
      </div>
    )}
  </Slider>

  <div className="flex justify-center mt-6">
    <Link href="/mentors">
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1978e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1565c0] transition-colors">
        <span className="truncate">View All Mentors</span>
      </button>
    </Link>
  </div>
</div>


           {/* Opportunity Hub */}
           
<div className="mb-12">
  <Slider title="Opportunity Hub" itemsPerView={3}>
    {loadingOpportunities ? (
      Array(3).fill(0).map((_, index) => (
        <OpportunityLoadingCard key={index} />
      ))
    ) : opportunitiesError ? (
      Array(3).fill(0).map((_, index) => (
        <OpportunityErrorCard key={index} />
      ))
    ) : opportunities.length > 0 ? (
      opportunities.map((opportunity) => (
        <OpportunityCardHomepage 
          key={opportunity.id} 
          opportunity={opportunity}
          
        />
      ))
    ) : (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500">No opportunities available at the moment.</p>
      </div>
    )}
  </Slider>

  <p className="text-[#0e141b] text-base font-normal leading-normal pb-3 pt-6 text-center">
    Explore a wide range of research opportunities, including internships, grants, and collaborations. Connect with leading researchers and institutions to advance your career.
  </p>
  
  <div className="flex justify-center mt-6">
    <Link href="/opportunity-hub">
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1978e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1565c0] transition-colors">
        <span className="truncate">Explore Opportunities</span>
      </button>
    </Link>
  </div>
</div>


          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
 