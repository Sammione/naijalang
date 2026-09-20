import Link from "next/link";

export default function IgboCurriculum() {
  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: "800px" }}>
      <Link href="/languages" className="text-sm text-gray-500 hover-underline mb-8 inline-block">← Back to Languages</Link>
      
      <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-secondary)" }}>Igbo Curriculum</h1>
      <p className="text-lg text-gray-700 mb-12">Our Igbo curriculum emphasizes conversational fluency, vowel harmony, and cultural immersion through proverbs and storytelling.</p>
      
      <div className="card-floating mb-8" style={{ padding: "32px" }}>
        <h3 className="text-xl font-semibold mb-4 text-primary">Level 1: Foundation (Ages 5-8)</h3>
        <ul className="text-gray-700" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <li><strong>Greetings (Ekele):</strong> Basic greetings for morning, night, and welcoming guests (Nnọọ).</li>
          <li><strong>Self Introduction:</strong> "Aha m bụ..." (My name is...).</li>
          <li><strong>Body Parts (Akụkụ Ahụ):</strong> Identifying head, shoulders, knees, and toes through songs.</li>
          <li><strong>Alphabet (Mkpụrụ Edemede):</strong> Mastering the 36 Igbo alphabets and unique sounds (e.g., gb, kp, ṅ).</li>
        </ul>
      </div>

      <div className="card-floating mb-8" style={{ padding: "32px" }}>
        <h3 className="text-xl font-semibold mb-4 text-primary">Level 2: Intermediate (Ages 9-12)</h3>
        <ul className="text-gray-700" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <li><strong>Food & Kitchen (Nri na Ekwu):</strong> Identifying traditional foods and utensils.</li>
          <li><strong>Time & Seasons:</strong> Understanding market days (Eke, Orie, Afọ, Nkwọ).</li>
          <li><strong>Cultural Focus:</strong> The significance of the Kola Nut (Ọjị) and basic proverbs (Ilu).</li>
        </ul>
      </div>
    </div>
  );
}
