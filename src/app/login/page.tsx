import Link from "next/link";

export default function Login() {
  return (
    <div className="container" style={{ padding: "100px 0", minHeight: "60vh", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
      <h1 className="text-4xl font-bold" style={{ color: "var(--color-secondary)" }}>Welcome Back</h1>
      <p className="text-lg text-gray-700">Log in to your parent or teacher dashboard.</p>
      
      <div className="card-floating" style={{ padding: "40px", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label className="font-medium text-sm text-gray-700">Email Address</label>
          <input type="email" placeholder="Enter your email" style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-300)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label className="font-medium text-sm text-gray-700">Password</label>
          <input type="password" placeholder="Enter your password" style={{ padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-gray-300)" }} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>Log In</button>
      </div>
      
      <div style={{ marginTop: "24px" }}>
        <Link href="/" className="btn btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
