"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./staff.module.css";
import { useApp, ScheduledClass, Assignment } from "@/context/AppContext";
import GradeAssignmentModal from "@/components/GradeAssignmentModal";
import AuthGuard from "@/components/AuthGuard";
import { 
  Video, 
  Calendar, 
  BookOpen, 
  Users, 
  Check, 
  FileText, 
  Mic, 
  GraduationCap, 
  Sparkles, 
  Clock, 
  Award,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle
} from "lucide-react";

export default function StaffPortal() {
  const { staff, roleClasses, roleAssignments, roleStudents, openMeetingLauncher } = useApp();
  
  type StaffView = "classes" | "grading" | "students" | "curriculum";
  const [activeView, setActiveView] = useState<StaffView>("classes");
  const [gradingFilter, setGradingFilter] = useState<"all" | "pending" | "graded">("pending");
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<Assignment | null>(null);

  // Educator's pending grading count
  const pendingGradingCount = roleAssignments.filter(a => a.status === "submitted").length;
  
  // Next upcoming class for this teacher
  const nextClass = roleClasses.find(c => c.status === "live") || roleClasses[0];

  // Filtered assignments for grading view
  const filteredAssignments = roleAssignments.filter((asg) => {
    if (gradingFilter === "all") return true;
    if (gradingFilter === "pending") return asg.status === "submitted" || asg.status === "pending";
    if (gradingFilter === "graded") return asg.status === "graded";
    return true;
  });

  return (
    <AuthGuard requiredRole="teacher" portalName="Educator & Faculty Desk">
      <div className={styles.appShell}>
      {/* 1. LEFT EDUCATOR SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brandLink}>
            <Image src="/logo.png" alt="Logo" width={38} height={38} className={styles.brandLogo} />
            <div>
              <div className={styles.brandName}>Nija Language Hub</div>
              <div className={styles.brandSub}>Faculty & Educator Desk</div>
            </div>
          </Link>
          <span className={styles.roleBadge}>Certified Native Faculty</span>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSectionLabel}>Instructional Desk</div>

          <button
            onClick={() => setActiveView("classes")}
            className={`${styles.navButton} ${activeView === "classes" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <Video size={18} />
              <span>Today's Classes</span>
            </div>
            <span className={styles.navCount}>{roleClasses.length}</span>
          </button>

          <button
            onClick={() => setActiveView("grading")}
            className={`${styles.navButton} ${activeView === "grading" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <BookOpen size={18} />
              <span>Grading Queue</span>
            </div>
            {pendingGradingCount > 0 ? (
              <span className={styles.navCount} style={{ background: "#f59e0b", color: "#78350f" }}>
                {pendingGradingCount} Pending
              </span>
            ) : (
              <span className={styles.navCount}>{roleAssignments.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveView("students")}
            className={`${styles.navButton} ${activeView === "students" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <Users size={18} />
              <span>My Assigned Students</span>
            </div>
            <span className={styles.navCount}>{roleStudents.length}</span>
          </button>

          <div className={styles.navSectionLabel}>Pedagogy & Tools</div>

          <button
            onClick={() => setActiveView("curriculum")}
            className={`${styles.navButton} ${activeView === "curriculum" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <GraduationCap size={18} />
              <span>Heritage Curriculum</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer Profile */}
        <div className={styles.sidebarFooter}>
          <div className={styles.teacherProfilePill}>
            <div className={styles.teacherAvatar}>{staff.avatarLetters}</div>
            <div>
              <div className={styles.teacherName}>{staff.name}</div>
              <div className={styles.teacherTitle}>{staff.title}</div>
            </div>
          </div>
          <Link href="/" style={{ color: "#a7f3d0", fontSize: "0.75rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Back to Main Site
          </Link>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <div className={styles.mainViewport}>
        {/* Top Control Bar */}
        <header className={styles.topBar}>
          <div>
            <h2 className={styles.topBarGreeting}>Welcome, {staff.name}</h2>
            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
              Languages Taught: <strong>{staff.languagesTaught.join(", ")}</strong> • Rating: <strong style={{ color: "#ca8a04" }}>{staff.rating} ★</strong>
            </span>
          </div>

          <div>
            {nextClass ? (
              <button onClick={() => openMeetingLauncher(nextClass)} className={styles.launchButton}>
                <Video size={16} /> Enter Live Classroom
              </button>
            ) : (
              <span style={{ fontSize: "0.8rem", color: "#64748b", background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px" }}>
                No active session right now
              </span>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageBody}>
          {/* VIEW: CLASSES */}
          {activeView === "classes" && (
            <div>
              {/* Next Live Class Hero */}
              {nextClass ? (
                <div className={styles.liveHeroCard}>
                  <div>
                    <span className={styles.liveHeroTag}>● Next Scheduled Lesson</span>
                    <h3 className={styles.liveHeroTitle}>{nextClass.title}</h3>
                    <p className={styles.liveHeroDetails}>
                      Learner: <strong>{nextClass.studentName}</strong> • Course: <strong>{nextClass.language}</strong>
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#a7f3d0" }}>
                      Schedule: {nextClass.date} at {nextClass.time} • Platform: {nextClass.platform === "zoom" ? "Zoom Pro" : "Google Meet"}
                    </p>
                  </div>

                  <button onClick={() => openMeetingLauncher(nextClass)} className={styles.launchButton} style={{ background: "#ffffff", color: "#064e3b" }}>
                    <Video size={18} color="#064e3b" /> Launch Meeting ({nextClass.platform === "zoom" ? "Zoom" : "Meet"})
                  </button>
                </div>
              ) : (
                <div className={styles.emptyCard} style={{ marginBottom: "28px" }}>
                  <div className={styles.emptyIcon}>🗓️</div>
                  <h3 className={styles.emptyTitle}>No Live Sessions Scheduled Today</h3>
                  <p className={styles.emptyDesc}>
                    When admin schedules classes or learners book lessons with you, they will appear here with instant launch credentials.
                  </p>
                </div>
              )}

              {/* Master Class Schedule Table */}
              <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "1.05rem", fontWeight: 700 }}>Upcoming Teaching Schedule</h3>
                {roleClasses.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0 }}>No classes registered on your schedule.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {roleClasses.map((cls) => (
                      <div key={cls.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <div>
                          <strong style={{ fontSize: "0.92rem", display: "block", color: "#0f172a" }}>{cls.title}</strong>
                          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            Student: <strong>{cls.studentName}</strong> • {cls.date} at {cls.time} ({cls.platform === "zoom" ? "Zoom" : "Google Meet"})
                          </span>
                        </div>
                        <button onClick={() => openMeetingLauncher(cls)} className="btn btn-primary" style={{ fontSize: "0.78rem", padding: "6px 14px" }}>
                          Launch Session
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: GRADING QUEUE */}
          {activeView === "grading" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Homework & Grading Desk</h2>
                  <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                    Review student text submissions, listen to tone recordings, and issue evaluations.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setGradingFilter("pending")} className={gradingFilter === "pending" ? "btn btn-primary" : "btn btn-outline"} style={{ fontSize: "0.78rem", padding: "6px 12px" }}>
                    Pending ({roleAssignments.filter(a => a.status === "submitted").length})
                  </button>
                  <button onClick={() => setGradingFilter("graded")} className={gradingFilter === "graded" ? "btn btn-primary" : "btn btn-outline"} style={{ fontSize: "0.78rem", padding: "6px 12px" }}>
                    Graded ({roleAssignments.filter(a => a.status === "graded").length})
                  </button>
                  <button onClick={() => setGradingFilter("all")} className={gradingFilter === "all" ? "btn btn-primary" : "btn btn-outline"} style={{ fontSize: "0.78rem", padding: "6px 12px" }}>
                    All ({roleAssignments.length})
                  </button>
                </div>
              </div>

              {filteredAssignments.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>📝</div>
                  <h3 className={styles.emptyTitle}>No Submissions in this Filter</h3>
                  <p className={styles.emptyDesc}>
                    When your assigned learners submit homework worksheets or voice exercises, they will appear in your queue.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {filteredAssignments.map((asg) => {
                    const student = roleStudents.find(s => s.id === asg.studentId);

                    return (
                      <div key={asg.id} style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                          <div>
                            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#16a34a" }}>
                              {asg.subject} • Student: {student?.name || "Assigned Learner"}
                            </span>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "2px 0 4px" }}>{asg.title}</h3>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Due / Submitted: {asg.dueDate}</span>
                          </div>

                          <div>
                            {asg.status === "graded" && asg.grade ? (
                              <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 800 }}>
                                Score: {asg.grade.score}/100 ({asg.grade.letter})
                              </span>
                            ) : (
                              <button
                                onClick={() => setSelectedAssignmentForGrading(asg)}
                                className="btn btn-primary"
                                style={{ fontSize: "0.8rem", padding: "8px 16px" }}
                              >
                                Grade Submission
                              </button>
                            )}
                          </div>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: "#334155", margin: "0 0 12px" }}>{asg.instructions}</p>

                        {/* Student Submission Card */}
                        {asg.studentSubmission && (
                          <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }}>
                              Learner Submission ({asg.studentSubmission.submittedAt}):
                            </div>
                            <p style={{ margin: "0 0 8px", fontSize: "0.88rem", color: "#0f172a" }}>"{asg.studentSubmission.textResponse}"</p>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {asg.studentSubmission.fileName && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "white", padding: "3px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.75rem" }}>
                                  <FileText size={12} color="#15803d" /> {asg.studentSubmission.fileName}
                                </span>
                              )}
                              {asg.studentSubmission.hasAudioRecording && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fef3c7", padding: "3px 10px", borderRadius: "8px", border: "1px solid #fde68a", fontSize: "0.75rem", color: "#92400e" }}>
                                  <Mic size={12} /> Audio Recording ({asg.studentSubmission.audioDuration})
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Teacher's Graded Remarks */}
                        {asg.status === "graded" && asg.grade && (
                          <div style={{ background: "#f0fdf4", padding: "12px 16px", borderRadius: "8px", border: "1px solid #bbf7d0", fontSize: "0.85rem" }}>
                            <strong style={{ color: "#166534" }}>Your Evaluation Remarks:</strong>
                            <p style={{ margin: "2px 0 0", fontStyle: "italic", color: "#166534" }}>"{asg.grade.feedback}"</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW: MY ASSIGNED STUDENTS */}
          {activeView === "students" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>My Assigned Learners</h2>
                <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                  Strict privacy enforced: Guardian contact info and financial billing records are kept private.
                </p>
              </div>

              {roleStudents.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>👥</div>
                  <h3 className={styles.emptyTitle}>No Students Assigned Yet</h3>
                  <p className={styles.emptyDesc}>
                    When the administrator assigns learners to your language immersion track, their profiles will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
                  {roleStudents.map((st) => (
                    <div key={st.id} style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#f3e8ff", color: "#9333ea", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                          {st.avatarLetter}
                        </div>
                        <div>
                          <strong style={{ fontSize: "1rem", display: "block" }}>{st.name}</strong>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Age {st.age} • {st.level}</span>
                        </div>
                      </div>

                      <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", fontSize: "0.82rem", marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>Attendance:</span>
                          <strong>{st.attendanceRate}%</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Language Track:</span>
                          <strong>{st.enrolledLanguage.split(" ")[0]}</strong>
                        </div>
                      </div>

                      <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        Badges Earned: 🏆 {st.badges?.length || 0} ({st.xpPoints} XP)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: HERITAGE CURRICULUM */}
          {activeView === "curriculum" && (
            <div style={{ background: "white", padding: "28px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 16px" }}>Heritage Pedagogy Guidelines</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "0.88rem", color: "#334155" }}>
                <div style={{ padding: "18px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ margin: "0 0 8px", color: "#064e3b", fontSize: "1rem" }}>Tonal Articulation Focus</h4>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    Ensure diaspora learners master the three foundational pitch registers: High (Acute /), Mid (Unmarked), and Low (Grave \). Pronounce every word in context before drilling isolated vocabulary.
                  </p>
                </div>
                <div style={{ padding: "18px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ margin: "0 0 8px", color: "#064e3b", fontSize: "1rem" }}>Cultural Affirmations</h4>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    Begin every session with traditional morning and afternoon greetings, elder respect phrases, and cultural proverbs that connect diaspora children to their lineage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

        {/* Grading Modal */}
        {selectedAssignmentForGrading && (
          <GradeAssignmentModal
            assignment={selectedAssignmentForGrading}
            onClose={() => setSelectedAssignmentForGrading(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
