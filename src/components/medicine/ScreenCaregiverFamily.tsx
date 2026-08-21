import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Sparkles,
  HeartHandshake,
  Share2,
  Clock
} from "lucide-react";
import { DependentCareModel, MedicineTab } from "./types";

interface ScreenCaregiverFamilyProps {
  dependents: DependentCareModel[];
  onAddDependent: (dep: Partial<DependentCareModel>) => void;
  onNavigate: (tab: MedicineTab) => void;
}

export const ScreenCaregiverFamily: React.FC<ScreenCaregiverFamilyProps> = ({
  dependents,
  onAddDependent,
  onNavigate
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("Mother (Age 64)");
  const [newPhone, setNewPhone] = useState("+977 9801122334");

  const handleCreate = () => {
    if (!newName.trim()) {
      alert("Please enter a name.");
      return;
    }
    onAddDependent({
      name: newName.trim(),
      relation: newRelation.trim(),
      phone: newPhone.trim(),
      hasMissedAlert: false,
      recentActivities: []
    });
    setNewName("");
    setShowAddForm(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Family & Caregiver Sync</h3>
            <p className="text-xs text-slate-500">Monitor loved ones' daily doses remotely</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-2xl shadow-sm shadow-orange-500/25 flex items-center gap-1.5 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="bg-orange-50/70 rounded-3xl p-4 border border-orange-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-900">Add Family Member / Dependent</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Name (e.g. Maa, Grandfather)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs"
            />
            <input
              type="text"
              placeholder="Relation & Age"
              value={newRelation}
              onChange={(e) => setNewRelation(e.target.value)}
              className="px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-500 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-xl"
            >
              Save Member
            </button>
          </div>
        </div>
      )}

      {/* 2. Dependents Cards List */}
      <div className="space-y-3.5">
        {dependents.map((dep) => (
          <div
            key={dep.id}
            className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all shadow-2xs space-y-3 ${
              dep.hasMissedAlert ? "border-red-300 ring-1 ring-red-200" : "border-orange-100/90"
            }`}
          >
            {/* Top Person Info */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200 bg-orange-50 flex items-center justify-center text-slate-700 font-bold">
                  {dep.avatar ? (
                    <img
                      src={dep.avatar}
                      alt={dep.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    dep.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{dep.name}</h4>
                    <span className="text-xs text-slate-500 font-medium">({dep.relation})</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{dep.phone}</div>
                </div>
              </div>

              {/* Action Contact Buttons */}
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${dep.phone}`}
                  className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => alert(`Care reminder SMS sent to ${dep.name} (${dep.phone}).`)}
                  className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] flex items-center justify-center border border-orange-200"
                  title="Send SMS"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Missed Dose Alert Box */}
            {dep.hasMissedAlert && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 animate-bounce" />
                  <div>
                    <div className="text-xs font-bold text-red-900">Missed Dose Alert</div>
                    <div className="text-[11px] text-red-700">
                      Skipped <strong>{dep.missedMedName}</strong> ({dep.missedTimeAgo})
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${dep.phone}`}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-xl whitespace-nowrap"
                >
                  Call {dep.name}
                </a>
              </div>
            )}

            {/* Activity Stream */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Medication Log
              </div>

              {dep.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2 bg-orange-50/40 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    {act.action === "took" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    )}
                    <span className="font-semibold text-slate-800">
                      {act.medName} ({act.dosage})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
