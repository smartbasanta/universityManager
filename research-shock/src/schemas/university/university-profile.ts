// src/schemas/university/profile-schema.ts
import { z } from "zod";

const RankingSchema = z.object({
  rank: z.number().min(1, "Rank is required"),
  description: z.string().min(1, "Description is required"),
  source_link: z.string().url("Valid URL is required"),
});

const SportSchema = z.object({
  name: z.string().min(1, "Sport name is required"),
});

const MajorSchema = z.object({
  name: z.string().min(1, "Major name is required"),
});

const NotableAlumni = z.object({
  alumniName: z.string().min(1, "Alumni name is required"),
  graduationYear: z.number().min(1, "Graduation year is required"),
  profession: z.string().min(1, "Profession is required"),
  notableAchievement: z.string().min(1, "Notable achievement is required"),
});

export const UniversityProfileFormSchema = z.object({
  // Overview Section
  undergrad_students: z
    .number()
    .min(0, "Must be a positive number")
    .refine((val) => !isNaN(val), "Value is required"),

  acceptance_rate: z
    .number()
    .min(0)
    .max(100, "Must be between 0-100")
    .refine((val) => !isNaN(val), "Value is required"),
  location: z.string().min(1, "Location is required"),
  price_per_year: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),
  website: z.string().url("Valid URL is required"),
  description: z.string().min(1, "Description is required"),

  // Ranking Section
  rankings: z.array(RankingSchema).min(1, "At least one ranking is required"),

  // Admission Section
  sat_range: z.string().min(1, "SAT range is required"),
  act_range: z.string().min(1, "ACT range is required"),
  sat_act_required: z.enum(["Required", "Not Required"]),
  high_school_gpa: z.enum([
    "Required",
    "Not Required",
    "Considered but not required",
  ]),
  application_website: z.string().url("Valid URL is required"),
  admission_website: z.string().url("Valid URL is required"),

  // Cost & Tuition
  in_state_tuition: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),
  out_state_tuition: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),
  average_aid: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),
  students_receiving_aid: z
    .number()
    .min(0)
    .max(100, "Must be between 0-100")
    .refine((val) => !isNaN(val), "Value is required"),
  housing_cost: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),
  meal_plan_cost: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),
  book_supplies_cost: z
    .number()
    .min(0, "Must be positive number")
    .refine((val) => !isNaN(val), "Value is required"),

  // Majors
  majors: z.array(MajorSchema).min(1, "At least one major is required"),

  // Sports
  men_sports: z.array(SportSchema),
  women_sports: z.array(SportSchema),

  // Graduation Rates
  graduation_rate: z.number().min(0).max(100, "Must be between 0-100"),
  employment_rate: z.number().min(0).max(100, "Must be between 0-100"),
  median_earnings: z.number().min(0, "Must be positive number"),

  //Notable Alumni
  notableAlumni: z.array(NotableAlumni),

  //Research Opportunities
  researchCenter: z.string().min(1, "Research center is required"),
  availableTo: z.enum(["Undergraduate", "Graduate", "Both"]),
  fundingAvailable: z.enum(["Yes", "No"]),

  //Entrepreneur Opportunities
  startupIncubators: z.string().min(1, "Startup incubator is required"),
  annualHackathon: z.string().min(1, "Annual hackathon is required"),
  studentStartupSupport: z.enum(["Yes", "No"]),
  successStories: z.string().optional(),
});

export type UniversityProfile = z.infer<typeof UniversityProfileFormSchema>;
