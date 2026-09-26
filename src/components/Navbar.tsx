"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Navbar.module.css";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentRole, currentUser } = useApp();

  const getPortalInfo = () => {
    if (currentRole === "admin") {
      return { title: "Super Admin", path: "/admin", color: "#9333ea", bg: "#faf5ff" };
    }
    if (currentRole === "teacher") {
      return { title: "Educator Desk", path: "/staff", color: "#166534", bg: "#f0fdf4" };
    }
    if (currentRole === "parent") {
      return { title: "Parent Portal", path: "/parent", color: "var(--color-secondary)", bg: "var(--color-gray-100)" };
    }
    return { title: "Student Portal", path: "/student", color: "var(--color-primary)", bg: "var(--color-primary-light)" };
  };

  const portal = getPortalInfo();

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <Image 
            src="/logo.png" 
            alt="Nija Language Hub Logo" 
            width={46} 
            height={46} 
            style={{ borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", border: "2px solid #e0b034" }} 
            priority
          />
          <span style={{ fontWeight: 800, letterSpacing: "-0.02em", color: "var(--color-secondary)" }}>
            Nija Language Hub
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
          <div className={styles.navLinks}>
            <Link href="/languages" onClick={() => setIsOpen(false)}>Languages</Link>
            <Link href="/programs" onClick={() => setIsOpen(false)}>Programs</Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>About Us</Link>
          </div>
          <div className={styles.navActions}>
            <Link 
              href={portal.path} 
              className="btn btn-outline" 
              onClick={() => setIsOpen(false)}
              style={{
                borderColor: portal.color,
                color: portal.color,
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "8px 14px"
              }}
            >
              My {portal.title}
            </Link>
            <Link href="/login" className="btn btn-secondary" onClick={() => setIsOpen(false)} style={{ padding: "8px 16px" }}>
              Switch Portal
            </Link>
            <Link href="/trial" className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Book a Trial
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span className={`${styles.bar} ${isOpen ? styles.barOpen1 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen2 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen3 : ''}`}></span>
        </button>
      </div>
    </nav>
  );
}
