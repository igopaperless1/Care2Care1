import React, { useState } from "react";
import {
  Heart,
  Plus,
  CheckCircle2,
  Trophy,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X
} from "lucide-react";
import { CoupleGoalItem } from "./types";
import { INITIAL_COUPLE_GOALS } from "./data";

interface LifeDatesCoupleGoalsProps {
  onAddGoalClick?: () => void;
}

export const LifeDatesCoupleGoals: React.FC<LifeDatesCoupleGoalsProps> = () => {
  const [filter, setFilter] = useState<"Active" | "Completed" | "All">("Active");
  const [goals, setGoals] = useState<CoupleGoalItem[]>(INITIAL_COUPLE_GOALS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Travel & Lifestyle");
  const [newTargetValue, setNewTargetValue] = useState(10);
  const [newCurrentValue, setNewCurrentValue] = useState(1);

  const handleIncrement = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const updatedCurrent = Math.min(g.currentValue + 1, g.targetValue);
        const percent = Math.round((updatedCurrent / g.targetValue) * 100);
        return {
          ...g,
          currentValue: updatedCurrent,
          progressPercent: percent,
          status: percent >= 100 ? "completed" : "active",
        };
      })
    );
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const percent = Math.round((newCurrentValue / (newTargetValue || 1)) * 100);
    const newGoal: CoupleGoalItem = {
      id: "g-" + Date.now(),
      title: newTitle,
      category: newCategory,
      currentValue: newCurrentValue,
      targetValue: newTargetValue,
      progressPercent: percent,
      status: percent >= 100 ? "completed" : "active",
    };

    setGoals((prev) => [newGoal, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle("");
  };

  const filteredGoals = goals.filter((g) => {
    if (filter === "Active") return g.status === "active";
    if (filter === "Completed") return g.status === "completed";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* FILTER PILLS */}
      <div className="flex items-center gap-2">
        {(["Active", "Completed", "All"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
              filter === tab
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                : "bg-[#FFF9F5] hover:bg-[#FFEFE8] text-slate-700 border-orange-200/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GOALS PROGRESS CARDS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-[#FF5A36] text-[#FF5A36]" />
            <h3 className="text-sm font-black text-slate-900">Our Shared Milestones</h3>
          </div>
          <span className="text-xs font-bold text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full">
            {goals.filter((g) => g.status === "completed").length}/{goals.length} Achieved
          </span>
        </div>

        <div className="space-y-3">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white border border-orange-200/80 hover:border-[#FF5A36]/60 rounded-2xl p-4 space-y-2.5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  {goal.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-700 font-mono">
                    {goal.unit ? `${goal.currentValue} / ${goal.targetValue}` : `${goal.progressPercent}%`}
                  </span>
                  {goal.status === "active" && (
                    <button
                      onClick={() => handleIncrement(goal.id)}
                      className="px-2 py-1 rounded-lg bg-orange-100 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white text-[11px] font-black transition-colors cursor-pointer"
                      title="Log +1 progress"
                    >
                      +1
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF7A59] to-[#FF5A36] transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
                />
              </div>

              {goal.notes && (
                <p className="text-[11px] font-medium text-slate-500">{goal.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PRIMARY BUTTON: ADD NEW GOAL */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Goal</span>
      </button>

      {/* MODAL: ADD NEW GOAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#FF5A36] fill-[#FF5A36]" />
                <h3 className="text-base font-black text-slate-900">Create Couple Goal</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Visit 5 National Parks together"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current</label>
                  <input
                    type="number"
                    value={newCurrentValue}
                    onChange={(e) => setNewCurrentValue(Number(e.target.value))}
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target</label>
                  <input
                    type="number"
                    value={newTargetValue}
                    onChange={(e) => setNewTargetValue(Number(e.target.value))}
                    min={1}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#FF5A36] hover:bg-[#EA4C27] text-white text-xs font-black cursor-pointer shadow-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
