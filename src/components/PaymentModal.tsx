"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  X, 
  Download, 
  ArrowRight,
  Sparkles,
  Check
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  defaultPriceUSD?: number;
  defaultPriceNGN?: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  planName = "Heritage Starter Plan (4 Live Classes + AI Tutor)",
  defaultPriceUSD = 90,
  defaultPriceNGN = 125000
}: PaymentModalProps) {
  const { processPayment } = useApp();
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer" | "paystack">("card");
  
  // Card form state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("892");
  const [cardName, setCardName] = useState("Adewale Olumide");
  
  // Flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  if (!isOpen) return null;

  const currentAmount = currency === "USD" ? `$${defaultPriceUSD}.00` : `₦${defaultPriceNGN.toLocaleString()}`;

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const methodName = paymentMethod === "card" 
      ? `Credit Card (${currency})`
      : paymentMethod === "transfer" 
        ? "Direct Bank Transfer (GTBank / Zenith)"
        : "Paystack / Flutterwave Gateway";

    const success = await processPayment(defaultPriceUSD, defaultPriceNGN, methodName, planName);
    setIsProcessing(false);
    if (success) {
      setReceiptNumber("REC-" + Math.floor(100000 + Math.random() * 900000));
      setIsSuccess(true);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(18, 24, 38, 0.75)",
      backdropFilter: "blur(8px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      animation: "fadeIn 0.2s ease"
    }}>
      <div style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.3)",
        maxWidth: "600px",
        width: "100%",
        overflow: "hidden",
        border: "1px solid var(--color-gray-200)"
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px",
          borderBottom: "1px solid var(--color-gray-200)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#163328",
          color: "white"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Lock size={14} color="#86efac" />
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#86efac" }}>
                256-Bit SSL Encrypted Checkout
              </span>
            </div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "white", margin: 0 }}>
              Online Tuition Payment
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#d1d5db", margin: "2px 0 0" }}>
              {planName}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "white",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "28px" }}>
          {isSuccess ? (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "#dcfce7",
                color: "#15803d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <CheckCircle2 size={44} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-secondary)", marginBottom: "8px" }}>
                Payment Successful!
              </h3>
              <p style={{ color: "var(--color-gray-600)", fontSize: "0.95rem", maxWidth: "400px", margin: "0 auto 20px" }}>
                Your payment of <strong>{currentAmount}</strong> has been confirmed. Samuel's classes and curriculum materials are active!
              </p>

              <div style={{
                backgroundColor: "var(--color-gray-50)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                textAlign: "left",
                marginBottom: "24px",
                border: "1px dashed var(--color-gray-300)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--color-gray-500)" }}>Receipt Reference:</span>
                  <span style={{ fontWeight: 600 }}>{receiptNumber}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--color-gray-500)" }}>Date & Time:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--color-gray-500)" }}>Next Billing Cycle:</span>
                  <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>Nov 15, 2026</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "14px" }}
                >
                  Return to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Receipt #${receiptNumber} downloaded!`)}
                  className="btn btn-outline"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Download size={16} />
                  Download Receipt
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitPayment}>
              {/* Currency Selector */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)", textTransform: "uppercase", fontWeight: 600 }}>
                    Total Tuition Due:
                  </span>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-secondary)" }}>
                    {currentAmount}
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  backgroundColor: "var(--color-gray-100)",
                  padding: "4px",
                  borderRadius: "24px"
                }}>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: "none",
                      backgroundColor: currency === "USD" ? "var(--color-surface)" : "transparent",
                      color: currency === "USD" ? "var(--color-secondary)" : "var(--color-gray-600)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      boxShadow: currency === "USD" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
                    }}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("NGN")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: "none",
                      backgroundColor: currency === "NGN" ? "var(--color-surface)" : "transparent",
                      color: currency === "NGN" ? "var(--color-secondary)" : "var(--color-gray-600)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      boxShadow: currency === "NGN" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
                    }}
                  >
                    NGN (₦)
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-gray-600)", marginBottom: "8px" }}>
                  SELECT PAYMENT METHOD:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    style={{
                      padding: "12px 8px",
                      borderRadius: "var(--radius-md)",
                      border: paymentMethod === "card" ? "2px solid var(--color-primary)" : "1px solid var(--color-gray-200)",
                      backgroundColor: paymentMethod === "card" ? "var(--color-primary-light)" : "var(--color-surface)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: paymentMethod === "card" ? "var(--color-primary)" : "var(--color-gray-700)"
                    }}
                  >
                    <CreditCard size={20} />
                    Debit/Credit Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paystack")}
                    style={{
                      padding: "12px 8px",
                      borderRadius: "var(--radius-md)",
                      border: paymentMethod === "paystack" ? "2px solid #00c3f7" : "1px solid var(--color-gray-200)",
                      backgroundColor: paymentMethod === "paystack" ? "#e6faff" : "var(--color-surface)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: paymentMethod === "paystack" ? "#008db3" : "var(--color-gray-700)"
                    }}
                  >
                    <Sparkles size={20} />
                    Paystack / Flutterwave
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("transfer")}
                    style={{
                      padding: "12px 8px",
                      borderRadius: "var(--radius-md)",
                      border: paymentMethod === "transfer" ? "2px solid #16a34a" : "1px solid var(--color-gray-200)",
                      backgroundColor: paymentMethod === "transfer" ? "#f0fdf4" : "var(--color-surface)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: paymentMethod === "transfer" ? "#166534" : "var(--color-gray-700)"
                    }}
                  >
                    <Building2 size={20} />
                    Bank Transfer (NG)
                  </button>
                </div>
              </div>

              {/* Method form details */}
              {paymentMethod === "card" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "4px" }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-gray-300)",
                        fontSize: "0.95rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "4px" }}>
                      Card Number
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 38px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-gray-300)",
                          fontSize: "0.95rem",
                          letterSpacing: "0.05em"
                        }}
                      />
                      <CreditCard size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--color-gray-400)" }} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "4px" }}>
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-gray-300)",
                          fontSize: "0.95rem"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-gray-700)", marginBottom: "4px" }}>
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-gray-300)",
                          fontSize: "0.95rem"
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div style={{
                  backgroundColor: "var(--color-gray-50)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  marginBottom: "24px",
                  border: "1px solid var(--color-gray-200)"
                }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gray-800)", marginBottom: "8px" }}>
                    Instant Nigerian Bank Transfer Instructions:
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-gray-600)", marginBottom: "12px" }}>
                    Transfer directly from any Nigerian banking app (GTBank, Zenith, Access, Kuda, etc.) to the virtual account below:
                  </p>
                  <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-gray-300)", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem" }}>
                    <div><strong>Bank:</strong> GTBank / Paystack Titan</div>
                    <div><strong>Account Number:</strong> <span style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "1rem" }}>9920194821</span></div>
                    <div><strong>Account Name:</strong> Nija Language Hub / Adewale</div>
                    <div><strong>Amount:</strong> ₦125,000.00</div>
                  </div>
                </div>
              )}

              {paymentMethod === "paystack" && (
                <div style={{
                  backgroundColor: "#f0fdfa",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  marginBottom: "24px",
                  border: "1px solid #ccfbf1",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f766e", marginBottom: "4px" }}>
                    Paystack & Flutterwave Multi-Channel Gateway
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#115e59" }}>
                    Supports Cards (Verve, Mastercard, Visa), Apple Pay, USSD (*737#), and QR Code checkout.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {isProcessing ? (
                  <span>Processing secure payment...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Confirm & Pay {currentAmount} Now
                  </>
                )}
              </button>

              <div style={{ textAlign: "center", marginTop: "12px", fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                Secured by 256-bit encryption. You can cancel or pause your plan at any time.
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
