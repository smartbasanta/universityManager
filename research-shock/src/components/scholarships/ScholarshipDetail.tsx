'use client';

import { useState } from 'react';
import { Scholarship } from '@/hooks/api/website/scholarships.api';
import Link from 'next/link';

interface ScholarshipDetailProps {
  scholarship: Scholarship;
}

export const ScholarshipDetail = ({ scholarship }: ScholarshipDetailProps) => {
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

  // Helper to extract university name from scholarship
  const getUniversityName = (): string => {
    if (scholarship.university?.university_name) {
      return scholarship.university.university_name;
    }
    
    if (scholarship.organization) {
      return scholarship.organization;
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

  // Helper function to extract application process from HTML description
  const extractApplicationProcess = (description: string): string[] => {
    if (!description) return [];
    
    const applicationMatch = description.match(/<h2><strong>Application Process<\/strong><\/h2>(.*?)(<h2>|$)/);
    if (!applicationMatch) return [];
    
    const listItemMatches = applicationMatch[1].match(/<li><p>(.*?)<\/p><\/li>/g);
    if (!listItemMatches) return [];
    
    return listItemMatches.map(item => 
      htmlToText(item.replace(/<li><p>|<\/p><\/li>/g, '').trim())
    );
  };

  // Helper function to extract benefits from HTML description
  const extractBenefits = (description: string): string[] => {
    if (!description) return [];
    
    const benefitsMatch = description.match(/<h2><strong>Benefits<\/strong><\/h2>(.*?)(<h2>|$)/);
    if (!benefitsMatch) return [];
    
    const listItemMatches = benefitsMatch[1].match(/<li><p>(.*?)<\/p><\/li>/g);
    if (!listItemMatches) return [];
    
    return listItemMatches.map(item => 
      htmlToText(item.replace(/<li><p>|<\/p><\/li>/g, '').trim())
    );
  };

  // Extract content from scholarship description
  const mainDescription = getMainDescription(scholarship.description);
  const applicationProcess = extractApplicationProcess(scholarship.description);
  const benefits = extractBenefits(scholarship.description);
  const universityName = getUniversityName();

  // Convert eligibility criteria to clean text
  const cleanEligibilityCriteria = htmlToText(scholarship.eligibilityCriteria || '');

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      {/* Header Section */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="text-[#101518] text-base font-normal leading-normal">
          {universityName}, {scholarship.university?.country || scholarship.displayLocation}
        </span>
      </div>
      
      {/* Scholarship Title */}
      <h1 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
        {scholarship.title}
      </h1>
      
      {/* Scholarship Details */}
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          {scholarship.educationalLevel}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          {scholarship.fieldOfStudy}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
          {scholarship.scholarshipType}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          scholarship.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {scholarship.status}
        </span>
        {scholarship.isUrgent && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-600">
            Urgent: {scholarship.deadlineDisplay}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4 px-4 pb-3">
        <p className="text-[#101518] text-base font-normal leading-normal">
          <strong>Amount:</strong> {scholarship.amountDisplay}
        </p>
        <p className="text-[#101518] text-base font-normal leading-normal">
          <strong>Deadline:</strong> {scholarship.deadlineDisplay}
        </p>
        <p className="text-[#101518] text-base font-normal leading-normal">
          <strong>Nationality:</strong> {scholarship.nationality_requirement}
        </p>
      </div>
      
      <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
        Posted: {scholarship.datePosted || new Date(scholarship.createdAt).toLocaleDateString() || 'Recently posted'}
      </p>

      {/* Action Buttons */}
      <div className="flex px-4 py-3 justify-start gap-4 flex-wrap">
        {scholarship.hasApplicationForm && (
          <Link href={`/scholarships/${scholarship.id}/apply`}>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors">
              <span className="truncate">Apply Now</span>
            </button>
          </Link>
        )}
        
        {scholarship.link && (
          <button 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors"
            onClick={() => {
              window.open(scholarship.link, '_blank');
            }}
          >
            <span className="truncate">External Application</span>
          </button>
        )}
        
        {scholarship.university?.website && (
          <button 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors"
            onClick={() => {
              const website = scholarship.university?.website;
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

      {/* Main Scholarship Description */}
      <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        About the Scholarship
      </h3>
      <div className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4 whitespace-pre-line">
        {formatTextForDisplay(mainDescription)}
      </div>

      {/* Eligibility Criteria */}
      <h3 className="text-[#101518] text-md font-semibold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Eligibility Criteria
      </h3>
      <div className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4 whitespace-pre-line">
        {formatTextForDisplay(cleanEligibilityCriteria)}
      </div>

      {/* Application Process */}
      {applicationProcess.length > 0 && (
        <>
          <h3 className="text-[#101518] text-md font-semibold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Application Process
          </h3>
          <ul className="list-disc px-8 text-[#101518] text-base font-normal leading-normal pb-3">
            {applicationProcess.map((item, index) => (
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
            Benefits & Support
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

      {/* Scholarship Usage */}
      {scholarship.used_for && scholarship.used_for.length > 0 && (
        <>
          <h3 className="text-[#101518] text-md font-semibold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Scholarship Can Be Used For
          </h3>
          <ul className="list-disc px-8 text-[#101518] text-base font-normal leading-normal pb-3">
            {scholarship.used_for.map((item, index) => (
              <li key={index} className="mb-2">
                {typeof item === 'string' ? formatTextForDisplay(htmlToText(item)) : item}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Application Button Section - Following JobDetail pattern */}
      {scholarship.hasApplicationForm && scholarship.questions && scholarship.questions.length > 0 && (
        <>
          <hr className="my-6 border-t border-gray-200" />
          <div className="px-4 pb-6">
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] pb-4 pt-4">
              Ready to Apply?
            </h3>
            <p className="text-gray-600 mb-4">
              This scholarship has {scholarship.questions.length} application question{scholarship.questions.length !== 1 ? 's' : ''} to complete.
            </p>
            <Link 
              href={`/scholarships/${scholarship.id}/apply`}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="text-[#101518] text-base font-normal leading-normal">
          {universityName}
        </span>
      </div>
      
      {/* University Type and Country */}
      <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
        {scholarship.university?.university_overview?.university_type || 'Academic Institution'} · {scholarship.university?.country || 'Higher Education'}
      </p>
      
      {/* University Overview Description */}
      <div className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4 whitespace-pre-line">
        {formatTextForDisplay(htmlToText(scholarship.university?.university_overview?.description || 
         'No Organization Details Available as of Now!'))}
      </div>

      {/* Additional University Details */}
      {scholarship.university?.university_overview && (
        <div className="px-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {scholarship.university.university_overview.student_to_faculty_ratio && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Student to Faculty Ratio:</span>
                <span className="text-[#666]">{scholarship.university.university_overview.student_to_faculty_ratio}</span>
              </div>
            )}
            {scholarship.university.university_overview.research_expenditure && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Research Expenditure:</span>
                <span className="text-[#666]">${parseInt(scholarship.university.university_overview.research_expenditure).toLocaleString()}</span>
              </div>
            )}
            {scholarship.university.university_overview.area_type && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Area Type:</span>
                <span className="text-[#666]">{scholarship.university.university_overview.area_type}</span>
              </div>
            )}
            {scholarship.university.university_overview.state && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">State/Province:</span>
                <span className="text-[#666]">{scholarship.university.university_overview.state}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
