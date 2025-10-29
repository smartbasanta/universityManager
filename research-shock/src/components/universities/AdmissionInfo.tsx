import { ExternalLink, Calendar, FileText } from "lucide-react";
import { Admissions } from "@/types/universities/university";

interface AdmissionsInfoProps {
  admissions: Admissions;
}

export const AdmissionsInfo = ({ admissions }: AdmissionsInfoProps) => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Admissions Information
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{admissions.requirements}</p>
            
            {admissions.applicationFee && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-800">
                  Application Fee: {admissions.applicationFee}
                </span>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Deadlines</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Undergraduate:</span>
                <span className="text-green-600 font-semibold">{admissions.deadlines.undergraduate}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Postgraduate:</span>
                <span className="text-green-600 font-semibold">{admissions.deadlines.postgraduate}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">PhD:</span>
                <span className="text-green-600 font-semibold">{admissions.deadlines.phd}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <a
                href={admissions.applicationWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Visit Admissions Website
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
