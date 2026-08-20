import React, { useState } from "react";
import {
  ChevronLeft,
  Edit2,
  Clock,
  Dumbbell,
  Plus,
  Trash2,
  GripVertical,
  Check,
  Play,
  Sparkles
} from "lucide-react";
import { ExerciseItem } from "./types";

interface WorkoutBuilderProps {
  initialExercises: ExerciseItem[];
  onBack: () => void;
  onSaveWorkout: (name: string, exercises: ExerciseItem[]) => void;
  onStartWorkout: (name: string, exercises: ExerciseItem[]) => void;
  onOpenExerciseLibrary: () => void;
}

export const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  initialExercises,
  onBack,
  onSaveWorkout,
  onStartWorkout,
  onOpenExerciseLibrary,
}) => {
  const [workoutName, setWorkoutName] = useState("Upper Body Strength");
  const [isEditingName, setIsEditingName] = useState(false);
  const [exercisesList, setExercisesList] = useState<ExerciseItem[]>(initialExercises);

  const handleRemoveExercise = (id: string) => {
    setExercisesList((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleUpdateSetsReps = (id: string, setsDelta: number, repsDelta: number) => {
    setExercisesList((prev) =>
      prev.map((ex) => {
        if (ex.id !== id) return ex;
        return {
          ...ex,
          sets: Math.max(1, ex.sets + setsDelta),
          reps: Math.max(1, ex.reps + repsDelta),
        };
      })
    );
  };

  const estimatedMinutes = exercisesList.length * 7 + 5;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-black text-[#FF5A36] hover:text-[#EA4C27] bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
          Workout Builder
        </span>
      </div>

      {/* HEADER CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          {isEditingName ? (
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#FF5A36] text-base font-black text-slate-900 w-full"
                autoFocus
              />
              <button
                onClick={() => setIsEditingName(false)}
                className="p-2 rounded-xl bg-[#FF5A36] text-white text-xs font-black"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {workoutName}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#FF5A36] cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Workout Stats */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-white p-3 rounded-2xl border border-orange-100 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FF5A36]" />
            <span>Estimated Time: <b className="text-slate-900">{estimatedMinutes} min</b></span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-[#FF5A36]" />
            <span>Exercises: <b className="text-slate-900">{exercisesList.length}</b></span>
          </div>
        </div>

        {/* Exercise Items List */}
        <div className="space-y-2.5">
          {exercisesList.map((ex, idx) => (
            <div
              key={ex.id}
              className="bg-white border border-orange-100 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF5A36] text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-lg">
                  🏋️
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {ex.name}
                  </h4>
                  <p className="text-[11px] font-bold text-orange-600 mt-0.5">
                    {ex.sets} sets × {ex.reps} reps
                  </p>
                </div>
              </div>

              {/* Set/Rep Controls & Delete */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-orange-50/70 p-1 rounded-xl border border-orange-200/60 text-xs font-black text-slate-700">
                  <button
                    onClick={() => handleUpdateSetsReps(ex.id, -1, 0)}
                    className="w-6 h-6 rounded-lg bg-white hover:bg-orange-100 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-1 text-[11px]">{ex.sets}s</span>
                  <button
                    onClick={() => handleUpdateSetsReps(ex.id, 1, 0)}
                    className="w-6 h-6 rounded-lg bg-white hover:bg-orange-100 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveExercise(ex.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add more button */}
        <button
          onClick={onOpenExerciseLibrary}
          className="w-full py-3 rounded-2xl bg-white hover:bg-orange-50 border border-dashed border-orange-300 text-xs font-black text-[#FF5A36] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add More Exercises</span>
        </button>

        {/* Save and Start actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onSaveWorkout(workoutName, exercisesList)}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-slate-800 border border-orange-200 font-black text-xs transition-all cursor-pointer shadow-2xs"
          >
            Save Workout Plan
          </button>

          <button
            onClick={() => onStartWorkout(workoutName, exercisesList)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Active Workout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
