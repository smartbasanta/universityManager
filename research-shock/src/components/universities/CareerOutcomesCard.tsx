
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { University } from "@/types/university";
import { Briefcase, DollarSign, Link, Calendar, Building } from "lucide-react";

interface CareerOutcomesCardProps {
  careerOutcomes: University['career_outcomes'];
}

export const CareerOutcomesCard = ({ careerOutcomes }: CareerOutcomesCardProps) => {
  if (!careerOutcomes) return <Card className="shadow-lg rounded-lg"><CardHeader><CardTitle className="text-2xl font-bold">Career Outcomes</CardTitle></CardHeader><CardContent><p>No career outcomes data available.</p></CardContent></Card>;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Career Outcomes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-gray-600">Employment Rate (6 Months)</p>
                <p className="text-lg font-bold text-gray-800">{careerOutcomes.employment_rate_6_months ? `${careerOutcomes.employment_rate_6_months}%` : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-semibold text-gray-600">Median Starting Salary</p>
                <p className="text-lg font-bold text-gray-800">{careerOutcomes.median_starting_salary ? `$${careerOutcomes.median_starting_salary}` : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-semibold text-gray-600">Report Year</p>
                <p className="text-lg font-bold text-gray-800">{careerOutcomes.report_year || 'N/A'}</p>
              </div>
            </div>
            {careerOutcomes.report_source_url && (
              <div className="flex items-center space-x-3">
                <Link className="w-5 h-5 text-indigo-500" />
                <a href={careerOutcomes.report_source_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Source</a>
              </div>
            )}
          </div>
          {careerOutcomes.top_employers && careerOutcomes.top_employers.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-gray-800">Top Employers</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {careerOutcomes.top_employers.map((employer) => (
                  <div key={employer.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="w-5 h-5 text-gray-500" />
                    <p className="text-sm font-semibold text-gray-700">{employer.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
