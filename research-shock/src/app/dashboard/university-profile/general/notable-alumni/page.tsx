import NotableAlumniForm from "@/components/form/university-profile/notable-alumni-form";
import DashboardContainer from "@/components/ui/dashboard-container";
import React from "react";

export default function NotableAlumniPage() {
  return (
    <DashboardContainer>
      <h2 className="mb-4">Notable Alumni</h2>
      <NotableAlumniForm />
    </DashboardContainer>
  );
}
