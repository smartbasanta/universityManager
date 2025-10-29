// For mentor list view (minimal data)
export interface MentorListItem {
  id: string;
  name: string;
  company: string;
  position: string;
  university: string;
  image: string;
  hasAvailableSlots?: boolean; // Added for availability indicator
}

// For single mentor detailed view (matches API response)
export interface Mentor {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  photo: string | null;
  status: string;
  university: {
    id: string;
    createdAt: string;
    updatedAt: string;
    university_name: string;
    banner: string | null;
    logo: string | null;
    address: string | null;
    website: string | null;
    status: string;
    country: string;
    description: string | null;
  };
  department: {
    id: string;
    createdAt: string;
    updatedAt: string;
    dept_name: string;
  };
  school: string;
  linkedin: string;
  meetingLink: string;
  languages: string[];
  education: string;
  expertiseArea: string[];
  focusArea: string[];
  about: string;
  profileStatus: string;
  
  // Computed fields for display compatibility
  image?: string;
  departmentName?: string;
  universityName?: string;
  company?: string;
  position?: string;
}

// Updated SlotResponse interface to match exact API schema
export interface SlotResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED'; // Updated to match API schema
}

// Time slot interface for booking system - Updated to match SlotResponse
export interface TimeSlot extends SlotResponse {
  mentorId?: string; // Optional for backward compatibility
}

// For UI display (transformed from API data)
export interface MentorDisplayData {
  id: string;
  name: string;
  linkedin: string;
  university: string;
  position: string;
  company: string;
  educationLevel: string;
  image: string;
  bio: string;
  languages: string[];
  expertiseAreas: string[];
  focusAreas: string[];
  availableSlots: SlotResponse[]; // Updated to use SlotResponse
}

// Booking-related interfaces
export interface CreateSlotRequest {
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
}

export interface CreateBookingRequest {
  slotId: string;
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
}

export interface BookingResponse {
  id: string;
  slotId: string;
  studentId: string;
  mentorId: string;
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'; // Updated to match typical API patterns
  createdAt: string;
  updatedAt: string;
}

// API Query Parameters
export interface MentorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  university?: string;
}

// API Filter Request (for POST endpoint)
export interface MentorFilterRequest {
  focused_area: string;
  language: string;
  university: string;
  name: string;
}

// Slot query parameters for getUserSlots API
export interface SlotQueryParams {
  userId: string;
  role: 'mentor';
}

// API Response structure
export interface MentorResponse {
  data: Mentor[];
  total?: number;
  page?: number;
  limit?: number;
}

// Department interface
export interface Department {
  id: string;
  createdAt: string;
  updatedAt: string;
  dept_name: string;
}

// University interface
export interface University {
  id: string;
  createdAt: string;
  updatedAt: string;
  university_name: string;
  banner: string | null;
  logo: string | null;
  address: string | null;
  website: string | null;
  status: string;
  country: string;
  description: string | null;
}

// Filter option interface
export interface FilterOption {
  label: string;
  value: string;
}

// Calendar and time slot related interfaces - Updated to use SlotResponse
export interface AvailabilityCalendarProps {
  availability: SlotResponse[];
  onDaySelect: (date: string, slots: SlotResponse[]) => void;
  monthYear?: string;
}

export interface TimeSlotsProps {
  selectedDate: string | null;
  timeSlots: SlotResponse[];
  onSlotSelect: (slot: SlotResponse) => void;
  selectedSlot?: SlotResponse | null;
  title?: string;
}

// Helper type for data transformation - Updated to use SlotResponse
export type MentorTransformer = (apiData: Mentor, availableSlots?: SlotResponse[]) => MentorDisplayData;

// Booking form data interface - Simplified to only include fields needed for API
export interface BookingFormData {
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
}

// Extended booking form for UI (includes additional user fields)
export interface ExtendedBookingFormData extends BookingFormData {
  name: string;
  email: string;
  university: string;
  yearOfStudy: string;
  major: string;
}

// Breadcrumb interface
export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbProps {
  basePath?: string;
  baseLabel?: string;
  currentName?: string;
  items?: BreadcrumbItem[];
  showHome?: boolean;
  separator?: string;
}

// Mentor Dashboard specific interfaces - Updated to use SlotResponse
export interface MentorDashboardSlot extends SlotResponse {
  isBooked?: boolean; // For backward compatibility in dashboard - computed from status
}

// API Hook interfaces - Updated to use SlotResponse
export interface UseGetSlotsResult {
  data: SlotResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseCreateSlotResult {
  mutateAsync: (data: CreateSlotRequest) => Promise<SlotResponse>;
  isPending: boolean;
  error: Error | null;
}

export interface UseDeleteSlotResult {
  mutateAsync: (slotId: string) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

// Additional interfaces for the mentor booking flow
export interface MentorBookingPageProps {
  mentorId: string;
  mentor: Mentor;
}

export interface BookingApplyPageProps {
  slotId: string;
  mentorId: string;
  slot: SlotResponse;
}

// Hook interfaces for mentor availability
export interface UseGetMentorAvailableSlotsResult {
  data: SlotResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseGetUserSlotsResult {
  data: SlotResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Navigation and routing interfaces
export interface MentorBookingRouteParams {
  id: string; // mentor ID
  slotId?: string; // for apply page
}

// Utility type for slot status checking
export type SlotStatus = SlotResponse['status'];
export const SLOT_STATUS = {
  AVAILABLE: 'AVAILABLE' as const,
  BOOKED: 'BOOKED' as const,
  CANCELLED: 'CANCELLED' as const,
} as const;

// Helper functions type definitions
export interface SlotHelpers {
  isSlotAvailable: (slot: SlotResponse) => boolean;
  isSlotBooked: (slot: SlotResponse) => boolean;
  isSlotCancelled: (slot: SlotResponse) => boolean;
  formatSlotTime: (slot: SlotResponse) => string;
  getSlotDuration: (slot: SlotResponse) => number; // in minutes
}
