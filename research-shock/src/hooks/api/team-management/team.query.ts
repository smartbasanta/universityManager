import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamsAPIService } from "./team.api";
import { toast } from "react-toastify";
import { isArray } from "util";

export function useGetDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: teamsAPIService.getDepartments,
    retry: false,
    refetchOnWindowFocus: true,  
    refetchInterval: 60000,      
    staleTime: 5 * 60 * 1000,   
  });
}

export function useAddDepartment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teamsAPIService.addDepartment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department added successfully");
    },
    onError: (err: any) => {
      console.error("Add department error:", err);
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to add department");
      }
    },
  });
}

export function useCreateDepartmentStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teamsAPIService.createDepartmentStaff,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department staff invitation sent successfully");
    },
    onError: (err: any) => {
      console.error("Create department staff error:", err);
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to send department staff invitation");
      }
    },
  });
}

export function useCreateUniversityStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teamsAPIService.createUniversityStaff,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("University staff invitation sent successfully");
    },
    onError: (err: any) => {
      console.error("Create university staff error:", err);
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to send university staff invitation");
      }
    },
  });
}

export function useActivateStaffAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: teamsAPIService.activateStaffAccount,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      
      toast.success("Staff account activated successfully! Welcome to the team.");
    },
    onError: (err: any) => {
      console.error("Staff account activation error:", err);
      console.error("Error response:", err?.response);
      console.error("Error status:", err?.response?.status);
      
      // Enhanced error handling similar to mentor activation
      if (err?.response?.data?.message) {
        if (isArray(err.response.data.message)) {
          err.response.data.message.forEach((message: any) => toast.error(message));
        } else {
          toast.error(err.response.data.message);
        }
      } else if (err?.response?.status) {
        const statusMessages: { [key: number]: string } = {
          400: "Invalid request. Please check your password.",
          401: "Invalid or expired activation token.",
          403: "Access denied. Token may have expired.",
          404: "Activation endpoint not found.",
          422: "Invalid token or password format.",
          500: "Server error. Please try again later.",
        };
        
        toast.error(statusMessages[err.response.status] || `Error ${err.response.status}: Please try again.`);
      } else if (err?.message) {
        toast.error(`Network error: ${err.message}`);
      } else {
        toast.error("Failed to activate staff account. Please try again or contact support.");
      }
    },
  });
}

export function useGetPermissionList() {
  return useQuery({
    queryKey: ["permission-list"],
    queryFn: teamsAPIService.getPermissionList,
    retry: false,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
export function useGetDepartmentStaff() {
  return useQuery({
    queryKey: ["department-staff"],
    queryFn: () => teamsAPIService.getStaff("department_staff"),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useGetUniversityStaff() {
  return useQuery({
    queryKey: ["university-staff"],
    queryFn: () => teamsAPIService.getStaff("university_staff"),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useGetInstitutionStaff() {
  return useQuery({
    queryKey: ["institution-staff"],
    queryFn: () => teamsAPIService.getStaff("institution_staff"),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}