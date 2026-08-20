import React, { useState } from "react";
import {
  LifeBuoy,
  Phone,
  Shield,
  Heart,
  Flame,
  Search,
  ChevronRight,
  ExternalLink,
  Users,
  AlertTriangle,
  FileText,
  Activity
} from "lucide-react";
import { SosHelpResource } from "./types";

interface SosHelpResourcesProps {
  resources: SosHelpResource[];
  onCallNumber: (phone: string, name: string) => void;
}

export const SosHelpResources: React.FC<SosHelpResourcesProps> = ({
  resources,
  onCallNumber
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Helplines", icon: LifeBuoy },
    { id: "Emergency Numbers", label: "Emergency Numbers", icon: Shield },
    { id: "Government Helplines", label: "Government Helplines", icon: FileText },
    { id: "NGO & Support Groups", label: "NGO & Support Groups", icon: Users },
    { id: "Women Safety Resources", label: "Women Safety", icon: Heart },
    { id: "Mental Health Support", label: "Mental Health", icon: Activity },
    { id: "Disaster Management", label: "Disaster Management", icon: Flame }
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCat = selectedCategory === "all" || res.category === selectedCategory;
    const matchesQuery =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.phone.includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Help Resources</h2>
        <p className="text-xs text-slate-500 font-medium">
          Verified nationwide emergency lines, government response desks & NGO helplines
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search helpline, police, ambulance, disaster desk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#FFE8DE] rounded-2xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border ${
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

      {/* RESOURCE ITEMS (SCREEN 10) */}
      <div className="space-y-3">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white border border-[#FFE8DE] hover:border-orange-300 rounded-3xl p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  res.category === "Emergency Numbers"
                    ? "bg-red-100 text-red-600"
                    : res.category === "Women Safety Resources"
                    ? "bg-rose-100 text-rose-600"
                    : res.category === "Mental Health Support"
                    ? "bg-teal-100 text-teal-600"
                    : "bg-orange-100 text-[#FF5A36]"
                }`}
              >
                {res.category === "Emergency Numbers" && <Shield className="w-5 h-5" />}
                {res.category === "Women Safety Resources" && <Heart className="w-5 h-5" />}
                {res.category === "Mental Health Support" && <Activity className="w-5 h-5" />}
                {res.category === "Disaster Management" && <Flame className="w-5 h-5" />}
                {res.category === "Government Helplines" && <FileText className="w-5 h-5" />}
                {res.category === "NGO & Support Groups" && <Users className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">{res.name}</h4>
                  {res.tollFree && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Toll Free
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                  {res.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mt-1">
                  <span>⏱ {res.availability}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-slate-700">{res.phone}</span>
                </div>
              </div>
            </div>

            {/* Direct Call Button */}
            <button
              onClick={() => onCallNumber(res.phone, res.name)}
              className="px-4 py-2.5 rounded-2xl bg-[#FF5A36] hover:bg-[#E63920] text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {res.phone}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
