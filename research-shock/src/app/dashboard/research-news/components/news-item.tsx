"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Archive, Globe } from "lucide-react";
import Link from "next/link";
import { useDeleteResearchNews, useUpdateResearchNewsStatus } from "@/hooks/api/research/research.query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProtectComponent from "@/middleware/protectComponent";
import { permissionType, roleType } from "@/types";

interface NewsItemProps {
  id?: string;
  title: string;
  meta: string;
  status?: string;
  showMoveToLive?: boolean;
  showMoveToArchive?: boolean;
}

export const NewsItem = ({
  id,
  title,
  meta,
  status,
  showMoveToLive = false,
  showMoveToArchive = false,
}: NewsItemProps) => {
  const { mutate: deleteResearchNews, isPending: isDeleting } = useDeleteResearchNews();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateResearchNewsStatus();

  const handleDelete = () => {
    if (id) {
      deleteResearchNews(id);
    }
  };

  const handleMoveToLive = () => {
    if (id) {
      updateStatus({ id, status: 'published' });
    }
  };

  const handleMoveToArchive = () => {
    if (id) {
      updateStatus({ id, status: 'archived' });
    }
  };

  // Determine edit URL with status parameter
  const getEditUrl = () => {
    if (!id) return "#";
    return `/dashboard/research-news/edit/${id}?status=${status || 'draft'}`;
  };

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
        {/* Edit Button */}
        {id ? (
          <Link href={getEditUrl()}>
            <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.EDIT_RESEARCH_NEWS]}>
              <Button
                variant="outline"
                className="bg-[#f0f2f5] text-[#111418] hover:bg-gray-300 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit details
              </Button>
            </ProtectComponent>
          </Link>
        ) : (
          <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.EDIT_RESEARCH_NEWS]}>
            <Button
              variant="outline"
              disabled
              className="bg-gray-100 text-gray-400"
            >
              <Edit className="w-4 h-4" />
              Edit details
            </Button>
          </ProtectComponent>
        )}

        {/* Move to Live Button (for archived items) */}
        {showMoveToLive && (
          <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.EDIT_RESEARCH_NEWS]}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!id || isUpdatingStatus}
                  className="bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {isUpdatingStatus ? "Moving..." : "Move to Live"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Move to Live</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to move "{title}" to Live? This will publish the research news.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleMoveToLive}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Move to Live
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </ProtectComponent>
        )}

        {/* Move to Archive Button (for live items) */}
        {showMoveToArchive && (
          <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.EDIT_RESEARCH_NEWS]}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!id || isUpdatingStatus}
                  className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  {isUpdatingStatus ? "Moving..." : "Move to Archive"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Move to Archive</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to move "{title}" to Archive? This will unpublish the research news.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleMoveToArchive}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Move to Archive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </ProtectComponent>
        )}

        {/* Delete Button with Dialog */}
        <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.DELETE_RESEARCH_NEWS]}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!id || isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Research News</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ProtectComponent>
      </div>
    </div >
  );
};
