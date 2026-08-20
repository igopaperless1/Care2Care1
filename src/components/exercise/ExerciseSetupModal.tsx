import React, { useState } from "react";
import {
  ChevronLeft,
  Minus,
  Plus,
  Clock,
  Play,
  CheckCircle2,
  Sparkles,
  Dumbbell
} from "lucide-react";
import { ExerciseItem } from "./types";

interface ExerciseSetupModalProps {
  exercise: ExerciseItem;
  currentSetNumber?: number;
  totalSets?: number;
  onBack: () => void;
  onCompleteSet: (reps: number, weightKg: number, notes: string) => void;
}

export const ExerciseSetupModal: React.FC<ExerciseSetupModalProps> = ({
  exercise,
  currentSetNumber = 1,
  totalSets = 4,
  onBack,
  onCompleteSet,
}) => {
  const [reps, setReps] = useState<number>(exercise.reps || 10);
  const [weightKg, setWeightKg] = useState<number>(exercise.weightKg || 20);
  const [restSeconds, setRestSeconds] = useState<number>(60);
  const [notes, setNotes] = useState<string>("");

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-black text-[#FF5A36] hover:text-[#EA4C27] bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
          Set {currentSetNumber} of {totalSets}
        </span>
      </div>

      {/* SETUP CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {exercise.name}
          </h2>
          <p className="text-xs font-bold text-orange-600">
            Set {currentSetNumber} of {totalSets} Configuration
          </p>
        </div>

        {/* REPS COUNTER */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-2xs space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block text-center">
            Reps Target
          </span>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setReps((r) => Math.max(1, r - 1))}
              className="w-12 h-12 rounded-2xl bg-orange-50 hover:bg-orange-100 active:scale-95 text-[#FF5A36] flex items-center justify-center font-black transition-all cursor-pointer border border-orange-200"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-black text-slate-900 w-16 text-center">
              {reps}
            </span>
            <button
              onClick={() => setReps((r) => r + 1)}
              className="w-12 h-12 rounded-2xl bg-[#FF5A36] hover:bg-[#EA4C27] active:scale-95 text-white flex items-center justify-center font-black transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WEIGHT (KG) COUNTER */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-2xs space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block text-center">
            Weight (kg)
          </span>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setWeightKg((w) => Math.max(0, w - 2.5))}
              className="w-12 h-12 rounded-2xl bg-orange-50 hover:bg-orange-100 active:scale-95 text-[#FF5A36] flex items-center justify-center font-black transition-all cursor-pointer border border-orange-200"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-black text-slate-900 w-20 text-center">
              {weightKg} <span className="text-xs text-slate-400 font-bold">kg</span>
            </span>
            <button
              onClick={() => setWeightKg((w) => w + 2.5)}
              className="w-12 h-12 rounded-2xl bg-[#FF5A36] hover:bg-[#EA4C27] active:scale-95 text-white flex items-center justify-center font-black transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* REST TIMER SELECTOR */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-800 block">Rest Interval</span>
              <span className="text-[11px] font-bold text-slate-500">Auto timer between sets</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={restSeconds}
              onChange={(e) => setRestSeconds(Number(e.target.value))}
              className="text-xs font-black bg-orange-50 border border-orange-200 text-orange-900 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value={30}>00:30</option>
              <option value={45}>00:45</option>
              <option value={60}>01:00</option>
              <option value={90}>01:30</option>
              <option value={120}>02:00</option>
            </select>
          </div>
        </div>

        {/* NOTES */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-2xs space-y-1.5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Notes (Optional)
          </span>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did this set feel? Form adjustments..."
            className="w-full text-xs font-semibold text-slate-800 placeholder:text-slate-400 bg-orange-50/40 p-2.5 rounded-xl border border-orange-100 focus:outline-none focus:border-[#FF5A36]"
          />
        </div>

        {/* COMPLETE SET BUTTON */}
        <button
          onClick={() => onCompleteSet(reps, weightKg, notes)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Complete Set</span>
        </button>
      </div>
    </div>
  );
};
