import { axiosPublicInstance } from "@/api/axois-config";

// Job Query Parameters Interface
export interface JobQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  modeOfWork?: string;
  status?: string;
}

// Question Interface for Application Form
export interface JobQuestion {
  id: string;
  createdAt: string;
  updatedAt: string;
  label: string;
  type: string;
  required: boolean;
}

// University Overview Interface - NEW
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
}

// University Interface (nested in Job) - UPDATED
export interface JobUniversity {
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
  university_overview?: UniversityOverview; // NEW: Added university overview
}

// Auth Interface (job poster info)
export interface JobAuth {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  password: string;
  googleId: string | null;
  role: string;
  rToken: string;
}

// Main Job Interface
export interface Job {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  modeOfWork: string;
  hasApplicationForm: boolean;
  status: string;
  
  // Related data
  questions: JobQuestion[];
  university: JobUniversity;
  auth: JobAuth;
  
  // Computed fields for display compatibility
  displayTitle?: string;
  displayLocation?: string;
  organization?: string;
  logo?: string;
  datePosted?: string;
  jobType?: string;
}

// API Response Interface
export interface JobResponse {
  data: Job[];
  total: number;
  page: number;
  //limit: number;
  totalPages: number;
}

export interface SingleJobResponse {
  data: Job;
}

// Helper function to get valid image URL
const getValidImageUrl = (photo: string | null | undefined, defaultImage: string): string => {
  if (!photo || 
      photo === 'undefinedundefined' || 
      photo === 'undefined' || 
      photo === 'null' || 
      photo.trim() === '') {
    return defaultImage;
  }
  return photo;
};

// Helper function to calculate relative time
const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
};

// Helper function to extract filter options from job data
const extractFilterOptions = (jobs: Job[], field: keyof Job): string[] => {
  const options: string[] = [];
  
  jobs.forEach((job: Job) => {
    if (job[field]) {
      const value = job[field];
      if (typeof value === 'string' && value.trim() !== '') {
        options.push(value.trim());
      }
    }
  });
  
  // Remove duplicates and sort
  return [...new Set(options)].sort();
};

export const websiteJobsAPI = {
  // Get all jobs with filtering - UPDATED WITH FRONTEND SEARCH
  fetchJobs: async (params: JobQueryParams = {}): Promise<JobResponse> => {
    try {
      // Build query object - EXCLUDE search parameter (frontend filtering)
      const queryObject: Record<string, any> = {};
      
      if (params.page) queryObject.page = Number(params.page);
     // if (params.limit) queryObject.limit = Number(params.limit);
      
      // DON'T send search parameter to API - we'll filter on frontend
      // if (params.search && params.search.trim()) {
      //   queryObject.search = params.search.trim();
      // }
      
      // Location filter
      if (params.location) {
        queryObject.location = params.location;
      }
      
      // Employment type filter
      if (params.employmentType) {
        queryObject.employmentType = params.employmentType;
      }
      
      // Experience level filter
      if (params.experienceLevel) {
        queryObject.experienceLevel = params.experienceLevel;
      }
      
      // Mode of work filter
      if (params.modeOfWork) {
        queryObject.modeOfWork = params.modeOfWork;
      }
      
      // Status filter (default to Live jobs)
      if (params.status) {
        queryObject.status = params.status;
      }

      const url = `/jobs/website`;
      console.log('Fetching jobs with URL:', url);
      console.log('Query params:', queryObject);
      
      const response = await axiosPublicInstance.get<JobResponse>(url, {
        params: queryObject // Pass as params object to axios
      });
      
      // Get all jobs from API first
      let jobs = response.data.data || [];

      // FRONTEND SEARCH FILTERING - Filter by job title only
      if (params.search && params.search.trim()) {
        const searchTerm = params.search.toLowerCase().trim();
        console.log('Frontend filtering for search term:', searchTerm);
        
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm)
        );
        
        console.log(`Filtered from ${response.data.data?.length || 0} to ${jobs.length} jobs`);
      }
      
      // Transform the filtered data to match display requirements
      const transformedData: JobResponse = {
        data: jobs.map((job: Job) => ({
          ...job,
          displayTitle: job.title || 'Untitled Job',
          displayLocation: job.location || 'Location not specified',
          organization: job.university?.university_name || 'Unknown Organization',
          logo: getValidImageUrl(job.university?.logo || job.university?.banner, '/no-image.jpg'),
          datePosted: job.createdAt?.split('T')[0] || job.createdAt,
          jobType: job.employmentType || 'Full Time',
        })),
        total: jobs.length, // Update total to reflect filtered results
        page: response.data.page || 1,
      //  limit: response.data.limit || 10,
        totalPages: Math.ceil(jobs.length / 10),
      };
      
      console.log('Final jobs returned:', transformedData.data.length);
      return transformedData;
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      throw error;
    }
  },

  // Get single job by ID
  fetchJobById: async (id: string): Promise<Job> => {
    try {
      const url = `/jobs/website/jobs/${id}`;
      console.log('Fetching job with URL:', url);
      
      const response = await axiosPublicInstance.get<Job>(url);
      
      const jobData = response.data;
      
      if (!jobData) {
        throw new Error('Job not found');
      }
      
      // Transform the data to match display requirements
      const transformedJob: Job = {
        ...jobData,
        displayTitle: jobData.title || 'Untitled Job',
        displayLocation: jobData.location || 'Location not specified',
        organization: jobData.university?.university_name || 'Unknown Organization',
        logo: getValidImageUrl(jobData.university?.logo || jobData.university?.banner, '/no-image.jpg'),
       datePosted: jobData.createdAt?.split('T')[0] || jobData.createdAt,
        jobType: jobData.employmentType || 'Full Time',
      };
      
      console.log('Job fetched:', transformedJob.title);
      return transformedJob;
    } catch (error: any) {
      console.error('Error fetching job by ID:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      throw error;
    }
  },

  // Get locations for filtering
  fetchLocations: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<JobResponse>('/jobs/website', {
        //params: { limit: 100 } // Get more results for filter options
      });
      const jobs: Job[] = response.data?.data || [];
      
      const locations = extractFilterOptions(jobs, 'location');
      
      return locations;
    } catch (error: any) {
      console.error('Error fetching locations:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return [];
    }
  },

  // Get employment types for filtering
  fetchEmploymentTypes: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<JobResponse>('/jobs/website', {
       // params: { limit: 100 }
      });
      const jobs: Job[] = response.data?.data || [];
      
      const employmentTypes = extractFilterOptions(jobs, 'employmentType');
      
      const defaultTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
      const combinedTypes = [...new Set([...employmentTypes, ...defaultTypes])];
      
      return combinedTypes.sort();
    } catch (error: any) {
      console.error('Error fetching employment types:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return ['Full-time', 'Part-time', 'Contract', 'Internship'];
    }
  },

  // Get experience levels for filtering
  fetchExperienceLevels: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<JobResponse>('/jobs/website', {
        //params: { limit: 100 }
      });
      const jobs: Job[] = response.data?.data || [];
      
      const experienceLevels = extractFilterOptions(jobs, 'experienceLevel');
      
      const defaultLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
      const combinedLevels = [...new Set([...experienceLevels, ...defaultLevels])];
      
      return combinedLevels.sort();
    } catch (error: any) {
      console.error('Error fetching experience levels:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
    }
  },

  // Get modes of work for filtering
  fetchModesOfWork: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<JobResponse>('/jobs/website', {
       // params: { limit: 100 }
      });
      const jobs: Job[] = response.data?.data || [];
      
      const modesOfWork = extractFilterOptions(jobs, 'modeOfWork');
      
      const defaultModes = ['Onsite', 'Online', 'Hybrid'];
      const combinedModes = [...new Set([...modesOfWork, ...defaultModes])];
      
      return combinedModes.sort();
    } catch (error: any) {
      console.error('Error fetching modes of work:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return ['Onsite', 'Online', 'Hybrid'];
    }
  },

  // Get organizations (universities) for filtering
  fetchOrganizations: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<JobResponse>('/jobs/website', {
       // params: { limit: 100 }
      });
      const jobs: Job[] = response.data?.data || [];
      
      const organizations: string[] = [];
      
      jobs.forEach((job: Job) => {
        if (job.university?.university_name && job.university.university_name.trim() !== '') {
          organizations.push(job.university.university_name.trim());
        }
      });
      
      const uniqueOrganizations = [...new Set(organizations)].sort();
      
      return uniqueOrganizations;
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return [];
    }
  },

  // Simplified test function - no parameters
  fetchJobsSimple: async (): Promise<JobResponse> => {
    try {
      console.log('Fetching jobs without any parameters...');
      
      const response = await axiosPublicInstance.get<JobResponse>('/jobs/website/jobs');
      
      console.log('Simple API Response:', response.data);
      
      // Transform the data
      const transformedData: JobResponse = {
        data: (response.data.data || []).map((job: Job) => ({
          ...job,
          displayTitle: job.title || 'Untitled Job',
          displayLocation: job.location || 'Location not specified',
          organization: job.university?.university_name || 'Unknown Organization',
          logo: getValidImageUrl(job.university?.logo || job.university?.banner, '/no-image.jpg'),
          datePosted: job.createdAt?.split('T')[0] || job.createdAt,

          jobType: job.employmentType || 'Full Time',
        })),
        total: response.data.total || 0,
        page: response.data.page || 1,
       // limit: response.data.limit || 10,
        totalPages: response.data.totalPages || 1,
      };
      
      return transformedData;
    } catch (error: any) {
      console.error('Error in simple fetch:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      throw error;
    }
  },
};
