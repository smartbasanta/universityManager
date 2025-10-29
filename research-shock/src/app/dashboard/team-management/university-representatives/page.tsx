"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepartmentPermissionsDialog } from "../components/department-permissions-dialog";
import { AddUniversityRepresentativeDialog } from "../components/add-university-representative-dialog";
import { useGetUniversityStaff, useCreateUniversityStaff, useGetInstitutionStaff } from "@/hooks/api/team-management/team.query";
import { useAuthStore } from "@/stores";

interface Permission {
  id: string;
  name: string;
  label: string;
  type: 'UNIVERSITY_REPRESENTATIVE' | 'DEPARTMENT_REPRESENTATIVE' | 'BOTH';
}

interface Representative {
  id: string;
  name: string;
  email: string;
  permissions: Permission[];
}

export default function UniversityRepresentatives() {
  // Fetch university staff
  const { role } = useAuthStore();
  let universityStaffData;
  let isStaffLoading;
  let staffError;

  if (role?.toString().includes('University')) {
    const { data, isLoading, error } = useGetUniversityStaff();
    universityStaffData = data;
    isStaffLoading = isLoading;
    staffError = error;
  } else {
    const { data, isLoading, error } = useGetInstitutionStaff();
    universityStaffData = data;
    isStaffLoading = isLoading;
    staffError = error;
  }
  const createUniversityStaffMutation = useCreateUniversityStaff();

  const [selectedMember, setSelectedMember] = useState<Representative | null>(null);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isAddRepresentativeOpen, setIsAddRepresentativeOpen] = useState(false);

  // Transform API data to match component interface
  const representatives: Representative[] = universityStaffData?.map((staffItem: any) => ({
    id: staffItem.id,
    name: staffItem.staff?.name || "Unknown",
    email: staffItem.email,
    permissions: staffItem.staff?.staffPermission?.map((perm: any) => ({
      id: perm.id,
      name: perm.name,
      label: perm.label,
      type: perm.type,
    })) || [],
  })) || [];

  const handleViewPermissions = (representative: Representative) => {
    setSelectedMember(representative);
    setIsPermissionsOpen(true);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete API call
    console.log("Delete representative:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit representative:", id);
    // TODO: Implement edit functionality
  };

  const handleAddRepresentative = (data: {
    name: string;
    email: string;
    permissions: Permission[];
  }) => {
    const permissionIds = data.permissions.map(p => p.id);
    createUniversityStaffMutation.mutate({
      name: data.name,
      email: data.email,
      permissionIds,
      status: role?.toString().includes('University') ? "university_staff" : "institution_staff",
    });
  };

  const handleUpdatePermissions = (updatedPermissions: Permission[]) => {
    if (selectedMember) {
      // TODO: Implement update permissions API call
      console.log("Updated permissions for representative:", selectedMember.id, updatedPermissions);
    }
  };

  // Loading state
  if (isStaffLoading) {
    return (
      <div className="flex flex-col min-h-[90vh] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (staffError) {
    return (
      <div className="flex flex-col min-h-[90vh] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading university staff. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[90vh] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/team-management">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-[#111418] text-3xl font-bold leading-tight">
            {role?.toString().includes('University') ? "University Representatives" : "Company Representatives"}
          </h1>
        </div>
        <Button
          onClick={() => setIsAddRepresentativeOpen(true)}
          className="bg-[#0c77f2] hover:bg-[#0a5cc7] text-white flex items-center gap-2"
          disabled={createUniversityStaffMutation.isPending}
        >
          <Plus className="w-4 h-4" />
          {createUniversityStaffMutation.isPending ? "Adding..." : `${role?.toString().includes('University') ? "Add University Representative" : "Add Company Representative"}`}
        </Button>
      </div>

      {/* Representatives Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-[#111418]">Representatives</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {representatives.map((representative, index) => (
              <TableRow key={representative.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="text-[#111418] font-medium">
                  {representative.name}
                </TableCell>
                <TableCell className="text-[#60758a]">
                  {representative.email}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPermissions(representative)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Permissions ({representative.permissions.length})
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(representative.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(representative.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {representatives.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">No university representatives found</div>
          </div>
        )}
      </div>

      {/* Permissions Dialog */}
      <DepartmentPermissionsDialog
        open={isPermissionsOpen}
        onOpenChange={setIsPermissionsOpen}
        // @ts-ignore
        member={selectedMember}
        onUpdatePermissions={handleUpdatePermissions}
      />

      {/* Add University Representative Dialog */}
      <AddUniversityRepresentativeDialog
        open={isAddRepresentativeOpen}
        onOpenChange={setIsAddRepresentativeOpen}
        onAddRepresentative={handleAddRepresentative}
      />
    </div>
  );
}
