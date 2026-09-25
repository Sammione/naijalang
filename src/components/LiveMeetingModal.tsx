"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Video, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles,
  Users,
  Clock,
  BookOpen
} from "lucide-react";

export default function LiveMeetingModal() {
  const { activeMeeting, closeMeetingLauncher } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState<"google-meet" | "zoom">("google-meet");
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [inSandbox, setInSandbox] = useState(false);

  if (!activeMeeting) return null;

  const currentMeetingUrl = selectedPlatform === "google-meet" 
    ? activeMeeting.meetingUrl 
    : `https://zoom.us/j/${activeMeeting.meetingId.replace(/\s+/g, '')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentMeetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchMeeting = (platform: "google-meet" | "zoom") => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      window.open(platform === "google-meet" ? activeMeeting.meetingUrl : `https://zoom.us/j/${activeMeeting.meetingId.replace(/\s+/g, '')}`, "_blank");
    }, 800);
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
      padding: "20px",
      animation: "fadeIn 0.2s ease"
    }}>
      <div style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.3)",
        maxWidth: "760px",
        width: "100%",
        overflow: "hidden",
        border: "1px solid var(--color-gray-200)",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px",
          borderBottom: "1px solid var(--color-gray-200)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--color-secondary)",
          color: "white"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{
                backgroundColor: "#22c55e",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                display: "inline-block",
                boxShadow: "0 0 10px #22c55e"
              }}></span>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#a7f3d0" }}>
                Class Room Ready • Live Connection
              </span>
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "white", margin: 0 }}>
              {activeMeeting.title}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#d1d5db", margin: "4px 0 0" }}>
              Student: <strong>{activeMeeting.studentName}</strong> • Teacher: <strong>{activeMeeting.teacherName}</strong>
            </p>
          </div>
          <button
            onClick={closeMeetingLauncher}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "white",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px", maxHeight: "80vh", overflowY: "auto" }}>
          {/* Quick Platform Switcher */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-600)", marginBottom: "8px" }}>
              CHOOSE VIDEO PLATFORM:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setSelectedPlatform("google-meet")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  border: selectedPlatform === "google-meet" ? "2px solid #00ac47" : "1px solid var(--color-gray-200)",
                  backgroundColor: selectedPlatform === "google-meet" ? "#f0fdf4" : "var(--color-surface)",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: selectedPlatform === "google-meet" ? "#166534" : "var(--color-gray-700)",
                  transition: "all 0.2s"
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "#00ac47",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 800
                }}>M</div>
                Google Meet
                {selectedPlatform === "google-meet" && <ShieldCheck size={18} color="#16a34a" />}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform("zoom")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  border: selectedPlatform === "zoom" ? "2px solid #2d8cff" : "1px solid var(--color-gray-200)",
                  backgroundColor: selectedPlatform === "zoom" ? "#eff6ff" : "var(--color-surface)",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: selectedPlatform === "zoom" ? "#1e40af" : "var(--color-gray-700)",
                  transition: "all 0.2s"
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: "#2d8cff",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 800
                }}>Z</div>
                Zoom Meeting
                {selectedPlatform === "zoom" && <ShieldCheck size={18} color="#2563eb" />}
              </button>
            </div>
          </div>

          {/* Interactive Pre-flight Camera & Mic Preview */}
          <div style={{
            backgroundColor: "#111827",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            color: "white",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Video size={18} color="#60a5fa" />
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Audio & Video Pre-Flight Check</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Status: <span style={{ color: "#34d399", fontWeight: 600 }}>Ready to join</span>
              </div>
            </div>

            {/* Video preview box */}
            <div style={{
              height: "170px",
              backgroundColor: "#1f2937",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              border: "1px dashed #374151"
            }}>
              {cameraActive ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    fontWeight: 700,
                    margin: "0 auto 10px"
                  }}>
                    {activeMeeting.studentName.charAt(0)}
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f3f4f6" }}>
                    {activeMeeting.studentName} (Camera Live)
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    High-Definition 1080p Web Stream Connected
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#9ca3af" }}>
                  <CameraOff size={32} style={{ marginBottom: "8px", opacity: 0.6 }} />
                  <div style={{ fontSize: "0.85rem" }}>Camera is currently turned off</div>
                </div>
              )}

              {/* In-preview mic level animation */}
              <div style={{
                position: "absolute",
                bottom: "12px",
                left: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "0.75rem"
              }}>
                {micActive ? (
                  <>
                    <Mic size={14} color="#34d399" />
                    <span style={{ color: "#d1d5db" }}>Microphone active</span>
                    <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "12px" }}>
                      <span style={{ width: "3px", height: "4px", backgroundColor: "#34d399", borderRadius: "1px" }}></span>
                      <span style={{ width: "3px", height: "10px", backgroundColor: "#34d399", borderRadius: "1px" }}></span>
                      <span style={{ width: "3px", height: "7px", backgroundColor: "#34d399", borderRadius: "1px" }}></span>
                      <span style={{ width: "3px", height: "12px", backgroundColor: "#34d399", borderRadius: "1px" }}></span>
                    </div>
                  </>
                ) : (
                  <>
                    <MicOff size={14} color="#ef4444" />
                    <span style={{ color: "#ef4444" }}>Muted</span>
                  </>
                )}
              </div>
            </div>

            {/* Toggle buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "14px" }}>
              <button
                type="button"
                onClick={() => setMicActive(!micActive)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: micActive ? "#374151" : "#dc2626",
                  color: "white",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                {micActive ? "Mute Mic" : "Unmute Mic"}
              </button>

              <button
                type="button"
                onClick={() => setCameraActive(!cameraActive)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: cameraActive ? "#374151" : "#dc2626",
                  color: "white",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {cameraActive ? <Camera size={16} /> : <CameraOff size={16} />}
                {cameraActive ? "Turn Off Video" : "Turn On Video"}
              </button>
            </div>
          </div>

          {/* Meeting Details card */}
          <div style={{
            backgroundColor: "var(--color-gray-50)",
            borderRadius: "var(--radius-md)",
            padding: "18px",
            border: "1px solid var(--color-gray-200)",
            marginBottom: "24px"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "14px" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)", textTransform: "uppercase", fontWeight: 600 }}>
                  Class Time
                </span>
                <p style={{ margin: "2px 0 0", fontWeight: 600, color: "var(--color-gray-800)" }}>
                  {activeMeeting.date} ({activeMeeting.time})
                </p>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)", textTransform: "uppercase", fontWeight: 600 }}>
                  Curriculum Language
                </span>
                <p style={{ margin: "2px 0 0", fontWeight: 600, color: "var(--color-primary)" }}>
                  {activeMeeting.language}
                </p>
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "var(--color-surface)",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-gray-200)"
            }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "12px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)", display: "block" }}>
                  {selectedPlatform === "google-meet" ? "Google Meet Link" : "Zoom Meeting ID & Passcode"}
                </span>
                <code style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-secondary)" }}>
                  {selectedPlatform === "google-meet" 
                    ? activeMeeting.meetingUrl 
                    : `ID: ${activeMeeting.meetingId}  |  Passcode: ${activeMeeting.meetingPasscode}`}
                </code>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-gray-300)",
                  background: "var(--color-surface)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 500
                }}
              >
                {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Agenda Topics */}
            {activeMeeting.topics && activeMeeting.topics.length > 0 && (
              <div style={{ marginTop: "14px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)", textTransform: "uppercase", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <BookOpen size={12} /> Today's Class Focus Topics:
                </span>
                <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "0.85rem", color: "var(--color-gray-700)" }}>
                  {activeMeeting.topics.map((top, idx) => (
                    <li key={idx} style={{ marginBottom: "3px" }}>{top}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              type="button"
              onClick={() => handleLaunchMeeting(selectedPlatform)}
              disabled={connecting}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "1.1rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: selectedPlatform === "google-meet" ? "#15803d" : "#1d4ed8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)"
              }}
            >
              {connecting ? (
                <>Connecting to {selectedPlatform === "google-meet" ? "Google Meet" : "Zoom"}...</>
              ) : (
                <>
                  <ExternalLink size={20} />
                  Start Now & Launch {selectedPlatform === "google-meet" ? "Google Meet" : "Zoom"}
                </>
              )}
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--color-gray-500)" }}>
                Need help connecting? Reach out via WhatsApp or contact support.
              </span>
              <button
                type="button"
                onClick={closeMeetingLauncher}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-gray-600)",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Cancel & Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
