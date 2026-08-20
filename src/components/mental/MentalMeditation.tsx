import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Play,
  Pause,
  Clock,
  Wind,
  Volume2,
  VolumeX,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ChevronRight,
  Droplets,
  CloudRain,
  Waves,
  Trees,
  Flame,
  Heart
} from "lucide-react";
import { MeditationItem } from "./types";
import { soundEngine } from "./soundEngine";

export const MentalMeditation: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"For You" | "Sleep" | "Anxiety" | "Focus" | "Stress">("For You");
  const [activeTrack, setActiveTrack] = useState<string | null>("m-1");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackProgress, setTrackProgress] = useState<number>(60);

  // Breathing Guide State
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);
  const [breathTechnique, setBreathTechnique] = useState<"Box Breathing" | "4-7-8" | "Deep Calm">("Box Breathing");
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
  const [breathCounter, setBreathCounter] = useState<number>(4);
  const [breathCycles, setBreathCycles] = useState<number>(0);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  // Soundscape State
  const [activeSoundscape, setActiveSoundscape] = useState<"stream" | "rain" | "waves" | "whitenoise" | null>(null);

  const categories: ("For You" | "Sleep" | "Anxiety" | "Focus" | "Stress")[] = [
    "For You",
    "Sleep",
    "Anxiety",
    "Focus",
    "Stress",
  ];

  const continueListeningItem: MeditationItem = {
    id: "m-1",
    title: "Morning Calm & Intention",
    category: "For You",
    duration: "5 min",
    durationMinutes: 5,
    completedPercent: 60,
    description: "Mindfulness meditation to center your thoughts and set peaceful intentions.",
  };

  const recommendedItems: MeditationItem[] = [
    {
      id: "m-2",
      title: "Deep Relaxation & Release",
      category: "Stress",
      duration: "10 min",
      durationMinutes: 10,
      description: "Release somatic muscular tension with calming breath cues.",
    },
    {
      id: "m-3",
      title: "Anxiety Relief Grounding",
      category: "Anxiety",
      duration: "8 min",
      durationMinutes: 8,
      description: "Gentle grounding 5-4-3-2-1 exercise for racing thoughts and stress.",
    },
    {
      id: "m-4",
      title: "Evening Body Scan",
      category: "Sleep",
      duration: "15 min",
      durationMinutes: 15,
      description: "Progressive head-to-toe relaxation to prepare for deep restorative rest.",
    },
    {
      id: "m-5",
      title: "Self-Love & Compassion",
      category: "For You",
      duration: "7 min",
      durationMinutes: 7,
      description: "Cultivate inner kindness and positive self-talk affirmations.",
    },
    {
      id: "m-6",
      title: "Laser Focus & Clarity",
      category: "Focus",
      duration: "6 min",
      durationMinutes: 6,
      description: "Sharp sensory awareness techniques to eliminate mental clutter.",
    },
  ];

  const toggleSoundscape = (type: "stream" | "rain" | "waves" | "whitenoise") => {
    if (activeSoundscape === type) {
      soundEngine.stopSoundscape();
      setActiveSoundscape(null);
    } else {
      soundEngine.startSoundscape(type);
      setActiveSoundscape(type);
    }
  };

  // Breathing interval timer
  useEffect(() => {
    let interval: any = null;
    if (isBreathingModalOpen && isBreathingActive) {
      interval = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev > 1) {
            return prev - 1;
          }
          // Advance phase
          if (breathTechnique === "Box Breathing") {
            if (breathPhase === "Inhale") {
              setBreathPhase("Hold");
              soundEngine.playChime(520, 0.2);
              return 4;
            } else if (breathPhase === "Hold") {
              setBreathPhase("Exhale");
              soundEngine.playChime(420, 0.2);
              return 4;
            } else if (breathPhase === "Exhale") {
              setBreathPhase("Pause");
              soundEngine.playChime(360, 0.2);
              return 4;
            } else {
              setBreathPhase("Inhale");
              soundEngine.playChime(600, 0.3);
              setBreathCycles((c) => c + 1);
              return 4;
            }
          } else if (breathTechnique === "4-7-8") {
            if (breathPhase === "Inhale") {
              setBreathPhase("Hold");
              soundEngine.playChime(520, 0.2);
              return 7;
            } else if (breathPhase === "Hold") {
              setBreathPhase("Exhale");
              soundEngine.playChime(380, 0.3);
              return 8;
            } else {
              setBreathPhase("Inhale");
              soundEngine.playChime(600, 0.3);
              setBreathCycles((c) => c + 1);
              return 4;
            }
          }
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingModalOpen, isBreathingActive, breathPhase, breathTechnique]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Interactive Breathing Hero Card in Peach theme */}
      <div className="bg-gradient-to-r from-[#FF5A36] to-[#FF8B6B] rounded-3xl p-5 sm:p-6 text-white shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
            <Wind className="w-3 h-3" />
            <span>Interactive Tool</span>
          </div>
          <h2 className="text-xl font-black text-white">Diaphragmatic Breathing Circle</h2>
          <p className="text-xs text-orange-100 font-medium">
            Proven to drop heart rate and reduce cortisol in under 2 minutes.
          </p>
        </div>

        <button
          onClick={() => {
            setIsBreathingModalOpen(true);
            setIsBreathingActive(true);
            soundEngine.playChime(600, 0.5);
          }}
          className="px-5 py-3 bg-white hover:bg-orange-50 text-[#FF5A36] font-black text-xs rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-current text-[#FF5A36]" />
          <span>Launch Breath Guide</span>
        </button>
      </div>

      {/* 2. Ambient Soundscape Synthesizers */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Calming Ambient Soundscapes
          </span>
          {activeSoundscape && (
            <span className="text-[10px] font-black text-[#FF5A36] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-ping" />
              Playing Live Audio
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: "stream" as const, label: "Gentle Stream", icon: Droplets },
            { id: "rain" as const, label: "Soft Rainfall", icon: CloudRain },
            { id: "waves" as const, label: "Ocean Waves", icon: Waves },
            { id: "whitenoise" as const, label: "Forest Wind", icon: Trees },
          ].map((sound) => {
            const Icon = sound.icon;
            const isActive = activeSoundscape === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => toggleSoundscape(sound.id)}
                className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs scale-102"
                    : "bg-[#FFF9F5] border-orange-200/80 text-slate-700 hover:bg-orange-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#FF5A36]"}`} />
                <span className="text-xs font-black">{sound.label}</span>
                <span className={`text-[10px] ${isActive ? "text-orange-100 font-bold" : "text-slate-400"}`}>
                  {isActive ? "Playing" : "Tap to Play"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              activeCategory === cat
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-2xs font-black"
                : "bg-white text-slate-700 hover:bg-orange-50 border-slate-200/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Active Audio Session Player */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5A36]">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#FF5A36]">Now Playing</span>
              <h3 className="text-sm font-black text-slate-900">{continueListeningItem.title}</h3>
              <p className="text-[11px] font-bold text-slate-400">Guided Meditation • 5 min</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundEngine.playChime(isPlaying ? 380 : 580, 0.3);
            }}
            className="w-11 h-11 rounded-2xl bg-[#FF5A36] hover:bg-[#E04826] text-white flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Progress Bar in Peach */}
        <div className="space-y-1.5">
          <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF5A36] rounded-full transition-all duration-300"
              style={{ width: `${trackProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>3:00</span>
            <span>5:00</span>
          </div>
        </div>
      </div>

      {/* 5. Recommended Tracks Feed */}
      <div className="space-y-2.5">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Recommended Guided Sessions
        </span>

        {recommendedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveTrack(item.id);
              setIsPlaying(true);
              soundEngine.playChime(600, 0.4);
            }}
            className="bg-white border border-slate-200/80 hover:border-orange-200 p-4 rounded-3xl flex items-center justify-between gap-3 cursor-pointer group transition-all shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 line-clamp-1">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-0.5">
                  <span className="text-[#FF5A36] bg-orange-100 px-2 py-0.2 rounded-md">
                    {item.category}
                  </span>
                  <span>• {item.duration}</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36]" />
          </div>
        ))}
      </div>

      {/* Breathing Guide Modal */}
      {isBreathingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-orange-100 shadow-2xl space-y-5 text-center">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {(["Box Breathing", "4-7-8"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setBreathTechnique(t);
                      setBreathPhase("Inhale");
                      setBreathCounter(4);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      breathTechnique === t
                        ? "bg-[#FF5A36] text-white shadow-2xs font-black"
                        : "bg-orange-50 text-slate-700 border border-orange-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsBreathingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-black px-2 py-1 bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Visual Animated Breathing Sphere in Peach/Orange */}
            <div className="py-6 flex items-center justify-center">
              <div
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-xl ${
                  breathPhase === "Inhale"
                    ? "scale-110 bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] shadow-orange-300"
                    : breathPhase === "Hold"
                    ? "scale-110 bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-300"
                    : breathPhase === "Exhale"
                    ? "scale-90 bg-gradient-to-tr from-orange-400 to-rose-400 shadow-orange-200"
                    : "scale-90 bg-gradient-to-tr from-orange-300 to-amber-400"
                }`}
              >
                <span className="text-xl font-black uppercase tracking-wider">{breathPhase}</span>
                <span className="text-4xl font-black mt-1">{breathCounter}</span>
                <span className="text-[10px] font-bold opacity-80 mt-1">Cycle {breathCycles}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Inhale through nose, fill lungs comfortably, exhale slowly through mouth.
            </p>

            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black shadow-xs cursor-pointer"
            >
              {isBreathingActive ? "Pause Guide" : "Resume Guide"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
