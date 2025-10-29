import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyAPIService, CompanyProfile } from "./company.api";
import { toast } from "react-toastify";

export function useGetCompanyProfile() {
  return useQuery({
    queryKey: ["company", "profile"],
    queryFn: companyAPIService.getProfile,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData: CompanyProfile) => companyAPIService.updateProfile(profileData),
    onSuccess: (data, variables) => {
      // Invalidate company profile queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["company", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
      
      toast.success("Company profile updated successfully!");
    },
    onError: (err: any) => {
      console.error("Update company profile error:", err);
      
      if (err?.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          err.response.data.message.forEach((message: any) => toast.error(message));
        } else {
          toast.error(err.response.data.message);
        }
      } else if (err?.response?.status) {
        const statusMessages: { [key: number]: string } = {
          400: "Invalid request. Please check your company information.",
          401: "Authentication required. Please log in again.",
          403: "Access denied. You don't have permission to update this profile.",
          404: "Company profile not found.",
          422: "Invalid data format. Please check all required fields.",
          500: "Server error. Please try again later.",
        };
        
        toast.error(statusMessages[err.response.status] || `Error ${err.response.status}: Please try again.`);
      } else if (err?.message) {
        toast.error(`Network error: ${err.message}`);
      } else {
        toast.error("Failed to update company profile. Please try again or contact support.");
      }
    },
  });
}
