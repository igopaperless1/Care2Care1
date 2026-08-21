import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  AlertTriangle,
  ClipboardCheck,
  History,
  MoreVertical,
  Download
} from "lucide-react";
import { ActivityLogModel } from "./types";

interface ScreenActivityLogProps {
  activities: ActivityLogModel[];
}

export const ScreenActivityLog: React.FC<ScreenActivityLogProps> = ({ activities }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedFilter === "all" || act.type === selectedFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* SEARCH AND FILTER BAR (Matching Screenshot Card 12) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Activities</option>
            <option value="received">Stock Received</option>
            <option value="issued">Stock Issued</option>
            <option value="transfer">Stock Transfers</option>
            <option value="adjustment">Adjustments</option>
            <option value="stock_take">Stock Takes</option>
          </select>
        </div>
      </div>

      {/* ACTIVITY LIST (Matching Screenshot Card 12 Layout) */}
      <div className="space-y-3">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-4 hover:border-orange-200 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-orange-200 flex items-center justify-center shrink-0">
                {act.type === "received" && (
                  <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                )}
                {act.type === "issued" && (
                  <ArrowUpRight className="w-5 h-5 text-blue-600" />
                )}
                {act.type === "transfer" && (
                  <ArrowLeftRight className="w-5 h-5 text-purple-600" />
                )}
                {act.type === "adjustment" && (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                {act.type === "stock_take" && (
                  <ClipboardCheck className="w-5 h-5 text-orange-600" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">{act.title}</h3>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-[#FFF9F5] px-2 py-0.5 rounded-full border border-orange-200">
                    {act.referenceNo}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{act.details}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                  By {act.user} • {act.warehouse}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-600 block">{act.date}</span>
                <span className="text-[10px] font-black text-slate-400">{act.time}</span>
              </div>
              <button
                className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-500 flex items-center justify-center transition-colors"
                title="Activity details"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM BUTTON */}
      <button
        onClick={() => alert("All 1,420 historical ledger records exported to CSV.")}
        className="w-full py-3.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>View & Export Full Audit Log</span>
      </button>
    </div>
  );
};
