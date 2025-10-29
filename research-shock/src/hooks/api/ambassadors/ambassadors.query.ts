import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import {
  ambassadorsAPIService,
  CreateSlotRequest,
  CreateBookingRequest,
  SlotResponse,
} from "./ambassadors.api";
import { toast } from "react-toastify";

// ------------------ ACCOUNT / INVITE HOOKS ------------------

export function useActivateAmbassadorAccount(): UseMutationResult<any, any, { token: string; password: string }> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ambassadorsAPIService.activateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambassadors", "all"] });
      queryClient.invalidateQueries({ queryKey: ["ambassadors"] });
      toast.success("Ambassador account activated successfully! Welcome to the program.");
    },
    onError: (err: any) => {
      console.error("Ambassador account activation error:", err);
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
        toast.error("Failed to activate ambassador account. Please contact support.");
      }
    },
  });
}

export function useSendAmbassadorInvitation(): UseMutationResult<any, any, { name: string; email: string; departmentId: string }> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ambassadorsAPIService.sendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambassadors", "all"] });
      queryClient.invalidateQueries({ queryKey: ["ambassadors"] });
      toast.success("Ambassador invitation sent successfully");
    },
    onError: (err: any) => {
      console.error("Send ambassador invitation error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else toast.error(msg || err.message || "Failed to send ambassador invitation");
    },
  });
}

// ------------------ AMBASSADOR / DEPT HOOKS ------------------

export function useGetAllAmbassadors(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["ambassadors", "all"],
    queryFn: ambassadorsAPIService.getAllAmbassadors,
    retry: false,
    refetchOnWindowFocus: true,  
    refetchInterval: 30000,     
    staleTime: 0,               
  });
}

export function useGetAmbassadorDepartments(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["departments", "ambassadors"],
    queryFn: ambassadorsAPIService.getDepartments,
    retry: false,
    refetchOnWindowFocus: true,  
    refetchInterval: 60000,      
    staleTime: 5 * 60 * 1000,   
  });
}

export function useGetAmbassadorProfile(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["ambassador", "profile"],
    queryFn: ambassadorsAPIService.getProfile,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAmbassadorProfile(): UseMutationResult<any, any, any> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ambassadorsAPIService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambassador", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["ambassadors", "all"] });
      toast.success("Ambassador profile updated successfully!");
    },
    onError: (err: any) => {
      console.error("Update ambassador profile error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else toast.error(msg || "Failed to update ambassador profile.");
    },
  });
}

// ------------------ SLOT HOOKS ------------------

export function useCreateAmbassadorSlot(): UseMutationResult<SlotResponse, any, CreateSlotRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ambassadorsAPIService.createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambassador-slots"] });
      queryClient.invalidateQueries({ queryKey: ["ambassador-slots", "user"] });
      queryClient.invalidateQueries({ queryKey: ["ambassador-slots", "available"] });
      toast.success("Time slot created successfully!");
    },
    onError: (err: any) => {
      console.error("Create ambassador slot error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else toast.error(msg || "Failed to create time slot.");
    },
  });
}

export function useGetAllAmbassadorSlots(): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["ambassador-slots"],
    queryFn: ambassadorsAPIService.getAllSlots,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDeleteAmbassadorSlot(): UseMutationResult<void, any, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ambassadorsAPIService.deleteSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambassador-slots"] });
      queryClient.invalidateQueries({ queryKey: ["ambassador-slots", "user"] });
      queryClient.invalidateQueries({ queryKey: ["ambassador-slots", "available"] });
      toast.success("Time slot deleted successfully!");
    },
    onError: (err: any) => {
      console.error("Delete ambassador slot error:", err);
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) msg.forEach((m: string) => toast.error(m));
      else toast.error(msg || "Failed to delete time slot.");
    },
  });
}

// ------------------ BOOKING HOOKS ------------------

export function useCreateAmbassadorBooking(): UseMutationResult<any, any, CreateBookingRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ambassadorsAPIService.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "student"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["ambassador-slots"] });
      queryClient.invalidateQueries({ queryKey: ["ambassador-slots", "available"] });
      toast.success("Booking request submitted successfully! Awaiting approval.");
    },
    onError: (err: any) => {
      console.error("Create ambassador booking error:", err);
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

export function useGetStudentAmbassadorBookings(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["ambassador-bookings", "student"],
    queryFn: ambassadorsAPIService.getStudentBookings,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// Updated to match the query key used in manage-meeting page
export function useGetAmbassadorAdminBookings(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["admin-bookings"],
    queryFn: ambassadorsAPIService.getAdminBookings,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// ------------------ AMBASSADOR SLOTS HOOKS ------------------

// Ambassador fetching their own slots
export function useGetAmbassadorSlots(): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["ambassador-slots", "own"],
    queryFn: () => ambassadorsAPIService.getAmbassadorSlots(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// Student fetching a specific ambassador's AVAILABLE slots
export function useGetAmbassadorAvailableSlots(ambassadorId: string): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["ambassador-slots", "available", ambassadorId],
    queryFn: () => ambassadorsAPIService.getAmbassadorAvailableSlots(ambassadorId),
    enabled: Boolean(ambassadorId),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// General hook to fetch any ambassador's slots (requires userId + role)
export function useGetAmbassadorUserSlots(
  userId?: string,
  role?: "student_ambassador"
): UseQueryResult<SlotResponse[]> {
  return useQuery({
    queryKey: ["ambassador-user-slots", userId, role],
    queryFn: () => {
      if (userId && role) {
        return ambassadorsAPIService.getUserSlots(userId, role);
      }
      // If no params provided, fetch ambassador's own slots
      return ambassadorsAPIService.getAmbassadorSlots();
    },
    enabled: Boolean(userId && role) || (!userId && !role), // Enable if params provided OR if no params (for ambassador's own slots)
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
}

// ------------------ BOOKING STATUS MANAGEMENT HOOKS ------------------

export const useChangeAmbassadorBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: 'Acknowledged' | 'Booked' | 'Cancelled' }) => 
      ambassadorsAPIService.changeBookingStatus(bookingId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['ambassador-admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['ambassador-slots'] });
      
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
