import Link from "next/link";

export default function StudentProfile() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Link href="/parent/children" className="text-sm text-gray-500 hover-underline mb-2 block">← Back to Children</Link>
          <h1 className="text-3xl font-bold text-gray-900">Samuel Adewale</h1>
          <p className="text-gray-500 mt-2">8 Years Old • Yoruba (Foundation)</p>
        </div>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold" }}>S</div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-6)" }}>
        <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
          <h2 className="text-xl font-semibold mb-4">Current Module</h2>
          <p className="text-gray-700 font-medium">Unit 3: Market & Food</p>
          <p className="text-sm text-gray-500 mt-2">Learning to identify common foods and ask for prices politely.</p>
        </div>

        <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
          <h2 className="text-xl font-semibold mb-4">Teacher</h2>
          <p className="text-gray-700 font-medium">Mrs. Ojo</p>
          <p className="text-sm text-gray-500 mt-2">Next class: Saturday 10:00 AM</p>
        </div>
      </div>
      
      <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
        <h2 className="text-xl font-semibold mb-6">Detailed Progress</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: "500" }}>
              <span>Speaking & Tones</span>
              <span>70%</span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--color-gray-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div style={{ height: "100%", backgroundColor: "var(--color-accent)", width: "70%", borderRadius: "var(--radius-full)" }}></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: "500" }}>
              <span>Listening Comprehension</span>
              <span>85%</span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "var(--color-gray-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div style={{ height: "100%", backgroundColor: "var(--color-accent)", width: "85%", borderRadius: "var(--radius-full)" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
