"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface AmbassadorItemProps {
  id?: string;
  title: string;
  meta: string;
  status?: string;
}

export const AmbassadorItem = ({
  id,
  title,
  meta,
  status,
}: AmbassadorItemProps) => {
  return (
    <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
      <div className="flex flex-col justify-center">
        <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">
          {title}
        </p>
        <p className="text-[#60758a] text-sm font-normal leading-normal line-clamp-2">
          {meta}
        </p>
      </div>
      <div className="shrink-0 flex gap-2">
        {/* Preview Button (optional - can be used for viewing ambassador details) */}
        {status === "awaiting-approval" && (
          <Button 
            variant="outline"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        )}
      </div>
    </div>
  );
};
