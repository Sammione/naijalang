export default function Billing() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h1>
        <p className="text-gray-500 mt-2">Manage your active plans and payment methods.</p>
      </header>

      <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h3 className="text-xl font-semibold mb-2">Starter Plan (1 Child)</h3>
            <p className="text-gray-600">4 live classes per month + AI Practice</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="text-2xl font-bold text-gray-900">$90.00</p>
            <p className="text-sm text-gray-500">Renews on Oct 15, 2026</p>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "16px", borderTop: "1px solid var(--color-gray-200)", paddingTop: "24px" }}>
          <button className="btn btn-outline">Update Payment Method</button>
          <button className="btn btn-secondary">Cancel Subscription</button>
        </div>
      </div>
    </div>
  );
}
