import React from "react";
import {
  ChevronLeft,
  Edit2,
  MoreVertical,
  Plus,
  Play,
  Layers,
  Sparkles,
  Dumbbell,
  CheckCircle2,
  Flame,
  Clock
} from "lucide-react";
import { ExerciseItem } from "./types";

interface ExerciseDetailsModalProps {
  exercise: ExerciseItem;
  onBack: () => void;
  onAddToWorkout: (exercise: ExerciseItem) => void;
  onStartExercise: (exercise: ExerciseItem) => void;
}

export const ExerciseDetailsModal: React.FC<ExerciseDetailsModalProps> = ({
  exercise,
  onBack,
  onAddToWorkout,
  onStartExercise,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-black text-[#FF5A36] hover:text-[#EA4C27] bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Exercises</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            {exercise.bodyPart}
          </span>
        </div>
      </div>

      {/* MAIN EXERCISE DETAILS CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        {/* Title & Muscle Area */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {exercise.name}
          </h2>
          <p className="text-xs font-bold text-orange-600 mt-0.5">
            Primary Focus: {exercise.bodyPart}
          </p>
        </div>

        {/* Visual Demonstration Canvas */}
        <div className="relative w-full h-48 sm:h-56 rounded-2xl bg-gradient-to-br from-[#FFE8DC] via-[#FEDBC9] to-[#FDD0B8] border border-orange-200/80 flex flex-col items-center justify-center p-4 text-center overflow-hidden shadow-inner">
          <div className="w-20 h-20 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-4xl mb-2">
            🏋️
          </div>
          <span className="text-xs font-black text-slate-800">
            Form & Kinetic Trajectory
          </span>
          <span className="text-[10px] font-bold text-orange-800/80">
            Eccentric: 2s • Pause: 1s • Concentric: 1s (Explosive)
          </span>
        </div>

        {/* 4 Feature Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Type */}
          <div className="bg-white rounded-2xl p-3 border border-orange-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Type
            </span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">
              {exercise.category}
            </span>
          </div>

          {/* Level */}
          <div className="bg-white rounded-2xl p-3 border border-orange-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Level
            </span>
            <span className="text-xs font-black text-orange-600 mt-0.5 block">
              {exercise.difficulty}
            </span>
          </div>

          {/* Equipment */}
          <div className="bg-white rounded-2xl p-3 border border-orange-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Equipment
            </span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block truncate">
              {exercise.equipment.join(", ")}
            </span>
          </div>

          {/* Muscles Worked */}
          <div className="bg-white rounded-2xl p-3 border border-orange-100 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Muscles Worked
            </span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block truncate">
              {exercise.musclesWorked.join(", ")}
            </span>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-2xs space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            Instructions
          </h4>
          <ol className="space-y-2.5">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF5A36] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onAddToWorkout(exercise)}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-[#FF5A36] border-2 border-[#FF5A36] font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Workout Builder</span>
          </button>

          <button
            onClick={() => onStartExercise(exercise)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Setup & Start Exercise</span>
          </button>
        </div>
      </div>
    </div>
  );
};
