import React, { useState } from "react";
import { INITIAL_PLANS } from "./data";
import { Plus, Calendar, Check, Clock, ChevronRight, Dumbbell, Sparkles } from "lucide-react";
import { WorkoutPlan } from "./types";

interface ExercisePlansProps {
  plans?: WorkoutPlan[];
  onSelectPlan: (plan: WorkoutPlan) => void;
  onCreateNewPlan: () => void;
}

export const ExercisePlans: React.FC<ExercisePlansProps> = ({
  plans = INITIAL_PLANS,
  onSelectPlan,
  onCreateNewPlan,
}) => {
  const [activeTab, setActiveTab] = useState<"my_plans" | "discover">("my_plans");

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TABS: MY PLANS / DISCOVER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("my_plans")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "my_plans"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Plans
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "discover"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Discover
          </button>
        </div>

        <button
          onClick={onCreateNewPlan}
          className="px-3.5 py-1.5 rounded-xl bg-orange-100 text-[#FF5A36] hover:bg-orange-200 border border-orange-200 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Plan</span>
        </button>
      </div>

      {/* PLANS LIST */}
      <div className="space-y-3.5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(plan)}
            className="group bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 hover:border-[#FF5A36] rounded-3xl p-5 transition-all cursor-pointer shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                    {plan.name}
                  </h3>
                  {plan.isCurrent && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#FF5A36] px-2 py-0.5 rounded-full shadow-2xs">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {plan.daysPerWeek} Days per Week • {plan.difficulty}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                📋
              </div>
            </div>

            {/* Weekly Active Days Checklist */}
            <div className="bg-white rounded-2xl p-3 border border-orange-100 flex items-center justify-between gap-1 shadow-2xs">
              {DAYS.map((day) => {
                const isActive = plan.activeDays.includes(day);
                return (
                  <div key={day} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-[10px] font-bold text-slate-400">{day}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                        isActive
                          ? "bg-emerald-500 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-300"
                      }`}
                    >
                      {isActive ? <Check className="w-3.5 h-3.5" /> : "·"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Dumbbell className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>{plan.exercises.length} Exercises Configured</span>
              </div>

              <span className="text-xs font-black text-[#FF5A36] group-hover:underline flex items-center gap-1">
                Start Plan <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE PLAN BOTTOM BUTTON */}
      <button
        onClick={onCreateNewPlan}
        className="w-full py-3.5 rounded-2xl bg-white hover:bg-orange-50 border-2 border-dashed border-orange-300 text-xs font-black text-[#FF5A36] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
      >
        <Plus className="w-4 h-4" />
        <span>+ Create New Custom Plan</span>
      </button>
    </div>
  );
};
