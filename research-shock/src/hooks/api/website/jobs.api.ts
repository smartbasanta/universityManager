import { axiosPublicInstance } from "@/api/axois-config";

// Interface matches the NestJS JobEntity response
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  university?: {
    university_name: string;
  };
  institution?: {
    name: string;
  };
  // Add other fields from your entity as needed
}

export const websiteJobsAPI = {
  fetchJobs: async (params: { limit?: number } = {}): Promise<{ data: any[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await axiosPublicInstance.get(`/website/jobs?${queryParams.toString()}`);

      const mappedData = response.data.map((job: Job) => ({
        ...job,
        id: job.id,
        description: job.description,
        displayTitle: job.title,
        displayLocation: job.location,
        employmentType: job.employmentType,
        organization: job.university?.university_name || job.institution?.name || 'Unknown',
        jobType: job.employmentType,
      }));
      return { data: mappedData };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },
};