import { axiosPrivateInstance } from "@/api/axois-config";

const mentorsAPIRoutes = {
  activateAccount: "/mentor/acctivate-my-account", 
  sendInvitation: "/mentor/create",
  getAllMentors: "/mentor/all-mentors",
  getDepartments: "/departments",
  getProfile: "/mentor/get-my-profile",
  completeProfile: "/mentor/complete-profile",
  
  // Booking-related routes
  createSlot: "/booking/create-slot",
  getAllSlots: "/booking/slot",
  deleteSlot: "/booking/slot", // Base route - ID will be appended
  getUserSlots: "/booking/slot/user",
  createBooking: "/booking/create-booking",
  getStudentBookings: "/booking/booking-for-student",
  getAdminBookings: "/booking/booking-for-admin",
  changeBookingStatus: "/booking/change-status",
};

// TypeScript interfaces for booking requests/responses
export interface CreateSlotRequest {
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
}

export interface CreateBookingRequest {
  slotId: string;
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
  status?: 'Acknowledged' | 'Booked' | 'Cancelled';
}

// Updated SlotResponse to match the API schema you provided
export interface SlotResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED" | "CANCELLED"; // Based on your schema
}

export interface BookingResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  slotId: string;
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
  attended: boolean;
  status: 'Acknowledged' | 'Booked' | 'Cancelled'; // Added Pending
}

export const mentorsAPIService = {
  activateAccount: async (activationData: { token: string; password: string }) => {
    console.log("Sending activation request to:", mentorsAPIRoutes.activateAccount);
    console.log("Payload:", activationData);
    
    const response = await axiosPrivateInstance.post(mentorsAPIRoutes.activateAccount, activationData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  sendInvitation: async (invitationData: { name: string; email: string; departmentId: string }) => {
    const response = await axiosPrivateInstance.post(mentorsAPIRoutes.sendInvitation, invitationData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  getAllMentors: async () => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getAllMentors);
    return response.data;
  },

  getDepartments: async () => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getDepartments);
    return response.data;
  },

  // Get mentor profile for dashboard
  getProfile: async () => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getProfile, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // Update mentor profile
  updateProfile: async (profileData: any) => {
    const response = await axiosPrivateInstance.patch(mentorsAPIRoutes.completeProfile, profileData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // === BOOKING API METHODS ===

  // Create a new time slot
  createSlot: async (slotData: CreateSlotRequest): Promise<SlotResponse> => {
    const response = await axiosPrivateInstance.post(mentorsAPIRoutes.createSlot, slotData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // Get all available slots
  getAllSlots: async (): Promise<SlotResponse[]> => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getAllSlots);
    return response.data;
  },

  // Delete a specific slot - CORRECTED to use proper endpoint structure
  deleteSlot: async (slotId: string): Promise<void> => {
    const response = await axiosPrivateInstance.delete(`${mentorsAPIRoutes.deleteSlot}/${slotId}`);
    return response.data;
  },

  // Get slots by user ID - Updated to accept userId and role parameters
  getUserSlots: async (userId: string, role: string = "mentor"): Promise<SlotResponse[]> => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getUserSlots, {
      params: {
        userId,
        role
      }
    });
    return response.data;
  },

  // Alternative method to get mentor's own slots (if the API supports it without explicit params)
  getMentorSlots: async (): Promise<SlotResponse[]> => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getUserSlots, {
      params: {
        role: "mentor"
      }
    });
    return response.data;
  },

  // Get available slots for a specific mentor (for students to book)
  getMentorAvailableSlots: async (mentorId: string): Promise<SlotResponse[]> => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getUserSlots, {
      params: {
        userId: mentorId,
        role: "mentor"
      }
    });
    // Filter only available slots
    return response.data.filter((slot: SlotResponse) => slot.status === "AVAILABLE");
  },

  // Create a new booking (for the apply page)
  createBooking: async (bookingData: CreateBookingRequest): Promise<BookingResponse> => {
    const response = await axiosPrivateInstance.post(mentorsAPIRoutes.createBooking, bookingData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // Get bookings for student
  getStudentBookings: async (): Promise<BookingResponse[]> => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getStudentBookings);
    return response.data;
  },

  // Get bookings for admin
 getAdminBookings: async (): Promise<BookingResponse[]> => {
    const response = await axiosPrivateInstance.get(mentorsAPIRoutes.getAdminBookings);
    return response.data;
  },
    changeBookingStatus: async (bookingId: string, status: 'Pending' | 'Acknowledged' | 'Booked' | 'Cancelled'): Promise<void> => {
    const response = await axiosPrivateInstance.patch(`/booking/change-status/${bookingId}`, {
      status
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },
};
