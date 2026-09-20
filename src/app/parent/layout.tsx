import ParentSidebar from "@/components/ParentSidebar";
import styles from "./layout.module.css";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <ParentSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
