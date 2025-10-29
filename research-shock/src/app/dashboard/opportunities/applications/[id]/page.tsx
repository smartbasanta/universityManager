'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetApplications } from '@/hooks/api/opportunity-hub/opportunity.query';
import { useGetOpportunityById } from '@/hooks/api/opportunity-hub/opportunity.query';
import { PDFApplication } from '@/app/dashboard/opportunities/components/PDFApplication';

interface Student {
  id: string;
  name: string;
  address: string;
  photo: string;
  phone: string;
  date_of_birth: string;
}

interface Application {
  id: string;
  createdAt: string;
  student: Student;
  question: {
    id: string;
    label: string;
    type: string;
    required: boolean;
  };
  answer: string;
}

export default function OpportunityApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params.id as string;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  
  const { data: applicationsData, isLoading, error } = useGetApplications({
    opportunityId,
    page: currentPage,
    limit: 50
  });

  const { data: opportunity } = useGetOpportunityById(opportunityId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-800">Error Loading Applications</h3>
          <p className="text-red-700">Failed to fetch applications. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!applicationsData || applicationsData.data.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-md text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications</h3>
          <p className="text-gray-500">No applications have been submitted for this opportunity yet.</p>
        </div>
      </div>
    );
  }

  // Group applications by student
  const applicationsByStudent = applicationsData.data.reduce((acc, app) => {
    const studentId = app.student.id;
    if (!acc[studentId]) {
      acc[studentId] = {
        student: app.student,
        applications: []
      };
    }
    acc[studentId].applications.push(app);
    return acc;
  }, {} as Record<string, { student: Student; applications: Application[] }>);

  const students = Object.values(applicationsByStudent);

  const handleViewApplication = (student: Student) => {
    setSelectedStudent(student);
    setShowPDFModal(true);
  };

  // Placeholder functions for ZIP and CSV (non-functional for now)
  const handleDownloadZip = () => {
    console.log('ZIP download will be implemented later');
    // You can show a toast message here if you want
    // toast.info('ZIP download feature coming soon');
  };

  const handleDownloadCsv = () => {
    console.log('CSV download will be implemented later');
    // You can show a toast message here if you want
    // toast.info('CSV download feature coming soon');
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `Applied ${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `Applied ${diffInHours} hours ago`;
    } else {
      return `Applied ${diffInDays} days ago`;
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50" style={{fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3e7e8] px-10 py-3 mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#111418] hover:text-[#0d141c] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Opportunities
              </button>
           
            </header>

            {/* Title Section */}
            <div className="flex flex-col items-center text-center mb-6">
              <p className="text-[#111418] text-lg font-semibold">{opportunity?.title || 'Opportunity Applications'}</p>
            </div>

            {/* Applications Cards */}
            <div className="flex flex-col gap-4 mb-20">
              {students.map(({ student, applications }) => (
                <button
                  key={student.id}
                  onClick={() => handleViewApplication(student)}
                  className="group block w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-md text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[#111418] text-base font-medium truncate">{student.name}</p>
                      <p className="text-[#60758a] text-sm truncate">{formatDate(applications[0].createdAt)}</p>
                    </div>
                    <div className="shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 group-hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V4" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Fixed Download Buttons (Placeholder for ZIP/CSV, Functional PDF in modal) */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
              <button
                onClick={handleDownloadZip}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#095ec1] transition opacity-50 cursor-not-allowed"
                title="Coming soon"
              >
                Download ZIP File
              </button>
              <button
                onClick={handleDownloadCsv}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#095ec1] transition opacity-50 cursor-not-allowed"
                title="Coming soon"
              >
                Download CSV File
              </button>
            </div>

            {/* PDF Modal with Updated PDFApplication Component */}
            {showPDFModal && selectedStudent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Application - {selectedStudent.name}
                      </h3>
                      <button
                        onClick={() => setShowPDFModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Updated PDFApplication Component Integration */}
                    <PDFApplication
                      student={selectedStudent}
                      applications={applicationsByStudent[selectedStudent.id]?.applications || []}
                      opportunityTitle={opportunity?.title}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
