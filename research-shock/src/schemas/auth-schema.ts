import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(), // <-- new field
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email("Invlalid email address"),
});

export const verifiedSchema = z
  .object({
    university_name: z
      .string({
        invalid_type_error: "University name must be string",
      })
      .min(1, "University name is required"),

    password: z
      .string({
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password must be at least 6 character long")
      .regex(/[a-z]/, "Password must contain at least one lowercase")
      .regex(/[A-Z]/, "Password must contain atleast one uppercase")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    country: z.string().min(1, "Country name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });
