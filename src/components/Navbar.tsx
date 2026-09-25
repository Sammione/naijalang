"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>Nija Language Hub</Link>
        
        {/* Desktop Menu */}
        <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
          <div className={styles.navLinks}>
            <Link href="/languages" onClick={() => setIsOpen(false)}>Languages</Link>
            <Link href="/programs" onClick={() => setIsOpen(false)}>Programs</Link>
            <Link href="/student" onClick={() => setIsOpen(false)} style={{ color: "var(--color-primary)", fontWeight: 600 }}>Student Portal</Link>
            <Link href="/staff" onClick={() => setIsOpen(false)} style={{ color: "#166534", fontWeight: 600 }}>Staff Portal</Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
          </div>
          <div className={styles.navActions}>
            <Link href="/parent" className="btn btn-outline" onClick={() => setIsOpen(false)}>Parent Portal</Link>
            <Link href="/login" className="btn btn-secondary" onClick={() => setIsOpen(false)} style={{ padding: "8px 16px" }}>Login</Link>
            <Link href="/trial" className="btn btn-primary" onClick={() => setIsOpen(false)}>Book a Trial</Link>
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
