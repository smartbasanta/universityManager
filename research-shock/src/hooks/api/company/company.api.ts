import { axiosPrivateInstance } from "@/api/axois-config";

// Company profile type based on your schema
export interface CompanyProfile {
  country: string;
  name: string;
  overview: string;
  website: string;
  verifyPage: string;
  industry: string;
  companySize: string;
  headquarters: string;
  companyType: string;
  specialities: string[];
  commitments: string[];
  careerGrowth: string;
  program: string;
  division: string;
}

const companyAPIRoutes = {
  getProfile: "/institution/my-profile", // Changed to get current user's profile from token
  completeProfile: "/institution/complete-profile",
};

export const companyAPIService = {
  // Get company profile - uses token to identify the institution
  getProfile: async () => {
    const response = await axiosPrivateInstance.get(companyAPIRoutes.getProfile, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  // Update company profile
  updateProfile: async (profileData: CompanyProfile) => {
    const response = await axiosPrivateInstance.patch(companyAPIRoutes.completeProfile, profileData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },
};
