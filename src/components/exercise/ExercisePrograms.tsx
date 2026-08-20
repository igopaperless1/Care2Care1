import React from "react";
import { FEATURED_PROGRAMS } from "./data";
import { Trophy, Clock, Star, Users, ChevronRight, Sparkles, Check } from "lucide-react";
import { WorkoutProgram } from "./types";

interface ExerciseProgramsProps {
  onSelectProgram: (program: WorkoutProgram) => void;
}

export const ExercisePrograms: React.FC<ExerciseProgramsProps> = ({
  onSelectProgram,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Featured Programs
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Multi-week structured periodized training roadmaps for guaranteed transformation
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {FEATURED_PROGRAMS.map((prog) => (
          <div
            key={prog.id}
            onClick={() => onSelectProgram(prog)}
            className="group bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 hover:border-[#FF5A36] rounded-3xl p-4 sm:p-5 transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white border border-orange-100 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                🏆
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                    {prog.title}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-200/60">
                    {prog.difficulty}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 line-clamp-2">
                  {prog.description}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-orange-600">
                    <Clock className="w-3.5 h-3.5" /> {prog.durationWeeks} Weeks
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {prog.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {(prog.enrolledCount / 1000).toFixed(1)}k enrolled
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end sm:justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProgram(prog);
                }}
                className="px-4 py-2 rounded-xl bg-white group-hover:bg-[#FF5A36] text-[#FF5A36] group-hover:text-white border border-orange-200 text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span>Enroll Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
