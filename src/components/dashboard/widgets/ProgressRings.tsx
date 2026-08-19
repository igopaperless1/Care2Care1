import React from "react";
import { Droplets, Flame, Wallet, Sparkles } from "lucide-react";

interface RingProps {
  label: string;
  value: string;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

const SingleRing: React.FC<RingProps> = ({ label, value, percentage, color, icon }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center text-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            className="text-slate-200 dark:text-slate-700"
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">{icon}</div>
      </div>
      <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 mt-2">
        {value}
      </span>
      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

export const ProgressRings: React.FC<{ widgetId?: string }> = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SingleRing
        label="Water"
        value="1,800 / 2,500ml"
        percentage={72}
        color="#0284c7"
        icon={<Droplets className="w-4 h-4 text-sky-600" />}
      />
      <SingleRing
        label="Steps"
        value="6,420 / 10k"
        percentage={64}
        color="#10b981"
        icon={<Flame className="w-4 h-4 text-emerald-600" />}
      />
      <SingleRing
        label="Budget"
        value="78% Used"
        percentage={78}
        color="#f59e0b"
        icon={<Wallet className="w-4 h-4 text-amber-600" />}
      />
      <SingleRing
        label="Habits"
        value="4 / 5 Streak"
        percentage={80}
        color="#8b5cf6"
        icon={<Sparkles className="w-4 h-4 text-purple-600" />}
      />
    </div>
  );
};
