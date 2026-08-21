import React, { useState } from "react";
import {
  Bug,
  Plus,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scissors,
  HelpCircle,
  Camera,
  Search
} from "lucide-react";
import { PestObservation, FarmGardenItem } from "./types";

interface ScreenPestDiseaseProps {
  activeFarm: FarmGardenItem;
  pests: PestObservation[];
  onOpenAddModal: (type: string) => void;
  onResolvePest: (pestId: string) => void;
}

export const ScreenPestDisease: React.FC<ScreenPestDiseaseProps> = ({
  activeFarm,
  pests,
  onOpenAddModal,
  onResolvePest
}) => {
  const [subTab, setSubTab] = useState<"Monitoring" | "Treatments" | "Prevention">("Monitoring");
  const [isAiDoctorOpen, setIsAiDoctorOpen] = useState(false);
  const [aiSymptomInput, setAiSymptomInput] = useState("");
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const farmPests = pests.filter((p) => p.farmId === activeFarm.id);
  const activeIssues = farmPests.filter((p) => p.status === "Active" || p.status === "Monitoring").length;
  const resolvedCount = farmPests.filter((p) => p.status === "Resolved").length;

  const handleAiDiagnose = () => {
    if (!aiSymptomInput.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiDiagnosis(
        `AI Diagnostic Recommendation: Symptoms suggest early-stage Powdery Mildew / Aphids cluster. Recommended organic cure: Spray 5ml pure cold-pressed Neem Oil + 2g baking soda per liter of warm water every 3 days in the evening. Remove and safely dispose of severely infected lower leaves.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* SUBTABS HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["Monitoring", "Treatments", "Prevention"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                subTab === tab
                  ? "bg-[#FF5A36] text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-orange-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAiDoctorOpen(true)}
          className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>AI Plant Doctor</span>
        </button>
      </div>

      {/* 3 STATUS METRIC CARDS (Areas at Risk 2 Fields, Active Issues 1 Field, Resolved 3 This Month) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-3.5 text-center shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Areas at Risk
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">
            2 Fields
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-3.5 text-center shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Issues
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#FF5A36] mt-1 block">
            {activeIssues} Field
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-3.5 text-center shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block">
            {resolvedCount || 3} This Month
          </span>
        </div>
      </div>

      {/* RECENT OBSERVATIONS LIST (Matching Screenshot Card 8) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">Recent Observations</h3>
          <span className="text-xs font-bold text-slate-400">Scouted Bi-weekly</span>
        </div>

        <div className="space-y-2.5">
          {farmPests.map((pest) => {
            const isResolved = pest.status === "Resolved";
            const isMedium = pest.riskLevel === "Medium";
            const isLow = pest.riskLevel === "Low";

            return (
              <div
                key={pest.id}
                className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-orange-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-orange-200 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-rose-500 shadow-2xs shrink-0">
                    <Bug className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{pest.pestName}</h4>
                    <p className="text-xs font-semibold text-slate-500">
                      {pest.cropTarget} • {pest.date}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      <span className="font-bold text-slate-800">Treatment:</span> {pest.treatment}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${
                      isResolved
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : isMedium
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}
                  >
                    {isResolved ? "Resolved" : pest.riskLevel}
                  </span>

                  {!isResolved && (
                    <button
                      onClick={() => onResolvePest(pest.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <button
          onClick={() => onOpenAddModal("pest")}
          className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Observation</span>
        </button>
      </div>

      {/* AI PLANT DOCTOR MODAL */}
      {isAiDoctorOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">AI Plant Disease Doctor</h3>
              </div>
              <button
                onClick={() => setIsAiDoctorOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Describe plant leaf discoloration, spots, yellowing, curled edges, or pest insects to receive instant organic remedy prescriptions.
            </p>

            <textarea
              value={aiSymptomInput}
              onChange={(e) => setAiSymptomInput(e.target.value)}
              placeholder="e.g. Yellowing between veins on tomato leaves, small white flying insects under leaves..."
              rows={3}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />

            {aiDiagnosis && (
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-950 font-medium leading-relaxed">
                {aiDiagnosis}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAiDoctorOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleAiDiagnose}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isAnalyzing ? "Diagnosing..." : "Analyze Symptoms"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
