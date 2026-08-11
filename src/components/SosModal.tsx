import React from "react";
import { AlertTriangle, Phone, MapPin, X, Shield, Radio } from "lucide-react";

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-red-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border-2 border-red-500 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <h3 className="text-lg font-extrabold tracking-tight">EMERGENCY SOS ALERT</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Radio className="w-4 h-4 text-red-600 animate-pulse" /> Live Broadcast Active
          </div>
          <p className="text-[11px] text-red-800/90">
            Emergency SMS and location coordinates sent to primary family proxies and local response dispatch.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1 border border-slate-200">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-red-500" /> Current Coordinates
          </div>
          <p className="text-[11px] text-slate-600 font-mono">
            37.7749° N, 122.4194° W (120 Market St, San Francisco, CA)
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">1-Tap Direct Lines</p>
          <a
            href="tel:911"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Phone className="w-4 h-4" /> Call 911 / Emergency Services
          </a>

          <a
            href="tel:+15550192834"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-emerald-400" /> Call Dr. Sarah Vance (Family Proxy)
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          Cancel Emergency Alert
        </button>
      </div>
    </div>
  );
};
