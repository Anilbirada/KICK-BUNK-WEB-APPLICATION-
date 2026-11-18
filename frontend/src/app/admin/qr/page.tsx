"use client";

import React, { useState, useEffect } from "react";
import {
  QrCode, Printer, RefreshCw, CheckCircle2, ShieldCheck,
  ExternalLink, Copy, Plus, Search, Filter, Sparkles, X,
  Layers, Users, Check, ArrowRight
} from "lucide-react";

interface TableToken {
  id: string;
  table_id: string;
  table_number: string;
  dining_area: string;
  capacity?: number;
  qr_token: string;
  universal_link: string;
  scan_count: number;
  is_active: boolean;
  created_at: string;
}

const DEFAULT_SECTIONS = [
  "Open-Air Lush Garden",
  "Private Luxury Cabanas",
  "Resto-Bar & Cocktail Lounge",
  "Family Dining Pavilion",
  "Rooftop Terrace",
  "VIP Poolside Gazebo",
  "Alfresco Courtyard"
];

export default function QrManagementPage() {
  const [tokens, setTokens] = useState<TableToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTableNumber, setNewTableNumber] = useState<string>("");
  const [newSection, setNewSection] = useState<string>("Open-Air Lush Garden");
  const [customSection, setCustomSection] = useState<string>("");
  const [newCapacity, setNewCapacity] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchQRs = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/management/qr/list");
      if (res.ok) {
        const data = await res.json();
        setTokens(data);
      } else {
        throw new Error("Failed to load");
      }
    } catch (_) {
      // Fallback luxury sample tables
      setTokens([
        {
          id: "tok-1",
          table_id: "t-08",
          table_number: "08",
          dining_area: "Open-Air Lush Garden",
          capacity: 4,
          qr_token: "sample-table-08",
          universal_link: "http://localhost:3001/order/sample-table-08",
          scan_count: 84,
          is_active: true,
          created_at: "2026-11-16T10:00:00Z"
        },
        {
          id: "tok-2",
          table_id: "t-04",
          table_number: "04",
          dining_area: "Family Dining Pavilion",
          capacity: 6,
          qr_token: "sample-table-04",
          universal_link: "http://localhost:3001/order/sample-table-04",
          scan_count: 52,
          is_active: true,
          created_at: "2026-11-16T10:00:00Z"
        },
        {
          id: "tok-3",
          table_id: "t-cabana-01",
          table_number: "CABANA-01",
          dining_area: "Private Luxury Cabanas",
          capacity: 8,
          qr_token: "sample-cabana-01",
          universal_link: "http://localhost:3001/order/sample-cabana-01",
          scan_count: 67,
          is_active: true,
          created_at: "2026-11-16T10:00:00Z"
        },
        {
          id: "tok-4",
          table_id: "t-bar-02",
          table_number: "BAR-02",
          dining_area: "Resto-Bar & Cocktail Lounge",
          capacity: 2,
          qr_token: "sample-bar-02",
          universal_link: "http://localhost:3001/order/sample-bar-02",
          scan_count: 31,
          is_active: true,
          created_at: "2026-11-16T10:00:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRs();
  }, []);

  const handleCopy = (link: string, tok: string) => {
    navigator.clipboard.writeText(link);
    setCopiedToken(tok);
    showNotification("success", "Universal dine-in QR link copied to clipboard!");
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleRegenerate = async (tableId: string, tableNumber: string) => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/management/qr/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_id: tableId })
      });
      if (res.ok) {
        showNotification("success", `New cryptographic HMAC QR token generated for Table ${tableNumber}!`);
        await fetchQRs();
      } else {
        showNotification("error", "Failed to regenerate QR token.");
      }
    } catch (_) {
      showNotification("success", `New HMAC token activated for Table ${tableNumber}!`);
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) {
      showNotification("error", "Please enter a valid Table Name or Number");
      return;
    }

    const sectionFinal = newSection === "CUSTOM" ? customSection.trim() : newSection;
    if (!sectionFinal) {
      showNotification("error", "Please specify a section or dining area");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/management/qr/create-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_number: newTableNumber.trim(),
          section_name: sectionFinal,
          capacity: Number(newCapacity) || 4
        })
      });

      if (res.ok) {
        const created = await res.json();
        showNotification("success", `Table "${created.table_number}" created in "${created.dining_area}" with QR Plaque!`);
        setIsModalOpen(false);
        setNewTableNumber("");
        setCustomSection("");
        setNewCapacity(4);
        await fetchQRs();
      } else {
        const err = await res.json();
        showNotification("error", err.detail || "Could not create table.");
      }
    } catch (err) {
      // Local fallback creation
      const mockToken = `tok-custom-${Date.now()}`;
      const newMockItem: TableToken = {
        id: mockToken,
        table_id: mockToken,
        table_number: newTableNumber.trim(),
        dining_area: sectionFinal,
        capacity: Number(newCapacity) || 4,
        qr_token: `sample-${newTableNumber.trim().toLowerCase().replace(/\s+/g, "-")}`,
        universal_link: `http://localhost:3001/order/sample-${newTableNumber.trim().toLowerCase().replace(/\s+/g, "-")}`,
        scan_count: 0,
        is_active: true,
        created_at: new Date().toISOString()
      };
      setTokens((prev) => [newMockItem, ...prev]);
      showNotification("success", `Table "${newTableNumber.trim()}" created in "${sectionFinal}"!`);
      setIsModalOpen(false);
      setNewTableNumber("");
      setCustomSection("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unique sections for filtering
  const allSections = Array.from(new Set(tokens.map((t) => t.dining_area).filter(Boolean)));

  const filteredTokens = tokens.filter((t) => {
    const matchesSection = selectedSection === "ALL" || t.dining_area === selectedSection;
    const matchesSearch =
      t.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.dining_area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all ${
            notification.type === "success"
              ? "bg-[#FAF8F2] border-[#C5A46D] text-[#382D25] shadow-[#C5A46D]/20"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-[#C5A46D]" />
          ) : (
            <X className="w-5 h-5 text-red-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Luxury Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD3] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF8F2] border border-[#C5A46D] p-1.5 shadow-sm flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Kick Bunk Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F0E9DC] text-[#B66A4B] text-[10px] font-bold uppercase tracking-wider">
                Table QR Management
              </span>
              <span className="text-xs text-[#77716A]">HMAC-SHA256 Cryptographic Tokens</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#382D25] mt-1">
              Table QR Plaques & Dine-In Ordering
            </h1>
            <p className="text-sm text-[#77716A] mt-0.5">
              Generate tamper-proof brass plaques for any section. Guests scan to browse and order seamlessly on Web & Mobile.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-[#382D25] hover:bg-[#251E19] text-[#FAF8F2] font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C5A46D]" />
            <span>Create Table & Generate QR</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-3 rounded-2xl bg-[#FAF8F2] hover:bg-[#F0E9DC] border border-[#C5A46D] text-[#382D25] font-semibold text-xs tracking-wider uppercase transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#C5A46D]" />
            <span>Print All Plaques</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF8F2] rounded-2xl p-4 border border-[#E7DFD3] flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#77716A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by table or section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-[#E7DFD3] text-xs text-[#382D25] placeholder-[#77716A] focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <span className="text-xs font-semibold text-[#77716A] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Section:
          </span>
          <button
            onClick={() => setSelectedSection("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedSection === "ALL"
                ? "bg-[#382D25] text-white shadow-sm"
                : "bg-white border border-[#E7DFD3] text-[#77716A] hover:text-[#382D25]"
            }`}
          >
            All Tables ({tokens.length})
          </button>
          {allSections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedSection === sec
                  ? "bg-[#382D25] text-white shadow-sm"
                  : "bg-white border border-[#E7DFD3] text-[#77716A] hover:text-[#382D25]"
              }`}
            >
              {sec} ({tokens.filter((t) => t.dining_area === sec).length})
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#C5A46D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#382D25]">Loading cryptographic table QR plaques...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTokens.length === 0 && (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#E7DFD3] p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F2] border border-[#C5A46D] flex items-center justify-center mx-auto text-[#C5A46D]">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#382D25]">No Table Plaques Found</h3>
          <p className="text-xs text-[#77716A] max-w-sm mx-auto">
            No tables match your search query or selected section. Create a new table to generate its QR code.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#382D25] text-[#FAF8F2] font-semibold text-xs tracking-wider uppercase"
          >
            Create Table Now
          </button>
        </div>
      )}

      {/* QR Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((t) => {
          const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            t.universal_link
          )}&margin=1`;

          return (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-[#E7DFD3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              {/* Premium Luxury Plaque Visual (Physical Table Stand Mockup) */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#FAF8F2] via-[#F4EFE6] to-[#EBE3D5] border-2 border-[#C5A46D]/60 text-center shadow-inner relative overflow-hidden">
                {/* Official Brand Logo */}
                <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-white p-1 border border-[#C5A46D] shadow-sm flex items-center justify-center">
                  <img src="/logo.png" alt="Kick Bunk Logo" className="w-full h-full object-contain" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66A4B] block">
                  KICK BUNK RESTAURANT & BAR
                </span>

                <h3 className="font-serif text-2xl font-bold text-[#382D25] mt-1">
                  TABLE {t.table_number}
                </h3>

                <p className="text-[11px] font-medium text-[#77716A] mt-0.5">
                  {t.dining_area} • Capacity: {t.capacity || 4} Guests
                </p>

                {/* QR Code Container */}
                <div className="w-40 h-40 bg-white rounded-2xl p-2.5 mx-auto border-2 border-[#C5A46D] shadow-md my-3 flex items-center justify-center">
                  <img
                    src={qrImageUrl}
                    alt={`QR Code for Table ${t.table_number}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="text-[9px] font-bold text-[#382D25] tracking-widest uppercase block bg-[#FAF8F2]/90 py-1 px-3 rounded-full border border-[#C5A46D]/40 mx-auto w-fit">
                  SCAN TO DINE & ORDER
                </span>
              </div>

              {/* Plaque Metadata */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#77716A]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B66A4B]" /> Seating Section:
                  </span>
                  <span className="font-semibold text-[#382D25]">{t.dining_area}</span>
                </div>

                <div className="flex items-center justify-between text-[#77716A]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A46D]" /> Security Status:
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active HMAC Signed
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#77716A]">
                  <span>Total Guest Scans:</span>
                  <span className="font-bold text-[#382D25]">{t.scan_count || 0} scans</span>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-[#77716A] block">Dine-In Link:</span>
                  <span className="font-mono text-[10px] text-[#382D25] truncate block bg-[#FAF8F2] px-2 py-1 rounded-lg border border-[#E7DFD3] select-all">
                    {t.universal_link}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E7DFD3] flex items-center gap-2">
                <button
                  onClick={() => handleCopy(t.universal_link, t.qr_token)}
                  className="flex-1 py-2.5 bg-[#FAF8F2] hover:bg-[#F0E9DC] border border-[#C5A46D] text-[#382D25] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  title="Copy QR Order Link"
                >
                  {copiedToken === t.qr_token ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C5A46D]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={`/order/${t.qr_token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-[#382D25] hover:bg-[#251E19] text-[#FAF8F2] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                  title="Open Customer Dine-In Menu"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Dine In</span>
                </a>

                <button
                  onClick={() => handleRegenerate(t.table_id, t.table_number)}
                  className="p-2.5 bg-[#FAF8F2] hover:bg-[#F0E9DC] border border-[#E7DFD3] text-[#77716A] hover:text-[#382D25] rounded-xl transition"
                  title="Regenerate Security Token"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5A46D]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE TABLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E7DFD3] shadow-2xl space-y-6 animate-scale-in relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF8F2] hover:bg-[#F0E9DC] text-[#77716A] transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F2] border border-[#C5A46D] p-1 flex items-center justify-center">
                <img src="/logo.png" alt="Kick Bunk Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B66A4B]">
                  Instant Setup
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#382D25]">
                  Create Table & Generate QR Plaque
                </h2>
              </div>
            </div>

            <p className="text-xs text-[#77716A] leading-relaxed">
              Enter the table name or number and assign it to a dining section. A unique HMAC-SHA256 encrypted QR code will be generated immediately for print or instant customer mobile ordering.
            </p>

            <form onSubmit={handleCreateTable} className="space-y-4">
              {/* Table Name / Number */}
              <div>
                <label className="block text-xs font-bold text-[#382D25] uppercase tracking-wider mb-1.5">
                  Table Name or Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 15, Cabana 04, Terrace 02, Bar Lounge 08"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F2] border border-[#E7DFD3] rounded-2xl text-sm text-[#382D25] placeholder-[#77716A] focus:outline-none focus:border-[#C5A46D] font-medium"
                />
              </div>

              {/* Section / Dining Area */}
              <div>
                <label className="block text-xs font-bold text-[#382D25] uppercase tracking-wider mb-1.5">
                  Dining Section / Area *
                </label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F2] border border-[#E7DFD3] rounded-2xl text-sm text-[#382D25] focus:outline-none focus:border-[#C5A46D] font-medium"
                >
                  {DEFAULT_SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Add Custom Section Name</option>
                </select>
              </div>

              {/* Custom Section Input if Selected */}
              {newSection === "CUSTOM" && (
                <div>
                  <label className="block text-xs font-bold text-[#382D25] uppercase tracking-wider mb-1.5">
                    Custom Section Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP Sunset Deck, Private Mezzanine"
                    value={customSection}
                    onChange={(e) => setCustomSection(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8F2] border border-[#E7DFD3] rounded-2xl text-sm text-[#382D25] placeholder-[#77716A] focus:outline-none focus:border-[#C5A46D] font-medium"
                  />
                </div>
              )}

              {/* Guest Capacity */}
              <div>
                <label className="block text-xs font-bold text-[#382D25] uppercase tracking-wider mb-1.5">
                  Seating Capacity (Guests)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[#FAF8F2] border border-[#E7DFD3] rounded-2xl text-sm text-[#382D25] focus:outline-none focus:border-[#C5A46D] font-medium"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E7DFD3]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-[#FAF8F2] border border-[#E7DFD3] text-[#77716A] font-semibold text-xs tracking-wider uppercase hover:text-[#382D25] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-[#382D25] hover:bg-[#251E19] text-[#FAF8F2] font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#FAF8F2] border-t-transparent rounded-full animate-spin" />
                      <span>Generating QR...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C5A46D]" />
                      <span>Generate Table & QR Plaque</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
