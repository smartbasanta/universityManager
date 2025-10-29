import { Mentor } from '@/types/mentors/mentor';
import { MentorCard } from './MentorCard';

interface MentorGridProps {
  mentors: Mentor[];
}

export const MentorGrid = ({ mentors }: MentorGridProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-8">
      {mentors.map((mentor, index) => (
        <MentorCard 
          key={mentor.id} 
          mentor={mentor} 
          isClickable={index === 6} 
        />
      ))}
    </div>
  );
};
