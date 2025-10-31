"use client";

import Image from 'next/image';
import { MapPin, Globe, Phone, Mail, Star, ExternalLink } from "lucide-react";
import type { UniversityBasicInfo, Ranking } from "@/hooks/api/website/university.api";

interface UniversityHeaderProps {
  basicInfo: UniversityBasicInfo;
  rankings?: Ranking[]; // Optional rankings prop
}

const UniversityHeaderActions = ({ website, email, phone }: { website?: string; email?: string; phone?: string }) => (
  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
    {website && (
      <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
        <ExternalLink className="w-4 h-4 mr-2" />
        <span>Website</span>
      </a>
    )}
    {email && (
      <a href={`mailto:${email}`} className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
        <Mail className="w-4 h-4 mr-2" />
        <span>Email</span>
      </a>
    )}
    {phone && (
      <div className="flex items-center text-gray-700">
        <Phone className="w-4 h-4 mr-2" />
        <span>{phone}</span>
      </div>
    )}
  </div>
);

export const UniversityHeader = ({ basicInfo, rankings }: UniversityHeaderProps) => {
  if (!basicInfo) {
    return null;
  }

  const {
    university_name: name,
    overview,
    about,
    website,
    logo,
    banner,
  } = basicInfo;

  const location = `${overview?.city || ''}${overview?.city && overview?.state ? ', ' : ''}${overview?.state || ''}`.trim();
  const displayLocation = location || overview?.country || 'Location not available';
  const description = about || overview?.description || 'No description available.';

  const bannerImage = banner || '/classroom.jpg'; 
  const logoImage = logo || '/no-image.jpg';

  // Find national and global ranks if available
  const nationalRank = rankings?.find(r => r.subject === 'National');
  const globalRank = rankings?.find(r => r.subject === 'Global');

  return (
    <div id="overview" className="relative bg-gray-50 pb-16 lg:pb-24">
      {/* Banner Image */}
      <div className="relative h-48 lg:h-64 w-full overflow-hidden">
        <Image
          src={bannerImage}
          alt={`${name} Banner`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onError={(e) => {
            e.currentTarget.srcset = '/classroom.jpg';
            e.currentTarget.src = '/classroom.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 -mt-20 lg:-mt-28">
        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
          {/* Logo and Name Section */}
          <div className="flex-shrink-0 flex items-end gap-6">
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full shadow-lg border-4 border-white bg-white overflow-hidden">
              <Image
                src={logoImage}
                alt={`${name} Logo`}
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-contain p-2"
                onError={(e) => {
                  e.currentTarget.srcset = '/no-image.jpg';
                  e.currentTarget.src = '/no-image.jpg';
                }}
              />
            </div>
            <div className="flex flex-col mb-2">
              <h1 className="text-3xl lg:text-5xl font-extrabold text-white drop-shadow-md leading-tight">
                {name}
              </h1>
              {displayLocation && (
                <div className="flex items-center text-gray-200 drop-shadow-sm mt-1">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">{displayLocation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rankings */}
          <div className="flex-1 flex justify-start lg:justify-end w-full lg:w-auto mt-4 lg:mt-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-6 shadow-lg border border-gray-100">
              {nationalRank ? (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{nationalRank.rank}</div>
                  <div className="text-sm text-gray-600">National Rank</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400">N/A</div>
                  <div className="text-sm text-gray-500">National Rank</div>
                </div>
              )}
              <div className="border-l border-gray-200 h-12"></div>
              {globalRank ? (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{globalRank.rank}</div>
                  <div className="text-sm text-gray-600">Global Rank</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400">N/A</div>
                  <div className="text-sm text-gray-500">Global Rank</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description and Actions */}
        <div className="mt-8 lg:mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-700 leading-relaxed max-w-4xl text-base">
            {description}
          </p>
          <UniversityHeaderActions website={website} email={overview?.email} phone={overview?.phone_number} />
        </div>
      </div>
    </div>
  );
};
