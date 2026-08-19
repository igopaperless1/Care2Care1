import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Gift, Play, X, Check, Flame, Trophy, Coins, ShieldCheck, Zap, Clock } from "lucide-react";
import { getDailyRewardClaimedStatus, markDailyRewardClaimedInSupabase } from "../lib/supabaseHabits";

interface WheelSegment {
  id: number;
  label: string;
  subText: string;
  points: number;
  tokens: number;
  color: string;
  textColor: string;
  isJackpot?: boolean;
}

const SEGMENTS: WheelSegment[] = [
  { id: 0, label: "+5 Coins", subText: "Daily Spark", points: 5, tokens: 0, color: "#fef3c7", textColor: "#92400e" },
  { id: 1, label: "+10 Coins", subText: "Bronze Reward", points: 10, tokens: 0, color: "#fed7aa", textColor: "#9a3412" },
  { id: 2, label: "+1 Freeze", subText: "Streak Saver", points: 0, tokens: 1, color: "#bfdbfe", textColor: "#1e40af" },
  { id: 3, label: "+20 Coins", subText: "Silver Star", points: 20, tokens: 0, color: "#fef08a", textColor: "#854d0e" },
  { id: 4, label: "+2 Coins", subText: "Bonus Drop", points: 2, tokens: 0, color: "#dcfce7", textColor: "#166534" },
  { id: 5, label: "+15 Coins", subText: "Gold Boost", points: 15, tokens: 0, color: "#fed7aa", textColor: "#9a3412" },
  { id: 6, label: "+2 Freezes", subText: "Double Shield", points: 0, tokens: 2, color: "#c7d2fe", textColor: "#3730a3" },
  { id: 7, label: "+50 Coins", subText: "JACKPOT 🏆", points: 50, tokens: 0, color: "#fecdd3", textColor: "#9f1239", isJackpot: true },
];

interface PositiveWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (coinsEarned: number, tokensEarned: number) => void;
  userCoins?: number;
  userFreezeTokens?: number;
  onOpenScratchCard?: () => void;
}

export const PositiveWheel: React.FC<PositiveWheelProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
  userCoins = 100,
  userFreezeTokens = 0,
  onOpenScratchCard
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [winningSegment, setWinningSegment] = useState<WheelSegment | null>(null);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [adSecondsLeft, setAdSecondsLeft] = useState<number>(15);
  const [isDoubled, setIsDoubled] = useState<boolean>(false);

  // Check Supabase profiles 24-hour cycle state
  const [alreadySpunToday, setAlreadySpunToday] = useState<boolean>(false);
  const [hoursRemaining, setHoursRemaining] = useState<number>(0);

  const fetchClaimStatus = async () => {
    const status = await getDailyRewardClaimedStatus();
    setAlreadySpunToday(!status.canSpinWheel);
    setHoursRemaining(status.hoursRemaining);
  };

  useEffect(() => {
    if (isOpen) {
      fetchClaimStatus();
    }
  }, [isOpen]);

  const spinWheel = () => {
    if (isSpinning || alreadySpunToday) return;

    setIsSpinning(true);
    setWinningSegment(null);
    setIsDoubled(false);

    // Randomize winner index (0-7)
    const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;

    // Calculate total rotation: 5 full spins (1800 deg) + target segment offset
    const extraSpins = 360 * 5;
    const targetAngle = extraSpins + (360 - (winningIndex * segmentAngle + segmentAngle / 2));

    const finalRotation = rotation + targetAngle;
    setRotation(finalRotation);

    setTimeout(async () => {
      setIsSpinning(false);
      const winner = SEGMENTS[winningIndex];
      setWinningSegment(winner);
      setAlreadySpunToday(true);
      await markDailyRewardClaimedInSupabase("wheel");
    }, 4000);
  };

  const handleClaim = () => {
    if (!winningSegment || hasClaimed) return;
    const multiplier = isDoubled ? 2 : 1;
    onRewardClaimed(winningSegment.points * multiplier, winningSegment.tokens * multiplier);
    setHasClaimed(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleWatchAdToDouble = () => {
    if (isWatchingAd || isDoubled) return;
    setIsWatchingAd(true);
    setAdSecondsLeft(15);

    const interval = setInterval(() => {
      setAdSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsWatchingAd(false);
          setIsDoubled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-900/60 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative text-center overflow-hidden space-y-4 my-4"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-extrabold text-xs rounded-full border border-amber-300 dark:border-amber-800 shadow-xs mb-1">
            <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>DAILY MOTIVATION & REWARD WHEEL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Spin to Win Coins & Shields
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            24-hour cycle enforced via Supabase profiles database.
          </p>
        </div>

        {/* Current Balance Pills */}
        <div className="flex items-center justify-center gap-2">
          <div className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>{userCoins} Coins</span>
          </div>
          <div className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-1.5 text-xs font-black text-blue-900 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>{userFreezeTokens} Freeze Tokens</span>
          </div>
        </div>

        {/* The Wheel Visual */}
        <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
          {/* Top Indicator Arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-md">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-600" />
          </div>

          {/* Rotating SVG Wheel */}
          <div
            className="w-full h-full rounded-full transition-transform duration-[4000ms] cubic-bezier(0.15, 0.99, 0.35, 1) shadow-xl border-4 border-amber-400 dark:border-amber-600 overflow-hidden"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {SEGMENTS.map((seg, idx) => {
                const angle = 360 / SEGMENTS.length;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

                const textAngle = startAngle + angle / 2;
                const textX = 100 + 65 * Math.cos((Math.PI * textAngle) / 180);
                const textY = 100 + 65 * Math.sin((Math.PI * textAngle) / 180);

                return (
                  <g key={seg.id}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={seg.color}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={seg.textColor}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub */}
          <div className="absolute inset-0 m-auto w-16 h-16 bg-white dark:bg-slate-800 rounded-full border-4 border-amber-400 dark:border-amber-600 shadow-md flex items-center justify-center z-20">
            <span className="text-xl">⭐</span>
          </div>
        </div>

        {/* Winner Announcement & Action Controls */}
        {winningSegment && !isSpinning ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-300 dark:border-amber-800"
          >
            <div className="text-sm font-black text-amber-950 dark:text-amber-200">
              🎉 Congratulations! You won:
            </div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {isDoubled
                ? `${winningSegment.points > 0 ? `+${winningSegment.points * 2} Coins` : `+${winningSegment.tokens * 2} Freeze Tokens`} (DOUBLED!)`
                : `${winningSegment.label} (${winningSegment.subText})`}
            </div>

            {/* Ad to Double Button */}
            {!isDoubled && (
              <button
                type="button"
                onClick={handleWatchAdToDouble}
                disabled={isWatchingAd}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {isWatchingAd
                    ? `Watching Partner Ad (${adSecondsLeft}s)...`
                    : "📺 Watch 15s Ad to DOUBLE Reward!"}
                </span>
              </button>
            )}

            {/* Claim Reward Button */}
            <button
              type="button"
              onClick={handleClaim}
              disabled={hasClaimed}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Check className="w-5 h-5" />
              <span>{hasClaimed ? "✅ Reward Credited to Profile!" : "Claim Reward & Sync"}</span>
            </button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={spinWheel}
              disabled={isSpinning || alreadySpunToday}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>
                {isSpinning
                  ? "Spinning the Wheel..."
                  : alreadySpunToday
                  ? `✅ Claimed Today (${hoursRemaining}h cooldown)`
                  : "SPIN THE WHEEL (FREE)"}
              </span>
            </button>

            {alreadySpunToday && (
              <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Next free spin unlocks in approximately {hoursRemaining} hours.</span>
              </div>
            )}

            {onOpenScratchCard && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenScratchCard();
                }}
                className="w-full py-2.5 bg-[#FFF9F5] dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 text-orange-950 dark:text-orange-200 font-black text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>✨ Open Daily Scratch Card Beside Wheel</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
