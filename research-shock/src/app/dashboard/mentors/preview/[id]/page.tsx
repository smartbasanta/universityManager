"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Building, Award, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function MentorPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mentorName = searchParams.get("mentor");

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [changeRequest, setChangeRequest] = useState("");

  // Mock mentor data - in real app, you'd fetch this based on mentor ID
  const mentorData = {
    fullName: mentorName || "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 123-4567",
    department: "Software Engineering",
    position: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    experience: "8 years",
    education: "MS Computer Science, Stanford University",
    specialties: [
      "Full Stack Development",
      "React",
      "Node.js",
      "System Design",
    ],
    bio: "Passionate software engineer with 8+ years of experience in full-stack development. I love mentoring junior developers and helping them grow their careers in tech. My expertise includes modern web technologies, system design, and agile development practices.",
    linkedIn: "https://linkedin.com/in/jameswilson",
    portfolio: "https://jameswilson.dev",
    availability: "Weekends and evenings",
    menteePreference: "Junior to Mid-level developers",
    applicationDate: "2 days ago",
    documents: [
      { name: "Resume.pdf", size: "245 KB" },
      { name: "Cover_Letter.pdf", size: "128 KB" },
      { name: "Portfolio_Screenshots.pdf", size: "892 KB" },
    ],
  };

  const handleApprove = () => {
    console.log("Mentor approved:", mentorData.fullName);
    // Add your approval logic here
    router.push("/dashboard/mentors");
  };

  const handleReject = () => {
    console.log(
      "Mentor rejected:",
      mentorData.fullName,
      "Reason:",
      rejectReason
    );
    // Add your rejection logic here
    setShowRejectDialog(false);
    setRejectReason("");
    router.push("/dashboard/mentors");
  };

  const handleChangeRequest = () => {
    console.log(
      "Change requested for:",
      mentorData.fullName,
      "Request:",
      changeRequest
    );
    // Add your change request logic here
    setShowChangeDialog(false);
    setChangeRequest("");
    router.push("/dashboard/mentors");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mentor Application Review
            </h1>
            <p className="text-gray-600">
              Review and approve mentor application
            </p>
          </div>
        </div>

        {/* Mentor Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-gray-900">{mentorData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900">{mentorData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900">{mentorData.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Department
                    </label>
                    <p className="text-gray-900">{mentorData.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Position
                    </label>
                    <p className="text-gray-900">{mentorData.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Company
                    </label>
                    <p className="text-gray-900">{mentorData.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Experience
                    </label>
                    <p className="text-gray-900">{mentorData.experience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Education
                    </label>
                    <p className="text-gray-900">{mentorData.education}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {mentorData.bio}
                </p>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentorData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Submitted
                    </label>
                    <p className="text-gray-900">
                      {mentorData.applicationDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Awaiting Approval
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentoring Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Mentoring Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Availability
                  </label>
                  <p className="text-gray-900">{mentorData.availability}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Mentee Preference
                  </label>
                  <p className="text-gray-900">{mentorData.menteePreference}</p>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href={mentorData.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  LinkedIn Profile
                </a>
                <a
                  href={mentorData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  Portfolio Website
                </a>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submitted Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mentorData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{doc.name}</span>
                      <span className="text-xs text-gray-500">{doc.size}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowChangeDialog(true)}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            Ask to Change Details
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowRejectDialog(true)}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Reject
          </Button>
        </div>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this mentor application.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Request Dialog */}
        <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Changes</DialogTitle>
              <DialogDescription>
                Specify what changes are needed in the application.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter change request details..."
                value={changeRequest}
                onChange={(e) => setChangeRequest(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowChangeDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleChangeRequest}>Send Change Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
