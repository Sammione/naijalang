export default function Classes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
        <p className="text-gray-500 mt-2">View upcoming classes and past attendance.</p>
      </header>

      <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
        <h3 className="text-xl font-semibold mb-6">Upcoming This Week</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "var(--color-gray-50)", borderRadius: "var(--radius-md)" }}>
            <div>
              <p className="font-bold text-primary">Saturday, 10:00 AM</p>
              <p className="text-lg font-medium">Yoruba Foundation (Samuel)</p>
            </div>
            <button className="btn btn-primary">Join Class</button>
          </div>
        </div>
      </div>
    </div>
  );
}
