import { Section } from './common/Section';
import { Users } from 'lucide-react';
import { StudentLife } from '@/hooks/api/website/university.api';

export function CampusLifeSection({ studentLife }: { studentLife?: StudentLife | null }) {
  if (!studentLife) return null;

  return (
    <Section
      id="campus-life"
      icon={Users}
      title="Campus Life"
      subtitle="Experience a vibrant and engaging student community."
    >
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-700">{studentLife.description}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Organizations</h4>
            <ul className="list-disc list-inside text-gray-600">
              {studentLife.organizations.slice(0, 5).map(org => <li key={org.name}>{org.name}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Traditions</h4>
            <ul className="list-disc list-inside text-gray-600">
              {studentLife.traditions.slice(0, 5).map(t => <li key={t.name}>{t.name}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}