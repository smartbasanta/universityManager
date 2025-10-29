"use client";

import { Button } from "@/components/ui/button";

interface MentorTabsProps {
  activeTab: "awaiting-approval" | "live";
  setActiveTab: (tab: "awaiting-approval" | "live") => void;
}

export const MentorTabs = ({ activeTab, setActiveTab }: MentorTabsProps) => {
  return (
    <div className="flex justify-center gap-3 p-4">
      <Button
        variant={activeTab === "awaiting-approval" ? "default" : "secondary"}
        className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition"
        onClick={() => setActiveTab("awaiting-approval")}
      >
        Awaiting Approval
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
