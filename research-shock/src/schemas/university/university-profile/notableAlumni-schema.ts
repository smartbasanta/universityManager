import { z } from "zod";

const NotableAlumni = z.object({
  alumniName: z.string().min(1, "Alumni name is required"),

  profession: z.string().min(1, "Profession is required"),
  notableAchievement: z
    .array(z.string())
    .min(1, "At least one notable achievement is required"),
});

export const NotableAlumniSchema = z.object({
  notableAlumni: z.array(NotableAlumni),
});

export type NotableAlumni = z.infer<typeof NotableAlumniSchema>;
