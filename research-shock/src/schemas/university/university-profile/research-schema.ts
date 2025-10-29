import { z } from "zod";

const Research = z.object({
  researchCenter: z.string().min(1, "Research center is required"),
  url: z.string().url("Valid URL is required"),
});

export const ResearchSchema = z.object({
  research: z.array(Research),
});

export type ResearchHub = z.infer<typeof ResearchSchema>;
