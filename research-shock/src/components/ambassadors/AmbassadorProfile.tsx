'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb, AvailabilityCalendar, TimeSlots } from '@/components/common';
import { useGetAmbassadorAvailableSlots } from '@/hooks/api/ambassadors/ambassadors.query';
import type { SlotResponse } from '@/hooks/api/ambassadors/ambassadors.api';

interface AmbassadorProfileProps {
  id: string;
  name: string;
  email?: string;
  linkedin: string;
  university: string;
  major: string;
  level: string;
  image: string;
  bio: string;
  languages: string[];
  expertiseAreas: string[];
  focusAreas: string[];
}

export const AmbassadorProfile = ({
  id,
  name,
  email,
  linkedin,
  university,
  major,
  level,
  image,
  bio,
  languages,
  expertiseAreas,
  focusAreas,
}: AmbassadorProfileProps) => {
  const router = useRouter();

  // Fetch ambassador's available slots using the hook
  const { 
    data: availableSlots = [], 
    isLoading: slotsLoading, 
    error: slotsError,
    refetch: refetchSlots
  } = useGetAmbassadorAvailableSlots(id);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotsForDate, setSlotsForDate] = useState<SlotResponse[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);

  // Refetch slots when component mounts to ensure fresh data
  useEffect(() => {
    refetchSlots();
  }, [refetchSlots]);

  const handleDaySelect = (date: string, slots: SlotResponse[]) => {
    setSelectedDate(date);
    setSlotsForDate(slots);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: SlotResponse) => {
    setSelectedSlot(slot);
  };

  // Navigate to apply page with existing slot ID
  const handleBookMeeting = () => {
    if (!selectedDate || !selectedSlot) return;

    // Use the existing slot ID created by the ambassador
    const searchParams = new URLSearchParams({
      slotId: selectedSlot.id,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime
    });

    router.push(`/ambassadors/${id}/apply?${searchParams.toString()}`);
  };

  const formatLinkedInUrl = (url: string) => {
    if (!url || url === 'No LinkedIn available') return null;
    if (url.startsWith('http')) return url;
    return url.startsWith('linkedin.com')
      ? `https://${url}`
      : `https://linkedin.com/in/${url}`;
  };

  const safeArray = (arr?: string[], fallback = 'None listed') =>
    !arr || arr.length === 0 || (arr.length === 1 && arr[0].includes('No '))
      ? [fallback]
      : arr;

  return (
    <div className="px-4 sm:px-8 md:px-20 lg:px-40 flex justify-center py-5">
      <div className="layout-content-container w-full max-w-[960px] flex flex-col">
        <Breadcrumb basePath="/ambassadors" baseLabel="Ambassadors" currentName={name} />

        {/* Profile Header */}
        <div className="flex p-4 gap-4 flex-col sm:flex-row items-center sm:items-start">
          <div
            className="bg-center bg-cover rounded-full aspect-square min-h-32 w-32"
            style={{ backgroundImage: `url("${image}")` }}
          />
          <div className="text-center sm:text-left space-y-1">
            <p className="text-xl md:text-[22px] font-bold text-[#101418]">{name}</p>
            <p className="text-[#5c738a]">{major} ({level}) student</p>
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-[#2b6cb0] hover:underline text-sm block"
              >
                {email}
              </a>
            )}
            {formatLinkedInUrl(linkedin) && (
              <a
                href={formatLinkedInUrl(linkedin)!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2b6cb0] hover:underline text-sm block"
              >
                {linkedin}
              </a>
            )}
            <p className="text-[#5c738a]">Student at {university}</p>
          </div>
        </div>

        {/* Bio */}
        <section className="px-4 pb-3">
          <p className="text-[#101418]">{bio || 'No bio available'}</p>
        </section>

        {/* Languages, Expertise, Focus Areas */}
        {[
          { title: 'Languages', data: safeArray(languages) },
          { title: 'Expertise Areas', data: safeArray(expertiseAreas, 'No expertise areas listed') },
          { title: 'Focus Areas', data: safeArray(focusAreas, 'No focus areas listed') }
        ].map(({ title, data }) => (
          <section key={title} className="px-4 pt-5 pb-3">
            <h2 className="text-xl md:text-[22px] font-bold text-[#101418] mb-2">{title}</h2>
            {title === 'Languages' ? (
              <div className="flex flex-wrap gap-2">
                {data.map((lang) => (
                  <span
                    key={lang}
                    className="inline-block bg-[#e4ecf7] text-[#1a2e55] text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-[#101418]">
                {data.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* Availability */}
        <section className="px-4 pt-5">
          <h2 className="text-xl md:text-[22px] font-bold text-[#101418] mb-3">
            Availability
          </h2>
          
          {/* Loading state */}
          {slotsLoading && (
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <p className="text-gray-500 mt-4">Loading availability...</p>
            </div>
          )}

          {/* Error state */}
          {slotsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800">
                Failed to load availability. Please try refreshing the page.
              </p>
              <button 
                onClick={() => refetchSlots()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Availability content */}
          {!slotsLoading && !slotsError && (
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-6">
              <AvailabilityCalendar
                availability={availableSlots}
                onDaySelect={handleDaySelect}
              />
              <TimeSlots
                selectedDate={selectedDate}
                timeSlots={slotsForDate}
                onSlotSelect={handleSlotSelect}
                selectedSlot={selectedSlot}
              />
            </div>
          )}
        </section>

        {/* Book Button */}
        {!slotsLoading && !slotsError && (
          <div className="flex justify-end px-4 py-4">
            <button
              onClick={handleBookMeeting}
              disabled={!selectedDate || !selectedSlot}
              className={`h-10 px-4 rounded-full text-sm font-bold transition-colors
                ${selectedDate && selectedSlot
                  ? 'bg-[#3f7fbf] text-white hover:bg-[#2d5a87]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Book a meeting
            </button>
          </div>
        )}

        {/* Helper text - No slots available */}
        {!slotsLoading && !slotsError && availableSlots.length === 0 && (
          <div className="px-4 pb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">
                This ambassador hasn't created any available time slots yet.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
