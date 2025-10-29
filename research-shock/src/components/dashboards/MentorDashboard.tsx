"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMentorProfile, useUpdateMentorProfile } from '@/hooks/api/mentors/mentors.query';
import { useCreateSlot, useGetAllMentorSlots, useDeleteSlot } from '@/hooks/api/mentors/mentors.query';
import { useQuery } from '@tanstack/react-query';
import { axiosPrivateInstance } from '@/api/axois-config';
import { Edit, Users, Calendar } from "lucide-react";

interface TimeSlot {
  id: string;
  createdAt: string;
  updatedAt: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
}

interface Booking {
  id: string;
  slotId: string;
  createdAt: string;
  updatedAt: string;
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
  attended: boolean;
  status?: "Acknowledged" | "Booked" | "Cancelled";
}

export const MentorDashboard = () => {
  const router = useRouter();
  // Slot state - now using backend slots
  const [slotTime, setSlotTime] = useState('');
  const [slotDuration, setSlotDuration] = useState('30'); // Default to 30 minutes

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [language, setLanguage] = useState('');
  const [expertiseAreas, setExpertiseAreas] = useState('');
  const [focusAreas, setFocusAreas] = useState('');
  const [notableAchievement, setNotableAchievement] = useState('');
  const [about, setAbout] = useState('');
  const [access, setAccess] = useState('public');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Read-only mode and edit functionality state
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);

  // API hooks
  const { data: profileData, isLoading, error } = useGetMentorProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMentorProfile();
  
  // Updated: Using mentor-specific slot hooks
  const { data: allSlots = [], isLoading: slotsLoading, refetch: refetchSlots } = useGetAllMentorSlots();
  const createSlotMutation = useCreateSlot();
  const deleteSlotMutation = useDeleteSlot();

  // NEW: Fetch booking requests for status overview
  const { data: bookingRequests = [] } = useQuery<Booking[]>({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data } = await axiosPrivateInstance.get("/booking/booking-for-admin");
      return data;
    },
  });

  // Helper function to get booking status for a slot
  const getSlotBookingStatus = (slotId: string) => {
    const booking = bookingRequests.find(booking => booking.slotId === slotId);
    return booking?.status || null;
  };

  // Filter slots to show only current mentor's slots
  const mentorSlots = allSlots.filter(slot => {
    // If the API doesn't return mentorId, you might need to filter differently
    // For now, showing all slots - you may need to adjust this based on your API response
    return true; // This will show all slots - modify as needed
  });

  // Calculate booking status counts
  const pendingBookings = bookingRequests.filter(booking => booking.status === "Booked").length;
  const acknowledgedBookings = bookingRequests.filter(booking => booking.status === "Acknowledged").length;
  const cancelledBookings = bookingRequests.filter(booking => booking.status === "Cancelled").length;

  // Navigate to manage meetings page
  const handleManageMeetings = () => {
    router.push('/dashboard/manage-meeting');
  };

  // Load existing profile data
  useEffect(() => {
    if (profileData && !isDataLoaded) {
      console.log("Loading mentor profile data from API:", profileData);
      
      setName(profileData.name || '');
      setEmail(profileData.email || '');
      setSchool(profileData.school || '');
      setLinkedin(profileData.linkedin || '');
      setMeetingLink(profileData.meetingLink || '');
      
      // Handle languages
      if (profileData.languages) {
        if (typeof profileData.languages === 'string') {
          setLanguage(profileData.languages);
        } else if (Array.isArray(profileData.languages)) {
          setLanguage(profileData.languages.join(', '));
        }
      }
      
      // Handle expertise areas
      if (profileData.expertiseArea) {
        if (typeof profileData.expertiseArea === 'string') {
          setExpertiseAreas(profileData.expertiseArea);
        } else if (Array.isArray(profileData.expertiseArea)) {
          setExpertiseAreas(profileData.expertiseArea.join(', '));
        }
      }
      
      // Handle focus areas
      if (profileData.focusArea) {
        if (typeof profileData.focusArea === 'string') {
          setFocusAreas(profileData.focusArea);
        } else if (Array.isArray(profileData.focusArea)) {
          setFocusAreas(profileData.focusArea.join(', '));
        }
      }
      
      setNotableAchievement(profileData.education || ''); 
      setAbout(profileData.about || '');
      setAccess(profileData.profileStatus === 'Active' ? 'public' : 'hidden');
      
      // Set form as submitted and read-only since data exists
      setIsProfileSubmitted(true);
      setIsReadOnly(true);
      setIsDataLoaded(true);
    }
  }, [profileData, isDataLoaded]);

  // Handle profile save
  const handleSaveProfile = () => {
    const payload = {
      school,
      linkedin,
      meetingLink,
      languages: language.split(',').map(item => item.trim()).filter(item => item !== ''),
      education: notableAchievement,
      expertiseArea: expertiseAreas.split(',').map(item => item.trim()).filter(item => item !== ''),
      focusArea: focusAreas.split(',').map(item => item.trim()).filter(item => item !== ''),
      about,
      profileStatus: access === 'public' ? 'public' : 'private'
    };

    console.log("Final payload:", payload);
    updateProfile(payload);
    
    // Set form as submitted and read-only after saving
    setIsProfileSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditProfile = () => {
    setIsReadOnly(false);
  };

  // Add slot using backend API
  const addSlot = async () => {
    if (isReadOnly) return; // Prevent adding slots in readonly mode
    
    if (!slotTime) {
      alert('Please select a date and time');
      return;
    }

    try {
      // Calculate start and end times
      const startTime = new Date(slotTime).toISOString();
      const endTime = new Date(new Date(slotTime).getTime() + parseInt(slotDuration) * 60000).toISOString();

      // Create slot via API - backend generates the real UUID
      await createSlotMutation.mutateAsync({
        startTime,
        endTime
      });

      // Clear form and refetch slots
      setSlotTime('');
      setSlotDuration('30');
      refetchSlots();
      
    } catch (error) {
      console.error('Failed to create slot:', error);
      alert('Failed to create slot. Please try again.');
    }
  };

  // Updated: Remove slot using backend API - now allows deletion of both AVAILABLE and BOOKED slots
  const removeSlot = async (slotId: string, slotStatus: string) => {
    if (isReadOnly) return; // Prevent removing slots in readonly mode
    
    // Confirm deletion for booked slots
    if (slotStatus === 'BOOKED') {
      const confirmDelete = window.confirm(
        'This slot is already booked by a student. Deleting it will cancel their meeting. Are you sure you want to proceed?'
      );
      
      if (!confirmDelete) {
        return;
      }
    }

    try {
      await deleteSlotMutation.mutateAsync(slotId);
      refetchSlots();
    } catch (error) {
      console.error('Failed to delete slot:', error);
      alert('Failed to delete slot. Please try again.');
    }
  };

  // Updated: Format slot display to use the new API schema
  const formatSlotDisplay = (slot: TimeSlot) => {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    return {
      readableTime: start.toLocaleString(),
      duration: duration,
      status: slot.status
    };
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen flex-col bg-slate-50 font-sans overflow-x-hidden">
        <div className="flex flex-col grow h-full">
          <div className="flex flex-1 justify-center items-center">
            <div className="text-gray-500">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col bg-slate-50 font-sans overflow-x-hidden">
        <div className="flex flex-col grow h-full">
          <div className="flex flex-1 justify-center items-center">
            <div className="text-red-500">Error loading profile. Please try again.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 font-sans overflow-x-hidden">
      <div className="flex flex-col grow h-full">
        <div className="flex flex-1 justify-center px-6 py-10">
          <div className="flex flex-col w-full max-w-3xl gap-10">

            {/* NEW: Quick Actions & Status Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            </div>

            {/* Section 1: Mentor Profile */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Mentor Profile</h2>
                {isProfileSubmitted && isReadOnly && (
                  <button 
                    onClick={handleEditProfile}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* School and LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">School</label>
                  <input 
                    type="text" 
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    placeholder="e.g., Georgia Tech"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">LinkedIn Link</label>
                  <input 
                    type="url" 
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    placeholder="e.g., linkedin.com/in/iwright3"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Meeting Room Link */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Meeting Room Link (e.g., Zoom, Meet)</label>
                <input 
                  type="url" 
                  className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                  placeholder="https://zoom.us/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Language spoken</label>
                <input 
                  type="text" 
                  className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                  placeholder="e.g., English, French"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              {/* Expertise Areas */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Expertise Areas</label>
                <input 
                  type="text" 
                  className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                  placeholder="Structures, Materials, or Structural Dynamics"
                  value={expertiseAreas}
                  onChange={(e) => setExpertiseAreas(e.target.value)}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              {/* Focus Areas */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Focus Areas</label>
                <input 
                  type="text" 
                  className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                  placeholder="Advice related to maximizing success at GT"
                  value={focusAreas}
                  onChange={(e) => setFocusAreas(e.target.value)}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              {/* Notable Achievement */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Notable Achievement</label>
                <input 
                  type="text" 
                  className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                  placeholder="e.g., Ph.D., Aerospace Engineering, Georgia Institute of Technology, 2018"
                  value={notableAchievement}
                  onChange={(e) => setNotableAchievement(e.target.value)}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">About You</label>
                <textarea 
                  className={`w-full border border-gray-300 p-3 rounded h-32 ${isReadOnly ? 'bg-gray-100' : ''}`}
                  placeholder="Write a paragraph or two about yourself..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              {/* Access Settings */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Who can request an appointment?</label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="access" 
                      value="public" 
                      className="text-blue-600"
                      checked={access === 'public'}
                      onChange={(e) => setAccess(e.target.value)}
                      disabled={isReadOnly}
                    />
                    <span className={isReadOnly ? 'text-gray-500' : ''}>Anyone (Public)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="access" 
                      value="hidden" 
                      className="text-blue-600"
                      checked={access === 'hidden'}
                      onChange={(e) => setAccess(e.target.value)}
                      disabled={isReadOnly}
                    />
                    <span className={isReadOnly ? 'text-gray-500' : ''}>Hide my profile</span>
                  </label>
                </div>
              </div>

              {/* Save Profile */}
              {!isReadOnly && (
                <div className="text-right">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isUpdating}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: Availability - Updated to show booking status */}
            <div className="space-y-6 border-t border-gray-200 pt-8">
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-bold text-gray-800">Availability Setup</h2>
  </div>

  {!isReadOnly && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      {/* Date & Time */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Date & Time</label>
        <input 
          type="datetime-local" 
          className="w-full border border-gray-300 p-2 rounded" 
          value={slotTime}
          onChange={(e) => setSlotTime(e.target.value)}
        />
      </div>

      {/* Duration Dropdown */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Duration</label>
        <select 
          className="w-full border border-gray-300 p-2 rounded"
          value={slotDuration}
          onChange={(e) => setSlotDuration(e.target.value)}
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>
      </div>

      {/* Add Slot Button */}
      <button 
        onClick={addSlot}
        disabled={createSlotMutation.isPending}
        type="button" 
        className="bg-green-600 text-white px-4 py-2 rounded h-fit hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {createSlotMutation.isPending && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}
        {createSlotMutation.isPending ? 'Creating...' : '+ Add Slot'}
      </button>
    </div>
  )}

  {/* Display Added Slots - Exactly matching ambassador */}
  <div className="mt-4">
    {slotsLoading ? (
      <div className="text-center py-4 text-gray-500">Loading slots...</div>
    ) : mentorSlots.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>No time slots created yet.</p>
        {!isReadOnly && (
          <p className="text-sm mt-1">Add your first availability slot above.</p>
        )}
      </div>
    ) : (
      <ul className="space-y-2 text-sm text-gray-700">
        {mentorSlots.map((slot) => {
          const { readableTime, duration, status } = formatSlotDisplay(slot);
          const isBooked = status === 'BOOKED';
          const isCancelled = status === 'CANCELLED';
          
          return (
            <li key={slot.id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
              <div className="flex items-center gap-2">
                <div>
                  <span className="font-medium">{readableTime}</span>
                  <span className="text-gray-500 ml-2">— {duration} min</span>
                </div>
                
                {/* Status badges */}
                <div className="flex gap-1">
                  {isBooked && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Booked
                    </span>
                  )}
                  {isCancelled && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Cancelled
                    </span>
                  )}
                  {status === 'AVAILABLE' && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      Available
                    </span>
                  )}
                  
                  {/* Show booking status if slot is booked */}
                  {isBooked && (
                    <>
                     
                    </>
                  )}
                </div>
              </div>
              
              {/* Remove Button with booking confirmation - only show when not readonly */}
              {!isReadOnly && (
                <button 
                  onClick={() => removeSlot(slot.id, status)}
                  disabled={deleteSlotMutation.isPending}
                  className={`
                    hover:underline disabled:cursor-not-allowed text-sm
                    ${isBooked 
                      ? 'text-orange-600 hover:text-orange-800' 
                      : 'text-red-600 hover:text-red-800'
                    }
                    ${deleteSlotMutation.isPending ? 'text-gray-400' : ''}
                  `}
                  title={isBooked ? 'Cancel booked meeting (will notify student)' : 'Delete available slot'}
                >
                  {deleteSlotMutation.isPending 
                    ? 'Removing...' 
                    : isBooked 
                      ? 'Cancel Meeting' 
                      : 'Remove'
                  }
                </button>
              )}
            </li>
          );
        })}
      </ul>
    )}
  </div>

  {/* Updated Info about slots */}
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
    <p><strong>Note:</strong> These time slots will be visible to students on your mentor profile page. Students can book available slots for mentorship sessions.</p>
    {!isReadOnly && (
      <p className="mt-2"><strong>Important:</strong> Booked slots show "Pending Action" - students have requested these times and need your approval through the Manage Meetings page.</p>
    )}
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};
