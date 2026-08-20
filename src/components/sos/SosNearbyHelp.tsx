import React, { useState } from "react";
import {
  MapPin,
  Hospital,
  Shield,
  Car,
  Phone,
  Navigation,
  Compass,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Flame,
  Activity,
  CheckCircle2
} from "lucide-react";
import { SosNearbyService } from "./types";

interface SosNearbyHelpProps {
  services: SosNearbyService[];
  onCallService: (service: SosNearbyService) => void;
}

export const SosNearbyHelp: React.FC<SosNearbyHelpProps> = ({
  services,
  onCallService
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedService, setSelectedService] = useState<SosNearbyService | null>(null);

  const categories = [
    { id: "all", label: "Nearby" },
    { id: "Hospital", label: "Hospitals" },
    { id: "Police", label: "Police" },
    { id: "Ambulance", label: "Ambulance" },
    { id: "Roadside", label: "Services" },
    { id: "Fire", label: "Fire" }
  ];

  const filteredServices = services.filter((svc) => {
    const matchesCategory = activeCategory === "all" || svc.type === activeCategory;
    const matchesQuery =
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-4">
      {/* FILTER PILLS (SCREEN 4) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                  : "bg-white text-slate-700 hover:bg-orange-50 border-[#FFE8DE]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* MAP PREVIEW BOX (SCREEN 4) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-4 shadow-xs relative overflow-hidden">
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-emerald-50 via-slate-100 to-orange-50 border border-orange-200/60 overflow-hidden flex items-center justify-center">
          {/* Simulated Map Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

          {/* User Location Pulse (Blue Dot) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center relative shadow-md z-10">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="text-[9px] font-black bg-white/90 px-1.5 py-0.5 rounded-md shadow-xs text-slate-800 mt-1 border border-slate-200">
              You are here
            </span>
          </div>

          {/* Hospital Pin (Red) */}
          <button
            onClick={() => setSelectedService(services.find((s) => s.type === "Hospital") || null)}
            className="absolute left-[30%] top-[25%] flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
              <Hospital className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold bg-white/95 px-1 py-0.5 rounded shadow-xs text-slate-800 mt-0.5">
              City Hospital
            </span>
          </button>

          {/* Police Pin (Green/Blue) */}
          <button
            onClick={() => setSelectedService(services.find((s) => s.type === "Police") || null)}
            className="absolute right-[25%] top-[30%] flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold bg-white/95 px-1 py-0.5 rounded shadow-xs text-slate-800 mt-0.5">
              Nepal Police
            </span>
          </button>

          {/* Ambulance Pin */}
          <button
            onClick={() => setSelectedService(services.find((s) => s.type === "Ambulance") || null)}
            className="absolute left-[20%] bottom-[20%] flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-md">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold bg-white/95 px-1 py-0.5 rounded shadow-xs text-slate-800 mt-0.5">
              Ambulance
            </span>
          </button>

          {/* Roadside Pin */}
          <button
            onClick={() => setSelectedService(services.find((s) => s.type === "Roadside") || null)}
            className="absolute right-[28%] bottom-[20%] flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Car className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold bg-white/95 px-1 py-0.5 rounded shadow-xs text-slate-800 mt-0.5">
              Roadside
            </span>
          </button>

          {/* Map Top Bar */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <div className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 shadow-xs border border-white/60">
              📍 Kathmandu Central Grid (27.69° N, 85.31° E)
            </div>
            <a
              href="https://maps.google.com/?q=hospitals+near+me"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-xl bg-[#FF5A36] text-white text-[10px] font-bold shadow-xs pointer-events-auto flex items-center gap-1 hover:bg-[#E63920]"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search hospital, police station, ambulance..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#FFE8DE] rounded-2xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* NEARBY SERVICES LIST (SCREEN 4) */}
      <div className="space-y-3">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className={`bg-white border rounded-2xl p-4 shadow-xs flex items-center justify-between transition-all ${
              selectedService?.id === svc.id
                ? "border-[#FF5A36] ring-2 ring-orange-100"
                : "border-[#FFE8DE] hover:border-orange-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  svc.type === "Hospital"
                    ? "bg-rose-100 text-rose-600"
                    : svc.type === "Police"
                    ? "bg-emerald-100 text-emerald-700"
                    : svc.type === "Ambulance"
                    ? "bg-orange-100 text-[#FF5A36]"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {svc.type === "Hospital" && <Hospital className="w-5 h-5" />}
                {svc.type === "Police" && <Shield className="w-5 h-5" />}
                {svc.type === "Ambulance" && <Activity className="w-5 h-5" />}
                {svc.type === "Roadside" && <Car className="w-5 h-5" />}
                {svc.type === "Fire" && <Flame className="w-5 h-5" />}
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">{svc.name}</h4>
                <p className="text-xs font-semibold text-slate-500">
                  {svc.distanceKm} km • {svc.durationMin} min away
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    24/7 Open
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {svc.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(svc.name + " " + svc.address)}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] flex items-center justify-center border border-orange-200"
                title="Get Directions"
              >
                <Navigation className="w-4 h-4" />
              </a>

              <button
                onClick={() => onCallService(svc)}
                className="w-9 h-9 rounded-xl bg-[#FF5A36] hover:bg-[#E63920] text-white flex items-center justify-center shadow-xs cursor-pointer"
                title={`Call ${svc.name} (${svc.phone})`}
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
