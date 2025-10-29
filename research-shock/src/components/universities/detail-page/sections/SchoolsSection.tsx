import { Section } from './common/Section';
import { School } from 'lucide-react';
import { Department } from '@/hooks/api/website/university.api';

export function SchoolsSection({ departments, level }: { departments?: Department[]; level: 'UNDERGRADUATE' | 'GRADUATE' }) {
  if (!departments || departments.length === 0) return null;
  
  const title = level === 'UNDERGRADUATE' ? 'Schools & Programs' : 'Graduate Schools & Programs';
  const themeColor = level === 'UNDERGRADUATE' ? 'text-green-600' : 'text-purple-600';

  return (
    <Section id={`${level.toLowerCase()}-programs`} icon={School} title={title} subtitle="Explore the diverse academic programs offered." themeColor={themeColor}>
      <div className="space-y-6">
        {departments.map((dept, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-bold text-lg">{dept.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {dept.programs.filter(p => p.level.toUpperCase() === level).map((prog, j) => (
                <span key={j} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">{prog.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}