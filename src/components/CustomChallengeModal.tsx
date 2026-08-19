import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HabitChallenge, ChallengeCategory } from "../types";
import {
  evaluateContentSafety,
  getAgeConsentStatus,
  ContentSafetyEvaluation
} from "../lib/safetyEngine";
import { getSupabaseClient } from "../lib/supabase";
import { AgeConsentModal } from "./AgeConsentModal";
import {
  X,
  Plus,
  Sparkles,
  ShieldAlert,
  Dumbbell,
  Clock,
  Heart,
  Droplets,
  Bell,
  CheckCircle2,
  Smile,
  BookOpen,
  Zap,
  Lock
} from "lucide-react";

interface CustomChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (challenge: HabitChallenge) => void;
  userDob?: string;
}

const CATEGORY_OPTIONS: { label: string; value: ChallengeCategory; icon: string }[] = [
  { label: "Personal Growth", value: "Personal Growth", icon: "🌱" },
  { label: "Health & Vitality", value: "Health", icon: "💧" },
  { label: "Bad Habits to Avoid", value: "Bad Habits to Avoid", icon: "🚭" },
  { label: "Learning & Brain", value: "Learning", icon: "🧠" },
  { label: "Lifestyle & Home", value: "Lifestyle", icon: "✨" },
  { label: "Productivity & Focus", value: "Productivity", icon: "⚡" },
  { label: "Fitness & Movement", value: "Fitness", icon: "🏃" },
  { label: "Mindfulness", value: "Mindfulness", icon: "🧘" },
  { label: "Custom", value: "Custom", icon: "⭐" }
];

const PENALTY_TYPE_OPTIONS = [
  { label: "Push-ups (Physical)", value: "pushups", icon: "💪", defaultReps: 25, unit: "reps" },
  { label: "Air Squats (Physical)", value: "squats", icon: "🦵", defaultReps: 30, unit: "reps" },
  { label: "Meditation / Breathwork", value: "meditation", icon: "🧘", defaultReps: 5, unit: "mins" },
  { label: "Hydration Electrolyte Chug", value: "hydration", icon: "💧", defaultReps: 500, unit: "ml" },
  { label: "Reading Non-Fiction", value: "reading", icon: "📚", defaultReps: 10, unit: "pages" },
  { label: "Ice Cold Shower", value: "cold_shower", icon: "🚿", defaultReps: 2, unit: "mins" },
  { label: "Brisk Cardio Walk", value: "walk", icon: "🚶", defaultReps: 15, unit: "mins" },
  { label: "Custom Penalty Action", value: "custom", icon: "⚠️", defaultReps: 1, unit: "action" }
];

const ICON_PRESETS = ["🏆", "🔥", "💧", "🧘", "🏃", "📚", "🧠", "🚭", "🥗", "✨", "☕", "🌙", "💪", "🌱", "🎯", "⭐"];

export const CustomChallengeModal: React.FC<CustomChallengeModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  userDob
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ChallengeCategory>("Personal Growth");
  const [icon, setIcon] = useState("🏆");
  const [color, setColor] = useState("#f97316");

  // Penalty setup
  const [penaltyType, setPenaltyType] = useState<any>("pushups");
  const [penaltyReps, setPenaltyReps] = useState<number>(25);
  const [customPenaltyText, setCustomPenaltyText] = useState("");
  const [enableDailyUniquePenalties, setEnableDailyUniquePenalties] = useState(true);

  // Reminders
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");

  // Age consent and safety check
  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(false);
  const [safetyEval, setSafetyEval] = useState<ContentSafetyEvaluation>({
    isSensitive: false,
    category: "none",
    matchedTerms: [],
    requiresAgeGate: false,
    safetyAdvisory: "",
    helplineInfo: null
  });
  const [pendingChallengeData, setPendingChallengeData] = useState<HabitChallenge | null>(null);
  const [profileDob, setProfileDob] = useState<string>(userDob || "");

  useEffect(() => {
    // Attempt to load DOB from Supabase profile if not provided
    async function loadDob() {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data: { user } } = await client.auth.getUser();
          if (user) {
            const { data } = await client.from("profiles").select("dob").eq("id", user.id).maybeSingle();
            if (data?.dob) {
              setProfileDob(data.dob);
            }
          }
        } catch {
          // ignore
        }
      }
    }
    loadDob();
  }, [userDob]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fullText = `${title.trim()} ${description.trim()} ${category}`;
    const sEval = evaluateContentSafety(fullText);

    const challengePayload: HabitChallenge = {
      id: `chal-custom-${Date.now()}`,
      title: `${icon} ${title.trim()}`,
      description: description.trim() || `21 days of intentional habit mastery in ${category}.`,
      category,
      currentDay: 1,
      totalDays: 21,
      status: "Active",
      streakCount: 0,
      icon,
      color,
      missedDays: 0,
      completedDays: [],
      isSensitive: sEval.isSensitive,
      sensitiveCategory: sEval.category,
      requiresAgeGate: sEval.requiresAgeGate,
      customPenaltyType: penaltyType,
      customPenaltyRepsOrMins: penaltyReps,
      customPenaltyText: customPenaltyText.trim(),
      notificationsEnabled: reminderEnabled,
      reminderTime: reminderTime,
      createdAt: new Date().toISOString()
    };

    if (sEval.requiresAgeGate) {
      const consent = await getAgeConsentStatus(sEval.category);
      if (!consent.isVerifiedAdult) {
        setSafetyEval(sEval);
        setPendingChallengeData(challengePayload);
        setIsAgeModalOpen(true);
        return;
      }
    }

    onCreate(challengePayload);
    onClose();
  };

  const handleConsentConfirmed = (pinCode?: string) => {
    setIsAgeModalOpen(false);
    if (pendingChallengeData) {
      const finalized: HabitChallenge = {
        ...pendingChallengeData,
        isAgeVerified: true,
        isPinProtected: Boolean(pinCode),
        pinCode: pinCode || undefined
      };
      onCreate(finalized);
      setPendingChallengeData(null);
      onClose();
    }
  };

  const handleUnderAgeRedirect = () => {
    setIsAgeModalOpen(false);
    // Switch to youth safe category
    setCategory("Mindfulness");
    setTitle("Digital Balance & Mindfulness");
    setDescription("Daily positive breathing and screen balance routines.");
    setIcon("🧘");
  };

  const selectedPenaltyMeta = PENALTY_TYPE_OPTIONS.find((p) => p.value === penaltyType) || PENALTY_TYPE_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 border-b border-orange-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-xl shadow-xs">
              ✨
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Create 21-Day Challenge
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Set up your habit, daily scratch tasks, and tailored penalties.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Challenge Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Challenge Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 21 Days of Morning Sunlight & Hydration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    category === cat.value
                      ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-300 shadow-xs ring-1 ring-orange-500"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Chooser */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Badge Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICON_PRESETS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-lg transition-all cursor-pointer ${
                    icon === ic
                      ? "bg-orange-500 text-white border-orange-600 scale-110 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:scale-105"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Goal & Purpose Description
            </label>
            <textarea
              rows={2}
              placeholder="Why is this 21-day challenge important to you? What will you achieve?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Accountability Penalty Section */}
          <div className="p-4 bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <h4 className="text-xs font-black uppercase text-orange-900 dark:text-orange-300 tracking-wider">
                  Accountability Penalty System
                </h4>
                <p className="text-[11px] text-orange-700 dark:text-orange-400">
                  If you miss a day, this penalty unlocks your scratch card & shields your streak.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Choose Penalty Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PENALTY_TYPE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => {
                      setPenaltyType(opt.value);
                      setPenaltyReps(opt.defaultReps);
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      penaltyType === opt.value
                        ? "bg-white dark:bg-slate-800 border-orange-500 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500 shadow-xs"
                        : "bg-white/60 dark:bg-slate-800/50 border-orange-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{opt.icon}</span>
                      <span className="truncate">{opt.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Reps or duration slider */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Penalty Intensity:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={penaltyReps}
                    onChange={(e) => setPenaltyReps(parseInt(e.target.value, 10) || 1)}
                    className="w-20 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs font-black text-slate-900 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-500">
                    {selectedPenaltyMeta.unit}
                  </span>
                </div>
              </div>

              {penaltyType === "custom" && (
                <input
                  type="text"
                  placeholder="e.g. Donate $5 to charity jar or write 500 words"
                  value={customPenaltyText}
                  onChange={(e) => setCustomPenaltyText(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                />
              )}
            </div>
          </div>

          {/* Daily Reminder */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Daily Scratch Reminder
                </div>
                <div className="text-[10px] text-slate-500">
                  Send reminder at optimal morning reflection hour
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  reminderEnabled ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    reminderEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 21-Day Challenge</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Age Consent Safety Modal */}
      <AgeConsentModal
        isOpen={isAgeModalOpen}
        safetyEval={safetyEval}
        userDob={profileDob}
        onClose={() => setIsAgeModalOpen(false)}
        onConsentConfirmed={handleConsentConfirmed}
        onUnderAgeRedirect={handleUnderAgeRedirect}
      />
    </div>
  );
};
