'use client';

// import React from 'react';

// interface Student {
//   id: string;
//   name: string;
//   address: string;
//   photo: string;
//   phone: string;
//   date_of_birth: string;
// }

// interface Application {
//   id: string;
//   createdAt: string;
//   student: Student;
//   question: {
//     id: string;
//     label: string;
//     type: string;
//     required: boolean;
//   };
//   answer: string;
// }

// interface GetApplicationProps {
//   student: Student;
//   applications: Application[];
//   onClose: () => void;
// }

// export const GetApplication: React.FC<GetApplicationProps> = ({
//   student,
//   applications,
//   onClose
// }) => {
//   // Group applications by question ID for easier lookup
//   const answersByQuestionId = applications.reduce((acc, app) => {
//     acc[app.question.id] = app.answer;
//     return acc;
//   }, {} as Record<string, string>);

//   // Get unique questions from applications
//   const questions = applications.map(app => app.question);

//   // Helper function to render form fields with populated data
//   const renderPopulatedField = (question: any, answer: string) => {
//     const baseClassName = "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed";
    
//     switch (question.type) {
//       case 'Text Input':
//         return (
//           <input
//             type="text"
//             value={answer}
//             readOnly
//             className={baseClassName}
//           />
//         );
      
//       case 'Textarea':
//         return (
//           <textarea
//             value={answer}
//             readOnly
//             rows={4}
//             className={`${baseClassName} resize-none`}
//           />
//         );
      
//       case 'Email':
//         return (
//           <input
//             type="email"
//             value={answer}
//             readOnly
//             className={baseClassName}
//           />
//         );
      
//       case 'Number':
//         return (
//           <input
//             type="number"
//             value={answer}
//             readOnly
//             className={baseClassName}
//           />
//         );
      
//       case 'Phone':
//         return (
//           <input
//             type="tel"
//             value={answer}
//             readOnly
//             className={baseClassName}
//           />
//         );
      
//       case 'Date':
//         return (
//           <input
//             type="date"
//             value={answer}
//             readOnly
//             className={baseClassName}
//           />
//         );
      
//       case 'Radio Buttons':
//         // For radio buttons, show all options but highlight the selected one
//         const radioOptions = ['Option 1', 'Option 2', 'Option 3']; // You might want to get actual options from your data
//         return (
//           <div className="space-y-2">
//             {radioOptions.map((option, index) => (
//               <div key={index} className="flex items-center">
//                 <input
//                   type="radio"
//                   name={`readonly_${question.id}`}
//                   value={option}
//                   checked={answer === option}
//                   readOnly
//                   className="h-4 w-4 text-blue-600 border-gray-300 cursor-not-allowed"
//                 />
//                 <label className={`ml-2 text-sm ${answer === option ? 'font-semibold text-blue-700' : 'text-gray-700'}`}>
//                   {option}
//                 </label>
//               </div>
//             ))}
//           </div>
//         );
      
//       case 'Checkboxes':
//         const checkboxOptions = ['Option 1', 'Option 2', 'Option 3']; // You might want to get actual options from your data
//         const selectedValues = answer ? answer.split(',').map(v => v.trim()) : [];
        
//         return (
//           <div className="space-y-2">
//             {checkboxOptions.map((option, index) => (
//               <div key={index} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   value={option}
//                   checked={selectedValues.includes(option)}
//                   readOnly
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-not-allowed"
//                 />
//                 <label className={`ml-2 text-sm ${selectedValues.includes(option) ? 'font-semibold text-blue-700' : 'text-gray-700'}`}>
//                   {option}
//                 </label>
//               </div>
//             ))}
//           </div>
//         );
      
//       case 'Dropdown':
//         const dropdownOptions = ['Option 1', 'Option 2', 'Option 3']; // You might want to get actual options from your data
//         return (
//           <select
//             value={answer}
//             disabled
//             className={`${baseClassName} bg-gray-50`}
//           >
//             <option value="">Select an option</option>
//             {dropdownOptions.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         );
      
//       case 'File Upload':
//         return (
//           <div className="space-y-2">
//             <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
//               <div className="flex items-center gap-2">
//                 <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 <span className="text-sm">Uploaded file: {answer}</span>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 'URL':
//         return (
//           <div className="space-y-2">
//             <input
//               type="url"
//               value={answer}
//               readOnly
//               className={baseClassName}
//             />
//             {answer && (
//               <a 
//                 href={answer} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 print:hidden"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                 </svg>
//                 Visit Link
//               </a>
//             )}
//           </div>
//         );
      
//       default:
//         return (
//           <input
//             type="text"
//             value={answer}
//             readOnly
//             className={baseClassName}
//           />
//         );
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <>
//       {/* Print-specific styles */}
//       <style jsx global>{`
//         @media print {
//           .print-hidden {
//             display: none !important;
//           }
          
//           .modal-backdrop {
//             display: none !important;
//           }
          
//           body * {
//             visibility: hidden;
//           }
          
//           .print-container, .print-container * {
//             visibility: visible;
//           }
          
//           .print-container {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
          
//           @page {
//             margin: 1in;
//             size: A4;
//           }
//         }
//       `}</style>

//       <div className="max-w-4xl mx-auto print-container">
//         {/* Student Header */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
//           <div className="flex items-center gap-4">
//             <div className="flex-shrink-0">
//               {student.photo ? (
//                 <img
//                   className="h-16 w-16 rounded-full object-cover border-2 border-blue-200"
//                   src={student.photo}
//                   alt={student.name}
//                 />
//               ) : (
//                 <div className="h-16 w-16 rounded-full bg-blue-200 flex items-center justify-center border-2 border-blue-300">
//                   <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//             <div className="flex-1">
//               <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
//               <div className="mt-1 space-y-1 text-sm text-gray-600">
//                 <p className="flex items-center gap-2">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   </svg>
//                   {student.address}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                   </svg>
//                   {student.phone}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1a3 3 0 006 0v-1m6 0a2 2 0 100-4H2a2 2 0 100 4v3a2 2 0 002 2h16a2 2 0 002-2v-3z" />
//                   </svg>
//                   DOB: {student.date_of_birth}
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Submitted on</p>
//               <p className="text-sm font-medium text-gray-900">
//                 {formatDate(applications[0]?.createdAt)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Application Form */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-semibold text-gray-900">Submitted Application</h3>
//             </div>
            
//             <div className="space-y-6">
//               {questions.map((question, index) => {
//                 const answer = answersByQuestionId[question.id] || '';
                
//                 return (
//                   <div key={question.id} className="space-y-3 p-4 bg-gray-50 rounded-lg border">
//                     <div className="flex items-start justify-between">
//                       <label className="block text-sm font-medium text-gray-900">
//                         {question.label}
//                         {question.required && <span className="text-red-500 ml-1">*</span>}
//                       </label>
//                       <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
//                         {/* {question.type} */}
//                       </div>
//                     </div>
                    
//                     {renderPopulatedField(question, answer)}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Action Buttons - Hidden during print */}
//             <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200 print-hidden">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => window.print()}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                 </svg>
//                 Print Application
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
