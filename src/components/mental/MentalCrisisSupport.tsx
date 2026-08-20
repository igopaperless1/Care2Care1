import React, { useState } from "react";
import {
  PhoneCall,
  ShieldAlert,
  MessageSquare,
  Heart,
  Globe,
  LifeBuoy,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export const MentalCrisisSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Helplines" | "Safety Plan" | "Grounding">("Helplines");

  const helplines = [
    {
      country: "United States / Canada",
      name: "988 Suicide & Crisis Lifeline",
      number: "988",
      type: "Call or Text 24/7",
      desc: "Free and confidential support for people in distress, prevention and crisis resources.",
    },
    {
      country: "United Kingdom",
      name: "Samaritans Helpline",
      number: "116 123",
      type: "Freephone 24/7",
      desc: "Available day and night, 365 days a year for anyone struggling to cope.",
    },
    {
      country: "India",
      name: "KIRAN National Mental Health Helpline",
      number: "1800-599-0019",
      type: "Toll-Free 24/7",
      desc: "Comprehensive psychological support in 13 regional languages.",
    },
    {
      country: "International",
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      type: "SMS 24/7",
      desc: "Free 24/7 crisis support via SMS with trained crisis counselors.",
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Urgent Help Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
              Immediate Help Available 24/7
            </span>
            <h2 className="text-lg font-black text-rose-950 mt-0.5">Need urgent emotional support?</h2>
            <p className="text-xs text-rose-800 font-medium">You are not alone. Compassionate professionals are standing by.</p>
          </div>
        </div>

        <a
          href="tel:988"
          className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 988 Lifeline</span>
        </a>
      </div>

      {/* 2. Helplines Directory */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Global Emergency & Crisis Helplines
        </span>

        <div className="space-y-3">
          {helplines.map((h, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-md">
                    {h.country}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{h.type}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900">{h.name}</h4>
                <p className="text-xs text-slate-600 font-medium">{h.desc}</p>
              </div>

              <a
                href={`tel:${h.number.replace(/\D/g, "")}`}
                className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-xl text-xs font-black text-center whitespace-nowrap shadow-xs cursor-pointer shrink-0"
              >
                {h.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Quick 5-4-3-2-1 Somatic Grounding Checklist */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          5-4-3-2-1 Sensory Grounding Technique
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            { num: "5", label: "Things you see", desc: "Notice 5 objects around you" },
            { num: "4", label: "Things you feel", desc: "Feet on floor, chair back" },
            { num: "3", label: "Things you hear", desc: "Room hum, distant birds" },
            { num: "2", label: "Things you smell", desc: "Fresh air, coffee aroma" },
            { num: "1", label: "Thing you taste", desc: "Sip of fresh water" },
          ].map((item) => (
            <div key={item.num} className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl text-center space-y-1">
              <span className="w-7 h-7 rounded-full bg-[#FF5A36] text-white font-black text-xs inline-flex items-center justify-center">
                {item.num}
              </span>
              <h5 className="text-xs font-black text-slate-900">{item.label}</h5>
              <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
