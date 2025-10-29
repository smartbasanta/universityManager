"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface QuestionField {
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "file";
  options?: string;
  required: boolean;
}

interface FormData {
  title: string;
  description: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  createJobForm: boolean;
  additionalQuestions: QuestionField[];
}

interface JobApplicationPreviewProps {
  formData: FormData;
  onClose: () => void;
}

export default function JobApplicationPreview({
  formData,
  onClose,
}: JobApplicationPreviewProps) {
  const renderAdditionalQuestion = (question: QuestionField, index: number) => {
    const { label, type, options } = question;
    const optionsList = options
      ? options
          .split(",")
          .map((opt) => opt.trim())
          .filter(Boolean)
      : [];

    switch (type) {
      case "text":
        return (
          <div key={index} className="space-y-2">
            <label className="text-[#111418] text-base font-medium leading-normal">
              {label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </label>
            <Input
              placeholder={`Enter ${label.toLowerCase()}`}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={index} className="space-y-2">
            <label className="text-[#111418] text-base font-medium leading-normal">
              {label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              placeholder={`Enter ${label.toLowerCase()}`}
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] min-h-24 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            />
          </div>
        );

      case "select":
        return (
          <div key={index} className="space-y-2">
            <label className="text-[#111418] text-base font-medium leading-normal">
              {label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </label>
            <Select>
              <SelectTrigger className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {optionsList.map((option, optIndex) => (
                  <SelectItem key={optIndex} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "radio":
        return (
          <div key={index} className="space-y-2">
            <label className="text-[#111418] text-base font-medium leading-normal">
              {label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {optionsList.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question_${index}`}
                    value={option}
                    className="form-radio text-[#111418]"
                  />
                  <span className="text-[#111418] text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div key={index} className="space-y-2">
            <label className="text-[#111418] text-base font-medium leading-normal">
              {label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {optionsList.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    className="form-checkbox text-[#111418]"
                  />
                  <span className="text-[#111418] text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "file":
        return (
          <div key={index} className="space-y-2">
            <label className="text-[#111418] text-base font-medium leading-normal">
              {label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              className="block w-full text-sm text-[#111418] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e2e8f0] file:text-[#111418]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-[#111418] text-2xl font-bold">
            Job Application Form Preview
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Personal Information
            </h3>

            <div className="space-y-4">
              <div className="flex max-w-[480px] flex-wrap items-end gap-4">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Full Name
                  </p>
                  <Input
                    placeholder="Enter your full name"
                    className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Email
                  </p>
                  <Input
                    placeholder="Enter email"
                    className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Phone Number (for SMS updates)
                  </p>
                  <Input
                    placeholder="Enter phone number"
                    className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Date of Birth
                  </p>
                  <Input
                    type="date"
                    className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] focus:outline-0 focus:ring-0 border-none"
                  />
                </label>
                <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Country of Citizenship
                  </p>
                  <Input
                    placeholder="Enter country"
                    className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    Are you willing to relocate?
                  </p>
                  <Select>
                    <SelectTrigger className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] focus:outline-0 focus:ring-0 border-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                    How do you hear about this role?
                  </p>
                  <Select>
                    <SelectTrigger className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] focus:outline-0 focus:ring-0 border-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="career-site">Career Site</SelectItem>
                      <SelectItem value="school">At school/College</SelectItem>
                      <SelectItem value="advertisement">
                        Advertisement
                      </SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="person">From a person</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
            </div>
          </div>

          {/* Voluntary Equal Employment Opportunity (EEO) Self-Identification */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Voluntary Equal Employment Opportunity (EEO) Self-Identification
            </h3>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Gender
                </p>
                <Select>
                  <SelectTrigger className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] focus:outline-0 focus:ring-0 border-none">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Are you Hispanic or Latino?
                </p>
                <Select>
                  <SelectTrigger className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] focus:outline-0 focus:ring-0 border-none">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="prefer-not-to-answer">
                      Prefer not to answer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div className="flex max-w-[480px] flex-wrap items-end gap-4">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Race
                </p>
                <Select>
                  <SelectTrigger className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] focus:outline-0 focus:ring-0 border-none">
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="american-indian">
                      American Indian or Alaska Native
                    </SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="black">
                      Black or African American
                    </SelectItem>
                    <SelectItem value="native-hawaiian">
                      Native Hawaiian or Other Pacific Islander
                    </SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="two-or-more">
                      Two or more races
                    </SelectItem>
                    <SelectItem value="prefer-not-to-answer">
                      Prefer not to answer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Academic Information
            </h3>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Current Level
                </p>
                <Select>
                  <SelectTrigger className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] focus:outline-0 focus:ring-0 border-none">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Current School
                </p>
                <Input
                  placeholder="Enter school name"
                  className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  GPA
                </p>
                <Input
                  placeholder="Enter GPA"
                  className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                />
              </label>
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Major/Field of Study
                </p>
                <Input
                  placeholder="Enter field of study"
                  className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Upload Transcript
                </p>
                <input
                  type="file"
                  className="block w-full text-sm text-[#111418] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e2e8f0] file:text-[#111418]"
                />
              </label>
            </div>
          </div>

          {/* Work Eligibility */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Work Eligibility
            </h3>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col max-w-[660px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Have you previously applied to this company or any subsidiary
                  or affiliate?
                </p>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="appliedCompany"
                      value="Yes"
                      className="form-radio text-[#111418]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="appliedCompany"
                      value="No"
                      className="form-radio text-[#111418]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col max-w-[660px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Have you previously been employed by this company (including
                  subsidiaries)?
                </p>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="employedCompany"
                      value="Yes"
                      className="form-radio text-[#111418]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="employedCompany"
                      value="No"
                      className="form-radio text-[#111418]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col max-w-[660px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Are you able to work in the country without visa sponsorship?
                </p>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="visaSponsorship"
                      value="Yes"
                      className="form-radio text-[#111418]"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="visaSponsorship"
                      value="No"
                      className="form-radio text-[#111418]"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Work Experience
            </h3>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Upload Resume
                </p>
                <input
                  type="file"
                  className="block w-full text-sm text-[#111418] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e2e8f0] file:text-[#111418]"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Title/Position
                </p>
                <Input
                  placeholder="e.g., Intern, Research Assistant"
                  className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                />
              </label>
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Company/Organization
                </p>
                <Input
                  placeholder="e.g., NASA, Google"
                  className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                />
              </label>
            </div>

            <div className="flex flex-wrap">
              <label className="flex flex-col min-w-40 flex-1 max-w-[660px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Describe Your Work / Responsibilities
                </p>
                <Textarea
                  placeholder="Summarize what you did..."
                  className="flex w-full rounded-lg bg-[#f0f2f5] min-h-[120px] p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none resize-none"
                />
              </label>
            </div>
          </div>

          {/* Voluntary Self-Identification of Disability */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Voluntary Self-Identification of Disability
            </h3>

            <div className="flex flex-col gap-4 max-w-[480px]">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                Do you have a disability or have you ever had a disability?
              </p>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="disabilityStatus"
                  value="yes"
                  className="form-radio text-[#111418]"
                />
                <span>
                  Yes, I have a disability (or previously had a disability)
                </span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="disabilityStatus"
                  value="no"
                  className="form-radio text-[#111418]"
                />
                <span>No, I do not have a disability</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="disabilityStatus"
                  value="prefer-not"
                  className="form-radio text-[#111418]"
                />
                <span>I do not wish to answer</span>
              </label>
            </div>
          </div>

          {/* Voluntary Self-Identification of Veteran Status */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Voluntary Self-Identification of Veteran Status
            </h3>

            <div className="flex flex-col gap-4 max-w-[480px]">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                How do you identify yourself?
              </p>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="veteranStatus"
                  value="disabled-veteran"
                  className="form-radio text-[#111418]"
                />
                <span>I am a Disabled Veteran</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="veteranStatus"
                  value="recently-separated"
                  className="form-radio text-[#111418]"
                />
                <span>
                  I am a Recently Separated Veteran (within the last 3 years)
                </span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="veteranStatus"
                  value="wartime-campaign"
                  className="form-radio text-[#111418]"
                />
                <span>
                  I am an Active Duty Wartime or Campaign Badge Veteran
                </span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="veteranStatus"
                  value="armed-forces-medal"
                  className="form-radio text-[#111418]"
                />
                <span>I am an Armed Forces Service Medal Veteran</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="veteranStatus"
                  value="veteran-other"
                  className="form-radio text-[#111418]"
                />
                <span>
                  I am a Veteran, but not in any of the above categories
                </span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="veteranStatus"
                  value="not-a-veteran"
                  className="form-radio text-[#111418]"
                />
                <span>I am not a Veteran</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="veteranStatus"
                  value="prefer-not"
                  className="form-radio text-[#111418]"
                />
                <span>I do not wish to answer</span>
              </label>
            </div>
          </div>

          {/* Additional Questions */}
          {formData.additionalQuestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[#111418] text-xl font-semibold">
                Additional Questions
              </h3>
              <div className="space-y-4">
                {formData.additionalQuestions.map((question, index) =>
                  renderAdditionalQuestion(question, index)
                )}
              </div>
            </div>
          )}

          {/* Consent & Declaration */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Consent & Declaration
            </h3>

            <div className="flex flex-col gap-2 text-sm text-[#111418]">
              <label className="flex items-start gap-2">
                <input type="checkbox" name="consent1" required />I certify that
                all information provided is true and complete to the best of my
                knowledge.
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" name="consent2" required />I consent to
                my information being used solely for job review and
                communication.
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" name="consent3" required />I understand
                that submission does not guarantee selection.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button className="flex min-w-[200px] items-center justify-center rounded-lg h-12 px-8 bg-[#198754] text-white text-base font-bold hover:bg-[#198754]/90">
              Submit Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
