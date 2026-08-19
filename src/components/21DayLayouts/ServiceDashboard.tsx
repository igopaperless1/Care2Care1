import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LifelongServiceProfile } from "../../types";
import { getLifelongProfile, saveLifelongProfile, recordServiceGoalCompletion } from "../../lib/lifelongEngine";
import { ServiceHeader } from "./ServiceHeader";
import { ServiceSetupWizard } from "./ServiceSetupWizard";
import { PeriodicLifeReviewModal } from "./PeriodicLifeReviewModal";
import { GentleRecoveryModal } from "./GentleRecoveryModal";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Zap,
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight
} from "lucide-react";

interface ServiceDashboardProps {
  serviceId: string;
  icon?: string;
  todayTargetDisplay?: string;
  todayProgressDisplay?: string;
  todayProgressPercent?: number;
  todayActionLabel?: string;
  onTodayActionClick?: () => void;
  children: React.ReactNode;
}

export const ServiceDashboard: React.FC<ServiceDashboardProps> = ({
  serviceId,
  icon = "🌟",
  todayTargetDisplay,
  todayProgressDisplay,
  todayProgressPercent = 65,
  todayActionLabel = "Log Today's Action",
  onTodayActionClick,
  children
}) => {
  const [profile, setProfile] = useState<LifelongServiceProfile>(() => getLifelongProfile(serviceId));
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState<boolean>(false);
  const [showProgressionGrid, setShowProgressionGrid] = useState<boolean>(true);

  const handleGoalCompleted = async () => {
    const result = await recordServiceGoalCompletion(serviceId);
    setProfile(result.profile);
    if (result.isMilestone) {
      setIsReviewOpen(true);
    }
  };

  const handleStageTransition = (nextStage: "stabilize" | "integrate" | "ignite") => {
    const updated: LifelongServiceProfile = {
      ...profile,
      stage: nextStage,
      dayInCurrentStage: nextStage === "stabilize" ? 22 : nextStage === "integrate" ? 61 : 1
    };
    saveLifelongProfile(updated);
    setProfile(updated);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* 1. Global Service Header with Archetype & Lifecycle Stage */}
      <ServiceHeader
        profile={profile}
        icon={icon}
        onOpenSettings={() => setIsSetupOpen(true)}
        onOpenReview={() => setIsReviewOpen(true)}
        onOpenRecovery={() => setIsRecoveryOpen(true)}
      />

      {/* 2. Today's Focus Card (The Standardized Mental Model) */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            {/* Recharts Circular Gauge */}
            <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: todayProgressPercent || 0.1 },
                      { name: "Remaining", value: Math.max(0, 100 - todayProgressPercent) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={16}
                    outerRadius={22}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#1a73e8" />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-white">
                {Math.round(todayProgressPercent)}%
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Today's {profile.serviceName} Focus
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {todayProgressPercent >= 100 ? "Goal Met ✨" : "In Progress"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Target: {todayTargetDisplay || `${profile.dailyTargetValue} ${profile.dailyTargetUnit}`} • Current: {todayProgressDisplay || "Active"}
              </p>
            </div>
          </div>

          {/* Primary Quick Log Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onTodayActionClick) {
                  onTodayActionClick();
                } else {
                  handleGoalCompleted();
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{todayActionLabel}</span>
            </button>
          </div>
        </div>

        {/* Supportive Reminder Notice */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">Scheduled Window: Daily Rhythm</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {profile.stage === "ignite"
              ? "Ignite 21-Day Focus"
              : profile.stage === "stabilize"
              ? "Stabilization Focus"
              : "Lifelong Routine"}
          </span>
        </div>
      </div>

      {/* 3. The Specialized Native Service Component (Preserved 100%) */}
      <div className="w-full">
        {children}
      </div>

      {/* 4. 21-Day / Lifelong Progression Visualizer */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {profile.stage === "ignite"
                  ? "21-Day Habit Formation Journey"
                  : profile.stage === "stabilize"
                  ? "Stabilization Rhythm (Days 22–60)"
                  : "Lifelong Maintenance Consistency"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Milestones at Day 7, 14, 21, and 60
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowProgressionGrid(!showProgressionGrid)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {showProgressionGrid ? "Compact" : "View Full Grid"}
          </button>
        </div>

        {showProgressionGrid && (
          <div className="grid grid-cols-7 gap-2 pt-2">
            {Array.from({ length: 21 }, (_, i) => {
              const dayNum = i + 1;
              const isPast = dayNum < profile.dayInCurrentStage;
              const isCurrent = dayNum === profile.dayInCurrentStage;
              const isMilestone = [7, 14, 21].includes(dayNum);

              return (
                <div
                  key={dayNum}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between transition-all ${
                    isCurrent
                      ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-200"
                      : isPast
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400"
                  }`}
                >
                  <span className="text-[10px] font-black">Day {dayNum}</span>
                  <div className="my-1">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isCurrent ? (
                      <Flame className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-500" />
                    ) : isMilestone ? (
                      <Award className="w-4 h-4 text-amber-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                    )}
                  </div>
                  {isMilestone && (
                    <span className="text-[9px] font-black text-amber-600 dark:text-amber-400">
                      Reward
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <ServiceSetupWizard
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        serviceId={serviceId}
        onSetupComplete={() => setProfile(getLifelongProfile(serviceId))}
      />

      <PeriodicLifeReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        profile={profile}
        onTransitionStage={handleStageTransition}
      />

      <GentleRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
        profile={profile}
        onRecoveryStarted={(updated) => setProfile(updated)}
      />
    </div>
  );
};
