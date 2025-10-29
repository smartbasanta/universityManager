import { MapPin, Globe, Phone, Mail } from "lucide-react";
import type { 
  University, 
  UniversityLegacy, 
  Ranking 
} from "@/types/universities/university";
import { UniversityBasicInfo } from "@/hooks/api/website/university.api";

interface UniversityHeaderProps {
  basicInfo: UniversityBasicInfo;
  // apiData?: University;
}

export const UniversityHeader = ({ basicInfo }: UniversityHeaderProps) => {
  // If no data, render nothing. This prevents errors.
  if (!basicInfo) {
    return null;
  }
  
  // The header now receives the lean 'basicInfo' object.
  const name = basicInfo.university_name;
  const location = `${basicInfo.overview?.city || ''}, ${basicInfo.overview?.state || ''}`.trim() || basicInfo.overview?.country;
  const description = basicInfo.about || basicInfo.overview?.description || 'No description available.';
  const website = basicInfo.website;
  const image = basicInfo.logo || basicInfo.banner || '/no-image.jpg';

  // --- FIX 2: Ranking logic is now gone. It belongs in the specific tabs. ---
  // The header should not be responsible for this.

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
          
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {name}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{location}</span>
              </div>
              <p className="text-gray-700 leading-relaxed max-w-3xl">
                {description ?? basicInfo.overview?.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <a 
                    href={website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {website.replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}
              {/* These fields are not in basicInfo, so we display a default message */}
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>Contact info not available</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span>Contact info not available</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {/* --- FIX 3: Simplified placeholder for rankings --- */}
            <div className="bg-blue-50 rounded-lg p-3 text-center min-w-[140px]">
              <div className="text-xs text-gray-600 mb-2">Rankings</div>
              <div>
                <div className="text-lg font-bold text-gray-400 mb-1">...</div>
                <div className="text-xs text-gray-500">View in tabs below</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
