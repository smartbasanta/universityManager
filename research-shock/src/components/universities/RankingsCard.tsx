
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { University } from "@/types/university";
import { Award } from "lucide-react";

interface RankingsCardProps {
  rankings: University['rankings'];
}

export const RankingsCard = ({ rankings }: RankingsCardProps) => {
  if (!rankings || rankings.length === 0) return null;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankings.map((ranking) => (
            <div key={ranking.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">{ranking.source}</p>
                  <p className="text-lg font-bold text-gray-800">{ranking.subject}: {ranking.rank}</p>
                  <p className="text-sm text-gray-500">{ranking.year}</p>
                  {ranking.source_link && <a href={ranking.source_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Source</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
