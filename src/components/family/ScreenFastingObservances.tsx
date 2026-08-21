import React, { useState } from "react";
import {
  Flame,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Info,
  ChevronRight,
  Shield,
  Apple,
  Coffee
} from "lucide-react";
import { FastingRule, FamilyTab } from "./types";

interface ScreenFastingObservancesProps {
  fastingRules: FastingRule[];
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenFastingObservances: React.FC<ScreenFastingObservancesProps> = ({
  fastingRules,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"Fasting Days" | "Rules & Guidelines" | "Observances">("Fasting Days");

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            10
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Fasting & Observances</h2>
            <p className="text-xs text-slate-500">Sacred Vratas, dietary restrictions, Ekadashi schedule & spiritual disciplines</p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#FF5A36] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          4 Prescribed Vratas
        </span>
      </div>

      {/* 2. Sub Tabs: Fasting Days | Rules & Guidelines | Observances */}
      <div className="flex items-center gap-1 bg-orange-50/70 p-1.5 rounded-2xl border border-orange-200/80">
        {(["Fasting Days", "Rules & Guidelines", "Observances"] as const).map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Fasting Days List (Exact layout matching Card 10) */}
      {activeSubTab === "Fasting Days" && (
        <div className="space-y-3">
          {fastingRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white hover:bg-orange-50/30 rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center text-[#FF5A36] shrink-0 font-black">
                  <Flame className="w-5 h-5 text-[#FF5A36]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{rule.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5A36] border border-orange-200">
                      {rule.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Timing: <span className="text-slate-800 font-semibold">{rule.timing}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{rule.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span
                  className={`px-3 py-1.5 rounded-2xl text-xs font-black tracking-wide border shadow-2xs ${
                    rule.status === "Recurring"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-[#FF5A36]/10 text-[#FF5A36] border-orange-200"
                  }`}
                >
                  {rule.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Rules & Guidelines */}
      {activeSubTab === "Rules & Guidelines" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FF5A36]" /> General Dietary & Spiritual Guidelines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-emerald-600" /> Permitted Satvik Foods (Phalahar)
              </div>
              <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                <li>Fresh seasonal fruits & tender coconut water</li>
                <li>Pure cow milk, ghee, and homemade curd</li>
                <li>Almonds, walnuts, dates, and raisins</li>
                <li>Buckwheat (Kuttu) & Water chestnut flour (Singhara)</li>
                <li>Rock salt (Sendha Namak) only</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 space-y-2">
              <div className="font-bold text-red-900 flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-red-600" /> Strictly Prohibited Items
              </div>
              <ul className="space-y-1 text-red-800 list-disc list-inside">
                <li>All grains: Rice, Wheat, Barley, Oats</li>
                <li>Legumes and lentils (Daal)</li>
                <li>Onions, Garlic, and pungent root vegetables</li>
                <li>Processed packaged foods & table salt</li>
                <li>Alcohol, smoking, and negative mental states</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. Observances */}
      {activeSubTab === "Observances" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Spiritual Conduct & Vrata Observances</h3>
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="p-3 bg-orange-50/40 rounded-2xl border border-orange-100">
              <strong className="text-slate-900">Brahmamuhurta Awakening:</strong> Wake up at 4:30 AM on all fasting days. Take a holy bath and light the temple lamp.
            </div>
            <div className="p-3 bg-orange-50/40 rounded-2xl border border-orange-100">
              <strong className="text-slate-900">Guru Gita Recitation:</strong> Chant 3 rounds of Guru Mantra and read Chapter 1 & 2 of Sri Guru Gita.
            </div>
            <div className="p-3 bg-orange-50/40 rounded-2xl border border-orange-100">
              <strong className="text-slate-900">Charity & Feeding:</strong> Offer food to birds, cows, or needy individuals before breaking the fast (Parana).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
