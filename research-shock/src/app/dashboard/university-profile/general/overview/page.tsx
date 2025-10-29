"use client";

import OverviewForm from "@/components/form/university-profile/overview-form";
import DashboardContainer from "@/components/ui/dashboard-container";
import React from "react";

export default function OverviewPage() {
  return (
    <DashboardContainer>
      <h2 className="mb-8">University Overview</h2>
      <OverviewForm />
    </DashboardContainer>
  );
}
