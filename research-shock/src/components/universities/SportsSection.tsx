import { Trophy, Users, Building, ExternalLink } from "lucide-react";
import type { Sports } from '@/hooks/api/website/university.api';

interface SportsSectionProps {
  sports?: Sports;
}

export const SportsSection = ({ sports }: SportsSectionProps) => {
  if (!sports) return null;

  return (
    <section id="sports-details" className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">University Sports</h2>
      <p className="text-lg text-gray-700 mb-8 max-w-3xl">{sports.athletic_division || 'Discover the athletic spirit and achievements of the university.'}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Athletic Overview */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center mb-4">
            <Trophy className="w-7 h-7 text-yellow-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Athletic Overview</h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            {sports.athletic_division && (
              <li className="flex justify-between items-center">
                <span className="font-medium">Athletic Division:</span>
                <span>{sports.athletic_division}</span>
              </li>
            )}
            {sports.conference && (
              <li className="flex justify-between items-center">
                <span className="font-medium">Conference:</span>
                <span>{sports.conference}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Sports Teams */}
        {sports.teams && sports.teams.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="w-7 h-7 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Teams</h3>
            </div>
            <ul className="space-y-2">
              {sports.teams.map((team, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  {team.sport_name} ({team.gender})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sports Facilities */}
        {sports.facilities && sports.facilities.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 md:col-span-2">
            <div className="flex items-center mb-4">
              <Building className="w-7 h-7 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Facilities</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sports.facilities.map((facility, index) => (
                <a 
                  key={index} 
                  href={facility.website || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                  <span className="font-medium text-gray-700">{facility.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
