import React from "react";
import {
  Users,
  Flame,
  Calendar,
  Sparkles,
  UserPlus,
  ArrowLeft,
  Share2,
  Download,
  Search,
  Award,
  HeartHandshake
} from "lucide-react";
import { FamilyTab, GuruProfile } from "./types";

interface FamilyHeaderProps {
  currentTab: FamilyTab;
  onNavigate: (tab: FamilyTab) => void;
  guruProfile: GuruProfile;
  totalMembers: number;
  activeGenerations: number;
  upcomingRitualsCount: number;
  onOpenAddMember: () => void;
  onBack?: () => void;
}

export const FamilyHeader: React.FC<FamilyHeaderProps> = ({
  currentTab,
  onNavigate,
  guruProfile,
  totalMembers,
  activeGenerations,
  upcomingRitualsCount,
  onOpenAddMember,
  onBack
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F5]/95 backdrop-blur-md border-b border-orange-200/70 shadow-2xs">
      {/* 1. Top Ribbon Notification */}
      <div className="bg-gradient-to-r from-[#FF5A36] via-[#FF7A45] to-[#E04826] text-white px-3 sm:px-6 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="p-1 bg-white/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
          </span>
          <span className="font-bold">Sacred Family Heritage & Guru Parampara</span>
          <span className="hidden md:inline text-orange-100">• Tracking {totalMembers} Family Members across {activeGenerations} Generations</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-white/20 hover:bg-white/30 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold transition-colors">
            {upcomingRitualsCount} Upcoming Rituals
          </span>
        </div>
      </div>

      {/* 2. Main Identity & Actions Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 bg-white hover:bg-orange-50 text-slate-600 hover:text-[#FF5A36] border border-orange-200 rounded-2xl transition-all shadow-2xs cursor-pointer"
              title="Back to Services"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-[#FF5A36] text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <Users className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Family Tree & Sacred Heritage
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200">
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Lineage, Ancestral Pedigree, Vedic Tithis, Guru Parampara & Rituals
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => onNavigate("interactive_tree")}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === "interactive_tree"
                ? "bg-orange-50 text-[#FF5A36] border-orange-300 shadow-2xs"
                : "bg-white text-slate-700 border-orange-200 hover:bg-orange-50/50"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Interactive Tree</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("guru_profile")}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === "guru_profile"
                ? "bg-orange-50 text-[#FF5A36] border-orange-300 shadow-2xs"
                : "bg-white text-slate-700 border-orange-200 hover:bg-orange-50/50"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Guru Parampara</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddMember}
            className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/25 cursor-pointer active:scale-95 transition-transform"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>
    </header>
  );
};
