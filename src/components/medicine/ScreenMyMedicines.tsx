import React, { useState } from "react";
import {
  Search,
  Plus,
  Pill,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eye,
  Check,
  Edit2,
  Trash2,
  Clock
} from "lucide-react";
import { MedicineItemModel, MedicineTab } from "./types";

interface ScreenMyMedicinesProps {
  medicines: MedicineItemModel[];
  onNavigate: (tab: MedicineTab, params?: any) => void;
  onOpenAddModal: () => void;
  onEditMedicine: (med: MedicineItemModel) => void;
  onDeleteMedicine: (id: string) => void;
  onRefillMedicine: (med: MedicineItemModel) => void;
  onViewMedicineDetail: (med: MedicineItemModel) => void;
  onQuickLogDose: (med: MedicineItemModel) => void;
}

export const ScreenMyMedicines: React.FC<ScreenMyMedicinesProps> = ({
  medicines,
  onNavigate,
  onOpenAddModal,
  onEditMedicine,
  onDeleteMedicine,
  onRefillMedicine,
  onViewMedicineDetail,
  onQuickLogDose
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Low Stock" | "Expiring">("All");

  const activeCount = medicines.filter((m) => m.status === "Active").length;
  const lowStockCount = medicines.filter((m) => m.remainingStock <= m.lowStockThreshold).length;
  const expiringCount = medicines.filter((m) => {
    if (!m.prescriptionExpiryDate) return false;
    const exp = new Date(m.prescriptionExpiryDate).getTime();
    const now = new Date().getTime();
    const diffDays = (exp - now) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 45;
  }).length;

  const filteredMedicines = medicines.filter((m) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      m.name.toLowerCase().includes(query) ||
      (m.brandName && m.brandName.toLowerCase().includes(query)) ||
      (m.purpose && m.purpose.toLowerCase().includes(query)) ||
      (m.activeIngredient && m.activeIngredient.toLowerCase().includes(query));

    let matchesFilter = true;
    if (statusFilter === "Active") {
      matchesFilter = m.status === "Active";
    } else if (statusFilter === "Low Stock") {
      matchesFilter = m.remainingStock <= m.lowStockThreshold;
    } else if (statusFilter === "Expiring") {
      if (!m.prescriptionExpiryDate) matchesFilter = false;
      else {
        const exp = new Date(m.prescriptionExpiryDate).getTime();
        const now = new Date().getTime();
        const diffDays = (exp - now) / (1000 * 3600 * 24);
        matchesFilter = diffDays >= 0 && diffDays <= 45;
      }
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search medicines, salts, brands..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D1D5DB] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 rounded-2xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8A8A8A] shadow-2xs outline-none transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8A8A8A] hover:text-[#1A1A1A]"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { id: "All", label: "All", count: medicines.length },
          { id: "Active", label: "Active", count: activeCount },
          { id: "Low Stock", label: "Low Stock", count: lowStockCount },
          { id: "Expiring", label: "Expiring", count: expiringCount }
        ].map((f) => {
          const isActive = statusFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#6C3CE1] text-white shadow-xs"
                  : "bg-white text-[#6C3CE1] border border-[#6C3CE1]/40 hover:bg-[#F3F0FF]"
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F3F0FF] text-[#6C3CE1]"
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Quick Stats (2 cards side by side) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center font-black shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider block">
              Active Meds
            </span>
            <span className="text-xl font-black text-[#1A1A1A]">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3F0FF] text-[#F39C12] flex items-center justify-center font-black shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider block">
              Low Stock
            </span>
            <span className="text-xl font-black text-[#F39C12]">{lowStockCount}</span>
          </div>
        </div>
      </div>

      {/* 4. Medicines List */}
      <div className="space-y-3">
        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#D1D5DB]/80 text-center space-y-3">
            <p className="text-sm font-bold text-[#8A8A8A]">
              No medicines found matching "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-[#6C3CE1] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              + Add New Medicine
            </button>
          </div>
        ) : (
          filteredMedicines.map((med) => {
            const isLowStock = med.remainingStock <= med.lowStockThreshold;
            const stockPercent = Math.min(
              100,
              Math.round((med.remainingStock / (med.totalPrescribed || 30)) * 100)
            );

            return (
              <div
                key={med.id}
                className="bg-white rounded-2xl p-4 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3 hover:border-[#6C3CE1]/50 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#F3F0FF] border border-[#8B6CE6]/20 text-[#6C3CE1] flex items-center justify-center text-xl shrink-0">
                      💊
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] truncate">
                          {med.name}
                        </h3>
                        <span className="text-xs font-bold text-[#6C3CE1] bg-[#F3F0FF] px-2 py-0.5 rounded-md">
                          {med.strength}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A4A4A] truncate mt-0.5">
                        {med.purpose || med.type} • {med.dosesPerDay}x daily ({med.doseTimes?.join(", ")})
                      </p>
                    </div>
                  </div>

                  {/* Status Tag */}
                  {isLowStock ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F39C12] text-white text-[10px] font-extrabold uppercase shrink-0 shadow-2xs">
                      ⚠️ Low Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2ECC71] text-white text-[10px] font-extrabold uppercase shrink-0 shadow-2xs">
                      ✅ Active
                    </span>
                  )}
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-1 bg-[#F5F5F5] p-2.5 rounded-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#4A4A4A]">
                      Stock: <strong className="text-[#1A1A1A]">{med.remainingStock} left</strong>
                    </span>
                    <span className="text-[11px] text-[#8A8A8A]">
                      {med.totalPrescribed} Prescribed
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#D1D5DB]/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLowStock ? "bg-[#F39C12]" : "bg-[#6C3CE1]"
                      }`}
                      style={{ width: `${Math.max(5, stockPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Actions: [✅ Log] and [📊 View] */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#D1D5DB]/40">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditMedicine(med)}
                      className="p-2 rounded-xl text-[#8A8A8A] hover:text-[#6C3CE1] hover:bg-[#F3F0FF] transition-colors"
                      title="Edit Medicine"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteMedicine(med.id)}
                      className="p-2 rounded-xl text-[#8A8A8A] hover:text-[#E74C3C] hover:bg-red-50 transition-colors"
                      title="Delete Medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onQuickLogDose(med)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2ECC71] hover:bg-emerald-600 active:scale-95 text-white text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Log</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewMedicineDetail(med)}
                      className="px-4 py-1.5 rounded-xl bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={onOpenAddModal}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-90 text-white shadow-xl shadow-purple-900/30 flex items-center justify-center transition-all cursor-pointer z-40 border-2 border-white"
        title="Add New Medicine"
        aria-label="Add Medicine"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
