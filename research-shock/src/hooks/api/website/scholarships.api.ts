import { axiosPublicInstance } from "@/api/axois-config";

// Interface matches the NestJS ScholarshipEntity response
export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  university?: {
    university_name: string;
  };
  // Add other fields from your entity as needed
}

export const websiteScholarshipsAPI = {
  fetchScholarships: async (params: { limit?: number } = {}): Promise<{ data: any[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await axiosPublicInstance.get(`/website/scholarships?${queryParams.toString()}`);

      const mappedData = response.data.map((s: Scholarship) => {
        const deadlineDate = new Date(s.deadline);
        const now = new Date();
        const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...s,
          id: s.id,
          description: s.description,
          displayTitle: s.name,
          amountDisplay: `$${s.amount.toLocaleString()}`,
          deadlineDisplay: `${diffDays > 0 ? `${diffDays} days left` : 'Expired'}`,
          isUrgent: diffDays > 0 && diffDays <= 7,
          typeDisplay: s.university?.university_name || 'General',
        };
      });
      return { data: mappedData };
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      throw error;
    }
  },
};