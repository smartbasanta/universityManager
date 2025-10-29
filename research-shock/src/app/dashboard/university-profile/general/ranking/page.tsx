import RankingsForm from "@/components/form/university-profile/ranking-form";
import DashboardContainer from "@/components/ui/dashboard-container";

export default function RankingPage() {
  return (
    <DashboardContainer>
      <h2 className="mb-4">Ranking</h2>
      <RankingsForm />
    </DashboardContainer>
  );
}
