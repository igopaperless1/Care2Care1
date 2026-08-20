import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Phone,
  PhoneCall,
  MapPin,
  Users,
  AlertTriangle,
  Siren,
  Sparkles,
  ChevronRight,
  Flame,
  Activity,
  Heart,
  Volume2,
  Share2,
  Navigation,
  FileText,
  Clock,
  Compass,
  Radio,
  ExternalLink,
  CheckCircle2,
  Car,
  Bell
} from "lucide-react";
import {
  SosEmergencyContact,
  SosIncident,
  SosAlertItem,
  SosNearbyService,
  SosMedicalProfile
} from "./types";

interface SosDashboardProps {
  userName: string;
  contacts: SosEmergencyContact[];
  incidents: SosIncident[];
  alerts: SosAlertItem[];
  nearbyServices: SosNearbyService[];
  medicalProfile: SosMedicalProfile;
  onTriggerSos: () => void;
  onNavigateTab: (tab: any) => void;
  onCallContact: (contact: SosEmergencyContact) => void;
  onQuickTool: (toolId: string) => void;
}

export const SosDashboard: React.FC<SosDashboardProps> = ({
  userName,
  contacts,
  incidents,
  alerts,
  nearbyServices,
  medicalProfile,
  onTriggerSos,
  onNavigateTab,
  onCallContact,
  onQuickTool
}) => {
  const [holdingTime, setHoldingTime] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdIntervalRef = useRef<any>(null);

  const startHold = () => {
    setIsHolding(true);
    setHoldingTime(0);
    holdIntervalRef.current = setInterval(() => {
      setHoldingTime((prev) => {
        if (prev >= 3) {
          clearInterval(holdIntervalRef.current);
          setIsHolding(false);
          onTriggerSos();
          return 3;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldingTime(0);
  };

  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const openIncidents = incidents.filter((i) => i.status !== "Closed").length;

  return (
    <div className="space-y-4">
      {/* GREETING & STATUS BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good Morning, {userName || "Roshan"}</span>
            <span className="text-xl">👋</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Stay safe, we've got your back!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GPS Tracking Active</span>
          </div>
        </div>
      </div>

      {/* QUICK SOS HERO CARD (Screen 1 Main Feature) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-6 shadow-xs relative overflow-hidden text-center">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-red-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Quick SOS
            </h3>
            <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto mt-0.5">
              Tap to send alert to your emergency contacts & dispatch live location
            </p>
          </div>

          {/* Prominent Circular SOS Button with 3s hold */}
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing radar ring */}
              <div className="absolute w-36 h-36 rounded-full bg-red-500/10 animate-ping opacity-75" />
              <div className="absolute w-44 h-44 rounded-full border border-red-500/20" />

              {/* Circular SVG Progress Ring for 3s Hold */}
              <svg className="w-36 h-36 -rotate-90 pointer-events-none" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" stroke="#FFE8DE" strokeWidth="8" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="#FF5A36"
                  strokeWidth="8"
                  strokeDasharray={326.7}
                  strokeDashoffset={326.7 * (1 - Math.min(holdingTime / 3, 1))}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-75"
                />
              </svg>

              {/* Center Core SOS Button */}
              <button
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                onClick={() => {
                  if (holdingTime < 0.2) onTriggerSos();
                }}
                className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-[#FF5A36] to-[#E63920] text-white font-black text-2xl tracking-wider shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer select-none"
              >
                <span>SOS</span>
                <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest -mt-0.5">
                  {isHolding ? `${(3 - holdingTime).toFixed(1)}s` : "Panic"}
                </span>
              </button>
            </div>

            <p className="text-[11px] font-bold text-slate-500 mt-4">
              Press and hold for 3 seconds (or tap to send)
            </p>
          </div>
        </div>
      </div>

      {/* SAFETY STATUS CARD (Screen 1) */}
      <div className="bg-white border border-[#FFE8DE] rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-black text-slate-900">All good</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs font-medium text-slate-500">You are protected & monitored</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab("safety_plans")}
          className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Safety Plan</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 STAT COUNTERS (Contacts, Alerts, Incidents) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={() => onNavigateTab("contacts")}
          className="bg-white border border-[#FFE8DE] hover:border-[#FF5A36]/40 rounded-2xl p-3.5 text-center transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-bold text-slate-500 block">Contacts</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#FF5A36]">
            {contacts.length}
          </span>
          <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Ready to alert</span>
        </button>

        <button
          onClick={() => onNavigateTab("alerts")}
          className="bg-white border border-[#FFE8DE] hover:border-[#FF5A36]/40 rounded-2xl p-3.5 text-center transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-bold text-slate-500 block">Alerts</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#FF5A36]">
            {unreadAlerts > 0 ? unreadAlerts : alerts.length}
          </span>
          <span className="text-[10px] font-bold text-amber-600 block mt-0.5">
            {unreadAlerts > 0 ? `${unreadAlerts} unread` : "Normal"}
          </span>
        </button>

        <button
          onClick={() => onNavigateTab("incidents")}
          className="bg-white border border-[#FFE8DE] hover:border-[#FF5A36]/40 rounded-2xl p-3.5 text-center transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-bold text-slate-500 block">Incidents</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#FF5A36]">
            {incidents.length}
          </span>
          <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
            {openIncidents} active
          </span>
        </button>
      </div>

      {/* THIS MONTH SUMMARY CARD (Screen 1) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            This Month
          </span>
          <button
            onClick={() => onNavigateTab("activity_log")}
            className="text-xs font-bold text-[#FF5A36] hover:underline"
          >
            Activity Log
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F5] border border-[#FFE8DE]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF5A36]">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">SOS Alerts Sent</span>
            </div>
            <span className="text-sm font-black text-slate-900">0</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F5] border border-[#FFE8DE]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Help Received</span>
            </div>
            <span className="text-sm font-black text-slate-900">0</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F5] border border-[#FFE8DE]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Incidents Logged</span>
            </div>
            <span className="text-sm font-black text-slate-900">{incidents.length}</span>
          </div>
        </div>
      </div>

      {/* QUICK SAFETY TOOLKIT ROW */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Quick Safety Tools
          </span>
          <button
            onClick={() => onNavigateTab("safety_toolkit")}
            className="text-xs font-bold text-[#FF5A36] hover:underline"
          >
            All Tools
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onQuickTool("fake_call")}
            className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-orange-50 border border-[#FFE8DE] text-left transition-all cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-800">Fake Call</div>
              <div className="text-[10px] text-slate-500">Exit danger</div>
            </div>
          </button>

          <button
            onClick={() => onQuickTool("siren")}
            className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-orange-50 border border-[#FFE8DE] text-left transition-all cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Siren className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-800">Siren Alarm</div>
              <div className="text-[10px] text-slate-500">Loud alert</div>
            </div>
          </button>

          <button
            onClick={() => onQuickTool("flashlight")}
            className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-orange-50 border border-[#FFE8DE] text-left transition-all cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-800">Flashlight</div>
              <div className="text-[10px] text-slate-500">SOS Strobe</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab("medical_info")}
            className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-orange-50 border border-[#FFE8DE] text-left transition-all cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-800">Medical ID</div>
              <div className="text-[10px] text-slate-500">{medicalProfile.bloodGroup} Blood</div>
            </div>
          </button>
        </div>
      </div>

      {/* EMERGENCY CONTACTS HORIZONTAL STRIP */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Primary Contacts
          </span>
          <button
            onClick={() => onNavigateTab("contacts")}
            className="text-xs font-bold text-[#FF5A36] hover:underline"
          >
            Manage ({contacts.length})
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {contacts.slice(0, 5).map((contact) => (
            <div
              key={contact.id}
              className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-[#FFF9F5] border border-[#FFE8DE] shrink-0 w-24 hover:scale-102 transition-transform"
            >
              <div className="relative mb-1.5">
                <img
                  src={contact.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`}
                  alt={contact.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <button
                  onClick={() => onCallContact(contact)}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-xs hover:scale-110 cursor-pointer"
                  title={`Call ${contact.name}`}
                >
                  <Phone className="w-2.5 h-2.5" />
                </button>
              </div>
              <span className="text-xs font-black text-slate-900 truncate w-full">
                {contact.name.split(" ")[0]}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 truncate w-full">
                {contact.relationship}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
