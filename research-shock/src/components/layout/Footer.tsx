"use client";

import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Award,
  Briefcase
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-muted/10 to-background border-t border-border mt-auto w-full">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 lg:mb-12">
            {/* Company */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <div>
                  <h5 className="text-base font-semibold text-foreground">ResearchShock</h5>
                  <p className="text-sm text-muted-foreground">Slohan Here afafafaf</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Location, 10..</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+00 000 000 00  </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Mon-Fri 9AM-5PM EST</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                Quick Links
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h5 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Resources</h5>
              <ul className="space-y-3">
                <li>
                  <Link href="/scholarships" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group">
                    <Award className="w-4 h-4" />
                    Scholarships
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group">
                    <Briefcase className="w-4 h-4" />
                    Job Board
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group">
                    <span className="w-4 h-4">?</span>
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Stay Updated</h5>
                <p className="text-xs text-muted-foreground mb-3">Subscribe for weekly tips on scholarships & research.</p>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:text-primary/80 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Follow Us</h5>
                <div className="flex space-x-4">
                  <Link href="https://facebook.com" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="Facebook">
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link href="https://twitter.com" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="Twitter">
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link href="https://linkedin.com" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                  <Link href="https://instagram.com" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="Instagram">
                    <Instagram className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
              <div>
                <p className="text-sm text-muted-foreground">
                  © 2024 ResearchShock. All rights reserved. 
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-6">
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Cookies
                </Link>
                <Link href="/sitemap" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};