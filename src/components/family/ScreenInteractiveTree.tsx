import React, { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Users,
  RotateCcw,
  Sparkles,
  Heart,
  ChevronRight,
  User,
  Plus,
  Compass,
  MapPin,
  Calendar
} from "lucide-react";
import { FamilyMember, FamilyTab } from "./types";

interface ScreenInteractiveTreeProps {
  members: FamilyMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
  onOpenAddMember: () => void;
  onOpenMemberDetail: (member: FamilyMember) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenInteractiveTree: React.FC<ScreenInteractiveTreeProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
  onOpenAddMember,
  onOpenMemberDetail,
  onNavigate
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [filterQuery, setFilterQuery] = useState<string>("");

  const rootMember = members.find((m) => m.id === selectedMemberId) || members.find((m) => m.isSelf) || members[0];
  const father = rootMember?.fatherId ? members.find((m) => m.id === rootMember.fatherId) : undefined;
  const mother = rootMember?.motherId ? members.find((m) => m.id === rootMember.motherId) : undefined;
  
  // Grandparents
  const patGrandpa = father?.fatherId ? members.find((m) => m.id === father.fatherId) : undefined;
  const patGrandma = father?.motherId ? members.find((m) => m.id === father.motherId) : undefined;
  const matGrandpa = mother?.fatherId ? members.find((m) => m.id === mother.fatherId) : undefined;
  const matGrandma = mother?.motherId ? members.find((m) => m.id === mother.motherId) : undefined;

  // Spouses & Children
  const spouses = rootMember?.spouseIds ? members.filter((m) => rootMember.spouseIds?.includes(m.id)) : [];
  const children = members.filter((m) => m.fatherId === rootMember?.id || m.motherId === rootMember?.id);
  const siblings = members.filter((m) => m.id !== rootMember?.id && ((m.fatherId && m.fatherId === rootMember?.fatherId) || (m.motherId && m.motherId === rootMember?.motherId)));

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(1.8, Math.max(0.6, Number((prev + delta).toFixed(2)))));
  };

  const renderMemberCard = (member?: FamilyMember, roleLabel?: string, isCenter = false) => {
    if (!member) {
      return (
        <div className="w-48 h-28 border-2 border-dashed border-orange-200/80 rounded-2xl bg-orange-50/20 flex flex-col items-center justify-center p-3 text-center">
          <span className="text-[11px] font-bold text-orange-400">{roleLabel || "Unlinked Ancestor"}</span>
          <button
            type="button"
            onClick={onOpenAddMember}
            className="mt-1 text-[11px] text-[#FF5A36] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add Member
          </button>
        </div>
      );
    }

    const isSelected = member.id === rootMember.id;

    return (
      <div
        key={member.id}
        onClick={() => onSelectMember(member.id)}
        className={`w-52 rounded-2xl p-3 border transition-all cursor-pointer select-none relative group ${
          isSelected
            ? "bg-gradient-to-br from-orange-500 to-[#FF5A36] text-white border-transparent shadow-lg shadow-orange-500/30 scale-105 z-10 ring-4 ring-orange-300/40"
            : "bg-white hover:bg-orange-50/60 text-slate-800 border-orange-200/90 shadow-2xs hover:shadow-md hover:border-orange-300"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <img
              src={member.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"}
              alt={member.firstName}
              referrerPolicy="no-referrer"
              className={`w-10 h-10 rounded-xl object-cover border-2 ${
                isSelected ? "border-white" : "border-orange-200"
              }`}
            />
            {!member.isAlive && (
              <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-[9px] font-bold px-1 rounded-full border border-white">
                †
              </span>
            )}
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center gap-1">
              <h4 className={`text-xs font-black truncate ${isSelected ? "text-white" : "text-slate-900"}`}>
                {member.firstName} {member.lastName}
              </h4>
            </div>
            <div className={`text-[10px] font-medium truncate ${isSelected ? "text-orange-100" : "text-slate-500"}`}>
              {roleLabel || (member.isSelf ? "Root (Self)" : member.gender)}
            </div>
          </div>
        </div>

        <div className={`mt-2 pt-2 border-t text-[10px] flex items-center justify-between font-medium ${
          isSelected ? "border-white/20 text-orange-100" : "border-orange-100 text-slate-500"
        }`}>
          <span>{member.dateOfBirth ? member.dateOfBirth.split("-")[0] : "—"}</span>
          <span className="font-bold">{member.gotra ? `Gotra: ${member.gotra}` : member.bloodGroup || ""}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenMemberDetail(member);
            }}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isSelected ? "hover:bg-white/20 text-white" : "hover:bg-orange-100 text-[#FF5A36]"
            }`}
            title="View Details"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center font-black shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Interactive Family Genealogy Tree
              <span className="bg-orange-100 text-[#FF5A36] text-[10px] font-black px-2 py-0.5 rounded-full border border-orange-200">
                Focus: {rootMember?.firstName} {rootMember?.lastName}
              </span>
            </h2>
            <p className="text-xs text-slate-500">Visual lineage layout with multi-generational linkage</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-orange-50/70 rounded-2xl border border-orange-200/80 p-1">
            <button
              type="button"
              onClick={() => handleZoom(-0.1)}
              className="p-1.5 hover:bg-white rounded-xl text-slate-600 hover:text-[#FF5A36] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2.5 text-xs font-mono font-bold text-slate-700">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(0.1)}
              className="p-1.5 hover:bg-white rounded-xl text-slate-600 hover:text-[#FF5A36] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-white rounded-xl text-slate-600 hover:text-[#FF5A36] transition-colors cursor-pointer ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAddMember}
            className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/20 cursor-pointer active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Canvas */}
      <div className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-10 border border-orange-200/80 shadow-inner overflow-x-auto min-h-[560px] flex flex-col items-center justify-center relative select-none">
        {/* Background Grid Accent */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#FF5A36 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          className="transition-transform duration-200 ease-out space-y-12 flex flex-col items-center py-4"
        >
          {/* LEVEL 1: Grandparents Generation */}
          <div className="space-y-2">
            <div className="text-center">
              <span className="text-[10px] font-black tracking-wider uppercase text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Generation I (Grandparents)
              </span>
            </div>
            <div className="flex items-center gap-6 sm:gap-12 justify-center">
              <div className="flex items-center gap-3 p-3 bg-white/80 rounded-3xl border border-orange-100 shadow-2xs">
                {renderMemberCard(patGrandpa, "Paternal Grandfather")}
                {renderMemberCard(patGrandma, "Paternal Grandmother")}
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/80 rounded-3xl border border-orange-100 shadow-2xs">
                {renderMemberCard(matGrandpa, "Maternal Grandfather")}
                {renderMemberCard(matGrandma, "Maternal Grandmother")}
              </div>
            </div>
          </div>

          {/* Connector Line 1 */}
          <div className="w-1 h-6 bg-orange-300 rounded-full" />

          {/* LEVEL 2: Parents Generation */}
          <div className="space-y-2">
            <div className="text-center">
              <span className="text-[10px] font-black tracking-wider uppercase text-orange-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Generation II (Parents)
              </span>
            </div>
            <div className="flex items-center gap-4 justify-center p-3 bg-white/80 rounded-3xl border border-orange-100 shadow-2xs">
              {renderMemberCard(father, "Father")}
              <Heart className="w-4 h-4 text-[#FF5A36] shrink-0" />
              {renderMemberCard(mother, "Mother")}
            </div>
          </div>

          {/* Connector Line 2 */}
          <div className="w-1 h-6 bg-orange-300 rounded-full" />

          {/* LEVEL 3: Root Member & Siblings & Spouse */}
          <div className="space-y-2">
            <div className="text-center">
              <span className="text-[10px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Generation III (You & Family)
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center p-4 bg-orange-50/40 rounded-3xl border border-orange-200 shadow-xs">
              {siblings.map((sib) => renderMemberCard(sib, "Sibling"))}
              {renderMemberCard(rootMember, "Root Focus", true)}
              {spouses.map((sp) => renderMemberCard(sp, "Spouse"))}
            </div>
          </div>

          {/* Connector Line 3 */}
          <div className="w-1 h-6 bg-orange-300 rounded-full" />

          {/* LEVEL 4: Children Generation */}
          <div className="space-y-2">
            <div className="text-center">
              <span className="text-[10px] font-black tracking-wider uppercase text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Generation IV (Children)
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center p-3 bg-white/80 rounded-3xl border border-orange-100 shadow-2xs">
              {children.length > 0 ? (
                children.map((child) => renderMemberCard(child, "Child"))
              ) : (
                <div className="text-xs text-slate-400 italic p-3">No direct children recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
