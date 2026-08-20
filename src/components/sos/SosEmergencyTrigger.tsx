import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Siren,
  Phone,
  PhoneCall,
  MapPin,
  Share2,
  Check,
  X,
  Volume2,
  VolumeX,
  Edit2,
  Copy,
  Radio,
  Clock,
  Shield,
  Activity,
  Flame,
  CheckCircle2
} from "lucide-react";
import { SosEmergencyContact } from "./types";

interface SosEmergencyTriggerProps {
  contacts: SosEmergencyContact[];
  onTriggerSosComplete: (message: string, isLiveLocation: boolean) => void;
  onCancelEmergency?: () => void;
  isEmergencyActive?: boolean;
}

export const SosEmergencyTrigger: React.FC<SosEmergencyTriggerProps> = ({
  contacts,
  onTriggerSosComplete,
  onCancelEmergency,
  isEmergencyActive = false
}) => {
  const [holdingTime, setHoldingTime] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLiveLocation, setIsLiveLocation] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<string>(
    "I need help! This is an emergency. Please send assistance to my current GPS location immediately."
  );
  const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const holdIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);
  const sirenGainRef = useRef<GainNode | null>(null);

  // Siren Audio Synthesizer via Web Audio API
  const startSirenAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      // Pitch sweep
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 2.5; // 2.5 Hz siren frequency
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400; // Sweep between 400Hz and 1200Hz

      lfo.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.start();
      lfo.start();

      sirenOscRef.current = osc;
      sirenGainRef.current = gain;
      setIsSirenPlaying(true);
    } catch (e) {
      console.warn("Audio Context init error", e);
    }
  };

  const stopSirenAudio = () => {
    try {
      if (sirenGainRef.current && audioCtxRef.current) {
        sirenGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
      setIsSirenPlaying(false);
    } catch (e) {
      console.warn("Error stopping audio", e);
    }
  };

  useEffect(() => {
    return () => {
      stopSirenAudio();
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const handleStartHold = () => {
    setIsHolding(true);
    setHoldingTime(0);
    holdIntervalRef.current = setInterval(() => {
      setHoldingTime((prev) => {
        if (prev >= 3) {
          clearInterval(holdIntervalRef.current);
          setIsHolding(false);
          triggerCountdown();
          return 3;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const handleCancelHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldingTime(0);
  };

  const triggerCountdown = () => {
    setCountdown(5);
    startSirenAudio();
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          onTriggerSosComplete(alertMessage, isLiveLocation);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const abortCountdown = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setCountdown(null);
    stopSirenAudio();
    if (onCancelEmergency) onCancelEmergency();
  };

  const copyLiveCoordinates = () => {
    navigator.clipboard.writeText(
      `https://maps.google.com/?q=27.6934,85.3148 (Emergency Live GPS - Care2Care SOS)`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* SCREEN 2 HEADER */}
      <div className="text-center max-w-md mx-auto space-y-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#FF5A36]" />
          <span>Send SOS Alert</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Alert will be sent to your emergency contacts and share your location.
        </p>
      </div>

      {/* ACTIVE EMERGENCY DISPATCH BANNER (IF TRIGGERED) */}
      {(isEmergencyActive || countdown !== null) && (
        <div className="bg-red-500 text-white rounded-3xl p-5 shadow-lg shadow-red-500/30 text-center relative overflow-hidden animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Siren className="w-5 h-5 animate-bounce" />
              <span className="text-xs font-black uppercase tracking-wider">
                {countdown !== null && countdown > 0 ? "SOS Dispatching In" : "EMERGENCY BROADCAST ACTIVE"}
              </span>
            </div>
            <button
              onClick={isSirenPlaying ? stopSirenAudio : startSirenAudio}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              title={isSirenPlaying ? "Mute Siren" : "Play Siren"}
            >
              {isSirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {countdown !== null && countdown > 0 ? (
            <div className="space-y-3">
              <div className="text-4xl font-black">{countdown}s</div>
              <p className="text-xs text-red-100">
                Cancel immediately if this was pressed by mistake!
              </p>
              <button
                onClick={abortCountdown}
                className="px-6 py-2.5 rounded-2xl bg-white text-red-600 font-black text-xs shadow-md hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
              >
                CANCEL SOS ALERT
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-red-100 font-medium">
                Live location link dispatched to {contacts.length} emergency contacts & local dispatch desk.
              </p>
              <div className="flex items-center justify-center gap-2">
                <a
                  href="tel:100"
                  className="px-4 py-2 rounded-xl bg-white text-red-600 font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Police 100</span>
                </a>
                <a
                  href="tel:102"
                  className="px-4 py-2 rounded-xl bg-white text-red-600 font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Ambulance 102</span>
                </a>
              </div>
              <button
                onClick={abortCountdown}
                className="text-xs text-white/90 underline font-semibold mt-2 block mx-auto cursor-pointer"
              >
                End & Reset Emergency State
              </button>
            </div>
          )}
        </div>
      )}

      {/* BIG CIRCULAR RADAR PULSATING BUTTON (SCREEN 2 DESIGN) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-8 shadow-xs flex flex-col items-center justify-center relative overflow-hidden">
        {/* Concentric Radar Rings */}
        <div className="relative flex items-center justify-center py-4">
          <div className="w-60 h-60 rounded-full bg-orange-500/5 border border-orange-500/10 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                {/* SVG Radial Progress */}
                <svg className="w-36 h-36 -rotate-90 pointer-events-none absolute" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" stroke="#FFE8DE" strokeWidth="6" fill="none" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#FF5A36"
                    strokeWidth="6"
                    strokeDasharray={314.15}
                    strokeDashoffset={314.15 * (1 - Math.min(holdingTime / 3, 1))}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Core Big Button */}
                <button
                  onMouseDown={handleStartHold}
                  onMouseUp={handleCancelHold}
                  onMouseLeave={handleCancelHold}
                  onTouchStart={handleStartHold}
                  onTouchEnd={handleCancelHold}
                  onClick={() => {
                    if (holdingTime < 0.2) triggerCountdown();
                  }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF5A36] to-[#E63920] text-white font-black text-2xl tracking-wider shadow-xl shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer select-none"
                >
                  <span>SOS</span>
                  <span className="text-[9px] font-bold opacity-90 tracking-wider -mt-0.5">
                    {isHolding ? `${(3 - holdingTime).toFixed(1)}s` : "TRIGGER"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status text & timer */}
        <div className="text-center mt-3 space-y-1">
          <p className="text-xs font-bold text-slate-500">
            Press and hold for 3 seconds
          </p>
          <div className="text-base font-black text-slate-900 font-mono">
            {isHolding ? `0:0${Math.floor(3 - holdingTime)}` : "0:00"}
          </div>
        </div>
      </div>

      {/* ALERT MESSAGE BOX (SCREEN 2) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Alert Message
          </span>
          <button
            onClick={() => setIsEditingMessage(!isEditingMessage)}
            className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingMessage ? "Done" : "Edit"}</span>
          </button>
        </div>

        {isEditingMessage ? (
          <textarea
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
            rows={3}
            className="w-full p-3 text-xs text-slate-800 bg-[#FFF9F5] border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
          />
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#FFE8DE] text-xs font-medium text-slate-700 leading-relaxed">
            "{alertMessage}"
          </div>
        )}
      </div>

      {/* LIVE LOCATION TOGGLE & GPS DETAILS (SCREEN 2) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Live Location</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {isLiveLocation ? "Sharing enabled (27.6934° N, 85.3148° E)" : "Sharing disabled"}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setIsLiveLocation(!isLiveLocation)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              isLiveLocation ? "bg-[#FF5A36]" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                isLiveLocation ? "left-6.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {isLiveLocation && (
          <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/70 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold">Current Accuracy:</span>
              <span className="font-black text-slate-900">High (±8 meters)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold">Reverse Geocode:</span>
              <span className="font-black text-slate-900 truncate max-w-[200px]">
                Tripureshwor, Kathmandu, Nepal
              </span>
            </div>
            <button
              onClick={copyLiveCoordinates}
              className="w-full mt-2 py-2 rounded-xl bg-white border border-orange-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-orange-100/50 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#FF5A36]" />}
              <span>{copiedLink ? "Link Copied to Clipboard!" : "Copy Live GPS Google Map Link"}</span>
            </button>
          </div>
        )}
      </div>

      {/* DISPATCH CONTACT LIST RECIPIENTS */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Alert Will Broadcast To ({contacts.length} Contacts)
        </span>
        <div className="divide-y divide-orange-100/60">
          {contacts.map((c) => (
            <div key={c.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                  alt={c.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <span className="text-xs font-black text-slate-800">{c.name}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">({c.relationship})</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#FF5A36]">{c.phone}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
