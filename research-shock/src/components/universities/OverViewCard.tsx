
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { University } from "@/types/university";
import { Briefcase, DollarSign, Factory, MapPin, Users } from "lucide-react";

interface OverviewCardProps {
  overview: University['overview'];
}

export const OverviewCard = ({ overview }: OverviewCardProps) => {
  if (!overview) return null;

  const overviewItems = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      label: "Student-Faculty Ratio",
      value: overview.student_faculty_ratio,
    },
    {
      icon: <Briefcase className="w-6 h-6 text-green-500" />,
      label: "Research Expenditure",
      value: overview.research_expenditure || 'N/A',
    },
    {
      icon: <DollarSign className="w-6 h-6 text-yellow-500" />,
      label: "Endowment",
      value: overview.endowment,
    },
    {
      icon: <Factory className="w-6 h-6 text-purple-500" />,
      label: "University Type",
      value: overview.university_type,
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-500" />,
      label: "Campus Setting",
      value: overview.campus_setting,
    },
    {
      icon: <MapPin className="w-6 h-6 text-indigo-500" />,
      label: "Location",
      value: `${overview.city}, ${overview.state}, ${overview.country}`,
    },
  ];

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">University Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviewItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-600">{item.label}</p>
                <p className="text-lg font-bold text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
