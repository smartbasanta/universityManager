/* app/dashboard/manage-meeting/page.tsx */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Users,
  User,
  MessageSquare,
  FileText,
  Clock,
  Check,
  X,
  Phone,
} from "lucide-react";

import { axiosPrivateInstance } from "@/api/axois-config";
import { useAuthStore } from "@/stores/useAuth";
import { roleType } from "@/types";

interface Booking {
  id: string;
  slotId: string;
  createdAt: string;
  updatedAt: string;
  currentOccupation: string;
  discussionTopic: string;
  additionalInfo: string;
  attended: boolean;
  student: any;
  status?: "Acknowledged" | "Booked" | "Cancelled";
}

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ManageMeetingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { role } = useAuthStore();
  const isMentorOrAmbassador =
    role === roleType.MENTOR || role === roleType.STUDENT_AMBASSADOR;

  if (!isMentorOrAmbassador) {
    if (typeof window !== "undefined") router.replace("/dashboard");
    return null;
  }

  const { data: bookings = [], isLoading, error } = useQuery<Booking[]>({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data } = await axiosPrivateInstance.get("/booking/booking-for-admin");
      return data;
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      await axiosPrivateInstance.patch(`/booking/change-status/${bookingId}`, {
        status
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      setSelected(null);
      
      if (variables.status === "Acknowledged") {
        toast.success("Meeting request accepted and acknowledged successfully!");
      } else if (variables.status === "Cancelled") {
        toast.success("Meeting request rejected successfully!");
      }
    },
    onError: (error) => {
      console.error('Status change failed:', error);
      toast.error("Failed to update meeting status. Please try again.");
    }
  });

  const [selected, setSelected] = useState<Booking | null>(null);
  
  // Filter: "Booked" = New requests awaiting ambassador action
  const pendingRequests = bookings.filter(booking => 
    booking.status === "Booked"
  );
  
  const acknowledgedRequests = bookings.filter(booking => 
    booking.status === "Acknowledged"
  );
  
  const allRequests = [...pendingRequests, ...acknowledgedRequests];

  // Accept Meeting - changes Booked → Acknowledged
  const handleAcceptMeeting = () => {
    if (selected && selected.status === "Booked") {
      changeStatusMutation.mutate({ 
        bookingId: selected.id, 
        status: "Acknowledged" 
      });
    }
  };

  // Reject Meeting - changes Booked → Cancelled
  const handleRejectMeeting = () => {
    if (selected && selected.status === "Booked") {
      changeStatusMutation.mutate({ 
        bookingId: selected.id, 
        status: "Cancelled" 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        Loading meeting requests…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-600">
        Failed to load requests. Please refresh.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Meeting Requests</h1>
        <div className="text-sm text-gray-600">
          {pendingRequests.length} pending, {acknowledgedRequests.length} acknowledged
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="mb-4 font-semibold">Meeting Requests</h2>

          {allRequests.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded border p-8 text-gray-500">
              <Clock className="h-10 w-10" />
              No meeting requests
            </div>
          ) : (
            <ul className="space-y-3">
              {allRequests.map((b) => (
                <li
                  key={b.id}
                  onClick={() => setSelected(b)}
                  className={`cursor-pointer rounded border p-4 transition ${
                    selected?.id === b.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      <Users className="h-4 w-4 text-gray-500" />
                      Meeting request
                      
                    </div>
                    
                    <span className="text-xs text-gray-500">
                      {formatDateTime(b.createdAt)}
                    </span>
                  </div>
                   <span className="text-xs text-gray-700">
                      {b.student?.name}
                    </span>

                  <p className="mt-2 text-sm line-clamp-2 text-gray-700">
                    {b.discussionTopic}
                  </p>
                  
                  <div className="mt-2 flex gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      b.attended 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {b.attended ? 'Attended' : 'Not Attended'}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      b.status === 'Acknowledged' 
                        ? 'bg-green-100 text-green-800'
                        : b.status === 'Booked'
                        ? 'bg-blue-100 text-blue-800'
                        : b.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {b.status === 'Booked' ? 'Pending Action' : b.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-4 font-semibold">Request Details</h2>

          {!selected ? (
            <div className="flex flex-col items-center gap-2 rounded border p-8 text-gray-500">
              <MessageSquare className="h-10 w-10" />
              Select a request to view details
            </div>
          ) : (
            
            <div className="space-y-6 rounded border border-gray-200 bg-white p-6">
              
              <section className="space-y-4 text-sm">
                  <div>
                    <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
                      <User className="h-4 w-4" /> Student Name
                    </label>
                    <div className="rounded border bg-gray-50 p-3 text-gray-800">
                          {selected.student?.name}
                        </div>
                    </div>
                    <div>
                    <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
                      <Phone className="h-4 w-4" /> Contact
                    </label>
                      <div className="rounded border bg-gray-50 p-3 text-gray-800">
                        {selected.student?.phone}
                        </div>
                    </div>
                  <div>
                 
                  <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
                    <User className="h-4 w-4" /> Current occupation
                  </label>
                  <div className="rounded border bg-gray-50 p-3 text-gray-800">
                    {selected.currentOccupation}
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
                    <MessageSquare className="h-4 w-4" /> Discussion topic
                  </label>
                  <div className="rounded border bg-gray-50 p-3 text-gray-800">
                    {selected.discussionTopic}
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
                    <FileText className="h-4 w-4" /> Additional information
                  </label>
                  <div className="rounded border bg-gray-50 p-3 min-h-[80px] text-gray-800">
                    {selected.additionalInfo || "No additional information provided"}
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
                    <Clock className="h-4 w-4" /> Request submitted
                  </label>
                  <div className="rounded border bg-gray-50 p-3 text-gray-800">
                    {formatDateTime(selected.createdAt)}
                  </div>
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
                    Status
                  </label>
                  <div className="rounded border bg-gray-50 p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selected.status === 'Acknowledged' 
                        ? 'bg-green-100 text-green-800'
                        : selected.status === 'Booked'
                        ? 'bg-blue-100 text-blue-800'
                        : selected.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selected.status === 'Booked' ? 'Pending Action' : selected.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Show Accept/Reject buttons for "Booked" status */}
              {selected.status === "Booked" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleAcceptMeeting}
                    disabled={changeStatusMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 rounded bg-green-600 px-4 py-3 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                  >
                    {changeStatusMutation.isPending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Accept Meeting
                  </button>

                  <button
                    onClick={handleRejectMeeting}
                    disabled={changeStatusMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 rounded bg-red-600 px-4 py-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                  >
                    {changeStatusMutation.isPending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Reject Meeting
                  </button>
                </div>
              )}

              {/* Show confirmation message for Acknowledged meetings */}
              {selected.status === "Acknowledged" && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-medium">
                      ✅ Meeting has been acknowledged and booked successfully!
                    </p>
                  </div>
                </div>
              )}

              {/* Show message for Cancelled meetings */}
              {selected.status === "Cancelled" && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-800 font-medium">
                      ❌ This meeting has been rejected/cancelled.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
