"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { NewsTabs } from "./components/news-tabs";
import { NewsSection } from "./components/news-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetResearchNewsByStatus } from "@/hooks/api/research/research.query";
import ProtectComponent from "@/middleware/protectComponent";
import { permissionType, roleType } from "@/types";

export default function NewsDashboard() {
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
  const { data: draftData, isLoading: isDraftLoading, error: draftError } = useGetResearchNewsByStatus("draft");
  const { data: publishedData, isLoading: isPublishedLoading, error: publishedError } = useGetResearchNewsByStatus("published");
  const { data: archivedData, isLoading: isArchivedLoading, error: archivedError } = useGetResearchNewsByStatus("archived");

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
  const liveItems = transformApiData(publishedData, false, true);

  // Loading and error handling
  const getCurrentTabData = () => {
    switch (activeTab) {
      case "draft":
        return { data: draftItems, isLoading: isDraftLoading, error: draftError };
      case "archive":
        return { data: archiveItems, isLoading: isArchivedLoading, error: archivedError };
      case "live":
        return { data: liveItems, isLoading: isPublishedLoading, error: publishedError };
      default:
        return { data: [], isLoading: false, error: null };
    }
  };

  const { data: currentData, isLoading: currentLoading, error: currentError } = getCurrentTabData();

  return (
    <div className="flex flex-col min-h-[90vh] pb-16 relative">
      <NewsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Loading State */}
      {currentLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading {activeTab} news...</div>
        </div>
      )}

      {/* Error State */}
      {currentError && (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error loading {activeTab} news: {currentError.message}</div>
        </div>
      )}

      {/* Content */}
      {!currentLoading && !currentError && (
        <>
          {activeTab === "draft" && (
            <ProtectComponent requiredPermission={[permissionType.VIEW_RESEARCH_NEWS]} requiredRoles={[roleType.DEPARTMENT, roleType.UNIVERSITY, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION_STAFF]}>
              <NewsSection title="Draft" status="draft" items={currentData} />
            </ProtectComponent>
          )}
          {activeTab === "archive" && (
            <ProtectComponent requiredPermission={[permissionType.VIEW_RESEARCH_NEWS]} requiredRoles={[roleType.DEPARTMENT, roleType.UNIVERSITY, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION_STAFF]}>
              <NewsSection title="Archive" status="archived" items={currentData} />
            </ProtectComponent>
          )}
          {activeTab === "live" && (
            <ProtectComponent requiredPermission={[permissionType.VIEW_RESEARCH_NEWS]} requiredRoles={[roleType.DEPARTMENT, roleType.UNIVERSITY, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION_STAFF]}>
              <NewsSection title="Live" status="published" items={currentData} />
            </ProtectComponent>
          )}
        </>
      )}

      {/* Empty State */}
      {!currentLoading && !currentError && currentData.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">No {activeTab} news found</div>
        </div>
      )}

      <ProtectComponent requiredPermission={[permissionType.ADD_RESEARCH_NEWS]} requiredRoles={[roleType.DEPARTMENT, roleType.UNIVERSITY, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION_STAFF]}>
        <Link href={"/dashboard/research-news/new"}>
          <Button className="absolute bottom-0 right-0">Create a News</Button>
        </Link>
      </ProtectComponent>
    </div>
  );
}
