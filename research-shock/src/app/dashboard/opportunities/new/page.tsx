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
import { TagInput } from "@/components/ui/tag-input";
import RichTextEditor from "@/components/text-editor";
import CustomFormBuilder from "../components/custom-form-builder";
import { useAddOpportunity } from "@/hooks/api/opportunity-hub/opportunity.query";

interface Question {
  label: string;
  type: string;
  required: boolean;
}

interface TeamMemberQuestion {
  label: string;
  type: string;
  required: boolean;
}

export default function OpportunityDetails() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");
  const [venue, setVenue] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [createOpportunityForm, setCreateOpportunityForm] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [teamMemberQuestions, setTeamMemberQuestions] = useState<TeamMemberQuestion[]>([]);

  const { mutate: addOpportunity, isPending: isSaving } = useAddOpportunity();

  const resetForm = () => {
    setTitle("");
    setType("");
    setDescription("");
    setLocation("");
    setEducationalLevel("");
    setVenue("");
    setStartDateTime("");
    setEndDateTime("");
    setApplicationLink("");
    setTags([]);
    setCreateOpportunityForm(false);
    setQuestions([]);
    setTeamMemberQuestions([]);
  };

  // Map frontend question types to API expected types
 const mapQuestionType = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'text': 'Text Input',
    'textarea': 'Textarea', 
    'select': 'Select',
    'radio': 'Radio',
    'checkbox': 'Checkbox',
    'file': 'File',
    // Add mappings for CustomFormBuilder types
    'Text Input': 'Text Input',
    'Email': 'Email',
    'Textarea': 'Textarea',
    'Dropdown': 'Select',
    'Radio': 'Radio',
    'Checkbox': 'Checkbox',
    'File Upload': 'File'
  };
  return typeMap[type] || 'Text Input';
};


  const handleSaveDraft = () => {
    const payload = {
      title,
      type,
      description,
      location,
      educationalLevel,
      venue,
      startDateTime,
      endDateTime,
      applicationLink,
      tags,
      status: "Draft",
      hasApplicationForm: createOpportunityForm,
      questions: questions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      })),
      teamMemberQuestions: teamMemberQuestions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      }))
    };
    
    addOpportunity(payload, {
      onSuccess: () => {
        console.log("Draft saved successfully");
        resetForm();
      }
    });
    console.log("🔍 DEBUG - Current state:");
  console.log("questions from state:", questions);
  console.log("teamMemberQuestions from state:", teamMemberQuestions);
  console.log("createOpportunityForm:", createOpportunityForm);
  };

  const handlePreview = () => {
    console.log("Preview clicked");
    // Handle preview logic here
  };

  const handleSubmit = () => {
    const payload = {
      title,
      type,
      description,
      location,
      educationalLevel,
      venue,
      startDateTime,
      endDateTime,
      applicationLink,
      tags,
      status: "Live",
      hasApplicationForm: createOpportunityForm,
      questions: questions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      })),
      teamMemberQuestions: teamMemberQuestions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      }))
    };
    
    addOpportunity(payload, {
      onSuccess: () => {
        console.log("Opportunity published successfully");
        resetForm();
      }
    });
  };

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-[#111418] text-3xl font-bold leading-tight mb-6">
        Opportunity Details
      </h1>

      {/* Changed from <form> to <div> to prevent nested form elements */}
      <div className="space-y-6 max-w-3xl">
        {/* Opportunity Title */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Opportunity Title *
          </label>
          <Input
            placeholder="Enter opportunity title"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Type of Opportunity */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Type of Opportunity *
          </label>
          <Select onValueChange={setType} value={type}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bootcamp">Bootcamp</SelectItem>
              <SelectItem value="Symposium">Symposium</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
              <SelectItem value="Startup">Startup</SelectItem>
              <SelectItem value="Incubation">Incubation</SelectItem>
              <SelectItem value="Competition">Competition</SelectItem>
              <SelectItem value="Hackathon">Hackathon</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opportunity Description with Rich Text Editor */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Opportunity Description *
          </label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
          />
          <p className="text-gray-500 text-sm mt-2">
            Describe the opportunity in detail. Use the toolbar to format your content.
          </p>
        </div>

        {/* Location Type */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Location Type *
          </label>
          <Select onValueChange={setLocation} value={location}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Virtual">Virtual</SelectItem>
              <SelectItem value="In-person">In-person</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

         {/* Educational Level */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Educational Level *
          </label>
          <Select onValueChange={setEducationalLevel} value={educationalLevel}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select educational level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Undergrad">Undergrad</SelectItem>
              <SelectItem value="Grad">Grad</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="Open to all">Open to all</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Venue / Address */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Venue / Address
          </label>
          <Input
            placeholder="Enter venue or address"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>

        {/* Date & Time */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
              Start Date & Time *
            </label>
            <Input
              type="datetime-local"
              className="bg-[#f0f2f5] border-none h-14"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
              End Date & Time *
            </label>
            <Input
              type="datetime-local"
              className="bg-[#f0f2f5] border-none h-14"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
            />
          </div>
        </div>

        {/* Application Link */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Registration / Application Link *
          </label>
          <Input
            placeholder="Paste registration URL"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
          />
        </div>

        {/* Tags / Keywords */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Tags / Keywords
          </label>
          <TagInput
            value={tags}
            onChange={setTags}
            placeholder="Add tags (e.g., space, propulsion, AI ethics)"
          />
          <p className="text-gray-500 text-sm mt-2">
            Enter keywords related to your research. Press Enter or comma to add each tag.
          </p>
        </div>

        {/* Create Application Form Toggle */}
        <div className="flex flex-row items-center justify-between rounded-lg border border-[#f0f2f5] p-4">
          <div className="space-y-0.5">
            <label className="text-[#111418] text-base font-medium leading-normal">
              Create Application Form
            </label>
            <div className="text-[#60748a] text-sm">
              Add custom questions for applicants to answer
            </div>
          </div>
          <Switch
            checked={createOpportunityForm}
            onCheckedChange={setCreateOpportunityForm}
          />
        </div>

        {/* Custom Form Builder Section */}
        {createOpportunityForm && (
          <div className="mt-6">
            <CustomFormBuilder 
              questions={questions}
              setQuestions={setQuestions}
              teamMemberQuestions={teamMemberQuestions}
              setTeamMemberQuestions={setTeamMemberQuestions}
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
            disabled={isSaving || !title.trim() || !description.trim() || !location.trim() || !type || !startDateTime || !endDateTime || !applicationLink.trim()}
            className="bg-[#0c77f2] text-white hover:bg-[#0c77f2]/90 h-10"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !title.trim() || !description.trim() || !location.trim() || !type || !startDateTime || !endDateTime || !applicationLink.trim()}
            className="bg-[#198754] text-white hover:bg-[#198754]/90 h-10"
          >
            {isSaving ? "Publishing..." : "Submit Opportunity"}
          </Button>
        </div>
      </div>
    </div>
  );
}
