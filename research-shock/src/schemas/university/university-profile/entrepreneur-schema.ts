import { z } from "zod";

const Startups = z.object({
  name: z.string().min(1, "Startup incubator name is required"),
  url: z.string().url().optional(),
});

const Hackathon = z.object({
  name: z.string().min(1, "Hackathon name is required"),
  url: z.string().url().optional(),
});

export const EntrepreneurshipSchema = z.object({
  startupIncubators: z.array(Startups).min(1, "Atleast one required"),
  annualHackathon: z.array(Hackathon).min(1, "Atleast one required"),
  successStories: z.string().optional(),
});

export type Entrepreneurship = z.infer<typeof EntrepreneurshipSchema>;
