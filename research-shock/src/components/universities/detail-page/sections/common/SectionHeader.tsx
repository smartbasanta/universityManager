import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  themeColor?: string;
}

export function SectionHeader({ icon: Icon, title, subtitle, themeColor = 'text-gray-600' }: SectionHeaderProps) {
  const colorClass = themeColor.replace('text-', 'bg-').replace('-600', '-100'); // e.g., 'bg-orange-100'

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${themeColor}`} />
        </div>
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}