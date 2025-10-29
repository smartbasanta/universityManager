'use client';

import { useState } from 'react';
import { Job } from '@/hooks/api/website/jobs.api';
import Link from 'next/link';

interface JobDetailProps {
  job: Job;
}

export const JobDetail = ({ job }: JobDetailProps) => {
  // Helper to convert HTML to clean text while preserving bold formatting
  const htmlToText = (html: string): string => {
    if (!html) return '';
    
    return html
      // Replace common HTML tags with appropriate text equivalents
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<h[1-6][^>]*>/gi, '')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')
      .replace(/<div[^>]*>/gi, '')
      // PRESERVE BOLD: Convert HTML bold tags to markdown-style bold
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      // PRESERVE ITALIC: Convert HTML italic tags to markdown-style italic
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Handle links (preserve link text)
      .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
      // Remove any remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Clean up excessive whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      .trim();
  };

  // Enhanced helper to format text with proper line breaks and bold/italic formatting
  const formatTextForDisplay = (text: string): React.ReactNode => {
    if (!text) return null;
    
    return text.split('\n').map((line, lineIndex, array) => (
      <span key={lineIndex}>
        {line.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, partIndex) => {
          // Handle bold text (**text**)
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return (
              <strong key={partIndex} className="font-bold">
                {boldText}
              </strong>
            );
          }
          // Handle italic text (*text*)
          else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            const italicText = part.slice(1, -1);
            return (
              <em key={partIndex} className="italic">
                {italicText}
              </em>
            );
          }
          // Regular text
          else {
            return part;
          }
        })}
        {lineIndex < array.length - 1 && <br />}
      </span>
    ));
  };

  // Helper to extract university name from job location if not in university field
  const getUniversityName = (): string => {
    if (job.university?.university_name) {
      return job.university.university_name;
    }
    
    if (job.organization) {
      return job.organization;
    }
    
    if (job.location && job.location.includes('MBUST')) {
      return 'MBUST (Mid-Western University)';
    }
    
    return 'Academic Institution';
  };

  // Helper function to extract only the main description (before structured sections)
  const getMainDescription = (description: string): string => {
    if (!description) return '';
    
    const mainDescMatch = description.match(/(.*?)(<h2>|$)/);
    const rawDescription = mainDescMatch ? mainDescMatch[1] : description;
    return htmlToText(rawDescription);
  };

  // Helper function to extract responsibilities from HTML description
  const extractResponsibilities = (description: string): string[] => {
    if (!description) return [];
    
    const responsibilitiesMatch = description.match(/<h2><strong>Responsibilities:<\/strong><\/h2>(.*?)(<h2>|$)/);
    if (!responsibilitiesMatch) return [];
    
    const listItemMatches = responsibilitiesMatch[1].match(/<li><p>(.*?)<\/p><\/li>/g);
    if (!listItemMatches) return [];
    
    return listItemMatches.map(item => 
      htmlToText(item.replace(/<li><p>|<\/p><\/li>/g, '').trim())
    );
  };

  // Helper function to extract benefits from HTML description
  const extractBenefits = (description: string): string[] => {
    if (!description) return [];
    
    const benefitsMatch = description.match(/<h2><strong>Benefits:<\/strong><\/h2>(.*?)(<h2>|$)/);
    if (!benefitsMatch) return [];
    
    const listItemMatches = benefitsMatch[1].match(/<li><p>(.*?)<\/p><\/li>/g);
    if (!listItemMatches) return [];
    
    return listItemMatches.map(item => 
      htmlToText(item.replace(/<li><p>|<\/p><\/li>/g, '').trim())
    );
  };

  // Extract content from job description
  const mainDescription = getMainDescription(job.description);
  const responsibilities = extractResponsibilities(job.description);
  const benefits = extractBenefits(job.description);
  const universityName = getUniversityName();

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      {/* Header Section */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="text-[#101518] text-base font-normal leading-normal">
          {universityName}, {job.university?.country || job.location}
        </span>
      </div>
      
      {/* Job Title */}
      <h1 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
        {job.title}
      </h1>
      
      {/* Job Details */}
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          {job.employmentType}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          {job.experienceLevel}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
          {job.modeOfWork}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          job.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {job.status}
        </span>
      </div>
      
      <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
        Posted: {job.datePosted || new Date(job.createdAt).toLocaleDateString() || 'Recently posted'}
      </p>

      {/* Action Buttons */}
      <div className="flex px-4 py-3 justify-start gap-4 flex-wrap">
        {job.hasApplicationForm && (
          <Link href={`/jobs/${job.id}/apply`}>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors">
              <span className="truncate">Apply Now</span>
            </button>
          </Link>
        )}
        
        {job.university?.website && (
          <button 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors"
            onClick={() => {
              const website = job.university?.website;
              if (website) {
                window.open(website, '_blank');
              }
            }}
          >
            <span className="truncate">University Website</span>
          </button>
        )}
        
        <button 
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors"
          onClick={() => {
            alert('Save functionality would be implemented here');
          }}
        >
          <span className="truncate">Save</span>
        </button>
      </div>

      {/* Main Job Description */}
      <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        About the Job
      </h3>
      <div className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4 whitespace-pre-line">
        {formatTextForDisplay(mainDescription)}
      </div>

      {/* Responsibilities */}
      {responsibilities.length > 0 && (
        <>
          <h3 className="text-[#101518] text-md font-semibold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Key Responsibilities
          </h3>
          <ul className="list-disc px-8 text-[#101518] text-base font-normal leading-normal pb-3">
            {responsibilities.map((item, index) => (
              <li key={index} className="mb-2">
                {formatTextForDisplay(item)}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <>
          <h3 className="text-[#101518] text-md font-semibold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Benefits & Perks
          </h3>
          <ul className="list-disc px-8 text-[#101518] text-base font-normal leading-normal pb-3">
            {benefits.map((item, index) => (
              <li key={index} className="mb-2">
                {formatTextForDisplay(item)}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Application Button Section */}
      {job.hasApplicationForm && job.questions && job.questions.length > 0 && (
        <>
          <hr className="my-6 border-t border-gray-200" />
          <div className="px-4 pb-6">
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] pb-4 pt-4">
              Ready to Apply?
            </h3>
            <p className="text-gray-600 mb-4">
              This position has {job.questions.length} application question{job.questions.length !== 1 ? 's' : ''} to complete.
            </p>
            <Link 
              href={`/jobs/${job.id}/apply`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Fill Application Form
            </Link>
          </div>
        </>
      )}

      <hr className="my-6 border-t border-gray-200" />

      {/* Enhanced Organization Information with University Overview */}
      <h3 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        About {universityName}
      </h3>
      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="text-[#101518] text-base font-normal leading-normal">
          {universityName}
        </span>
      </div>
      
      {/* University Type and Country */}
      <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
        {job.university?.university_overview?.university_type || 'Academic Institution'} · {job.university?.country || 'Higher Education'}
      </p>
      
      {/* University Overview Description */}
      <div className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4 whitespace-pre-line">
        {formatTextForDisplay(htmlToText(job.university?.university_overview?.description || 
         'No Organization Details Available as of Now!'))}
      </div>

      {/* Additional University Details */}
      {job.university?.university_overview && (
        <div className="px-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {job.university.university_overview.student_to_faculty_ratio && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Student to Faculty Ratio:</span>
                <span className="text-[#666]">{job.university.university_overview.student_to_faculty_ratio}</span>
              </div>
            )}
            {job.university.university_overview.research_expenditure && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Research Expenditure:</span>
                <span className="text-[#666]">${parseInt(job.university.university_overview.research_expenditure).toLocaleString()}</span>
              </div>
            )}
            {job.university.university_overview.area_type && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Area Type:</span>
                <span className="text-[#666]">{job.university.university_overview.area_type}</span>
              </div>
            )}
            {job.university.university_overview.state && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">State/Province:</span>
                <span className="text-[#666]">{job.university.university_overview.state}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
