import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  Pill,
  Calendar,
  Clock,
  ShoppingCart,
  Plus,
  Minus,
  Edit2,
  CheckCircle2,
  Phone,
  Truck,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { MedicineItemModel, MedicineTab } from "./types";

interface ScreenRefillInventoryProps {
  medicines: MedicineItemModel[];
  onUpdateStock: (medId: string, newStock: number) => void;
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenRefillInventory: React.FC<ScreenRefillInventoryProps> = ({
  medicines,
  onUpdateStock,
  onNavigate
}) => {
  const [selectedMedId, setSelectedMedId] = useState<string>(medicines[0]?.id || "");
  const [refillOrderSuccess, setRefillOrderSuccess] = useState<boolean>(false);
  const [isEditingThreshold, setIsEditingThreshold] = useState<boolean>(false);
  const [customThreshold, setCustomThreshold] = useState<number>(10);

  const selectedMed = medicines.find((m) => m.id === selectedMedId) || medicines[0];

  if (!selectedMed) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-[#D1D5DB]/80 text-center space-y-2">
        <p className="text-xs text-[#8A8A8A]">No medicines available in inventory.</p>
      </div>
    );
  }

  const consumed = Math.max(0, selectedMed.totalPrescribed - selectedMed.remainingStock);
  const isLowStock = selectedMed.remainingStock <= selectedMed.lowStockThreshold;

  const handleSimulateRefillOrder = () => {
    setRefillOrderSuccess(true);
    setTimeout(() => {
      onUpdateStock(selectedMed.id, selectedMed.remainingStock + 30);
      setRefillOrderSuccess(false);
      alert(`Refill order of 30 units for ${selectedMed.name} placed successfully! Stock refreshed.`);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-20">
      {/* 1. Medicine Switcher Dropdown */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)]">
        <label className="block text-[11px] font-black uppercase tracking-wider text-[#6C3CE1] mb-1.5">
          Select Medication
        </label>
        <select
          value={selectedMed.id}
          onChange={(e) => setSelectedMedId(e.target.value)}
          className="w-full p-2.5 bg-[#F3F0FF] border border-[#8B6CE6]/40 rounded-xl text-xs sm:text-sm font-black text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#6C3CE1]/30 cursor-pointer"
        >
          {medicines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.strength}) — {m.remainingStock} left {m.remainingStock <= m.lowStockThreshold ? "⚠️ LOW" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Top Summary Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F3F0FF] border border-[#8B6CE6]/30 text-[#6C3CE1] flex items-center justify-center text-2xl font-black">
              💊
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                {selectedMed.name}
              </h3>
              <p className="text-xs text-[#4A4A4A]">
                {selectedMed.strength} • {selectedMed.type}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
              isLowStock
                ? "bg-[#F39C12] text-white animate-bounce"
                : "bg-[#2ECC71] text-white"
            }`}
          >
            {isLowStock ? "⚠️ Refill Soon" : "✅ Stock OK"}
          </span>
        </div>

        {/* Stock Level Counter */}
        <div className="bg-[#F5F5F5] p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#8A8A8A] uppercase block">
                Units Left in Stock
              </span>
              <span className="text-3xl font-black text-[#1A1A1A]">
                {selectedMed.remainingStock}
              </span>
              <span className="text-xs text-[#8A8A8A] font-semibold ml-1.5">
                / {selectedMed.totalPrescribed} total
              </span>
            </div>

            {/* Quick +/- Stock adjustment */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateStock(
                    selectedMed.id,
                    Math.max(0, selectedMed.remainingStock - 1)
                  )
                }
                className="w-8 h-8 rounded-xl bg-white hover:bg-red-50 text-[#E74C3C] border border-[#D1D5DB] flex items-center justify-center font-bold text-base cursor-pointer"
                title="Subtract 1"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateStock(selectedMed.id, selectedMed.remainingStock + 1)
                }
                className="w-8 h-8 rounded-xl bg-white hover:bg-emerald-50 text-[#2ECC71] border border-[#D1D5DB] flex items-center justify-center font-bold text-base cursor-pointer"
                title="Add 1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Stock Bar */}
          <div className="w-full h-3 bg-[#D1D5DB]/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isLowStock ? "bg-[#F39C12]" : "bg-[#6C3CE1]"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    5,
                    (selectedMed.remainingStock / (selectedMed.totalPrescribed || 30)) * 100
                  )
                )}%`
              }}
            />
          </div>
        </div>

        {/* Refill Button */}
        <button
          type="button"
          onClick={handleSimulateRefillOrder}
          disabled={refillOrderSuccess}
          className="w-full py-3.5 px-4 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-purple-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {refillOrderSuccess ? "Ordering from Pharmacy..." : `🛒 Order 30-Day Refill for ${selectedMed.name}`}
          </span>
        </button>
      </div>

      {/* 3. Pharmacy & Auto-Refill Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#6C3CE1]">
          Partner Pharmacy & Delivery
        </h4>
        <div className="flex items-center justify-between gap-3 p-3 bg-[#F3F0FF] rounded-xl border border-[#8B6CE6]/30">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#6C3CE1]" />
            <div>
              <h5 className="text-xs font-black text-[#1A1A1A]">
                Norvic Express Meds Delivery
              </h5>
              <p className="text-[11px] text-[#4A1FAD]">
                Instant doorstep delivery within 2 hours
              </p>
            </div>
          </div>
          <a
            href="tel:+9779801234567"
            className="px-3 py-1.5 rounded-xl bg-[#6C3CE1] text-white text-xs font-bold shadow-xs hover:bg-[#4A1FAD] transition-colors"
          >
            Call
          </a>
        </div>
      </div>
    </div>
  );
};
