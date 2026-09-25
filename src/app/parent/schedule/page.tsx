"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Calendar, Video, Clock, CheckCircle } from "lucide-react";

export default function ClassesSchedule() {
  const { classes, openMeetingLauncher } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Live Class Schedule</h1>
        <p className="text-gray-500 mt-2">Manage upcoming live video sessions with your child's teachers.</p>
      </header>

      <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Calendar size={20} color="var(--color-primary)" />
          Scheduled Sessions
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
          {classes.map((cls) => (
            <div
              key={cls.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                background: cls.status === "live" ? "#f0fdf4" : "var(--color-gray-50)",
                borderRadius: "var(--radius-md)",
                border: cls.status === "live" ? "1px solid #86efac" : "1px solid var(--color-gray-200)",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span className="font-bold text-primary" style={{ fontSize: "0.85rem" }}>
                    {cls.date} • {cls.time}
                  </span>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    backgroundColor: cls.platform === "google-meet" ? "#e0f2fe" : "#fef3c7",
                    color: cls.platform === "google-meet" ? "#0369a1" : "#92400e"
                  }}>
                    {cls.platform === "google-meet" ? "Google Meet" : "Zoom"}
                  </span>
                </div>
                <h4 className="text-lg font-semibold" style={{ color: "var(--color-secondary)", margin: "0 0 2px" }}>
                  {cls.title}
                </h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-gray-600)" }}>
                  Student: <strong>{cls.studentName}</strong> • Teacher: <strong>{cls.teacherName}</strong>
                </p>
              </div>

              <button
                onClick={() => openMeetingLauncher(cls)}
                className="btn btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px"
                }}
              >
                <Video size={16} />
                {cls.status === "live" ? "Join Class Now" : "Launch Meeting Details"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
