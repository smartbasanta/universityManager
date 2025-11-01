import type { UniversityAdmission } from '@/hooks/api/website/university.api';

interface AdmissionSectionProps {
  admissionData?: UniversityAdmission;
  level: 'UNDERGRADUATE' | 'GRADUATE';
}

export const AdmissionSection = ({ admissionData, level }: AdmissionSectionProps) => {
  if (!admissionData) return null;

  const isUndergrad = level === 'UNDERGRADUATE';
  const title = isUndergrad ? 'Undergraduate Admission' : 'Graduate Admission';
  const theme = {
    bg: isUndergrad ? 'bg-green-50' : 'bg-purple-50',
  };
  
  return (
    <div id={`${level.toLowerCase()}-admissions`} className="py-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${theme.bg} rounded-lg p-6`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
            <div className="space-y-3">
              {admissionData.university_admission_requirement?.map((req, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{req.name}</h4>
                  {req.percentile_25 && req.percentile_75 && <p className="text-sm text-gray-600">Score Range: {req.percentile_25} - {req.percentile_75}</p>}
                  {req.description && <p className="text-sm text-gray-600 mt-1">{req.description}</p>}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${req.is_required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {req.is_required ? 'Required' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Information</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Application Website</h4>
                <a href={admissionData.application_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Apply Now →
                </a>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Admission Website</h4>
                <a href={admissionData.admission_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};