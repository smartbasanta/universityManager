import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scholarshipAPIService } from "./scholarship.api";
import { toast } from "react-toastify";
import { isArray } from "util";

interface ScholarshipApplicationsQueryParams {
  scholarshipId: string;
  page?: number;
  limit?: number;
}

export function useAddScholarship() {
  return useMutation({
    mutationFn: scholarshipAPIService.addScholarship,
    onSuccess: (data, variables) => {
      if (variables.status === "Draft") {
        toast.success("Scholarship saved as draft successfully");
      } else if (variables.status === "Live") {
        toast.success("Scholarship published successfully");
      }
    },
    onError: (err: any) => {
      // Handle array of error messages (validation errors)
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        // Handle single error message
        toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
      }
    },
  });
}

// Hook to get scholarships by status
export function useGetScholarshipByStatus(status: "Draft" | "Live" | "Archive") {
  return useQuery({
    queryKey: ["scholarship", status],
    queryFn: () => scholarshipAPIService.getScholarshipByStatus(status),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetScholarshipById(id: string) {
  return useQuery({
    queryKey: ["scholarship", id],
    queryFn: () => scholarshipAPIService.getScholarshipById(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateScholarship() {
  return useMutation({
    mutationFn: scholarshipAPIService.updateScholarship,
    onSuccess: (data, variables) => {
      toast.success("Scholarship updated successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update scholarship");
      }
    },
  });
}

export function useDeleteScholarship() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: scholarshipAPIService.deleteScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scholarship"] });
      queryClient.invalidateQueries({ queryKey: ["scholarship", "Draft"] });
      queryClient.invalidateQueries({ queryKey: ["scholarship", "Live"] });
      queryClient.invalidateQueries({ queryKey: ["scholarship", "Archive"] });
      
      toast.success("Scholarship deleted successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to delete scholarship");
      }
    },
  });
}

export function useUpdateScholarshipStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      scholarshipAPIService.updateScholarshipStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["scholarship"],
        exact: false 
      });
      
      const statusMessages: { [key: string]: string } = {
        'Live': 'Scholarship moved to Live successfully',
        'Archive': 'Scholarship moved to Archive successfully',
        'Draft': 'Scholarship moved to Draft successfully'
      };
      
      toast.success(statusMessages[variables.status] || 'Scholarship status updated successfully');
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update scholarship status");
      }
    },
  });
}

export function useAnswerQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: scholarshipAPIService.answerQuestion,
    onSuccess: (data) => {
      toast.success("Application submitted successfully");
      // Optionally invalidate related queries if needed
      // queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err: any) => {
      // Handle array of error messages (validation errors)
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        // Handle single error message
        toast.error(err.response?.data?.message || err.message || "Failed to submit application");
      }
    },
  });
}
export function useGetScholarshipApplications({ scholarshipId, page = 1, limit = 50 }: ScholarshipApplicationsQueryParams) {
  return useQuery({
    queryKey: ["scholarship-applications", scholarshipId, page, limit],
    queryFn: () => scholarshipAPIService.getScholarshipApplications(scholarshipId, page, limit),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!scholarshipId, // Only run query if scholarshipId is provided
  });
}
