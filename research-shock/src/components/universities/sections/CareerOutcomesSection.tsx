import React from 'react';
import UniversitySkeleton from '@/components/universities/UniversitySkeleton';
import { Briefcase, DollarSign, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface CareerOutcomesSectionProps {
  careerOutcomes: any;
  isLoading: boolean;
  error: any;
}

export const CareerOutcomesSection = ({ careerOutcomes, isLoading, error }: CareerOutcomesSectionProps) => {
  if (isLoading) return <UniversitySkeleton />;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load career outcomes.</div>;
  if (!careerOutcomes) return <div className="text-center py-10 text-gray-500">No career outcomes data available.</div>;

  const stats = [
    { icon: Briefcase, label: 'Employment Rate', value: `${careerOutcomes.employment_rate}%` || 'N/A', color: 'blue-600' },
    { icon: DollarSign, label: 'Average Salary', value: careerOutcomes.average_salary || 'N/A', color: 'green-600' },
    { icon: TrendingUp, label: 'Salary Growth', value: careerOutcomes.salary_growth || 'N/A', color: 'purple-600' },
    { icon: Users, label: 'Top Employers', value: careerOutcomes.top_employers?.join(', ') || 'N/A', color: 'indigo-600' },
  ];

  return (
    <section id="career-outcomes" className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Career Outcomes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <stat.icon className={`w-10 h-10 text-${stat.color} mb-4`} />
            <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      {careerOutcomes.top_industries && careerOutcomes.top_industries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Top Industries</h3>
          <div className="flex flex-wrap gap-2">
            {careerOutcomes.top_industries.map((industry: string, index: number) => (
              <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
                {industry}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};