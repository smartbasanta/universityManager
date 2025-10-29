import { axiosPrivateInstance } from "@/api/axois-config";

const teamsAPIRoutes = {
  getDepartments: "/departments",
  addDepartment: "/departments",
  createDepartmentStaff: "/staff/create-staff?status=department_staff",
  createUniversityStaff: "/staff/create-staff",
  activateStaffAccount: "/staff/acctivate-my-account", // Updated to match mentor structure
  getPermissionList: "/auth/get-permission-list",
  getStaff: "/staff/get-staff"
};

export const teamsAPIService = {
  getDepartments: async () => {
    const response = await axiosPrivateInstance.get(teamsAPIRoutes.getDepartments);
    return response.data;
  },

  addDepartment: async (departmentData: { dept_name: string }) => {
    const response = await axiosPrivateInstance.post(teamsAPIRoutes.addDepartment, departmentData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  createDepartmentStaff: async (staffData: { 
    name: string; 
    email: string; 
    permissionIds: string[];
    deptId: string;
  }) => {
    const response = await axiosPrivateInstance.post(teamsAPIRoutes.createDepartmentStaff, staffData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  createUniversityStaff: async (staffData: { 
    name: string; 
    email: string; 
    permissionIds: string[];
    status: string;
  }) => {
    const response = await axiosPrivateInstance.post(`${teamsAPIRoutes.createUniversityStaff}?status=${staffData.status}`, staffData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  activateStaffAccount: async (activationData: { token: string; password: string }) => {
    console.log("Sending staff activation request to:", teamsAPIRoutes.activateStaffAccount);
    console.log("Payload:", activationData);
    
    const response = await axiosPrivateInstance.post(teamsAPIRoutes.activateStaffAccount, activationData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  },

  getPermissionList: async () => {
    const response = await axiosPrivateInstance.get(teamsAPIRoutes.getPermissionList);
    return response.data;
  },
    // Method to get staff by status
  getStaff: async (status?: 'department_staff' | 'university_staff' | 'institution_staff') => {
    const url = status 
      ? `${teamsAPIRoutes.getStaff}?status=${status}`
      : teamsAPIRoutes.getStaff;
    
    const response = await axiosPrivateInstance.get(url);
    return response.data;
  },
};


