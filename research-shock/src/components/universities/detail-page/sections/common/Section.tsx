import { ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';
import { LucideIcon } from 'lucide-react';

interface SectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
  themeColor?: string; // e.g., 'text-orange-600'
}

export function Section({ id, icon, title, subtitle, children, themeColor = 'text-gray-600' }: SectionProps) {
  return (
    <section id={id} className="py-8 scroll-mt-20">
      <SectionHeader icon={icon} title={title} subtitle={subtitle} themeColor={themeColor} />
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {children}
      </div>
    </section>
  );
}