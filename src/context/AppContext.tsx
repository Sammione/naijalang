"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ScheduledClass {
  id: string;
  title: string;
  language: string;
  studentName: string;
  teacherName: string;
  date: string;
  time: string;
  status: "upcoming" | "live" | "completed";
  platform: "google-meet" | "zoom";
  meetingUrl: string;
  meetingId: string;
  meetingPasscode: string;
  topics: string[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  description: string;
  instructions: string;
  status: "pending" | "submitted" | "graded";
  studentSubmission?: {
    submittedAt: string;
    textResponse: string;
    fileName?: string;
    hasAudioRecording?: boolean;
    audioDuration?: string;
  };
  grade?: {
    score: number;
    letter: string;
    gradedAt: string;
    gradedBy: string;
    feedback: string;
    badges: string[];
  };
}

export interface StudentProfileData {
  id: string;
  name: string;
  age: number;
  enrolledLanguage: string;
  level: string;
  streakDays: number;
  xpPoints: number;
  assignedTeacher: string;
  avatarLetter: string;
  attendanceRate: number;
  bio: string;
  badges: Array<{ id: string; name: string; icon: string; dateEarned: string }>;
}

export interface StaffProfileData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatarLetters: string;
  languagesTaught: string[];
  rating: number;
  totalStudents: number;
  classesCompleted: number;
  bio: string;
  qualifications: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  description: string;
  amountUSD: number;
  amountNGN: number;
  status: "Paid" | "Pending" | "Upcoming";
  method: string;
  receiptUrl?: string;
}

interface AppContextType {
  classes: ScheduledClass[];
  assignments: Assignment[];
  student: StudentProfileData;
  staff: StaffProfileData;
  invoices: Invoice[];
  activeMeeting: ScheduledClass | null;
  openMeetingLauncher: (cls: ScheduledClass) => void;
  closeMeetingLauncher: () => void;
  submitAssignment: (assignmentId: string, responseText: string, fileName?: string, hasAudio?: boolean) => void;
  gradeAssignment: (assignmentId: string, score: number, feedback: string, badges: string[]) => void;
  processPayment: (amountUSD: number, amountNGN: number, method: string, planName: string) => Promise<boolean>;
  resetToDefaultData: () => void;
}

const defaultClasses: ScheduledClass[] = [
  {
    id: "cls-1",
    title: "Yoruba Tone Pairs & Conversational Greetings",
    language: "Yoruba (Foundation)",
    studentName: "Samuel Adewale",
    teacherName: "Mrs. Folashade Ojo",
    date: "Today",
    time: "16:00 - 16:50 WAT",
    status: "live",
    platform: "google-meet",
    meetingUrl: "https://meet.google.com/nai-yru-hub",
    meetingId: "nai-yru-hub",
    meetingPasscode: "YORUBA2026",
    topics: ["High, Mid, Low tone marks (Á, A, À)", "Polite morning & evening salutations", "Family member titles"]
  },
  {
    id: "cls-2",
    title: "Market Simulation & Polite Bargaining Phrases",
    language: "Yoruba (Foundation)",
    studentName: "Samuel Adewale",
    teacherName: "Mrs. Folashade Ojo",
    date: "Saturday, Sep 27",
    time: "10:00 - 10:50 WAT",
    status: "upcoming",
    platform: "zoom",
    meetingUrl: "https://zoom.us/j/84920193819",
    meetingId: "849 2019 3819",
    meetingPasscode: "593812",
    topics: ["Counting naira & kobo in Yoruba", "Asking 'Eelo ni?' (How much?)", "Complimenting goods"]
  },
  {
    id: "cls-3",
    title: "Folktale Hour: Ijapa the Tortoise & The Magic Drum",
    language: "Yoruba (Cultural Enrichment)",
    studentName: "Samuel Adewale",
    teacherName: "Mrs. Folashade Ojo",
    date: "Wednesday, Oct 1",
    time: "17:00 - 17:45 WAT",
    status: "upcoming",
    platform: "google-meet",
    meetingUrl: "https://meet.google.com/hub-tor-drum",
    meetingId: "hub-tor-drum",
    meetingPasscode: "FOLKTALE",
    topics: ["Listening comprehension", "Moral of the story discussion", "Animal vocabulary"]
  }
];

const defaultAssignments: Assignment[] = [
  {
    id: "asg-1",
    title: "Audio Practice: Yoruba Greetings for Elders vs Peers",
    subject: "Yoruba Foundation",
    dueDate: "Due Tomorrow, 18:00 WAT",
    description: "Record yourself pronouncing 3 polite greetings with correct tone marks.",
    instructions: "Please pronounce: 1. 'Ẹ káàrọ̀ mà' (Good morning ma) 2. 'Ẹ kú ìrọ̀lẹ́' (Good evening) 3. 'Báwo ni ọ̀rẹ́ mi' (How are you my friend). Pay close attention to the high tone on 'káà' and low tone on 'rọ̀'.",
    status: "submitted",
    studentSubmission: {
      submittedAt: "Today at 14:15 WAT",
      textResponse: "I practiced with mommy 3 times before recording! Hope my tone marks are clear on Ẹ káàrọ̀.",
      fileName: "samuel_greetings_yoruba.mp3",
      hasAudioRecording: true,
      audioDuration: "0:42"
    }
  },
  {
    id: "asg-2",
    title: "Worksheet: Numbers 1 to 20 & Market Fruits",
    subject: "Yoruba Foundation",
    dueDate: "Due Sep 29, 2026",
    description: "Match the Yoruba numbers (Ọ̀kan, Èjì, Ẹ̀ta...) to fruit quantities from the market scene.",
    instructions: "Write out the numbers 1 through 10 in Yoruba and translate 5 common fruits (Ọ̀sàn, Ọ̀gẹ̀dẹ̀, Ànàmọ́, etc.).",
    status: "pending"
  },
  {
    id: "asg-3",
    title: "Cultural Project: My Family Tree (Àwọn Ẹbí Mi)",
    subject: "Yoruba Culture & Heritage",
    dueDate: "Graded on Sep 22, 2026",
    description: "Draw your family tree and label your parents, siblings, and grandparents in Yoruba.",
    instructions: "Include Bàbá, Ìyá, Àbúrò, Ẹ̀gbọ́n, Bàbá Àgbà, and Ìyá Àgbà.",
    status: "graded",
    studentSubmission: {
      submittedAt: "Sep 21, 2026 at 16:30 WAT",
      textResponse: "Here is my completed family tree chart with photos of Grandma in Lagos!",
      fileName: "samuel_family_tree_project.pdf"
    },
    grade: {
      score: 98,
      letter: "A+",
      gradedAt: "Sep 22, 2026",
      gradedBy: "Mrs. Folashade Ojo",
      feedback: "Ọ kare pupo (Bravo, Samuel)! Your spelling of Bàbá Àgbà and Ìyá Àgbà was completely accurate with tone marks. Your parents must be very proud!",
      badges: ["Tone Master", "Heritage Hero", "Grammar Star"]
    }
  }
];

const defaultStudent: StudentProfileData = {
  id: "samuel-adewale",
  name: "Samuel Adewale",
  age: 8,
  enrolledLanguage: "Yoruba (Heritage Foundation)",
  level: "Level 2 — Intermediate Heritage",
  streakDays: 14,
  xpPoints: 1850,
  assignedTeacher: "Mrs. Folashade Ojo",
  avatarLetter: "S",
  attendanceRate: 98,
  bio: "Curious 8-year-old learning his ancestral Yoruba language so he can converse with grandparents in Ibadan and Lagos.",
  badges: [
    { id: "b1", name: "Greeting Virtuoso", icon: "award", dateEarned: "Sep 15, 2026" },
    { id: "b2", name: "Tone Master", icon: "music", dateEarned: "Sep 22, 2026" },
    { id: "b3", name: "14-Day Streak", icon: "streak", dateEarned: "Today" },
    { id: "b4", name: "Folktale Listener", icon: "book", dateEarned: "Sep 10, 2026" }
  ]
};

const defaultStaff: StaffProfileData = {
  id: "teacher-ojo",
  name: "Mrs. Folashade Ojo",
  title: "Senior Yoruba Linguist & Heritage Lead",
  email: "folashade.ojo@naijalang.com",
  phone: "+234 803 249 8172",
  avatarLetters: "FO",
  languagesTaught: ["Yoruba (Native/Expert)", "Igbo (Conversational)", "English"],
  rating: 4.96,
  totalStudents: 28,
  classesCompleted: 342,
  bio: "12+ years specializing in diasporic child immersion, tonal pedagogy, and interactive Nigerian cultural storytelling.",
  qualifications: [
    "B.A. African Languages & Literature, University of Ibadan",
    "Post-Graduate Diploma in Early Childhood Education",
    "Certified British & American Online Bilingual Curriculum Lead"
  ]
};

const defaultInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "NLH-2026-0901",
    date: "Sep 15, 2026",
    description: "Heritage Starter Plan — 4 Live 1-on-1 Classes + AI Tutor",
    amountUSD: 90,
    amountNGN: 125000,
    status: "Paid",
    method: "Mastercard (ending 4242)",
    receiptUrl: "#receipt"
  },
  {
    id: "inv-002",
    invoiceNumber: "NLH-2026-0815",
    date: "Aug 15, 2026",
    description: "Heritage Starter Plan — 4 Live 1-on-1 Classes + AI Tutor",
    amountUSD: 90,
    amountNGN: 125000,
    status: "Paid",
    method: "Paystack Bank Transfer (GTBank)",
    receiptUrl: "#receipt"
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<ScheduledClass[]>(defaultClasses);
  const [assignments, setAssignments] = useState<Assignment[]>(defaultAssignments);
  const [student, setStudent] = useState<StudentProfileData>(defaultStudent);
  const [staff, setStaff] = useState<StaffProfileData>(defaultStaff);
  const [invoices, setInvoices] = useState<Invoice[]>(defaultInvoices);
  const [activeMeeting, setActiveMeeting] = useState<ScheduledClass | null>(null);

  // Sync from localStorage if present
  useEffect(() => {
    try {
      const storedClasses = localStorage.getItem("nlh_classes");
      const storedAssignments = localStorage.getItem("nlh_assignments");
      const storedInvoices = localStorage.getItem("nlh_invoices");
      const storedStudent = localStorage.getItem("nlh_student");
      if (storedClasses) setClasses(JSON.parse(storedClasses));
      if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
      if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
      if (storedStudent) setStudent(JSON.parse(storedStudent));
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  const openMeetingLauncher = (cls: ScheduledClass) => {
    setActiveMeeting(cls);
  };

  const closeMeetingLauncher = () => {
    setActiveMeeting(null);
  };

  const submitAssignment = (
    assignmentId: string,
    responseText: string,
    fileName?: string,
    hasAudio?: boolean
  ) => {
    const updated = assignments.map((asg) => {
      if (asg.id === assignmentId) {
        return {
          ...asg,
          status: "submitted" as const,
          studentSubmission: {
            submittedAt: "Just now (" + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ")",
            textResponse: responseText,
            fileName: fileName || (hasAudio ? "audio_submission.mp3" : "assignment_work.pdf"),
            hasAudioRecording: !!hasAudio,
            audioDuration: hasAudio ? "0:45" : undefined
          }
        };
      }
      return asg;
    });

    setAssignments(updated);
    try {
      localStorage.setItem("nlh_assignments", JSON.stringify(updated));
    } catch {}

    // Award XP to student for submitting!
    setStudent((prev) => {
      const nextXP = prev.xpPoints + 100;
      const updatedStudent = { ...prev, xpPoints: nextXP };
      try {
        localStorage.setItem("nlh_student", JSON.stringify(updatedStudent));
      } catch {}
      return updatedStudent;
    });
  };

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

    const updated = assignments.map((asg) => {
      if (asg.id === assignmentId) {
        return {
          ...asg,
          status: "graded" as const,
          grade: {
            score,
            letter,
            gradedAt: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            gradedBy: staff.name,
            feedback,
            badges
          }
        };
      }
      return asg;
    });

    setAssignments(updated);
    try {
      localStorage.setItem("nlh_assignments", JSON.stringify(updated));
    } catch {}

    // Add any newly awarded badges to student's profile!
    if (badges.length > 0) {
      setStudent((prev) => {
        const newBadges = [...prev.badges];
        badges.forEach((bName) => {
          if (!newBadges.some((existing) => existing.name === bName)) {
            newBadges.push({
              id: "b-" + Date.now() + Math.random().toString(36).substr(2, 4),
              name: bName,
              icon: "award",
              dateEarned: "Just now"
            });
          }
        });
        const updatedStudent = { ...prev, badges: newBadges };
        try {
          localStorage.setItem("nlh_student", JSON.stringify(updatedStudent));
        } catch {}
        return updatedStudent;
      });
    }
  };

  const processPayment = async (
    amountUSD: number,
    amountNGN: number,
    method: string,
    planName: string
  ): Promise<boolean> => {
    // Simulate payment delay
    await new Promise((res) => setTimeout(res, 1200));

    const newInvoice: Invoice = {
      id: "inv-" + Date.now(),
      invoiceNumber: "NLH-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description: planName || "Heritage Starter Plan — 4 Live 1-on-1 Classes + AI Tutor",
      amountUSD,
      amountNGN,
      status: "Paid",
      method,
      receiptUrl: "#download"
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    try {
      localStorage.setItem("nlh_invoices", JSON.stringify(updatedInvoices));
    } catch {}

    return true;
  };

  const resetToDefaultData = () => {
    setClasses(defaultClasses);
    setAssignments(defaultAssignments);
    setStudent(defaultStudent);
    setStaff(defaultStaff);
    setInvoices(defaultInvoices);
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        classes,
        assignments,
        student,
        staff,
        invoices,
        activeMeeting,
        openMeetingLauncher,
        closeMeetingLauncher,
        submitAssignment,
        gradeAssignment,
        processPayment,
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
