import { axiosPrivateInstance } from "@/api/axois-config";

const ambassadorsAPIRoutes = {
  activateAccount: "/student-ambassador/acctivate-my-account", 
  sendInvitation: "/student-ambassador/create",
  getAllAmbassadors: "/student-ambassador/all-ambassadors",
  getDepartments: "/departments",
  completeProfile: "/student-ambassador/complete-profile",
  getCompleteProfile: "/student-ambassador/get-my-profile",
  
  // Booking-related routes (same as mentors)
  createSlot: "/booking/create-slot",
  getAllSlots: "/booking/slot",
  deleteSlot: "/booking/slot",
  getUserSlots: "/booking/slot/user",
  createBooking: "/booking/create-booking",
  getStudentBookings: "/booking/booking-for-student",
  getAdminBookings: "/booking/booking-for-admin",
  changeBookingStatus: "/booking/change-status",
};

// TypeScript interfaces for booking requests/responses (same as mentors)
export interface CreateSlotRequest {
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
}

// Update CreateBookingRequest interface
export interface CreateBookingRequest {
  slotId: string;
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
  status?: 'Acknowledged' | 'Booked' | 'Cancelled'; // Added status field
}

// Updated SlotResponse to match the API schema
export interface SlotResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED" | "CANCELLED";
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

export const ambassadorsAPIService = {
  activateAccount: async (activationData: { token: string; password: string }) => {
    console.log("Sending activation request to:", ambassadorsAPIRoutes.activateAccount);
    console.log("Payload:", activationData);
    
    const response = await axiosPrivateInstance.post(ambassadorsAPIRoutes.activateAccount, activationData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  sendInvitation: async (invitationData: { name: string; email: string; departmentId: string }) => {
    const response = await axiosPrivateInstance.post(ambassadorsAPIRoutes.sendInvitation, invitationData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  getAllAmbassadors: async () => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getAllAmbassadors);
    return response.data;
  },

  getDepartments: async () => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getDepartments);
    return response.data;
  },

  // Get ambassador profile for dashboard
  getProfile: async () => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getCompleteProfile, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // Update ambassador profile
  updateProfile: async (profileData: any) => {
    const response = await axiosPrivateInstance.patch(ambassadorsAPIRoutes.completeProfile, profileData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // === BOOKING API METHODS ===

  // Create a new time slot
  createSlot: async (slotData: CreateSlotRequest): Promise<SlotResponse> => {
    const response = await axiosPrivateInstance.post(ambassadorsAPIRoutes.createSlot, slotData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // Get all available slots
  getAllSlots: async (): Promise<SlotResponse[]> => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getAllSlots);
    return response.data;
  },

  // Delete a specific slot
  deleteSlot: async (slotId: string): Promise<void> => {
    const response = await axiosPrivateInstance.delete(`${ambassadorsAPIRoutes.deleteSlot}/${slotId}`);
    return response.data;
  },

  // Get slots by user ID - Updated to accept userId and role parameters (role=student_ambassador)
  getUserSlots: async (userId: string, role: string = "student_ambassador"): Promise<SlotResponse[]> => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getUserSlots, {
      params: {
        userId,
        role
      }
    });
    return response.data;
  },

  // Alternative method to get ambassador's own slots
  getAmbassadorSlots: async (): Promise<SlotResponse[]> => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getUserSlots, {
      params: {
        role: "student_ambassador"
      }
    });
    return response.data;
  },

  // Get available slots for a specific ambassador (for students to book)
  getAmbassadorAvailableSlots: async (ambassadorId: string): Promise<SlotResponse[]> => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getUserSlots, {
      params: {
        userId: ambassadorId,
        role: "student_ambassador"
      }
    });
    // Filter only available slots
    return response.data.filter((slot: SlotResponse) => slot.status === "AVAILABLE");
  },

  // Create a new booking (for the apply page)
  createBooking: async (bookingData: CreateBookingRequest): Promise<BookingResponse> => {
    const response = await axiosPrivateInstance.post(ambassadorsAPIRoutes.createBooking, bookingData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // Get bookings for student
  getStudentBookings: async (): Promise<BookingResponse[]> => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getStudentBookings);
    return response.data;
  },

  // Get bookings for admin
  getAdminBookings: async (): Promise<BookingResponse[]> => {
    const response = await axiosPrivateInstance.get(ambassadorsAPIRoutes.getAdminBookings);
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
