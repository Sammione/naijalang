"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./admin.module.css";
import { useApp } from "@/context/AppContext";
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  UserCheck, 
  CreditCard, 
  TrendingUp, 
  Video, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Calendar, 
  FileText, 
  Mic, 
  Award, 
  RefreshCw, 
  Search, 
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Database,
  Copy,
  Check,
  X,
  Plus
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
    resetToDefaultData,
    isSupabaseConnected
  } = useApp();

  const [activeTab, setActiveTab] = useState<"progress" | "students" | "teachers" | "parents" | "classes" | "assignments" | "invoices">("progress");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<string | null>(null);
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

  // Handlers for adding new entities
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

  // High-level calculations
  const totalStudents = db.students.length;
  const totalParents = db.parents.length;
  const totalTeachers = db.teachers.length;
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

  // Filter students based on search
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

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <nav className={styles.topNav}>
        <div className={`container ${styles.navInner}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" className={styles.logo} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <Image src="/logo.png" alt="Logo" width={38} height={38} style={{ borderRadius: "50%", border: "2px solid #e0b034" }} />
              <span>Nija Language Hub</span>
            </Link>
            <span className={styles.badgeRole}>Super Admin Command Center</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setShowDbModal(true)}
              style={{
                backgroundColor: isSupabaseConnected ? "rgba(34, 197, 94, 0.15)" : "rgba(147, 51, 234, 0.18)",
                color: isSupabaseConnected ? "#86efac" : "#d8b4fe",
                border: isSupabaseConnected ? "1px solid #22c55e" : "1px solid #a855f7",
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700
              }}
            >
              <Database size={13} color={isSupabaseConnected ? "#86efac" : "#d8b4fe"} />
              <span>{isSupabaseConnected ? "Supabase Live Connected" : "Supabase Database (PostgreSQL)"}</span>
            </button>

            {/* Quick Portal Switcher */}
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>Portals:</span>
            <Link
              href="/parent"
              onClick={() => switchUser("parent", db.parents[0]?.id)}
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                textDecoration: "none"
              }}
            >
              Parent View
            </Link>

            <Link
              href="/staff"
              onClick={() => switchUser("teacher", db.teachers[0]?.id)}
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#86efac",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                textDecoration: "none"
              }}
            >
              Teacher View
            </Link>

            <Link
              href="/student"
              onClick={() => switchUser("student", db.students[0]?.id)}
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#fde047",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                textDecoration: "none"
              }}
            >
              Student View
            </Link>

            <button
              onClick={() => {
                if (confirm("Reset all test database records back to original state?")) {
                  resetToDefaultData();
                }
              }}
              title="Reset Database"
              style={{
                background: "none",
                border: "1px solid #475569",
                color: "#94a3b8",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <RefreshCw size={12} /> Reset Data
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className="container">
          {/* Admin Hero Header */}
          <div className={styles.heroProfile}>
            <div className={styles.profileInfo}>
              <div className={styles.avatar}>
                <ShieldCheck size={36} />
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#f472b6", fontWeight: 700 }}>
                  Centralized Multi-Portal Administration & RBAC
                </span>
                <h1 className={styles.greetingTitle}>Dr. Ngozi Balogun</h1>
                <p style={{ color: "#e2e8f0", margin: 0, fontSize: "0.95rem" }}>
                  Director of Academics & Hub Operations • 360° Real-Time Academic Visibility
                </p>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "4px" }}>
                  Strict privacy enforced: Parents cannot view teachers, teachers cannot view parents or financial ledgers.
                </p>
              </div>
            </div>

            {/* Global Metrics Bar */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <div className={styles.statVal} style={{ color: "#a78bfa" }}>
                  <Users size={18} /> {totalStudents}
                </div>
                <div className={styles.statLabel}>Learners</div>
              </div>
              <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              <div className={styles.statItem}>
                <div className={styles.statVal} style={{ color: "#86efac" }}>
                  <GraduationCap size={18} /> {totalTeachers}
                </div>
                <div className={styles.statLabel}>Educators</div>
              </div>
              <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              <div className={styles.statItem}>
                <div className={styles.statVal} style={{ color: "#fde047" }}>
                  <TrendingUp size={18} /> {avgGrade > 0 ? `${avgGrade}%` : "—"}
                </div>
                <div className={styles.statLabel}>Avg Grade</div>
              </div>
              <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              <div className={styles.statItem}>
                <div className={styles.statVal} style={{ color: "#38bdf8" }}>
                  <CreditCard size={18} /> ${totalRevenueUSD}
                </div>
                <div className={styles.statLabel}>Tuition Paid</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabList}>
            <button
              className={`${styles.tabBtn} ${activeTab === "progress" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("progress")}
            >
              <TrendingUp size={16} /> All Student Progress & Oversight
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "teachers" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("teachers")}
            >
              <GraduationCap size={16} /> Faculty & Teachers ({totalTeachers})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "parents" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("parents")}
            >
              <UserCheck size={16} /> Parents & Guardians ({totalParents})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "classes" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("classes")}
            >
              <Video size={16} /> Master Class Schedule ({totalClasses})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "assignments" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("assignments")}
            >
              <BookOpen size={16} /> Assignments & Grading Audit ({db.assignments.length})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "invoices" ? styles.activeTabBtn : ""}`}
              onClick={() => setActiveTab("invoices")}
            >
              <CreditCard size={16} /> Financial Ledger ({db.invoices.length})
            </button>
          </div>

          {/* Search & Actions Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ position: "relative", minWidth: "300px", flex: 1, maxWidth: "450px" }}>
              <Search size={16} color="var(--color-gray-400)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search by student, language, teacher or parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 38px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-gray-300)",
                  fontSize: "0.88rem",
                  backgroundColor: "white"
                }}
              />
            </div>

            {/* Quick Action Buttons for adding real data */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="btn btn-primary"
                style={{ fontSize: "0.82rem", padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={15} /> Add Learner
              </button>
              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="btn btn-outline"
                style={{ fontSize: "0.82rem", padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "white" }}
              >
                <Plus size={15} /> Add Educator
              </button>
              <button
                onClick={() => setShowAddClassModal(true)}
                className="btn btn-outline"
                style={{ fontSize: "0.82rem", padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "white" }}
              >
                <Plus size={15} /> Schedule Class
              </button>
            </div>
          </div>

          {/* TAB 1: ALL STUDENT PROGRESS (Primary User Requirement) */}
          {activeTab === "progress" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {filteredStudents.length === 0 ? (
                <div className={styles.cardFloating} style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#f3e8ff", color: "#9333ea", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Users size={28} />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "6px" }}>
                    No Student Records in Database
                  </h3>
                  <p style={{ color: "var(--color-gray-600)", maxWidth: "480px", margin: "0 auto 20px", fontSize: "0.9rem" }}>
                    All mock data has been wiped clean. Click &quot;Add Learner&quot; below to register real students directly into Supabase.
                  </p>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="btn btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", margin: "0 auto" }}
                  >
                    <Plus size={16} /> Register First Learner
                  </button>
                </div>
              ) : (
                filteredStudents.map((st) => {
                  const parent = db.parents.find((p) => p.id === st.parentId);
                  const teacher = db.teachers.find((t) => t.id === st.assignedTeacherId);
                  const studentAssignments = db.assignments.filter((a) => a.studentId === st.id);
                  const studentGraded = studentAssignments.filter((a) => a.status === "graded");
                  const avgScore = studentGraded.length > 0
                    ? Math.round(studentGraded.reduce((acc, a) => acc + (a.grade?.score || 0), 0) / studentGraded.length)
                    : 0;
                  const studentClasses = db.classes.filter((c) => c.studentId === st.id);
                  const studentInvoices = db.invoices.filter((inv) => inv.studentId === st.id);

                  return (
                    <div key={st.id} className={styles.cardFloating} style={{ borderLeft: "5px solid #9333ea" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          background: "var(--color-primary-light)",
                          color: "var(--color-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.4rem",
                          fontWeight: 800
                        }}>
                          {st.avatarLetter}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "var(--color-secondary)" }}>
                              {st.name}
                            </h2>
                            <span style={{ fontSize: "0.75rem", backgroundColor: "#f3e8ff", color: "#7e22ce", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                              Age {st.age}
                            </span>
                            <span style={{ fontSize: "0.75rem", backgroundColor: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                              {st.level}
                            </span>
                          </div>
                          <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "var(--color-gray-600)" }}>
                            Enrolled: <strong>{st.enrolledLanguage}</strong> • Email: {st.email}
                          </p>
                        </div>
                      </div>

                      {/* Standing Pill */}
                      <div style={{ textAlign: "right" }}>
                        {avgScore > 0 ? (
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#16a34a", backgroundColor: "#dcfce7", padding: "6px 14px", borderRadius: "20px" }}>
                            Academic Standing: {avgScore >= 90 ? "A+" : avgScore >= 80 ? "A" : avgScore >= 70 ? "B" : "Passing"} ({avgScore}%)
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-600)", backgroundColor: "var(--color-gray-100)", padding: "6px 14px", borderRadius: "20px" }}>
                            Enrolled • Awaiting First Assessment
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Detail Cards */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px",
                      backgroundColor: "#f8fafc",
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "16px"
                    }}>
                      <div>
                        <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-500)" }}>
                          Attendance Rate
                        </span>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-secondary)" }}>
                          {st.attendanceRate}%
                        </div>
                        <div style={{ height: "6px", backgroundColor: "#e2e8f0", borderRadius: "4px", marginTop: "4px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${st.attendanceRate}%`, backgroundColor: "#16a34a" }}></div>
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-500)" }}>
                          Study Streak & XP
                        </span>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ea580c" }}>
                          {st.streakDays} Days 🔥
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-gray-600)" }}>
                          {st.xpPoints.toLocaleString()} XP accumulated
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-500)" }}>
                          Assignments Completed
                        </span>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#2563eb" }}>
                          {studentGraded.length} / {studentAssignments.length}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-gray-600)" }}>
                          {studentAssignments.filter(a => a.status === "submitted").length} awaiting grading
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-500)" }}>
                          Cultural Badges
                        </span>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ca8a04" }}>
                          {st.badges?.length || 0} Badges 🏆
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-gray-600)" }}>
                          Latest: {st.badges?.[st.badges.length - 1]?.name || "Explorer"}
                        </span>
                      </div>
                    </div>

                    {/* Linked Parent & Assigned Teacher Info (Admin Visibility) */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      borderTop: "1px solid var(--color-gray-200)",
                      paddingTop: "16px"
                    }}>
                      {/* Parent Section */}
                      <div style={{ backgroundColor: "#fef3c7", padding: "14px", borderRadius: "var(--radius-md)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "#92400e" }}>
                            Linked Parent / Guardian (Private)
                          </span>
                          <span style={{ fontSize: "0.7rem", backgroundColor: "#16a34a", color: "white", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                            {parent?.billingStatus || "Active"}
                          </span>
                        </div>
                        <h4 style={{ margin: "2px 0", fontSize: "0.95rem", fontWeight: 700, color: "#78350f" }}>
                          {parent?.name || "Guardian"}
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400e" }}>
                          {parent?.email} • {parent?.phone} ({parent?.city}, {parent?.country})
                        </p>
                        <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#b45309" }}>
                          Total Tuition Paid: ${studentInvoices.reduce((acc, inv) => acc + inv.amountUSD, 0)} ({studentInvoices.length} invoices)
                        </p>
                      </div>

                      {/* Teacher Section & Real-Time Reassignment */}
                      <div style={{ backgroundColor: "#ecfdf5", padding: "14px", borderRadius: "var(--radius-md)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "#065f46" }}>
                            Assigned Faculty Educator
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "#047857", fontWeight: 600 }}>
                            Rating: {teacher?.rating || 4.9} ★
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <div>
                            <h4 style={{ margin: "2px 0", fontSize: "0.95rem", fontWeight: 700, color: "#064e3b" }}>
                              {teacher?.name || "Assigned Teacher"}
                            </h4>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#065f46" }}>
                              {teacher?.title} • {teacher?.phone}
                            </p>
                          </div>

                          {/* Teacher Reassignment Dropdown */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <label style={{ fontSize: "0.68rem", color: "#047857", fontWeight: 700 }}>Reassign Teacher:</label>
                            <select
                              value={st.assignedTeacherId}
                              onChange={(e) => adminAssignTeacher(st.id, e.target.value)}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "6px",
                                border: "1px solid #10b981",
                                fontSize: "0.75rem",
                                backgroundColor: "white",
                                color: "#064e3b",
                                fontWeight: 600
                              }}
                            >
                              {db.teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} ({t.languagesTaught[0]?.split(" ")[0] || "Language"})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Class Action */}
                    {studentClasses[0] && (
                      <div style={{
                        marginTop: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#faf5ff",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #e9d5ff"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#6b21a8" }}>
                          <Video size={15} color="#9333ea" />
                          <span>
                            Next Live Class: <strong>{studentClasses[0].title}</strong> ({studentClasses[0].date} at {studentClasses[0].time})
                          </span>
                        </div>
                        <button
                          onClick={() => openMeetingLauncher(studentClasses[0])}
                          className="btn btn-outline"
                          style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                        >
                          Supervise / Launch Meeting
                        </button>
                      </div>
                    )}
                  </div>
                );
              }))}
            </div>
          )}

          {/* TAB 2: TEACHERS & FACULTY */}
          {activeTab === "teachers" && (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Educator</th>
                    <th>Languages Taught</th>
                    <th>Active Students</th>
                    <th>Classes Completed</th>
                    <th>Rating</th>
                    <th>Direct Contact</th>
                    <th>Qualifications</th>
                  </tr>
                </thead>
                <tbody>
                  {db.teachers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "48px 24px", color: "var(--color-gray-500)" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🧑‍🏫</div>
                        <h4 style={{ margin: "0 0 6px", color: "var(--color-secondary)", fontSize: "1.05rem" }}>No Educators Registered Yet</h4>
                        <p style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>Onboard your first native Nigerian language teacher to start scheduling lessons.</p>
                        <button onClick={() => setShowAddTeacherModal(true)} className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "8px 16px" }}>
                          + Onboard First Educator
                        </button>
                      </td>
                    </tr>
                  ) : (
                    db.teachers.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#15803d", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                              {t.avatarLetters}
                            </div>
                            <div>
                              <strong>{t.name}</strong>
                              <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>{t.title}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                            {t.languagesTaught.map((lang, idx) => (
                              <span key={idx} style={{ backgroundColor: "#f0fdf4", color: "#166534", padding: "2px 6px", borderRadius: "6px", fontSize: "0.72rem", border: "1px solid #bbf7d0" }}>
                                {lang}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <strong>{t.assignedStudentIds.length} Assigned</strong>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                            {t.assignedStudentIds.map(sid => db.students.find(s => s.id === sid)?.name).filter(Boolean).join(", ") || "None"}
                          </div>
                        </td>
                        <td>{t.classesCompleted} Sessions</td>
                        <td>
                          <span style={{ color: "#ca8a04", fontWeight: 700 }}>{t.rating} ★</span>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.8rem" }}>{t.email}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>{t.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-gray-600)", maxWidth: "250px" }}>
                            {t.qualifications[0]}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: PARENTS & GUARDIANS */}
          {activeTab === "parents" && (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Parent / Guardian</th>
                    <th>Location</th>
                    <th>Enrolled Children</th>
                    <th>Billing Status</th>
                    <th>Contact Info</th>
                    <th>Account Created</th>
                    <th>Total Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {db.parents.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "48px 24px", color: "var(--color-gray-500)" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>👨‍👩‍👧‍👦</div>
                        <h4 style={{ margin: "0 0 6px", color: "var(--color-secondary)", fontSize: "1.05rem" }}>No Parents / Guardians Registered</h4>
                        <p style={{ margin: 0, fontSize: "0.85rem" }}>Parents will appear here when they register their diaspora learners or are added by admin.</p>
                      </td>
                    </tr>
                  ) : (
                    db.parents.map((p) => {
                      const children = db.students.filter((s) => p.childrenIds.includes(s.id));
                      const invoices = db.invoices.filter((inv) => inv.parentId === p.id);
                      const totalSpend = invoices.reduce((acc, inv) => acc + inv.amountUSD, 0);

                      return (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.name}</strong>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>Role: Guardian</div>
                          </td>
                          <td>{p.city}, {p.country}</td>
                          <td>
                            {children.map((c) => (
                              <span key={c.id} style={{ display: "inline-block", backgroundColor: "#f3e8ff", color: "#7e22ce", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 700, marginRight: "4px" }}>
                                {c.name} ({c.enrolledLanguage.split(" ")[0]})
                              </span>
                            ))}
                          </td>
                          <td>
                            <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                              {p.billingStatus}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: "0.8rem" }}>{p.email}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>{p.phone}</div>
                          </td>
                          <td>{p.accountCreated}</td>
                          <td>
                            <strong>${totalSpend}</strong>
                            <div style={{ fontSize: "0.72rem", color: "var(--color-gray-500)" }}>({invoices.length} invoices)</div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: MASTER CLASS SCHEDULE */}
          {activeTab === "classes" && (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Session Title</th>
                    <th>Language Course</th>
                    <th>Educator</th>
                    <th>Learner</th>
                    <th>Schedule</th>
                    <th>Platform</th>
                    <th>Meeting Credentials</th>
                    <th>Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  {db.classes.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "48px 24px", color: "var(--color-gray-500)" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🗓️</div>
                        <h4 style={{ margin: "0 0 6px", color: "var(--color-secondary)", fontSize: "1.05rem" }}>No Scheduled Classes in Session</h4>
                        <p style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>Create a Zoom or Google Meet classroom link for teachers and students.</p>
                        <button onClick={() => setShowAddClassModal(true)} className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "8px 16px" }}>
                          + Schedule New Class
                        </button>
                      </td>
                    </tr>
                  ) : (
                    db.classes.map((cls) => (
                      <tr key={cls.id}>
                        <td>
                          <strong>{cls.title}</strong>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                            Topics: {cls.topics?.slice(0, 2).join(", ")}
                          </div>
                        </td>
                        <td>
                          <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600 }}>
                            {cls.language}
                          </span>
                        </td>
                        <td><strong>{cls.teacherName}</strong></td>
                        <td>{cls.studentName}</td>
                        <td>
                          <strong>{cls.date}</strong>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>{cls.time}</div>
                        </td>
                        <td>
                          <span style={{
                            backgroundColor: cls.platform === "zoom" ? "#e0f2fe" : "#dcfce7",
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
                          <div style={{ fontSize: "0.72rem", color: "var(--color-gray-500)" }}>Passcode: {cls.meetingPasscode}</div>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: ASSIGNMENTS & GRADING AUDIT */}
          {activeTab === "assignments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {db.assignments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 24px", backgroundColor: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-gray-200)" }}>
                  <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>📝</div>
                  <h4 style={{ margin: "0 0 6px", color: "var(--color-secondary)", fontSize: "1.1rem" }}>No Homework or Assignments Created</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-gray-500)" }}>Assignments created by educators and submissions by students will be audited here in real time.</p>
                </div>
              ) : (
                db.assignments.map((asg) => {
                  const student = db.students.find((s) => s.id === asg.studentId);
                  const teacher = db.teachers.find((t) => t.id === asg.teacherId);

                  return (
                    <div key={asg.id} className={styles.cardFloating}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-primary)" }}>
                              {asg.subject}
                            </span>
                            <span style={{ color: "var(--color-gray-300)" }}>•</span>
                            <span style={{ fontSize: "0.78rem", color: "var(--color-gray-600)" }}>
                              Learner: <strong>{student?.name}</strong> • Graded By: <strong>{teacher?.name}</strong>
                            </span>
                          </div>
                          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-secondary)", margin: "4px 0" }}>
                            {asg.title}
                          </h3>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                            Schedule / Due Date: {asg.dueDate}
                          </span>
                        </div>

                        <div>
                          {asg.status === "graded" && asg.grade && (
                            <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 800 }}>
                              Score: {asg.grade.score}/100 ({asg.grade.letter})
                            </span>
                          )}
                          {asg.status === "submitted" && (
                            <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700 }}>
                              Awaiting Teacher Review
                            </span>
                          )}
                          {asg.status === "pending" && (
                            <span style={{ backgroundColor: "var(--color-gray-100)", color: "var(--color-gray-600)", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem" }}>
                              Student Working
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "var(--color-gray-700)", margin: "0 0 12px" }}>
                        {asg.instructions}
                      </p>

                      {/* Student Response */}
                      {asg.studentSubmission && (
                        <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "12px", fontSize: "0.85rem" }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-gray-500)", textTransform: "uppercase", marginBottom: "4px" }}>
                            Student Submission ({asg.studentSubmission.submittedAt}):
                          </div>
                          <p style={{ margin: "0 0 6px", color: "var(--color-gray-800)" }}>
                            "{asg.studentSubmission.textResponse}"
                          </p>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {asg.studentSubmission.fileName && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: "white", padding: "2px 8px", borderRadius: "8px", border: "1px solid var(--color-gray-300)", fontSize: "0.72rem" }}>
                                <FileText size={11} color="var(--color-primary)" /> {asg.studentSubmission.fileName}
                              </span>
                            )}
                            {asg.studentSubmission.hasAudioRecording && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: "#fef3c7", padding: "2px 8px", borderRadius: "8px", border: "1px solid #fde68a", fontSize: "0.72rem", color: "#92400e" }}>
                                <Mic size={11} /> Voice Audio ({asg.studentSubmission.audioDuration})
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Feedback if graded */}
                      {asg.status === "graded" && asg.grade && (
                        <div style={{ backgroundColor: "#f0fdf4", padding: "12px", borderRadius: "6px", border: "1px solid #bbf7d0", fontSize: "0.85rem" }}>
                          <strong style={{ color: "#166534" }}>Teacher Feedback:</strong>
                          <p style={{ margin: "2px 0 6px", fontStyle: "italic", color: "#166534" }}>
                            "{asg.grade.feedback}"
                          </p>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {asg.grade.badges?.map((b, i) => (
                              <span key={i} style={{ backgroundColor: "white", padding: "2px 6px", borderRadius: "8px", border: "1px solid #86efac", fontSize: "0.72rem", color: "#166534" }}>
                                🏆 {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 6: FINANCIAL LEDGER */}
          {activeTab === "invoices" && (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Paying Parent</th>
                    <th>Enrolled Student</th>
                    <th>Description</th>
                    <th>Amount (USD)</th>
                    <th>Amount (NGN)</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {db.invoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "48px 24px", color: "var(--color-gray-500)" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>💳</div>
                        <h4 style={{ margin: "0 0 6px", color: "var(--color-secondary)", fontSize: "1.05rem" }}>No Financial Transactions Yet</h4>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-gray-500)" }}>Tuition invoices and parent online payments will appear in this audited ledger.</p>
                      </td>
                    </tr>
                  ) : (
                    db.invoices.map((inv) => {
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
                            <span style={{ fontSize: "0.75rem", backgroundColor: "var(--color-gray-100)", padding: "2px 6px", borderRadius: "4px" }}>
                              {inv.method}
                            </span>
                          </td>
                          <td>
                            <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* MODAL: SUPABASE DATABASE CONFIGURATION & SCHEMA VIEWER */}
          {showDbModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "20px"
            }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-xl)",
                maxWidth: "720px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                border: "1px solid var(--color-gray-200)"
              }}>
                <div style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid var(--color-gray-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#0f172a",
                  color: "white",
                  borderRadius: "var(--radius-xl) var(--radius-xl) 0 0"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Database size={22} color="#38bdf8" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "white" }}>
                        Supabase PostgreSQL Cloud Database
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
                        Multi-role relational architecture & Row Level Security (RLS)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDbModal(false)}
                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Status Banner */}
                  <div style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isSupabaseConnected ? "#f0fdf4" : "#fef3c7",
                    border: isSupabaseConnected ? "1px solid #bbf7d0" : "1px solid #fde68a",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: isSupabaseConnected ? "#166534" : "#92400e"
                      }}>
                        {isSupabaseConnected ? "● Live Supabase Connection Active" : "● Supabase Setup Ready (Currently in Persistent Mode)"}
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: isSupabaseConnected ? "#15803d" : "#78350f" }}>
                        {isSupabaseConnected 
                          ? "All queries, submissions, grades, and payments are syncing with your live Supabase cloud tables." 
                          : "Schema and adapter are generated! Add your project keys to .env.local to activate instant cloud sync."}
                      </p>
                    </div>
                  </div>

                  {/* 3 Quick Setup Steps */}
                  <div>
                    <h4 style={{ margin: "0 0 10px", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-secondary)" }}>
                      Quick Setup Instructions:
                    </h4>
                    <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "var(--color-gray-700)", lineHeight: 1.7 }}>
                      <li>
                        Open your <strong>Supabase Dashboard</strong> (or create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>supabase.com</a>).
                      </li>
                      <li>
                        Go to the <strong>SQL Editor</strong> tab in Supabase, paste the contents of <code>supabase/schema.sql</code>, and click <strong>Run</strong>.
                      </li>
                      <li>
                        Copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong> from <em>Project Settings → API</em> into <code>.env.local</code>.
                      </li>
                    </ol>
                  </div>

                  {/* SQL Schema File Box */}
                  <div style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "var(--radius-md)",
                    padding: "16px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>
                        Schema File: <code>supabase/schema.sql</code> (7 Tables + RLS Policies + Seed Data)
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText("-- Run contents from supabase/schema.sql in Supabase SQL editor");
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 2000);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.75rem",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "white",
                          cursor: "pointer"
                        }}
                      >
                        {copiedSql ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                        {copiedSql ? "Copied Path" : "Copy Location"}
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.75rem", color: "#475569" }}>
                      <div>• <strong>admins</strong> (Leadership & Super Admins)</div>
                      <div>• <strong>teachers</strong> (Educators & Credentials)</div>
                      <div>• <strong>parents</strong> (Enrolled Families & Contact)</div>
                      <div>• <strong>students</strong> (Learners, Levels, XP, Badges)</div>
                      <div>• <strong>classes</strong> (Zoom & Google Meet Schedules)</div>
                      <div>• <strong>assignments</strong> (Submissions & Grades)</div>
                      <div style={{ gridColumn: "span 2" }}>• <strong>invoices</strong> (Tuition, Receipts, Online Payments)</div>
                    </div>
                  </div>

                  {/* Environment Variables Reference */}
                  <div style={{
                    backgroundColor: "#0f172a",
                    color: "#f8fafc",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "monospace",
                    fontSize: "0.8rem"
                  }}>
                    <div style={{ color: "#94a3b8", marginBottom: "6px" }}># File: .env.local</div>
                    <div style={{ color: "#38bdf8" }}>NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co</div>
                    <div style={{ color: "#38bdf8" }}>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here</div>
                  </div>

                  {/* Close button */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => setShowDbModal(false)}
                      className="btn btn-primary"
                      style={{ padding: "8px 24px", fontSize: "0.85rem" }}
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* MODAL: ADD STUDENT */}
          {showAddStudentModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "20px"
            }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-xl)",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                border: "1px solid var(--color-gray-200)"
              }}>
                <div style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid var(--color-gray-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "var(--color-secondary)",
                  color: "white",
                  borderRadius: "var(--radius-xl) var(--radius-xl) 0 0"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Plus size={20} color="#e0b034" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "white" }}>
                        Register New Diaspora Learner
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
                        Enroll student and sync directly with Supabase database
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddStudentModal(false)}
                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateStudent} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Learner Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Adewale"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Age</label>
                      <input
                        type="number"
                        min={3}
                        max={18}
                        value={newStudentAge}
                        onChange={(e) => setNewStudentAge(Number(e.target.value))}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Heritage Language</label>
                      <select
                        value={newStudentLang}
                        onChange={(e) => setNewStudentLang(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      >
                        <option value="Yoruba">Yoruba</option>
                        <option value="Igbo">Igbo</option>
                        <option value="Hausa">Hausa</option>
                        <option value="Edo">Edo</option>
                        <option value="Efik">Efik</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Curriculum Level Track</label>
                    <select
                      value={newStudentLevel}
                      onChange={(e) => setNewStudentLevel(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                    >
                      <option value="Foundation Track (Ages 5-8)">Foundation Track (Ages 5-8)</option>
                      <option value="Young Scholars (Ages 9-13)">Young Scholars (Ages 9-13)</option>
                      <option value="High School & GCSE (Ages 14-18)">High School & GCSE (Ages 14-18)</option>
                      <option value="Adult Immersion & Conversational">Adult Immersion & Conversational</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Parent / Guardian Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Mr. Olumide Adewale"
                        value={newStudentParentName}
                        onChange={(e) => setNewStudentParentName(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Parent Email</label>
                      <input
                        type="email"
                        placeholder="guardian@example.com"
                        value={newStudentParentEmail}
                        onChange={(e) => setNewStudentParentEmail(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      />
                    </div>
                  </div>

                  {db.teachers.length > 0 && (
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Assigned Native Educator</label>
                      <select
                        value={newStudentTeacherId}
                        onChange={(e) => setNewStudentTeacherId(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      >
                        <option value="">Select an educator...</option>
                        {db.teachers.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.languagesTaught.join(", ")})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", background: "white", cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                    >
                      Enroll Learner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: ONBOARD TEACHER */}
          {showAddTeacherModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "20px"
            }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-xl)",
                maxWidth: "560px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                border: "1px solid var(--color-gray-200)"
              }}>
                <div style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid var(--color-gray-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "var(--color-secondary)",
                  color: "white",
                  borderRadius: "var(--radius-xl) var(--radius-xl) 0 0"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Plus size={20} color="#86efac" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "white" }}>
                        Onboard Certified Native Educator
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
                        Accredit teacher profile and assign diaspora students
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddTeacherModal(false)}
                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateTeacher} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Educator Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Folashade Adeyemi"
                      value={newTeacherName}
                      onChange={(e) => setNewTeacherName(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Professional Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="teacher@naijalang.com"
                        value={newTeacherEmail}
                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>WhatsApp / Direct Phone</label>
                      <input
                        type="text"
                        value={newTeacherPhone}
                        onChange={(e) => setNewTeacherPhone(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Primary Heritage Language</label>
                    <select
                      value={newTeacherLang}
                      onChange={(e) => setNewTeacherLang(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                    >
                      <option value="Yoruba">Yoruba</option>
                      <option value="Igbo">Igbo</option>
                      <option value="Hausa">Hausa</option>
                      <option value="Edo">Edo</option>
                      <option value="Efik">Efik</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Pedagogical Accreditation & Qualifications</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. B.Ed Yoruba Linguistics (University of Ibadan) • 10+ Years Diaspora Online Instruction"
                      value={newTeacherBio}
                      onChange={(e) => setNewTeacherBio(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.85rem" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setShowAddTeacherModal(false)}
                      style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", background: "white", cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                    >
                      Onboard Faculty
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: SCHEDULE CLASS */}
          {showAddClassModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "20px"
            }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-xl)",
                maxWidth: "580px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                border: "1px solid var(--color-gray-200)"
              }}>
                <div style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid var(--color-gray-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "var(--color-secondary)",
                  color: "white",
                  borderRadius: "var(--radius-xl) var(--radius-xl) 0 0"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Video size={20} color="#38bdf8" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "white" }}>
                        Schedule Live Heritage Lesson
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
                        Configure live classroom and credentials for teacher & student
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddClassModal(false)}
                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateClass} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Session Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Yoruba Tones & Everyday Greetings"
                      value={newClassTitle}
                      onChange={(e) => setNewClassTitle(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Language Course</label>
                      <select
                        value={newClassLang}
                        onChange={(e) => setNewClassLang(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      >
                        <option value="Yoruba">Yoruba</option>
                        <option value="Igbo">Igbo</option>
                        <option value="Hausa">Hausa</option>
                        <option value="Edo">Edo</option>
                        <option value="Efik">Efik</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Video Platform</label>
                      <select
                        value={newClassPlatform}
                        onChange={(e) => setNewClassPlatform(e.target.value as "google-meet" | "zoom")}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      >
                        <option value="google-meet">Google Meet</option>
                        <option value="zoom">Zoom Pro</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Select Educator</label>
                      <select
                        value={newClassTeacherId}
                        onChange={(e) => setNewClassTeacherId(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      >
                        {db.teachers.length === 0 ? (
                          <option value="">No educators onboarded yet</option>
                        ) : (
                          db.teachers.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Select Learner</label>
                      <select
                        value={newClassStudentId}
                        onChange={(e) => setNewClassStudentId(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      >
                        {db.students.length === 0 ? (
                          <option value="">No students registered yet</option>
                        ) : (
                          db.students.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} ({s.enrolledLanguage.split(" ")[0]})</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Tomorrow, or Oct 5"
                        value={newClassDate}
                        onChange={(e) => setNewClassDate(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Time (WAT)</label>
                      <input
                        type="text"
                        placeholder="e.g. 4:00 PM WAT"
                        value={newClassTime}
                        onChange={(e) => setNewClassTime(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", fontSize: "0.9rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setShowAddClassModal(false)}
                      style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--color-gray-300)", background: "white", cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                    >
                      Schedule Class
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
