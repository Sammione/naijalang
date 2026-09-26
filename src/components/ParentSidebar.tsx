"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "@/app/parent/layout.module.css";
import { useApp } from "@/context/AppContext";

export default function ParentSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useApp();

  const parentName = currentUser?.name || "Parent Account";
  const parentInitial = currentUser?.name?.[0] || "P";

  return (
    <>
      {/* Mobile Top Bar (only visible on mobile) */}
      <div className={styles.mobileTopBar}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <Image src="/logo.png" alt="Logo" width={34} height={34} style={{ borderRadius: "50%", border: "2px solid #e0b034" }} />
          <div className={styles.logo}>Nija Language Hub</div>
        </Link>
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span className={`${styles.bar} ${isOpen ? styles.barOpen1 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen2 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen3 : ''}`}></span>
        </button>
      </div>

      {/* Sidebar Content */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.desktopLogo}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <Image src="/logo.png" alt="Logo" width={42} height={42} style={{ borderRadius: "50%", border: "2px solid #e0b034", flexShrink: 0 }} />
            <div className={styles.logo}>Nija Language Hub</div>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/parent" className={styles.navItem} onClick={() => setIsOpen(false)}>Overview</Link>
          <Link href="/parent/children" className={styles.navItem} onClick={() => setIsOpen(false)}>My Children & Grades</Link>
          <Link href="/parent/schedule" className={styles.navItem} onClick={() => setIsOpen(false)}>Classes & Live Links</Link>
          <Link href="/parent/billing" className={styles.navItem} onClick={() => setIsOpen(false)}>Pay Online & Billing</Link>
          <Link href="/contact" className={styles.navItem} onClick={() => setIsOpen(false)} style={{ color: "var(--color-primary)" }}>Academic Support Desk</Link>
          <Link href="/" className={styles.navItem} style={{ marginTop: "auto", color: "var(--color-gray-500)" }}>← Back to Main Site</Link>
        </nav>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{parentInitial}</div>
          <div>
            <div className="font-semibold text-sm">{parentName}</div>
            <div className="text-xs text-gray-500">Parent / Guardian</div>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>}
    </>
  );
}
