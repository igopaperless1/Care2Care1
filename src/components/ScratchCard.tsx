import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  CheckCircle2,
  Share2,
  Tv,
  Coins,
  ArrowLeft,
  X,
  Volume2
} from "lucide-react";

interface ScratchCardProps {
  revealContent: React.ReactNode;
  onCompleteDay?: (points: number) => void;
  onComplete?: () => void;
  onShare?: () => void;
  height?: number;
  habitType?: "good" | "bad";
  isAlreadyCompleted?: boolean;
  dayNumber?: number;
  challengeTitle?: string;
  onClose?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  revealContent,
  onCompleteDay,
  onComplete,
  onShare,
  height = 280,
  habitType = "good",
  isAlreadyCompleted = false,
  dayNumber = 1,
  challengeTitle = "Daily Habit",
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratched, setIsScratched] = useState<boolean>(isAlreadyCompleted);
  const [percentScratched, setPercentScratched] = useState<number>(isAlreadyCompleted ? 100 : 0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showAdPlaying, setShowAdPlaying] = useState<boolean>(false);
  const [adProgress, setAdProgress] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isBadHabit = habitType === "bad";
  const lastSoundTimeRef = useRef<number>(0);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Scratch sound synthesis
  const playScratchSound = useCallback(() => {
    const now = Date.now();
    if (now - lastSoundTimeRef.current < 75) return;
    lastSoundTimeRef.current = now;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(320 + Math.random() * 100, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio fallback
    }
  }, []);

  // Initialize Canvas Overlay with Pastel Peach Aesthetic
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Peach Gradient Overlay (#FFC9A7 to #FDE7D6)
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#FFC9A7");
    gradient.addColorStop(0.5, "#FDE7D6");
    gradient.addColorStop(1, "#FFB890");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Decorative Pattern
    ctx.strokeStyle = "#F97316";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(10, 10, rect.width - 20, rect.height - 20);
    ctx.setLineDash([]);

    // Text instructions
    ctx.font = "900 14px sans-serif";
    ctx.fillStyle = "#7C2D12"; // dark brown/terracotta
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to see today's challenge", rect.width / 2, rect.height / 2 - 10);

    ctx.font = "700 11px sans-serif";
    ctx.fillStyle = "#9A3412";
    ctx.fillText("Swipe with finger or mouse", rect.width / 2, rect.height / 2 + 14);
  }, []);

  useEffect(() => {
    if (!isAlreadyCompleted) {
      initCanvas();
    }
  }, [initCanvas, isAlreadyCompleted]);

  // Scratch Drawing Logic
  const handleScratch = useCallback(
    (clientX: number, clientY: number) => {
      if (isScratched) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      playScratchSound();

      // Calculate Scratched Area Percentage
      try {
        const dpr = window.devicePixelRatio || 1;
        const w = Math.floor(canvas.width);
        const h = Math.floor(canvas.height);
        const sampleStep = 8;
        const imgData = ctx.getImageData(0, 0, w, h);
        const pixels = imgData.data;
        let transparentPixels = 0;
        let totalSampled = 0;

        for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
          totalSampled++;
          if (pixels[i] === 0) {
            transparentPixels++;
          }
        }

        const pct = Math.round((transparentPixels / totalSampled) * 100);
        setPercentScratched(pct);

        if (pct >= 40 && !isScratched) {
          setIsScratched(true);
        }
      } catch {
        // Fallback
      }
    },
    [isScratched, playScratchSound]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handleScratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    handleScratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (e.touches[0]) {
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e.touches[0]) {
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleSkipScratch = () => {
    setIsScratched(true);
    setPercentScratched(100);
  };

  // Rewarded Ad Simulation (Awards 5 Points)
  const handleWatchAd = () => {
    setShowAdPlaying(true);
    setAdProgress(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 20;
      setAdProgress(step);
      if (step >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setShowAdPlaying(false);
          if (onCompleteDay) {
            onCompleteDay(5);
          } else if (onComplete) {
            onComplete();
          }
        }, 400);
      }
    }, 400);
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else {
      if (navigator.share) {
        navigator
          .share({
            title: `Care2Care 21-Day Challenge`,
            text: `I'm on Day ${dayNumber} of the ${challengeTitle} challenge! Building strong habits every day.`
          })
          .catch(() => {});
      } else {
        navigator.clipboard?.writeText(
          `I just unlocked Day ${dayNumber} of the "${challengeTitle}" challenge on Care2Care!`
        );
        triggerToast("📋 Progress copied to clipboard!");
      }
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto relative">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl border border-slate-700">
          {toastMsg}
        </div>
      )}

      {/* Main Square Scratch Box Container (1:1 Ratio Box) */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-[340px] mx-auto rounded-3xl overflow-hidden shadow-md border-2 border-[#FDE7D6] bg-white dark:bg-slate-900 select-none touch-none"
      >
        {/* Reveal Layer Underneath */}
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center">
          {revealContent}
        </div>

        {/* Scratchable Canvas Overlay */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full cursor-pointer z-10"
          />
        )}
      </div>

      {/* Reward & Action Buttons Section */}
      <div className="space-y-2.5 max-w-[340px] mx-auto">
        {/* Share & Skip Scratch Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleShareClick}
            className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-black rounded-2xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Share2 className="w-4 h-4 text-orange-600" />
            <span>Share</span>
          </button>

          {!isScratched ? (
            <button
              type="button"
              onClick={handleSkipScratch}
              className="py-2.5 px-3 bg-[#FFF8F3] dark:bg-slate-800 text-orange-950 dark:text-orange-200 border border-[#FDE7D6] dark:border-slate-700 text-xs font-black rounded-2xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-orange-100"
            >
              <span>Skip scratch</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="py-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-black rounded-2xl flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Revealed</span>
            </button>
          )}
        </div>

        {/* 1. White Completion Reward Banner */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => {
            if (onCompleteDay) {
              onCompleteDay(2);
            } else if (onComplete) {
              onComplete();
            }
          }}
          className="w-full py-3.5 px-4 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs flex items-center justify-between text-slate-900 dark:text-white cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs sm:text-sm font-black">Challenge completed</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-xl">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>2 points</span>
          </div>
        </motion.button>

        {/* 2. Yellow Ad Reward Banner */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={handleWatchAd}
          className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-500 text-amber-950 border-2 border-amber-500 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-amber-950" />
            <span className="text-xs sm:text-sm font-black">Ad</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-black bg-amber-500 text-amber-950 px-2.5 py-1 rounded-xl">
            <Coins className="w-3.5 h-3.5 text-amber-950" />
            <span>5 points</span>
          </div>
        </motion.button>
      </div>

      {/* Rewarded Ad Modal Simulator */}
      <AnimatePresence>
        {showAdPlaying && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-amber-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center mx-auto text-2xl shadow-md">
                <Tv className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Sponsor Reward Video
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Watching rewarded video to claim 5 Bonus Points...
                </p>
              </div>

              {/* Progress */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${adProgress}%` }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
