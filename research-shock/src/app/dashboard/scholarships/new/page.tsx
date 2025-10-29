"use client";

import { useState } from "react";
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
import AdditionalQuestions from "../components/additional-question";
import { useAddScholarship } from "@/hooks/api/scholarship/scholarship.query";

interface AdditionalQuestion {
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "file";
  options?: string;
  required: boolean;
}

export default function ScholarshipDetails() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const { mutate: addScholarship, isPending: isSaving } = useAddScholarship();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAmount("");
    setDeadline("");
    //setEligibility("");
    setScholarshipType("");
    setEducationalLevel("");
    setFieldOfStudy("");
    setScholarshipWebpageLink("");
    setHasNationalityRequirement(false);
    setNationalityRequirement("");
    setScholarshipFundUsage({
      tuitionAndFees: false,
      booksAndSupplies: false,
      housingAndFood: false,
      travelOrTransportation: false,
      researchOrAcademicProject: false,
      professionalAcademicDevelopment: false,
      personalDiscretion: false,
      other: false,
    });
    setCreateApplicationForm(false);
    setAdditionalQuestions([]);
  };

  const handleFundUsageChange = (key: keyof typeof scholarshipFundUsage, checked: boolean) => {
    setScholarshipFundUsage(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSaveDraft = () => {
    const usedFor = [];
    if (scholarshipFundUsage.tuitionAndFees) usedFor.push("Tuition");
    if (scholarshipFundUsage.booksAndSupplies) usedFor.push("Books");
    if (scholarshipFundUsage.housingAndFood) usedFor.push("Accommodation");
    if (scholarshipFundUsage.travelOrTransportation) usedFor.push("Travel");
    if (scholarshipFundUsage.researchOrAcademicProject) usedFor.push("Research");
    if (scholarshipFundUsage.professionalAcademicDevelopment) usedFor.push("Development");
    if (scholarshipFundUsage.personalDiscretion) usedFor.push("Personal");
    if (scholarshipFundUsage.other) usedFor.push("Other");

    const payload = {
        title,
        description,
        amount: parseFloat(amount) || 0,
        deadline,
       // eligibilityCriteria: eligibility,
        scholarshipType,
        degreeLevel: educationalLevel,
        fieldOfStudy,
        link: scholarshipWebpageLink, 
        nationality_requirement: hasNationalityRequirement ? nationalityRequirement : "",
        status: "Draft",
        isDraft: true, 
        hasApplicationForm: createApplicationForm,
        questions: additionalQuestions.map(q => ({
          label: q.label,
          type: mapQuestionType(q.type),
          required: q.required
        }))
      };
      
    
    addScholarship(payload, {
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
    const usedFor = [];
    if (scholarshipFundUsage.tuitionAndFees) usedFor.push("Tuition");
    if (scholarshipFundUsage.booksAndSupplies) usedFor.push("Books");
    if (scholarshipFundUsage.housingAndFood) usedFor.push("Accommodation");
    if (scholarshipFundUsage.travelOrTransportation) usedFor.push("Travel");
    if (scholarshipFundUsage.researchOrAcademicProject) usedFor.push("Research");
    if (scholarshipFundUsage.professionalAcademicDevelopment) usedFor.push("Development");
    if (scholarshipFundUsage.personalDiscretion) usedFor.push("Personal");
    if (scholarshipFundUsage.other) usedFor.push("Other");

    const payload = {
      title,
      description,
      amount: parseFloat(amount) || 0,
      deadline,
     // eligibilityCriteria: eligibility,
      scholarshipType,
      degreeLevel: educationalLevel,
      fieldOfStudy,
      link: scholarshipWebpageLink, 
      nationality_requirement: hasNationalityRequirement ? nationalityRequirement : "", 
      used_for: usedFor, 
      status: "Live",
      isDraft: false, 
      hasApplicationForm: createApplicationForm,
      questions: additionalQuestions.map(q => ({
        label: q.label,
        type: mapQuestionType(q.type),
        required: q.required
      }))
    };
    
    addScholarship(payload, {
      onSuccess: () => {
        console.log("Scholarship published successfully");
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
        Scholarship Details
      </h1>

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
          <RichTextEditor
            value={description}
            onChange={setDescription}
          />
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
              <SelectItem value="Atheletic">Atheletic</SelectItem>
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
           disabled={isSaving || !title.trim() || !description.trim() || !amount.trim() || !deadline ||  !scholarshipType || !educationalLevel}
            className="bg-[#0c77f2] text-white hover:bg-[#0c77f2]/90 h-10"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !title.trim() || !description.trim() || !amount.trim() || !deadline || !scholarshipType || !educationalLevel}
            className="bg-[#198754] text-white hover:bg-[#198754]/90 h-10"
          >
            {isSaving ? "Publishing..." : "Submit Scholarship"}
          </Button>
        </div>
      </form>
    </div>
  );
}
