'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  MapPin, Globe, Building2, Users, Trophy, 
  Lightbulb, Star, Calendar, Award, BookOpen 
} from 'lucide-react';
import { websiteUniversityAPI, UniversityBasicInfo } from '@/hooks/api/website/university.api';
import { Loader2 } from 'lucide-react';

interface GeneralTabContentProps {
  universityId: string;
  initialData: UniversityBasicInfo;
}

const SectionNav = ({ sections, activeSection, onNavigate }: any) => (
  <div className="sticky top-24 bg-white rounded-xl shadow-md p-4 border border-gray-100">
    <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
      Quick Navigation
    </h3>
    <nav className="space-y-1">
      {sections.map((section: any) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 flex items-center gap-2
              ${activeSection === section.id 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {section.label}
          </button>
        );
      })}
    </nav>
  </div>
);

export function GeneralTabContent({ universityId, initialData }: GeneralTabContentProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universityGeneralSections', universityId],
    queryFn: () => websiteUniversityAPI.fetchGeneralSectionData(universityId),
    staleTime: 1000 * 60 * 5,
  });

  const sections = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'student-life', label: 'Student Life', icon: Users },
    { id: 'sports', label: 'Athletics', icon: Trophy },
    { id: 'research', label: 'Research Centers', icon: Lightbulb },
    { id: 'alumni', label: 'Notable Alumni', icon: Award },
    { id: 'reviews', label: 'Student Reviews', icon: Star },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p className="text-lg font-semibold">Failed to load general information</p>
        <p className="text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  const { overview } = initialData;
  const { student_life, sports, notable_alumni, research_hubs, reviews } = data || {};

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <SectionNav 
          sections={sections} 
          activeSection="" 
          onNavigate={scrollToSection} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-12">
        {/* Overview Section */}
        <motion.section 
          id="overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-7 h-7 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">University Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</p>
                <p className="text-lg text-gray-900 flex items-center gap-2 mt-1">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {overview?.city}, {overview?.state}, {overview?.country}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Type</p>
                <p className="text-lg text-gray-900">{overview?.university_type}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Campus Setting</p>
                <p className="text-lg text-gray-900">{overview?.campus_setting}</p>
              </div>
              
              {overview?.student_faculty_ratio && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Student-Faculty Ratio</p>
                  <p className="text-lg text-gray-900">{overview.student_faculty_ratio}</p>
                </div>
              )}
            </div>
          </div>

          {initialData.about && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed">{initialData.about}</p>
            </div>
          )}
        </motion.section>

        {/* Student Life Section */}
        {student_life && (
          <motion.section 
            id="student-life"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-7 h-7 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Student Life</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6">{student_life.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {student_life.organizations && student_life.organizations.length > 0 && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Student Organizations
                  </h3>
                  <ul className="space-y-2">
                    {student_life.organizations.slice(0, 5).map((org, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {org.name}
                      </li>
                    ))}
                  </ul>
                  {student_life.organizations.length > 5 && (
                    <p className="text-sm text-gray-500 mt-3">
                      +{student_life.organizations.length - 5} more organizations
                    </p>
                  )}
                </div>
              )}
              
              {student_life.traditions && student_life.traditions.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Traditions & Events
                  </h3>
                  <ul className="space-y-2">
                    {student_life.traditions.map((tradition, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {tradition.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Sports Section */}
        {sports && (
          <motion.section 
            id="sports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-7 h-7 text-yellow-600" />
              <h2 className="text-3xl font-bold text-gray-900">Athletics & Sports</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {sports.athletic_division && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-600">Division</p>
                  <p className="text-lg font-bold text-gray-900">{sports.athletic_division}</p>
                </div>
              )}
              {sports.conference && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-600">Conference</p>
                  <p className="text-lg font-bold text-gray-900">{sports.conference}</p>
                </div>
              )}
            </div>
            
            {sports.teams && sports.teams.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Varsity Teams</h3>
                <div className="flex flex-wrap gap-2">
                  {sports.teams.map((team, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {team.gender}'s {team.sport_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {sports.facilities && sports.facilities.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Athletic Facilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sports.facilities.map((facility, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">{facility.name}</p>
                      {facility.website && (
                        <a 
                          href={facility.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <Globe className="w-4 h-4" />
                          Visit Website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Research Centers */}
        {research_hubs && research_hubs.length > 0 && (
          <motion.section 
            id="research"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-7 h-7 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Research Centers</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {research_hubs.map((hub) => (
                <div key={hub.id} className="bg-purple-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{hub.center_name}</h3>
                  <a 
                    href={hub.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Notable Alumni */}
        {notable_alumni && notable_alumni.length > 0 && (
          <motion.section 
            id="alumni"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-7 h-7 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900">Notable Alumni</h2>
            </div>
            
            <div className="space-y-4">
              {notable_alumni.map((alumni) => (
                <div key={alumni.id} className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{alumni.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Class of {alumni.graduation_year}</p>
                      <p className="text-gray-700 mt-3">{alumni.accomplishments}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <motion.section 
            id="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-7 h-7 text-yellow-600" />
              <h2 className="text-3xl font-bold text-gray-900">Student Reviews</h2>
            </div>
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <p className="text-sm text-gray-600">- {review.student.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}