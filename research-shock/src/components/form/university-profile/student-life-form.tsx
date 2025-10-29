"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAddUniversityStudentLife, useGetUniversityStudentLife } from "@/hooks/api/university/university.query";

export default function StudentLifeForm() {
  const [description, setDescription] = useState("");
  const [no_of_students_organisation, setNoOfStudentsOrganisation] = useState("");
  const [category, setCategory] = useState([""]);
  const [tradition, setTradition] = useState([""]);

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { mutate: addUniversityStudentLife, isPending: isSaving } = useAddUniversityStudentLife();
  const { data: studentLifeData, isLoading: isLoadingStudentLife, error: studentLifeError } = useGetUniversityStudentLife();

  useEffect(() => {
    if (studentLifeData) {
      const data = studentLifeData;
      setDescription(data.description || "");
      setNoOfStudentsOrganisation(data.no_of_students_organisation || "");
      setCategory(data.category && data.category.length > 0 ? data.category : [""]);
      setTradition(data.tradition && data.tradition.length > 0 ? data.tradition : [""]);
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [studentLifeData]);

  const handleAddCategory = () => {
    if (isReadOnly) return;
    setCategory([...category, ""]);
  };

  const handleRemoveCategory = (index: number) => {
    if (isReadOnly) return;
    if (category.length > 1) {
      setCategory(category.filter((_, i) => i !== index));
    }
  };

  const handleAddTradition = () => {
    if (isReadOnly) return;
    setTradition([...tradition, ""]);
  };

  const handleRemoveTradition = (index: number) => {
    if (isReadOnly) return;
    if (tradition.length > 1) {
      setTradition(tradition.filter((_, i) => i !== index));
    }
  };

  const handleSaveDraft = () => {
    const payload = {
      description,
      no_of_students_organisation,
      category: category.filter(cat => cat.trim() !== ""),
      tradition: tradition.filter(trad => trad.trim() !== ""),
      isDraft: true.toString(),
    };
    addUniversityStudentLife(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = {
      description,
      no_of_students_organisation,
      category: category.filter(cat => cat.trim() !== ""),
      tradition: tradition.filter(trad => trad.trim() !== ""),
      isDraft: false.toString(),
    };
    addUniversityStudentLife(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingStudentLife) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (studentLifeError) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {studentLifeError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <form className="space-y-6">
        {/* Description */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Description
          </label>
          <Textarea
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            placeholder="Give a detail description about student housing, campus security and wellbeing programs or resources"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
          <p className="text-gray-500 text-sm mt-2">
            Add overall highlights about student life, housing, and campus culture.
          </p>
        </div>

        {/* Number of Student Organizations */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Number of Student Organizations
          </label>
          <Input
            placeholder="Number of student organization in campus"
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={no_of_students_organisation}
            onChange={(e) => setNoOfStudentsOrganisation(e.target.value)}
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>

        {/* Club Categories */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Club Categories
          </label>
          {category.map((cat, index) => (
            <div key={index} className="p-4 bg-gray-200 rounded-lg mb-2 flex items-center gap-4">
              <div className="flex-1">
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Category Name
                </label>
                <Input
                  placeholder="e.g., Academic, Sports, Cultural"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={cat}
                  onChange={(e) => {
                    const newCategories = [...category];
                    newCategories[index] = e.target.value;
                    setCategory(newCategories);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
              {category.length > 1 && !isReadOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCategory(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCategory}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>

        {/* Campus Traditions */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Top Campus Traditions
          </label>
          {tradition.map((trad, index) => (
            <div key={index} className="p-4 bg-gray-200 rounded-lg mb-2 flex items-center gap-4">
              <div className="flex-1">
                <label className="text-gray-700 text-base font-medium leading-normal block mb-2">
                  Tradition Name
                </label>
                <Input
                  placeholder="e.g., Homecoming, Spring Festival"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={trad}
                  onChange={(e) => {
                    const newTraditions = [...tradition];
                    newTraditions[index] = e.target.value;
                    setTradition(newTraditions);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
              {tradition.length > 1 && !isReadOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTradition(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTradition}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tradition
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
