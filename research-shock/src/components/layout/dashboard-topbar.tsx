"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuth";
import { useEffect } from "react";
import { useUniversityUserInfo } from "@/hooks/api/university/university.query";

export default function DashboardTopbar() {
  const router = useRouter();
  const {
    info,
    logout,
  } = useAuthStore();

  const { data: userInfoData, isLoading } = useUniversityUserInfo();

  const handleLogout = () => {
    setTimeout(() => {
      logout();
      localStorage.removeItem('rToken');
      sessionStorage.removeItem('rToken');
      router.push('/auth/login');
    }, 0);
  };

  const getUniversityAvatar = () => {
    if (info?.university?.logo) {
      return info.university.logo;
    }
    // Default university avatar using university name
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      info?.university?.university_name || 'University'
    )}&background=3b82f6&color=ffffff&size=40`;
  };

  const getUniversityInitials = () => {
    if (!info?.university?.university_name) return 'UN';

    const words = info.university.university_name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map((word: any) => word[0]).join('').toUpperCase();
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* University Name Display */}
      <div className="hidden md:block text-right">
        <p className="text-sm font-semibold text-gray-900">
          {info?.university?.university_name || 'Loading...'}
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {info?.university?.status || 'inactive'} • {info?.university?.country}
        </p>
      </div>

      {/* Notification Bell */}
      <Button className="bg-red-100" variant={"ghost"}>
        <Bell className="w-5 h-5 text-gray-600" />
      </Button>

      {/* Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <AvatarImage
              src={getUniversityAvatar()}
              alt={info?.university?.university_name || 'University'}
            />
            <AvatarFallback className="bg-blue-600 text-white font-semibold">
              {getUniversityInitials()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {/* University Info Header */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">
                {info?.university?.university_name || 'University'}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {info?.university?.country} • {info?.university?.status}
              </p>
              {info?.university?.website && (
                <p className="text-xs leading-none text-blue-600 truncate">
                  {info.university.website}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            University Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/dashboard/applications")}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Applications
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/dashboard/analytics")}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Account Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 focus:text-red-600"
            onClick={handleLogout}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
