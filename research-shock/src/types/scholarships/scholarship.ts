// Search Filters Interface for Scholarships
export interface SearchFilters {
  query: string;
  educationalLevel: string;
  datePosted: string;
  fieldOfStudy: string;
  nationalityRequirement: string;
  scholarshipType: string;
}

// Legacy Scholarship interface (if you need to maintain compatibility with existing code)
export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  location: string;
  amount: string;
  educationLevel: string;
  fieldOfStudy: string;
  nationalityRequirement: string;
  applicationMethod: string;
  datePosted: string;
  deadline: string;
  logo: string;
  tags: string[];
  description: string;
  eligibility: string[];
  applicationProcess: string[];
  benefits: string[];
  organizationType: string;
  organizationDescription: string;
}
