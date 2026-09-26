"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function MyChildren() {
  const { roleStudents } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      <header>
        <h1 className="text-3xl font-bold text-gray-900">My Children & Academic Trackers</h1>
        <p className="text-gray-500 mt-2">Manage profiles, attendance records, and track detailed progress.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--spacing-6)" }}>
        {roleStudents.length === 0 && (
          <div className="card-floating" style={{ padding: "var(--spacing-6)", textAlign: "center", color: "var(--color-gray-500)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-secondary)", marginBottom: "6px" }}>
              No Children Currently Enrolled
            </h3>
            <p style={{ fontSize: "0.85rem", margin: "0 0 16px" }}>
              Register your child in our heritage programs to track attendance and academic evaluations.
            </p>
          </div>
        )}

        {roleStudents.map((child) => (
          <div key={child.id} className="card-floating" style={{ padding: "var(--spacing-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold"
              }}>
                {child.avatarLetter}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{child.name}</h2>
                <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
                  Age {child.age} • {child.enrolledLanguage}
                </p>
                <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 700 }}>
                  Attendance: {child.attendanceRate}%
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "0.85rem", backgroundColor: "var(--color-gray-50)", padding: "10px 14px", borderRadius: "8px" }}>
              <span>Curriculum Level:</span>
              <strong>{child.level}</strong>
            </div>

            <Link href={`/parent/children/${child.id}`} className="btn btn-primary" style={{ width: "100%", display: "block", textAlign: "center" }}>
              View Academic Report Card
            </Link>
          </div>
        ))}

        <div
          onClick={() => alert("Enroll a new sibling: Contact enrollment advisor or book a trial from the main site.")}
          className="card-floating"
          style={{ padding: "var(--spacing-6)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed var(--color-gray-300)", backgroundColor: "transparent", cursor: "pointer", minHeight: "180px" }}
        >
          <div style={{ textAlign: "center", color: "var(--color-gray-500)" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>+</div>
            <p className="font-medium">Enroll Another Child</p>
          </div>
        </div>
      </div>
    </div>
  );
}
