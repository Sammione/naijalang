"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  UserRole, 
  AdminUser, 
  TeacherUser, 
  ParentUser, 
  StudentUser, 
  ScheduledClass, 
  Assignment, 
  Invoice, 
  HubDatabase 
} from "@/types/database";
import { initialDatabase } from "@/db/initialData";
import { 
  fetchSupabaseDatabase, 
  syncAssignmentSubmissionToSupabase, 
  syncAssignmentGradingToSupabase, 
  syncPaymentToSupabase, 
  syncTeacherReassignmentToSupabase,
  syncStudentToSupabase,
  syncTeacherToSupabase,
  syncParentToSupabase,
  syncClassToSupabase
} from "@/lib/supabaseService";
import { isSupabaseConfigured } from "@/lib/supabase";

export type { 
  UserRole, 
  AdminUser, 
  TeacherUser, 
  ParentUser, 
  StudentUser, 
  ScheduledClass, 
  Assignment, 
  Invoice, 
  HubDatabase 
};

interface AppContextType {
  // Database instance
  db: HubDatabase;
  isSupabaseConnected: boolean;

  // Active Session & Authentication
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  currentRole: UserRole;
  currentUser: AdminUser | TeacherUser | ParentUser | StudentUser;
  switchUser: (role: UserRole, id?: string) => void;
  loginUser: (role: UserRole, id?: string) => void;
  logout: () => void;

  // Role-Isolated Queries
  roleClasses: ScheduledClass[];
  roleAssignments: Assignment[];
  roleStudents: StudentUser[];
  roleTeachers: TeacherUser[];
  roleParents: ParentUser[];
  roleInvoices: Invoice[];

  // Legacy convenience properties (role-aware)
  classes: ScheduledClass[];
  assignments: Assignment[];
  student: StudentUser;
  staff: TeacherUser;
  invoices: Invoice[];

  // Interactive Live Meetings
  activeMeeting: ScheduledClass | null;
  openMeetingLauncher: (cls: ScheduledClass) => void;
  closeMeetingLauncher: () => void;

  // Operations
  submitAssignment: (assignmentId: string, responseText: string, fileName?: string, hasAudio?: boolean) => void;
  gradeAssignment: (assignmentId: string, score: number, feedback: string, badges: string[]) => void;
  processPayment: (amountUSD: number, amountNGN: number, method: string, planName: string, studentId?: string) => Promise<boolean>;
  
  // Admin Operations
  adminAssignTeacher: (studentId: string, teacherId: string) => void;
  adminCreateClass: (newClass: Omit<ScheduledClass, "id">) => void;
  adminCreateStudent: (newStudent: Omit<StudentUser, "id">) => void;
  adminCreateTeacher: (newTeacher: Omit<TeacherUser, "id">) => void;
  adminCreateParent: (newParent: Omit<ParentUser, "id">) => void;
  adminUpdateStudentStatus: (studentId: string, updates: Partial<StudentUser>) => void;

  // Reset database
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<HubDatabase>(initialDatabase);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const [currentUserId, setCurrentUserId] = useState<string>("student-active");
  const [activeMeeting, setActiveMeeting] = useState<ScheduledClass | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured);

  // Sync from Supabase or localStorage on mount
  useEffect(() => {
    try {
      const storedDb = localStorage.getItem("nlh_database_v2");
      const storedAuth = localStorage.getItem("nlh_auth_v2");
      const storedRole = localStorage.getItem("nlh_role_v2") as UserRole | null;
      const storedUserId = localStorage.getItem("nlh_userid_v2");

      if (storedDb) {
        setDb(JSON.parse(storedDb));
      }
      if (storedAuth === "true" && storedRole) {
        setIsAuthenticated(true);
        setCurrentRole(storedRole);
        if (storedUserId) {
          setCurrentUserId(storedUserId);
        }
      } else {
        setIsAuthenticated(false);
      }

      // If Supabase is configured with real URL and key, fetch live tables
      if (isSupabaseConfigured) {
        fetchSupabaseDatabase().then((liveDb) => {
          if (liveDb) {
            setDb(liveDb);
            setIsSupabaseConnected(true);
          }
        });
      }
    } catch {
      // Local storage unavailable
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const saveDb = (updated: HubDatabase) => {
    setDb(updated);
    try {
      localStorage.setItem("nlh_database_v2", JSON.stringify(updated));
    } catch {}
  };

  // Safe default fallback objects when tables are empty
  const defaultAdmin: AdminUser = {
    id: "admin-ngozi",
    name: "Dr. Ngozi Balogun",
    email: "admin@naijalang.com",
    role: "admin",
    title: "Director of Academics",
    department: "Hub Operations",
    avatarLetters: "NB",
    lastActive: "Active Now"
  };

  const defaultTeacher: TeacherUser = {
    id: "teacher-default",
    name: "Faculty Educator",
    email: "educator@naijalang.com",
    phone: "+234 800 000 0000",
    role: "teacher",
    title: "Heritage Language Educator",
    avatarLetters: "FE",
    languagesTaught: ["Yoruba", "Igbo", "Hausa", "Ibibio"],
    assignedStudentIds: [],
    totalStudents: 0,
    rating: 5.0,
    classesCompleted: 0,
    bio: "Certified native language educator specializing in diaspora heritage acquisition.",
    qualifications: [
      "Certified African Language Pedagogy Specialist",
      "Over 10 years of immersive language instruction",
      "Verified heritage culture mentor"
    ]
  };

  const defaultParent: ParentUser = {
    id: "parent-default",
    name: "Parent / Guardian",
    email: "parent@naijalang.com",
    phone: "+1 234 567 8900",
    role: "parent",
    childrenIds: [],
    billingStatus: "Active",
    accountCreated: "Recently",
    city: "Lagos",
    country: "Nigeria"
  };

  const defaultStudent: StudentUser = {
    id: "student-default",
    parentId: "parent-default",
    name: "Heritage Learner",
    email: "student@naijalang.com",
    age: 8,
    role: "student",
    enrolledLanguage: "Heritage Course",
    level: "Foundation Track",
    streakDays: 0,
    xpPoints: 0,
    assignedTeacherId: "teacher-default",
    assignedTeacher: "Faculty Educator",
    avatarLetter: "H",
    attendanceRate: 100,
    bio: "Student learning Nigerian heritage languages.",
    badges: []
  };

  // Derive current user object
  const getCurrentUser = (): AdminUser | TeacherUser | ParentUser | StudentUser => {
    if (currentRole === "admin") {
      return db.admins.find((a) => a.id === currentUserId) || db.admins[0] || defaultAdmin;
    }
    if (currentRole === "teacher") {
      return db.teachers.find((t) => t.id === currentUserId) || db.teachers[0] || defaultTeacher;
    }
    if (currentRole === "parent") {
      return db.parents.find((p) => p.id === currentUserId) || db.parents[0] || defaultParent;
    }
    return db.students.find((s) => s.id === currentUserId) || db.students[0] || defaultStudent;
  };

  const currentUser = getCurrentUser();

  const loginUser = (role: UserRole, id?: string) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    try {
      localStorage.setItem("nlh_auth_v2", "true");
      localStorage.setItem("nlh_role_v2", role);
    } catch {}

    let nextId = id;
    if (!nextId) {
      if (role === "admin") nextId = db.admins[0]?.id || "admin-ngozi";
      else if (role === "teacher") nextId = db.teachers[0]?.id || "teacher-default";
      else if (role === "parent") nextId = db.parents[0]?.id || "parent-default";
      else nextId = db.students[0]?.id || "student-default";
    }
    setCurrentUserId(nextId);
    try {
      localStorage.setItem("nlh_userid_v2", nextId);
    } catch {}
  };

  const switchUser = (role: UserRole, id?: string) => {
    loginUser(role, id);
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("nlh_auth_v2");
      localStorage.removeItem("nlh_role_v2");
      localStorage.removeItem("nlh_userid_v2");
    } catch {}
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // ==========================================
  // PRIVACY ISOLATION FILTERS
  // ==========================================

  // 1. CLASSES
  // Admin: All classes
  // Teacher: ONLY classes they teach
  // Parent: ONLY classes for their children (sanitized: no teacher private info)
  // Student: ONLY classes they attend
  const roleClasses: ScheduledClass[] = React.useMemo(() => {
    if (currentRole === "admin") return db.classes;
    if (currentRole === "teacher") {
      return db.classes.filter((c) => c.teacherId === currentUser.id);
    }
    if (currentRole === "parent") {
      const parentUser = currentUser as ParentUser;
      const childIds = parentUser.childrenIds || [];
      return db.classes.filter((c) => childIds.includes(c.studentId));
    }
    // Student
    return db.classes.filter((c) => c.studentId === currentUser.id);
  }, [db.classes, currentRole, currentUser]);

  // 2. ASSIGNMENTS
  // Admin: All assignments
  // Teacher: ONLY assignments for their assigned students
  // Parent: ONLY assignments for their children
  // Student: ONLY assignments for this student
  const roleAssignments: Assignment[] = React.useMemo(() => {
    if (currentRole === "admin") return db.assignments;
    if (currentRole === "teacher") {
      return db.assignments.filter((a) => a.teacherId === currentUser.id);
    }
    if (currentRole === "parent") {
      const parentUser = currentUser as ParentUser;
      const childIds = parentUser.childrenIds || [];
      return db.assignments.filter((a) => childIds.includes(a.studentId));
    }
    // Student
    return db.assignments.filter((a) => a.studentId === currentUser.id);
  }, [db.assignments, currentRole, currentUser]);

  // 3. STUDENTS
  // Admin: All students
  // Teacher: ONLY assigned students (Parent identity / billing NOT attached)
  // Parent: ONLY their own children
  // Student: ONLY themselves
  const roleStudents: StudentUser[] = React.useMemo(() => {
    if (currentRole === "admin") return db.students;
    if (currentRole === "teacher") {
      const teacher = currentUser as TeacherUser;
      const studentIds = teacher.assignedStudentIds || [];
      return db.students.filter((s) => studentIds.includes(s.id));
    }
    if (currentRole === "parent") {
      const parent = currentUser as ParentUser;
      const childIds = parent.childrenIds || [];
      return db.students.filter((s) => childIds.includes(s.id));
    }
    return db.students.filter((s) => s.id === currentUser.id);
  }, [db.students, currentRole, currentUser]);

  // 4. TEACHERS
  // Admin: All teachers
  // Teacher: ONLY themselves
  // Parent: NONE (privacy rule: "parent should not see teacher")
  // Student: NONE (sanitized instructor tag only on classes)
  const roleTeachers: TeacherUser[] = React.useMemo(() => {
    if (currentRole === "admin") return db.teachers;
    if (currentRole === "teacher") {
      return db.teachers.filter((t) => t.id === currentUser.id);
    }
    // Parents and students do not access teacher directories or private credentials
    return [];
  }, [db.teachers, currentRole, currentUser]);

  // 5. PARENTS
  // Admin: All parents
  // Parent: ONLY themselves
  // Teacher: NONE (privacy rule: "teacher not see parent")
  // Student: NONE
  const roleParents: ParentUser[] = React.useMemo(() => {
    if (currentRole === "admin") return db.parents;
    if (currentRole === "parent") {
      return db.parents.filter((p) => p.id === currentUser.id);
    }
    // Teachers and Students NEVER see parent profiles
    return [];
  }, [db.parents, currentRole, currentUser]);

  // 6. INVOICES
  // Admin: All invoices
  // Parent: ONLY invoices belonging to this parent
  // Teacher: NONE (teachers have ZERO financial access)
  // Student: NONE
  const roleInvoices: Invoice[] = React.useMemo(() => {
    if (currentRole === "admin") return db.invoices;
    if (currentRole === "parent") {
      return db.invoices.filter((inv) => inv.parentId === currentUser.id);
    }
    // Teacher & Student have 0 billing access
    return [];
  }, [db.invoices, currentRole, currentUser]);

  // Backward compatible primary objects
  const activeStudent: StudentUser = React.useMemo(() => {
    if (currentRole === "student") return (currentUser as StudentUser) || db.students[0] || defaultStudent;
    if (currentRole === "parent") {
      const p = currentUser as ParentUser;
      return db.students.find((s) => p.childrenIds?.includes(s.id)) || db.students[0] || defaultStudent;
    }
    if (currentRole === "teacher") {
      const t = currentUser as TeacherUser;
      return db.students.find((s) => t.assignedStudentIds?.includes(s.id)) || db.students[0] || defaultStudent;
    }
    return db.students[0] || defaultStudent;
  }, [currentRole, currentUser, db.students, defaultStudent]);

  const activeStaff: TeacherUser = React.useMemo(() => {
    if (currentRole === "teacher") return (currentUser as TeacherUser) || db.teachers[0] || defaultTeacher;
    return db.teachers[0] || defaultTeacher;
  }, [currentRole, currentUser, db.teachers, defaultTeacher]);

  // Interactive Live Meeting launcher
  const openMeetingLauncher = (cls: ScheduledClass) => {
    setActiveMeeting(cls);
  };

  const closeMeetingLauncher = () => {
    setActiveMeeting(null);
  };

  // Student Submits Assignment
  const submitAssignment = (
    assignmentId: string,
    responseText: string,
    fileName?: string,
    hasAudio?: boolean
  ) => {
    const submission = {
      submittedAt: "Just now (" + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ")",
      textResponse: responseText,
      fileName: fileName || (hasAudio ? "voice_practice.mp3" : "completed_exercise.pdf"),
      hasAudioRecording: !!hasAudio,
      audioDuration: hasAudio ? "0:45" : undefined
    };

    const updatedAssignments = db.assignments.map((asg) => {
      if (asg.id === assignmentId) {
        return {
          ...asg,
          status: "submitted" as const,
          studentSubmission: submission
        };
      }
      return asg;
    });

    let targetStudentId = "";
    let nextXP = 0;

    // Award +100 XP to student
    const updatedStudents = db.students.map((s) => {
      const targetAsg = db.assignments.find((a) => a.id === assignmentId);
      if (targetAsg && s.id === targetAsg.studentId) {
        targetStudentId = s.id;
        nextXP = s.xpPoints + 100;
        return { ...s, xpPoints: nextXP };
      }
      return s;
    });

    const updatedDb: HubDatabase = {
      ...db,
      assignments: updatedAssignments,
      students: updatedStudents
    };

    saveDb(updatedDb);

    // Sync to Supabase in the background
    if (targetStudentId) {
      syncAssignmentSubmissionToSupabase(assignmentId, submission, nextXP, targetStudentId);
    }
  };

  // Teacher Grades Assignment
  const gradeAssignment = (
    assignmentId: string,
    score: number,
    feedback: string,
    badges: string[]
  ) => {
    let letter = "A+";
    if (score < 60) letter = "C";
    else if (score < 70) letter = "B";
    else if (score < 80) letter = "B+";
    else if (score < 90) letter = "A-";
    else if (score < 95) letter = "A";

    const targetAsg = db.assignments.find((a) => a.id === assignmentId);
    const teacherName = currentRole === "teacher" ? currentUser.name : (targetAsg?.teacherId ? db.teachers.find(t => t.id === targetAsg.teacherId)?.name || "Instructor" : "Instructor");
    const teacherId = currentRole === "teacher" ? currentUser.id : (targetAsg?.teacherId || db.teachers[0]?.id || "teacher-active");

    const gradeRecord = {
      score,
      letter,
      gradedAt: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      gradedById: teacherId,
      gradedBy: teacherName,
      feedback,
      badges
    };

    const updatedAssignments = db.assignments.map((asg) => {
      if (asg.id === assignmentId) {
        return {
          ...asg,
          status: "graded" as const,
          grade: gradeRecord
        };
      }
      return asg;
    });

    // Update student's badges if newly awarded
    let updatedStudents = db.students;
    let studentBadgesToSync: StudentUser["badges"] | undefined = undefined;

    if (targetAsg) {
      updatedStudents = db.students.map((s) => {
        if (s.id === targetAsg.studentId) {
          const newBadges = [...s.badges];
          badges.forEach((bName) => {
            if (!newBadges.some((existing) => existing.name === bName)) {
              newBadges.push({
                id: "b-" + Date.now() + Math.random().toString(36).substr(2, 4),
                name: bName,
                icon: "award",
                dateEarned: "Today"
              });
            }
          });
          studentBadgesToSync = newBadges;
          return { ...s, badges: newBadges };
        }
        return s;
      });
    }

    const updatedDb: HubDatabase = {
      ...db,
      assignments: updatedAssignments,
      students: updatedStudents
    };

    saveDb(updatedDb);

    // Sync to Supabase in the background
    if (targetAsg) {
      syncAssignmentGradingToSupabase(assignmentId, gradeRecord, targetAsg.studentId, studentBadgesToSync);
    }
  };

  // Parent Processes Payment
  const processPayment = async (
    amountUSD: number,
    amountNGN: number,
    method: string,
    planName: string,
    studentId?: string
  ): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 1000));

    const parentId = currentRole === "parent" ? currentUser.id : (db.parents[0]?.id || "parent-active");
    const assignedStudentId = studentId || (currentRole === "parent" ? (currentUser as ParentUser).childrenIds[0] : (db.students[0]?.id || "student-active"));

    const newInvoice: Invoice = {
      id: "inv-" + Date.now(),
      invoiceNumber: "NLH-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000),
      parentId,
      studentId: assignedStudentId,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description: planName || "Heritage Language Immersion — 4 Live Sessions + AI Practice",
      amountUSD,
      amountNGN,
      status: "Paid",
      method,
      receiptUrl: "#download-receipt"
    };

    const updatedDb: HubDatabase = {
      ...db,
      invoices: [newInvoice, ...db.invoices]
    };

    saveDb(updatedDb);

    // Sync to Supabase
    syncPaymentToSupabase(newInvoice);

    return true;
  };

  // Admin Assigns Teacher to Student
  const adminAssignTeacher = (studentId: string, teacherId: string) => {
    const updatedStudents = db.students.map((s) => {
      if (s.id === studentId) {
        return { ...s, assignedTeacherId: teacherId };
      }
      return s;
    });

    const updatedTeachers = db.teachers.map((t) => {
      let assigned = [...t.assignedStudentIds];
      if (t.id === teacherId) {
        if (!assigned.includes(studentId)) assigned.push(studentId);
      } else {
        assigned = assigned.filter((id) => id !== studentId);
      }
      return { ...t, assignedStudentIds: assigned };
    });

    saveDb({ ...db, students: updatedStudents, teachers: updatedTeachers });

    // Sync to Supabase
    syncTeacherReassignmentToSupabase(studentId, teacherId);
  };

  // Admin Creates New Class
  const adminCreateClass = (newClass: Omit<ScheduledClass, "id">) => {
    const id = "cls-" + Date.now();
    const created: ScheduledClass = { ...newClass, id };
    saveDb({
      ...db,
      classes: [...db.classes, created]
    });
    syncClassToSupabase(created);
  };

  // Admin Creates New Student
  const adminCreateStudent = (newStudent: Omit<StudentUser, "id">) => {
    const id = "student-" + Date.now();
    const created: StudentUser = { ...newStudent, id };
    
    // Also link to parent
    const updatedParents = db.parents.map((p) => {
      if (p.id === newStudent.parentId) {
        return { ...p, childrenIds: [...p.childrenIds, id] };
      }
      return p;
    });

    // Also link to teacher
    const updatedTeachers = db.teachers.map((t) => {
      if (t.id === newStudent.assignedTeacherId) {
        return { ...t, assignedStudentIds: [...t.assignedStudentIds, id] };
      }
      return t;
    });

    saveDb({
      ...db,
      students: [...db.students, created],
      parents: updatedParents,
      teachers: updatedTeachers
    });
    syncStudentToSupabase(created);
  };

  // Admin Creates New Teacher
  const adminCreateTeacher = (newTeacher: Omit<TeacherUser, "id">) => {
    const id = "teacher-" + Date.now();
    const created: TeacherUser = { ...newTeacher, id };
    saveDb({
      ...db,
      teachers: [...db.teachers, created]
    });
    syncTeacherToSupabase(created);
  };

  // Admin Creates New Parent
  const adminCreateParent = (newParent: Omit<ParentUser, "id">) => {
    const id = "parent-" + Date.now();
    const created: ParentUser = { ...newParent, id };
    saveDb({
      ...db,
      parents: [...db.parents, created]
    });
    syncParentToSupabase(created);
  };

  // Admin Updates Student Status
  const adminUpdateStudentStatus = (studentId: string, updates: Partial<StudentUser>) => {
    const updatedStudents = db.students.map((s) => {
      if (s.id === studentId) {
        return { ...s, ...updates };
      }
      return s;
    });
    saveDb({ ...db, students: updatedStudents });
  };

  // Reset to default
  const resetToDefaultData = () => {
    saveDb(initialDatabase);
    setCurrentRole("student");
    setCurrentUserId(initialDatabase.students[0]?.id || "student-default");
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        db,
        isSupabaseConnected,
        isAuthenticated,
        isAuthLoading,
        currentRole,
        currentUser,
        switchUser,
        loginUser,
        logout,
        roleClasses,
        roleAssignments,
        roleStudents,
        roleTeachers,
        roleParents,
        roleInvoices,
        // Legacy props
        classes: roleClasses,
        assignments: roleAssignments,
        student: activeStudent,
        staff: activeStaff,
        invoices: roleInvoices,
        activeMeeting,
        openMeetingLauncher,
        closeMeetingLauncher,
        submitAssignment,
        gradeAssignment,
        processPayment,
        adminAssignTeacher,
        adminCreateClass,
        adminCreateStudent,
        adminCreateTeacher,
        adminCreateParent,
        adminUpdateStudentStatus,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
