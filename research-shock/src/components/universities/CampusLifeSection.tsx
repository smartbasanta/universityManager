import { Home, Utensils, Dumbbell, Users, HeartHandshake } from "lucide-react";
import type { StudentLife } from '@/hooks/api/website/university.api';

interface CampusLifeSectionProps {
  studentLife?: StudentLife;
}

export const CampusLifeSection = ({ studentLife }: CampusLifeSectionProps) => {
  if (!studentLife) return null;

  return (
    <section id="student-life-details" className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Life</h2>
      <p className="text-lg text-gray-700 mb-8 max-w-3xl">{studentLife.description || 'Experience vibrant campus life with diverse opportunities for growth and connection.'}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Student Organizations */}
        {studentLife.organizations && studentLife.organizations.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="w-7 h-7 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Student Organizations</h3>
            </div>
            <ul className="space-y-2">
              {studentLife.organizations.map((org, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  {org.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* University Traditions */}
        {studentLife.traditions && studentLife.traditions.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <HeartHandshake className="w-7 h-7 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">University Traditions</h3>
            </div>
            <ul className="space-y-2">
              {studentLife.traditions.map((trad, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  {trad.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Placeholder for other campus life aspects if needed, e.g., Housing, Dining, Recreation */}
        {/* These would come from other parts of GeneralSectionData or separate API calls if available */}
      </div>
    </section>
  );
};
