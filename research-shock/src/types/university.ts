export interface University {
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
  overview: {
    id: string;
    createdAt: string;
    updatedAt: string;
    student_faculty_ratio: string;
    research_expenditure: string | null;
    endowment: string;
    university_type: string;
    campus_setting: string;
    country: string;
    state: string;
    city: string;
    zip_code: string | null;
  };
  admissions: {
    id: string;
    createdAt: string;
    updatedAt: string;
    level: string;
    acceptance_rate: string;
    application_deadline: string;
    application_fee: string | null;
    application_website: string | null;
    requirements: {
      id: string;
      createdAt: string;
      updatedAt: string;
      name: string;
      type: string;
      description: string | null;
      is_required: boolean;
      percentile_25: string | null;
      percentile_75: string | null;
    }[];
  }[];
  tuition_fees: {
    id: string;
    createdAt: string;
    updatedAt: string;
    level: string;
    residency: string;
    academic_year: number;
    tuition_and_fees: string;
    books_and_supplies_cost: string;
    housing_cost: string;
    meal_plan_cost: string;
    source_link: string | null;
  }[];
  student_life: {
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string | null;
    number_of_organizations: number | null;
  };
  sports: {
    id: string;
    createdAt: string;
    updatedAt: string;
    athletic_division: string | null;
    conference: string | null;
    mascot: string | null;
    athletic_website: string | null;
  };
  rankings: {
    id: string;
    createdAt: string;
    updatedAt: string;
    source: string;
    year: number;
    subject: string;
    rank: string;
    source_link: string | null;
  }[];
  undergraduate_admissions: University['admissions'];
  undergraduate_tuition_fees: University['tuition_fees'];
  undergraduate_departments: University['departments'];
  graduate_admissions: University['admissions'];
  graduate_tuition_fees: University['tuition_fees'];
  graduate_departments: University['departments'];
  career_outcomes: {
    id: string;
    createdAt: string;
    updatedAt: string;
    employment_rate_6_months: number | null;
    median_starting_salary: number | null;
    report_source_url: string | null;
    report_year: number | null;
    top_employers: {
      id: string;
      createdAt: string;
      updatedAt: string;
      name: string;
      logo: string | null;
    }[];
  };
}
