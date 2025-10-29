import AdmissionForm from "@/components/form/university-profile/graduate/admission-form";
import DashboardContainer from "@/components/ui/dashboard-container";

export default function GradAdmission() {
  return (
    <DashboardContainer>
      <h2>Graduate Admission Requirements</h2>
      <AdmissionForm />
    </DashboardContainer>
  );
}
