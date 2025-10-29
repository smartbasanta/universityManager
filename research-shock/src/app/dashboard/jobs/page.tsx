"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { JobsTabs } from "./components/jobs-tabs";
import { JobsSection } from "./components/jobs-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetJobsByStatus } from "@/hooks/api/jobs/jobs.query";
import ProtectComponent from "@/middleware/protectComponent";
import { permissionType, roleType } from "@/types";

export default function JobsDashboard() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as "draft" | "archive" | "live" | null;

  const [activeTab, setActiveTab] = useState<"draft" | "archive" | "live">(
    tabParam || "draft"
  );

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ["draft", "archive", "live"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Fetch data based on active tab
  const { data: draftData, isLoading: isDraftLoading, error: draftError } = useGetJobsByStatus("Draft");
  const { data: liveData, isLoading: isLiveLoading, error: liveError } = useGetJobsByStatus("Live");
  const { data: archivedData, isLoading: isArchivedLoading, error: archivedError } = useGetJobsByStatus("Archive");

  // Transform API data to match component structure
  const transformApiData = (apiData: any[], showMoveToLive = false, showMoveToArchive = false) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((item: any) => ({
      id: item.id,
      title: item.title,
      meta: `Created At ${new Date(item.createdAt).toLocaleDateString()}`,
      showMoveToLive,
      showMoveToArchive,
    }));
  };

  // Prepare data for each tab
  const draftItems = transformApiData(draftData);
  const archiveItems = transformApiData(archivedData, true, false);
  const liveItems = transformApiData(liveData, false, true);

  // Loading and error handling
  const getCurrentTabData = () => {
    switch (activeTab) {
      case "draft":
        return { data: draftItems, isLoading: isDraftLoading, error: draftError };
      case "archive":
        return { data: archiveItems, isLoading: isArchivedLoading, error: archivedError };
      case "live":
        return { data: liveItems, isLoading: isLiveLoading, error: liveError };
      default:
        return { data: [], isLoading: false, error: null };
    }
  };

  const { data: currentData, isLoading: currentLoading, error: currentError } = getCurrentTabData();

  return (
    <div className="flex flex-col min-h-[90vh] pb-16 relative">
      <JobsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Loading State */}
      {currentLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading {activeTab} jobs...</div>
        </div>
      )}

      {/* Error State */}
      {currentError && (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error loading {activeTab} jobs: {currentError.message}</div>
        </div>
      )}

      {/* Content */}
      {!currentLoading && !currentError && (
        <>
          {activeTab === "draft" && (
            <JobsSection title="Draft" status="draft" items={currentData} />
          )}
          {activeTab === "archive" && (
            <JobsSection title="Archive" status="archived" items={currentData} />
          )}
          {activeTab === "live" && (
            <JobsSection title="Live" status="live" items={currentData} />
          )}
        </>
      )}

      {/* Empty State */}
      {!currentLoading && !currentError && currentData.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">No {activeTab} jobs found</div>
        </div>
      )}

      <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.ADD_JOB]}>
        <Link href={"/dashboard/jobs/new"}>
          <Button className="absolute bottom-0 right-0">
            Create a new Job
          </Button>
        </Link>
      </ProtectComponent>
    </div>
  );
}
