  import { axiosPublicInstance } from "@/api/axois-config";
import { University } from "@/types/university";

  export interface UniversityQueryParams {
    search?: string;
    country?: string;
    area_type?: string;
    type?: string;
  }

  export const websiteUniversityAPI = {
    fetchFeaturedUniversities: async (params: { limit?: number } = {}): Promise<{ data: University[] }> => {
      try {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append('limit', params.limit.toString());
        const response = await axiosPublicInstance.get(`/website/featured-universities?${queryParams.toString()}`);
        const mappedData = response.data.map((uni: any) => ({
          ...uni,
          displayName: uni.university_name,
          logoImage: uni.logo,
          country: uni.overview?.country,
        }));
        return { data: mappedData };
      } catch (error) {
        console.error('Error fetching universities:', error);
        throw error;
      }
    },
    fetchUniversities: async (params: UniversityQueryParams = {}): Promise<{ data: University[] }> => {
      try {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.country) queryParams.append('country', params.country);
        if (params.area_type) queryParams.append('area_type', params.area_type);
        if (params.type) queryParams.append('type', params.type);
        const response = await axiosPublicInstance.get(`/website/universities?${queryParams.toString()}`);
        return { data: response.data || [] };
      } catch (error) {
        console.error('Error fetching universities:', error);
        throw error;
      }
    },

    fetchFilterOptions: async (): Promise<{ countries: string[], area_types: string[], university_types: string[] }> => {
      try {
          const response = await axiosPublicInstance.get('/website/universities/filters');
          return response.data;
      } catch (error) {
          console.error('Error fetching filter options:', error);
          return { countries: [], area_types: [], university_types: [] };
      }
    },
  };