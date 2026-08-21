import React from "react";
import { PieChart, Users, Sparkles, UserCheck } from "lucide-react";
import { FamilyMember } from "./types";

interface ScreenFanChartProps {
  members: FamilyMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
  onOpenMemberDetail: (member: FamilyMember) => void;
}

export const ScreenFanChart: React.FC<ScreenFanChartProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
  onOpenMemberDetail
}) => {
  const root = members.find((m) => m.id === selectedMemberId) || members.find((m) => m.isSelf) || members[0];
  const father = root?.fatherId ? members.find((m) => m.id === root.fatherId) : undefined;
  const mother = root?.motherId ? members.find((m) => m.id === root.motherId) : undefined;

  const patGpa = father?.fatherId ? members.find((m) => m.id === father.fatherId) : undefined;
  const patGma = father?.motherId ? members.find((m) => m.id === father.motherId) : undefined;
  const matGpa = mother?.fatherId ? members.find((m) => m.id === mother.fatherId) : undefined;
  const matGma = mother?.motherId ? members.find((m) => m.id === mother.motherId) : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Radial Fan Chart Lineage</h2>
            <p className="text-xs text-slate-500">Concentric ancestral fan chart representing 3 generations of heritage</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/90 shadow-2xs space-y-8 flex flex-col items-center">
        {/* Ring 3: Grandparents */}
        <div className="w-full space-y-2">
          <div className="text-center text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 py-1 px-3 rounded-full inline-block mx-auto border border-amber-200">
            Outer Arc • Grandparents (4 Lineages)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { m: patGpa, label: "Pat. Grandfather" },
              { m: patGma, label: "Pat. Grandmother" },
              { m: matGpa, label: "Mat. Grandfather" },
              { m: matGma, label: "Mat. Grandmother" }
            ].map(({ m, label }, idx) => (
              <div
                key={idx}
                onClick={() => m && onSelectMember(m.id)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  m
                    ? "bg-amber-50/50 hover:bg-amber-100/60 border-amber-200 cursor-pointer shadow-2xs"
                    : "bg-slate-50 border-dashed border-slate-200"
                }`}
              >
                <div className="text-[10px] font-bold text-amber-900 truncate">{label}</div>
                <div className="text-xs font-black text-slate-900 mt-1 truncate">
                  {m ? `${m.firstName} ${m.lastName}` : "Unknown"}
                </div>
                <div className="text-[9px] text-slate-500">{m?.gotra ? `Gotra: ${m.gotra}` : ""}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ring 2: Parents */}
        <div className="w-full max-w-lg space-y-2">
          <div className="text-center text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-50 py-1 px-3 rounded-full inline-block mx-auto border border-orange-200">
            Middle Arc • Parents (2 Branches)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { m: father, label: "Paternal Branch (Father)" },
              { m: mother, label: "Maternal Branch (Mother)" }
            ].map(({ m, label }, idx) => (
              <div
                key={idx}
                onClick={() => m && onSelectMember(m.id)}
                className="p-3.5 bg-orange-50/60 hover:bg-orange-100/80 rounded-2xl border border-orange-200 text-center transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-[10px] font-bold text-orange-800">{label}</div>
                <div className="text-xs font-black text-slate-900 mt-1">
                  {m ? `${m.firstName} ${m.lastName}` : "Unlinked"}
                </div>
                <div className="text-[10px] text-slate-500">{m?.dateOfBirth?.split("-")[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ring 1: Root Focal Node */}
        <div className="w-full max-w-sm">
          <div
            onClick={() => root && onOpenMemberDetail(root)}
            className="p-5 bg-gradient-to-r from-orange-500 to-[#FF5A36] text-white rounded-3xl shadow-md shadow-orange-500/25 text-center cursor-pointer transform hover:scale-[1.02] transition-transform"
          >
            <div className="text-[10px] uppercase font-black tracking-widest text-orange-200">Focal Root Ancestor</div>
            <div className="text-base font-black mt-1">{root?.firstName} {root?.lastName}</div>
            <div className="text-xs text-orange-100 mt-0.5">{root?.occupation || "Self"} • Born {root?.dateOfBirth}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
