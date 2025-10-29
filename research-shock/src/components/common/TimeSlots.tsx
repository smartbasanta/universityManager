'use client';

import type { SlotResponse } from '@/hooks/api/mentors/mentors.api';

interface TimeSlotsProps {
  selectedDate: string | null;
  timeSlots: SlotResponse[];
  onSlotSelect: (slot: SlotResponse) => void;
  selectedSlot?: SlotResponse | null;
  title?: string;
}

export const TimeSlots = ({ 
  selectedDate, 
  timeSlots, 
  onSlotSelect,
  selectedSlot = null,
  title = "Available Time Slots" 
}: TimeSlotsProps) => {
  
  const formatTimeRange = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    return `${diffMins} min`;
  };

  // Filter out only available slots (extra safety check)
  const availableSlots = timeSlots.filter(slot => slot.status === 'AVAILABLE');

  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#101418]">{title}</h2>
      
      {selectedDate && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium">
            {formatSelectedDate(selectedDate)}
          </p>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        {selectedDate === null ? (
          <p className="text-[#5c738a] text-center py-8">Select a day to view available time slots.</p>
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#5c738a] mb-4">No available slots for this day.</p>
            <p className="text-sm text-[#5c738a]">
              The mentor hasn't created any time slots for this date yet.
            </p>
          </div>
        ) : (
          availableSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSlotSelect(slot)}
              className={`
                border rounded-lg p-4 transition-colors text-left 
                focus:outline-none focus:ring-2 focus:ring-[#3f7fbf]
                ${selectedSlot?.id === slot.id 
                  ? 'bg-[#3f7fbf] text-white border-[#3f7fbf]' 
                  : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300 text-[#101418]'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {formatTimeRange(slot.startTime, slot.endTime)}
                  </div>
                  <div className="text-sm opacity-75">
                    Duration: {getDuration(slot.startTime, slot.endTime)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Available
                  </span>
                  {selectedSlot?.id === slot.id && (
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      
      {availableSlots.length > 0 && !selectedSlot && (
        <p className="text-sm text-[#5c738a] mt-4 text-center">
          Select a time slot to continue with booking
        </p>
      )}

    </div>
  );
};
