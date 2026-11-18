"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, UtensilsCrossed, Wine, Calendar, ChevronRight, 
  Star, MapPin, Phone, Clock, ShieldCheck, ArrowRight, Check,
  Play, Pause, Volume2, VolumeX, Maximize2, X, MessageSquare, Bot,
  PartyPopper, Compass, ChevronDown, Send, Eye, EyeOff
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

  // Hero Ambient Video Controls & Visibility
  const [heroVideoSrc, setHeroVideoSrc] = useState("/videos/hero.mp4");
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [heroMuted, setHeroMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const toggleHeroSound = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !heroVideoRef.current.muted;
      setHeroMuted(heroVideoRef.current.muted);
    }
  };

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
      {/* 1. CINEMATIC VIDEO HERO (WHITE & LUXURY SAPPHIRE BLUE AESTHETIC) */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#07111E]">
        {/* Full-Bleed 4K Ambient Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={heroVideoRef}
            key={heroVideoSrc}
            autoPlay
            loop
            muted={heroMuted}
            playsInline
            poster="/images/kickbunk/google_01_garden_lights_night.jpg"
            className="w-full h-full object-cover scale-105 transform motion-safe:animate-pulse-slow"
          >
            <source
              src={heroVideoSrc}
              type="video/mp4"
            />
          </video>
          {/* Subtle multi-layer cinematic vignette for maximum video clarity and ultra-legible typography */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-transparent to-black/60" />
        </div>

        {/* Top Luxury Live Bar */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-between items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#07111E]/70 backdrop-blur-md border border-sky-400/50 text-sky-200 text-xs font-medium shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="tracking-wide">Bengaluru Flagship & Tirupati Luxury Outlets</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleHeroSound}
              className="px-3.5 py-1.5 rounded-full bg-[#07111E]/70 hover:bg-[#07111E]/90 backdrop-blur-md border border-sky-400/40 text-white text-xs font-medium flex items-center gap-2 transition-all shadow-lg hover:scale-105"
              title={heroMuted ? "Unmute Ambient Sound" : "Mute Sound"}
            >
              {heroMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline text-slate-300">Audio Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline text-cyan-300 font-semibold">Playing</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Centerpiece: Weightless, Pure White & Sapphire Blue Luxury Typography Floating Directly Over Video */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto py-12 space-y-8">
          {/* Brand Monogram Badge */}
          <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-[#07111E]/80 backdrop-blur-md border border-sky-400 text-sky-300 text-xs font-semibold uppercase tracking-[0.3em] shadow-[0_0_25px_rgba(56,189,248,0.35)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>European Luxury Dining & Resto-Bar</span>
          </div>

          {/* Grand Master Title in Diamond White & Sapphire Glow */}
          <div className="space-y-4">
            <h1 
              style={{ color: "#FFFFFF" }}
              className="font-serif text-6xl sm:text-8xl lg:text-9xl font-black tracking-[0.2em] text-white drop-shadow-[0_12px_40px_rgba(0,0,0,1)] uppercase leading-none"
            >
              KICK BUNK
            </h1>
            <p 
              style={{ color: "#38BDF8" }}
              className="font-serif italic text-2xl sm:text-4xl lg:text-5xl text-sky-400 font-normal tracking-wide drop-shadow-[0_6px_25px_rgba(0,0,0,1)]"
            >
              Where Flavours Meet Extraordinary Experiences.
            </p>
          </div>

          {/* Concise Narrative in Crisp White */}
          <p 
            style={{ color: "#F1F5F9" }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-slate-100 font-light leading-relaxed drop-shadow-[0_3px_12px_rgba(0,0,0,1)]"
          >
            An expansive sanctuary of fairy-lit garden cabanas, live charcoal tandoor gastronomy, and handcrafted nightlife mixology. Welcome to hospitality elevated.
          </p>

          {/* Dine-in quick action banner if guest has scanned table QR */}
          {isDineInActive && tableNumber && (
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#07111E]/80 backdrop-blur-md border border-sky-400 text-white text-sm font-semibold shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>You are seated at <strong className="text-cyan-300">Table {tableNumber}</strong>. Direct order routing active!</span>
            </div>
          )}

          {/* Primary Action Buttons in Sapphire Blue & Pure White */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <a
              href="/menu"
              className="py-4 px-9 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_10px_30px_rgba(14,165,233,0.55)] hover:scale-105 flex items-center gap-2.5"
            >
              <span>Explore Digital Menu</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
            <a
              href="/reservations"
              className="py-4 px-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-sky-400/90 font-semibold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-105 flex items-center gap-2.5"
            >
              <Calendar className="w-4 h-4 text-sky-300" />
              <span>Reserve a Table</span>
            </a>
            <a
              href="#experience"
              className="py-4 px-7 rounded-full bg-[#07111E]/70 hover:bg-[#07111E]/90 backdrop-blur-md text-slate-100 hover:text-white border border-sky-500/40 font-medium text-xs tracking-wider transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>Watch Experience</span>
            </a>
          </div>
        </div>

        {/* Bottom Floating Atmosphere Switcher Strip */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-[#07111E]/80 backdrop-blur-md border border-sky-500/30 rounded-full p-2 flex flex-wrap items-center justify-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400 px-3 hidden md:inline">
              Explore Spaces:
            </span>
            {[
              { label: "🌿 Garden Cabanas", src: "/videos/hero.mp4" },
              { label: "🍸 Craft Mixology", src: "/videos/cocktails.mp4" },
              { label: "🔥 Live Charcoal Kitchen", src: "/videos/food.mp4" },
              { label: "🍾 Resto-Bar Lounge", src: "/videos/bar.mp4" },
              { label: "🎉 Nightlife & Ambiance", src: "/videos/ambience.mp4" }
            ].map((tab) => (
              <button
                key={tab.src}
                onClick={() => setHeroVideoSrc(tab.src)}
                className={`px-4 py-2 rounded-full text-xs tracking-wide transition-all ${
                  heroVideoSrc === tab.src
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-[0_0_20px_rgba(56,189,248,0.5)] scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. LUXURY STATS RIBBON (White & Sapphire Blue Accent) */}
      <section className="bg-[#07111E] text-white py-10 border-b border-sky-500/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-400 tracking-tight">35+</p>
              <p className="text-xs text-sky-300 uppercase tracking-[0.18em] font-medium">Signature Dishes</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-400 tracking-tight">Speyside</p>
              <p className="text-xs text-sky-300 uppercase tracking-[0.18em] font-medium">Single Malts Cellar</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-400 tracking-tight">Open-Air</p>
              <p className="text-xs text-sky-300 uppercase tracking-[0.18em] font-medium">Private Garden Cabanas</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-400 tracking-tight">Universal QR</p>
              <p className="text-xs text-sky-300 uppercase tracking-[0.18em] font-medium">Instant Table Ordering</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESTAURANT INTRODUCTION */}
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
