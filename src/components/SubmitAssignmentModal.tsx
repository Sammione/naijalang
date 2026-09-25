"use client";

import React, { useState, useEffect } from "react";
import { useApp, Assignment } from "@/context/AppContext";
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  UploadCloud, 
  CheckCircle, 
  FileText, 
  Sparkles,
  AlertCircle,
  Clock
} from "lucide-react";

interface SubmitAssignmentModalProps {
  assignment: Assignment | null;
  onClose: () => void;
}

export default function SubmitAssignmentModal({ assignment, onClose }: SubmitAssignmentModalProps) {
  const { submitAssignment } = useApp();
  const [textResponse, setTextResponse] = useState("");
  const [fileName, setFileName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!assignment) return null;

  const handleStartRecord = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    setHasAudio(false);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    setHasAudio(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(
        assignment.id,
        textResponse || "Completed classwork and audio pronunciation exercises.",
        fileName || (hasAudio ? `audio_recording_${assignment.id}.mp3` : "yoruba_homework_sheet.pdf"),
        hasAudio
      );
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
          backgroundColor: "var(--color-primary)",
          color: "white"
        }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#fef08a" }}>
              Student Submission Desk
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "white", margin: "2px 0 0" }}>
              {assignment.title}
            </h2>
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
          {submittedSuccess ? (
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
                Assignment Turned In!
              </h3>
              <p style={{ color: "var(--color-gray-600)", marginTop: "8px" }}>
                Your work has been submitted to your teacher for review and grading. You earned <strong>+100 XP</strong>!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Instructions box */}
              <div style={{
                backgroundColor: "var(--color-gray-50)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                marginBottom: "20px",
                border: "1px solid var(--color-gray-200)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-secondary)", marginBottom: "6px" }}>
                  <AlertCircle size={16} /> Teacher's Instructions:
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--color-gray-700)", lineHeight: 1.5 }}>
                  {assignment.instructions}
                </p>
                <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={12} /> {assignment.dueDate}
                </div>
              </div>

              {/* Audio Recording Section */}
              <div style={{
                backgroundColor: "#fdf8f6",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                marginBottom: "20px",
                border: "1px solid #fed7aa"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-gray-800)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Mic size={16} color="var(--color-primary)" />
                    Voice Pronunciation Recording (Optional/Recommended)
                  </label>
                  {isRecording && (
                    <span style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "white", animation: "pulse 1s infinite" }}></span>
                      REC {formatTime(recordSeconds)}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecord}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--color-primary)",
                        color: "white",
                        border: "none",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      <Mic size={15} />
                      {hasAudio ? "Record New Take" : "Start Voice Recording"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecord}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      <Square size={14} />
                      Stop Recording ({formatTime(recordSeconds)})
                    </button>
                  )}

                  {hasAudio && !isRecording && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "white",
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      border: "1px solid var(--color-gray-200)",
                      fontSize: "0.85rem"
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlayingAudio(!isPlayingAudio);
                          setTimeout(() => setIsPlayingAudio(false), 3000);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--color-primary)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <Play size={16} />
                      </button>
                      <span style={{ fontWeight: 600, color: "var(--color-gray-700)" }}>
                        {isPlayingAudio ? "Playing clip..." : `Recorded Audio (${formatTime(recordSeconds || 42)})`}
                      </span>
                      <CheckCircle size={16} color="#16a34a" />
                    </div>
                  )}
                </div>
              </div>

              {/* Written Answer / Response */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "6px" }}>
                  Written Response / Notes for Teacher
                </label>
                <textarea
                  rows={4}
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  placeholder="Type your sentences, translation answers, or questions for your teacher here..."
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

              {/* File Attachment Upload */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "6px" }}>
                  Attach Worksheet, Photo, or PDF
                </label>
                <div
                  onClick={() => setFileName("yoruba_unit3_worksheet_samuel.pdf")}
                  style={{
                    border: "2px dashed var(--color-gray-300)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: fileName ? "#f0fdf4" : "var(--color-gray-50)",
                    transition: "all 0.2s"
                  }}
                >
                  <UploadCloud size={28} color={fileName ? "#16a34a" : "var(--color-gray-400)"} style={{ margin: "0 auto 6px" }} />
                  {fileName ? (
                    <div style={{ fontSize: "0.9rem", color: "#166534", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <CheckCircle size={15} /> Attached: {fileName}
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: "0.9rem", color: "var(--color-gray-700)", fontWeight: 500 }}>
                        Click to simulate uploading worksheet or homework photo
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)", marginTop: "2px" }}>
                        Supports PDF, PNG, JPG, or DOCX (Max 20MB)
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
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
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ minWidth: "160px" }}
                >
                  {isSubmitting ? "Submitting..." : "Turn In Work"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
