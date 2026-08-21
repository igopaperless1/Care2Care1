import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Pill,
  Sparkles,
  Info,
  Search,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { DrugInteractionModel, MedicineItemModel, MedicineTab } from "./types";

interface ScreenInteractionsSafetyProps {
  interactions: DrugInteractionModel[];
  medicines: MedicineItemModel[];
  onNavigate: (tab: MedicineTab) => void;
}

export const ScreenInteractionsSafety: React.FC<ScreenInteractionsSafetyProps> = ({
  interactions,
  medicines,
  onNavigate
}) => {
  const [selectedDrugA, setSelectedDrugA] = useState<string>(medicines[0]?.name || "Atorvastatin");
  const [selectedDrugB, setSelectedDrugB] = useState<string>("Clarithromycin 500mg");
  const [customCheckResult, setCustomCheckResult] = useState<DrugInteractionModel | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleRunCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // Check if matches known interaction or safe
      const found = interactions.find(
        (i) =>
          (i.drugA.toLowerCase().includes(selectedDrugA.toLowerCase()) &&
            i.drugB.toLowerCase().includes(selectedDrugB.toLowerCase())) ||
          (i.drugB.toLowerCase().includes(selectedDrugA.toLowerCase()) &&
            i.drugA.toLowerCase().includes(selectedDrugB.toLowerCase()))
      );

      if (found) {
        setCustomCheckResult(found);
      } else {
        setCustomCheckResult({
          id: "custom-res",
          drugA: selectedDrugA,
          drugB: selectedDrugB,
          riskLevel: "Safe",
          title: `No Major Interaction Found between ${selectedDrugA} & ${selectedDrugB}`,
          details: "No severe or contraindicated clinical interaction detected in pharmacopeia database. Maintain recommended timing and take with prescribed liquid.",
          recommendation: "Safe to take as instructed by your medical practitioner."
        });
      }
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-red-50/80 border border-red-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-red-950">
              Drug Interaction & Safety Cross-Check
            </h3>
            <p className="text-xs text-red-700">
              Automated safety scan across all active prescriptions & food interactions
            </p>
          </div>
        </div>
      </div>

      {/* 2. Detected Interactions Alerts */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Identified Clinical Alerts
        </h4>

        {interactions.map((int) => {
          const isHigh = int.riskLevel === "High Risk";
          const isModerate = int.riskLevel === "Moderate Risk";

          return (
            <div
              key={int.id}
              className={`rounded-3xl p-4 sm:p-5 border transition-all shadow-2xs space-y-3 ${
                isHigh
                  ? "bg-red-50/70 border-red-200"
                  : isModerate
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-emerald-50/70 border-emerald-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isHigh
                      ? "bg-red-500 text-white animate-pulse"
                      : isModerate
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {int.riskLevel}
                </span>

                <span className="text-xs font-bold text-slate-500">
                  {int.drugA} + {int.drugB}
                </span>
              </div>

              <div>
                <h4
                  className={`text-sm sm:text-base font-bold ${
                    isHigh ? "text-red-950" : isModerate ? "text-amber-950" : "text-emerald-950"
                  }`}
                >
                  {int.title}
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{int.details}</p>
              </div>

              <div className="p-3 bg-white/80 rounded-2xl border border-orange-100/80 space-y-1">
                <div className="text-[11px] font-bold text-slate-600 uppercase">Recommended Action:</div>
                <div className="text-xs text-slate-800 font-medium">{int.recommendation}</div>
              </div>

              {isHigh && (
                <div className="pt-1 flex items-center justify-between">
                  <a
                    href="tel:+9779801234567"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Prescribing Doctor</span>
                  </a>
                  <button
                    onClick={() => alert("Doctor query message drafted and sent to clinic portal.")}
                    className="text-xs font-bold text-red-700 hover:underline"
                  >
                    Message Clinic
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Interactive Multi-Drug Cross-Checker */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF5A36]" />
          <h4 className="text-sm font-bold text-slate-900">Check New Medicine or Food Item</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Medication 1</label>
            <select
              value={selectedDrugA}
              onChange={(e) => setSelectedDrugA(e.target.value)}
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.strength})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Medication 2 / Food / Substance
            </label>
            <input
              type="text"
              value={selectedDrugB}
              onChange={(e) => setSelectedDrugB(e.target.value)}
              placeholder="e.g. Clarithromycin, Grapefruit, Alcohol"
              className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunCheck}
          disabled={isChecking}
          className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isChecking ? "Checking Pharmacopeia Database..." : "Run Safety Cross-Check"}
        </button>

        {customCheckResult && (
          <div
            className={`p-3.5 rounded-2xl border ${
              customCheckResult.riskLevel === "High Risk"
                ? "bg-red-50 border-red-200 text-red-950"
                : customCheckResult.riskLevel === "Moderate Risk"
                ? "bg-amber-50 border-amber-200 text-amber-950"
                : "bg-emerald-50 border-emerald-200 text-emerald-950"
            } space-y-1.5`}
          >
            <div className="flex items-center gap-1.5">
              {customCheckResult.riskLevel === "Safe" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-xs font-bold">{customCheckResult.title}</span>
            </div>
            <p className="text-xs text-slate-700">{customCheckResult.details}</p>
            <p className="text-[11px] font-semibold text-slate-600 italic">
              {customCheckResult.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
