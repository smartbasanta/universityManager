"use client";   

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { universityAPIService } from "@/hooks/api/university/university.api";
import { fixPhotoUrl } from "@/utils/imageUtils"; // Add this import

// Import other API services when you create them
// import { institutionAPIService } from "@/api/institution.api";
// import { studentAmbassadorAPIService } from "@/api/student-ambassador.api";
// import { mentorAPIService } from "@/api/mentor.api";
// import { studentAPIService } from "@/api/student.api";

interface IAuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  isAuth: boolean;
  isLoading: boolean;
  role: string | null;
  info: any;
  permissions: string[];
  pp: string | null;

  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setRole: (role: string) => void;
  setIsAuth: (auth: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setPermissions: (permissions: string[]) => void;
  setInfo: (info: any) => void;
  setPp: (pp: string | null) => void; // Allow null

  clearAccessToken: () => void;
  clearRefreshToken: () => void;
  clearRole: () => void;
  clearIsAuth: () => void;
  clearPermissions: () => void;
  clearPp: () => void;

  clearAll: () => void;
  logout: () => void;
  
  // New method to fetch user info
  fetchUserInfo: () => Promise<void>;
}

// Map roles to their respective API services
const getAPIServiceByRole = (role: string | null) => {
  switch (role) {
    case 'university':
      return universityAPIService.getUniversityInfo;
    case 'institution':
      // return institutionAPIService.getInstitutionInfo;
      return universityAPIService.getUniversityInfo; // Fallback until you create the API
    case 'student_ambassador':
      // return studentAmbassadorAPIService.getStudentAmbassadorInfo;
      return universityAPIService.getUniversityInfo; // Fallback until you create the API
    case 'mentor':
      // return mentorAPIService.getMentorInfo;
      return universityAPIService.getUniversityInfo; // Fallback until you create the API
    case 'student':
      // return studentAPIService.getStudentInfo;
      return universityAPIService.getUniversityInfo; // Fallback until you create the API
    default:
      // Default to university API if role is not determined yet
      return universityAPIService.getUniversityInfo;
  }
};

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuth: false,
      role: null,
      info: null,
      permissions: [],
      pp: null,

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setRole: (role) => set({ role }),
      setIsAuth: (auth) => set({ isAuth: auth }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setPermissions: (permissions) => set({ permissions }),
      setInfo: (info) => set({ info }),
      setPp: (pp) => set({ pp }),

      clearAccessToken: () => set({ accessToken: null }),
      clearRefreshToken: () => set({ refreshToken: null }),
      clearRole: () => set({ role: null }),
      clearIsAuth: () => set({ isAuth: false }),
      clearPermissions: () => set({ permissions: [] }),
      clearPp: () => set({ pp: null }),

      // FIXED: Include pp in clearAll
      clearAll: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuth: false,
          isLoading: false,
          role: null,
          info: null,
          permissions: [],
          pp: null, // Add pp here
        }),

      // FIXED: Include pp in logout
      logout: () => {
        set({ 
          accessToken: null, 
          refreshToken: null, 
          isAuth: false,
          info: null,
          role: null,
          permissions: [],
          pp: null // Add pp here
        });
        localStorage.removeItem("rToken");
        sessionStorage.removeItem("rToken");
      },

      // FIXED: Updated fetchUserInfo to extract and set pp from API response
      // FIXED: Updated fetchUserInfo to sync photo and pp with the same cleaned URL
fetchUserInfo: async () => {
  const state = get();
  
  if (!state.accessToken || !state.isAuth) {
    console.log('No access token or not authenticated');
    return;
  }

  set({ isLoading: true });
  
  try {
    // Use the appropriate API service based on current role
    const apiService = getAPIServiceByRole(state.role);
    const userInfo = await apiService();
    
    console.log('Fetched user info:', userInfo);
    
    // Extract photo from the API response (check multiple possible field names)
    let photoUrl = userInfo.photo || userInfo.avatar || userInfo.pp || null;
    console.log('Raw photo URL from API:', photoUrl);
    
    // Fix the photo URL if it exists and contains 'undefined'
    let cleanedPhotoUrl = null;
    if (photoUrl && typeof photoUrl === 'string') {
      cleanedPhotoUrl = fixPhotoUrl(photoUrl);
      console.log('Cleaned photo URL:', cleanedPhotoUrl);
    }
    
    // ✅ SYNC: Set the cleaned URL to both pp and info.photo
    const updatedUserInfo = { ...userInfo };
    if (cleanedPhotoUrl) {
      updatedUserInfo.photo = cleanedPhotoUrl; // Ensure info.photo has the same cleaned URL
    }
    
    // Update the store with user info AND pp (both will have the same URL now)
    set({ 
      info: updatedUserInfo, // Contains the cleaned photo URL
      role: userInfo.role || state.role,
      pp: cleanedPhotoUrl, // Same cleaned URL as info.photo
      isLoading: false
    });
    
  } catch (error) {
    console.error('Error fetching user info:', error);
    set({ isLoading: false });
  }
},

    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
