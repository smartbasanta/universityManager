"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Archive, Globe, FileText } from "lucide-react";
import Link from "next/link";
import { useDeleteScholarship, useUpdateScholarshipStatus } from "@/hooks/api/scholarship/scholarship.query";
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

interface ScholarshipItemProps {
  id?: string;
  title: string;
  meta: string;
  status?: string;
  showMoveToLive?: boolean;
  showMoveToArchive?: boolean;
}

export const ScholarshipItem = ({
  id,
  title,
  meta,
  status,
  showMoveToLive = false,
  showMoveToArchive = false,
}: ScholarshipItemProps) => {
  const { mutate: deleteScholarship, isPending: isDeleting } = useDeleteScholarship();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateScholarshipStatus();

  const handleDelete = () => {
    if (id) {
      deleteScholarship(id);
    }
  };

  const handleMoveToLive = () => {
    if (id) {
      updateStatus({ id, status: 'Live' });
    }
  };

  const handleMoveToArchive = () => {
    if (id) {
      updateStatus({ id, status: 'Archive' });
    }
  };

  // Determine edit URL with status parameter
  const getEditUrl = () => {
    if (!id) return "#";
    return `/dashboard/scholarships/edit/${id}?status=${status || 'draft'}`;
  };

  // Get scholarship applications URL
  const getApplicationsUrl = () => {
    if (!id) return "#";
    return `/dashboard/scholarships/applications/${id}`;
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
        {/* View Applications Button - Show only for Live scholarships */}
        {/* {status === 'Live' && id && ( */}
          <Link href={getApplicationsUrl()}>
            <Button 
              variant="outline"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Applications
            </Button>
          </Link>
        {/* )} */}

        {/* Edit Button */}
        {id ? (
          <Link href={getEditUrl()}>
            <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.EDIT_SCHOLARSHIP]}>
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
          <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.EDIT_SCHOLARSHIP]}>
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
          <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.EDIT_SCHOLARSHIP]}>
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
                    Are you sure you want to move "{title}" to Live? This will publish the scholarship.
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
          <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.EDIT_SCHOLARSHIP]}>
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
                    Are you sure you want to move "{title}" to Archive? This will unpublish the scholarship.
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
        <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.DELETE_SCHOLARSHIP]}>
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
                <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
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
    </div>
  );
};
