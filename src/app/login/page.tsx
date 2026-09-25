"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Users, User, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "staff" | "parent">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleSelect = (r: "student" | "staff" | "parent") => {
    setRole(r);
    if (r === "student") {
      setEmail("samuel.adewale@student.naijalang.com");
      setPassword("••••••••••••");
    } else if (r === "staff") {
      setEmail("folashade.ojo@staff.naijalang.com");
      setPassword("••••••••••••");
    } else {
      setEmail("adewale.olumide@parent.naijalang.com");
      setPassword("••••••••••••");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "student") router.push("/student");
    else if (role === "staff") router.push("/staff");
    else router.push("/parent");
  };

  return (
    <div className="container" style={{ padding: "80px 0", minHeight: "80vh", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--color-primary)" }}>
          Nija Language Hub Portal
        </span>
        <h1 className="text-4xl font-bold" style={{ color: "var(--color-secondary)", marginTop: "6px" }}>
          Welcome to the Learning Hub
        </h1>
        <p className="text-lg text-gray-700" style={{ marginTop: "8px" }}>
          Select your portal below to sign in or jump in directly using quick demo access.
        </p>
      </div>

      {/* Role Picker Tabs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "12px",
        width: "100%",
        maxWidth: "520px"
      }}>
        <button
          type="button"
          onClick={() => handleRoleSelect("student")}
          style={{
            padding: "14px 10px",
            borderRadius: "var(--radius-lg)",
            border: role === "student" ? "2px solid var(--color-primary)" : "1px solid var(--color-gray-200)",
            backgroundColor: role === "student" ? "var(--color-primary-light)" : "var(--color-surface)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            boxShadow: role === "student" ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s"
          }}
        >
          <User size={24} color={role === "student" ? "var(--color-primary)" : "var(--color-gray-500)"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: role === "student" ? "var(--color-primary)" : "var(--color-gray-700)" }}>
            Student
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--color-gray-500)" }}>Classes & Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect("staff")}
          style={{
            padding: "14px 10px",
            borderRadius: "var(--radius-lg)",
            border: role === "staff" ? "2px solid #16a34a" : "1px solid var(--color-gray-200)",
            backgroundColor: role === "staff" ? "#f0fdf4" : "var(--color-surface)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            boxShadow: role === "staff" ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s"
          }}
        >
          <GraduationCap size={24} color={role === "staff" ? "#16a34a" : "var(--color-gray-500)"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: role === "staff" ? "#166534" : "var(--color-gray-700)" }}>
            Staff & Educator
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--color-gray-500)" }}>Host & Grade</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect("parent")}
          style={{
            padding: "14px 10px",
            borderRadius: "var(--radius-lg)",
            border: role === "parent" ? "2px solid var(--color-secondary)" : "1px solid var(--color-gray-200)",
            backgroundColor: role === "parent" ? "var(--color-gray-100)" : "var(--color-surface)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            boxShadow: role === "parent" ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s"
          }}
        >
          <Users size={24} color={role === "parent" ? "var(--color-secondary)" : "var(--color-gray-500)"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: role === "parent" ? "var(--color-secondary)" : "var(--color-gray-700)" }}>
            Parent Portal
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--color-gray-500)" }}>Grades & Pay</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="card-floating" style={{ padding: "36px", width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{
          backgroundColor: role === "student" ? "var(--color-primary-light)" : role === "staff" ? "#f0fdf4" : "var(--color-gray-50)",
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-600)" }}>Active Profile Preview:</div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-gray-900)" }}>
              {role === "student" ? "Samuel Adewale (Learner)" : role === "staff" ? "Mrs. Folashade Ojo (Senior Educator)" : "Adewale Olumide (Parent)"}
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
              value={email || (role === "student" ? "samuel.adewale@student.naijalang.com" : role === "staff" ? "folashade.ojo@staff.naijalang.com" : "adewale.olumide@parent.naijalang.com")}
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
              value={password || "••••••••••••"}
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
              backgroundColor: role === "student" ? "var(--color-primary)" : role === "staff" ? "#10302a" : "var(--color-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            Sign In to {role === "student" ? "Student Portal" : role === "staff" ? "Staff Portal" : "Parent Dashboard"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Switcher Buttons */}
        <div style={{ borderTop: "1px solid var(--color-gray-200)", paddingTop: "18px", marginTop: "4px" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-gray-500)", display: "block", marginBottom: "8px", textAlign: "center" }}>
            Instant One-Click Demo Access
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            <Link
              href="/student"
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "8px 4px", textAlign: "center", textDecoration: "none" }}
            >
              Open Student
            </Link>
            <Link
              href="/staff"
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "8px 4px", textAlign: "center", textDecoration: "none" }}
            >
              Open Staff
            </Link>
            <Link
              href="/parent"
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "8px 4px", textAlign: "center", textDecoration: "none" }}
            >
              Open Parent
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
