import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Globe, ExternalLink } from 'lucide-react';

interface UniversityListItem {
  id: string;
  name: string;
  location: string;
  country: string;
  type: string;
  setting: string;
  researchAreas: string[];
  image: string;
  description: string;
  establishedYear: number;
  studentCount: number;
  ranking: number;
  website: string;
  address: string;
  phone: string;
  email: string;
}

interface UniversityCardProps {
  university: UniversityListItem;
}

export const UniversityCard = ({ university }: UniversityCardProps) => {
  const defaultImage = "/no-image.jpg"; 

  return (
    <Link href={`/universities/${university.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative w-full h-48">
          <Image
            src={university.image || defaultImage}
            alt={university.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true} 
            onError={(e) => {
              e.currentTarget.srcset = defaultImage;
              e.currentTarget.src = defaultImage;
            }}
          />
          {university.type && university.type !== 'unknown' && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
              {university.type.charAt(0).toUpperCase() + university.type.slice(1)}
            </span>
          )}
          {university.setting && university.setting !== 'unknown' && (
            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
              {university.setting.charAt(0).toUpperCase() + university.setting.slice(1)}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {university.name}
          </h3>

          <div className="space-y-1 text-gray-600 mb-4 flex-grow">
            <p className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
              {university.location}
            </p>
            {university.country && university.country !== 'Unknown Country' && (
              <p className="flex items-center text-sm">
                <Globe className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                {university.country.charAt(0).toUpperCase() + university.country.slice(1)}
              </p>
            )}
          </div>

          {university.description && university.description !== 'No description available' && (
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4">
              {university.description}
            </p>
          )}

          {university.website && (
            <div className="mt-auto">
              <span className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors text-sm">
                Visit Website
                <ExternalLink className="w-4 h-4 ml-2" />
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
