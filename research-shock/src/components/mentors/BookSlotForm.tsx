'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateBooking } from '@/hooks/api/mentors/mentors.query';
import { useCreateAmbassadorBooking } from '@/hooks/api/ambassadors/ambassadors.query';
import { CreateBookingRequest } from '@/hooks/api/mentors/mentors.api';
import { CreateBookingRequest as AmbassadorCreateBookingRequest } from '@/hooks/api/ambassadors/ambassadors.api';
import { useAuthStore } from '@/stores/useAuth';

interface BookingSlotFormProps {
  mentorId?: string;
  ambassadorId?: string;
  isAmbassadorBooking?: boolean;
}

interface FormData {
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
}

export default function BookingSlotForm({ 
  mentorId, 
  ambassadorId, 
  isAmbassadorBooking = false 
}: BookingSlotFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use appropriate booking hook based on booking type
  const createMentorBookingMutation = useCreateBooking();
  const createAmbassadorBookingMutation = useCreateAmbassadorBooking();
  
  const createBookingMutation = isAmbassadorBooking 
    ? createAmbassadorBookingMutation 
    : createMentorBookingMutation;
  
  const { isAuth, isLoading, role, info } = useAuthStore();
  
  // Get the correct entity ID and determine entity type
  const entityId = isAmbassadorBooking ? ambassadorId : mentorId;
  const entityType = isAmbassadorBooking ? 'Ambassador' : 'Mentor';
  const entityTypeLower = isAmbassadorBooking ? 'ambassador' : 'mentor';
  const sessionType = isAmbassadorBooking ? 'ambassador session' : 'mentorship session';
  const basePath = isAmbassadorBooking ? '/ambassadors' : '/mentors';
  
  // Get booking data from URL params
  const slotId = searchParams.get('slotId') || '';
  const selectedDate = searchParams.get('date') || '';
  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';

  const [formData, setFormData] = useState<FormData>({
    currentOccupation: '',
    discussionTopic: '',
    additionalInfo: '',
  });

  // Redirect if no slotId is provided
  useEffect(() => {
    if (!isLoading && !slotId) {
      router.push(`${basePath}/${entityId}`);
    }
  }, [isLoading, slotId, entityId, basePath, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuth) {
      router.push('/login');
    }
  }, [isLoading, isAuth, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!slotId) {
    console.error('No slot ID provided');
    return;
  }
  
  const bookingData: CreateBookingRequest | AmbassadorCreateBookingRequest = {
    slotId,
    currentOccupation: formData.currentOccupation,
    discussionTopic: formData.discussionTopic,
    additionalInfo: formData.additionalInfo,
    
  };

  try {
    await createBookingMutation.mutateAsync(bookingData);
    router.push(`${basePath}/${entityId}?booking=success`);
  } catch (error) {
    console.error('Booking submission failed:', error);
  }
};

  const formatTimeRange = (start: string, end: string) => {
    if (!start || !end) return '';
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Dynamic breadcrumb items
  const breadcrumbItems = [
    { 
      label: isAmbassadorBooking ? 'Ambassadors' : 'Mentors', 
      href: basePath 
    },
    { 
      label: 'Profile', 
      href: `${basePath}/${entityId}` 
    },
  ];

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3f7fbf]"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuth) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-2 p-4">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <a 
                href={item.href}
                className="text-[#5c738a] text-base font-medium leading-normal hover:text-blue-600"
              >
                {item.label}
              </a>
              <span className="text-[#5c738a] text-base font-medium leading-normal">/</span>
            </div>
          ))}
          <span className="text-[#101418] text-base font-medium leading-normal">Book Session</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Login Required
          </h2>
          <p className="text-blue-700 mb-4">
            Please log in to your student account to book {sessionType}s.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-[#3f7fbf] text-white px-4 py-2 rounded-md hover:bg-[#2d5a87] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Check if user is a student
  const isStudent = role === 'student' || role === 'STUDENT';
  
  if (!isStudent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-2 p-4">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <a 
                href={item.href}
                className="text-[#5c738a] text-base font-medium leading-normal hover:text-blue-600"
              >
                {item.label}
              </a>
              <span className="text-[#5c738a] text-base font-medium leading-normal">/</span>
            </div>
          ))}
          <span className="text-[#101418] text-base font-medium leading-normal">Book Session</span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Student Access Only
          </h2>
          <p className="text-yellow-700 mb-4">
            Only students can book {sessionType}s. Current role: <strong>{role}</strong>
          </p>
          <button
            onClick={() => router.back()}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex flex-wrap gap-2 p-4">
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <a 
              href={item.href}
              className="text-[#5c738a] text-base font-medium leading-normal hover:text-blue-600"
            >
              {item.label}
            </a>
            <span className="text-[#5c738a] text-base font-medium leading-normal">/</span>
          </div>
        ))}
        <span className="text-[#101418] text-base font-medium leading-normal">Book Session</span>
      </div>

      <h1 className="text-[#101418] text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-6">
        Book a 30-minute {entityTypeLower} session
      </h1>

      {/* Welcome message for logged-in student */}
      <div className="mx-4 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800">
          Welcome, <strong>{info?.name || 'Student'}</strong>! You're booking a {sessionType} as a verified student.
        </p>
      </div>

      {/* Selected Time Display */}
      {selectedDate && startTime && endTime && (
        <div className="mx-4 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Selected Time Slot</h3>
          <p className="text-blue-700 font-medium">
            {formatDate(selectedDate)}
          </p>
          <p className="text-blue-600">
            {formatTimeRange(startTime, endTime)}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Details - Only the 3 required fields */}
        <div className="mx-4 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-[#101418]">Session Details</h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="currentOccupation" className="block text-sm font-medium text-[#5c738a] mb-2">
                What are you currently working on? *
              </label>
              <textarea
                id="currentOccupation"
                name="currentOccupation"
                required
                rows={4}
                value={formData.currentOccupation}
                onChange={handleInputChange}
                placeholder="Tell us about your current projects, studies, or career situation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3f7fbf] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="discussionTopic" className="block text-sm font-medium text-[#5c738a] mb-2">
                What do you want to talk about? *
              </label>
              <textarea
                id="discussionTopic"
                name="discussionTopic"
                required
                rows={4}
                value={formData.discussionTopic}
                onChange={handleInputChange}
                placeholder={`Describe your goals, questions, or topics you'd like to discuss with the ${entityTypeLower}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3f7fbf] focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-[#5c738a] mb-2">
                Anything else we should know? (Optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={4}
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional information or special requirements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3f7fbf] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 px-4 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-[#5c738a] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createBookingMutation.isPending || !slotId}
            className={`
              px-6 py-2 rounded-md text-white transition-colors
              ${createBookingMutation.isPending || !slotId
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#3f7fbf] hover:bg-[#2d5a87] cursor-pointer'
              }
            `}
          >
            {createBookingMutation.isPending ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
