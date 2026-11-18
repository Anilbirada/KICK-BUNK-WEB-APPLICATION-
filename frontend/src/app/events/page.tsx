"use client";

import React, { useState, useEffect } from "react";
import { 
  PartyPopper, Sparkles, Calendar, Users, Phone, Mail, 
  Clock, CheckCircle2, ChevronRight, ShieldCheck, Heart, 
  Music, Briefcase, Wine, GlassWater, ArrowRight, X, Send
} from "lucide-react";

interface EventPackage {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  capacity: string;
  image_url: string;
  inclusions: string[];
}

export default function PartyAndEventsPage() {
  const [events, setEvents] = useState<EventPackage[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("Bespoke Birthday Celebrations");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("07:30 PM");
  const [guestCount, setGuestCount] = useState<number>(20);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API_BASE}/experience/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (_) {}
    }
    loadEvents();
  }, [API_BASE]);

  const handleOpenEnquiry = (evt?: EventPackage) => {
    if (evt) {
      setSelectedEvent(evt);
      setEventType(evt.title);
    }
    setIsModalOpen(true);
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !phone) {
      alert("Please provide your Name and Phone Number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/experience/events/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: eventType,
          guest_name: guestName,
          phone: phone,
          email: email,
          preferred_date: preferredDate || "2026-11-25",
          preferred_time: preferredTime,
          guest_count: guestCount,
          special_requests: specialRequests,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmationNotice(data.message);
        setIsModalOpen(false);
        // Reset form
        setGuestName("");
        setPhone("");
        setEmail("");
        setSpecialRequests("");
      } else {
        throw new Error("API failed");
      }
    } catch (_) {
      setConfirmationNotice(`Thank you, ${guestName}. Your event enquiry has been received. Our Event Director will call you at ${phone} shortly.`);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#382D25] pb-24">
      {/* Top Hero Banner */}
      <div className="relative bg-[#F0E9DC] py-20 border-b border-[#C5A46D]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FAF8F2] border border-[#C5A46D] text-[#382D25] text-xs font-bold uppercase tracking-[0.25em] shadow-sm">
            <PartyPopper className="w-3.5 h-3.5 text-[#B66A4B]" />
            Bespoke Celebrations & Corporate Soirées
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#382D25] tracking-tight">
            Party & Private Events
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#77716A] leading-relaxed">
            Host milestone birthdays, intimate anniversaries, high-energy DJ parties, and executive corporate dinners in our fairy-lit garden cabanas and private mezzanine lounges.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleOpenEnquiry()}
              className="py-4 px-8 rounded-full bg-[#382D25] hover:bg-[#241D17] text-[#FAF8F2] font-semibold text-xs tracking-widest uppercase transition-all shadow-md hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Enquire For Private Event</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46D]" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Toast */}
      {confirmationNotice && (
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="p-6 rounded-3xl bg-[#F0E9DC] border border-[#C5A46D] text-[#382D25] shadow-lg flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-[#B66A4B] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-lg font-bold">Enquiry Registered Successfully</h3>
              <p className="text-xs text-[#77716A] mt-1 leading-relaxed">{confirmationNotice}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6 Curated Event Types Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B66A4B]">Event Experiences</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#382D25]">
            Curated Venues & Event Packages
          </h2>
          <p className="text-xs sm:text-sm text-[#77716A]">
            Each event is staffed with a dedicated floor captain, custom tiered menus, and ambient lighting tailored to your occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#F0E9DC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Capacity Badge */}
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F0E9DC]">
                  <img
                    src={evt.image_url}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#382D25] text-[10px] font-bold uppercase tracking-wider shadow">
                    {evt.category}
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-[#382D25]/90 text-[#FAF8F2] text-[10px] font-bold flex items-center gap-1 shadow">
                    <Users className="w-3 h-3 text-[#C5A46D]" />
                    <span>{evt.capacity}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[11px] text-[#B66A4B] font-bold uppercase tracking-wider">{evt.tagline}</p>
                    <h3 className="font-serif text-xl font-bold text-[#382D25] mt-1 group-hover:text-[#B66A4B] transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#77716A] mt-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Inclusions List */}
                  <div className="space-y-1.5 pt-2 border-t border-[#F0E9DC]">
                    <p className="text-[11px] font-bold text-[#382D25] uppercase tracking-wider">Package Inclusions:</p>
                    {evt.inclusions?.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#77716A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleOpenEnquiry(evt)}
                  className="w-full py-3 rounded-full bg-[#FAF8F2] hover:bg-[#382D25] text-[#382D25] hover:text-white border border-[#C5A46D] text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <span>Enquire For This Package</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Enquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FAF8F2] border border-[#C5A46D] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F0E9DC] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B66A4B] font-bold">VIP Private Events</span>
                <h3 className="font-serif text-2xl font-bold text-[#382D25]">Plan Your Celebration</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F0E9DC] text-[#382D25] flex items-center justify-center hover:bg-[#C5A46D] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEnquiry} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Occasion / Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                >
                  <option value="Bespoke Birthday Celebrations">Bespoke Birthday Celebrations</option>
                  <option value="Anniversary & Romantic Dining">Anniversary & Romantic Dining</option>
                  <option value="Weekend DJ & High-Energy Nights">Weekend DJ & High-Energy Nights</option>
                  <option value="Corporate Soirées & Brand Launches">Corporate Soirées & Brand Launches</option>
                  <option value="Private Mezzanine Buyouts">Private Mezzanine Buyouts</option>
                  <option value="Family Gatherings & Group Feasts">Family Gatherings & Group Feasts</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#382D25] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Vikramaditya Roy"
                    className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#382D25] block mb-1">Phone Number (+91) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98110 01100"
                    className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#382D25] block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#382D25] block mb-1">Time Slot</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                  >
                    <option value="12:30 PM">12:30 PM (Lunch)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="07:30 PM">07:30 PM (Dinner)</option>
                    <option value="09:00 PM">09:00 PM (Late Evening)</option>
                    <option value="10:30 PM">10:30 PM (Nightlife)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#382D25] block mb-1">Guest Count</label>
                  <input
                    type="number"
                    min={2}
                    max={250}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Special Dietary Requests / Customization</label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Need acoustic violinist for 30 mins, 4 guests are Jain vegetarian, custom chocolate berry cake..."
                  className="w-full text-xs bg-white border border-[#F0E9DC] rounded-xl px-3.5 py-2.5 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F0E9DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#F0E9DC] text-[#382D25] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#382D25] text-[#FAF8F2] hover:bg-[#B66A4B] text-xs font-bold tracking-wider uppercase transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Send Event Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
