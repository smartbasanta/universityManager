import type { Tuition } from '@/hooks/api/website/university.api';
import { DollarSign, Percent, Users } from 'lucide-react';

interface TuitionSectionProps {
  tuitionData?: Tuition;
  level: 'UNDERGRADUATE' | 'GRADUATE';
}

export const TuitionSection = ({ tuitionData, level }: TuitionSectionProps) => {
  if (!tuitionData) return null;

  const isUndergrad = level === 'UNDERGRADUATE';
  const title = isUndergrad ? 'Undergraduate Tuition & Fees' : 'Graduate Tuition & Fees';

  const formatCurrency = (value: string | number | null | undefined, currency: string | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    const numberValue = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value;
    if (isNaN(numberValue)) return 'N/A';
    return `${currency || 'USD'} ${numberValue.toLocaleString()}`;
  };

  return (
    <div id={`${level.toLowerCase()}-tuition`} className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Annual Costs */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-5">Annual Costs</h3>
          <div className="space-y-4">
            {tuitionData.tuition_type?.map((type, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <span className="font-medium text-gray-700 text-lg">{type.tuition_type}</span>
                <span className="font-bold text-xl text-blue-600">{formatCurrency(type.annual_cost, type.currency)}</span>
              </div>
            ))}
            {tuitionData.housing_cost !== undefined && (
              <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <span className="font-medium text-gray-700 text-lg">Housing</span>
                <span className="font-bold text-xl text-gray-800">{formatCurrency(tuitionData.housing_cost, tuitionData.housing_cost_currency)}</span>
              </div>
            )}
            {tuitionData.meal_plan_cost !== undefined && (
              <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <span className="font-medium text-gray-700 text-lg">Meal Plan</span>
                <span className="font-bold text-xl text-gray-800">{formatCurrency(tuitionData.meal_plan_cost, tuitionData.meal_plan_cost_currency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Aid */}
        <div className="lg:col-span-2 bg-blue-50 rounded-xl shadow-md border border-blue-200 p-6 flex flex-col justify-between">
          <h3 className="text-2xl font-semibold text-blue-800 mb-5">Financial Aid</h3>
          <div className="space-y-4">
            {tuitionData.avg_financial_aid !== undefined && (
              <div className="bg-white p-5 rounded-lg shadow-sm flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                  <DollarSign className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-800 leading-tight">{formatCurrency(tuitionData.avg_financial_aid, tuitionData.avg_financial_aid_currency)}</p>
                  <p className="text-sm font-medium text-gray-600">Average Financial Aid</p>
                </div>
              </div>
            )}
            {tuitionData.student_receiving_aid !== undefined && (
              <div className="bg-white p-5 rounded-lg shadow-sm flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                  <Percent className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-800 leading-tight">{tuitionData.student_receiving_aid}%</p>
                  <p className="text-sm font-medium text-gray-600">Students Receiving Aid</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};