import { useMutation } from "@tanstack/react-query";
import { authAPIService } from "./auth.api";
import { toast } from "react-toastify";
import type { 
    LoginRequest, 
    LoginResponse,
    VerifyEmailRequest,
    RegisterUniversityRequest,
    RegisterInstitutionRequest,
    RegisterStudentRequest 
} from "./auth.api";

// Login hook - unchanged
export const useAuthLogin = () =>
    useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: authAPIService.login,
        onSuccess: ({ accessToken, refreshToken, role }) => {
            toast.success("Login Successful");
            console.log("Login successful for role:", role);
            // Handle tokens and routing here
        },
        onError: (error: Error) => {
            console.error("Login error:", error);
            toast.error("Login Failed: " + (error?.message || "Unknown error"));
        }
    });

// Email Verify hook - unchanged
export const useEmailVerify = () =>
    useMutation<any, Error, VerifyEmailRequest>({
        mutationFn: authAPIService.getVerify,
        onSuccess: (data) => {
            console.log("Verification email sent:", data);
            toast.success("Verification email sent!");
        },
        onError: (error: Error) => {
            console.error("Verification error:", error);
            const errorMessage = error?.message?.includes("404") 
                ? "Email verification service unavailable. Please try again later."
                : error?.message?.includes("400")
                ? "Invalid email or role. Please check your input."
                : "Verification failed: " + (error?.message || "Unknown error");
            toast.error(errorMessage);
        }
    });

// ✅ UPDATED: Register University - now expects { data, token }
export const useRegisterUniversity = () =>
    useMutation<any, Error, { data: RegisterUniversityRequest; token: string }>({
        mutationFn: ({ data, token }) => authAPIService.registerUniversity(data, token),
        onSuccess: (data) => {
            console.log("University registration successful:", data);
            toast.success("University registered successfully!");
        },
        onError: (error: Error) => {
            console.error("University registration error:", error);
            const errorMessage = error?.message?.includes("409")
                ? "University already exists with this name or email."
                : error?.message?.includes("400")
                ? "Invalid registration data. Please check all fields."
                : "Registration failed: " + (error?.message || "Unknown error");
            toast.error(errorMessage);
        }
    });

// ✅ UPDATED: Register Institution - now expects { data, token }
export const useRegisterInstitution = () =>
    useMutation<any, Error, { data: RegisterInstitutionRequest; token: string }>({
        mutationFn: ({ data, token }) => authAPIService.registerInstitution(data, token),
        onSuccess: (data) => {
            console.log("Institution registration successful:", data);
            toast.success("Institution registered successfully!");
        },
        onError: (error: Error) => {
            console.error("Institution registration error:", error);
            const errorMessage = error?.message?.includes("409")
                ? "Institution already exists with this name or email."
                : error?.message?.includes("400")
                ? "Invalid registration data. Please check all fields."
                : "Registration failed: " + (error?.message || "Unknown error");
            toast.error(errorMessage);
        }
    });
    export const useRegisterStudent = () =>
    useMutation<any, Error, { data: RegisterStudentRequest; token: string }>({
        mutationFn: ({ data, token }) => authAPIService.registerStudent(data, token),
        onSuccess: (data) => {
            console.log("Student registration successful:", data);
            toast.success("Student registered successfully!");
        },
        onError: (error: Error) => {
            console.error("Student registration error:", error);
            const errorMessage = error?.message?.includes("409")
                ? "Student already exists with this email or phone number."
                : error?.message?.includes("400")
                ? "Invalid registration data. Please check all fields."
                : error?.message?.includes("422")
                ? "Invalid data format. Please check date of birth and phone number."
                : "Registration failed: " + (error?.message || "Unknown error");
            toast.error(errorMessage);
        }
    });
