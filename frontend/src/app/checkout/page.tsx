"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CreditCard, Smartphone, Banknote, ShieldCheck, 
  Sparkles, CheckCircle2, AlertCircle, ArrowLeft 
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useTableSession } from "../../context/TableSessionContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    sessionId, items, itemCount, subtotal, cgst, sgst, 
    packagingFee, deliveryFee, finalAmount, clearCart 
  } = useCart();
  const { tableNumber, outletId, outletName, isDineInActive, sessionToken } = useTableSession();
  const { user, ensureGuestSession } = useAuth();

  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "COUNTER_BILLING">("UPI");
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const hasAlcohol = items.some((i) => i.is_alcohol);

  useEffect(() => {
    if (user) {
      if (user.fullName && user.fullName !== "Guest Diner") setCustomerName(user.fullName);
      if (user.phone && !user.phone.startsWith("guest_")) setCustomerPhone(user.phone);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-neutral-500">Your cart is empty.</p>
          <a href="/menu" className="text-sm font-bold text-[#B58A45] underline">
            Return to Menu
          </a>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (hasAlcohol && !ageConfirmed) {
      setErrorMessage("Please confirm that you are at least 21 years old to order alcoholic beverages.");
      return;
    }

    if (!customerName || customerName.trim().length < 2) {
      setErrorMessage("Please provide your full Name to place your order.");
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMessage("Please provide a valid 10-digit Mobile Number. Live kitchen order tracking and digital bill will be sent to this number.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure session exists
      await ensureGuestSession();

      // Submit Order to backend (which recalculates all financials in DB transaction)
      const orderPayload = {
        session_id: sessionId,
        outlet_id: outletId || "default-outlet",
        dining_channel: isDineInActive ? "DINE_IN" : "TAKEAWAY",
        table_number: isDineInActive ? tableNumber : null,
        qr_session_id: sessionToken || null,
        customer_name: customerName.trim(),
        customer_phone: `+91${cleanPhone}`,
        delivery_address: deliveryAddress.trim() || null,
        special_instructions: specialInstructions.trim() || null,
        payment_method: paymentMethod,
        age_verified: ageConfirmed,
      };

      const order = await api.createOrder(orderPayload);

      // If paying online (UPI or Card), initiate payment intent
      if (paymentMethod === "UPI" || paymentMethod === "CARD") {
        const payInit = await api.initiatePayment(order.id, paymentMethod);
        // Automatically verify payment in simulator mode
        await api.verifyPayment(payInit.payment_id, payInit.transaction_ref, true);
      }

      // Route to Order Confirmation
      router.push(`/order-confirmation/${order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EB] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <a href="/cart" className="p-2 rounded-full hover:bg-[#EFE7DA] text-neutral-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#25231F]">
              Confirm Your Order
            </h1>
            <p className="text-xs text-neutral-500">
              {isDineInActive ? `Dine-In • Table ${tableNumber}` : "Online Order Checkout"}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="space-y-6">
          {/* 1. Dining Channel / Table Confirmation */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE7DA] shadow-sm space-y-3">
            <h2 className="font-playfair text-lg font-bold text-[#25231F] flex items-center justify-between">
              <span>Dining Destination</span>
              {isDineInActive && (
                <span className="text-xs font-bold text-[#B58A45] bg-[#EFE7DA]/60 px-3 py-1 rounded-full border border-[#B58A45]/30">
                  Dine-In Active
                </span>
              )}
            </h2>

            {isDineInActive ? (
              <div className="p-4 rounded-xl bg-[#F7F3EB] border border-[#EFE7DA] flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#B58A45] font-bold block">
                    {outletName || "Kick Bunk Restaurant & Bar"}
                  </span>
                  <span className="font-playfair text-xl font-bold text-[#25231F]">
                    Table {tableNumber}
                  </span>
                </div>
                <div className="text-right text-[11px] text-neutral-500">
                  Food and drinks delivered <br /> directly to your table
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Contact Phone Number (For updates)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Customer Name & Special Requests */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE7DA] shadow-sm space-y-4 text-xs">
            <h2 className="font-playfair text-lg font-bold text-[#25231F]">
              Guest Details & Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">
                  Guest Full Name <span className="text-[#B58A45] font-bold">* (Required)</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45] text-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">
                  Mobile Phone Number <span className="text-[#B58A45] font-bold">* (10 Digits Required)</span>
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-lg border border-neutral-300 bg-[#EFE7DA]/50 text-neutral-700 font-bold text-xs">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45] text-sm"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  ⚡ Live KOT tracking & GST tax invoice will be sent to this number.
                </p>
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                Special Kitchen Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any dietary preferences or serving notes for the kitchen..."
                rows={2}
                className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45]"
              />
            </div>

            {/* Alcohol Compliance Disclaimer */}
            {hasAlcohol && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span>Legal Drinking Age Verification (21+)</span>
                </div>
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  Your order contains alcoholic beverages. In compliance with the Karnataka / Andhra Pradesh Excise Act, alcoholic beverages may only be ordered by and served to adults aged 21 years and older. Physical government ID verification may be requested by floor staff.
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B58A45] focus:ring-[#B58A45]"
                  />
                  <span className="font-bold text-xs text-[#25231F]">
                    I confirm that I am 21 years of age or older.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* 3. Payment Method Selection */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE7DA] shadow-sm space-y-4">
            <h2 className="font-playfair text-lg font-bold text-[#25231F]">
              Select Payment Method
            </h2>

            <div className="space-y-3">
              {/* Instant UPI */}
              <label
                onClick={() => setPaymentMethod("UPI")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "UPI"
                    ? "border-[#B58A45] bg-[#EFE7DA]/40 ring-1 ring-[#B58A45]"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#25231F] block">
                      UPI Instant Pay (GPay, PhonePe, Paytm, BHIM)
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Fast zero-contact digital payment
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                  className="text-[#B58A45] focus:ring-[#B58A45]"
                />
              </label>

              {/* Debit/Credit Card */}
              <label
                onClick={() => setPaymentMethod("CARD")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "CARD"
                    ? "border-[#B58A45] bg-[#EFE7DA]/40 ring-1 ring-[#B58A45]"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#25231F] block">
                      Credit / Debit Card
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Visa, MasterCard, RuPay, Amex
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "CARD"}
                  onChange={() => setPaymentMethod("CARD")}
                  className="text-[#B58A45] focus:ring-[#B58A45]"
                />
              </label>

              {/* Pay at Counter / Staff billing */}
              <label
                onClick={() => setPaymentMethod("COUNTER_BILLING")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "COUNTER_BILLING"
                    ? "border-[#B58A45] bg-[#EFE7DA]/40 ring-1 ring-[#B58A45]"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#25231F] block">
                      Pay at Counter / Table Staff Billing
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Settle your bill after enjoying your meal
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COUNTER_BILLING"}
                  onChange={() => setPaymentMethod("COUNTER_BILLING")}
                  className="text-[#B58A45] focus:ring-[#B58A45]"
                />
              </label>
            </div>
          </div>

          {/* 4. Final Review & Submit Button */}
          <div className="bg-[#25231F] text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-baseline justify-between border-b border-neutral-700/80 pb-4">
              <div>
                <span className="text-xs text-[#DCC18B] uppercase tracking-wider block font-semibold">
                  Total Payable Amount
                </span>
                <span className="text-[11px] text-neutral-400">
                  Includes 5% GST (2.5% CGST + 2.5% SGST)
                </span>
              </div>
              <span className="font-playfair text-3xl font-bold text-white">
                ₹{finalAmount}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#B58A45] hover:bg-[#966E2E] text-white font-bold text-sm tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Order to Kitchen...</span>
              ) : (
                <span>Confirm & Place Order →</span>
              )}
            </button>

            <div className="text-center text-[11px] text-neutral-400">
              Orders are immediately transmitted to the KICK BUNK kitchen display and POS terminal.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
