"use client";

import { useAuthStore } from "@/stores/useAuth";



import { roleType } from "@/types";
import CompanyProfile from "./components/CompanyProfile";

export default function CompanyProfilePage() {
  const { role, info } = useAuthStore();

  switch (role) {
    case roleType.INSTITUTION:
      return <CompanyProfile />;


    default:
      return <div>No dashboard found</div>;
  }
}
