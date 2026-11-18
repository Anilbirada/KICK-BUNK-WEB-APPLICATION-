"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Sparkles, Flame, Clock, Wine, 
  UtensilsCrossed, AlertCircle, ShoppingBag, Plus, Check,
  Leaf, Coffee, GlassWater, Beer, ArrowRight
} from "lucide-react";
import { api } from "../../lib/api";
import { useTableSession } from "../../context/TableSessionContext";
import { useCart } from "../../context/CartContext";
import { ProductDetailModal } from "../../components/ProductDetailModal";

export default function MenuPage() {
  const { tableNumber, diningArea, isDineInActive, outletName } = useTableSession();
  const { addItem, itemCount } = useCart();

  // Menu Mode: Food vs Drinks
  const [activeMenuTab, setActiveMenuTab] = useState<"FOOD" | "DRINKS">("FOOD");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadMenu() {
      setIsLoading(true);
      try {
        const data = await api.getMenu({
          veg_only: vegOnly || undefined,
          search: searchQuery || undefined,
        });
        setCategories(data);
      } catch (err) {
        console.error("Failed to load menu", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMenu();
  }, [vegOnly, searchQuery]);

  // Handle Quick Add to Cart
  const handleQuickAdd = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addItem({
        item_id: item.id,
        quantity: 1,
      });
      setAddedNotice(`Added "${item.name}" to cart`);
      setTimeout(() => setAddedNotice(null), 2500);
    } catch (_) {}
  };

  // Filter categories strictly based on activeMenuTab (Food vs Drinks)
  const isAlcoholOrDrink = (cat: any) => {
    return cat.is_alcohol || cat.slug === "cocktails" || cat.slug === "spirits" || cat.slug === "beverages" || cat.slug === "mocktails";
  };

  const filteredCategories = categories.filter((cat) => {
    if (activeMenuTab === "FOOD" && isAlcoholOrDrink(cat)) return false;
    if (activeMenuTab === "DRINKS" && !isAlcoholOrDrink(cat)) return false;
    if (selectedCategorySlug !== "all" && cat.slug !== selectedCategorySlug) return false;
    return true;
  });

  // Extract subcategories for current tab
  const availableSubcategories = categories.filter((cat) => {
    if (activeMenuTab === "FOOD") return !isAlcoholOrDrink(cat);
    return isAlcoholOrDrink(cat);
  });

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#382D25] pb-24">
      {/* Table Context Sticky Banner if Dine-In */}
      {isDineInActive && tableNumber && (
        <div className="bg-[#382D25] border-b border-[#C5A46D] text-white px-4 py-2.5 sticky top-20 z-40 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B66A4B] flex items-center justify-center font-bold text-white text-xs">
                {tableNumber}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[#C5A46D] font-bold">
                  KICK BUNK — TABLE {tableNumber}
                </div>
                <div className="text-[11px] text-neutral-300">
                  {diningArea || "Garden Seating"} • {outletName || "Bengaluru Flagship"}
                </div>
              </div>
            </div>
            <a
              href="/cart"
              className="flex items-center gap-2 bg-[#C5A46D] hover:bg-[#B66A4B] text-[#382D25] hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({itemCount})</span>
            </a>
          </div>
        </div>
      )}

      {/* Added to cart toast notification */}
      {addedNotice && (
        <div className="fixed top-24 right-6 z-50 bg-[#382D25] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-[#C5A46D] text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#C5A46D]" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-[#F0E9DC] py-14 border-b border-[#C5A46D]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F2] border border-[#C5A46D] text-[#382D25] text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-[#B66A4B]" />
            Artisanal Dining & Mixology
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#382D25]">
            The Digital Menu
          </h1>
          <p className="text-sm sm:text-base text-[#77716A] max-w-2xl mx-auto">
            Choose between our authentic charcoal tandoor gastronomy or explore our curated spirits cellar and master mixology creations.
          </p>

          {/* DUAL MENU SWITCHER: FOOD VS DRINKS */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1.5 rounded-full bg-[#FAF8F2] border border-[#C5A46D] shadow-md">
              <button
                onClick={() => {
                  setActiveMenuTab("FOOD");
                  setSelectedCategorySlug("all");
                }}
                className={`flex items-center gap-2.5 px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeMenuTab === "FOOD"
                    ? "bg-[#382D25] text-white shadow-md"
                    : "text-[#77716A] hover:text-[#382D25]"
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-[#C5A46D]" />
                <span>Culinary Food Menu</span>
              </button>
              <button
                onClick={() => {
                  setActiveMenuTab("DRINKS");
                  setSelectedCategorySlug("all");
                }}
                className={`flex items-center gap-2.5 px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeMenuTab === "DRINKS"
                    ? "bg-[#382D25] text-white shadow-md"
                    : "text-[#77716A] hover:text-[#382D25]"
                }`}
              >
                <Wine className="w-4 h-4 text-[#C5A46D]" />
                <span>Artisan Drinks & Spirits</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#F0E9DC] shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#77716A] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder={activeMenuTab === "FOOD" ? "Search kebabs, curries, breads, biryanis..." : "Search single malts, cocktails, gins, beers..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FAF8F2] border border-[#F0E9DC] text-xs text-[#382D25] placeholder-[#77716A] focus:outline-none focus:border-[#C5A46D]"
            />
          </div>

          {/* Secondary Filters */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Vegetarian Toggle (Relevant for food) */}
            {activeMenuTab === "FOOD" && (
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#382D25]">
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#B66A4B] focus:ring-[#C5A46D] accent-[#B66A4B]"
                />
                <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Pure Veg Only
                </span>
              </label>
            )}

            <a
              href="/cart"
              className="relative p-2.5 rounded-full bg-[#F0E9DC] text-[#382D25] hover:bg-[#C5A46D] hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B66A4B] text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </a>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategorySlug("all")}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategorySlug === "all"
                ? "bg-[#382D25] text-white"
                : "bg-white border border-[#F0E9DC] text-[#77716A] hover:text-[#382D25]"
            }`}
          >
            All {activeMenuTab === "FOOD" ? "Dishes" : "Drinks"}
          </button>
          {availableSubcategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategorySlug === cat.slug
                  ? "bg-[#382D25] text-white"
                  : "bg-white border border-[#F0E9DC] text-[#77716A] hover:text-[#382D25]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Categories and Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {isLoading ? (
          <div className="text-center py-20 text-[#77716A] space-y-3">
            <Sparkles className="w-8 h-8 text-[#C5A46D] animate-spin mx-auto" />
            <p className="font-serif text-lg">Curating the finest flavours...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#F0E9DC] p-8 max-w-md mx-auto space-y-4">
            <AlertCircle className="w-10 h-10 text-[#C5A46D] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#382D25]">No Items Found</h3>
            <p className="text-xs text-[#77716A]">Try modifying your search term or dietary filter to explore other offerings.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setVegOnly(false);
                setSelectedCategorySlug("all");
              }}
              className="px-6 py-2 rounded-full bg-[#382D25] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-6">
              {/* Category Section Header */}
              <div className="flex items-center gap-4 border-b border-[#C5A46D]/30 pb-3">
                <div className="w-3 h-3 rounded-full bg-[#B66A4B]" />
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#382D25]">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-xs text-[#77716A] mt-0.5">{cat.description}</p>
                  )}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cat.items?.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className="bg-white rounded-3xl overflow-hidden border border-[#F0E9DC] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                  >
                    {/* Item Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F0E9DC]">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#77716A]">
                          <UtensilsCrossed className="w-8 h-8 opacity-40" />
                        </div>
                      )}

                      {/* Dietary Indicator */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        {item.is_veg ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            VEG
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-300">
                            NON-VEG
                          </span>
                        )}
                        {item.is_signature && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5A46D] text-[#382D25] shadow">
                            CHEF'S SIGNATURE
                          </span>
                        )}
                      </div>

                      {/* Price Badge */}
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#382D25] shadow">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Item Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#382D25] group-hover:text-[#B66A4B] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#77716A] mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description || "Artisanal preparation with fine spices and luxury ingredients."}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-[#F0E9DC] flex items-center justify-between">
                        <span className="text-[11px] text-[#77716A] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
                          {item.preparation_time_minutes || 15} mins
                        </span>

                        <button
                          onClick={(e) => handleQuickAdd(item, e)}
                          className="px-3.5 py-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#382D25] text-[#382D25] hover:text-white border border-[#C5A46D] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
