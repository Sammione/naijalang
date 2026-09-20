import Link from "next/link";

export default function Pricing() {
  return (
    <div className="container" style={{ padding: "100px 0", minHeight: "60vh", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", textAlign: "center" }}>
      <h1 className="text-4xl font-bold" style={{ color: "var(--color-secondary)" }}>Simple, Transparent Pricing</h1>
      <p className="text-lg text-gray-700 max-w-2xl">Invest in your child's cultural heritage with our flexible plans.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "48px", width: "100%", maxWidth: "800px", textAlign: "left" }}>
        <div style={{ padding: "40px", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-white)" }}>
          <h3 className="text-2xl font-semibold mb-2">Starter</h3>
          <div className="text-3xl font-bold text-primary mb-6">$90<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
            <li>4 live classes per month</li>
            <li>Basic AI practice access</li>
            <li>Weekly homework</li>
          </ul>
          <Link href="/trial" className="btn btn-outline" style={{ width: "100%" }}>Book Trial</Link>
        </div>
        
        <div style={{ padding: "40px", border: "2px solid var(--color-primary)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-primary-light)", position: "relative" }}>
          <div style={{ position: "absolute", top: "-14px", right: "24px", backgroundColor: "var(--color-primary)", color: "white", padding: "4px 12px", borderRadius: "16px", fontSize: "14px", fontWeight: "600" }}>Most Popular</div>
          <h3 className="text-2xl font-semibold mb-2">Growth</h3>
          <div className="text-3xl font-bold text-primary mb-6">$150<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
            <li>8 live classes per month</li>
            <li>Unlimited AI practice</li>
            <li>Priority feedback</li>
            <li>Cultural workshops</li>
          </ul>
          <Link href="/trial" className="btn btn-primary" style={{ width: "100%" }}>Book Trial</Link>
        </div>
      </div>
      
      <p className="text-gray-500 mt-8">Family pricing available: 15% discount for additional children.</p>
      
      <div style={{ marginTop: "40px" }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
