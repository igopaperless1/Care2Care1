import React from "react";
import { BarChart3, Users, Heart, Award, Sparkles, MapPin, Globe } from "lucide-react";
import { FamilyMember } from "./types";

interface ScreenGenealogyStatsProps {
  members: FamilyMember[];
}

export const ScreenGenealogyStats: React.FC<ScreenGenealogyStatsProps> = ({ members }) => {
  const total = members.length;
  const living = members.filter((m) => m.isAlive).length;
  const deceased = total - living;
  const males = members.filter((m) => m.gender === "Male").length;
  const females = members.filter((m) => m.gender === "Female").length;

  const bloodGroups: { [key: string]: number } = {};
  members.forEach((m) => {
    if (m.bloodGroup) {
      bloodGroups[m.bloodGroup] = (bloodGroups[m.bloodGroup] || 0) + 1;
    }
  });

  const gotraCounts: { [key: string]: number } = {};
  members.forEach((m) => {
    if (m.gotra) {
      gotraCounts[m.gotra] = (gotraCounts[m.gotra] || 0) + 1;
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Genealogy & Demographic Analytics</h2>
            <p className="text-xs text-slate-500">Generational depth, gender distributions, bloodlines & Gotra lineage breakdown</p>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-orange-100/90 shadow-2xs text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Recorded</span>
          <div className="text-2xl font-black text-slate-900">{total}</div>
          <div className="text-[11px] font-semibold text-emerald-600">Across 4 Generations</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-orange-100/90 shadow-2xs text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Living Lineage</span>
          <div className="text-2xl font-black text-emerald-600">{living}</div>
          <div className="text-[11px] font-semibold text-slate-500">{Math.round((living / total) * 100)}% of tree</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-orange-100/90 shadow-2xs text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deceased Ancestors</span>
          <div className="text-2xl font-black text-purple-700">{deceased}</div>
          <div className="text-[11px] font-semibold text-purple-600">Shraddha observed</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-orange-100/90 shadow-2xs text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Gender Ratio</span>
          <div className="text-2xl font-black text-[#FF5A36]">{males}M / {females}F</div>
          <div className="text-[11px] font-semibold text-slate-500">Patrilineal + Marital</div>
        </div>
      </div>

      {/* Breakdown Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gotras */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/90 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Gotra Lineage Representation
          </h3>
          <div className="space-y-2">
            {Object.entries(gotraCounts).map(([gotra, count]) => (
              <div key={gotra} className="flex items-center justify-between text-xs p-2.5 bg-orange-50/40 rounded-2xl border border-orange-100">
                <span className="font-bold text-slate-800">{gotra} Gotra</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FF5A36] text-white text-[10px] font-black">{count} members</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Groups */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/90 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" /> Blood Group Demographics
          </h3>
          <div className="space-y-2">
            {Object.entries(bloodGroups).map(([bg, count]) => (
              <div key={bg} className="flex items-center justify-between text-xs p-2.5 bg-rose-50/40 rounded-2xl border border-rose-100">
                <span className="font-bold text-slate-800">Blood Type {bg}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">{count} members</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
