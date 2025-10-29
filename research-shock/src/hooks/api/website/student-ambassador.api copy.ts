import { axiosPublicInstance } from "@/api/axois-config";

export interface AmbassadorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  university?: string;
}

export interface AmbassadorFilterRequest {
  // education_level: string; // Commented out as requested
  focused_area: string;
  language: string;
  university: string;
  name: string;
}

export interface Department {
  id: string;
  createdAt: string;
  updatedAt: string;
  dept_name: string;
}

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
}

export interface Ambassador {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  photo: string | null;
  status: string;
  department: Department;
  university: University;
  auth: {
    email: string;
  };
  school: string;
  linkedin: string;
  meetingLink: string;
  languages: string[];
  education: string;
  expertiseArea: string[];
  focusArea: string[];
  about: string;
  profileStatus: string;
  
  // Computed fields for display compatibility
  image?: string;
  departmentName?: string;
  universityName?: string;
  //major?: string;
}

export interface AmbassadorResponse {
  data: Ambassador[];
  total?: number;
  page?: number;
  limit?: number;
}

// Helper function to get valid image URL
const getValidImageUrl = (photo: string | null | undefined): string => {
  if (!photo || 
      photo === 'undefinedundefined' || 
      photo === 'undefined' || 
      photo === 'null' || 
      photo.trim() === '') {
    return '/ambassador-default.png';
  }
  return photo;
};

// Helper function to extract strings from filter response arrays
const extractFilterStrings = (data: any): string[] => {
  if (!Array.isArray(data)) return [];
  
  const strings: string[] = [];
  
  data.forEach(item => {
    if (typeof item === 'string') {
      strings.push(item);
    } else if (typeof item === 'object' && item !== null) {
      // Handle objects like {"focusArea":["networking"]}
      Object.values(item).forEach(value => {
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (typeof v === 'string') {
              strings.push(v);
            }
          });
        } else if (typeof value === 'string') {
          strings.push(value);
        }
      });
    }
  });
  
  // Remove duplicates and filter out empty strings
  return [...new Set(strings)].filter(str => str.trim() !== '');
};

export const websiteStudentAmbassadorAPI = {
  // Get all ambassadors (original GET endpoint)
  fetchAmbassadors: async (params: AmbassadorQueryParams = {}): Promise<AmbassadorResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }
      if (params.department) queryParams.append('department', params.department);
      if (params.university) queryParams.append('university', params.university);

      const url = `/student-ambassador/websites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosPublicInstance.get(url);
      
      // Transform the data to match display requirements
    
      const transformedData = {
        data: (response.data || []).map((ambassador: any) => ({
          ...ambassador,
          image: getValidImageUrl(ambassador.photo),
          departmentName: ambassador.department?.dept_name || 'Unknown Department',
          universityName: ambassador.department?.university?.university_name || 'Unknown University', // Fix this line
          major: ambassador.department?.dept_name || 'Unknown Department',
        })),
        total: response.data?.length || 0,
        page: params.page || 1,
        limit: params.limit || 12,
      };

      
      return transformedData;
    } catch (error) {
      console.error('Error fetching ambassadors:', error);
      throw error;
    }
  },

  // Filter ambassadors with POST request
  filterAmbassadors: async (filterData: AmbassadorFilterRequest): Promise<AmbassadorResponse> => {
    try {
      const response = await axiosPublicInstance.post('/student-ambassador/websites', filterData);
      
      // Transform the data to match display requirements
      const transformedData = {
        data: (response.data || []).map((ambassador: Ambassador) => ({
          ...ambassador,
          image: getValidImageUrl(ambassador.photo),
          departmentName: ambassador.department?.dept_name || 'Unknown Department',
          universityName: ambassador.university?.university_name || 'Unknown University',
          major: ambassador.department?.dept_name || 'Unknown Department',
        })),
        total: response.data?.length || 0,
      };
      
      return transformedData;
    } catch (error) {
      console.error('Error filtering ambassadors:', error);
      throw error;
    }
  },

  // Get focus areas for filtering
  fetchFocusAreas: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get('/student-ambassador/websites/focus_areas');
      return extractFilterStrings(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching focus areas:', error);
      return [];
    }
  },

  // Get languages for filtering
  fetchLanguages: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get('/student-ambassador/websites/languages');
      return extractFilterStrings(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  },

  // Get universities/schools for filtering
  fetchUniversities: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get('/student-ambassador/websites/schools');
      return extractFilterStrings(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
  },

  // Get single ambassador by ID (Updated to match the new schema)
  fetchAmbassadorById: async (id: string): Promise<Ambassador> => {
    try {
      const response = await axiosPublicInstance.get(`/student-ambassador/websites/ambassador/${id}`);
      
      const ambassador: Ambassador = {
        ...response.data,
        image: getValidImageUrl(response.data.photo),
        departmentName: response.data.department?.dept_name || 'Unknown Department',
        universityName: response.data.university?.university_name || 'Unknown University',
        major: response.data.department?.dept_name || 'Unknown Department',
      };
      
      return ambassador;
    } catch (error) {
      console.error('Error fetching ambassador by ID:', error);
      throw error;
    }
  },
};
