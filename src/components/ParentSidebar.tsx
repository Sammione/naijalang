"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "@/app/parent/layout.module.css";

export default function ParentSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar (only visible on mobile) */}
      <div className={styles.mobileTopBar}>
        <Link href="/" style={{ textDecoration: "none" }}><div className={styles.logo}>Nija Language Hub</div></Link>
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span className={`${styles.bar} ${isOpen ? styles.barOpen1 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen2 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen3 : ''}`}></span>
        </button>
      </div>

      {/* Sidebar Content */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.desktopLogo}>
          <Link href="/" style={{ textDecoration: "none" }}><div className={styles.logo}>Nija Language Hub</div></Link>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/parent" className={styles.navItem} onClick={() => setIsOpen(false)}>Overview</Link>
          <Link href="/parent/children" className={styles.navItem} onClick={() => setIsOpen(false)}>My Children & Grades</Link>
          <Link href="/parent/schedule" className={styles.navItem} onClick={() => setIsOpen(false)}>Classes & Live Links</Link>
          <Link href="/parent/billing" className={styles.navItem} onClick={() => setIsOpen(false)}>Pay Online & Billing</Link>
          <Link href="/student" className={styles.navItem} onClick={() => setIsOpen(false)} style={{ color: "var(--color-primary)", fontWeight: 600 }}>Student Portal</Link>
          <Link href="/staff" className={styles.navItem} onClick={() => setIsOpen(false)} style={{ color: "#166534", fontWeight: 600 }}>Staff Portal</Link>
          <Link href="/" className={styles.navItem} style={{ marginTop: "auto", color: "var(--color-gray-500)" }}>← Back to Main Site</Link>
        </nav>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>A</div>
          <div>
            <div className="font-semibold text-sm">Adewale Family</div>
            <div className="text-xs text-gray-500">Parent Account</div>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>}
    </>
  );
}
