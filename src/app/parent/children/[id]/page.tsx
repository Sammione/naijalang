"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  Video 
} from "lucide-react";

export default function ChildDetailPage() {
  const params = useParams();
  const childId = params?.id as string;
  const { db, roleStudents, roleAssignments, roleClasses, openMeetingLauncher } = useApp();

  // Find targeted child from role students or db
  const child = roleStudents.find(s => s.id === childId) || db.students.find(s => s.id === childId) || roleStudents[0];

  const studentClasses = roleClasses.filter(c => c.studentId === child?.id);
  const nextClass = studentClasses[0];
  const studentAssignments = roleAssignments.filter(a => a.studentId === child?.id);
  const gradedAssignments = studentAssignments.filter((a) => a.status === "graded");

  // Calculate average score
  const totalScore = gradedAssignments.reduce((acc, a) => acc + (a.grade?.score || 0), 0);
  const avgScore = gradedAssignments.length > 0 ? Math.round(totalScore / gradedAssignments.length) : (child?.attendanceRate || 100);

  const studentName = child?.name || "Enrolled Learner";
  const avatarLetter = child?.avatarLetter || studentName[0] || "S";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <Link href="/parent/children" className="text-sm text-gray-500 hover-underline mb-2 block">
            ← Back to All Children
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 className="text-3xl font-bold text-gray-900">{studentName}</h1>
            <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700 }}>
              Academic Standing: {gradedAssignments.length > 0 ? "A+ Certified" : "Enrolled"}
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Age {child?.age || 8} • {child?.enrolledLanguage || "Heritage Course"} • {child?.level || "Foundation Track"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            fontWeight: "bold",
            boxShadow: "var(--shadow-sm)"
          }}>
            {avatarLetter}
          </div>
        </div>
      </header>

      {/* Dynamic Metric Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div className="card-floating" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-gray-500)", fontSize: "0.85rem", fontWeight: 600 }}>
            <span>GRADE EVALUATION AVG</span>
            <Award size={18} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginTop: "8px" }}>
            {gradedAssignments.length > 0 ? `${avgScore}%` : "Pending First Task"}
          </div>
          <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>
            {gradedAssignments.length > 0 ? `${gradedAssignments.length} verified assessments` : "Curriculum in progress"}
          </span>
        </div>

        <div className="card-floating" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-gray-500)", fontSize: "0.85rem", fontWeight: 600 }}>
            <span>ATTENDANCE RECORD</span>
            <CheckCircle size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginTop: "8px" }}>
            {child?.attendanceRate || 100}%
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--color-gray-600)" }}>
            Live interactive attendance
          </span>
        </div>

        <div className="card-floating" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-gray-500)", fontSize: "0.85rem", fontWeight: 600 }}>
            <span>TASKS & HOMEWORK</span>
            <BookOpen size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginTop: "8px" }}>
            {gradedAssignments.length} / {studentAssignments.length}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600 }}>
            {studentAssignments.filter(a => a.status === "submitted").length} currently under review
          </span>
        </div>

        <div className="card-floating" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-gray-500)", fontSize: "0.85rem", fontWeight: 600 }}>
            <span>CULTURAL BADGES</span>
            <Sparkles size={18} color="#eab308" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)", marginTop: "8px" }}>
            {child?.badges?.length || 0}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--color-gray-600)" }}>
            Earned through mastery
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
              {nextClass.date} • {nextClass.time} (Live Interactive Video Class)
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
            <h2 className="text-xl font-semibold text-gray-900">Official Gradebook & Academic Evaluations</h2>
            <p className="text-sm text-gray-500 mt-1">
              Breakdown of scores, pronunciation accuracy, and faculty feedback.
            </p>
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary)" }}>
            {child?.enrolledLanguage || "Language Curriculum"}
          </span>
        </div>

        {studentAssignments.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {studentAssignments.map((asg) => (
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
                          Official Evaluation Verified
                        </div>
                      </div>
                    ) : asg.status === "submitted" ? (
                      <span style={{ backgroundColor: "#e0f2fe", color: "#0369a1", padding: "4px 12px", borderRadius: "12px", fontWeight: 700, fontSize: "0.8rem" }}>
                        Submitted • Awaiting Evaluation
                      </span>
                    ) : (
                      <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: "12px", fontWeight: 700, fontSize: "0.8rem" }}>
                        Pending Student Completion
                      </span>
                    )}
                  </div>
                </div>

                {/* Faculty Feedback Quote */}
                {asg.grade && (
                  <div style={{
                    backgroundColor: "white",
                    padding: "14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid #e2e8f0",
                    marginTop: "12px"
                  }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>
                      Faculty Evaluation Remarks:
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
        ) : (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--color-gray-500)" }}>
            <p>No assignments or homework tasks registered yet for this term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
