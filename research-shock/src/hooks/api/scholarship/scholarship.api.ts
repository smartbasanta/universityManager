import { axiosPrivateInstance } from "@/api/axois-config";

const scholarshipAPIRoutes = {
  addScholarship: "/scholarship",
  getScholarshipByStatus: (status: string) => `/scholarship?status=${status}`,
  getScholarshipById: (id: string) => `/scholarship/${id}`,
  updateScholarship: (id: string) => `/scholarship/${id}`,
  deleteScholarship: (id: string) => `/scholarship/${id}`,
  updateScholarshipStatus: (id: string) => `/scholarship/${id}`,
  answerQuestion: "/scholarship/student/scholarship-answer",
   getScholarshipApplications: (scholarshipId: string, page: number = 1, limit: number = 50) => 
    `/scholarship/admin/scholarship-answers?scholarshipId=${scholarshipId}&page=${page}&limit=${limit}`,
};

interface ScholarshipApplicationResponse {
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
      label: string;
      type: string;
      required: boolean;
    };
  }>;
}
export const scholarshipAPIService = {
  addScholarship: async (scholarshipData: any) => {
    const response = await axiosPrivateInstance.post(scholarshipAPIRoutes.addScholarship, scholarshipData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  getScholarshipByStatus: async (status: string) => {
    const response = await axiosPrivateInstance.get(scholarshipAPIRoutes.getScholarshipByStatus(status));
    return response.data;
  },

  getScholarshipById: async (id: string) => {
    const response = await axiosPrivateInstance.get(scholarshipAPIRoutes.getScholarshipById(id));
    return response.data;
  },

  updateScholarship: async (scholarshipData: any) => {
    const { id, ...updateData } = scholarshipData;
    const response = await axiosPrivateInstance.patch(scholarshipAPIRoutes.updateScholarship(id), updateData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  updateScholarshipStatus: async (id: string, status: string) => {
    const response = await axiosPrivateInstance.patch(scholarshipAPIRoutes.updateScholarshipStatus(id), 
      { status }, 
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  },

  deleteScholarship: async (id: string) => {
    const response = await axiosPrivateInstance.delete(scholarshipAPIRoutes.deleteScholarship(id));
    return response.data;
  },
   answerQuestion: async (answersData: {
        answers: Array<{
          questionId: string;
          answer: string;
        }>;
      }) => {
        const response = await axiosPrivateInstance.post(
          scholarshipAPIRoutes.answerQuestion, 
          answersData,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        return response.data;
      },
        getScholarshipApplications: async (scholarshipId: string, page: number = 1, limit: number = 50): Promise<ScholarshipApplicationResponse> => {
    const response = await axiosPrivateInstance.get(
      scholarshipAPIRoutes.getScholarshipApplications(scholarshipId, page, limit)
    );
    return response.data;
  },
};
