import React, { useState } from "react";
import {
  Moon,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  Activity,
  BedDouble,
  Sun,
  Shield,
  Plus,
  Droplets,
  Heart,
  Flame,
  Wind
} from "lucide-react";
import { soundEngine } from "./soundEngine";

export const MentalSleep: React.FC = () => {
  const [sleepScore, setSleepScore] = useState<number>(78);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [logHours, setLogHours] = useState<number>(7.5);
  const [logQuality, setLogQuality] = useState<string>("Good");

  // SVG Circular progress
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - sleepScore / 100);

  const sleepStages = [
    { label: "Awake", time: "15 m", percent: 5, color: "bg-rose-400" },
    { label: "Light", time: "4 h 10 m", percent: 55, color: "bg-orange-300" },
    { label: "Deep", time: "2 h 5 m", percent: 25, color: "bg-[#FF5A36]" },
    { label: "REM", time: "1 h 5 m", percent: 15, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Sleep Overview Card (Water Gauge Styling in Peach) */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sleep Performance</span>
            <p className="text-sm font-black text-slate-800">Last Night • 7h 35m total</p>
          </div>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Log Sleep</span>
          </button>
        </div>

        {/* Circular Sleep Gauge */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" stroke="#FEE2D5" strokeWidth="12" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="#FF5A36"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <Moon className="w-6 h-6 text-[#FF5A36] mb-0.5" />
              <span className="text-2xl font-black text-slate-900 tracking-tight">{sleepScore}</span>
              <span className="text-[10px] font-bold text-slate-400">Sleep Score</span>
              <span className="text-xs font-black text-[#FF5A36]">Restorative</span>
            </div>
          </div>

          <div className="space-y-2.5 w-full sm:w-56">
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total Duration</div>
              <div className="text-sm font-black text-slate-900">7 hrs 35 mins</div>
            </div>
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Deep Restful Sleep</div>
              <div className="text-sm font-black text-[#FF5A36]">2 hrs 05 mins (Optimal)</div>
            </div>
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Sleep Schedule</div>
              <div className="text-sm font-black text-slate-900">11:15 PM – 6:50 AM</div>
            </div>
          </div>
        </div>

        {/* Sleep Stages Breakdown Timeline Bar */}
        <div className="space-y-2 pt-2 border-t border-orange-100">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
            Sleep Stages Distribution
          </span>

          <div className="h-4 flex rounded-xl overflow-hidden shadow-2xs">
            {sleepStages.map((stage) => (
              <div
                key={stage.label}
                className={`${stage.color}`}
                style={{ width: `${stage.percent}%` }}
                title={`${stage.label}: ${stage.time}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {sleepStages.map((stage) => (
              <div key={stage.label} className="text-center p-2 bg-[#FFF9F5] rounded-xl border border-orange-100">
                <span className="text-[10px] font-bold text-slate-400 block">{stage.label}</span>
                <span className="text-xs font-black text-slate-900 block">{stage.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Sleep Hygiene Routine */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Wind-Down Evening Protocol
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "No Blue Light", desc: "Disconnect screens 45 min before sleep", icon: Moon },
            { title: "Cool Room Temp", desc: "Maintain 18-20°C for deep REM sleep", icon: Sun },
            { title: "4-7-8 Breathwork", desc: "3 minutes diaphragmatic relaxation", icon: Wind },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3.5 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-[#FF5A36]">
                  <Icon className="w-4 h-4" />
                  <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-100 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Log Last Night's Sleep</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  Hours Slept: {logHours} hrs
                </label>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={0.5}
                  value={logHours}
                  onChange={(e) => setLogHours(Number(e.target.value))}
                  className="w-full accent-[#FF5A36]"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Perceived Quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Poor", "Fair", "Good", "Excellent"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setLogQuality(q)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        logQuality === q
                          ? "bg-[#FF5A36] text-white border-[#FF5A36]"
                          : "bg-[#FFF9F5] border-orange-200 text-slate-700"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playChime(600, 0.4);
                setSleepScore(Math.min(100, Math.round(logHours * 11)));
                setIsLogModalOpen(false);
              }}
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
            >
              Save Sleep Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
