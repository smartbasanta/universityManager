"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  School,
  Trophy,
  FileEdit,
  DollarSign,
  GraduationCap,
  Volleyball,
  BookText,
  UserRound,
  Microscope,
  BriefcaseBusiness,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import OverviewStep from "./overview-form";
import RankingsStep from "./ranking-form";
import AdmissionsStep from "./admission-form";
import CostStep from "./cost-form";
import MajorsStep from "./majors-form";
import SportsStep from "./sports-form";
import GraduationStep from "./graduation-form";
import {
  UniversityProfile,
  UniversityProfileFormSchema,
} from "@/schemas/university/university-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import NotableAlumniStep from "./notable-alumni-form";
import ResearchOpportunitiesStep from "./research-opportunities-form";
import EntrepreneurOpportunitiesStep from "./entrepreneur-form";

const steps = [
  { name: "Overview", icon: School },
  { name: "Rankings", icon: Trophy },
  { name: "Admissions", icon: FileEdit },
  { name: "Cost & Tuition", icon: DollarSign },
  { name: "Majors", icon: BookText },
  { name: "Sports", icon: Volleyball },
  { name: "Graduation", icon: GraduationCap },
  { name: "Notable Alumni", icon: UserRound },
  { name: "Research Hub", icon: Microscope },
  { name: "Entrepreneurship", icon: BriefcaseBusiness },
];

const stepFields = {
  0: [
    "undergrad_students",
    "acceptance_rate",
    "location",
    "price_per_year",
    "website",
    "description",
  ] as const,
  1: ["rankings"] as const,
  2: [
    "sat_range",
    "act_range",
    "sat_act_required",
    "high_school_gpa",
    "application_website",
    "admission_website",
  ] as const,
  3: [
    "in_state_tuition",
    "out_state_tuition",
    "average_aid",
    "students_receiving_aid",
    "housing_cost",
    "meal_plan_cost",
    "book_supplies_cost",
  ] as const,
  4: ["majors"] as const,
  5: ["men_sports", "women_sports"] as const,
  6: ["graduation_rate", "employment_rate", "median_earnings"] as const,
  7: ["notableAlumni"] as const,
  8: ["researchCenter", "availableTo", "fundingAvailable"] as const,
  9: [
    "startupIncubators",
    "annualHackathon",
    "studentStartupSupport",
    "successStories",
  ] as const,
} as const;

interface UniversityProfileFormProps {
  onSubmit: (values: UniversityProfile) => void;
  isLoading?: boolean;
  initialValues?: Partial<UniversityProfile>;
  program: "graduate" | "undergraduate";
}

export function UniversityProfileForm({
  onSubmit,
  isLoading,
  initialValues,
  program,
}: UniversityProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<UniversityProfile>({
    resolver: zodResolver(UniversityProfileFormSchema),
    defaultValues: {
      undergrad_students: undefined,
      acceptance_rate: undefined,
      location: "",
      price_per_year: undefined,
      website: "",
      description: "",
      rankings: [{ rank: undefined, description: "", source_link: "" }],
      sat_range: "",
      act_range: "",
      sat_act_required: "Required",
      high_school_gpa: "Required",
      application_website: "",
      admission_website: "",
      in_state_tuition: undefined,
      out_state_tuition: undefined,
      average_aid: undefined,
      students_receiving_aid: undefined,
      housing_cost: undefined,
      meal_plan_cost: undefined,
      book_supplies_cost: undefined,
      majors: [{ name: "" }],
      men_sports: [],
      women_sports: [],
      graduation_rate: undefined,
      employment_rate: undefined,
      median_earnings: undefined,
      notableAlumni: [],
      researchCenter: "",
      availableTo: "Graduate",
      fundingAvailable: "Yes",
      startupIncubators: "",
      annualHackathon: "",
      studentStartupSupport: "Yes",
      successStories: "",
      ...initialValues,
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields];
    const isStepValid = await form.trigger(fieldsToValidate);
    console.log(isStepValid);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (values: UniversityProfile) => {
    onSubmit(values);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return "Hello World";
      case 1:
        return <RankingsStep />;
      case 2:
        return <AdmissionsStep />;
      case 3:
        return <CostStep />;
      case 4:
        return <MajorsStep />;
      case 5:
        return <SportsStep />;
      case 6:
        return <GraduationStep />;
      case 7:
        return <NotableAlumniStep />;
      case 8:
        return <ResearchOpportunitiesStep />;
      case 9:
        return <EntrepreneurOpportunitiesStep />;
      default:
        return null;
    }
  };

  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
                {program === "undergraduate"
                  ? "Undergraduate Program"
                  : "Graduate Program"}
              </CardTitle>

              {/* Hide on small screens */}
              <Badge
                variant="outline"
                className="text-xs sm:text-sm font-medium sm:block hidden"
              >
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>

            {/* Progress Bar */}
            <Progress
              value={((currentStep + 1) / steps.length) * 100}
              className="h-2 mt-3"
            />

            {/* Step Indicators */}
            <div className="flex justify-between pt-5 overflow-x-auto no-scrollbar gap-2">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.name}
                    className="flex flex-col items-center group flex-shrink-0"
                    onClick={() => {
                      if (index < currentStep) {
                        setCurrentStep(index);
                      }
                    }}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full transition-colors
              ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }
              ${index < currentStep ? "cursor-pointer hover:bg-primary/90" : ""}
              w-8 h-8 sm:w-10 sm:h-10
            `}
                    >
                      {index < currentStep ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1 text-center transition-colors
              ${
                index === currentStep
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              }
              ${
                index < currentStep
                  ? "group-hover:text-primary cursor-pointer"
                  : ""
              }
            `}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <Separator className="mb-6" />

          <CardContent>
            {/* Current Step Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CurrentStepIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">
                  {steps[currentStep].name}
                </h3>
              </div>

              <div className="p-6 border rounded-lg bg-muted/20">
                {renderStep()}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep} className="gap-1">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button type="submit" loading={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Profile"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
