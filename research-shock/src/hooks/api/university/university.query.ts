import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { universityAPIService } from "./university.api";

import { toast } from "react-toastify";
import { isArray } from "util";
import { websiteReviewAPI } from "../website/review.api";
import { privateReviewAPI, ReviewUpdateData } from "../reviews/review.api";

export function useUniversityUserInfo() {
  return useQuery({
    queryKey: ["university-user-info"],
    queryFn: universityAPIService.getUniversityInfo,
    retry: false,
    refetchOnWindowFocus: false,
  });
}


export function useAddUniversityOverview() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityOverview,
    onSuccess: () => {
      toast.success("University overview added successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityOverview() {
  return useQuery({
    queryKey: ["university-overview"],
    queryFn: universityAPIService.getUniversityOverview,
    retry: false,
    refetchOnWindowFocus: false,
  });
}


export function useAddUniversitySports() {
  return useMutation({
    mutationFn: universityAPIService.addUniversitySports,
    onSuccess: () => {
      toast.success("University sports added successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}


export function useGetUniversitySports() {
  return useQuery({
    queryKey: ["university-sports"],
    queryFn: universityAPIService.getUniversitySports,
    retry: false,
    refetchOnWindowFocus: false,
  });
}


export function useAddUniversityStudentLife() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityStudentLife,
    onSuccess: () => {
      toast.success("University Student Life added successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}
export function useGetUniversityStudentLife() {
  return useQuery({
    queryKey: ["university-student-life"],
    queryFn: universityAPIService.getUniversityStudentLife,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddUniversityAdmission() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityAdmission,
    onSuccess: () => {
      toast.success("University admission added successfully");

    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityAdmission() {
  return useQuery({
    queryKey: ["university-admission"],
    queryFn: universityAPIService.getUniversityAdmission,

    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddUniversityResearch() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityResearchHub,
    onSuccess: () => {
      toast.success("University Research Hub added successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}
export function useGetUniversityResearch() {
  return useQuery({
    queryKey: ["university-research-hub"],
    queryFn: universityAPIService.getUniversityResearchHub,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddUniversityMajor() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityMajor,
    onSuccess: () => {
      toast.success("University major added successfully");

    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}
export function useGetUniversityMajor() {
  return useQuery({
    queryKey: ["university-major"],
    queryFn: universityAPIService.getUniversityMajor,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddUniversityNotableAlumni() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityNotableAlumni,
    onSuccess: () => {
      toast.success("University Notable Alumni added successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}
export function useGetUniversityNotableAlumni() {
  return useQuery({
    queryKey: ["university-notable-alumni"],
    queryFn: universityAPIService.getUniversityNotableAlumni,

    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddUniversityRanking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: universityAPIService.addUniversityRanking,
    onSuccess: () => {
      toast.success("University ranking added successfully");
      // Invalidate all ranking queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ["university-ranking"] });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityRanking(status?: string) {
  return useQuery({
    queryKey: ["university-ranking", status],
    queryFn: () => universityAPIService.getUniversityRanking(status),
    retry: false,
    refetchOnWindowFocus: false,
  })
}


export function useAddUniversityEntrepreneurship() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityEntrepreneurship,
    onSuccess: () => {
      toast.success("University Entrepreneurship added successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}
export function useGetUniversityEntrepreneurship() {
  return useQuery({
    queryKey: ["university-enterpreneurship"],
    queryFn: universityAPIService.getUniversityEntrepreneurship,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddUniversityResearchOppertunity() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityResearchOppertunity,
    onSuccess: () => {
      toast.success("University research opportunity added successfully");

    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityResearchOppertunity() {
  return useQuery({
    queryKey: ["university-research-opportunity"],
    queryFn: universityAPIService.getUniversityResearchOppertunity,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useAddUniversityTuitionCost() {
  return useMutation({
    mutationFn: universityAPIService.addUniversityTutionCost,
    onSuccess: () => {
      toast.success("University tuition cost added successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityTuitionCost() {
  return useQuery({
    queryKey: ["university-tuition-cost"],
    queryFn: universityAPIService.getUniversityTuitionCost,

    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAddUniversityGraduateAdmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: universityAPIService.addUniversityGraduateAdmission,
    onSuccess: () => {
      toast.success("University graduate admission added successfully");
      // Invalidate and refetch the graduate admission data
      queryClient.invalidateQueries({ queryKey: ["university-graduate-admission"] });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityGraduateAdmission() {
  return useQuery({
    queryKey: ["university-graduate-admission"],
    queryFn: universityAPIService.getUniversityGraduateAdmission,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
export function useAddUniversityGraduateMajor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: universityAPIService.addUniversityGraduateMajor,
    onSuccess: () => {
      toast.success("University graduate majors added successfully");
      // Invalidate and refetch the graduate major data
      queryClient.invalidateQueries({ queryKey: ["university-graduate-major"] });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityGraduateMajor() {
  return useQuery({
    queryKey: ["university-graduate-major"],
    queryFn: universityAPIService.getUniversityGraduateMajor,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
export function useAddUniversityGraduateTuition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: universityAPIService.addUniversityGraduateTuition,
    onSuccess: () => {
      toast.success("University graduate tuition added successfully");
      // This will trigger a refetch of the tuition data
      queryClient.invalidateQueries({ queryKey: ["university-graduate-tuition"] });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}


export function useGetUniversityGraduateTuition() {
  return useQuery({
    queryKey: ["university-graduate-tuition"],
    queryFn: universityAPIService.getUniversityGraduateTuition,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
export function useAddUniversityGraduateResearchHub() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: universityAPIService.addUniversityGraduateResearchHub,
    onSuccess: () => {
      toast.success("University graduate research hub added successfully");
      // Invalidate and refetch the graduate research hub data
      queryClient.invalidateQueries({ queryKey: ["university-graduate-research-hub"] });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityGraduateResearchHub() {
  return useQuery({
    queryKey: ["university-graduate-research-hub"],
    queryFn: universityAPIService.getUniversityGraduateResearchHub,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
export function useAddUniversityGraduateGraduationDetail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: universityAPIService.addUniversityGraduateGraduationDetail,
    onSuccess: () => {
      toast.success("University graduate graduation detail added successfully");
      // Invalidate and refetch the graduate graduation detail data
      queryClient.invalidateQueries({ queryKey: ["university-graduate-graduation-detail"] });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityGraduateGraduationDetail() {
  return useQuery({
    queryKey: ["university-graduate-graduation-detail"],
    queryFn: universityAPIService.getUniversityGraduateGraduationDetail,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
export function useAddUniversityUndergraduateGraduationDetail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: universityAPIService.addUniversityUndergraduateGraduationDetail,
    onSuccess: () => {
      toast.success("University undergraduate graduation detail added successfully");
      // Invalidate and refetch the undergraduate graduation detail data
      queryClient.invalidateQueries({ queryKey: ["university-undergraduate-graduation-detail"] });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      }
      toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
    },
  });
}

export function useGetUniversityUndergraduateGraduationDetail() {
  return useQuery({
    queryKey: ["university-undergraduate-graduation-detail"],
    queryFn: universityAPIService.getUniversityUndergraduateGraduationDetail,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// Review-related hooks
export function useGetUniversityReviews(universityId: string, initialData: any[] = []) {
    return useQuery({
        queryKey: ["university-reviews", universityId],
        queryFn: () => websiteReviewAPI.getUniversityReviews(universityId),
        initialData, // Use the data passed from the server component as initial data
        staleTime: 1000 * 60, // Refetch in the background after 1 minute
    });
}

export function usePostUniversityReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: privateReviewAPI.postUniversityReview,
        onSuccess: (data, variables) => {
            toast.success("Review submitted successfully");
            queryClient.invalidateQueries({ queryKey: ["university-reviews", variables.universityId] });
        },
        onError: (err: any) => { /* ... error handling ... */ },
    });
}

export function useUpdateUniversityReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ reviewId, reviewData }: { reviewId: string; reviewData: ReviewUpdateData }) => 
            privateReviewAPI.updateUniversityReview(reviewId, reviewData),
        onSuccess: () => {
            toast.success("Review updated successfully");
            queryClient.invalidateQueries({ queryKey: ["university-reviews"] });
        },
        onError: (err: any) => { /* ... error handling ... */ },
    });
}

export function useDeleteUniversityReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: privateReviewAPI.deleteUniversityReview,
        onSuccess: () => {
            toast.success("Review deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["university-reviews"] });
        },
        onError: (err: any) => { /* ... error handling ... */ },
    });
}