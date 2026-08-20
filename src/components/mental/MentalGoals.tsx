import React, { useState } from "react";
import {
  Target,
  Plus,
  Flame,
  CheckCircle2,
  Trophy,
  Award,
  Sparkles,
  Check,
  RotateCcw,
  Droplets,
  Heart
} from "lucide-react";
import { MentalGoal } from "./types";
import { soundEngine } from "./soundEngine";

export const MentalGoals: React.FC = () => {
  const [goals, setGoals] = useState<MentalGoal[]>([
    {
      id: "g-1",
      title: "Daily Morning Meditation",
      targetDays: 7,
      completedDays: 5,
      streak: 5,
      frequency: "daily",
      category: "Mindfulness",
    },
    {
      id: "g-2",
      title: "8 Hours Sleep Nightly",
      targetDays: 7,
      completedDays: 6,
      streak: 6,
      frequency: "daily",
      category: "Sleep",
    },
    {
      id: "g-3",
      title: "Evening Gratitude Journal",
      targetDays: 7,
      completedDays: 4,
      streak: 4,
      frequency: "daily",
      category: "Journal",
    },
    {
      id: "g-4",
      title: "Screen-Free Wind Down 30m",
      targetDays: 5,
      completedDays: 3,
      streak: 3,
      frequency: "daily",
      category: "Habits",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("Mindfulness");

  const handleIncrement = (id: string) => {
    soundEngine.playChime(620, 0.3);
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = Math.min(g.targetDays, g.completedDays + 1);
          return { ...g, completedDays: next, streak: g.streak + 1 };
        }
        return g;
      })
    );
  };

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim()) return;
    soundEngine.playChime(650, 0.4);
    const newGoal: MentalGoal = {
      id: `g-${Date.now()}`,
      title: newGoalTitle.trim(),
      targetDays: 7,
      completedDays: 1,
      streak: 1,
      frequency: "daily",
      category: newGoalCategory,
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Habit Tracker
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Wellness Goals & Streaks</h2>
          <p className="text-xs text-slate-500 font-medium">Build lasting cognitive and mindfulness habits.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Habit</span>
        </button>
      </div>

      {/* 2. Streak Trophy Summary Card in Peach */}
      <div className="bg-gradient-to-r from-[#FF5A36] to-[#FF8B6B] rounded-3xl p-5 text-white shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <Flame className="w-6 h-6 text-amber-200 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-200">Current Best Streak</span>
            <h3 className="text-xl font-black">6 Days in a Row! 🔥</h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black">18 / 28</span>
          <span className="text-[10px] block opacity-80">Weekly Targets Met</span>
        </div>
      </div>

      {/* 3. Goals List */}
      <div className="space-y-3">
        {goals.map((g) => {
          const percent = Math.round((g.completedDays / g.targetDays) * 100);
          return (
            <div
              key={g.id}
              className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-md">
                    {g.category}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-1">{g.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                    <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                    {g.streak}d
                  </span>
                  <button
                    onClick={() => handleIncrement(g.id)}
                    className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 cursor-pointer"
                    title="Mark Done for Today"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Progress Bar in Peach */}
              <div className="space-y-1.5">
                <div className="h-2.5 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF5A36] rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>{g.completedDays} of {g.targetDays} days completed</span>
                  <span className="text-[#FF5A36] font-black">{percent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-100 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Add New Mindfulness Goal</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Habit Title</label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. 10m Evening Breathwork"
                  className="w-full p-3 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Category</label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="w-full p-3 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option>Mindfulness</option>
                  <option>Sleep</option>
                  <option>Journal</option>
                  <option>Breathing</option>
                  <option>Habits</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                className="flex-1 py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
              >
                Create Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
