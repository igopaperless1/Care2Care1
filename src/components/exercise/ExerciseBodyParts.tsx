import React from "react";
import { BODY_PARTS_LIST } from "./data";
import { ChevronRight, Dumbbell, Sparkles } from "lucide-react";

interface ExerciseBodyPartsProps {
  onSelectBodyPart: (bodyPart: string) => void;
}

export const ExerciseBodyParts: React.FC<ExerciseBodyPartsProps> = ({
  onSelectBodyPart,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Select Body Part
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Choose a target muscle group to explore targeted workouts & exercises
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {BODY_PARTS_LIST.map((part) => (
          <button
            key={part.id}
            onClick={() => onSelectBodyPart(part.id)}
            className="group relative overflow-hidden bg-[#FFF9F5] hover:bg-[#FFF2EB] active:scale-98 border border-orange-200/80 hover:border-[#FF5A36] rounded-3xl p-4 sm:p-5 text-left transition-all cursor-pointer shadow-xs flex flex-col justify-between min-h-[140px]"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                {part.icon}
              </div>
              <span className="text-[10px] font-black text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-200/60">
                {part.count} ex
              </span>
            </div>

            {/* Bottom info */}
            <div className="mt-3">
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                {part.name}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 line-clamp-1 mt-0.5">
                {part.subtitle}
              </p>
            </div>

            <div className="absolute bottom-3 right-3 text-[#FF5A36] opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
