import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChallengeQuestTask } from "../types";
import {
  Coins,
  CheckCircle2,
  Sparkles,
  Award,
  Flame,
  ArrowRight,
  Gift,
  Trophy,
  Star
} from "lucide-react";

interface ChallengeTasksQuestProps {
  userCoins: number;
  onClaimQuest: (questId: string, coinReward: number) => void;
  quests: ChallengeQuestTask[];
}

export const ChallengeTasksQuest: React.FC<ChallengeTasksQuestProps> = ({
  userCoins,
  onClaimQuest,
  quests
}) => {
  const collectedCount = quests.filter((q) => q.isCollected).length;
  const claimableCount = quests.filter((q) => !q.isCollected && q.currentCount >= q.targetCount).length;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 dark:from-slate-800 dark:to-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-600 flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl shadow-xs">
            🪙
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Coin Quests & Rewards
              {claimableCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[11px] font-black rounded-full animate-pulse">
                  {claimableCount} Claimable!
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              Complete daily habits, invite reflection, and collect coins to unlock Freeze Tokens and premium rewards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-2 shadow-xs">
            <Coins className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-[10px] uppercase font-black text-slate-400">Total Coins</div>
              <div className="text-lg font-black text-slate-900 dark:text-white leading-none">{userCoins}</div>
            </div>
          </div>
          <div className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-2 shadow-xs">
            <Trophy className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="text-[10px] uppercase font-black text-slate-400">Quests Done</div>
              <div className="text-lg font-black text-slate-900 dark:text-white leading-none">
                {collectedCount} / {quests.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Available Quests & Milestones
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {quests.length} Total Quests
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {quests.map((quest) => {
            const isReadyToClaim = !quest.isCollected && quest.currentCount >= quest.targetCount;
            const progressPercent = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

            return (
              <div
                key={quest.id}
                className="py-3.5 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-2xl"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 font-black text-xs">
                    🪙
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {quest.title}
                    </div>
                    {/* Progress bar if multi-step */}
                    {quest.targetCount > 1 && (
                      <div className="flex items-center gap-2 mt-1 max-w-xs">
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {quest.currentCount}/{quest.targetCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action / Status */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-700 dark:text-amber-400 text-xs font-black flex items-center gap-1">
                    <span>+{quest.coinReward}</span>
                    <span>🪙</span>
                  </div>

                  {quest.isCollected ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : isReadyToClaim ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onClaimQuest(quest.id, quest.coinReward)}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer animate-bounce"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Click to collect</span>
                    </motion.button>
                  ) : (
                    <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700">
                      {quest.currentCount}/{quest.targetCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
