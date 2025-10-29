"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Building2, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { AddDepartmentDialog } from "./components/add-department-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useGetDepartments, useGetDepartmentStaff, useGetUniversityStaff } from "@/hooks/api/team-management/team.query";
import { useAuthStore } from "@/stores";

interface Department {
  id: string;
  createdAt: string;
  updatedAt: string;
  dept_name: string;
}

export default function TeamManagementDashboard() {
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const router = useRouter();

  // Fetch departments and staff data from API
  const { data: departments, isLoading: isDepartmentsLoading, error: departmentsError } = useGetDepartments();
  const { data: departmentStaff, isLoading: isDepartmentStaffLoading } = useGetDepartmentStaff();
  const { data: universityStaff, isLoading: isUniversityStaffLoading } = useGetUniversityStaff();
  const { role } = useAuthStore();

  // Calculate staff counts for each department
  const getDepartmentStaffCount = (departmentId: string) => {
    if (!departmentStaff) return 0;

    // Filter department staff by department ID
    const departmentSpecificStaff = departmentStaff.filter((staffItem: any) => {
      return staffItem.departmentId === departmentId ||
        staffItem.staff?.departmentId === departmentId ||
        staffItem.deptId === departmentId;
    });

    return departmentSpecificStaff.length;
  };

  const getTotalUniversityStaffCount = () => {
    return universityStaff?.length || 0;
  };

  const getTotalDepartmentStaffCount = () => {
    return departmentStaff?.length || 0;
  };

  const handleAddDepartment = (name: string) => {
    // This will be handled by the AddDepartmentDialog component
    // After successful addition, the useGetDepartments hook will automatically refetch
    setIsAddDepartmentOpen(false);
  };

  const handleViewRepresentatives = (departmentId: string) => {
    router.push(`/dashboard/team-management/department/${departmentId}`);
  };

  const handleEditDepartment = (departmentId: string) => {
    // Handle edit department logic
    console.log("Edit department:", departmentId);
    // You can implement edit functionality here
  };

  return (
    <div className="flex flex-col min-h-[90vh] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#111418] text-3xl font-bold leading-tight">
          Team Management
        </h1>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsAddDepartmentOpen(true)}
            className="bg-[#0c77f2] hover:bg-[#0a5cc7] text-white flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Add Department
          </Button>
          <Link href="/dashboard/team-management/university-representatives">
            <Button className="bg-[#198754] hover:bg-[#198754]/90 text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              {role?.toString().includes('University') ? "University Representatives" : "Company Representatives"}
              {/* University Representatives */}
              {!isUniversityStaffLoading && (
                <span className="ml-1 bg-white text-[#198754] px-2 py-0.5 rounded-full text-xs font-medium">
                  {getTotalUniversityStaffCount()}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {isDepartmentsLoading ? "..." : departments?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{role?.toString().includes('University') ? "University Staff" : "Company Staff"}</p>
              <p className="text-2xl font-bold text-gray-900">
                {isUniversityStaffLoading ? "..." : getTotalUniversityStaffCount()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Department Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {isDepartmentStaffLoading ? "..." : getTotalDepartmentStaffCount()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-[#111418]">Departments</h2>
        </div>

        {/* Loading State */}
        {isDepartmentsLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading departments...</div>
          </div>
        )}

        {/* Error State */}
        {departmentsError && (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">
              Error loading departments. Please try again.
            </div>
          </div>
        )}

        {/* Table Content */}
        {!isDepartmentsLoading && !departmentsError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-40">Representatives</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments && departments.length > 0 ? (
                departments.map((department: Department) => (
                  <TableRow key={department.id}>
                    <TableCell className="text-[#111418] font-medium">
                      {department.dept_name}
                    </TableCell>
                    <TableCell className="text-[#60748a]">
                      {new Date(department.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRepresentatives(department.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Representatives
                        {!isDepartmentStaffLoading && (
                          <span className="ml-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                            {getDepartmentStaffCount(department.id)}
                          </span>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDepartment(department.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No departments found. Create your first department to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Department Dialog */}
      <AddDepartmentDialog
        open={isAddDepartmentOpen}
        onOpenChange={setIsAddDepartmentOpen}
        onAddDepartment={handleAddDepartment}
      />
    </div>
  );
}
