"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { GraduationCap, Users, User, ArrowRight, ShieldCheck, Sparkles, ShieldAlert } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { db, switchUser } = useApp();
  const firstStudent = db.students[0];
  const firstTeacher = db.teachers[0];
  const firstParent = db.parents[0];
  const firstAdmin = db.admins[0];

  const [role, setRole] = useState<"student" | "teacher" | "parent" | "admin">("student");
  const [email, setEmail] = useState(firstStudent?.email || "student@naijalang.com");
  const [password, setPassword] = useState("••••••••••••");

  const handleRoleSelect = (r: "student" | "teacher" | "parent" | "admin") => {
    setRole(r);
    if (r === "student") {
      setEmail(firstStudent?.email || "student@naijalang.com");
    } else if (r === "teacher") {
      setEmail(firstTeacher?.email || "educator@naijalang.com");
    } else if (r === "parent") {
      setEmail(firstParent?.email || "parent@naijalang.com");
    } else {
      setEmail(firstAdmin?.email || "admin@naijalang.com");
    }
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const req = params.get("required") as "student" | "teacher" | "parent" | "admin" | null;
      if (req && ["student", "teacher", "parent", "admin"].includes(req)) {
        handleRoleSelect(req);
      }
    }
  }, [firstParent, firstTeacher, firstStudent, firstAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "student") {
      switchUser("student", firstStudent?.id || "student-default");
      router.push("/student");
    } else if (role === "teacher") {
      switchUser("teacher", firstTeacher?.id || "teacher-default");
      router.push("/staff");
    } else if (role === "parent") {
      switchUser("parent", firstParent?.id || "parent-default");
      router.push("/parent");
    } else {
      switchUser("admin", firstAdmin?.id || "admin-ngozi");
      router.push("/admin");
    }
  };

  return (
    <div className="container" style={{ padding: "60px 0", minHeight: "85vh", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "600px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Image 
          src="/logo.png" 
          alt="Nija Language Hub" 
          width={88} 
          height={88} 
          style={{ borderRadius: "50%", border: "3px solid #e0b034", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginBottom: "12px" }}
          priority 
        />
        <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--color-primary)" }}>
          Nija Language Hub Portal
        </span>
        <h1 className="text-4xl font-bold" style={{ color: "var(--color-secondary)", marginTop: "6px" }}>
          Welcome to the Learning Hub
        </h1>
        <p className="text-lg text-gray-700" style={{ marginTop: "8px" }}>
          Select your role below to sign in. System privacy isolation is strictly enforced across all portals.
        </p>
      </div>

      {/* 4-Role Picker Tabs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "10px",
        width: "100%",
        maxWidth: "620px"
      }}>
        <button
          type="button"
          onClick={() => handleRoleSelect("student")}
          style={{
            padding: "12px 8px",
            borderRadius: "var(--radius-lg)",
            border: role === "student" ? "2px solid var(--color-primary)" : "1px solid var(--color-gray-200)",
            backgroundColor: role === "student" ? "var(--color-primary-light)" : "var(--color-surface)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            boxShadow: role === "student" ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s"
          }}
        >
          <User size={22} color={role === "student" ? "var(--color-primary)" : "var(--color-gray-500)"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: role === "student" ? "var(--color-primary)" : "var(--color-gray-700)" }}>
            Student
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--color-gray-500)" }}>Classes & Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect("teacher")}
          style={{
            padding: "12px 8px",
            borderRadius: "var(--radius-lg)",
            border: role === "teacher" ? "2px solid #16a34a" : "1px solid var(--color-gray-200)",
            backgroundColor: role === "teacher" ? "#f0fdf4" : "var(--color-surface)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            boxShadow: role === "teacher" ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s"
          }}
        >
          <GraduationCap size={22} color={role === "teacher" ? "#16a34a" : "var(--color-gray-500)"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: role === "teacher" ? "#166534" : "var(--color-gray-700)" }}>
            Educator
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--color-gray-500)" }}>Host & Grade</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect("parent")}
          style={{
            padding: "12px 8px",
            borderRadius: "var(--radius-lg)",
            border: role === "parent" ? "2px solid var(--color-secondary)" : "1px solid var(--color-gray-200)",
            backgroundColor: role === "parent" ? "var(--color-gray-100)" : "var(--color-surface)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            boxShadow: role === "parent" ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s"
          }}
        >
          <Users size={22} color={role === "parent" ? "var(--color-secondary)" : "var(--color-gray-500)"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: role === "parent" ? "var(--color-secondary)" : "var(--color-gray-700)" }}>
            Parent
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--color-gray-500)" }}>Progress & Tuition</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect("admin")}
          style={{
            padding: "12px 8px",
            borderRadius: "var(--radius-lg)",
            border: role === "admin" ? "2px solid #9333ea" : "1px solid var(--color-gray-200)",
            backgroundColor: role === "admin" ? "#faf5ff" : "var(--color-surface)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            boxShadow: role === "admin" ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s"
          }}
        >
          <ShieldCheck size={22} color={role === "admin" ? "#9333ea" : "var(--color-gray-500)"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: role === "admin" ? "#7e22ce" : "var(--color-gray-700)" }}>
            Super Admin
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--color-gray-500)" }}>360° Oversight</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="card-floating" style={{ padding: "32px", width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{
          backgroundColor: role === "student" ? "var(--color-primary-light)" : role === "teacher" ? "#f0fdf4" : role === "parent" ? "var(--color-gray-50)" : "#faf5ff",
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-600)" }}>Active Profile Preview:</div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-gray-900)" }}>
              {role === "student" && (firstStudent ? `${firstStudent.name} (Learner)` : "Student Portal")}
              {role === "teacher" && (firstTeacher ? `${firstTeacher.name} (Faculty)` : "Faculty Educator Desk")}
              {role === "parent" && (firstParent ? `${firstParent.name} (Parent/Guardian)` : "Parent & Guardian Portal")}
              {role === "admin" && (firstAdmin ? `${firstAdmin.name} (Director of Academics)` : "Super Admin Operations")}
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
            <ShieldCheck size={14} /> Ready
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="font-medium text-sm text-gray-700">Account Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-300)" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="font-medium text-sm text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-300)" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "14px",
              fontSize: "1rem",
              backgroundColor: role === "student" ? "var(--color-primary)" : role === "teacher" ? "#10302a" : role === "parent" ? "var(--color-secondary)" : "#9333ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            Sign In to {role === "student" ? "Student Portal" : role === "teacher" ? "Educator Desk" : role === "parent" ? "Parent Portal" : "Super Admin Center"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Switcher Buttons */}
        <div style={{ borderTop: "1px solid var(--color-gray-200)", paddingTop: "18px", marginTop: "4px" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-500)", display: "block", marginBottom: "8px", textAlign: "center" }}>
            Instant 1-Click Role Access
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px" }}>
            <button
              onClick={() => {
                switchUser("student", firstStudent?.id || "student-default");
                router.push("/student");
              }}
              className="btn btn-outline"
              style={{ fontSize: "0.72rem", padding: "8px 2px", textAlign: "center" }}
            >
              Student
            </button>
            <button
              onClick={() => {
                switchUser("teacher", firstTeacher?.id || "teacher-default");
                router.push("/staff");
              }}
              className="btn btn-outline"
              style={{ fontSize: "0.72rem", padding: "8px 2px", textAlign: "center" }}
            >
              Educator
            </button>
            <button
              onClick={() => {
                switchUser("parent", firstParent?.id || "parent-default");
                router.push("/parent");
              }}
              className="btn btn-outline"
              style={{ fontSize: "0.72rem", padding: "8px 2px", textAlign: "center" }}
            >
              Parent
            </button>
            <button
              onClick={() => {
                switchUser("admin", firstAdmin?.id || "admin-ngozi");
                router.push("/admin");
              }}
              className="btn btn-outline"
              style={{ fontSize: "0.72rem", padding: "8px 2px", textAlign: "center", color: "#9333ea", borderColor: "#c084fc" }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "8px" }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
