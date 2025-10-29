import { Trophy, Target, Users2 } from "lucide-react";

/* 1.  add `website?: string`  */
interface SportsInfo {
  overview: string;
  teams: {
    name: string;
    league: string;
    achievements?: string;
  }[];
  facilities: {
    name: string;
    description: string;
    website?: string;      // ← new
  }[];
  intramurals: string[];
}

interface SportsSectionProps {
  sportsInfo: SportsInfo;
}

export const SportsSection = ({ sportsInfo }: SportsSectionProps) => {
  return (
    <section id="sports" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Athletics & Sports
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sportsInfo.overview}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Varsity Teams */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 border border-red-100">
            <div className="flex items-center mb-6">
              <Trophy className="w-8 h-8 text-red-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-900">Varsity Teams</h3>
            </div>
            <div className="space-y-4">
              {sportsInfo.teams.map((team, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{team.name}</h4>
                  <p className="text-sm text-gray-600">{team.league}</p>
                  {team.achievements && (
                    <p className="text-xs text-red-600 mt-1">{team.achievements}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-blue-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-900">Sports Facilities</h3>
            </div>
            <div className="space-y-4">
              {sportsInfo.facilities.map((facility, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {facility.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {facility.description}
                      </p>
                    </div>

                    {/* 2. Click-through link */}
                    {facility.website && (
                      <a
                        href={facility.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline whitespace-nowrap"
                      >
                        Visit&nbsp;→
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intramural Sports */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <Users2 className="w-8 h-8 text-green-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-900">Intramural Sports</h3>
            </div>
            <div className="space-y-3">
              {sportsInfo.intramurals.map((sport, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-white rounded-lg p-3"
                >
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3" />
                  <span className="text-gray-700">{sport}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
