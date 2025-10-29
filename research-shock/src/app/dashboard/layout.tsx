"use client";

import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/Footer";
import { axiosPrivateInstance } from "@/api/axois-config";
import { roleType } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = useAuthStore((state) => state.isAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const role = useAuthStore((state) => state.role);
  const { setRole, setIsAuth, setPermissions, permissions,setPp } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuth && !isLoading) {
      router.push("/");
      return;
    }

    if (isAuth) {
      axiosPrivateInstance
        .get("/auth/user-info")
        .then((res) => {
          console.log(res);
          let userRole = null;
          let userData = null;
          let userPermission = null;
          let pp;

          if (res.data.data) {
            userData = res.data.data;
            userRole = userData.role;
            userPermission = userData.permission;
            pp = userData.photo;
          } else {
            userData = res.data;
            userRole = userData.role;
            userPermission = userData.permission;
            pp = userData.photo;
          }

          if (!userRole) {
            userRole =
              userData.userRole ||
              userData.user_role ||
              userData.roleType ||
              userData.account_type;
          }

          if (userRole) {
            setRole(userRole);
            setIsAuth(true);
            setPermissions(userPermission);
            setPp(pp);

          } else {
            setIsAuth(true);
          }
        })
        .catch((error) => {
          setIsAuth(false);
          router.push("/");
        });
    }
  }, [isAuth, isLoading, isClient, router, setRole, setIsAuth]);

  if (!isClient || isLoading || !isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // NEW: Determine if user is mentor or ambassador for manage-meetings UI logic
  const canManageMeetings =
    role === roleType.MENTOR || role === roleType.STUDENT_AMBASSADOR;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8FAFC]">
      <DashboardHeader />

      <div className="flex flex-1">
        {/* Pass canManageMeetings to sidebar if needed */}
        <DashboardSidebar  />

        <main className="flex-1 p-6">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
