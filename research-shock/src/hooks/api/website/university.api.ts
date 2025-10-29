import { axiosPublicInstance } from "@/api/axois-config";

export interface UniversityQueryParams {
  search?: string;
  country?: string;
  area_type?: string;
  type?: string;
}

export interface UniversityOverview {
  country: string;
  city: string;
  state: string;
  university_type: string;
  campus_setting: string; // Corrected from area_type
  description?: string;
}

// Base University Interfaces
export interface UniversityOverview {
  country: string; city: string; state: string; university_type: string; campus_setting: string;
}
export interface University {
  id: string; university_name: string; banner: string | null; logo: string | null; website: string | null; description: string | null;
  overview: UniversityOverview | null;
}
export type UniversityBasicInfo = University;

// General Tab Interfaces
export interface StudentLife { description: string; organizations: { name: string }[]; traditions: { name: string }[]; }
export interface Sports { athletic_division: string; conference: string; teams: { sport_name: string, gender: string }[]; facilities: { name: string, website: string }[]; }
export interface NotableAlumni { name: string; graduation_year: number; accomplishments: string; }
export interface ResearchHub { center_name: string; website_url: string; }
export interface Review { id: string; rating: number; comment: string; createdAt: string; student: { id: string, name: string; photo: string | null }; }
export interface GeneralSectionData extends University {
  student_life: StudentLife | null;
  sports: Sports | null;
  notable_alumni: NotableAlumni[];
  research_hubs: ResearchHub[];
  reviews: Review[];
}

// Academic Tab Interfaces
export interface Ranking { year: number; subject: string; rank: string; source: string; }
export interface Program { name: string; level: string; }
export interface Department { name: string; programs: Program[]; }
export interface AdmissionRequirement { name: string; is_required: boolean; percentile_25: string | null; percentile_75: string | null; }
export interface Admission { level: string; acceptance_rate: number; requirements: AdmissionRequirement[]; application_website: string; }
export interface Tuition { level: string; residency: string; tuition_and_fees: number; }
export interface AcademicSectionData extends University {
  rankings: Ranking[];
  departments: Department[];
  admissions: Admission[];
  tuition_fees: Tuition[];
}

export const websiteUniversityAPI = {
  fetchFeaturedUniversities: async (params: { limit?: number } = {}): Promise<{ data: University[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      // --- CORRECTED ENDPOINT ---
      const response = await axiosPublicInstance.get(`/website/featured-universities?${queryParams.toString()}`);
      
      // Map data to match old component props if needed
      const mappedData = response.data.map((uni: any) => ({
        ...uni,
        displayName: uni.university_name,
        logoImage: uni.logo,
        country: uni.overview?.country,
      }));
      return { data: mappedData };
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  },

   /**
   * Fetches the list of universities for the main grid page.
   * Now correctly passes all filter params to the backend.
   */
  fetchUniversities: async (params: UniversityQueryParams = {}): Promise<{ data: University[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.country) queryParams.append('country', params.country);
      if (params.area_type) queryParams.append('area_type', params.area_type);
      if (params.type) queryParams.append('type', params.type);
      
      // --- CORRECTED ENDPOINT ---
      const response = await axiosPublicInstance.get(`/website/universities?${queryParams.toString()}`);
      return { data: response.data || [] };
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  },

  /**
   * Fetches all distinct filter options in one efficient call.
   */
  fetchFilterOptions: async (): Promise<{ countries: string[], area_types: string[], university_types: string[] }> => {
    try {
        // --- CORRECTED ENDPOINT ---
        const response = await axiosPublicInstance.get('/website/universities/filters');
        return response.data;
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return { countries: [], area_types: [], university_types: [] };
    }
  },

  /**
   * Fetches the basic info needed for the University Detail Page header.
   */
  fetchUniversityBasicInfo: async (id: string): Promise<UniversityBasicInfo> => {
    try {
      // --- CORRECTED ENDPOINT ---
      const response = await axiosPublicInstance.get(`/website/universities/${id}/basic-info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching basic info for university ${id}:`, error);
      throw error;
    }
  },
  fetchGeneralSectionData: async (id: string): Promise<GeneralSectionData> => {
    try {
      const response = await axiosPublicInstance.get(`/website/universities/${id}/general-sections`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching basic info for university ${id}:`, error);
      throw error;
    }
  },

  fetchUndergraduateSectionData: async (id: string): Promise<AcademicSectionData> => {
    try {
      const response = await axiosPublicInstance.get(`/website/universities/${id}/undergraduate-section`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching basic info for university ${id}:`, error);
      throw error;
    }
  },
  
  fetchGraduateSectionData: async (id: string): Promise<AcademicSectionData> => {
    try {
      const response = await axiosPublicInstance.get(`/website/universities/${id}/graduate-section`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching basic info for university ${id}:`, error);
      throw error;
    }
  },
};