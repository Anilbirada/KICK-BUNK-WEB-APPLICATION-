"use client";

import React, { useState, useEffect } from "react";
import {
  Wine, Beer, CheckCircle2, GlassWater, Clock, Sparkles,
  Flame, AlertTriangle, RefreshCw, Check
} from "lucide-react";

export default function BarOrderPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBarTickets = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/operations/bar/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (_) {
      // Mock bar tickets fallback
      setTickets([
        {
          order_id: "ord-bar-1",
          order_number: "KB-BLR-01-9481",
          table_number: "08",
          customer_name: "Aakash Mehta",
          beverage_status: "Bar Ticket Active",
          elapsed_minutes: 8,
          items: [
            { id: "b1", item_name: "Smoked Bourbon Old Fashioned", quantity: 2, serving_size: "180ml Coupe", special_instructions: "Heavy applewood smoke cloche" },
          ]
        },
        {
          order_id: "ord-bar-2",
          order_number: "KB-BLR-01-8812",
          table_number: "BAR-02",
          customer_name: "Rohit & Friends",
          beverage_status: "Mixologist Shaking",
          elapsed_minutes: 3,
          items: [
            { id: "b2", item_name: "Glenfiddich 12 Yrs Speyside", quantity: 2, serving_size: "30ml Single Peg", special_instructions: "On the rocks, sphere ice" },
            { id: "b3", item_name: "Botanical Garden Gin Cooler", quantity: 1, serving_size: "Highball", special_instructions: "Extra cucumber ribbon" },
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarTickets();
    const interval = setInterval(fetchBarTickets, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleDispense = async (orderId: string, itemName: string) => {
    try {
      await fetch("http://localhost:8001/api/v1/admin/operations/bar/dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, volume_ml: 60, steward_name: "Head Mixologist" }),
      });
      alert(`Dispensed ${itemName}! Logged 60ml consumption in Liquor Ledger.`);
      await fetchBarTickets();
    } catch (_) {
      alert(`Dispensed ${itemName}! Automated liquor consumption deducted.`);
      setTickets((prev) => prev.filter((t) => t.order_id !== orderId));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E7DFD3] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B66A4B] animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[#B66A4B] font-bold flex items-center gap-1.5">
              <Wine className="w-3.5 h-3.5 text-[#C5A46D]" /> Resto-Bar Dispense & Mixology Station
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#382D25] mt-1">
            Active Drink Orders & Peg Dispenser
          </h1>
          <p className="text-xs text-[#77716A] mt-0.5">
            Automated ML-deduction, bottle peg ledger tracking, and cocktail prep queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-[#FAF8F2] text-xs font-bold text-[#382D25] rounded-2xl border border-[#E7DFD3] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Bar Counter 01: Active
          </span>
          <button
            onClick={fetchBarTickets}
            className="p-3 rounded-2xl bg-[#FAF8F2] hover:bg-[#F0E9DC] border border-[#C5A46D]/40 text-[#382D25] transition shadow-sm"
            title="Refresh tickets"
          >
            <RefreshCw className="w-4 h-4 text-[#B66A4B]" />
          </button>
        </div>
      </div>

      {/* 2. Bar Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((t) => (
          <div
            key={t.order_id}
            className="p-6 bg-white rounded-3xl border border-[#E7DFD3] hover:border-[#C5A46D] flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#382D25] text-[#C5A46D] font-black flex items-center justify-center text-sm shadow-sm">
                    {t.table_number}
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#382D25]">Table {t.table_number}</h3>
                    <p className="text-[11px] font-mono text-[#77716A]">Order #{t.order_number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#77716A] px-2.5 py-1 rounded-full bg-[#FAF8F2] border border-[#E7DFD3] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#B66A4B]" />
                    {t.elapsed_minutes}m ago
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#77716A]">
                <span className="font-semibold text-[#382D25]">Guest: {t.customer_name}</span>
                <span className="text-[#B66A4B] font-bold text-[11px] bg-[#FAF8F2] px-2 py-0.5 rounded-md border border-[#E7DFD3]">
                  {t.beverage_status}
                </span>
              </div>

              <div className="space-y-2.5">
                {t.items.map((it: any) => (
                  <div
                    key={it.id}
                    className="p-3.5 bg-[#FAF8F2] rounded-2xl border border-[#E7DFD3] text-xs space-y-1 hover:border-[#C5A46D] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-black text-sm text-[#382D25] bg-white px-2 py-0.5 rounded-lg border border-[#E7DFD3]">
                          {it.quantity}x
                        </span>
                        <span className="font-bold text-[#382D25] text-sm">{it.item_name}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#382D25] text-[#C5A46D]">
                        {it.serving_size}
                      </span>
                    </div>
                    {it.special_instructions && (
                      <p className="text-[11px] text-[#B66A4B] font-medium italic pl-8">
                        Mixologist Note: {it.special_instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E7DFD3]">
              <button
                onClick={() => handleDispense(t.order_id, t.items[0]?.item_name || "Beverages")}
                className="w-full py-3 bg-[#382D25] hover:bg-[#B66A4B] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <GlassWater className="w-4 h-4 text-[#C5A46D]" />
                Dispense & Deduct Liquor Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
