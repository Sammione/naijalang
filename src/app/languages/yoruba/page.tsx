import Link from "next/link";

export default function YorubaCurriculum() {
  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: "800px" }}>
      <Link href="/languages" className="text-sm text-gray-500 hover-underline mb-8 inline-block">← Back to Languages</Link>
      
      <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-secondary)" }}>Yoruba Curriculum</h1>
      <p className="text-lg text-gray-700 mb-12">Our Yoruba curriculum focuses heavily on mastering the three distinct tonal marks (do, re, mi) which are critical for meaning.</p>
      
      <div className="card-floating mb-8" style={{ padding: "32px" }}>
        <h3 className="text-xl font-semibold mb-4 text-primary">Level 1: Foundation (Ages 5-8)</h3>
        <ul className="text-gray-700" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <li><strong>Greetings & Respect (Ìkíni):</strong> Mastering morning, afternoon, and elder greetings.</li>
          <li><strong>Numbers & Counting (Òǹkà):</strong> Counting 1-20 and simple age expression.</li>
          <li><strong>Family & Home (Ẹbí):</strong> Identifying immediate family members.</li>
          <li><strong>Tonal Awareness:</strong> Introduction to High, Mid, and Low tones using simple words (e.g., igbá, igba, ìgbà).</li>
        </ul>
      </div>

      <div className="card-floating mb-8" style={{ padding: "32px" }}>
        <h3 className="text-xl font-semibold mb-4 text-primary">Level 2: Intermediate (Ages 9-12)</h3>
        <ul className="text-gray-700" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <li><strong>Market & Trade (Ọjà):</strong> Vocabulary for foods, buying, and polite haggling.</li>
          <li><strong>Action Verbs:</strong> Constructing basic "I am doing..." sentences.</li>
          <li><strong>Cultural Focus:</strong> Introduction to Yoruba folktales (Àló) featuring Ijapa (the tortoise).</li>
        </ul>
      </div>
    </div>
  );
}
