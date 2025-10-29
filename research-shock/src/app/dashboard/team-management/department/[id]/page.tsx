"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, ArrowLeft, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepartmentPermissionsDialog } from "../../components/department-permissions-dialog";
import { AddDepartmentRepresentativeDialog } from "../../components/add-department-representative-dialog";
import { useGetDepartments, useGetDepartmentStaff, useCreateDepartmentStaff } from "@/hooks/api/team-management/team.query";

interface Permission {
  id: string;
  name: string;
  label: string;
  type: 'UNIVERSITY_REPRESENTATIVE' | 'DEPARTMENT_REPRESENTATIVE' | 'BOTH';
}

interface DepartmentMember {
  id: string;
  name: string;
  email: string;
  permissions: Permission[];
  departmentId?: string;
}

export default function DepartmentPage() {
  const params = useParams();
  const departmentId = params.id as string;

  // Fetch departments and department staff
  const { data: departments, isLoading: isDepartmentsLoading } = useGetDepartments();
  const { data: departmentStaffData, isLoading: isStaffLoading, error: staffError } = useGetDepartmentStaff();
  const createDepartmentStaffMutation = useCreateDepartmentStaff();

  const [selectedMember, setSelectedMember] = useState<DepartmentMember | null>(null);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isAddRepresentativeOpen, setIsAddRepresentativeOpen] = useState(false);

  // Transform API data to match component interface and filter by department
  const members: DepartmentMember[] = departmentStaffData
    ?.filter((staffItem: any) => {
      // Filter staff members by department ID
      return staffItem.departmentId === departmentId || 
             staffItem.staff?.departmentId === departmentId ||
             staffItem.deptId === departmentId;
    })
    ?.map((staffItem: any) => ({
      id: staffItem.id,
      name: staffItem.staff?.name || "Unknown",
      email: staffItem.email,
      departmentId: staffItem.departmentId || staffItem.staff?.departmentId || staffItem.deptId,
      permissions: staffItem.staff?.staffPermission?.map((perm: any) => ({
        id: perm.id,
        name: perm.name,
        label: perm.label,
        type: perm.type,
      })) || [],
    })) || [];

  // Find the current department from the fetched data
  const currentDepartment = departments?.find((dept: any) => dept.id === departmentId);
  const departmentName = currentDepartment?.dept_name || "Unknown Department";

  const handleViewPermissions = (member: DepartmentMember) => {
    setSelectedMember(member);
    setIsPermissionsOpen(true);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete API call
    console.log("Delete member:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit member:", id);
    // TODO: Implement edit functionality
  };

  const handleAddRepresentative = (data: {
    name: string;
    email: string;
    permissions: Permission[];
  }) => {
    const permissionIds = data.permissions.map(p => p.id);
    createDepartmentStaffMutation.mutate({
      name: data.name,
      email: data.email,
      permissionIds,
      deptId: departmentId,
    });
  };

  const handleUpdatePermissions = (updatedPermissions: Permission[]) => {
    if (selectedMember) {
      // TODO: Implement update permissions API call
      console.log("Updated permissions for member:", selectedMember.id, updatedPermissions);
    }
  };

  // Loading state
  if (isDepartmentsLoading || isStaffLoading) {
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
          <div className="text-red-500">Error loading department staff. Please try again.</div>
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
          <div>
            <h1 className="text-[#111418] text-3xl font-bold leading-tight">
              {departmentName} - Representatives
            </h1>
          </div>
        </div>
        <Button
          onClick={() => setIsAddRepresentativeOpen(true)}
          className="bg-[#0c77f2] hover:bg-[#0a5cc7] text-white flex items-center gap-2"
          disabled={createDepartmentStaffMutation.isPending}
        >
          <Plus className="w-4 h-4" />
          {createDepartmentStaffMutation.isPending ? "Adding..." : "Add Department Representative"}
        </Button>
      </div>

      {/* Department Members Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-[#111418]">
            {departmentName} Representatives ({members.length})
          </h2>
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
            {members.map((member, index) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="text-[#111418] font-medium">
                  {member.name}
                </TableCell>
                <TableCell className="text-[#60758a]">
                  {member.email}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPermissions(member)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Permissions ({member.permissions.length})
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(member.id)}
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
        {members.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">No representatives found for this department</div>
          </div>
        )}
      </div>

      {/* Department Permissions Dialog */}
      <DepartmentPermissionsDialog
        open={isPermissionsOpen}
        onOpenChange={setIsPermissionsOpen}
        member={selectedMember}
        onUpdatePermissions={handleUpdatePermissions}
      />

      {/* Add Department Representative Dialog */}
      <AddDepartmentRepresentativeDialog
        open={isAddRepresentativeOpen}
        onOpenChange={setIsAddRepresentativeOpen}
        departmentId={departmentId}
        onAddRepresentative={handleAddRepresentative}
      />
    </div>
  );
}
