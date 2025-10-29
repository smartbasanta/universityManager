import { axiosPublicInstance } from "@/api/axois-config"

const authAPIRoutes = {
    login: "/auth/signin",
    getVerify: "/auth/get-verify",
    registerUniversity: "/auth/register-university",
    registerInstitution: "/auth/register-institution",
    registerStudent: "/auth/register-student",
}

// Type definitions
interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    role: string;
}

interface VerifyEmailRequest {
    email: string;
    role: "university" | "institution" | "student";
}

interface RegisterUniversityRequest {
    password: string;
    university_name: string;
    country: string;
}

interface RegisterInstitutionRequest {
    name: string;
    password: string;
    country: string;
}
interface RegisterStudentRequest {
    password: string;
    name: string;
}


// Unified service functions for each backend action:
export const authAPIService = {
    // Login
    login: async (requestBody: LoginRequest): Promise<LoginResponse> => {
        console.log("Sending login request to:", authAPIRoutes.login);
        const res = await axiosPublicInstance.post(authAPIRoutes.login, requestBody);
        return res.data;
    },

    // Email verification for signup - FIXED: Dynamic role
    getVerify: async (requestBody: VerifyEmailRequest) => {
        console.log("Sending verification request to:", authAPIRoutes.getVerify);
        console.log("Payload:", requestBody);
        console.log("Dynamic role:", requestBody.role); // Debug log

        const res = await axiosPublicInstance.post(
            authAPIRoutes.getVerify,          // URL
            requestBody,                      // request body
            {
                headers: { "Content-Type": "application/json" },
                params: {                     // ✅ FIXED: Use dynamic role
                    role: requestBody.role    // Will be "institution" or "university"
                }
            }
        );

        return res.data;
    },

    // Register: University - Schema: { password, university_name, country } + token in headers
    registerUniversity: async (requestBody: RegisterUniversityRequest, token?: string) => {
        console.log("Sending university registration to:", authAPIRoutes.registerUniversity);
        console.log("Payload:", requestBody);
        console.log("Token:", token);
        
        const headers: any = {
            "Content-Type": "application/json"
        };
        
        // Add token to headers if provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await axiosPublicInstance.post(authAPIRoutes.registerUniversity, requestBody, {
            headers
        });
        return res.data;
    },

    // Register: Institution - Schema: { name, password, country } + token in headers
    registerInstitution: async (requestBody: RegisterInstitutionRequest, token?: string) => {
        console.log("Sending institution registration to:", authAPIRoutes.registerInstitution);
        console.log("Payload:", requestBody);
        console.log("Token:", token);
        
        const headers: any = {
            "Content-Type": "application/json"
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await axiosPublicInstance.post(authAPIRoutes.registerInstitution, requestBody, {
            headers
        });
        return res.data;
    },
    registerStudent: async (requestBody: RegisterStudentRequest, token?: string) => {
        console.log("Sending student registration to:", authAPIRoutes.registerStudent);
        console.log("Payload:", requestBody);
        console.log("Token:", token);
        
        const headers: any = {
            "Content-Type": "application/json"
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await axiosPublicInstance.post(authAPIRoutes.registerStudent, requestBody, {
            headers
        });
        return res.data;
    },
}

// Export types for use in other files if needed
export type {
    LoginRequest,
    LoginResponse,
    VerifyEmailRequest,
    RegisterUniversityRequest,
    RegisterInstitutionRequest,
    RegisterStudentRequest 
};
