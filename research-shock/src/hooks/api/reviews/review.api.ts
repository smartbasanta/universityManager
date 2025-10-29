import { axiosPrivateInstance, axiosPublicInstance } from "@/api/axois-config";

export interface ReviewPostData {
  comment: string;
  rating: number;
  universityId: string;
}

export interface ReviewUpdateData {
  comment?: string;
  rating?: number;
}

export const privateReviewAPI = {
  // These are PRIVATE (authenticated) calls
  postUniversityReview: async (reviewData: ReviewPostData) => {
    return axiosPrivateInstance.post('/reviews', reviewData);
  },

  updateUniversityReview: async (reviewId: string, reviewData: ReviewUpdateData) => {
    return axiosPrivateInstance.patch(`/reviews/${reviewId}`, reviewData);
  },

  deleteUniversityReview: async (reviewId: string) => {
    return axiosPrivateInstance.delete(`/reviews/${reviewId}`);
  },
};