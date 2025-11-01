import { axiosPublicInstance } from "@/api/axois-config";

// ============= TYPE DEFINITIONS =============


export interface UniversityQueryParams {
  search?: string;
  country?: string;
  area_type?: string;
  type?: string;
}

export interface UniversityOverview {
  id: string;
  country: string;
  city: string;
  state: string;
  university_type: string;
  campus_setting: string;
  student_faculty_ratio?: string;
  research_expenditure?: string | null;
  endowment?: string | null;
  zip_code?: string | null;
}

export interface University {
  id: string;
  createdAt: string;
  updatedAt: string;
  university_name: string;
  banner: string | null;
  logo: string | null;
  about: string | null;
  mission_statement: string | null;
  website: string | null;
  status: string;
  is_published: boolean;
  overview: UniversityOverview | null;
}

export type UniversityBasicInfo = University;

// ============= GENERAL TAB TYPES =============

export interface StudentLifeOrganization {
  name: string;
}

export interface StudentLifeTradition {
  name: string;
}

export interface StudentLife {
  id: string;
  description: string;
  organizations: StudentLifeOrganization[];
  traditions: StudentLifeTradition[];
}

export interface SportsTeam {
  sport_name: string;
  gender: string;
}

export interface SportsFacility {
  name: string;
  website: string;
}

export interface Sports {
  id: string;
  athletic_division: string;
  conference: string;
  teams: SportsTeam[];
  facilities: SportsFacility[];
}

export interface NotableAlumni {
  id: string;
  name: string;
  graduation_year: number;
  accomplishments: string;
}

export interface ResearchHub {
  id: string;
  center_name: string;
  website_url: string;
}

export interface ReviewStudent {
  id: string;
  name: string;
  photo: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: ReviewStudent;
}

export interface GeneralSectionData extends University {
  student_life: StudentLife | null;
  sports: Sports | null;
  notable_alumni: NotableAlumni[];
  research_hubs: ResearchHub[];
  reviews: Review[];
}

// ============= ACADEMIC TAB TYPES =============

export interface Ranking {
  id: string;
  year: number;
  subject: string;
  rank: string;
  source: string;
  source_link?: string | null;
}

export interface Program {
  id: string;
  name: string;
  level: string;
  description?: string | null;
  duration?: string | null;
  total_credits?: string | null;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  website?: string | null;
  contactEmail?: string | null;
  officePhone?: string | null;
  programs: Program[];
}

export interface AdmissionRequirement {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  is_required: boolean;
  percentile_25: string | null;
  percentile_75: string | null;
}

export interface Admission {
  id: string;
  level: string;
  acceptance_rate: string;
  application_deadline: string;
  application_fee?: string | null;
  application_website?: string | null;
  requirements: AdmissionRequirement[];
}

export interface Tuition {
  id: string;
  level: string;
  residency: string;
  academic_year: number;
  tuition_and_fees: string;
  books_and_supplies_cost: string;
  housing_cost: string;
  meal_plan_cost: string;
  source_link?: string | null;
}

export interface AcademicSectionData extends University {
  rankings: Ranking[];
  departments: Department[];
  admissions: Admission[];
  tuition_fees: Tuition[];
}

// ============= API FUNCTIONS =============

export const websiteUniversityAPI = {




// ============= API FUNCTIONS =============
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
   * Fetches basic university information for the header
   */
  fetchUniversityBasicInfo: async (id: string): Promise<UniversityBasicInfo> => {
    try {
      const response = await axiosPublicInstance.get(`/website/universities/${id}/basic-info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching basic info for university ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetches general section data (student life, sports, alumni, research, reviews)
   */
  fetchGeneralSectionData: async (id: string): Promise<GeneralSectionData> => {
    try {
      const response = await axiosPublicInstance.get(`/website/universities/${id}/general-sections`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching general sections for university ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetches undergraduate section data (rankings, departments, admissions, tuition)
   */
  fetchUndergraduateSectionData: async (id: string): Promise<AcademicSectionData> => {
    try {
      const response = await axiosPublicInstance.get(`/website/universities/${id}/undergraduate-section`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching undergraduate section for university ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetches graduate section data (rankings, departments, admissions, tuition)
   */
  fetchGraduateSectionData: async (id: string): Promise<AcademicSectionData> => {
    try {
      const response = await axiosPublicInstance.get(`/website/universities/${id}/graduate-section`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching graduate section for university ${id}:`, error);
      throw error;
    }
  },
};