"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowLeft, Edit } from "lucide-react";
import { useAddUniversityRanking, useGetUniversityRanking } from "@/hooks/api/university/university.query";

type RankingType = "graduate" | "undergraduate" | null;

interface RankingData {
  rank: string;
  description: string;
  source_link: string;
}

export default function RankingsForm() {
  const [activeRankingType, setActiveRankingType] = useState<RankingType>(null);
  const [graduateRankings, setGraduateRankings] = useState<RankingData[]>([
    { rank: "", description: "", source_link: "" }
  ]);
  const [undergraduateRankings, setUndergraduateRankings] = useState<RankingData[]>([
    { rank: "", description: "", source_link: "" }
  ]);

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // API hooks
  const { mutate: addUniversityRanking, isPending: isSaving } = useAddUniversityRanking();
  const { data: graduateRankingData, isLoading: isLoadingGraduate } = useGetUniversityRanking("GRADUATE");
  const { data: undergraduateRankingData, isLoading: isLoadingUndergraduate } = useGetUniversityRanking("UNDERGRADUATE");

  // Populate form fields with existing data
  useEffect(() => {
    if (graduateRankingData && Array.isArray(graduateRankingData) && graduateRankingData.length > 0) {
      setGraduateRankings(graduateRankingData.map((item: any) => ({
        rank: item.rank || "",
        description: item.description || "",
        source_link: item.source_link || ""
      })));
    }
  }, [graduateRankingData]);

  useEffect(() => {
    if (undergraduateRankingData && Array.isArray(undergraduateRankingData) && undergraduateRankingData.length > 0) {
      setUndergraduateRankings(undergraduateRankingData.map((item: any) => ({
        rank: item.rank || "",
        description: item.description || "",
        source_link: item.source_link || ""
      })));
    }
  }, [undergraduateRankingData]);

  // Set form as read-only if data exists
  useEffect(() => {
    if (activeRankingType === "graduate" && graduateRankingData && graduateRankingData.length > 0) {
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    } else if (activeRankingType === "undergraduate" && undergraduateRankingData && undergraduateRankingData.length > 0) {
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [activeRankingType, graduateRankingData, undergraduateRankingData]);

  const getCurrentRankings = () => {
    return activeRankingType === "graduate" ? graduateRankings : undergraduateRankings;
  };

  const setCurrentRankings = (rankings: RankingData[]) => {
    if (activeRankingType === "graduate") {
      setGraduateRankings(rankings);
    } else {
      setUndergraduateRankings(rankings);
    }
  };

  const handleAddRanking = () => {
    if (isReadOnly) return;
    const currentRankings = getCurrentRankings();
    setCurrentRankings([...currentRankings, { rank: "", description: "", source_link: "" }]);
  };

  const handleRemoveRanking = (index: number) => {
    if (isReadOnly) return;
    const currentRankings = getCurrentRankings();
    setCurrentRankings(currentRankings.filter((_, i) => i !== index));
  };

  const handleUpdateRanking = (index: number, field: keyof RankingData, value: string) => {
    if (isReadOnly) return;
    const currentRankings = getCurrentRankings();
    const newRankings = [...currentRankings];
    newRankings[index] = { ...newRankings[index], [field]: value };
    setCurrentRankings(newRankings);
  };

  const createPayload = (isDraft: boolean) => {
    const currentRankings = getCurrentRankings();
    const filteredRankings = currentRankings.filter(
      (ranking) => ranking.rank.trim() !== "" || ranking.description.trim() !== "" || ranking.source_link.trim() !== ""
    );

    return filteredRankings.map((ranking) => ({
      rank: ranking.rank,
      description: ranking.description,
      source_link: ranking.source_link,
      isDraft: isDraft,
      status: activeRankingType === "graduate" ? "GRADUATE" : "UNDERGRADUATE"
    }));
  };

  const handleSaveDraft = () => {
    const payload = createPayload(true);
    addUniversityRanking(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = createPayload(false);
    addUniversityRanking(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  const handleBackToSelection = () => {
    setActiveRankingType(null);
    setIsReadOnly(false);
    setIsFormSubmitted(false);
  };

  const handleRankingTypeSelect = (type: RankingType) => {
    setActiveRankingType(type);
    setIsReadOnly(false);
    setIsFormSubmitted(false);
  };

  // Loading states
  if (isLoadingGraduate || isLoadingUndergraduate) {
    return <div>Loading...</div>;
  }

  // Main selection view
  if (activeRankingType === null) {
    return (
      <div className="flex flex-col max-w-[960px] flex-1 mt-5">
        <div className="px-4 py-6">
          <h2 className="text-[#111418] text-xl font-semibold leading-normal mb-6">
            University Rankings
          </h2>
          <p className="text-gray-600 text-base leading-normal mb-8">
            Choose which type of rankings you want to manage:
          </p>
          
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRankingTypeSelect("graduate")}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Graduate Rankings
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleRankingTypeSelect("undergraduate")}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Undergraduate Rankings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form view for selected ranking type
  const currentRankings = getCurrentRankings();
  const titleText = activeRankingType === "graduate" ? "Graduate Rankings" : "Undergraduate Rankings";

  return (
    <div className="flex flex-col max-w-[960px] flex-1 mt-5">
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBackToSelection}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-[#111418] text-xl font-semibold leading-normal">
            {titleText}
          </h2>
        </div>
        <p className="text-gray-600 text-sm leading-normal ml-11">
          Add and manage {activeRankingType} program rankings
        </p>
      </div>

      <form className="space-y-6 mt-4">
        {/* Rankings */}
        <div className="space-y-4 px-4">
          {currentRankings.map((rank, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">
                  {titleText.split(' ')[0]} Ranking #{index + 1}
                </h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRanking(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-gray text-base font-medium leading-normal">Rank</label>
                <Input
                  placeholder="e.g., Top 5 in Asia"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={rank.rank}
                  onChange={(e) => handleUpdateRanking(index, "rank", e.target.value)}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray text-base font-medium leading-normal">Description</label>
                <Input
                  placeholder={`e.g., Based on academic reputation`}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={rank.description}
                  onChange={(e) => handleUpdateRanking(index, "description", e.target.value)}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray text-base font-medium leading-normal">Source Link</label>
                <Input
                  placeholder="https://ranking.org/uni123"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                  value={rank.source_link}
                  onChange={(e) => handleUpdateRanking(index, "source_link", e.target.value)}
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
              onClick={handleAddRanking}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another {titleText.split(' ')[0]} Ranking
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
                disabled={isSaving}
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
