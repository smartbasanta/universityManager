"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Award,
  FileText,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AmbassadorPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const ambassadorId = params.id as string;
  console.log(ambassadorId);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [changeRequest, setChangeRequest] = useState("");

  // Mock ambassador data - in real app, you'd fetch this based on ambassador ID
  const ambassadorData = {
    fullName: "David Kim",
    email: "david.kim@harvard.edu",
    phone: "+1 (555) 987-6543",
    university: "Harvard University",
    major: "Computer Science",
    year: "Junior (3rd Year)",
    gpa: "3.85",
    graduationDate: "May 2026",
    location: "Cambridge, MA",
    bio: "Passionate computer science student with a strong interest in artificial intelligence and machine learning. I love connecting with fellow students and helping them navigate their academic journey. As a student ambassador, I aim to create inclusive events that bring together diverse perspectives and foster collaboration.",
    skills: [
      "Event Planning",
      "Public Speaking",
      "Social Media",
      "Leadership",
      "Programming",
    ],
    languages: [
      "English (Native)",
      "Korean (Fluent)",
      "Spanish (Conversational)",
    ],
    experience: [
      "Student Government Representative (2 years)",
      "Peer Tutor for CS courses",
      "Volunteer at local coding bootcamp",
    ],
    socialMedia: {
      linkedin: "https://linkedin.com/in/davidkim",
      instagram: "@davidkim_harvard",
      twitter: "@davidkim_cs",
    },
    availability: "Weekends and evenings after 6 PM",
    eventPreferences: [
      "Tech talks",
      "Networking events",
      "Study groups",
      "Career workshops",
    ],
    applicationDate: "2 days ago",
    documents: [
      { name: "Transcript.pdf", size: "312 KB" },
      { name: "Recommendation_Letter.pdf", size: "156 KB" },
      { name: "Portfolio.pdf", size: "1.2 MB" },
      { name: "Event_Planning_Experience.pdf", size: "445 KB" },
    ],
    previousEvents: [
      { name: "CS Career Fair", role: "Organizer", date: "March 2024" },
      { name: "AI Workshop Series", role: "Co-host", date: "February 2024" },
      {
        name: "Freshman Welcome Event",
        role: "Volunteer",
        date: "September 2023",
      },
    ],
  };

  const handleApprove = () => {
    console.log("Ambassador approved:", ambassadorData.fullName);
    router.push("/dashboard/ambassadors");
  };

  const handleReject = () => {
    console.log(
      "Ambassador rejected:",
      ambassadorData.fullName,
      "Reason:",
      rejectReason
    );
    setShowRejectDialog(false);
    setRejectReason("");
    router.push("/dashboard/ambassadors");
  };

  const handleChangeRequest = () => {
    console.log(
      "Change requested for:",
      ambassadorData.fullName,
      "Request:",
      changeRequest
    );
    setShowChangeDialog(false);
    setChangeRequest("");
    router.push("/dashboard/ambassadors");
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
              Student Ambassador Application Review
            </h1>
            <p className="text-gray-600">
              Review and approve ambassador application
            </p>
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

        {/* Ambassador Details */}
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
                    <p className="text-gray-900">{ambassadorData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900">{ambassadorData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900">{ambassadorData.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Location
                    </label>
                    <p className="text-gray-900">{ambassadorData.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      University
                    </label>
                    <p className="text-gray-900">{ambassadorData.university}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Major
                    </label>
                    <p className="text-gray-900">{ambassadorData.major}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Year
                    </label>
                    <p className="text-gray-900">{ambassadorData.year}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      GPA
                    </label>
                    <p className="text-gray-900">{ambassadorData.gpa}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Expected Graduation
                    </label>
                    <p className="text-gray-900">
                      {ambassadorData.graduationDate}
                    </p>
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
                  {ambassadorData.bio}
                </p>
              </CardContent>
            </Card>

            {/* Skills & Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills & Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ambassadorData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ambassadorData.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Previous Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {ambassadorData.experience.map((exp, index) => (
                    <li key={index} className="text-gray-700">
                      • {exp}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Previous Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Previous Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ambassadorData.previousEvents.map((event, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-200 pl-4"
                    >
                      <h4 className="font-medium text-gray-900">
                        {event.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {event.role} • {event.date}
                      </p>
                    </div>
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
                      {ambassadorData.applicationDate}
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

            {/* Ambassador Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Ambassador Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Availability
                  </label>
                  <p className="text-gray-900">{ambassadorData.availability}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Event Preferences
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ambassadorData.eventPreferences.map((pref, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href={ambassadorData.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  LinkedIn Profile
                </a>
                <p className="text-gray-700">
                  Instagram: {ambassadorData.socialMedia.instagram}
                </p>
                <p className="text-gray-700">
                  Twitter: {ambassadorData.socialMedia.twitter}
                </p>
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
                  {ambassadorData.documents.map((doc, index) => (
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

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this ambassador
                application.
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
