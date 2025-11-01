import type { Tuition } from '@/hooks/api/website/university.api';

interface TuitionSectionProps {
  tuitionData?: Tuition;
  level: 'UNDERGRADUATE' | 'GRADUATE';
}

export const TuitionSection = ({ tuitionData, level }: TuitionSectionProps) => {
  if (!tuitionData) return null;

  const isUndergrad = level === 'UNDERGRADUATE';
  const title = isUndergrad ? 'Undergraduate Tuition & Fees' : 'Graduate Tuition & Fees';
  const theme = {
    gradient: isUndergrad ? 'from-green-50 to-emerald-50' : 'from-purple-50 to-pink-50',
    text: isUndergrad ? 'text-green-600' : 'text-purple-600',
  };

  const formatCurrency = (value: string | null, currency: string | null) => {
    if (!value) return 'N/A';
    const numberValue = parseInt(value.replace(/,/g, ''), 10);
    return `${currency || 'USD'} ${numberValue.toLocaleString()}`;
  };

  return (
    <div id={`${level.toLowerCase()}-tuition`} className="py-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`bg-gradient-to-br ${theme.gradient} rounded-lg p-6`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Costs</h3>
            <div className="space-y-3">
              {tuitionData.tuition_type?.map((type, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-700">{type.tuition_type}</span>
                  <span className={`font-semibold ${theme.text}`}>{formatCurrency(type.annual_cost, type.currency)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-gray-700">Housing</span>
                <span className="font-semibold text-gray-900">{formatCurrency(tuitionData.housing_cost, tuitionData.housing_cost_currency)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-gray-700">Meal Plan</span>
                <span className="font-semibold text-gray-900">{formatCurrency(tuitionData.meal_plan_cost, tuitionData.meal_plan_cost_currency)}</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Aid</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(tuitionData.avg_financial_aid, tuitionData.avg_financial_aid_currency)}</p>
                <p className="text-sm text-gray-600">Average Financial Aid</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{tuitionData.student_receiving_aid || 'N/A'}%</p>
                <p className="text-sm text-gray-600">Students Receiving Aid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};