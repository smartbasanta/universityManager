import { axiosPublicInstance } from "@/api/axois-config";

// ===================================================================
// CORRECTED TYPESCRIPT INTERFACES
// These now perfectly match the JSON response from your NestJS entities
// ===================================================================

export interface UniversityQueryParams {
  search?: string;
  country?: string;
  area_type?: string;
  type?: string;
}

export interface AcceptanceRate {
  acceptance_rate: string;
  year: string;
  type: string;
  level: string;
}

export interface AverageAnnualCost {
  avg_anual_cost: string;
  description: string;
}

export interface UniversityOverview {
  student_to_faculty_ratio: string;
  research_expenditure: string;
  description: string;
  country: string;
  street: string;
  state: string;
  city: string; // Added city
  zip_code: string; // Added zip_code
  area_type: string;
  university_type: string;
  university_overview_acceptence_rate?: AcceptanceRate[];
  university_avg_anual_cost?: AverageAnnualCost[];
}

export interface UniversityStudentLife {
  description: string;
  no_of_students_organisation: string;
  category: Array<{ name: string; link?: string }>; // Corrected type
  tradition: Array<{ name: string; link?: string }>; // Corrected type
}

export interface SportsFacility {
  name: string;
  website: string;
}

export interface IntramuralSport {
    name?: string;
    link?: string;
}

export interface UniversitySports {
  description: string;
  men_sports_teams: string[]; // Corrected property name
  women_sports_teams: string[]; // Corrected property name
  intramural_sports: IntramuralSport[]; // Added intramural sports
  facilities: SportsFacility[];
}

export interface ResearchHub {
  research_center: string;
  website_url: string;
}

export interface NotableAlumni {
  id: string; // Keep ID for keys
  name: string;
  profession: string;
  notable_achievements: string;
}

export interface UniversityMajor {
  id: string; // Keep ID for keys
  name: string;
  rank: string;
  link: string;
}

export interface GraduateMajor {
  id: string; // Keep ID for keys
  name: string;
  rank: string;
  link: string;
}

export interface Ranking {
  id: string; // Keep ID for keys
  rank: string;
  description: string;
  source_link: string;
  status: "GRADUATE" | "UNDERGRADUATE";
}

export interface ResearchOpportunity {
  id: string; // Keep ID for keys
  title: string; // Corrected property name
  description: string; // Corrected property name
  url: string; // Corrected property name
}

export interface TuitionType {
  tuition_type: string;
  annual_cost: string;
  currency: string;
}

export interface Tuition {
  avg_financial_aid: string;
  avg_financial_aid_currency: string;
  student_receiving_aid: string;
  housing_cost: string;
  housing_cost_currency: string;
  meal_plan_cost: string;
  meal_plan_cost_currency: string;
  books_supplies_cost: string;
  books_supplies_cost_currency: string;
  tuition_type: TuitionType[];
}

export interface AdmissionRequirement {
  name: string;
  percentile_25: string | null;
  percentile_75: string | null;
  requirement_type: string; // 'test_score', 'essay', etc.
  description: string | null;
  is_required: boolean;
  recommendation_amount: number | null;
}

export interface UniversityAdmission {
  application_website: string;
  admission_website: string;
  university_admission_requirement: AdmissionRequirement[];
}

export interface GraduateResearchProject {
    project_title: string;
    description: string;
    link_to_details: string;
}

export interface GraduateResearch {
    primary_research_area: string;
    projects: GraduateResearchProject[];
}

// ===================================================================
// MAIN UNIVERSITY INTERFACE & SECTION-SPECIFIC INTERFACES
// ===================================================================

// This interface represents the full, combined data object
export interface University {
  id: string;
  university_name: string;
  banner: string | null;
  logo: string | null;
  address: string | null;
  website: string | null;
  status: string;
  country: string;
  description: string | null;
  // Relations
  university_overview?: UniversityOverview;
  university_student_life?: UniversityStudentLife;
  university_sports?: UniversitySports;
  research_hub?: ResearchHub[];
  notable_alumni?: NotableAlumni[];
  university_major?: UniversityMajor[];
  graduate_majors?: GraduateMajor[];
  ranking?: Ranking[];
  research_oppertunity?: ResearchOpportunity[];
  tution?: Tuition[];
  gradtution?: Tuition[];
  graduate_research?: GraduateResearch[];
  university_admission?: UniversityAdmission;
  university_graduate_admission?: UniversityAdmission;
}

// NEW: Section-specific response types
export type UniversityBasicInfo = Pick<University, 'id' | 'university_name' | 'banner' | 'logo' | 'address' | 'website' | 'status' | 'country' | 'description' | 'university_overview'>;
export type UniversityStudentLifeSection = Pick<University, 'university_student_life'>;
export type UniversitySportsSection = Pick<University, 'university_sports'>;
export type UniversityResearchSection = Pick<University, 'research_hub' | 'research_oppertunity'>;
export type UniversityAlumniSection = Pick<University, 'notable_alumni'>;
export type UniversityUndergraduateSection = Pick<University, 'university_major' | 'ranking' | 'tution' | 'university_admission'>;
export type UniversityGraduateSection = Pick<University, 'graduate_majors' | 'ranking' | 'gradtution' | 'university_graduate_admission' | 'graduate_research'>;

// ===================================================================
// REFACTORED API SERVICE OBJECT
// ===================================================================

export const websiteUniversityAPI = {
  // CORRECTED: Now passes search to the backend
  fetchUniversities: async (params: UniversityQueryParams = {}): Promise<{ data: University[], total: number }> => {
    try {
      // URLSearchParams is a safe way to build query strings
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.country) queryParams.append('country', params.country);
      if (params.area_type) queryParams.append('area_type', params.area_type);
      if (params.type) queryParams.append('type', params.type);
      
      const response = await axiosPublicInstance.get<University[]>(`/university/websites/university?${queryParams.toString()}`);
      const universities = response.data || [];
      return {
        data: universities,
        total: universities.length, // You might want your backend to return a total count for pagination later
      };
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  },

  // NEW: Optimized function to get all filter options in one call
  fetchFilterOptions: async (): Promise<{ countries: string[], area_types: string[], university_types: string[] }> => {
    try {
        const response = await axiosPublicInstance.get<{ countries: string[], area_types: string[], university_types: string[] }>('/university/websites/filters');
        return response.data;
    } catch (error) {
        console.error('Error fetching filter options:', error);
        // Return sensible defaults on failure
        return { countries: [], area_types: ['Urban', 'Suburban', 'Rural'], university_types: ['Public', 'Private'] };
    }
  },

  // --- NEW GRANULAR FETCHING FUNCTIONS ---
  
  fetchUniversityBasicInfo: async (id: string): Promise<UniversityBasicInfo> => {
    try {
      const response = await axiosPublicInstance.get<UniversityBasicInfo>(`/university/${id}/basic-info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching basic info for university ${id}:`, error);
      throw error;
    }
  },

  fetchUniversityUndergraduateSection: async (id: string): Promise<UniversityUndergraduateSection> => {
    try {
      const response = await axiosPublicInstance.get<UniversityUndergraduateSection>(`/university/${id}/undergraduate`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching undergraduate section for university ${id}:`, error);
      throw error;
    }
  },

  fetchUniversityGraduateSection: async (id: string): Promise<UniversityGraduateSection> => {
    try {
      const response = await axiosPublicInstance.get<UniversityGraduateSection>(`/university/${id}/graduate`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching graduate section for university ${id}:`, error);
      throw error;
    }
  },
  
  fetchUniversitySportsSection: async (id: string): Promise<UniversitySportsSection> => {
    try {
        const response = await axiosPublicInstance.get<UniversitySportsSection>(`/university/${id}/sports`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching sports section for university ${id}:`, error);
        throw error;
    }
  },
  fetchUniversityStudentLifeSection: async (id: string): Promise<UniversityStudentLifeSection> => {
    try {
        const response = await axiosPublicInstance.get<UniversityStudentLifeSection>(`/university/${id}/student-life`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching student life section for university ${id}:`, error);
        throw error;
    }
  },

  fetchUniversityResearchSection: async (id: string): Promise<UniversityResearchSection> => {
    try {
        const response = await axiosPublicInstance.get<UniversityResearchSection>(`/university/${id}/research`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching research section for university ${id}:`, error);
        throw error;
    }
  },

  fetchUniversityAlumniSection: async (id: string): Promise<UniversityAlumniSection> => {
    try {
        const response = await axiosPublicInstance.get<UniversityAlumniSection>(`/university/${id}/alumni`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching alumni section for university ${id}:`, error);
        throw error;
    }
  },
};