import { Section } from './common/Section';
import { Trophy } from 'lucide-react';
import { Sports } from '@/hooks/api/website/university.api';

export function SportsSection({ sports }: { sports?: Sports | null }) {
  if (!sports) return null;

  return (
    <Section id="sports" icon={Trophy} title="Athletics" subtitle={`A proud member of the ${sports.conference || 'N/A'}.`} themeColor="text-red-600">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Varsity Teams</h3>
          <div className="space-y-2">
            {sports.teams.map((team, i) => (
              <p key={i} className="text-sm text-gray-700 capitalize">{team.gender} {team.sport_name}</p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Facilities</h3>
          <div className="space-y-2">
            {sports.facilities.map((facility, i) => (
              <a key={i} href={facility.website || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-red-700 hover:underline block">{facility.name}</a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}