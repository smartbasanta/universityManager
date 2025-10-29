import React from "react";

interface DashboardContainerProps {
  children: React.ReactNode;
}

export default function DashboardContainer({
  children,
}: DashboardContainerProps) {
  return (
    <div className="mx-2 my-3 md:my-4 sm:mx-3 md:mx-6 min-h-screen">
      {children}
    </div>
  );
}
