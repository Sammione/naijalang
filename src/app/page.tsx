import styles from "./page.module.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { GraduationCap, BookOpen, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <h1 className="text-4xl" style={{ textWrap: "balance", lineHeight: "1.2" }}>Connect Your Child to Their Roots.</h1>
            <p className="text-lg">
              Premium Igbo, Yoruba, and Ibibio classes for children in the diaspora. Taught by expert teachers, supported by structured curriculum.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/trial" className="btn btn-primary">Book a Free Trial</Link>
              <Link href="/programs" className="btn btn-secondary">Explore Programs</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            {/* Minimalist floating visual element */}
            <div className={styles.glassCard}>
              <div className={styles.glassHeader}>Next Class</div>
              <div className={styles.glassBody}>
                <div className={styles.glassAvatar}></div>
                <div className={styles.glassTextGroup}>
                  <div className={styles.glassTitle}>Yoruba - Level 1</div>
                  <div className={styles.glassSubtitle}>with Mrs. Ojo</div>
                </div>
              </div>
            </div>
            
            <div className={`${styles.glassCard} ${styles.glassCardSmall}`}>
              <div className={styles.glassHeader}>Pronunciation</div>
              <div className={styles.glassBody}>
                <div className={styles.glassWave}></div>
                <div className={styles.glassWave}></div>
                <div className={styles.glassWave}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className={styles.features}>
        <div className={`container ${styles.featuresContainer}`}>
          <div className="card-floating" style={{ padding: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div className={styles.featureIcon}>
              <GraduationCap size={32} color="var(--color-primary)" />
            </div>
            <h3 className="text-xl">Expert Teachers</h3>
            <p className="text-gray-600">Live, interactive sessions with vetted, experienced native speakers who understand diaspora children.</p>
          </div>
          <div className="card-floating" style={{ padding: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div className={styles.featureIcon}>
              <BookOpen size={32} color="var(--color-primary)" />
            </div>
            <h3 className="text-xl">Structured Curriculum</h3>
            <p className="text-gray-600">Age-appropriate learning milestones designed for lasting retention, moving beyond basic vocabulary.</p>
          </div>
          <div className="card-floating" style={{ padding: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div className={styles.featureIcon}>
              <Globe size={32} color="var(--color-primary)" />
            </div>
            <h3 className="text-xl">Cultural Connection</h3>
            <p className="text-gray-600">Go beyond words. Learn through folktales, songs, traditions, and rich Nigerian history.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerContainer}`}>
          <div className={styles.footerBrand}>
            <h4>Nija Language Hub</h4>
            <p className="text-sm">Building the bridge to home.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h5 className="font-semibold">Programs</h5>
              <Link href="/languages">Igbo</Link>
              <Link href="/languages">Yoruba</Link>
              <Link href="/languages">Ibibio</Link>
            </div>
            <div className={styles.linkGroup}>
              <h5 className="font-semibold">Company</h5>
              <Link href="/about">About Us</Link>
              <Link href="/teachers">Teachers</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
