import Link from "next/link";

export default function IbibioCurriculum() {
  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: "800px" }}>
      <Link href="/languages" className="text-sm text-gray-500 hover-underline mb-8 inline-block">← Back to Languages</Link>
      
      <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-secondary)" }}>Ibibio Curriculum</h1>
      <p className="text-lg text-gray-700 mb-12">Our Ibibio curriculum focuses on preserving the rich phonetic structures and vocabulary of the coastal heritage.</p>
      
      <div className="card-floating mb-8" style={{ padding: "32px" }}>
        <h3 className="text-xl font-semibold mb-4 text-primary">Level 1: Foundation (Ages 5-8)</h3>
        <ul className="text-gray-700" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <li><strong>Greetings:</strong> Morning and afternoon greetings ("Amesiere", "Asiere").</li>
          <li><strong>Numbers & Counting:</strong> Basic counting 1-10.</li>
          <li><strong>Animals & Nature:</strong> Identifying local fauna and elements of nature.</li>
        </ul>
      </div>

      <div className="card-floating mb-8" style={{ padding: "32px" }}>
        <h3 className="text-xl font-semibold mb-4 text-primary">Level 2: Intermediate (Ages 9-12)</h3>
        <ul className="text-gray-700" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <li><strong>Sentence Construction:</strong> Forming subject-verb-object structures.</li>
          <li><strong>Community Roles:</strong> Vocabulary for different professions and family members.</li>
          <li><strong>Cultural Focus:</strong> Traditional Ibibio songs, dances, and coastal history.</li>
        </ul>
      </div>
    </div>
  );
}
