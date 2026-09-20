import Link from "next/link";
import styles from "./layout.module.css";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Link href="/" style={{ textDecoration: "none" }}><div className={styles.logo}>Nija Language Hub</div></Link>
        <nav className={styles.nav}>
          <Link href="/parent" className={styles.navItem}>Overview</Link>
          <Link href="/parent/children" className={styles.navItem}>My Children</Link>
          <Link href="/parent/schedule" className={styles.navItem}>Classes</Link>
          <Link href="/parent/billing" className={styles.navItem}>Billing</Link>
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
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
