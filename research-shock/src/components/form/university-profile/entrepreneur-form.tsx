"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAddUniversityEntrepreneurship, useGetUniversityEntrepreneurship } from "@/hooks/api/university/university.query";

export default function EntrepreneurOpportunitiesForm() {
  const [success_stories, setSuccessStories] = useState("");
  const [incubator, setIncubator] = useState([{ name: "", website: "" }]);
  const [hackathon, setHackathon] = useState([{ name: "", website: "" }]);

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { mutate: addUniversityEntrepreneurship, isPending: isSaving } = useAddUniversityEntrepreneurship();
  const { data: entrepreneurshipData, isLoading: isLoadingEntrepreneurship, error: entrepreneurshipError } = useGetUniversityEntrepreneurship();

  useEffect(() => {
    if (entrepreneurshipData) {
      const data = entrepreneurshipData;
      setSuccessStories(data.success_stories || "");
      setIncubator(
        Array.isArray(data.incubator) && data.incubator.length > 0
          ? data.incubator.map((item: any) => ({
              name: item.name || "",
              website: item.website || "",
            }))
          : [{ name: "", website: "" }]
      );
      setHackathon(
        Array.isArray(data.hackathon) && data.hackathon.length > 0
          ? data.hackathon.map((item: any) => ({
              name: item.name || "",
              website: item.website || "",
            }))
          : [{ name: "", website: "" }]
      );
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [entrepreneurshipData]);

  const handleAddIncubator = () => {
    if (isReadOnly) return;
    setIncubator([...incubator, { name: "", website: "" }]);
  };

  const handleRemoveIncubator = (index: number) => {
    if (isReadOnly) return;
    if (incubator.length > 1) {
      setIncubator(incubator.filter((_, i) => i !== index));
    }
  };

  const handleAddHackathon = () => {
    if (isReadOnly) return;
    setHackathon([...hackathon, { name: "", website: "" }]);
  };

  const handleRemoveHackathon = (index: number) => {
    if (isReadOnly) return;
    if (hackathon.length > 1) {
      setHackathon(hackathon.filter((_, i) => i !== index));
    }
  };

  const handleSaveDraft = () => {
    const payload = {
      success_stories,
      incubator: incubator.filter(item => item.name.trim() !== ""),
      hackathon: hackathon.filter(item => item.name.trim() !== ""),
      isDraft: true.toString(),
    };
    addUniversityEntrepreneurship(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = {
      success_stories,
      incubator: incubator.filter(item => item.name.trim() !== ""),
      hackathon: hackathon.filter(item => item.name.trim() !== ""),
      isDraft: false.toString(),
    };
    addUniversityEntrepreneurship(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingEntrepreneurship) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (entrepreneurshipError) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {entrepreneurshipError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <form className="space-y-6">
        {/* Success Stories */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Success Stories
          </label>
          <Textarea
            placeholder="Notable startup success stories from students/alumni..."
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={success_stories}
            onChange={(e) => setSuccessStories(e.target.value)}
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
          <p className="text-gray-500 text-sm mt-2">
            Examples of successful ventures from the university community
          </p>
        </div>

        {/* Startup Incubators */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Startup Incubators/Accelerators
          </label>
          {incubator.map((item, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">Incubator #{index + 1}</h4>
                {incubator.length > 1 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIncubator(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              
              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Name
                </label>
                <Input
                  placeholder="e.g., University Innovation Hub"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.name}
                  onChange={(e) => {
                    const newIncubators = [...incubator];
                    newIncubators[index].name = e.target.value;
                    setIncubator(newIncubators);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Website
                </label>
                <Input
                  placeholder="https://example.com"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.website}
                  onChange={(e) => {
                    const newIncubators = [...incubator];
                    newIncubators[index].website = e.target.value;
                    setIncubator(newIncubators);
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
              onClick={handleAddIncubator}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Incubator
            </Button>
          )}
        </div>

        {/* Annual Hackathon */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Annual Hackathon/Competition
          </label>
          {hackathon.map((item, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">Hackathon #{index + 1}</h4>
                {hackathon.length > 1 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHackathon(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              
              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Name
                </label>
                <Input
                  placeholder="e.g., Annual Tech Innovation Challenge"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.name}
                  onChange={(e) => {
                    const newHackathons = [...hackathon];
                    newHackathons[index].name = e.target.value;
                    setHackathon(newHackathons);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Website
                </label>
                <Input
                  placeholder="https://example.com"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={item.website}
                  onChange={(e) => {
                    const newHackathons = [...hackathon];
                    newHackathons[index].website = e.target.value;
                    setHackathon(newHackathons);
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
              onClick={handleAddHackathon}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Hackathon
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
