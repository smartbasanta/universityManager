import React from 'react';
import UniversitySkeleton from '@/components/universities/UniversitySkeleton';
import { Briefcase, DollarSign, TrendingUp } from 'lucide-react';

interface CareerOutcomesSectionProps {
  careerOutcomes: any; // Replace 'any' with actual type when available
  isLoading: boolean;
  error: any;
}

export const CareerOutcomesSection = ({ careerOutcomes, isLoading, error }: CareerOutcomesSectionProps) => {
  if (isLoading) return <UniversitySkeleton />;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load career outcomes.</div>;
  if (!careerOutcomes) return <div className="text-center py-10 text-gray-500">No career outcomes data available.</div>;

  return (
    <div id="career-outcomes" className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Career Outcomes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example: Employment Rate */}
        {careerOutcomes.employment_rate && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex items-start">
            <Briefcase className="w-7 h-7 text-blue-600 mr-4 flex-shrink-0" />
            <div>
              <p className="text-3xl font-bold text-gray-800">{careerOutcomes.employment_rate}%</p>
              <p className="text-gray-600 text-lg">Employment Rate</p>
            </div>
          </div>
        )}

        {/* Example: Average Salary */}
        {careerOutcomes.average_salary && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex items-start">
            <DollarSign className="w-7 h-7 text-green-600 mr-4 flex-shrink-0" />
            <div>
              <p className="text-3xl font-bold text-gray-800">{careerOutcomes.average_salary}</p>
              <p className="text-gray-600 text-lg">Average Starting Salary</p>
            </div>
          </div>
        )}

        {/* Example: Top Industries */}
        {careerOutcomes.top_industries && careerOutcomes.top_industries.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 lg:col-span-1 flex items-start">
            <TrendingUp className="w-7 h-7 text-purple-600 mr-4 flex-shrink-0" />
            <div>
              <p className="text-xl font-bold text-gray-800 mb-2">Top Industries</p>
              <ul className="space-y-1">
                {careerOutcomes.top_industries.map((industry: string, index: number) => (
                  <li key={index} className="text-gray-700">{industry}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
