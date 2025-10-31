import type { Department, Program } from '@/hooks/api/website/university.api';
import { BookOpen, ExternalLink } from 'lucide-react';

interface SchoolsSectionProps {
  departments: Department[];
  level: 'UNDERGRADUATE' | 'GRADUATE';
}

export const SchoolsSection = ({ departments, level }: SchoolsSectionProps) => {
  if (!departments || departments.length === 0) return null;
  
  const isUndergrad = level === 'UNDERGRADUATE';
  const title = isUndergrad ? 'Undergraduate Programs & Departments' : 'Graduate Programs & Departments';
  const id = isUndergrad ? 'undergraduate-programs' : 'graduate-programs';

  return (
    <div id={id} className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="space-y-8">
        {departments.map((department) => (
          <div key={department.name} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              {department.name}
            </h3>
            <ul className="divide-y divide-gray-100">
              {department.programs.map((program) => (
                <li key={program.name} className="py-4 flex items-center justify-between">
                  <p className="text-lg text-gray-700 font-medium">{program.name}</p>
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
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};