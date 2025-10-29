"use client";

import { useState, useEffect } from 'react';

interface SidebarItem {
  id: string;
  label: string;
}

interface UndergraduateSidebarProps {
  className?: string;
}

const undergraduateSidebarItems: SidebarItem[] = [
  { id: 'undergraduate-rankings', label: 'Undergraduate Rankings' },
  { id: 'undergraduate-schools', label: 'Undergraduate Schools' },
  { id: 'undergraduate-programs', label: 'Undergraduate Programs' },
  { id: 'undergraduate-admissions', label: 'Admission Requirements' },
  { id: 'undergraduate-tuition', label: 'Tuition & Fees' },
];

export const UndergraduateSidebar = ({ className = '' }: UndergraduateSidebarProps) => {
  const [activeSection, setActiveSection] = useState('undergraduate-rankings');

  useEffect(() => {
    const handleScroll = () => {
      const sections = undergraduateSidebarItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(undergraduateSidebarItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`sticky top-24 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Undergraduate Navigation</h3>
        <nav className="space-y-1">
          {undergraduateSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === item.id
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
