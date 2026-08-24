import React, { useState } from "react";
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Activity,
  Sliders,
  Settings,
  Sparkles,
  Droplets,
  Heart,
  Moon,
  Pill,
  Apple,
  Shield,
  Briefcase,
  Users
} from "lucide-react";
import { ServiceUsageItem } from "../../types/adminTypes";

interface AllServicesPageProps {
  showToast?: (msg: string) => void;
}

const DEFAULT_SERVICES: ServiceUsageItem[] = [
  { id: "srv-walk", name: "Walk & Steps Tracker", category: "Physical Fitness", activeUsers: 12540, totalEvents: 142800, trend: "+14.2%", status: "active", healthScore: 99 },
  { id: "srv-water", name: "Hydration & Water Service", category: "Vital Health", activeUsers: 11230, totalEvents: 139400, trend: "+12.8%", status: "active", healthScore: 100 },
  { id: "srv-sleep", name: "Sleep & Circadian Tracker", category: "Wellness", activeUsers: 9875, totalEvents: 98000, trend: "+10.1%", status: "active", healthScore: 98 },
  { id: "srv-medicine", name: "Medicine & Adherence", category: "Medical Care", activeUsers: 7420, totalEvents: 85200, trend: "+8.9%", status: "active", healthScore: 99 },
  { id: "srv-nutrition", name: "Nutrition & Diet Log", category: "Vital Health", activeUsers: 6890, totalEvents: 72100, trend: "+7.4%", status: "active", healthScore: 97 },
  { id: "srv-yoga", name: "Yoga & Habit Quest", category: "Wellness", activeUsers: 5920, totalEvents: 61400, trend: "+11.5%", status: "active", healthScore: 99 },
  { id: "srv-mental", name: "Mental Health & CBT", category: "Wellness", activeUsers: 4850, totalEvents: 49000, trend: "+9.2%", status: "active", healthScore: 98 },
  { id: "srv-sos", name: "Emergency SOS Relay", category: "Safety", activeUsers: 24680, totalEvents: 1240, trend: "+3.1%", status: "active", healthScore: 100 },
  { id: "srv-store", name: "Custom Store & POS", category: "Commerce", activeUsers: 1840, totalEvents: 28900, trend: "+15.0%", status: "active", healthScore: 96 },
  { id: "srv-farm", name: "Garden & Farm Tracker", category: "Agriculture", activeUsers: 1420, totalEvents: 19400, trend: "+6.8%", status: "active", healthScore: 97 },
  { id: "srv-payroll", name: "Staff & Payroll Manager", category: "Enterprise HR", activeUsers: 940, totalEvents: 12800, trend: "+18.2%", status: "active", healthScore: 98 },
  { id: "srv-passwords", name: "Password & Vault Shield", category: "Security", activeUsers: 4200, totalEvents: 31000, trend: "+12.1%", status: "active", healthScore: 100 }
];

export const AllServicesPage: React.FC<AllServicesPageProps> = ({ showToast }) => {
  const [services, setServices] = useState<ServiceUsageItem[]>(DEFAULT_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newStatus = s.status === "active" ? "maintenance" : "active";
        if (showToast) showToast(`Service "${s.name}" is now ${newStatus}`);
        return { ...s, status: newStatus };
      })
    );
  };

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#FFF9F5] dark:bg-[#131d38] border border-orange-200/80 dark:border-[#1e294b] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                Service Catalog
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                42 Active / 46 Total Services
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              All Platform Services & Feature Flags
            </h1>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search service name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200"
        >
          <option value="all">All Categories</option>
          <option value="Physical Fitness">Physical Fitness</option>
          <option value="Vital Health">Vital Health</option>
          <option value="Wellness">Wellness</option>
          <option value="Medical Care">Medical Care</option>
          <option value="Safety">Safety</option>
          <option value="Commerce">Commerce</option>
          <option value="Enterprise HR">Enterprise HR</option>
          <option value="Security">Security</option>
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">{srv.category}</span>
                <h3 className="font-black text-base text-slate-900 dark:text-white">{srv.name}</h3>
              </div>
              <button
                onClick={() => toggleServiceStatus(srv.id)}
                className="cursor-pointer"
                title="Toggle Service Online / Maintenance"
              >
                {srv.status === "active" ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500 hover:text-emerald-600 transition-colors" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400 hover:text-slate-500 transition-colors" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-[#0f172a] rounded-2xl">
                <span className="text-slate-500 text-[11px] block">Active Users</span>
                <span className="font-black text-slate-900 dark:text-white">{srv.activeUsers.toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-[#0f172a] rounded-2xl">
                <span className="text-slate-500 text-[11px] block">Health Score</span>
                <span className="font-black text-emerald-600">{srv.healthScore}%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Total Interactions:</span>
              <span className="text-[#FF5A36]">{srv.totalEvents.toLocaleString()} ({srv.trend})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
