"use client";

import { useState, useEffect } from "react";
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
import AdditionalQuestions from "../../components/additional-questions";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  useGetJobById,
  useUpdateJob,
} from "@/hooks/api/jobs/jobs.query";

interface AdditionalQuestion {
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "file";
  options?: string;
  required: boolean;
}

export default function EditJob() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = params.id as string;
  const statusParam = searchParams.get('status') || 'draft';

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalDescriptionHtml, setOriginalDescriptionHtml] = useState(""); // Store original HTML
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [modeType, setModeType] = useState("");
  const [createJobForm, setCreateJobForm] = useState(false);
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalQuestion[]>([]);
  const [status, setStatus] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data: jobData, isLoading, error } = useGetJobById(jobId);
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob();

  // Populate form fields when data is loaded
  useEffect(() => {
    if (jobData && !isDataLoaded) {
      console.log("Loading data from API:", jobData);
      
      setTitle(jobData.title || "");
      
      // Store original HTML and set it for the editor
      const htmlContent = jobData.description || "";
      setOriginalDescriptionHtml(htmlContent);
      setDescription(htmlContent);
      
      setLocation(jobData.location || "");
      setEmploymentType(jobData.employmentType || "");
      setExperienceLevel(jobData.experienceLevel || "");
      setModeType(jobData.modeOfWork || ""); // Changed from modeType to modeOfWork
      setCreateJobForm(jobData.hasApplicationForm || false);
      
      // Transform API questions to frontend format
      const transformedQuestions = (jobData.questions || []).map((q: any) => ({
        label: q.label || "",
        type: mapApiTypeToFrontend(q.type || "Text Input"),
        options: q.options || "",
        required: q.required || false,
      }));
      
      setAdditionalQuestions(transformedQuestions);
      setStatus(jobData.status || "");
      setIsDataLoaded(true);
      
      console.log("Job data loaded:", jobData);
      console.log("Description HTML loaded:", htmlContent);
    }
  }, [jobData, isDataLoaded]);

  // Map API question types to frontend types
  const mapApiTypeToFrontend = (apiType: string): "text" | "textarea" | "select" | "radio" | "checkbox" | "file" => {
    const typeMap: { [key: string]: "text" | "textarea" | "select" | "radio" | "checkbox" | "file" } = {
      'Text Input': 'text',
      'Textarea': 'textarea',
      'Select': 'select',
      'Radio': 'radio',
      'Checkbox': 'checkbox',
      'File': 'file'
    };
    return typeMap[apiType] || 'text';
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

  const handleDescriptionChange = (content: string) => {
    console.log("Description content changed:", content);
    setDescription(content);
  };

  const handleSave = () => {
    console.log("Saving with description content:", description);
    console.log("Original description HTML:", originalDescriptionHtml);
    
    // Always send HTML content - either the updated content from editor or original HTML
    const descriptionToSend = description || originalDescriptionHtml;
    
    console.log("Saving job with data:", {
      title,
      description: descriptionToSend,
      location,
      employmentType,
      experienceLevel,
      modeType,
      createJobForm,
      additionalQuestions,
      status
    });
    
    const payload = {
      id: jobId,
      title,
      description: descriptionToSend, // Always HTML content
      location,
      employmentType,
      experienceLevel,
      modeOfWork: modeType, // Changed from modeType to modeOfWork
      status,
      hasApplicationForm: createJobForm,
      questions: additionalQuestions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      }))
    };

    console.log("Final payload:", payload);

    updateJob(payload, {
      onSuccess: () => {
        // Redirect to the correct tab based on status
        const tabMap: { [key: string]: string } = {
          'Draft': 'draft',
          'Live': 'live',
          'Archive': 'archive'
        };
        
        const targetTab = tabMap[statusParam] || 'draft';
        router.push(`/dashboard/jobs?tab=${targetTab}`);
      }
    });
  };

  const handleBack = () => {
    // Redirect to the correct tab based on status
    const tabMap: { [key: string]: string } = {
      'Draft': 'draft',
      'Live': 'live', 
      'Archive': 'archive'
    };
    
    const targetTab = tabMap[statusParam] || 'draft';
    router.push(`/dashboard/jobs?tab=${targetTab}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading job...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading job: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-[#111418] text-3xl font-bold leading-tight">
          Edit Job
        </h1>
      </div>

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
          {isDataLoaded && (
            <RichTextEditor
              value={description}
              onChange={handleDescriptionChange}
            />
          )}
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

        {/* Status */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Status
          </label>
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Live">Live</SelectItem>
              <SelectItem value="Archive">Archive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdating || !title.trim() || !description.trim() || !location.trim() || !employmentType || !experienceLevel}
            className="bg-[#198754] text-white hover:bg-[#198754]/90 h-10"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
