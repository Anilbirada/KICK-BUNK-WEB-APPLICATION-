"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, Sparkles, Clock, ArrowRight, 
  MapPin, Utensils, Receipt, PhoneCall 
} from "lucide-react";
import { api } from "../../../lib/api";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      try {
        const data = await api.getOrder(orderId);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Unable to fetch order details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B58A45] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500">Retrieving your order confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-sm">
          <p className="text-sm text-red-600">{error || "Order not found."}</p>
          <a href="/menu" className="text-xs font-bold text-[#B58A45] underline">
            Back to Menu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EB] py-10 sm:py-16">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-[#EFE7DA] overflow-hidden p-6 sm:p-8 space-y-6 text-center">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border-2 border-green-200 shadow-inner">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B58A45] block">
              Order Confirmed & Sent to Kitchen
            </span>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#25231F] mt-1">
              Thank You for Dining with Us!
            </h1>
            <p className="text-xs text-neutral-500 mt-1.5">
              Your order has been queued directly into the kitchen display system.
            </p>
          </div>

          {/* Key Reference Card */}
          <div className="bg-[#F7F3EB] rounded-2xl p-4 border border-[#EFE7DA] space-y-3 text-left text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500 font-semibold">Order Number:</span>
              <span className="font-mono font-bold text-sm text-[#25231F]">
                {order.order_number}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500 font-semibold">Dining Location:</span>
              <span className="font-bold text-[#25231F]">
                {order.table_number ? `Dine-In • Table ${order.table_number}` : "Takeaway / Delivery"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-neutral-500 font-semibold">Estimated Prep Time:</span>
              <span className="font-bold text-[#B58A45] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{order.estimated_prep_time_minutes} minutes
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-semibold">Payment Status:</span>
              <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-green-100 text-green-800">
                {order.payment_status} ({order.payment_method})
              </span>
            </div>
          </div>

          {/* Order Items Snapshot */}
          <div className="text-left space-y-2 border-t border-neutral-100 pt-4">
            <span className="text-xs font-bold text-neutral-700 block">Ordered Items:</span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-xs text-neutral-600">
                  <span>
                    {item.quantity}x {item.item_name} {item.variant_name ? `(${item.variant_name})` : ""}
                  </span>
                  <span className="font-serif font-semibold">₹{item.total_price}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-sm text-[#25231F]">
              <span>Final Total Paid:</span>
              <span className="font-serif text-[#B58A45]">₹{order.final_amount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={`/track/${order.order_number}`}
              className="w-full py-3.5 rounded-2xl bg-[#25231F] hover:bg-[#38342D] text-[#DCC18B] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Track Live Order Status</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/menu"
              className="block text-xs font-bold text-[#B58A45] hover:underline"
            >
              Add more items to this order
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
