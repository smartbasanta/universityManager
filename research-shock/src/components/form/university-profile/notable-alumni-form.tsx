"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAddUniversityNotableAlumni, useGetUniversityNotableAlumni } from "@/hooks/api/university/university.query";

export default function NotableAlumniForm() {
  const [notableAlumni, setNotableAlumni] = useState([{ name: "", profession: "", notable_achievements: "" }]);

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { mutate: addUniversityNotableAlumni, isPending: isSaving } = useAddUniversityNotableAlumni();
  const { data: alumniData, isLoading: isLoadingAlumni, error: alumniError } = useGetUniversityNotableAlumni();

  useEffect(() => {
    if (alumniData && Array.isArray(alumniData) && alumniData.length > 0) {
      const formattedData = alumniData.map((item: any) => ({
        name: item.name || "",
        profession: item.profession || "",
        notable_achievements: item.notable_achievements || "",
      }));
      setNotableAlumni(formattedData);
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [alumniData]);

  const handleAddAlumni = () => {
    if (isReadOnly) return;
    setNotableAlumni([...notableAlumni, { name: "", profession: "", notable_achievements: "" }]);
  };

  const handleRemoveAlumni = (index: number) => {
    if (isReadOnly) return;
    if (notableAlumni.length > 1) {
      setNotableAlumni(notableAlumni.filter((_, i) => i !== index));
    }
  };

  const handleSaveDraft = () => {
    const payload = notableAlumni
      .filter(item => item.name.trim() !== "" && item.profession.trim() !== "")
      .map(item => ({
        name: item.name,
        profession: item.profession,
        notable_achievements: item.notable_achievements,
        isDraft: true.toString(),
      }));
    addUniversityNotableAlumni(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = notableAlumni
      .filter(item => item.name.trim() !== "" && item.profession.trim() !== "")
      .map(item => ({
        name: item.name,
        profession: item.profession,
        notable_achievements: item.notable_achievements,
        isDraft: false.toString(),
      }));
    addUniversityNotableAlumni(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingAlumni) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (alumniError) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {alumniError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <form className="space-y-6">
        {/* Notable Alumni */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Notable Alumni
          </label>
          {notableAlumni.map((alumni, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">Alumni #{index + 1}</h4>
                {notableAlumni.length > 1 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAlumni(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              
              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Alumni Name
                </label>
                <Input
                  placeholder="e.g., John Doe"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={alumni.name}
                  onChange={(e) => {
                    const newAlumni = [...notableAlumni];
                    newAlumni[index].name = e.target.value;
                    setNotableAlumni(newAlumni);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
                <p className="text-gray-500 text-sm mt-1">
                  Full name of the notable alumni
                </p>
              </div>

              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Profession
                </label>
                <Input
                  placeholder="e.g., CEO of Tech Company"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={alumni.profession}
                  onChange={(e) => {
                    const newAlumni = [...notableAlumni];
                    newAlumni[index].profession = e.target.value;
                    setNotableAlumni(newAlumni);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
                <p className="text-gray-500 text-sm mt-1">
                  Current or most notable profession
                </p>
              </div>

              <div>
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Notable Achievements
                </label>
                <Textarea
                  placeholder="e.g., Published 3 books, Nobel Prize winner, Founded successful startup"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] min-h-24 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={alumni.notable_achievements}
                  onChange={(e) => {
                    const newAlumni = [...notableAlumni];
                    newAlumni[index].notable_achievements = e.target.value;
                    setNotableAlumni(newAlumni);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
                <p className="text-gray-500 text-sm mt-1">
                  Most significant accomplishments and achievements
                </p>
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAlumni}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Notable Alumni
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
