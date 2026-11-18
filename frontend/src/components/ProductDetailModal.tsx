"use client";

import React, { useState } from "react";
import { X, Clock, Flame, ShieldAlert, Plus, Minus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

export interface ProductDetailModalProps {
  product: any;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addItem, isLoading } = useCart();
  
  // Initial variant: default or first
  const defaultVariant = product.variants?.find((v: any) => v.is_default) || product.variants?.[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(defaultVariant?.id);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Calculate live item price
  let currentUnitPrice = product.base_price;
  if (selectedVariantId && product.variants) {
    const v = product.variants.find((v: any) => v.id === selectedVariantId);
    if (v) currentUnitPrice += v.price_delta;
  }
  if (selectedAddonIds.length > 0 && product.addons) {
    product.addons.forEach((ad: any) => {
      if (selectedAddonIds.includes(ad.id)) {
        currentUnitPrice += ad.price;
      }
    });
  }
  const currentTotal = round2(currentUnitPrice * quantity);

  function round2(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = async () => {
    await addItem({
      item_id: product.id,
      variant_id: selectedVariantId,
      quantity,
      selected_addon_ids: selectedAddonIds,
      special_request: specialRequest.trim() || undefined,
    });
    setAddedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#FFFFFF] rounded-2xl shadow-2xl overflow-hidden border border-[#EFE7DA] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Header */}
        <div className="relative h-56 sm:h-64 w-full bg-[#25231F] shrink-0">
          <img
            src={product.image_url || "/images/kickbunk/magicpin_04_food_spread_dining.webp"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Tags */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.is_veg ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-green-700/90 px-2 py-0.5 rounded border border-green-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                  PURE VEG
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-red-800/90 px-2 py-0.5 rounded border border-red-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                  NON-VEG
                </span>
              )}
              {product.is_alcohol && (
                <span className="text-[11px] font-bold text-white bg-purple-900/90 px-2 py-0.5 rounded border border-purple-500/40">
                  21+ SPIRIT
                </span>
              )}
              {product.is_signature && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-[#B58A45]/90 px-2 py-0.5 rounded">
                  <Flame className="w-3 h-3 text-amber-200" />
                  SIGNATURE
                </span>
              )}
            </div>
            {product.preparation_time_minutes > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-neutral-200 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                <Clock className="w-3 h-3 text-[#DCC18B]" />
                {product.preparation_time_minutes} mins
              </span>
            )}
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-[#25231F] leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants / Serving Sizes */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#B58A45] block mb-2">
                Choose Portion / Serving Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v: any) => {
                  const isSelected = selectedVariantId === v.id;
                  const priceText = v.price_delta > 0 ? `(+₹${v.price_delta})` : "";
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-[#B58A45] bg-[#EFE7DA]/50 text-[#25231F] font-semibold ring-1 ring-[#B58A45]"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="text-[#B58A45] font-bold">{priceText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {product.addons && product.addons.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#B58A45] block mb-2">
                Enhance with Add-ons
              </label>
              <div className="space-y-2">
                {product.addons.map((ad: any) => {
                  const isChecked = selectedAddonIds.includes(ad.id);
                  return (
                    <div
                      key={ad.id}
                      onClick={() => toggleAddon(ad.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "border-[#B58A45] bg-[#EFE7DA]/40 text-[#25231F]"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? "bg-[#B58A45] border-[#B58A45] text-white"
                              : "border-neutral-300"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{ad.name}</span>
                      </div>
                      <span className="font-bold text-[#B58A45]">+₹{ad.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Allergens warning */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Allergen Notice: Contains {product.allergens.map((a: any) => a.allergen_name).join(", ")}.
              </span>
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              Chef Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="e.g. Less spicy, dressing on the side..."
              className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#B58A45]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F7F3EB] border-t border-[#EFE7DA] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity selector */}
          <div className="flex items-center border border-neutral-300 rounded-lg bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 text-neutral-600 hover:text-black"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-sm font-bold text-[#25231F]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 text-neutral-600 hover:text-black"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            type="button"
            disabled={isLoading || addedSuccess}
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-between ${
              addedSuccess
                ? "bg-green-700 text-white"
                : "bg-[#25231F] hover:bg-[#38342D] text-[#DCC18B]"
            }`}
          >
            <span>{addedSuccess ? "Added to Order!" : "Add to Order"}</span>
            <span className="font-serif text-base text-white">₹{currentTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
