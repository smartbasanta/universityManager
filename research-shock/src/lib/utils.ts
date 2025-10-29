import { ProgramDegreeType } from "@/schemas/university/program-schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const getDegreeName = (degree: ProgramDegreeType): string => {
  const degreeNames: Record<ProgramDegreeType, string> = {
    bachelor_degree: "Bachelor's Degree",
    master_degree: "Master's Degree",
    diploma_degree: "Diploma",
    doctorate_degree: "Doctorate",
    certificate_degree: "Certificate",
    phd_degree: "PhD",
  };

  return degreeNames[degree];
};
