"use client";

import React, { useState, useEffect } from "react";
import { 
  UtensilsCrossed, PlusCircle, Search, Filter, 
  Check, X, AlertTriangle, EyeOff, Sparkles, Clock
} from "lucide-react";

interface MenuItemAdmin {
  id: string;
  name: string;
  category: string;
  type: "FOOD" | "BEVERAGE";
  price: number;
  is_veg: boolean;
  is_available: boolean;
  prep_time_minutes: number;
  description: string;
}

const INITIAL_MENU: MenuItemAdmin[] = [
  {
    id: "item-1",
    name: "Charcoal Kalmi Kebab",
    category: "Starters",
    type: "FOOD",
    price: 440,
    is_veg: false,
    is_available: true,
    prep_time_minutes: 18,
    description: "Tender chicken drumsticks steeped in roasted gram flour, hung curd and Kashmiri saffron."
  },
  {
    id: "item-2",
    name: "Old Delhi Butter Chicken",
    category: "Main Course",
    type: "FOOD",
    price: 490,
    is_veg: false,
    is_available: true,
    prep_time_minutes: 20,
    description: "Smoked tandoori boneless chicken in a velvety San Marzano tomato gravy with churned butter."
  },
  {
    id: "item-3",
    name: "KICK BUNK 24-Hour Dal Makhani",
    category: "Main Course",
    type: "FOOD",
    price: 375,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 12,
    description: "Slow-simmered black lentils cooked overnight on tandoor embers with churned white butter."
  },
  {
    id: "item-4",
    name: "Truffle Malai Paneer Tikka",
    category: "Starters",
    type: "FOOD",
    price: 420,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 15,
    description: "Organic cottage cheese cubes infused with aromatic cardamom cream and Italian white truffle oil."
  },
  {
    id: "item-5",
    name: "Awadhi Gosht Dum Biryani",
    category: "Rice & Biryani",
    type: "FOOD",
    price: 590,
    is_veg: false,
    is_available: false, // 86'd
    prep_time_minutes: 25,
    description: "Prime mountain mutton cuts layered with aged Daawat Gold Basmati in a sealed earthen pot."
  },
  {
    id: "item-6",
    name: "Smoked Bourbon Old Fashioned",
    category: "Craft Cocktails",
    type: "BEVERAGE",
    price: 580,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5,
    description: "Buffalo Trace Bourbon, Angostura aromatic bitters, brown sugar cube, finished with oak smoke."
  },
  {
    id: "item-7",
    name: "Glenfiddich 12 Yrs Speyside (30ml Peg)",
    category: "Single Malt",
    type: "BEVERAGE",
    price: 650,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 3,
    description: "Signature Speyside single malt whisky with notes of fresh pear and subtle oak."
  },
  {
    id: "item-8",
    name: "The Macallan 12 Yrs Sherry Oak (30ml)",
    category: "Single Malt",
    type: "BEVERAGE",
    price: 950,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 3,
    description: "Matured exclusively in hand-picked Oloroso sherry seasoned oak casks from Jerez, Spain."
  },
  {
    id: "item-9",
    name: "Botanical Gin & Tonic (Bombay Sapphire)",
    category: "Craft Cocktails",
    type: "BEVERAGE",
    price: 480,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 4,
    description: "Vapour-infused gin paired with artisan elderflower tonic and dehydrated citrus wheel."
  },
  {
    id: "item-10",
    name: "Chur-Chur Garlic Naan",
    category: "Breads",
    type: "FOOD",
    price: 110,
    is_veg: true,
    is_available: true,
    prep_time_minutes: 8,
    description: "Multi-layered flaky bread stuffed with roasted garlic cloves and brushed with clarified ghee."
  }
];

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItemAdmin[]>(INITIAL_MENU);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "FOOD" | "BEVERAGE">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [toastMsg, setToastMsg] = useState("");

  const toggleAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.is_available;
        setToastMsg(`${item.name} is now ${nextState ? "ACTIVE on menus" : "86'd / OUT OF STOCK"}`);
        setTimeout(() => setToastMsg(""), 3500);
        return { ...item, is_available: nextState };
      }
      return item;
    }));
  };

  const categories = ["ALL", ...Array.from(new Set(menuItems.map(m => m.category)))];

  const filtered = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalFood = menuItems.filter(i => i.type === "FOOD").length;
  const totalBev = menuItems.filter(i => i.type === "BEVERAGE").length;
  const eightysixed = menuItems.filter(i => !i.is_available).length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E7DFD3] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[#B66A4B] font-bold flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4 text-[#C5A46D]" /> Centralized Menu & Stock Availability
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#382D25] mt-1">
            Central Menu & Availability Control
          </h1>
          <p className="text-xs text-[#77716A] mt-0.5">
            Real-time catalog pricing, prep timing, and instant 86&#39;d out-of-stock sync across Mobile Apps and QR Web.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Total Menu Items</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#382D25]">{menuItems.length}</span>
            <span className="text-xs font-semibold text-[#B66A4B] bg-[#FAF8F2] px-2 py-0.5 rounded-md border border-[#E7DFD3]">Active Catalog</span>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Kitchen Dishes</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#382D25]">{totalFood}</span>
            <span className="text-xs font-semibold text-[#B66A4B] bg-[#FAF8F2] px-2 py-0.5 rounded-md border border-[#E7DFD3]">KOT Routed</span>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Bar Offerings</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#382D25]">{totalBev}</span>
            <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Bar Dispense</span>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">86&#39;d / Out of Stock</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-rose-600">{eightysixed}</span>
            <span className="text-xs font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200">Hidden from Guests</span>
          </div>
        </div>
      </div>

      {/* 3. Search and Filters */}
      <div className="bg-white border border-[#E7DFD3] rounded-3xl p-5 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#77716A] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search dish, cocktail, or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF8F2] border border-[#E7DFD3] text-[#382D25] text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <div className="flex bg-[#F0E9DC]/60 p-1 rounded-2xl border border-[#C5A46D]/30 shrink-0">
            <button
              onClick={() => setTypeFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${typeFilter === "ALL" ? "bg-[#382D25] text-white shadow-sm" : "text-[#77716A] hover:text-[#382D25]"}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter("FOOD")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${typeFilter === "FOOD" ? "bg-[#382D25] text-white shadow-sm" : "text-[#77716A] hover:text-[#382D25]"}`}
            >
              Food
            </button>
            <button
              onClick={() => setTypeFilter("BEVERAGE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${typeFilter === "BEVERAGE" ? "bg-[#382D25] text-white shadow-sm" : "text-[#77716A] hover:text-[#382D25]"}`}
            >
              Bar
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat 
                    ? "bg-[#382D25] text-white shadow-sm" 
                    : "bg-[#FAF8F2] text-[#77716A] hover:text-[#382D25] border border-[#E7DFD3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Menu Items Table */}
      <div className="bg-white border border-[#E7DFD3] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F2] text-[#77716A] uppercase tracking-wider border-b border-[#E7DFD3]">
              <tr>
                <th className="py-3.5 px-5 font-bold">Item Details</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold text-center">Type</th>
                <th className="py-3.5 px-4 font-bold text-center">Dietary</th>
                <th className="py-3.5 px-4 font-bold text-center">Prep Time</th>
                <th className="py-3.5 px-4 font-bold text-right">Price</th>
                <th className="py-3.5 px-4 font-bold text-center">Guest Visibility</th>
                <th className="py-3.5 px-5 font-bold text-right">86&#39;d Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFD3]">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-4 px-5 max-w-xs">
                    <div className="font-serif font-bold text-[#382D25] text-sm">{item.name}</div>
                    <div className="text-[11px] text-[#77716A] line-clamp-1 mt-0.5">{item.description}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FAF8F2] border border-[#E7DFD3] text-[#B66A4B] text-xs font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.type === "FOOD" 
                        ? "bg-amber-50 text-amber-800 border border-amber-200" 
                        : "bg-blue-50 text-blue-800 border border-blue-200"
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {item.is_veg ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> VEG
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> NON-VEG
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center text-[#77716A]">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#B66A4B]" /> {item.prep_time_minutes}m
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-serif font-bold text-[#382D25] text-base">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {item.is_available ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" /> ONLINE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <EyeOff className="w-3 h-3 text-rose-600" /> 86&#39;D (OFFLINE)
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        item.is_available 
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300" 
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {item.is_available ? "86 This Dish" : "Restore to Menu"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
