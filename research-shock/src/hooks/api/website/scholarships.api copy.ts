import { axiosPublicInstance } from "@/api/axois-config";

// Scholarship Query Parameters Interface
export interface ScholarshipQueryParams {
  page?: number;
  // limit?: number; // Commented out
  search?: string;
  educationalLevel?: string;
  fieldOfStudy?: string;
  nationalityRequirement?: string;
  datePosted?: string;
  scholarshipType?: string;
  status?: string;
}

// Question Interface for Application Form (same as jobs)
export interface ScholarshipQuestion {
  id: string;
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

// University Interface (nested in Scholarship) - UPDATED
export interface ScholarshipUniversity {
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

// Auth Interface (scholarship poster info) - Same as Jobs
export interface ScholarshipAuth {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  password: string;
  googleId: string | null;
  role: string;
  rToken: string;
}

// Main Scholarship Interface
export interface Scholarship {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  amount: string;
  used_for: string[];
  deadline: string;
  link: string;
  nationality_requirement: string;
  eligibilityCriteria: string;
  fieldOfStudy: string;
  scholarshipType: string;
  educationalLevel: string;
  status: string;
  hasApplicationForm: boolean;
  isDraft: boolean;
  
  // Application form questions
  questions?: ScholarshipQuestion[];
  
  // Related data (optional - may not be present in single scholarship response)
  university?: ScholarshipUniversity;
  auth?: ScholarshipAuth;
  
  // Computed fields for display compatibility
  displayTitle?: string;
  displayLocation?: string;
  organization?: string;
  logo?: string;
  datePosted?: string;
  typeDisplay?: string;
  amountDisplay?: string;
  deadlineDisplay?: string;
  isUrgent?: boolean;
}

// API Response Interface
export interface ScholarshipResponse {
  data: Scholarship[];
  total: number;
  page: number;
  // limit: number; // Commented out
  totalPages: number;
}

export interface SingleScholarshipResponse {
  data: Scholarship;
}

// Helper function to get valid image URL (same as jobs)
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

// Helper function to calculate relative time (same as jobs)
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

// Helper function to format amount
const formatAmount = (amount: string): string => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return amount;
  
  // Assuming NPR currency for now - you can modify based on university country
  return `NPR ${numAmount.toLocaleString()}`;
};

// Helper function to format deadline and check urgency
const formatDeadline = (deadline: string): { display: string; isUrgent: boolean } => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let display = '';
  let isUrgent = false;
  
  if (diffDays < 0) {
    display = 'Expired';
  } else if (diffDays === 0) {
    display = 'Today';
    isUrgent = true;
  } else if (diffDays === 1) {
    display = 'Tomorrow';
    isUrgent = true;
  } else if (diffDays <= 7) {
    display = `${diffDays} days left`;
    isUrgent = true;
  } else if (diffDays <= 30) {
    display = `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} left`;
  } else {
    display = deadlineDate.toLocaleDateString();
  }
  
  return { display, isUrgent };
};

// Helper function to extract filter options from scholarship data
const extractFilterOptions = (scholarships: Scholarship[], field: keyof Scholarship): string[] => {
  const options: string[] = [];
  
  scholarships.forEach((scholarship: Scholarship) => {
    if (scholarship[field]) {
      const value = scholarship[field];
      if (typeof value === 'string' && value.trim() !== '') {
        options.push(value.trim());
      }
    }
  });
  
  // Remove duplicates and sort
  return [...new Set(options)].sort();
};

export const websiteScholarshipsAPI = {
  // Get all scholarships with filtering - UPDATED WITH FRONTEND SEARCH
  fetchScholarships: async (params: ScholarshipQueryParams = {}): Promise<ScholarshipResponse> => {
    try {
      // Build query object - EXCLUDE search parameter (frontend filtering)
      const queryObject: Record<string, any> = {};
      
      if (params.page) queryObject.page = Number(params.page);
      // if (params.limit) queryObject.limit = Number(params.limit); // Commented out
      
      // DON'T send search parameter to API - we'll filter on frontend
      // if (params.search && params.search.trim()) {
      //   queryObject.search = params.search.trim();
      // }
      
      // Educational level filter
      if (params.educationalLevel) {
        queryObject.educationalLevel = params.educationalLevel;
      }
      
      // Field of study filter
      if (params.fieldOfStudy) {
        queryObject.fieldOfStudy = params.fieldOfStudy;
      }
      
      // Nationality requirement filter
      if (params.nationalityRequirement) {
        queryObject.nationalityRequirement = params.nationalityRequirement;
      }
      
      // Date posted filter
      if (params.datePosted) {
        queryObject.datePosted = params.datePosted;
      }
      
      // Status filter (default to Live scholarships)
      if (params.status) {
        queryObject.status = params.status;
      }

      const url = `/scholarship/website/scholarships`;
      console.log('Fetching scholarships with URL:', url);
      console.log('Query params:', queryObject);
      
      const response = await axiosPublicInstance.get<ScholarshipResponse>(url, {
        params: queryObject // Pass as params object to axios
      });
      
      // Get all scholarships from API first
      let scholarships = response.data.data || [];

      // FRONTEND SEARCH FILTERING - Filter by scholarship title only
      if (params.search && params.search.trim()) {
        const searchTerm = params.search.toLowerCase().trim();
        console.log('Frontend filtering for search term:', searchTerm);
        
        scholarships = scholarships.filter(scholarship => 
          scholarship.title.toLowerCase().includes(searchTerm)
        );
        
        console.log(`Filtered from ${response.data.data?.length || 0} to ${scholarships.length} scholarships`);
      }

      // FRONTEND SCHOLARSHIP TYPE FILTERING (since it's not in backend)
      if (params.scholarshipType && params.scholarshipType.trim()) {
        scholarships = scholarships.filter(scholarship => 
          scholarship.scholarshipType === params.scholarshipType
        );
        console.log(`Filtered by scholarship type: ${scholarships.length} scholarships`);
      }
      
      // Transform the filtered data to match display requirements
      const transformedData: ScholarshipResponse = {
        data: scholarships.map((scholarship: Scholarship) => {
          const deadlineInfo = formatDeadline(scholarship.deadline);
          return {
            ...scholarship,
            displayTitle: scholarship.title || 'Untitled Scholarship',
            displayLocation: scholarship.university?.country || 'Location not specified',
            organization: scholarship.university?.university_name || 'Unknown Organization',
            logo: getValidImageUrl(scholarship.university?.logo || scholarship.university?.banner, '/no-image.jpg'),
           datePosted: scholarship.createdAt?.split('T')[0] || scholarship.createdAt,
            typeDisplay: scholarship.scholarshipType || 'General',
            amountDisplay: formatAmount(scholarship.amount),
            deadlineDisplay: deadlineInfo.display,
            isUrgent: deadlineInfo.isUrgent,
          };
        }),
        total: scholarships.length, // Update total to reflect filtered results
        page: response.data.page || 1,
        // limit: response.data.limit || 10, // Commented out
        totalPages: Math.ceil(scholarships.length / 10), // Using default value of 10 instead of response.data.limit
      };
      
      console.log('Final scholarships returned:', transformedData.data.length);
      return transformedData;
    } catch (error: any) {
      console.error('Error fetching scholarships:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      throw error;
    }
  },

  // Get single scholarship by ID - UPDATED FOR DIRECT API RESPONSE
  fetchScholarshipById: async (id: string): Promise<Scholarship> => {
    try {
      const url = `/scholarship/website/scholarships/${id}`;
      console.log('Fetching scholarship with URL:', url);
      
      // The API returns the scholarship object directly, not wrapped in a data property
      const response = await axiosPublicInstance.get<Scholarship>(url);
      
      const scholarshipData = response.data;
      
      if (!scholarshipData) {
        throw new Error('Scholarship not found');
      }
      
      // Transform the data to match display requirements
      const deadlineInfo = formatDeadline(scholarshipData.deadline);
      const transformedScholarship: Scholarship = {
        ...scholarshipData,
        displayTitle: scholarshipData.title || 'Untitled Scholarship',
        displayLocation: scholarshipData.university?.country || 'Location not specified',
        organization: scholarshipData.university?.university_name || 'Unknown Organization',
        logo: getValidImageUrl(scholarshipData.university?.logo || scholarshipData.university?.banner, '/no-image.jpg'),
       datePosted: scholarshipData.createdAt?.split('T')[0] || scholarshipData.createdAt,
        typeDisplay: scholarshipData.scholarshipType || 'General',
        amountDisplay: formatAmount(scholarshipData.amount),
        deadlineDisplay: deadlineInfo.display,
        isUrgent: deadlineInfo.isUrgent,
        // Ensure questions array is handled properly
        questions: scholarshipData.questions || [],
      };
      
      console.log('Scholarship fetched:', transformedScholarship.title);
      return transformedScholarship;
    } catch (error: any) {
      console.error('Error fetching scholarship by ID:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      throw error;
    }
  },

  // Get educational levels for filtering
  fetchEducationalLevels: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<ScholarshipResponse>('/scholarship/website/scholarships', {
        // params: { limit: 100 } // Commented out - Get more results for filter options
      });
      const scholarships: Scholarship[] = response.data?.data || [];
      
      const educationalLevels = extractFilterOptions(scholarships, 'educationalLevel');
      
      const defaultLevels = ['Undergrad', 'grad', 'PHD', 'open_to_all'];
      const combinedLevels = [...new Set([...educationalLevels, ...defaultLevels])];
      
      return combinedLevels.sort();
    } catch (error: any) {
      console.error('Error fetching educational levels:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return ['Undergrad', 'grad', 'PHD', 'open_to_all'];
    }
  },

  // Get fields of study for filtering
  fetchFieldsOfStudy: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<ScholarshipResponse>('/scholarship/website/scholarships', {
        // params: { limit: 100 } // Commented out
      });
      const scholarships: Scholarship[] = response.data?.data || [];
      
      const fieldsOfStudy = extractFilterOptions(scholarships, 'fieldOfStudy');
      
      const defaultFields = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Sciences'];
      const combinedFields = [...new Set([...fieldsOfStudy, ...defaultFields])];
      
      return combinedFields.sort();
    } catch (error: any) {
      console.error('Error fetching fields of study:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Sciences'];
    }
  },

  // Get nationality requirements for filtering
  fetchNationalityRequirements: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<ScholarshipResponse>('/scholarship/website/scholarships', {
        // params: { limit: 100 } // Commented out
      });
      const scholarships: Scholarship[] = response.data?.data || [];
      
      const nationalityRequirements = extractFilterOptions(scholarships, 'nationality_requirement');
      
      const defaultNationalities = ['Nepali', 'International', 'Any'];
      const combinedNationalities = [...new Set([...nationalityRequirements, ...defaultNationalities])];
      
      return combinedNationalities.sort();
    } catch (error: any) {
      console.error('Error fetching nationality requirements:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return ['Nepali', 'International', 'Any'];
    }
  },

  // Get scholarship types for filtering
  fetchScholarshipTypes: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<ScholarshipResponse>('/scholarship/website/scholarships', {
        // params: { limit: 100 } // Commented out
      });
      const scholarships: Scholarship[] = response.data?.data || [];
      
      const scholarshipTypes = extractFilterOptions(scholarships, 'scholarshipType');
      
      const defaultTypes = ['Merit Based', 'Need Based', 'Sports', 'Research', 'Minority'];
      const combinedTypes = [...new Set([...scholarshipTypes, ...defaultTypes])];
      
      return combinedTypes.sort();
    } catch (error: any) {
      console.error('Error fetching scholarship types:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return ['Merit Based', 'Need Based', 'Sports', 'Research', 'Minority'];
    }
  },

  // Get organizations (universities) for filtering
  fetchOrganizations: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<ScholarshipResponse>('/scholarship/website/scholarships', {
        // params: { limit: 100 } // Commented out
      });
      const scholarships: Scholarship[] = response.data?.data || [];
      
      const organizations: string[] = [];
      
      scholarships.forEach((scholarship: Scholarship) => {
        if (scholarship.university?.university_name && scholarship.university.university_name.trim() !== '') {
          organizations.push(scholarship.university.university_name.trim());
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
  fetchScholarshipsSimple: async (): Promise<ScholarshipResponse> => {
    try {
      console.log('Fetching scholarships without any parameters...');
      
      const response = await axiosPublicInstance.get<ScholarshipResponse>('/scholarship/website/scholarships');
      
      console.log('Simple API Response:', response.data);
      
      // Transform the data
      const transformedData: ScholarshipResponse = {
        data: (response.data.data || []).map((scholarship: Scholarship) => {
          const deadlineInfo = formatDeadline(scholarship.deadline);
          return {
            ...scholarship,
            displayTitle: scholarship.title || 'Untitled Scholarship',
            displayLocation: scholarship.university?.country || 'Location not specified',
            organization: scholarship.university?.university_name || 'Unknown Organization',
            logo: getValidImageUrl(scholarship.university?.logo || scholarship.university?.banner, '/no-image.jpg'),
            datePosted: scholarship.createdAt?.split('T')[0] || scholarship.createdAt,
            typeDisplay: scholarship.scholarshipType || 'General',
            amountDisplay: formatAmount(scholarship.amount),
            deadlineDisplay: deadlineInfo.display,
            isUrgent: deadlineInfo.isUrgent,
          };
        }),
        total: response.data.total || 0,
        page: response.data.page || 1,
        // limit: response.data.limit || 10, // Commented out
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
