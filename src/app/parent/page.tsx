"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Video, Award, BookOpen, CreditCard, Sparkles, ArrowRight } from "lucide-react";

export default function ParentDashboard() {
  const { student, classes, assignments, openMeetingLauncher } = useApp();
  const nextClass = classes[0];
  const gradedAssignments = assignments.filter((a) => a.status === "graded");
  const latestGraded = gradedAssignments[0];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1>Good morning, Adewale</h1>
          <p className="text-gray-500 text-lg">Here's what's happening with Samuel's language learning.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/student" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
            Student Portal
          </Link>
          <Link href="/parent/billing" className="btn btn-primary" style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <CreditCard size={15} /> Pay Tuition Online
          </Link>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
          {/* Next Class Widget */}
          {nextClass && (
            <section className={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 className="text-xl font-semibold">Up Next</h2>
                <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 700, backgroundColor: "#dcfce7", padding: "2px 8px", borderRadius: "10px" }}>
                  Zoom & Meet Ready
                </span>
              </div>
              <div className={styles.classInfo}>
                <div className={styles.classTime}>
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">{nextClass.date}</span>
                  <span className="text-2xl font-bold">{nextClass.time.split(" ")[0]}</span>
                </div>
                <div className={styles.classDetails}>
                  <h3 className="font-semibold text-xl">{nextClass.title}</h3>
                  <p className="text-gray-600 text-sm">Student: {nextClass.studentName} • Teacher: {nextClass.teacherName}</p>
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
          )}

          {/* Graded Classwork & Homework Alert */}
          {latestGraded && (
            <section className={styles.card} style={{ borderLeft: "5px solid #16a34a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 className="font-semibold text-lg" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-secondary)" }}>
                  <Award size={18} color="#16a34a" /> Latest Graded Assignment
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
                <Link href="/parent/children/samuel" className="text-primary text-sm font-medium hover-underline">
                  View Full Report Card →
                </Link>
              </div>
            </section>
          )}

          {/* Culture Calendar Snippet */}
          <section className={styles.card}>
             <h2 className="text-xl font-semibold mb-4">Culture Calendar</h2>
             <div style={{ padding: '16px', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                 <span className="font-bold text-gray-900">New Yam Festival (Ìjẹyán)</span>
                 <span className="text-xs font-bold text-accent uppercase">In 3 Days</span>
               </div>
               <p className="text-sm text-gray-600">A special 10-minute cultural module has been added to Samuel's practice dashboard!</p>
             </div>
          </section>
        </div>

        {/* Right Column: Progress */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className="text-xl font-semibold">Samuel's Progress & Grades</h2>
            <Link href="/parent/children/samuel" className="text-primary text-sm font-medium hover-underline">View Full Profile →</Link>
          </div>
          
          <div className={styles.progressList}>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Speaking & Tones (Tonal Marks)</span>
                <span>88%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '88%'}}></div></div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Listening Comprehension</span>
                <span>92%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '92%'}}></div></div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Vocabulary Retention & Numbers</span>
                <span>85%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '85%'}}></div></div>
            </div>
          </div>

          <div className={styles.teacherNote}>
            <h4 className="font-semibold text-sm mb-2 text-gray-900" style={{ position: 'relative', zIndex: 1 }}>Note from Mrs. Folashade Ojo</h4>
            <p className="text-base italic text-gray-700" style={{ position: 'relative', zIndex: 1 }}>
              "Samuel is becoming very confident with his greetings and tone pairs! This week, try to practice market vocabulary with him at home."
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <Link href="/parent/children/samuel" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                View Grades & Badges
              </Link>
              <button
                onClick={() => alert("Message sent to Mrs. Ojo via WhatsApp educator line!")}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Message Teacher
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
