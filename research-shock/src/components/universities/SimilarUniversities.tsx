import Link from 'next/link';
import { SimilarUniversity } from "@/types/universities/university";

interface SimilarUniversitiesProps {
  universities: SimilarUniversity[];
}

export const SimilarUniversities = ({ universities }: SimilarUniversitiesProps) => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Similar Universities
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <Link key={university.id} href={`/universities/${university.id}`}>
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center mb-4">
                  <img
                    src={university.image}
                    alt={university.name}
                    className="w-12 h-12 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{university.name}</h3>
                    <p className="text-sm text-gray-600">{university.location}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 capitalize">{university.type}</span>
                  {university.ranking && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Rank #{university.ranking}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
