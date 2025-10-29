import type { UniversityMajor, GraduateMajor } from '@/hooks/api/website/university.api';

interface SchoolsSectionProps {
  majors: (UniversityMajor | GraduateMajor)[];
  level: 'UNDERGRADUATE' | 'GRADUATE';
}

export const SchoolsSection = ({ majors, level }: SchoolsSectionProps) => {
  if (!majors || majors.length === 0) return null;
  
  const isUndergrad = level === 'UNDERGRADUATE';
  const title = isUndergrad ? 'Undergraduate Programs' : 'Graduate Programs';
  const theme = {
    bg: isUndergrad ? 'bg-green-50 hover:bg-green-100' : 'bg-blue-50 hover:bg-blue-100',
  };

  return (
    <div id={`${level.toLowerCase()}-programs`} className="py-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="space-y-3">
          {majors.slice(0, 10).map((major) => (
            <a key={major.id} href={major.link || '#'} target="_blank" rel="noopener noreferrer" className={`block p-4 ${theme.bg} rounded-lg transition-colors`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{major.name}</h3>
                  {major.rank && (
                    <p className="text-sm text-gray-600 mt-1">{major.rank}</p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};