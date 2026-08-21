import React, { useState } from "react";
import {
  HeartHandshake,
  Calendar,
  Camera,
  Edit2,
  Save,
  Check,
  Sparkles,
  MapPin
} from "lucide-react";
import { GuruProfile, GuruMataProfile, FamilyTab } from "./types";

interface ScreenFamilySpiritualLinkProps {
  guruProfile: GuruProfile;
  guruMataProfile: GuruMataProfile;
  onUpdateGuruMata: (updated: Partial<GuruMataProfile>) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenFamilySpiritualLink: React.FC<ScreenFamilySpiritualLinkProps> = ({
  guruProfile,
  guruMataProfile,
  onUpdateGuruMata,
  onNavigate
}) => {
  const [selectedRole, setSelectedRole] = useState<"Guru" | "Guru Mata">("Guru Mata");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<GuruMataProfile>(guruMataProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateGuruMata(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            4
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Family Link (Guru / Guru Mata)</h2>
            <p className="text-xs text-slate-500">Spiritual lineage linkage, motherly blessings & Diksha records</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* 2. Switchable Tabs: Guru | Guru Mata */}
      <div className="flex items-center gap-1 bg-orange-50/70 p-1.5 rounded-2xl border border-orange-200/80">
        <button
          type="button"
          onClick={() => {
            setSelectedRole("Guru");
            onNavigate("guru_profile");
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            selectedRole === "Guru"
              ? "bg-[#FF5A36] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          Guru (Swami Vedanand)
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole("Guru Mata")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            selectedRole === "Guru Mata"
              ? "bg-[#FF5A36] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          Guru Mata (Mata Anandmayi)
        </button>
      </div>

      {/* 3. Guru Mata Details Form (Exact layout matching Card 4) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Photo Column */}
          <div className="md:col-span-4 flex flex-col items-center space-y-3">
            <img
              src={formData.photoUrl}
              alt={formData.name}
              referrerPolicy="no-referrer"
              className="w-44 h-56 rounded-3xl object-cover border-4 border-orange-100 shadow-md bg-orange-50"
            />
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter new image URL for Guru Mata:", formData.photoUrl);
                if (url) {
                  setFormData({ ...formData, photoUrl: url });
                  onUpdateGuruMata({ photoUrl: url });
                }
              }}
              className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="md:col-span-8 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Guru Mata Name <span className="text-[#FF5A36]">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
                />
              ) : (
                <div className="text-sm font-black text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.name}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <div className="text-xs font-semibold text-slate-800 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.role}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Also Known As</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.alsoKnownAs}
                    onChange={(e) => setFormData({ ...formData, alsoKnownAs: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                ) : (
                  <div className="text-xs font-medium text-slate-800 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                    {formData.alsoKnownAs}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Date of Birth (Janam Tithi)</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.dateOfBirthVS}
                    onChange={(e) => setFormData({ ...formData, dateOfBirthVS: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                ) : (
                  <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                    {formData.dateOfBirthVS}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Date of Diksha</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.dateOfDikshaVS}
                    onChange={(e) => setFormData({ ...formData, dateOfDikshaVS: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                ) : (
                  <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                    {formData.dateOfDikshaVS}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gotra (If Applicable)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gotra}
                  onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-bold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.gotra}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Ashram Location</label>
              <div className="text-xs text-slate-700 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>{formData.currentAshram}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-orange-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("interactive_tree")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Back
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
