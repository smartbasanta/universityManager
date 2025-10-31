"use client";

import Image from "next/image";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Star,
  ExternalLink,
} from "lucide-react";
import type {
  UniversityBasicInfo,
  Ranking,
} from "@/hooks/api/website/university.api";
import { motion } from "framer-motion"; // Added for subtle animations

interface UniversityHeaderProps {
  basicInfo: UniversityBasicInfo;
  rankings?: Ranking[];
}

const UniversityHeaderActions = ({
  website,
  email,
  phone,
}: {
  website?: string;
  email?: string;
  phone?: string;
}) => (
  <div className="flex flex-wrap items-center gap-4 mt-6">
    {website && (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Visit Website
      </a>
    )}
    {email && (
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Mail className="w-4 h-4 mr-2" />
        Email Us
      </a>
    )}
    {phone && (
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-medium shadow-md">
        <Phone className="w-4 h-4 mr-2" />
        {phone}
      </div>
    )}
  </div>
);

export const UniversityHeader = ({
  basicInfo,
  rankings,
}: UniversityHeaderProps) => {
  if (!basicInfo) return null;

  const { university_name: name, overview, about, website, logo, banner } =
    basicInfo;

  const location = `${overview?.city || ""}${
    overview?.city && overview?.state ? ", " : ""
  }${overview?.state || ""}${
    (overview?.city || overview?.state) && overview?.country ? ", " : ""
  }${overview?.country || ""}`.trim();
  const displayLocation = location || "Location not available";
  const description =
    about || overview?.description || "No description available.";

  const bannerImage = banner || "/classroom.jpg";
  const logoImage = logo || "/no-image.jpg";

  const nationalRank = rankings?.find((r) => r.subject === "National");
  const globalRank = rankings?.find((r) => r.subject === "Global");

  return (
    <section
      id="overview"
      className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* Banner with parallax effect */}
      <div className="relative h-80 md:h-96 lg:h-[500px] w-full">
        <Image
          src={bannerImage}
          alt={`${name} Banner`}
          fill
          className="object-cover brightness-75"
          sizes="100vw"
          priority
          onError={(e) => {
            e.currentTarget.srcset = "/classroom.jpg";
            e.currentTarget.src = "/classroom.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Header Content */}
      <div className="container mx-auto px-4 relative z-10 -mt-48 md:-mt-64 lg:-mt-80">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          {/* Logo & Info */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl border-4 border-white overflow-hidden bg-white">
              <Image
                src={logoImage}
                alt={`${name} Logo`}
                fill
                className="object-contain p-4"
                onError={(e) => {
                  e.currentTarget.srcset = "/no-image.jpg";
                  e.currentTarget.src = "/no-image.jpg";
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl tracking-tight">
                {name}
              </h1>
              <p className="flex items-center text-gray-100 mt-2 text-lg font-medium">
                <MapPin className="w-5 h-5 mr-2 text-white" />
                {displayLocation}
              </p>
            </div>
          </div>

          {/* Rankings Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-2xl w-full lg:w-auto"
          >
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "National Rank", value: nationalRank?.rank },
                { label: "Global Rank", value: globalRank?.rank },
              ].map(({ label, value }, i) => (
                <div key={i} className="text-center">
                  <div
                    className={`text-4xl md:text-5xl font-extrabold ${
                      value ? "text-white" : "text-gray-300"
                    } drop-shadow-md`}
                  >
                    {value || "N/A"}
                  </div>
                  <div className="text-base text-gray-100 font-medium mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 max-w-4xl mx-auto"
        >
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            {description}
          </p>
          <UniversityHeaderActions
            website={website}
            email={overview?.email}
            phone={overview?.phone_number}
          />
        </motion.div>
      </div>
    </section>
  );
};