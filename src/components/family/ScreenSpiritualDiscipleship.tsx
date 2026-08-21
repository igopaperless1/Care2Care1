import React, { useState } from "react";
import {
  Sparkles,
  Award,
  Users,
  Calendar,
  HeartHandshake,
  BookOpen,
  Edit2,
  Save,
  Check,
  ShieldAlert,
  Flame,
  UserCheck
} from "lucide-react";
import { GuruProfile, FamilyTab } from "./types";

interface ScreenSpiritualDiscipleshipProps {
  profile: GuruProfile;
  onUpdateProfile: (updated: Partial<GuruProfile>) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenSpiritualDiscipleship: React.FC<ScreenSpiritualDiscipleshipProps> = ({
  profile,
  onUpdateProfile,
  onNavigate
}) => {
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
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            3
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Spiritual & Discipleship Details</h2>
            <p className="text-xs text-slate-500">Diksha lineage, initiation mantras, spiritual directives & family updesh</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* 2. Main Content Card (Matching Card 3) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Disciple Since */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Disciple Since</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.discipleSince}
                onChange={(e) => setFormData({ ...formData, discipleSince: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            ) : (
              <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                {formData.discipleSince}
              </div>
            )}
          </div>

          {/* Initiation Mantra */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Initiation Mantra (If Given)</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.initiationMantra}
                onChange={(e) => setFormData({ ...formData, initiationMantra: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            ) : (
              <div className="text-xs font-black text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 tracking-wide font-mono">
                {formData.initiationMantra}
              </div>
            )}
          </div>

          {/* Spiritual Guidance For */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Spiritual Guidance For</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.spiritualGuidanceFor}
                onChange={(e) => setFormData({ ...formData, spiritualGuidanceFor: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            ) : (
              <div className="text-xs font-medium text-slate-800 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                {formData.spiritualGuidanceFor}
              </div>
            )}
          </div>

          {/* Disciples (Shishya) Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Disciples (Shishya) Count</span>
              <Users className="w-3.5 h-3.5 text-[#FF5A36]" />
            </label>
            {isEditing ? (
              <input
                type="number"
                value={formData.totalDisciples}
                onChange={(e) => setFormData({ ...formData, totalDisciples: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            ) : (
              <div className="text-xs font-bold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center justify-between">
                <span>{formData.totalDisciples}+ Disciples</span>
                <button
                  type="button"
                  onClick={() => onNavigate("disciples")}
                  className="text-[10px] text-[#FF5A36] hover:underline font-bold"
                >
                  View Directory &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Role In Your Life */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Role in Your Life</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.roleInLife}
                onChange={(e) => setFormData({ ...formData, roleInLife: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            ) : (
              <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#FF5A36]" />
                <span>{formData.roleInLife}</span>
              </div>
            )}
          </div>

          {/* Teachings / Updesh */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Teachings / Updesh</label>
            {isEditing ? (
              <textarea
                rows={3}
                value={formData.teachingsUpdesh}
                onChange={(e) => setFormData({ ...formData, teachingsUpdesh: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            ) : (
              <div className="text-xs text-slate-800 bg-orange-50/30 p-3 rounded-xl border border-orange-100 leading-relaxed italic">
                "{formData.teachingsUpdesh}"
              </div>
            )}
          </div>

          {/* Special Instructions */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Instructions</label>
            {isEditing ? (
              <textarea
                rows={3}
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            ) : (
              <div className="text-xs text-slate-800 bg-orange-50/30 p-3 rounded-xl border border-orange-100 leading-relaxed">
                {formData.specialInstructions}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-orange-100 flex justify-end">
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
              className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center"
            >
              Edit Spiritual Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
