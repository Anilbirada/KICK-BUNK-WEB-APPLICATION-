"use client";

import React, { useState, useEffect } from "react";
import { 
  PartyPopper, Users, Calendar, Phone, Mail, 
  CheckCircle2, Clock, Eye, MessageSquare, ArrowRight 
} from "lucide-react";

interface EventEnquiry {
  id: string;
  event_type: string;
  guest_name: string;
  phone: string;
  email: string;
  preferred_date: string;
  preferred_time: string;
  guest_count: number;
  special_requests: string;
  status: string;
  created_at: string;
}

const FALLBACK_ENQUIRIES: EventEnquiry[] = [
  {
    id: "ENQ-202611-001",
    event_type: "Bespoke Birthday Celebrations",
    guest_name: "Rahul Mehra",
    phone: "+91 98110 55443",
    email: "rahul.mehra@techcorp.com",
    preferred_date: "2026-11-28",
    preferred_time: "08:00 PM",
    guest_count: 25,
    special_requests: "Fairy-light floral cabana setup, 2kg Belgian dark chocolate truffle cake, custom cocktail menu.",
    status: "NEW_INQUIRY",
    created_at: "2026-11-17T09:15:00Z"
  },
  {
    id: "ENQ-202611-002",
    event_type: "Corporate Soirées & Brand Launches",
    guest_name: "Simran Kaur",
    phone: "+91 98110 88776",
    email: "simran@innovate.in",
    preferred_date: "2026-12-05",
    preferred_time: "07:00 PM",
    guest_count: 60,
    special_requests: "Mezzanine buyout, projector setup for annual leadership presentation, live tandoor kebab platters.",
    status: "CONFIRMED",
    created_at: "2026-11-16T14:30:00Z"
  }
];

export default function AdminEventsPage() {
  const [enquiries, setEnquiries] = useState<EventEnquiry[]>(FALLBACK_ENQUIRIES);

  useEffect(() => {
    async function loadEnquiries() {
      try {
        const res = await fetch("http://localhost:8001/api/v1/experience/events/enquiries");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setEnquiries(data);
        }
      } catch (_) {}
    }
    loadEnquiries();
  }, []);

  const markConfirmed = (id: string) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: "CONFIRMED" } : e));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F0E9DC] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-[#B66A4B]" />
            <h1 className="font-serif text-2xl font-bold text-[#382D25]">Party & Event Enquiries</h1>
          </div>
          <p className="text-xs text-[#77716A] mt-1">
            Track and curate private birthday cabana buyouts, anniversaries, corporate celebrations, and group dining enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#FAF8F2] border border-[#C5A46D] text-xs font-semibold text-[#382D25]">
            {enquiries.length} Enquiries Received
          </span>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-3xl border border-[#F0E9DC] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#F0E9DC]">
          <h3 className="font-serif text-base font-bold text-[#382D25]">Private Event Inquiry Register</h3>
        </div>

        <div className="divide-y divide-[#F0E9DC]">
          {enquiries.map((enq) => (
            <div key={enq.id} className="p-6 space-y-4 hover:bg-[#FAF8F2] transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#B66A4B]">{enq.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F0E9DC] text-[10px] font-bold text-[#382D25]">
                      {enq.event_type}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#382D25] mt-1">{enq.guest_name}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    enq.status === "CONFIRMED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}>
                    {enq.status}
                  </span>
                  {enq.status !== "CONFIRMED" && (
                    <button
                      onClick={() => markConfirmed(enq.id)}
                      className="px-4 py-1.5 rounded-full bg-[#382D25] text-white hover:bg-[#B66A4B] text-xs font-bold transition-colors"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF8F2] border border-[#F0E9DC] text-xs">
                <div>
                  <span className="text-[10px] text-[#77716A] uppercase block">Target Date & Time</span>
                  <span className="font-semibold text-[#382D25]">{enq.preferred_date} @ {enq.preferred_time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#77716A] uppercase block">Guest Count</span>
                  <span className="font-semibold text-[#382D25]">{enq.guest_count} Guests</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#77716A] uppercase block">Contact Phone</span>
                  <span className="font-semibold text-[#382D25]">{enq.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#77716A] uppercase block">Email</span>
                  <span className="font-semibold text-[#382D25]">{enq.email || "N/A"}</span>
                </div>
              </div>

              {/* Special Requests */}
              {enq.special_requests && (
                <div className="text-xs text-[#77716A]">
                  <strong className="text-[#382D25]">Guest Notes:</strong> {enq.special_requests}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
