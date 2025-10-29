import { axiosPublicInstance } from "@/api/axois-config";

export interface MentorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  university?: string;
}

export interface MentorFilterRequest {
  // education_level: string;
  focused_area: string;
  language: string;
  university: string;
  name: string;
  // major: string;
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

export interface Mentor {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  photo: string | null;
  status: string;
  university: University;
  department: Department;
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
  company?: string;
  position?: string;
}

export interface MentorResponse {
  data: Mentor[];
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

export const websiteMentorAPI = {
  // Get all mentors (original GET endpoint)
  fetchMentors: async (params: MentorQueryParams = {}): Promise<MentorResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }
      if (params.department) queryParams.append('department', params.department);
      if (params.university) queryParams.append('university', params.university);

      const url = `/mentor/websites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosPublicInstance.get(url);
      
      // Transform the data to match display requirements
      const transformedData = {
        data: (response.data || []).map((mentor: Mentor) => ({
          ...mentor,
          image: getValidImageUrl(mentor.photo),
          departmentName: mentor.department?.dept_name || 'Unknown Department',
          universityName: mentor.university?.university_name || 'Unknown University',
          company: mentor.university?.university_name || 'Unknown Company',
          position: mentor.department?.dept_name || 'Unknown Position',
        })),
        total: response.data?.length || 0,
        page: params.page || 1,
        limit: params.limit || 12,
      };
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  },

  // Filter mentors with POST request
  filterMentors: async (filterData: MentorFilterRequest): Promise<MentorResponse> => {
    try {
      const response = await axiosPublicInstance.post('/mentor/websites', filterData);
      
      // Transform the data to match display requirements
      const transformedData = {
        data: (response.data || []).map((mentor: Mentor) => ({
          ...mentor,
          image: getValidImageUrl(mentor.photo),
          departmentName: mentor.department?.dept_name || 'Unknown Department',
          universityName: mentor.university?.university_name || 'Unknown University',
          company: mentor.university?.university_name || 'Unknown Company',
          position: mentor.department?.dept_name || 'Unknown Position',
        })),
        total: response.data?.length || 0,
      };
      
      return transformedData;
    } catch (error) {
      console.error('Error filtering mentors:', error);
      throw error;
    }
  },

  // Get focus areas for filtering
  fetchFocusAreas: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get('/mentor/websites/focus_areas');
      return extractFilterStrings(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching focus areas:', error);
      return [];
    }
  },

  // Get languages for filtering
  fetchLanguages: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get('/mentor/websites/languages');
      return extractFilterStrings(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  },

  // Get universities/schools for filtering
  fetchUniversities: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get('/mentor/websites/schools');
      return extractFilterStrings(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
  },

  // Get single mentor by ID - Updated to use correct endpoint
  fetchMentorById: async (id: string): Promise<Mentor> => {
    try {
      const response = await axiosPublicInstance.get(`/mentor/websites/mentor/${id}`);
      
      const mentor: Mentor = {
        ...response.data,
        image: getValidImageUrl(response.data.photo),
        departmentName: response.data.department?.dept_name || 'Unknown Department',
        universityName: response.data.university?.university_name || 'Unknown University',
        company: response.data.university?.university_name || 'Unknown Company',
        position: response.data.department?.dept_name || 'Unknown Position',
      };
      
      return mentor;
    } catch (error) {
      console.error('Error fetching mentor by ID:', error);
      throw error;
    }
  },
};
