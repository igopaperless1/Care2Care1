import React, { useState } from "react";
import {
  Award,
  Calendar,
  MapPin,
  Flame,
  CheckCircle2,
  Edit2,
  Share2,
  Camera,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Save,
  Check
} from "lucide-react";
import { GuruProfile, FamilyTab } from "./types";

interface ScreenGuruProfileProps {
  profile: GuruProfile;
  onUpdateProfile: (updated: Partial<GuruProfile>) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenGuruProfile: React.FC<ScreenGuruProfileProps> = ({
  profile,
  onUpdateProfile,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"Overview" | "Details" | "Events" | "Documents" | "Notes">("Overview");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<GuruProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Card Header with Step/Number Indicator */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            1
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Guru / Guru Mata Profile</h2>
            <p className="text-xs text-slate-500">Sacred spiritual preceptor identity, Vikram Samvat Tithis & Diksha</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={() => onNavigate("family_link")}
            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] text-xs font-bold rounded-xl border border-orange-200 transition-colors cursor-pointer"
          >
            Switch to Guru Mata
          </button>
        </div>
      </div>

      {/* 2. Sub-tab Navigation */}
      <div className="flex items-center gap-1 bg-orange-50/70 p-1.5 rounded-2xl border border-orange-200/80 overflow-x-auto no-scrollbar">
        {(["Overview", "Details", "Events", "Documents", "Notes"] as const).map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveSubTab(tab);
                if (tab === "Details") onNavigate("guru_details");
                if (tab === "Events") onNavigate("events_rituals");
                if (tab === "Documents") onNavigate("documents_media");
                if (tab === "Notes") onNavigate("notes_instructions");
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Main Profile Body (Exact layout matching Card 1) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Photo & Thumbnails */}
          <div className="md:col-span-4 flex flex-col items-center space-y-3">
            <div className="relative group">
              <img
                src={formData.photoUrl}
                alt={formData.name}
                referrerPolicy="no-referrer"
                className="w-44 h-56 rounded-3xl object-cover border-4 border-orange-100 shadow-md bg-orange-50"
              />
              <div className="absolute inset-0 rounded-3xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter new Photo URL:", formData.photoUrl);
                    if (url) {
                      setFormData({ ...formData, photoUrl: url });
                      onUpdateProfile({ photoUrl: url });
                    }
                  }}
                  className="px-3 py-1.5 bg-white text-[#FF5A36] rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" /> Change
                </button>
              </div>
            </div>

            {/* Photo Thumbnails */}
            <div className="flex items-center gap-2">
              {formData.thumbnailPhotos.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, photoUrl: thumb });
                    onUpdateProfile({ photoUrl: thumb });
                  }}
                  className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    formData.photoUrl === thumb
                      ? "border-[#FF5A36] ring-2 ring-orange-300 scale-105"
                      : "border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter image URL:", formData.photoUrl);
                if (url) setFormData({ ...formData, photoUrl: url });
              }}
              className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
          </div>

          {/* Right Column: Profile Details Fields */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Guru Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guru Name <span className="text-[#FF5A36]">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                ) : (
                  <div className="text-sm font-black text-slate-900 bg-orange-50/30 p-2 rounded-xl border border-orange-100">
                    {formData.name}
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role <span className="text-[#FF5A36]">*</span>
                </label>
                {isEditing ? (
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Guru">Guru</option>
                    <option value="Guru Mata">Guru Mata</option>
                    <option value="Spiritual Preceptor">Spiritual Preceptor</option>
                  </select>
                ) : (
                  <div className="text-xs font-bold text-slate-800 bg-orange-50/30 p-2 rounded-xl border border-orange-100">
                    {formData.role}
                  </div>
                )}
              </div>

              {/* Also Known As */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Also Known As</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.alsoKnownAs}
                    onChange={(e) => setFormData({ ...formData, alsoKnownAs: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                ) : (
                  <div className="text-xs font-medium text-slate-800 bg-orange-50/30 p-2 rounded-xl border border-orange-100">
                    {formData.alsoKnownAs}
                  </div>
                )}
              </div>

              {/* Date of Birth (Janam Tithi) */}
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
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                ) : (
                  <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2 rounded-xl border border-orange-100">
                    {formData.dateOfBirthVS}
                  </div>
                )}
              </div>

              {/* Place of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Place of Birth</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                ) : (
                  <div className="text-xs font-medium text-slate-800 bg-orange-50/30 p-2 rounded-xl border border-orange-100 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#FF5A36]" />
                    <span>{formData.placeOfBirth}</span>
                  </div>
                )}
              </div>

              {/* Date of Diksha */}
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
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                ) : (
                  <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2 rounded-xl border border-orange-100">
                    {formData.dateOfDikshaVS}
                  </div>
                )}
              </div>

              {/* Gotra */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gotra (If Applicable)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.gotra}
                    onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                ) : (
                  <div className="text-xs font-bold text-slate-800 bg-orange-50/30 p-2 rounded-xl border border-orange-100">
                    {formData.gotra}
                  </div>
                )}
              </div>

              {/* Sampradaya / Sect */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Sampradaya / Sect</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.sampradaya}
                    onChange={(e) => setFormData({ ...formData, sampradaya: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                ) : (
                  <div className="text-xs font-semibold text-amber-900 bg-amber-50/70 p-2 rounded-xl border border-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{formData.sampradaya}</span>
                  </div>
                )}
              </div>

              {/* Current Ashram / Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Ashram / Address</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.currentAshram}
                    onChange={(e) => setFormData({ ...formData, currentAshram: e.target.value })}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                ) : (
                  <div className="text-xs text-slate-700 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                    {formData.currentAshram}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons Footer */}
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
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
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
