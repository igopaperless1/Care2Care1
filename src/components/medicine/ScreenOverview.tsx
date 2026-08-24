import React from "react";
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  Camera,
  ChevronRight,
  Package,
  BookOpen,
  ShieldCheck,
  Users,
  FileText,
  Plus,
  ArrowRight
} from "lucide-react";
import { MedicineItemModel, DoseLogModel, MedicineTab } from "./types";

interface ScreenOverviewProps {
  medicines: MedicineItemModel[];
  todayDoses: DoseLogModel[];
  onNavigate: (tab: MedicineTab, params?: any) => void;
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
  const takenDoses = todayDoses.filter((d) => d.status === "Taken");
  const pendingDoses = todayDoses.filter((d) => d.status === "Pending" || d.status === "Snoozed");
  const dueNowDoses = pendingDoses.slice(0, 2);
  const remainingCount = pendingDoses.length;
  const totalDoses = todayDoses.length || 8;
  const progressPercent = totalDoses > 0 ? Math.round((takenDoses.length / totalDoses) * 100) : 25;

  const medicineServices = [
    {
      id: "my_medicines" as MedicineTab,
      icon: "📋",
      name: "My Medicines",
      desc: "Catalog & stock left",
      badge: `${medicines.length} Meds`
    },
    {
      id: "today_doses" as MedicineTab,
      icon: "📅",
      name: "Schedule & Dosing",
      desc: "Pill timings, slots & alarms",
      badge: `${pendingDoses.length} Due`
    },
    {
      id: "refill_inventory" as MedicineTab,
      icon: "🛒",
      name: "Refill & Inventory",
      desc: "Low stock alerts & auto refills",
      badge: "Smart Refills"
    },
    {
      id: "interactions_safety" as MedicineTab,
      icon: "🔒",
      name: "Interactions & Safety",
      desc: "FDA warnings & food conflicts",
      badge: "Clinical Safety"
    },
    {
      id: "medicine_journal" as MedicineTab,
      icon: "📖",
      name: "Medicine Journal",
      desc: "Daily symptoms, mood & dose notes",
      badge: "Symptom Log"
    },
    {
      id: "adherence_history" as MedicineTab,
      icon: "📅",
      name: "21-Day Calendar",
      desc: "Adherence streak & heatmap",
      badge: "21-Day Streak"
    },
    {
      id: "caregiver_family" as MedicineTab,
      icon: "👨‍👩‍👧",
      name: "Caregiver & Family",
      desc: "Sync family doses & missed alerts",
      badge: "Family Sync"
    },
    {
      id: "doctor_reports" as MedicineTab,
      icon: "📊",
      name: "Doctor Report",
      desc: "Clinical PDF export & doctor notes",
      badge: "PDF Export"
    }
  ];

  return (
    <div className="space-y-5 pb-20">
      {/* ========================================================================= */}
      {/* SECTION 1: TODAY'S PROGRESS (Card on White background) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#6C3CE1]">
              Today's Progress
            </span>
            <h3 className="text-lg font-black text-[#1A1A1A]">
              {takenDoses.length} of {totalDoses} Doses Taken
            </h3>
          </div>
          <span className="text-xl font-black text-[#6C3CE1]">{progressPercent}%</span>
        </div>

        {/* Progress Bar (Purple #6C3CE1) */}
        <div className="w-full h-3 bg-[#F3F0FF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6C3CE1] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 pt-1">
          <span className="px-3 py-1 rounded-full bg-[#2ECC71] text-white text-xs font-bold flex items-center gap-1 shadow-2xs">
            ✅ {takenDoses.length} taken
          </span>
          <span className="px-3 py-1 rounded-full bg-[#F39C12] text-white text-xs font-bold flex items-center gap-1 shadow-2xs">
            ⏰ {remainingCount} remaining
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: DUE NOW (Section header in Purple #6C3CE1) */}
      {/* ========================================================================= */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-black text-[#6C3CE1] flex items-center gap-1.5">
            <span>🔔 Due Now ({dueNowDoses.length})</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("today_doses")}
            className="text-xs font-black text-[#6C3CE1] hover:underline cursor-pointer"
          >
            View All Schedule →
          </button>
        </div>

        {dueNowDoses.length === 0 ? (
          <div className="bg-[#F3F0FF] rounded-2xl p-4 text-center border border-[#8B6CE6]/30">
            <p className="text-xs font-bold text-[#4A1FAD]">
              🎉 All doses for this time window are taken! Next doses scheduled for tonight.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dueNowDoses.map((dose) => (
              <div
                key={dose.id}
                className="bg-white rounded-2xl p-4 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] flex items-center justify-between gap-3 hover:border-[#6C3CE1]/50 transition-all"
              >
                <div className="min-w-0 space-y-1">
                  <h4 className="text-sm font-black text-[#1A1A1A] truncate">
                    {dose.medicineName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#4A4A4A]">
                    <span className="w-2 h-2 rounded-full bg-[#6C3CE1] inline-block" />
                    <span className="font-semibold">{dose.scheduledTime}</span>
                    <span className="text-[#8A8A8A]">· {dose.slot}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDoseAction(dose)}
                  className="px-3.5 py-2 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                >
                  Log Dose
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: QUICK ACTIONS (2x2 Grid) */}
      {/* ========================================================================= */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-black uppercase tracking-wider text-[#4A4A4A] px-1">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Scan Prescription */}
          <button
            type="button"
            onClick={onOpenScanner}
            className="bg-white hover:bg-[#F3F0FF] active:scale-98 p-4 rounded-2xl border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-[#1A1A1A] block">
                📸 Scan Prescription
              </span>
              <span className="text-[11px] text-[#8A8A8A] font-medium">
                AI camera import
              </span>
            </div>
          </button>

          {/* Action 2: Log Dose */}
          <button
            type="button"
            onClick={() => {
              if (pendingDoses[0]) {
                onOpenDoseAction(pendingDoses[0]);
              } else {
                onNavigate("today_doses");
              }
            }}
            className="bg-white hover:bg-[#F3F0FF] active:scale-98 p-4 rounded-2xl border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-[#1A1A1A] block">
                💊 Log Dose
              </span>
              <span className="text-[11px] text-[#8A8A8A] font-medium">
                Record today's intake
              </span>
            </div>
          </button>

          {/* Action 3: Today's Schedule */}
          <button
            type="button"
            onClick={() => onNavigate("today_doses")}
            className="bg-white hover:bg-[#F3F0FF] active:scale-98 p-4 rounded-2xl border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-[#1A1A1A] block">
                📋 Today's Schedule
              </span>
              <span className="text-[11px] text-[#8A8A8A] font-medium">
                Hourly timetable
              </span>
            </div>
          </button>

          {/* Action 4: Refill Reminder */}
          <button
            type="button"
            onClick={() => onNavigate("refill_inventory")}
            className="bg-white hover:bg-[#F3F0FF] active:scale-98 p-4 rounded-2xl border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-[#1A1A1A] block">
                🛒 Refill Reminder
              </span>
              <span className="text-[11px] text-[#8A8A8A] font-medium">
                Stock & reorders
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MEDICINE SERVICES (List - ALL OPEN NEW SCREENS) */}
      {/* ========================================================================= */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] flex items-center gap-2">
            <span>📂 Medicine Services</span>
          </h2>
          <span className="text-xs font-bold text-[#8A8A8A]">
            {medicineServices.length} Modules
          </span>
        </div>

        <div className="space-y-2.5">
          {medicineServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onNavigate(service.id)}
              className="bg-white hover:bg-[#F3F0FF] active:scale-99 p-3.5 sm:p-4 rounded-2xl border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex items-center justify-between gap-3.5 transition-all cursor-pointer group hover:border-[#6C3CE1]/50"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-11 h-11 rounded-2xl bg-[#F3F0FF] border border-[#8B6CE6]/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  {service.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] group-hover:text-[#6C3CE1] transition-colors truncate">
                      {service.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-[#F3F0FF] text-[#6C3CE1] text-[10px] font-extrabold uppercase tracking-wide">
                      {service.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A4A4A] truncate mt-0.5">
                    {service.desc}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-[#F5F5F5] group-hover:bg-[#6C3CE1] group-hover:text-white text-[#4A4A4A] flex items-center justify-center transition-all shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

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
