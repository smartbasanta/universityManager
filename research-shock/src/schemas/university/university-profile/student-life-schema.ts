import { z } from "zod";

export const CampusLifeSchema = z.object({
  description: z.string().min(1, "Description is required"),
  numberOfStudentOrganizations: z.number().int().min(0),
  clubCategories: z.array(z.string()).min(1, "At least one tag is required"),
  topCampusTraditions: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .optional(),
  offersInternationalStudentSupport: z.boolean(),
});

export type CampusLife = z.infer<typeof CampusLifeSchema>;
