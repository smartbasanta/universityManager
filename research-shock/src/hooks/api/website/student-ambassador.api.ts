import { axiosPublicInstance } from "@/api/axois-config";

// Interface matches the NestJS StudentAmbassadorEntity response
export interface Ambassador {
  id: string;
  name: string;
  photo: string | null;
  university?: {
    university_name: string;
  };
  department?: {
    name: string;
  };
}

export const websiteStudentAmbassadorAPI = {
  fetchAmbassadors: async (params: { limit?: number } = {}): Promise<{ data: any[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await axiosPublicInstance.get(`/website/ambassadors?${queryParams.toString()}`);
      
      const mappedData = response.data.map((amb: Ambassador) => ({
        ...amb,
        id: amb.id,
        name: amb.name,
        image: amb.photo || '/ambassador-default.png',
        universityName: amb.university?.university_name || 'N/A',
        departmentName: amb.department?.name || 'N/A',
      }));
      return { data: mappedData };
    } catch (error) {
      console.error('Error fetching ambassadors:', error);
      throw error;
    }
  },
};