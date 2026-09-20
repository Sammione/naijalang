import styles from "./page.module.css";
import Link from "next/link";

export default function ParentDashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Good morning, Adewale</h1>
        <p className="text-gray-500 text-lg">Here's what's happening with your children's learning.</p>
      </header>

      <div className={styles.grid}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
          {/* Next Class Widget */}
          <section className={styles.card}>
            <h2 className="text-xl font-semibold mb-6">Up Next</h2>
            <div className={styles.classInfo}>
              <div className={styles.classTime}>
                <span className="text-primary font-bold text-sm uppercase tracking-wider">Today</span>
                <span className="text-2xl font-bold">16:00</span>
              </div>
              <div className={styles.classDetails}>
                <h3 className="font-semibold text-xl">Yoruba — Foundation</h3>
                <p className="text-gray-600 text-sm">Student: Samuel • Teacher: Mrs. Ojo</p>
              </div>
              <button className="btn btn-primary" style={{ marginLeft: 'auto' }}>Join Class</button>
            </div>
          </section>

          {/* Culture Calendar Snippet */}
          <section className={styles.card}>
             <h2 className="text-xl font-semibold mb-4">Culture Calendar</h2>
             <div style={{ padding: '16px', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                 <span className="font-bold text-gray-900">New Yam Festival</span>
                 <span className="text-xs font-bold text-accent uppercase">In 3 Days</span>
               </div>
               <p className="text-sm text-gray-600">A special 10-minute cultural module has been added to Samuel's practice dashboard!</p>
             </div>
          </section>
        </div>

        {/* Right Column: Progress */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className="text-xl font-semibold">Samuel's Progress</h2>
            <Link href="/parent/children/samuel" className="text-primary text-sm font-medium hover-underline">View Full Profile →</Link>
          </div>
          
          <div className={styles.progressList}>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Speaking & Tones</span>
                <span>70%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '70%'}}></div></div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Listening Comprehension</span>
                <span>85%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '85%'}}></div></div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Vocabulary Retention</span>
                <span>60%</span>
              </div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '60%'}}></div></div>
            </div>
          </div>

          <div className={styles.teacherNote}>
            <h4 className="font-semibold text-sm mb-2 text-gray-900" style={{ position: 'relative', zIndex: 1 }}>Note from Mrs. Ojo</h4>
            <p className="text-base italic text-gray-700" style={{ position: 'relative', zIndex: 1 }}>"Samuel is becoming very confident with his greetings! This week, try to practice the 'market vocabulary' with him when you go grocery shopping."</p>
            <button className="btn btn-outline" style={{ marginTop: '16px', padding: '8px 16px', fontSize: '0.85rem' }}>Message Teacher</button>
          </div>
        </section>
      </div>
    </div>
  );
}
