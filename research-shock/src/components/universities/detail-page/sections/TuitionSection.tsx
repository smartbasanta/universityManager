import { Section } from './common/Section';
import { CircleDollarSign } from 'lucide-react';
import { Tuition } from '@/hooks/api/website/university.api';

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export function TuitionSection({ tuitions, level }: { tuitions?: Tuition[]; level: 'UNDERGRADUATE' | 'GRADUATE' }) {
  const inState = tuitions?.find(t => t.level.toUpperCase() === level && t.residency === 'in-state');
  const outOfState = tuitions?.find(t => t.level.toUpperCase() === level && t.residency === 'out-of-state');
  
  if (!inState && !outOfState) return null;

  const title = level === 'UNDERGRADUATE' ? 'Undergraduate Tuition' : 'Graduate Tuition';
  const themeColor = level === 'UNDERGRADUATE' ? 'text-green-600' : 'text-purple-600';

  return (
    <Section id={`${level.toLowerCase()}-tuition`} icon={CircleDollarSign} title={title} subtitle="Estimated annual costs for students." themeColor={themeColor}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inState && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800">In-State</h3>
            <p className="text-2xl font-bold text-green-900 mt-2">{formatCurrency(inState.tuition_and_fees)}</p>
            <p className="text-xs text-gray-600">Tuition & Fees / year</p>
          </div>
        )}
        {outOfState && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800">Out-of-State</h3>
            <p className="text-2xl font-bold text-orange-900 mt-2">{formatCurrency(outOfState.tuition_and_fees)}</p>
            <p className="text-xs text-gray-600">Tuition & Fees / year</p>
          </div>
        )}
      </div>
    </Section>
  );
}