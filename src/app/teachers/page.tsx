import Link from "next/link";

export default function Teachers() {
  return (
    <div className="container" style={{ padding: "100px 0", minHeight: "60vh", display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 className="text-4xl font-bold" style={{ color: "var(--color-secondary)" }}>Meet Our Teachers</h1>
      <p className="text-lg text-gray-700 max-w-3xl">
        Our educators are vetted, experienced native speakers dedicated to connecting the next generation with their heritage.
      </p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px", marginTop: "40px" }}>
        {[
          { name: "Mrs. Ojo", lang: "Yoruba", exp: "8 years" },
          { name: "Mr. Chukwu", lang: "Igbo", exp: "12 years" },
          { name: "Ms. Akpan", lang: "Ibibio", exp: "5 years" }
        ].map((teacher, idx) => (
          <div key={idx} className="card-floating" style={{ padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-gray-200)", marginBottom: "16px" }}></div>
            <h3 className="text-xl font-semibold">{teacher.name}</h3>
            <p className="text-primary font-medium">{teacher.lang} Instructor</p>
            <p className="text-sm text-gray-500 mt-2 mb-4">{teacher.exp} experience</p>
            <Link href={`/teachers/${teacher.name.toLowerCase().replace(/\s+/g, '-')}`} className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.85rem", width: "100%" }}>View Profile</Link>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: "40px" }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
