"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./student.module.css";
import { useApp, ScheduledClass, Assignment } from "@/context/AppContext";
import SubmitAssignmentModal from "@/components/SubmitAssignmentModal";
import { 
  Video, 
  Calendar, 
  BookOpen, 
  Award, 
  FileCheck, 
  Clock, 
  Flame, 
  Zap, 
  Star, 
  Play, 
  ExternalLink, 
  Upload, 
  CheckCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  FileText,
  Check
} from "lucide-react";

export default function StudentPortal() {
  const { student, classes, assignments, openMeetingLauncher } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "submitted" | "graded">("all");
  const [selectedAssignmentForSubmission, setSelectedAssignmentForSubmission] = useState<Assignment | null>(null);

  // Filter assignments
  const filteredAssignments = assignments.filter((asg) => {
    if (activeTab === "all") return true;
    return asg.status === activeTab;
  });

  const nextLiveClass = classes.find((c) => c.status === "live") || classes[0];

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <nav className={styles.topNav}>
        <div className={`container ${styles.navInner}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" className={styles.logo}>
              Nija Language Hub
            </Link>
            <span className={styles.badgeRole}>Student Portal</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/parent" className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
              Parent View
            </Link>
            <Link href="/staff" className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
              Staff View
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {student.avatarLetter}
              </div>
              <span className="font-semibold text-sm" style={{ display: "none" }}>{student.name}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className="container">
          {/* Hero Profile Banner */}
          <div className={styles.heroProfile}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>{student.avatarLetter}</div>
              <div>
                <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#fef08a", fontWeight: 700 }}>
                  Ẹ ǸLẸ́ O • WELCOME BACK!
                </span>
                <h1 className={styles.greetingTitle}>{student.name}</h1>
                <p style={{ color: "#d1d5db", margin: 0, fontSize: "0.95rem" }}>
                  {student.enrolledLanguage} • {student.level} • Age {student.age}
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "4px" }}>
                  Mentor: <strong>{student.assignedTeacher}</strong>
                </p>
              </div>
            </div>

            {/* Gamification Stats Bar */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <div className={styles.statVal}>
                  <Flame size={20} color="#f97316" /> {student.streakDays}
                </div>
                <div className={styles.statLabel}>Day Streak</div>
              </div>
              <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              <div className={styles.statItem}>
                <div className={styles.statVal}>
                  <Zap size={20} color="#eab308" /> {student.xpPoints}
                </div>
                <div className={styles.statLabel}>Total XP</div>
              </div>
              <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              <div className={styles.statItem}>
                <div className={styles.statVal}>
                  <Star size={20} color="#a855f7" /> {student.badges.length}
                </div>
                <div className={styles.statLabel}>Badges</div>
              </div>
            </div>
          </div>

          {/* 2-Column Layout */}
          <div className={styles.dashboardGrid}>
            {/* Left Column: Live Class & Assignments */}
            <div>
              {/* Featured Live Class Widget */}
              {nextLiveClass && (
                <div className={styles.liveClassCard}>
                  <div className={styles.liveClassHeader}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span className={styles.liveBadge}>
                          <span className={styles.pulseDot}></span>
                          {nextLiveClass.status === "live" ? "Class is Live Now!" : "Next Scheduled Class"}
                        </span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-500)" }}>
                          {nextLiveClass.date} • {nextLiveClass.time}
                        </span>
                      </div>
                      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-secondary)", margin: 0 }}>
                        {nextLiveClass.title}
                      </h2>
                      <p style={{ margin: "6px 0 0", color: "var(--color-gray-600)", fontSize: "0.9rem" }}>
                        Live with <strong>{nextLiveClass.teacherName}</strong> via {nextLiveClass.platform === "google-meet" ? "Google Meet" : "Zoom"}
                      </p>
                    </div>

                    {/* Prominent "Start Now" Button */}
                    <button
                      onClick={() => openMeetingLauncher(nextLiveClass)}
                      className="btn btn-primary"
                      style={{
                        padding: "16px 28px",
                        fontSize: "1.05rem",
                        backgroundColor: "#16a34a",
                        boxShadow: "0 8px 24px rgba(22, 163, 74, 0.35)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        borderRadius: "var(--radius-full)"
                      }}
                    >
                      <Video size={20} />
                      Start Now / Join Class
                    </button>
                  </div>

                  {/* Agenda Topics */}
                  {nextLiveClass.topics && nextLiveClass.topics.length > 0 && (
                    <div className={styles.classTopicList}>
                      <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-600)", display: "block", marginBottom: "6px" }}>
                        Today's Interactive Session Plan:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {nextLiveClass.topics.map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: "white",
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "0.8rem",
                              color: "var(--color-gray-700)",
                              border: "1px solid var(--color-gray-200)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Check size={12} color="#16a34a" /> {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-gray-500)" }}>
                      Meeting ID: <code style={{ fontWeight: 600 }}>{nextLiveClass.meetingId}</code> • Passcode: <code style={{ fontWeight: 600 }}>{nextLiveClass.meetingPasscode}</code>
                    </span>
                    <button
                      onClick={() => openMeetingLauncher(nextLiveClass)}
                      style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      Open Google Meet / Zoom Launcher <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Assignment & Classwork Hub */}
              <div style={{ marginTop: "32px" }}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <BookOpen size={22} color="var(--color-primary)" />
                    Assignments & Classwork
                  </h2>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>
                    Submit homework & check teacher marks
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className={styles.tabList}>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "all" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Work ({assignments.length})
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "pending" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("pending")}
                  >
                    To Do ({assignments.filter((a) => a.status === "pending").length})
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "submitted" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("submitted")}
                  >
                    Submitted ({assignments.filter((a) => a.status === "submitted").length})
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "graded" ? styles.activeTabBtn : ""}`}
                    onClick={() => setActiveTab("graded")}
                  >
                    Graded ({assignments.filter((a) => a.status === "graded").length})
                  </button>
                </div>

                {/* Assignment Cards List */}
                {filteredAssignments.map((asg) => (
                  <div key={asg.id} className={styles.assignmentCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                            {asg.subject}
                          </span>
                          <span style={{ color: "var(--color-gray-300)" }}>•</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                            {asg.dueDate}
                          </span>
                        </div>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--color-secondary)", margin: 0 }}>
                          {asg.title}
                        </h3>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {asg.status === "pending" && <span className={styles.badgePending}>Pending Submission</span>}
                        {asg.status === "submitted" && <span className={styles.badgeSubmitted}>Under Review</span>}
                        {asg.status === "graded" && (
                          <span className={styles.badgeGraded}>
                            Score: {asg.grade?.score}/100 ({asg.grade?.letter})
                          </span>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: "0.9rem", color: "var(--color-gray-600)", lineHeight: 1.5, marginBottom: "16px" }}>
                      {asg.description}
                    </p>

                    {/* Graded Details */}
                    {asg.status === "graded" && asg.grade && (
                      <div style={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "var(--radius-md)",
                        padding: "16px",
                        marginBottom: "16px"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#166534", fontSize: "0.9rem" }}>
                            <Award size={18} /> Teacher Evaluation by {asg.grade.gradedBy}:
                          </div>
                          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#15803d" }}>
                            {asg.grade.score}% ({asg.grade.letter})
                          </span>
                        </div>
                        <p style={{ margin: "4px 0 10px", fontSize: "0.88rem", fontStyle: "italic", color: "#166534" }}>
                          "{asg.grade.feedback}"
                        </p>
                        {asg.grade.badges && asg.grade.badges.length > 0 && (
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {asg.grade.badges.map((bName, i) => (
                              <span
                                key={i}
                                style={{
                                  backgroundColor: "white",
                                  padding: "3px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  color: "#166534",
                                  border: "1px solid #86efac"
                                }}
                              >
                                {bName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submitted details info */}
                    {asg.status === "submitted" && asg.studentSubmission && (
                      <div style={{
                        backgroundColor: "#f0f9ff",
                        border: "1px solid #bae6fd",
                        borderRadius: "var(--radius-md)",
                        padding: "12px 16px",
                        marginBottom: "16px",
                        fontSize: "0.85rem",
                        color: "#0369a1"
                      }}>
                        <strong>Turned In ({asg.studentSubmission.submittedAt}):</strong> {asg.studentSubmission.textResponse}
                        {asg.studentSubmission.fileName && (
                          <div style={{ marginTop: "4px", fontSize: "0.8rem", color: "#0284c7", display: "flex", alignItems: "center", gap: "4px" }}>
                            <FileText size={13} /> Attached: {asg.studentSubmission.fileName}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      {asg.status === "pending" ? (
                        <button
                          onClick={() => setSelectedAssignmentForSubmission(asg)}
                          className="btn btn-primary"
                          style={{
                            padding: "8px 20px",
                            fontSize: "0.85rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <Upload size={14} />
                          Turn In / Submit Assignment
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedAssignmentForSubmission(asg)}
                          className="btn btn-outline"
                          style={{
                            padding: "6px 14px",
                            fontSize: "0.8rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          {asg.status === "graded" ? "View Full Report" : "Resubmit / Update Work"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Class Schedules & Badges */}
            <div>
              {/* Upcoming Schedules */}
              <div className="card-floating" style={{ padding: "24px", marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-secondary)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={18} color="var(--color-primary)" />
                    Class Schedules
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)", fontWeight: 600 }}>
                    {classes.length} Sessions
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      style={{
                        padding: "14px",
                        backgroundColor: cls.status === "live" ? "#f0fdf4" : "var(--color-gray-50)",
                        borderRadius: "var(--radius-md)",
                        border: cls.status === "live" ? "1px solid #86efac" : "1px solid var(--color-gray-200)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)" }}>
                          {cls.date} • {cls.time}
                        </span>
                        <span style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          backgroundColor: cls.platform === "google-meet" ? "#e0f2fe" : "#fef3c7",
                          color: cls.platform === "google-meet" ? "#0369a1" : "#b45309"
                        }}>
                          {cls.platform === "google-meet" ? "Meet" : "Zoom"}
                        </span>
                      </div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-secondary)", margin: "0 0 4px" }}>
                        {cls.title}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--color-gray-600)", margin: "0 0 10px" }}>
                        Teacher: {cls.teacherName}
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
                        {cls.status === "live" ? "Join Class Now" : "Launch Meeting Details"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earned Badges Showcase */}
              <div className="card-floating" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-secondary)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sparkles size={18} color="#eab308" />
                    Cultural Badges Earned
                  </h3>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)" }}>
                    {student.badges.length} Badges
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--color-gray-500)", margin: "0 0 16px" }}>
                  Badges awarded by {student.assignedTeacher} for mastery and participation.
                </p>

                <div className={styles.badgesGrid}>
                  {student.badges.map((b) => (
                    <div key={b.id} className={styles.badgeItem}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                        <Award size={24} color="var(--color-primary)" />
                      </div>
                      <div className={styles.badgeName}>{b.name}</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--color-gray-500)", marginTop: "2px" }}>
                        {b.dateEarned}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submission Modal */}
      {selectedAssignmentForSubmission && (
        <SubmitAssignmentModal
          assignment={selectedAssignmentForSubmission}
          onClose={() => setSelectedAssignmentForSubmission(null)}
        />
      )}
    </div>
  );
}
