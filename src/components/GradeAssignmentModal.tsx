"use client";

import React, { useState } from "react";
import { useApp, Assignment } from "@/context/AppContext";
import { 
  X, 
  Award, 
  CheckCircle, 
  FileText, 
  Mic, 
  Play, 
  Send,
  Star,
  Sparkles
} from "lucide-react";

interface GradeAssignmentModalProps {
  assignment: Assignment | null;
  onClose: () => void;
}

export default function GradeAssignmentModal({ assignment, onClose }: GradeAssignmentModalProps) {
  const { gradeAssignment, student } = useApp();
  const [score, setScore] = useState<number>(assignment?.grade?.score || 95);
  const [feedback, setFeedback] = useState<string>(
    assignment?.grade?.feedback || 
    "O kare pupo (Well done), Samuel! Your pronunciation is clear and you respected the tone markings. Keep up the wonderful work!"
  );
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    assignment?.grade?.badges || ["Tone Master"]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!assignment) return null;

  const availableBadges = [
    "Tone Master",
    "Heritage Hero",
    "Grammar Star",
    "Vocabulary Champion",
    "Polite Speaker",
    "Folktale Scholar"
  ];

  const toggleBadge = (bName: string) => {
    if (selectedBadges.includes(bName)) {
      setSelectedBadges(selectedBadges.filter((b) => b !== bName));
    } else {
      setSelectedBadges([...selectedBadges, bName]);
    }
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      gradeAssignment(assignment.id, score, feedback, selectedBadges);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    }, 500);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(18, 24, 38, 0.75)",
      backdropFilter: "blur(8px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.3)",
        maxWidth: "680px",
        width: "100%",
        overflow: "hidden",
        border: "1px solid var(--color-gray-200)"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--color-gray-200)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--color-secondary)",
          color: "white"
        }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#93c5fd" }}>
              Staff Grading Desk
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "white", margin: "2px 0 0" }}>
              Evaluate: {assignment.title}
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#d1d5db" }}>
              Student: <strong>{student.name}</strong> • Level: {student.level}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", maxHeight: "80vh", overflowY: "auto" }}>
          {savedSuccess ? (
            <div style={{ textAlign: "center", padding: "30px 10px" }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <CheckCircle size={38} />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-secondary)" }}>
                Grade & Feedback Published!
              </h3>
              <p style={{ color: "var(--color-gray-600)", marginTop: "8px" }}>
                Score of <strong>{score}/100</strong> and badge accolades have been added to Samuel's report card and Parent Portal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveGrade}>
              {/* Student Submission Review Box */}
              <div style={{
                backgroundColor: "var(--color-gray-50)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                marginBottom: "20px",
                border: "1px solid var(--color-gray-200)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-primary)" }}>
                    Student Submission Record
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                    {assignment.studentSubmission?.submittedAt || "Submitted today"}
                  </span>
                </div>

                <div style={{ fontSize: "0.9rem", color: "var(--color-gray-800)", marginBottom: "12px", background: "white", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-gray-200)" }}>
                  <em>"{assignment.studentSubmission?.textResponse || "Work submitted by student."}"</em>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {assignment.studentSubmission?.fileName && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "white", padding: "6px 12px", borderRadius: "var(--radius-full)", border: "1px solid var(--color-gray-300)", fontSize: "0.8rem" }}>
                      <FileText size={14} color="var(--color-primary)" />
                      <span>{assignment.studentSubmission.fileName}</span>
                    </div>
                  )}

                  {assignment.studentSubmission?.hasAudioRecording && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#fef3c7", padding: "6px 12px", borderRadius: "var(--radius-full)", border: "1px solid #fde68a", fontSize: "0.8rem", color: "#92400e" }}>
                      <Mic size={14} />
                      <span>Audio Recording ({assignment.studentSubmission.audioDuration || "0:42"})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Grading input */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "6px" }}>
                    Numeric Score (0 - 100)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      style={{
                        width: "100px",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-gray-300)",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        textAlign: "center"
                      }}
                    />
                    <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-gray-500)" }}>/ 100</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "6px" }}>
                    Grade Equivalent
                  </label>
                  <div style={{
                    display: "inline-block",
                    padding: "8px 18px",
                    backgroundColor: score >= 90 ? "#dcfce7" : score >= 80 ? "#e0f2fe" : "#fef3c7",
                    color: score >= 90 ? "#166534" : score >= 80 ? "#075985" : "#854d0e",
                    borderRadius: "var(--radius-md)",
                    fontSize: "1.2rem",
                    fontWeight: 800
                  }}>
                    {score >= 95 ? "A+ (Outstanding)" : score >= 90 ? "A (Excellent)" : score >= 80 ? "B+ (Very Good)" : score >= 70 ? "B (Good)" : "C (Needs Review)"}
                  </div>
                </div>
              </div>

              {/* Badges to award */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "8px" }}>
                  Award Cultural & Academic Badges:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {availableBadges.map((badgeName) => {
                    const isSelected = selectedBadges.includes(badgeName);
                    return (
                      <button
                        type="button"
                        key={badgeName}
                        onClick={() => toggleBadge(badgeName)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "var(--radius-full)",
                          border: isSelected ? "1px solid var(--color-primary)" : "1px solid var(--color-gray-300)",
                          backgroundColor: isSelected ? "var(--color-primary-light)" : "white",
                          color: isSelected ? "var(--color-primary)" : "var(--color-gray-700)",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        {isSelected && <Star size={12} fill="var(--color-primary)" />}
                        {badgeName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "6px" }}>
                  Teacher Feedback & Notes (Visible to Student & Parent)
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Leave encouraging and constructive feedback..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-gray-300)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                  style={{ minWidth: "180px", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Award size={18} />
                  {isSaving ? "Publishing..." : "Publish Grade"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
