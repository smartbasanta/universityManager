import { axiosPublicInstance } from "@/api/axois-config";

// Interface matches the NestJS MentorInResidenceEntity response
export interface Mentor {
  id: string;
  name: string;
  photo: string | null;
  university?: {
    university_name: string;
  };
}

export const websiteMentorAPI = {
  fetchMentors: async (params: { limit?: number } = {}): Promise<{ data: any[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await axiosPublicInstance.get(`/website/mentors?${queryParams.toString()}`);

      const mappedData = response.data.map((mentor: Mentor) => ({
        ...mentor,
        id: mentor.id,
        name: mentor.name,
        image: mentor.photo || '/mentor-default.png',
        universityName: mentor.university?.university_name || 'N/A',
      }));
      return { data: mappedData };
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  },
};