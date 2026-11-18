"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Grid3X3, Users, Clock, CheckCircle2, AlertCircle, Sparkles,
  ArrowRightLeft, Layers, Plus, RefreshCw, QrCode, ExternalLink,
  Search, ShieldCheck, Check
} from "lucide-react";

interface RestaurantTableItem {
  id: string;
  table_number: string;
  capacity: number;
  dining_area: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING" | "BILLING";
  is_active: boolean;
  qr_token?: string;
}

export default function TableManagementPage() {
  const [tables, setTables] = useState<RestaurantTableItem[]>([]);
  const [activeArea, setActiveArea] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchTables = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/management/tables");
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      } else {
        throw new Error("Failed to load");
      }
    } catch (_) {
      // Luxury Fallback Tables
      const fallbackList: RestaurantTableItem[] = [
        { id: "tbl-01", table_number: "01", capacity: 4, dining_area: "Open-Air Lush Garden", status: "AVAILABLE", is_active: true, qr_token: "sample-table-01" },
        { id: "tbl-02", table_number: "02", capacity: 4, dining_area: "Open-Air Lush Garden", status: "OCCUPIED", is_active: true, qr_token: "sample-table-02" },
        { id: "tbl-03", table_number: "03", capacity: 6, dining_area: "Open-Air Lush Garden", status: "AVAILABLE", is_active: true, qr_token: "sample-table-03" },
        { id: "tbl-04", table_number: "04", capacity: 4, dining_area: "Open-Air Lush Garden", status: "AVAILABLE", is_active: true, qr_token: "sample-table-04" },
        { id: "tbl-05", table_number: "05", capacity: 2, dining_area: "Open-Air Lush Garden", status: "CLEANING", is_active: true, qr_token: "sample-table-05" },
        { id: "tbl-06", table_number: "06", capacity: 8, dining_area: "Open-Air Lush Garden", status: "AVAILABLE", is_active: true, qr_token: "sample-table-06" },
        { id: "tbl-07", table_number: "07", capacity: 4, dining_area: "Open-Air Lush Garden", status: "OCCUPIED", is_active: true, qr_token: "sample-table-07" },
        { id: "tbl-08", table_number: "08", capacity: 4, dining_area: "Open-Air Lush Garden", status: "AVAILABLE", is_active: true, qr_token: "sample-table-08" },
        { id: "tbl-cab-01", table_number: "CABANA-01", capacity: 8, dining_area: "Private Luxury Cabanas", status: "RESERVED", is_active: true, qr_token: "sample-cabana-01" },
        { id: "tbl-cab-02", table_number: "CABANA-02", capacity: 8, dining_area: "Private Luxury Cabanas", status: "AVAILABLE", is_active: true, qr_token: "sample-cabana-02" },
        { id: "tbl-bar-01", table_number: "BAR-01", capacity: 2, dining_area: "Resto-Bar & Cocktail Lounge", status: "OCCUPIED", is_active: true, qr_token: "sample-bar-01" },
        { id: "tbl-bar-02", table_number: "BAR-02", capacity: 4, dining_area: "Resto-Bar & Cocktail Lounge", status: "AVAILABLE", is_active: true, qr_token: "sample-bar-02" },
        { id: "tbl-hall-01", table_number: "HALL-01", capacity: 6, dining_area: "Family Dining Pavilion", status: "AVAILABLE", is_active: true, qr_token: "sample-hall-01" },
        { id: "tbl-hall-02", table_number: "HALL-02", capacity: 8, dining_area: "Family Dining Pavilion", status: "AVAILABLE", is_active: true, qr_token: "sample-hall-02" },
      ];
      setTables(fallbackList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleStatusChange = async (tableId: string, tableNumber: string, newStatus: string) => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/management/tables/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_id: tableId, status: newStatus }),
      });
      if (res.ok) {
        showToast(`Table ${tableNumber} updated to ${newStatus}`);
        setTables((prev) =>
          prev.map((t) => (t.id === tableId ? { ...t, status: newStatus as any } : t))
        );
      }
    } catch (_) {
      setTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, status: newStatus as any } : t))
      );
      showToast(`Table ${tableNumber} marked ${newStatus}`);
    }
  };

  // Derive unique areas dynamically
  const areas = Array.from(new Set(tables.map((t) => t.dining_area).filter(Boolean)));

  const filteredTables = tables.filter((t) => {
    const matchesArea = activeArea === "ALL" || t.dining_area === activeArea;
    const matchesSearch =
      t.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.dining_area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesSearch;
  });

  // Analytics Metrics
  const totalTables = tables.length;
  const availableCount = tables.filter((t) => t.status === "AVAILABLE").length;
  const occupiedCount = tables.filter((t) => t.status === "OCCUPIED" || t.status === "BILLING").length;
  const reservedCount = tables.filter((t) => t.status === "RESERVED").length;
  const cleaningCount = tables.filter((t) => t.status === "CLEANING").length;
  const totalCapacity = tables.reduce((acc, t) => acc + (t.capacity || 4), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#382D25] text-[#FAF8F2] shadow-2xl border border-[#C5A46D] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Luxury Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD3] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F0E9DC] text-[#B66A4B] text-[10px] font-bold uppercase tracking-wider">
              Floor Plan & Table Management
            </span>
            <span className="text-xs text-[#77716A]">Real-Time POS & Dining Floor Synchronization</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#382D25]">
            Floor Zones, Occupancy & Seating States
          </h1>
          <p className="text-sm text-[#77716A] mt-1">
            Monitor live table occupancy, manage turnarounds, and inspect dining area capacity across all sections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/qr"
            className="px-5 py-3 rounded-2xl bg-[#382D25] hover:bg-[#251E19] text-[#FAF8F2] font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C5A46D]" />
            <span>+ Create Table & QR</span>
          </Link>
          <button
            onClick={fetchTables}
            className="p-3 rounded-2xl bg-[#FAF8F2] hover:bg-[#F0E9DC] border border-[#E7DFD3] text-[#77716A] hover:text-[#382D25] transition"
            title="Refresh Live Floor"
          >
            <RefreshCw className="w-4 h-4 text-[#C5A46D]" />
          </button>
        </div>
      </div>

      {/* Floor Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E7DFD3] shadow-sm">
          <span className="text-[10px] font-bold text-[#77716A] uppercase tracking-wider block">Total Tables</span>
          <span className="font-serif text-2xl font-bold text-[#382D25] mt-1 block">{totalTables}</span>
          <span className="text-[11px] text-[#77716A]">{totalCapacity} Total Seats</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Available</span>
          <span className="font-serif text-2xl font-bold text-emerald-700 mt-1 block">{availableCount}</span>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for Guests</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Occupied</span>
          <span className="font-serif text-2xl font-bold text-amber-700 mt-1 block">{occupiedCount}</span>
          <span className="text-[11px] text-amber-600 font-medium">Dining & Ordering</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-purple-200/80 shadow-sm bg-gradient-to-br from-white to-purple-50/30">
          <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">Reserved</span>
          <span className="font-serif text-2xl font-bold text-purple-700 mt-1 block">{reservedCount}</span>
          <span className="text-[11px] text-purple-600 font-medium">Upcoming Bookings</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-yellow-200/80 shadow-sm bg-gradient-to-br from-white to-yellow-50/30">
          <span className="text-[10px] font-bold text-yellow-900 uppercase tracking-wider block">Cleaning</span>
          <span className="font-serif text-2xl font-bold text-yellow-700 mt-1 block">{cleaningCount}</span>
          <span className="text-[11px] text-yellow-600 font-medium">Turnaround Stage</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E7DFD3] shadow-sm">
          <span className="text-[10px] font-bold text-[#B66A4B] uppercase tracking-wider block">Occupancy Rate</span>
          <span className="font-serif text-2xl font-bold text-[#382D25] mt-1 block">
            {totalTables > 0 ? Math.round((occupiedCount / totalTables) * 100) : 0}%
          </span>
          <span className="text-[11px] text-[#77716A]">Live Floor Capacity</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF8F2] rounded-2xl p-4 border border-[#E7DFD3] flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#77716A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search table or section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-[#E7DFD3] text-xs text-[#382D25] placeholder-[#77716A] focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        {/* Dynamic Section Filter Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <button
            onClick={() => setActiveArea("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeArea === "ALL"
                ? "bg-[#382D25] text-white shadow-sm"
                : "bg-white border border-[#E7DFD3] text-[#77716A] hover:text-[#382D25]"
            }`}
          >
            All Areas ({tables.length})
          </button>
          {areas.map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveArea(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeArea === sec
                  ? "bg-[#382D25] text-white shadow-sm"
                  : "bg-white border border-[#E7DFD3] text-[#77716A] hover:text-[#382D25]"
              }`}
            >
              {sec} ({tables.filter((t) => t.dining_area === sec).length})
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#C5A46D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#382D25]">Loading restaurant floor plan...</p>
        </div>
      )}

      {/* Floor Plan Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredTables.map((t) => {
          const isAvailable = t.status === "AVAILABLE";
          const isOccupied = t.status === "OCCUPIED" || t.status === "BILLING";
          const isReserved = t.status === "RESERVED";
          const isCleaning = t.status === "CLEANING";

          return (
            <div
              key={t.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                isOccupied
                  ? "bg-gradient-to-br from-white via-amber-50/20 to-amber-100/30 border-amber-300"
                  : isReserved
                  ? "bg-gradient-to-br from-white via-purple-50/20 to-purple-100/30 border-purple-300"
                  : isCleaning
                  ? "bg-gradient-to-br from-white via-yellow-50/20 to-yellow-100/30 border-yellow-300"
                  : "bg-white border-[#E7DFD3] hover:border-[#C5A46D]"
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B66A4B] block">
                      KICK BUNK TABLE
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#382D25]">
                      Table {t.table_number}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-xs ${
                      isOccupied
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : isReserved
                        ? "bg-purple-100 text-purple-900 border-purple-300"
                        : isCleaning
                        ? "bg-yellow-100 text-yellow-900 border-yellow-300"
                        : "bg-emerald-100 text-emerald-900 border-emerald-300"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                {/* Section & Capacity */}
                <div className="space-y-1 mt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#382D25] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#C5A46D]" />
                    <span>{t.dining_area}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#77716A]">
                    <Users className="w-3.5 h-3.5 text-[#B66A4B]" />
                    <span>Capacity: {t.capacity || 4} Guests</span>
                  </div>
                </div>
              </div>

              {/* Direct QR Link Pill */}
              <div className="pt-2 border-t border-[#E7DFD3] flex items-center justify-between text-xs">
                <Link
                  href={`/order/${t.qr_token || `sample-table-${t.table_number}`}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#B66A4B] hover:text-[#382D25] transition"
                  title="Open Dine-in QR Menu"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Dine-In Menu</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </Link>

                <span className="text-[10px] font-mono text-[#77716A] bg-[#FAF8F2] px-2 py-0.5 rounded border border-[#E7DFD3]">
                  ID: {t.table_number}
                </span>
              </div>

              {/* Interactive Status Switcher Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  onClick={() => handleStatusChange(t.id, t.table_number, "AVAILABLE")}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition ${
                    isAvailable
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-[#FAF8F2] hover:bg-emerald-50 text-[#77716A] hover:text-emerald-700 border-[#E7DFD3]"
                  }`}
                  title="Mark Vacant / Available"
                >
                  Vacant
                </button>

                <button
                  onClick={() => handleStatusChange(t.id, t.table_number, "OCCUPIED")}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition ${
                    isOccupied
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-[#FAF8F2] hover:bg-amber-50 text-[#77716A] hover:text-amber-800 border-[#E7DFD3]"
                  }`}
                  title="Mark Table Occupied"
                >
                  Occupied
                </button>

                <button
                  onClick={() => handleStatusChange(t.id, t.table_number, "RESERVED")}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition ${
                    isReserved
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-[#FAF8F2] hover:bg-purple-50 text-[#77716A] hover:text-purple-800 border-[#E7DFD3]"
                  }`}
                  title="Mark Reserved"
                >
                  Reserved
                </button>

                <button
                  onClick={() => handleStatusChange(t.id, t.table_number, "CLEANING")}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition ${
                    isCleaning
                      ? "bg-yellow-600 text-white border-yellow-600 shadow-sm"
                      : "bg-[#FAF8F2] hover:bg-yellow-50 text-[#77716A] hover:text-yellow-800 border-[#E7DFD3]"
                  }`}
                  title="Mark Cleaning"
                >
                  Clean
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
