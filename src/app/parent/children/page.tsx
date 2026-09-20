import Link from "next/link";

export default function MyChildren() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      <header>
        <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
        <p className="text-gray-500 mt-2">Manage profiles and track detailed progress.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-6)" }}>
        <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold" }}>S</div>
            <div>
              <h2 className="text-2xl font-semibold">Samuel Adewale</h2>
              <p className="text-gray-500">8 Years Old • Yoruba (Beginner)</p>
            </div>
          </div>
          <Link href="/parent/children/samuel" className="btn btn-primary" style={{ width: "100%", display: "block", textAlign: "center" }}>View Full Profile</Link>
        </div>

        <div className="card-floating" style={{ padding: "var(--spacing-6)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed var(--color-gray-300)", backgroundColor: "transparent", cursor: "pointer" }}>
          <div style={{ textAlign: "center", color: "var(--color-gray-500)" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>+</div>
            <p className="font-medium">Add Another Child</p>
          </div>
        </div>
      </div>
    </div>
  );
}
