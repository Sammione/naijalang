"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./staff.module.css";
import { useApp, ScheduledClass, Assignment } from "@/context/AppContext";
import GradeAssignmentModal from "@/components/GradeAssignmentModal";
import { 
  Video, 
  Calendar, 
  BookOpen, 
  Award, 
  FileCheck, 
  CheckCircle, 
  Clock, 
  Star, 
  Users, 
  Check, 
  Edit3, 
  FileText, 
  Mic, 
  Briefcase, 
  GraduationCap,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function StaffPortal() {
  const { staff, classes, assignments, student, openMeetingLauncher } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "graded">("all");
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<Assignment | null>(null);

  const filteredAssignments = assignments.filter((asg) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return asg.status === "submitted" || asg.status === "pending";
    if (activeTab === "graded") return asg.status === "graded";
    return true;
  });

  const nextClass = classes[0];

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <nav className={styles.topNav}>
        <div className={`container ${styles.navInner}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" className={styles.logo} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <Image src="/logo.png" alt="Logo" width={38} height={38} style={{ borderRadius: "50%", border: "2px solid #e0b034" }} />
              <span>Nija Language Hub</span>
            </Link>
            <span className={styles.badgeRole}>Staff & Educator Portal</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.85rem", color: "#86efac", fontWeight: 600 }}>{staff.name}</span>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1f7a5a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {staff.avatarLetters}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className="container">
          {/* Staff Hero Profile */}
          <div className={styles.heroProfile}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>{staff.avatarLetters}</div>
              <div>
                <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#86efac", fontWeight: 700 }}>
                  Certified Heritage Educator
                </span>
                <h1 className={styles.greetingTitle}>{staff.name}</h1>
                <p style={{ color: "#d1d5db", margin: 0, fontSize: "0.95rem" }}>
                  {staff.title} • {staff.languagesTaught.join(", ")}
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "4px" }}>
                  Email: {staff.email} • WhatsApp: {staff.phone}
                </p>
              </div>
            </div>

            {/* Teaching Metrics */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <div className={styles.statVal}>
                  <Users size={20} color="#86efac" /> {staff.assignedStudentIds ? staff.assignedStudentIds.length : (staff.totalStudents || 0)}
                </div>
                <div className={styles.statLabel}>Active Learners</div>
              </div>
              <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              <div className={styles.statItem}>
                <div className={styles.statVal}>
                  <BookOpen size={20} color="#fef08a" /> {classes.filter(c => c.status === "completed").length}
                </div>
                <div className={styles.statLabel}>Classes Taught</div>
              </div>
              <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              <div className={styles.statItem}>
                <div className={styles.statVal}>
                  <Star size={20} color="#fbbf24" fill="#fbbf24" /> {staff.rating || 5.0}
                </div>
                <div className={styles.statLabel}>Academic Rating</div>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className={styles.dashboardGrid}>
            {/* Left: Schedule & Grading Desk */}
            <div>
              {/* Host Live Class Banner */}
              {nextClass ? (
                <div className={styles.hostClassCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          textTransform: "uppercase"
                        }}>
                          Educator Classroom Ready
                        </span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-500)" }}>
                          {nextClass.date} • {nextClass.time}
                        </span>
                      </div>
                      <h2 style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--color-secondary)", margin: 0 }}>
                        {nextClass.title}
                      </h2>
                      <p style={{ margin: "6px 0 0", color: "var(--color-gray-600)", fontSize: "0.9rem" }}>
                        Student: <strong>{nextClass.studentName}</strong> ({nextClass.language})
                      </p>
                    </div>

                    <button
                      onClick={() => openMeetingLauncher(nextClass)}
                      className="btn btn-primary"
                      style={{
                        padding: "16px 28px",
                        fontSize: "1.05rem",
                        backgroundColor: "#10302a",
                        boxShadow: "0 8px 24px rgba(16, 48, 42, 0.35)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        borderRadius: "var(--radius-full)"
                      }}
                    >
                      <Video size={20} />
                      Start Class as Host
                    </button>
                  </div>

                  <div style={{
                    backgroundColor: "var(--color-gray-50)",
                    padding: "14px 16px",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-gray-700)" }}>
                      <strong>Platform:</strong> {nextClass.platform === "google-meet" ? "Google Meet" : "Zoom"} • Room ID: <code>{nextClass.meetingId}</code>
                    </div>
                    <button
                      onClick={() => openMeetingLauncher(nextClass)}
                      style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      Launch Camera Check & Room <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-floating" style={{ padding: "32px", textAlign: "center", backgroundColor: "white", marginBottom: "24px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Video size={28} color="#059669" />
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "6px" }}>
                    No Live Teaching Sessions Scheduled Today
                  </h3>
                  <p style={{ color: "var(--color-gray-600)", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto" }}>
                    Upcoming classes assigned to your educator roster will appear here with 1-click Google Meet and Zoom classroom launcher.
                  </p>
                </div>
              )}

              {/* Assignment & Grading Desk */}
              <div style={{ marginTop: "32px" }}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Award size={22} color="var(--color-primary)" />
                    Student Assignments & Grading Desk
                  </h2>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>
                    Evaluate student submissions and publish feedback
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className={styles.tabList}>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "all" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Submissions ({assignments.length})
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "pending" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("pending")}
                  >
                    Needs Grading ({assignments.filter((a) => a.status === "submitted").length})
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "graded" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("graded")}
                  >
                    Graded ({assignments.filter((a) => a.status === "graded").length})
                  </button>
                </div>

                {/* Assignments List */}
                {filteredAssignments.length === 0 ? (
                  <div className="card-floating" style={{ padding: "40px", textAlign: "center", backgroundColor: "white" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <CheckCircle size={26} color="#16a34a" />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "4px" }}>
                      {activeTab === "pending" ? "Grading Queue Clean" : "No Submissions Found"}
                    </h3>
                    <p style={{ color: "var(--color-gray-600)", fontSize: "0.85rem", margin: 0 }}>
                      {activeTab === "pending" 
                        ? "All student submissions have been evaluated and graded!" 
                        : "Student assignment submissions will appear here for grading and audio assessment."}
                    </p>
                  </div>
                ) : (
                  filteredAssignments.map((asg) => (
                    <div key={asg.id} className={styles.cardFloating}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                              {asg.subject}
                            </span>
                            <span style={{ color: "var(--color-gray-300)" }}>•</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                              Student: <strong>{student.name}</strong>
                            </span>
                          </div>
                          <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-secondary)", margin: 0 }}>
                            {asg.title}
                          </h3>
                        </div>

                        <div>
                          {asg.status === "submitted" && (
                            <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                              Ready for Grading
                            </span>
                          )}
                          {asg.status === "graded" && (
                            <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                              Score: {asg.grade?.score}% ({asg.grade?.letter})
                            </span>
                          )}
                          {asg.status === "pending" && (
                            <span style={{ backgroundColor: "var(--color-gray-100)", color: "var(--color-gray-600)", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 600 }}>
                              Pending Student Submission
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: "0.88rem", color: "var(--color-gray-600)", lineHeight: 1.5, marginBottom: "14px" }}>
                        {asg.instructions}
                      </p>

                      {/* Student Submission Display */}
                      {asg.studentSubmission && (
                        <div style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "var(--radius-md)",
                          padding: "14px",
                          marginBottom: "16px"
                        }}>
                          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-gray-600)", textTransform: "uppercase", marginBottom: "6px" }}>
                            Student Submission ({asg.studentSubmission.submittedAt}):
                          </div>
                          <p style={{ margin: "0 0 10px", fontSize: "0.9rem", color: "var(--color-gray-800)" }}>
                            "{asg.studentSubmission.textResponse}"
                          </p>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {asg.studentSubmission.fileName && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: "white", padding: "4px 10px", borderRadius: "12px", border: "1px solid var(--color-gray-300)", fontSize: "0.75rem" }}>
                                <FileText size={12} color="var(--color-primary)" />
                                {asg.studentSubmission.fileName}
                              </span>
                            )}
                            {asg.studentSubmission.hasAudioRecording && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: "#fef3c7", padding: "4px 10px", borderRadius: "12px", border: "1px solid #fde68a", fontSize: "0.75rem", color: "#92400e" }}>
                                <Mic size={12} />
                                Voice Recording ({asg.studentSubmission.audioDuration || "0:45"})
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Published Feedback */}
                      {asg.status === "graded" && asg.grade && (
                        <div style={{
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "var(--radius-md)",
                          padding: "14px",
                          marginBottom: "16px",
                          fontSize: "0.85rem"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontWeight: 700, color: "#166534" }}>Your Published Assessment:</span>
                            <span style={{ fontWeight: 800, color: "#15803d" }}>{asg.grade.score}/100 ({asg.grade.letter})</span>
                          </div>
                          <p style={{ margin: "2px 0 8px", color: "#166534", fontStyle: "italic" }}>
                            "{asg.grade.feedback}"
                          </p>
                          {asg.grade.badges && (
                            <div style={{ display: "flex", gap: "6px" }}>
                              {asg.grade.badges.map((b, i) => (
                                <span key={i} style={{ backgroundColor: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", color: "#166534", border: "1px solid #86efac" }}>
                                  {b}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setSelectedAssignmentForGrading(asg)}
                          className="btn btn-primary"
                          style={{
                            padding: "8px 20px",
                            fontSize: "0.85rem",
                            backgroundColor: asg.status === "graded" ? "var(--color-secondary)" : "#10302a",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <Edit3 size={14} />
                          {asg.status === "graded" ? "Update Grade / Feedback" : "Grade Submission"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Class Schedule & Staff Qualifications */}
            <div>
              {/* Teaching Schedule */}
              <div className={styles.cardFloating}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-secondary)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={18} color="var(--color-primary)" />
                    Teaching Schedule
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)", fontWeight: 600 }}>
                    {classes.length} Sessions
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {classes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--color-gray-500)", fontSize: "0.85rem" }}>
                      <Calendar size={24} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                      <p style={{ margin: 0 }}>No teaching sessions assigned to your roster yet.</p>
                    </div>
                  ) : (
                    classes.map((cls) => (
                      <div
                        key={cls.id}
                        style={{
                          padding: "14px",
                          backgroundColor: cls.status === "live" ? "#f0fdf4" : "var(--color-gray-50)",
                          borderRadius: "var(--radius-md)",
                          border: cls.status === "live" ? "1px solid #86efac" : "1px solid var(--color-gray-200)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)" }}>
                            {cls.date} • {cls.time}
                          </span>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", backgroundColor: "#e2e8f0" }}>
                            {cls.platform === "google-meet" ? "Meet" : "Zoom"}
                          </span>
                        </div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-secondary)", margin: "0 0 2px" }}>
                          {cls.title}
                        </h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--color-gray-600)", margin: "0 0 10px" }}>
                          Learner: <strong>{cls.studentName}</strong>
                        </p>

                        <button
                          onClick={() => openMeetingLauncher(cls)}
                          className="btn btn-outline"
                          style={{
                            width: "100%",
                            padding: "6px 12px",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}
                        >
                          <Video size={14} />
                          Launch Classroom
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bio & Qualifications */}
              <div className={styles.cardFloating}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-secondary)", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <GraduationCap size={18} color="var(--color-primary)" />
                  Educator Profile & Pedagogy
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-gray-700)", lineHeight: 1.5, marginBottom: "16px" }}>
                  {staff.bio || "Certified native language educator dedicated to heritage fluency."}
                </p>

                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-500)", display: "block", marginBottom: "8px" }}>
                  Verified Credentials:
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(staff.qualifications && staff.qualifications.length > 0) ? (
                    staff.qualifications.map((q, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "0.8rem", color: "var(--color-gray-700)" }}>
                        <CheckCircle size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{q}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "0.8rem", color: "var(--color-gray-500)" }}>
                      Faculty credentials and language accreditations verified.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Grading Modal */}
      {selectedAssignmentForGrading && (
        <GradeAssignmentModal
          assignment={selectedAssignmentForGrading}
          onClose={() => setSelectedAssignmentForGrading(null)}
        />
      )}
    </div>
  );
}
