"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useApp, UserRole } from "@/context/AppContext";
import { Lock, ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  portalName: string;
}

export default function AuthGuard({ children, requiredRole, portalName }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading, currentRole } = useApp();

  const isRoleAllowed = currentRole === requiredRole || currentRole === "admin";

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      // Allow user 1.5 seconds to see notification or redirect
      const timer = setTimeout(() => {
        router.push(`/login?required=${requiredRole}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAuthLoading, requiredRole, router]);

  if (isAuthLoading) {
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        backgroundColor: "#f8fafc"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e2e8f0",
          borderTopColor: "var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }}></div>
        <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
          Verifying security session...
        </p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, block content completely
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        backgroundColor: "#f8fafc"
      }}>
        <div style={{
          maxWidth: "480px",
          width: "100%",
          background: "white",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          padding: "36px 32px",
          textAlign: "center"
        }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#fee2e2",
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <Lock size={32} />
          </div>

          <span style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 800,
            color: "#dc2626",
            backgroundColor: "#fef2f2",
            padding: "4px 10px",
            borderRadius: "12px",
            display: "inline-block",
            marginBottom: "8px"
          }}>
            Protected Access Required
          </span>

          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
            {portalName}
          </h2>

          <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 24px" }}>
            This portal contains confidential student records and family billing. Please sign in with an authorized account to continue.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              href={`/login?required=${requiredRole}`}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "12px 20px",
                fontSize: "0.95rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <LogIn size={18} />
              Sign In to {portalName}
            </Link>

            <Link
              href="/"
              className="btn btn-outline"
              style={{
                width: "100%",
                padding: "10px 20px",
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <ArrowLeft size={16} />
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but unauthorized role (e.g. Teacher trying to see Parent Portal)
  if (!isRoleAllowed) {
    return (
      <div style={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        backgroundColor: "#f8fafc"
      }}>
        <div style={{
          maxWidth: "480px",
          width: "100%",
          background: "white",
          borderRadius: "20px",
          border: "1px solid #fed7aa",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          padding: "36px 32px",
          textAlign: "center"
        }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#ffedd5",
            color: "#ea580c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
            Role Permission Restriction
          </h2>

          <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 20px" }}>
            You are currently signed in with a <strong>{currentRole}</strong> profile. This area is reserved exclusively for <strong>{requiredRole}</strong> accounts.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              href={`/login?required=${requiredRole}`}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "12px 20px",
                fontSize: "0.95rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              Switch to {requiredRole.toUpperCase()} Account
            </Link>

            <Link
              href="/"
              className="btn btn-outline"
              style={{
                width: "100%",
                padding: "10px 20px",
                fontSize: "0.9rem"
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
}
