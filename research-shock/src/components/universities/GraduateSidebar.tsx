"use client";

import { useState, useEffect } from 'react';

interface SidebarItem {
  id: string;
  label: string;
}

interface GraduateSidebarProps {
  className?: string;
}

const graduateSidebarItems: SidebarItem[] = [
  { id: 'graduate-rankings', label: 'Graduate Rankings' },
  { id: 'graduate-schools', label: 'Graduate Schools' },
  { id: 'graduate-programs', label: 'Graduate Programs' },
  { id: 'graduate-admissions', label: 'Admission Requirements' },
  { id: 'graduate-tuition', label: 'Tuition & Fees' },
  { id: 'graduate-research', label: 'Graduate Research' },
];

export const GraduateSidebar = ({ className = '' }: GraduateSidebarProps) => {
  const [activeSection, setActiveSection] = useState('graduate-rankings');

  useEffect(() => {
    const handleScroll = () => {
      const sections = graduateSidebarItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(graduateSidebarItems[i].id);
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
        <h3 className="font-semibold text-gray-900 mb-4">Graduate Navigation</h3>
        <nav className="space-y-1">
          {graduateSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === item.id
                  ? 'bg-purple-100 text-purple-700 font-medium'
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
