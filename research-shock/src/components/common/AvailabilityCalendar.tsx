'use client';

import { useState } from 'react';

interface TimeSlot {
  id: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  isBooked?: boolean;
}

interface AvailabilityCalendarProps {
  availability: TimeSlot[];
  onDaySelect: (date: string, slots: TimeSlot[]) => void;
  monthYear?: string;
}

export const AvailabilityCalendar = ({ 
  availability, 
  onDaySelect, 
  monthYear 
}: AvailabilityCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Group slots by date
  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const grouped: Record<string, TimeSlot[]> = {};
    
    slots.forEach(slot => {
      const date = new Date(slot.startTime).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    
    return grouped;
  };

  const slotsByDate = groupSlotsByDate(availability);

  // Get calendar days for current viewing month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDatePointer = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 rows × 7 days
      days.push(new Date(currentDatePointer));
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }
    
    return { days, currentMonth: month, currentYear: year };
  };

  const handleDayClick = (date: Date) => {
    // Allow selection of any future date, not just ones with existing slots
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return; // Don't allow past dates
    
    const dateString = date.toISOString().split('T')[0];
    const slotsForDate = slotsByDate[dateString] || [];
    
    setSelectedDate(dateString);
    onDaySelect(dateString, slotsForDate);
  };

  const getDayClass = (date: Date, currentMonth: number) => {
    const dateString = date.toISOString().split('T')[0];
    const hasSlots = slotsByDate[dateString] && slotsByDate[dateString].length > 0;
    const isSelected = selectedDate === dateString;
    const isCurrentMonth = date.getMonth() === currentMonth;
    const isToday = dateString === new Date().toISOString().split('T')[0];
    const isPast = date < new Date();
    
    let classes = 'w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors ';
    
    if (!isCurrentMonth) {
      classes += 'text-gray-300 ';
    } else if (isPast) {
      classes += 'text-gray-300 cursor-not-allowed ';
    } else if (isSelected) {
      classes += 'bg-[#3f7fbf] text-white cursor-pointer hover:bg-[#2d5a87] ';
    } else if (hasSlots) {
      classes += 'bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 ';
    } else {
      // Available for selection even without existing slots
      classes += 'text-[#101418] cursor-pointer hover:bg-gray-100 border border-gray-200 ';
    }
    
    if (isToday && isCurrentMonth && !isPast) {
      classes += 'ring-2 ring-[#3f7fbf] ring-opacity-50 ';
    }
    
    return classes;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const { days, currentMonth, currentYear } = getCalendarDays();
  const monthYearDisplay = monthYear || currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full md:w-1/2">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl md:text-2xl font-semibold text-[#101418]">
          {monthYearDisplay}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 text-center font-medium text-[#5c738a] mb-2 text-sm md:text-base">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
        {days.map((date, index) => {
          const dateString = date.toISOString().split('T')[0];
          const hasAvailability = slotsByDate[dateString] && slotsByDate[dateString].length > 0;
          const isPast = date < new Date();
          const isCurrentMonth = date.getMonth() === currentMonth;
          
          return (
            <button
              key={index}
              onClick={() => !isPast && isCurrentMonth && handleDayClick(date)}
              className={getDayClass(date, currentMonth)}
              disabled={isPast || !isCurrentMonth}
              title={
                isPast ? 'Past date' :
                hasAvailability ? `${slotsByDate[dateString]?.length} slots available` : 
                'Available for booking'
              }
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#5c738a]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
          <span>Has slots</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#3f7fbf] rounded-full"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border border-gray-200 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <span>Past/Unavailable</span>
        </div>
      </div>
    </div>
  );
};
