"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAddUniversityGraduateResearchHub, useGetUniversityGraduateResearchHub } from "@/hooks/api/university/university.query";

interface ResearchItem {
  researchCenter: string;
  principalInvestigator: string;
  researchCenterDescription: string;
  fundingSource: string;
  publishedPaperTags: string[];
}

interface FormData {
  research: ResearchItem[];
}

export default function GradResearchForm() {
  const [formData, setFormData] = useState<FormData>({
    research: [
      {
        researchCenter: "",
        principalInvestigator: "",
        researchCenterDescription: "",
        fundingSource: "",
        publishedPaperTags: [],
      },
    ],
  });

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { mutate: addUniversityGraduateResearchHub, isPending: isSaving } = useAddUniversityGraduateResearchHub();
  const { data: researchResponse, isLoading: isLoadingResearch, error: researchError } = useGetUniversityGraduateResearchHub();

  // Populate form fields with existing data if available
  useEffect(() => {
    if (researchResponse && Array.isArray(researchResponse) && researchResponse.length > 0) {
      setFormData({
        research: researchResponse.map((item: any) => ({
          researchCenter: item.research_center || "",
          principalInvestigator: item.principial_investigator || "", // Note: using the typo from your schema
          researchCenterDescription: item.description || "",
          fundingSource: item.funding_resource || "",
          publishedPaperTags: item.tags || [],
        }))
      });
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    } else {
      setFormData({
        research: [
          {
            researchCenter: "",
            principalInvestigator: "",
            researchCenterDescription: "",
            fundingSource: "",
            publishedPaperTags: [],
          },
        ],
      });
    }
  }, [researchResponse]);

  const addResearch = () => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      research: [
        ...prev.research,
        {
          researchCenter: "",
          principalInvestigator: "",
          researchCenterDescription: "",
          fundingSource: "",
          publishedPaperTags: [],
        },
      ],
    }));
  };

  const removeResearch = (index: number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      research: prev.research.filter((_, i) => i !== index),
    }));
  };

  const updateResearch = (
    index: number,
    field: keyof ResearchItem,
    value: string | string[]
  ) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      research: prev.research.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const createPayload = (isDraft: boolean) => {
    // Filter out empty research items
    const filteredResearch = formData.research.filter(
      (item) => item.researchCenter.trim() !== "" || 
                item.principalInvestigator.trim() !== "" || 
                item.researchCenterDescription.trim() !== ""
    );

    return filteredResearch.map((item) => ({
      research_center: item.researchCenter,
      principial_investigator: item.principalInvestigator, // Note: using the typo from your schema
      description: item.researchCenterDescription,
      funding_resource: item.fundingSource,
      tags: item.publishedPaperTags,
      isDraft: isDraft
    }));
  };

  const handleSaveAsDraft = () => {
    const payload = createPayload(true);
    addUniversityGraduateResearchHub(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = createPayload(false);
    addUniversityGraduateResearchHub(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingResearch) {
    return <div>Loading...</div>;
  }

  if (researchError) {
    return <div>Error: {researchError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1 mt-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Graduate Research */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Graduate Research Hub
          </label>
          {formData.research.map((item, index) => (
            <div
              key={index}
              className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">
                  Graduate Research #{index + 1}
                </h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResearch(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-gray text-base font-medium leading-normal">
                  Research Center
                </label>
                <Input
                  placeholder="e.g., Computational Neuroscience Lab"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.researchCenter}
                  onChange={(e) =>
                    updateResearch(index, "researchCenter", e.target.value)
                  }
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray text-base font-medium leading-normal">
                  Principal Investigator
                </label>
                <Input
                  placeholder="e.g., Dr. Alan Turing"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.principalInvestigator}
                  onChange={(e) =>
                    updateResearch(index, "principalInvestigator", e.target.value)
                  }
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray text-base font-medium leading-normal">
                  Research Center Description
                </label>
                <Textarea
                  placeholder="e.g., A cutting-edge facility focused on understanding neural computation through advanced modeling and simulation techniques..."
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] placeholder:text-[#60748a] p-4 text-base font-normal leading-normal min-h-[100px]"
                  value={item.researchCenterDescription}
                  onChange={(e) =>
                    updateResearch(index, "researchCenterDescription", e.target.value)
                  }
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray text-base font-medium leading-normal">
                  Funding Source (optional)
                </label>
                <Input
                  placeholder="e.g., NSF Grant #123456"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.fundingSource}
                  onChange={(e) =>
                    updateResearch(index, "fundingSource", e.target.value)
                  }
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
                  Tags / Keywords
                </label>
                <TagInput
                  value={item.publishedPaperTags}
                  onChange={(tags) => updateResearch(index, "publishedPaperTags", tags)}
                  placeholder="Add tags (e.g., space, propulsion, AI ethics)"
                  disabled={isReadOnly}
                />
                <p className="text-gray-500 text-sm mt-2">
                  Enter keywords related to your research. Press Enter or comma to add each tag.
                </p>
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={addResearch}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Graduate Research
            </Button>
          )}
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
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={isSaving}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0c77f2]/90"
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
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
