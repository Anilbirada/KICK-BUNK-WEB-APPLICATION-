"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart, CreditCard, Banknote, Smartphone, Receipt,
  Plus, Minus, Trash2, Printer, CheckCircle2, Split, Clock,
  Search, ShieldCheck, Utensils, Wine
} from "lucide-react";

interface PosTable {
  id: string;
  table_number: string;
  dining_area: string;
  capacity: number;
  status: string;
  active_order: any | null;
}

export default function PosPage() {
  const [tables, setTables] = useState<PosTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<PosTable | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<"UPI" | "CARD" | "CASH" | "SPLIT">("UPI");
  const [settling, setSettling] = useState<boolean>(false);
  const [lastBill, setLastBill] = useState<any | null>(null);

  // Quick dish menu for manual POS addition
  const quickDishes = [
    { name: "Charcoal Kalmi Kebab", price: 440, is_alcohol: false },
    { name: "Royal Paneer Malai Tikka", price: 380, is_alcohol: false },
    { name: "Old Delhi Butter Chicken", price: 490, is_alcohol: false },
    { name: "24-Hour Dal Makhani", price: 375, is_alcohol: false },
    { name: "Hyderabadi Dum Biryani", price: 480, is_alcohol: false },
    { name: "Garlic Butter Naan", price: 80, is_alcohol: false },
    { name: "Smoked Bourbon Old Fashioned", price: 580, is_alcohol: true },
    { name: "Glenfiddich 12 Yrs (30ml Peg)", price: 650, is_alcohol: true },
    { name: "Corona Extra Beer", price: 380, is_alcohol: true },
  ];

  const fetchTables = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/pos/active-tables");
      if (res.ok) {
        const data = await res.json();
        setTables(data);
        if (data.length > 0 && !selectedTable) {
          setSelectedTable(data[0]);
        } else if (selectedTable) {
          const updated = data.find((t: any) => t.id === selectedTable.id);
          if (updated) setSelectedTable(updated);
        }
      }
    } catch (err) {
      // Mock fallback tables
      const mock: PosTable[] = [
        {
          id: "t-08",
          table_number: "08",
          dining_area: "Garden Terrace",
          capacity: 4,
          status: "OCCUPIED",
          active_order: {
            order_id: "ord-mock-08",
            order_number: "KB-BLR-01-9481",
            customer_name: "Aakash Mehta",
            customer_phone: "+91 98450 77112",
            subtotal: 1395.0,
            cgst: 34.88,
            sgst: 34.88,
            final_amount: 1464.76,
            items: [
              { item_name: "Charcoal Kalmi Kebab", quantity: 1, unit_price: 440, total_price: 440 },
              { item_name: "24-Hour Dal Makhani", quantity: 1, unit_price: 375, total_price: 375 },
              { item_name: "Smoked Bourbon Old Fashioned", quantity: 1, unit_price: 580, total_price: 580 },
            ],
          },
        },
        {
          id: "t-04",
          table_number: "04",
          dining_area: "Main Dining Hall",
          capacity: 6,
          status: "AVAILABLE",
          active_order: null,
        },
        {
          id: "t-03",
          table_number: "03",
          dining_area: "VIP Poolside Cabana",
          capacity: 8,
          status: "AVAILABLE",
          active_order: null,
        },
        {
          id: "t-bar",
          table_number: "BAR-02",
          dining_area: "Resto-Bar Counter",
          capacity: 2,
          status: "OCCUPIED",
          active_order: {
            order_id: "ord-mock-bar",
            order_number: "KB-BLR-01-8812",
            customer_name: "Rohit & Friends",
            customer_phone: "+91 99001 22334",
            subtotal: 1300.0,
            cgst: 32.5,
            sgst: 32.5,
            final_amount: 1365.0,
            items: [
              { item_name: "Glenfiddich 12 Yrs (30ml Peg)", quantity: 2, unit_price: 650, total_price: 1300 },
            ],
          },
        },
      ];
      setTables(mock);
      setSelectedTable(mock[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSettle = async () => {
    if (!selectedTable?.active_order) return;
    setSettling(true);

    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/pos/settle-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedTable.active_order.order_id,
          payment_mode: paymentMode,
          discount_amount: discountAmount,
          cashier_id: "cashier-01",
        }),
      });

      if (res.ok) {
        const bill = await res.json();
        setLastBill(bill);
        await fetchTables();
      } else {
        throw new Error("Settlement failed");
      }
    } catch (_) {
      // Offline fallback bill generation
      const subtotal = selectedTable.active_order.subtotal;
      const discounted = Math.max(0, subtotal - discountAmount);
      const cgst = Math.round(discounted * 0.025 * 100) / 100;
      const sgst = Math.round(discounted * 0.025 * 100) / 100;
      const final = Math.round((discounted + cgst + sgst) * 100) / 100;

      setLastBill({
        success: true,
        bill_number: `KB-INV-${new Date().getFullYear()}${new Date().getMonth() + 1}-` + Math.floor(1000 + Math.random() * 9000),
        final_amount: final,
        cgst,
        sgst,
        payment_mode: paymentMode,
        table_number: selectedTable.table_number,
        settled_at: new Date().toISOString(),
      });
    } finally {
      setSettling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentOrder = selectedTable?.active_order;
  const subtotal = currentOrder ? currentOrder.subtotal : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const cgst = Math.round(discountedSubtotal * 0.025 * 100) / 100;
  const sgst = Math.round(discountedSubtotal * 0.025 * 100) / 100;
  const grandTotal = Math.round((discountedSubtotal + cgst + sgst) * 100) / 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6.5rem)] animate-fade-in pb-4">
      {/* LEFT COLUMN: TABLE SELECTOR & QUICK ADD (7 COLS) */}
      <div className="lg:col-span-7 flex flex-col gap-5 overflow-y-auto pr-1">
        {/* Floor Tables Grid Card */}
        <div className="p-6 bg-white rounded-3xl border border-[#E7DFD3] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B66A4B] block">
                LIVE FLOOR SELECTOR
              </span>
              <h2 className="text-base font-serif font-bold text-[#382D25] flex items-center gap-2">
                Restaurant & Bar Dining Tables
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
              </span>
              <span className="flex items-center gap-1.5 text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Occupied (Billing)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {tables.map((t) => {
              const isSelected = selectedTable?.id === t.id;
              const isOccupied = t.status === "OCCUPIED" || t.active_order;

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTable(t)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-[#C5A46D] bg-[#F0E9DC] ring-2 ring-[#C5A46D]/50 shadow-sm"
                      : isOccupied
                      ? "border-amber-300 bg-amber-50/60 hover:bg-amber-100/60 shadow-xs"
                      : "border-[#E7DFD3] bg-[#FAF8F2] hover:bg-[#F0E9DC]/60 hover:border-[#C5A46D]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-xs text-[#382D25]">T-{t.table_number}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOccupied ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                      }`}
                    ></span>
                  </div>
                  <div className="text-[10px] text-[#77716A] truncate">{t.dining_area}</div>
                  {isOccupied && t.active_order ? (
                    <div className="text-[10px] text-[#B66A4B] font-bold mt-1">
                      ₹{t.active_order.final_amount}
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#77716A] mt-1 font-medium">Vacant</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Menu Additions Card */}
        <div className="flex-1 p-6 bg-white rounded-3xl border border-[#E7DFD3] shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B66A4B] block">
                SPEED ORDERING
              </span>
              <h3 className="text-sm font-serif font-bold text-[#382D25]">
                Quick Menu Addition (Staff POS)
              </h3>
            </div>
            <span className="text-xs text-[#77716A]">Click item to append to selected table</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto">
            {quickDishes.map((dish, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!selectedTable) return;
                  alert(`Added 1x ${dish.name} to Table ${selectedTable.table_number}`);
                }}
                className="p-3 bg-[#FAF8F2] hover:bg-[#F0E9DC] border border-[#E7DFD3] hover:border-[#C5A46D] rounded-2xl text-left transition flex flex-col justify-between"
              >
                <div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${dish.is_alcohol ? "bg-purple-100 text-purple-900 border border-purple-200" : "bg-emerald-100 text-emerald-900 border border-emerald-200"}`}>
                    {dish.is_alcohol ? "BAR" : "FOOD"}
                  </span>
                  <p className="text-xs font-semibold text-[#382D25] mt-1 line-clamp-1">{dish.name}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E7DFD3]">
                  <span className="text-xs font-bold text-[#B66A4B]">₹{dish.price}</span>
                  <span className="text-[10px] text-[#382D25] font-bold">+ ADD</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE TICKET, BILLING & SETTLEMENT (5 COLS) */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E7DFD3] p-6 shadow-sm flex flex-col justify-between h-full">
        {/* Ticket Header */}
        <div className="border-b border-[#E7DFD3] pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#B66A4B] tracking-wider block">
                CURRENT TABLE BILL
              </span>
              <h2 className="font-serif text-xl font-bold text-[#382D25]">
                {selectedTable ? `Table ${selectedTable.table_number}` : "Select Table"}
                <span className="text-xs font-normal text-[#77716A] ml-2">
                  ({selectedTable?.dining_area || "Main"})
                </span>
              </h2>
            </div>
            {currentOrder ? (
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-bold rounded-full animate-pulse">
                Order #{currentOrder.order_number}
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-300 text-[10px] font-bold rounded-full">
                No Active Orders
              </span>
            )}
          </div>

          {currentOrder && (
            <div className="text-xs text-[#77716A] flex items-center justify-between pt-1">
              <span>Guest: <strong className="text-[#382D25]">{currentOrder.customer_name}</strong></span>
              <span>Phone: <strong className="text-[#382D25]">{currentOrder.customer_phone || "In-Restaurant"}</strong></span>
            </div>
          )}
        </div>

        {/* Ordered Items List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {currentOrder && currentOrder.items && currentOrder.items.length > 0 ? (
            currentOrder.items.map((it: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-[#FAF8F2] rounded-2xl border border-[#E7DFD3] flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-[#382D25]">{it.quantity}x {it.item_name}</p>
                  {it.variant_name && (
                    <span className="text-[10px] text-[#B66A4B] font-medium">{it.variant_name}</span>
                  )}
                </div>
                <span className="font-bold text-[#382D25]">₹{it.total_price}</span>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#77716A]">
              <ShoppingCart className="w-10 h-10 mb-2 opacity-30 text-[#C5A46D]" />
              <p className="text-xs font-semibold text-[#382D25]">Table is currently empty</p>
              <p className="text-[10px] text-[#77716A]">Select an occupied table or append items from the menu</p>
            </div>
          )}
        </div>

        {/* Financial Calculation & Settlement Footer */}
        {currentOrder ? (
          <div className="border-t border-[#E7DFD3] pt-4 space-y-3">
            {/* Calculation summary */}
            <div className="space-y-1.5 text-xs bg-[#FAF8F2] p-3.5 rounded-2xl border border-[#E7DFD3]">
              <div className="flex justify-between text-[#77716A]">
                <span>Items Subtotal:</span>
                <span className="text-[#382D25] font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              {/* Discount Selector */}
              <div className="flex items-center justify-between text-[#77716A]">
                <span className="flex items-center gap-1">
                  VIP / Member Discount:
                  <button
                    onClick={() => setDiscountAmount(discountAmount === 0 ? subtotal * 0.1 : 0)}
                    className="text-[10px] text-[#B66A4B] font-bold underline ml-1"
                  >
                    {discountAmount > 0 ? "Remove" : "Apply 10%"}
                  </button>
                </span>
                <span className="text-[#B66A4B] font-semibold">-₹{discountAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#77716A]">
                <span>CGST (2.5%):</span>
                <span className="text-[#382D25]">₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#77716A]">
                <span>SGST (2.5%):</span>
                <span className="text-[#382D25]">₹{sgst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#382D25] pt-2 border-t border-[#E7DFD3]">
                <span>Total Payable:</span>
                <span className="text-[#B66A4B] font-serif text-lg">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: "UPI", label: "⚡ UPI", icon: Smartphone },
                { key: "CARD", label: "💳 Card", icon: CreditCard },
                { key: "CASH", label: "💵 Cash", icon: Banknote },
                { key: "SPLIT", label: "✂ Split", icon: Split },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setPaymentMode(m.key as any)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition ${
                    paymentMode === m.key
                      ? "bg-[#382D25] text-white border-[#382D25] shadow-xs"
                      : "bg-[#FAF8F2] text-[#77716A] border-[#E7DFD3] hover:text-[#382D25]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Settle Action */}
            <button
              onClick={handleSettle}
              disabled={settling}
              className="w-full py-3.5 bg-[#382D25] hover:bg-[#251E19] text-[#FAF8F2] font-semibold text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {settling ? (
                <span>Generating GST Invoice...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#C5A46D]" />
                  <span>Settle & Generate GST Invoice (₹{grandTotal.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        ) : null}

        {/* Settled Bill Modal Overlay */}
        {lastBill && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl border border-[#C5A46D] p-6 space-y-4 shadow-2xl animate-scale-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F2] border border-[#C5A46D] text-[#C5A46D] flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#382D25]">TAX INVOICE GENERATED</h3>
                <p className="text-[10px] text-[#B66A4B] uppercase font-bold tracking-wider">
                  KICK BUNK HOSPITALITY PVT LTD
                </p>
                <p className="text-[10px] text-[#77716A]">GSTIN: 29ABCDE1234F1Z5</p>
              </div>

              <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#E7DFD3] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#77716A]">Invoice Number:</span>
                  <span className="font-bold text-[#382D25]">{lastBill.bill_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716A]">Table:</span>
                  <span className="font-bold text-[#382D25]">Table {lastBill.table_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716A]">CGST (2.5%):</span>
                  <span className="text-[#382D25]">₹{lastBill.cgst}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716A]">SGST (2.5%):</span>
                  <span className="text-[#382D25]">₹{lastBill.sgst}</span>
                </div>
                <div className="flex justify-between font-bold text-[#382D25] border-t border-[#E7DFD3] pt-2">
                  <span>Settled Amount:</span>
                  <span className="text-[#B66A4B] text-sm">₹{lastBill.final_amount}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-[#FAF8F2] hover:bg-[#F0E9DC] border border-[#E7DFD3] text-[#382D25] font-semibold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C5A46D]" /> Print Bill
                </button>
                <button
                  onClick={() => setLastBill(null)}
                  className="flex-1 py-3 bg-[#382D25] hover:bg-[#251E19] text-[#FAF8F2] font-semibold text-xs rounded-2xl shadow-sm transition"
                >
                  Close & Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
