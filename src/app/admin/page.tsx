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
  Award,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
  RefreshCw,
  Lock,
  CheckCircle2,
  ShieldAlert
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
    adminResetPassword,
    isSupabaseConnected
  } = useApp();

  type AdminView = "overview" | "students" | "teachers" | "parents" | "classes" | "assignments" | "invoices" | "accounts";
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showDbModal, setShowDbModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form states for adding student via quick modal
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("NijaStudent#2026");
  const [newStudentAge, setNewStudentAge] = useState(8);
  const [newStudentLang, setNewStudentLang] = useState("Yoruba");
  const [newStudentLevel, setNewStudentLevel] = useState("Foundation Track (Ages 5-8)");
  const [newStudentParentName, setNewStudentParentName] = useState("");
  const [newStudentParentEmail, setNewStudentParentEmail] = useState("");
  const [newStudentTeacherId, setNewStudentTeacherId] = useState("");

  // Form states for adding teacher via quick modal
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [newTeacherPassword, setNewTeacherPassword] = useState("NijaFaculty#2026");
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

  // Account Provisioning & Password Studio states
  const [accountCreationRole, setAccountCreationRole] = useState<"student" | "teacher" | "parent">("student");
  
  // Student provision form
  const [accStudentName, setAccStudentName] = useState("");
  const [accStudentEmail, setAccStudentEmail] = useState("");
  const [accStudentPassword, setAccStudentPassword] = useState("NijaStudent#2026");
  const [accStudentAge, setAccStudentAge] = useState(8);
  const [accStudentLang, setAccStudentLang] = useState("Yoruba");
  const [accStudentLevel, setAccStudentLevel] = useState("Foundation Track (Ages 5-8)");
  const [accStudentParentId, setAccStudentParentId] = useState("");
  const [accStudentParentName, setAccStudentParentName] = useState("");
  const [accStudentParentEmail, setAccStudentParentEmail] = useState("");
  const [accStudentTeacherId, setAccStudentTeacherId] = useState("");

  // Teacher provision form
  const [accTeacherName, setAccTeacherName] = useState("");
  const [accTeacherEmail, setAccTeacherEmail] = useState("");
  const [accTeacherPassword, setAccTeacherPassword] = useState("NijaFaculty#2026");
  const [accTeacherPhone, setAccTeacherPhone] = useState("+234 800 000 0000");
  const [accTeacherTitle, setAccTeacherTitle] = useState("Senior Heritage Educator");
  const [accTeacherLang, setAccTeacherLang] = useState("Yoruba");
  const [accTeacherBio, setAccTeacherBio] = useState("");

  // Parent provision form
  const [accParentName, setAccParentName] = useState("");
  const [accParentEmail, setAccParentEmail] = useState("");
  const [accParentPassword, setAccParentPassword] = useState("NijaParent#2026");
  const [accParentPhone, setAccParentPhone] = useState("+1 555 019 2831");
  const [accParentCity, setAccParentCity] = useState("London");
  const [accParentCountry, setAccParentCountry] = useState("United Kingdom");
  const [accParentBilling, setAccParentBilling] = useState<"Active" | "Past Due" | "Trial">("Active");

  // Password visibility & generator
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Credentials slip callout
  const [lastCreatedCredentials, setLastCreatedCredentials] = useState<{
    role: "student" | "teacher" | "parent";
    name: string;
    email: string;
    password: string;
    portalUrl: string;
  } | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Password reset modal states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<{
    id: string;
    name: string;
    role: "student" | "teacher" | "parent" | "admin";
    email: string;
    currentPassword?: string;
  } | null>(null);
  const [newResetPassword, setNewResetPassword] = useState("");
  const [showResetPasswordInput, setShowResetPasswordInput] = useState(false);

  // Table filter in Accounts view
  const [accountsRoleFilter, setAccountsRoleFilter] = useState<"all" | "student" | "teacher" | "parent">("all");

  // Password generator helper
  const generateRandomPassword = (role: string) => {
    const prefixes: Record<string, string> = {
      student: "NijaStudent",
      teacher: "NijaFaculty",
      parent: "NijaParent",
      admin: "NijaAdmin"
    };
    const prefix = prefixes[role] || "NijaUser";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const symbols = ["#", "!", "@", "$"];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    return `${prefix}${symbol}${randomNum}`;
  };

  // Onboarding Message Template Generator
  const getOnboardingMessage = (creds: { role: string; name: string; email: string; password: string; portalUrl: string }) => {
    const roleTitles: Record<string, string> = {
      student: "Student / Learner",
      teacher: "Faculty Educator",
      parent: "Parent / Guardian"
    };
    return `🌟 Welcome to Nija Language Hub!
Your official ${roleTitles[creds.role] || creds.role} portal account has been created.

👤 Name: ${creds.name}
🏷️ Role: ${roleTitles[creds.role] || creds.role}
📧 Login Email: ${creds.email}
🔑 Password: ${creds.password}
🔗 Portal URL: ${creds.portalUrl}

Please sign in and keep your credentials confidential.
Ẹ kú àbọ̀!`;
  };

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
      password: newStudentPassword.trim() || "NijaStudent#2026",
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
    setNewStudentPassword("NijaStudent#2026");
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
      password: newTeacherPassword.trim() || "NijaFaculty#2026",
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
    setNewTeacherPassword("NijaFaculty#2026");
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

  // Dedicated Account Provisioning Handlers
  const handleCreateStudentAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accStudentName.trim() || !accStudentEmail.trim()) return;

    let parentId = accStudentParentId;
    if (!parentId) {
      if (db.parents.length > 0) {
        parentId = db.parents[0].id;
      } else {
        const pId = "parent-" + Date.now();
        adminCreateParent({
          name: accStudentParentName.trim() || `${accStudentName.trim()}'s Guardian`,
          email: accStudentParentEmail.trim() || `guardian.${Date.now()}@naijalang.com`,
          phone: "+234 800 000 0000",
          password: accStudentPassword.trim() || "NijaParent#2026",
          role: "parent",
          childrenIds: [],
          billingStatus: "Active",
          accountCreated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          city: "Lagos",
          country: "Nigeria"
        });
        parentId = pId;
      }
    }

    const teacherId = accStudentTeacherId || db.teachers[0]?.id || "";
    const teacher = db.teachers.find(t => t.id === teacherId);

    adminCreateStudent({
      name: accStudentName.trim(),
      email: accStudentEmail.trim(),
      password: accStudentPassword.trim() || "NijaStudent#2026",
      age: Number(accStudentAge) || 8,
      role: "student",
      enrolledLanguage: `${accStudentLang} Immersion Track`,
      level: accStudentLevel,
      parentId,
      assignedTeacherId: teacherId,
      assignedTeacher: teacher?.name || "Assigned Faculty",
      avatarLetter: accStudentName.trim().charAt(0).toUpperCase() || "S",
      attendanceRate: 100,
      streakDays: 1,
      xpPoints: 50,
      bio: `${accStudentLang} Heritage Language Student`,
      badges: []
    });

    const portalOrigin = typeof window !== "undefined" ? window.location.origin : "https://naijalang.com";
    setLastCreatedCredentials({
      role: "student",
      name: accStudentName.trim(),
      email: accStudentEmail.trim(),
      password: accStudentPassword.trim() || "NijaStudent#2026",
      portalUrl: `${portalOrigin}/login`
    });

    setAccStudentName("");
    setAccStudentEmail("");
    setAccStudentPassword(generateRandomPassword("student"));
  };

  const handleCreateTeacherAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accTeacherName.trim() || !accTeacherEmail.trim()) return;

    adminCreateTeacher({
      name: accTeacherName.trim(),
      email: accTeacherEmail.trim(),
      password: accTeacherPassword.trim() || "NijaFaculty#2026",
      phone: accTeacherPhone.trim() || "+234 800 000 0000",
      role: "teacher",
      title: accTeacherTitle.trim() || `${accTeacherLang} Language Instructor`,
      avatarLetters: accTeacherName.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "ED",
      languagesTaught: [accTeacherLang],
      assignedStudentIds: [],
      classesCompleted: 0,
      rating: 5.0,
      bio: accTeacherBio.trim() || `Certified ${accTeacherLang} Linguist & Diaspora Educator`,
      qualifications: ["Certified Linguist", "Native Speaker"]
    });

    const portalOrigin = typeof window !== "undefined" ? window.location.origin : "https://naijalang.com";
    setLastCreatedCredentials({
      role: "teacher",
      name: accTeacherName.trim(),
      email: accTeacherEmail.trim(),
      password: accTeacherPassword.trim() || "NijaFaculty#2026",
      portalUrl: `${portalOrigin}/login`
    });

    setAccTeacherName("");
    setAccTeacherEmail("");
    setAccTeacherPassword(generateRandomPassword("teacher"));
  };

  const handleCreateParentAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accParentName.trim() || !accParentEmail.trim()) return;

    adminCreateParent({
      name: accParentName.trim(),
      email: accParentEmail.trim(),
      password: accParentPassword.trim() || "NijaParent#2026",
      phone: accParentPhone.trim() || "+1 555 019 2831",
      role: "parent",
      childrenIds: [],
      billingStatus: accParentBilling,
      accountCreated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      city: accParentCity.trim() || "London",
      country: accParentCountry.trim() || "United Kingdom"
    });

    const portalOrigin = typeof window !== "undefined" ? window.location.origin : "https://naijalang.com";
    setLastCreatedCredentials({
      role: "parent",
      name: accParentName.trim(),
      email: accParentEmail.trim(),
      password: accParentPassword.trim() || "NijaParent#2026",
      portalUrl: `${portalOrigin}/login`
    });

    setAccParentName("");
    setAccParentEmail("");
    setAccParentPassword(generateRandomPassword("parent"));
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser || !newResetPassword.trim()) return;

    adminResetPassword(resetTargetUser.id, resetTargetUser.role, newResetPassword.trim());
    setShowResetModal(false);
    alert(`Password for ${resetTargetUser.name} (${resetTargetUser.role}) has been successfully updated to: ${newResetPassword.trim()}`);
    setNewResetPassword("");
    setResetTargetUser(null);
  };

  // Directory of all provisioned accounts
  const allAccounts = [
    ...db.students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      role: "student" as const,
      password: s.password || "NijaStudent#2026",
      avatarLetters: s.avatarLetter,
      detail: `${s.enrolledLanguage} • Age ${s.age}`,
      created: "Enrolled Learner"
    })),
    ...db.teachers.map(t => ({
      id: t.id,
      name: t.name,
      email: t.email,
      role: "teacher" as const,
      password: t.password || "NijaFaculty#2026",
      avatarLetters: t.avatarLetters,
      detail: `${t.title} (${t.languagesTaught.join(", ")})`,
      created: "Faculty Member"
    })),
    ...db.parents.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: "parent" as const,
      password: p.password || "NijaParent#2026",
      avatarLetters: p.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "P",
      detail: `${p.city}, ${p.country} • ${p.billingStatus}`,
      created: p.accountCreated
    })),
    ...db.admins.map(a => ({
      id: a.id,
      name: a.name,
      email: a.email,
      role: "admin" as const,
      password: a.password || "admin2026",
      avatarLetters: a.avatarLetters,
      detail: `${a.title} • ${a.department}`,
      created: a.lastActive
    }))
  ];

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

          <div className={styles.navSectionLabel}>Access & Security</div>

          <button
            onClick={() => setActiveView("accounts")}
            className={`${styles.navButton} ${activeView === "accounts" ? styles.navButtonActive : ""}`}
          >
            <div className={styles.navButtonInner}>
              <KeyRound size={18} />
              <span>Accounts & Passwords</span>
            </div>
            <span className={styles.navCount} style={{ background: "#4338ca", color: "white" }}>
              {allAccounts.length}
            </span>
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
            <button
              onClick={() => setActiveView("accounts")}
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              style={{ background: "#4338ca", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <KeyRound size={15} /> Provision Account & Password
            </button>

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

          {/* VIEW: ACCOUNTS & PASSWORDS STUDIO */}
          {activeView === "accounts" && (
            <div>
              <div className={styles.viewHeader}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ 
                      background: "#e0e7ff", 
                      color: "#4338ca", 
                      fontSize: "0.72rem", 
                      fontWeight: 800, 
                      padding: "3px 10px", 
                      borderRadius: "12px", 
                      textTransform: "uppercase" 
                    }}>
                      Security & Provisioning Studio
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      Total Provisioned: <strong>{allAccounts.length} Accounts</strong>
                    </span>
                  </div>
                  <h1 className={styles.viewTitle}>User Account Creation & Password Studio</h1>
                  <p className={styles.viewSubtitle}>
                    Provision official access credentials for diaspora Learners, certified Educators, and Parents. Set custom or auto-generated passwords and export onboarding credential slips.
                  </p>
                </div>
              </div>

              {/* Celebration Callout: Last Created Credentials */}
              {lastCreatedCredentials && (
                <div className={styles.credentialsSlip}>
                  <div className={styles.slipHeader}>
                    <div className={styles.slipTitle}>
                      <CheckCircle2 size={20} color="#059669" />
                      <span>Account Successfully Provisioned!</span>
                    </div>
                    <button
                      onClick={() => setLastCreatedCredentials(null)}
                      style={{ background: "none", border: "none", color: "#065f46", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}
                    >
                      Dismiss
                    </button>
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: "#065f46" }}>
                    Official credentials for <strong>{lastCreatedCredentials.name}</strong> have been configured. You can copy the formatted onboarding message below to send via WhatsApp or email:
                  </p>
                  <pre className={styles.slipBody}>
                    {getOnboardingMessage(lastCreatedCredentials)}
                  </pre>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getOnboardingMessage(lastCreatedCredentials));
                        setCopiedCredentials(true);
                        setTimeout(() => setCopiedCredentials(false), 2500);
                      }}
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      style={{ background: "#059669" }}
                    >
                      {copiedCredentials ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedCredentials ? "Copied to Clipboard!" : "Copy WhatsApp/Email Onboarding Text"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2-Column Split: Creator Form + Policy/Instructions */}
              <div className={styles.provisionGrid}>
                {/* Column 1: Account Creator Card */}
                <div className={styles.studioCard}>
                  <div style={{ marginBottom: "16px" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                      Provision New Account
                    </h2>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                      Choose role, set credentials, and link curriculum tracks.
                    </p>
                  </div>

                  {/* Role Selector Tabs */}
                  <div className={styles.roleTabs}>
                    <button
                      type="button"
                      onClick={() => setAccountCreationRole("student")}
                      className={`${styles.roleTabBtn} ${accountCreationRole === "student" ? styles.roleTabBtnActive : ""}`}
                    >
                      <Users size={16} color={accountCreationRole === "student" ? "#4338ca" : "#64748b"} />
                      <span>Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountCreationRole("teacher")}
                      className={`${styles.roleTabBtn} ${accountCreationRole === "teacher" ? styles.roleTabBtnActive : ""}`}
                    >
                      <GraduationCap size={16} color={accountCreationRole === "teacher" ? "#16a34a" : "#64748b"} />
                      <span>Educator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountCreationRole("parent")}
                      className={`${styles.roleTabBtn} ${accountCreationRole === "parent" ? styles.roleTabBtnActive : ""}`}
                    >
                      <UserCheck size={16} color={accountCreationRole === "parent" ? "#d97706" : "#64748b"} />
                      <span>Parent</span>
                    </button>
                  </div>

                  {/* FORM A: STUDENT CREATION */}
                  {accountCreationRole === "student" && (
                    <form onSubmit={handleCreateStudentAccount} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Learner Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Samuel Adeyemi"
                          value={accStudentName}
                          onChange={(e) => setAccStudentName(e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Login Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="samuel@naijalang.com"
                            value={accStudentEmail}
                            onChange={(e) => setAccStudentEmail(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Age</label>
                          <input
                            type="number"
                            min={3}
                            max={18}
                            value={accStudentAge}
                            onChange={(e) => setAccStudentAge(Number(e.target.value))}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                      </div>

                      {/* Password Field with Show/Hide and Auto-Gen */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Set Student Password *</label>
                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Family will use this to sign in</span>
                        </div>
                        <div className={styles.passwordInputWrapper}>
                          <input
                            type={showFormPassword ? "text" : "password"}
                            required
                            value={accStudentPassword}
                            onChange={(e) => setAccStudentPassword(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontFamily: showFormPassword ? "inherit" : "monospace" }}
                          />
                          <div className={styles.passwordActions}>
                            <button
                              type="button"
                              onClick={() => setShowFormPassword(!showFormPassword)}
                              className={styles.pwActionBtn}
                              title={showFormPassword ? "Hide password" : "Show password"}
                            >
                              {showFormPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setAccStudentPassword(generateRandomPassword("student"))}
                              className={styles.pwActionBtn}
                              title="Generate new password"
                            >
                              <RefreshCw size={12} />
                              <span>Auto-Gen</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Heritage Language Track</label>
                          <select
                            value={accStudentLang}
                            onChange={(e) => setAccStudentLang(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          >
                            <option value="Yoruba">Yoruba Track</option>
                            <option value="Igbo">Igbo Track</option>
                            <option value="Hausa">Hausa Track</option>
                            <option value="Ibibio">Ibibio Track</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Level</label>
                          <select
                            value={accStudentLevel}
                            onChange={(e) => setAccStudentLevel(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          >
                            <option value="Foundation Track (Ages 5-8)">Level 1 (Ages 5-8)</option>
                            <option value="Young Scholars (Ages 9-13)">Level 2 (Ages 9-13)</option>
                            <option value="High School & GCSE (Ages 14-18)">Level 3 (GCSE)</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Link to Parent / Guardian</label>
                          <select
                            value={accStudentParentId}
                            onChange={(e) => setAccStudentParentId(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          >
                            <option value="">Create New Guardian Automatically</option>
                            {db.parents.map((p) => (
                              <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Assign Mentor Educator</label>
                          <select
                            value={accStudentTeacherId}
                            onChange={(e) => setAccStudentTeacherId(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          >
                            <option value="">Select an educator...</option>
                            {db.teachers.map((t) => (
                              <option key={t.id} value={t.id}>{t.name} ({t.languagesTaught.join(", ")})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {!accStudentParentId && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>Guardian Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Mrs. Folake Adeyemi"
                              value={accStudentParentName}
                              onChange={(e) => setAccStudentParentName(e.target.value)}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>Guardian Email</label>
                            <input
                              type="email"
                              placeholder="folake@gmail.com"
                              value={accStudentParentEmail}
                              onChange={(e) => setAccStudentParentEmail(e.target.value)}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                        style={{ padding: "12px", justifyContent: "center", fontSize: "0.95rem" }}
                      >
                        <UserPlus size={18} /> Provision Student Account & Save Password
                      </button>
                    </form>
                  )}

                  {/* FORM B: TEACHER CREATION */}
                  {accountCreationRole === "teacher" && (
                    <form onSubmit={handleCreateTeacherAccount} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Educator Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Oluwaseun Adeleke"
                          value={accTeacherName}
                          onChange={(e) => setAccTeacherName(e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Official Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="oluwaseun@naijalang.com"
                            value={accTeacherEmail}
                            onChange={(e) => setAccTeacherEmail(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>WhatsApp / Phone</label>
                          <input
                            type="text"
                            value={accTeacherPhone}
                            onChange={(e) => setAccTeacherPhone(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Set Educator Password *</label>
                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Educator desk access password</span>
                        </div>
                        <div className={styles.passwordInputWrapper}>
                          <input
                            type={showFormPassword ? "text" : "password"}
                            required
                            value={accTeacherPassword}
                            onChange={(e) => setAccTeacherPassword(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontFamily: showFormPassword ? "inherit" : "monospace" }}
                          />
                          <div className={styles.passwordActions}>
                            <button
                              type="button"
                              onClick={() => setShowFormPassword(!showFormPassword)}
                              className={styles.pwActionBtn}
                            >
                              {showFormPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setAccTeacherPassword(generateRandomPassword("teacher"))}
                              className={styles.pwActionBtn}
                            >
                              <RefreshCw size={12} />
                              <span>Auto-Gen</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Heritage Language</label>
                          <select
                            value={accTeacherLang}
                            onChange={(e) => setAccTeacherLang(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          >
                            <option value="Yoruba">Yoruba</option>
                            <option value="Igbo">Igbo</option>
                            <option value="Hausa">Hausa</option>
                            <option value="Ibibio">Ibibio</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Faculty Title</label>
                          <input
                            type="text"
                            value={accTeacherTitle}
                            onChange={(e) => setAccTeacherTitle(e.target.value)}
                            placeholder="Senior Yoruba Instructor"
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Pedagogical Accreditation & Qualifications</label>
                        <textarea
                          rows={3}
                          value={accTeacherBio}
                          onChange={(e) => setAccTeacherBio(e.target.value)}
                          placeholder="Certified native linguist with 8+ years diaspora pedagogy experience."
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                        />
                      </div>

                      <button
                        type="submit"
                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                        style={{ padding: "12px", justifyContent: "center", fontSize: "0.95rem", background: "#16a34a" }}
                      >
                        <GraduationCap size={18} /> Provision Educator Account & Save Password
                      </button>
                    </form>
                  )}

                  {/* FORM C: PARENT CREATION */}
                  {accountCreationRole === "parent" && (
                    <form onSubmit={handleCreateParentAccount} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Parent / Guardian Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Folake Adeyemi"
                          value={accParentName}
                          onChange={(e) => setAccParentName(e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="folake@gmail.com"
                            value={accParentEmail}
                            onChange={(e) => setAccParentEmail(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Phone / WhatsApp</label>
                          <input
                            type="text"
                            value={accParentPhone}
                            onChange={(e) => setAccParentPhone(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Set Parent Portal Password *</label>
                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Confidential family billing password</span>
                        </div>
                        <div className={styles.passwordInputWrapper}>
                          <input
                            type={showFormPassword ? "text" : "password"}
                            required
                            value={accParentPassword}
                            onChange={(e) => setAccParentPassword(e.target.value)}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontFamily: showFormPassword ? "inherit" : "monospace" }}
                          />
                          <div className={styles.passwordActions}>
                            <button
                              type="button"
                              onClick={() => setShowFormPassword(!showFormPassword)}
                              className={styles.pwActionBtn}
                            >
                              {showFormPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setAccParentPassword(generateRandomPassword("parent"))}
                              className={styles.pwActionBtn}
                            >
                              <RefreshCw size={12} />
                              <span>Auto-Gen</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>City</label>
                          <input
                            type="text"
                            value={accParentCity}
                            onChange={(e) => setAccParentCity(e.target.value)}
                            placeholder="London"
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Country</label>
                          <input
                            type="text"
                            value={accParentCountry}
                            onChange={(e) => setAccParentCountry(e.target.value)}
                            placeholder="United Kingdom"
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Billing Status</label>
                        <select
                          value={accParentBilling}
                          onChange={(e) => setAccParentBilling(e.target.value as any)}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        >
                          <option value="Active">Active Subscription</option>
                          <option value="Trial">Free Trial Period</option>
                          <option value="Past Due">Tuition Pending</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                        style={{ padding: "12px", justifyContent: "center", fontSize: "0.95rem", background: "#d97706" }}
                      >
                        <UserCheck size={18} /> Provision Parent Account & Save Password
                      </button>
                    </form>
                  )}
                </div>

                {/* Column 2: Security & Password Policies Card */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div className={styles.studioCard} style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "white" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                      <ShieldCheck size={26} color="#86efac" />
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "white" }}>
                        Role Privacy Isolation Architecture
                      </h3>
                    </div>
                    <p style={{ color: "#c7d2fe", fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 16px" }}>
                      Every account provisioned through this console is immediately isolated under our strict zero-leakage security boundaries:
                    </p>
                    <ul style={{ paddingLeft: "20px", margin: 0, color: "#e0e7ff", fontSize: "0.82rem", lineHeight: 1.7 }}>
                      <li><strong>Learners (Students):</strong> Can only view their own live lessons, assigned homework, and cultural trophy badges. No billing access.</li>
                      <li><strong>Educators (Teachers):</strong> Can only view lessons and grading queues for students assigned directly to them. No parent billing access.</li>
                      <li><strong>Parents (Guardians):</strong> Can only see academic reports and tuition receipts for their verified children.</li>
                      <li><strong>Super Admin:</strong> Holds complete 360° oversight, account lifecycle management, and password override authority.</li>
                    </ul>
                  </div>

                  <div className={styles.studioCard}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 10px", color: "#0f172a" }}>
                      Onboarding Best Practices
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.84rem", color: "#64748b" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
                        <span>Use the <strong>"Auto-Gen"</strong> button to create secure, alphanumeric passwords that meet high complexity standards.</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
                        <span>Click <strong>"Copy WhatsApp/Email Onboarding Text"</strong> on the credentials slip to instantly send ready-to-use login instructions.</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
                        <span>If a parent or educator forgets their credentials, use the <strong>"Reset Password"</strong> button in the directory table below.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: ALL ACCOUNTS & PASSWORD DIRECTORY */}
              <div className={styles.tableContainer}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 4px", color: "#0f172a" }}>
                      All Provisioned Accounts & Password Manager
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                      Inspect credentials, reveal passwords, or reset security keys on demand.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(["all", "student", "teacher", "parent"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setAccountsRoleFilter(r)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          border: "1px solid #e2e8f0",
                          background: accountsRoleFilter === r ? "#0f172a" : "white",
                          color: accountsRoleFilter === r ? "white" : "#64748b",
                          cursor: "pointer",
                          textTransform: "capitalize"
                        }}
                      >
                        {r === "all" ? `All Accounts (${allAccounts.length})` : `${r}s (${allAccounts.filter(a => a.role === r).length})`}
                      </button>
                    ))}
                  </div>
                </div>

                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Account User</th>
                      <th>System Role</th>
                      <th>Login Email (Username)</th>
                      <th>Account Password</th>
                      <th>Security & Account Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAccounts
                      .filter(acc => accountsRoleFilter === "all" || acc.role === accountsRoleFilter)
                      .filter(acc => {
                        const q = searchQuery.toLowerCase();
                        return acc.name.toLowerCase().includes(q) || acc.email.toLowerCase().includes(q) || acc.role.includes(q);
                      })
                      .map((acc) => {
                        const isRevealed = !!revealedPasswords[acc.id];
                        return (
                          <tr key={acc.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: acc.role === "student" ? "#e0e7ff" : acc.role === "teacher" ? "#dcfce7" : acc.role === "parent" ? "#fef3c7" : "#f3e8ff",
                                  color: acc.role === "student" ? "#4338ca" : acc.role === "teacher" ? "#166534" : acc.role === "parent" ? "#92400e" : "#9333ea",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 800,
                                  fontSize: "0.85rem"
                                }}>
                                  {acc.avatarLetters}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{acc.name}</div>
                                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{acc.detail}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{
                                padding: "3px 10px",
                                borderRadius: "12px",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                background: acc.role === "student" ? "#e0e7ff" : acc.role === "teacher" ? "#dcfce7" : acc.role === "parent" ? "#fef3c7" : "#f3e8ff",
                                color: acc.role === "student" ? "#4338ca" : acc.role === "teacher" ? "#166534" : acc.role === "parent" ? "#92400e" : "#9333ea",
                              }}>
                                {acc.role}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#334155" }}>
                                {acc.email}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span className={styles.pwMask}>
                                  {isRevealed ? acc.password : "••••••••••••"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setRevealedPasswords({ ...revealedPasswords, [acc.id]: !isRevealed })}
                                  className={styles.pwActionBtn}
                                  title={isRevealed ? "Hide password" : "Show password"}
                                >
                                  {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(acc.password);
                                    alert(`Password for ${acc.name} copied to clipboard!`);
                                  }}
                                  className={styles.pwActionBtn}
                                  title="Copy password"
                                >
                                  <Copy size={13} />
                                </button>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  onClick={() => {
                                    setResetTargetUser(acc);
                                    setNewResetPassword(generateRandomPassword(acc.role));
                                    setShowResetModal(true);
                                  }}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #cbd5e1",
                                    background: "white",
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                >
                                  <KeyRound size={13} color="#4338ca" />
                                  <span>Reset Password</span>
                                </button>

                                <button
                                  onClick={() => switchUser(acc.role, acc.id)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0",
                                    background: "#f8fafc",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    color: "#64748b",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                >
                                  <ExternalLink size={13} />
                                  <span>Test Portal</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
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
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Student Login Email</label>
                  <input type="email" placeholder="student@naijalang.com" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Initial Password</label>
                  <input type="text" placeholder="NijaStudent#2026" value={newStudentPassword} onChange={(e) => setNewStudentPassword(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>Initial Password</label>
                  <input type="text" value={newTeacherPassword} onChange={(e) => setNewTeacherPassword(e.target.value)} placeholder="NijaFaculty#2026" style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                </div>
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

              <div style={{ display: "flex", borderTop: "1px solid #f1f5f9", paddingTop: "14px", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddClassModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>Schedule Class</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {showResetModal && resetTargetUser && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "480px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a", color: "white", borderRadius: "16px 16px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <KeyRound size={20} color="#e0b034" />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Reset Account Password</h3>
              </div>
              <button onClick={() => setShowResetModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>User Account</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{resetTargetUser.name}</div>
                <div style={{ fontSize: "0.8rem", color: "#475569" }}>
                  {resetTargetUser.email} • <span style={{ textTransform: "capitalize", fontWeight: 600, color: "#4338ca" }}>{resetTargetUser.role}</span>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "6px" }}>New Password *</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showResetPasswordInput ? "text" : "password"}
                    required
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordInput(!showResetPasswordInput)}
                    className={styles.pwActionBtn}
                    title="Toggle Visibility"
                  >
                    {showResetPasswordInput ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewResetPassword(generateRandomPassword(resetTargetUser.role))}
                    className={styles.pwActionBtn}
                    title="Generate Random"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowResetModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>Update Password</button>
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
