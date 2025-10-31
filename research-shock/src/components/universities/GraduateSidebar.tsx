import React from 'react';

export const GraduateSidebar = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Quick Links</h3>
      <nav className="space-y-2">
        <a href="#graduate-rankings" className="block text-gray-600 hover:text-blue-600">Rankings</a>
        <a href="#graduate-programs" className="block text-gray-600 hover:text-blue-600">Programs</a>
        <a href="#graduate-admissions" className="block text-gray-600 hover:text-blue-600">Admissions</a>
        <a href="#graduate-tuition" className="block text-gray-600 hover:text-blue-600">Tuition & Fees</a>
      </nav>
    </div>
  );
};
