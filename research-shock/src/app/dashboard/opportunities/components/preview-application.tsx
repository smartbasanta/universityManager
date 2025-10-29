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

interface AdditionalQuestionsPreviewProps {
  additionalQuestions: QuestionField[];
  onClose: () => void;
}

export default function AdditionalQuestionsPreview({
  additionalQuestions,
  onClose,
}: AdditionalQuestionsPreviewProps) {
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
            Additional Questions Preview
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

        <div className="p-6">
          {additionalQuestions.length > 0 ? (
            <div className="space-y-6">
              {additionalQuestions.map((question, index) =>
                renderAdditionalQuestion(question, index)
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[#60748a]">
              <p className="text-lg">No additional questions created yet.</p>
              <p className="text-sm mt-2">
                Add some questions to see the preview here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
