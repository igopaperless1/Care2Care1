import React, { useState } from "react";
import {
  X,
  UserPlus,
  Users,
  UserCheck,
  Plus,
  Heart,
  Shield,
  Search,
  CheckCircle2,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Patient } from "../types";

interface SubAccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onOpenCreateNewModal: () => void;
}

export const SubAccountManagerModal: React.FC<SubAccountManagerModalProps> = ({
  isOpen,
  onClose,
  patients,
  selectedPatientId,
  onSelectPatient,
  onOpenCreateNewModal
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  if (!isOpen) return null;

  const filteredPatients = (patients || []).filter((p) => {
    const matchesQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      selectedFilter === "all" ||
      (selectedFilter === "elderly" && p.category === "Elderly") ||
      (selectedFilter === "kids" && p.category === "Kids") ||
      (selectedFilter === "general" && (p.category === "General" || !p.category));
    return matchesQuery && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#2E7D32]/30 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#1b5e20] to-[#2E7D32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/10 rounded-2xl">
              <Users className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <h3 className="text-base font-black flex items-center gap-2">
                <span>Select or Manage Sub-Accounts</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  {patients.length} Accounts
                </span>
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Switch between active family members, seniors, kids, staff, or create new sub-accounts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Top Bar with Create Button & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search sub-accounts by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCreateNewModal();
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Create New Sub-Account</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: "all", label: "👥 All Accounts" },
              { id: "elderly", label: "👴 Elderly / Seniors" },
              { id: "kids", label: "👶 Kids & Pediatric" },
              { id: "general", label: "👤 General / Family" }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? "bg-[#2E7D32] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sub Account List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPatient(p.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-emerald-50 border-[#2E7D32] ring-2 ring-[#2E7D32]/30 shadow-md"
                      : "bg-white border-slate-200 hover:border-[#2E7D32] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                      alt={p.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-slate-900 truncate">{p.name}</h4>
                        {isSelected && (
                          <span className="text-[9px] bg-[#2E7D32] text-white px-2 py-0.5 rounded-full font-black">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold truncate">
                        {p.category || "General"} • Age {p.age || 25}
                      </p>
                      <p className="text-[9px] text-[#2E7D32] font-semibold truncate">
                        💧 {p.waterCurrentMl || 0} / {p.waterGoalMl || 2500} ml
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                    ) : (
                      <span className="text-xs font-bold text-slate-400 hover:text-[#2E7D32]">
                        Select →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">
            Click any account card above to activate it immediately
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
