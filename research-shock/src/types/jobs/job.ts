// Job Query Parameters Interface - Enhanced for mobile filtering
export interface JobQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  modeOfWork?: string;
  status?: string;
  // Mobile-specific parameters
  sortBy?: 'date' | 'relevance' | 'title' | 'location';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  remote?: boolean; // Quick filter for remote jobs
}

// Question Interface for Application Form - Enhanced with mobile display options
export interface JobQuestion {
  id: string;
  createdAt: string;
  updatedAt: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date' | 'email' | 'phone';
  required: boolean;
  // Mobile-specific properties
  placeholder?: string;
  options?: string[]; // For select, radio, checkbox types
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    fileTypes?: string[]; // For file uploads
    maxFileSize?: number; // In MB
  };
  displayOrder?: number;
  mobileOptimized?: boolean; // Indicates if question is mobile-friendly
}

// University Interface (nested in Job) - Enhanced with mobile assets
export interface JobUniversity {
  id: string;
  createdAt: string;
  updatedAt: string;
  university_name: string;
  banner: string | null;
  logo: string | null;
  // Mobile-specific image assets
  mobileLogo?: string | null; // Smaller logo for mobile
  favicon?: string | null;
  address: string | null;
  website: string | null;
  status: 'active' | 'inactive' | 'pending';
  country: string;
  description: string | null;
  // Additional mobile-friendly fields
  shortName?: string; // Abbreviated name for mobile display
  contactEmail?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

// Auth Interface (job poster info) - Enhanced security
export interface JobAuth {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  password: string; // Note: Should be hashed, never exposed to frontend
  googleId: string | null;
  role: 'admin' | 'recruiter' | 'hr' | 'university_admin';
  rToken: string;
  // Additional fields for mobile context
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  lastLogin?: string;
  isActive?: boolean;
}

// Employment Type Union for better type safety
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary' | 'Freelance';

// Experience Level Union
export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive' | 'Student' | 'Recent Graduate';

// Mode of Work Union
export type ModeOfWork = 'Onsite' | 'Remote' | 'Hybrid' | 'Flexible';

// Job Status Union
export type JobStatus = 'Live' | 'Closed' | 'Draft' | 'Pending' | 'Expired';

// Main Job Interface - Enhanced with mobile-responsive features
export interface Job {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  location: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  modeOfWork: ModeOfWork;
  hasApplicationForm: boolean;
  status: JobStatus;
  
  // Salary information (often important for mobile users)
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: 'hourly' | 'monthly' | 'yearly';
    negotiable?: boolean;
  };
  
  // Application deadline
  applicationDeadline?: string;
  
  // Job posting dates
  postedDate?: string;
  lastModified?: string;
  
  // Featured/Priority job
  isFeatured?: boolean;
  priority?: number;
  
  // Related data from API
  questions: JobQuestion[];
  university: JobUniversity;
  auth: JobAuth;
  
  // Computed/Display fields for UI compatibility
  displayTitle?: string;
  displayLocation?: string;
  organization?: string;
  logo?: string;
  datePosted?: string;
  jobType?: EmploymentType; // Maps to employmentType
  
  // Enhanced job details
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  requirements?: string[];
  niceToHave?: string[];
  
  // Organization details
  organizationType?: 'University' | 'Research Institute' | 'Corporate' | 'Non-profit' | 'Government';
  organizationDescription?: string;
  employeeCount?: string;
  organizationSize?: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  
  // Application information
  applicationInstructions?: string;
  contactEmail?: string;
  applicationUrl?: string;
  
  // Mobile-specific fields
  isSelected?: boolean;
  viewCount?: number;
  applicationCount?: number;
  
  // SEO and search optimization
  tags?: string[];
  keywords?: string[];
  
  // Mobile display optimization
  shortDescription?: string; // Truncated description for mobile cards
  mobileBanner?: string; // Mobile-optimized banner image
  
  // Application tracking
  userHasApplied?: boolean;
  applicationStatus?: 'not_applied' | 'applied' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted';
}

// Search Filters Interface - Enhanced for mobile
export interface SearchFilters {
  query: string;
  modeOfWork: string;
  datePosted: string;
  experienceLevel: string;
  jobType: string; // Maps to employmentType in API
  applicationMethod: string;
  
  // Additional mobile-friendly filters
  location?: string;
  salaryRange?: {
    min?: number;
    max?: number;
  };
  remoteFriendly?: boolean;
  hasApplicationForm?: boolean;
  organizationType?: string;
  postedWithin?: '24h' | '7d' | '30d' | '90d';
  
  // Mobile UI state
  activeFilters?: string[]; // Track which filters are currently applied
  quickFilters?: {
    remote: boolean;
    partTime: boolean;
    internship: boolean;
    recentGrad: boolean;
  };
}

// Mobile-specific interfaces
export interface MobileJobCard {
  job: Job;
  layout: 'vertical' | 'horizontal' | 'compact';
  showOrganization?: boolean;
  showSalary?: boolean;
  showDescription?: boolean;
  maxDescriptionLength?: number;
}

export interface MobileFilterState {
  isOpen: boolean;
  activeSection?: 'search' | 'location' | 'type' | 'experience' | 'salary';
  appliedFiltersCount: number;
}

// API Response Interfaces - Enhanced with pagination metadata
export interface JobResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Mobile-specific metadata
  mobileOptimized?: boolean;
  recommendedPageSize?: number;
  
  // Search/filter metadata
  searchQuery?: string;
  appliedFilters?: Partial<SearchFilters>;
  suggestedFilters?: string[];
}

export interface SingleJobResponse {
  data: Job;
  // Related jobs for mobile "More Like This" section
  relatedJobs?: Job[];
  // Mobile-specific metadata
  isMobileOptimized?: boolean;
  shareUrl?: string;
}

// Filter Options Interface (for dropdowns)
export interface FilterOptions {
  employmentTypes: { value: EmploymentType; label: string; count?: number }[];
  experienceLevels: { value: ExperienceLevel; label: string; count?: number }[];
  modesOfWork: { value: ModeOfWork; label: string; count?: number }[];
  locations: { value: string; label: string; count?: number }[];
  organizationTypes: { value: string; label: string; count?: number }[];
  
  // Mobile-specific quick filters
  quickFilters: {
    remote: { active: boolean; count: number };
    partTime: { active: boolean; count: number };
    internship: { active: boolean; count: number };
    recentGrad: { active: boolean; count: number };
  };
}

// Job Application Interface
export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted';
  submittedAt: string;
  responses: {
    questionId: string;
    answer: string | string[] | File;
  }[];
  
  // Mobile-specific fields
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  submissionSource?: 'mobile_app' | 'mobile_web' | 'desktop_web';
}

// Error handling for mobile
export interface JobAPIError {
  message: string;
  code: string;
  statusCode: number;
  // Mobile-specific error handling
  isMobileSpecific?: boolean;
  retryable?: boolean;
  userFriendlyMessage?: string;
}
