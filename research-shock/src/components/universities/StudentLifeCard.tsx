
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { University } from "@/types/university";
import { Users } from "lucide-react";

interface StudentLifeCardProps {
  studentLife: University['student_life'];
}

export const StudentLifeCard = ({ studentLife }: StudentLifeCardProps) => {
  if (!studentLife) return null;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Student Life</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                        <p className="text-sm font-semibold text-gray-600">Number of Organizations</p>
                        <p className="text-lg font-bold text-gray-800">{studentLife.number_of_organizations || 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-600">Description</p>
                <p className="text-lg text-gray-800">{studentLife.description || 'N/A'}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
