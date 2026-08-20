import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Clock,
  Sparkles,
  Dumbbell,
  Square
} from "lucide-react";
import { ExerciseItem } from "./types";

interface ActiveWorkoutSessionProps {
  workoutName: string;
  exercises: ExerciseItem[];
  onFinishWorkout: (summary: { totalTimeMins: number; calories: number; setsCompleted: number }) => void;
  onExitWorkout: () => void;
}

export const ActiveWorkoutSession: React.FC<ActiveWorkoutSessionProps> = ({
  workoutName,
  exercises,
  onFinishWorkout,
  onExitWorkout,
}) => {
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(2);
  const [totalSets] = useState(4);
  const [isResting, setIsResting] = useState(true);
  const [restRemaining, setRestRemaining] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(420); // 7 mins in

  const currentExercise = exercises[currentExIdx] || exercises[0] || {
    name: "Dumbbell Bench Press",
    bodyPart: "Chest",
    sets: 4,
    reps: 10,
  };

  const nextExercise = exercises[currentExIdx + 1] || exercises[0];

  // Rest Timer Interval
  useEffect(() => {
    if (!isResting || isPaused) return;

    const timer = setInterval(() => {
      setRestRemaining((prev) => {
        if (prev <= 1) {
          setIsResting(false);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResting, isPaused]);

  // Overall workout elapsed timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setTotalElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleNextSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet((s) => s + 1);
      setIsResting(true);
      setRestRemaining(45);
    } else {
      if (currentExIdx < exercises.length - 1) {
        setCurrentExIdx((i) => i + 1);
        setCurrentSet(1);
        setIsResting(true);
        setRestRemaining(45);
      } else {
        // Complete workout!
        onFinishWorkout({
          totalTimeMins: Math.round(totalElapsedSeconds / 60),
          calories: Math.round((totalElapsedSeconds / 60) * 8.5),
          setsCompleted: exercises.length * 3,
        });
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExitWorkout}
          className="flex items-center gap-1 text-xs font-black text-[#FF5A36] hover:text-[#EA4C27] bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Pause & Exit</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700 bg-white px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#FF5A36]" />
            {formatTimer(totalElapsedSeconds)}
          </span>
        </div>
      </div>

      {/* ACTIVE WORKOUT CANVAS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 text-center">
        {/* CURRENT EXERCISE BANNER */}
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-3 py-0.5 rounded-full border border-orange-200 inline-block">
            In Progress
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {currentExercise.name}
          </h2>
          <p className="text-xs font-black text-slate-500">
            Set {currentSet} of {totalSets}
          </p>
        </div>

        {/* REST TIMER CIRCULAR GAUGE */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-orange-100"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-[#FF5A36]"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - restRemaining / 45)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Rest Time
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight my-0.5">
              {formatTimer(restRemaining)}
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-[10px] font-black text-[#FF5A36] hover:underline flex items-center gap-1 mt-1 cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 fill-[#FF5A36]" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>
          </div>
        </div>

        {/* REST CONTROLS */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setRestRemaining((r) => r + 15)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-xs font-black text-slate-700 cursor-pointer shadow-2xs"
          >
            +15s
          </button>
          <button
            onClick={() => setIsResting(false)}
            className="px-4 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#FF5A36] text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip Rest</span>
          </button>
        </div>

        {/* NEXT UP CARD */}
        {nextExercise && (
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 shadow-2xs text-left flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Next Up
              </span>
              <h4 className="text-xs font-black text-slate-900 mt-0.5">
                {nextExercise.name}
              </h4>
              <span className="text-[11px] font-bold text-orange-600">
                {nextExercise.sets} sets × {nextExercise.reps} reps
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-lg">
              🏋️
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onExitWorkout}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Square className="w-4 h-4" />
            <span>End Workout</span>
          </button>

          <button
            onClick={handleNextSet}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Next Set</span>
          </button>
        </div>
      </div>
    </div>
  );
};
