"use client";

import {
  LayoutDashboard,
  GraduationCap,
  Notebook,
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
  BookText,
  School,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

// ------------------- Types --------------------
interface LinkItem {
  title: string;
  url: string;
}

interface NestedSection {
  title: string;
  items: LinkItem[];
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  url?: string;
  nested?: boolean;
  sections?: NestedSection[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "University Profile",
    icon: School,
    nested: true,
    sections: [
      {
        title: "General",
        items: [
          {
            title: "Overview",
            url: "/dashboard/university-profile/general/overview",
          },
          {
            title: "Student Life",
            url: "/dashboard/university-profile/general/student-life",
          },

          {
            title: "Sports",
            url: "/dashboard/university-profile/general/sports",
          },
          {
            title: "Notable Alumni",
            url: "/dashboard/university-profile/general/notable-alumni",
          },
          {
            title: "Research Hub",
            url: "/dashboard/university-profile/general/research",
          },
          {
            title: "Entreprenurship",
            url: "/dashboard/university-profile/general/entreprenurship",
          },
        ],
      },
      {
        title: "Undergrad",
        items: [
          {
            title: "Ranking",
            url: "/dashboard/university-profile/undergrad/ranking",
          },
          {
            title: "Admission",
            url: "/dashboard/university-profile/undergrad/admission",
          },
          {
            title: "Tuition & Cost",
            url: "/dashboard/university-profile/undergrad/tuition-cost",
          },
          {
            title: "Major",
            url: "/dashboard/university-profile/undergrad/major",
          },
          {
            title: "Graduation",
            url: "/dashboard/university-profile/undergrad/graduation",
          },
          {
            title: "Research",
            url: "/dashboard/university-profile/undergrad/research",
          },
        ],
      },
      {
        title: "Grad",
        items: [
          {
            title: "Ranking",
            url: "/dashboard/university-profile/grad/ranking",
          },
          {
            title: "Admission",
            url: "/dashboard/university-profile/grad/admission",
          },
          {
            title: "Tuition & Cost",
            url: "/dashboard/university-profile/grad/tuition-cost",
          },
          {
            title: "Major",
            url: "/dashboard/university-profile/grad/major",
          },
          {
            title: "Graduation",
            url: "/dashboard/university-profile/grad/graduation",
          },
          {
            title: "Research",
            url: "/dashboard/university-profile/grad/research",
          },
        ],
      },
    ],
  },
  {
    title: "Scholarship",
    url: "/dashboard/scholarship",
    icon: GraduationCap,
  },
  {
    title: "Programs",
    url: "/dashboard/program",
    icon: BookText,
  },
  {
    title: "Research",
    url: "/dashboard/research",
    icon: Notebook,
  },
  {
    title: "Mentors",
    url: "/dashboard/mentors",
    icon: UserRound,
  },
  {
    title: "Jobs / Intern",
    url: "/dashboard/job-intern",
    icon: BriefcaseBusiness,
  },
  {
    title: "Roles",
    url: "/dashboard/roles",
    icon: ShieldCheck,
  },
];

// ------------------- Component --------------------
export function AppSidebar() {
  const pathName = usePathname();

  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    const matched = menuItems.find(
      (item) =>
        item.nested && pathName.startsWith("/dashboard/university-profile")
    );
    return matched?.title ?? null;
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Sidebar className="border-r border-border bg-white text-black">
      <SidebarHeader className=" border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            RS
          </div>
          <span className="font-semibold text-lg">Research Shock</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            University Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) =>
                item.nested && item.sections ? (
                  <SidebarMenuItem key={item.title}>
                    <Collapsible
                      open={openGroup === item.title}
                      onOpenChange={() =>
                        setOpenGroup((prev) =>
                          prev === item.title ? null : item.title
                        )
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between hover:bg-muted">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                          </div>
                          {openGroup === item.title ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 mt-1 space-y-1">
                        {item.sections.map((section) => (
                          <Collapsible
                            key={section.title}
                            open={openSections[section.title] ?? false}
                            onOpenChange={() => toggleSection(section.title)}
                          >
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground py-1">
                              <span>{section.title}</span>
                              {openSections[section.title] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="ml-3 mt-1 space-y-1">
                              {section.items.map((link) => (
                                <Link
                                  key={link.title}
                                  href={link.url}
                                  className={clsx(
                                    "block text-sm rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground",
                                    {
                                      "bg-primary/10 text-primary":
                                        pathName === link.url,
                                    }
                                  )}
                                >
                                  {link.title}
                                </Link>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={clsx(
                        "transition-colors hover:bg-accent hover:text-accent-foreground",
                        {
                          "bg-primary/10 text-primary":
                            pathName === item.url ||
                            (item.url !== "/dashboard" &&
                              pathName.startsWith(item.url!)),
                        }
                      )}
                    >
                      <Link
                        href={item.url!}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-border mt-auto text-sm text-muted-foreground">
        University of Innovation
      </div>
    </Sidebar>
  );
}
