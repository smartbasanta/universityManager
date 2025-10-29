"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MentorTabs } from "./components/mentor-tabs";
import { MentorSection } from "./components/mentor-section";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllMentors, useSendInvitation, useGetDepartments } from "@/hooks/api/mentors/mentors.query";
import ProtectComponent from "@/middleware/protectComponent";
import { permissionType, roleType } from "@/types";

export default function MentorDashboard() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as "awaiting-approval" | "live" | null;

  const [activeTab, setActiveTab] = useState<"awaiting-approval" | "live">(
    tabParam || "awaiting-approval"
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    departmentId: "",
  });

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ["awaiting-approval", "live"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Fetch all mentors and departments
  const { data: allMentors, isLoading: isMentorsLoading, error: mentorsError } = useGetAllMentors();
  const { data: departments, isLoading: isDepartmentsLoading } = useGetDepartments();

  const { mutate: sendInvitation, isPending: isSending } = useSendInvitation();

  // Filter mentors by status on frontend
  const waitingApprovalMentors = allMentors?.filter((mentor: any) => mentor.status === 'WAITING_APPROVAL') || [];
  const activeMentors = allMentors?.filter((mentor: any) => mentor.status === 'Active') || [];

  // Transform API data to match component structure
  const transformApiData = (apiData: any[]) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((mentor: any) => {
      // Format the created date
      const createdDate = new Date(mentor.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Get department name
      const departmentName = mentor.department?.dept_name || 'Unknown Department';

      return {
        id: mentor.id,
        title: mentor.name, // Display mentor's name
        meta: `Created at: ${createdDate} • ${departmentName}`, // Format: "Created at: Jul 4, 2025 • Physics"
      };
    });
  };

  // Prepare data for each tab
  const awaitingApprovalItems = transformApiData(waitingApprovalMentors);
  const liveItems = transformApiData(activeMentors);

  // Get current tab data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case "awaiting-approval":
        return { data: awaitingApprovalItems, isLoading: isMentorsLoading, error: mentorsError };
      case "live":
        return { data: liveItems, isLoading: isMentorsLoading, error: mentorsError };
      default:
        return { data: [], isLoading: false, error: null };
    }
  };

  const { data: currentData, isLoading: currentLoading, error: currentError } = getCurrentTabData();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      name: formData.fullName,
      email: formData.email,
      departmentId: formData.departmentId,
    };

    sendInvitation(payload, {
      onSuccess: () => {
        setFormData({
          fullName: "",
          email: "",
          departmentId: "",
        });
        setIsDialogOpen(false);
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      departmentId: "",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col min-h-[90vh] pb-16 relative">
      <MentorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Loading State */}
      {currentLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading mentors...</div>
        </div>
      )}

      {/* Error State */}
      {currentError && (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error loading mentors: {currentError.message}</div>
        </div>
      )}

      {/* Content */}
      {!currentLoading && !currentError && (
        <>
          {activeTab === "awaiting-approval" && (
            <MentorSection
              title="Awaiting Approval"
              status="awaiting-approval"
              items={currentData}
            />
          )}
          {activeTab === "live" && (
            <MentorSection
              title="Live"
              status="live"
              items={currentData}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!currentLoading && !currentError && currentData.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">No {activeTab} mentors found</div>
        </div>
      )}

      {/* Add New Mentor Dialog */}
      <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.ADD_MENTOR_IN_RESIDENCE]}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="absolute bottom-0 right-0">Add New Mentor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Mentor</DialogTitle>
              <DialogDescription>
                Enter the mentor&apos;s information to send them an invitation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className="col-span-3"
                />
              </div>
              <ProtectComponent requiredRoles={[roleType.UNIVERSITY, roleType.UNIVERSITY_STAFF, roleType.INSTITUTION, roleType.DEPARTMENT_STAFF, roleType.INSTITUTION_STAFF]} requiredPermission={[permissionType.ADD_JOB]}>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("departmentId", value)} value={formData.departmentId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {isDepartmentsLoading ? (
                        <SelectItem value="loading" disabled>Loading departments...</SelectItem>
                      ) : (
                        departments?.map((dept: any) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.dept_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </ProtectComponent>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSending || !formData.fullName.trim() || !formData.email.trim()}
              >
                {isSending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ProtectComponent>

    </div>
  );
}
