"use client";

import React, { useState, useEffect } from "react";
import { 
  User, Phone, Mail, Award, Clock, ArrowRight, 
  LogOut, ShieldCheck, ShoppingBag, Sparkles, CheckCircle2 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export default function AccountPage() {
  const { user, token, isAuthenticated, login, register, logout, isLoading } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      if (token) {
        try {
          const orders = await api.getCustomerOrders(token);
          setRecentOrders(orders);
        } catch (_) {}
      }
    }
    fetchOrders();
  }, [token]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (isRegisterMode) {
        await register({
          phone: phoneOrEmail,
          full_name: fullName,
          email: email.trim() || undefined,
          password,
        });
      } else {
        await login(phoneOrEmail, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#B58A45] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If Authenticated, show Profile and Order History
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-[#F7F3EB] py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DA] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#25231F] text-[#DCC18B] flex items-center justify-center font-bold text-2xl border border-[#B58A45]/40 shadow-md">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-playfair text-2xl font-bold text-[#25231F]">
                    {user.fullName}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 bg-green-100 px-2 py-0.5 rounded-full border border-green-300">
                    VIP Member
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-1 flex items-center gap-3">
                  <span>{user.phone}</span>
                  {user.email && <span>• {user.email}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="bg-[#EFE7DA]/60 px-4 py-2.5 rounded-2xl border border-[#B58A45]/20 text-center">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-semibold">
                  Loyalty Points
                </span>
                <span className="font-serif text-xl font-bold text-[#B58A45]">
                  {user.loyaltyPoints} Pts
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl text-neutral-500 hover:text-red-600 hover:bg-neutral-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Past Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-[#25231F]">
                Your Dining & Order History
              </h2>
              <a href="/menu" className="text-xs font-bold text-[#B58A45] hover:underline">
                Explore Menu →
              </a>
            </div>

            {recentOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-[#EFE7DA] text-center space-y-3">
                <Clock className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs text-neutral-500">
                  No orders found in your account yet.
                </p>
                <a
                  href="/menu"
                  className="inline-block text-xs font-bold text-[#B58A45] underline"
                >
                  Order now from our digital menu
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-5 border border-[#EFE7DA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#25231F]">
                          #{ord.order_number}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
                          {ord.order_status}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {ord.table_number ? `Dine-In • Table ${ord.table_number}` : "Takeaway / Delivery"} • {ord.items.length} items
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="font-serif text-lg font-bold text-[#25231F]">
                        ₹{ord.final_amount}
                      </span>
                      <a
                        href={`/track/${ord.order_number}`}
                        className="py-2 px-4 rounded-xl bg-[#25231F] text-[#DCC18B] text-xs font-bold hover:bg-[#38342D] transition-colors"
                      >
                        Track Status
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show Login / Register form
  return (
    <div className="min-h-screen bg-[#F7F3EB] py-12 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DA] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#25231F] p-1.5 border border-[#B58A45]/40 flex items-center justify-center mx-auto shadow-md">
            <img src="/images/logo.png" alt="KICK BUNK" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#25231F]">
            {isRegisterMode ? "Create Customer Account" : "Sign In to KICK BUNK"}
          </h1>
          <p className="text-xs text-neutral-500">
            {isRegisterMode
              ? "Join our luxury dining circle and earn 50 welcome points."
              : "Access your order history, table reservations, and points."}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {isRegisterMode && (
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Anil Kumar"
                className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45]"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">
              Phone Number or Email
            </label>
            <input
              type="text"
              required
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder="+91 98765 43210 or email@domain.com"
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45]"
            />
          </div>

          {isRegisterMode && (
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anil@example.com"
                className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45]"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#25231F] hover:bg-[#38342D] text-[#DCC18B] font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-2"
          >
            {isRegisterMode ? "Create Account & Get 50 Pts" : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMsg("");
            }}
            className="text-[#B58A45] font-bold hover:underline"
          >
            {isRegisterMode
              ? "Already have an account? Sign In"
              : "Don't have an account? Register"}
          </button>
        </div>

        {/* Guest browsing notice */}
        <div className="text-center pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
          Guest ordering is fully supported! You do not need to log in to scan table QR codes or place food orders.
        </div>
      </div>
    </div>
  );
}
