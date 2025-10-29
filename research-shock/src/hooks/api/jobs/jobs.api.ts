import { axiosPrivateInstance } from "@/api/axois-config";

const jobsAPIRoutes = {
  addJob: "/jobs",
  getJobsByStatus: (status: string) => `/jobs?status=${status}`,
  getJobById: (id: string) => `/jobs/${id}`,
  updateJob: (id: string) => `/jobs/${id}`,
  deleteJob: (id: string) => `/jobs/${id}`,
  updateJobStatus: (id: string) => `/jobs/${id}`,
  answerQuestion: "/jobs/student/job-answer",
   getJobApplications: (jobId: string, page: number = 1, limit: number = 50) => 
    `/jobs/admin/job-answers?jobId=${jobId}&page=${page}&limit=${limit}`,
};
interface JobApplicationResponse {
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    answer: string;
    createdAt: string;
    student: {
      id: string;
      createdAt: string;
      updatedAt: string;
      name: string;
      address: string;
      photo: string;
      phone: string;
      date_of_birth: string;
    };
    question: {
      id: string;
      createdAt: string;
      updatedAt: string;
      label: string;
      type: string;
      required: boolean;
    };
  }>;
}


export const jobsAPIService = {
  addJob: async (jobData: any) => {
    const response = await axiosPrivateInstance.post(jobsAPIRoutes.addJob, jobData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  getJobsByStatus: async (status: string) => {
    const response = await axiosPrivateInstance.get(jobsAPIRoutes.getJobsByStatus(status));
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await axiosPrivateInstance.get(jobsAPIRoutes.getJobById(id));
    return response.data;
  },

  updateJob: async (jobData: any) => {
    const { id, ...updateData } = jobData;
    const response = await axiosPrivateInstance.patch(jobsAPIRoutes.updateJob(id), updateData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  updateJobStatus: async (id: string, status: string) => {
    const response = await axiosPrivateInstance.patch(jobsAPIRoutes.updateJobStatus(id), 
      { status }, 
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await axiosPrivateInstance.delete(jobsAPIRoutes.deleteJob(id));
    return response.data;
  },
    answerQuestion: async (answersData: {
      answers: Array<{
        questionId: string;
        answer: string;
      }>;
    }) => {
      const response = await axiosPrivateInstance.post(
        jobsAPIRoutes.answerQuestion, 
        answersData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      return response.data;
    },
     getJobApplications: async (jobId: string, page: number = 1, limit: number = 50): Promise<JobApplicationResponse> => {
    const response = await axiosPrivateInstance.get(
      jobsAPIRoutes.getJobApplications(jobId, page, limit)
    );
    return response.data;
  },
};
