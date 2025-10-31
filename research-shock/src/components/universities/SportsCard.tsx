
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { University } from "@/types/university";
import { Trophy } from "lucide-react";

interface SportsCardProps {
  sports: University['sports'];
}

export const SportsCard = ({ sports }: SportsCardProps) => {
  if (!sports) return null;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Athletic Division</p>
                        <p className="text-lg font-bold text-gray-800">{sports.athletic_division || 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-600">Conference</p>
                <p className="text-lg text-gray-800">{sports.conference || 'N/A'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-600">Mascot</p>
                <p className="text-lg text-gray-800">{sports.mascot || 'N/A'}</p>
            </div>
            {sports.athletic_website && 
                <div className="p-4 bg-gray-50 rounded-lg">
                    <a href={sports.athletic_website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Athletic Website</a>
                </div>
            }
        </div>
      </CardContent>
    </Card>
  );
};
