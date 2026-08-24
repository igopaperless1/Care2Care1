import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Phone,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Heart,
  ShieldCheck,
  Share2
} from "lucide-react";
import { DependentCareModel, MedicineTab } from "./types";

interface ScreenCaregiverFamilyProps {
  dependents: DependentCareModel[];
  onAddDependent: (dep: Partial<DependentCareModel>) => void;
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenCaregiverFamily: React.FC<ScreenCaregiverFamilyProps> = ({
  dependents,
  onAddDependent,
  onNavigate
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Parent (Mother)");
  const [phone, setPhone] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddDependent({
      name,
      relation,
      phone,
      hasMissedAlert: false,
      recentActivities: ["Added to family sync network"]
    });
    setName("");
    setPhone("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#1A1A1A]">
              Caregiver & Family Sync
            </h3>
            <p className="text-xs text-[#4A4A4A]">
              Monitor elders, children & receive missed dose alerts
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isAdding ? "Cancel" : "Add Member"}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-5 border-2 border-[#6C3CE1]/30 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-3"
        >
          <h4 className="text-xs font-black text-[#6C3CE1] uppercase tracking-wider">
            Add Family Member Profile
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name (e.g. Ramesh Karki)"
              required
              className="p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs font-bold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
            />
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs font-bold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
            >
              <option>Parent (Mother)</option>
              <option>Parent (Father)</option>
              <option>Spouse</option>
              <option>Child</option>
              <option>Grandparent</option>
              <option>Caregiver</option>
            </select>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number (+977...)"
              className="p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs font-bold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-[#6C3CE1] text-white text-xs font-black rounded-xl shadow-xs cursor-pointer"
          >
            Save Family Member
          </button>
        </form>
      )}

      {/* 2. Dependents List */}
      <div className="space-y-3">
        {dependents.map((dep) => (
          <div
            key={dep.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F3F0FF] border border-[#8B6CE6]/30 text-[#6C3CE1] flex items-center justify-center text-xl font-black">
                  👤
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-[#1A1A1A]">
                    {dep.name}
                  </h4>
                  <p className="text-xs text-[#4A4A4A]">
                    {dep.relation} • {dep.phone || "No phone linked"}
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
                  dep.hasMissedAlert
                    ? "bg-[#E74C3C] text-white animate-pulse"
                    : "bg-[#2ECC71] text-white"
                }`}
              >
                {dep.hasMissedAlert ? "⚠️ Missed Dose Alert" : "✅ All Doses Taken"}
              </span>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-[#F5F5F5] p-3 rounded-xl space-y-1">
              <span className="text-[10px] font-black text-[#8A8A8A] uppercase block">
                Recent Medication Activity
              </span>
              {dep.recentActivities.map((act, i) => (
                <p key={i} className="text-xs text-[#1A1A1A] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2ECC71]" />
                  <span>{act}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
