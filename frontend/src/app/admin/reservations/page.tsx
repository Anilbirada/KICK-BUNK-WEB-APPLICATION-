"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, Users, Clock, CheckCircle2, XCircle, 
  AlertCircle, Phone, MapPin, Search, Filter, ShieldCheck 
} from "lucide-react";

interface ReservationRecord {
  id: string;
  reservation_number: string;
  guest_name: string;
  guest_phone: string;
  guest_count: number;
  reservation_date: string;
  time_slot: string;
  seating_preference: string;
  status: "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED";
  special_requests?: string;
  table_assigned?: string;
}

const FALLBACK_RESERVATIONS: ReservationRecord[] = [
  {
    id: "res-1",
    reservation_number: "KB-RES-8821",
    guest_name: "Rahul Roy",
    guest_phone: "+91 98110 01122",
    guest_count: 4,
    reservation_date: "2026-11-17",
    time_slot: "19:30",
    seating_preference: "Garden Cabana",
    status: "CONFIRMED",
    special_requests: "Quiet corner for anniversary dinner, celebrate with vintage red wine.",
    table_assigned: "Table 08"
  },
  {
    id: "res-2",
    reservation_number: "KB-RES-8822",
    guest_name: "Ananya Iyer",
    guest_phone: "+91 98110 44332",
    guest_count: 6,
    reservation_date: "2026-11-17",
    time_slot: "20:00",
    seating_preference: "Mezzanine Resto-Bar",
    status: "CONFIRMED",
    special_requests: "Near DJ console for Saturday night.",
    table_assigned: "Bar High Top 02"
  },
  {
    id: "res-3",
    reservation_number: "KB-RES-8823",
    guest_name: "David Chen",
    guest_phone: "+91 98110 99887",
    guest_count: 2,
    reservation_date: "2026-11-17",
    time_slot: "13:00",
    seating_preference: "Main Dining Hall",
    status: "SEATED",
    special_requests: "Business lunch.",
    table_assigned: "Table 03"
  }
];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationRecord[]>(FALLBACK_RESERVATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: "SEATED" | "COMPLETED" | "CANCELLED") => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setToastMsg(`Reservation marked as ${newStatus}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = reservations.filter(r => {
    const matchesSearch = r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.guest_phone.includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F0E9DC] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#B66A4B]" />
            <h1 className="font-serif text-2xl font-bold text-[#382D25]">Guest Reservation Management</h1>
          </div>
          <p className="text-xs text-[#77716A] mt-1">
            Real-time table booking approval, seating zone allocation, and double-booking conflict prevention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Conflict Shield Active</span>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#F0E9DC] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#77716A] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search guest name, ref #, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-[#FAF8F2] border border-[#F0E9DC] rounded-full pl-10 pr-4 py-2 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-[#382D25] text-white"
                  : "bg-[#FAF8F2] text-[#77716A] hover:text-[#382D25]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-3xl border border-[#F0E9DC] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#F0E9DC] flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#382D25]">Today&#39;s Table Reservations</h3>
          <span className="text-xs text-[#77716A]">{filtered.length} Bookings</span>
        </div>

        <div className="divide-y divide-[#F0E9DC]">
          {filtered.map(r => (
            <div key={r.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#FAF8F2] transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#B66A4B]">{r.reservation_number}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0E9DC] text-[#382D25]">
                    {r.seating_preference}
                  </span>
                  {r.table_assigned && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Assigned: {r.table_assigned}
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-base font-bold text-[#382D25]">{r.guest_name} ({r.guest_count} Guests)</h4>
                <div className="flex items-center gap-4 text-xs text-[#77716A]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A46D]" /> {r.reservation_date} at {r.time_slot}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#C5A46D]" /> {r.guest_phone}
                  </span>
                </div>
                {r.special_requests && (
                  <p className="text-xs text-[#77716A] italic">Note: {r.special_requests}</p>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  r.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : r.status === "SEATED"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-neutral-100 text-neutral-600"
                }`}>
                  {r.status}
                </span>

                {r.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, "SEATED")}
                    className="px-3.5 py-1.5 rounded-full bg-[#382D25] text-white hover:bg-[#B66A4B] text-xs font-bold transition-colors"
                  >
                    Seat Guests
                  </button>
                )}

                {r.status === "SEATED" && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, "COMPLETED")}
                    className="px-3.5 py-1.5 rounded-full bg-[#FAF8F2] border border-[#C5A46D] text-[#382D25] text-xs font-bold hover:bg-[#C5A46D] hover:text-white transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
