import React, { useState } from "react";
import {
  KeyRound,
  EyeOff,
  Bell,
  RotateCcw,
  X,
  ChevronRight,
  Shield,
  Clock,
  AlertTriangle
} from "lucide-react";
import { CareToggle, CareButton } from "../design-system";

interface ChallengeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeTitle: string;
  isPinProtected?: boolean;
  isHiddenFromFeed?: boolean;
  reminderTime?: string;
  onTogglePin: () => void;
  onToggleHide: (hide: boolean) => void;
  onUpdateReminderTime: (time: string) => void;
  onRestartChallenge: () => void;
}

export const ChallengeSettingsModal: React.FC<ChallengeSettingsModalProps> = ({
  isOpen,
  onClose,
  challengeTitle,
  isPinProtected = false,
  isHiddenFromFeed = false,
  reminderTime = "08:00",
  onTogglePin,
  onToggleHide,
  onUpdateReminderTime,
  onRestartChallenge,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(reminderTime);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Challenge Settings
            </h3>
            <p className="text-[11px] font-bold text-slate-500 truncate max-w-[220px]">
              {challengeTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setting Rows (Exact match with reference screenshot) */}
        <div className="space-y-2.5">
          {/* 1. Protect with PIN */}
          <div
            onClick={onTogglePin}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8F5] dark:bg-slate-800/60 border border-[#FFE2D6] dark:border-slate-700 hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFEEDB] dark:bg-orange-950/60 text-[#C2410C] dark:text-orange-300 flex items-center justify-center shrink-0 shadow-2xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#FF6A45] transition-colors">
                  Protect with PIN
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isPinProtected ? "Active (4-digit passcode)" : "Lock this challenge with a 4-digit code"}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* 2. Hide */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8F5] dark:bg-slate-800/60 border border-[#FFE2D6] dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFEEDB] dark:bg-orange-950/60 text-[#C2410C] dark:text-orange-300 flex items-center justify-center shrink-0 shadow-2xs">
                <EyeOff className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Hide
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hide challenge from home feed
                </p>
              </div>
            </div>
            <CareToggle
              checked={isHiddenFromFeed}
              onChange={onToggleHide}
            />
          </div>

          {/* 3. Notifications */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8F5] dark:bg-slate-800/60 border border-[#FFE2D6] dark:border-slate-700 space-y-2">
            <div
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFEEDB] dark:bg-orange-950/60 text-[#C2410C] dark:text-orange-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#FF6A45] transition-colors">
                    Notifications
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Set daily habit reminder time ({selectedTime})
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showTimePicker ? "rotate-90" : ""}`} />
            </div>

            {showTimePicker && (
              <div className="pt-2 border-t border-orange-100 dark:border-slate-700 flex items-center gap-2">
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                    onUpdateReminderTime(e.target.value);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-black text-slate-900 dark:text-white"
                />
                <span className="text-[11px] font-medium text-slate-500">Every day</span>
              </div>
            )}
          </div>

          {/* 4. Restart */}
          <div
            onClick={() => setShowRestartConfirm(true)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 hover:border-rose-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-2xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400">
                  Restart
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Reset progress back to Day 1
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Restart Confirmation Dialog */}
        {showRestartConfirm && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-black">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Are you sure you want to restart?</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              This will clear completed days for this challenge cycle and reset your active streak back to Day 1.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onRestartChallenge();
                  setShowRestartConfirm(false);
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700"
              >
                Confirm Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
