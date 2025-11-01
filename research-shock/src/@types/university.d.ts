
export interface UniversityOverview {
  id: string;
  createdAt: string;
  updatedAt: string;
  student_faculty_ratio: string;
  research_expenditure: string | null;
  endowment: string | null;
  university_type: string;
  campus_setting: string;
  country: string;
  state: string;
  city: string;
  zip_code: string | null;
}

export interface UniversityRanking {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  year: number;
  subject: string;
  rank: string;
  source_link: string | null;
}

export interface Program {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  level: "undergraduate" | "graduate";
  description: string | null;
  duration: string | null;
  total_credits: string | null;
}

export interface Department {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  website: string | null;
  contactEmail: string | null;
  officePhone: string | null;
  programs: Program[];
}

export interface AdmissionRequirement {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  type: string;
  description: string | null;
  is_required: boolean;
  percentile_25: string | null;
  percentile_75: string | null;
}

export interface UniversityAdmission {
  id: string;
  createdAt: string;
  updatedAt: string;
  level: "undergraduate" | "graduate";
  acceptance_rate: string;
  application_deadline: string;
  application_fee: string | null;
  application_website: string | null;
  requirements: AdmissionRequirement[];
}

export interface UniversityTuition {
  id: string;
  createdAt: string;
  updatedAt: string;
  level: "undergraduate" | "graduate";
  residency: string;
  academic_year: number;
  tuition_and_fees: string;
  books_and_supplies_cost: string;
  housing_cost: string;
  meal_plan_cost: string;
  source_link: string | null;
}

export interface विश्वविद्यालय {
  id: string;
  createdAt: string;
  updatedAt: string;
  university_name: string;
  banner: string;
  logo: string;
  about: string;
  mission_statement: string | null;
  website: string;
  status: string;
  is_published: boolean;
  overview: UniversityOverview;
  rankings?: UniversityRanking[];
}

export interface UndergraduateSection {
  id: string;
  createdAt: string;
  updatedAt: string;
  university_name: string;
  banner: string;
  logo: string;
  about: string;
  mission_statement: string | null;
  website: string;
  status: string;
  is_published: boolean;
  departments: Department[];
  admissions: UniversityAdmission[];
  tuition_fees: UniversityTuition[];
  rankings: UniversityRanking[];
}

export interface GraduateSection {
  id: string;
  createdAt: string;
  updatedAt: string;
  university_name: string;
  banner: string;
  logo: string;
  about: string;
  mission_statement: string | null;
  website: string;
  status: string;
  is_published: boolean;
  departments: Department[];
  admissions: UniversityAdmission[];
  tuition_fees: UniversityTuition[];
  rankings: UniversityRanking[];
}
