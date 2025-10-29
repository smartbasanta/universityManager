"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";

import { MentorDashboard } from "@/components/dashboards/MentorDashboard";
import { AmbassadorDashboard } from "@/components/dashboards/AmbassadorDashboard";

import { roleType } from "@/types";
import { Users, Calendar } from "lucide-react";

/* Quick Action card for Manage Meetings */
// function ManageMeetingsCard() {
//   const router = useRouter();

//   return (
//     <div
//       onClick={() => router.push("/dashboard/manage-meeting")}
//       className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-md cursor-pointer"
//     >
//       {/* <div className="flex items-center gap-3">
//         <div className="rounded-lg bg-blue-100 p-2">
//           <Users className="h-5 w-5 text-blue-600" />
//         </div>
//         <h3 className="text-lg font-semibold">Manage Meetings</h3>
//       </div>
//       <p className="text-sm text-gray-600">
//         Review and accept or reject booking requests from students.
//       </p> */}
//     </div>
//   );
// }

export default function DashboardPage() {
  const { role, info } = useAuthStore();

  switch (role) {
    case roleType.MENTOR:
      return (
        <>
          {/* <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ManageMeetingsCard />
            {/* You can add more quick action cards here if needed */}
          {/* </div> */} 
          <MentorDashboard />
        </>
      );

    case roleType.STUDENT_AMBASSADOR:
      return (
        <>
          {/* <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ManageMeetingsCard />
            {/* You can add more quick action cards here if needed */}
          {/* </div> */} 
          <AmbassadorDashboard />
        </>
      );

    /* ---------- Institution / Company ---------- */
    case roleType.INSTITUTION:
      return (
        <div className="p-6 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
           <div className="flex justify-center items-center mb-6">
              <span className="font-bold text-xl text-gray-800">
                ResearchShock
              </span>
            </div>
          </div>
        </div>
      );

    /* -------------- University --------------- */
    case roleType.UNIVERSITY:
      return (
        <div className="p-6 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
             <div className="flex justify-center items-center mb-6">
              <span className="font-bold text-xl text-gray-800">
                ResearchShock
              </span>
            </div>
          </div>
        </div>
      );

    /* -------------- Fallback ------------------ */
    default:
      return <div>No dashboard found</div>;
  }
}
