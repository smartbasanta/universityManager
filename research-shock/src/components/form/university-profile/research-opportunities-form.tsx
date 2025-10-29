"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAddUniversityResearch, useGetUniversityResearch } from "@/hooks/api/university/university.query";

export default function ResearchOpportunitiesForm() {
  const [research, setResearch] = useState([{ research_center: "", website_url: "" }]);

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { mutate: addUniversityResearch, isPending: isSaving } = useAddUniversityResearch();
  const { data: researchData, isLoading: isLoadingResearch, error: researchError } = useGetUniversityResearch();

  useEffect(() => {
    if (researchData && Array.isArray(researchData) && researchData.length > 0) {
      const formattedData = researchData.map((item: any) => ({
        research_center: item.research_center || "",
        website_url: item.website_url || "",
      }));
      setResearch(formattedData);
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [researchData]);

  const handleAddResearch = () => {
    if (isReadOnly) return;
    setResearch([...research, { research_center: "", website_url: "" }]);
  };

  const handleRemoveResearch = (index: number) => {
    if (isReadOnly) return;
    if (research.length > 1) {
      setResearch(research.filter((_, i) => i !== index));
    }
  };

  const handleSaveDraft = () => {
    const payload = research
      .filter(item => item.research_center.trim() !== "" && item.website_url.trim() !== "")
      .map(item => ({
        research_center: item.research_center,
        website_url: item.website_url,
        isDraft: true.toString(),
      }));
    addUniversityResearch(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = research
      .filter(item => item.research_center.trim() !== "" && item.website_url.trim() !== "")
      .map(item => ({
        research_center: item.research_center,
        website_url: item.website_url,
        isDraft: false.toString(),
      }));
    addUniversityResearch(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingResearch) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (researchError) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {researchError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <form className="space-y-6">
        {/* Research Opportunities */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Research Opportunities
          </label>
          {research.map((item, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">Research Opportunity #{index + 1}</h4>
                {research.length > 1 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveResearch(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Research Center/Facility
                </label>
                <Input
                  placeholder="e.g., Center for Advanced Materials Research"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.research_center}
                  onChange={(e) => {
                    const newResearch = [...research];
                    newResearch[index].research_center = e.target.value;
                    setResearch(newResearch);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Website URL
                </label>
                <Input
                  placeholder="e.g., https://research.university.edu/materials"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.website_url}
                  onChange={(e) => {
                    const newResearch = [...research];
                    newResearch[index].website_url = e.target.value;
                    setResearch(newResearch);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddResearch}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Research Opportunity
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
                disabled={isSaving}
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0c77f2]/90"
              >
                {isSaving ? "Saving..." : "Save as draft"}
              </Button>
              <Button
                disabled={isSaving}
                type="button"
                onClick={handleSubmit}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#198754] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#198754]/90"
              >
                {isSaving ? "Submitting..." : "Submit"}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
