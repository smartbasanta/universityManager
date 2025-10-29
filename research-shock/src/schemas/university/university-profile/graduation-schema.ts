import { z } from "zod";

const YearlyRate = z.object({
  rate: z.number().min(0).max(100, "Must be between 0 and 100"),
  description: z.string().min(1, "Description is required"),
});

const YearlyEarnings = z.object({
  value: z.number().min(0, "Must be a positive number"),
  description: z.string().min(1, "Description is required"),
});

export const GraduationSchema = z.object({
  graduation_rate: z
    .array(YearlyRate)
    .min(1, "At least one graduation rate entry is required"),
  employment_rate: z
    .array(YearlyRate)
    .min(1, "At least one employment rate entry is required"),
  median_earnings: z
    .array(YearlyEarnings)
    .min(1, "At least one earnings entry is required"),
});

export type Graduation = z.infer<typeof GraduationSchema>;
