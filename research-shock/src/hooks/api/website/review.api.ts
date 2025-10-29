import { axiosPrivateInstance, axiosPublicInstance } from "@/api/axois-config";
import { Review } from './university.api'; // Re-use the interface

export const websiteReviewAPI = {
  // This is a PUBLIC call
  getUniversityReviews: async (universityId: string): Promise<Review[]> => {
    const response = await axiosPublicInstance.get(`/reviews/by-university/${universityId}`);
    return response.data;
  },
};