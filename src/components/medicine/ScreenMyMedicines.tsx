import React, { useState } from "react";
import {
  Search,
  Plus,
  Pill,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  PackagePlus,
  Share2
} from "lucide-react";
import { MedicineItemModel, MedicineTab } from "./types";

interface ScreenMyMedicinesProps {
  medicines: MedicineItemModel[];
  onNavigate: (tab: MedicineTab) => void;
  onOpenAddModal: () => void;
  onEditMedicine: (med: MedicineItemModel) => void;
  onDeleteMedicine: (id: string) => void;
  onRefillMedicine: (med: MedicineItemModel) => void;
}

export const ScreenMyMedicines: React.FC<ScreenMyMedicinesProps> = ({
  medicines,
  onNavigate,
  onOpenAddModal,
  onEditMedicine,
  onDeleteMedicine,
  onRefillMedicine
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "Expired">("All");

  const activeCount = medicines.filter((m) => m.status === "Active").length;
  const inactiveCount = medicines.filter((m) => m.status === "Inactive").length;
  const expiredCount = medicines.filter((m) => m.status === "Expired").length;

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.brandName && m.brandName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.purpose && m.purpose.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.activeIngredient && m.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      statusFilter === "All" ? true : m.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* 1. Header with Add Medicine and Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medicine</span>
        </button>

        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines, salts, brands..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-orange-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2. Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { label: "All", count: medicines.length },
          { label: "Active", count: activeCount },
          { label: "Inactive", count: inactiveCount },
          { label: "Expired", count: expiredCount }
        ].map((f) => (
          <button
            key={f.label}
            onClick={() => setStatusFilter(f.label as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === f.label
                ? "bg-slate-900 text-white shadow-2xs scale-105"
                : "bg-white text-slate-600 hover:bg-orange-50 border border-orange-100"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* 3. Medicine Cards List */}
      {filteredMedicines.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-orange-100 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A36] mx-auto flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No medicines found</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Try adjusting your search filters or tap the Add Medicine button to register a new prescription.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-[#FF5A36] text-white text-xs font-bold rounded-2xl"
          >
            Add New Medicine
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMedicines.map((med) => {
            const isLowStock = med.remainingStock <= med.lowStockThreshold;

            return (
              <div
                key={med.id}
                className="bg-white border border-orange-100/90 hover:border-orange-300 rounded-3xl p-4 sm:p-4.5 transition-all shadow-2xs hover:shadow-xs group relative"
              >
                <div className="flex items-start sm:items-center justify-between gap-3">
                  {/* Left: Thumbnail & Medicine Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/60 border border-orange-200/70 flex items-center justify-center text-[#FF5A36] flex-shrink-0 overflow-hidden">
                      {med.image ? (
                        <img
                          src={med.image}
                          alt={med.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Pill className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                          {med.name} <span className="text-xs font-semibold text-slate-600">({med.strength})</span>
                        </h3>
                        {med.status === "Active" ? (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Active
                          </span>
                        ) : med.status === "Expired" ? (
                          <span className="px-2 py-0.2 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                            Expired
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                        <span>{med.type}</span>
                        <span>•</span>
                        <span>{med.dosesPerDay}x Daily</span>
                        {med.purpose && (
                          <>
                            <span>•</span>
                            <span className="text-orange-700 font-medium">{med.purpose}</span>
                          </>
                        )}
                      </div>

                      {med.prescribingDoctor && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Prescribed by: <strong className="text-slate-600 font-medium">{med.prescribingDoctor}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Stock Badge & Fast Action */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold shadow-2xs ${
                          isLowStock
                            ? "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                            : "bg-orange-50 text-slate-700 border border-orange-200/60"
                        }`}
                      >
                        {med.remainingStock} left
                      </span>
                      {isLowStock && (
                        <div className="text-[10px] font-bold text-red-500 mt-0.5 flex items-center justify-end gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onRefillMedicine(med)}
                        title="Refill stock"
                        className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] flex items-center justify-center transition-colors border border-orange-200/60"
                      >
                        <PackagePlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditMedicine(med)}
                        title="Edit medicine"
                        className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors border border-slate-200/60"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${med.name}?`)) {
                            onDeleteMedicine(med.id);
                          }
                        }}
                        title="Delete medicine"
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors border border-red-200/60"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
