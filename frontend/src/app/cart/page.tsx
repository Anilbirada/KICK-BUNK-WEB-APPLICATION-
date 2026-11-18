"use client";

import React from "react";
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  Sparkles, ShieldCheck, ArrowLeft, UtensilsCrossed 
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useTableSession } from "../../context/TableSessionContext";

export default function CartPage() {
  const { 
    items, itemCount, subtotal, cgst, sgst, totalTax, 
    packagingFee, deliveryFee, finalAmount, updateItemQuantity, 
    removeItem, clearCart, isLoading 
  } = useCart();
  const { tableNumber, diningArea, isDineInActive, outletName } = useTableSession();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#F7F3EB]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-5 border border-[#EFE7DA] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EFE7DA] flex items-center justify-center text-[#B58A45] mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#25231F]">
              Your Cart is Empty
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Explore our charcoal kebabs, royal curries, and craft cocktails to add items.
            </p>
          </div>
          <a
            href="/menu"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#25231F] text-[#DCC18B] font-bold text-xs uppercase tracking-wider hover:bg-[#38342D] transition-colors"
          >
            <span>Browse Digital Menu</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EB] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EFE7DA] mb-6">
          <div className="flex items-center gap-3">
            <a href="/menu" className="p-2 rounded-full hover:bg-[#EFE7DA] text-neutral-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#25231F]">
                Dining Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h1>
              {isDineInActive && tableNumber ? (
                <div className="flex items-center gap-1.5 text-xs text-[#B58A45] font-bold mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dine-In • Table {tableNumber} ({diningArea || "Garden"})</span>
                </div>
              ) : (
                <p className="text-xs text-neutral-500 mt-0.5">
                  Review your dishes and proceed to checkout
                </p>
              )}
            </div>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE7DA] shadow-sm flex gap-4"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    src={item.item_image || "/images/kickbunk/magicpin_04_food_spread_dining.webp"}
                    alt={item.item_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-playfair text-base font-bold text-[#25231F]">
                        {item.item_name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variant_name && (
                      <span className="text-[11px] font-semibold text-[#B58A45] block">
                        Portion: {item.variant_name}
                      </span>
                    )}

                    {item.selected_addons && item.selected_addons.length > 0 && (
                      <div className="text-[11px] text-neutral-500 mt-1">
                        + {item.selected_addons.map((a) => `${a.name} (₹${a.price})`).join(", ")}
                      </div>
                    )}

                    {item.special_request && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 inline-block">
                        Note: {item.special_request}
                      </p>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-100">
                    <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-neutral-600 hover:text-black"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-[#25231F]">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-neutral-600 hover:text-black"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-serif text-base font-bold text-[#25231F]">
                      ₹{item.total_price}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <a
              href="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#B58A45] hover:underline pt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add more dishes or beverages</span>
            </a>
          </div>

          {/* Bill Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-[#EFE7DA] shadow-sm space-y-5 sticky top-28">
              <h2 className="font-playfair text-xl font-bold text-[#25231F] pb-3 border-b border-neutral-100">
                Order Financial Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Item Subtotal</span>
                  <span className="font-serif font-bold text-neutral-900">₹{subtotal}</span>
                </div>
                
                {/* Indian GST Breakdown */}
                <div className="flex justify-between text-neutral-500">
                  <span>CGST (2.5%)</span>
                  <span className="font-serif">₹{cgst}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>SGST (2.5%)</span>
                  <span className="font-serif">₹{sgst}</span>
                </div>

                {packagingFee > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Eco-friendly Packaging</span>
                    <span className="font-serif">₹{packagingFee}</span>
                  </div>
                )}

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Direct Delivery Charge</span>
                    <span className="font-serif">₹{deliveryFee}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#25231F]">Final Payable Amount</span>
                  <span className="font-serif text-2xl font-bold text-[#B58A45]">₹{finalAmount}</span>
                </div>
              </div>

              {/* Table details for dine in */}
              {isDineInActive && tableNumber && (
                <div className="p-3 bg-[#F7F3EB] rounded-xl border border-[#EFE7DA] text-xs space-y-1">
                  <div className="font-bold text-[#25231F] flex items-center justify-between">
                    <span>Dine-In Destination:</span>
                    <span className="text-[#B58A45]">Table {tableNumber}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    {outletName || "Kick Bunk Bengaluru"} • {diningArea || "Garden"}
                  </p>
                </div>
              )}

              {/* Proceed Button */}
              <a
                href="/checkout"
                className="w-full py-4 rounded-2xl bg-[#25231F] hover:bg-[#38342D] text-[#DCC18B] font-bold text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>100% Secure Server-Side GST Calculation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
