import StudentLifeForm from "@/components/form/university-profile/student-life-form";
import DashboardContainer from "@/components/ui/dashboard-container";
import React from "react";

export default function CollegeLifePage() {
  return (
    <DashboardContainer>
      <h2 className="mb-4">Student Life</h2>
      <StudentLifeForm />
    </DashboardContainer>
  );
}
