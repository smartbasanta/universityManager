import type { Department, Program } from '@/hooks/api/website/university.api';
import { BookOpen, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SchoolsSectionProps {
  departments: Department[];
  level: 'UNDERGRADUATE' | 'GRADUATE';
}

export const SchoolsSection = ({ departments, level }: SchoolsSectionProps) => {
  if (!departments || departments.length === 0) return null;

  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);

  const toggleDepartment = (name: string) => {
    setExpandedDepartments(prev =>
      prev.includes(name) ? prev.filter(d => d !== name) : [...prev, name]
    );
  };

  const title = level === 'UNDERGRADUATE' ? 'Undergraduate Programs & Departments' : 'Graduate Programs & Departments';
  const id = level.toLowerCase() + '-programs';

  return (
    <section id={id} className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      <div className="space-y-4">
        {departments.map((department) => (
          <div key={department.name} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleDepartment(department.name)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">{department.name}</h3>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expandedDepartments.includes(department.name) ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedDepartments.includes(department.name) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="divide-y divide-gray-100 px-6 pb-6 overflow-hidden"
                >
                  {department.programs.map((program: Program) => (
                    <li key={program.name} className="py-4 flex items-center justify-between">
                      <span className="text-lg text-gray-700 font-medium">{program.name}</span>
                      {program.website && (
                        <a
                          href={program.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          Learn More
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};