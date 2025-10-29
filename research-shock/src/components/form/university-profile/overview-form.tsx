"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Edit } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddUniversityOverview, useGetUniversityOverview } from "@/hooks/api/university/university.query";
import { countries } from "@/lib/countries";

export default function OverviewForm() {
  const [student_to_faculty_ratio, setStudentToFacultyRatio] = useState("");
  const [research_expenditure, setResearchExpenditure] = useState("");
  const [description, setDescription] = useState("");
  const [street_name, setStreetName] = useState("");
  const [state_name, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [area_type, setAreaType] = useState({
    urban: false,
    suburban: false,
    rural: false,
  });
  const [university_type, setUniversityType] = useState("");
  const [annual_costs, setAnnualCosts] = useState([
    {
      cost: "",
      description: "",
    },
  ]);
  const [university_overview_acceptence_rate, setUniversityOverviewAcceptenceRate] = useState([
    {
      rate: "",
      type: "In State",
      level: "Undergraduate",
      year: new Date().getFullYear(),
    },
  ]);

  // New state for read-only mode and edit functionality
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { mutate: addUniversityOverview, isPending: isSaving } = useAddUniversityOverview();
  const { data: overviewResponse, isLoading: isLoadingOverview, error: overviewError } = useGetUniversityOverview();

  // Mapping functions for converting categorical values to number strings
  const getTypeNumber = (type: string): string => {
    const typeMapping: { [key: string]: string } = {
      "In State": "1",
      "Out State": "2", 
      "International": "3",
      "Transfer Student": "4",
      "Early Decision": "5"
    };
    return typeMapping[type] || "1";
  };

  const getLevelNumber = (level: string): string => {
    const levelMapping: { [key: string]: string } = {
      "Graduate": "1",
      "Undergraduate": "2"
    };
    return levelMapping[level] || "2";
  };

  // Reverse mapping for displaying values from API
  const getTypeFromNumber = (typeNum: string): string => {
    const reverseTypeMapping: { [key: string]: string } = {
      "1": "In State",
      "2": "Out State",
      "3": "International", 
      "4": "Transfer Student",
      "5": "Early Decision"
    };
    return reverseTypeMapping[typeNum] || "In State";
  };

  const getLevelFromNumber = (levelNum: string): string => {
    const reverseLevelMapping: { [key: string]: string } = {
      "1": "Graduate",
      "2": "Undergraduate"
    };
    return reverseLevelMapping[levelNum] || "Undergraduate";
  };

  // Helper function to convert area_type string to object
  const convertAreaTypeToObject = (areaTypeStr: string) => {
    return {
      urban: areaTypeStr === "Urban",
      suburban: areaTypeStr === "Suburban", 
      rural: areaTypeStr === "Rural"
    };
  };

  // Helper function to convert area_type object to string
  const convertAreaTypeToString = (areaTypeObj: any) => {
    if (areaTypeObj.urban) return "Urban";
    if (areaTypeObj.suburban) return "Suburban";
    if (areaTypeObj.rural) return "Rural";
    return "";
  };

 useEffect(() => {
  // Handle direct response (not nested under 'data')
  if (overviewResponse) {
    const data = overviewResponse;
    setStudentToFacultyRatio(data.student_to_faculty_ratio || "");
    setResearchExpenditure(data.research_expenditure || "");
    setDescription(data.description || "");
    setStreetName(data.street || ""); // Map API 'street' to form 'street_name'
    setStateName(data.state || ""); // Map API 'state' to form 'state_name'
    setCountry(data.country || "");
    
    // Convert API area_type string to form object
    setAreaType(convertAreaTypeToObject(data.area_type || ""));
    
    setUniversityType(data.university_type || "");
    
    // Map API university_avg_anual_cost to form annual_costs
    if (data.university_avg_anual_cost && data.university_avg_anual_cost.length > 0) {
      const mappedCosts = data.university_avg_anual_cost.map((item: any) => ({
        cost: item.avg_anual_cost || "",
        description: item.description || "",
      }));
      setAnnualCosts(mappedCosts);
    } else {
      setAnnualCosts([
        {
          cost: "",
          description: "",
        },
      ]);
    }
    
    // Convert API response to form format
    if (data.university_overview_acceptence_rate && data.university_overview_acceptence_rate.length > 0) {
      const convertedRates = data.university_overview_acceptence_rate.map((item: any) => ({
        rate: item.acceptance_rate || "", // Map API 'acceptance_rate' to form 'rate'
        type: getTypeFromNumber(item.type),
        level: getLevelFromNumber(item.level),
        year: parseInt(item.year) || new Date().getFullYear(),
      }));
      setUniversityOverviewAcceptenceRate(convertedRates);
    } else {
      setUniversityOverviewAcceptenceRate([
        {
          rate: "",
          type: "In State",
          level: "Undergraduate",
          year: new Date().getFullYear(),
        },
      ]);
    }
    
    // Set form as submitted and read-only since data exists
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  }
}, [overviewResponse]);

  const handleAddAcceptanceRate = () => {
    if (isReadOnly) return;
    setUniversityOverviewAcceptenceRate([
      ...university_overview_acceptence_rate,
      {
        rate: "",
        type: "In State",
        level: "Undergraduate",
        year: new Date().getFullYear(),
      },
    ]);
  };

  const handleRemoveAcceptanceRate = (index: number) => {
    if (isReadOnly) return;
    setUniversityOverviewAcceptenceRate(
      university_overview_acceptence_rate.filter((_, i) => i !== index)
    );
  };

  const handleAddAnnualCost = () => {
    if (isReadOnly) return;
    setAnnualCosts([
      ...annual_costs,
      {
        cost: "",
        description: "",
      },
    ]);
  };

  const handleRemoveAnnualCost = (index: number) => {
    if (isReadOnly) return;
    setAnnualCosts(
      annual_costs.filter((_, i) => i !== index)
    );
  };

  const handleAreaTypeChange = (type: keyof typeof area_type, checked: boolean) => {
    if (isReadOnly) return;
    setAreaType(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const createPayload = (isDraft: boolean) => {
    // Convert form acceptance rates to API format
    const convertedAcceptanceRates = university_overview_acceptence_rate
      .filter((item) => item.rate)
      .map((item) => ({
        acceptance_rate: item.rate, // Map form 'rate' to API 'acceptance_rate'
        year: item.year.toString(),
        type: getTypeNumber(item.type),
        level: getLevelNumber(item.level),
      }));

    // Convert form annual_costs to API university_avg_anual_cost format
    const convertedAnnualCosts = annual_costs
      .filter((item) => item.cost || item.description)
      .map((item) => ({
        avg_anual_cost: item.cost, // Map form 'cost' to API 'avg_anual_cost'
        description: item.description,
      }));

    return {
      student_to_faculty_ratio,
      research_expenditure,
      description,
      country,
      street: street_name, // Map form 'street_name' to API 'street'
      state: state_name, // Map form 'state_name' to API 'state'
      area_type: convertAreaTypeToString(area_type), // Convert form object to API string
      university_type,
      isDraft,
      university_overview_acceptence_rate: convertedAcceptanceRates,
      university_avg_anual_cost: convertedAnnualCosts,
    };
  };

  const handleSaveDraft = () => {
    const payload = createPayload(true);
    addUniversityOverview(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleSubmit = () => {
    const payload = createPayload(false);
    addUniversityOverview(payload);
    setIsFormSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditInfo = () => {
    setIsReadOnly(false);
  };

  if (isLoadingOverview) {
    return <div>Loading...</div>;
  }

  if (overviewError) {
    return <div>Error: {overviewError.message}</div>;
  }

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <form className="space-y-6">
        {/* Description */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            University Description
          </label>
          <Textarea
            placeholder="Brief description about the university..."
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
          <p className="text-gray-500 text-sm mt-2">
            Brief description about the university
          </p>
        </div>

        {/* Student to Faculty Ratio */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Student to Faculty Ratio
          </label>
          <Input
            placeholder="e.g., 15:1"
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={student_to_faculty_ratio}
            onChange={(e) => setStudentToFacultyRatio(e.target.value)}
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
          <p className="text-gray-500 text-sm mt-1">
            Specify how many students are assigned per faculty member
          </p>
        </div>

        {/* Average Annual Cost / Cost of Attendance */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Average Annual Cost / Cost of Attendance
          </label>
          {annual_costs.map((item, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">
                  Annual Cost #{index + 1}
                </h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAnnualCost(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="w-full">
                  <label className="text-gray text-base font-medium leading-normal">
                    Average Annual Cost
                  </label>
                  <Input
                    placeholder="e.g., $50,000"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.cost}
                    onChange={(e) => {
                      const newCosts = [...annual_costs];
                      newCosts[index].cost = e.target.value;
                      setAnnualCosts(newCosts);
                    }}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="w-full">
                  <label className="text-gray text-base font-medium leading-normal">
                    Description
                  </label>
                  <Input
                    placeholder="e.g., Tuition and fees for in-state students"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.description}
                    onChange={(e) => {
                      const newCosts = [...annual_costs];
                      newCosts[index].description = e.target.value;
                      setAnnualCosts(newCosts);
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
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
              onClick={handleAddAnnualCost}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Annual Cost
            </Button>
          )}
        </div>

        {/* Address Information */}
        <div className="space-y-6 px-4">
          {/* Street Name */}
          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">
              Street Name
            </label>
            <Input
              placeholder="e.g., 123 University Avenue"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={street_name}
              onChange={(e) => setStreetName(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
            <p className="text-gray-500 text-sm mt-1">
              Street address of the university
            </p>
          </div>

          {/* State Name */}
          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">
              State Name
            </label>
            <Input
              placeholder="e.g., California"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
              value={state_name}
              onChange={(e) => setStateName(e.target.value)}
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
            <p className="text-gray-500 text-sm mt-1">
              State or province where the university is located
            </p>
          </div>

          {/* Country */}
          <div>
            <label className="text-[#111418] text-base font-medium leading-normal pb-2">
              Country
            </label>
            <Select
              onValueChange={(value) => setCountry(value)}
              value={country}
              disabled={isReadOnly}
            >
              <SelectTrigger className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-gray-500 text-sm mt-1">
              Country where the university is located
            </p>
          </div>
        </div>

        {/* Area Type */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Area Type
          </label>
          <div className="flex flex-col space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urban"
                checked={area_type.urban}
                onCheckedChange={(checked) => handleAreaTypeChange('urban', checked as boolean)}
                disabled={isReadOnly}
              />
              <label htmlFor="urban" className="text-[#111418] text-base font-normal leading-normal">
                Urban
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="suburban"
                checked={area_type.suburban}
                onCheckedChange={(checked) => handleAreaTypeChange('suburban', checked as boolean)}
                disabled={isReadOnly}
              />
              <label htmlFor="suburban" className="text-[#111418] text-base font-normal leading-normal">
                Suburban
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rural"
                checked={area_type.rural}
                onCheckedChange={(checked) => handleAreaTypeChange('rural', checked as boolean)}
                disabled={isReadOnly}
              />
              <label htmlFor="rural" className="text-[#111418] text-base font-normal leading-normal">
                Rural
              </label>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Select the area type(s) that describe the university location
          </p>
        </div>

        {/* University Type */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            University Type
          </label>
          <Select
            onValueChange={(value) => setUniversityType(value)}
            value={university_type}
            disabled={isReadOnly}
          >
            <SelectTrigger className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal">
              <SelectValue placeholder="Select university type" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Public",
                "Private",
                "Community College",
                "Technical Institute",
                "Research University",
                "Liberal Arts College",
                "Online University"
              ].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-gray-500 text-sm mt-1">
            Select the type of university
          </p>
        </div>

        {/* Research Expenditure */}
        <div className="px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Research Expenditure
          </label>
          <Input
            placeholder="e.g., $500 million"
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
            value={research_expenditure}
            onChange={(e) => setResearchExpenditure(e.target.value)}
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
          <p className="text-gray-500 text-sm mt-1">
            Annual research spending
          </p>
        </div>

        {/* Acceptance Rates */}
        <div className="space-y-4 px-4">
          <label className="text-[#111418] text-base font-medium leading-normal pb-2">
            Acceptance Rates
          </label>
          {university_overview_acceptence_rate.map((item, index) => (
            <div key={index} className="p-4 pb-4 space-y-4 bg-gray-200 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-600">
                  Acceptance Rate #{index + 1}
                </h4>
                {index > 0 && !isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAcceptanceRate(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="w-full">
                  <label className="text-gray text-base font-medium leading-normal">
                    Rate (%)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 20"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.rate}
                    onChange={(e) => {
                      const newRates = [...university_overview_acceptence_rate];
                      newRates[index].rate = e.target.value;
                      setUniversityOverviewAcceptenceRate(newRates);
                    }}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="w-full">
                  <label className="text-gray text-base font-medium leading-normal">
                    Year
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 2022"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal"
                    value={item.year}
                    onChange={(e) => {
                      const newRates = [...university_overview_acceptence_rate];
                      newRates[index].year = Number(e.target.value);
                      setUniversityOverviewAcceptenceRate(newRates);
                    }}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-full">
                  <div className="w-full">
                    <label className="text-gray text-base font-medium leading-normal">
                      Type
                    </label>
                    <Select
                      onValueChange={(value) => {
                        const newRates = [...university_overview_acceptence_rate];
                        newRates[index].type = value;
                        setUniversityOverviewAcceptenceRate(newRates);
                      }}
                      value={item.type}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "In State",
                          "Out State",
                          "International",
                          "Transfer Student",
                          "Early Decision",
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <label className="text-gray text-base font-medium leading-normal">
                      Level
                    </label>
                    <Select
                      onValueChange={(value) => {
                        const newRates = [...university_overview_acceptence_rate];
                        newRates[index].level = value;
                        setUniversityOverviewAcceptenceRate(newRates);
                      }}
                      value={item.level}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Graduate", "Undergraduate"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!isReadOnly && (
            <Button
              type="button"
              variant="outline"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f5] text-[#111418] text-sm leading-normal tracking-[0.015em] hover:bg-gray-300 w-full md:w-max"
              onClick={handleAddAcceptanceRate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Acceptance Rate
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
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#198754] text-white text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#198754]/90"
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
