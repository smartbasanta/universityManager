"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateUniversityStaff, useGetPermissionList } from "@/hooks/api/team-management/team.query";
import { useAuthStore } from "@/stores";

interface Permission {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  label: string;
  type: 'UNIVERSITY_REPRESENTATIVE' | 'DEPARTMENT_REPRESENTATIVE' | 'BOTH';
}

interface AddUniversityRepresentativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRepresentative?: (data: {
    name: string;
    email: string;
    permissions: Permission[];
  }) => void;
}

export const AddUniversityRepresentativeDialog = ({
  open,
  onOpenChange,
  onAddRepresentative,
}: AddUniversityRepresentativeDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const {role} = useAuthStore();

  const { data: permissionList, isLoading: isLoadingPermissions } = useGetPermissionList();
  const createUniversityStaffMutation = useCreateUniversityStaff(); // Updated hook

  // Filter permissions for university representative (UNIVERSITY_REPRESENTATIVE and BOTH)
  const filteredPermissions: Permission[] = permissionList
    ? permissionList.filter(
        (perm: Permission) =>
          perm.type === "UNIVERSITY_REPRESENTATIVE" || perm.type === "BOTH"
      )
    : [];

  // Group permissions by label
  const groupedPermissions: { [label: string]: Permission[] } = {};
  filteredPermissions.forEach((perm) => {
    if (!groupedPermissions[perm.label]) {
      groupedPermissions[perm.label] = [];
    }
    groupedPermissions[perm.label].push(perm);
  });

  // State to track selected permission IDs
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setFormData({ name: "", email: "" });
      setSelectedPermissionIds(new Set());
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async () => {
    if (formData.name.trim() && formData.email.trim()) {
      try {
        await createUniversityStaffMutation.mutateAsync({
          name: formData.name.trim(),
          email: formData.email.trim(),
          permissionIds: Array.from(selectedPermissionIds),
          status: role?.toString().includes('University') ? "university_staff" : "institution_staff",
        });

        if (onAddRepresentative) {
          onAddRepresentative({
            name: formData.name.trim(),
            email: formData.email.trim(),
            permissions: filteredPermissions.filter((perm) =>
              selectedPermissionIds.has(perm.id)
            ),
          });
        }

        onOpenChange(false);
        setFormData({ name: "", email: "" });
        setSelectedPermissionIds(new Set());
      } catch (error) {
        console.error("Failed to create university staff:", error);
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({ name: "", email: "" });
    setSelectedPermissionIds(new Set());
  };

  if (isLoadingPermissions) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading permissions...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add {role?.toString().includes('University') ? "University Representative" : "Company Representative"}</DialogTitle>
          <DialogDescription>
            Enter the representative's information and set their permissions.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <div className="space-y-6 pb-4">
            {/* Representative Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#111418]">Representative Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representativeName">Representative Name</Label>
                  <Input
                    id="representativeName"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#111418]">Permissions</h3>

              {Object.keys(groupedPermissions).length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  No permissions available for university representatives
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
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {perm.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-[#0c77f2] hover:bg-[#0a5cc7] text-white"
            disabled={!formData.name.trim() || !formData.email.trim() || createUniversityStaffMutation.isPending}
          >
            {createUniversityStaffMutation.isPending ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
