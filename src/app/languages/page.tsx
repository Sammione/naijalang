import Link from "next/link";

export default function LanguagesIndex() {
  return (
    <div className="container" style={{ padding: "100px 0", minHeight: "60vh" }}>
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: "var(--color-secondary)" }}>Choose a Language Curriculum</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px", marginTop: "40px" }}>
        <Link href="/languages/yoruba" className="card-floating" style={{ padding: "40px", textAlign: "center", textDecoration: "none" }}>
          <h2 className="text-2xl font-semibold mb-2">Yoruba</h2>
          <p className="text-gray-600 mb-6">Explore the rich tones and culture of the Yoruba people.</p>
          <span className="btn btn-outline" style={{ display: "inline-block" }}>View Curriculum</span>
        </Link>
        
        <Link href="/languages/igbo" className="card-floating" style={{ padding: "40px", textAlign: "center", textDecoration: "none" }}>
          <h2 className="text-2xl font-semibold mb-2">Igbo</h2>
          <p className="text-gray-600 mb-6">Discover the linguistic heritage of South-Eastern Nigeria.</p>
          <span className="btn btn-outline" style={{ display: "inline-block" }}>View Curriculum</span>
        </Link>
        
        <Link href="/languages/ibibio" className="card-floating" style={{ padding: "40px", textAlign: "center", textDecoration: "none" }}>
          <h2 className="text-2xl font-semibold mb-2">Ibibio</h2>
          <p className="text-gray-600 mb-6">Connect with the vibrant traditions of the coastal South-South.</p>
          <span className="btn btn-outline" style={{ display: "inline-block" }}>View Curriculum</span>
        </Link>
      </div>
      
      <div style={{ marginTop: "64px", textAlign: "center" }}>
        <Link href="/" className="btn btn-secondary">← Back to Home</Link>
      </div>
    </div>
  );
}
