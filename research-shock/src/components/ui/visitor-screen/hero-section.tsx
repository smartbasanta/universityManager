'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Award, Users, Globe } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 opacity-70"></div>
      
      {/* Content Container */}
      <div className="relative px-4 sm:px-6 lg:px-40 py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-start">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 backdrop-blur-sm border border-blue-100/50 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">Trusted by 50,000+ Students</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  Discover Your Path to
                  <span className="block mt-2">
                    <span className="relative inline-block">
                      <span className="relative z-10">Academic Success</span>
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-300/70" viewBox="0 0 200 12" preserveAspectRatio="none">
                        <path d="M0,7 Q50,-2 100,7 T200,7" fill="currentColor" opacity="0.6" />
                      </svg>
                    </span>
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Connect with leading universities, secure scholarships, and receive personalized guidance to shape your academic future. All in one seamless platform.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/universities"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span>Explore Universities</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/scholarships"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <span>Find Scholarships</span>
                </Link>
              </div>

              {/* Quick Links */}
              <div className="pt-6 border-t border-gray-200/50">
                <div className="flex flex-wrap gap-6">
                  <Link href="/jobs" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1">
                    <span>→</span> Browse Research Jobs
                  </Link>
                  <Link href="/mentors" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1">
                    <span>→</span> Connect with Mentors
                  </Link>
                </div>
              </div>

              {/* Redesigned Stats - As a horizontal progress-like bar for engagement */}
              <div className="pt-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Universities Partnered</span>
                    <span>500+</span>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-blue-600"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Scholarships Available</span>
                    <span>2K+</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-purple-600"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Students Empowered</span>
                    <span>50K+</span>
                  </div>
                  <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-green-600"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Elements (Tightened spacing, no empty boxes) */}
            <div className="relative hidden lg:block">
              {/* Feature Grid - Compact layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1 - Global Reach */}
                <div className="group relative bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/50 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-100/50 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base">Global Reach</h3>
                    <p className="text-xs text-gray-600">Universities from 50+ countries</p>
                  </div>
                </div>

                {/* Card 2 - Full Funding */}
                <div className="group relative bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-purple-100/50 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base">Full Funding</h3>
                    <p className="text-xs text-gray-600">Scholarships up to $100K</p>
                  </div>
                </div>

                {/* Card 3 - Career Ready */}
                <div className="group relative bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/50 hover:border-green-400 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-100/50 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base">Career Ready</h3>
                    <p className="text-xs text-gray-600">Research & job opportunities</p>
                  </div>
                </div>

                {/* Card 4 - Expert Guidance */}
                <div className="group relative bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/50 hover:border-pink-400 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-pink-100/50 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base">Expert Guidance</h3>
                    <p className="text-xs text-gray-600">1-on-1 mentor support</p>
                  </div>
                </div>
              </div>

              {/* Subtle Floating Orbs - Reduced size to avoid empty space */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100/30 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-purple-100/30 rounded-full blur-3xl animate-float-delayed"></div>
            </div>

            {/* Mobile Feature Grid - Simplified and aligned */}
            <div className="lg:hidden grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm text-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900">Global Reach</div>
                <div className="text-xs text-gray-600">50+ Countries</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm text-center">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900">Full Funding</div>
                <div className="text-xs text-gray-600">Up to $100K</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm text-center">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900">Career Ready</div>
                <div className="text-xs text-gray-600">Jobs & Research</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm text-center">
                <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900">Expert Guidance</div>
                <div className="text-xs text-gray-600">1-on-1 Mentors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
};