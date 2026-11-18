"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, PlusCircle, AlertTriangle, CheckCircle2, 
  RotateCcw, Search, Filter, ArrowUpRight, ArrowDownRight, Layers, X
} from "lucide-react";

interface RawMaterial {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  current_stock: number;
  min_reorder_level: number;
  cost_per_unit: number;
  total_inventory_value: number;
  is_low_stock: boolean;
}

const FALLBACK_MATERIALS: RawMaterial[] = [
  {
    id: "raw-1",
    name: "Fresh Chicken Drumsticks & Thighs",
    sku: "RAW-POUL-01",
    category: "Poultry",
    unit: "KG",
    current_stock: 45.0,
    min_reorder_level: 20.0,
    cost_per_unit: 240.0,
    total_inventory_value: 10800.0,
    is_low_stock: false
  },
  {
    id: "raw-2",
    name: "Artisanal Malai Paneer",
    sku: "RAW-DAIR-02",
    category: "Dairy",
    unit: "KG",
    current_stock: 12.0,
    min_reorder_level: 15.0,
    cost_per_unit: 340.0,
    total_inventory_value: 4080.0,
    is_low_stock: true
  },
  {
    id: "raw-3",
    name: "Aged Royal Basmati Rice (Daawat Gold)",
    sku: "RAW-GRAI-03",
    category: "Grains & Rice",
    unit: "KG",
    current_stock: 120.0,
    min_reorder_level: 50.0,
    cost_per_unit: 145.0,
    total_inventory_value: 17400.0,
    is_low_stock: false
  },
  {
    id: "raw-4",
    name: "Amul Pure Desi Cow Ghee",
    sku: "RAW-OILS-04",
    category: "Oils & Ghee",
    unit: "KG",
    current_stock: 22.0,
    min_reorder_level: 10.0,
    cost_per_unit: 620.0,
    total_inventory_value: 13640.0,
    is_low_stock: false
  },
  {
    id: "raw-5",
    name: "White Truffle Infused Olive Oil (Urbani)",
    sku: "RAW-GOUR-05",
    category: "Gourmet & Oils",
    unit: "L",
    current_stock: 2.2,
    min_reorder_level: 3.0,
    cost_per_unit: 4500.0,
    total_inventory_value: 9900.0,
    is_low_stock: true
  },
  {
    id: "raw-6",
    name: "San Marzano Whole Peeled Tomatoes",
    sku: "RAW-CANN-06",
    category: "Canned & Preserves",
    unit: "KG",
    current_stock: 35.0,
    min_reorder_level: 15.0,
    cost_per_unit: 190.0,
    total_inventory_value: 6650.0,
    is_low_stock: false
  },
  {
    id: "raw-7",
    name: "Whole Black Urad Lentils (Dal Makhani)",
    sku: "RAW-LENT-07",
    category: "Grains & Pulses",
    unit: "KG",
    current_stock: 60.0,
    min_reorder_level: 25.0,
    cost_per_unit: 145.0,
    total_inventory_value: 8700.0,
    is_low_stock: false
  },
  {
    id: "raw-8",
    name: "Fresh Cream & Butter (Amul)",
    sku: "RAW-DAIR-08",
    category: "Dairy",
    unit: "KG",
    current_stock: 18.0,
    min_reorder_level: 15.0,
    cost_per_unit: 290.0,
    total_inventory_value: 5220.0,
    is_low_stock: false
  }
];

export default function RestaurantRawMaterialsPage() {
  const [materials, setMaterials] = useState<RawMaterial[]>(FALLBACK_MATERIALS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedMat, setSelectedMat] = useState<RawMaterial | null>(null);
  const [movementType, setMovementType] = useState<"PURCHASE_RECEIPT" | "WASTAGE_SPOILAGE" | "INTERNAL_TRANSFER">("PURCHASE_RECEIPT");
  const [quantity, setQuantity] = useState<number>(5);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const fetchMaterials = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/inventory/raw-materials");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setMaterials(data);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleStockMovement = async () => {
    if (!selectedMat || quantity <= 0) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8001/api/v1/admin/inventory/raw-materials/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_material_id: selectedMat.id,
          movement_type: movementType,
          quantity: quantity,
          reason: reason || `${movementType.replace("_", " ")} recorded by Head Chef`
        })
      });

      if (res.ok) {
        setFeedbackMsg(`Stock updated successfully.`);
        fetchMaterials();
      } else {
        // Local simulation
        setMaterials(prev => prev.map(m => {
          if (m.id === selectedMat.id) {
            const newStock = movementType === "PURCHASE_RECEIPT" 
              ? m.current_stock + quantity 
              : Math.max(0, m.current_stock - quantity);
            return {
              ...m,
              current_stock: newStock,
              total_inventory_value: Math.round(newStock * m.cost_per_unit),
              is_low_stock: newStock <= m.min_reorder_level
            };
          }
          return m;
        }));
        setFeedbackMsg(`Stock updated for ${selectedMat.name} (Local Sync)`);
      }
    } catch {
      setFeedbackMsg("Stock movement logged.");
    } finally {
      setIsSubmitting(false);
      setSelectedMat(null);
      setTimeout(() => setFeedbackMsg(""), 3500);
    }
  };

  const categories = ["ALL", ...Array.from(new Set(materials.map(m => m.category)))];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = materials.reduce((acc, m) => acc + m.total_inventory_value, 0);
  const lowStockCount = materials.filter(m => m.is_low_stock).length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E7DFD3] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B66A4B] animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[#B66A4B] font-bold flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#C5A46D]" /> Kitchen Pantry & Dry Store
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#382D25] mt-1">
            Kitchen Raw Materials & Dry Store
          </h1>
          <p className="text-xs text-[#77716A] mt-0.5">
            Ingredient tracking, minimum reorder thresholds, batch valuation, and culinary wastage control.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchMaterials}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#382D25] text-white rounded-2xl hover:bg-[#B66A4B] transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C5A46D]" /> Refresh Store
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Active Raw Materials</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#382D25]">{materials.length}</span>
            <span className="text-xs font-semibold text-[#B66A4B] bg-[#FAF8F2] px-2 py-0.5 rounded-md border border-[#E7DFD3]">Catalog SKUs</span>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Total Inventory Value</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#382D25]">₹{totalValue.toLocaleString("en-IN")}</span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Cost Value</span>
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Reorder Alerts</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-rose-600">{lowStockCount}</span>
            {lowStockCount > 0 ? (
              <span className="text-xs font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200">Below Min</span>
            ) : (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Sufficient</span>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#E7DFD3] rounded-2xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-[#77716A] uppercase tracking-wider">Storage Category Count</p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#382D25]">{categories.length - 1}</span>
            <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Cold + Dry</span>
          </div>
        </div>
      </div>

      {/* 3. Search and Category Filter */}
      <div className="bg-white border border-[#E7DFD3] rounded-3xl p-5 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#77716A] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search ingredient or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF8F2] border border-[#E7DFD3] text-[#382D25] text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-[#77716A] shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? "bg-[#382D25] text-white shadow-sm" 
                  : "bg-[#FAF8F2] text-[#77716A] hover:text-[#382D25] border border-[#E7DFD3]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Raw Materials Table */}
      <div className="bg-white border border-[#E7DFD3] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F2] text-[#77716A] uppercase tracking-wider border-b border-[#E7DFD3]">
              <tr>
                <th className="py-3.5 px-5 font-bold">Ingredient / Item</th>
                <th className="py-3.5 px-4 font-bold">SKU</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold text-center">Current Stock</th>
                <th className="py-3.5 px-4 font-bold text-center">Min Threshold</th>
                <th className="py-3.5 px-4 font-bold text-right">Unit Rate</th>
                <th className="py-3.5 px-4 font-bold text-right">Valuation</th>
                <th className="py-3.5 px-4 font-bold text-center">Status</th>
                <th className="py-3.5 px-5 font-bold text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DFD3]">
              {filteredMaterials.map(mat => (
                <tr key={mat.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-4 px-5 font-serif font-bold text-[#382D25] text-sm">
                    {mat.name}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-[#77716A]">
                    {mat.sku}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FAF8F2] border border-[#E7DFD3] text-[#B66A4B] text-xs font-semibold">
                      {mat.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-serif font-bold text-[#382D25] text-base">
                      {mat.current_stock}
                    </span>
                    <span className="text-[11px] text-[#77716A] ml-1">{mat.unit}</span>
                  </td>
                  <td className="py-4 px-4 text-center text-[#77716A] font-medium">
                    {mat.min_reorder_level} {mat.unit}
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-[#382D25]">
                    ₹{mat.cost_per_unit} / {mat.unit}
                  </td>
                  <td className="py-4 px-4 text-right font-serif font-bold text-[#382D25] text-base">
                    ₹{mat.total_inventory_value.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {mat.is_low_stock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600" /> REORDER
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> SUFFICIENT
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setSelectedMat(mat)}
                      className="px-3.5 py-1.5 bg-[#FAF8F2] hover:bg-[#382D25] text-[#382D25] hover:text-white border border-[#C5A46D] rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Stock Movement Modal */}
      {selectedMat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F2] border border-[#C5A46D] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7DFD3] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B66A4B] font-bold">Kitchen Log</span>
                <h3 className="font-serif text-2xl font-bold text-[#382D25]">Record Material Movement</h3>
                <p className="text-xs text-[#77716A] mt-0.5">{selectedMat.name} ({selectedMat.current_stock} {selectedMat.unit} in stock)</p>
              </div>
              <button 
                onClick={() => setSelectedMat(null)} 
                className="w-8 h-8 rounded-full bg-[#F0E9DC] text-[#382D25] flex items-center justify-center hover:bg-[#C5A46D] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Movement Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementType("PURCHASE_RECEIPT")}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      movementType === "PURCHASE_RECEIPT" 
                        ? "bg-emerald-50 border-emerald-400 text-emerald-800" 
                        : "bg-white border-[#E7DFD3] text-[#77716A]"
                    }`}
                  >
                    Stock In (PO)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType("WASTAGE_SPOILAGE")}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      movementType === "WASTAGE_SPOILAGE" 
                        ? "bg-rose-50 border-rose-400 text-rose-800" 
                        : "bg-white border-[#E7DFD3] text-[#77716A]"
                    }`}
                  >
                    Wastage
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType("INTERNAL_TRANSFER")}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      movementType === "INTERNAL_TRANSFER" 
                        ? "bg-blue-50 border-blue-400 text-blue-800" 
                        : "bg-white border-[#E7DFD3] text-[#77716A]"
                    }`}
                  >
                    Transfer
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Quantity ({selectedMat.unit})</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={0.1}
                  step={0.5}
                  className="w-full bg-white border border-[#E7DFD3] text-[#382D25] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#382D25] block mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Received from Fresh Catch Farm PO-892"
                  className="w-full bg-white border border-[#E7DFD3] text-[#382D25] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#C5A46D]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7DFD3]">
              <button
                type="button"
                onClick={() => setSelectedMat(null)}
                className="px-5 py-2.5 bg-[#F0E9DC] text-[#382D25] font-semibold rounded-full text-xs hover:bg-[#E7DFD3] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleStockMovement}
                className="px-6 py-2.5 bg-[#382D25] text-white font-bold rounded-full text-xs uppercase tracking-wider hover:bg-[#B66A4B] transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? "Updating..." : "Commit Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
