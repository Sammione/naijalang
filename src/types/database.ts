export type UserRole = "admin" | "teacher" | "parent" | "student";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  title: string;
  department: string;
  avatarLetters: string;
  lastActive: string;
}

export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "teacher";
  title: string;
  avatarLetters: string;
  languagesTaught: string[];
  assignedStudentIds: string[];
  totalStudents?: number;
  rating: number;
  classesCompleted: number;
  bio: string;
  qualifications: string[];
}

export interface ParentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "parent";
  childrenIds: string[];
  billingStatus: "Active" | "Past Due" | "Trial";
  accountCreated: string;
  city: string;
  country: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  dateEarned: string;
}

export interface StudentUser {
  id: string;
  parentId: string;
  name: string;
  email: string;
  age: number;
  role: "student";
  enrolledLanguage: string;
  level: string;
  streakDays: number;
  xpPoints: number;
  assignedTeacherId: string;
  assignedTeacher?: string;
  avatarLetter: string;
  attendanceRate: number;
  bio: string;
  badges: Badge[];
}

export interface ScheduledClass {
  id: string;
  title: string;
  language: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  status: "upcoming" | "live" | "completed";
  platform: "google-meet" | "zoom";
  meetingUrl: string;
  meetingId: string;
  meetingPasscode: string;
  topics: string[];
}

export interface StudentSubmission {
  submittedAt: string;
  textResponse: string;
  fileName?: string;
  hasAudioRecording?: boolean;
  audioDuration?: string;
}

export interface GradeRecord {
  score: number;
  letter: string;
  gradedAt: string;
  gradedById: string;
  gradedBy: string;
  feedback: string;
  badges: string[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  studentId: string;
  teacherId: string;
  dueDate: string;
  description: string;
  instructions: string;
  status: "pending" | "submitted" | "graded";
  studentSubmission?: StudentSubmission;
  grade?: GradeRecord;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  parentId: string;
  studentId: string;
  date: string;
  description: string;
  amountUSD: number;
  amountNGN: number;
  status: "Paid" | "Pending" | "Upcoming";
  method: string;
  receiptUrl?: string;
}

export interface HubDatabase {
  admins: AdminUser[];
  teachers: TeacherUser[];
  parents: ParentUser[];
  students: StudentUser[];
  classes: ScheduledClass[];
  assignments: Assignment[];
  invoices: Invoice[];
}
