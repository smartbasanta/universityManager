import { z } from "zod";

export const ScholarshipQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  max_answer_length: z.string().optional(),
});

export const ScholarshipCriteriaSchema = z.object({
  criteria_text: z.string().min(1, "Criteria cannot be empty"),
  criteria_value: z.string().min(1, "Criteria weight cannot be empty"),
});

export const ScholarshipFormSchema = z.object({
  name: z.string().min(1, "Scholarship name is required"),
  scholarship_type: z.string().min(1, "Scholarship type is required"),
  description: z.string().min(1, "Scholarship description is required"),
  currency: z.string().min(1, "Currency is required"),
  amount: z.string().min(1, "Amount is required"),
  duration: z.string().min(1, "Duration is required"),
  apply_by_date: z.date(),
  award_announcement_date: z.date(),
  scholarship_apply_link: z.string().url(),
  program: z.array(z.string()),
  general_requirement: z
    .array(z.string().min(1, "General requirement cannot be empty"))
    .min(1, "At least one requirement is required"),
  required_document: z
    .array(z.string().min(1, "Required documents cannot be empty"))
    .min(1, "At least one requirement is required"),
  benefits: z
    .array(z.string().min(1, "Benefits cannot be empty"))
    .min(1, "At least one benefit is required"),
  scholarship_criteria: z.array(ScholarshipCriteriaSchema),
  scholarship_question: z.array(ScholarshipQuestionSchema),
});

export type Scholarship = z.infer<typeof ScholarshipFormSchema>;
