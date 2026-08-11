import React, { useState, useEffect } from "react";
import { Sparkles, X, PlayCircle, ShieldCheck, ExternalLink, RefreshCw, Trophy } from "lucide-react";

interface AdPlacementProps {
  type: "banner" | "interstitial" | "native" | "rewarded";
  placementName?: string;
  isPremiumUser: boolean;
  onAdClosed?: () => void;
  onRewardEarned?: (durationHours: number) => void;
}

const DEMO_ADS = [
  {
    title: "Healthcare+ Senior Vital Monitor",
    description: "24/7 Wireless ECG & Blood Pressure Cuff with instant family alerts. Get 20% Off!",
    sponsor: "HealthTech Global",
    cta: "Learn More",
    bg: "bg-gradient-to-r from-blue-900 to-indigo-900",
    link: "#"
  },
  {
    title: "Organic Farm Fresh Nutrition Box",
    description: "Farm-to-table organic vegetables delivered right to senior care centers & home.",
    sponsor: "Green Harvest Organics",
    cta: "Get 30% Discount",
    bg: "bg-gradient-to-r from-emerald-900 to-teal-900",
    link: "#"
  },
  {
    title: "Senior Telehealth Express",
    description: "Talk to a board-certified physician in under 5 minutes without leaving home.",
    sponsor: "TeleCare Urgent",
    cta: "Consult Doctor Now",
    bg: "bg-gradient-to-r from-purple-900 to-slate-900",
    link: "#"
  }
];

export const AdPlacement: React.FC<AdPlacementProps> = ({
  type,
  placementName = "default",
  isPremiumUser,
  onAdClosed,
  onRewardEarned
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [interstitialSecondsLeft, setInterstitialSecondsLeft] = useState(5);
  const [isRewardedWatching, setIsRewardedWatching] = useState(false);
  const [rewardSecondsLeft, setRewardSecondsLeft] = useState(10);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate ads periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % DEMO_ADS.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Interstitial Countdown
  useEffect(() => {
    if (type === "interstitial" && interstitialSecondsLeft > 0) {
      const timer = setInterval(() => {
        setInterstitialSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [type, interstitialSecondsLeft]);

  // Rewarded Video Countdown Simulator
  useEffect(() => {
    if (isRewardedWatching && rewardSecondsLeft > 0) {
      const timer = setInterval(() => {
        setRewardSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isRewardedWatching && rewardSecondsLeft === 0) {
      setIsRewardedWatching(false);
      if (onRewardEarned) onRewardEarned(1); // 1 hour ad free
    }
  }, [isRewardedWatching, rewardSecondsLeft, onRewardEarned]);

  // If user has a paid tier, hide all ads automatically!
  if (isPremiumUser || !isVisible) {
    return null;
  }

  const ad = DEMO_ADS[currentAdIndex];

  // 1. BANNER AD (Static Header / Footer)
  if (type === "banner") {
    return (
      <div className="w-full max-w-4xl mx-auto my-3 p-2 sm:p-3 bg-slate-900 text-white rounded-2xl border border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative overflow-hidden group">
        <div className="flex items-center gap-2.5 z-10 min-w-0">
          <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
            AdMob Sponsored
          </span>
          <div className="truncate">
            <h4 className="font-extrabold text-amber-200 truncate">{ad.title}</h4>
            <p className="text-[10px] text-slate-300 truncate">{ad.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10 w-full sm:w-auto justify-end">
          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] rounded-xl flex items-center gap-1 transition-all"
          >
            {ad.cta} <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Dismiss Ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. INTERSTITIAL AD (Fullscreen Dialog Overlay)
  if (type === "interstitial") {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
        <div className={`w-full max-w-md ${ad.bg} text-white rounded-3xl p-6 shadow-2xl border border-amber-400/40 space-y-5 text-center relative`}>
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-300">
            <span className="bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/40">
              AdMob Interstitial Ad (Free Tier)
            </span>
            <span>{ad.sponsor}</span>
          </div>

          <div className="py-4 space-y-2">
            <h3 className="text-xl font-black text-amber-100">{ad.title}</h3>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">{ad.description}</p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
            >
              {ad.cta} <ExternalLink className="w-4 h-4" />
            </a>

            {interstitialSecondsLeft > 0 ? (
              <div className="text-[11px] font-bold text-slate-400 py-2">
                You can skip this ad in {interstitialSecondsLeft}s...
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsVisible(false);
                  if (onAdClosed) onAdClosed();
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs transition-colors cursor-pointer border border-slate-700"
              >
                Skip Ad & Continue
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. NATIVE IN-FEED AD
  if (type === "native") {
    return (
      <div className="my-3 p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center justify-between text-[10px] font-black text-amber-800">
          <span className="bg-amber-200/80 px-2 py-0.5 rounded uppercase">Sponsored Result</span>
          <span>{ad.sponsor}</span>
        </div>
        <h4 className="font-extrabold text-slate-900">{ad.title}</h4>
        <p className="text-[11px] text-slate-600">{ad.description}</p>
        <div className="pt-1 flex justify-end">
          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-[10px] inline-flex items-center gap-1"
          >
            {ad.cta} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // 4. REWARDED VIDEO AD (Watch to unlock 1 hour Ad-Free)
  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-700 shadow-md space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h4 className="font-black text-white">Watch Video to Unlock 1-Hour Ad-Free Access</h4>
        </div>
        <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/30">
          Rewarded Ad
        </span>
      </div>

      {isRewardedWatching ? (
        <div className="p-4 bg-slate-950 rounded-xl space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-black">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Watching Sponsored Video ({rewardSecondsLeft}s remaining)...</span>
          </div>
          <p className="text-[10px] text-slate-400">Do not close window until timer completes to claim 1 hour ad-free reward!</p>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsRewardedWatching(true);
            setRewardSecondsLeft(10);
          }}
          className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <PlayCircle className="w-4 h-4" /> Watch 10s Video & Unlock 1 Hour Ad-Free
        </button>
      )}
    </div>
  );
};
