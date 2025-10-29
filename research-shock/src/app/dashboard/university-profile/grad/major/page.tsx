import MajorForm from "@/components/form/university-profile/graduate/majors-form";
import DashboardContainer from "@/components/ui/dashboard-container";

export default function GradMajor() {
  return (
    <DashboardContainer>
      <h2>Available Major</h2>
      <MajorForm />
    </DashboardContainer>
  );
}
