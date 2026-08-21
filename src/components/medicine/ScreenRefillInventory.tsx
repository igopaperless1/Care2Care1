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
  onNavigate: (tab: MedicineTab) => void;
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
      <div className="bg-white rounded-3xl p-8 border border-orange-100 text-center space-y-2">
        <p className="text-xs text-slate-500">No medicines available in inventory.</p>
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
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* 1. Medicine Switcher Pill Dropdown */}
      <div className="bg-white rounded-2xl p-3 border border-orange-100/90 shadow-2xs">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Select Medication
        </label>
        <select
          value={selectedMed.id}
          onChange={(e) => setSelectedMedId(e.target.value)}
          className="w-full p-2 bg-orange-50/60 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
        >
          {medicines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.strength}) — {m.remainingStock} left
            </option>
          ))}
        </select>
      </div>

      {/* 2. Top Summary Card with Pill Visual */}
      <div className="bg-white rounded-3xl p-5 border border-orange-100/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{selectedMed.name}</h3>
            <p className="text-xs text-slate-500 font-medium">
              {selectedMed.strength} • {selectedMed.type}
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF5A36] overflow-hidden">
            {selectedMed.image ? (
              <img
                src={selectedMed.image}
                alt={selectedMed.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <Pill className="w-7 h-7" />
            )}
          </div>
        </div>

        {/* Big Remaining Count */}
        <div className="bg-orange-50/60 border border-orange-200/80 rounded-2xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remaining Quantity</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {selectedMed.remainingStock} <span className="text-sm font-bold text-slate-600">{selectedMed.type}s</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateStock(selectedMed.id, Math.max(0, selectedMed.remainingStock - 1))}
              className="w-8 h-8 rounded-xl bg-white border border-orange-200 text-slate-700 font-bold flex items-center justify-center hover:bg-orange-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateStock(selectedMed.id, selectedMed.remainingStock + 1)}
              className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-bold flex items-center justify-center hover:bg-[#E04826]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Low Stock Warning Banner */}
        {isLowStock ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 animate-bounce" />
              <div>
                <div className="text-xs font-bold text-red-800">Low Stock Alert</div>
                <div className="text-[10px] text-red-600">Stock below {selectedMed.lowStockThreshold} units. Refill now!</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </div>
        ) : (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">Sufficient supply remaining</span>
          </div>
        )}

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Prescribed</div>
            <div className="text-base font-black text-slate-900 mt-0.5">{selectedMed.totalPrescribed} Units</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Consumed</div>
            <div className="text-base font-black text-slate-900 mt-0.5">{consumed} Units</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Remaining</div>
            <div className="text-base font-black text-[#FF5A36] mt-0.5">{selectedMed.remainingStock} Units</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
              <span>Low Threshold</span>
              <button
                onClick={() => {
                  const val = prompt("Enter new low stock threshold:", String(selectedMed.lowStockThreshold));
                  if (val && !isNaN(Number(val))) {
                    setCustomThreshold(Number(val));
                    alert(`Updated threshold to ${val} units.`);
                  }
                }}
                className="text-[#FF5A36] hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="text-base font-black text-slate-900 mt-0.5">{selectedMed.lowStockThreshold} Units</div>
          </div>
        </div>

        {/* Prescription Expiry Info */}
        <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">Prescription Valid Until</span>
            <span className="font-black text-slate-900">{selectedMed.prescriptionExpiryDate || "20 Jun 2026"}</span>
          </div>
          <div className="text-[11px] text-[#FF5A36] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> 30 days of supply left at current dosage
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleSimulateRefillOrder}
          disabled={refillOrderSuccess}
          className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {refillOrderSuccess ? (
            <>
              <Truck className="w-4 h-4 animate-bounce" />
              <span>Ordering Refill from Norvic Pharmacy...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Request Refill / Buy Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
