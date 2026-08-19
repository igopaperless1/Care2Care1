import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DayMetricEntry,
  getMonthlyGridData,
  saveDayMetric,
  calculateEvergreenStats,
  getMonthName,
  getDaysInMonth
} from "../../lib/perpetualGridStorage";
import { triggerHapticFeedback } from "../../lib/supabaseHabits";
import { ScratchCard } from "../ScratchCard";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Calendar,
  Award,
  TrendingUp,
  Droplets,
  Moon,
  Clock,
  Zap,
  Filter,
  Check
} from "lucide-react";

interface PerpetualMonthlyGridProps {
  serviceType: "water" | "sleep";
  serviceTitle: string;
  defaultDailyTarget: number;
  unit: string;
  onLogEntry?: (amount: number) => void;
  onDayCompleted?: (day: number, amount: number) => void;
}

export const PerpetualMonthlyGrid: React.FC<PerpetualMonthlyGridProps> = ({
  serviceType,
  serviceTitle,
  defaultDailyTarget,
  unit,
  onLogEntry,
  onDayCompleted
}) => {
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate();

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [gridData, setGridData] = useState<Record<number, DayMetricEntry>>({});
  const [show21DayOverlay, setShow21DayOverlay] = useState<boolean>(false);
  const [activeScratchDay, setActiveScratchDay] = useState<number | null>(null);
  const [scratchLoggedAmount, setScratchLoggedAmount] = useState<number>(defaultDailyTarget);

  // Load grid records for the active month
  useEffect(() => {
    const data = getMonthlyGridData(serviceType, selectedYear, selectedMonth, defaultDailyTarget);
    setGridData(data);
  }, [serviceType, selectedYear, selectedMonth, defaultDailyTarget]);

  // Evergreen statistics
  const stats = useMemo(() => {
    return calculateEvergreenStats(serviceType, selectedYear, selectedMonth, gridData, unit);
  }, [serviceType, selectedYear, selectedMonth, gridData, unit]);

  // Navigate to previous month
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  // Navigate to next month
  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const isCurrentViewingMonth = selectedYear === currentYear && selectedMonth === currentMonth;

  // Day click logic
  const handleDayClick = (dayNum: number) => {
    const isFuture =
      selectedYear > currentYear ||
      (selectedYear === currentYear && selectedMonth > currentMonth) ||
      (selectedYear === currentYear && selectedMonth === currentMonth && dayNum > currentDay);

    if (isFuture) {
      triggerHapticFeedback("warning");
      return;
    }

    const isToday = isCurrentViewingMonth && dayNum === currentDay;
    if (isToday) {
      triggerHapticFeedback("light");
      setActiveScratchDay(dayNum);
      return;
    }

    // Past day toggle / view
    const currentEntry = gridData[dayNum];
    const newCompleted = !currentEntry?.isCompleted;
    const updatedEntry: DayMetricEntry = {
      dayOfMonth: dayNum,
      month: selectedMonth,
      year: selectedYear,
      dateStr: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`,
      isCompleted: newCompleted,
      value: newCompleted ? defaultDailyTarget : 0,
      target: defaultDailyTarget,
      pointsEarned: newCompleted ? 50 : 0,
      scratched: true
    };

    saveDayMetric(serviceType, updatedEntry);
    setGridData((prev) => ({ ...prev, [dayNum]: updatedEntry }));
    triggerHapticFeedback("success");

    if (newCompleted && onDayCompleted) {
      onDayCompleted(dayNum, defaultDailyTarget);
    }
  };

  // Scratch card completion for today
  const handleScratchComplete = () => {
    if (!activeScratchDay) return;
    const dayNum = activeScratchDay;
    const updatedEntry: DayMetricEntry = {
      dayOfMonth: dayNum,
      month: selectedMonth,
      year: selectedYear,
      dateStr: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`,
      isCompleted: true,
      value: scratchLoggedAmount,
      target: defaultDailyTarget,
      pointsEarned: 50,
      scratched: true
    };

    saveDayMetric(serviceType, updatedEntry);
    setGridData((prev) => ({ ...prev, [dayNum]: updatedEntry }));
    triggerHapticFeedback("success");

    if (onDayCompleted) {
      onDayCompleted(dayNum, scratchLoggedAmount);
    }
    if (onLogEntry) {
      onLogEntry(scratchLoggedAmount);
    }

    setTimeout(() => {
      setActiveScratchDay(null);
    }, 800);
  };

  // Weekday start offset calculation
  const firstDayOfWeek = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0 = Sun, 6 = Sat
  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);

  return (
    <div className="w-full bg-[#FFF8F5] dark:bg-[#1E1715] border border-[#FFE2D6] dark:border-[#3D2821] rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* 1. Header & Perpetual Rolling Month Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#FDD9CB] dark:border-[#3D2821]">
        {/* Left: Service Icon + Monthly Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white flex items-center justify-center text-xl shadow-xs">
            {serviceType === "water" ? "💧" : "🌙"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {serviceTitle} Perpetual Monthly Grid
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                Rolling Calendar
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Lifelong daily consistency without resets or day limits
            </p>
          </div>
        </div>

        {/* Right: Month Controls & 21-Day Overlay Toggle */}
        <div className="flex items-center gap-2">
          {/* 21-Day Overlay Toggle */}
          <button
            type="button"
            onClick={() => {
              setShow21DayOverlay(!show21DayOverlay);
              triggerHapticFeedback("light");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              show21DayOverlay
                ? "bg-orange-500 text-white border-orange-600 shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300"
            }`}
            title="Toggle 21-Day Challenge overlay filter on days 1-21"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">21-Day Challenge Filter</span>
            <span className="sm:hidden">21d Goal</span>
          </button>

          {/* Month Steppers */}
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-black text-slate-900 dark:text-white min-w-[120px] text-center">
              {getMonthName(selectedMonth)} {selectedYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Weekday Header Labels */}
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* 3. The 5x7 / 6x7 Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
        {/* Leading Empty Cells for week alignment */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-2xl bg-transparent opacity-0 pointer-events-none" />
        ))}

        {/* 1 to Days in Month */}
        {Array.from({ length: daysInSelectedMonth }, (_, i) => {
          const dayNum = i + 1;
          const entry = gridData[dayNum];
          const isCompleted = entry?.isCompleted || false;
          const isToday = isCurrentViewingMonth && dayNum === currentDay;
          const isFuture =
            selectedYear > currentYear ||
            (selectedYear === currentYear && selectedMonth > currentMonth) ||
            (selectedYear === currentYear && selectedMonth === currentMonth && dayNum > currentDay);
          const is21DayTarget = show21DayOverlay && dayNum <= 21;

          return (
            <motion.button
              key={dayNum}
              type="button"
              whileHover={{ scale: isFuture ? 1 : 1.03 }}
              whileTap={{ scale: isFuture ? 1 : 0.96 }}
              onClick={() => handleDayClick(dayNum)}
              className={`relative h-14 sm:h-16 rounded-2xl p-1.5 sm:p-2 flex flex-col justify-between items-center transition-all cursor-pointer shadow-2xs ${
                isToday
                  ? "bg-gradient-to-br from-orange-50 to-amber-100/70 dark:from-orange-950/60 dark:to-slate-900 border-2 border-orange-500 ring-4 ring-orange-400/20 text-orange-950 dark:text-orange-200"
                  : isCompleted
                  ? "bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/70 text-slate-800 dark:text-slate-200"
                  : isFuture
                  ? "bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-300"
              } ${is21DayTarget ? "ring-2 ring-orange-400/80 ring-offset-1" : ""}`}
            >
              {/* Day Number + Challenge Filter Badge */}
              <div className="w-full flex items-center justify-between text-[10px] font-black">
                <span className={isToday ? "text-orange-600 dark:text-orange-400 font-extrabold" : "text-slate-600 dark:text-slate-400"}>
                  {dayNum}
                </span>
                {is21DayTarget && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" title="21-Day Challenge Target" />
                )}
              </div>

              {/* Status Graphic / Icon */}
              <div className="my-auto flex items-center justify-center">
                {isToday ? (
                  <div className="flex flex-col items-center">
                    <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-orange-600 dark:text-orange-300 tracking-wider">
                      Today
                    </span>
                  </div>
                ) : isCompleted ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400">
                      +50 pts
                    </span>
                  </div>
                ) : isFuture ? (
                  <Lock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 4. Evergreen Longitudinal Progress Statistics */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span>Lifelong Consistency & Evergreen Insights</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-semibold">
            {stats.monthName} {stats.year} Performance
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Monthly Consistency */}
          <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Consistency</div>
            <div className="text-lg font-black text-orange-600 dark:text-orange-400">
              {stats.daysCompletedThisMonth} / {stats.daysPassedInMonth} Days
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              {stats.consistencyPercentage}% Target Adherence
            </p>
          </div>

          {/* 2. Longest Streak */}
          <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Longest Streak</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {stats.longestStreak}
              </span>
              <span className="text-xs text-slate-500 font-bold">days</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 fill-emerald-500 text-emerald-500" /> Unbroken rhythm
            </p>
          </div>

          {/* 3. Daily Average */}
          <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Daily Volume</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {stats.lifetimeAverage.toLocaleString()} {unit}
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Target: {defaultDailyTarget.toLocaleString()} {unit}
            </p>
          </div>

          {/* 4. Month-over-Month Comparison */}
          <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Month Comparison</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {stats.monthComparisonPercent >= 0 ? `+${stats.monthComparisonPercent}%` : `${stats.monthComparisonPercent}%`}
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              vs previous month average
            </p>
          </div>
        </div>
      </div>

      {/* 5. Today's Scratch-to-Reveal Modal */}
      {activeScratchDay && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/60 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{serviceType === "water" ? "💧" : "🌙"}</span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Day {activeScratchDay} • Today's {serviceTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Scratch below to reveal today's personalized target
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveScratchDay(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Reusable Scratch Card */}
            <div className="py-2">
              <ScratchCard
                dayNumber={activeScratchDay}
                challengeTitle={serviceTitle}
                height={260}
                onComplete={handleScratchComplete}
                revealContent={
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-inner">
                      {serviceType === "water" ? "🌊" : "🛌"}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-black text-orange-700 uppercase tracking-wider">
                        {serviceType === "water" ? "Hydration Goal" : "Wind-down Sleep Goal"}
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {defaultDailyTarget.toLocaleString()} {unit}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-xs">
                        {serviceType === "water"
                          ? "Sip consistently throughout your morning and afternoon for steady vitality."
                          : "Maintain a calm, screen-free wind-down routine for restorative REM sleep."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleScratchComplete}
                      className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      ✓ Log {defaultDailyTarget.toLocaleString()} {unit} & Confirm
                    </button>
                  </div>
                }
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
