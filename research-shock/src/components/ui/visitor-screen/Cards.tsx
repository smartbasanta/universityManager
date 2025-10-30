import Link from 'next/link';
import { Award, Briefcase, Target, Calendar, MapPin, DollarSign, Users, GraduationCap } from 'lucide-react';
import type { ResearchArticle } from '@/hooks/api/website/research-news.api';
import type { University } from '@/hooks/api/website/university.api';
import type { Scholarship } from '@/hooks/api/website/scholarships.api';
import type { Job } from '@/hooks/api/website/jobs.api';
import type { Opportunity } from '@/hooks/api/website/opportunity.api';
import type { Ambassador } from '@/hooks/api/website/student-ambassador.api';
import type { Mentor } from '@/hooks/api/website/mentors.api';

// Utility function to sanitize HTML
const sanitizeHtmlToText = (html?: string | null): string => {
  if (!html) return '';
  const withoutTags = html.replace(/<[^>]*>/g, '');
  return withoutTags.replace(/\s+/g, ' ').trim();
};

// Research Card
export const ResearchCardHomepage = ({ article }: { article: ResearchArticle }) => {
  const imageUrl = article.featuredImage?.url;
  const displayDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/research-news/${article.id}`} className="block">
      <article className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:opacity-95">
        <div className="relative">
          <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                <GraduationCap className="w-16 h-16 mb-2 opacity-50" />
                <span className="text-sm font-medium">No Image Available</span>
              </div>
            )}
            {article.status === 'featured' && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                Featured
              </div>
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
              {article.category || 'Research'}
            </span>
          </div>
          <h3 className="text-gray-900 text-lg font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {article.abstract}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {displayDate}
            </span>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {article.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-blue-600 font-medium">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

// University Card
export const UniversityCardHomepage = ({ university }: { university: University }) => {
  const ranking = university.ranking?.[0]?.rank || 'N/A';
  
  return (
    <Link href={`/universities/${university.id}`} className="block">
      <article className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:opacity-95">
        <div className="relative">
          <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {university.logo ? (
              <img
                src={university.logo}
                alt={university.university_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                <Users className="w-16 h-16 mb-2 opacity-50" />
                <span className="text-sm font-medium">No Logo</span>
              </div>
            )}
            {ranking !== 'N/A' && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                #{ranking}
              </div>
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <h3 className="text-gray-900 text-lg font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {university.university_name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {university.overview?.country || 'Global Institution'}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="capitalize font-medium">
              {university.overview?.university_type?.toLowerCase() || 'University'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-medium text-indigo-600">Explore Programs</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

// Scholarship Card
export const ScholarshipCardHomepage = ({ scholarship }: { scholarship: Scholarship }) => {
  const deadlineDate = new Date(scholarship.deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const deadlineDisplay = diffDays > 0 ? `${diffDays} days left` : 'Expired';
  const isUrgent = diffDays > 0 && diffDays <= 7;
  const amountDisplay = `$${scholarship.amount.toLocaleString()}`;
  const typeDisplay = scholarship.university?.university_name || 'General Scholarship';

  return (
    <Link href={`/scholarships/${scholarship.id}`} className="block">
      <article className="group relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-blue-100 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:opacity-95">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 text-lg font-semibold leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
                {sanitizeHtmlToText(scholarship.name)}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-1">
                {sanitizeHtmlToText(scholarship.description)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 mt-auto text-sm">
            <div className="flex items-center justify-between py-2 border-t border-blue-100">
              <span className="text-gray-600 font-medium">Award Amount</span>
              <span className="text-xl font-bold text-blue-600">{amountDisplay}</span>
            </div>
            <div className={`flex items-center justify-between py-2 ${isUrgent ? 'border-red-100' : 'border-blue-100'} border`}>
              <span className="text-gray-600 font-medium">Deadline</span>
              <span className={`font-semibold ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
                {deadlineDisplay}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-blue-100">
              <span className="text-gray-600 font-medium">Institution</span>
              <span className="font-semibold text-blue-600 truncate">{typeDisplay}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

// Job Card
export const JobCardHomepage = ({ job }: { job: Job }) => {
  const organization = job.university?.university_name || job.institution?.name || 'Leading Organization';

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <article className="group relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-sm border border-green-100 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:opacity-95">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 text-lg font-semibold leading-tight line-clamp-2 group-hover:text-green-700 transition-colors">
                {sanitizeHtmlToText(job.title)}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-1">
                {sanitizeHtmlToText(job.description)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 mt-auto text-sm">
            <div className="flex items-center gap-2 py-2 border-t border-green-100">
              <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-600 font-medium truncate">{job.location}</span>
            </div>
            <div className="flex items-center justify-between py-2 border border-green-100 rounded-lg px-3">
              <span className="text-gray-600 font-medium">Type</span>
              <span className="font-semibold text-green-600">{job.employmentType}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-green-100">
              <span className="text-gray-600 font-medium">Organization</span>
              <span className="font-semibold text-gray-900 truncate">{organization}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

// Opportunity Card
export const OpportunityCardHomepage = ({ opportunity }: { opportunity: Opportunity }) => {
  const now = new Date();
  const start = new Date(opportunity.startDateTime);
  const end = new Date(opportunity.endDateTime);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const duration = `${diffDays} days`;
  const isOngoing = now >= start && now <= end;
  const isUpcoming = now < start;
  const startDate = start.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const organization = opportunity.university?.university_name || 'Premier Provider';

  return (
    <Link href={`/opportunity-hub/${opportunity.id}`} className="block">
      <article className="group relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl shadow-sm border border-purple-100 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:opacity-95">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 text-lg font-semibold leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors">
                {sanitizeHtmlToText(opportunity.title)}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mt-1">
                {sanitizeHtmlToText(opportunity.description)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 mt-auto text-sm">
            <div className="flex items-center justify-between py-2 border-t border-purple-100">
              <span className="text-gray-600 font-medium">Type</span>
              <span className="font-semibold text-purple-600">{opportunity.type}</span>
            </div>
            <div className="flex items-center justify-between py-2 border border-purple-100 rounded-lg px-3">
              <span className="text-gray-600 font-medium">Duration</span>
              <span className="font-semibold text-gray-900">{duration}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-purple-100">
              <span className="text-gray-600 font-medium">Provider</span>
              <span className="font-semibold text-gray-900 truncate">{organization}</span>
            </div>
            <div className={`flex items-center justify-between py-2 ${isOngoing ? 'border-green-100' : isUpcoming ? 'border-blue-100' : 'border-red-100'} border`}>
              <span className="text-gray-600 font-medium">Status</span>
              <span className={`font-semibold ${isOngoing ? 'text-green-600' : isUpcoming ? 'text-blue-600' : 'text-red-600'}`}>
                {isOngoing ? 'Ongoing' : isUpcoming ? 'Upcoming' : 'Past'}
              </span>
            </div>
            {startDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-purple-100">
                <Calendar className="w-3 h-3 text-purple-600 flex-shrink-0" />
                <span>Starts {startDate}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

// Ambassador Card
export const AmbassadorCardHomepage = ({ ambassador }: { ambassador: Ambassador }) => (
  <Link href={`/ambassadors/${ambassador.id}`} className="block">
    <article className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:opacity-95 text-center">
      <div className="relative pt-4 pb-6 px-4">
        <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden shadow-lg ring-4 ring-white bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={ambassador.photo || '/ambassador-default.png'}
            alt={ambassador.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-gray-900 text-lg font-semibold leading-tight group-hover:text-blue-600 transition-colors">
            {ambassador.name}
          </h3>
          <p className="text-gray-600 text-sm font-medium">{ambassador.university?.university_name || 'Independent Ambassador'}</p>
          <p className="text-xs text-gray-500">{ambassador.department?.name || 'Student Leader'}</p>
        </div>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200">
            <Users className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>
    </article>
  </Link>
);

// Mentor Card
export const MentorCardHomepage = ({ mentor }: { mentor: Mentor }) => (
  <Link href={`/mentors/${mentor.id}`} className="block">
    <article className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:opacity-95 text-center">
      <div className="relative pt-4 pb-6 px-4">
        <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden shadow-lg ring-4 ring-white bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={mentor.photo || '/mentor-default.png'}
            alt={mentor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-gray-900 text-lg font-semibold leading-tight group-hover:text-blue-600 transition-colors">
            {mentor.name}
          </h3>
          <p className="text-gray-600 text-sm font-medium">{mentor.university?.university_name || 'Seasoned Expert'}</p>
        </div>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200">
            <GraduationCap className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>
    </article>
  </Link>
);