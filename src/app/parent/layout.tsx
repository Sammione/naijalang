import ParentSidebar from "@/components/ParentSidebar";
import AuthGuard from "@/components/AuthGuard";
import styles from "./layout.module.css";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="parent" portalName="Parent & Guardian Portal">
      <div className={styles.container}>
        <ParentSidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
