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
  amount: string;
  deadline: string;
  eligibility: string;
  scholarshipType: string;
  degreeLevel: string;
  createApplicationForm: boolean;
  additionalQuestions: QuestionField[];
}

interface ScholarshipApplicationPreviewProps {
  formData: FormData;
  onClose: () => void;
}

export default function ScholarshipApplicationPreview({
  formData,
  onClose,
}: ScholarshipApplicationPreviewProps) {
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
            Scholarship Application Form Preview
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
                    Phone Number
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
                    <SelectItem value="doctoral">Doctoral</SelectItem>
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

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Financial Information
            </h3>

            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Family Annual Income
                </p>
                <Select>
                  <SelectTrigger className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] focus:outline-0 focus:ring-0 border-none">
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                    <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                    <SelectItem value="over-100k">Over $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="flex flex-col min-w-40 flex-1 max-w-[320px]">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Number of Dependents
                </p>
                <Input
                  type="number"
                  placeholder="Enter number"
                  className="flex w-full rounded-lg bg-[#f0f2f5] h-14 p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none"
                />
              </label>
            </div>
          </div>

          {/* Essay Questions */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Essay Questions
            </h3>

            <div className="space-y-4">
              <label className="flex flex-col">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Why do you deserve this scholarship? (500 words max)
                </p>
                <Textarea
                  placeholder="Explain why you are a good candidate for this scholarship..."
                  className="flex w-full rounded-lg bg-[#f0f2f5] min-h-[120px] p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none resize-none"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Describe your career goals and how this scholarship will help
                  you achieve them (300 words max)
                </p>
                <Textarea
                  placeholder="Describe your future plans and goals..."
                  className="flex w-full rounded-lg bg-[#f0f2f5] min-h-[120px] p-4 text-base text-[#111418] placeholder:text-[#60748a] focus:outline-0 focus:ring-0 border-none resize-none"
                />
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

          {/* Supporting Documents */}
          <div className="space-y-4">
            <h3 className="text-[#111418] text-xl font-semibold">
              Supporting Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Letter of Recommendation
                </p>
                <input
                  type="file"
                  className="block w-full text-sm text-[#111418] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e2e8f0] file:text-[#111418]"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">
                  Financial Aid Documents
                </p>
                <input
                  type="file"
                  multiple
                  className="block w-full text-sm text-[#111418] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e2e8f0] file:text-[#111418]"
                />
              </label>
            </div>
          </div>

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
                my information being used solely for scholarship review and
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
