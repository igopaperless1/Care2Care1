import React, { useState } from "react";
import {
  Bell,
  Lock,
  Moon,
  Volume2,
  Shield,
  Download,
  Trash2,
  Check,
  Smartphone,
  Flame,
  Droplets,
  Heart
} from "lucide-react";
import { soundEngine } from "./soundEngine";

export const MentalSettings: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [anonymousCommunity, setAnonymousCommunity] = useState(true);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Preferences
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Mental Wellness Settings</h2>
          <p className="text-xs text-slate-500 font-medium">Manage notifications, acoustic feedback, and privacy.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5A36]">
          <Shield className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Audio & Haptics */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Audio & Feedback
        </span>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-[#FFF9F5] rounded-2xl border border-orange-200/60">
            <div>
              <h4 className="text-xs font-black text-slate-900">Mindful Acoustic Chimes</h4>
              <p className="text-[11px] text-slate-500 font-medium">Gentle auditory cues during breathing & timers</p>
            </div>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                soundEngine.playChime(600, 0.2);
              }}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                soundEnabled ? "bg-[#FF5A36] justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#FFF9F5] rounded-2xl border border-orange-200/60">
            <div>
              <h4 className="text-xs font-black text-slate-900">Haptic Feedback</h4>
              <p className="text-[11px] text-slate-500 font-medium">Subtle vibrations on session phase changes</p>
            </div>
            <button
              onClick={() => setHapticsEnabled(!hapticsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                hapticsEnabled ? "bg-[#FF5A36] justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Privacy & Data */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Security & Privacy
        </span>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-[#FFF9F5] rounded-2xl border border-orange-200/60">
            <div>
              <h4 className="text-xs font-black text-slate-900">Passcode / FaceID Lock</h4>
              <p className="text-[11px] text-slate-500 font-medium">Require biometrics before opening private journal entries</p>
            </div>
            <button
              onClick={() => setBiometrics(!biometrics)}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                biometrics ? "bg-[#FF5A36] justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#FFF9F5] rounded-2xl border border-orange-200/60">
            <div>
              <h4 className="text-xs font-black text-slate-900">Anonymous Mode</h4>
              <p className="text-[11px] text-slate-500 font-medium">Mask identity when posting in the community feed</p>
            </div>
            <button
              onClick={() => setAnonymousCommunity(!anonymousCommunity)}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                anonymousCommunity ? "bg-[#FF5A36] justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
