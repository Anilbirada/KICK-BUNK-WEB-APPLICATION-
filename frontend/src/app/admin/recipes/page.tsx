"use client";

import React, { useState, useEffect } from "react";
import { 
  ChefHat, Percent, DollarSign, TrendingUp, 
  Layers, Search, Eye, Sparkles, AlertCircle, ArrowUpRight, X
} from "lucide-react";

interface Ingredient {
  name: string;
  quantity: string;
  cost: number;
}

interface Recipe {
  id: string;
  menu_item_name: string;
  category: string;
  food_cost: number;
  selling_price: number;
  gross_margin_percent: number;
  yield: string;
  ingredients: Ingredient[];
}

const FALLBACK_RECIPES: Recipe[] = [
  {
    id: "rec-1",
    menu_item_name: "Charcoal Kalmi Kebab",
    category: "Starters",
    food_cost: 124.0,
    selling_price: 440.0,
    gross_margin_percent: 71.8,
    yield: "1 Portion (2 Pcs)",
    ingredients: [
      { name: "Fresh Chicken Drumsticks", quantity: "0.35 KG", cost: 84.0 },
      { name: "Hung Curd & Marinade Spices", quantity: "0.08 KG", cost: 22.0 },
      { name: "Amul Pure Desi Cow Ghee", quantity: "0.03 KG", cost: 18.0 }
    ]
  },
  {
    id: "rec-2",
    menu_item_name: "Old Delhi Butter Chicken",
    category: "Main Course",
    food_cost: 145.0,
    selling_price: 490.0,
    gross_margin_percent: 70.4,
    yield: "1 Handi Bowl (450g)",
    ingredients: [
      { name: "Boneless Chicken Thigh Tikka", quantity: "0.28 KG", cost: 72.0 },
      { name: "San Marzano Makhani Gravy", quantity: "0.25 L", cost: 38.0 },
      { name: "Heavy Dairy Cream & White Butter", quantity: "0.06 KG", cost: 35.0 }
    ]
  },
  {
    id: "rec-3",
    menu_item_name: "KICK BUNK 24-Hour Dal Makhani",
    category: "Main Course",
    food_cost: 68.0,
    selling_price: 375.0,
    gross_margin_percent: 81.8,
    yield: "1 Handi Bowl (400g)",
    ingredients: [
      { name: "Whole Black Urad Lentils", quantity: "0.15 KG", cost: 21.75 },
      { name: "White Butter & Cow Cream", quantity: "0.06 KG", cost: 34.0 },
      { name: "Tomato Reduction & Spices", quantity: "0.10 KG", cost: 12.25 }
    ]
  },
  {
    id: "rec-4",
    menu_item_name: "Smoked Bourbon Old Fashioned",
    category: "Craft Cocktails",
    food_cost: 142.0,
    selling_price: 580.0,
    gross_margin_percent: 75.5,
    yield: "1 Cocktail (180ml)",
    ingredients: [
      { name: "Buffalo Trace Bourbon", quantity: "60 ml", cost: 116.0 },
      { name: "Angostura Bitters & Demerara", quantity: "1 Dash", cost: 16.0 },
      { name: "Hand-Carved Ice & Applewood Smoke", quantity: "1 Set", cost: 10.0 }
    ]
  },
  {
    id: "rec-5",
    menu_item_name: "Glenfiddich 12 Yrs Speyside (30ml Peg)",
    category: "Single Malt",
    food_cost: 152.0,
    selling_price: 650.0,
    gross_margin_percent: 76.6,
    yield: "1 Peg (30 ml)",
    ingredients: [
      { name: "Glenfiddich 12 Yrs Single Malt", quantity: "30 ml", cost: 152.0 }
    ]
  }
];

export default function RecipeCostingPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(FALLBACK_RECIPES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("http://localhost:8001/api/v1/admin/inventory/recipes");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setRecipes(data);
        }
      } catch {
        // fallback
      }
    };
    fetchRecipes();
  }, []);

  const filtered = recipes.filter(r => 
    r.menu_item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgMargin = Math.round(
    recipes.reduce((acc, r) => acc + r.gross_margin_percent, 0) / recipes.length
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E7DFD3] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[#B66A4B] font-bold flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-[#C5A46D]" /> Culinary Engineering & Cost Control
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#382D25] mt-1">
            Recipe Engineering & Food Costing
          </h1>
          <p className="text-xs text-[#77716A] mt-0.5">
            Ingredient consumption mapping, portion costing, gross margin targets, and automated stock deductions.
          </p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Engineered Recipes</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#382D25]">{recipes.length}</span>
            <span className="text-xs font-semibold text-[#B66A4B] bg-[#FAF8F2] px-2 py-0.5 rounded-md border border-[#E7DFD3]">Active Cost Cards</span>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Average Gross Margin</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-emerald-700">{avgMargin}%</span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Target &gt;70%</span>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Average Food Cost %</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#382D25]">{100 - avgMargin}%</span>
            <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Benchmark &lt;30%</span>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Auto-Deduction Engine</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-bold text-emerald-700">ACTIVE</span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">KOT Triggered</span>
          </div>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-white border border-[#E7DFD3] rounded-3xl p-5 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#77716A] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search engineered recipe or dish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF8F2] border border-[#E7DFD3] text-[#382D25] text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#C5A46D]"
          />
        </div>
      </div>

      {/* 4. Recipes Table */}
      <div className="bg-white border border-[#E7DFD3] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F2] text-[#77716A] uppercase tracking-wider border-b border-[#E7DFD3]">
              <tr>
                <th className="py-3.5 px-5 font-bold">Recipe Name</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Yield</th>
                <th className="py-3.5 px-4 font-bold text-right">Food / Beverage Cost</th>
                <th className="py-3.5 px-4 font-bold text-right">Selling Price</th>
                <th className="py-3.5 px-4 font-bold text-center">Cost %</th>
                <th className="py-3.5 px-4 font-bold text-center">Gross Margin %</th>
                <th className="py-3.5 px-5 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFD3]">
              {filtered.map(r => {
                const costPercent = Math.round((r.food_cost / r.selling_price) * 100);
                return (
                  <tr key={r.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-4 px-5 font-serif font-bold text-[#382D25] text-sm">
                      {r.menu_item_name}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#FAF8F2] border border-[#E7DFD3] text-[#B66A4B] text-xs font-semibold">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#77716A] font-medium">
                      {r.yield}
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-[#382D25]">
                      ₹{r.food_cost.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-serif font-bold text-[#382D25] text-sm">
                      ₹{r.selling_price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono text-[#382D25] font-bold text-xs bg-[#FAF8F2] px-2 py-0.5 rounded border border-[#E7DFD3]">{costPercent}%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {r.gross_margin_percent}%
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedRecipe(r)}
                        className="px-3.5 py-1.5 bg-[#FAF8F2] hover:bg-[#382D25] text-[#382D25] hover:text-white border border-[#C5A46D] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#B66A4B]" /> View Breakdown
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Recipe Breakdown Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#C5A46D] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B66A4B] font-bold">Standard Cost Sheet</span>
                <h3 className="font-serif text-2xl font-bold text-[#382D25]">{selectedRecipe.menu_item_name}</h3>
                <p className="text-xs text-[#77716A] mt-0.5">Yield: {selectedRecipe.yield}</p>
              </div>
              <button 
                onClick={() => setSelectedRecipe(null)} 
                className="w-8 h-8 rounded-full bg-[#F0E9DC] text-[#382D25] flex items-center justify-center hover:bg-[#C5A46D] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#E7DFD3] text-center shadow-sm">
                <div>
                  <p className="text-[10px] text-[#77716A] uppercase font-bold tracking-wider">Food Cost</p>
                  <p className="font-serif text-base font-bold text-[#382D25] mt-0.5">₹{selectedRecipe.food_cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#77716A] uppercase font-bold tracking-wider">Menu Price</p>
                  <p className="font-serif text-base font-bold text-[#B66A4B] mt-0.5">₹{selectedRecipe.selling_price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#77716A] uppercase font-bold tracking-wider">Gross Margin</p>
                  <p className="font-serif text-base font-bold text-emerald-700 mt-0.5">{selectedRecipe.gross_margin_percent}%</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-[#382D25] mb-2">Configured Raw Ingredients</p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E7DFD3] text-xs">
                      <div>
                        <p className="text-[#382D25] font-bold">{ing.name}</p>
                        <p className="text-[11px] text-[#77716A]">Consumption: {ing.quantity}</p>
                      </div>
                      <span className="font-serif font-bold text-[#B66A4B] text-sm">₹{ing.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E7DFD3]">
              <span className="text-[11px] text-[#77716A]">Auto-deducts from stock on KOT order acceptance</span>
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="px-5 py-2.5 bg-[#382D25] text-white font-bold rounded-full text-xs uppercase tracking-wider hover:bg-[#B66A4B] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
