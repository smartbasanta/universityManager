// For ambassador list view (minimal data)
export interface AmbassadorListItem {
  id: string;
  name: string;
  university: string;
  major: string;
  image: string;
  hasAvailableSlots?: boolean; // Added for availability indicator
}

// For single ambassador detailed view (matches API response)
export interface Ambassador {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  photo: string | null;
  status: string;
  department: {
    id: string;
    createdAt: string;
    updatedAt: string;
    dept_name: string;
  };
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
  auth: {
    email: string;
  };
  school: string;
  linkedin: string;
  meetingLink: string;
  languages: string[];
  education: string; // 'grad' | 'undergrad'
  expertiseArea: string[];
  focusArea: string[];
  about: string;
  profileStatus: string;
  
  // Computed fields for display compatibility
  image?: string;
  departmentName?: string;
  universityName?: string;
  major?: string;
}

// Updated SlotResponse interface to match API schema
export interface SlotResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
}

// Time slot interface for booking system - Updated to match SlotResponse
export interface TimeSlot extends SlotResponse {
  ambassadorId?: string; // Optional for backward compatibility
}

// For UI display (transformed from API data)
export interface AmbassadorDisplayData {
  id: string;
  name: string;
  email: string;
  linkedin: string;
  university: string;
  major: string;
  level: string; // 'Grad' | 'Undergrad'
  image: string;
  bio: string;
  languages: string[];
  expertiseAreas: string[];
  focusAreas: string[];
  availableSlots: SlotResponse[]; // Updated to use SlotResponse instead of static availability
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
  ambassadorId: string;
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// API Query Parameters
export interface AmbassadorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  university?: string;
}

// API Filter Request (for POST endpoint)
export interface AmbassadorFilterRequest {
  focused_area: string;
  language: string;
  university: string;
  name: string;
}

// Slot query parameters for getUserSlots API
export interface AmbassadorSlotQueryParams {
  userId: string;
  role: 'student_ambassador';
}

// API Response structure
export interface AmbassadorResponse {
  data: Ambassador[];
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
export type AmbassadorTransformer = (apiData: Ambassador, availableSlots?: SlotResponse[]) => AmbassadorDisplayData;

// Booking form data interface
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

// Ambassador Dashboard specific interfaces
export interface AmbassadorDashboardSlot extends SlotResponse {
  isBooked?: boolean; // For backward compatibility in dashboard - computed from status
}

// API Hook interfaces - Updated to use SlotResponse
export interface UseGetAmbassadorSlotsResult {
  data: SlotResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseCreateAmbassadorSlotResult {
  mutateAsync: (data: CreateSlotRequest) => Promise<SlotResponse>;
  isPending: boolean;
  error: Error | null;
}

export interface UseDeleteAmbassadorSlotResult {
  mutateAsync: (slotId: string) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

// Additional interfaces for the ambassador booking flow
export interface AmbassadorBookingPageProps {
  ambassadorId: string;
  ambassador: Ambassador;
}

export interface AmbassadorBookingApplyPageProps {
  slotId: string;
  ambassadorId: string;
  slot: SlotResponse;
}

// Hook interfaces for ambassador availability
export interface UseGetAmbassadorAvailableSlotsResult {
  data: SlotResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseGetAmbassadorUserSlotsResult {
  data: SlotResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Navigation and routing interfaces
export interface AmbassadorBookingRouteParams {
  id: string; // ambassador ID
  slotId?: string; // for apply page
}

// Utility type for slot status checking
export type AmbassadorSlotStatus = SlotResponse['status'];
export const AMBASSADOR_SLOT_STATUS = {
  AVAILABLE: 'AVAILABLE' as const,
  BOOKED: 'BOOKED' as const,
  CANCELLED: 'CANCELLED' as const,
} as const;

// Helper functions type definitions
export interface AmbassadorSlotHelpers {
  isSlotAvailable: (slot: SlotResponse) => boolean;
  isSlotBooked: (slot: SlotResponse) => boolean;
  isSlotCancelled: (slot: SlotResponse) => boolean;
  formatSlotTime: (slot: SlotResponse) => string;
  getSlotDuration: (slot: SlotResponse) => number; // in minutes
}
