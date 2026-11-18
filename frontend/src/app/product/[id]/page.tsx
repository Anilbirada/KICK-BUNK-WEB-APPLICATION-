"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Clock, Flame, ShieldAlert, Plus, 
  Minus, Check, ShoppingBag, Wine 
} from "lucide-react";
import { api } from "../../../lib/api";
import { useCart } from "../../../context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { addItem, itemCount, isLoading: cartLoading } = useCart();

  const [product, setProduct] = useState<any | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      try {
        const item = await api.getProduct(productId);
        setProduct(item);
        const defVariant = item.variants?.find((v: any) => v.is_default) || item.variants?.[0];
        if (defVariant) setSelectedVariantId(defVariant.id);
      } catch (err: any) {
        setError(err.message || "Product not found.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#B58A45] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-sm text-red-600">{error || "Product not found."}</p>
          <a href="/menu" className="text-xs font-bold text-[#B58A45] underline">
            Return to Menu
          </a>
        </div>
      </div>
    );
  }

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
  const currentTotal = Math.round((currentUnitPrice * quantity + Number.EPSILON) * 100) / 100;

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
      router.push("/cart");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EB] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl overflow-hidden border border-[#EFE7DA] shadow-xl">
          {/* Large Hero Image */}
          <div className="relative h-72 sm:h-96 w-full bg-neutral-900">
            <img
              src={product.image_url || "/images/kickbunk/magicpin_04_food_spread_dining.webp"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.is_veg ? (
                  <span className="bg-green-700 text-white text-xs font-bold px-2.5 py-1 rounded">
                    PURE VEG
                  </span>
                ) : (
                  <span className="bg-red-800 text-white text-xs font-bold px-2.5 py-1 rounded">
                    NON-VEG
                  </span>
                )}
                {product.is_signature && (
                  <span className="bg-[#B58A45] text-white text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    SIGNATURE
                  </span>
                )}
              </div>
              {product.preparation_time_minutes > 0 && (
                <span className="flex items-center gap-1 text-xs text-neutral-200 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5 text-[#DCC18B]" />
                  ~{product.preparation_time_minutes} mins
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#25231F]">
                {product.name}
              </h1>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Portions */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#B58A45] block mb-2">
                  Serving Size / Portion
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        selectedVariantId === v.id
                          ? "border-[#B58A45] bg-[#EFE7DA]/50 text-[#25231F] font-bold ring-1 ring-[#B58A45]"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <span>{v.name}</span>
                      {v.price_delta > 0 && <span className="text-[#B58A45] font-bold">+₹{v.price_delta}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {product.addons && product.addons.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#B58A45] block mb-2">
                  Add-on Accompaniments
                </label>
                <div className="space-y-2">
                  {product.addons.map((ad: any) => {
                    const isChecked = selectedAddonIds.includes(ad.id);
                    return (
                      <div
                        key={ad.id}
                        onClick={() => toggleAddon(ad.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "border-[#B58A45] bg-[#EFE7DA]/40 text-[#25231F]"
                            : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked ? "bg-[#B58A45] border-[#B58A45] text-white" : "border-neutral-300"
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

            {/* Special request */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Special Preparation Note
              </label>
              <input
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Mild spice, extra lemon..."
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#B58A45]"
              />
            </div>

            {/* Bottom Add Bar */}
            <div className="pt-6 border-t border-neutral-100 flex items-center justify-between gap-4">
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-neutral-600 hover:text-black"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-bold text-[#25231F]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-neutral-600 hover:text-black"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={cartLoading || addedSuccess}
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-between ${
                  addedSuccess
                    ? "bg-green-700 text-white"
                    : "bg-[#25231F] hover:bg-[#38342D] text-[#DCC18B]"
                }`}
              >
                <span>{addedSuccess ? "Added to Order!" : "Add to Order"}</span>
                <span className="font-serif text-lg text-white">₹{currentTotal}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
