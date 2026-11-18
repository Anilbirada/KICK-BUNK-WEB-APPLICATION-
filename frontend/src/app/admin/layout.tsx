"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, Flame, Wine, Grid3X3, QrCode,
  Package, Beer, BookOpen, UtensilsCrossed, Users, Truck,
  Receipt, TrendingUp, Store, ChevronRight, LogOut, ArrowLeft,
  Bell, CheckCircle2, Film, Bot, Calendar, PartyPopper, Image as ImageIcon
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [selectedOutlet, setSelectedOutlet] = useState("BLR");

  const navigationSections = [
    {
      title: "OPERATIONS",
      items: [
        { name: "Executive Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Restaurant & Bar POS", href: "/admin/pos", icon: ShoppingCart },
        { name: "Kitchen Display (KDS)", href: "/admin/kot", icon: Flame, badge: "LIVE" },
        { name: "Bar Dispense Station", href: "/admin/bar", icon: Wine },
        { name: "Table Floor Plan", href: "/admin/tables", icon: Grid3X3 },
        { name: "Table QR Manager", href: "/admin/qr", icon: QrCode },
      ],
    },
    {
      title: "HOSPITALITY, MEDIA & AI",
      items: [
        { name: "Cinematic Videos", href: "/admin/videos", icon: Film, badge: "5 LIVE" },
        { name: "AI Content & Promos", href: "/admin/ai-promos", icon: Bot, badge: "REVIEW" },
        { name: "Party & Event Enquiries", href: "/admin/events", icon: PartyPopper },
        { name: "Guest Reservations", href: "/admin/reservations", icon: Calendar },
        { name: "Centralized Menu", href: "/admin/menu", icon: UtensilsCrossed },
      ],
    },
    {
      title: "INVENTORY & RECIPES",
      items: [
        { name: "Liquor & Bar Cellar", href: "/admin/inventory/liquor", icon: Beer },
        { name: "Kitchen Raw Materials", href: "/admin/inventory/restaurant", icon: Package },
        { name: "Recipe Costing & Margins", href: "/admin/recipes", icon: BookOpen },
      ],
    },
    {
      title: "MANAGEMENT & GOVERNANCE",
      items: [
        { name: "Staff & Attendance", href: "/admin/employees", icon: Users },
        { name: "Suppliers & Purchases", href: "/admin/suppliers", icon: Truck },
        { name: "Operating Expenses", href: "/admin/expenses", icon: Receipt },
        { name: "Financial & 5% GST Reports", href: "/admin/reports", icon: TrendingUp },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#382D25] flex font-sans">
      {/* 1. ENTERPRISE LIGHT LUXURY SIDEBAR */}
      <aside className="w-72 bg-[#F0E9DC] border-r border-[#C5A46D]/30 flex flex-col flex-shrink-0 z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#C5A46D]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] border border-[#C5A46D] p-1 flex items-center justify-center shadow-sm overflow-hidden">
              <img src="/logo.png" alt="Kick Bunk Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-serif text-base font-bold tracking-wider text-[#382D25]">
                KICK BUNK
              </h1>
              <p className="text-[9px] uppercase tracking-widest text-[#B66A4B] font-semibold">
                Enterprise Hospitality Suite
              </p>
            </div>
          </div>
        </div>

        {/* Outlet Selector */}
        <div className="p-4 border-b border-[#C5A46D]/20 bg-[#FAF8F2]/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-[#77716A] flex items-center gap-1.5">
              <Store className="w-3 h-3 text-[#B66A4B]" /> Active Outlet
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="w-full bg-white border border-[#C5A46D]/40 text-[#382D25] text-xs font-semibold rounded-lg p-2 focus:outline-none focus:border-[#B66A4B]"
          >
            <option value="BLR">Bengaluru Flagship (Garden Cabanas)</option>
            <option value="TPT">Tirupati Garden Resto-Bar (Lawn)</option>
          </select>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {navigationSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-widest text-[#77716A]">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#FAF8F2] text-[#382D25] font-bold shadow-sm border-l-4 border-[#C5A46D]"
                          : "text-[#77716A] hover:bg-[#FAF8F2] hover:text-[#382D25]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#B66A4B]" : "text-[#77716A]"}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#B66A4B] text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: User & Back to Customer Site */}
        <div className="p-3 border-t border-[#C5A46D]/20 bg-[#FAF8F2]/60 space-y-2">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C5A46D] text-[#382D25] font-bold flex items-center justify-center text-xs">
                VR
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#382D25]">Vikramaditya Roy</p>
                <p className="text-[10px] text-[#B66A4B]">General Manager</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              OPEN
            </span>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#77716A] hover:text-[#382D25] hover:bg-white rounded-lg transition-colors border border-[#C5A46D]/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Guest Site
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Operational Header */}
        <header className="h-16 bg-[#FAF8F2] border-b border-[#F0E9DC] px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B66A4B]">
              MANAGEMENT PLATFORM
            </span>
            <span className="text-[#C5A46D]">•</span>
            <span className="text-xs text-[#77716A] font-medium">
              5% GST Non-ITC Composition Mode (SAC 996331)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-[#382D25]">Cashier Shift Active</p>
              <p className="text-[10px] text-emerald-700">₹5,000 Opening Float</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F0E9DC] border border-[#C5A46D] text-[#382D25] flex items-center justify-center text-xs font-bold">
              GM
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1 bg-[#FAF8F2]">
          {children}
        </main>
      </div>
    </div>
  );
}
