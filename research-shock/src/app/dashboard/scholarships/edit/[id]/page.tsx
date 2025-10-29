"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/text-editor";
import AdditionalQuestions from "../../components/additional-question";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  useGetScholarshipById,
  useUpdateScholarship,
} from "@/hooks/api/scholarship/scholarship.query";

interface AdditionalQuestion {
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "file";
  options?: string;
  required: boolean;
}

// Convert API `used_for` array ➜ checkbox object
const mapUsedForToCheckboxObj = (arr: string[]) => ({
  tuitionAndFees: arr.includes("Tuition"),
  booksAndSupplies: arr.includes("Books"),
  housingAndFood: arr.includes("Accommodation"),
  travelOrTransportation: arr.includes("Travel"),
  researchOrAcademicProject: arr.includes("Research"),
  professionalAcademicDevelopment: arr.includes("Development"),
  personalDiscretion: arr.includes("Personal"),
  other: arr.includes("Other"),
});

// Convert checkbox object ➜ API `used_for` array
const mapCheckboxObjToUsedFor = (obj: any) => {
  const list: string[] = [];
  if (obj.tuitionAndFees) list.push("Tuition");
  if (obj.booksAndSupplies) list.push("Books");
  if (obj.housingAndFood) list.push("Accommodation");
  if (obj.travelOrTransportation) list.push("Travel");
  if (obj.researchOrAcademicProject) list.push("Research");
  if (obj.professionalAcademicDevelopment) list.push("Development");
  if (obj.personalDiscretion) list.push("Personal");
  if (obj.other) list.push("Other");
  return list;
};

export default function EditScholarship() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scholarshipId = params.id as string;
  const statusParam = searchParams.get('status') || 'draft';

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalDescriptionHtml, setOriginalDescriptionHtml] = useState(""); // Store original HTML
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
 // const [eligibility, setEligibility] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [educationalLevel, setEducationalLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [scholarshipWebpageLink, setScholarshipWebpageLink] = useState("");
  const [hasNationalityRequirement, setHasNationalityRequirement] = useState(false);
  const [nationalityRequirement, setNationalityRequirement] = useState("");
  const [scholarshipFundUsage, setScholarshipFundUsage] = useState({
    tuitionAndFees: false,
    booksAndSupplies: false,
    housingAndFood: false,
    travelOrTransportation: false,
    researchOrAcademicProject: false,
    professionalAcademicDevelopment: false,
    personalDiscretion: false,
    other: false,
  });
  const [createApplicationForm, setCreateApplicationForm] = useState(false);
  const [additionalQuestions, setAdditionalQuestions] = useState<AdditionalQuestion[]>([]);
  const [status, setStatus] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data: scholarshipData, isLoading, error } = useGetScholarshipById(scholarshipId);
  const { mutate: updateScholarship, isPending: isUpdating } = useUpdateScholarship();

  // Populate form fields when data is loaded
  useEffect(() => {
    if (scholarshipData && !isDataLoaded) {
      console.log("Loading data from API:", scholarshipData);
      
      setTitle(scholarshipData.title || "");
      
      // Store original HTML and set it for the editor
      const htmlContent = scholarshipData.description || "";
      setOriginalDescriptionHtml(htmlContent);
      setDescription(htmlContent);
      
      setAmount(scholarshipData.amount?.toString() || "");
      
      // Format date for input field (YYYY-MM-DD)
      if (scholarshipData.deadline) {
        const date = new Date(scholarshipData.deadline);
        const formattedDate = date.toISOString().split('T')[0];
        setDeadline(formattedDate);
      }
      
     // setEligibility(scholarshipData.eligibilityCriteria || "");
      setScholarshipType(scholarshipData.scholarshipType || "");
      setEducationalLevel(scholarshipData.degreeLevel || "");        // ⬅️  degreeLevel
      setFieldOfStudy(scholarshipData.fieldOfStudy || "");
      setScholarshipWebpageLink(scholarshipData.link || "");         // ⬅️  link
      setNationalityRequirement(scholarshipData.nationality_requirement || "");
      setHasNationalityRequirement(!!scholarshipData.nationality_requirement);
      
      // Load scholarship fund usage - updated mapping
      setScholarshipFundUsage(
        mapUsedForToCheckboxObj(scholarshipData.used_for || [])      
      );
      
      setCreateApplicationForm(scholarshipData.hasApplicationForm || false);
      
      // Transform API questions to frontend format
      const transformedQuestions = (scholarshipData.questions || []).map((q: any) => ({
        label: q.label || "",
        type: mapApiTypeToFrontend(q.type || "Text Input"),
        options: q.options || "",
        required: q.required || false,
      }));
      
      setAdditionalQuestions(transformedQuestions);
      setStatus(scholarshipData.status || "");
      setIsDataLoaded(true);
      
      console.log("Scholarship data loaded:", scholarshipData);
      console.log("Description HTML loaded:", htmlContent);
    }
  }, [scholarshipData, isDataLoaded]);

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

  const handleFundUsageChange = (key: keyof typeof scholarshipFundUsage, checked: boolean) => {
    setScholarshipFundUsage(prev => ({
      ...prev,
      [key]: checked
    }));
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
    
    console.log("Saving scholarship with data:", {
      title,
      description: descriptionToSend,
      amount,
      deadline,
     // eligibility,
      scholarshipType,
      educationalLevel,
      fieldOfStudy,
      scholarshipWebpageLink,
      nationalityRequirement,
      scholarshipFundUsage,
      createApplicationForm,
      additionalQuestions,
      status
    });

    const payload = {
      id: scholarshipId,
      title,
      description: descriptionToSend, 
      amount: parseFloat(amount) || 0,
      deadline,
      //eligibilityCriteria: eligibility,
      scholarshipType,
      degreeLevel: educationalLevel,                 
      fieldOfStudy,
      link: scholarshipWebpageLink,                  
      nationality_requirement: hasNationalityRequirement ? nationalityRequirement : "", 
      used_for: mapCheckboxObjToUsedFor(scholarshipFundUsage), 
      isDraft: status === "Draft",                            
      status,
      hasApplicationForm: createApplicationForm,
      questions: additionalQuestions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      }))
    };

    console.log("Final payload:", payload);

    updateScholarship(payload, {
      onSuccess: () => {
        // Redirect to the correct tab based on status
        const tabMap: { [key: string]: string } = {
          'Draft': 'draft',
          'Live': 'live',
          'Archive': 'archive'
        };
        
        const targetTab = tabMap[statusParam] || 'draft';
        router.push(`/dashboard/scholarships?tab=${targetTab}`);
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
    router.push(`/dashboard/scholarships?tab=${targetTab}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading scholarship...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading scholarship: {error.message}</div>
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
          Edit Scholarship
        </h1>
      </div>

      <form className="space-y-6 max-w-3xl">
        {/* Scholarship Title */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Scholarship Title *
          </label>
          <Input
            placeholder="Enter scholarship title"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Scholarship Description with Rich Text Editor */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Scholarship Description *
          </label>
          {isDataLoaded && (
            <RichTextEditor
              value={description}
              onChange={handleDescriptionChange}
            />
          )}
          <p className="text-gray-500 text-sm mt-2">
            Write or paste the scholarship description here. Use the toolbar to format your content.
          </p>
        </div>

        {/* Scholarship Amount */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Scholarship Amount *
          </label>
          <Input
            placeholder="e.g., 5000 (enter numeric value)"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
          />
        </div>

        {/* What can the scholarship funds be used for? */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            What can the scholarship funds be used for?
          </label>
          <div className="space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tuitionAndFees"
                checked={scholarshipFundUsage.tuitionAndFees}
                onCheckedChange={(checked) => handleFundUsageChange('tuitionAndFees', checked as boolean)}
              />
              <label htmlFor="tuitionAndFees" className="text-[#111418] text-base font-normal leading-normal">
                Tuition and fees
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="booksAndSupplies"
                checked={scholarshipFundUsage.booksAndSupplies}
                onCheckedChange={(checked) => handleFundUsageChange('booksAndSupplies', checked as boolean)}
              />
              <label htmlFor="booksAndSupplies" className="text-[#111418] text-base font-normal leading-normal">
                Books and supplies
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="housingAndFood"
                checked={scholarshipFundUsage.housingAndFood}
                onCheckedChange={(checked) => handleFundUsageChange('housingAndFood', checked as boolean)}
              />
              <label htmlFor="housingAndFood" className="text-[#111418] text-base font-normal leading-normal">
                Housing and food
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="travelOrTransportation"
                checked={scholarshipFundUsage.travelOrTransportation}
                onCheckedChange={(checked) => handleFundUsageChange('travelOrTransportation', checked as boolean)}
              />
              <label htmlFor="travelOrTransportation" className="text-[#111418] text-base font-normal leading-normal">
                Travel or transportation
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="researchOrAcademicProject"
                checked={scholarshipFundUsage.researchOrAcademicProject}
                onCheckedChange={(checked) => handleFundUsageChange('researchOrAcademicProject', checked as boolean)}
              />
              <label htmlFor="researchOrAcademicProject" className="text-[#111418] text-base font-normal leading-normal">
                Research or academic project
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="professionalAcademicDevelopment"
                checked={scholarshipFundUsage.professionalAcademicDevelopment}
                onCheckedChange={(checked) => handleFundUsageChange('professionalAcademicDevelopment', checked as boolean)}
              />
              <label htmlFor="professionalAcademicDevelopment" className="text-[#111418] text-base font-normal leading-normal">
                Professional/Academic Development
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="personalDiscretion"
                checked={scholarshipFundUsage.personalDiscretion}
                onCheckedChange={(checked) => handleFundUsageChange('personalDiscretion', checked as boolean)}
              />
              <label htmlFor="personalDiscretion" className="text-[#111418] text-base font-normal leading-normal">
                Personal discretion (unrestricted use)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other"
                checked={scholarshipFundUsage.other}
                onCheckedChange={(checked) => handleFundUsageChange('other', checked as boolean)}
              />
              <label htmlFor="other" className="text-[#111418] text-base font-normal leading-normal">
                Other
              </label>
            </div>
          </div>
        </div>

        {/* Scholarship Webpage Link */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Scholarship Webpage Link
          </label>
          <Input
            placeholder="Enter scholarship webpage URL"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={scholarshipWebpageLink}
            onChange={(e) => setScholarshipWebpageLink(e.target.value)}
            type="url"
          />
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
              <SelectItem value="grad">Grad</SelectItem>
              <SelectItem value="PHD">PhD</SelectItem>
              <SelectItem value="open_to_all">Open to all</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Field of Study */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Field of Study
          </label>
          <Input
            placeholder="Enter field of study"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
          />
        </div>

        {/* Nationality Requirement */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="hasNationalityRequirement"
              checked={hasNationalityRequirement}
              onCheckedChange={(checked) => {
                setHasNationalityRequirement(checked as boolean);
                if (!checked) {
                  setNationalityRequirement("");
                }
              }}
            />
            <label htmlFor="hasNationalityRequirement" className="text-[#111418] text-base font-medium leading-normal">
              Do you want to add Nationality Requirement?
            </label>
          </div>
          
          {hasNationalityRequirement && (
            <div>
              <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
                Nationality Requirement
              </label>
              <Input
                placeholder="Enter nationality requirement"
                className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                value={nationalityRequirement}
                onChange={(e) => setNationalityRequirement(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Application Deadline */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Application Deadline *
          </label>
          <Input
            type="date"
            className="bg-[#f0f2f5] border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {/* Eligibility Criteria */}
        {/* <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Eligibility Criteria *
          </label>
          <Textarea
            placeholder="Enter eligibility requirements"
            className="bg-[#f0f2f5] border-none min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
          />
        </div> */}

        {/* Scholarship Type */}
        <div>
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Scholarship Type *
          </label>
          <Select onValueChange={setScholarshipType} value={scholarshipType}>
            <SelectTrigger className="bg-[#f0f2f5] border-none h-14">
              <SelectValue placeholder="Select scholarship type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Merit Based">Merit-Based</SelectItem>
              <SelectItem value="Need Based">Need-Based</SelectItem>
              <SelectItem value="Athletic">Athletic</SelectItem>
              <SelectItem value="Academic Excellence">Academic Excellence</SelectItem>
              <SelectItem value="Minority">Minority</SelectItem>
              <SelectItem value="International Student">International Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Application Form Toggle */}
        <div className="flex flex-row items-center justify-between rounded-lg border border-[#f0f2f5] p-4">
          <div className="space-y-0.5">
            <label className="text-[#111418] text-base font-medium leading-normal">
              Create Scholarship Application Form
            </label>
            <div className="text-[#60748a] text-sm">
              Add custom questions for scholarship applicants to answer
            </div>
          </div>
          <Switch
            checked={createApplicationForm}
            onCheckedChange={setCreateApplicationForm}
          />
        </div>

        {/* Additional Questions Section */}
        {createApplicationForm && (
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
            disabled={isUpdating || !title.trim() || !description.trim() || !amount.trim() || !deadline || !scholarshipType || !educationalLevel}
            className="bg-[#198754] text-white hover:bg-[#198754]/90 h-10"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
