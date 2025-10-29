import { axiosPrivateInstance } from "@/api/axois-config"
import { ReviewPostData, ReviewUpdateData } from "../reviews/review.api";

const universityAPIRoutes = {
    getUniversityInfo: "/auth/user-info",
    addUniversityOverview: "/university/university-overview",
    getUniversityOverview: "/university/university-overview",
    addUniversitySports: "/university/university-sports",
    getUniversitySports: "/university/university-sports",

    addUniversityStudentLife: "/university/university-student-life",
    getUniversityStudentLife: "/university/university-student-life",
    addUniversityResearchHub: "/university/university-research-hub",
    getUniversityResearchHub: "/university/university-research-hub",
    addUniversityNotableAlumni: "/university/university-notable-alumni",
    getUniversityNotableAlumni: "/university/university-notable-alumni",
    addUniversityEntrepreneurship: "/university/university-enterpreneurship",
    getUniversityEntrepreneurship: "/university/university-enterpreneurship",

    addUniversityAdmission: "/university/university-admission",
    getUniversityAdmission: "/university/university-admission",
    addUniversityMajor: "/university/major",
    getUniversityMajor: "/university/major",
    addUniversityRanking: "/university/ranking",
    getUniversityRanking: "/university/ranking",
    addUniversityResearchOppertunity: "/university/research-opportunity",
    getUniversityResearchUniversity: "/university/research-opportunity",
    addUniversityTuitionCost: "/university/tuition",
    getUniversityTuitionCost: "/university/tuition",
    addUniversityUndergraduateGraduationDetail: "/university/undergraduate-graduation-detail",
    getUniversityUndergraduateGraduationDetail: "/university/undergraduate-graduation-detail",

    addUniversityGraduateAdmission: "/university/graduate-admission",
    getUniversityGraduateAdmission: "/university/university-graduate-admission",
    addUniversityGraduateMajor: "/university/graduate-major",
    getUniversityGraduateMajor: "/university/graduate-major",
    addUniversityGraduateTuition: "/university/graduate-tuition",
    getUniversityGraduateTuition: "/university/graduate-tuition",
    addUniversityGraduateResearchHub: "/university/graduate-research-hub",
    getUniversityGraduateResearchHub: "/university/graduate-research-hub",
    addUniversityGraduateGraduationDetail: "/university/graduate-graduation-detail",
    getUniversityGraduateGraduationDetail: "/university/graduate-graduation-detail",

    // Review API routes
    postUniversityReview: "/university/review",
    getUniversityReviews: (id: string) => `/university/${id}/reviews`,
    getUniversityReview: (id: string) => `/university/review/${id}`,
    updateUniversityReview: (id: string) => `/university/review/${id}`,
    deleteUniversityReview: (id: string) => `/university/review/${id}`,
}


export interface ReviewAPIResponse {
    id: string;
    message: string;
    rate: number;
    createdAt: string;
    updatedAt: string;
    student: {
        id: string;
        name: string;
        address: string;
        photo: string;
        phone: string;
        date_of_birth: string;
        createdAt: string;
        updatedAt: string;
    };
    university: {
        id: string;
        createdAt: string;
        updatedAt: string;
        university_name: string;
        banner: string | null;
        logo: string | null;
        address: string | null;
        website: string | null;
        status: string;
        country: string;
        description: string | null;
    };
}

export interface Review {
    id: string;
    author: string;
    avatar: string;
    date: string;
    message: string;
    rating: number;
    universityId: string;
    isOwnReview?: boolean;
}

export interface ReviewsResponse {
    data: ReviewAPIResponse[];
    total?: number;
    average?: number;
    counts?: {
        [key: number]: number;
    };
}

// Helper functions for review data transformation
const getUserAvatar = (student: ReviewAPIResponse['student']): string => {
    if (student?.photo) {
        // Handle relative paths by adding a base URL if needed
        if (student.photo.startsWith('/uploads/')) {
            return `${process.env.NEXT_PUBLIC_API_URL || ''}${student.photo}`;
        }
        return student.photo;
    }
    // Default avatar
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwMf-CnIhrNtEolQ7A5bQmtId2vOfGm9bykNNZLvgcgg-5_UgMNboHDZSNBROUr8GFPFek_TevA7GhP8UJ8NYqkF380UQ1222juVQSGHGHGNs8O0HtpgLczHJ0hFxl6PK6hiaE27EHzlq853dfQzliSzTS6B8w82g1LLYzTi4H6Twg4c7PGrE8DS59P8s4WzJejMW5U7aUjtfR5lxZaBFqVRu39f4tsJTD6qJTn_MztZUdCRGGjM--pPC4a8NnUG8fJYOnQKM8qPI';
};

const getUserName = (student: ReviewAPIResponse['student']): string => {
    return student?.name || 'Anonymous User';
};

const formatReviewDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const transformReview = (apiReview: ReviewAPIResponse, currentUserId?: string): Review => {
    console.log('Transform Review Debug:', {
        reviewStudentId: apiReview.student?.id,
        currentUserId: currentUserId,
        isMatch: apiReview.student?.id === currentUserId
    });
    
    return {
        id: apiReview.id,
        author: getUserName(apiReview.student),
        avatar: getUserAvatar(apiReview.student),
        date: formatReviewDate(apiReview.createdAt),
        message: apiReview.message,
        rating: apiReview.rate,
        universityId: apiReview.university?.id || '',
        isOwnReview: currentUserId ? apiReview.student?.id === currentUserId : false
    };
};

export const universityAPIService = {
    getUniversityInfo: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityInfo)
        return resp.data
    },

    addUniversityOverview: async (overview: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityOverview, overview, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityOverview: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityOverview)
        return resp.data
    },

    addUniversitySports: async (sports: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversitySports, sports, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversitySports: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversitySports)
        return resp.data
    },

    addUniversityStudentLife: async (studentLife: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityStudentLife, studentLife, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityStudentLife: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityStudentLife)
        return resp.data
    },
    addUniversityResearchHub: async (researchHub: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityResearchHub, researchHub, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityResearchHub: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityResearchHub)
        return resp.data
    },

    addUniversityAdmission: async (admission: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityAdmission, admission, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityAdmission: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityAdmission)
        return resp.data
    },

    addUniversityMajor: async (major: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityMajor, major, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityMajor: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityMajor)
        return resp.data
    },

    addUniversityNotableAlumni: async (notableAlumni: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityNotableAlumni, notableAlumni, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityNotableAlumni: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityNotableAlumni)
        return resp.data
    },

    addUniversityRanking: async (ranking: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityRanking, ranking, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityRanking: async (status?: string) => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityRanking, {
            params: status ? { status } : {}
        })
        return resp.data
    },

    addUniversityEntrepreneurship: async (entrepreneurship: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityEntrepreneurship, entrepreneurship, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityEntrepreneurship: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityEntrepreneurship)
        return resp.data
    },

    addUniversityResearchOppertunity: async (research: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityResearchOppertunity, research, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityResearchOppertunity: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityResearchUniversity)
        return resp.data
    },

    addUniversityTutionCost: async (tuition: any) => {
        await axiosPrivateInstance.post(universityAPIRoutes.addUniversityTuitionCost, tuition, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    },

    getUniversityTuitionCost: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityTuitionCost)
        return resp.data
    },

    addUniversityUndergraduateGraduationDetail: async (graduationDetail: any) => {
        const resp = await axiosPrivateInstance.post(universityAPIRoutes.addUniversityUndergraduateGraduationDetail, graduationDetail, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return resp.data
    },

    getUniversityUndergraduateGraduationDetail: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityUndergraduateGraduationDetail)
        return resp.data
    },

    addUniversityGraduateAdmission: async (admission: any) => {
        const resp = await axiosPrivateInstance.post(universityAPIRoutes.addUniversityGraduateAdmission, admission, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return resp.data
    },

    getUniversityGraduateAdmission: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityGraduateAdmission)
        return resp.data
    },

    addUniversityGraduateMajor: async (majors: any) => {
        const resp = await axiosPrivateInstance.post(universityAPIRoutes.addUniversityGraduateMajor, majors, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return resp.data
    },

    getUniversityGraduateMajor: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityGraduateMajor)
        return resp.data
    },

    addUniversityGraduateTuition: async (tuition: any) => {
        const resp = await axiosPrivateInstance.post(universityAPIRoutes.addUniversityGraduateTuition, tuition, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return resp.data
    },

    getUniversityGraduateTuition: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityGraduateTuition)
        return resp.data
    },

    addUniversityGraduateResearchHub: async (researchHub: any) => {
        const resp = await axiosPrivateInstance.post(universityAPIRoutes.addUniversityGraduateResearchHub, researchHub, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return resp.data
    },

    getUniversityGraduateResearchHub: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityGraduateResearchHub)
        return resp.data
    },

    addUniversityGraduateGraduationDetail: async (graduationDetail: any) => {
        const resp = await axiosPrivateInstance.post(universityAPIRoutes.addUniversityGraduateGraduationDetail, graduationDetail, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return resp.data
    },

    getUniversityGraduateGraduationDetail: async () => {
        const resp = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityGraduateGraduationDetail)
        return resp.data
    },

    // Review API methods updated for your actual API structure
    postUniversityReview: async (reviewData: ReviewPostData): Promise<Review> => {
        const response = await axiosPrivateInstance.post(universityAPIRoutes.postUniversityReview, reviewData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        // Get current user info for ownership determination
        let currentUserId;
        try {
            const userResponse = await axiosPrivateInstance.get('/auth/user-info');
            currentUserId = userResponse.data.id || 
                           userResponse.data.student?.id ||
                           userResponse.data.studentId;
        } catch (error) {
            console.error('Could not get current user info:', error);
        }
        
        return transformReview(response.data, currentUserId);
    },

    // getUniversityReviews: async (universityId: string): Promise<Review[]> => {
    //     const response = await axiosPrivateInstance.get(universityAPIRoutes.getUniversityReviews(universityId));
    //     const reviews = response.data || [];
        
    //     // Get current user info for ownership determination
    //     let currentUserId: any;
    //     try {
    //         const userResponse = await axiosPrivateInstance.get('/auth/user-info');
    //         console.log('Full User Response:', userResponse.data);
            
    //         // Try different possible user ID fields
    //         currentUserId = userResponse.data.id || 
    //                        userResponse.data.student?.id ||
    //                        userResponse.data.studentId;
            
    //         console.log('Current User ID:', currentUserId);
    //     } catch (error) {
    //         console.error('User info fetch failed:', error);
    //     }
        
    //     return reviews.map((review: ReviewAPIResponse) => transformReview(review, currentUserId));
    // },
    getUniversityReviews: async (universityId: string): Promise<Review[]> => {
    try {
      // --- Step 1: Fetch the public review data using the PUBLIC instance ---
      const reviewsResponse = await axiosPrivateInstance.get<ReviewAPIResponse[]>(`/university/review/${universityId}`);
      const reviewsFromApi = reviewsResponse.data || [];

      // --- Step 2: GRACEFULLY try to fetch the logged-in user's info ---
      let currentStudentId: any;
      try {
        // Use the PRIVATE instance ONLY for this authenticated route.
        const userInfoResponse = await axiosPrivateInstance.get('/auth/user-info');
        
        // This will set the ID if the user is logged in, otherwise it remains null.
        currentStudentId = userInfoResponse.data?.student?.id || userInfoResponse.data?.id || null;
      } catch (error) {
        // THIS CATCH IS INTENTIONAL AND EXPECTED for non-logged-in users.
        // We catch the error and simply continue. `currentStudentId` will remain null.
        console.log("User is not authenticated; reviews will be displayed without ownership status.");
      }

      // --- Step 3: Transform the data in a SINGLE, clean step ---
      // Map over the reviews and pass currentStudentId (which is either a string or null).
      // The transformReview function will handle the logic.
      return reviewsFromApi.map((review) => transformReview(review, currentStudentId));

    } catch (error) {
      console.error(`Error fetching reviews for university ${universityId}:`, error);
      // Return an empty array on any critical failure so the UI doesn't crash.
      return [];
    }
  },

    updateUniversityReview: async (reviewId: string, reviewData: ReviewUpdateData): Promise<Review> => {
        const response = await axiosPrivateInstance.patch(universityAPIRoutes.updateUniversityReview(reviewId), reviewData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        // Get current user info for ownership determination
        let currentUserId;
        try {
            const userResponse = await axiosPrivateInstance.get('/auth/user-info');
            currentUserId = userResponse.data.id || 
                           userResponse.data.student?.id ||
                           userResponse.data.studentId;
        } catch (error) {
            console.error('Could not get current user info:', error);
        }
        
        return transformReview(response.data, currentUserId);
    },

    deleteUniversityReview: async (reviewId: string): Promise<void> => {
        await axiosPrivateInstance.delete(universityAPIRoutes.deleteUniversityReview(reviewId));
    },
}
