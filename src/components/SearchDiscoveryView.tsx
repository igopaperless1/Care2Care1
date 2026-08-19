import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Flame,
  Droplets,
  Heart,
  Moon,
  Footprints,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle2,
  Trophy
} from "lucide-react";
import { CareChip, CareCard } from "../design-system";

interface SearchDiscoveryViewProps {
  onSelectChallenge?: (id: string) => void;
  onSelectService?: (id: string) => void;
}

export const SearchDiscoveryView: React.FC<SearchDiscoveryViewProps> = ({
  onSelectChallenge,
  onSelectService
}) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const popularTags = [
    "Gratitude",
    "Cold Shower",
    "No Sugar",
    "Sleep Early",
    "Gym 21 Days",
    "7k Steps",
    "Meditation",
    "Water 2.5L"
  ];

  const recommended = [
    {
      id: "gratitude-21",
      title: "Gratitude Challenge",
      desc: "21 days of daily gratitude journaling & positive neuroplasticity prompts.",
      category: "Mind & Wellbeing",
      icon: "✨",
      days: 21,
      color: "from-amber-400 to-orange-500",
      enrolled: 1420
    },
    {
      id: "sugar-detox-7",
      title: "7-Day Sugar Detox",
      desc: "Reset your metabolism, banish sweet cravings, and boost sustained energy.",
      category: "Nutrition",
      icon: "🥗",
      days: 7,
      color: "from-emerald-400 to-teal-500",
      enrolled: 980
    },
    {
      id: "water-21",
      title: "Hydration Master Routine",
      desc: "Hit 2,500 ml daily water intake with hourly proof and reminder logging.",
      category: "Health & Body",
      icon: "💧",
      days: 21,
      color: "from-sky-400 to-blue-500",
      enrolled: 3100
    },
    {
      id: "deep-sleep-21",
      title: "Deep Rest & Sleep Rhythm",
      desc: "Stabilize 8-hour sleep cycles with binaural soundscapes and smart alarms.",
      category: "Health & Body",
      icon: "🌙",
      days: 21,
      color: "from-indigo-400 to-purple-600",
      enrolled: 2450
    }
  ];

  const filtered = recommended.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#FF6A45]" /> Search & Discovery
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Explore 21-day lifestyle challenges, habit routines, health guides & care modules
          </p>
        </div>

        {/* Big Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, challenges, articles..."
            className="w-full bg-[#FFF8F5] dark:bg-slate-850 border border-[#FFE2D6] dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6A45] transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Popular Searches */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Popular Searches
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  query === tag
                    ? "bg-[#FF6A45] text-white border-[#EA580C]"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Challenges Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> Recommended Challenges
          </h2>
          <span className="text-[11px] font-bold text-slate-400">
            {filtered.length} found
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectChallenge?.(item.id)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEEDB] dark:bg-orange-950/60 text-2xl flex items-center justify-center shadow-2xs shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 text-[#C2410C] dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    {item.days} Days Goal
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-[#FF6A45] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-400">
                  {item.enrolled.toLocaleString()} Active Challengers
                </span>
                <span className="text-xs font-black text-[#FF6A45] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Start Plan <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
