"use client";

import {
  BriefcaseBusiness,
  ChartArea,
  GraduationCap,
  Megaphone,
  University,
  UserCog,
  UsersRound,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { permissionType, roleType } from "@/types";
import ProtectComponent from "@/middleware/protectComponent";

const navItems = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    role: [roleType.INSTITUTION],
    permission: [permissionType]
  },
  {
    label: "Research News",
    icon: GraduationCap,
    href: "/dashboard/research-news",
    role: [roleType.INSTITUTION]
  },
  {
    label: "Company Profile",
    icon: University,
    href: "/dashboard/company-profile",
    role: [roleType.INSTITUTION],
  },
  {
    label: "Scholarships",
    icon: University,
    href: "/dashboard/scholarships",
    role: [roleType.INSTITUTION],
  },
  {
    label: "Jobs",
    icon: BriefcaseBusiness,
    href: "/dashboard/jobs",
    role: [roleType.INSTITUTION],
  },
  {
    label: "Mentors in Residence",
    icon: UsersRound,
    href: "/dashboard/mentors",
    role: [roleType.INSTITUTION],
  },
  {
    label: "Opportunity Hub",
    icon: BriefcaseBusiness,
    href: "/dashboard/opportunities",
    role: [roleType.INSTITUTION],
  },
  {
    label: "Ads",
    icon: Megaphone,
    href: "/dashboard/ads",
    role: [roleType.INSTITUTION],
  },
  {
    label: "Analytics",
    icon: ChartArea,
    href: "/dashboard/analytics",
    role: [roleType.INSTITUTION],
  },
  {
    label: "Team Management",
    icon: UserCog,
    href: "/dashboard/team-management",
    role: [roleType.INSTITUTION],
  },
];

export default function CompanySidebar() {
  const pathName = usePathname();

  return (
    <aside className="w-80 bg-slate-50 border-r border-gray-200">
      <div className="flex h-full flex-col">
        {/* <div className="p-4 border-b border-gray-200">
          <h1 className="text-[#0d141c] text-base font-medium leading-normal">
            Company Dashboard
          </h1>
        </div> */}

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <ProtectComponent key={item.label} requiredRoles={item.role}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium leading-normal hover:bg-gray-200 text-[#0d141c] transition-colors",
                    {
                      "bg-gray-300":
                        pathName === item.href ||
                        (item.href !== "/dashboard" &&
                          pathName.startsWith(item.href)),
                    }
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </ProtectComponent>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
