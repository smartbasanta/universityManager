'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  TrendingUp, School, FileText, DollarSign, 
  CheckCircle, XCircle, Loader2, Award, BookOpen 
} from 'lucide-react';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';

interface GraduateTabContentProps {
  universityId: string;
}

const SectionNav = ({ sections, onNavigate }: any) => (
  <div className="sticky top-24 bg-white rounded-xl shadow-md p-4 border border-gray-100">
    <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
      Quick Navigation
    </h3>
    <nav className="space-y-1">
      {sections.map((section: any) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {section.label}
          </button>
        );
      })}
    </nav>
  </div>
);

export function GraduateTabContent({ universityId }: GraduateTabContentProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universityGraduate', universityId],
    queryFn: () => websiteUniversityAPI.fetchGraduateSectionData(universityId),
    staleTime: 1000 * 60 * 5,
  });

  const sections = [
    { id: 'rankings', label: 'Rankings', icon: TrendingUp },
    { id: 'departments', label: 'Departments & Programs', icon: School },
    { id: 'admissions', label: 'Admissions', icon: FileText },
    { id: 'tuition', label: 'Tuition & Costs', icon: DollarSign },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p className="text-lg font-semibold">Failed to load graduate information</p>
        <p className="text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  const { rankings, departments, admissions, tuition_fees } = data || {};

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <SectionNav sections={sections} onNavigate={scrollToSection} />
      </div>

      <div className="flex-1 space-y-12">
        {/* Rankings Section */}
        {rankings && rankings.length > 0 && (
          <motion.section 
            id="rankings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-7 h-7 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Rankings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rankings.map((ranking) => (
                <div key={ranking.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{ranking.source}</p>
                      <p className="text-sm text-gray-500">{ranking.year}</p>
                    </div>
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-2">#{ranking.rank}</p>
                  <p className="text-gray-700">{ranking.subject}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Departments & Programs Section */}
        {departments && departments.length > 0 && (
          <motion.section 
            id="departments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <School className="w-7 h-7 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Graduate Departments & Programs</h2>
            </div>
            
            <div className="space-y-6">
              {departments.map((dept) => (
                <div key={dept.id} className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
                      {dept.description && (
                        <p className="text-gray-600 mt-2">{dept.description}</p>
                      )}
                    </div>
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  
                  {dept.programs && dept.programs.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Graduate Programs:</p>
                      <div className="flex flex-wrap gap-2">
                        {dept.programs.map((program) => (
                          <span 
                            key={program.id}
                            className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-indigo-200"
                          >
                            {program.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Admissions Section */}
        {admissions && admissions.length > 0 && (
          <motion.section 
            id="admissions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-7 h-7 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Graduate Admissions</h2>
            </div>
            
            {admissions.map((admission) => (
              <div key={admission.id} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Acceptance Rate</p>
                    <p className="text-4xl font-bold text-blue-600">{parseFloat(admission.acceptance_rate).toFixed(0)}%</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Application Deadline</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(admission.application_deadline).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  {admission.application_fee && (
                    <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Application Fee</p>
                      <p className="text-3xl font-bold text-blue-600">${admission.application_fee}</p>
                    </div>
                  )}
                </div>
                
                {admission.requirements && admission.requirements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Admission Requirements</h3>
                    <div className="space-y-3">
                      {admission.requirements.map((req) => (
                        <div key={req.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                          <div className="flex items-start gap-3">
                            {req.is_required ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{req.name}</h4>
                                {req.is_required && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    Required
                                  </span>
                                )}
                              </div>
                              {(req.percentile_25 || req.percentile_75) && (
                                <p className="text-sm text-gray-600 mt-2">
                                  Score Range: {req.percentile_25} - {req.percentile_75}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {admission.application_website && (
                  <a 
                    href={admission.application_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Apply Now →
                  </a>
                )}
              </div>
            ))}
          </motion.section>
        )}

        {/* Tuition & Costs Section */}
        {tuition_fees && tuition_fees.length > 0 && (
          <motion.section 
            id="tuition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-7 h-7 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-900">Tuition & Costs</h2>
            </div>
            
            <div className="space-y-6">
              {tuition_fees.map((tuition) => (
                <div key={tuition.id} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 capitalize">{tuition.residency} Students</h3>
                    <span className="px-3 py-1 bg-emerald-200 text-emerald-800 text-sm font-semibold rounded-full">
                      {tuition.academic_year}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tuition & Fees</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${parseFloat(tuition.tuition_and_fees).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Housing</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${parseFloat(tuition.housing_cost).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Meal Plan</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${parseFloat(tuition.meal_plan_cost).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Books & Supplies</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${parseFloat(tuition.books_and_supplies_cost).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-emerald-200">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-900">Estimated Total Cost</p>
                      <p className="text-3xl font-bold text-emerald-600">
                        ${(
                          parseFloat(tuition.tuition_and_fees) +
                          parseFloat(tuition.housing_cost) +
                          parseFloat(tuition.meal_plan_cost) +
                          parseFloat(tuition.books_and_supplies_cost)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}