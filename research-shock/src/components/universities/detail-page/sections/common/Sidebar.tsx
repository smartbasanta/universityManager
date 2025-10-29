"use client";
import { useState, useEffect } from 'react';

interface SidebarItem { id: string; label: string; }

interface SidebarProps {
  items: SidebarItem[];
  title: string;
  theme?: 'green' | 'purple' | 'blue'; // Theme for active item
  className?: string;
}

export const Sidebar = ({ items, title, theme = 'blue', className = '' }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState(items[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Add offset for better accuracy
      let currentSection = items[0]?.id || '';
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = item.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Header offset
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const themeClasses = {
    green: 'bg-green-100 text-green-700 font-medium',
    purple: 'bg-purple-100 text-purple-700 font-medium',
    blue: 'bg-blue-100 text-blue-700 font-medium',
  };

  return (
    <div className={`sticky top-24 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === item.id
                  ? themeClasses[theme]
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