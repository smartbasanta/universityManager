import { Section } from './common/Section';
import { GraduationCap } from 'lucide-react';
import { NotableAlumni } from '@/hooks/api/website/university.api';

export function NotableAlumniSection({ alumni }: { alumni?: NotableAlumni[] }) {
  if (!alumni || alumni.length === 0) return null;

  return (
    <Section id="notable-alumni" icon={GraduationCap} title="Notable Alumni" subtitle="Discover the influential figures who once walked these halls." themeColor="text-yellow-600">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map((person, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-lg">{person.name}</h3>
            <p className="text-sm text-gray-600">Graduated {person.graduation_year}</p>
            <p className="text-sm mt-2">{person.accomplishments}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}