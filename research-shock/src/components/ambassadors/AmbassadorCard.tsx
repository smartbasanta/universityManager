import { Ambassador } from '@/types/ambassadors/ambassador';
import Link from 'next/link';

interface AmbassadorCardProps {
  ambassador: Ambassador;
}

export const AmbassadorCard = ({ ambassador }: AmbassadorCardProps) => {
  return (
    <Link href={`/ambassadors/${ambassador.id}`}>
      <div className="flex flex-col gap-5 text-center pb-5 transform transition duration-300 ease-in-out hover:scale-110 cursor-pointer">
        <div className="px-8">
          <div
            className="w-48 h-48 bg-center bg-no-repeat bg-cover rounded-full mx-auto"
            style={{ backgroundImage: `url("${ambassador.image || '/ambassador-default.png'}")` }}
          />
        </div>
        <div>
          <p className="text-[#101418] text-xl font-semibold leading-snug">{ambassador.name}</p>
          <p className="text-[#5c738a] text-lg font-normal leading-snug">
            {ambassador.universityName || ambassador.university?.university_name || 'Unknown University'}, {ambassador.departmentName || ambassador.department?.dept_name || 'Unknown Department'}
          </p>
        </div>
      </div>
    </Link>
  );
};
