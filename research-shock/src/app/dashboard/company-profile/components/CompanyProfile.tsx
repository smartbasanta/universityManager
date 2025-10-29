"use client";

import React, { useState, useEffect } from "react";
import {
  useGetCompanyProfile,
  useUpdateCompanyProfile,
} from "@/hooks/api/company/company.query";
import { CompanyProfile as CompanyProfileType } from "@/hooks/api/company/company.api";
import { Edit } from "lucide-react";

const INDUSTRY_OPTIONS = [
  "Technology",
  "Education",
  "Finance",
  "Healthcare",
  "Other",
];

const SIZE_OPTIONS = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1000",
  "1001–5000",
  "5001–10,000",
  "10,000+",
];

const COMPANY_TYPE_OPTIONS = [
  "Private",
  "Public",
  "Nonprofit",
  "Government",
  "Educational",
];

export default function CompanyProfile() {
  // form state
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [website, setWebsite] = useState("");
  const [verifyPage, setVerifyPage] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [commitments, setCommitments] = useState<string[]>([]);
  const [careerGrowth, setCareerGrowth] = useState("");
  const [program, setProgram] = useState("");
  const [division, setDivision] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Read-only mode and edit functionality state
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);

  // API hooks - no ID needed since it's from token
  const { data: profileData, isLoading, error } = useGetCompanyProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateCompanyProfile();

  // seed form on first load
  useEffect(() => {
    if (profileData && !isDataLoaded) {
      console.log("Loading company profile:", profileData);
      
      setName(profileData.name || "");
      setCountry(profileData.country || "");
      setOverview(profileData.overview || "");
      setWebsite(profileData.website || "");
      setVerifyPage(profileData.verifyPage || "");
      setIndustry(profileData.industry || "");
      setCompanySize(profileData.companySize || "");
      setHeadquarters(profileData.headquarters || "");
      setCompanyType(profileData.companyType || "");
      setSpecialities(profileData.specialities || []);
      setCommitments(profileData.commitments || []);
      setCareerGrowth(profileData.careerGrowth || "");
      setProgram(profileData.program || "");
      setDivision(profileData.division || "");
      
      // Set form as submitted and read-only since data exists
      setIsProfileSubmitted(true);
      setIsReadOnly(true);
      setIsDataLoaded(true);
    }
  }, [profileData, isDataLoaded]);

  // helper for comma-tag inputs
  function handleTagInput(
    raw: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    if (isReadOnly) return; // Prevent changes in readonly mode
    setter(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
    );
  }

  // ambassador-style save
  const handleSaveProfile = () => {
    const payload: CompanyProfileType = {
      country,
      name,
      overview,
      website,
      verifyPage,
      industry,
      companySize,
      headquarters,
      companyType,
      specialities,
      commitments,
      careerGrowth,
      program,
      division,
    };
    updateProfile(payload);
    
    // Set form as submitted and read-only after saving
    setIsProfileSubmitted(true);
    setIsReadOnly(true);
  };

  const handleEditProfile = () => {
    setIsReadOnly(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen flex-col bg-slate-50 font-sans overflow-x-hidden">
        <div className="flex flex-col grow h-full">
          <div className="flex flex-1 justify-center items-center">
            <div className="text-gray-500">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col bg-slate-50 font-sans overflow-x-hidden">
        <div className="flex flex-col grow h-full">
          <div className="flex flex-1 justify-center items-center">
            <div className="text-red-500">
              Error loading profile. Please try again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // main form
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 font-sans overflow-x-hidden">
      <div className="flex flex-col grow h-full">
        <div className="flex flex-1 justify-center px-6 py-10">
          <div className="flex flex-col w-full max-w-3xl gap-10">
            {/* Company Profile Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Company Profile
                </h2>
                {isProfileSubmitted && isReadOnly && (
                  <button 
                    onClick={handleEditProfile}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Overview
                  </label>
                  <textarea
                    className={`w-full border border-gray-300 p-3 rounded h-32 ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="Write about your company…"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Verify Page
                    </label>
                    <input
                      type="url"
                      className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                      value={verifyPage}
                      onChange={(e) => setVerifyPage(e.target.value)}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="">Select…</option>
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Company Size
                  </label>
                  <select
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="">Select…</option>
                    {SIZE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Company Type
                  </label>
                  <select
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="">Select…</option>
                    {COMPANY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Specialities
                  </label>
                  <input
                    type="text"
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    placeholder="e.g. AI, Robotics"
                    value={specialities.join(", ")}
                    onChange={(e) =>
                      handleTagInput(e.target.value, setSpecialities)
                    }
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Commitments
                  </label>
                  <input
                    type="text"
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    placeholder="e.g. Sustainability, DEI"
                    value={commitments.join(", ")}
                    onChange={(e) =>
                      handleTagInput(e.target.value, setCommitments)
                    }
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Career Growth & Learning
                  </label>
                  <textarea
                    className={`w-full border border-gray-300 p-3 rounded h-24 ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={careerGrowth}
                    onChange={(e) => setCareerGrowth(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Programs
                  </label>
                  <textarea
                    className={`w-full border border-gray-300 p-3 rounded h-24 ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Division or Locations
                  </label>
                  <input
                    type="text"
                    className={`w-full border border-gray-300 p-2 rounded ${isReadOnly ? 'bg-gray-100' : ''}`}
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    placeholder="e.g. Engineering, APAC, EMEA"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Save Button */}
              {!isReadOnly && (
                <div className="text-right">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isUpdating}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
