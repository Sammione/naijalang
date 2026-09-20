import Link from "next/link";

export default function Contact() {
  return (
    <div className="container" style={{ padding: "100px 0", minHeight: "60vh", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
      <h1 className="text-4xl font-bold" style={{ color: "var(--color-secondary)" }}>Get in Touch</h1>
      <p className="text-lg text-gray-700 max-w-2xl text-center">Have questions about our curriculum or pricing? We're here to help.</p>
      
      <div className="card-floating" style={{ padding: "40px", width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label className="font-medium text-sm text-gray-700">Full Name</label>
          <input type="text" placeholder="Your name" style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-300)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label className="font-medium text-sm text-gray-700">Email Address</label>
          <input type="email" placeholder="Your email" style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-300)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label className="font-medium text-sm text-gray-700">Message</label>
          <textarea rows={4} placeholder="How can we help?" style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-300)", resize: "vertical" }}></textarea>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }}>Send Message</button>
      </div>
      
      <div style={{ marginTop: "24px" }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
