import { Section } from './common/Section';
import { BarChart3 } from 'lucide-react';
import { Ranking } from '@/hooks/api/website/university.api';

export function RankingSection({ rankings, level }: { rankings?: Ranking[]; level: 'UNDERGRADUATE' | 'GRADUATE' }) {
  // We can't filter by level yet as the entity doesn't support it, so we show all.
  if (!rankings || rankings.length === 0) return null;

  const title = level === 'UNDERGRADUATE' ? 'Undergraduate Rankings' : 'Graduate Rankings';
  const themeColor = level === 'UNDERGRADUATE' ? 'text-green-600' : 'text-purple-600';

  return (
    <Section id={`${level.toLowerCase()}-rankings`} icon={BarChart3} title={title} subtitle="See how this institution stacks up against the competition." themeColor={themeColor}>
      <div className="space-y-4">
        {rankings.map((rank, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
            <span className={`text-2xl font-bold ${themeColor}`}>{rank.rank}</span>
            <p className="font-semibold text-gray-800">{rank.subject}</p>
            <p className="text-sm text-gray-500">Source: {rank.source} ({rank.year})</p>
          </div>
        ))}
      </div>
    </Section>
  );
}