// components/mentor-stats.tsx

import { Users, UserCheck, Clock, Star } from "lucide-react";

export const MentorStats = () => {
  const stats = [
    {
      title: "Total Mentors",
      value: "48",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Mentors",
      value: "42",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Applications",
      value: "6",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
