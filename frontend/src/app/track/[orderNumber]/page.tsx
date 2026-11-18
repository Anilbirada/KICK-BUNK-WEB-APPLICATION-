"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { 
  CheckCircle, Clock, Utensils, Wine, Bell, 
  Sparkles, AlertCircle, ChefHat, CheckCircle2 
} from "lucide-react";
import { api } from "../../../lib/api";

const ORDER_STAGES = [
  { key: "PLACED", label: "Order Placed", desc: "Submitted to restaurant central system" },
  { key: "ACCEPTED", label: "Accepted by Floor", desc: "Kitchen ticket printed and routed" },
  { key: "PREPARING", label: "Cooking in Clay Oven", desc: "Chefs preparing your food & cocktails" },
  { key: "READY", label: "Plated & Ready", desc: "Ready at kitchen counter for delivery" },
  { key: "SERVED", label: "Served at Table", desc: "Delivered to your table. Enjoy your meal!" },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const wsRef = useRef<WebSocket | null>(null);

  const fetchOrderDetails = async () => {
    if (!orderNumber) return;
    try {
      const data = await api.trackOrder(orderNumber);
      setOrder(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load order tracking details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();

    // Setup polling fallback every 5 seconds
    const interval = setInterval(() => {
      fetchOrderDetails();
    }, 5000);

    return () => clearInterval(interval);
  }, [orderNumber]);

  // Connect WebSocket when order is loaded
  useEffect(() => {
    if (!order?.id) return;

    try {
      const wsUrl = `ws://localhost:8001/api/v1/order-tracking/ws/${order.id}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.status) {
            setOrder((prev: any) => ({
              ...prev,
              order_status: msg.status,
              food_status: msg.food_status || prev.food_status,
              beverage_status: msg.beverage_status || prev.beverage_status,
            }));
            setLastUpdated(new Date().toLocaleTimeString());
          }
        } catch (_) {}
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } catch (_) {}
  }, [order?.id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B58A45] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500">Connecting to live kitchen tracker...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-sm">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm text-red-600">{error || "Order tracking record not found."}</p>
          <a href="/menu" className="text-xs font-bold text-[#B58A45] underline">
            Return to Menu
          </a>
        </div>
      </div>
    );
  }

  // Determine stage index
  const currentStageIndex = ORDER_STAGES.findIndex((s) => s.key === order.order_status);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  return (
    <div className="min-h-screen bg-[#F7F3EB] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Card */}
        <div className="bg-[#25231F] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#DCC18B]">
                  Live Kitchen Tracker
                </span>
              </div>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold mt-1">
                Order #{order.order_number}
              </h1>
              <div className="text-xs text-neutral-400 mt-1">
                {order.table_number ? `Dine-In • Table ${order.table_number}` : "Takeaway / Delivery"} • {order.outlet_name || "Bengaluru Flagship"}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:text-right border border-white/15">
              <span className="text-[10px] text-neutral-300 uppercase tracking-widest block font-semibold">
                Estimated Delivery Time
              </span>
              <span className="font-serif text-2xl font-bold text-[#DCC18B] flex items-center sm:justify-end gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-[#DCC18B]" />
                ~{order.estimated_prep_time_minutes} mins
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-700/60 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Last synchronized: {lastUpdated || "Live"}</span>
            <span className="text-green-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Real-Time Active
            </span>
          </div>
        </div>

        {/* Multi-Stage Visual Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DA] shadow-sm space-y-6">
          <h2 className="font-playfair text-xl font-bold text-[#25231F]">
            Order Progression
          </h2>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EFE7DA]">
            {ORDER_STAGES.map((stage, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isFuture = idx > activeIndex;

              return (
                <div key={stage.key} className="relative flex items-start gap-4">
                  {/* Step Node */}
                  <div
                    className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? "bg-green-700 text-white"
                        : isCurrent
                        ? "bg-[#B58A45] text-white ring-4 ring-[#B58A45]/30 animate-pulse"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>

                  <div>
                    <h3
                      className={`font-playfair text-base font-bold ${
                        isCurrent
                          ? "text-[#B58A45]"
                          : isPast
                          ? "text-[#25231F]"
                          : "text-neutral-400"
                      }`}
                    >
                      {stage.label}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Station Breakdown: Food vs Beverages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#EFE7DA] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Clay Oven & Kitchen Station
              </span>
              <span className="font-playfair text-base font-bold text-[#25231F]">
                Food: {order.food_status}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#EFE7DA] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Wine className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Resto-Bar Mixology Counter
              </span>
              <span className="font-playfair text-base font-bold text-[#25231F]">
                Beverages: {order.beverage_status}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFE7DA] shadow-sm space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#25231F]">
            Ordered Dishes & Drinks
          </h3>
          <div className="space-y-2.5">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs py-2 border-b border-neutral-100 last:border-0"
              >
                <div>
                  <span className="font-bold text-[#25231F]">
                    {item.quantity}x {item.item_name}
                  </span>
                  {item.variant_name && (
                    <span className="text-[11px] text-[#B58A45] ml-2">
                      ({item.variant_name})
                    </span>
                  )}
                  {item.special_request && (
                    <span className="block text-[10px] text-amber-700">
                      Note: {item.special_request}
                    </span>
                  )}
                </div>
                <span className="font-serif font-bold text-neutral-900">
                  ₹{item.total_price}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-between font-bold text-sm text-[#25231F]">
            <span>Total Payable:</span>
            <span className="font-serif text-[#B58A45]">₹{order.final_amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
