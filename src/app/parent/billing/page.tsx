"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import PaymentModal from "@/components/PaymentModal";
import { 
  CreditCard, 
  CheckCircle, 
  Calendar, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight,
  Clock
} from "lucide-react";

export default function Billing() {
  const { invoices } = useApp();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Online Tuition Payments</h1>
          <p className="text-gray-500 mt-1">Manage active subscriptions, invoices, and pay online with Card or Bank Transfer.</p>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="btn btn-primary"
          style={{
            padding: "12px 24px",
            backgroundColor: "#163328",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 18px rgba(22, 51, 40, 0.25)"
          }}
        >
          <CreditCard size={18} />
          Pay Online Now
        </button>
      </header>

      {/* Current Active Plan Card */}
      <div className="card-floating" style={{ padding: "var(--spacing-6)", borderLeft: "6px solid var(--color-primary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                Active Plan • Auto-Renewing
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>Child: Samuel Adewale</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Heritage Starter Plan</h3>
            <p className="text-gray-600 mt-1">4 live 1-on-1 private classes per month + unlimited AI tone practice & homework grading.</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)" }}>$90.00</span>
              <span style={{ fontSize: "0.9rem", color: "var(--color-gray-500)" }}>/ month</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-gray-600)", fontWeight: 500 }}>
              Equivalent: ₦125,000 NGN
            </div>
            <p className="text-xs text-gray-500 mt-1">Next scheduled billing: Oct 15, 2026</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-gray-200)", paddingTop: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--color-gray-700)" }}>
            <CreditCard size={18} color="var(--color-primary)" />
            <span>Default payment method: <strong>Mastercard ending in 4242</strong></span>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn btn-outline"
              style={{ fontSize: "0.85rem", padding: "8px 16px" }}
            >
              Make One-Off Payment
            </button>
            <button
              onClick={() => alert("Payment method updated!")}
              className="btn btn-secondary"
              style={{ fontSize: "0.85rem", padding: "8px 16px" }}
            >
              Change Card
            </button>
          </div>
        </div>
      </div>

      {/* Online Invoices & Payment History */}
      <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment History & Receipts</h2>
            <p className="text-sm text-gray-500 mt-1">
              Download tax receipts and view instant payment verification.
            </p>
          </div>

          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
            <ShieldCheck size={16} /> 100% Secure Transactions
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {invoices.map((inv) => (
            <div
              key={inv.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                backgroundColor: "var(--color-gray-50)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-gray-200)",
                flexWrap: "wrap",
                gap: "12px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-secondary)" }}>
                    {inv.invoiceNumber}
                  </span>
                  <span style={{
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <CheckCircle size={12} /> {inv.status}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--color-gray-600)" }}>
                  {inv.description} • {inv.date}
                </p>
                <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                  Paid via: {inv.method}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-gray-900)", display: "block" }}>
                    ${inv.amountUSD}.00
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                    (₦{inv.amountNGN.toLocaleString()})
                  </span>
                </div>

                <button
                  onClick={() => alert(`Receipt ${inv.invoiceNumber} downloaded!`)}
                  className="btn btn-outline"
                  style={{
                    fontSize: "0.8rem",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Download size={14} />
                  Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Online Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planName="Heritage Starter Plan (Monthly Tuition)"
        defaultPriceUSD={90}
        defaultPriceNGN={125000}
      />
    </div>
  );
}
