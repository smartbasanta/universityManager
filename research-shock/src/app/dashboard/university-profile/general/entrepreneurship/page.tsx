import EntrepreneurOpportunitiesForm from "@/components/form/university-profile/entrepreneur-form";
import DashboardContainer from "@/components/ui/dashboard-container";

import React from "react";

export default function EntreprenurshipPage() {
  return (
    <DashboardContainer>
      <h2 className="mb-4">Entreprenurship</h2>
      <EntrepreneurOpportunitiesForm />
    </DashboardContainer>
  );
}
