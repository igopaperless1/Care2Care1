import React from "react";
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Package,
  Edit2,
  RotateCcw,
  Check,
  X,
  Phone,
  Building,
  User,
  ChevronRight,
  Info
} from "lucide-react";
import { MedicineItemModel, DoseLogModel, MedicineTab } from "./types";

interface ScreenMedicineDetailProps {
  medicine: MedicineItemModel;
  todayDoses: DoseLogModel[];
  onNavigate: (tab: MedicineTab, params?: any) => void;
  onEditMedicine: (med: MedicineItemModel) => void;
  onQuickLogDose: (med: MedicineItemModel) => void;
  onQuickSnoozeDose?: (med: MedicineItemModel) => void;
  onQuickSkipDose?: (med: MedicineItemModel) => void;
}

export const ScreenMedicineDetail: React.FC<ScreenMedicineDetailProps> = ({
  medicine,
  todayDoses,
  onNavigate,
  onEditMedicine,
  onQuickLogDose,
  onQuickSnoozeDose,
  onQuickSkipDose
}) => {
  const isLowStock = medicine.remainingStock <= medicine.lowStockThreshold;
  const stockPercent = Math.min(
    100,
    Math.round((medicine.remainingStock / (medicine.totalPrescribed || 30)) * 100)
  );

  // Mock past 4 dosage histories
  const historyEntries = [
    { id: "h1", date: "Today", time: medicine.doseTimes[0] || "02:00 PM", status: "Taken", isSuccess: true },
    { id: "h2", date: "Yesterday", time: medicine.doseTimes[0] || "01:55 PM", status: "Taken", isSuccess: true },
    { id: "h3", date: "2 days ago", time: medicine.doseTimes[0] || "02:05 PM", status: "Taken", isSuccess: true },
    { id: "h4", date: "3 days ago", time: medicine.doseTimes[0] || "02:00 PM", status: "Missed", isSuccess: false }
  ];

  return (
    <div className="space-y-5 pb-20">
      {/* 1. Medicine Info Card (White with Purple border accent #6C3CE1) */}
      <section className="bg-white rounded-2xl p-5 border-2 border-[#6C3CE1]/30 shadow-[0px_2px_8px_rgba(108,60,225,0.10)] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] border border-[#8B6CE6]/30 text-[#6C3CE1] flex items-center justify-center text-2xl shrink-0">
              💊
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6C3CE1]">
                {medicine.purpose || "Prescription Medicine"}
              </span>
              <h2 className="text-xl font-black text-[#1A1A1A] truncate">
                {medicine.name}
              </h2>
              <p className="text-xs font-semibold text-[#4A4A4A]">
                {medicine.strength} • {medicine.brandName ? `Brand: ${medicine.brandName}` : medicine.type}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onEditMedicine(medicine)}
            className="p-2 rounded-xl bg-[#F3F0FF] text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white transition-colors"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="bg-[#F5F5F5] p-2.5 rounded-xl">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
              Dosage Form
            </span>
            <span className="text-xs font-black text-[#1A1A1A]">
              1 {medicine.type}
            </span>
          </div>

          <div className="bg-[#F5F5F5] p-2.5 rounded-xl">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
              Daily Schedule
            </span>
            <span className="text-xs font-black text-[#1A1A1A]">
              {medicine.dosesPerDay}x daily ({medicine.doseTimes?.join(", ")})
            </span>
          </div>

          <div className="bg-[#F5F5F5] p-2.5 rounded-xl">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
              Food Rule
            </span>
            <span className="text-xs font-black text-[#1A1A1A]">
              {medicine.foodRelation}
            </span>
          </div>

          <div className="bg-[#F5F5F5] p-2.5 rounded-xl">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
              Prescribed Doctor
            </span>
            <span className="text-xs font-black text-[#1A1A1A] truncate block">
              {medicine.prescribingDoctor || "Dr. Sandeep Shah"}
            </span>
          </div>

          <div className="bg-[#F5F5F5] p-2.5 rounded-xl">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
              Hospital / Clinic
            </span>
            <span className="text-xs font-black text-[#1A1A1A] truncate block">
              {medicine.hospitalClinic || "Norvic International"}
            </span>
          </div>

          <div className="bg-[#F5F5F5] p-2.5 rounded-xl">
            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
              Expires On
            </span>
            <span className="text-xs font-black text-[#1A1A1A]">
              {medicine.prescriptionExpiryDate || "2026-10-15"}
            </span>
          </div>
        </div>

        {/* Instructions Banner */}
        {medicine.instructions && (
          <div className="bg-[#F3F0FF] p-3 rounded-xl border border-[#8B6CE6]/30 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#6C3CE1] shrink-0 mt-0.5" />
            <p className="text-xs text-[#4A1FAD] font-medium leading-relaxed">
              <strong>Instructions:</strong> {medicine.instructions}
            </p>
          </div>
        )}

        {/* Stock Progress Bar in Purple */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-[#1A1A1A] flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#6C3CE1]" /> Stock Remaining: {medicine.remainingStock} {medicine.type}s left
            </span>
            <span className={`font-bold ${isLowStock ? "text-[#F39C12]" : "text-[#6C3CE1]"}`}>
              {isLowStock ? "⚠️ Low Stock Alert" : "✅ Stock Sufficient"}
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden border border-[#D1D5DB]/60">
            <div
              className={`h-full rounded-full transition-all ${
                isLowStock ? "bg-[#F39C12]" : "bg-[#6C3CE1]"
              }`}
              style={{ width: `${Math.max(5, stockPercent)}%` }}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ACTION BUTTONS: [✅ Log Dose] [⏰ Snooze] [⏭️ Skip] */}
      {/* ========================================================================= */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#4A4A4A] px-1">
          Active Dose Actions
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => onQuickLogDose(medicine)}
            className="py-3 px-2 bg-[#2ECC71] hover:bg-emerald-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Log Dose</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onQuickSnoozeDose) onQuickSnoozeDose(medicine);
              else alert("Dose snoozed for 15 minutes.");
            }}
            className="py-3 px-2 bg-[#F39C12] hover:bg-amber-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Clock className="w-4 h-4 stroke-[3]" />
            <span>Snooze</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onQuickSkipDose) onQuickSkipDose(medicine);
              else alert("Dose skipped for this slot.");
            }}
            className="py-3 px-2 bg-[#8A8A8A] hover:bg-stone-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>Skip</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DOSAGE HISTORY (Last 4 entries with status Green ✅ or Red ❌) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#1A1A1A]">
            📅 Recent Dosage History
          </h3>
          <span className="text-[11px] font-bold text-[#6C3CE1]">
            Last 4 doses
          </span>
        </div>

        <div className="divide-y divide-[#D1D5DB]/40">
          {historyEntries.map((entry) => (
            <div
              key={entry.id}
              className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{entry.isSuccess ? "✅" : "❌"}</span>
                <div>
                  <h4 className="text-xs font-black text-[#1A1A1A]">{entry.date}</h4>
                  <p className="text-[11px] text-[#4A4A4A]">{entry.time}</p>
                </div>
              </div>

              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  entry.isSuccess
                    ? "bg-emerald-50 text-[#2ECC71] border border-emerald-200"
                    : "bg-red-50 text-[#E74C3C] border border-red-200"
                }`}
              >
                {entry.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. QUICK LINKS / PURPLE CHIPS AT BOTTOM */}
      {/* ========================================================================= */}
      <section className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#4A4A4A] px-1">
          Related Services
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate("interactions_safety")}
            className="px-3.5 py-2 rounded-xl bg-[#F3F0FF] text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white text-xs font-bold transition-all border border-[#8B6CE6]/30 flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Check Drug Interactions</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("refill_inventory")}
            className="px-3.5 py-2 rounded-xl bg-[#F3F0FF] text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white text-xs font-bold transition-all border border-[#8B6CE6]/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order Refill ({medicine.remainingStock} left)</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("adherence_history")}
            className="px-3.5 py-2 rounded-xl bg-[#F3F0FF] text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white text-xs font-bold transition-all border border-[#8B6CE6]/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>21-Day Streak Calendar</span>
          </button>
        </div>
      </section>
    </div>
  );
};
