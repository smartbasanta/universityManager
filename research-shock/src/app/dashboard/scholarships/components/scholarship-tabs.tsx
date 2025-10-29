// components/scholarship-tabs.tsx
"use client";

import { Button } from "@/components/ui/button";

interface ScholarshipTabsProps {
  activeTab: "draft" | "archive" | "live";
  setActiveTab: (tab: "draft" | "archive" | "live") => void;
}

export const ScholarshipTabs = ({
  activeTab,
  setActiveTab,
}: ScholarshipTabsProps) => {
  return (
    <div className="flex justify-center gap-3 p-4">
      <Button
        variant={activeTab === "draft" ? "default" : "secondary"}
        className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition"
        onClick={() => setActiveTab("draft")}
      >
        Draft
      </Button>
      <Button
        variant={activeTab === "archive" ? "default" : "secondary"}
        className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition"
        onClick={() => setActiveTab("archive")}
      >
        Archive
      </Button>
      <Button
        variant={activeTab === "live" ? "default" : "secondary"}
        className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition"
        onClick={() => setActiveTab("live")}
      >
        Live
      </Button>
    </div>
  );
};
