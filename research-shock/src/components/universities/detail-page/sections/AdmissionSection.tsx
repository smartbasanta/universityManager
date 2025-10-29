import { Section } from './common/Section';
import { ClipboardList } from 'lucide-react';
import { Admission } from '@/hooks/api/website/university.api';

export function AdmissionSection({ admissions, level }: { admissions?: Admission[]; level: 'UNDERGRADUATE' | 'GRADUATE' }) {
  const admissionData = admissions?.find(a => a.level.toUpperCase() === level);
  if (!admissionData) return null;

  const title = level === 'UNDERGRADUATE' ? 'Undergraduate Admissions' : 'Graduate Admissions';
  const themeColor = level === 'UNDERGRADUATE' ? 'text-green-600' : 'text-purple-600';

  return (
    <Section id={`${level.toLowerCase()}-admissions`} icon={ClipboardList} title={title} subtitle="Key requirements and information for prospective applicants." themeColor={themeColor}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Requirements</h3>
          <div className="space-y-3">
            {admissionData.requirements.map((req, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md border">
                <h4 className="font-medium">{req.name}</h4>
                {req.percentile_25 && <p className="text-sm text-gray-600">Range: {req.percentile_25}-{req.percentile_75}</p>}
                <span className={`text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block ${req.is_required ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'}`}>
                  {req.is_required ? 'Required' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Application</h3>
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <p>Acceptance Rate: <span className="font-bold text-blue-700">{admissionData.acceptance_rate}%</span></p>
            <a href={admissionData.application_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
              Apply Now &rarr;
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}