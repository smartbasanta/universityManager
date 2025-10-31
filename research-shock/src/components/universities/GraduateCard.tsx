
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { University } from "@/types/university";
import { Check, FileText, Percent, Calendar, DollarSign, ExternalLink, BookOpen, Home, Utensils, Wallet, Building } from "lucide-react";

interface GraduateCardProps {
  admissions: University['admissions'];
  tuition: University['tuition_fees'];
  departments: University['departments'];
}

export const GraduateCard = ({ admissions, tuition, departments }: GraduateCardProps) => {
  const graduateAdmissions = admissions?.filter(a => a.level === 'graduate');
  const graduateTuition = tuition?.filter(t => t.level === 'graduate');

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Graduate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Admissions Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Admissions</h3>
          {graduateAdmissions && graduateAdmissions.length > 0 ? (
            <div className="space-y-6">
              {graduateAdmissions.map((admission) => (
                <div key={admission.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Percent className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Acceptance Rate</p>
                        <p className="text-lg font-bold text-gray-800">{admission.acceptance_rate ? `${admission.acceptance_rate}%` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Application Deadline</p>
                        <p className="text-lg font-bold text-gray-800">{admission.application_deadline ? new Date(admission.application_deadline).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Application Fee</p>
                        <p className="text-lg font-bold text-gray-800">{admission.application_fee ? `$${admission.application_fee}` : 'N/A'}</p>
                      </div>
                    </div>
                    {admission.application_website && (
                      <div className="flex items-center space-x-3">
                        <ExternalLink className="w-5 h-5 text-indigo-500" />
                        <a href={admission.application_website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Apply Now</a>
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-700">Requirements</h4>
                    <ul className="mt-2 space-y-2">
                      {admission.requirements.map((req) => (
                        <li key={req.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {req.is_required ? <Check className="w-5 h-5 text-green-500" /> : <FileText className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{req.name}</p>
                            {req.percentile_25 && req.percentile_75 && (
                              <p className="text-sm text-gray-600">25th-75th percentile: {req.percentile_25} - {req.percentile_75}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : <p>No graduate admissions data available.</p>}
        </section>

        {/* Tuition Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Tuition & Fees</h3>
          {graduateTuition && graduateTuition.length > 0 ? (
            <div className="space-y-6">
              {graduateTuition.map((fee) => (
                <div key={fee.id} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-800">{fee.residency}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center space-x-3">
                      <Wallet className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Tuition & Fees</p>
                        <p className="text-lg font-bold text-gray-800">{fee.tuition_and_fees ? `$${fee.tuition_and_fees}` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Books & Supplies</p>
                        <p className="text-lg font-bold text-gray-800">{fee.books_and_supplies_cost ? `$${fee.books_and_supplies_cost}` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Home className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Housing</p>
                        <p className="text-lg font-bold text-gray-800">{fee.housing_cost ? `$${fee.housing_cost}`: 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Utensils className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Meal Plan</p>
                        <p className="text-lg font-bold text-gray-800">{fee.meal_plan_cost ? `$${fee.meal_plan_cost}` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p>No graduate tuition data available.</p>}
        </section>

        {/* Departments Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Departments</h3>
          {departments && departments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Building className="w-5 h-5 text-gray-500" />
                  <p className="text-sm font-semibold text-gray-700">{dept.name}</p>
                </div>
              ))}
            </div>
          ) : <p>No graduate departments data available.</p>}
        </section>
      </CardContent>
    </Card>
  );
};
