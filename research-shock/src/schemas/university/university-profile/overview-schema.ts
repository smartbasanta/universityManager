import { z } from "zod";

const AcceptanceRate = z.object({
  acceptance_rate: z
    .number()
    .min(0)
    .max(100, "Must be between 0-100")
    .refine((val) => !isNaN(val), "Value is required"),
  type: z.enum([
    "In State",
    "Out State",
    "International",
    "Transfer Student",
    "Early Decision",
  ]),
  level: z.enum(["Graduate", "Undergraduate"]),
  year: z.number({
    required_error: "Year is required",
  }),
});

export const OverviewSchema = z.object({
  acceptance_rates: z
    .array(AcceptanceRate)
    .min(1, "Atleast 1 acceptance rate is required"),

  location: z.string().min(1, "Location is required"),

  price_per_year: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),

  researchExpenditure: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),
  studentToFaculty: z.string().min(1, "Student to faculty ratio is required"),
  description: z.string().min(1, "Description is required"),
});

export type Overview = z.infer<typeof OverviewSchema>;
