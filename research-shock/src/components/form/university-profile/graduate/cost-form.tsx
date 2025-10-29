"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAddUniversityGraduateTuition, useGetUniversityGraduateTuition } from "@/hooks/api/university/university.query";

export default function CostForm() {
  const [tuition, setTuition] = useState([{ type: "In State", cost: 0 }]);
  const [averageAid, setAverageAid] = useState("");
  const [studentsReceivingAid, setStudentsReceivingAid] = useState("");
  const [housingCost, setHousingCost] = useState("");
  const [mealPlanCost, setMealPlanCost] = useState("");
  const [bookSuppliesCost, setBookSuppliesCost] = useState("");
  
  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
  const { mutate: addUniversityGraduateTuition, isPending: isSaving } = useAddUniversityGraduateTuition();
  const { data: tuitionResponse, isLoading: isLoadingTuition, error: tuitionError } = useGetUniversityGraduateTuition();

  // Populate form fields with existing data if available
  useEffect(() => {
    if (tuitionResponse) {
      const data = tuitionResponse;
      setAverageAid(data.avg_financial_aid || "");
      setStudentsReceivingAid(data.student_receiving_aid || "");
      setHousingCost(data.housing_cost || "");
      setMealPlanCost(data.meal_plan_cost || "");
      setBookSuppliesCost(data.books_supplies_cost || "");
      
      if (data.tuition_type && data.tuition_type.length > 0) {
        setTuition(data.tuition_type.map((item: any) => ({
          type: item.tuition_type || "In State",
          cost: parseFloat(item.annual_cost?.replace(/[$,]/g, '') || '0') || 0,
        })));
      } else {
        setTuition([{ type: "In State", cost: 0 }]);
      }
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [tuitionResponse]);

  const handleAddTuitionType = () => {
    if (isReadOnly) return;
    setTuition([...tuition, { type: "In State", cost: 0 }]);
  };

  const handleRemoveTuitionType = (index: number) => {
    if (isReadOnly) return;
    setTuition(tuition.filter((_, i) => i !== index));
  };

  const createPayload = (isDraft: boolean) => {
    // Filter out empty tuition types
    const filteredTuition = tuition.filter(
      (item) => item.type && item.cost > 0
    );

    return {
      avg_financial_aid: averageAid,
      student_receiving_aid: studentsReceivingAid,
      housing_cost: housingCost,
      meal_plan_cost: mealPlanCost,
      books_supplies_cost: bookSuppliesCost,
      isDraft: isDraft,
      tuition_type: filteredTuition.map(item => ({
        tuition_type: item.type,
        annual_cost: item.cost.toString(),
      })),
    };
  };

  const handleSaveDraft = () => {
    const payload = createPayload(true);
    addUniversityGraduateTuition(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = createPayload(false);
    addUniversityGraduateTuition(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingTuition) {
    return <div>Loading...</div>;
  }

  if (tuitionError) {
    return <div>Error: {tuitionError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <form className="space-y-6">
        {/* Tuition Types */}
        <div className="space-y-4 px-4">
          <h2 className="text-[#111418] text-base font-medium leading-normal pb-2">
            Tuition Types
          </h2>
          {tuition.map((item, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">Tuition Type #{index + 1}</h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTuitionType(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray text-base font-medium leading-normal">Tuition Type</label>
                  <Select
                    onValueChange={(value) => {
                      const newTuition = [...tuition];
                      newTuition[index].type = value;
                      setTuition(newTuition);
                    }}
                    value={item.type}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal">
                      <SelectValue placeholder="Select tuition type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In State">In State</SelectItem>
                      <SelectItem value="Out State">Out of State</SelectItem>
                      <SelectItem value="International">International</SelectItem>
                      <SelectItem value="International Undergraduate">International Undergraduate</SelectItem>
                      <SelectItem value="International Graduate">International Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-gray text-base font-medium leading-normal">Annual Cost ($)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 15000"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.cost}
                    onChange={(e) => {
                      const newTuition = [...tuition];
                      newTuition[index].cost = Number(e.target.value);
                      setTuition(newTuition);
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
              onClick={handleAddTuitionType}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tuition Type
            </Button>
          )}
        </div>

        {/* Financial Aid Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">Average Financial Aid</label>
            <Input
              type="text"
              placeholder="e.g., $10,000"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={averageAid}
              onChange={(e) => setAverageAid(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">Students Receiving Aid</label>
            <Input
              type="text"
              placeholder="e.g., 75%"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={studentsReceivingAid}
              onChange={(e) => setStudentsReceivingAid(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Additional Costs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">Housing Cost</label>
            <Input
              type="text"
              placeholder="e.g., $8,000"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={housingCost}
              onChange={(e) => setHousingCost(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">Meal Plan Cost</label>
            <Input
              type="text"
              placeholder="e.g., $5,000"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={mealPlanCost}
              onChange={(e) => setMealPlanCost(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">Books & Supplies</label>
            <Input
              type="text"
              placeholder="e.g., $1,200"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={bookSuppliesCost}
              onChange={(e) => setBookSuppliesCost(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>
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
                Save as Draft
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
