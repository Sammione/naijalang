"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Video, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function SamuelChildProfile() {
  const { student, assignments, classes, openMeetingLauncher } = useApp();

  const nextClass = classes[0];
  const gradedAssignments = assignments.filter((a) => a.status === "graded");

  // Calculate average score
  const totalScore = gradedAssignments.reduce((acc, a) => acc + (a.grade?.score || 0), 0);
  const avgScore = gradedAssignments.length > 0 ? Math.round(totalScore / gradedAssignments.length) : 98;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <Link href="/parent/children" className="text-sm text-gray-500 hover-underline mb-2 block">
            ← Back to All Children
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700 }}>
              Academic Standing: A+ (Top 5%)
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Age {student.age} • {student.enrolledLanguage} • {student.level}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/student" className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "8px 16px" }}>
            Switch to Student View
          </Link>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "bold",
            boxShadow: "var(--shadow-sm)"
          }}>
            {student.avatarLetter}
          </div>
        </div>
      </header>

      {/* Quick Academic Metric Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div className="card-floating" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-gray-500)", fontSize: "0.85rem", fontWeight: 600 }}>
            <span>OVERALL GRADE AVG</span>
            <Award size={18} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginTop: "8px" }}>
            {avgScore}%
          </div>
          <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>
            ↑ +4% since last evaluation
          </span>
        </div>

        <div className="card-floating" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-gray-500)", fontSize: "0.85rem", fontWeight: 600 }}>
            <span>ATTENDANCE RECORD</span>
            <CheckCircle size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginTop: "8px" }}>
            {student.attendanceRate}%
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--color-gray-600)" }}>
            16 of 16 live sessions attended
          </span>
        </div>

        <div className="card-floating" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-gray-500)", fontSize: "0.85rem", fontWeight: 600 }}>
            <span>ASSIGNMENTS COMPLETED</span>
            <BookOpen size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginTop: "8px" }}>
            {assignments.filter(a => a.status === "graded").length} / {assignments.length}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600 }}>
            1 currently under teacher review
          </span>
        </div>

        <div className="card-floating" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-gray-500)", fontSize: "0.85rem", fontWeight: 600 }}>
            <span>CULTURAL BADGES</span>
            <Sparkles size={18} color="#eab308" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginTop: "8px" }}>
            {student.badges.length}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--color-gray-600)" }}>
            Mastered 14-day study streak
          </span>
        </div>
      </div>

      {/* Up Next Class with Start Now */}
      {nextClass && (
        <div style={{
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          borderLeft: "6px solid #16a34a",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#16a34a", letterSpacing: "0.06em" }}>
              Next Scheduled Lesson
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-secondary)", margin: "4px 0" }}>
              {nextClass.title}
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-gray-600)" }}>
              {nextClass.date} • {nextClass.time} with <strong>{nextClass.teacherName}</strong>
            </p>
          </div>

          <button
            onClick={() => openMeetingLauncher(nextClass)}
            className="btn btn-primary"
            style={{
              padding: "12px 24px",
              backgroundColor: "#16a34a",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Video size={18} />
            Join / Start Now (Zoom / Meet)
          </button>
        </div>
      )}

      {/* Comprehensive Grading System & Assessment History */}
      <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Official Gradebook & Teacher Evaluations</h2>
            <p className="text-sm text-gray-500 mt-1">
              Detailed breakdown of scores, tone accuracy, and teacher remarks.
            </p>
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary)" }}>
            Curriculum: Yoruba Heritage (Level 2)
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {assignments.map((asg) => (
            <div
              key={asg.id}
              style={{
                backgroundColor: asg.status === "graded" ? "#fdfbf7" : "var(--color-gray-50)",
                border: "1px solid var(--color-gray-200)",
                borderRadius: "var(--radius-md)",
                padding: "20px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                    {asg.subject}
                  </span>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--color-secondary)", margin: "2px 0 0" }}>
                    {asg.title}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                    Due / Submitted: {asg.dueDate}
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>
                  {asg.status === "graded" && asg.grade ? (
                    <div>
                      <span style={{
                        display: "inline-block",
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontWeight: 800,
                        fontSize: "0.95rem"
                      }}>
                        {asg.grade.score} / 100 ({asg.grade.letter})
                      </span>
                      <div style={{ fontSize: "0.7rem", color: "var(--color-gray-500)", marginTop: "2px" }}>
                        Graded by {asg.grade.gradedBy}
                      </div>
                    </div>
                  ) : asg.status === "submitted" ? (
                    <span style={{ backgroundColor: "#e0f2fe", color: "#0369a1", padding: "4px 12px", borderRadius: "12px", fontWeight: 700, fontSize: "0.8rem" }}>
                      Submitted • Awaiting Teacher Grading
                    </span>
                  ) : (
                    <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: "12px", fontWeight: 700, fontSize: "0.8rem" }}>
                      Pending Student Completion
                    </span>
                  )}
                </div>
              </div>

              {/* Teacher Feedback Quote */}
              {asg.grade && (
                <div style={{
                  backgroundColor: "white",
                  padding: "14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid #e2e8f0",
                  marginTop: "12px"
                }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>
                    Teacher Note from {asg.grade.gradedBy}:
                  </div>
                  <p style={{ margin: 0, fontSize: "0.88rem", fontStyle: "italic", color: "#334155" }}>
                    "{asg.grade.feedback}"
                  </p>
                  {asg.grade.badges && asg.grade.badges.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                      {asg.grade.badges.map((b, i) => (
                        <span key={i} style={{ backgroundColor: "#fef9c3", color: "#854d0e", border: "1px solid #fde047", fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: "8px" }}>
                          Awarded: {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Language Skill Proficiency Meters */}
      <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
        <h2 className="text-xl font-semibold mb-6">Language Competency Dimensions</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: "600", marginBottom: "6px" }}>
              <span>Speaking & Tonal Inflection (Do-Re-Mi)</span>
              <span>88%</span>
            </div>
            <div style={{ width: "100%", height: "10px", backgroundColor: "var(--color-gray-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div style={{ height: "100%", backgroundColor: "var(--color-primary)", width: "88%", borderRadius: "var(--radius-full)" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: "600", marginBottom: "6px" }}>
              <span>Listening Comprehension & Native Accents</span>
              <span>92%</span>
            </div>
            <div style={{ width: "100%", height: "10px", backgroundColor: "var(--color-gray-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div style={{ height: "100%", backgroundColor: "var(--color-accent)", width: "92%", borderRadius: "var(--radius-full)" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: "600", marginBottom: "6px" }}>
              <span>Cultural Proverbs & Folktales</span>
              <span>95%</span>
            </div>
            <div style={{ width: "100%", height: "10px", backgroundColor: "var(--color-gray-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div style={{ height: "100%", backgroundColor: "#eab308", width: "95%", borderRadius: "var(--radius-full)" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
