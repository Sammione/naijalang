"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Video, Award, BookOpen, CreditCard, Sparkles, ArrowRight, HelpCircle, Calendar, CheckCircle2 } from "lucide-react";

export default function ParentDashboard() {
  const { student, roleClasses, roleAssignments, openMeetingLauncher, currentUser } = useApp();
  const nextClass = roleClasses[0];
  const gradedAssignments = roleAssignments.filter((a) => a.status === "graded");
  const latestGraded = gradedAssignments[0];

  const parentName = currentUser?.name ? currentUser.name.split(" ")[0] : "Parent";
  const childName = student?.name || "your child";

  return (
    <div className={styles.dashboard}>
      <header className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--color-primary)" }}>
            Parent & Guardian Portal
          </span>
          <h1>Welcome, {parentName}</h1>
          <p className="text-gray-500 text-lg">Here's the latest learning overview for {childName}.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/parent/billing" className="btn btn-primary" style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <CreditCard size={15} /> Pay Tuition Online
          </Link>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
          {/* Next Class Widget */}
          {nextClass ? (
            <section className={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 className="text-xl font-semibold">Upcoming Live Class</h2>
                <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 700, backgroundColor: "#dcfce7", padding: "2px 8px", borderRadius: "10px" }}>
                  Interactive Class Ready
                </span>
              </div>
              <div className={styles.classInfo}>
                <div className={styles.classTime}>
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">{nextClass.date}</span>
                  <span className="text-2xl font-bold">{nextClass.time.split(" ")[0]}</span>
                </div>
                <div className={styles.classDetails}>
                  <h3 className="font-semibold text-xl">{nextClass.title}</h3>
                  <p className="text-gray-600 text-sm">Course: {nextClass.language} • Learner: {childName}</p>
                </div>
                <button
                  onClick={() => openMeetingLauncher(nextClass)}
                  className="btn btn-primary"
                  style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Video size={16} />
                  Join Class
                </button>
              </div>
            </section>
          ) : (
            <section className={styles.card} style={{ textAlign: "center", padding: "36px 20px" }}>
              <Calendar size={36} color="var(--color-gray-400)" style={{ margin: "0 auto 12px" }} />
              <h3 className="text-lg font-bold text-gray-900">No Scheduled Classes Yet</h3>
              <p className="text-sm text-gray-500 max-w-md" style={{ margin: "4px auto 16px" }}>
                When live 1-on-1 language sessions are scheduled with your instructor, they will appear here with instant Google Meet and Zoom links.
              </p>
              <Link href="/parent/schedule" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
                View Master Timetable
              </Link>
            </section>
          )}

          {/* Graded Classwork & Homework Alert */}
          {latestGraded ? (
            <section className={styles.card} style={{ borderLeft: "5px solid #16a34a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 className="font-semibold text-lg" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-secondary)" }}>
                  <Award size={18} color="#16a34a" /> Latest Academic Evaluation
                </h3>
                <span style={{ backgroundColor: "#dcfce7", color: "#166534", fontWeight: 800, padding: "2px 10px", borderRadius: "10px", fontSize: "0.85rem" }}>
                  {latestGraded.grade?.score}/100 ({latestGraded.grade?.letter})
                </span>
              </div>
              <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: "0.95rem" }}>
                {latestGraded.title}
              </p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-gray-600)", fontStyle: "italic" }}>
                "{latestGraded.grade?.feedback}"
              </p>
              <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                <Link href="/parent/children" className="text-primary text-sm font-medium hover-underline">
                  View Full Report Card →
                </Link>
              </div>
            </section>
          ) : (
            <section className={styles.card} style={{ borderLeft: "5px solid var(--color-primary)" }}>
              <h3 className="font-semibold text-base text-gray-900 mb-1" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <BookOpen size={16} color="var(--color-primary)" /> Academic Assessments
              </h3>
              <p className="text-sm text-gray-600">
                Official marks, voice recording evaluations, and teacher feedback will be published here after assignments are reviewed.
              </p>
            </section>
          )}

          {/* Cultural Enrichment Focus */}
          <section className={styles.card}>
             <h2 className="text-xl font-semibold mb-4">Cultural Heritage Pillars</h2>
             <div style={{ padding: '16px', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                 <span className="font-bold text-gray-900">Diaspora Immersion Practice</span>
                 <span className="text-xs font-bold text-accent uppercase">Term Curriculum</span>
               </div>
               <p className="text-sm text-gray-600">
                 Our modules weave authentic Nigerian oral traditions, folklore, numbers, and respectful greetings into every live conversation.
               </p>
             </div>
          </section>
        </div>

        {/* Right Column: Progress */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className="text-xl font-semibold">{childName}'s Academic Standing</h2>
            <Link href="/parent/children" className="text-primary text-sm font-medium hover-underline">View Full Profile →</Link>
          </div>
          
          <div className={styles.progressList}>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Speaking & Tone Accuracy</span>
                <span>{student?.attendanceRate ? `${student.attendanceRate}%` : "In Progress"}</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${student?.attendanceRate || 85}%` }}></div>
              </div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Listening Comprehension</span>
                <span>{student?.xpPoints && student.xpPoints > 0 ? "Active" : "Curriculum Active"}</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '90%' }}></div>
              </div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Vocabulary & Retention</span>
                <span>Level {student?.level || "1"}</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          <div className={styles.teacherNote}>
            <h4 className="font-semibold text-sm mb-2 text-gray-900" style={{ position: 'relative', zIndex: 1 }}>
              Academic Advisory & Home Practice Recommendation
            </h4>
            <p className="text-base italic text-gray-700" style={{ position: 'relative', zIndex: 1 }}>
              {latestGraded?.grade?.feedback
                ? `"${latestGraded.grade.feedback}"`
                : "Practice daily greetings (morning and evening salutations) and common numbers with your child at home to reinforce conversational retention."}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <Link href="/parent/children" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                View Grades & Badges
              </Link>
              <button
                onClick={() => alert("Your inquiry has been submitted to the Academic Support Team. An advisor will respond within 4 hours.")}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <HelpCircle size={14} /> Contact Support Desk
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
