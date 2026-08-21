import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Heart,
  Phone,
  Mail,
  Shield,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { FamilyMember } from "./types";

interface ScreenMembersDirectoryProps {
  members: FamilyMember[];
  onSelectMember: (id: string) => void;
  onOpenMemberDetail: (member: FamilyMember) => void;
  onOpenAddMember: () => void;
  onDeleteMember: (id: string) => void;
}

export const ScreenMembersDirectory: React.FC<ScreenMembersDirectoryProps> = ({
  members,
  onSelectMember,
  onOpenMemberDetail,
  onOpenAddMember,
  onDeleteMember
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("All");
  const [filterLiving, setFilterLiving] = useState("All");
  const [filterGotra, setFilterGotra] = useState("All");

  const gotras = Array.from(new Set(members.map((m) => m.gotra).filter(Boolean)));

  const filteredMembers = members.filter((m) => {
    const fullName = `${m.firstName} ${m.middleName || ""} ${m.lastName}`.toLowerCase();
    if (!fullName.includes(searchQuery.toLowerCase()) && !m.occupation?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterGender !== "All" && m.gender !== filterGender) return false;
    if (filterLiving === "Living" && !m.isAlive) return false;
    if (filterLiving === "Deceased" && m.isAlive) return false;
    if (filterGotra !== "All" && m.gotra !== filterGotra) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Family Members Directory</h2>
            <p className="text-xs text-slate-500">Comprehensive searchable index of all direct ancestors, siblings & descendants</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddMember}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/20 cursor-pointer active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, occupation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <select
            value={filterLiving}
            onChange={(e) => setFilterLiving(e.target.value)}
            className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Status (Living & Deceased)</option>
            <option value="Living">Living Only</option>
            <option value="Deceased">Deceased Only (†)</option>
          </select>
        </div>

        <div>
          <select
            value={filterGotra}
            onChange={(e) => setFilterGotra(e.target.value)}
            className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Gotras</option>
            {gotras.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => onOpenMemberDetail(member)}
            className="bg-white hover:bg-orange-50/30 rounded-3xl p-5 border border-orange-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={member.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                  alt={member.firstName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-200 shadow-2xs"
                />
                {!member.isAlive && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                    †
                  </span>
                )}
              </div>

              <div className="overflow-hidden space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black text-slate-900 truncate">
                    {member.firstName} {member.lastName}
                  </h3>
                  {member.isSelf && (
                    <span className="bg-[#FF5A36] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">{member.occupation || member.gender}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                  <span>{member.dateOfBirth ? `b. ${member.dateOfBirth.split("-")[0]}` : "Birth unrecorded"}</span>
                  {member.gotra && <span>• Gotra: {member.gotra}</span>}
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                {member.city && (
                  <>
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{member.city}</span>
                  </>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMember(member.id);
                  }}
                  className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] text-[11px] font-bold rounded-xl border border-orange-200 transition-colors"
                >
                  View in Tree
                </button>
                {!member.isSelf && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove ${member.firstName} from the family tree?`)) {
                        onDeleteMember(member.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
