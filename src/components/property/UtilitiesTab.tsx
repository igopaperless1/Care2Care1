import React, { useState } from 'react';
import {
  Zap,
  Droplet,
  Flame,
  Wifi,
  BarChart2,
  Calendar,
  DollarSign,
  Plus,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { UtilityRecord, PropertyItem } from './propertyTypes';

interface UtilitiesTabProps {
  properties: PropertyItem[];
  utilityRecords: UtilityRecord[];
  onLogUtility: (record: UtilityRecord) => void;
}

export const UtilitiesTab: React.FC<UtilitiesTabProps> = ({
  properties,
  utilityRecords,
  onLogUtility
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 12 Months');
  const [showLogModal, setShowLogModal] = useState(false);

  // Latest utility record
  const current = utilityRecords[0] || {
    electricityCost: 3250,
    electricityUnits: 350,
    waterCost: 1120,
    waterVolume: 22000,
    gasCost: 1860,
    gasUnits: 18,
    internetCost: 1000,
    internetSpeed: '100 Mbps',
    totalCost: 7230
  };

  // Water usage trend data (Nov to Apr as in mockup)
  const waterTrend = [
    { month: 'Nov', liters: 18000, heightPct: 60 },
    { month: 'Dec', liters: 24000, heightPct: 80 },
    { month: 'Jan', liters: 19000, heightPct: 65 },
    { month: 'Feb', liters: 17500, heightPct: 58 },
    { month: 'Mar', liters: 23000, heightPct: 75 },
    { month: 'Apr', liters: 22000, heightPct: 72 },
    { month: 'May', liters: 24500, heightPct: 82 }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">Utilities & Usage</h2>
          <p className="text-xs font-bold text-slate-500">
            Monitor electricity, water volume, cooking gas, and high-speed internet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3.5 py-1.5 bg-orange-50/70 border border-orange-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="Last 12 Months">Last 12 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>

      {/* Utilities Breakdown List (Exact visual match to screenshot) */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Total This Month
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            NPR {current.totalCost.toLocaleString()}
          </div>
        </div>

        {/* 4 Line Items */}
        <div className="space-y-2.5">
          {/* Electricity */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Electricity</h4>
                <p className="text-[10px] font-bold text-slate-400">National Grid (NEA)</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-slate-900">
                NPR {current.electricityCost.toLocaleString()}
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {current.electricityUnits} kWh
              </span>
            </div>
          </div>

          {/* Water */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Water</h4>
                <p className="text-[10px] font-bold text-slate-400">KUKL Municipal Supply</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-slate-900">
                NPR {current.waterCost.toLocaleString()}
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {current.waterVolume.toLocaleString()} L
              </span>
            </div>
          </div>

          {/* Gas */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Cooking Gas</h4>
                <p className="text-[10px] font-bold text-slate-400">LPG Cylinder Supply</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-slate-900">
                NPR {current.gasCost.toLocaleString()}
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {current.gasUnits} m³
              </span>
            </div>
          </div>

          {/* Internet */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Internet</h4>
                <p className="text-[10px] font-bold text-slate-400">Fiber High Speed</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-slate-900">
                NPR {current.internetCost.toLocaleString()}
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {current.internetSpeed}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Water Usage Trend (L) Bar Chart (Exact replica from screenshot) */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Water Usage Trend (L)
          </h3>
          <span className="text-[11px] font-bold text-sky-600">Avg ~ 21,500 L / mo</span>
        </div>

        {/* Bar chart container */}
        <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100">
          {waterTrend.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {(item.liters / 1000).toFixed(0)}k
              </span>
              <div
                style={{ height: `${item.heightPct}%` }}
                className="w-full max-w-[28px] bg-sky-400 group-hover:bg-sky-500 rounded-t-lg transition-all cursor-pointer shadow-xs"
              ></div>
              <span className="text-[10px] font-bold text-slate-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
