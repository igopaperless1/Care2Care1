import React, { useState } from "react";
import {
  Heart,
  Gift,
  Star,
  Flag,
  Sparkles,
  Plus,
  Compass,
  Briefcase,
  ChevronRight,
  BookOpen,
  Award,
  CheckCircle2,
  X
} from "lucide-react";
import { EventCategory, LifeDatesTab } from "./types";

interface LifeDatesCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  onNavigate: (tab: LifeDatesTab) => void;
}

interface CategoryCardItem {
  id: string;
  name: EventCategory;
  count: number;
  icon: any;
  colorClass: string;
  bgClass: string;
  targetTab?: LifeDatesTab;
}

export const LifeDatesCategories: React.FC<LifeDatesCategoriesProps> = ({
  onSelectCategory,
  onNavigate
}) => {
  const [categories, setCategories] = useState<CategoryCardItem[]>([
    {
      id: "cat-1",
      name: "Anniversary",
      count: 12,
      icon: Heart,
      colorClass: "text-rose-500 fill-rose-500",
      bgClass: "bg-rose-50 border-rose-200",
    },
    {
      id: "cat-2",
      name: "Birthday",
      count: 18,
      icon: Gift,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-50 border-amber-200",
    },
    {
      id: "cat-3",
      name: "Special Day",
      count: 8,
      icon: Star,
      colorClass: "text-amber-600",
      bgClass: "bg-orange-50 border-orange-200",
    },
    {
      id: "cat-4",
      name: "Personal Milestone",
      count: 10,
      icon: Flag,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50 border-emerald-200",
    },
    {
      id: "cat-5",
      name: "Couple Goal",
      count: 6,
      icon: Heart,
      colorClass: "text-[#FF5A36] fill-[#FF5A36]",
      bgClass: "bg-[#FFF2EB] border-orange-200",
      targetTab: "couple_goals",
    },
    {
      id: "cat-6",
      name: "Cultural & Ritual",
      count: 7,
      icon: Sparkles,
      colorClass: "text-purple-600",
      bgClass: "bg-purple-50 border-purple-200",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: CategoryCardItem = {
      id: "cat-" + Date.now(),
      name: (newCatName as any) || "Custom Event",
      count: 0,
      icon: Sparkles,
      colorClass: "text-indigo-600",
      bgClass: "bg-indigo-50 border-indigo-200",
    };

    setCategories((prev) => [...prev, newCat]);
    setIsAddModalOpen(false);
    setNewCatName("");
  };

  return (
    <div className="space-y-4">
      {/* 6-GRID CATEGORY CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.targetTab) {
                  onNavigate(cat.targetTab);
                } else {
                  onSelectCategory(cat.name);
                }
              }}
              className={`p-5 rounded-3xl border ${cat.bgClass} flex flex-col items-center justify-center text-center cursor-pointer hover:scale-102 hover:shadow-xs transition-all duration-200 shadow-2xs group min-h-[140px]`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon className={`w-6 h-6 ${cat.colorClass}`} />
              </div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">
                {cat.name === "Anniversary" ? "Anniversaries" : cat.name === "Birthday" ? "Birthdays" : cat.name}
              </h4>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                {cat.count} {cat.name === "Couple Goal" ? "Goals" : "Events"}
              </p>
            </div>
          );
        })}
      </div>

      {/* CULTURAL / VEDIC QUICK PRESET CATEGORIES */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5A36]" />
            <h3 className="text-sm font-black text-slate-900">Cultural & Vedic Milestones</h3>
          </div>
          <span className="text-[11px] font-bold text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-full">
            Nepal & Tithi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
          <button
            onClick={() => onSelectCategory("Cultural & Ritual")}
            className="p-2.5 rounded-2xl bg-white border border-orange-200/70 hover:border-[#FF5A36] text-slate-700 text-left transition-colors cursor-pointer"
          >
            Nwaran (Name-giving)
          </button>
          <button
            onClick={() => onSelectCategory("Cultural & Ritual")}
            className="p-2.5 rounded-2xl bg-white border border-orange-200/70 hover:border-[#FF5A36] text-slate-700 text-left transition-colors cursor-pointer"
          >
            Pasni (First Rice)
          </button>
          <button
            onClick={() => onSelectCategory("Cultural & Ritual")}
            className="p-2.5 rounded-2xl bg-white border border-orange-200/70 hover:border-[#FF5A36] text-slate-700 text-left transition-colors cursor-pointer"
          >
            Bratabandha / Janeu
          </button>
          <button
            onClick={() => onSelectCategory("Cultural & Ritual")}
            className="p-2.5 rounded-2xl bg-white border border-orange-200/70 hover:border-[#FF5A36] text-slate-700 text-left transition-colors cursor-pointer"
          >
            Gunyo Cholo
          </button>
        </div>
      </div>

      {/* PRIMARY BUTTON: ADD NEW CATEGORY */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Category</span>
      </button>

      {/* MODAL: ADD CATEGORY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add Category</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Travel & Trips"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
