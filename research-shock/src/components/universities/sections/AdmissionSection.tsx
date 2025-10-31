import type { Admission, AdmissionRequirement } from '@/hooks/api/website/university.api';
import { CheckCircle, ExternalLink, FileText } from 'lucide-react';

interface AdmissionSectionProps {
  admissionData?: Admission;
  level: 'UNDERGRADUATE' | 'GRADUATE';
}

export const AdmissionSection = ({ admissionData, level }: AdmissionSectionProps) => {
  if (!admissionData) return null;

  const isUndergrad = level === 'UNDERGRADUATE';
  const title = isUndergrad ? 'Undergraduate Admission' : 'Graduate Admission';

  return (
    <div id={`${level.toLowerCase()}-admissions`} className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requirements */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-600" />
            Admission Requirements
          </h3>
          <div className="space-y-4">
            {admissionData.requirements?.map((req: AdmissionRequirement, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-start border border-gray-100">
                <CheckCircle className={`w-5 h-5 mr-4 mt-1 flex-shrink-0 ${req.is_required ? 'text-green-500' : 'text-gray-400'}`} />
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">{req.name}</h4>
                  {req.percentile_25 && req.percentile_75 && <p className="text-sm text-gray-600 mt-1">Score Range: {req.percentile_25} - {req.percentile_75}</p>}
                  {req.description && <p className="text-sm text-gray-600 mt-1">{req.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Info */}
        <div className="bg-blue-50 rounded-xl shadow-md border border-blue-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-blue-800 mb-5">Application</h3>
            <div className="space-y-4">
              {admissionData.application_website && (
                <a href={admissionData.application_website} target="_blank" rel="noopener noreferrer" className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center">
                    <ExternalLink className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-gray-800">Apply Now</h4>
                      <p className="text-sm text-gray-500">Go to application portal</p>
                    </div>
                  </div>
                </a>
              )}
              {admissionData.admission_website && (
                <a href={admissionData.admission_website} target="_blank" rel="noopener noreferrer" className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center">
                    <ExternalLink className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-gray-800">Admission Website</h4>
                      <p className="text-sm text-gray-500">Visit official admission page</p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
          {admissionData.acceptance_rate !== undefined && (
            <div className="mt-8 pt-6 border-t border-blue-200 text-center">
              <p className="text-sm font-medium text-blue-700">Acceptance Rate</p>
              <p className="text-5xl font-extrabold text-blue-800 mt-2">{admissionData.acceptance_rate}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};