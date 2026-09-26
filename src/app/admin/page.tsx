"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./admin.module.css";
import { useApp } from "@/context/AppContext";
import AuthGuard from "@/components/AuthGuard";
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  Video, 
  BookOpen, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Mic, 
  Search, 
  Plus, 
  Database, 
  Check, 
  Copy, 
  X, 
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Award
} from "lucide-react";

export default function AdminDashboard() {
  const { 
    db, 
    currentUser, 
    switchUser, 
    openMeetingLauncher, 
    adminAssignTeacher, 
    adminCreateStudent,
    adminCreateTeacher,
    adminCreateParent,
    adminCreateClass,
    isSupabaseConnected
  } = useApp();

  type AdminView = "overview" | "students" | "teachers" | "parents" | "classes" | "assignments" | "invoices";
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showDbModal, setShowDbModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form states for adding student
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentAge, setNewStudentAge] = useState(8);
  const [newStudentLang, setNewStudentLang] = useState("Yoruba");
  const [newStudentLevel, setNewStudentLevel] = useState("Foundation Track (Ages 5-8)");
  const [newStudentParentName, setNewStudentParentName] = useState("");
  const [newStudentParentEmail, setNewStudentParentEmail] = useState("");
  const [newStudentTeacherId, setNewStudentTeacherId] = useState("");

  // Form states for adding teacher
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [newTeacherPhone, setNewTeacherPhone] = useState("+234 ");
  const [newTeacherLang, setNewTeacherLang] = useState("Yoruba");
  const [newTeacherBio, setNewTeacherBio] = useState("");

  // Form states for scheduling class
  const [newClassTitle, setNewClassTitle] = useState("");
  const [newClassLang, setNewClassLang] = useState("Yoruba");
  const [newClassStudentId, setNewClassStudentId] = useState("");
  const [newClassTeacherId, setNewClassTeacherId] = useState("");
  const [newClassDate, setNewClassDate] = useState("Tomorrow");
  const [newClassTime, setNewClassTime] = useState("4:00 PM WAT");
  const [newClassPlatform, setNewClassPlatform] = useState<"google-meet" | "zoom">("google-meet");

  // Metrics
  const totalStudents = db.students.length;
  const totalTeachers = db.teachers.length;
  const totalParents = db.parents.length;
  const totalClasses = db.classes.length;
  const totalRevenueUSD = db.invoices.reduce((acc, inv) => acc + (inv.status === "Paid" ? inv.amountUSD : 0), 0);
  const totalRevenueNGN = db.invoices.reduce((acc, inv) => acc + (inv.status === "Paid" ? inv.amountNGN : 0), 0);

  const avgAttendance = totalStudents > 0
    ? Math.round(db.students.reduce((acc, s) => acc + s.attendanceRate, 0) / totalStudents)
    : 0;

  const gradedAssignments = db.assignments.filter((a) => a.status === "graded");
  const avgGrade = gradedAssignments.length > 0 
    ? Math.round(gradedAssignments.reduce((acc, a) => acc + (a.grade?.score || 0), 0) / gradedAssignments.length)
    : 0;

  // Filtered students
  const filteredStudents = db.students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const parent = db.parents.find((p) => p.id === s.parentId);
    const teacher = db.teachers.find((t) => t.id === s.assignedTeacherId);
    return (
      s.name.toLowerCase().includes(q) ||
      s.enrolledLanguage.toLowerCase().includes(q) ||
      (parent && parent.name.toLowerCase().includes(q)) ||
      (teacher && teacher.name.toLowerCase().includes(q))
    );
  });

  // Handlers
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    let parentId = "";
    if (db.parents.length > 0) {
      parentId = db.parents[0].id;
    } else {
      const parentNewId = "parent-" + Date.now();
      const newParent = {
        name: newStudentParentName.trim() || `${newStudentName.trim()}'s Parent`,
        email: newStudentParentEmail.trim() || `guardian.${Date.now()}@naijalang.com`,
        phone: "+234 800 000 0000",
        role: "parent" as const,
        city: "Lagos",
        country: "Nigeria",
        childrenIds: [],
        billingStatus: "Active" as const,
        accountCreated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
      adminCreateParent(newParent);
      parentId = parentNewId;
    }

    const teacherId = newStudentTeacherId || db.teachers[0]?.id || "";

    adminCreateStudent({
      name: newStudentName.trim(),
      email: newStudentEmail.trim() || `${newStudentName.toLowerCase().replace(/\s+/g, "")}@student.naijalang.com`,
      age: Number(newStudentAge) || 8,
      role: "student" as const,
      enrolledLanguage: `${newStudentLang} Immersion Track`,
      level: newStudentLevel,
      parentId,
      assignedTeacherId: teacherId,
      avatarLetter: newStudentName.trim().charAt(0).toUpperCase() || "S",
      attendanceRate: 100,
      streakDays: 1,
      xpPoints: 50,
      bio: `${newStudentLang} Diaspora Language Learner`,
      badges: [
        {
          id: "badge-" + Date.now(),
          name: "First Steps Explorer",
          icon: "🌱",
          dateEarned: "Enrolled"
        }
      ]
    });

    setNewStudentName("");
    setNewStudentEmail("");
    setNewStudentParentName("");
    setNewStudentParentEmail("");
    setShowAddStudentModal(false);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    adminCreateTeacher({
      name: newTeacherName.trim(),
      role: "teacher" as const,
      title: `Senior Certified ${newTeacherLang} Educator`,
      email: newTeacherEmail.trim() || `${newTeacherName.toLowerCase().replace(/\s+/g, "")}@naijalang.com`,
      phone: newTeacherPhone.trim() || "+234 800 000 0000",
      languagesTaught: [newTeacherLang],
      avatarLetters: newTeacherName.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "ED",
      assignedStudentIds: [],
      classesCompleted: 0,
      rating: 5.0,
      bio: newTeacherBio.trim() || `Certified ${newTeacherLang} Linguist & Heritage Pedagogy Specialist`,
      qualifications: [
        newTeacherBio.trim() || `Certified ${newTeacherLang} Linguist & Heritage Pedagogy Specialist`
      ]
    });

    setNewTeacherName("");
    setNewTeacherEmail("");
    setNewTeacherPhone("+234 ");
    setNewTeacherBio("");
    setShowAddTeacherModal(false);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassTitle.trim()) return;

    const teacher = db.teachers.find(t => t.id === newClassTeacherId) || db.teachers[0];
    const student = db.students.find(s => s.id === newClassStudentId) || db.students[0];

    const meetingId = newClassPlatform === "zoom" 
      ? `${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}` 
      : `meet.google.com/nlh-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

    adminCreateClass({
      title: newClassTitle.trim(),
      language: newClassLang,
      teacherId: teacher?.id || "teacher-1",
      teacherName: teacher?.name || "Assigned Educator",
      studentId: student?.id || "student-1",
      studentName: student?.name || "Enrolled Learner",
      date: newClassDate || "Tomorrow",
      time: newClassTime || "4:00 PM WAT",
      status: "upcoming" as const,
      platform: newClassPlatform,
      meetingUrl: newClassPlatform === "zoom" ? `https://zoom.us/j/${meetingId.replace(/\s+/g, "")}` : `https://${meetingId}`,
      meetingId,
      meetingPasscode: "NLH2026",
      topics: ["Interactive Heritage Conversation", "Vocabulary & Pronunciation Drill"]
    });

    setNewClassTitle("");
    setShowAddClassModal(false);
  };

  return (
    <AuthGuard requiredRole="admin" portalName="Super Admin Control Center">
      <div className={styles.appShell}>
      {/* 1. LEFT ADMIN SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brandLink}>
            <Image src="/logo.png" alt="Logo" width={38} height={38} className={styles.brandLogo} />
            <div>
              <div className={styles.brandName}>Nija Language Hub</div>
              <div className={styles.brandSub}>Executive Administration</div>
            </div>
          </Link>
          <span className={styles.roleBadge}>Super Admin Command</span>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSectionLabel}>Executive Desk</div>
          
          <button
            onClick={() => setActiveView("overview")}
            className={`${styles.navButton} ${activeView === "overview" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <TrendingUp size={18} />
              <span>Overview & KPIs</span>
            </div>
          </button>

          <button
            onClick={() => setActiveView("students")}
            className={`${styles.navButton} ${activeView === "students" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <Users size={18} />
              <span>Learners & Progress</span>
            </div>
            <span className={styles.navCount}>{totalStudents}</span>
          </button>

          <button
            onClick={() => setActiveView("teachers")}
            className={`${styles.navButton} ${activeView === "teachers" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <GraduationCap size={18} />
              <span>Faculty & Teachers</span>
            </div>
            <span className={styles.navCount}>{totalTeachers}</span>
          </button>

          <button
            onClick={() => setActiveView("parents")}
            className={`${styles.navButton} ${activeView === "parents" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <UserCheck size={18} />
              <span>Parents & Families</span>
            </div>
            <span className={styles.navCount}>{totalParents}</span>
          </button>

          <div className={styles.navSectionLabel}>Operations & Academics</div>

          <button
            onClick={() => setActiveView("classes")}
            className={`${styles.navButton} ${activeView === "classes" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <Video size={18} />
              <span>Class Timetable</span>
            </div>
            <span className={styles.navCount}>{totalClasses}</span>
          </button>

          <button
            onClick={() => setActiveView("assignments")}
            className={`${styles.navButton} ${activeView === "assignments" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <BookOpen size={18} />
              <span>Grading Audit</span>
            </div>
            <span className={styles.navCount}>{db.assignments.length}</span>
          </button>

          <button
            onClick={() => setActiveView("invoices")}
            className={`${styles.navButton} ${activeView === "invoices" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <CreditCard size={18} />
              <span>Tuition Ledger</span>
            </div>
            <span className={styles.navCount}>{db.invoices.length}</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.adminProfilePill}>
            <div className={styles.adminAvatar}>NB</div>
            <div className={styles.adminProfileText}>
              <div className={styles.adminName}>Dr. Ngozi Balogun</div>
              <div className={styles.adminTitle}>Academic Director</div>
            </div>
          </div>

          <div className={styles.portalsSwitcher}>
            <span style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, paddingLeft: "4px" }}>
              Quick View Portals
            </span>
            <Link href="/parent" onClick={() => switchUser("parent", db.parents[0]?.id)} className={styles.portalLink}>
              <span>👨‍👩‍👧</span> Parent Portal
            </Link>
            <Link href="/staff" onClick={() => switchUser("teacher", db.teachers[0]?.id)} className={styles.portalLink}>
              <span>🧑‍🏫</span> Teacher Portal
            </Link>
            <Link href="/student" onClick={() => switchUser("student", db.students[0]?.id)} className={styles.portalLink}>
              <span>🎓</span> Student Portal
            </Link>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <div className={styles.mainViewport}>
        {/* Top Control Bar */}
        <header className={styles.topBar}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search students, faculty, languages or parents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.topBarActions}>
            <button onClick={() => setShowDbModal(true)} className={styles.dbPill}>
              <Database size={13} color={isSupabaseConnected ? "#16a34a" : "#ca8a04"} />
              <span>{isSupabaseConnected ? "Supabase Live" : "PostgreSQL Ready"}</span>
            </button>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            >
              <Plus size={15} /> Add Learner
            </button>

            <button
              onClick={() => setShowAddTeacherModal(true)}
              className={`${styles.actionBtn} ${styles.actionBtnOutline}`}
            >
              <Plus size={15} /> Add Educator
            </button>

            <button
              onClick={() => setShowAddClassModal(true)}
              className={`${styles.actionBtn} ${styles.actionBtnOutline}`}
            >
              <Plus size={15} /> Schedule Class
            </button>
          </div>
        </header>

        {/* 3. PAGE BODY CONTENT */}
        <main className={styles.pageBody}>
          {/* VIEW: OVERVIEW & KPIS */}
          {activeView === "overview" && (
            <div>
              <div className={styles.viewHeader}>
                <div>
                  <h1 className={styles.viewTitle}>Executive Command Center</h1>
                  <p className={styles.viewSubtitle}>
                    Real-time operational visibility across diaspora learners, certified educators, and live lessons.
                  </p>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>Enrolled Learners</span>
                    <div className={styles.metricIcon} style={{ background: "#f3e8ff", color: "#9333ea" }}>
                      <Users size={20} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>{totalStudents}</div>
                  <div className={styles.metricFooter}>
                    Attendance Average: <strong>{avgAttendance}%</strong>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>Certified Educators</span>
                    <div className={styles.metricIcon} style={{ background: "#ecfdf5", color: "#16a34a" }}>
                      <GraduationCap size={20} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>{totalTeachers}</div>
                  <div className={styles.metricFooter}>
                    Languages: <strong>Yoruba, Igbo, Hausa, Edo</strong>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>Scheduled Sessions</span>
                    <div className={styles.metricIcon} style={{ background: "#e0f2fe", color: "#0284c7" }}>
                      <Video size={20} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>{totalClasses}</div>
                  <div className={styles.metricFooter}>
                    Platform: <strong>Zoom Pro & Google Meet</strong>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>Tuition Revenue</span>
                    <div className={styles.metricIcon} style={{ background: "#fef3c7", color: "#d97706" }}>
                      <CreditCard size={20} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>${totalRevenueUSD}</div>
                  <div className={styles.metricFooter}>
                    In Local Currency: <strong>₦{totalRevenueNGN.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Quick Launchpad & Live Timetable Preview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
                {/* Today's Live Lessons */}
                <div style={{ background: "white", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>Upcoming Live Classes</h3>
                    <button onClick={() => setActiveView("classes")} style={{ background: "none", border: "none", color: "#3b82f6", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
                      View All →
                    </button>
                  </div>

                  {db.classes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 16px", color: "#64748b" }}>
                      <p style={{ margin: "0 0 12px", fontSize: "0.88rem" }}>No classes currently scheduled.</p>
                      <button onClick={() => setShowAddClassModal(true)} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} style={{ margin: "0 auto", fontSize: "0.8rem" }}>
                        + Schedule First Class
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {db.classes.slice(0, 3).map((cls) => (
                        <div key={cls.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                          <div>
                            <strong style={{ fontSize: "0.88rem", display: "block" }}>{cls.title}</strong>
                            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{cls.teacherName} • {cls.studentName} ({cls.date} at {cls.time})</span>
                          </div>
                          <button onClick={() => openMeetingLauncher(cls)} className="btn btn-primary" style={{ fontSize: "0.75rem", padding: "5px 10px" }}>
                            Launch
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* System Status & Privacy Policy Card */}
                <div style={{ background: "white", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: "1.05rem", fontWeight: 700 }}>Privacy & Multi-Role Security</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.84rem", color: "#475569" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span><strong>Teacher Isolation:</strong> Educators only see their assigned learners; parent identities and tuition financials are hidden.</span>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span><strong>Parent Privacy:</strong> Parents only see their enrolled children and tuition statements. Other families are blocked.</span>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span><strong>Student Protection:</strong> Kids access lessons and gamified tasks with zero access to billing or peer grades.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: LEARNERS & PROGRESS */}
          {activeView === "students" && (
            <div>
              <div className={styles.viewHeader}>
                <div>
                  <h1 className={styles.viewTitle}>Learners Directory & Academic Oversight</h1>
                  <p className={styles.viewSubtitle}>
                    Monitor attendance, track academic progress, and reassign native educators.
                  </p>
                </div>
                <button onClick={() => setShowAddStudentModal(true)} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                  <Plus size={15} /> Enroll Learner
                </button>
              </div>

              {filteredStudents.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>🎓</div>
                  <h3 className={styles.emptyTitle}>No Student Records in Database</h3>
                  <p className={styles.emptyDesc}>
                    All mock records have been wiped clean. Register real diaspora learners to begin tracking lessons and grades.
                  </p>
                  <button onClick={() => setShowAddStudentModal(true)} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} style={{ margin: "0 auto" }}>
                    <Plus size={15} /> Register First Learner
                  </button>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Learner</th>
                        <th>Language & Track</th>
                        <th>Linked Guardian</th>
                        <th>Assigned Educator</th>
                        <th>Attendance</th>
                        <th>Badges / XP</th>
                        <th>Reassign Faculty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((st) => {
                        const parent = db.parents.find((p) => p.id === st.parentId);
                        const teacher = db.teachers.find((t) => t.id === st.assignedTeacherId);

                        return (
                          <tr key={st.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f3e8ff", color: "#9333ea", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                                  {st.avatarLetter}
                                </div>
                                <div>
                                  <strong>{st.name}</strong>
                                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Age {st.age} • {st.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ background: "#ecfdf5", color: "#166534", padding: "2px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {st.enrolledLanguage}
                              </span>
                              <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>{st.level}</div>
                            </td>
                            <td>
                              <strong>{parent?.name || "Guardian"}</strong>
                              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{parent?.city}, {parent?.country}</div>
                            </td>
                            <td>
                              <strong>{teacher?.name || "Unassigned"}</strong>
                              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{teacher?.title}</div>
                            </td>
                            <td>
                              <strong>{st.attendanceRate}%</strong>
                              <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", width: "80px", marginTop: "4px", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${st.attendanceRate}%`, background: "#16a34a" }}></div>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#d97706" }}>
                                🏆 {st.badges?.length || 0} ({st.xpPoints} XP)
                              </span>
                            </td>
                            <td>
                              <select
                                value={st.assignedTeacherId}
                                onChange={(e) => adminAssignTeacher(st.id, e.target.value)}
                                style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.75rem" }}
                              >
                                {db.teachers.map((t) => (
                                  <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: FACULTY & TEACHERS */}
          {activeView === "teachers" && (
            <div>
              <div className={styles.viewHeader}>
                <div>
                  <h1 className={styles.viewTitle}>Faculty & Native Educators</h1>
                  <p className={styles.viewSubtitle}>
                    Accredited native speakers, qualifications, and student assignments.
                  </p>
                </div>
                <button onClick={() => setShowAddTeacherModal(true)} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                  <Plus size={15} /> Onboard Educator
                </button>
              </div>

              {db.teachers.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>🧑‍🏫</div>
                  <h3 className={styles.emptyTitle}>No Faculty Registered Yet</h3>
                  <p className={styles.emptyDesc}>
                    Onboard native Nigerian language linguists to start conducting live lessons and assigning homework.
                  </p>
                  <button onClick={() => setShowAddTeacherModal(true)} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} style={{ margin: "0 auto" }}>
                    + Onboard First Educator
                  </button>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Educator</th>
                        <th>Languages Taught</th>
                        <th>Assigned Students</th>
                        <th>Classes Taught</th>
                        <th>Rating</th>
                        <th>Contact</th>
                        <th>Qualifications</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.teachers.map((t) => (
                        <tr key={t.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#15803d", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                                {t.avatarLetters}
                              </div>
                              <div>
                                <strong>{t.name}</strong>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{t.title}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                              {t.languagesTaught.map((l, i) => (
                                <span key={i} style={{ background: "#f0fdf4", color: "#166534", padding: "2px 6px", borderRadius: "4px", fontSize: "0.72rem", border: "1px solid #bbf7d0" }}>
                                  {l}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <strong>{t.assignedStudentIds.length} Learners</strong>
                          </td>
                          <td>{t.classesCompleted} Sessions</td>
                          <td><span style={{ color: "#ca8a04", fontWeight: 700 }}>{t.rating} ★</span></td>
                          <td>
                            <div style={{ fontSize: "0.8rem" }}>{t.email}</div>
                            <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{t.phone}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: "0.75rem", color: "#475569", maxWidth: "240px" }}>
                              {t.qualifications[0]}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: PARENTS & FAMILIES */}
          {activeView === "parents" && (
            <div>
              <div className={styles.viewHeader}>
                <div>
                  <h1 className={styles.viewTitle}>Enrolled Families & Guardians</h1>
                  <p className={styles.viewSubtitle}>
                    Diaspora parent accounts, children enrolled, and tuition status.
                  </p>
                </div>
              </div>

              {db.parents.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>👨‍👩‍👧‍👦</div>
                  <h3 className={styles.emptyTitle}>No Families Registered Yet</h3>
                  <p className={styles.emptyDesc}>
                    Parents will appear here when they register their children or book free trial lessons.
                  </p>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Parent / Guardian</th>
                        <th>Location</th>
                        <th>Enrolled Children</th>
                        <th>Billing Status</th>
                        <th>Direct Contact</th>
                        <th>Account Created</th>
                        <th>Tuition Spend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.parents.map((p) => {
                        const children = db.students.filter((s) => p.childrenIds.includes(s.id));
                        const invoices = db.invoices.filter((inv) => inv.parentId === p.id);
                        const totalSpend = invoices.reduce((acc, inv) => acc + inv.amountUSD, 0);

                        return (
                          <tr key={p.id}>
                            <td>
                              <strong>{p.name}</strong>
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Guardian Account</div>
                            </td>
                            <td>{p.city}, {p.country}</td>
                            <td>
                              {children.length === 0 ? (
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No children registered</span>
                              ) : (
                                children.map((c) => (
                                  <span key={c.id} style={{ display: "inline-block", background: "#f3e8ff", color: "#7e22ce", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 700, marginRight: "4px" }}>
                                    {c.name} ({c.enrolledLanguage.split(" ")[0]})
                                  </span>
                                ))
                              )}
                            </td>
                            <td>
                              <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {p.billingStatus}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontSize: "0.8rem" }}>{p.email}</div>
                              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{p.phone}</div>
                            </td>
                            <td>{p.accountCreated}</td>
                            <td>
                              <strong>${totalSpend}</strong>
                              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>({invoices.length} invoices)</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: CLASS TIMETABLE */}
          {activeView === "classes" && (
            <div>
              <div className={styles.viewHeader}>
                <div>
                  <h1 className={styles.viewTitle}>Live Class Timetable</h1>
                  <p className={styles.viewSubtitle}>
                    Master schedule of upcoming Zoom Pro and Google Meet sessions.
                  </p>
                </div>
                <button onClick={() => setShowAddClassModal(true)} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                  <Plus size={15} /> Schedule Lesson
                </button>
              </div>

              {db.classes.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>🗓️</div>
                  <h3 className={styles.emptyTitle}>No Scheduled Classes in Session</h3>
                  <p className={styles.emptyDesc}>
                    Create live interactive Zoom or Google Meet classrooms for faculty and learners.
                  </p>
                  <button onClick={() => setShowAddClassModal(true)} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} style={{ margin: "0 auto" }}>
                    + Schedule New Class
                  </button>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Lesson Title</th>
                        <th>Language</th>
                        <th>Educator</th>
                        <th>Learner</th>
                        <th>Schedule</th>
                        <th>Platform</th>
                        <th>Meeting Credentials</th>
                        <th>Admin Supervision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.classes.map((cls) => (
                        <tr key={cls.id}>
                          <td>
                            <strong>{cls.title}</strong>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                              {cls.topics?.slice(0, 2).join(", ")}
                            </div>
                          </td>
                          <td>
                            <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                              {cls.language}
                            </span>
                          </td>
                          <td><strong>{cls.teacherName}</strong></td>
                          <td>{cls.studentName}</td>
                          <td>
                            <strong>{cls.date}</strong>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{cls.time}</div>
                          </td>
                          <td>
                            <span style={{
                              background: cls.platform === "zoom" ? "#e0f2fe" : "#dcfce7",
                              color: cls.platform === "zoom" ? "#0369a1" : "#166534",
                              padding: "3px 8px",
                              borderRadius: "10px",
                              fontSize: "0.75rem",
                              fontWeight: 700
                            }}>
                              {cls.platform === "zoom" ? "Zoom Pro" : "Google Meet"}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: "0.75rem" }}>ID: {cls.meetingId}</div>
                            <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Passcode: {cls.meetingPasscode}</div>
                          </td>
                          <td>
                            <button
                              onClick={() => openMeetingLauncher(cls)}
                              className="btn btn-primary"
                              style={{ fontSize: "0.75rem", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                              <Video size={12} /> Launch
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: ASSIGNMENTS AUDIT */}
          {activeView === "assignments" && (
            <div>
              <div className={styles.viewHeader}>
                <div>
                  <h1 className={styles.viewTitle}>Assignments & Grading Audit</h1>
                  <p className={styles.viewSubtitle}>
                    Inspect homework submissions, audio clips, and educator feedback remarks.
                  </p>
                </div>
              </div>

              {db.assignments.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>📝</div>
                  <h3 className={styles.emptyTitle}>No Homework or Tasks Registered</h3>
                  <p className={styles.emptyDesc}>
                    When teachers assign tasks and learners submit recordings or worksheets, they will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {db.assignments.map((asg) => {
                    const student = db.students.find((s) => s.id === asg.studentId);
                    const teacher = db.teachers.find((t) => t.id === asg.teacherId);

                    return (
                      <div key={asg.id} style={{ background: "white", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                          <div>
                            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "#16a34a" }}>
                              {asg.subject} • Learner: {student?.name || "Student"} • Graded By: {teacher?.name || "Faculty"}
                            </span>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: "4px 0" }}>
                              {asg.title}
                            </h3>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                              Due / Submitted: {asg.dueDate}
                            </span>
                          </div>

                          <div>
                            {asg.status === "graded" && asg.grade ? (
                              <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 800 }}>
                                Score: {asg.grade.score}/100 ({asg.grade.letter})
                              </span>
                            ) : asg.status === "submitted" ? (
                              <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700 }}>
                                Awaiting Teacher Review
                              </span>
                            ) : (
                              <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem" }}>
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: "#334155", margin: "0 0 12px" }}>
                          {asg.instructions}
                        </p>

                        {asg.studentSubmission && (
                          <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }}>
                              Submission ({asg.studentSubmission.submittedAt}):
                            </div>
                            <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "#1e293b" }}>
                              "{asg.studentSubmission.textResponse}"
                            </p>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {asg.studentSubmission.fileName && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "white", padding: "2px 8px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.72rem" }}>
                                  <FileText size={11} color="#15803d" /> {asg.studentSubmission.fileName}
                                </span>
                              )}
                              {asg.studentSubmission.hasAudioRecording && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fef3c7", padding: "2px 8px", borderRadius: "8px", border: "1px solid #fde68a", fontSize: "0.72rem", color: "#92400e" }}>
                                  <Mic size={11} /> Audio Recording ({asg.studentSubmission.audioDuration})
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {asg.status === "graded" && asg.grade && (
                          <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0", fontSize: "0.85rem" }}>
                            <strong style={{ color: "#166534" }}>Teacher Feedback:</strong>
                            <p style={{ margin: "2px 0 6px", fontStyle: "italic", color: "#166534" }}>
                              "{asg.grade.feedback}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW: TUITION & FINANCIAL LEDGER */}
          {activeView === "invoices" && (
            <div>
              <div className={styles.viewHeader}>
                <div>
                  <h1 className={styles.viewTitle}>Financial Ledger & Tuition Audit</h1>
                  <p className={styles.viewSubtitle}>
                    Audited transaction history for course subscriptions and online card/transfer payments.
                  </p>
                </div>
              </div>

              {db.invoices.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>💳</div>
                  <h3 className={styles.emptyTitle}>No Financial Transactions Yet</h3>
                  <p className={styles.emptyDesc}>
                    Online payments processed through Stripe, Paystack, or Wire transfer will be logged here.
                  </p>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Date</th>
                        <th>Paying Parent</th>
                        <th>Enrolled Learner</th>
                        <th>Description</th>
                        <th>Amount (USD)</th>
                        <th>Amount (NGN)</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.invoices.map((inv) => {
                        const parent = db.parents.find((p) => p.id === inv.parentId);
                        const student = db.students.find((s) => s.id === inv.studentId);

                        return (
                          <tr key={inv.id}>
                            <td><strong>{inv.invoiceNumber}</strong></td>
                            <td>{inv.date}</td>
                            <td>{parent?.name || "Guardian"}</td>
                            <td>{student?.name || "Student"}</td>
                            <td style={{ maxWidth: "220px", fontSize: "0.8rem" }}>{inv.description}</td>
                            <td><strong>${inv.amountUSD}</strong></td>
                            <td>₦{inv.amountNGN.toLocaleString()}</td>
                            <td>
                              <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                                {inv.method}
                              </span>
                            </td>
                            <td>
                              <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 4. MODALS */}

      {/* MODAL: ADD STUDENT */}
      {showAddStudentModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "580px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a", color: "white", borderRadius: "16px 16px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Plus size={20} color="#e0b034" />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Register New Diaspora Learner</h3>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateStudent} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Learner Full Name *</label>
                <input type="text" required placeholder="e.g. Samuel Adewale" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Age</label>
                  <input type="number" min={3} max={18} value={newStudentAge} onChange={(e) => setNewStudentAge(Number(e.target.value))} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Heritage Language</label>
                  <select value={newStudentLang} onChange={(e) => setNewStudentLang(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                    <option value="Yoruba">Yoruba</option>
                    <option value="Igbo">Igbo</option>
                    <option value="Hausa">Hausa</option>
                    <option value="Edo">Edo</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Curriculum Level Track</label>
                <select value={newStudentLevel} onChange={(e) => setNewStudentLevel(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                  <option value="Foundation Track (Ages 5-8)">Foundation Track (Ages 5-8)</option>
                  <option value="Young Scholars (Ages 9-13)">Young Scholars (Ages 9-13)</option>
                  <option value="High School & GCSE (Ages 14-18)">High School & GCSE (Ages 14-18)</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Parent / Guardian Name</label>
                  <input type="text" placeholder="e.g. Olumide Adewale" value={newStudentParentName} onChange={(e) => setNewStudentParentName(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Parent Email</label>
                  <input type="email" placeholder="parent@example.com" value={newStudentParentEmail} onChange={(e) => setNewStudentParentEmail(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
              </div>

              {db.teachers.length > 0 && (
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Assign Native Educator</label>
                  <select value={newStudentTeacherId} onChange={(e) => setNewStudentTeacherId(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                    <option value="">Select an educator...</option>
                    {db.teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.languagesTaught.join(", ")})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>Enroll Learner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ONBOARD TEACHER */}
      {showAddTeacherModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "540px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a", color: "white", borderRadius: "16px 16px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Plus size={20} color="#86efac" />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Onboard Certified Native Educator</h3>
              </div>
              <button onClick={() => setShowAddTeacherModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateTeacher} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Educator Full Name *</label>
                <input type="text" required placeholder="e.g. Mrs. Folashade Adeyemi" value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Professional Email *</label>
                  <input type="email" required placeholder="teacher@naijalang.com" value={newTeacherEmail} onChange={(e) => setNewTeacherEmail(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>WhatsApp / Direct Phone</label>
                  <input type="text" value={newTeacherPhone} onChange={(e) => setNewTeacherPhone(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Primary Heritage Language</label>
                <select value={newTeacherLang} onChange={(e) => setNewTeacherLang(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                  <option value="Yoruba">Yoruba</option>
                  <option value="Igbo">Igbo</option>
                  <option value="Hausa">Hausa</option>
                  <option value="Edo">Edo</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Pedagogical Accreditation & Qualifications</label>
                <textarea rows={3} placeholder="e.g. B.Ed Yoruba Linguistics • 10+ Years Online Diaspora Pedagogy" value={newTeacherBio} onChange={(e) => setNewTeacherBio(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddTeacherModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>Onboard Faculty</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE CLASS */}
      {showAddClassModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "560px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a", color: "white", borderRadius: "16px 16px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Video size={20} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Schedule Live Heritage Lesson</h3>
              </div>
              <button onClick={() => setShowAddClassModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateClass} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Session Title *</label>
                <input type="text" required placeholder="e.g. Master Yoruba Tones & Greetings" value={newClassTitle} onChange={(e) => setNewClassTitle(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Language Course</label>
                  <select value={newClassLang} onChange={(e) => setNewClassLang(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                    <option value="Yoruba">Yoruba</option>
                    <option value="Igbo">Igbo</option>
                    <option value="Hausa">Hausa</option>
                    <option value="Edo">Edo</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Platform</label>
                  <select value={newClassPlatform} onChange={(e) => setNewClassPlatform(e.target.value as "google-meet" | "zoom")} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                    <option value="google-meet">Google Meet</option>
                    <option value="zoom">Zoom Pro</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Select Educator</label>
                  <select value={newClassTeacherId} onChange={(e) => setNewClassTeacherId(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                    {db.teachers.length === 0 ? <option value="">No educators available</option> : db.teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Select Learner</label>
                  <select value={newClassStudentId} onChange={(e) => setNewClassStudentId(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                    {db.students.length === 0 ? <option value="">No students available</option> : db.students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Date</label>
                  <input type="text" placeholder="Tomorrow" value={newClassDate} onChange={(e) => setNewClassDate(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Time (WAT)</label>
                  <input type="text" placeholder="4:00 PM WAT" value={newClassTime} onChange={(e) => setNewClassTime(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddClassModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>Schedule Class</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUPABASE CONFIG */}
      {showDbModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a", color: "white", borderRadius: "16px 16px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Database size={22} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>Supabase PostgreSQL Cloud Database</h3>
              </div>
              <button onClick={() => setShowDbModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ padding: "14px", borderRadius: "8px", background: isSupabaseConnected ? "#f0fdf4" : "#fef3c7", border: isSupabaseConnected ? "1px solid #bbf7d0" : "1px solid #fde68a" }}>
                <strong style={{ color: isSupabaseConnected ? "#166534" : "#92400e", fontSize: "0.85rem" }}>
                  {isSupabaseConnected ? "● Live Supabase Connection Active" : "● Supabase Setup Ready"}
                </strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: isSupabaseConnected ? "#15803d" : "#78350f" }}>
                  All queries, newly registered students, faculty profiles, and invoices are synced with your live Supabase cloud tables.
                </p>
              </div>

              <div style={{ background: "#0f172a", color: "#f8fafc", padding: "14px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.78rem" }}>
                <div style={{ color: "#94a3b8", marginBottom: "4px" }}># Live Project URL</div>
                <div style={{ color: "#38bdf8" }}>https://qhwawpgpuvpkltgroktc.supabase.co</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setShowDbModal(false)} className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                  Done / Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
