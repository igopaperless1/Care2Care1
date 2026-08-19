import React from "react";
import {
  ShieldAlert,
  Clock,
  Globe,
  Lock,
  Sparkles,
  Send,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { checkFeatureAvailability, FeatureConfigItem } from "../lib/featureConfig";

interface FeatureGuardProps {
  featureId: string;
  featureName?: string;
  userCountry?: string;
  children: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureId,
  featureName,
  userCountry = "US",
  children
}) => {
  const check = checkFeatureAvailability(featureId, userCountry);

  if (check.isAvailable) {
    return <>{children}</>;
  }

  const config = check.config;
  const displayName = featureName || config?.name || "Service Module";
  const emoji = config?.iconEmoji || "⚡";

  if (check.status === "coming_soon") {
    return (
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-indigo-500/30 shadow-2xl max-w-2xl mx-auto my-8 text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl border border-indigo-400/40 flex items-center justify-center mx-auto text-3xl shadow-inner">
          {emoji}
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Coming Soon to Platform
          </span>
          <h2 className="text-2xl font-black text-white">{displayName}</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {check.reason || "This module is currently under development and will be activated in an upcoming release."}
          </p>
        </div>

        {config?.countryAvailability && config.countryAvailability !== "ALL" && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-indigo-300 font-bold">
            <Globe className="w-3.5 h-3.5" />
            <span>Regional Target: {config.countryAvailability.replace("_", " & ")}</span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => alert(`Subscribed to launch notifications for ${displayName}!`)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Notify Me On Release</span>
          </button>
        </div>
      </div>
    );
  }

  // Deactivated / Disabled state
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto my-8 text-center space-y-5">
      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 flex items-center justify-center mx-auto text-3xl shadow-xs">
        {emoji}
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          Service Deactivated globally
        </span>
        <h2 className="text-xl font-black text-slate-900">{displayName}</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
          {check.reason || "This feature has been turned off by System Administrator settings or regional restrictions."}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2">
        <button
          onClick={() => alert("Support ticket opened regarding feature availability.")}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Contact Administrator</span>
        </button>
      </div>
    </div>
  );
};
