import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  CheckCircle2,
  MapPin,
  Navigation,
  Share2,
  AlertTriangle,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { ParkingLocationData } from './vehicleTypes';

interface ScreenParkingLocationProps {
  locationData: ParkingLocationData;
  onUpdateLocation?: (loc: Partial<ParkingLocationData>) => void;
  onBack: () => void;
}

export const ScreenParkingLocation: React.FC<ScreenParkingLocationProps> = ({
  locationData,
  onUpdateLocation,
  onBack
}) => {
  const [alertsEnabled, setAlertsEnabled] = useState(locationData.safetyAlertEnabled ?? true);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareText = `My parked vehicle location: ${locationData.address} (https://maps.google.com/?q=${locationData.latitude},${locationData.longitude})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${locationData.latitude},${locationData.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div id="screen-11-parking" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Parking Location</h2>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Location Saved Status Header */}
        <div className="flex items-center gap-2.5 mb-3 bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl">
          <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 leading-tight">Location Saved</h3>
            <p className="text-[10px] font-semibold text-slate-500">{locationData.savedAt}</p>
          </div>
        </div>

        {/* Address & Coordinates Card */}
        <div className="mb-3">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-slate-900">{locationData.address}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {locationData.latitude.toFixed(4)}° N, {locationData.longitude.toFixed(4)}° E
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Stylized Map View */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 mb-3.5 bg-[#E8ECE9]">
          {/* Stylized SVG Map Representation */}
          <svg className="w-full h-full" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D7DDD8" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#F1F4F1" />
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Roads */}
            <path d="M 0 110 Q 150 90 250 120 T 400 100" fill="none" stroke="#FFFFFF" strokeWidth="20" />
            <path d="M 0 110 Q 150 90 250 120 T 400 100" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="6,4" />
            <path d="M 200 0 L 220 220" fill="none" stroke="#FFFFFF" strokeWidth="16" />
            <path d="M 90 40 L 320 180" fill="none" stroke="#E2E8F0" strokeWidth="10" />

            {/* Campus / Park Area */}
            <rect x="140" y="50" width="120" height="90" rx="8" fill="#D4EDDA" opacity="0.85" />
            <text x="150" y="75" fill="#2E7D32" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Pulchowk Campus
            </text>
            <text x="150" y="90" fill="#4B6B50" fontSize="8" fontFamily="sans-serif">
              IOE Engineering
            </text>

            {/* Other Area */}
            <rect x="20" y="140" width="90" height="60" rx="6" fill="#E8EEF5" />
            <text x="28" y="165" fill="#475569" fontSize="8" fontWeight="600" fontFamily="sans-serif">
              Labim Mall Area
            </text>
          </svg>

          {/* Map Pin Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative animate-bounce">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md">
                <MapPin className="w-4 h-4 fill-white" />
              </div>
            </div>
            <div className="bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-sm">
              Parked Here
            </div>
          </div>
        </div>

        {/* Action Buttons: Open in Maps | Share Location */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button
            onClick={handleOpenMaps}
            className="bg-orange-50/80 hover:bg-orange-100 border border-orange-200 text-orange-600 font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open in Maps</span>
          </button>

          <button
            onClick={handleShare}
            className="bg-orange-50/80 hover:bg-orange-100 border border-orange-200 text-orange-600 font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Location'}</span>
          </button>
        </div>

        {/* Safety Alert Box */}
        <div className="bg-orange-50/40 border border-orange-200/80 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Safety Alert</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                You are far from your parked vehicle. Did you move it?
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 pl-2">
            <span className="text-[9px] font-bold text-slate-500 mb-1">Enable Alerts</span>
            <button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                alertsEnabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  alertsEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
