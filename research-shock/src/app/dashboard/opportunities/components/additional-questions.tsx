"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

interface Question {
  id: number;
  label: string;
  type: string;
  options: string;
  required: boolean;
}

interface AdditionalQuestionsProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
}

const questionTypes = [
  { value: "Text Input", label: "Text Input" },
  { value: "Email", label: "Email" },
  { value: "Textarea", label: "Textarea" },
  { value: "Dropdown", label: "Dropdown" },
  { value: "Radio", label: "Radio Buttons" },
  { value: "Checkbox", label: "Checkboxes" },
  { value: "File Upload", label: "File Upload" },
] as const;

export default function AdditionalQuestions({
  questions,
  setQuestions,
}: AdditionalQuestionsProps) {
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      label: "",
      type: "Text Input",
      options: "",
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
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
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-4 p-4 bg-[#f0f2f5] rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-[#111418] text-base font-medium">
                Question {index + 1}
              </h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeQuestion(question.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
                  Question Label *
                </Label>
                <Input
                  placeholder="Enter question label"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-white h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={question.label}
                  onChange={(e) => updateQuestion(question.id, 'label', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
                  Question Type *
                </Label>
                <Select
                  onValueChange={(value) => updateQuestion(question.id, 'type', value)}
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

            {(question.type === "Dropdown" ||
              question.type === "Radio" ||
              question.type === "Checkbox") && (
              <div>
                <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
                  Options (comma-separated) *
                </Label>
                <Input
                  placeholder="e.g., Option 1, Option 2, Option 3"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-white h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={question.options}
                  onChange={(e) => updateQuestion(question.id, 'options', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate each option with a comma
                </p>
              </div>
            )}

            <div className="flex flex-row items-center space-x-3 space-y-0">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                className="form-checkbox text-[#111418] h-4 w-4"
              />
              <Label className="text-[#111418] text-base font-medium leading-normal">
                Required field
              </Label>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
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
