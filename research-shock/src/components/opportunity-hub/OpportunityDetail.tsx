'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Opportunity } from '@/hooks/api/website/opportunity.api';

interface OpportunityDetailProps {
  opportunity: Opportunity;
}

interface FormData {
  [key: string]: string;
}

interface FileData {
  [key: string]: File;
}

export const OpportunityDetail = ({ opportunity }: OpportunityDetailProps) => {
  const [formData, setFormData] = useState<FormData>({});
  const [fileData, setFileData] = useState<FileData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

  // Helper to extract university name from opportunity
  const getUniversityName = (): string => {
    if (opportunity.university?.university_name) {
      return opportunity.university.university_name;
    }
    
    if (opportunity.organization) {
      return opportunity.organization;
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

  // Helper function to extract eligibility criteria from HTML description
  const extractEligibilityCriteria = (description: string): string[] => {
    if (!description) return [];
    
    const eligibilityMatch = description.match(/<h2>Eligibility Criteria<\/h2>(.*?)(<h2>|$)/);
    if (!eligibilityMatch) return [];
    
    const listItemMatches = eligibilityMatch[1].match(/<li><p>(.*?)<\/p><\/li>/g);
    if (!listItemMatches) return [];
    
    return listItemMatches.map(item => 
      htmlToText(item.replace(/<li><p>|<\/p><\/li>/g, '').trim())
    );
  };

  // Helper function to extract requirements from HTML description
  const extractRequirements = (description: string): string[] => {
    if (!description) return [];
    
    const requirementsMatch = description.match(/<h2><strong>Requirements:<\/strong><\/h2>(.*?)(<h2>|$)/);
    if (!requirementsMatch) return [];
    
    const listItemMatches = requirementsMatch[1].match(/<li><p>(.*?)<\/p><\/li>/g);
    if (!listItemMatches) return [];
    
    return listItemMatches.map(item => 
      htmlToText(item.replace(/<li><p>|<\/p><\/li>/g, '').trim())
    );
  };

  // Extract content from opportunity description
  const mainDescription = getMainDescription(opportunity.description);
  const eligibilityCriteria = extractEligibilityCriteria(opportunity.description);
  const requirements = extractRequirements(opportunity.description);
  const universityName = getUniversityName();

  // Handle form input changes (for inline form - keeping for backward compatibility)
  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle file upload (for inline form - keeping for backward compatibility)
  const handleFileUpload = async (questionId: string, file: File) => {
    setFileData(prev => ({ ...prev, [questionId]: file }));
    handleInputChange(questionId, file.name);
  };

  // Handle form submission (for inline form - keeping for backward compatibility)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Validate required fields
      const missingFields = opportunity.questions
        ?.filter(q => q.required && !formData[q.id]?.toString().trim())
        .map(q => q.label);

      if (missingFields && missingFields.length > 0) {
        setSubmitMessage(`Please fill in required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // Create FormData for submission
      const submissionData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key].toString());
      });
      
      // Add files
      Object.keys(fileData).forEach(key => {
        submissionData.append(`file_${key}`, fileData[key]);
      });
      
      // Add opportunity ID
      submissionData.append('opportunityId', opportunity.id);

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage('Application submitted successfully!');
      setFormData({});
      setFileData({});
      
    } catch (error) {
      setSubmitMessage('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete switch case with all question types (keeping for inline form compatibility)
  const renderFormField = (question: any) => {
    const value = formData[question.id] || '';
    
    switch (question.type) {
      case 'Text Input':
        return (
          <input
            type="text"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );
      
      case 'Textarea':
        return (
          <textarea
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            required={question.required}
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );
      
      case 'Email':
        return (
          <input
            type="email"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
            placeholder="Enter your email address"
          />
        );
      
      case 'File Upload':
        return (
          <div>
            <input
              type="file"
              id={question.id}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(question.id, file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required={question.required}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {value && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: <span className="font-medium">{value}</span>
              </p>
            )}
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      {/* Header Section */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
          </svg>
        </div>
        <span className="text-[#101518] text-base font-normal leading-normal">
          {universityName}, {opportunity.university?.country || 'Global'}
        </span>
      </div>
      
      {/* Opportunity Title */}
      <h1 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
        {opportunity.title}
      </h1>
      
      {/* Opportunity Details */}
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          {opportunity.educationalLevel}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          {opportunity.type}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
          {opportunity.location}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          opportunity.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {opportunity.status}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-4 px-4 pb-3">
        <p className="text-[#101518] text-base font-normal leading-normal">
          <strong>Start Date:</strong> {new Date(opportunity.startDateTime).toLocaleDateString()}
        </p>
        <p className="text-[#101518] text-base font-normal leading-normal">
          <strong>End Date:</strong> {new Date(opportunity.endDateTime).toLocaleDateString()}
        </p>
        <p className="text-[#101518] text-base font-normal leading-normal">
          <strong>Venue:</strong> {opportunity.venue}
        </p>
      </div>
      
      <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
        Posted: {new Date(opportunity.createdAt).toLocaleDateString() || 'Recently posted'}
      </p>

      {/* Action Buttons */}
      <div className="flex px-4 py-3 justify-start gap-4 flex-wrap">
        {opportunity.hasApplicationForm && (
          <Link href={`/opportunity-hub/${opportunity.id}/apply`}>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors">
              <span className="truncate">Apply Now</span>
            </button>
          </Link>
        )}
        
        {opportunity.applicationLink && (
          <button 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors"
            onClick={() => {
              window.open(opportunity.applicationLink, '_blank');
            }}
          >
            <span className="truncate">Visit Website</span>
          </button>
        )}
        
        {opportunity.university?.website && (
          <button 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#b2cbe5] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a0b8d1] transition-colors"
            onClick={() => {
              const website = opportunity.university?.website;
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

      {/* Main Opportunity Description */}
      <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        About the Opportunity
      </h3>
      <div className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4 whitespace-pre-line">
        {formatTextForDisplay(mainDescription)}
      </div>

      {/* Eligibility Criteria */}
      {eligibilityCriteria.length > 0 && (
        <>
          <h3 className="text-[#101518] text-md font-semibold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Eligibility Criteria
          </h3>
          <ul className="list-disc px-8 text-[#101518] text-base font-normal leading-normal pb-3">
            {eligibilityCriteria.map((item, index) => (
              <li key={index} className="mb-2">
                {formatTextForDisplay(item)}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Requirements */}
      {requirements.length > 0 && (
        <>
          <h3 className="text-[#101518] text-md font-semibold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Requirements
          </h3>
          <ul className="list-disc px-8 text-[#101518] text-base font-normal leading-normal pb-3">
            {requirements.map((item, index) => (
              <li key={index} className="mb-2">
                {formatTextForDisplay(item)}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Event Details */}
      <h3 className="text-[#101518] text-md font-semibold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Event Details
      </h3>
      <div className="px-4 py-3 text-base text-[#101518] space-y-2">
        <p><strong>Venue:</strong> {opportunity.venue}</p>
        <p><strong>Start Date & Time:</strong> {new Date(opportunity.startDateTime).toLocaleDateString()} at {new Date(opportunity.startDateTime).toLocaleTimeString()}</p>
        <p><strong>End Date & Time:</strong> {new Date(opportunity.endDateTime).toLocaleDateString()} at {new Date(opportunity.endDateTime).toLocaleTimeString()}</p>
        
        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="pt-2">
            <p className="font-semibold text-[#121416] mb-2">Keywords:</p>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Button Section */}
      {opportunity.hasApplicationForm && (opportunity.questions?.length > 0 || opportunity.teamMemberQuestions?.length > 0) && (
        <>
          <hr className="my-6 border-t border-gray-200" />
          <div className="px-4 pb-6">
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] pb-4 pt-4">
              Ready to Apply?
            </h3>
            <p className="text-gray-600 mb-4">
              This opportunity has{' '}
              {(opportunity.questions?.length || 0) + (opportunity.teamMemberQuestions?.length || 0)}{' '}
              application question{((opportunity.questions?.length || 0) + (opportunity.teamMemberQuestions?.length || 0)) !== 1 ? 's' : ''} to complete.
              {opportunity.teamMemberQuestions && opportunity.teamMemberQuestions.length > 0 && 
                ` This includes ${opportunity.teamMemberQuestions.length} team member question${opportunity.teamMemberQuestions.length !== 1 ? 's' : ''}.`
              }
            </p>
            <Link 
              href={`/opportunity-hub/${opportunity.id}/apply`}
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

      {/* Organization Information - UPDATED WITH OVERVIEW */}
      <h3 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        About {universityName}
      </h3>
      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
          </svg>
        </div>
        <span className="text-[#101518] text-base font-normal leading-normal">
          {universityName}
        </span>
      </div>
      
      {/* University Type and Country */}
      <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
        {opportunity.university?.university_overview?.university_type || 'Academic Institution'} · {opportunity.university?.country || 'Higher Education'}
      </p>
      
      {/* University Overview Description */}
      <div className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4 whitespace-pre-line">
        {formatTextForDisplay(htmlToText(opportunity.university?.university_overview?.description || 
         'No Organization Details Available as of Now!'))}
      </div>

      {/* Additional University Details */}
      {opportunity.university?.university_overview && (
        <div className="px-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {opportunity.university.university_overview.student_to_faculty_ratio && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Student to Faculty Ratio:</span>
                <span className="text-[#666]">{opportunity.university.university_overview.student_to_faculty_ratio}</span>
              </div>
            )}
            {opportunity.university.university_overview.research_expenditure && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Research Expenditure:</span>
                <span className="text-[#666]">${parseInt(opportunity.university.university_overview.research_expenditure).toLocaleString()}</span>
              </div>
            )}
            {opportunity.university.university_overview.area_type && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">Area Type:</span>
                <span className="text-[#666]">{opportunity.university.university_overview.area_type}</span>
              </div>
            )}
            {opportunity.university.university_overview.state && (
              <div className="flex justify-between">
                <span className="font-semibold text-[#101518]">State/Province:</span>
                <span className="text-[#666]">{opportunity.university.university_overview.state}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
