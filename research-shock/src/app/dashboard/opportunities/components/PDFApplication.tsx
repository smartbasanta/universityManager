'use client';

import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

interface PDFApplicationProps {
  student: Student;
  applications: Application[];
  opportunityTitle?: string;
}

export const PDFApplication: React.FC<PDFApplicationProps> = ({
  student,
  applications,
  opportunityTitle = 'Opportunity Application'
}) => {
  const answersByQuestionId = applications.reduce((acc, app) => {
    acc[app.question.id] = app.answer;
    return acc;
  }, {} as Record<string, string>);

  const questions = applications.map(app => app.question);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generatePDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    try {
      // Show loading state
      const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = 'Generating PDF...';
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean filename
      const cleanTitle = opportunityTitle.replace(/[^a-z0-9]/gi, '_');
      const cleanName = student.name.replace(/[^a-z0-9]/gi, '_');
      pdf.save(`${cleanName}_Application_${cleanTitle}.pdf`);

      // Reset button state
      if (button) {
        button.disabled = false;
        button.innerHTML = `
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        `;
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      // Reset button state on error
      const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = `
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        `;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
            <div className="mt-1 space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {student.address}
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {student.phone}
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1a3 3 0 006 0v-1m6 0a2 2 0 100-4H2a2 2 0 100 4v3a2 2 0 002 2h16a2 2 0 002-2v-3z" />
                </svg>
                DOB: {student.date_of_birth}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Submitted on</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(applications[0]?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Application Responses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Application Responses</h3>
            <button
              data-pdf-button
              onClick={generatePDF}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
          
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((question) => {
                const answer = answersByQuestionId[question.id] || '';
                
                return (
                  <div key={question.id} className="py-2">
                    <p className="text-gray-900">
                      <span className="font-semibold">{question.label}:</span>{' '}
                      <span className="text-gray-700">{answer || 'No answer provided'}</span>
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No application responses found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Hidden PDF Content */}
      <div id="pdf-content" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div style={{ width: '800px', padding: '40px', backgroundColor: 'white', fontFamily: 'Arial, sans-serif' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              {opportunityTitle}
            </h1>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#4b5563' }}>
              Application Form
            </h2>
          </div>

          {/* Student Information */}
          <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
              Applicant Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {student.name}</p>
                <p style={{ marginBottom: '8px' }}><strong>Address:</strong> {student.address}</p>
              </div>
              <div>
                <p style={{ marginBottom: '8px' }}><strong>Phone:</strong> {student.phone}</p>
                <p style={{ marginBottom: '8px' }}><strong>Date of Birth:</strong> {student.date_of_birth}</p>
              </div>
            </div>
            <p style={{ marginTop: '16px' }}>
              <strong>Application Submitted:</strong> {formatDate(applications[0]?.createdAt)}
            </p>
          </div>

          {/* Application Responses */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
              Application Responses
            </h3>
            {questions.map((question) => {
              const answer = answersByQuestionId[question.id] || '';
              return (
                <div key={question.id} style={{ marginBottom: '16px', paddingBottom: '8px' }}>
                  <p style={{ color: '#1f2937', lineHeight: '1.5' }}>
                    <strong>{question.label}:</strong> {answer || 'No answer provided'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
