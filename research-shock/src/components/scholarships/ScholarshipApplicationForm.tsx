'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scholarship } from '@/hooks/api/website/scholarships.api';
import { useAuthStore } from '@/stores/useAuth';
import { useAnswerQuestion } from '@/hooks/api/scholarship/scholarship.query';

interface ScholarshipApplicationFormProps {
  scholarship: Scholarship;
}

interface FormData {
  [key: string]: string;
}

interface FileData {
  [key: string]: File;
}

export const ScholarshipApplicationForm = ({ scholarship }: ScholarshipApplicationFormProps) => {
  const router = useRouter();
  const { isAuth, role } = useAuthStore();
  const answerQuestionMutation = useAnswerQuestion();
  
  const [formData, setFormData] = useState<FormData>({});
  const [fileData, setFileData] = useState<FileData>({});
  const [submitMessage, setSubmitMessage] = useState('');

  // Check authentication and role
  if (!isAuth) {
    return (
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Authentication Required</h3>
              <p className="text-yellow-700">Please log in to submit your application for this scholarship.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role !== 'student') {
    return (
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Access Restricted</h3>
              <p className="text-red-700">Only students can submit applications for scholarships.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle form input changes
  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle file upload - Note: File handling will need additional backend support
  const handleFileUpload = async (questionId: string, file: File) => {
    setFileData(prev => ({ ...prev, [questionId]: file }));
    // For now, store file name as the answer - you'll need to implement file upload to your backend
    handleInputChange(questionId, file.name);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');

    try {
      // Validate required fields
      const missingFields = scholarship.questions
        ?.filter(q => q.required && !formData[q.id]?.toString().trim())
        .map(q => q.label) || [];

      if (missingFields.length > 0) {
        setSubmitMessage(`Please fill in required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Format data according to your API schema (same as opportunities and jobs)
      const answersData = {
        answers: Object.entries(formData)
          .filter(([key, value]) => value?.toString().trim()) // Only include non-empty answers
          .map(([questionId, answer]) => ({
            questionId,
            answer: answer.toString().trim()
          }))
      };

      // Note: If you have files, you'll need to handle file upload separately
      // as the current API expects JSON, not FormData
      if (Object.keys(fileData).length > 0) {
        console.warn('File uploads detected but not yet supported by the API. Files:', fileData);
        // You might want to upload files first and get their URLs to include in answers
      }

      // Submit using the React Query mutation
      answerQuestionMutation.mutate(answersData, {
        onSuccess: () => {
          setSubmitMessage('Application submitted successfully!');
          setFormData({});
          setFileData({});
          
          // Redirect back to scholarship page after successful submission
          setTimeout(() => {
            router.push(`/scholarships/${scholarship.id}`);
          }, 2000);
        },
        onError: (error: any) => {
          console.error('Submission error:', error);
          setSubmitMessage('Failed to submit application. Please try again.');
        }
      });
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Failed to submit application. Please try again.');
    }
  };

  // Complete switch case with all question types
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
      
      case 'Number':
        return (
          <input
            type="number"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
            placeholder="Enter a number"
          />
        );
      
      case 'Phone':
        return (
          <input
            type="tel"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
            placeholder="Enter your phone number"
          />
        );
      
      case 'Date':
        return (
          <input
            type="date"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
          />
        );
      
      case 'Radio Buttons':
        const radioOptions = question.options || ['Option 1', 'Option 2', 'Option 3'];
        return (
          <div className="space-y-2">
            {radioOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.id}_${index}`}
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  required={question.required}
                />
                <label htmlFor={`${question.id}_${index}`} className="ml-2 text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'Checkboxes':
        const checkboxOptions = question.options || ['Option 1', 'Option 2', 'Option 3'];
        const selectedValues = value ? value.split(',').filter(v => v.trim()) : [];
        
        return (
          <div className="space-y-2">
            {checkboxOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${question.id}_${index}`}
                  value={option}
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    const currentValues = selectedValues.filter(v => v !== option);
                    if (e.target.checked) {
                      currentValues.push(option);
                    }
                    handleInputChange(question.id, currentValues.join(','));
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`${question.id}_${index}`} className="ml-2 text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'Dropdown':
        const dropdownOptions = question.options || ['Option 1', 'Option 2', 'Option 3'];
        return (
          <select
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required={question.required}
          >
            <option value="">Select an option</option>
            {dropdownOptions.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
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
            <p className="mt-1 text-xs text-amber-600">
              Note: File upload functionality requires additional backend implementation
            </p>
          </div>
        );
      
      case 'URL':
        return (
          <input
            type="url"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
            placeholder="https://example.com"
          />
        );
      
      case 'Time':
        return (
          <input
            type="time"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
          />
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scholarship Application Form</h1>
              <p className="text-gray-600">{scholarship.title} at {scholarship.university?.university_name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {scholarship.university?.country || scholarship.displayLocation}
          </div>

          {/* Scholarship Details Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Scholarship Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <p><strong>Level:</strong> {scholarship.educationalLevel}</p>
              <p><strong>Field:</strong> {scholarship.fieldOfStudy}</p>
              <p><strong>Amount:</strong> {scholarship.amountDisplay}</p>
              <p><strong>Deadline:</strong> {scholarship.deadlineDisplay}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Application</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {scholarship.questions?.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFormField(question)}
                <p className="text-xs text-gray-500">
                  Type: {question.type} | {question.required ? 'Required' : 'Optional'}
                </p>
              </div>
            ))}
            
            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Scholarship Details
                </button>
                
                <button
                  type="submit"
                  disabled={answerQuestionMutation.isPending}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-colors ${
                    answerQuestionMutation.isPending 
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {answerQuestionMutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Application
                    </>
                  )}
                </button>
              </div>
              
              {submitMessage && (
                <div className={`mt-4 p-4 rounded-lg ${
                  submitMessage.includes('success') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center gap-2">
                    {submitMessage.includes('success') ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {submitMessage}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
