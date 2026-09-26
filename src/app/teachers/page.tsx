import Link from "next/link";
import { GraduationCap, ShieldCheck, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

export default function Teachers() {
  return (
    <div className="container" style={{ padding: "80px 0", minHeight: "70vh", display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--color-primary)" }}>
          Faculty & Pedagogy
        </span>
        <h1 className="text-4xl font-bold" style={{ color: "var(--color-secondary)", marginTop: "6px" }}>
          Certified Native Heritage Educators
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl" style={{ marginTop: "8px" }}>
          Every instructor at Nija Language Hub is a vetted, certified educator specializing in childhood language immersion and diasporic cultural retention.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        <div className="card-floating" style={{ padding: "32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <GraduationCap size={32} color="var(--color-primary)" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Native Speakers & Linguists</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our faculty holds specialized university degrees in African Languages, Literature, and Early Childhood Education, ensuring authentic pronunciation, tonal fidelity, and linguistic precision.
          </p>
        </div>

        <div className="card-floating" style={{ padding: "32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <ShieldCheck size={32} color="#16a34a" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Rigorous Vetting & Safety</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Every instructor undergoes multi-tier background screening, identity verification, and pedagogical auditioning specifically evaluating child engagement and patience.
          </p>
        </div>

        <div className="card-floating" style={{ padding: "32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <BookOpen size={32} color="var(--color-secondary)" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Matching</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Children are paired with dedicated instructors tailored to their age, ancestral background (Yoruba, Igbo, or Ibibio), and starting fluency level.
          </p>
        </div>
      </div>

      <div className="card-floating" style={{ padding: "36px", backgroundColor: "#fdfbf7", border: "1px solid var(--color-gray-200)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Experience a Live 1-on-1 Class</h3>
          <p className="text-gray-600 text-sm mt-1">Book an introductory trial lesson to meet your child's certified educator and receive a personalized learning roadmap.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/trial" className="btn btn-primary">Book a Trial Lesson</Link>
          <Link href="/programs" className="btn btn-outline">Explore Programs</Link>
        </div>
      </div>

      <div>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
