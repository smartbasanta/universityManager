'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Award, Users, ArrowRight, Sparkles, Play } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-purple-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Content */}
      <div className="relative px-4 sm:px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-md rounded-full border border-primary-foreground/20"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-semibold text-primary-foreground">Empower. Explore. Excel.</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
              >
                Your Gateway to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-300">
                  Academic Excellence
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg sm:text-xl text-primary-foreground max-w-2xl"
              >
                Discover research opportunities, scholarships, top universities, and connect with mentors worldwide. 
                Start your journey to academic success today.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/universities"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground text-primary font-semibold rounded-xl hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Explore Universities</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/scholarships"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground/10 backdrop-blur-md text-primary-foreground font-semibold rounded-xl hover:bg-primary-foreground/20 transition-all duration-300 border border-primary-foreground/20"
                >
                  <span>Find Scholarships</span>
                  <Play className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Interactive Quiz CTA - New */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true }}
                className="pt-4"
              >
                <Link
                  href="/jobs" // TODO: Link to quiz modal/form
                  className="inline-flex items-center gap-2 text-sm text-primary-foreground hover:text-secondary underline"
                >
                  See the listing jobs and apply → 
                </Link>
              </motion.div>

              {/* Animated Stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20"
              >
                {[
                  { num: '500+', label: 'Universities', delay: 0.1 },
                  { num: '2K+', label: 'Scholarships', delay: 0.2 },
                  { num: '50K+', label: 'Students', delay: 0.3 }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: stat.delay }}
                    viewport={{ once: true }}
                    className="text-center lg:text-left"
                  >
                    <motion.div 
                      className="text-3xl sm:text-4xl font-bold text-white"
                      initial={{ textContent: '0' }}
                      whileInView={{ textContent: stat.num }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    >
                      {stat.num}
                    </motion.div>
                    <div className="text-sm text-primary-foreground/90">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Feature Cards (Matched to Image: 2x2 Staggered) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="hidden lg:grid grid-cols-2 gap-6"
            >
              {/* Card 1 */}
              <motion.div 
                initial={{ y: 0, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                viewport={{ once: true }}
                className="group p-6 bg-primary-foreground/10 backdrop-blur-md rounded-2xl border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/80 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Smart Search</h3>
                <p className="text-sm text-primary-foreground/90">Find the perfect university or program with recommendations</p>
              </motion.div>

              {/* Card 2 (Staggered down) */}
              <motion.div 
                initial={{ y: 32, opacity: 0 }} // mt-8 equivalent (2rem)
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true }}
                className="group p-6 bg-primary-foreground/10 backdrop-blur-md rounded-2xl border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400/80 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Scholarships</h3>
                <p className="text-sm text-primary-foreground/90">Access thousands of funding opportunities tailored to your profile</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ y: 0, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.35 }}
                viewport={{ once: true }}
                className="group p-6 bg-primary-foreground/10 backdrop-blur-md rounded-2xl border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/80 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Career Growth</h3>
                <p className="text-sm text-primary-foreground/90">Discover research positions and internships at leading institutions</p>
              </motion.div>

              {/* Card 4 (Staggered down) */}
              <motion.div 
                initial={{ y: 32, opacity: 0 }} // mt-8 equivalent
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
                viewport={{ once: true }}
                className="group p-6 bg-primary-foreground/10 backdrop-blur-md rounded-2xl border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400/80 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Expert Mentors</h3>
                <p className="text-sm text-primary-foreground/90">Connect with experienced mentors to guide your academic journey</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 sm:h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <motion.path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="background"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </svg>
      </div>
    </section>
  );
};