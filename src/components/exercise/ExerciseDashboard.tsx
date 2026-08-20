import React from "react";
import {
  Flame,
  Clock,
  Dumbbell,
  Play,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Trophy,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
  Heart,
  Target
} from "lucide-react";
import { ExerciseTab, WorkoutPlan } from "./types";

interface ExerciseDashboardProps {
  onNavigate: (tab: ExerciseTab) => void;
  onStartWorkout: () => void;
  currentPlan?: WorkoutPlan;
}

export const ExerciseDashboard: React.FC<ExerciseDashboardProps> = ({
  onNavigate,
  onStartWorkout,
  currentPlan,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* GREETING */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
            Good Morning, Roshan <span className="animate-bounce inline-block">👋</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Let's crush your fitness goals today!
          </p>
        </div>
        <button
          onClick={() => onNavigate("builder")}
          className="px-3 py-1.5 rounded-xl bg-orange-100/70 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Custom Builder</span>
        </button>
      </div>

      {/* TODAY'S WORKOUT HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF2EB] via-[#FFE8DC] to-[#FEDBC9] border border-orange-200/80 p-5 sm:p-6 shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-sm">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-white/90 px-3 py-1 rounded-full border border-orange-200/60 shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#FF5A36]" />
              Today's Workout
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Upper Body Strength
            </h3>
            <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF5A36]" /> 45 min
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-orange-200/60 text-orange-900 text-[11px] font-black">
                Intermediate
              </span>
              <span>•</span>
              <span>6 Exercises</span>
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onStartWorkout}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Workout</span>
              </button>

              <button
                onClick={() => onNavigate("exercises")}
                className="px-4 py-3 rounded-2xl bg-white/80 hover:bg-white text-slate-700 font-black text-xs border border-orange-200/80 transition-all cursor-pointer"
              >
                View Exercises
              </button>
            </div>
          </div>

          {/* Character / Badge Visual */}
          <div className="hidden sm:flex items-center justify-center">
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#FF5A36] to-[#FFB09C] p-1 shadow-md flex items-center justify-center text-white">
              <div className="w-full h-full rounded-full bg-[#FFF9F5] flex flex-col items-center justify-center p-2 text-center">
                <span className="text-3xl">🏋️</span>
                <span className="text-[10px] font-black text-[#FF5A36] mt-1 uppercase tracking-wider">
                  Push / Pull
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY OVERVIEW */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#FF5A36]" />
            Activity Overview
          </h4>
          <span className="text-[11px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
            Week 20
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Workouts */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex flex-col items-center text-center shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center mb-1.5">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">12</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Workouts
            </span>
            <span className="text-[10px] font-extrabold text-orange-600 mt-0.5">This Week</span>
          </div>

          {/* Calories */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex flex-col items-center text-center shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center mb-1.5">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">2,450</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Calories
            </span>
            <span className="text-[10px] font-extrabold text-orange-600 mt-0.5">Burned</span>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex flex-col items-center text-center shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">6h 30m</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Duration
            </span>
            <span className="text-[10px] font-extrabold text-orange-600 mt-0.5">This Week</span>
          </div>
        </div>
      </div>

      {/* WEEKLY PROGRESS CIRCULAR GAUGE */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#FF5A36]" />
            Weekly Progress
          </h4>
          <button
            onClick={() => onNavigate("progress")}
            className="text-[11px] font-black text-[#FF5A36] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-100 flex flex-col sm:flex-row items-center justify-around gap-4 shadow-2xs">
          {/* Gauge */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-orange-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#FF5A36]"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - 0.75)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 tracking-tight">75%</span>
              <span className="text-[9px] font-black text-orange-600 uppercase tracking-wider">Goal</span>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="space-y-2.5 w-full sm:w-auto">
            <div className="flex items-center justify-between gap-6 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
                <span className="text-xs font-bold text-slate-700">Workouts Completed</span>
              </div>
              <span className="text-sm font-black text-slate-900">4</span>
            </div>

            <div className="flex items-center justify-between gap-6 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-xs font-bold text-slate-700">Workouts Remaining</span>
              </div>
              <span className="text-sm font-black text-slate-900">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK SERVICE HUBS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigate("body_parts")}
          className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs group"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-800">Body Parts</div>
            <div className="text-[10px] font-bold text-slate-500">8 Muscle Groups</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate("programs")}
          className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs group"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-800">Programs</div>
            <div className="text-[10px] font-bold text-slate-500">4 Featured</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate("plans")}
          className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs group"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-800">Workout Plans</div>
            <div className="text-[10px] font-bold text-slate-500">Push Pull Legs</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate("measurements")}
          className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 text-left transition-all cursor-pointer flex items-center gap-3 shadow-2xs group"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-800">Measurements</div>
            <div className="text-[10px] font-bold text-slate-500">75.6 kg (-1.2kg)</div>
          </div>
        </button>
      </div>
    </div>
  );
};
