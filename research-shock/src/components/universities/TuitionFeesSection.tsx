import { DollarSign, Calculator } from "lucide-react";

interface TuitionData {
  undergraduate: {
    tuition: string;
    fees: string;
    roomBoard: string;
    total: string;
  };
  graduate: {
    tuition: string;
    fees: string;
    roomBoard: string;
    total: string;
  };
  additionalFees: {
    name: string;
    amount: string;
  }[];
}

interface TuitionFeesSectionProps {
  tuitionData: TuitionData;
}

export const TuitionFeesSection = ({ tuitionData }: TuitionFeesSectionProps) => {
  return (
    <section id="tuition" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tuition & Fees
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent pricing for your educational investment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Undergraduate Costs */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Undergraduate (Annual)</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tuition</span>
                <span className="font-semibold text-gray-900">{tuitionData.undergraduate.tuition}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fees</span>
                <span className="font-semibold text-gray-900">{tuitionData.undergraduate.fees}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Room & Board</span>
                <span className="font-semibold text-gray-900">{tuitionData.undergraduate.roomBoard}</span>
              </div>
              <div className="border-t border-blue-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">{tuitionData.undergraduate.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graduate Costs */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Graduate (Annual)</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tuition</span>
                <span className="font-semibold text-gray-900">{tuitionData.graduate.tuition}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fees</span>
                <span className="font-semibold text-gray-900">{tuitionData.graduate.fees}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Room & Board</span>
                <span className="font-semibold text-gray-900">{tuitionData.graduate.roomBoard}</span>
              </div>
              <div className="border-t border-purple-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-purple-600">{tuitionData.graduate.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Fees */}
        {tuitionData.additionalFees.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Additional Fees</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {tuitionData.additionalFees.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">{fee.name}</span>
                    <span className="font-semibold text-gray-900">{fee.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
