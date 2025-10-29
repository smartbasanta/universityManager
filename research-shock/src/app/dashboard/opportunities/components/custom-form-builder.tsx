"use client";

import React, { useState, useEffect } from "react";

// Helper function for consistent ID generation
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface Question {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface TeamMemberQuestion extends Question {}

interface TeamSection {
  id: string;
  questions: TeamMemberQuestion[];
}

interface TeamMember {
  id: string;
  sectionId: string;
}

interface CustomFormBuilderProps {
  questions: any[];
  setQuestions: (questions: any[]) => void;
  teamMemberQuestions: any[];
  setTeamMemberQuestions: (questions: any[]) => void;
}

export default function CustomFormBuilder({ 
  questions: externalQuestions, 
  setQuestions: setExternalQuestions,
  teamMemberQuestions: externalTeamQuestions,
  setTeamMemberQuestions: setExternalTeamQuestions
}: CustomFormBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [teamSections, setTeamSections] = useState<TeamSection[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize with external data only once
  useEffect(() => {
    if (!initialized && (externalQuestions?.length > 0 || externalTeamQuestions?.length > 0)) {
      console.log("Initializing CustomFormBuilder with external data");
      console.log("External questions:", externalQuestions);
      console.log("External team questions:", externalTeamQuestions);
      
      if (externalQuestions && externalQuestions.length > 0) {
        const formattedQuestions = externalQuestions.map(q => ({
          id: q.id || generateId(),
          label: q.label || "",
          type: q.type || "Text Input",
          required: q.required || false,
          options: q.options || []
        }));
        setQuestions(formattedQuestions);
        console.log("Set formatted questions:", formattedQuestions);
      }

      if (externalTeamQuestions && externalTeamQuestions.length > 0) {
        const teamSection = {
          id: generateId(),
          questions: externalTeamQuestions.map(q => ({
            id: q.id || generateId(),
            label: q.label || "",
            type: q.type || "Text Input",
            required: q.required || false,
            options: q.options || []
          }))
        };
        setTeamSections([teamSection]);
        console.log("Set team sections:", [teamSection]);
      }
      
      setInitialized(true);
    }
  }, [externalQuestions, externalTeamQuestions, initialized]);

  // Fixed state synchronization - sync changes back to parent
  useEffect(() => {
    console.log("📤 Questions changed, syncing to parent:", questions);
    const formattedQuestions = questions
      .filter(q => q.label && q.label.trim())
      .map(q => ({
        id: q.id,
        label: q.label,
        type: q.type,
        required: q.required
      }));
    console.log("📤 Formatted questions for parent:", formattedQuestions);
    setExternalQuestions(formattedQuestions);
  }, [questions, setExternalQuestions]);

  useEffect(() => {
    const allTeamQuestions = teamSections.flatMap(s => s.questions);
    console.log("📤 Team sections changed, syncing to parent:", allTeamQuestions);
    const formattedTeamQuestions = allTeamQuestions
      .filter(q => q.label && q.label.trim())
      .map(q => ({
        id: q.id,
        label: q.label,
        type: q.type,
        required: q.required
      }));
    console.log("📤 Formatted team questions for parent:", formattedTeamQuestions);
    setExternalTeamQuestions(formattedTeamQuestions);
  }, [teamSections, setExternalTeamQuestions]);

  const addQuestion = (parentSectionId?: string) => {
    const newQuestion = {
      id: generateId(),
      label: "",
      type: "Text Input",
      required: false,
    };

    if (parentSectionId !== undefined) {
      // Add question to team section
      setTeamSections((prev) => {
        const updated = prev.map((section) => {
          if (section.id === parentSectionId) {
            return {
              ...section,
              questions: [...section.questions, newQuestion],
            };
          }
          return section;
        });
        console.log("🔧 Updated team sections:", updated);
        return updated;
      });
    } else {
      // Add question to main questions
      setQuestions((prev) => {
        const updated = [...prev, newQuestion];
        console.log("🔧 Updated main questions:", updated);
        return updated;
      });
    }
  };

  const addTeamMemberSection = () => {
    const newSection = { id: generateId(), questions: [] };
    setTeamSections((prev) => [...prev, newSection]);
  };

  const addTeamMember = (sectionId: string) => {
    setTeamMembers((prev) => [
      ...prev,
      { id: generateId(), sectionId },
    ]);
  };

  const removeTeamMember = (memberId: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  const updateQuestion = (
    id: string,
    data: Partial<Question>,
    parentSectionId?: string
  ) => {
    if (parentSectionId !== undefined) {
      setTeamSections((prev) =>
        prev.map((section) => {
          if (section.id === parentSectionId) {
            return {
              ...section,
              questions: section.questions.map((q) =>
                q.id === id ? { ...q, ...data } : q
              ),
            };
          }
          return section;
        })
      );
    } else {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...data } : q))
      );
    }
  };

  const removeQuestion = (id: string, parentSectionId?: string) => {
    if (parentSectionId !== undefined) {
      setTeamSections((prev) =>
        prev.map((section) => {
          if (section.id === parentSectionId) {
            return {
              ...section,
              questions: section.questions.filter((q) => q.id !== id),
            };
          }
          return section;
        })
      );
    } else {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const removeTeamSection = (id: string) => {
    setTeamSections((prev) => prev.filter((section) => section.id !== id));
    setTeamMembers((prev) => prev.filter((member) => member.sectionId !== id));
  };

  // Updated question types to match API schema
  const questionTypes = [
    { value: "Text Input", label: "Text Input" },
    { value: "Email", label: "Email" },
    { value: "Textarea", label: "Textarea" },
    { value: "Select", label: "Dropdown" },      // Fixed: was "Dropdown"
    { value: "Radio", label: "Radio" },
    { value: "Checkbox", label: "Checkbox" },
    { value: "File", label: "File Upload" },     // Fixed: was "File Upload"
  ];

  const renderPreviewQuestion = (question: Question, memberIndex?: number) => {
    const fieldName = memberIndex !== undefined ? `member-${memberIndex}-${question.id}` : `question-${question.id}`;
    
    return (
      <div key={`preview-${question.id}-${memberIndex || 'main'}`} className="mb-4">
        <label className="block font-semibold mb-2">
          {question.label || "Untitled Question"} {question.required && <span className="text-red-600">*</span>}
        </label>
        {question.type === "Text Input" && (
          <input type="text" name={fieldName} className="border p-2 rounded w-full" placeholder="Enter text" />
        )}
        {question.type === "Email" && (
          <input type="email" name={fieldName} className="border p-2 rounded w-full" placeholder="Enter email" />
        )}
        {question.type === "Textarea" && (
          <textarea name={fieldName} className="border p-2 rounded w-full" rows={3} placeholder="Enter details" />
        )}
        {question.type === "Select" && question.options && (
          <select name={fieldName} className="border p-2 rounded w-full">
            <option value="">Select an option</option>
            {question.options.map((opt, idx) => (
              <option key={`${question.id}-option-${idx}`} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
        {question.type === "Radio" && question.options && (
          <div className="space-y-2">
            {question.options.map((opt, idx) => (
              <label key={`${question.id}-radio-${idx}`} className="inline-flex items-center mr-4">
                <input type="radio" name={fieldName} value={opt} />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>
        )}
        {question.type === "Checkbox" && question.options && (
          <div className="space-y-2">
            {question.options.map((opt, idx) => (
              <label key={`${question.id}-checkbox-${idx}`} className="inline-flex items-center mr-4">
                <input type="checkbox" name={`${fieldName}-${idx}`} value={opt} />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>
        )}
        {question.type === "File" && (
          <input type="file" name={fieldName} className="border p-2 rounded w-full" />
        )}
      </div>
    );
  };

  const renderQuestion = (
    question: Question,
    parentSectionId?: string
  ) => {
    return (
      <div
        key={`question-${question.id}`}
        className={`space-y-2 p-3 rounded mb-4 ${
          parentSectionId !== undefined ? "bg-purple-100" : "bg-gray-100"
        }`}
      >
        <label className="block">
          Question Label:
          <input
            type="text"
            className="border p-2 rounded w-full mt-1"
            value={question.label}
            onChange={(e) =>
              updateQuestion(question.id, { label: e.target.value }, parentSectionId)
            }
          />
        </label>
        <label className="block">
          Type:
          <select
            className="border p-2 rounded w-full mt-1"
            value={question.type}
            onChange={(e) =>
              updateQuestion(question.id, { type: e.target.value }, parentSectionId)
            }
          >
            {questionTypes.map((type) => (
              <option key={`${question.id}-type-${type.value}`} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        {(question.type === "Select" ||
          question.type === "Radio" ||
          question.type === "Checkbox") && (
          <label className="block">
            Options (comma-separated):
            <input
              type="text"
              className="border p-2 rounded w-full mt-1"
              placeholder="e.g., Option 1, Option 2"
              value={question.options ? question.options.join(", ") : ""}
              onChange={(e) =>
                updateQuestion(
                  question.id,
                  { options: e.target.value.split(",").map((opt) => opt.trim()) },
                  parentSectionId
                )
              }
            />
          </label>
        )}
        <label className="block">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) =>
              updateQuestion(question.id, { required: e.target.checked }, parentSectionId)
            }
            className="mt-1"
          />
          Required?
        </label>
        <button
          type="button"
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          onClick={() => removeQuestion(question.id, parentSectionId)}
        >
          Remove Question
        </button>
      </div>
    );
  };

  const renderTeamSection = (section: TeamSection) => {
    return (
      <div key={`team-section-${section.id}`} className="space-y-2 p-3 bg-purple-100 rounded mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-purple-900">Team Member Section</h4>
          <button
            type="button"
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={() => removeTeamSection(section.id)}
          >
            Remove Section
          </button>
        </div>
        <div className="team-questions space-y-4">
          {section.questions.map((q) => renderQuestion(q, section.id))}
        </div>
        <button
          type="button"
          className="bg-purple-600 text-white px-3 py-1 rounded mt-2 hover:bg-purple-700"
          onClick={() => addQuestion(section.id)}
        >
          + Add Team Member Question
        </button>
      </div>
    );
  };

  const generatePreview = () => {
    return (
      <form className="space-y-6">
        {/* Show message if no questions */}
        {questions.length === 0 && teamSections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No questions added yet.</p>
            <p className="text-sm">Add questions to see the preview.</p>
          </div>
        )}

        {/* Regular Questions */}
        {questions.map((q) => renderPreviewQuestion(q))}

        {/* Team Sections */}
        {teamSections.map((section) => {
          const sectionMembers = teamMembers.filter(member => member.sectionId === section.id);
          
          return (
            <div key={`preview-section-${section.id}`} className="border p-4 rounded bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-purple-700 text-lg">Team Members</h4>
                <button
                  type="button"
                  className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 text-sm"
                  onClick={() => addTeamMember(section.id)}
                >
                  + Add Member
                </button>
              </div>

              {/* Show team questions even if no members added */}
              {section.questions.length > 0 && (
                <div className="mb-4 p-3 bg-white rounded border">
                  <h5 className="font-medium text-purple-800 mb-3">Team Member Questions:</h5>
                  {section.questions.map((q) => renderPreviewQuestion(q, 0))}
                </div>
              )}

              {/* Show message if no questions in team section */}
              {section.questions.length === 0 && (
                <p className="text-gray-500 italic text-center py-4">
                  No team member questions added yet.
                </p>
              )}

              {/* Render each team member's form */}
              {sectionMembers.map((member, memberIndex) => (
                <div key={`member-${member.id}`} className="mb-6 p-4 bg-white rounded border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-purple-800">
                      Team Member {memberIndex + 1}
                    </h5>
                    <button
                      type="button"
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      onClick={() => removeTeamMember(member.id)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  {/* Render all team section questions for this member */}
                  {section.questions.map((q) => renderPreviewQuestion(q, parseInt(member.id)))}
                </div>
              ))}
            </div>
          );
        })}
      </form>
    );
  };

  return (
    <div className="flex max-w-7xl mx-auto p-6 gap-6">
      {/* Left: Form Builder */}
      <div className="w-2/3 space-y-4 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-[#111518]">
          Create Your Custom Application Form
        </h2>

        {/* Debug info */}
        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          Questions: {questions.length} | Team Sections: {teamSections.length} | Initialized: {initialized.toString()}
        </div>

        <div id="questions">
          {questions.map((q) => renderQuestion(q))}
          {teamSections.map((section) => renderTeamSection(section))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => addQuestion()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Question
          </button>
          <button
            type="button"
            onClick={addTeamMemberSection}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + Add Team Member Section
          </button>
        </div>
      </div>

      {/* Right: Sticky Preview */}
      <div className="w-1/3 sticky top-6 h-fit bg-gray-50 p-4 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Preview:</h3>
        <div className="max-h-[600px] overflow-y-auto">
          {generatePreview()}
        </div>
      </div>
    </div>
  );
}
