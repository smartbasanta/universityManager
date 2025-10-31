import type { Ranking } from '@/hooks/api/website/university.api';
import { Award, Link as LinkIcon } from 'lucide-react';

interface RankingSectionProps {
  rankings: Ranking[];
}

export const RankingSection = ({ rankings }: RankingSectionProps) => {
  if (!rankings || rankings.length === 0) return null;

  return (
    <div id="rankings" className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">University Rankings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankings.map((rank, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-start transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
              <Award className="h-7 w-7 text-blue-600 mr-3 flex-shrink-0" />
              <h3 className="font-bold text-xl text-gray-800 leading-tight">{rank.rank}</h3>
            </div>
            <p className="text-gray-700 mt-1 text-base flex-grow">{rank.subject} ({rank.year})</p>
            {rank.source_link && (
              <a 
                href={rank.source_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                {rank.source}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};