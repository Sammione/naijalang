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
  Clock,
  Receipt
} from "lucide-react";

export default function Billing() {
  const { roleInvoices, roleStudents, currentUser } = useApp();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const activeInvoice = roleInvoices[0];
  const activeStudent = roleStudents[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Tuition Payments</h1>
          <p className="text-gray-500 mt-1">Manage active language subscriptions, invoices, and pay online securely.</p>
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
          Pay Tuition Online
        </button>
      </header>

      {/* Current Active Plan Card */}
      {activeInvoice ? (
        <div className="card-floating" style={{ padding: "var(--spacing-6)", borderLeft: "6px solid var(--color-primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                  Active Subscription • Paid
                </span>
                {activeStudent && (
                  <span style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>Learner: {activeStudent.name}</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{activeInvoice.description}</h3>
              <p className="text-gray-600 mt-1">Includes live private 1-on-1 sessions, curated dialect resources, and instructor evaluation.</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-secondary)" }}>${activeInvoice.amountUSD}.00</span>
                <span style={{ fontSize: "0.9rem", color: "var(--color-gray-500)" }}>/ month</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-gray-600)", fontWeight: 500 }}>
                Equivalent: ₦{activeInvoice.amountNGN.toLocaleString()} NGN
              </div>
              <p className="text-xs text-gray-500 mt-1">Status: Paid on {activeInvoice.date}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-gray-200)", paddingTop: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--color-gray-700)" }}>
              <CreditCard size={18} color="var(--color-primary)" />
              <span>Payment method: <strong>{activeInvoice.method}</strong></span>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn btn-outline"
                style={{ fontSize: "0.85rem", padding: "8px 16px" }}
              >
                Make Another Payment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-floating" style={{ padding: "36px", textAlign: "center" }}>
          <Receipt size={36} color="var(--color-gray-400)" style={{ margin: "0 auto 12px" }} />
          <h3 className="text-xl font-bold text-gray-900">No Active Tuition Subscription</h3>
          <p className="text-sm text-gray-500 max-w-md" style={{ margin: "4px auto 20px" }}>
            Enroll your child in a 1-on-1 language immersion plan or pay single session tuition online.
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="btn btn-primary"
            style={{ padding: "10px 24px" }}
          >
            Enroll & Pay Tuition Now
          </button>
        </div>
      )}

      {/* Online Invoices & Payment History */}
      <div className="card-floating" style={{ padding: "var(--spacing-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Invoice History & Receipts</h2>
            <p className="text-sm text-gray-500 mt-1">Download official receipts for family education records and company expense claims.</p>
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>
            Currency: <strong>USD ($) / NGN (₦)</strong>
          </span>
        </div>

        {roleInvoices.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-gray-200)", color: "var(--color-gray-600)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 600 }}>Invoice #</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600 }}>Date</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600 }}>Plan Description</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600 }}>Amount (USD / NGN)</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600 }}>Payment Method</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {roleInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: "1px solid var(--color-gray-100)" }}>
                    <td style={{ padding: "16px", fontWeight: 700, color: "var(--color-secondary)" }}>
                      {inv.invoiceNumber}
                    </td>
                    <td style={{ padding: "16px", color: "var(--color-gray-600)" }}>
                      {inv.date}
                    </td>
                    <td style={{ padding: "16px", color: "var(--color-gray-800)" }}>
                      {inv.description}
                    </td>
                    <td style={{ padding: "16px", fontWeight: 700 }}>
                      ${inv.amountUSD}.00
                      <span style={{ display: "block", fontSize: "0.75rem", color: "var(--color-gray-500)", fontWeight: 400 }}>
                        ₦{inv.amountNGN.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: "16px", color: "var(--color-gray-600)", fontSize: "0.85rem" }}>
                      {inv.method}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: 700
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <button
                        onClick={() => alert(`Downloading official receipt for invoice ${inv.invoiceNumber}...`)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--color-primary)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Download size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--color-gray-500)" }}>
            <p>No past invoices recorded on your account yet.</p>
          </div>
        )}
      </div>

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          planName="Heritage Starter Plan"
          defaultPriceUSD={90}
          defaultPriceNGN={125000}
        />
      )}
    </div>
  );
}
