import { Ambassador } from '@/types/ambassadors/ambassador';
import { AmbassadorCard } from './AmbassadorCard';

interface AmbassadorGridProps {
  ambassadors: Ambassador[];
}

export const AmbassadorGrid = ({ ambassadors }: AmbassadorGridProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-8">
      {ambassadors.map((ambassador) => (
        <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
      ))}
    </div>
  );
};
