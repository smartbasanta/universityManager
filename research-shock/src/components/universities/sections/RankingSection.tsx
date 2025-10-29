import type { Ranking } from '@/hooks/api/website/university.api';

interface RankingSectionProps {
  rankings: Ranking[];
  level: 'UNDERGRADUATE' | 'GRADUATE';
}

export const RankingSection = ({ rankings, level }: RankingSectionProps) => {
  const filteredRankings = rankings.filter(rank => rank.status === level);
  
  if (filteredRankings.length === 0) return null;

  const isUndergrad = level === 'UNDERGRADUATE';
  const title = isUndergrad ? 'Undergraduate Rankings' : 'Graduate Rankings';
  const theme = {
    bg: isUndergrad ? 'bg-green-50' : 'bg-blue-50',
    border: isUndergrad ? 'border-green-600' : 'border-blue-600',
    text: isUndergrad ? 'text-green-900' : 'text-blue-900',
    link: isUndergrad ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-blue-800',
  };

  return (
    <div id={`${level.toLowerCase()}-rankings`} className="py-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="space-y-4">
          {filteredRankings.map((rank) => (
            <div key={rank.id} className={`${theme.bg} rounded-lg p-4 border-l-4 ${theme.border}`}>
              <h3 className={`text-lg font-bold ${theme.text} mb-2`}>{rank.rank}</h3>
              <p className="text-gray-700 mb-3">{rank.description}</p>
              <a 
                href={rank.source_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme.link} text-sm font-medium hover:underline`}
              >
                View Source →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};