import AdmissionForm from "@/components/form/university-profile/admission-form";
import DashboardContainer from "@/components/ui/dashboard-container";

export default function UndergradAdmission() {
  return (
    <DashboardContainer>
      <h2>Undergrad Admission Requirements</h2>
      <AdmissionForm />
    </DashboardContainer>
  );
}
