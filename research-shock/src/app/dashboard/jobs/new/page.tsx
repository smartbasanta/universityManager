"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/text-editor";
import AdditionalQuestions from "../components/additional-questions";
import { useAddJob } from "@/hooks/api/jobs/jobs.query";

interface AdditionalQuestion {
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "file";
  options?: string;
  required: boolean;
}

export default function JobDetails() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [modeType, setModeType] = useState("");
  const [createJobForm, setCreateJobForm] = useState(false);
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalQuestion[]>([]);

  const { mutate: addJob, isPending: isSaving } = useAddJob();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setEmploymentType("");
    setExperienceLevel("");
    setModeType(""),
    setCreateJobForm(false);
    setAdditionalQuestions([]);
  };

  const handleSaveDraft = () => {
    const payload = {
      title,
      description,
      location,
      employmentType,
      experienceLevel,
      modeOfWork: modeType, // Changed from modeType to modeOfWork
      status: "Draft",
      hasApplicationForm: createJobForm,
      questions: additionalQuestions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      }))
    };
    
    addJob(payload, {
      onSuccess: () => {
        console.log("Draft saved successfully");
        resetForm();
      }
    });
  };

  const handlePreview = () => {
    console.log("Preview clicked");
    // Handle preview logic here
  };

  const handleSubmit = () => {
    const payload = {
      title,
      description,
      location,
      employmentType,
      experienceLevel,
      modeOfWork: modeType, // Changed from modeType to modeOfWork
      status: "Live",
      hasApplicationForm: createJobForm,
      questions: additionalQuestions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      }))
    };
    
    addJob(payload, {
      onSuccess: () => {
        console.log("Job published successfully");
        resetForm();
      }
    });
  };

  // Map frontend question types to API expected types
  const mapQuestionType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'text': 'Text Input',
      'textarea': 'Textarea',
      'select': 'Select',
      'radio': 'Radio',
      'checkbox': 'Checkbox',
      'file': 'File'
    };
    return typeMap[type] || 'Text Input';
  };

  // Handler for updating additional questions
  const handleAdditionalQuestionsChange = (questions: AdditionalQuestion[]) => {
    setAdditionalQuestions(questions);
  };

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-[#111418] text-3xl font-bold leading-tight mb-6">
        Job Details
      </h1>

      <form className="space-y-6 max-w-3xl">
        {/* Job Title */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Job Title *
          </label>
          <Input
            placeholder="Enter job title"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Job Description with Rich Text Editor */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Job Description *
          </label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
          />
          <p className="text-gray-500 text-sm mt-2">
            Write or paste the job description here. Use the toolbar to format your content.
          </p>
        </div>

        {/* Job Location */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Location (or Remote) *
          </label>
          <Input
            placeholder="Enter job location or 'Remote'"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Employment Type */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Employment Type *
          </label>
          <Select onValueChange={setEmploymentType} value={employmentType}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-Time</SelectItem>
              <SelectItem value="Part-time">Part-Time</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Level of Experience *
          </label>
          <Select onValueChange={setExperienceLevel} value={experienceLevel}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entry Level">Entry Level</SelectItem>
              <SelectItem value="Mid Level">Mid Level</SelectItem>
              <SelectItem value="Senior Level">Senior Level</SelectItem>
              <SelectItem value="Executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/*Mode of Work */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Mode of Work *
          </label>
          <Select onValueChange={setModeType} value={modeType}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select mode of work" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Onsite">Onsite</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Job Form Toggle */}
        <div className="flex flex-row items-center justify-between rounded-lg border border-[#f0f2f5] p-4">
          <div className="space-y-0.5">
            <label className="text-[#111418] text-base font-medium leading-normal">
              Create Job Application Form
            </label>
            <div className="text-[#60748a] text-sm">
              Add custom questions for job applicants to answer
            </div>
          </div>
          <Switch
            checked={createJobForm}
            onCheckedChange={setCreateJobForm}
          />
        </div>

        {/* Additional Questions Section */}
        {createJobForm && (
          <div>
            <AdditionalQuestions 
              value={additionalQuestions}
              onChange={handleAdditionalQuestionsChange}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            className="bg-[#2DD4BF] text-white hover:bg-[#2DD4BF]/90 h-10"
          >
            Preview
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving || !title.trim() || !description.trim() || !location.trim() || !employmentType || !experienceLevel}
            className="bg-[#0c77f2] text-white hover:bg-[#0c77f2]/90 h-10"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !title.trim() || !description.trim() || !location.trim() || !employmentType || !experienceLevel}
            className="bg-[#198754] text-white hover:bg-[#198754]/90 h-10"
          >
            {isSaving ? "Publishing..." : "Submit Job"}
          </Button>
        </div>
      </form>
    </div>
  );
}
