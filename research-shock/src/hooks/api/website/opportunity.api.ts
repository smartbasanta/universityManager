import { axiosPublicInstance } from "@/api/axois-config";

// Interface matches the NestJS OpportunityEntity response
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  startDateTime: string;
  endDateTime: string;
  university?: {
    university_name: string;
  };
}

export const websiteOpportunitiesAPI = {
  fetchOpportunities: async (params: { limit?: number } = {}): Promise<{ data: any[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await axiosPublicInstance.get(`/website/opportunities?${queryParams.toString()}`);

      const mappedData = response.data.map((op: Opportunity) => {
        const now = new Date();
        const start = new Date(op.startDateTime);
        const end = new Date(op.endDateTime);
        const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...op,
          id: op.id,
          description: op.description,
          displayTitle: op.title,
          typeDisplay: op.type,
          duration: `${diffDays} days`,
          organization: op.university?.university_name || 'General',
          isOngoing: now >= start && now <= end,
          isUpcoming: now < start,
          startDate: start.toLocaleDateString(),
        };
      });
      return { data: mappedData };
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      throw error;
    }
  },
};