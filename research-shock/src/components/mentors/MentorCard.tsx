import { Mentor } from '@/types/mentors/mentor';
import Link from 'next/link';

interface MentorCardProps {
  mentor: Mentor;
  isClickable?: boolean;
}

export const MentorCard = ({ mentor, isClickable = false }: MentorCardProps) => {
  const CardContent = () => (
    <div className="flex flex-col gap-5 text-center pb-5 transform transition duration-300 ease-in-out hover:scale-110 cursor-pointer">
      <div className="px-8">
        <div
          className="w-48 h-48 bg-center bg-no-repeat bg-cover rounded-full mx-auto"
          style={{ backgroundImage: `url("${mentor.image || '/mentor-default.png'}")` }}
        />
      </div>
      <div>
        <p className="text-[#101418] text-xl font-semibold leading-snug">{mentor.name}</p>
        <p className="text-[#5c738a] text-lg font-normal leading-snug">
          {mentor.company || mentor.universityName || mentor.university?.university_name || 'Unknown Company'}, {mentor.position || mentor.departmentName || mentor.department?.dept_name || 'Unknown Position'}
        </p>
        <p className="text-[#5c738a] text-lg font-normal leading-snug">
          Alumni of {mentor.university?.university_name || mentor.universityName || mentor.school || 'Unknown University'}
        </p>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link href={`/mentors/${mentor.id}`}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};
