"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

// Define the question field type
interface QuestionField {
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "file";
  options?: string;
  required: boolean;
}

interface AdditionalQuestionsProps {
  value: QuestionField[];
  onChange: (questions: QuestionField[]) => void;
}

const questionTypes = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "file", label: "File Upload" },
] as const;

export default function AdditionalQuestions({
  value,
  onChange,
}: AdditionalQuestionsProps) {
  const addQuestion = () => {
    const newQuestion: QuestionField = {
      label: "",
      type: "text",
      options: "",
      required: false,
    };
    onChange([...value, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = value.filter((_, i) => i !== index);
    onChange(updatedQuestions);
  };

  const updateQuestion = (index: number, field: keyof QuestionField, fieldValue: any) => {
    const updatedQuestions = value.map((question, i) => {
      if (i === index) {
        return { ...question, [field]: fieldValue };
      }
      return question;
    });
    onChange(updatedQuestions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[#111418] text-xl font-semibold leading-normal">
          Create Additional Questions
        </h3>
        <Button
          type="button"
          onClick={addQuestion}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#198754] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#198754]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {value.map((question, index) => (
          <div key={index} className="space-y-4 p-4 bg-[#f0f2f5] rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-[#111418] text-base font-medium">
                Question {index + 1}
              </h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeQuestion(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question Label */}
              <div>
                <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
                  Question Label *
                </label>
                <Input
                  placeholder="Enter question label"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-white h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={question.label}
                  onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                />
              </div>

              {/* Question Type */}
              <div>
                <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
                  Question Type *
                </label>
                <Select
                  onValueChange={(value) => updateQuestion(index, 'type', value)}
                  value={question.type}
                >
                  <SelectTrigger className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-white h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options field for select, radio, checkbox */}
            {(question.type === "select" ||
              question.type === "radio" ||
              question.type === "checkbox") && (
              <div>
                <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
                  Options (comma-separated) *
                </label>
                <Input
                  placeholder="e.g., Option 1, Option 2, Option 3"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-white h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={question.options || ""}
                  onChange={(e) => updateQuestion(index, 'options', e.target.value)}
                />
              </div>
            )}

            {/* Required checkbox */}
            <div className="flex flex-row items-center space-x-3 space-y-0">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                className="form-checkbox text-[#111418] h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-[#111418] text-base font-medium leading-normal">
                Required field
              </label>
            </div>
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center py-8 text-[#60748a]">
            <p>No additional questions created yet.</p>
            <p className="text-sm">
              Click &quot;Add Question&quot; to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
