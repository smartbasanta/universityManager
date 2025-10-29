"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit } from "lucide-react";
import { useAddUniversityUndergraduateGraduationDetail, useGetUniversityUndergraduateGraduationDetail } from "@/hooks/api/university/university.query";

interface GraduationRate {
  rate: number;
  description: string;
}

interface EmploymentRate {
  rate: number;
  description: string;
}

interface MedianEarnings {
  value: number;
  description: string;
}

interface FormData {
  graduation_rate: GraduationRate[];
  employment_rate: EmploymentRate[];
  median_earnings: MedianEarnings[];
}

export default function GraduationForm() {
  const [formData, setFormData] = useState<FormData>({
    graduation_rate: [{ rate: 0, description: "" }],
    employment_rate: [{ rate: 0, description: "" }],
    median_earnings: [{ value: 0, description: "" }],
  });

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { mutate: addUniversityUndergraduateGraduationDetail, isPending: isSaving } = useAddUniversityUndergraduateGraduationDetail();
  const { data: graduationResponse, isLoading: isLoadingGraduation, error: graduationError } = useGetUniversityUndergraduateGraduationDetail();

  // Populate form fields with existing data if available
  useEffect(() => {
    if (graduationResponse) {
      const data = graduationResponse;
      
      setFormData({
        graduation_rate: data.graduationRates && data.graduationRates.length > 0 
          ? data.graduationRates.map((item: any) => ({
              rate: parseFloat(item.rate?.replace(/[%$,]/g, '') || '0') || 0,
              description: item.description || ""
            }))
          : [{ rate: 0, description: "" }],
          
        employment_rate: data.employmentRates && data.employmentRates.length > 0
          ? data.employmentRates.map((item: any) => ({
              rate: parseFloat(item.rate?.replace(/[%$,]/g, '') || '0') || 0,
              description: item.description || ""
            }))
          : [{ rate: 0, description: "" }],
          
        median_earnings: data.medianEarnings && data.medianEarnings.length > 0
          ? data.medianEarnings.map((item: any) => ({
              value: parseFloat(item.amount?.replace(/[%$,]/g, '') || '0') || 0,
              description: item.description || ""
            }))
          : [{ value: 0, description: "" }]
      });
      
      // Set form as submitted and read-only since data exists
      setIsFormSubmitted(true);
      setIsReadOnly(true);
    }
  }, [graduationResponse]);

  // Graduation Rate handlers
  const addGraduationRate = () => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      graduation_rate: [...prev.graduation_rate, { rate: 0, description: "" }]
    }));
  };

  const removeGraduationRate = (index: number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      graduation_rate: prev.graduation_rate.filter((_, i) => i !== index)
    }));
  };

  const updateGraduationRate = (index: number, field: keyof GraduationRate, value: string | number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      graduation_rate: prev.graduation_rate.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Employment Rate handlers
  const addEmploymentRate = () => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      employment_rate: [...prev.employment_rate, { rate: 0, description: "" }]
    }));
  };

  const removeEmploymentRate = (index: number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      employment_rate: prev.employment_rate.filter((_, i) => i !== index)
    }));
  };

  const updateEmploymentRate = (index: number, field: keyof EmploymentRate, value: string | number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      employment_rate: prev.employment_rate.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Median Earnings handlers
  const addMedianEarnings = () => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      median_earnings: [...prev.median_earnings, { value: 0, description: "" }]
    }));
  };

  const removeMedianEarnings = (index: number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      median_earnings: prev.median_earnings.filter((_, i) => i !== index)
    }));
  };

  const updateMedianEarnings = (index: number, field: keyof MedianEarnings, value: string | number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      median_earnings: prev.median_earnings.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const createPayload = (isDraft: boolean) => {
    // Filter out empty entries
    const filteredGraduationRates = formData.graduation_rate.filter(
      (item) => item.rate > 0 || item.description.trim() !== ""
    );
    
    const filteredEmploymentRates = formData.employment_rate.filter(
      (item) => item.rate > 0 || item.description.trim() !== ""
    );
    
    const filteredMedianEarnings = formData.median_earnings.filter(
      (item) => item.value > 0 || item.description.trim() !== ""
    );

    return {
      isDraft: isDraft,
      graduationRates: filteredGraduationRates.map(item => ({
        rate: item.rate.toString(),
        description: item.description
      })),
      employmentRates: filteredEmploymentRates.map(item => ({
        rate: item.rate.toString(),
        description: item.description
      })),
      medianEarnings: filteredMedianEarnings.map(item => ({
        amount: item.value.toString(), // Map 'value' to 'amount' for API
        description: item.description
      }))
    };
  };

  // Form submission handlers
  const handleSaveAsDraft = () => {
    const payload = createPayload(true);
    addUniversityUndergraduateGraduationDetail(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = createPayload(false);
    addUniversityUndergraduateGraduationDetail(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingGraduation) {
    return <div>Loading...</div>;
  }

  if (graduationError) {
    return <div>Error: {graduationError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1 mt-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Graduation Rate Section */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Graduation Rates
          </label>
          {formData.graduation_rate.map((item, index) => (
            <div
              key={index}
              className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">
                  Entry #{index + 1}
                </h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGraduationRate(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray text-base font-medium leading-normal">
                    Rate (%)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 85"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.rate || ""}
                    onChange={(e) => updateGraduationRate(index, 'rate', Number(e.target.value))}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                  <p className="text-sm text-gray-600">
                    Graduation rate percentage (0-100)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-gray text-base font-medium leading-normal">
                    Description
                  </label>
                  <Input
                    placeholder="e.g., 4-year graduation rate for 2022 cohort"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.description}
                    onChange={(e) => updateGraduationRate(index, 'description', e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                  <p className="text-sm text-gray-600">Context for this rate</p>
                </div>
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={addGraduationRate}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Graduation Rate
            </Button>
          )}
        </div>

        {/* Employment Rate Section */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Employment Rates
          </label>
          {formData.employment_rate.map((item, index) => (
            <div
              key={index}
              className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">
                  Entry #{index + 1}
                </h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmploymentRate(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray text-base font-medium leading-normal">
                    Rate (%)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 92"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.rate || ""}
                    onChange={(e) => updateEmploymentRate(index, 'rate', Number(e.target.value))}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                  <p className="text-sm text-gray-600">
                    Employment rate percentage (0-100)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-gray text-base font-medium leading-normal">
                    Description
                  </label>
                  <Input
                    placeholder="e.g., Employment within 6 months of graduation"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.description}
                    onChange={(e) => updateEmploymentRate(index, 'description', e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                  <p className="text-sm text-gray-600">Context for this rate</p>
                </div>
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={addEmploymentRate}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employment Rate
            </Button>
          )}
        </div>

        {/* Median Earnings Section */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2 block">
            Median Earnings
          </label>
          {formData.median_earnings.map((item, index) => (
            <div
              key={index}
              className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">
                  Entry #{index + 1}
                </h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedianEarnings(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray text-base font-medium leading-normal">
                    Amount ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 65000"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.value || ""}
                    onChange={(e) => updateMedianEarnings(index, 'value', Number(e.target.value))}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                  <p className="text-sm text-gray-600">
                    Median annual earnings
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-gray text-base font-medium leading-normal">
                    Description
                  </label>
                  <Input
                    placeholder="e.g., Median earnings 5 years after graduation"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.description}
                    onChange={(e) => updateMedianEarnings(index, 'description', e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                  <p className="text-sm text-gray-600">
                    Context for this value
                  </p>
                </div>
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={addMedianEarnings}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Earnings Data
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
                Save as draft
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
