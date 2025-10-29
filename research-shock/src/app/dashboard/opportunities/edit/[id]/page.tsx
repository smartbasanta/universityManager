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
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import RichTextEditor from "@/components/text-editor";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CustomFormBuilder from "../../components/custom-form-builder";
import { useGetOpportunityById, useUpdateOpportunity } from "@/hooks/api/opportunity-hub/opportunity.query";

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

export default function EditOpportunityForm() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = params.id as string;
  const statusParam = searchParams.get('status') || 'Draft';

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [originalDescriptionHtml, setOriginalDescriptionHtml] = useState("");
  const [location, setLocation] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");
  const [venue, setVenue] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [hasApplicationForm, setHasApplicationForm] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [teamMemberQuestions, setTeamMemberQuestions] = useState<TeamMemberQuestion[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [status, setStatus] = useState("");

  const { data: opportunityData, isLoading, error } = useGetOpportunityById(opportunityId);
  const { mutate: updateOpportunity, isPending: isSaving } = useUpdateOpportunity();

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return localDate.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Helper function to format date for API submission
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      console.error("Error formatting date for API:", error);
      return dateString;
    }
  };

  // Map API question types to frontend types (like jobs edit)
  const mapApiTypeToFrontend = (apiType: string): string => {
    const typeMap: { [key: string]: string } = {
      'Text Input': 'text',
      'Textarea': 'textarea',
      'Select': 'select', 
      'Radio': 'radio',
      'Checkbox': 'checkbox',
      'File': 'file',
      'Email': 'email'
    };
    return typeMap[apiType] || 'text';
  };

  // Map frontend question types to API expected types (like jobs edit)
  const mapQuestionType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'text': 'Text Input',
      'textarea': 'Textarea',
      'select': 'Select',
      'radio': 'Radio',
      'checkbox': 'Checkbox',
      'file': 'File',
      'email': 'Email'
    };
    return typeMap[type] || 'Text Input';
  };

  // Populate form fields when data is loaded (following jobs edit pattern exactly)
  useEffect(() => {
    if (opportunityData && !isDataLoaded) {
      console.log("Loading data from API:", opportunityData);
      
      setTitle(opportunityData.title || "");
      setType(opportunityData.type || "");
      
      // Store original HTML and set it for the editor
      const htmlContent = opportunityData.description || "";
      setOriginalDescriptionHtml(htmlContent);
      setDescription(htmlContent);
      
      setLocation(opportunityData.location || "");
      setEducationalLevel(opportunityData.educationalLevel || "");
      setVenue(opportunityData.venue || "");
      
      // Format dates for datetime-local inputs
      setStartDateTime(formatDateForInput(opportunityData.startDateTime));
      setEndDateTime(formatDateForInput(opportunityData.endDateTime));
      
      setApplicationLink(opportunityData.applicationLink || "");
      setTags(opportunityData.tags || []);
      setStatus(opportunityData.status || "");
      setHasApplicationForm(opportunityData.hasApplicationForm || false);
      
      // Transform API questions to frontend format (NO IDs - like jobs edit)
      const transformedQuestions = (opportunityData.questions || []).map((q: any) => ({
        label: q.label || "",
        type: mapApiTypeToFrontend(q.type || "Text Input"),
        required: q.required || false,
      }));
      setQuestions(transformedQuestions);
      
      // Transform API team questions to frontend format (NO IDs - like jobs edit)
      const transformedTeamQuestions = (opportunityData.teamMemberQuestions || []).map((q: any) => ({
        label: q.label || "",
        type: mapApiTypeToFrontend(q.type || "Text Input"),
        required: q.required || false,
      }));
      setTeamMemberQuestions(transformedTeamQuestions);
      
      setIsDataLoaded(true);
      
      console.log("Opportunity data loaded successfully");
      console.log("Transformed questions:", transformedQuestions);
      console.log("Transformed team questions:", transformedTeamQuestions);
    }
  }, [opportunityData, isDataLoaded]);

  const handleDescriptionChange = (content: string) => {
    console.log("Description content changed:", content);
    setDescription(content);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  // Handler for updating questions (like jobs edit)
  const handleQuestionsChange = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
  };

  // Handler for updating team questions (like jobs edit) 
  const handleTeamQuestionsChange = (newTeamQuestions: TeamMemberQuestion[]) => {
    setTeamMemberQuestions(newTeamQuestions);
  };

  const handleSave = () => {
    console.log("🔍 Starting save process...");
    console.log("Questions state:", questions);
    console.log("Team questions state:", teamMemberQuestions);
    
    // Always send HTML content - either the updated content from editor or original HTML
    const descriptionToSend = description || originalDescriptionHtml;
    
    console.log("Saving opportunity with data:", {
      title,
      description: descriptionToSend,
      location,
      educationalLevel,
      venue,
      hasApplicationForm,
      questions,
      teamMemberQuestions,
      status
    });
    
    const payload = {
      id: opportunityId, // Only opportunity ID, like jobs edit
      title,
      type,
      description: descriptionToSend,
      location,
      educationalLevel,
      venue,
      startDateTime: formatDateForAPI(startDateTime),
      endDateTime: formatDateForAPI(endDateTime),
      applicationLink,
      tags,
      hasApplicationForm,
      questions: questions
        .filter(q => q.label && q.label.trim())
        .map(q => ({
          label: q.label,
          type: mapQuestionType(q.type),
          required: q.required
        })),
      teamMemberQuestions: teamMemberQuestions
        .filter(q => q.label && q.label.trim())
        .map(q => ({
          label: q.label,
          type: mapQuestionType(q.type),
          required: q.required
        })),
      status: status
    };

    console.log("📤 Final payload:", payload);

    updateOpportunity(payload, {
      onSuccess: (response) => {
        console.log("✅ Opportunity updated successfully:", response);
        // Redirect to the correct tab based on status
        const tabMap: { [key: string]: string } = {
          'Draft': 'draft',
          'Live': 'live',
          'Archive': 'archive'
        };
        
        const targetTab = tabMap[status] || 'draft';
        router.push(`/dashboard/opportunities?tab=${targetTab}`);
      },
      onError: (error) => {
        console.error("❌ Error updating opportunity:", error);
        console.error("❌ Full error object:", JSON.stringify(error, null, 2));
        
        if (error.response) {
          console.error("❌ Response status:", error.response.status);
          console.error("❌ Response data:", error.response.data);
        }
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
    
    const targetTab = tabMap[status] || 'draft';
    router.push(`/dashboard/opportunities?tab=${targetTab}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading opportunity...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading opportunity: {error.message}</div>
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
          Edit Opportunity
        </h1>
      </div>


      {/* Main Form Container */}
      <div className="space-y-6 max-w-3xl">
        {/* Opportunity Title */}
        <div>
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Opportunity Title *
          </Label>
          <Input
            placeholder="Enter opportunity title"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Type of Opportunity */}
        <div>
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Type of Opportunity *
          </Label>
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
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Opportunity Description *
          </Label>
          {isDataLoaded && (
            <RichTextEditor
              value={description}
              onChange={handleDescriptionChange}
            />
          )}
          <p className="text-gray-500 text-sm mt-2">
            Describe the opportunity in detail. Use the toolbar to format your content.
          </p>
        </div>

        {/* Location Type */}
        <div>
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Location Type *
          </Label>
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
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Educational Level *
          </Label>
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
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Venue / Address
          </Label>
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
            <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
              Start Date & Time *
            </Label>
            <Input
              type="datetime-local"
              className="bg-[#f0f2f5] border-none h-14"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
              End Date & Time *
            </Label>
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
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Registration / Application Link *
          </Label>
          <Input
            placeholder="Paste registration URL"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
          />
        </div>

        {/* Tags / Keywords */}
        <div className="px-4">
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Tags / Keywords
          </Label>
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
            <Label className="text-[#111418] text-base font-medium leading-normal">
              Create Application Form
            </Label>
            <div className="text-[#60748a] text-sm">
              Add custom questions for applicants to answer
            </div>
          </div>
          <Switch
            checked={hasApplicationForm}
            onCheckedChange={setHasApplicationForm}
          />
        </div>

        {/* Create Your Custom Application Form Section */}
        {hasApplicationForm && isDataLoaded && (
          <div className="mt-6">
            <div className="mb-4">
              <h3 className="text-[#111418] text-lg font-semibold leading-normal">
                Create Your Custom Application Form
              </h3>
              <p className="text-[#60748a] text-sm mt-1">
                Design custom questions for both individual applicants and team member information
              </p>
            </div>
            <CustomFormBuilder 
              questions={questions}
              setQuestions={setQuestions}
              teamMemberQuestions={teamMemberQuestions}
              setTeamMemberQuestions={setTeamMemberQuestions}
            />
          </div>
        )}

        {/* Status Field */}
        <div>
          <Label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Status
          </Label>
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
            variant="outline"
            onClick={handlePreview}
            className="bg-[#2DD4BF] text-white hover:bg-[#2DD4BF]/90 h-10"
          >
            Preview
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !description.trim() || !location.trim() || !type || !startDateTime || !endDateTime || !applicationLink.trim()}
            className="bg-[#198754] text-white hover:bg-[#198754]/90 h-10"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
