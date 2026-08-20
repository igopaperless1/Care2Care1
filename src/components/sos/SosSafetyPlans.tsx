import React, { useState } from "react";
import {
  Shield,
  FileText,
  CheckSquare,
  Square,
  MapPin,
  Users,
  Send,
  AlertTriangle,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from "lucide-react";
import { SosSafetyPlan, SosEmergencyContact } from "./types";

interface SosSafetyPlansProps {
  safetyPlans: SosSafetyPlan[];
  contacts: SosEmergencyContact[];
  onBroadcastPlan: (plan: SosSafetyPlan) => void;
  onNotify: (msg: string) => void;
}

export const SosSafetyPlans: React.FC<SosSafetyPlansProps> = ({
  safetyPlans,
  contacts,
  onBroadcastPlan,
  onNotify
}) => {
  const [expandedPlanId, setExpandedPlanId] = useState<string>(safetyPlans[0]?.id || "");
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (planId: string, stepIndex: number) => {
    const key = `${planId}-${stepIndex}`;
    setCheckedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Safety Plans & Emergency Protocols
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Step-by-step action plans, meeting points, and pre-configured emergency responses
        </p>
      </div>

      {/* PLANS LIST */}
      <div className="space-y-4">
        {safetyPlans.map((plan) => {
          const isExpanded = expandedPlanId === plan.id;
          const planContacts = contacts.filter((c) => plan.emergencyContacts.includes(c.id));

          return (
            <div
              key={plan.id}
              className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs transition-all space-y-4"
            >
              {/* Header */}
              <div
                onClick={() => setExpandedPlanId(isExpanded ? "" : plan.id)}
                className="flex items-start justify-between cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5A36] flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="space-y-4 pt-2 border-t border-orange-100/70">
                  {/* Action Steps with Interactive Checkboxes */}
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Action Checklist
                    </span>
                    <div className="space-y-2">
                      {plan.steps.map((step, idx) => {
                        const isChecked = !!checkedSteps[`${plan.id}-${idx}`];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleStep(plan.id, idx)}
                            className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                              isChecked
                                ? "bg-emerald-50/70 border-emerald-200 text-emerald-900 line-through opacity-80"
                                : "bg-[#FFF9F5] border-orange-200 text-slate-800 font-medium"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-orange-400" />
                              )}
                            </div>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location & Safe Places Details */}
                  <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/70 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>{plan.locationDetails}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <strong>Safe Places:</strong> {plan.safePlaces.join(", ")}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <strong>Escape Routes:</strong> {plan.escapeRoutes.join(", ")}
                    </div>
                  </div>

                  {/* Linked Contacts & Broadcast Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Alerts:</span>
                      {planContacts.map((c) => (
                        <span
                          key={c.id}
                          className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-orange-200 text-slate-700"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        onBroadcastPlan(plan);
                        onNotify(`Emergency protocol broadcast dispatched for "${plan.name}"!`);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#FF5A36] hover:bg-[#E63920] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Broadcast This Plan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
