"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAddUniversitySports, useGetUniversitySports } from "@/hooks/api/university/university.query";

export default function SportsForm() {
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState([{ name: "", website: "" }]);
  const [menSports, setMenSports] = useState([""]);
  const [womenSports, setWomenSports] = useState([""]);

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { mutate: addUniversitySports, isPending: isSaving } = useAddUniversitySports();
  const { data: sportsData, isLoading: isLoadingSports, error: sportsError } = useGetUniversitySports();

  useEffect(() => {
    if (sportsData && sportsData.length > 0) {
      const data = sportsData[0];
      setDescription(data.description);
      setFacilities(data.facilities.map((facility: any) => ({ name: facility.name, website: facility.website })));
      setMenSports(data.men_sports.length > 0 ? data.men_sports : [""]); 
      setWomenSports(data.women_sports.length > 0 ? data.women_sports : [""]);
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [sportsData]);

  const handleAddFacility = () => {
    if (isReadOnly) return;
    setFacilities([...facilities, { name: "", website: "" }]);
  };

  const handleRemoveFacility = (index: any) => {
    if (isReadOnly) return;
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const handleAddMenSport = () => {
    if (isReadOnly) return;
    setMenSports([...menSports, ""]);
  };

  const handleRemoveMenSport = (index: any) => {
    if (isReadOnly) return;
    setMenSports(menSports.filter((_, i) => i !== index));
  };

  const handleAddWomenSport = () => {
    if (isReadOnly) return;
    setWomenSports([...womenSports, ""]);
  };

  const handleRemoveWomenSport = (index: any) => {
    if (isReadOnly) return;
    setWomenSports(womenSports.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    const payload = {
      description,
      isDraft: true,
      men_sports: menSports.filter(sport => sport),
      women_sports: womenSports.filter(sport => sport),
      facilities,
    };
    addUniversitySports(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = {
      description,
      isDraft: false,
      men_sports: menSports.filter(sport => sport),
      women_sports: womenSports.filter(sport => sport),
      facilities,
    };
    addUniversitySports(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingSports) {
    return <div>Loading...</div>;
  }

  if (sportsError) {
    return <div>Error: {sportsError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <form className="space-y-6">
        {/* Description */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Description
          </label>
          <Textarea
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            placeholder="e.g., Annual tournaments, sports culture, national achievements"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
          <p className="text-gray-500 text-sm">
            Add overall highlights like events, achievements, or sports culture.
          </p>
        </div>

        {/* Facilities */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Sports Facilities
          </label>
          {facilities.map((facility, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">Facilities #{index + 1}</h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFacility(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div>
                <label className="text-gray text-base font-medium leading-normal">
                  Sports Facility Name
                </label>
                <Input
                  placeholder="e.g., Basketball Court"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={facility.name}
                  onChange={(e) => {
                    const newFacilities = [...facilities];
                    newFacilities[index].name = e.target.value;
                    setFacilities(newFacilities);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="text-gray text-base font-medium leading-normal">
                  Website (Optional)
                </label>
                <Input
                  placeholder="e.g., https://connorsports.com/"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={facility.website}
                  onChange={(e) => {
                    const newFacilities = [...facilities];
                    newFacilities[index].website = e.target.value;
                    setFacilities(newFacilities);
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
              onClick={handleAddFacility}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Facilities
            </Button>
          )}
        </div>

        {/* Men's Sports */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Men&lsquo;s Sports
          </label>
          {menSports.map((sport, index) => (
            <div key={index} className="p-4 bg-gray-200 rounded-lg mb-2 flex items-center gap-4">
              <div className="flex-1">
                <label className="text-gray text-base font-medium leading-normal">
                  Sports Name
                </label>
                <Input
                  placeholder="e.g., Basketball"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={sport}
                  onChange={(e) => {
                    const newMenSports = [...menSports];
                    newMenSports[index] = e.target.value;
                    setMenSports(newMenSports);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
              {!isReadOnly && (
                <Button
                  disabled={index === 0}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMenSport(index)}
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
              onClick={handleAddMenSport}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Men&apos;s Sport
            </Button>
          )}
        </div>

        {/* Women's Sports */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Women&apos;s Sports
          </label>
          {womenSports.map((sport, index) => (
            <div key={index} className="p-4 bg-gray-200 rounded-lg mb-2 flex items-center gap-4">
              <div className="flex-1">
                <label className="text-gray text-base font-medium leading-normal">
                  Sports Name
                </label>
                <Input
                  placeholder="e.g., Basketball"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={sport}
                  onChange={(e) => {
                    const newWomenSports = [...womenSports];
                    newWomenSports[index] = e.target.value;
                    setWomenSports(newWomenSports);
                  }}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
              {!isReadOnly && (
                <Button
                  disabled={index === 0}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveWomenSport(index)}
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
              onClick={handleAddWomenSport}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Women&lsquo;s Sport
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
                Save as draft
              </Button>
              <Button
                disabled={isSaving}
                type="button"
                onClick={handleSubmit}
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
