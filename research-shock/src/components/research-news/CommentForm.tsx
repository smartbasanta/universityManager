'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuth';
import { fixPhotoUrl } from '@/utils/imageUtils';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  disabled?: boolean;
}

export const CommentForm = ({ 
  onSubmit, 
  placeholder = "Add a comment",
  buttonText = "Comment",
  disabled = false
}: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user info from auth store
  const { info, pp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(comment.trim());
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the user's avatar directly here
  const getUserAvatarUrl = () => {
    // 1. First try pp field (preferred)
    if (pp) {
      return fixPhotoUrl(pp);
    }
    
    // 2. Fallback to photo field
    if (info?.photo) {
      if (info.photo.startsWith('/uploads/')) {
        const baseUrl = 'http://localhost:4000';
        return `${baseUrl}${info.photo}`;
      }
      return fixPhotoUrl(info.photo);
    }
    
    // 3. Default avatar
    return '/ambassador-default.png';
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center px-4 py-3 gap-3">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
          style={{
            backgroundImage: `url("${getUserAvatarUrl()}")`
          }}
        />
        <form onSubmit={handleSubmit} className="flex flex-col min-w-40 h-12 flex-1">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <input
              placeholder={placeholder}
              className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border-none bg-[#e7edf3] focus:border-none h-full placeholder:text-[#4e7097] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal ${
                disabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={disabled || isSubmitting}
              maxLength={1000}
            />
            <div className="flex border-none bg-[#e7edf3] items-center justify-center pr-4 rounded-r-xl border-l-0 !pr-2">
              <div className="flex items-center gap-4 justify-end">
                <button 
                  type="submit"
                  disabled={!comment.trim() || isSubmitting || disabled}
                  className={`transition-colors ${
                    !comment.trim() || isSubmitting || disabled 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-[#4e7097] hover:text-[#3a5a7a]'
                  }`}
                  title={isSubmitting ? 'Posting...' : 'Post comment'}
                >
                  {isSubmitting ? (
                    <svg 
                      className="animate-spin" 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20px" 
                      height="20px" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M232,127.89a16,16,0,0,1-8.18,14L55.91,237.9A16.14,16.14,0,0,1,48,240a16,16,0,0,1-15.05-21.34L60.3,138.71A4,4,0,0,1,64.09,136H136a8,8,0,0,0,0-16H64.09a4,4,0,0,1-3.79-2.71L32.95,37.34A16,16,0,0,1,55.91,18.1l168,96A16,16,0,0,1,232,127.89Z"/>
                    </svg>
                  )}
                </button>
                <div className="flex items-center gap-1">
                  <button 
                    type="button"
                    disabled={disabled || isSubmitting}
                    className={`flex items-center justify-center p-1.5 ${
                      disabled || isSubmitting 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-200 rounded'
                    }`}
                    title="Add image (coming soon)"
                  >
                    <div className="text-[#4e7097]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="px-4 pb-2">
          <p className="text-red-500 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"/>
            </svg>
            {error}
          </p>
        </div>
      )}
      
      {/* Character count (optional) */}
      {comment.length > 800 && (
        <div className="px-4 pb-2">
          <p className={`text-xs ${comment.length > 950 ? 'text-red-500' : 'text-gray-500'}`}>
            {comment.length}/1000 characters
          </p>
        </div>
      )}
    </div>
  );
};
