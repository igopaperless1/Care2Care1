import React from "react";
import { GitBranch, User, ChevronRight, Heart, Calendar } from "lucide-react";
import { FamilyMember } from "./types";

interface ScreenPedigreeProps {
  members: FamilyMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
  onOpenMemberDetail: (member: FamilyMember) => void;
}

export const ScreenPedigree: React.FC<ScreenPedigreeProps> = ({
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

  const renderCard = (m?: FamilyMember, label?: string) => {
    if (!m) {
      return (
        <div className="p-3 bg-white/40 border border-dashed border-orange-200 rounded-2xl text-center text-xs text-slate-400">
          {label || "Unknown Ancestor"}
        </div>
      );
    }
    const isRoot = m.id === root?.id;
    return (
      <div
        onClick={() => onSelectMember(m.id)}
        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          isRoot
            ? "bg-[#FF5A36] text-white border-transparent shadow-md shadow-orange-500/20"
            : "bg-white hover:bg-orange-50/70 border-orange-200 text-slate-800 shadow-2xs"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <img
            src={m.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
            alt={m.firstName}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-xl object-cover border border-orange-200"
          />
          <div>
            <div className={`text-xs font-bold ${isRoot ? "text-white" : "text-slate-900"}`}>
              {m.firstName} {m.lastName}
            </div>
            <div className={`text-[10px] ${isRoot ? "text-orange-100" : "text-slate-500"}`}>
              {label || m.gender} • {m.dateOfBirth?.split("-")[0] || "—"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenMemberDetail(m);
          }}
          className={`p-1 rounded-lg ${isRoot ? "text-white hover:bg-white/20" : "text-[#FF5A36] hover:bg-orange-100"}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Pedigree Lineage View</h2>
            <p className="text-xs text-slate-500">Direct ancestral lineage tracking from root member through paternal & maternal branches</p>
          </div>
        </div>
      </div>

      {/* Pedigree Tree Columns */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100/90 shadow-2xs overflow-x-auto">
        <div className="min-w-[650px] grid grid-cols-3 gap-6 items-center">
          {/* Column 1: Root */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Generation 1 (Root)</span>
            {renderCard(root, "Self / Focus")}
          </div>

          {/* Column 2: Parents */}
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Generation 2 (Parents)</span>
            <div className="space-y-4">
              {renderCard(father, "Father (Paternal)")}
              {renderCard(mother, "Mother (Maternal)")}
            </div>
          </div>

          {/* Column 3: Grandparents */}
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Generation 3 (Grandparents)</span>
            <div className="space-y-3">
              {renderCard(patGpa, "Paternal Grandfather")}
              {renderCard(patGma, "Paternal Grandmother")}
              {renderCard(matGpa, "Maternal Grandfather")}
              {renderCard(matGma, "Maternal Grandmother")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
