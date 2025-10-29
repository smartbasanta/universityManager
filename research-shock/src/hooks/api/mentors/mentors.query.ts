import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import {
  mentorsAPIService,
  CreateSlotRequest,
  CreateBookingRequest,
  SlotResponse,
} from "./mentors.api";
import { toast } from "react-toastify";

// ------------------ ACCOUNT / INVITE HOOKS ------------------

export function useActivateAccount(): UseMutationResult<any, any, { token: string; password: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mentorsAPIService.activateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors", "all"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      toast.success("Account activated successfully! Welcome to the mentorship program.");
    },
    onError: (err: any) => {
      console.error("Activation error:", err);
      const msg = err?.response?.data?.message;
      if (msg) {
        if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
        else toast.error(msg);
      } else if (err?.response?.status) {
        const statusMap: Record<number, string> = {
          400: "Invalid request. Please check your password.",
          401: "Invalid or expired activation token.",
          403: "Access denied. Token may have expired.",
          404: "Activation endpoint not found.",
          422: "Invalid token or password format.",
          500: "Server error. Please try again later.",
        };
        toast.error(statusMap[err.response.status] || `Error ${err.response.status}: Please try again.`);
      } else if (err?.message) {
        toast.error(`Network error: ${err.message}`);
      } else {
        toast.error("Failed to activate account. Please contact support.");
      }
    },
  });
}

export function useSendInvitation(): UseMutationResult<any, any, { name: string; email: string; departmentId: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mentorsAPIService.sendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors", "all"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      toast.success("Invitation sent successfully");
    },
    onError: (err: any) => {
      console.error("Send invitation error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else toast.error(msg || err.message || "Failed to send invitation");
    },
  });
}

// ------------------ MENTOR / DEPT HOOKS ------------------

export function useGetAllMentors(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["mentors", "all"],
    queryFn: mentorsAPIService.getAllMentors,
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
    staleTime: 0,
  });
}

export function useGetDepartments(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["departments"],
    queryFn: mentorsAPIService.getDepartments,
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetMentorProfile(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["mentor", "profile"],
    queryFn: mentorsAPIService.getProfile,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateMentorProfile(): UseMutationResult<any, any, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mentorsAPIService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["mentors", "all"] });
      toast.success("Mentor profile updated successfully!");
    },
    onError: (err: any) => {
      console.error("Update profile error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else toast.error(msg || "Failed to update mentor profile.");
    },
  });
}

// ------------------ SLOT HOOKS ------------------

export function useCreateSlot(): UseMutationResult<SlotResponse, any, CreateSlotRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mentorsAPIService.createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["slots", "user"] });
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
      toast.success("Time slot created successfully!");
    },
    onError: (err: any) => {
      console.error("Create slot error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else toast.error(msg || "Failed to create time slot.");
    },
  });
}

export function useGetAllSlots(): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["slots"],
    queryFn: mentorsAPIService.getAllSlots,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// Updated to match ambassador pattern for mentor slots
export function useGetAllMentorSlots(): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["mentor-slots"],
    queryFn: mentorsAPIService.getAllSlots,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDeleteSlot(): UseMutationResult<void, any, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mentorsAPIService.deleteSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["slots", "user"] });
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
      toast.success("Time slot deleted successfully!");
    },
    onError: (err: any) => {
      console.error("Delete slot error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else toast.error(msg || "Failed to delete time slot.");
    },
  });
}

// ------------------ BOOKING HOOKS ------------------

export function useCreateBooking(): UseMutationResult<any, any, CreateBookingRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mentorsAPIService.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "student"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
      toast.success("Booking request submitted successfully! Awaiting approval.");
    },
    onError: (err: any) => {
      console.error("Create booking error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else if (err?.response?.status === 409) {
        toast.error("This time slot is no longer available. Please select another slot.");
      } else {
        toast.error(msg || "Failed to submit booking request.");
      }
    },
  });
}

export function useGetStudentBookings(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["bookings", "student"],
    queryFn: mentorsAPIService.getStudentBookings,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetAdminBookings(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["bookings", "admin"],
    queryFn: mentorsAPIService.getAdminBookings,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// Updated to match the query key used in manage-meeting page
export function useGetMentorAdminBookings(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["admin-bookings"],
    queryFn: mentorsAPIService.getAdminBookings,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// ------------------ USER SLOTS HOOKS ------------------

// Mentor fetching their own slots (no params needed)
export function useGetMentorSlots(): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["slots", "user"],
    queryFn: () => mentorsAPIService.getMentorSlots(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// Student fetching a specific mentor's AVAILABLE slots
export function useGetMentorAvailableSlots(mentorId: string): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["slots", "available", mentorId],
    queryFn: () => mentorsAPIService.getMentorAvailableSlots(mentorId),
    enabled: Boolean(mentorId),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// General hook to fetch any user's slots (requires userId + role)
export function useGetUserSlots(
  userId: string,
  role: "mentor"
): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["user-slots", userId, role],
    queryFn: () => mentorsAPIService.getUserSlots(userId, role),
    enabled: Boolean(userId && role),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// ------------------ BOOKING STATUS MANAGEMENT HOOKS ------------------

export const useChangeMentorBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: 'Acknowledged' | 'Booked' | 'Cancelled' }) => 
      mentorsAPIService.changeBookingStatus(bookingId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-slots'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      
      // Show success toast based on action
      if (variables.status === "Acknowledged") {
        toast.success("Meeting request accepted and acknowledged successfully!");
      } else if (variables.status === "Cancelled") {
        toast.success("Meeting request rejected successfully!");
      }
    },
    onError: (error) => {
      console.error('Status change failed:', error);
      toast.error("Failed to update meeting status. Please try again.");
    }
  });
};
