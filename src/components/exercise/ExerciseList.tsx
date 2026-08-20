import React, { useState, useMemo } from "react";
import { Search, Filter, Star, Plus, Dumbbell, ChevronRight, Check } from "lucide-react";
import { ExerciseItem } from "./types";

interface ExerciseListProps {
  exercises: ExerciseItem[];
  selectedBodyPart?: string | null;
  onSelectExercise: (exercise: ExerciseItem) => void;
  onToggleFavorite: (id: string) => void;
  onClearBodyPartFilter: () => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  selectedBodyPart,
  onSelectExercise,
  onToggleFavorite,
  onClearBodyPartFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites" | "recent">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Search match
      const matchesSearch =
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.bodyPart.toLowerCase().includes(searchQuery.toLowerCase());

      // Tab filter
      const matchesTab =
        activeFilter === "all"
          ? true
          : activeFilter === "favorites"
          ? ex.isFavorite
          : true;

      // Body part filter
      const matchesBodyPart = selectedBodyPart ? ex.bodyPart === selectedBodyPart : true;

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === "All" ? true : ex.difficulty === selectedDifficulty;

      return matchesSearch && matchesTab && matchesBodyPart && matchesDifficulty;
    });
  }, [exercises, searchQuery, activeFilter, selectedBodyPart, selectedDifficulty]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Exercises
            {selectedBodyPart && (
              <span className="text-xs bg-orange-100 text-[#FF5A36] px-2.5 py-0.5 rounded-full border border-orange-200 flex items-center gap-1 font-bold">
                {selectedBodyPart}
                <button
                  onClick={onClearBodyPartFilter}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Explore curated movement library with biomechanics and form guides
          </p>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FFF9F5] border border-orange-200/80 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]"
          />
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === "all"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-orange-50 border border-orange-200/60"
          }`}
        >
          All ({exercises.length})
        </button>

        <button
          onClick={() => setActiveFilter("favorites")}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
            activeFilter === "favorites"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-orange-50 border border-orange-200/60"
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          Favorites ({exercises.filter((e) => e.isFavorite).length})
        </button>

        <button
          onClick={() => setActiveFilter("recent")}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === "recent"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-orange-50 border border-orange-200/60"
          }`}
        >
          Recent
        </button>

        {/* Difficulty quick toggle */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="ml-auto text-xs font-black text-slate-700 bg-white border border-orange-200/80 rounded-full px-3 py-1.5 focus:outline-none focus:border-[#FF5A36] cursor-pointer"
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* EXERCISES LIST */}
      <div className="space-y-2.5">
        {filteredExercises.length === 0 ? (
          <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-8 text-center space-y-2">
            <Dumbbell className="w-8 h-8 text-orange-300 mx-auto" />
            <p className="text-sm font-black text-slate-700">No exercises found</p>
            <p className="text-xs font-semibold text-slate-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className="group bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 hover:border-[#FF5A36] rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-xl shadow-2xs group-hover:scale-105 transition-transform">
                  🏋️
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors flex items-center gap-1.5">
                    {ex.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold text-slate-500">
                    <span className="font-bold text-orange-700">{ex.bodyPart}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-orange-100/70 text-orange-900 text-[10px] font-black">
                      {ex.difficulty}
                    </span>
                    <span>•</span>
                    <span>{ex.sets} sets × {ex.reps} reps</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onToggleFavorite(ex.id)}
                  className="p-2 rounded-xl hover:bg-orange-100/70 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                  title="Favorite"
                >
                  <Star
                    className={`w-4 h-4 ${
                      ex.isFavorite ? "fill-amber-400 text-amber-400" : ""
                    }`}
                  />
                </button>
                <div
                  onClick={() => onSelectExercise(ex)}
                  className="p-2 rounded-xl bg-white group-hover:bg-[#FF5A36] text-slate-400 group-hover:text-white border border-orange-100 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
