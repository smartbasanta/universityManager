import SportsForm from "@/components/form/university-profile/sports-form";
import DashboardContainer from "@/components/ui/dashboard-container";
import React from "react";

export default function SportsPage() {
  return (
    <DashboardContainer>
      <h2 className="mb-4">Sports</h2>
      <SportsForm />
    </DashboardContainer>
  );
}
