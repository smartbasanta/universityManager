import MajorForm from "@/components/form/university-profile/majors-form";
import DashboardContainer from "@/components/ui/dashboard-container";

export default function UndergradMajor() {
  return (
    <DashboardContainer>
      <h2>Available Major</h2>
      <MajorForm />
    </DashboardContainer>
  );
}
