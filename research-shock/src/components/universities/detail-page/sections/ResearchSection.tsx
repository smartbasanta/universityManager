import { Section } from './common/Section';
import { FlaskConical } from 'lucide-react';
import { ResearchHub } from '@/hooks/api/website/university.api';

export function ResearchSection({ hubs }: { hubs?: ResearchHub[] }) {
  if (!hubs || hubs.length === 0) return null;

  return (
    <Section id="research-hubs" icon={FlaskConical} title="Research Hubs" subtitle="Explore the centers of innovation and discovery on campus." themeColor="text-indigo-600">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hubs.map((hub, i) => (
          <a key={i} href={hub.website_url || '#'} target="_blank" rel="noopener noreferrer" className="block p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
            <h3 className="font-semibold text-indigo-800">{hub.center_name}</h3>
            <span className="text-sm text-indigo-600 hover:underline">Visit Website &rarr;</span>
          </a>
        ))}
      </div>
    </Section>
  );
}