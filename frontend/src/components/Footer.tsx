"use client";

import React from "react";
import { Phone, Clock, MapPin, Mail, Instagram, Facebook, Sparkles, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F0E9DC] text-[#382D25] pt-16 pb-12 border-t border-[#C5A46D]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#FAF8F2] p-1.5 border border-[#C5A46D] shadow-sm flex items-center justify-center">
                <span className="font-serif font-bold text-base text-[#382D25]">KB</span>
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-widest text-[#382D25]">
                  KICK BUNK
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#B66A4B] font-semibold">
                  Luxury Restaurant & Resto-Bar
                </p>
              </div>
            </div>
            <p className="text-xs text-[#77716A] leading-relaxed">
              Where Flavours Meet Extraordinary Experiences. An expansive oasis of garden cabanas, live charcoal tandoor gastronomy, and handcrafted nightlife mixology.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="w-8 h-8 rounded-full bg-[#FAF8F2] border border-[#C5A46D]/40 text-[#382D25] hover:text-[#B66A4B] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#FAF8F2] border border-[#C5A46D]/40 text-[#382D25] hover:text-[#B66A4B] flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Bengaluru Flagship */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#382D25] font-bold border-b border-[#C5A46D]/30 pb-1.5 inline-block">
              Bengaluru Flagship
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-[#77716A]">
              <MapPin className="w-4 h-4 text-[#B66A4B] shrink-0 mt-0.5" />
              <span>
                Hulimangala Main Road, near Vinayaka Layout, Yarandahalli, Electronic City Phase 1, Bengaluru 560105
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#77716A]">
              <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" />
              <a href="tel:+919945321367" className="hover:text-[#B66A4B] transition-colors font-medium">
                +91 99453 21367 / +91 99806 26699
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#77716A]">
              <Clock className="w-4 h-4 text-[#C5A46D] shrink-0" />
              <span>11:30 AM – 12:30 AM (Daily)</span>
            </div>
          </div>

          {/* Tirupati Outlet */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#382D25] font-bold border-b border-[#C5A46D]/30 pb-1.5 inline-block">
              Tirupati Garden Bar
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-[#77716A]">
              <MapPin className="w-4 h-4 text-[#B66A4B] shrink-0 mt-0.5" />
              <span>
                Door No. 19-1-G/25, Kothapalli, Samavayi Margam, Chinthalachenu, Korlagunta, Tirupati 517501
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#77716A]">
              <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" />
              <a href="tel:+919980626699" className="hover:text-[#B66A4B] transition-colors font-medium">
                +91 99806 26699
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#77716A]">
              <Clock className="w-4 h-4 text-[#C5A46D] shrink-0" />
              <span>12:00 PM – 11:30 PM (Daily)</span>
            </div>
          </div>

          {/* Quick Links & Hospitality Experience */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#382D25] font-bold border-b border-[#C5A46D]/30 pb-1.5 inline-block">
              The Experience
            </h4>
            <ul className="space-y-2 text-xs text-[#77716A]">
              <li><a href="/menu" className="hover:text-[#B66A4B] transition-colors">Culinary Food Menu</a></li>
              <li><a href="/menu" className="hover:text-[#B66A4B] transition-colors">Craft Spirits & Cocktails</a></li>
              <li><a href="/#experience" className="hover:text-[#B66A4B] transition-colors">Cinematic Video Showcase</a></li>
              <li><a href="/events" className="hover:text-[#B66A4B] transition-colors">Private Parties & DJ Nights</a></li>
              <li><a href="/reservations" className="hover:text-[#B66A4B] transition-colors">Reserve VIP Cabana</a></li>
              <li><a href="/admin" className="hover:text-[#B66A4B] text-[#B66A4B] font-semibold transition-colors">Staff & Management Hub</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#C5A46D]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77716A] gap-4">
          <p>© {new Date().getFullYear()} KICK BUNK Hospitality Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>FSSAI Lic. 11223334000122</span>
            <span>•</span>
            <span>Excise Reg. EX-KA-5501</span>
            <span>•</span>
            <span>GSTIN: 29ABCDE1234F1Z5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
