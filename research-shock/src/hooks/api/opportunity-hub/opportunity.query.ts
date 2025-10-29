import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { opportunityAPIService } from "./opportunity.api";
import { toast } from "react-toastify";
import { isArray } from "util";

interface ApplicationsQueryParams {
  opportunityId: string;
  page?: number;
  limit?: number;
}

export function useAddOpportunity() {
  return useMutation({
    mutationFn: opportunityAPIService.addOpportunity,
    onSuccess: (data, variables) => {
      if (variables.status === "Draft") {
        toast.success("Opportunity saved as draft successfully");
      } else if (variables.status === "Live") {
        toast.success("Opportunity published successfully");
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

// Hook to get opportunities by status
export function useGetOpportunitiesByStatus(status: "Draft" | "Live" | "Archive") {
  return useQuery({
    queryKey: ["opportunities", status],
    queryFn: () => opportunityAPIService.getOpportunitiesByStatus(status),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetOpportunityById(id: string) {
  return useQuery({
    queryKey: ["opportunities", id],
    queryFn: () => opportunityAPIService.getOpportunityById(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateOpportunity() {
  return useMutation({
    mutationFn: opportunityAPIService.updateOpportunity,
    onSuccess: (data, variables) => {
      toast.success("Opportunity updated successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update opportunity");
      }
    },
  });
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: opportunityAPIService.deleteOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities", "Draft"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities", "Live"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities", "Archive"] });
      
      toast.success("Opportunity deleted successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to delete opportunity");
      }
    },
  });
}

export function useUpdateOpportunityStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      opportunityAPIService.updateOpportunityStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["opportunities"],
        exact: false 
      });
      
      const statusMessages: { [key: string]: string } = {
        'Live': 'Opportunity moved to Live successfully',
        'Archive': 'Opportunity moved to Archive successfully',
        'Draft': 'Opportunity moved to Draft successfully'
      };
      
      toast.success(statusMessages[variables.status] || 'Opportunity status updated successfully');
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update opportunity status");
      }
    },
  });
}

export function useAnswerQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: opportunityAPIService.answerQuestion,
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
export function useGetApplications({ opportunityId, page = 1, limit = 50 }: ApplicationsQueryParams) {
  return useQuery({
    queryKey: ["applications", opportunityId, page, limit],
    queryFn: () => opportunityAPIService.getApplications(opportunityId, page, limit),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!opportunityId, // Only run query if opportunityId is provided
  });
}

