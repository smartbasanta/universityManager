import { Demographics, StudentLife, ProfessorStats } from "@/types/universities/university";

interface UniversityStatisticsProps {
  demographics: Demographics;
  studentLife: StudentLife;
  professors: ProfessorStats;
}

export const UniversityStatistics = ({ demographics, studentLife, professors }: UniversityStatisticsProps) => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Demographics */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Student Demographics</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students</span>
                <span className="font-semibold">{demographics.totalStudents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Graduate Students</span>
                <span className="font-semibold">{demographics.graduateStudents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Part-Time Students</span>
                <span className="font-semibold">{demographics.partTimeStudents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Research Assistants</span>
                <span className="font-semibold">{demographics.researchAssistants.toLocaleString()}</span>
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 mb-3">Racial Diversity</h4>
            <div className="space-y-2">
              {demographics.racialDiversity.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.category}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Life */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Student Life</h3>
            
            <h4 className="font-semibold text-gray-900 mb-3">Student Characteristics</h4>
            <div className="space-y-3 mb-6">
              {studentLife.characteristics.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">{item.trait}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-gray-900 mb-3">Student Satisfaction</h4>
            <div className="space-y-3">
              {studentLife.satisfaction.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">{item.metric}</span>
                  <span className="text-sm font-medium text-green-600">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professors */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Professors</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {professors.careAboutStudents}%
                </div>
                <div className="text-sm text-gray-600">
                  of students agree that professors care about their students' success
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {professors.engagingAndUnderstandable}%
                </div>
                <div className="text-sm text-gray-600">
                  of students agree that professors are engaging and easy to understand
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {professors.helpWithOpportunities}%
                </div>
                <div className="text-sm text-gray-600">
                  of students agree that professors helped connect them to future opportunities
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
