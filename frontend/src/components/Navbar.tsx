"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, Sparkles, Calendar, Menu as MenuIcon, X, 
  Wine, UtensilsCrossed, PartyPopper, Bot, Compass, Shield
} from "lucide-react";
import { useTableSession } from "../context/TableSessionContext";
import { useCart } from "../context/CartContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { tableNumber, diningArea, isDineInActive, clearTableSession } = useTableSession();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are inside /admin, the admin layout has its own sidebar
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) {
    return null;
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "The Experience", href: "/#experience" },
    { label: "Party & Events", href: "/events" },
    { label: "Reservations", href: "/reservations" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#F0E9DC] transition-all duration-300">
      {/* Dine-In Active Ribbon */}
      {isDineInActive && tableNumber && (
        <div className="bg-[#382D25] text-[#FAF8F2] px-4 py-1.5 text-xs font-sans">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A46D] animate-ping" />
              <span className="font-semibold tracking-wider text-[#C5A46D] uppercase">Table Session:</span>
              <span className="font-bold text-white bg-[#B66A4B] px-2 py-0.5 rounded text-[11px]">
                Table {tableNumber}
              </span>
              {diningArea && <span className="hidden sm:inline text-neutral-300">({diningArea})</span>}
            </div>
            <button
              onClick={clearTableSession}
              className="text-[#C5A46D] hover:text-white text-xs underline cursor-pointer ml-3"
            >
              Exit Table Session
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Plaque */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F2] p-1 border border-[#C5A46D] shadow-sm flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
              <img src="/logo.png" alt="Kick Bunk Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#382D25]">
                KICK BUNK
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B66A4B] font-semibold -mt-0.5">
                Restaurant & Resto-Bar
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? "text-[#382D25] font-semibold"
                      : "text-[#77716A] hover:text-[#382D25]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A46D] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions: Reservations, Cart, Admin Portal */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="/reservations"
              className="px-4 py-2 rounded-full border border-[#C5A46D] text-[#382D25] hover:bg-[#C5A46D] hover:text-[#FAF8F2] font-semibold text-xs tracking-wider uppercase transition-all duration-300"
            >
              Book Table
            </a>

            <a
              href="/cart"
              className="relative p-2.5 rounded-full bg-[#F0E9DC] text-[#382D25] hover:bg-[#C5A46D] hover:text-[#FAF8F2] transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B66A4B] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </a>

            <a
              href="/admin"
              className="text-xs text-[#77716A] hover:text-[#B66A4B] flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-[#F0E9DC] transition-colors"
              title="Enterprise Admin Management"
            >
              <Shield className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Staff Hub</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-3">
            <a href="/cart" className="relative p-2 rounded-full bg-[#F0E9DC] text-[#382D25]">
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B66A4B] text-white text-[9px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#382D25] hover:bg-[#F0E9DC]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF8F2] border-b border-[#F0E9DC] px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#382D25] hover:text-[#B66A4B] py-2 border-b border-[#F0E9DC]/60 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-[#C5A46D]">›</span>
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-[#382D25] text-[#FAF8F2] font-semibold text-center text-xs tracking-widest uppercase"
            >
              Reserve a Table
            </a>
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full border border-[#C5A46D] text-[#382D25] font-medium text-center text-xs"
            >
              Enterprise Admin Hub
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
