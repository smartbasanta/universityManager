import { z } from "zod";

// Enums
export const ProgramDegree = z.enum([
  "bachelor_degree",
  "master_degree",
  "diploma_degree",
  "doctorate_degree",
  "certificate_degree",
  "phd_degree",
]);

export const StudyMode = z.enum(["full_time", "part_time", "online"]);

// Program Schema
export const ProgramSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  degree: ProgramDegree, // ensures it’s one of the enum values

  discipline: z.string().uuid("Please select a valid discipline"),

  duration: z
    .string()
    .min(2, "Duration must be specified")
    .max(50, "Duration must be less than 50 characters"),

  tutionFee: z.string().regex(/^\d+$/, "Tuition fee must be a valid number"),

  eligibilityCriteria: z
    .string()
    .min(5, "Eligibility criteria must be at least 5 characters"),

  intakePeriod: z
    .string()
    .min(2, "Intake period must be specified")
    .max(50, "Intake period must be less than 50 characters"),

  studyMode: StudyMode,

  description: z.string().min(5, "Description must be at least 5 characters"),
});

// Types
export type Program = z.infer<typeof ProgramSchema>;
export type ProgramDegreeType = z.infer<typeof ProgramDegree>;
export type StudyModeType = z.infer<typeof StudyMode>;
