// Main University interface for API responses
export interface University {
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
  university_overview: UniversityOverview;
  university_student_life?: UniversityStudentLife;
  university_sports?: UniversitySports;
  research_hub?: ResearchHub[];
  notable_alumni?: NotableAlumni[];
  university_major?: UniversityMajor[];
  graduate_majors?: GraduateMajor[];
  ranking?: Ranking[];
  research_oppertunity?: ResearchOpportunity[];
  tution?: Tuition[];
  gradtution?: GraduateTuition[]; // Added new field for graduate tuition
  graduate_research?: GraduateResearch[];
  graduate_graduation_detail?: GraduationDetail;
  undergraduate_graduation_detail?: GraduationDetail;
  university_admission?: UniversityAdmission; // Added new field for undergraduate admission
  university_graduate_admission?: UniversityGraduateAdmission; // Added new field for graduate admission
  
  // Computed fields for display compatibility
  image?: string;
  bannerImage?: string;
  logoImage?: string;
  displayName?: string;
}

// University Overview nested interface
export interface UniversityOverview {
  id: string;
  createdAt: string;
  updatedAt: string;
  student_to_faculty_ratio: string;
  research_expenditure: string;
  description: string;
  country: string;
  street: string;
  state: string;
  area_type: string;
  university_type: string;
  isDraft: boolean;
  university_overview_acceptence_rate?: AcceptanceRate[];
  university_avg_anual_cost?: AverageAnnualCost[];
}

// Acceptance Rate interface
export interface AcceptanceRate {
  id: string;
  createdAt: string;
  updatedAt: string;
  acceptance_rate: string;
  year: string;
  type: string;
  level: string;
}

// Average Annual Cost interface
export interface AverageAnnualCost {
  id: string;
  createdAt: string;
  updatedAt: string;
  avg_anual_cost: string;
  description: string;
}

// University Student Life interface
export interface UniversityStudentLife {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  no_of_students_organisation: string;
  category: string[];
  tradition: string[];
  isDraft: boolean;
}

// University Sports interface
export interface UniversitySports {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  men_sports: string[];
  women_sports: string[];
  facilities: SportsFacility[];
}

// Sports Facility interface
export interface SportsFacility {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  website: string;
}

// Research Hub interface
export interface ResearchHub {
  id: string;
  createdAt: string;
  updatedAt: string;
  research_center: string;
  website_url: string;
  isDraft: boolean;
}

// Notable Alumni interface
export interface NotableAlumni {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  profession: string;
  notable_achievements: string;
  isDraft: boolean;
}

// University Major interface
export interface UniversityMajor {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  rank: string;
  link: string;
  isDraft: boolean;
}

// Graduate Major interface
export interface GraduateMajor {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  rank: string;
  link: string;
  isDraft: boolean;
}

// Ranking interface
export interface Ranking {
  id: string;
  createdAt: string;
  updatedAt: string;
  rank: string;
  description: string;
  source_link: string;
  status: "GRADUATE" | "UNDERGRADUATE";
  isDraft: boolean;
}

// Research Opportunity interface
export interface ResearchOpportunity {
  id: string;
  createdAt: string;
  updatedAt: string;
  research_center: string;
  faculty_supervisor: string;
  project_title: string;
  url: string;
  isDraft: boolean;
}

// Tuition interface (for undergraduate)
export interface Tuition {
  id: string;
  createdAt: string;
  updatedAt: string;
  avg_financial_aid: string;
  student_receiving_aid: string;
  housing_cost: string;
  meal_plan_cost: string;
  books_supplies_cost: string;
  isDraft: boolean;
  tuition_type: TuitionType[];
}

// Graduate Tuition interface (for graduate)
export interface GraduateTuition {
  id: string;
  createdAt: string;
  updatedAt: string;
  avg_financial_aid: string;
  student_receiving_aid: string;
  housing_cost: string;
  meal_plan_cost: string;
  books_supplies_cost: string;
  isDraft: boolean;
  tuition_type: TuitionType[];
}

// Tuition Type interface
export interface TuitionType {
  id: string;
  createdAt: string;
  updatedAt: string;
  tuition_type: string;
  annual_cost: string;
}

// University Admission interface (for undergraduate)
export interface UniversityAdmission {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_website: string;
  admission_website: string;
  university_admission_requirement: AdmissionRequirement[];
}

// University Graduate Admission interface (for graduate)
export interface UniversityGraduateAdmission {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_website: string;
  admission_website: string;
  university_admission_requirement: AdmissionRequirement[];
}

// Admission Requirement interface
export interface AdmissionRequirement {
  id: string;
  createdAt: string;
  updatedAt: string;
  test_name: string;
  score_range: string;
}

// Graduate Research interface
export interface GraduateResearch {
  id: string;
  createdAt: string;
  updatedAt: string;
  research_center: string;
  principial_investigator: string;
  description: string;
  funding_resource: string;
  tags: string[];
  isDraft: boolean;
}

// Graduation Detail interface
export interface GraduationDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
}

// Legacy University interface (for compatibility with existing components)
export interface UniversityLegacy {
  id: string;
  name: string;
  location: string;
  country: string;
  type: 'public' | 'private' | 'community-college' | 'technical-institute' | 'research-university' | 'liberal-arts-college' | 'online-university';
  setting: 'urban' | 'suburban' | 'rural';
  researchAreas: string[];
  image: string;
  description: string;
  establishedYear?: number;
  studentCount?: number;
  ranking?: number;
  website: string;
  address: string;
  phone: string;
  email: string;
  schools: School[];
  programs: Program[];
  admissions: Admissions;
  demographics: Demographics;
  studentLife: StudentLife;
  professors: ProfessorStats;
  similarUniversities: SimilarUniversity[];
  tuitionData: TuitionData;
  campusLifeInfo: CampusLifeInfo;
  sportsInfo: SportsInfo;
 // reviews: Review[];
}

// API Query Parameters
export interface UniversityQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  area_type?: string;
  type?: string;
}

// API Response structure
export interface UniversityResponse {
  data: University[];
  total?: number;
  page?: number;
  limit?: number;
}

// Single University Response structure
export interface SingleUniversityResponse {
  data: University;
}

// School interface (for SchoolTabs component)
export interface School {
  id: string;
  name: string;
  type: 'undergraduate' | 'graduate';
  description: string;
  programs: string[];
  studentCount?: number;
}

// Program interface (for SchoolTabs component)
export interface Program {
  id: string;
  name: string;
  level: 'bachelor' | 'master' | 'doctoral';
  school: string;
  studentCount: number;
  description?: string;
}

// Demographics interface (for UniversityStatistics component)
export interface Demographics {
  totalStudents: number;
  graduateStudents: number;
  undergraduateStudents: number;
  partTimeStudents: number;
  researchAssistants: number;
  teachingAssistants: number;
  racialDiversity: RacialDiversity[];
}

// Racial Diversity interface
export interface RacialDiversity {
  category: string;
  percentage: number;
}

// Student Life interface (for UniversityStatistics component)
export interface StudentLife {
  characteristics: StudentCharacteristic[];
  satisfaction: SatisfactionMetric[];
}

// Student Characteristic interface
export interface StudentCharacteristic {
  trait: string;
  percentage: number;
}

// Satisfaction Metric interface
export interface SatisfactionMetric {
  metric: string;
  percentage: number;
}

// Professor Stats interface (for UniversityStatistics component)
export interface ProfessorStats {
  careAboutStudents: number;
  engagingAndUnderstandable: number;
  helpWithOpportunities: number;
}

// Similar University interface (for SimilarUniversities component)
export interface SimilarUniversity {
  id: string;
  name: string;
  location: string;
  image: string;
  ranking?: number;
  type: string;
}

// Admission Deadlines interface
export interface AdmissionDeadlines {
  undergraduate: string;
  postgraduate: string;
  phd: string;
}

// Admissions interface (for AdmissionsInfo component)
export interface Admissions {
  requirements: string;
  deadlines: AdmissionDeadlines;
  applicationWebsite: string;
  applicationFee?: string;
}

// Search Filters interface
export interface SearchFilters {
  search: string;
  countries: string[];
  locations: string[];
  types: string[];
  researchAreas: string[];
  customCountries?: string[];
  customResearchAreas?: string[];
}

// Filter Option interface
export interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
}

// Tuition Data interface (for TuitionFeesSection component)
export interface TuitionData {
  undergraduate: {
    tuition: string;
    fees: string;
    roomBoard: string;
    total: string;
  };
  graduate: {
    tuition: string;
    fees: string;
    roomBoard: string;
    total: string;
  };
  additionalFees: {
    name: string;
    amount: string;
  }[];
}

// Campus Life Info interface (for CampusLifeSection component)
export interface CampusLifeInfo {
  housing: {
    title: string;
    description: string;
    options: string[];
  };
  dining: {
    title: string;
    description: string;
    options: string[];
  };
  recreation: {
    title: string;
    description: string;
    facilities: string[];
  };
  organizations: {
    title: string;
    description: string;
    count: number;
    examples: string[];
  };
}

// Sports Info interface (for SportsSection component)
export interface SportsInfo {
  overview: string;
  teams: {
    name: string;
    league: string;
    achievements?: string;
  }[];
  facilities: {
    name: string;
    description: string;
    website?: string;
  }[];
  intramurals: string[];
}

// Review interface (for ReviewsSection component)
export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  category: string;
}

// Type guards for better type safety
export const isUniversityLegacy = (university: any): university is UniversityLegacy => {
  return university && typeof university.type === 'string' && Array.isArray(university.schools);
};

export const isUniversityAPI = (university: any): university is University => {
  return university && typeof university.university_name === 'string' && university.university_overview;
};

// Helper type for transforming API data to display format
export type UniversityTransformer = (apiData: University) => UniversityLegacy;

// University List Item for display in grid
export interface UniversityListItem {
  id: string;
  name: string;
  location: string;
  country: string;
  type: string;
  setting: string;
  researchAreas: string[];
  image: string;
  description: string;
  establishedYear: number;
  studentCount: number;
  ranking: number;
  website: string;
  address: string;
  phone: string;
  email: string;
}
