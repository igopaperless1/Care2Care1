import React from "react";
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  Camera,
  Heart,
  ChevronRight,
  TrendingUp,
  Package,
  BookOpen,
  ShieldCheck,
  Users
} from "lucide-react";
import { MedicineItemModel, DoseLogModel, MedicineTab } from "./types";

interface ScreenOverviewProps {
  medicines: MedicineItemModel[];
  todayDoses: DoseLogModel[];
  onNavigate: (tab: MedicineTab) => void;
  onOpenDoseAction: (dose: DoseLogModel) => void;
  onOpenScanner: () => void;
  onOpenAddModal: () => void;
}

export const ScreenOverview: React.FC<ScreenOverviewProps> = ({
  medicines,
  todayDoses,
  onNavigate,
  onOpenDoseAction,
  onOpenScanner,
  onOpenAddModal
}) => {
  const activeMeds = medicines.filter((m) => m.status === "Active");
  const takenDoses = todayDoses.filter((d) => d.status === "Taken");
  const pendingDoses = todayDoses.filter((d) => d.status === "Pending");
  const dueNowDose = pendingDoses[0] || null;
  const lowStockMeds = medicines.filter((m) => m.remainingStock <= m.lowStockThreshold);
  const adherenceRate = todayDoses.length > 0 ? Math.round((takenDoses.length / todayDoses.length) * 100) : 100;

  return (
    <div className="space-y-4">
      {/* 1. Hero Welcome & Illustration Card */}
      <div className="bg-gradient-to-br from-[#FFF5EE] via-[#FFEBE0] to-[#FFE0D1] border border-orange-200/80 rounded-3xl p-4 sm:p-5 relative overflow-hidden shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="max-w-md space-y-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF5A36]/10 text-[#FF5A36] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Care daily. Live fully.
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              Stay on track with your <span className="text-[#FF5A36]">daily medication</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              You have taken <strong>{takenDoses.length}</strong> of <strong>{todayDoses.length}</strong> doses today ({adherenceRate}% adherence).
            </p>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-2.5 bg-white hover:bg-orange-50 text-[#FF5A36] font-bold text-xs rounded-2xl border border-orange-200 shadow-2xs flex items-center gap-1.5 transition-all"
            >
              <Camera className="w-4 h-4 text-[#FF5A36]" />
              <span>Scan Prescription</span>
            </button>
            <button
              onClick={() => onNavigate("today_doses")}
              className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center gap-1.5 transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Today's Doses</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigate("my_medicines")}
          className="bg-white p-3.5 rounded-2xl border border-orange-100/90 shadow-2xs hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Meds</span>
            <div className="w-7 h-7 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{activeMeds.length}</div>
          <div className="text-[10px] font-medium text-slate-500 mt-0.5">Across all schedules</div>
        </div>

        <div
          onClick={() => onNavigate("today_doses")}
          className="bg-white p-3.5 rounded-2xl border border-orange-100/90 shadow-2xs hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Taken Today</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {takenDoses.length} <span className="text-xs font-bold text-slate-400">/ {todayDoses.length}</span>
          </div>
          <div className="text-[10px] font-medium text-emerald-600 mt-0.5">{adherenceRate}% completed</div>
        </div>

        <div
          onClick={() => onNavigate("today_doses")}
          className="bg-white p-3.5 rounded-2xl border border-orange-100/90 shadow-2xs hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due / Pending</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingDoses.length}</div>
          <div className="text-[10px] font-medium text-slate-500 mt-0.5">Next at 02:00 PM</div>
        </div>

        <div
          onClick={() => onNavigate("refill_inventory")}
          className="bg-white p-3.5 rounded-2xl border border-orange-100/90 shadow-2xs hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
            <div className="w-7 h-7 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-500">{lowStockMeds.length}</div>
          <div className="text-[10px] font-medium text-red-600 mt-0.5">Refill recommended</div>
        </div>
      </div>

      {/* 3. Due Now / Next Scheduled Dose Card */}
      {dueNowDose && (
        <div className="bg-white border-2 border-[#FF5A36]/30 rounded-3xl p-4 sm:p-5 shadow-xs relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A36] text-white text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1 animate-pulse">
                <Clock className="w-3 h-3" /> Due Now
              </span>
              <span className="text-xs font-bold text-slate-500">{dueNowDose.scheduledTime} • {dueNowDose.slot}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Scheduled Today</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF5A36] flex-shrink-0">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{dueNowDose.medicineName}</h3>
                <p className="text-xs text-slate-500">
                  {dueNowDose.dosage} • Take with water after food
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenDoseAction(dueNowDose)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log Dose</span>
              </button>
              <button
                onClick={() => onOpenDoseAction(dueNowDose)}
                className="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-slate-700 font-bold text-xs rounded-2xl border border-orange-200/80 transition-all"
              >
                Snooze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Quick Nav Feature Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 px-1">
          Explore Medicine Services
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigate("my_medicines")}
            className="p-3.5 bg-white rounded-2xl border border-orange-100/90 hover:border-orange-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-[#FF5A36]">My Medicines</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Catalog & stock left</div>
          </button>

          <button
            onClick={() => onNavigate("schedule_dosing")}
            className="p-3.5 bg-white rounded-2xl border border-orange-100/90 hover:border-orange-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Schedule & Dosing</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Fixed, intervals & PRN</div>
          </button>

          <button
            onClick={() => onNavigate("refill_inventory")}
            className="p-3.5 bg-white rounded-2xl border border-orange-100/90 hover:border-orange-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600">Refill & Inventory</div>
            <div className="text-[10px] text-slate-500 mt-0.5">1-Click reorder & alerts</div>
          </button>

          <button
            onClick={() => onNavigate("interactions_safety")}
            className="p-3.5 bg-white rounded-2xl border border-orange-100/90 hover:border-orange-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-red-500">Interactions & Safety</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Drug & food cross-check</div>
          </button>

          <button
            onClick={() => onNavigate("medicine_journal")}
            className="p-3.5 bg-white rounded-2xl border border-orange-100/90 hover:border-orange-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600">Medicine Journal</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Side effects & mood log</div>
          </button>

          <button
            onClick={() => onNavigate("adherence_history")}
            className="p-3.5 bg-white rounded-2xl border border-orange-100/90 hover:border-orange-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">21-Day Calendar</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Monthly adherence dots</div>
          </button>

          <button
            onClick={() => onNavigate("caregiver_family")}
            className="p-3.5 bg-white rounded-2xl border border-orange-100/90 hover:border-orange-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-pink-600">Caregiver & Family</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Maa & Dad remote sync</div>
          </button>

          <button
            onClick={() => onNavigate("doctor_reports")}
            className="p-3.5 bg-white rounded-2xl border border-orange-100/90 hover:border-orange-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-600">Doctor Report</div>
            <div className="text-[10px] text-slate-500 mt-0.5">PDF export & gauge</div>
          </button>
        </div>
      </div>
    </div>
  );
};
