import { axiosPublicInstance } from "@/api/axois-config";

// Opportunity Query Parameters Interface
export interface OpportunityQueryParams {
  page?: number;
  //limit?: number;
  search?: string;
  title?: string;
  educationalLevel?: string;
  OpportunityType?: string;
  datePosted?: string;
  status?: string;
}

// Question Interface for Application Form (same as jobs/scholarships)
export interface OpportunityQuestion {
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

// University Interface (nested in Opportunity) - UPDATED
export interface OpportunityUniversity {
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

// Main Opportunity Interface
export interface Opportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  educationalLevel: string;
  venue: string;
  startDateTime: string;
  endDateTime: string;
  applicationLink: string;
  tags: string[];
  hasApplicationForm: boolean;
  questions: OpportunityQuestion[];
  teamMemberQuestions: OpportunityQuestion[];
  createdAt: string;
  updatedAt: string;
  status: string;
  
  // Related data
  university: OpportunityUniversity;
  
  // Computed fields for display compatibility
  displayTitle?: string;
  displayLocation?: string;
  organization?: string;
  logo?: string;
  datePosted?: string;
  typeDisplay?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  isUpcoming?: boolean;
  isOngoing?: boolean;
  isPast?: boolean;
}

// API Response Interface
export interface OpportunityResponse {
  data: Opportunity[];
  total: number;
  page: number;
 // limit: number;
  totalPages?: number;
}

export interface SingleOpportunityResponse {
  data: Opportunity;
}

// Helper function to get valid image URL (same as jobs/scholarships)
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

// Helper function to calculate relative time (same as jobs/scholarships)
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

// Helper function to format event dates
const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to calculate event status and duration
const calculateEventStatus = (startDate: string, endDate: string): { 
  isUpcoming: boolean; 
  isOngoing: boolean; 
  isPast: boolean; 
  duration: string; 
} => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const isUpcoming = now < start;
  const isOngoing = now >= start && now <= end;
  const isPast = now > end;
  
  // Calculate duration
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let duration = '';
  if (diffDays === 1) {
    duration = '1 day';
  } else if (diffDays < 7) {
    duration = `${diffDays} days`;
  } else {
    const weeks = Math.ceil(diffDays / 7);
    duration = `${weeks} week${weeks > 1 ? 's' : ''}`;
  }
  
  return { isUpcoming, isOngoing, isPast, duration };
};

// Helper function to extract filter options from opportunity data
const extractFilterOptions = (opportunities: Opportunity[], field: keyof Opportunity): string[] => {
  const options: string[] = [];
  
  opportunities.forEach((opportunity: Opportunity) => {
    if (opportunity[field]) {
      const value = opportunity[field];
      if (typeof value === 'string' && value.trim() !== '') {
        options.push(value.trim());
      }
    }
  });
  
  // Remove duplicates and sort
  return [...new Set(options)].sort();
};

export const websiteOpportunitiesAPI = {
  // Get all opportunities with filtering - UPDATED WITH FRONTEND SEARCH
  fetchOpportunities: async (params: OpportunityQueryParams = {}): Promise<OpportunityResponse> => {
    try {
      // Build query object - EXCLUDE search parameter (frontend filtering)
      const queryObject: Record<string, any> = {};
      
      if (params.page) queryObject.page = Number(params.page);
    //  if (params.limit) queryObject.limit = Number(params.limit);
      
      // DON'T send search parameter to API - we'll filter on frontend
      // if (params.search && params.search.trim()) {
      //   queryObject.search = params.search.trim();
      // }
      
      // Title filter (backend)
      if (params.title) {
        queryObject.title = params.title;
      }
      
      // Educational level filter
      if (params.educationalLevel) {
        queryObject.educationalLevel = params.educationalLevel;
      }
      
      // Opportunity type filter
      if (params.OpportunityType) {
        queryObject.OpportunityType = params.OpportunityType;
      }
      
      // Date posted filter
      if (params.datePosted) {
        queryObject.datePosted = params.datePosted;
      }
      
      // Status filter (default to Live opportunities)
      if (params.status) {
        queryObject.status = params.status;
      }

      const url = `/opportunity/website/opportunity`;
      console.log('Fetching opportunities with URL:', url);
      console.log('Query params:', queryObject);
      
      const response = await axiosPublicInstance.get<OpportunityResponse>(url, {
        params: queryObject // Pass as params object to axios
      });
      
      // Get all opportunities from API first
      let opportunities = response.data.data || [];

      // FRONTEND SEARCH FILTERING - Filter by opportunity title only
      if (params.search && params.search.trim()) {
        const searchTerm = params.search.toLowerCase().trim();
        console.log('Frontend filtering for search term:', searchTerm);
        
        opportunities = opportunities.filter(opportunity => 
          opportunity.title.toLowerCase().includes(searchTerm)
        );
        
        console.log(`Filtered from ${response.data.data?.length || 0} to ${opportunities.length} opportunities`);
      }
      
      // Transform the filtered data to match display requirements
      const transformedData: OpportunityResponse = {
        data: opportunities.map((opportunity: Opportunity) => {
          const eventStatus = calculateEventStatus(opportunity.startDateTime, opportunity.endDateTime);
          return {
            ...opportunity,
            displayTitle: opportunity.title || 'Untitled Opportunity',
            displayLocation: opportunity.location || 'Location not specified',
            organization: opportunity.university?.university_name || 'Unknown Organization',
            logo: getValidImageUrl(opportunity.university?.logo || opportunity.university?.banner, '/no-image.jpg'),
              datePosted:opportunity.createdAt?.split('T')[0] ||opportunity.createdAt,
            typeDisplay: opportunity.type || 'General',
            startDate: formatEventDate(opportunity.startDateTime),
            endDate: formatEventDate(opportunity.endDateTime),
            duration: eventStatus.duration,
            isUpcoming: eventStatus.isUpcoming,
            isOngoing: eventStatus.isOngoing,
            isPast: eventStatus.isPast,
          };
        }),
        total: opportunities.length, // Update total to reflect filtered results
        page: response.data.page || 1,
       // limit: response.data.limit || 10,
        totalPages: Math.ceil(opportunities.length /10),
      };
      
      console.log('Final opportunities returned:', transformedData.data.length);
      return transformedData;
    } catch (error: any) {
      console.error('Error fetching opportunities:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      throw error;
    }
  },
  
  // Get single opportunity by ID
  fetchOpportunityById: async (id: string): Promise<Opportunity> => {
    try {
      // FIXED: Updated endpoint to match the actual API
      const url = `/opportunity/${id}`;
      console.log('Fetching opportunity with URL:', url);
      
      const response = await axiosPublicInstance.get<Opportunity>(url);
      
      const opportunityData = response.data;
      
      if (!opportunityData) {
        throw new Error('Opportunity not found');
      }
      
      // Transform the data to match display requirements
      const eventStatus = calculateEventStatus(opportunityData.startDateTime, opportunityData.endDateTime);
      const transformedOpportunity: Opportunity = {
        ...opportunityData,
        displayTitle: opportunityData.title || 'Untitled Opportunity',
        displayLocation: opportunityData.location || 'Location not specified',
        organization: opportunityData.university?.university_name || 'Unknown Organization',
        logo: getValidImageUrl(opportunityData.university?.logo || opportunityData.university?.banner, '/no-image.jpg'),
        datePosted:opportunityData.createdAt?.split('T')[0] ||opportunityData.createdAt,

        typeDisplay: opportunityData.type || 'General',
        startDate: formatEventDate(opportunityData.startDateTime),
        endDate: formatEventDate(opportunityData.endDateTime),
        duration: eventStatus.duration,
        isUpcoming: eventStatus.isUpcoming,
        isOngoing: eventStatus.isOngoing,
        isPast: eventStatus.isPast,
        // Ensure questions arrays are handled properly
        questions: opportunityData.questions || [],
        teamMemberQuestions: opportunityData.teamMemberQuestions || [],
      };
      
      console.log('Opportunity fetched:', transformedOpportunity.title);
      return transformedOpportunity;
    } catch (error: any) {
      console.error('Error fetching opportunity by ID:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      throw error;
    }
  },

  // Get educational levels for filtering
  fetchEducationalLevels: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<OpportunityResponse>('/opportunity/website/opportunity', {
       // params: { limit: 100 } // Get more results for filter options
      });
      const opportunities: Opportunity[] = response.data?.data || [];
      
      const educationalLevels = extractFilterOptions(opportunities, 'educationalLevel');
      
      // FIXED: Updated default levels to match backend validation
      const defaultLevels = ['Undergrad', 'Grad', 'PhD', 'open_to_all'];
      const combinedLevels = [...new Set([...educationalLevels, ...defaultLevels])];
      
      return combinedLevels.sort();
    } catch (error: any) {
      console.error('Error fetching educational levels:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      // FIXED: Updated fallback values to match backend validation
      return ['Undergrad', 'Grad', 'PhD', 'open_to_all'];
    }
  },

  // Get opportunity types for filtering
  fetchOpportunityTypes: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<OpportunityResponse>('/opportunity/website/opportunity', {
       // params: { limit: 100 }
      });
      const opportunities: Opportunity[] = response.data?.data || [];
      
      const opportunityTypes = extractFilterOptions(opportunities, 'type');
      
      // FIXED: Updated default types to match backend validation
      const defaultTypes = ['Bootcamp', 'Research', 'Symposium', 'Startup', 'Incubation', 'Competition', 'Hackathon', 'Other'];
      const combinedTypes = [...new Set([...opportunityTypes, ...defaultTypes])];
      
      return combinedTypes.sort();
    } catch (error: any) {
      console.error('Error fetching opportunity types:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      // FIXED: Updated fallback values to match backend validation
      return ['Bootcamp', 'Research', 'Symposium', 'Startup', 'Incubation', 'Competition', 'Hackathon', 'Other'];
    }
  },

  // Get locations for filtering
  fetchLocations: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<OpportunityResponse>('/opportunity/website/opportunity', {
      //  params: { limit: 100 }
      });
      const opportunities: Opportunity[] = response.data?.data || [];
      
      const locations = extractFilterOptions(opportunities, 'location');
      
      const defaultLocations = ['In-person', 'Online', 'Hybrid'];
      const combinedLocations = [...new Set([...locations, ...defaultLocations])];
      
      return combinedLocations.sort();
    } catch (error: any) {
      console.error('Error fetching locations:', error);
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
      return ['In-person', 'Online', 'Hybrid'];
    }
  },

  // Get organizations (universities) for filtering
  fetchOrganizations: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get<OpportunityResponse>('/opportunity/website/opportunity', {
        //params: { limit: 100 }
      });
      const opportunities: Opportunity[] = response.data?.data || [];
      
      const organizations: string[] = [];
      
      opportunities.forEach((opportunity: Opportunity) => {
        if (opportunity.university?.university_name && opportunity.university.university_name.trim() !== '') {
          organizations.push(opportunity.university.university_name.trim());
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
  fetchOpportunitiesSimple: async (): Promise<OpportunityResponse> => {
    try {
      console.log('Fetching opportunities without any parameters...');
      
      const response = await axiosPublicInstance.get<OpportunityResponse>('/opportunity/website/opportunity');
      
      console.log('Simple API Response:', response.data);
      
      // Transform the data
      const transformedData: OpportunityResponse = {
        data: (response.data.data || []).map((opportunity: Opportunity) => {
          const eventStatus = calculateEventStatus(opportunity.startDateTime, opportunity.endDateTime);
          return {
            ...opportunity,
            displayTitle: opportunity.title || 'Untitled Opportunity',
            displayLocation: opportunity.location || 'Location not specified',
            organization: opportunity.university?.university_name || 'Unknown Organization',
            logo: getValidImageUrl(opportunity.university?.logo || opportunity.university?.banner, '/no-image.jpg'),
              datePosted:opportunity.createdAt?.split('T')[0] ||opportunity.createdAt,
            typeDisplay: opportunity.type || 'General',
            startDate: formatEventDate(opportunity.startDateTime),
            endDate: formatEventDate(opportunity.endDateTime),
            duration: eventStatus.duration,
            isUpcoming: eventStatus.isUpcoming,
            isOngoing: eventStatus.isOngoing,
            isPast: eventStatus.isPast,
          };
        }),
        total: response.data.total || 0,
        page: response.data.page || 1,
       // limit: response.data.limit || 10,
      //  totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / (response.data.limit || 10)),
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
