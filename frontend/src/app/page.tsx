"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, UtensilsCrossed, Wine, Calendar, ChevronRight, 
  Star, MapPin, Phone, Clock, ShieldCheck, ArrowRight, Check,
  Play, Pause, Volume2, VolumeX, Maximize2, X, MessageSquare, Bot,
  PartyPopper, Compass, ChevronDown, Send
} from "lucide-react";
import { api } from "../lib/api";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { useTableSession } from "../context/TableSessionContext";

interface ExperienceVideo {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url: string;
  poster_url: string;
  duration_seconds: number;
  display_order: number;
  is_active: boolean;
  tagline: string;
}

const FALLBACK_VIDEOS: ExperienceVideo[] = [
  {
    id: "vid-1",
    title: "Signature Food Experience",
    category: "Culinary Gastronomy",
    description: "Witness the spectacle of authentic live charcoal tandoor embers, slow-simmered Awadhi gravies, and artisanal plating crafted by Executive Chef Hemant Kapoor.",
    video_url: "/videos/food.mp4",
    poster_url: "/images/kickbunk/magicpin_01_kalmi_kebab.webp",
    duration_seconds: 38,
    display_order: 1,
    is_active: true,
    tagline: "Flame, Smoke & Culinary Artistry"
  },
  {
    id: "vid-2",
    title: "Cocktail & Bartender Experience",
    category: "Mixology Showcase",
    description: "Watch Head Mixologist Marcello D'Souza craft hand-smoked bourbon infusions, flair shaker routines, and botanical gin elderflower highballs.",
    video_url: "/videos/cocktails.mp4",
    poster_url: "/images/kickbunk/restaurant_guru_interior.jpg",
    duration_seconds: 34,
    display_order: 2,
    is_active: true,
    tagline: "Alchemy in Crystal & Oak Smoke"
  },
  {
    id: "vid-3",
    title: "Premium Bar Experience",
    category: "Cellar & Single Malts",
    description: "Explore our illuminated spirits cellar featuring Speyside single malts, small-batch Kentucky bourbons, and chilled craft European cervezas on tap.",
    video_url: "/videos/bar.mp4",
    poster_url: "/images/kickbunk/restaurant_guru_facade.jpg",
    duration_seconds: 42,
    display_order: 3,
    is_active: true,
    tagline: "World-Class Spirits & Curated Labels"
  },
  {
    id: "vid-4",
    title: "Party & DJ Nights",
    category: "Nightlife & Energy",
    description: "Feel the electric pulse of weekend DJ sets, ambient acoustic jazz sessions, and champagne toasts under the starlit sky.",
    video_url: "/videos/party.mp4",
    poster_url: "/images/kickbunk/magicpin_09_garden_pathway_night.webp",
    duration_seconds: 45,
    display_order: 4,
    is_active: true,
    tagline: "Electric Beats Under Starlit Canopies"
  },
  {
    id: "vid-5",
    title: "Restaurant Ambience & Celebrations",
    category: "Garden Cabanas & Vibe",
    description: "Immerse in private romantic cabanas, cascading fairy light garden paths, and warm terracotta luxury designed for unforgettable milestones.",
    video_url: "/videos/ambience.mp4",
    poster_url: "/images/kickbunk/google_01_garden_lights_night.jpg",
    duration_seconds: 40,
    display_order: 5,
    is_active: true,
    tagline: "An Oasis of Elegance & Warmth"
  }
];

export default function HomePage() {
  const { isDineInActive, tableNumber } = useTableSession();
  const [videos, setVideos] = useState<ExperienceVideo[]>(FALLBACK_VIDEOS);
  const [activeModalVideo, setActiveModalVideo] = useState<ExperienceVideo | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // AI Assistant Chat State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Greetings. I am your KICK BUNK AI Hospitality Concierge. How may I assist your dining experience today? I can recommend sommelier wine pairings, signature chef specialities, or guide your private party reservations."
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch(`${API_BASE}/experience/videos`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setVideos(data);
        }
      } catch (_) {}
    }
    loadVideos();
  }, [API_BASE]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const handleSendAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiInput("");
    setAiMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsAiLoading(true);

    try {
      const res = await fetch(`${API_BASE}/experience/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      if (res.ok) {
        const data = await res.json();
        setAiMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        throw new Error("API error");
      }
    } catch (_) {
      // Fallback response
      setAiMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "For the ultimate pairing, our Head Mixologist recommends our Smoked Bourbon Old Fashioned with tandoor delicacies, or our Botanical Gin & Tonic with creamy malai paneer. Visit our Reservations tab to secure your private garden cabana!"
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F2] text-[#382D25] min-h-screen">
      {/* 1. CINEMATIC VIDEO HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1A1714]">
        {/* Crisp, Crystal-Clear Ambient Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/kickbunk/google_01_garden_lights_night.jpg"
            className="w-full h-full object-cover opacity-80 filter brightness-90 contrast-105"
          >
            <source
              src="/videos/hero.mp4"
              type="video/mp4"
            />
          </video>
          {/* Subtle cinematic vignette allowing crystal-clear visuals */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FAF8F2]" />
        </div>

        {/* Floating Light Luxury Frosted Glass Content Card */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16">
          <div className="bg-[#FAF8F2]/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#C5A46D]/60 shadow-2xl space-y-6">
            {/* Brand Monogram Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F0E9DC] border border-[#C5A46D] text-[#382D25] text-xs font-semibold uppercase tracking-[0.25em] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
              European Luxury Dining & Resto-Bar
            </div>

            {/* Hero Typography */}
            <div className="space-y-3">
              <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-[#382D25] leading-none">
                KICK BUNK
              </h1>
              <p className="font-serif italic text-2xl sm:text-3xl text-[#B66A4B] font-normal tracking-wide">
                Where Flavours Meet Extraordinary Experiences.
              </p>
            </div>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#77716A] font-normal leading-relaxed">
              An expansive sanctuary of fairy-lit garden cabanas, live charcoal tandoor gastronomy, and handcrafted nightlife mixology. Welcome to hospitality elevated.
            </p>

            {/* Dine-in quick action banner if guest has scanned table QR */}
            {isDineInActive && tableNumber && (
              <div className="inline-flex items-center gap-3 p-3.5 rounded-2xl bg-[#F0E9DC] border border-[#C5A46D] text-[#382D25] text-sm font-semibold shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B66A4B] animate-ping" />
                <span>You are seated at <strong>Table {tableNumber}</strong>. Digital orders route directly to your table steward!</span>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="/menu"
                className="py-3.5 px-8 rounded-full bg-[#382D25] hover:bg-[#241D17] text-[#FAF8F2] font-semibold text-xs tracking-[0.15em] uppercase transition-all shadow-md hover:shadow-xl hover:scale-105 flex items-center gap-2.5"
              >
                <span>Explore Digital Menu</span>
                <ArrowRight className="w-4 h-4 text-[#C5A46D]" />
              </a>
              <a
                href="/reservations"
                className="py-3.5 px-8 rounded-full bg-[#F0E9DC] hover:bg-[#E2CA9E] text-[#382D25] border border-[#C5A46D] font-semibold text-xs tracking-[0.15em] uppercase transition-all hover:scale-105 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#B66A4B]" />
                <span>Reserve a Table</span>
              </a>
              <a
                href="#experience"
                className="py-3.5 px-6 rounded-full bg-white/80 hover:bg-white text-[#77716A] hover:text-[#382D25] border border-[#C5A46D]/40 font-medium text-xs tracking-wider transition-colors flex items-center gap-2 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 text-[#C5A46D] fill-[#C5A46D]" />
                <span>Watch Experience</span>
              </a>
            </div>
          </div>

          {/* Highlights Micro-Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto border-t border-[#C5A46D]/20">
            <div className="p-3 text-center">
              <p className="font-serif text-2xl font-bold text-[#382D25]">35+</p>
              <p className="text-xs text-[#77716A] uppercase tracking-wider mt-0.5">Signature Dishes</p>
            </div>
            <div className="p-3 text-center">
              <p className="font-serif text-2xl font-bold text-[#382D25]">Single Malts</p>
              <p className="text-xs text-[#77716A] uppercase tracking-wider mt-0.5">Curated Bar Cellar</p>
            </div>
            <div className="p-3 text-center">
              <p className="font-serif text-2xl font-bold text-[#382D25]">Open-Air</p>
              <p className="text-xs text-[#77716A] uppercase tracking-wider mt-0.5">Private Garden Cabanas</p>
            </div>
            <div className="p-3 text-center">
              <p className="font-serif text-2xl font-bold text-[#382D25]">Universal QR</p>
              <p className="text-xs text-[#77716A] uppercase tracking-wider mt-0.5">Seamless Table Ordering</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RESTAURANT INTRODUCTION */}
      <section className="py-24 bg-[#F0E9DC]/60 border-y border-[#F0E9DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Mosaic */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                  alt="KICK BUNK European Garden Ambiance"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-56 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                  alt="Tandoor Embers"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-6 left-6 bg-[#FAF8F2]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-[#C5A46D] shadow-md">
                <p className="text-[11px] font-bold tracking-widest text-[#B66A4B] uppercase">Bengaluru & Tirupati</p>
              </div>
            </div>

            {/* Narrative Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B66A4B]">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
                An Oasis of Sensory Elegance
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#382D25] leading-tight">
                Crafted For Those Who Appreciate the Finer Things.
              </h2>
              <p className="text-sm sm:text-base text-[#77716A] leading-relaxed">
                At KICK BUNK, every evening is orchestrated as an escape from the ordinary. Our sprawling lush garden property brings together European architectural grace, bespoke private dining cabanas, and the magnetic theatre of live charcoal tandoor fires.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FAF8F2] border border-[#C5A46D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#B66A4B]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#382D25]">Authentic Charcoal Tandoor Gastronomy</h4>
                    <p className="text-xs text-[#77716A] mt-0.5">Slow-cooked Kalmi kebabs, saffron-steeped gravies, and flaky tandoori breads.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FAF8F2] border border-[#C5A46D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#B66A4B]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#382D25]">Master Mixology & Rare Cellar Spirits</h4>
                    <p className="text-xs text-[#77716A] mt-0.5">Hand-carved crystal ice, applewood smoke infusions, and prestigious single malts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FAF8F2] border border-[#C5A46D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#B66A4B]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#382D25]">Private Cabanas & Weekend High Energy</h4>
                    <p className="text-xs text-[#77716A] mt-0.5">Romantic candlelit dining transitioning into vibrant weekend DJ performances.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="/events"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#B66A4B] hover:text-[#382D25] tracking-widest uppercase transition-colors"
                >
                  <span>Explore Private Events & Celebrations</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE KICK BUNK EXPERIENCE (AI VIDEO EXPERIENCE SECTION) */}
      <section id="experience" className="py-24 bg-[#FAF8F2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0E9DC] border border-[#C5A46D] text-[#382D25] text-xs font-bold tracking-[0.2em] uppercase">
              <Play className="w-3 h-3 text-[#B66A4B] fill-[#B66A4B]" />
              Cinematic Storytelling
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#382D25]">
              THE KICK BUNK EXPERIENCE
            </h2>
            <p className="text-sm sm:text-base text-[#77716A]">
              Immerse yourself in five cinematic vignettes capturing the essence of our culinary passion, mixology theatre, and vibrant open-air celebrations.
            </p>
          </div>

          {/* 5 Cinematic Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((vid, idx) => (
              <div
                key={vid.id}
                onClick={() => setActiveModalVideo(vid)}
                className={`group cursor-pointer rounded-3xl overflow-hidden bg-white border border-[#F0E9DC] shadow-md video-card-zoom flex flex-col ${
                  idx === 0 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                {/* Video / Poster Stage */}
                <div className={`relative w-full overflow-hidden bg-black ${idx === 0 ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[16/10]"}`}>
                  <video
                    src={vid.video_url}
                    poster={vid.poster_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#382D25] text-[10px] font-bold uppercase tracking-wider shadow">
                    {vid.category}
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#C5A46D] group-hover:bg-[#B66A4B] text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>

                  {/* Bottom Meta */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#E2CA9E] uppercase tracking-wider">{vid.tagline}</p>
                      <h3 className="font-serif text-lg sm:text-xl font-bold">{vid.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 text-white/90">
                      0:{vid.duration_seconds < 10 ? `0${vid.duration_seconds}` : vid.duration_seconds}
                    </span>
                  </div>
                </div>

                {/* Description Body */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-[#FAF8F2]">
                  <p className="text-xs text-[#77716A] line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                  <div className="pt-3 flex items-center justify-between text-xs text-[#B66A4B] font-bold uppercase tracking-wider">
                    <span>Watch High-Definition Reel</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE FOOD SHOWCASE */}
      <section className="py-24 bg-[#F0E9DC]/40 border-t border-[#F0E9DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B66A4B] mb-2">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#C5A46D]" />
                Live Tandoor & Curries
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#382D25]">
                Signature Gastronomy
              </h2>
              <p className="text-sm text-[#77716A] mt-2 max-w-xl">
                Time-honoured recipes cooked over fragrant charcoal embers, using certified organic paneer, fresh poultry, and whole spices.
              </p>
            </div>
            <a
              href="/menu"
              className="px-6 py-3 rounded-full bg-[#FAF8F2] border border-[#C5A46D] text-[#382D25] hover:bg-[#C5A46D] hover:text-white text-xs font-bold tracking-widest uppercase transition-all shadow-sm"
            >
              View Full Food Menu →
            </a>
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dish 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#F0E9DC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Charcoal Kalmi Kebab"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-300">
                  NON-VEG
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#382D25] shadow">
                  ₹440
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#382D25] group-hover:text-[#B66A4B] transition-colors">
                    Charcoal Kalmi Kebab
                  </h3>
                  <p className="text-xs text-[#77716A] mt-1 line-clamp-2">
                    Tender chicken drumsticks steeped in roasted gram flour, hung curd and Kashmiri saffron.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#F0E9DC] flex items-center justify-between text-xs text-[#77716A]">
                  <span>Prep: 18 mins</span>
                  <a href="/menu" className="font-bold text-[#B66A4B] hover:underline">Order Now</a>
                </div>
              </div>
            </div>

            {/* Dish 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#F0E9DC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80"
                  alt="Old Delhi Butter Chicken"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-300">
                  NON-VEG
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#382D25] shadow">
                  ₹490
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#382D25] group-hover:text-[#B66A4B] transition-colors">
                    Old Delhi Butter Chicken
                  </h3>
                  <p className="text-xs text-[#77716A] mt-1 line-clamp-2">
                    Smoked tandoori boneless chicken in a velvety San Marzano tomato gravy with churned butter.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#F0E9DC] flex items-center justify-between text-xs text-[#77716A]">
                  <span>Prep: 20 mins</span>
                  <a href="/menu" className="font-bold text-[#B66A4B] hover:underline">Order Now</a>
                </div>
              </div>
            </div>

            {/* Dish 3 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#F0E9DC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                  alt="KICK BUNK 24-Hour Dal Makhani"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  VEG
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#382D25] shadow">
                  ₹375
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#382D25] group-hover:text-[#B66A4B] transition-colors">
                    24-Hour Dal Makhani
                  </h3>
                  <p className="text-xs text-[#77716A] mt-1 line-clamp-2">
                    Slow-simmered black lentils cooked overnight on tandoor embers with churned cow butter.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#F0E9DC] flex items-center justify-between text-xs text-[#77716A]">
                  <span>Prep: 12 mins</span>
                  <a href="/menu" className="font-bold text-[#B66A4B] hover:underline">Order Now</a>
                </div>
              </div>
            </div>

            {/* Dish 4 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#F0E9DC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80"
                  alt="Truffle Malai Paneer Tikka"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  VEG
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#382D25] shadow">
                  ₹420
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#382D25] group-hover:text-[#B66A4B] transition-colors">
                    Truffle Malai Paneer Tikka
                  </h3>
                  <p className="text-xs text-[#77716A] mt-1 line-clamp-2">
                    Organic cottage cheese cubes infused with aromatic cardamom cream and Italian white truffle oil.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#F0E9DC] flex items-center justify-between text-xs text-[#77716A]">
                  <span>Prep: 15 mins</span>
                  <a href="/menu" className="font-bold text-[#B66A4B] hover:underline">Order Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PREMIUM BAR & MIXOLOGY SHOWCASE */}
      <section className="py-24 bg-[#FAF8F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B66A4B]">
                <Wine className="w-3.5 h-3.5 text-[#C5A46D]" />
                The Resto-Bar Cellar
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#382D25] leading-tight">
                Alchemical Pours & Single Malt Treasures.
              </h2>
              <p className="text-sm sm:text-base text-[#77716A] leading-relaxed">
                Step up to our hand-crafted illuminated brass bar. From botanical gin highballs with artisanal elderflower tonic to rare Speyside single malts poured over hand-carved crystal ice spheres, every beverage is an alchemical masterpiece.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F0E9DC] border border-[#C5A46D]/40">
                  <h4 className="font-serif text-base font-bold text-[#382D25]">Smoked Old Fashioned</h4>
                  <p className="text-xs text-[#77716A] mt-1">Buffalo Trace Bourbon, Angostura bitters, demerara, finished under applewood smoke dome.</p>
                  <p className="text-sm font-bold text-[#B66A4B] mt-2">₹580</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F0E9DC] border border-[#C5A46D]/40">
                  <h4 className="font-serif text-base font-bold text-[#382D25]">Glenfiddich 12 Yrs Speyside</h4>
                  <p className="text-xs text-[#77716A] mt-1">Single malt scotch aged in American bourbon and European sherry oak casks.</p>
                  <p className="text-sm font-bold text-[#B66A4B] mt-2">₹650 (30ml) / ₹1200 (60ml)</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/menu"
                  className="py-3 px-6 rounded-full bg-[#382D25] text-white hover:bg-[#241D17] text-xs font-bold tracking-widest uppercase transition-all inline-flex items-center gap-2"
                >
                  <span>Explore Bar & Beverage Menu</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A46D]" />
                </a>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80"
                alt="Craft Cocktail Bar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#382D25]/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs text-[#E2CA9E] font-bold tracking-widest uppercase">Marcello D&#39;Souza</p>
                <h4 className="font-serif text-xl font-bold">Head Mixologist Live Bar Counter</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PARTY & NIGHTLIFE EXPERIENCE */}
      <section className="py-24 bg-[#F0E9DC] border-y border-[#C5A46D]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F2] border border-[#C5A46D] text-[#382D25] text-xs font-bold tracking-[0.2em] uppercase">
              <PartyPopper className="w-3.5 h-3.5 text-[#B66A4B]" />
              Celebrations & Nightlife
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#382D25]">
              Milestones Deserve Grandeur
            </h2>
            <p className="text-sm sm:text-base text-[#77716A]">
              From acoustic sunset garden gatherings to pulsating weekend DJ sets and private birthday cabana buyouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event 1 */}
            <div className="bg-[#FAF8F2] rounded-3xl p-6 border border-[#C5A46D]/30 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
                    alt="Birthday Party"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#382D25]">Birthday Cabana Soirées</h3>
                <p className="text-xs text-[#77716A] leading-relaxed">
                  Fairy-lit floral cabana decor, customized tiered cakes, dedicated steward service, and tailored multi-course tasting menus.
                </p>
              </div>
              <a href="/events" className="mt-6 text-xs font-bold text-[#B66A4B] hover:text-[#382D25] uppercase tracking-wider flex items-center gap-1">
                <span>View Package Details</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Event 2 */}
            <div className="bg-[#FAF8F2] rounded-3xl p-6 border border-[#C5A46D]/30 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
                    alt="DJ Night"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#382D25]">Weekend DJ Nights</h3>
                <p className="text-xs text-[#77716A] leading-relaxed">
                  Friday & Saturday nights featuring premier guest electronic & Afrobeats DJs, laser lighting, and bottle service.
                </p>
              </div>
              <a href="/events" className="mt-6 text-xs font-bold text-[#B66A4B] hover:text-[#382D25] uppercase tracking-wider flex items-center gap-1">
                <span>Reserve VIP Table</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Event 3 */}
            <div className="bg-[#FAF8F2] rounded-3xl p-6 border border-[#C5A46D]/30 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
                    alt="Corporate Mixer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#382D25]">Corporate & Private Buyouts</h3>
                <p className="text-xs text-[#77716A] leading-relaxed">
                  Mezzanine buyouts with audio-visual equipment, GST corporate billing, and curated live chef stations.
                </p>
              </div>
              <a href="/events" className="mt-6 text-xs font-bold text-[#B66A4B] hover:text-[#382D25] uppercase tracking-wider flex items-center gap-1">
                <span>Submit Event Enquiry</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B66A4B]">Guest Connoisseurs</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#382D25]">
              Celebrated by Bangalore & Tirupati
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#F0E9DC]/60 border border-[#C5A46D]/30 space-y-4">
              <div className="flex text-[#B66A4B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#77716A] italic leading-relaxed">
                “The Charcoal Kalmi Kebab paired with the Smoked Old Fashioned under the fairy-lit trees was one of the finest dining experiences I’ve had in South India. Unmatched elegance.”
              </p>
              <div className="pt-2 border-t border-[#C5A46D]/20">
                <p className="text-sm font-bold text-[#382D25]">Ananya Krishnan</p>
                <p className="text-[11px] text-[#B66A4B]">Food Connoisseur & Critic</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#F0E9DC]/60 border border-[#C5A46D]/30 space-y-4">
              <div className="flex text-[#B66A4B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#77716A] italic leading-relaxed">
                “We celebrated my wife’s 30th birthday in a private garden cabana. The QR ordering was fast, the staff was exceedingly courteous, and the ambience was straight out of Tuscany.”
              </p>
              <div className="pt-2 border-t border-[#C5A46D]/20">
                <p className="text-sm font-bold text-[#382D25]">Siddharth & Priya Menon</p>
                <p className="text-[11px] text-[#B66A4B]">Electronic City Residents</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#F0E9DC]/60 border border-[#C5A46D]/30 space-y-4">
              <div className="flex text-[#B66A4B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#77716A] italic leading-relaxed">
                “The single malt collection is top-tier. Having authentic 30ml/60ml peg choices with hand-carved ice is something only the most serious luxury resto-bars provide. Outstanding!”
              </p>
              <div className="pt-2 border-t border-[#C5A46D]/20">
                <p className="text-sm font-bold text-[#382D25]">Vikramaditya Hegde</p>
                <p className="text-[11px] text-[#B66A4B]">Whisky Sommelier Society</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RESERVATION CALL-TO-ACTION */}
      <section className="py-20 bg-[#382D25] text-[#FAF8F2] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A46D] font-bold">Plan Your Visit</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Reserve Your Private Cabana or Dining Table
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#FAF8F2]/80 font-light">
            Due to high demand on weekends, we encourage reserving your table in advance. Experience luxury open-air dining tailored to perfection.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/reservations"
              className="py-4 px-8 rounded-full bg-[#C5A46D] hover:bg-[#B66A4B] text-[#382D25] hover:text-white font-bold text-xs tracking-widest uppercase transition-all shadow-xl hover:scale-105"
            >
              Book A Table Online
            </a>
            <a
              href="tel:+919945321367"
              className="py-4 px-6 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF8F2] border border-white/30 text-xs font-semibold tracking-wider transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#C5A46D]" />
              <span>Host Desk: +91 99453 21367</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. FULL-SCREEN CINEMATIC VIDEO PLAYBACK MODAL */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md">
          <div className="relative w-full max-w-5xl bg-[#14171E] rounded-3xl overflow-hidden border border-[#C5A46D]/40 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#0B0D11]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A46D] font-bold">{activeModalVideo.category}</span>
                <h3 className="font-serif text-base sm:text-xl font-bold text-white">{activeModalVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalVideo(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Stage */}
            <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center">
              <video
                src={activeModalVideo.video_url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-5 bg-[#0B0D11] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                {activeModalVideo.description}
              </p>
              <a
                href="/menu"
                onClick={() => setActiveModalVideo(null)}
                className="px-5 py-2.5 rounded-full bg-[#C5A46D] text-black font-bold text-xs uppercase tracking-wider shrink-0"
              >
                Order This Experience
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 10. INTERACTIVE AI RESTAURANT ASSISTANT (FLOATING WIDGET) */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isAiOpen ? (
          <button
            onClick={() => setIsAiOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#382D25] text-[#FAF8F2] shadow-2xl border border-[#C5A46D] hover:bg-[#B66A4B] transition-all hover:scale-105 group"
          >
            <div className="w-7 h-7 rounded-full bg-[#C5A46D] flex items-center justify-center text-[#382D25] group-hover:bg-[#FAF8F2]">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-[#C5A46D] font-bold uppercase tracking-widest leading-none">AI Sommelier</p>
              <p className="text-xs font-semibold mt-0.5">Ask KICK BUNK</p>
            </div>
          </button>
        ) : (
          <div className="w-80 sm:w-96 bg-[#FAF8F2] border border-[#C5A46D] rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[500px]">
            {/* Header */}
            <div className="bg-[#382D25] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C5A46D] text-[#382D25] flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold">KICK BUNK AI Concierge</h4>
                  <p className="text-[10px] text-[#C5A46D]">Sommelier & Culinary Guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-72 text-xs">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-[#382D25] text-white rounded-br-none"
                        : "bg-[#F0E9DC] text-[#382D25] border border-[#C5A46D]/40 rounded-bl-none leading-relaxed"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-[#F0E9DC] text-[#77716A] text-xs animate-pulse">
                    Sommelier is curating recommendations...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-1.5 bg-[#F0E9DC]/60 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => setAiInput("What pairs best with Kalmi Kebab?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-[#C5A46D]/30 text-[#382D25]"
              >
                🍷 Pair with Kebab?
              </button>
              <button
                onClick={() => setAiInput("Chef recommendations for vegetarians?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-[#C5A46D]/30 text-[#382D25]"
              >
                🌿 Best Veg Dishes?
              </button>
              <button
                onClick={() => setAiInput("How do I book a private cabana?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-[#C5A46D]/30 text-[#382D25]"
              >
                ✨ Book Cabana?
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendAi} className="p-3 bg-white border-t border-[#F0E9DC] flex items-center gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about wines, food, parties..."
                className="flex-1 text-xs bg-[#FAF8F2] border border-[#F0E9DC] rounded-full px-3.5 py-2 text-[#382D25] focus:outline-none focus:border-[#C5A46D]"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-[#C5A46D] text-[#382D25] hover:bg-[#B66A4B] hover:text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
