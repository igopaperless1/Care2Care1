import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall,
  Siren,
  Sparkles,
  Share2,
  Mic,
  Camera,
  MessageSquare,
  Shield,
  Clock,
  Check,
  X,
  Volume2,
  VolumeX,
  Play,
  Square,
  Copy,
  AlertTriangle,
  Send,
  Eye,
  Flashlight
} from "lucide-react";
import { SosEmergencyContact } from "./types";

interface SosSafetyToolkitProps {
  contacts: SosEmergencyContact[];
  onNotify: (msg: string) => void;
}

export const SosSafetyToolkit: React.FC<SosSafetyToolkitProps> = ({
  contacts,
  onNotify
}) => {
  // Tool Active Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // FAKE CALL STATE
  const [fakeCallerName, setFakeCallerName] = useState<string>("Police Inspector Sharma");
  const [fakeCallDelay, setFakeCallDelay] = useState<number>(0);
  const [isFakeCallRinging, setIsFakeCallRinging] = useState<boolean>(false);
  const [isFakeCallConnected, setIsFakeCallConnected] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const callDurationRef = useRef<any>(null);

  // SIREN STATE
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // FLASHLIGHT / STROBE STATE
  const [isStrobeActive, setIsStrobeActive] = useState<boolean>(false);
  const [strobeSpeed, setStrobeSpeed] = useState<"normal" | "sos" | "rapid">("sos");
  const [strobeLightOn, setStrobeLightOn] = useState<boolean>(true);

  // AUDIO RECORDING STATE
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [audioRecordingTime, setAudioRecordingTime] = useState<number>(0);
  const audioRecordIntervalRef = useRef<any>(null);
  const [savedRecordings, setSavedRecordings] = useState<Array<{ id: string; name: string; time: string; duration: string }>>([
    { id: "rec-1", name: "Surrounding Audio Note #1", time: "15 May 2025, 8:31 PM", duration: "0:45" }
  ]);

  // PHOTO CAPTURE STATE
  const [capturedPhotos, setCapturedPhotos] = useState<Array<{ id: string; time: string; url: string }>>([
    {
      id: "p1",
      time: "15 May 2025, 8:30 PM",
      url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&auto=format&fit=crop&q=80"
    }
  ]);

  // SEND MESSAGE TEMPLATES
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    "EMERGENCY: I am feeling unsafe at my current location. Please call me or send help immediately. Live Location: https://maps.google.com/?q=27.6934,85.3148"
  );
  const [messageTargetContact, setMessageTargetContact] = useState<string>("all");

  // CHECK-IN TIMER
  const [checkInMinutes, setCheckInMinutes] = useState<number>(30);
  const [checkInActive, setCheckInActive] = useState<boolean>(false);
  const [checkInRemainingSeconds, setCheckInRemainingSeconds] = useState<number>(1800);
  const checkInIntervalRef = useRef<any>(null);

  // Web Audio Siren Handler
  const startSiren = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(850, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 3; // 3 Hz sweep
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 450;

      lfo.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);

      osc.start();
      lfo.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsSirenActive(true);
    } catch (e) {
      console.warn(e);
    }
  };

  const stopSiren = () => {
    try {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
      setIsSirenActive(false);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    let strobeTimer: any;
    if (isStrobeActive) {
      const interval = strobeSpeed === "rapid" ? 100 : strobeSpeed === "sos" ? 300 : 500;
      strobeTimer = setInterval(() => {
        setStrobeLightOn((prev) => !prev);
      }, interval);
    }
    return () => clearInterval(strobeTimer);
  }, [isStrobeActive, strobeSpeed]);

  useEffect(() => {
    return () => {
      stopSiren();
      if (callDurationRef.current) clearInterval(callDurationRef.current);
      if (audioRecordIntervalRef.current) clearInterval(audioRecordIntervalRef.current);
      if (checkInIntervalRef.current) clearInterval(checkInIntervalRef.current);
    };
  }, []);

  // Trigger Fake Call
  const handleTriggerFakeCall = () => {
    setActiveModal("fake_call_screen");
    if (fakeCallDelay === 0) {
      setIsFakeCallRinging(true);
    } else {
      setIsFakeCallRinging(false);
      setTimeout(() => {
        setIsFakeCallRinging(true);
      }, fakeCallDelay * 1000);
    }
  };

  const handleAnswerFakeCall = () => {
    setIsFakeCallRinging(false);
    setIsFakeCallConnected(true);
    setCallDuration(0);
    callDurationRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const handleEndFakeCall = () => {
    if (callDurationRef.current) clearInterval(callDurationRef.current);
    setIsFakeCallRinging(false);
    setIsFakeCallConnected(false);
    setActiveModal(null);
    setCallDuration(0);
  };

  // Audio Recorder
  const handleToggleAudioRecording = () => {
    if (isRecordingAudio) {
      clearInterval(audioRecordIntervalRef.current);
      setIsRecordingAudio(false);
      const minutes = Math.floor(audioRecordingTime / 60);
      const seconds = audioRecordingTime % 60;
      const formatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      setSavedRecordings((prev) => [
        {
          id: `rec-${Date.now()}`,
          name: `Emergency Audio Clip #${prev.length + 1}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          duration: formatted
        },
        ...prev
      ]);
      onNotify("Audio evidence recorded and encrypted locally.");
      setAudioRecordingTime(0);
    } else {
      setIsRecordingAudio(true);
      setAudioRecordingTime(0);
      audioRecordIntervalRef.current = setInterval(() => {
        setAudioRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Snap Photo
  const handleSnapPhoto = () => {
    const samplePhotos = [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&auto=format&fit=crop&q=80"
    ];
    const randomImg = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setCapturedPhotos((prev) => [
      {
        id: `photo-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        url: randomImg
      },
      ...prev
    ]);
    onNotify("Photo snapshot captured with timestamp watermark.");
  };

  // Check-In Start
  const handleStartCheckIn = () => {
    setCheckInRemainingSeconds(checkInMinutes * 60);
    setCheckInActive(true);
    checkInIntervalRef.current = setInterval(() => {
      setCheckInRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(checkInIntervalRef.current);
          setCheckInActive(false);
          onNotify("⚠️ Check-in timer expired! Alerting emergency contacts.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    onNotify(`Safety Walk timer set for ${checkInMinutes} minutes.`);
  };

  const handleCancelCheckIn = () => {
    if (checkInIntervalRef.current) clearInterval(checkInIntervalRef.current);
    setCheckInActive(false);
    onNotify("Check-in timer confirmed safe.");
  };

  const tools = [
    {
      id: "fake_call",
      title: "Fake Call",
      subtitle: "Get out of uncomfortable situations",
      icon: PhoneCall,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      onClick: () => setActiveModal("fake_call_setup")
    },
    {
      id: "siren",
      title: "Siren",
      subtitle: "Loud alarm to attract attention",
      icon: Siren,
      color: "bg-red-50 text-red-600 border-red-200",
      onClick: () => {
        if (isSirenActive) stopSiren();
        else startSiren();
        setActiveModal("siren_screen");
      }
    },
    {
      id: "flashlight",
      title: "Flashlight",
      subtitle: "Bright light in dark situations",
      icon: Sparkles,
      color: "bg-amber-50 text-amber-600 border-amber-200",
      onClick: () => setActiveModal("flashlight_screen")
    },
    {
      id: "screen_share",
      title: "Screen Share",
      subtitle: "Share your screen with trusted contacts",
      icon: Share2,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      onClick: () => setActiveModal("screen_share_screen")
    },
    {
      id: "record_audio",
      title: "Record Audio",
      subtitle: "Record surroundings secretly",
      icon: Mic,
      color: "bg-rose-50 text-rose-600 border-rose-200",
      onClick: () => setActiveModal("record_audio_screen")
    },
    {
      id: "take_photo",
      title: "Take Photo",
      subtitle: "Capture & send photos to your contacts",
      icon: Camera,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      onClick: () => setActiveModal("take_photo_screen")
    },
    {
      id: "send_message",
      title: "Send Message",
      subtitle: "Send quick help message to your contacts",
      icon: MessageSquare,
      color: "bg-orange-50 text-[#FF5A36] border-[#FFD9CC]",
      onClick: () => setActiveModal("send_message_screen")
    },
    {
      id: "check_in",
      title: "Safety Walk Guard",
      subtitle: "Countdown timer while traveling alone",
      icon: Clock,
      color: "bg-teal-50 text-teal-600 border-teal-200",
      onClick: () => setActiveModal("check_in_screen")
    }
  ];

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Safety Toolkit</h2>
        <p className="text-xs text-slate-500 font-medium">
          Tactical safety tools for immediate deterrence, stealth recording, and personal protection
        </p>
      </div>

      {/* 2-COLUMN GRID (SCREEN 5) */}
      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={tool.onClick}
              className="p-4 rounded-3xl bg-white border border-[#FFE8DE] hover:border-orange-300 hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${tool.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                  {tool.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-0.5">
                  {tool.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* MODAL 1: FAKE CALL SETUP */}
      {activeModal === "fake_call_setup" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                <span>Configure Fake Call</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Caller Identity</label>
                <select
                  value={fakeCallerName}
                  onChange={(e) => setFakeCallerName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                >
                  <option value="Police Inspector Sharma">Police Inspector Sharma</option>
                  <option value="Mom">Mom</option>
                  <option value="Dad">Dad</option>
                  <option value="Boss / Office Manager">Boss / Office Manager</option>
                  <option value="Brother (Amit)">Brother (Amit)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Trigger Delay</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: "Now", val: 0 },
                    { label: "10s", val: 10 },
                    { label: "30s", val: 30 },
                    { label: "1m", val: 60 }
                  ].map((d) => (
                    <button
                      key={d.val}
                      onClick={() => setFakeCallDelay(d.val)}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        fakeCallDelay === d.val
                          ? "bg-[#FF5A36] text-white border-[#FF5A36]"
                          : "bg-white text-slate-700 border-orange-200"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTriggerFakeCall}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Start Fake Call Flow</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAKE CALL SCREEN SIMULATOR */}
      {activeModal === "fake_call_screen" && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-8">
          <div className="text-center pt-12 space-y-2">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center mx-auto text-3xl font-black text-slate-300">
              {fakeCallerName.charAt(0)}
            </div>
            <h2 className="text-2xl font-black tracking-tight">{fakeCallerName}</h2>
            <p className="text-sm text-slate-400 font-mono">
              {isFakeCallConnected
                ? `00:${callDuration < 10 ? "0" : ""}${callDuration}`
                : isFakeCallRinging
                ? "Incoming Call..."
                : `Calling in ${fakeCallDelay}s...`}
            </p>
          </div>

          {/* Conversation script hint */}
          {isFakeCallConnected && (
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center max-w-xs mx-auto text-xs text-slate-300 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#FF5A36] block">Script Prompt</span>
              <p>"Hey! I'm right outside. Are you ready? I can see you."</p>
            </div>
          )}

          {/* Call Controls */}
          <div className="pb-12 flex items-center justify-around">
            {isFakeCallRinging && !isFakeCallConnected && (
              <>
                <button
                  onClick={handleEndFakeCall}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <X className="w-8 h-8" />
                </button>
                <button
                  onClick={handleAnswerFakeCall}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce cursor-pointer"
                >
                  <PhoneCall className="w-8 h-8" />
                </button>
              </>
            )}

            {isFakeCallConnected && (
              <button
                onClick={handleEndFakeCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg mx-auto cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SIREN MODAL */}
      {activeModal === "siren_screen" && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 transition-colors duration-150 ${
            isSirenActive ? "bg-red-600 text-white" : "bg-black/70 text-white"
          }`}
        >
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mx-auto animate-pulse">
              <Siren className="w-16 h-16 text-white" />
            </div>

            <div>
              <h2 className="text-3xl font-black">HIGH DECIBEL SIREN</h2>
              <p className="text-xs text-white/80 mt-1">
                Loud deterrent alarm is active. Draw immediate public attention.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={isSirenActive ? stopSiren : startSiren}
                className="px-8 py-3 rounded-2xl bg-white text-red-600 font-black text-sm shadow-xl cursor-pointer"
              >
                {isSirenActive ? "STOP SIREN" : "START SIREN"}
              </button>
              <button
                onClick={() => {
                  stopSiren();
                  setActiveModal(null);
                }}
                className="px-6 py-3 rounded-2xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLASHLIGHT / STROBE MODAL */}
      {activeModal === "flashlight_screen" && (
        <div
          className={`fixed inset-0 z-50 flex flex-col justify-between p-6 transition-colors duration-75 ${
            isStrobeActive
              ? strobeLightOn
                ? "bg-white text-black"
                : "bg-black text-white"
              : "bg-white text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black">Flashlight & SOS Strobe</h3>
            <button
              onClick={() => {
                setIsStrobeActive(false);
                setActiveModal(null);
              }}
              className="p-2 rounded-full bg-slate-200 text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-12 h-12 text-amber-500" />
            </div>
            <p className="text-xs font-semibold max-w-xs mx-auto">
              Maximum screen brightness with high-visibility strobe patterns
            </p>
          </div>

          <div className="space-y-3 max-w-sm mx-auto w-full">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setStrobeSpeed("normal")}
                className={`py-2 text-xs font-bold rounded-xl border ${
                  strobeSpeed === "normal" ? "bg-[#FF5A36] text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                Steady Bright
              </button>
              <button
                onClick={() => setStrobeSpeed("sos")}
                className={`py-2 text-xs font-bold rounded-xl border ${
                  strobeSpeed === "sos" ? "bg-[#FF5A36] text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                SOS Morse (...---...)
              </button>
              <button
                onClick={() => setStrobeSpeed("rapid")}
                className={`py-2 text-xs font-bold rounded-xl border ${
                  strobeSpeed === "rapid" ? "bg-[#FF5A36] text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                Rapid Strobe
              </button>
            </div>

            <button
              onClick={() => setIsStrobeActive(!isStrobeActive)}
              className="w-full py-3 rounded-2xl bg-[#FF5A36] text-white font-black text-xs shadow-md cursor-pointer"
            >
              {isStrobeActive ? "Stop Strobe" : "Start Screen Strobe"}
            </button>
          </div>
        </div>
      )}

      {/* AUDIO RECORDER MODAL */}
      {activeModal === "record_audio_screen" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Mic className="w-4 h-4 text-rose-600" />
                <span>Stealth Audio Evidence</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FFF9F5] border border-orange-200 p-6 rounded-2xl text-center space-y-3">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
                  isRecordingAudio ? "bg-red-500 text-white animate-pulse" : "bg-rose-100 text-rose-600"
                }`}
              >
                <Mic className="w-8 h-8" />
              </div>

              <div className="text-xl font-black text-slate-900 font-mono">
                00:{audioRecordingTime < 10 ? "0" : ""}${audioRecordingTime}
              </div>

              <button
                onClick={handleToggleAudioRecording}
                className={`px-6 py-2.5 rounded-xl font-black text-xs text-white shadow-xs cursor-pointer ${
                  isRecordingAudio ? "bg-red-600 hover:bg-red-700" : "bg-[#FF5A36] hover:bg-[#E63920]"
                }`}
              >
                {isRecordingAudio ? "Stop & Save Recording" : "Start Secret Recording"}
              </button>
            </div>

            {/* Saved Recordings */}
            <div className="space-y-2 max-h-44 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Saved Evidence Audio ({savedRecordings.length})
              </span>
              {savedRecordings.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{rec.name}</div>
                    <div className="text-[10px] text-slate-400">{rec.time} • {rec.duration}</div>
                  </div>
                  <button className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#FF5A36]">
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAKE PHOTO MODAL */}
      {activeModal === "take_photo_screen" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Stealth Photo Capture</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSnapPhoto}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Photo with GPS Watermark</span>
            </button>

            {/* Gallery */}
            <div className="grid grid-cols-2 gap-2">
              {capturedPhotos.map((p) => (
                <div key={p.id} className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={p.url} alt="Evidence" className="w-full h-28 object-cover" />
                  <div className="absolute bottom-0 inset-x-0 p-1.5 bg-black/70 text-[9px] text-white font-mono">
                    {p.time} • 27.69°N 85.31°E
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEND MESSAGE MODAL */}
      {activeModal === "send_message_screen" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FF5A36]" />
                <span>Quick SOS Message</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preset Template</label>
                <div className="space-y-1.5">
                  {[
                    "EMERGENCY: I am feeling unsafe at my current location. Please call me or send help immediately. Live GPS: https://maps.google.com/?q=27.6934,85.3148",
                    "I am in a taxi with suspicious driver. Vehicle Plate #BA-2-PA-8812. Tracking active.",
                    "Medical emergency assistance required right now. Please come to my home address."
                  ].map((tpl, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedTemplate === tpl
                          ? "bg-orange-50 border-[#FF5A36] font-bold text-slate-900"
                          : "bg-[#FFF9F5] border-orange-100 text-slate-600"
                      }`}
                    >
                      {tpl}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Send To</label>
                <select
                  value={messageTargetContact}
                  onChange={(e) => setMessageTargetContact(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                >
                  <option value="all">All Emergency Contacts ({contacts.length})</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  onNotify("Quick SMS & WhatsApp distress broadcast dispatched!");
                  setActiveModal(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#FF5A36] hover:bg-[#E63920] text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Broadcast Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECK-IN TIMER MODAL */}
      {activeModal === "check_in_screen" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Safety Walk Check-In</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkInActive ? (
              <div className="text-center space-y-3 p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <p className="text-xs text-teal-800 font-semibold">
                  Check-in timer is currently running. We will alert contacts if you do not confirm safe arrival.
                </p>
                <div className="text-3xl font-black text-teal-900 font-mono">
                  {Math.floor(checkInRemainingSeconds / 60)}:
                  {checkInRemainingSeconds % 60 < 10 ? "0" : ""}
                  {checkInRemainingSeconds % 60}
                </div>
                <button
                  onClick={() => {
                    handleCancelCheckIn();
                    setActiveModal(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-black text-xs shadow-xs hover:bg-teal-700 cursor-pointer"
                >
                  I'm Safe (Stop Timer)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Select Walk Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((m) => (
                    <button
                      key={m}
                      onClick={() => setCheckInMinutes(m)}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        checkInMinutes === m
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {m} Mins
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    handleStartCheckIn();
                    setActiveModal(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-teal-600 text-white font-black text-xs shadow-xs hover:bg-teal-700 cursor-pointer"
                >
                  Start Safety Walk Guard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
