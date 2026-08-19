import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HabitChallenge, ChallengeQuestTask } from "../types";
import { ChallengeLibrary } from "./ChallengeLibrary";
import { CreateChallenge } from "./CreateChallenge";
import { CommunityChallenges } from "./CommunityChallenges";
import { ChallengeGrid } from "../components/ChallengeGrid";
import { PositiveWheel } from "../components/PositiveWheel";
import { ChallengeTasksQuest } from "../components/ChallengeTasksQuest";
import { PRESET_CHALLENGES, getInitialChallenges } from "../data/challengePresets";
import {
  getDailyRewardClaimedStatus,
  markDailyRewardClaimedInSupabase,
  syncHabitChallengeToSupabase,
  DailyRewardStatus
} from "../lib/supabaseHabits";
import {
  Trophy,
  Flame,
  Plus,
  Sparkles,
  Coins,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Heart,
  Droplets,
  Search,
  Compass,
  LayoutGrid,
  CheckSquare,
  Share2,
  ArrowRight,
  ArrowLeft,
  Filter,
  Play,
  Clock,
  Zap,
  Gift,
  Users
} from "lucide-react";

const INITIAL_QUESTS: ChallengeQuestTask[] = [
  { id: "q-1", title: "Fill your name & profile", coinReward: 2, targetCount: 1, currentCount: 1, isCollected: false },
  { id: "q-2", title: "Start a new 21-day challenge", coinReward: 2, targetCount: 1, currentCount: 1, isCollected: false },
  { id: "q-3", title: "Take a look at the daily feed", coinReward: 2, targetCount: 1, currentCount: 1, isCollected: false },
  { id: "q-4", title: "Visit the app 5 days in a row", coinReward: 2, targetCount: 5, currentCount: 3, isCollected: false },
  { id: "q-5", title: "Start the Gratitude challenge", coinReward: 2, targetCount: 1, currentCount: 0, isCollected: false },
  { id: "q-6", title: "Complete your first 21-day challenge", coinReward: 2, targetCount: 1, currentCount: 0, isCollected: false },
  { id: "q-7", title: "Receive 5 likes on your thoughts", coinReward: 2, targetCount: 5, currentCount: 2, isCollected: false },
  { id: "q-8", title: "Complete 2 challenges", coinReward: 2, targetCount: 2, currentCount: 1, isCollected: false },
  { id: "q-9", title: "Give 10 likes to fellow challengers", coinReward: 2, targetCount: 10, currentCount: 6, isCollected: false },
  { id: "q-10", title: "Take notes in one of your daily challenges", coinReward: 2, targetCount: 1, currentCount: 1, isCollected: false },
  { id: "q-11", title: "Visit the app 10 days in a row", coinReward: 4, targetCount: 10, currentCount: 3, isCollected: false },
  { id: "q-12", title: "Complete 4 challenges", coinReward: 4, targetCount: 4, currentCount: 1, isCollected: false },
  { id: "q-13", title: "Give 20 likes in the community", coinReward: 4, targetCount: 20, currentCount: 6, isCollected: false },
  { id: "q-14", title: "Give 50 likes in the community", coinReward: 6, targetCount: 50, currentCount: 6, isCollected: false },
  { id: "q-15", title: "Visit the app 21 days in a row", coinReward: 10, targetCount: 21, currentCount: 3, isCollected: false },
  { id: "q-16", title: "Complete 6 challenges", coinReward: 10, targetCount: 6, currentCount: 1, isCollected: false },
  { id: "q-17", title: "Create your own custom challenge", coinReward: 20, targetCount: 1, currentCount: 0, isCollected: false },
  { id: "q-18", title: "Create 2 custom challenges", coinReward: 25, targetCount: 2, currentCount: 0, isCollected: false }
];

const DAILY_QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "It takes 21 days to form a habit and 90 days to make it a permanent lifestyle.", author: "Neuroplasticity Proverb" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" }
];

interface HabitChallengesProps {
  onBackToHome?: () => void;
}

export const HabitChallenges: React.FC<HabitChallengesProps> = ({ onBackToHome }) => {
  // Navigation state
  const [currentView, setCurrentView] = useState<"library" | "grid" | "create" | "community" | "quests">("library");

  const [challenges, setChallenges] = useState<HabitChallenge[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_habit_challenges");
      return saved ? JSON.parse(saved) : getInitialChallenges();
    } catch {
      return getInitialChallenges();
    }
  });

  const [quests, setQuests] = useState<ChallengeQuestTask[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_challenge_quests");
      return saved ? JSON.parse(saved) : INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  });

  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(() => {
    const first = getInitialChallenges()[0];
    return first ? first.id : null;
  });

  const [showWheelModal, setShowWheelModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Supabase profiles daily_reward_claimed 24-hour cycle state
  const [rewardStatus, setRewardStatus] = useState<DailyRewardStatus>({
    isClaimed: false,
    lastClaimedAt: null,
    hoursRemaining: 0,
    canSpinWheel: true,
    canScratchCard: true
  });

  // User Gamification Stats
  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("care2care_user_coins");
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
    }
  });

  const [freezeTokens, setFreezeTokens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("care2care_user_freeze_tokens");
      return saved ? parseInt(saved, 10) : 2;
    } catch {
      return 2;
    }
  });

  // Daily Quote index
  const quoteIndex = new Date().getDate() % DAILY_QUOTES.length;
  const currentQuote = DAILY_QUOTES[quoteIndex];

  // Refresh daily reward status from Supabase profiles
  const refreshRewardStatus = async () => {
    const status = await getDailyRewardClaimedStatus();
    setRewardStatus(status);
  };

  useEffect(() => {
    refreshRewardStatus();
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("care2care_habit_challenges", JSON.stringify(challenges));
    } catch (e) {
      console.error(e);
    }
  }, [challenges]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_challenge_quests", JSON.stringify(quests));
    } catch (e) {
      console.error(e);
    }
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_user_coins", coins.toString());
      localStorage.setItem("care2care_user_freeze_tokens", freezeTokens.toString());
    } catch (e) {
      console.error(e);
    }
  }, [coins, freezeTokens]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Handle Challenge Update & Sync with Supabase
  const handleUpdateChallenge = async (updated: HabitChallenge) => {
    setChallenges((prev) => {
      const exists = prev.some((c) => c.id === updated.id);
      if (exists) {
        return prev.map((c) => (c.id === updated.id ? updated : c));
      }
      return [updated, ...prev];
    });
    await syncHabitChallengeToSupabase(updated);
  };

  // Consume a Freeze Token
  const handleUseFreezeToken = (): boolean => {
    if (freezeTokens > 0) {
      setFreezeTokens((prev) => Math.max(0, prev - 1));
      return true;
    }
    return false;
  };

  // Add Coins
  const handleAddCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
  };

  // Handle Reward from Wheel and record to Supabase
  const handleRewardClaimed = async (earnedCoins: number, earnedTokens: number) => {
    if (earnedCoins > 0) setCoins((prev) => prev + earnedCoins);
    if (earnedTokens > 0) setFreezeTokens((prev) => prev + earnedTokens);
    await markDailyRewardClaimedInSupabase("wheel");
    await refreshRewardStatus();
    triggerToast(`🎉 Daily Spin Claimed! +${earnedCoins} Coins 🪙, +${earnedTokens} Shields 🛡️`);
  };

  // Claim Quest Coins
  const handleClaimQuest = (questId: string, coinReward: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isCollected: true } : q))
    );
    setCoins((prev) => prev + coinReward);
    triggerToast(`🎉 Claimed +${coinReward} Coins! 🪙`);
  };

  // Stage 1 -> Stage 3: Start Challenge from Discovery Library
  const handleStartChallengeFromLibrary = async (challenge: HabitChallenge) => {
    const existing = challenges.find(
      (c) => c.id === challenge.id || c.title.toLowerCase() === challenge.title.toLowerCase()
    );

    if (existing) {
      setActiveChallengeId(existing.id);
    } else {
      setChallenges((prev) => [challenge, ...prev]);
      await syncHabitChallengeToSupabase(challenge);
      setActiveChallengeId(challenge.id);
    }
    setCurrentView("grid");
    triggerToast(`🚀 Challenge started: ${challenge.title}!`);
  };

  // Stage 2: Create Custom Challenge
  const handleCreateCustomChallenge = async (newChallenge: HabitChallenge) => {
    setChallenges((prev) => [newChallenge, ...prev]);
    await syncHabitChallengeToSupabase(newChallenge);
    setActiveChallengeId(newChallenge.id);
    setCurrentView("grid");
    triggerToast(`✨ Custom 21-Day Challenge "${newChallenge.title}" created & launched!`);
  };

  const activeChallenge =
    challenges.find((c) => c.id === activeChallengeId) ||
    challenges.find((c) => c.status === "Active") ||
    challenges[0];

  const claimableQuestsCount = quests.filter((q) => !q.isCollected && q.currentCount >= q.targetCount).length;

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-black rounded-2xl shadow-2xl border border-slate-700 animate-bounce flex items-center gap-2">
          <span>✨</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP PEACH HEADER HERO SHELL */}
      <div className="bg-gradient-to-r from-[#FFF5EE] via-[#FDE7D6] to-[#FED7AA] dark:from-slate-800 dark:to-slate-900 border-2 border-[#FDBA74]/60 dark:border-orange-900/60 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="p-2.5 bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 font-bold text-xs shrink-0"
                title="Back to Previous Screen"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  21-Day Challenge Engine
                </h1>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5 max-w-md">
                Discover habits, scratch daily cards, fulfill accountability penalties, and build permanent neural pathways.
              </p>
            </div>
          </div>

          {/* User Gamification Stats */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400 shadow-2xs">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{coins} 🪙</span>
            </div>

            <div className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/60 rounded-2xl flex items-center gap-1.5 text-xs font-black text-blue-700 dark:text-blue-300 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>{freezeTokens} 🛡️</span>
            </div>

            <button
              type="button"
              onClick={() => setShowWheelModal(true)}
              className="px-3.5 py-1.5 bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950 font-black rounded-2xl flex items-center gap-1.5 text-xs shadow-2xs cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Daily Spin 🎡</span>
            </button>
          </div>
        </div>

        {/* Daily Motivation Quote */}
        <div className="p-3.5 bg-white/90 dark:bg-slate-800/90 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl shrink-0">💡</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 italic truncate">
                "{currentQuote.text}"
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                — {currentQuote.author}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Daily Habit Wisdom", text: `"${currentQuote.text}" — ${currentQuote.author}` });
              } else {
                navigator.clipboard?.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
                triggerToast("Quote copied to clipboard!");
              }
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"
            title="Share Quote"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Stage Navigation Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#FDE7D6] dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {/* 1. Discovery Library */}
            <button
              type="button"
              onClick={() => setCurrentView("library")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                currentView === "library"
                  ? "bg-[#FFC9A7] text-orange-950 shadow-2xs border border-[#FFB285]"
                  : "bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discovery Library</span>
            </button>

            {/* 2. Active 21-Day Grid */}
            <button
              type="button"
              onClick={() => {
                if (activeChallenge) {
                  setActiveChallengeId(activeChallenge.id);
                  setCurrentView("grid");
                } else {
                  setCurrentView("library");
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                currentView === "grid"
                  ? "bg-[#FFC9A7] text-orange-950 shadow-2xs border border-[#FFB285]"
                  : "bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>21-Day Grid {activeChallenge ? `(${activeChallenge.title.slice(0, 14)}...)` : ""}</span>
            </button>

            {/* 3. Community Challenges */}
            <button
              type="button"
              onClick={() => setCurrentView("community")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                currentView === "community"
                  ? "bg-[#FFC9A7] text-orange-950 shadow-2xs border border-[#FFB285]"
                  : "bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Community Quests</span>
            </button>

            {/* 4. Quests */}
            <button
              type="button"
              onClick={() => setCurrentView("quests")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap relative ${
                currentView === "quests"
                  ? "bg-[#FFC9A7] text-orange-950 shadow-2xs border border-[#FFB285]"
                  : "bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-white"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Coin Quests</span>
              {claimableQuestsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={() => setCurrentView("create")}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-orange-50 border border-[#FDE7D6] text-orange-950 dark:text-orange-200 text-xs font-black rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-STAGE VIEWS ROUTER */}
      {/* ========================================================================= */}

      {/* STAGE 1: DISCOVERY & LIBRARY */}
      {currentView === "library" && (
        <ChallengeLibrary
          onStartChallenge={handleStartChallengeFromLibrary}
          onOpenCreate={() => setCurrentView("create")}
          onOpenCommunity={() => setCurrentView("community")}
          activeChallenges={challenges}
          userCoins={coins}
        />
      )}

      {/* STAGE 2: "CREATE YOUR OWN" BUILDER */}
      {currentView === "create" && (
        <CreateChallenge
          onBack={() => setCurrentView("library")}
          onCreate={handleCreateCustomChallenge}
        />
      )}

      {/* STAGE 3 & 4: 21-DAY GRID & DAILY LOGGER */}
      {currentView === "grid" && activeChallenge && (
        <ChallengeGrid
          challenge={activeChallenge}
          onUpdateChallenge={handleUpdateChallenge}
          onBack={() => setCurrentView("library")}
          userFreezeTokens={freezeTokens}
          onUseFreezeToken={handleUseFreezeToken}
          userCoins={coins}
          onAddCoins={handleAddCoins}
          onOpenWheel={() => setShowWheelModal(true)}
        />
      )}

      {/* STAGE 4: COMMUNITY CHALLENGES FEED */}
      {currentView === "community" && (
        <CommunityChallenges
          onBack={() => setCurrentView("library")}
          onStartCommunityChallenge={handleStartChallengeFromLibrary}
          onOpenCreate={() => setCurrentView("create")}
        />
      )}

      {/* STAGE 4: TASKS & QUESTS */}
      {currentView === "quests" && (
        <ChallengeTasksQuest
          userCoins={coins}
          onClaimQuest={handleClaimQuest}
          quests={quests}
        />
      )}

      {/* POSITIVE WHEEL OF FORTUNE MODAL */}
      <PositiveWheel
        isOpen={showWheelModal}
        onClose={() => {
          setShowWheelModal(false);
          refreshRewardStatus();
        }}
        onRewardClaimed={handleRewardClaimed}
        userCoins={coins}
        userFreezeTokens={freezeTokens}
        onOpenScratchCard={() => {
          if (activeChallenge) {
            setActiveChallengeId(activeChallenge.id);
            setCurrentView("grid");
          }
        }}
      />
    </div>
  );
};
