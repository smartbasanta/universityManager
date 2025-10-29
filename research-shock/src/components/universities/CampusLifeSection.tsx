import { Home, Utensils, Dumbbell, Users } from "lucide-react";

interface CampusLifeInfo {
  housing: {
    title: string;
    description: string;
    options: string[];
  };
  dining: {
    title: string;
    description: string;
    options: string[];
  };
  recreation: {
    title: string;
    description: string;
    facilities: string[];
  };
  organizations: {
    title: string;
    description: string;
    count: number;
    examples: string[];
  };
}

interface CampusLifeSectionProps {
  campusLifeInfo: CampusLifeInfo;
}

export const CampusLifeSection = ({ campusLifeInfo }: CampusLifeSectionProps) => {
  return (
    <section id="student-life-details" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Campus Life
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience vibrant campus life with diverse opportunities for growth and connection
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Housing */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <Home className="w-8 h-8 text-orange-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-900">{campusLifeInfo.housing.title}</h3>
            </div>
            <p className="text-gray-700 mb-6">{campusLifeInfo.housing.description}</p>
            <div className="space-y-2">
              {campusLifeInfo.housing.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  <span className="text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dining */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <Utensils className="w-8 h-8 text-orange-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-900">{campusLifeInfo.dining.title}</h3>
            </div>
            <p className="text-gray-700 mb-6">{campusLifeInfo.dining.description}</p>
            <div className="space-y-2">
              {campusLifeInfo.dining.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  <span className="text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recreation */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <Dumbbell className="w-8 h-8 text-orange-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-900">{campusLifeInfo.recreation.title}</h3>
            </div>
            <p className="text-gray-700 mb-6">{campusLifeInfo.recreation.description}</p>
            <div className="space-y-2">
              {campusLifeInfo.recreation.facilities.map((facility, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  <span className="text-gray-700">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-orange-600 mr-4" />
              <h3 className="text-xl font-bold text-gray-900">{campusLifeInfo.organizations.title}</h3>
            </div>
            <p className="text-gray-700 mb-4">{campusLifeInfo.organizations.description}</p>
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <span className="text-2xl font-bold text-orange-600">{campusLifeInfo.organizations.count}+</span>
              <span className="text-gray-700 ml-2">Student Organizations</span>
            </div>
            <div className="space-y-2">
              {campusLifeInfo.organizations.examples.map((example, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  <span className="text-gray-700">{example}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
