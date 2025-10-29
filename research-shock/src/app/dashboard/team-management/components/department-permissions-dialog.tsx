"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetPermissionList } from "@/hooks/api/team-management/team.query";

interface Permission {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  label: string;
  type: 'UNIVERSITY_REPRESENTATIVE' | 'DEPARTMENT_REPRESENTATIVE' | 'BOTH';
}

interface DepartmentMember {
  id: string; // Changed from number to string to match your department page
  name: string;
  email: string;
  permissions: Permission[];
  departmentId?: string; // Added to match your department page interface
}

interface DepartmentPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: DepartmentMember | null;
  onUpdatePermissions: (permissions: Permission[]) => void;
}

export const DepartmentPermissionsDialog = ({
  open,
  onOpenChange,
  member,
  onUpdatePermissions,
}: DepartmentPermissionsDialogProps) => {
  const { data: allPermissions, isLoading: isLoadingPermissions } = useGetPermissionList();
  
  // State to track selected permission IDs
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);

  // Filter permissions for department representative (DEPARTMENT_REPRESENTATIVE and BOTH)
  const availablePermissions: Permission[] = allPermissions
    ? allPermissions.filter(
        (perm: Permission) =>
          perm.type === "DEPARTMENT_REPRESENTATIVE" || perm.type === "BOTH"
      )
    : [];

  // Group permissions by label
  const groupedPermissions: { [label: string]: Permission[] } = {};
  availablePermissions.forEach((perm) => {
    if (!groupedPermissions[perm.label]) {
      groupedPermissions[perm.label] = [];
    }
    groupedPermissions[perm.label].push(perm);
  });

  // Initialize selected permissions when member changes
  useEffect(() => {
    if (member && member.permissions) {
      const memberPermissionIds = new Set(member.permissions.map(p => p.id));
      setSelectedPermissionIds(memberPermissionIds);
    } else {
      setSelectedPermissionIds(new Set());
    }
    // Reset editing state when member changes
    setIsEditing(false);
  }, [member]);

  // Reset editing state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    // Convert selected permission IDs back to Permission objects
    const selectedPermissions = availablePermissions.filter(perm => 
      selectedPermissionIds.has(perm.id)
    );
    
    onUpdatePermissions(selectedPermissions);
    setIsEditing(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset to original permissions
    if (member && member.permissions) {
      const memberPermissionIds = new Set(member.permissions.map(p => p.id));
      setSelectedPermissionIds(memberPermissionIds);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  if (!member) return null;

  if (isLoadingPermissions) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px]">
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading permissions...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Permissions for {member.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            {/* Member Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Member Information</h3>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Name:</span> {member.name}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {member.email}</p>
                {member.departmentId && (
                  <p className="text-sm"><span className="font-medium">Department ID:</span> {member.departmentId}</p>
                )}
              </div>
            </div>

            {/* Display Current Permissions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#111418] mb-3">
                Current Permissions ({member.permissions?.length || 0})
              </h3>
              {member.permissions && member.permissions.length > 0 ? (
                <div className="space-y-2">
                  {member.permissions.map((perm) => (
                    <div key={perm.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <span className="font-medium text-[#111418]">{perm.name}</span>
                        <span className="text-sm text-gray-600 ml-2">({perm.label})</span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {perm.type.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No permissions assigned</p>
              )}
            </div>

            {/* Edit Permissions Section */}
            {isEditing && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-[#111418] mb-3">Edit Permissions</h3>
                {Object.keys(groupedPermissions).length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    No permissions available for department representatives
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(([label, perms]) => (
                      <div key={label} className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium text-[#111418] mb-3">{label}</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {perms.map((perm) => (
                            <div key={perm.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={perm.id}
                                checked={selectedPermissionIds.has(perm.id)}
                                onCheckedChange={() => handlePermissionToggle(perm.id)}
                              />
                              <label
                                htmlFor={perm.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                              >
                                {perm.name}
                              </label>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {perm.type.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {!isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-[#0c77f2] hover:bg-[#0a5cc7] text-white"
              >
                Edit Permissions
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#198754] hover:bg-[#198754]/90 text-white"
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
