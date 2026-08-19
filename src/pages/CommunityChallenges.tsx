import React, { useState } from "react";
import { motion } from "motion/react";
import { HabitChallenge } from "../types";
import {
  ArrowLeft,
  Heart,
  ArrowRight,
  Sparkles,
  Users,
  Search,
  Flame,
  Plus
} from "lucide-react";

interface CommunityChallengeItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  author: string;
  likes: number;
  description: string;
}

const INITIAL_COMMUNITY_CHALLENGES: CommunityChallengeItem[] = [
  {
    id: "comm-1",
    title: "10,000 Steps & Sunshine Walk",
    category: "Health & Fitness",
    icon: "👟",
    author: "Psycho_Scientist",
    likes: 33,
    description: "Daily outdoor walking and circadian sunlight syncing."
  },
  {
    id: "comm-2",
    title: "Zero Processed Sugar Reset",
    category: "Nutrition",
    icon: "🥑",
    author: "Elena_Wellness",
    likes: 87,
    description: "21 consecutive days of whole foods and steady glucose."
  },
  {
    id: "comm-3",
    title: "Deep Work: 90-min Morning Block",
    category: "Productivity",
    icon: "⚡",
    author: "DevCraft_Master",
    likes: 114,
    description: "No phone, no notifications for the first 90 minutes of work."
  },
  {
    id: "comm-4",
    title: "Daily Journaling & Stoic Reflection",
    category: "Mindfulness",
    icon: "📖",
    author: "Marcus_Reads",
    likes: 62,
    description: "Evening reflections on gratitude, control, and character."
  },
  {
    id: "comm-5",
    title: "Cold Shower Resilience Routine",
    category: "Self Love",
    icon: "🚿",
    author: "Wim_Breather",
    likes: 49,
    description: "2 minutes of ice-cold water therapy every morning."
  },
  {
    id: "comm-6",
    title: "Read 20 Pages of Non-Fiction",
    category: "Learning",
    icon: "📚",
    author: "BookWorm_99",
    likes: 95,
    description: "Expand your intellect daily with high-impact books."
  }
];

interface CommunityChallengesProps {
  onBack: () => void;
  onStartCommunityChallenge: (challenge: HabitChallenge) => void;
  onOpenCreate: () => void;
}

export const CommunityChallenges: React.FC<CommunityChallengesProps> = ({
  onBack,
  onStartCommunityChallenge,
  onOpenCreate
}) => {
  const [items, setItems] = useState<CommunityChallengeItem[]>(INITIAL_COMMUNITY_CHALLENGES);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedIds.includes(id)) {
      setLikedIds((prev) => prev.filter((i) => i !== id));
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, likes: item.likes - 1 } : item))
      );
    } else {
      setLikedIds((prev) => [...prev, id]);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
      );
    }
  };

  const handleSelect = (item: CommunityChallengeItem) => {
    const chal: HabitChallenge = {
      id: `comm-inst-${item.id}`,
      title: `${item.icon} ${item.title}`,
      description: item.description,
      category: "Personal Growth",
      currentDay: 1,
      totalDays: 21,
      status: "Active",
      streakCount: 0,
      icon: item.icon,
      color: "#FFC9A7",
      completedDays: [],
      missedDays: 0,
      createdAt: new Date().toISOString()
    };
    onStartCommunityChallenge(chal);
  };

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.author.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#FFF8F3] dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center cursor-pointer shadow-2xs hover:bg-orange-50 transition-all"
            title="Return"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌍</span>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Community Challenges
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Discover and start habit quests created by fellow challengers
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="px-3.5 py-2 bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950 font-black text-xs rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 text-orange-950" />
          <span>Publish Quest</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title, author (e.g. Psycho_Scientist), or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm rounded-2xl pl-10 pr-4 py-2.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Vertical List of White Rounded Horizontal Cards */}
      <div className="space-y-2.5">
        {filtered.map((item) => {
          const isLiked = likedIds.includes(item.id);

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleSelect(item)}
              className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-orange-300 transition-all"
            >
              {/* Left Side Icon + Middle Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8F3] dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 text-2xl flex items-center justify-center shrink-0 shadow-2xs">
                  {item.icon}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-orange-900 dark:text-orange-300">
                      Added by: {item.author}
                    </span>
                    <span>•</span>
                    <span className="truncate">{item.category}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Heart Like Count + Navigation Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleToggleLike(item.id, e)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                    isLiked
                      ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                      : "bg-[#FFF8F3] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500"
                  }`}
                  title="Like this challenge"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{item.likes}</span>
                </button>

                <div className="w-9 h-9 rounded-xl bg-[#FFC9A7] text-orange-950 flex items-center justify-center shadow-2xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
