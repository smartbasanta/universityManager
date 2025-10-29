"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit } from "lucide-react";
import { TagInput } from "@/components/ui/tag-input";
import { useAddUniversityAdmission, useGetUniversityAdmission } from "@/hooks/api/university/university.query";

export default function AdmissionForm() {
  const { mutate: addUniversityAdmission, isPending: isSaving } = useAddUniversityAdmission();
  const { data: admissionResponse, isLoading: isLoadingAdmission, error: admissionError } = useGetUniversityAdmission();
  
  const [application_website, setApplicationWebsite] = useState("");
  const [admission_website, setAdmissionWebsite] = useState("");
  const [university_admission_requirement, setUniversityAdmissionRequirement] = useState([{ test_name: "", score_range: "" }]);
  const [tag, setTag] = useState<string[]>([]);

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Populate form fields with existing data if available
  useEffect(() => {
    if (admissionResponse) {
      const data = admissionResponse;
      setApplicationWebsite(data.application_website || "");
      setAdmissionWebsite(data.admission_website || "");
      
      if (data.university_admission_requirement && data.university_admission_requirement.length > 0) {
        setUniversityAdmissionRequirement(
          data.university_admission_requirement.map((req: any) => ({
            test_name: req.test_name || "",
            score_range: req.score_range || ""
          }))
        );
      } else {
        setUniversityAdmissionRequirement([{ test_name: "", score_range: "" }]);
      }
      
      if (data.tag && data.tag.length > 0) {
        setTag(data.tag.map((t: any) => t.name));
      } else {
        setTag([]);
      }
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [admissionResponse]);

  const handleAddRequirement = () => {
    if (isReadOnly) return;
    setUniversityAdmissionRequirement([...university_admission_requirement, { test_name: "", score_range: "" }]);
  };

  const handleRemoveRequirement = (index: number) => {
    if (isReadOnly) return;
    setUniversityAdmissionRequirement(university_admission_requirement.filter((_, i) => i !== index));
  };

  const createPayload = (isDraft: boolean) => {
    // Filter out empty requirements
    const filteredRequirements = university_admission_requirement.filter(
      (req) => req.test_name.trim() !== "" || req.score_range.trim() !== ""
    );

    return {
      application_website,
      admission_website,
      university_admission_requirement: filteredRequirements,
      tag: tag.map((name: string) => ({ name })),
      isDraft: isDraft
    };
  };

  const handleSaveDraft = () => {
    const payload = createPayload(true);
    addUniversityAdmission(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = createPayload(false);
    addUniversityAdmission(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingAdmission) {
    return <div>Loading...</div>;
  }

  if (admissionError) {
    return <div>Error: {admissionError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1 mt-5">
      <form className="space-y-6">
        {/* Admission Requirements */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Admission Requirements
          </label>
          {university_admission_requirement.map((requirement, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">Requirement #{index + 1}</h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray text-base font-medium leading-normal">Test Name</label>
                  <Input
                    placeholder="e.g., SAT, ACT"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={requirement.test_name}
                    onChange={(e) => {
                      const newRequirements = [...university_admission_requirement];
                      newRequirements[index].test_name = e.target.value;
                      setUniversityAdmissionRequirement(newRequirements);
                    }}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="text-gray text-base font-medium leading-normal">Score Range</label>
                  <Input
                    placeholder="e.g., 1200-1400, 25-30"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={requirement.score_range}
                    onChange={(e) => {
                      const newRequirements = [...university_admission_requirement];
                      newRequirements[index].score_range = e.target.value;
                      setUniversityAdmissionRequirement(newRequirements);
                    }}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRequirement}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Admission Requirement
            </Button>
          )}
        </div>

        {/* Website URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">Application Website</label>
            <Input
              placeholder="https://university.edu/apply"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={application_website}
              onChange={(e) => setApplicationWebsite(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">Admission Website</label>
            <Input
              placeholder="https://university.edu/admissions"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={admission_website}
              onChange={(e) => setAdmissionWebsite(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Student Receiving Aid */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">Student Receiving Aid</label>
          <TagInput
            value={tag}
            onChange={setTag}
            disabled={isReadOnly}
          />
          <p className="text-gray-500 text-sm">Enter student categories who receive aid</p>
        </div>

        {/* Form Actions */}
        <div className="flex px-4 py-3 justify-end gap-4">
          {isFormSubmitted && isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={handleEditInfo}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#6c757d] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#6c757d]/90"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Info
            </Button>
          )}
          {!isReadOnly && (
            <>
              <Button
                type="button"
                disabled={isSaving}
                variant="outline"
                onClick={handleSaveDraft}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0c77f2]/90"
              >
                Save as draft
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#198754] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#198754]/90"
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
