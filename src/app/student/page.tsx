"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./student.module.css";
import { useApp, ScheduledClass, Assignment } from "@/context/AppContext";
import SubmitAssignmentModal from "@/components/SubmitAssignmentModal";
import AuthGuard from "@/components/AuthGuard";
import { 
  Video, 
  Calendar, 
  BookOpen, 
  Award, 
  Clock, 
  Flame, 
  Zap, 
  Star, 
  Play, 
  Volume2,
  ExternalLink, 
  Upload, 
  CheckCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  FileText,
  Check,
  Headphones,
  Lock,
  LogOut
} from "lucide-react";

interface CulturalPhrase {
  id: string;
  lang: "Yoruba" | "Igbo" | "Hausa";
  phrase: string;
  phonetic: string;
  meaning: string;
  toneTip: string;
}

const HERITAGE_PHRASES: CulturalPhrase[] = [
  {
    id: "yo-1",
    lang: "Yoruba",
    phrase: "Ẹ ǹlẹ́ o",
    phonetic: "Eh-n-leh-oh (Mid-Low-High)",
    meaning: "Respectful greeting / Hello to an elder or group",
    toneTip: "The accent on 'ǹ' is low tone (Dò), 'lẹ́' is high tone (Mí)."
  },
  {
    id: "yo-2",
    lang: "Yoruba",
    phrase: "Báwo ni nǹkan?",
    phonetic: "Bah-woh nee n-kan?",
    meaning: "How are things with you? (Conversational greeting)",
    toneTip: "'Bá' starts high, 'wo' is mid, 'ni' is mid."
  },
  {
    id: "yo-3",
    lang: "Yoruba",
    phrase: "Ẹ ṣeé púpọ̀",
    phonetic: "Eh shay poo-poh",
    meaning: "Thank you very much (Respectful honorific)",
    toneTip: "Always use 'Ẹ' when speaking to parents, educators, or elders."
  },
  {
    id: "ig-1",
    lang: "Igbo",
    phrase: "Ndị banyị, kedu ka unu mere?",
    phonetic: "Ndee bah-nyee, kay-doo kah oo-noo meh-reh?",
    meaning: "Our people, how are you all doing?",
    toneTip: "'Kedu' is the universal foundation for greeting in Igbo."
  },
  {
    id: "ig-2",
    lang: "Igbo",
    phrase: "Daalụ nke ukwuu",
    phonetic: "Dah-loo n-kay oo-kwoo",
    meaning: "Thank you very much",
    toneTip: "Tone rises slightly on 'Daalụ' and falls gently on 'ukwuu'."
  },
  {
    id: "ig-3",
    lang: "Igbo",
    phrase: "Ka chi foo",
    phonetic: "Kah chee foh",
    meaning: "Good night / May morning break peacefully",
    toneTip: "A melodic blessing spoken before retiring for the night."
  },
  {
    id: "ha-1",
    lang: "Hausa",
    phrase: "Ina kwana? Barka da asuba",
    phonetic: "Ee-nah kwah-nah? Bar-kah dah ah-soo-bah",
    meaning: "Good morning! Blessings of the morning",
    toneTip: "Tone is calm and rhythmic. Answer with: 'Lafiya lau' (In peace)."
  },
  {
    id: "ha-2",
    lang: "Hausa",
    phrase: "Na gode kwarai da gaske",
    phonetic: "Nah goh-day kwah-rye dah gahs-kay",
    meaning: "I thank you truly and sincerely",
    toneTip: "'Gaske' signifies truth and authenticity."
  },
  {
    id: "ha-3",
    lang: "Hausa",
    phrase: "Sai anjima",
    phonetic: "Sigh ahn-jee-mah",
    meaning: "See you later / Until later",
    toneTip: "Common farewell used between friends, peers, and teachers."
  }
];

export default function StudentPortal() {
  const { student, classes, assignments, openMeetingLauncher, logout } = useApp();
  
  // Navigation tabs
  const [activeStudioTab, setActiveStudioTab] = useState<"classroom" | "homework" | "badges" | "audio-lab">("classroom");
  
  // Homework filter
  const [homeworkFilter, setHomeworkFilter] = useState<"all" | "pending" | "submitted" | "graded">("all");
  const [selectedAssignmentForSubmission, setSelectedAssignmentForSubmission] = useState<Assignment | null>(null);

  // Audio lab filter & state
  const [audioLangFilter, setAudioLangFilter] = useState<"All" | "Yoruba" | "Igbo" | "Hausa">("All");
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Filter assignments
  const filteredAssignments = assignments.filter((asg) => {
    if (homeworkFilter === "all") return true;
    return asg.status === homeworkFilter;
  });

  const pendingCount = assignments.filter(a => a.status === "pending").length;
  const nextLiveClass = classes.find((c) => c.status === "live") || classes[0];

  // Speech pronunciation helper
  const handlePlayAudio = (phrase: CulturalPhrase) => {
    setPlayingAudioId(phrase.id);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase.phrase);
      utterance.rate = 0.85; // slower for pedagogy
      utterance.pitch = 1.05;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudioId(null), 1200);
    }
  };

  const filteredPhrases = HERITAGE_PHRASES.filter(p => {
    if (audioLangFilter === "All") return true;
    return p.lang === audioLangFilter;
  });

  return (
    <AuthGuard requiredRole="student" portalName="Student Learner Studio">
      <div className={styles.container}>
      {/* Top Header */}
      <nav className={styles.topNav}>
        <div className={styles.navInner}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/" className={styles.logo}>
              <Image src="/logo.png" alt="Logo" width={38} height={38} style={{ borderRadius: "50%", border: "2px solid #e0b034" }} />
              <span>Nija Language Hub</span>
            </Link>
            <span className={styles.badgeRole}>Student Studio</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{student.name}</div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{student.enrolledLanguage} Track</div>
            </div>
            <div style={{ 
              width: "38px", 
              height: "38px", 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, #4338ca, #6366f1)", 
              color: "white", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontWeight: 800,
              boxShadow: "0 2px 8px rgba(67, 56, 202, 0.25)"
            }}>
              {student.avatarLetter}
            </div>
            <button 
              onClick={logout}
              title="Switch Account"
              style={{
                background: "none",
                border: "1px solid #e2e8f0",
                padding: "8px",
                borderRadius: "10px",
                cursor: "pointer",
                color: "#64748b",
                display: "flex",
                alignItems: "center"
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Studio Area */}
      <main className={styles.mainContainer}>
        {/* Hero Profile Banner */}
        <div className={styles.heroProfile}>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>{student.avatarLetter}</div>
            <div>
              <span className={styles.greetingSub}>
                Ẹ ǸLẸ́ O • WELCOME BACK!
              </span>
              <h1 className={styles.greetingTitle}>{student.name}</h1>
              <p className={styles.greetingDetails}>
                {student.enrolledLanguage} • {student.level} • Age {student.age}
              </p>
              <p style={{ color: "#a5b4fc", fontSize: "0.82rem", marginTop: "4px" }}>
                Educator Mentor: <strong>{student.assignedTeacher || "Lead Faculty"}</strong>
              </p>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <div className={styles.statVal}>
                <Flame size={20} color="#f97316" /> {student.streakDays}
              </div>
              <div className={styles.statLabel}>Day Streak</div>
            </div>
            <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(255,255,255,0.2)" }}></div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>
                <Zap size={20} color="#facc15" /> {student.xpPoints}
              </div>
              <div className={styles.statLabel}>Total XP</div>
            </div>
            <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(255,255,255,0.2)" }}></div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>
                <Award size={20} color="#a7f3d0" /> {student.badges.length}
              </div>
              <div className={styles.statLabel}>Badges</div>
            </div>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className={styles.tabNav}>
          <button
            onClick={() => setActiveStudioTab("classroom")}
            className={`${styles.tabBtn} ${activeStudioTab === "classroom" ? styles.tabBtnActive : ""}`}
          >
            <Video size={18} />
            <span>Classroom & Live Sessions</span>
            <span className={styles.tabBadge}>{classes.length}</span>
          </button>

          <button
            onClick={() => setActiveStudioTab("homework")}
            className={`${styles.tabBtn} ${activeStudioTab === "homework" ? styles.tabBtnActive : ""}`}
          >
            <BookOpen size={18} />
            <span>Homework & Missions</span>
            {pendingCount > 0 && (
              <span className={styles.tabBadge} style={{ background: "#ef4444", color: "white" }}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveStudioTab("badges")}
            className={`${styles.tabBtn} ${activeStudioTab === "badges" ? styles.tabBtnActive : ""}`}
          >
            <Award size={18} />
            <span>Cultural Badges</span>
            <span className={styles.tabBadge}>{student.badges.length}</span>
          </button>

          <button
            onClick={() => setActiveStudioTab("audio-lab")}
            className={`${styles.tabBtn} ${activeStudioTab === "audio-lab" ? styles.tabBtnActive : ""}`}
          >
            <Headphones size={18} />
            <span>Heritage Soundboard</span>
          </button>
        </div>

        {/* TAB 1: CLASSROOM & LIVE SESSIONS */}
        {activeStudioTab === "classroom" && (
          <div>
            {/* Live Class Hero Banner */}
            {nextLiveClass ? (
              <div className={styles.liveHeroCard}>
                <div>
                  <span className={styles.liveTag}>
                    <span className={styles.pulseDot}></span>
                    {nextLiveClass.status === "live" ? "Class is Live Right Now!" : "Next Scheduled Live Lesson"}
                  </span>
                  <h2 className={styles.liveTitle}>{nextLiveClass.title}</h2>
                  <p className={styles.liveDesc}>
                    Live with <strong>{nextLiveClass.teacherName}</strong> • {nextLiveClass.date} at {nextLiveClass.time}
                  </p>

                  {/* Agenda Topics */}
                  {nextLiveClass.topics && nextLiveClass.topics.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                      {nextLiveClass.topics.map((topic, i) => (
                        <span 
                          key={i} 
                          style={{
                            background: "rgba(255,255,255,0.2)",
                            padding: "4px 10px",
                            borderRadius: "10px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Check size={12} color="#4ade80" /> {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={() => openMeetingLauncher(nextLiveClass)}
                    className={styles.startBtn}
                  >
                    <Video size={20} />
                    Start Now / Join Class
                  </button>
                  <div style={{ fontSize: "0.75rem", color: "#a7f3d0", marginTop: "8px", fontWeight: 600 }}>
                    Meeting ID: {nextLiveClass.meetingId}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyCard} style={{ marginBottom: "24px" }}>
                <div className={styles.emptyIcon}>📅</div>
                <h3 className={styles.emptyTitle}>No Live Session Active Right Now</h3>
                <p className={styles.emptyDesc}>
                  Your educator or administrator will schedule your upcoming 1-on-1 language lessons. They will show up here with 1-click meeting launchers.
                </p>
              </div>
            )}

            {/* Upcoming Classes Timetable */}
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Master Timetable & Lesson Schedule
              </h3>
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                {classes.length} Lessons Available
              </span>
            </div>

            <div className={styles.grid2}>
              {classes.map((cls) => (
                <div key={cls.id} className={styles.sessionCard}>
                  <div className={styles.sessionHeader}>
                    <div>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#4338ca", display: "block", marginBottom: "4px" }}>
                        {cls.date} • {cls.time}
                      </span>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        {cls.title}
                      </h4>
                    </div>
                    <span className={cls.platform === "google-meet" ? styles.badgePlatformMeet : styles.badgePlatformZoom}>
                      {cls.platform === "google-meet" ? "Google Meet" : "Zoom"}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    Instructor: <strong>{cls.teacherName}</strong> • Language Track: <strong>{cls.language}</strong>
                  </p>

                  {cls.topics && cls.topics.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {cls.topics.map((t, i) => (
                        <span key={i} className={styles.topicTag}>
                          <Check size={11} color="#16a34a" /> {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      Passcode: <strong>{cls.meetingPasscode}</strong>
                    </span>
                    <button
                      onClick={() => openMeetingLauncher(cls)}
                      style={{
                        background: "#4338ca",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Video size={14} /> Join Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: HOMEWORK & MISSIONS */}
        {activeStudioTab === "homework" && (
          <div>
            {/* Filter Pills */}
            <div className={styles.filterPills}>
              <button
                onClick={() => setHomeworkFilter("all")}
                className={`${styles.filterPill} ${homeworkFilter === "all" ? styles.filterPillActive : ""}`}
              >
                All Missions ({assignments.length})
              </button>
              <button
                onClick={() => setHomeworkFilter("pending")}
                className={`${styles.filterPill} ${homeworkFilter === "pending" ? styles.filterPillActive : ""}`}
              >
                To Do ({assignments.filter(a => a.status === "pending").length})
              </button>
              <button
                onClick={() => setHomeworkFilter("submitted")}
                className={`${styles.filterPill} ${homeworkFilter === "submitted" ? styles.filterPillActive : ""}`}
              >
                Under Review ({assignments.filter(a => a.status === "submitted").length})
              </button>
              <button
                onClick={() => setHomeworkFilter("graded")}
                className={`${styles.filterPill} ${homeworkFilter === "graded" ? styles.filterPillActive : ""}`}
              >
                Graded & Evaluated ({assignments.filter(a => a.status === "graded").length})
              </button>
            </div>

            {/* List of Assignments */}
            {filteredAssignments.length === 0 ? (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon}>🎉</div>
                <h3 className={styles.emptyTitle}>No Missions in this Section</h3>
                <p className={styles.emptyDesc}>
                  {homeworkFilter === "pending"
                    ? "Great job! You have submitted all assigned missions."
                    : "No assignments match this criteria."}
                </p>
              </div>
            ) : (
              filteredAssignments.map((asg) => (
                <div key={asg.id} className={styles.missionCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#4338ca", textTransform: "uppercase" }}>
                          {asg.subject}
                        </span>
                        <span style={{ color: "#cbd5e1" }}>•</span>
                        <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                          Due Date: {asg.dueDate}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        {asg.title}
                      </h3>
                    </div>

                    <div>
                      {asg.status === "pending" && <span className={styles.badgePending}>Pending Submission</span>}
                      {asg.status === "submitted" && <span className={styles.badgeSubmitted}>Under Educator Review</span>}
                      {asg.status === "graded" && (
                        <span className={styles.badgeGraded}>
                          Score: {asg.grade?.score}/100 ({asg.grade?.letter})
                        </span>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.5, margin: "0 0 16px" }}>
                    {asg.description}
                  </p>

                  {/* If Graded: Show rubric and teacher evaluation */}
                  {asg.status === "graded" && asg.grade && (
                    <div className={styles.gradedFeedbackBox}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 800, color: "#166534", fontSize: "0.92rem" }}>
                          <Award size={18} /> Educator Review by {asg.grade.gradedBy}:
                        </div>
                        <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#15803d" }}>
                          {asg.grade.score}% ({asg.grade.letter})
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 10px", fontSize: "0.88rem", fontStyle: "italic", color: "#14532d" }}>
                        "{asg.grade.feedback}"
                      </p>
                      {asg.grade.badges && asg.grade.badges.length > 0 && (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#166534" }}>Awarded Badges:</span>
                          {asg.grade.badges.map((bName, i) => (
                            <span
                              key={i}
                              style={{
                                backgroundColor: "white",
                                padding: "3px 8px",
                                borderRadius: "10px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: "#166534",
                                border: "1px solid #86efac"
                              }}
                            >
                              ⭐ {bName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* If Submitted: Show what was turned in */}
                  {asg.status === "submitted" && asg.studentSubmission && (
                    <div className={styles.submissionBox}>
                      <div style={{ fontWeight: 700, color: "#0369a1", marginBottom: "4px" }}>
                        Turned In ({asg.studentSubmission.submittedAt}):
                      </div>
                      <div>{asg.studentSubmission.textResponse}</div>
                      {asg.studentSubmission.fileName && (
                        <div style={{ marginTop: "6px", fontSize: "0.8rem", color: "#0284c7", display: "flex", alignItems: "center", gap: "4px" }}>
                          <FileText size={14} /> Attached Document: <strong>{asg.studentSubmission.fileName}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "14px" }}>
                    {asg.status === "pending" ? (
                      <button
                        onClick={() => setSelectedAssignmentForSubmission(asg)}
                        className="btn btn-primary"
                        style={{
                          padding: "10px 22px",
                          fontSize: "0.88rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <Upload size={16} />
                        Turn In / Submit Mission
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignmentForSubmission(asg)}
                        className="btn btn-outline"
                        style={{
                          padding: "8px 16px",
                          fontSize: "0.82rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        {asg.status === "graded" ? "View Full Assessment" : "Update / Resubmit Mission"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: CULTURAL BADGES & TROPHIES */}
        {activeStudioTab === "badges" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                Cultural Heritage Trophy Case
              </h2>
              <p style={{ color: "#64748b", margin: 0, fontSize: "0.88rem" }}>
                Earned through mastery of greetings, oral storytelling, tonal accuracy, and homework excellence.
              </p>
            </div>

            <div className={styles.gridCards}>
              {/* Unlocked Badges */}
              {student.badges.map((b) => (
                <div key={b.id} className={`${styles.badgeCard} ${styles.badgeCardUnlocked}`}>
                  <div className={styles.badgeIconRing}>
                    <Award size={32} />
                  </div>
                  <h3 className={styles.badgeCardName}>{b.name}</h3>
                  <p className={styles.badgeCardDesc}>
                    {b.description || "Mastered authentic oral heritage expressions and passed instructor assessment."}
                  </p>
                  <span className={styles.badgeCardDate}>
                    Unlocked on {b.dateEarned}
                  </span>
                </div>
              ))}

              {/* Milestone Locked Badges */}
              <div className={`${styles.badgeCard} ${styles.badgeCardLocked}`}>
                <div className={styles.badgeIconRing} style={{ background: "#f1f5f9", color: "#94a3b8", borderColor: "#e2e8f0" }}>
                  <Lock size={28} />
                </div>
                <h3 className={styles.badgeCardName}>Ọ̀rọ̀ Àgbà (Master of Proverbs)</h3>
                <p className={styles.badgeCardDesc}>
                  Awarded for reciting and contextualizing 5 Nigerian proverbs during live dialogue.
                </p>
                <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                  Locked • Complete 5 More Live Classes
                </span>
              </div>

              <div className={`${styles.badgeCard} ${styles.badgeCardLocked}`}>
                <div className={styles.badgeIconRing} style={{ background: "#f1f5f9", color: "#94a3b8", borderColor: "#e2e8f0" }}>
                  <Lock size={28} />
                </div>
                <h3 className={styles.badgeCardName}>Nwa Amamife (Child of Wisdom)</h3>
                <p className={styles.badgeCardDesc}>
                  Awarded for achieving 95%+ score across 3 consecutive homework assignments.
                </p>
                <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                  Locked • 1/3 Missions Completed
                </span>
              </div>

              <div className={`${styles.badgeCard} ${styles.badgeCardLocked}`}>
                <div className={styles.badgeIconRing} style={{ background: "#f1f5f9", color: "#94a3b8", borderColor: "#e2e8f0" }}>
                  <Lock size={28} />
                </div>
                <h3 className={styles.badgeCardName}>Gwarzon Hausa (Champion Speaker)</h3>
                <p className={styles.badgeCardDesc}>
                  Awarded for flawless morning & evening conversational salutations.
                </p>
                <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                  Locked • Level 2 Required
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HERITAGE SOUNDBOARD */}
        {activeStudioTab === "audio-lab" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                Heritage Dialect Soundboard & Tone Guide
              </h2>
              <p style={{ color: "#64748b", margin: 0, fontSize: "0.88rem" }}>
                Interactive pronunciation trainer for tonal precision in Yoruba (Dò-Re-Mí), Igbo, and Hausa.
              </p>
            </div>

            {/* Language Filter */}
            <div className={styles.filterPills}>
              {(["All", "Yoruba", "Igbo", "Hausa"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setAudioLangFilter(lang)}
                  className={`${styles.filterPill} ${audioLangFilter === lang ? styles.filterPillActive : ""}`}
                >
                  {lang} Dialects
                </button>
              ))}
            </div>

            <div className={styles.gridCards}>
              {filteredPhrases.map((phrase) => {
                const isPlaying = playingAudioId === phrase.id;
                return (
                  <div key={phrase.id} className={styles.audioCard}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className={styles.audioLangTag}>{phrase.lang}</span>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>Pronunciation Lab</span>
                      </div>
                      <h3 className={styles.phraseNative}>{phrase.phrase}</h3>
                      <div className={styles.phrasePhonetic}>{phrase.phonetic}</div>
                      <p className={styles.phraseEnglish}>"{phrase.meaning}"</p>
                      
                      <div style={{ 
                        background: "#f8fafc", 
                        border: "1px dashed #cbd5e1", 
                        padding: "8px 12px", 
                        borderRadius: "10px", 
                        fontSize: "0.78rem", 
                        color: "#475569", 
                        marginBottom: "16px" 
                      }}>
                        💡 <strong>Tone Tip:</strong> {phrase.toneTip}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(phrase)}
                      className={`${styles.audioBtn} ${isPlaying ? styles.audioBtnPlaying : ""}`}
                    >
                      {isPlaying ? (
                        <>
                          <Volume2 size={16} />
                          <span>Speaking Native Tone...</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          <span>Listen & Practice Audio</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

        {/* Submission Modal */}
        {selectedAssignmentForSubmission && (
          <SubmitAssignmentModal
            assignment={selectedAssignmentForSubmission}
            onClose={() => setSelectedAssignmentForSubmission(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
