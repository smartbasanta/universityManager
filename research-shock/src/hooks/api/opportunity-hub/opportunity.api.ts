import { axiosPrivateInstance } from "@/api/axois-config";

const opportunityAPIRoutes = {
  addOpportunity: "/opportunity",
  getOpportunitiesByStatus: (status: string) => `/opportunity?status=${status}`,
  getOpportunityById: (id: string) => `/opportunity/${id}`,
  updateOpportunity: (id: string) => `/opportunity/${id}`,
  deleteOpportunity: (id: string) => `/opportunity/${id}`,
  updateOpportunityStatus: (id: string) => `/opportunity/${id}`,
  answerQuestion: "/opportunity/answer-question",
   getApplications: (opportunityId: string, page: number = 1, limit: number = 50) => 
    `/opportunity/answer-question?opportunityId=${opportunityId}&page=${page}&limit=${limit}`, 

};

interface ApplicationResponse {
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
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
      label: string;
      type: string;
      required: boolean;
    };
    answer: string;
  }>;
}

export const opportunityAPIService = {
  addOpportunity: async (opportunityData: any) => {
    const response = await axiosPrivateInstance.post(opportunityAPIRoutes.addOpportunity, opportunityData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  getOpportunitiesByStatus: async (status: string) => {
    const response = await axiosPrivateInstance.get(opportunityAPIRoutes.getOpportunitiesByStatus(status));
    return response.data;
  },

  getOpportunityById: async (id: string) => {
    const response = await axiosPrivateInstance.get(opportunityAPIRoutes.getOpportunityById(id));
    return response.data;
  },

  updateOpportunity: async (opportunityData: any) => {
    const { id, ...updateData } = opportunityData;
    const response = await axiosPrivateInstance.patch(opportunityAPIRoutes.updateOpportunity(id), updateData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  updateOpportunityStatus: async (id: string, status: string) => {
    const response = await axiosPrivateInstance.patch(opportunityAPIRoutes.updateOpportunityStatus(id), 
      { status }, 
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  },

  deleteOpportunity: async (id: string) => {
    const response = await axiosPrivateInstance.delete(opportunityAPIRoutes.deleteOpportunity(id));
    return response.data;
  },
   answerQuestion: async (answersData: {
    answers: Array<{
      questionId: string;
      answer: string;
    }>;
  }) => {
    const response = await axiosPrivateInstance.post(
      opportunityAPIRoutes.answerQuestion, 
      answersData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  },
   getApplications: async (opportunityId: string, page: number = 1, limit: number = 50): Promise<ApplicationResponse> => {
    const response = await axiosPrivateInstance.get(
      opportunityAPIRoutes.getApplications(opportunityId, page, limit)
    );
    return response.data;
  },
};
