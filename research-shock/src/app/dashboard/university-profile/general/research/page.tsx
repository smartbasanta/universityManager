import ResearchOpportunitiesForm from "@/components/form/university-profile/research-opportunities-form";
import DashboardContainer from "@/components/ui/dashboard-container";
import React from "react";

export default function ResearchPage() {
  return (
    <DashboardContainer>
      <h2 className="mb-4">Research Hub</h2>
      <ResearchOpportunitiesForm />
    </DashboardContainer>
  );
}
