import { supabase, isSupabaseConfigured } from "./supabase";
import { HubDatabase, Assignment, StudentUser, ScheduledClass, Invoice, TeacherUser, ParentUser } from "@/types/database";
import { initialDatabase } from "@/db/initialData";

export async function fetchSupabaseDatabase(): Promise<HubDatabase | null> {
  if (!supabase || !isSupabaseConfigured) {
    return null;
  }

  try {
    const [
      { data: admins },
      { data: teachers },
      { data: parents },
      { data: students },
      { data: classes },
      { data: assignments },
      { data: invoices }
    ] = await Promise.all([
      supabase.from("admins").select("*"),
      supabase.from("teachers").select("*"),
      supabase.from("parents").select("*"),
      supabase.from("students").select("*"),
      supabase.from("classes").select("*"),
      supabase.from("assignments").select("*"),
      supabase.from("invoices").select("*")
    ]);

    if (!admins) {
      return null;
    }

    // Map snake_case to camelCase
    return {
      admins: (admins || []).map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: "admin" as const,
        title: a.title,
        department: a.department,
        avatarLetters: a.avatar_letters,
        lastActive: a.last_active || "Just now"
      })),
      teachers: (teachers || []).map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        role: "teacher" as const,
        title: t.title,
        avatarLetters: t.avatar_letters,
        languagesTaught: t.languages_taught || [],
        assignedStudentIds: t.assigned_student_ids || [],
        totalStudents: t.total_students || 0,
        rating: Number(t.rating) || 5.0,
        classesCompleted: t.classes_completed || 0,
        bio: t.bio || "",
        qualifications: t.qualifications || []
      })),
      parents: (parents || []).map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        role: "parent" as const,
        childrenIds: p.children_ids || [],
        billingStatus: p.billing_status || "Active",
        accountCreated: p.account_created,
        city: p.city || "",
        country: p.country || ""
      })),
      students: (students || []).map((s) => ({
        id: s.id,
        parentId: s.parent_id,
        name: s.name,
        email: s.email,
        age: s.age,
        role: "student" as const,
        enrolledLanguage: s.enrolled_language,
        level: s.level,
        streakDays: s.streak_days || 0,
        xpPoints: s.xp_points || 0,
        assignedTeacherId: s.assigned_teacher_id,
        assignedTeacher: s.assigned_teacher,
        avatarLetter: s.avatar_letter,
        attendanceRate: s.attendance_rate || 100,
        bio: s.bio || "",
        badges: s.badges || []
      })),
      classes: (classes || []).map((c) => ({
        id: c.id,
        title: c.title,
        language: c.language,
        teacherId: c.teacher_id,
        teacherName: c.teacher_name,
        studentId: c.student_id,
        studentName: c.student_name,
        date: c.date,
        time: c.time,
        status: c.status,
        platform: c.platform,
        meetingUrl: c.meeting_url,
        meetingId: c.meeting_id,
        meetingPasscode: c.meeting_passcode,
        topics: c.topics || []
      })),
      assignments: (assignments || []).map((asg) => ({
        id: asg.id,
        title: asg.title,
        subject: asg.subject,
        studentId: asg.student_id,
        teacherId: asg.teacher_id,
        dueDate: asg.due_date,
        description: asg.description || "",
        instructions: asg.instructions || "",
        status: asg.status,
        studentSubmission: asg.student_submission,
        grade: asg.grade
      })),
      invoices: (invoices || []).map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        parentId: inv.parent_id,
        studentId: inv.student_id,
        date: inv.date,
        description: inv.description,
        amountUSD: Number(inv.amount_usd),
        amountNGN: Number(inv.amount_ngn),
        status: inv.status,
        method: inv.method,
        receiptUrl: inv.receipt_url
      }))
    };
  } catch (error) {
    console.error("Error connecting to Supabase database:", error);
    return null;
  }
}

export async function syncAssignmentSubmissionToSupabase(
  assignmentId: string, 
  submission: Assignment["studentSubmission"], 
  newXP: number, 
  studentId: string
) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from("assignments").update({
      status: "submitted",
      student_submission: submission
    }).eq("id", assignmentId);

    await supabase.from("students").update({
      xp_points: newXP
    }).eq("id", studentId);
  } catch (err) {
    console.error("Failed to sync submission to Supabase:", err);
  }
}

export async function syncAssignmentGradingToSupabase(
  assignmentId: string, 
  grade: Assignment["grade"],
  studentId: string,
  updatedBadges?: StudentUser["badges"]
) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from("assignments").update({
      status: "graded",
      grade: grade
    }).eq("id", assignmentId);

    if (updatedBadges) {
      await supabase.from("students").update({
        badges: updatedBadges
      }).eq("id", studentId);
    }
  } catch (err) {
    console.error("Failed to sync grade to Supabase:", err);
  }
}

export async function syncPaymentToSupabase(invoice: Invoice) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from("invoices").insert({
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      parent_id: invoice.parentId,
      student_id: invoice.studentId,
      date: invoice.date,
      description: invoice.description,
      amount_usd: invoice.amountUSD,
      amount_ngn: invoice.amountNGN,
      status: invoice.status,
      method: invoice.method,
      receipt_url: invoice.receiptUrl
    });
  } catch (err) {
    console.error("Failed to sync payment to Supabase:", err);
  }
}

export async function syncTeacherReassignmentToSupabase(studentId: string, teacherId: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from("students").update({
      assigned_teacher_id: teacherId
    }).eq("id", studentId);
  } catch (err) {
    console.error("Failed to sync teacher reassignment to Supabase:", err);
  }
}

export async function syncStudentToSupabase(student: StudentUser) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from("students").upsert({
      id: student.id,
      parent_id: student.parentId,
      name: student.name,
      email: student.email,
      age: student.age,
      role: "student",
      enrolled_language: student.enrolledLanguage,
      level: student.level,
      streak_days: student.streakDays || 0,
      xp_points: student.xpPoints || 0,
      assigned_teacher_id: student.assignedTeacherId,
      assigned_teacher: student.assignedTeacher || "",
      avatar_letter: student.avatarLetter || student.name[0] || "S",
      attendance_rate: student.attendanceRate || 100,
      bio: student.bio || "",
      badges: student.badges || []
    });
  } catch (err) {
    console.error("Failed to sync student to Supabase:", err);
  }
}

export async function syncTeacherToSupabase(teacher: TeacherUser) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from("teachers").upsert({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      role: "teacher",
      title: teacher.title,
      avatar_letters: teacher.avatarLetters,
      languages_taught: teacher.languagesTaught,
      assigned_student_ids: teacher.assignedStudentIds || [],
      total_students: teacher.totalStudents || 0,
      rating: teacher.rating || 5.0,
      classes_completed: teacher.classesCompleted || 0,
      bio: teacher.bio || "",
      qualifications: teacher.qualifications || []
    });
  } catch (err) {
    console.error("Failed to sync teacher to Supabase:", err);
  }
}

export async function syncParentToSupabase(parent: ParentUser) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from("parents").upsert({
      id: parent.id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      role: "parent",
      children_ids: parent.childrenIds || [],
      billing_status: parent.billingStatus,
      account_created: parent.accountCreated,
      city: parent.city || "",
      country: parent.country || ""
    });
  } catch (err) {
    console.error("Failed to sync parent to Supabase:", err);
  }
}

export async function syncClassToSupabase(cls: ScheduledClass) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from("classes").upsert({
      id: cls.id,
      title: cls.title,
      language: cls.language,
      teacher_id: cls.teacherId,
      teacher_name: cls.teacherName,
      student_id: cls.studentId,
      student_name: cls.studentName,
      date: cls.date,
      time: cls.time,
      status: cls.status,
      platform: cls.platform,
      meeting_url: cls.meetingUrl,
      meeting_id: cls.meetingId,
      meeting_passcode: cls.meetingPasscode,
      topics: cls.topics || []
    });
  } catch (err) {
    console.error("Failed to sync class to Supabase:", err);
  }
}

