import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  Command,
  Copy,
  Check,
  RotateCcw,
  Bot,
  Play,
  FileText,
  Compass,
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  CheckCircle2
} from "lucide-react";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateService?: (subTab: string) => void;
  onTriggerAction?: (action: string) => void;
  onUpdateCaregiverNotes?: (notes: string) => void;
  currentNotes?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateService,
  onTriggerAction,
  onUpdateCaregiverNotes,
  currentNotes = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [isCommandsExpanded, setIsCommandsExpanded] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    speakText,
  } = useVoiceRecognition((commandType, payload) => {
    if (commandType === "NAVIGATE" && onNavigateService) {
      const targetLabel = payload === "passwords" ? "Password Manager" : payload.toUpperCase();
      showToast(`Navigating to ${targetLabel}...`);
      onNavigateService(payload);
    } else if (commandType === "ACTION" && onTriggerAction) {
      if (payload === "EXPORT_PDF") {
        showToast("Generating PDF Health Report...");
      } else if (payload === "LOG_WATER") {
        showToast("Opening Water logger...");
      }
      onTriggerAction(payload);
    }
  });

  if (!isOpen) return null;

  const handleCopyTranscript = () => {
    const fullText = transcript + interimTranscript;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToNotes = () => {
    if (onUpdateCaregiverNotes) {
      const combined = currentNotes
        ? `${currentNotes}\n[Voice Dictation ${new Date().toLocaleTimeString()}]: ${transcript}`
        : transcript;
      onUpdateCaregiverNotes(combined);
      showToast(" Caregiver notes updated successfully!");
      speakText("Caregiver notes updated successfully.");
      setTimeout(() => onClose(), 1200);
    }
  };

  const AVAILABLE_VOICE_COMMANDS = [
    { name: "Open Water Tracker", phrase: '"open water service"', action: "water", icon: "💧" },
    { name: "Open Medicine Tracker", phrase: '"open medicine"', action: "medicine", icon: "💊" },
    { name: "Open Password Manager", phrase: '"open password manager"', action: "passwords", icon: "🔐" },
    { name: "Export Vitals & PDF", phrase: '"export pdf report"', action: "EXPORT_PDF", icon: "📄" },
    { name: "Open SOS Emergency", phrase: '"open sos"', action: "sos", icon: "🚨" },
    { name: "Open Finance & Budget", phrase: '"open finance"', action: "finance", icon: "💰" },
    { name: "Open Exercise Tracker", phrase: '"open exercise"', action: "exercise", icon: "🏃" },
    { name: "Open Yoga & Meditation", phrase: '"open yoga"', action: "yoga", icon: "🧘" },
    { name: "Open Steps Tracker", phrase: '"open steps"', action: "steps", icon: "👣" },
    { name: "Open Kids Care", phrase: '"open kids"', action: "kids", icon: "👶" },
    { name: "Open Elderly Care", phrase: '"open elderly"', action: "elderly", icon: "👴" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Transient Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-emerald-100 px-4 py-2.5 rounded-full font-bold text-xs shadow-2xl border border-emerald-500/80 flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg">AI Voice Assistant & Dictation</h2>
              <p className="text-xs text-emerald-100">
                Audio-to-text dictation & voice app navigation commands
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Main Microphone Button & Waveform Area */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform active:scale-95 cursor-pointer shadow-lg ${
                isListening
                  ? "bg-rose-600 hover:bg-rose-700 animate-pulse ring-8 ring-rose-100"
                  : "bg-emerald-600 hover:bg-emerald-700 ring-8 ring-emerald-50"
              }`}
            >
              {isListening ? (
                <Mic className="w-9 h-9" />
              ) : (
                <MicOff className="w-9 h-9" />
              )}
            </button>

            <div className="text-center space-y-1">
              <p className="font-black text-sm text-slate-800">
                {isListening ? "Listening... Speak now" : "Tap Microphone to Start Voice Command"}
              </p>
              <p className="text-[11px] text-slate-500">
                Say "open water service", "open password manager", or dictate notes.
              </p>
            </div>

            {/* Simulated Live Audio Waveform */}
            {isListening && (
              <div className="flex items-center gap-1 h-6">
                {[40, 70, 30, 90, 50, 100, 60, 80, 40].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-emerald-500 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-bold">
              {error}
            </div>
          )}

          {/* Transcript Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-black text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Live Speech Transcript
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetTranscript}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl min-h-20 max-h-32 overflow-y-auto font-mono text-xs leading-relaxed border border-slate-800">
              {transcript || interimTranscript ? (
                <>
                  <span>{transcript}</span>
                  <span className="text-emerald-400 italic">{interimTranscript}</span>
                </>
              ) : (
                <span className="text-slate-500 italic">
                  [Transcript will appear here in real-time as you speak...]
                </span>
              )}
            </div>

            {/* Actions for Transcript */}
            <div className="flex items-center justify-between gap-2 mt-2">
              <button
                onClick={handleCopyTranscript}
                disabled={!transcript && !interimTranscript}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Transcript"}</span>
              </button>

              {onUpdateCaregiverNotes && (
                <button
                  onClick={handleApplyToNotes}
                  disabled={!transcript}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Insert into Caregiver Notes</span>
                </button>
              )}
            </div>
          </div>

          {/* Expandable Available Commands Section */}
          <div className="border-t border-slate-200 pt-3">
            <button
              onClick={() => setIsCommandsExpanded(!isCommandsExpanded)}
              className="w-full flex items-center justify-between font-black text-slate-800 py-1 cursor-pointer hover:text-emerald-700 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Available Voice Commands ({AVAILABLE_VOICE_COMMANDS.length})</span>
              </span>
              {isCommandsExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isCommandsExpanded && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 animate-in fade-in duration-150">
                {AVAILABLE_VOICE_COMMANDS.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (cmd.action === "EXPORT_PDF" && onTriggerAction) {
                        showToast("Generating PDF Health Report...");
                        onTriggerAction("EXPORT_PDF");
                        speakText("Exporting PDF report");
                      } else if (onNavigateService) {
                        const label = cmd.action === "passwords" ? "Password Manager" : cmd.name;
                        showToast(`Navigating to ${label}...`);
                        onNavigateService(cmd.action);
                        speakText(`Navigating to ${cmd.name}`);
                      }
                    }}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-sm">{cmd.icon}</span>
                      <Play className="w-2.5 h-2.5 text-emerald-600 group-hover:scale-125 transition-transform" />
                    </div>
                    <span className="font-bold text-[11px] text-slate-800 leading-tight group-hover:text-emerald-800">
                      {cmd.name}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 mt-0.5">
                      {cmd.phrase}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

