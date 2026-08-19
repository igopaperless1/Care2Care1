import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { HabitChallenge, ChallengeCategory } from "../types";
import { PRESET_CHALLENGES } from "../data/challengePresets";
import {
  evaluateContentSafety,
  getAgeConsentStatus,
  ContentSafetyEvaluation
} from "../lib/safetyEngine";
import { AgeConsentModal } from "../components/AgeConsentModal";
import {
  Search,
  Play,
  Flame,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  Users,
  Compass,
  Heart,
  ShieldCheck,
  Lock
} from "lucide-react";

interface ChallengeLibraryProps {
  onStartChallenge: (challenge: HabitChallenge) => void;
  onOpenCreate: () => void;
  onOpenCommunity?: () => void;
  activeChallenges?: HabitChallenge[];
  userCoins?: number;
}

const CATEGORY_PILLS: string[] = [
  "All",
  "Personal Growth",
  "Health",
  "Mental Health",
  "Learning",
  "Lifestyle",
  "Productivity",
  "Self Love",
  "Positivity",
  "Fitness",
  "Mindfulness",
  "Bad Habits (Avoid)"
];

export const ChallengeLibrary: React.FC<ChallengeLibraryProps> = ({
  onStartChallenge,
  onOpenCreate,
  onOpenCommunity,
  activeChallenges = [],
  userCoins = 120
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"top" | "newest" | "popular">("top");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Age consent modal state
  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(false);
  const [safetyEval, setSafetyEval] = useState<ContentSafetyEvaluation>({
    isSensitive: false,
    category: "none",
    matchedTerms: [],
    requiresAgeGate: false,
    safetyAdvisory: "",
    helplineInfo: null
  });
  const [pendingChallenge, setPendingChallenge] = useState<HabitChallenge | null>(null);

  // Map presets into HabitChallenge items
  const allLibraryChallenges: HabitChallenge[] = useMemo(() => {
    return PRESET_CHALLENGES.map((preset) => {
      const sEval = evaluateContentSafety(`${preset.title} ${preset.description}`);
      return {
        id: preset.id,
        title: preset.title,
        description: preset.description,
        category: preset.category,
        currentDay: 1,
        totalDays: 21,
        status: "Active",
        streakCount: 0,
        icon: preset.icon,
        color: preset.color || "#FFC9A7",
        completedDays: [],
        missedDays: 0,
        createdAt: new Date().toISOString(),
        isSensitive: sEval.isSensitive,
        sensitiveCategory: sEval.category,
        requiresAgeGate: sEval.requiresAgeGate
      };
    });
  }, []);

  // Filter and Sort Logic
  const filteredChallenges = useMemo(() => {
    let list = allLibraryChallenges.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === "Mental Health" && item.category === "Mindfulness") ||
        (selectedCategory === "Self Love" && (item.title.toLowerCase().includes("love") || item.title.toLowerCase().includes("gratitude") || item.category === "Personal Growth")) ||
        (selectedCategory === "Bad Habits (Avoid)" && (item.category === "Bad Habits to Avoid" || item.category === "Recovery"));

      // Search query filter
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "top") {
      list.sort((a, b) => (b.category === "Personal Growth" ? 1 : -1));
    } else if (sortBy === "newest") {
      list = [...list].reverse();
    }

    return list;
  }, [allLibraryChallenges, selectedCategory, searchQuery, sortBy]);

  const handleStartAttempt = async (challenge: HabitChallenge) => {
    const sEval = evaluateContentSafety(`${challenge.title} ${challenge.description}`);
    if (sEval.requiresAgeGate) {
      const consent = await getAgeConsentStatus(sEval.category);
      if (!consent.isVerifiedAdult) {
        setSafetyEval(sEval);
        setPendingChallenge(challenge);
        setIsAgeModalOpen(true);
        return;
      }
    }

    onStartChallenge(challenge);
  };

  const handleConsentConfirmed = () => {
    setIsAgeModalOpen(false);
    if (pendingChallenge) {
      onStartChallenge({
        ...pendingChallenge,
        isAgeVerified: true
      });
      setPendingChallenge(null);
    }
  };

  const handleUnderAgeRedirect = () => {
    setIsAgeModalOpen(false);
    setPendingChallenge(null);
    // Find digital detox or meditation preset
    const youthSafe = allLibraryChallenges.find(
      (c) => c.title.toLowerCase().includes("digital") || c.title.toLowerCase().includes("meditation")
    );
    if (youthSafe) {
      onStartChallenge(youthSafe);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Top Count & Controls Bar */}
      <div className="bg-[#FFF8F3] dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subtle counter */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Challenge Discovery Library
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
              {filteredChallenges.length} challenges available
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black rounded-2xl px-3 py-2 cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="top">Top Challenges</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Create Custom Button */}
            <button
              type="button"
              onClick={onOpenCreate}
              className="px-3.5 py-2 bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950 font-black text-xs rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-orange-950" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search 21-day challenges (e.g. gratitude, cold shower, sugar-free)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm rounded-2xl pl-10 pr-4 py-2.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Horizontal Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {CATEGORY_PILLS.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? "bg-[#FFC9A7] text-orange-950 border-[#FFB285] shadow-xs scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Challenge Cards Grid (Pastel Peach Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredChallenges.map((challenge) => {
          const isAlreadyActive = activeChallenges.some(
            (c) => c.id === challenge.id || c.title.toLowerCase() === challenge.title.toLowerCase()
          );

          return (
            <motion.div
              key={challenge.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all"
            >
              {/* Card Center: Line-art / Icon + Bold Title */}
              <div className="flex flex-col items-center text-center space-y-2 pt-2">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF5EE] dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 flex items-center justify-center text-3xl shadow-2xs relative">
                  {challenge.icon || "🎯"}
                  {challenge.requiresAgeGate && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[9px] font-black rounded-md border border-amber-300">
                      18+
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFF8F3] dark:bg-slate-800 text-orange-800 dark:text-orange-300 border border-[#FDE7D6] dark:border-slate-700">
                      {challenge.category}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 px-2">
                    {challenge.description}
                  </p>
                </div>
              </div>

              {/* Card Bottom: Full-width Light Peach Start Button */}
              <button
                type="button"
                onClick={() => handleStartAttempt(challenge)}
                className="w-full py-3 bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950 font-black text-xs sm:text-sm rounded-2xl shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-orange-950 text-orange-950" />
                <span>{isAlreadyActive ? "Continue Challenge" : "Start"}</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">No challenges found</h4>
          <p className="text-xs text-slate-500">
            Try adjusting your search or category filter, or build your own custom 21-day challenge.
          </p>
          <button
            type="button"
            onClick={onOpenCreate}
            className="px-4 py-2 bg-[#FFC9A7] text-orange-950 font-black text-xs rounded-xl shadow-xs"
          >
            Create Your Own Challenge
          </button>
        </div>
      )}

      {/* Age Consent Modal */}
      <AgeConsentModal
        isOpen={isAgeModalOpen}
        safetyEval={safetyEval}
        onClose={() => setIsAgeModalOpen(false)}
        onConsentConfirmed={handleConsentConfirmed}
        onUnderAgeRedirect={handleUnderAgeRedirect}
      />
    </div>
  );
};
