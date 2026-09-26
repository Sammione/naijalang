"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "@/app/parent/layout.module.css";
import { useApp } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  LifeBuoy, 
  ArrowLeft 
} from "lucide-react";

export default function ParentSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser } = useApp();

  const parentName = currentUser?.name || "Parent Account";
  const parentInitial = currentUser?.name?.[0] || "P";

  const navLinks = [
    { href: "/parent", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/parent/children", label: "My Children & Grades", icon: GraduationCap },
    { href: "/parent/schedule", label: "Classes & Live Links", icon: Calendar },
    { href: "/parent/billing", label: "Pay Online & Billing", icon: CreditCard },
    { href: "/contact", label: "Academic Support Desk", icon: LifeBuoy },
  ];

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Bar */}
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
            <div className={styles.logo} style={{ margin: 0, padding: 0 }}>Nija Language Hub</div>
          </Link>
        </div>
        
        <nav className={styles.nav} style={{ marginTop: "24px" }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href, link.exact);
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          
          <Link 
            href="/" 
            className={styles.navItem} 
            style={{ marginTop: "auto", color: "var(--color-gray-500)" }}
          >
            <ArrowLeft size={16} />
            <span>Back to Main Site</span>
          </Link>
        </nav>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{parentInitial}</div>
          <div style={{ overflow: "hidden" }}>
            <div className="font-semibold text-sm" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {parentName}
            </div>
            <div className="text-xs text-gray-500">Parent / Guardian</div>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>}
    </>
  );
}

