import Link from "next/link";

export default function About() {
  return (
    <div className="container" style={{ padding: "100px 0", minHeight: "60vh", display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1 className="text-4xl font-bold" style={{ color: "var(--color-secondary)" }}>About Nija Language Hub</h1>
      <p className="text-lg text-gray-700 max-w-3xl">
        We are building the bridge home for diaspora families. Our mission is to ensure that the next generation remains deeply connected to their Nigerian roots through structured, premium language education.
      </p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "40px" }}>
        <div className="card-floating" style={{ padding: "32px" }}>
          <h3 className="text-2xl font-semibold mb-4 text-primary">Our Story</h3>
          <p className="text-gray-600">Founded by parents in the diaspora who struggled to find high-quality, engaging language instruction for their own children. We decided to build the platform we wished existed.</p>
        </div>
        <div className="card-floating" style={{ padding: "32px" }}>
          <h3 className="text-2xl font-semibold mb-4 text-primary">Our Teachers</h3>
          <p className="text-gray-600">Our educators are highly vetted native speakers who combine linguistic expertise with a deep understanding of engaging young learners in a digital environment.</p>
        </div>
      </div>
      
      <div style={{ marginTop: "40px" }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
