import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { DrugInteractionModel, MedicineItemModel, MedicineTab } from "./types";

interface ScreenInteractionsSafetyProps {
  interactions: DrugInteractionModel[];
  medicines: MedicineItemModel[];
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenInteractionsSafety: React.FC<ScreenInteractionsSafetyProps> = ({
  interactions,
  medicines,
  onNavigate
}) => {
  const [selectedTab, setSelectedTab] = useState<"interactions" | "food_conflicts">("interactions");

  const highRiskCount = interactions.filter((i) => i.riskLevel === "High Risk").length;
  const moderateCount = interactions.filter((i) => i.riskLevel === "Moderate Risk").length;

  const foodConflicts = [
    {
      medicine: "Atorvastatin (10mg)",
      substance: "Grapefruit & Grapefruit Juice",
      effect: "Inhibits CYP3A4 metabolism, drastically increasing statin plasma levels and risk of muscle toxicity (rhabdomyolysis).",
      advice: "Avoid grapefruit products completely while on statin therapy.",
      severity: "High"
    },
    {
      medicine: "Levothyroxine (50mcg)",
      substance: "Calcium, Iron & Dairy",
      effect: "Binds to thyroid hormone in the GI tract, severely reducing absorption.",
      advice: "Take Levothyroxine on empty stomach; separate from dairy/supplements by at least 4 hours.",
      severity: "High"
    },
    {
      medicine: "Amoxicillin (500mg)",
      substance: "Acidic juices & Alcohol",
      effect: "May irritate stomach lining or decrease therapeutic response.",
      advice: "Take with plain water after light meals.",
      severity: "Moderate"
    }
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Header Overview Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1A1A1A]">
                FDA Drug Safety & Interactions
              </h3>
              <p className="text-xs text-[#4A4A4A]">
                Analyzing your {medicines.length} active prescriptions
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F3F0FF] text-[#6C3CE1] text-xs font-black">
            AI Monitored
          </span>
        </div>

        {/* Risk Breakdown Chips */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
            <span className="text-xs font-bold text-red-900">High Risk Alerts</span>
            <span className="text-sm font-black text-[#E74C3C]">{highRiskCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Moderate Alerts</span>
            <span className="text-sm font-black text-[#F39C12]">{moderateCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Switcher Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedTab("interactions")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-center ${
            selectedTab === "interactions"
              ? "bg-[#6C3CE1] text-white shadow-xs"
              : "bg-white text-[#4A4A4A] border border-[#D1D5DB] hover:bg-[#F3F0FF]"
          }`}
        >
          Drug-to-Drug Interactions ({interactions.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab("food_conflicts")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-center ${
            selectedTab === "food_conflicts"
              ? "bg-[#6C3CE1] text-white shadow-xs"
              : "bg-white text-[#4A4A4A] border border-[#D1D5DB] hover:bg-[#F3F0FF]"
          }`}
        >
          Food & Beverage Conflicts ({foodConflicts.length})
        </button>
      </div>

      {/* 3. Drug-to-Drug Interactions */}
      {selectedTab === "interactions" && (
        <div className="space-y-3">
          {interactions.map((item) => {
            const isHigh = item.riskLevel === "High Risk";
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isHigh
                          ? "bg-red-100 text-[#E74C3C]"
                          : "bg-amber-100 text-[#F39C12]"
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-[#1A1A1A] mt-1">
                      {item.drugA} + {item.drugB}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-[#4A4A4A] leading-relaxed">
                  {item.description}
                </p>

                <div className="p-3 bg-[#F3F0FF] rounded-xl border border-[#8B6CE6]/30 flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#6C3CE1] shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-[#4A1FAD]">
                    <strong>Action Required:</strong> {item.actionRequired}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Food Conflicts */}
      {selectedTab === "food_conflicts" && (
        <div className="space-y-3">
          {foodConflicts.map((fc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm sm:text-base font-black text-[#1A1A1A]">
                  {fc.medicine} ✕ {fc.substance}
                </h4>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-100 text-[#E74C3C] uppercase">
                  {fc.severity} Conflict
                </span>
              </div>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                {fc.effect}
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-xs font-bold text-amber-900">
                  💡 <strong>Advice:</strong> {fc.advice}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
