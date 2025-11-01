"use client";

import { Home, Utensils, Dumbbell, Users } from 'lucide-react';

interface CampusLifeInfo {
  housing: { title: string; description: string; options: string[] };
  dining: { title: string; description: string; options: string[] };
  recreation: { title: string; description: string; facilities: string[] };
  organizations: { title: string; description: string; count: number; examples: string[] };
}

export const CampusLifeSection = ({ campusLifeInfo }: { campusLifeInfo: CampusLifeInfo }) => {
  const sections = [
    { icon: Home, ...campusLifeInfo.housing },
    { icon: Utensils, ...campusLifeInfo.dining },
    { icon: Dumbbell, ...campusLifeInfo.recreation },
    { icon: Users, ...campusLifeInfo.organizations },
  ];

  return (
    <section id="campus-life" className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Campus Life</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <sec.icon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">{sec.title}</h3>
            </div>
            <p className="text-gray-700 mb-4">{sec.description}</p>
            {('options' in sec && sec.options.length > 0) || ('facilities' in sec && sec.facilities.length > 0) || ('examples' in sec && sec.examples.length > 0) ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {('options' in sec ? sec.options : 'facilities' in sec ? sec.facilities : sec.examples).map((item: string, j: number) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : null}
            {'count' in sec && <p className="mt-4 text-blue-600 font-medium">Over {sec.count} organizations available</p>}
          </div>
        ))}
      </div>
    </section>
  );
};