import { z } from "zod";

export const GradResearchSchema = z.object({
  research: z.array(
    z.object({
      researchCenter: z.string().min(1, "Research center is required"),
      principalInvestigator: z
        .string()
        .min(1, "Principal investigator is required"),
      projectTitle: z.string().min(1, "Project title is required"),
      fundingSource: z.string().optional(),
      publishedPaperLink: z.string().url("Must be a valid URL").optional(),
    })
  ),
});

export type GradResearch = z.infer<typeof GradResearchSchema>;
