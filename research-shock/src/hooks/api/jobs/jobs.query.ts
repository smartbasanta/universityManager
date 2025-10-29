import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsAPIService } from "./jobs.api";
import { toast } from "react-toastify";
import { isArray } from "util";

interface JobApplicationsQueryParams {
  jobId: string;
  page?: number;
  limit?: number;
}

export function useAddJob() {
  return useMutation({
    mutationFn: jobsAPIService.addJob,
    onSuccess: (data, variables) => {
      if (variables.status === "Draft") {
        toast.success("Job saved as draft successfully");
      } else if (variables.status === "Live") {
        toast.success("Job published successfully");
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

// Hook to get jobs by status
export function useGetJobsByStatus(status: "Draft" | "Live" | "Archive") {
  return useQuery({
    queryKey: ["jobs", status],
    queryFn: () => jobsAPIService.getJobsByStatus(status),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetJobById(id: string) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => jobsAPIService.getJobById(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateJob() {
  return useMutation({
    mutationFn: jobsAPIService.updateJob,
    onSuccess: (data, variables) => {
      toast.success("Job updated successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update job");
      }
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: jobsAPIService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "Draft"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "Live"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "Archive"] });
      
      toast.success("Job deleted successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to delete job");
      }
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      jobsAPIService.updateJobStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["jobs"],
        exact: false 
      });
      
      const statusMessages: { [key: string]: string } = {
        'Live': 'Job moved to Live successfully',
        'Archive': 'Job moved to Archive successfully',
        'Draft': 'Job moved to Draft successfully'
      };
      
      toast.success(statusMessages[variables.status] || 'Job status updated successfully');
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update job status");
      }
    },
  });
}
export function useAnswerQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: jobsAPIService.answerQuestion,
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
export function useGetJobApplications({ jobId, page = 1, limit = 50 }: JobApplicationsQueryParams) {
  return useQuery({
    queryKey: ["job-applications", jobId, page, limit],
    queryFn: () => jobsAPIService.getJobApplications(jobId, page, limit),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!jobId, // Only run query if jobId is provided
  });
}