import Link from "next/link";
import styles from "./programs.module.css";

export default function Programs() {
  return (
    <main className={styles.main}>
      {/* Navigation - simplified for subpages */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navContainer}`}>
          <Link href="/" className={styles.logo}>Nija Language Hub</Link>
          <div className={styles.navActions}>
            <Link href="/pricing" className="btn btn-outline">Pricing</Link>
            <Link href="/trial" className="btn btn-primary">Book a Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Our Methodology</span>
            <h1 className="text-4xl">A Curriculum Built for Retention and Connection.</h1>
            <p className="text-lg">
              We don't just teach vocabulary. Our structured programs combine expert native teachers, interactive AI practice, and rich cultural storytelling to ensure your child truly absorbs the language of their heritage.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>3</span>
                <span className={styles.statLabel}>Languages</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>12</span>
                <span className={styles.statLabel}>Levels</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Human Led</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Breakdown */}
      <section className={styles.curriculumSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="text-3xl">The Learning Pathway</h2>
            <p className="text-lg text-gray-600">Every child is assessed and placed into a tailored pathway designed to build confidence step-by-step.</p>
          </div>

          <div className={styles.pathwayGrid}>
            {/* Beginner */}
            <div className={styles.levelCard}>
              <div className={styles.levelHeader}>
                <div className={styles.levelIcon}>🌱</div>
                <h3>Level 1: Foundation (Beginner)</h3>
              </div>
              <p className={styles.levelDesc}>Designed for children with little to no exposure. We focus on building ear-training, basic phonetics, and essential vocabulary.</p>
              
              <div className={styles.milestones}>
                <h4>Key Milestones:</h4>
                <ul>
                  <li><span className={styles.check}>✓</span> Proper pronunciation of the alphabet and tones.</li>
                  <li><span className={styles.check}>✓</span> Basic greetings and introducing oneself.</li>
                  <li><span className={styles.check}>✓</span> Identifying immediate family members.</li>
                  <li><span className={styles.check}>✓</span> Numbers 1-20 and basic colors.</li>
                  <li><span className={styles.check}>✓</span> Understanding simple classroom commands.</li>
                </ul>
              </div>
            </div>

            {/* Intermediate */}
            <div className={styles.levelCard}>
              <div className={styles.levelHeader}>
                <div className={styles.levelIcon}>🌿</div>
                <h3>Level 2: Conversational (Intermediate)</h3>
              </div>
              <p className={styles.levelDesc}>For children who understand basics but struggle to speak. We shift focus to sentence construction, storytelling, and active dialogue.</p>
              
              <div className={styles.milestones}>
                <h4>Key Milestones:</h4>
                <ul>
                  <li><span className={styles.check}>✓</span> Forming complete present and past tense sentences.</li>
                  <li><span className={styles.check}>✓</span> Describing daily routines and feelings.</li>
                  <li><span className={styles.check}>✓</span> Engaging in a 5-minute continuous conversation.</li>
                  <li><span className={styles.check}>✓</span> Retelling simple cultural folktales.</li>
                  <li><span className={styles.check}>✓</span> Asking and answering complex questions.</li>
                </ul>
              </div>
            </div>

            {/* Advanced */}
            <div className={styles.levelCard}>
              <div className={styles.levelHeader}>
                <div className={styles.levelIcon}>🌳</div>
                <h3>Level 3: Immersion (Advanced)</h3>
              </div>
              <p className={styles.levelDesc}>For fluent speakers refining their skills. Focuses on deep cultural context, reading, writing, and idiomatic expressions.</p>
              
              <div className={styles.milestones}>
                <h4>Key Milestones:</h4>
                <ul>
                  <li><span className={styles.check}>✓</span> Reading short stories and writing personal essays.</li>
                  <li><span className={styles.check}>✓</span> Understanding and using traditional proverbs.</li>
                  <li><span className={styles.check}>✓</span> Discussing history, geography, and traditions.</li>
                  <li><span className={styles.check}>✓</span> Fluid navigation of tonal complexities.</li>
                  <li><span className={styles.check}>✓</span> Confident public speaking in the target language.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anatomy of a Lesson */}
      <section className={styles.lessonAnatomy}>
        <div className={`container ${styles.anatomyContainer}`}>
          <div className={styles.anatomyContent}>
            <h2 className="text-3xl">What does a typical lesson look like?</h2>
            <p className="text-gray-700">Our 45-minute sessions are highly structured to maximize engagement without overwhelming the child.</p>
            
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>0-10 min</div>
                <div className={styles.timelineContent}>
                  <h4>Warm-up & Review</h4>
                  <p>Cultural greetings, reviewing last week's vocabulary, and setting the intention for the class.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>10-25 min</div>
                <div className={styles.timelineContent}>
                  <h4>Core Concept Introduction</h4>
                  <p>The teacher introduces the new topic (e.g., Market Vocabulary) using visual aids, storytelling, and repetition.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>25-40 min</div>
                <div className={styles.timelineContent}>
                  <h4>Interactive Practice</h4>
                  <p>Role-playing, Q&A, and live exercises where the student does 80% of the speaking.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>40-45 min</div>
                <div className={styles.timelineContent}>
                  <h4>Cultural Context & Wrap-up</h4>
                  <p>Connecting the lesson to a cultural practice (e.g., how to respectfully address elders at the market), assigning homework, and goodbyes.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.anatomyVisual}>
            <div className={styles.mockupCard}>
              <div className={styles.mockupHeader}>
                <span className={styles.mockupDot}></span>
                <span className={styles.mockupDot}></span>
                <span className={styles.mockupDot}></span>
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.videoGrid}>
                  <div className={styles.videoMain}>
                    <div className={styles.teacherTag}>Teacher Mrs. Ojo</div>
                  </div>
                  <div className={styles.videoSelf}>
                    <div className={styles.studentTag}>Samuel</div>
                  </div>
                </div>
                <div className={styles.mockupControls}>
                  <div className={styles.controlIcon}>🎤</div>
                  <div className={styles.controlIcon}>📷</div>
                  <div className={styles.controlIcon}>✋</div>
                  <div className={styles.controlEnd}>Leave</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={`container ${styles.ctaContainer}`}>
          <h2 className="text-3xl text-white">Give them the gift of language.</h2>
          <p className="text-lg text-primary-light mb-6">Join hundreds of diaspora families reconnecting with their roots.</p>
          <div className={styles.ctaButtons}>
            <Link href="/trial" className="btn btn-primary" style={{ backgroundColor: "var(--color-white)", color: "var(--color-secondary)" }}>Book a Free Trial</Link>
            <Link href="/pricing" className="btn btn-outline" style={{ color: "var(--color-white)", borderColor: "var(--color-white)" }}>View Pricing</Link>
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
        </div>
      </footer>
    </main>
  );
}
