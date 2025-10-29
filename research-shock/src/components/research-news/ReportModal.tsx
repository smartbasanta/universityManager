'use client';

import { useState, useEffect } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (reason: string, details?: string) => void;
  commentText?: string;
  author?: string;
}

const reportReasons = [
  { id: 'spam', label: 'Spam or unwanted content', description: 'Repetitive, promotional, or irrelevant content' },
  { id: 'harassment', label: 'Harassment or bullying', description: 'Targeting or intimidating behavior' },
  { id: 'hate-speech', label: 'Hate speech', description: 'Content that promotes hatred or discrimination' },
  { id: 'misinformation', label: 'Misinformation', description: 'False or misleading information' },
  { id: 'inappropriate', label: 'Inappropriate content', description: 'Content that violates community guidelines' },
  { id: 'copyright', label: 'Copyright violation', description: 'Unauthorized use of copyrighted material' },
  { id: 'other', label: 'Other', description: 'Please specify in the details below' }
];

export const ReportModal = ({ 
  isOpen, 
  onClose, 
  onReport, 
  commentText, 
  author 
}: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      // Reset form when modal closes
      setSelectedReason('');
      setDetails('');
      setIsSubmitting(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onReport(selectedReason, details);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Report Comment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Help us understand what's wrong with this comment from <span className="font-medium">{author}</span>.
            </p>
            
            {commentText && (
              <div className="bg-gray-50 border-l-4 border-gray-300 p-3 rounded-r-md mb-6">
                <p className="text-sm text-gray-600 italic line-clamp-3">
                  "{commentText}"
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Why are you reporting this comment? *
                </label>
                <div className="space-y-2">
                  {reportReasons.map((reason) => (
                    <label
                      key={reason.id}
                      className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedReason === reason.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="reason"
                          value={reason.id}
                          checked={selectedReason === reason.id}
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{reason.label}</div>
                          <div className="text-sm text-gray-600">{reason.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  id="details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide any additional context that might help us review this report..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Info Box */}
             <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Your report is anonymous</p>
                    <p className="text-sm text-blue-700">
                      We'll review this content and take appropriate action if it violates our community guidelines.
                    </p>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* Footer */}
     <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
            Cancel
            </button>
            <button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
            {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
        </div>
        </div>
      </div>
    </div>
  );
};
