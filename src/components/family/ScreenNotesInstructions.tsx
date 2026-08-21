import React, { useState } from "react";
import {
  Scroll,
  BookOpen,
  HeartHandshake,
  Edit2,
  Save,
  Check,
  Sparkles,
  Info
} from "lucide-react";
import { GuruProfile, FamilyTab } from "./types";

interface ScreenNotesInstructionsProps {
  profile: GuruProfile;
  onUpdateProfile: (updated: Partial<GuruProfile>) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenNotesInstructions: React.FC<ScreenNotesInstructionsProps> = ({
  profile,
  onUpdateProfile,
  onNavigate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [personalNotes, setPersonalNotes] = useState(
    "Guru Ji guided me in difficult times. Treat them as second parents. Always seek blessings before any important decision."
  );
  const [familyInstructions, setFamilyInstructions] = useState(
    "On Guru Ji's death anniversary, all family members must observe fast, perform Shraddha and Tarpan."
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    "Follow their teachings and continue seva to the ashram."
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
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
            12
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Notes & Special Instructions</h2>
            <p className="text-xs text-slate-500">Personal reflections, family mandates & sacred guru updesh records</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* 2. Main Content Card (Matching Card 12) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-5">
        {/* Personal Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Personal Notes</span>
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs text-slate-900 leading-relaxed focus:outline-none"
            />
          ) : (
            <div className="text-xs text-slate-700 bg-orange-50/30 p-3.5 rounded-2xl border border-orange-100 leading-relaxed font-medium">
              {personalNotes}
            </div>
          )}
        </div>

        {/* Instructions for Family */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Scroll className="w-3.5 h-3.5 text-amber-600" />
            <span>Instructions for Family</span>
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={familyInstructions}
              onChange={(e) => setFamilyInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs text-slate-900 leading-relaxed focus:outline-none"
            />
          ) : (
            <div className="text-xs text-slate-700 bg-orange-50/30 p-3.5 rounded-2xl border border-orange-100 leading-relaxed font-medium">
              {familyInstructions}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Additional Notes</span>
          </label>
          {isEditing ? (
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs text-slate-900 leading-relaxed focus:outline-none"
            />
          ) : (
            <div className="text-xs text-slate-700 bg-orange-50/30 p-3 rounded-2xl border border-orange-100 leading-relaxed font-medium">
              {additionalNotes}
            </div>
          )}
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
              Edit Notes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
