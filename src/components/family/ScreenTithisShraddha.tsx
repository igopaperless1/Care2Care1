import React, { useState } from "react";
import {
  Flame,
  Calendar,
  FileText,
  Download,
  MapPin,
  Clock,
  Edit2,
  Save,
  Check,
  Sparkles,
  BookOpen,
  HelpCircle,
  Upload
} from "lucide-react";
import { GuruProfile, FamilyTab } from "./types";

interface ScreenTithisShraddhaProps {
  profile: GuruProfile;
  onUpdateProfile: (updated: Partial<GuruProfile>) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenTithisShraddha: React.FC<ScreenTithisShraddhaProps> = ({
  profile,
  onUpdateProfile,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"Janam Tithi" | "Punyatithi" | "Shraddha">("Janam Tithi");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<GuruProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadPatrika = () => {
    const text = `SACRED JANAM PATRIKA\nName: ${formData.name}\nVikram Samvat: ${formData.dateOfBirthVS}\nGregorian: ${formData.dateOfBirthGregorian}\nPlace: ${formData.placeOfBirth}\nGotra: ${formData.gotra}\nSampradaya: ${formData.sampradaya}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = formData.janamPatrikaFileName || "janam_patrika.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header (Numbered 6, 7, 8) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            6
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Janam Tithi, Punyatithi & Shraddha</h2>
            <p className="text-xs text-slate-500">Vedic Hindu calendar Tithis, Mahasamadhi rituals & Janam Patrika</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* 2. Sub Tabs: Janam Tithi | Punyatithi | Shraddha */}
      <div className="flex items-center gap-1 bg-orange-50/70 p-1.5 rounded-2xl border border-orange-200/80">
        {(["Janam Tithi", "Punyatithi", "Shraddha"] as const).map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
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

      {/* 3. Section 6: Janam Tithi (Birth Details) */}
      {activeSubTab === "Janam Tithi" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF5A36] font-bold text-xs flex items-center justify-center">
                6
              </span>
              <h3 className="text-sm font-bold text-slate-900">Janam Tithi (Date of Birth) Details</h3>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Vikram Samvat 2037
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Janam Tithi (Date of Birth)</span>
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
                <span>Corresponding Gregorian Date</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.dateOfBirthGregorian}
                  onChange={(e) => setFormData({ ...formData, dateOfBirthGregorian: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.dateOfBirthGregorian}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Place of Birth</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-medium text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>{formData.placeOfBirth}</span>
                </div>
              )}
            </div>

            {/* Janam Patrika file block */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Janam Patrika (If Available)</label>
              <div className="bg-orange-50/40 rounded-2xl p-3.5 border border-orange-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{formData.janamPatrikaFileName}</div>
                    <div className="text-[11px] text-slate-500">{formData.janamPatrikaFileSize} • Verified Astrological Kundali</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPatrika}
                    className="px-3 py-1.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-orange-100 flex justify-end">
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
                  className="px-6 py-2 bg-[#FF5A36] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Janam Tithi
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center"
              >
                Edit Janam Tithi
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Section 7: Punyatithi (Tithi of Mahasamadhi) */}
      {activeSubTab === "Punyatithi" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF5A36] font-bold text-xs flex items-center justify-center">
                7
              </span>
              <h3 className="text-sm font-bold text-slate-900">Punyatithi (Tithi of Mahasamadhi)</h3>
            </div>
            <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Vedic Samadhi Record
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Punyatithi (Date of Mahasamadhi)</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.punyatithiVS}
                  onChange={(e) => setFormData({ ...formData, punyatithiVS: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.punyatithiVS}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Corresponding Gregorian Date</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.punyatithiGregorian}
                  onChange={(e) => setFormData({ ...formData, punyatithiGregorian: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.punyatithiGregorian}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Place of Mahasamadhi</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.placeOfMahasamadhi}
                  onChange={(e) => setFormData({ ...formData, placeOfMahasamadhi: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-medium text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>{formData.placeOfMahasamadhi}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tithi Type</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.tithiType}
                  onChange={(e) => setFormData({ ...formData, tithiType: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-bold text-slate-800 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.tithiType}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Time of Mahasamadhi</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.timeOfMahasamadhi}
                  onChange={(e) => setFormData({ ...formData, timeOfMahasamadhi: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.timeOfMahasamadhi}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-orange-100 flex justify-end">
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
                  className="px-6 py-2 bg-[#FF5A36] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Punyatithi
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center"
              >
                Edit Punyatithi
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Section 8: Shraddha & Annual Rituals */}
      {activeSubTab === "Shraddha" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF5A36] font-bold text-xs flex items-center justify-center">
                8
              </span>
              <h3 className="text-sm font-bold text-slate-900">Shraddha & Annual Rituals</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Vedic Vidhi & Tarpan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Annual Shraddha Date</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.annualShraddhaDate}
                  onChange={(e) => setFormData({ ...formData, annualShraddhaDate: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.annualShraddhaDate}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tithi Type</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.shraddhaTithiType}
                  onChange={(e) => setFormData({ ...formData, shraddhaTithiType: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-bold text-slate-800 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.shraddhaTithiType}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shraddha Vidhi</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.shraddhaVidhi}
                  onChange={(e) => setFormData({ ...formData, shraddhaVidhi: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.shraddhaVidhi}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location for Shraddha</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.shraddhaLocation}
                  onChange={(e) => setFormData({ ...formData, shraddhaLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-medium text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.shraddhaLocation}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes & Ritual Instructions</label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={formData.shraddhaNotes}
                  onChange={(e) => setFormData({ ...formData, shraddhaNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
                />
              ) : (
                <div className="text-xs text-slate-700 bg-orange-50/30 p-3 rounded-xl border border-orange-100 leading-relaxed">
                  {formData.shraddhaNotes}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-orange-100 flex justify-end">
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
                  className="px-6 py-2 bg-[#FF5A36] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Shraddha Details
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center"
              >
                Edit Shraddha Details
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
