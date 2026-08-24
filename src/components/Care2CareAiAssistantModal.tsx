import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  Send,
  X,
  User,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Sliders,
  Award,
  BookOpen,
  Zap,
  HelpCircle,
  FileText,
  Lock,
  Globe,
  Heart,
  Baby,
  Briefcase,
  DollarSign,
  Car,
  Dog,
  Sprout,
  Users,
  Calendar,
  Clock,
  Volume2,
  Check
} from "lucide-react";

export interface CustomAssistantConfig {
  id: string;
  name: string;
  avatar: string;
  role: string;
  instructions: string;
  allowedRules: string[];
  forbiddenRules: string[];
  modelType: "Auto (Gemini 1.5 Flash)" | "Manual High Precision (Gemini 1.5 Pro)";
  isCustom: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  assistantName: string;
  text: string;
  timestamp: string;
  isWarning?: boolean;
}

interface Care2CareAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAgeGroup?: "Pediatric/Kids" | "Adult" | "Senior Elder";
}

const DEFAULT_ASSISTANTS: CustomAssistantConfig[] = [
  {
    id: "c2c-master",
    name: "Blessikaa Master AI",
    avatar: "🤖",
    role: "Universal Healthcare, Family & Emergency Advisor",
    instructions:
      "You are the official Blessikaa Master AI Assistant. You possess complete knowledge of all Blessikaa features (SOS, 40+ Calendars, Family Tree, Pet Care, Vehicle Care, Farm & Garden, Contracts & Deeds, Land & Property, Staff & Payroll, Elderly Senior Care, Kids Pediatric, Inventory, Menstrual Care, Sleep & Soundscapes, Job Career, IGO Paperless). Always prioritize safety and legal compliance.",
    allowedRules: [
      "Provide step-by-step guidance on setting up SOS emergency dispatch and regional hotlines.",
      "Assist in calculating blood pressure, blood sugar targets, and pediatric growth milestones.",
      "Guide users on managing staff attendance, probation tracking, and uploaded salary receipts.",
      "Explain 40+ Calendar system conversions (Vikram Sambat, Hijri, Gregorian)."
    ],
    forbiddenRules: [
      "DO NOT provide formal medical diagnosis or prescribe clinical medication.",
      "DO NOT advise delaying emergency 911/112/100/102 calls during acute crisis.",
      "DO NOT request or store sensitive financial passwords or bank PINs."
    ],
    modelType: "Auto (Gemini 1.5 Flash)",
    isCustom: false,
    createdAt: "2026-01-01"
  },
  {
    id: "c2c-senior",
    name: "Senior Vitals & Proxy Bot",
    avatar: "👵",
    role: "Elderly Care & Health Vitals Specialist",
    instructions:
      "Specialized assistant for elderly care, blood pressure monitoring (pre/post meal), vision diagnostics (6/6 OD/OS), blood sugar targets, and caregiver shift tracking.",
    allowedRules: [
      "Monitor blood pressure trends (Fasting vs Post-Meal).",
      "Suggest vision test reminders and eye clarity logs.",
      "Guide proxy caregivers on logging senior vitals."
    ],
    forbiddenRules: [
      "DO NOT modify prescribed heart medication dosages.",
      "DO NOT diagnose cardiac conditions independently."
    ],
    modelType: "Auto (Gemini 1.5 Flash)",
    isCustom: false,
    createdAt: "2026-01-01"
  },
  {
    id: "c2c-pediatric",
    name: "Pediatric & Kids Guide",
    avatar: "👶",
    role: "Child Health, Vaccines & School Timetable Assistant",
    instructions:
      "Assists parents with pediatric growth percentiles, WHO vaccine schedules, kids daily study timetables, and child safety compliance.",
    allowedRules: [
      "Provide age-appropriate pediatric immunization checklists.",
      "Help format kids daily school & habit time tables."
    ],
    forbiddenRules: [
      "DO NOT allow unsupervised medication administration to minors.",
      "DO NOT give advice conflicting with pediatrician recommendations."
    ],
    modelType: "Auto (Gemini 1.5 Flash)",
    isCustom: false,
    createdAt: "2026-01-01"
  }
];

export const Care2CareAiAssistantModal: React.FC<Care2CareAiAssistantModalProps> = ({
  isOpen,
  onClose,
  userAgeGroup = "Adult"
}) => {
  const [activeTab, setActiveTab] = useState<"chat" | "assistants" | "create" | "knowledge">("chat");

  // Saved Assistants List
  const [assistants, setAssistants] = useState<CustomAssistantConfig[]>(() => {
    try {
      const saved = localStorage.getItem("c2c_custom_assistants");
      return saved ? JSON.parse(saved) : DEFAULT_ASSISTANTS;
    } catch {
      return DEFAULT_ASSISTANTS;
    }
  });

  const [selectedAssistantId, setSelectedAssistantId] = useState<string>("c2c-master");
  const selectedAssistant = assistants.find((a) => a.id === selectedAssistantId) || assistants[0];

  // Chat Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      assistantName: "Blessikaa Master AI",
      text: "👋 Welcome to Blessikaa AI Assistant! How can I assist you today with emergency protection, health vitals, staff payroll, 40+ calendars, sacred heritage, or creating custom family assistants?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // New Custom Assistant Form State
  const [newAsstName, setNewAsstName] = useState("");
  const [newAsstAvatar, setNewAsstAvatar] = useState("🤖");
  const [newAsstRole, setNewAsstRole] = useState("Family Care & Task Assistant");
  const [newAsstInstructions, setNewAsstInstructions] = useState("");
  const [newAsstAllowed, setNewAsstAllowed] = useState("Provide daily habit tips\nRemind about medication");
  const [newAsstForbidden, setNewAsstForbidden] = useState("Do not give unauthorized medical diagnosis");
  const [newAsstModel, setNewAsstModel] = useState<"Auto (Gemini 1.5 Flash)" | "Manual High Precision (Gemini 1.5 Pro)">("Auto (Gemini 1.5 Flash)");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("c2c_custom_assistants", JSON.stringify(assistants));
  }, [assistants]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      assistantName: "You",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      const queryLower = textToSend.toLowerCase();

      if (queryLower.includes("sos") || queryLower.includes("emergency") || queryLower.includes("911") || queryLower.includes("helpline")) {
        replyText = "🚨 **SOS Emergency Protocol & Geo-Dispatch**:\n• Blessikaa automatically maps your live GPS coordinates to country emergency dispatch (US/CA: 911, UK: 999, IN: 100/102, EU: 112, NP: 100/102).\n• Press and hold the 🆘 SOS button for 3 seconds to send live SMS alerts with coordinates to your emergency contacts.";
      } else if (queryLower.includes("vitals") || queryLower.includes("blood pressure") || queryLower.includes("sugar") || queryLower.includes("vision")) {
        replyText = "🩺 **Health & Vitals Tracking**:\n• You can log Systolic/Diastolic BP (Pre-Meal, Post-Meal, Fasting).\n• Blood Sugar levels (Pre/Post PP) & Vision Diagnostics (OD/OS e.g. 6/6 or 20/20).\n• All vitals generate visual historical trend charts in Elderly & Senior Care!";
      } else if (queryLower.includes("staff") || queryLower.includes("attendance") || queryLower.includes("salary") || queryLower.includes("probation")) {
        replyText = "💼 **Staff & Payroll Management**:\n• Clock-in/out attendance with timestamps & location tags.\n• Probation period tracking (trial phase status & duration).\n• Salary verification workflow where staff upload payment proof receipts for manager sign-off.";
      } else if (queryLower.includes("calendar") || queryLower.includes("vikram") || queryLower.includes("hijri")) {
        replyText = "🌍 **40+ Calendar System Converter**:\n• Convert dates seamlessly across Gregorian, Vikram Sambat (BS), Hijri (Islamic), Hebrew, Julian, Persian, Lunar & 35+ regional calendars.";
      } else if (queryLower.includes("inventory") || queryLower.includes("stock") || queryLower.includes("replenish")) {
        replyText = "📦 **Inventory Dynamic Alerts**:\n• Set custom minimum stock quantity thresholds.\n• Items below threshold are automatically flagged with reorder notifications & usage trend calculations.";
      } else if (queryLower.includes("sleep") || queryLower.includes("soundscape")) {
        replyText = "🌙 **Sleep & Soundscape Suite**:\n• Log sleep duration, quality rating (1-10), bedtime/wake times, and 10+ questionnaire factors.\n• Listen to soothing soundscapes (Calming Rain, Ocean Waves, Forest Birds) with built-in sleep timer.";
      } else {
        replyText = `🤖 **${selectedAssistant.name} Response**:\nThank you for reaching out! I have processed your inquiry according to Blessikaa compliance guidelines.\n\nKey Recommendations:\n1. Check your corresponding tab in Blessikaa for real-time tracking.\n2. Ensure all family sub-accounts (Kids & Seniors) have updated emergency profiles.`;
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        assistantName: selectedAssistant.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleCreateAssistant = () => {
    if (!newAsstName.trim()) {
      showToast("Please enter an Assistant Name.");
      return;
    }

    const created: CustomAssistantConfig = {
      id: `asst-${Date.now()}`,
      name: newAsstName.trim(),
      avatar: newAsstAvatar || "🤖",
      role: newAsstRole || "Custom Assistant",
      instructions: newAsstInstructions || "Custom instructions",
      allowedRules: newAsstAllowed.split("\n").filter((r) => r.trim()),
      forbiddenRules: newAsstForbidden.split("\n").filter((r) => r.trim()),
      modelType: newAsstModel,
      isCustom: true,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setAssistants([...assistants, created]);
    setSelectedAssistantId(created.id);
    showToast(`🎉 Custom AI Assistant "${created.name}" created & activated!`);
    setActiveTab("chat");

    // Reset Form
    setNewAsstName("");
    setNewAsstInstructions("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] max-h-[750px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xl font-black border border-indigo-500/40 shadow-inner">
              {selectedAssistant.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">{selectedAssistant.name}</h2>
                <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Online 🟢
                </span>
              </div>
              <p className="text-[10px] text-indigo-200 font-medium line-clamp-1">{selectedAssistant.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] bg-slate-800 text-indigo-200 font-bold px-2.5 py-1 rounded-xl border border-slate-700">
              {selectedAssistant.modelType}
            </span>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-slate-100 p-1 border-b text-xs font-bold gap-1 shrink-0">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "chat" ? "bg-indigo-600 text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> AI Chat
          </button>
          <button
            onClick={() => setActiveTab("assistants")}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "assistants" ? "bg-indigo-600 text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Switch Assistant ({assistants.length})
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "create" ? "bg-indigo-600 text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Design Custom AI
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "knowledge" ? "bg-indigo-600 text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Rules & Compliance
          </button>
        </div>

        {/* TOAST BANNER */}
        {toastMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 px-4 py-2 text-xs font-bold flex items-center justify-between shrink-0">
            <span>✓ {toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="font-black">✕</button>
          </div>
        )}

        {/* ==================== TAB 1: AI CHAT ==================== */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            {/* Quick Suggestion Chips */}
            <div className="p-2.5 bg-white border-b flex gap-1.5 overflow-x-auto scrollbar-none text-[11px] shrink-0">
              <span className="font-black text-slate-400 self-center shrink-0 text-[10px]">Suggestions:</span>
              {[
                "How to set up SOS emergency dispatch?",
                "Normal blood pressure for seniors",
                "How to track staff probation & salary?",
                "What is 40+ Calendar system?"
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-full font-bold whitespace-nowrap cursor-pointer transition-colors shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs space-y-1 ${
                      m.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none shadow-xs"
                        : "bg-white text-slate-900 rounded-bl-none border border-slate-200 shadow-xs"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-3 text-[10px] font-bold opacity-75">
                      <span>{m.assistantName}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed font-medium">{m.text}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white border rounded-2xl rounded-bl-none text-xs text-slate-400 font-bold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                    AI Assistant is evaluating rules & generating response...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-white border-t flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder={`Ask ${selectedAssistant.name} anything...`}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 p-3 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl cursor-pointer shadow-md transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SWITCH ASSISTANT ==================== */}
        {activeTab === "assistants" && (
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-xs">Available AI Assistant Personas</h3>
              <button
                onClick={() => setActiveTab("create")}
                className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Create New
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assistants.map((ast) => (
                <div
                  key={ast.id}
                  onClick={() => {
                    setSelectedAssistantId(ast.id);
                    showToast(`Switched active assistant to ${ast.name}`);
                    setActiveTab("chat");
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedAssistantId === ast.id
                      ? "bg-indigo-50/90 border-2 border-indigo-600 shadow-md"
                      : "bg-white border-slate-200 hover:border-indigo-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1 bg-white rounded-xl border">{ast.avatar}</span>
                      <div>
                        <h4 className="font-black text-slate-900 text-xs">{ast.name}</h4>
                        <span className="text-[10px] text-slate-500 font-bold block">{ast.role}</span>
                      </div>
                    </div>
                    {selectedAssistantId === ast.id && (
                      <span className="text-[9px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">Active</span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-600 font-medium line-clamp-2">{ast.instructions}</p>

                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-1 border-t">
                    <span>Model: {ast.modelType}</span>
                    <span>{ast.isCustom ? "Custom Created" : "System Default"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: CREATE CUSTOM AI ASSISTANT ==================== */}
        {activeTab === "create" && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-4 rounded-2xl space-y-1">
              <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" /> Build Your Personal Care2Care AI Assistant
              </h3>
              <p className="text-[10px] text-indigo-200 font-medium">
                Design custom personas, feed specific instructions, specify "what to do" and "what NOT to do" rules, and select AI model execution tier.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assistant Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Grandma Vitals Guard"
                    value={newAsstName}
                    onChange={(e) => setNewAsstName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Avatar Emoji Icon</label>
                  <select
                    value={newAsstAvatar}
                    onChange={(e) => setNewAsstAvatar(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  >
                    <option value="🤖">🤖 Robot Master</option>
                    <option value="👵">👵 Senior Care</option>
                    <option value="👶">👶 Pediatric</option>
                    <option value="👨‍⚕️">👨‍⚕️ Medical Doctor</option>
                    <option value="🐶">🐶 Pet Specialist</option>
                    <option value="💼">💼 Staff & Legal</option>
                    <option value="⚖️">⚖️ Legal Advisor</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Persona Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Vitals Monitor"
                    value={newAsstRole}
                    onChange={(e) => setNewAsstRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">System Instructions / Behavior Prompt</label>
                <textarea
                  rows={2}
                  placeholder="Specify how this AI assistant should speak, respond, and guide the user..."
                  value={newAsstInstructions}
                  onChange={(e) => setNewAsstInstructions(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-1">
                  <label className="font-black text-emerald-900 block text-[11px]">
                    ✅ What TO DO Rules (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={newAsstAllowed}
                    onChange={(e) => setNewAsstAllowed(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl font-medium text-[11px]"
                  />
                </div>

                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 space-y-1">
                  <label className="font-black text-rose-900 block text-[11px]">
                    🚫 What NOT TO DO Rules (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={newAsstForbidden}
                    onChange={(e) => setNewAsstForbidden(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl font-medium text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">AI Model Selection & Cost Tier</label>
                <select
                  value={newAsstModel}
                  onChange={(e) => setNewAsstModel(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                >
                  <option value="Auto (Gemini 1.5 Flash)">
                    ⚡ Auto (Gemini 1.5 Flash - Ultra Fast & Free with Subscription)
                  </option>
                  <option value="Manual High Precision (Gemini 1.5 Pro)">
                    🧠 Manual High Precision (Gemini 1.5 Pro / Ultra - Surcharge Applies)
                  </option>
                </select>
                <p className="text-[10px] text-amber-700 font-bold mt-1">
                  Note: High Precision models handle complex legal agreements and medical logs but incur higher token costs.
                </p>
              </div>

              <button
                onClick={handleCreateAssistant}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save & Activate Custom AI Assistant
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: KNOWLEDGE & RULES ==================== */}
        {activeTab === "knowledge" && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-600" /> Platform Knowledge, Guidelines & Age Rules
              </h3>

              <div className="space-y-2">
                <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100">
                  <h4 className="font-black text-indigo-950">👶 Pediatric & Kids Compliance (&lt;18 Yrs)</h4>
                  <p className="text-[11px] text-indigo-900 font-medium mt-0.5">
                    Parental supervision required. Automated WHO growth tracking & school time tables supported. No unsupervised medicine dosage edits.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100">
                  <h4 className="font-black text-emerald-950">👴 Senior & Elderly Vitals Protocol (&gt;60 Yrs)</h4>
                  <p className="text-[11px] text-emerald-900 font-medium mt-0.5">
                    Pre/Post-meal Blood Pressure logging, Blood Sugar targets (Fasting/PP), and Vision OD/OS tests. Caregivers can proxy log on behalf of seniors.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-100">
                  <h4 className="font-black text-amber-950">🚨 Emergency SOS Dispatch Rules</h4>
                  <p className="text-[11px] text-amber-900 font-medium mt-0.5">
                    Geolocation auto-maps regional emergency hotlines (911 US, 999 UK, 100/102 IN/NP, 112 EU). Automated SMS broadcasts live GPS coordinates to trusted proxies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
