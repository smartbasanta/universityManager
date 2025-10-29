"use client";

import { useState } from "react";
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
import { useAddDepartment } from "@/hooks/api/team-management/team.query";

interface AddDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDepartment: (name: string) => void;
}

export const AddDepartmentDialog = ({
  open,
  onOpenChange,
  onAddDepartment,
}: AddDepartmentDialogProps) => {
  const [departmentName, setDepartmentName] = useState("");
  const { mutate: addDepartment, isPending: isAdding } = useAddDepartment();

  const handleSubmit = () => {
    if (!departmentName.trim()) return;

    addDepartment(
      { dept_name: departmentName.trim() },
      {
        onSuccess: () => {
          onAddDepartment(departmentName.trim());
          setDepartmentName("");
          onOpenChange(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setDepartmentName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Enter the department name to add it to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="departmentName" className="text-right">
              Department Name *
            </Label>
            <Input
              id="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name"
              className="col-span-3"
              disabled={isAdding}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isAdding}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isAdding || !departmentName.trim()}
            className="bg-[#0c77f2] hover:bg-[#0a5cc7] text-white"
          >
            {isAdding ? "Adding..." : "Add Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
