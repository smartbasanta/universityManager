"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAddUniversityMajor, useGetUniversityMajor } from "@/hooks/api/university/university.query";

export default function MajorForm() {
  const [majors, setMajors] = useState([{ name: "", rank: "", link: "" }]);
  
  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
  const { mutate: addUniversityMajor, isPending } = useAddUniversityMajor()
  const { data, isLoading, error } = useGetUniversityMajor()

  // Populate form fields with existing data if available
  useEffect(() => {
    if (data) {
      setMajors(data);
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [data]);

  const handleAddMajor = () => {
    if (isReadOnly) return;
    setMajors([...majors, { name: "", rank: "", link: "" }]);
  };

  const handleRemoveMajor = (index: any) => {
    if (isReadOnly) return;
    setMajors(majors.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    const payload = majors.map((major) => ({ ...major, isDraft: true }));
    addUniversityMajor(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = majors.map((major) => ({ ...major, isDraft: false }));
    addUniversityMajor(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
  return (
    <div className="flex flex-col max-w-[960px] flex-1 mt-6">
      <form className="space-y-6">
        {/* Majors */}
        <div className="space-y-4 px-4">
          {majors.map((major, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">Major #{index + 1}</h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMajor(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div>
                <label className="text-gray text-base font-medium leading-normal">Major Name</label>
                <Input
                  placeholder="e.g., Computer Science"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={major.name}
                  onChange={(e) => {
                    const newMajors = [...majors];
                    newMajors[index].name = e.target.value;
                    setMajors(newMajors);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="text-gray text-base font-medium leading-normal">Rank</label>
                <Input
                  type="text"
                  placeholder="e.g., Top 10 in Nepal"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={major.rank}
                  onChange={(e) => {
                    const newMajors = [...majors];
                    newMajors[index].rank = e.target.value;
                    setMajors(newMajors);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="text-gray text-base font-medium leading-normal">Source Link</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={major.link}
                  onChange={(e) => {
                    const newMajors = [...majors];
                    newMajors[index].link = e.target.value;
                    setMajors(newMajors);
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
              onClick={handleAddMajor}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Major
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
                onClick={handleSaveDraft}
                disabled={isPending}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0c77f2]/90"
              >
                Save as draft
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
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
