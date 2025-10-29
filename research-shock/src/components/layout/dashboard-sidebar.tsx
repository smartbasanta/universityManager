"use client";

import {
  BriefcaseBusiness,
  ChartArea,
  GraduationCap,
  Megaphone,
  University,
  UserCog,
  UsersRound,
  ChevronDown,
  ChevronRight,
  Settings,
  Building2,
  Users,
  Trophy,
  FlaskConical,
  Dumbbell,
  Coffee,
  BookOpen,
  DollarSign,
  Award,
  Calculator,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { permissionType, roleType } from "@/types";
import ProtectComponent from "@/middleware/protectComponent";
import { permission } from "process";

const navItems = [
  // {
  //   label: "Dashboard",
  //   icon: Home,
  //   href: "/dashboard",
  //   role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.MENTOR, roleType.STUDENT_AMBASSADOR, roleType.MENTOR, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF]
  // },
  {
  label: "Manage Meetings",
  icon: Users,
  href: "/dashboard/manage-meeting",
  role: [roleType.MENTOR, roleType.STUDENT_AMBASSADOR], // Only these two roles see it
},

  {
    label: "Research News",
    icon: GraduationCap,
    href: "/dashboard/research-news",
    role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF],
    permission: [permissionType.VIEW_RESEARCH_NEWS]
  },
  {
    label: "University Profile",
    icon: University,
    href: "/dashboard/university-profile",
    hasNested: true,
    role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF],
    permission: [permissionType.VIEW_UNIVERSITY_PROFILE, permissionType.EDIT_UNIVERSITY_PROFILE],
    nestedItems: [
      {
        label: "General",
        icon: Settings,
        href: "/dashboard/university-profile/general",
        nestedItems: [
          {
            label: "Overview",
            icon: BookOpen,
            href: "/dashboard/university-profile/general/overview",
          },
          {
            label: "Student Life",
            icon: Coffee,
            href: "/dashboard/university-profile/general/student-life",
          },
          {
            label: "Sports",
            icon: Dumbbell,
            href: "/dashboard/university-profile/general/sports",
          },
          {
            label: "Research",
            icon: FlaskConical,
            href: "/dashboard/university-profile/general/research",
          },
          {
            label: "Notable Alumni",
            icon: Users,
            href: "/dashboard/university-profile/general/notable-alumni",
          },
          {
            label: "Entrepreneurship",
            icon: Building2,
            href: "/dashboard/university-profile/general/entrepreneurship",
          },
          {
            label: "Ranking",
            icon: Trophy,
            href: "/dashboard/university-profile/general/ranking",
          },
        ],
      },
      {
        label: "Undergraduate",
        icon: University,
        href: "/dashboard/university-profile/undergrad",
        nestedItems: [
          {
            label: "Admission",
            icon: Users,
            href: "/dashboard/university-profile/undergrad/admission",
          },
          {
            label: "Graduation",
            icon: Award,
            href: "/dashboard/university-profile/undergrad/graduation",
          },
          {
            label: "Major",
            icon: BookOpen,
            href: "/dashboard/university-profile/undergrad/major",
          },
          {
            label: "Research",
            icon: FlaskConical,
            href: "/dashboard/university-profile/undergrad/research",
          },
          {
            label: "Tuition Cost",
            icon: Calculator,
            href: "/dashboard/university-profile/undergrad/tuition-cost",
          },
        ],
      },
      {
        label: "Graduate",
        icon: GraduationCap,
        href: "/dashboard/university-profile/grad",
        nestedItems: [
          {
            label: "Admission",
            icon: Users,
            href: "/dashboard/university-profile/grad/admission",
          },
          {
            label: "Cost",
            icon: DollarSign,
            href: "/dashboard/university-profile/grad/cost",
          },
          {
            label: "Graduation",
            icon: Award,
            href: "/dashboard/university-profile/grad/graduation",
          },
          {
            label: "Major",
            icon: BookOpen,
            href: "/dashboard/university-profile/grad/major",
          },
          {
            label: "Research",
            icon: FlaskConical,
            href: "/dashboard/university-profile/grad/research",
          },
        ],
      },
    ],
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
    role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF],
    permission: [permissionType.VIEW_SCHOLARSHIP],
  },
  {
    label: "Jobs",
    icon: BriefcaseBusiness,
    href: "/dashboard/jobs",
    role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF],
    permission: [permissionType.VIEW_JOB],
  },
  {
    label: "Mentors in Residence",
    icon: UsersRound,
    href: "/dashboard/mentors",
    role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION,roleType.DEPARTMENT_STAFF],
    permission: [permissionType.VIEW_MENTOR_IN_RESIDENCE],
  },
  {
    label: "Student Ambassadors",
    icon: UsersRound,
    href: "/dashboard/ambassadors",
    role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.DEPARTMENT_STAFF],
    permission: [permissionType.VIEW_STUDENT_AMBASSADOR],
  },
  {
    label: "Opportunity Hub",
    icon: BriefcaseBusiness,
    href: "/dashboard/opportunities",
    role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF],
    permission: [permissionType.VIEW_OPPERTURUNITY],
  },
  // {
  //   label: "Ads",
  //   icon: Megaphone,
  //   href: "/dashboard/ads",
  //   role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF],
  // },
  // {
  //   label: "Analytics",
  //   icon: ChartArea,
  //   href: "/dashboard/analytics",
  //   role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF],
  // },
  {
    label: "Team Management",
    icon: UserCog,
    href: "/dashboard/team-management",
    role: [roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION],
  },
];

interface NavItem {
  label: string;
  icon: any;
  href: string;
  hasNested?: boolean;
  nestedItems?: NavItem[];
}

interface NestedNavItemProps {
  item: NavItem;
  level: number;
  pathName: string;
  expandedItems: Set<string>;
  toggleExpanded: (href: string, level: number) => void;
}

function NestedNavItem({
  item,
  level,
  pathName,
  expandedItems,
  toggleExpanded,
}: NestedNavItemProps) {
  const router = useRouter();
  const isExpanded = expandedItems.has(item.href);

  const isActive =
    pathName === item.href ||
    (item.href !== "/dashboard" && pathName.startsWith(item.href));
  const hasNestedItems = item.nestedItems && item.nestedItems.length > 0;

  const paddingLeft = level === 0 ? "pl-3" : level === 1 ? "pl-6" : "pl-9";

  return (
    <div>
      <div
        className={clsx(
          "flex items-center gap-3 py-3 rounded-lg text-sm font-medium leading-normal hover:bg-gray-200 text-[#0d141c] cursor-pointer transition-colors",
          paddingLeft,
          {
            "bg-gray-300": isActive && !hasNestedItems,
          }
        )}
        onClick={() => {
          if (hasNestedItems) {
            toggleExpanded(item.href, level);
          } else {
            router.push(item.href);
          }
        }}
      >
        {hasNestedItems ? (
          <>
            <item.icon className="w-5 h-5" />
            <span className="flex-1">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-2" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
          </>
        ) : (
          <>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </>
        )}
      </div>

      {hasNestedItems && isExpanded && (
        <div className="ml-2">
          {item.nestedItems!.map((nestedItem) => (
            <NestedNavItem
              key={nestedItem.href}
              item={nestedItem}
              level={level + 1}
              pathName={pathName}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardSidebar() {
  const pathName = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Auto-expand parent items if current path matches a nested item
  useEffect(() => {
    const newExpandedItems = new Set<string>();

    navItems.forEach((item) => {
      if (item.hasNested && pathName.startsWith(item.href)) {
        newExpandedItems.add(item.href);

        // Also expand nested items if needed
        item.nestedItems?.forEach((nestedItem) => {
          if (nestedItem.nestedItems && pathName.startsWith(nestedItem.href)) {
            newExpandedItems.add(nestedItem.href);
          }
        });
      }
    });

    setExpandedItems(newExpandedItems);
  }, [pathName]);

  const toggleExpanded = (href: string, level: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(href)) {
        // If clicking on an already expanded item, just close it
        newSet.delete(href);
      } else {
        // Helper function to find items at the same level
        const findItemsAtLevel = (items: NavItem[], targetLevel: number, currentLevel: number = 0): string[] => {
          const result: string[] = [];

          for (const item of items) {
            if (currentLevel === targetLevel && item.nestedItems) {
              result.push(item.href);
            }
            if (item.nestedItems) {
              result.push(...findItemsAtLevel(item.nestedItems, targetLevel, currentLevel + 1));
            }
          }

          return result;
        };

        // Get all items at the same level
        const itemsAtSameLevel = findItemsAtLevel(navItems, level);

        // Close all other expanded items at the same level
        itemsAtSameLevel.forEach(itemHref => {
          if (itemHref !== href) {
            newSet.delete(itemHref);
          }
        });

        // Open the clicked item
        newSet.add(href);
      }

      return newSet;
    });
  };

  return (
    <aside className="w-80 bg-slate-50 border-r border-gray-200">
      <div className="flex h-full flex-col">
        {/* <div className="p-4 border-b border-gray-200">
          <h1 className="text-[#0d141c] text-base font-medium leading-normal">
            Dashboard
          </h1>
        </div> */}

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              if (item.hasNested) {
                return (
                  <ProtectComponent requiredRoles={item.role} requiredPermission={item.permission}>
                    <NestedNavItem
                      key={item.href}
                      item={item}
                      level={0}
                      pathName={pathName}
                      expandedItems={expandedItems}
                      toggleExpanded={toggleExpanded}
                    />
                  </ProtectComponent>
                );
              }

              return (
                <ProtectComponent requiredRoles={item.role} requiredPermission={item.permission}>
                  <Link
                    key={item.label}
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
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
