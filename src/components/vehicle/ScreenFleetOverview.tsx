import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  ChevronDown,
  AlertTriangle,
  Clock,
  Shield,
  Wrench,
  TrendingUp,
  Car,
  ChevronRight
} from 'lucide-react';
import { FleetOverviewStats, DetailedVehicle } from './vehicleTypes';
import { VehicleScreenId } from './VehicleSidebar';

interface ScreenFleetOverviewProps {
  stats: FleetOverviewStats;
  vehicles: DetailedVehicle[];
  onNavigate: (screen: VehicleScreenId, params?: any) => void;
  onBack: () => void;
}

export const ScreenFleetOverview: React.FC<ScreenFleetOverviewProps> = ({
  stats,
  vehicles,
  onNavigate,
  onBack
}) => {
  const [period, setPeriod] = useState<'this_month' | 'last_month' | 'yearly'>('this_month');

  // Donut chart math
  const total = stats.totalVehicles || 12;
  const good = stats.statusBreakdown.good || 8;
  const attention = stats.statusBreakdown.attention || 3;
  const overdue = stats.statusBreakdown.overdue || 1;

  const goodPct = (good / total) * 100;
  const attentionPct = (attention / total) * 100;
  const overduePct = (overdue / total) * 100;

  // SVG circle circumference for r=38
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const goodDash = (goodPct / 100) * circumference;
  const attentionDash = (attentionPct / 100) * circumference;
  const overdueDash = (overduePct / 100) * circumference;

  return (
    <div id="screen-12-fleet" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header & Filter */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-extrabold text-slate-900">Fleet Overview</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-900 font-extrabold text-xs py-1.5 pl-3 pr-7 rounded-xl border border-slate-200 cursor-pointer focus:outline-none"
              >
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="yearly">This Year</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Fleet Summary Top 4 Metric Tiles */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/90 rounded-2xl p-3 border border-slate-100 mb-2.5 text-center">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold truncate">Total Vehicles</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">
              {stats.totalVehicles}
            </p>
          </div>
          <div className="border-x border-slate-200 px-1">
            <p className="text-[10px] text-slate-400 font-semibold truncate">Total Distance</p>
            <p className="text-sm font-black text-slate-900 mt-0.5 truncate">
              {stats.totalDistanceKm.toLocaleString()} km
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold truncate">Total Expenses</p>
            <p className="text-sm font-black text-slate-900 mt-0.5 truncate">
              NPR {(stats.totalExpenses / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* Fuel Cost Banner */}
        <div className="bg-orange-50/50 rounded-xl px-3 py-2 border border-orange-100 mb-4 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-600">Fuel Cost</span>
          <span className="text-xs font-black text-slate-900">
            NPR {stats.totalFuelCost.toLocaleString()}
          </span>
        </div>

        {/* Vehicles Status Donut Chart Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-4">
          <h4 className="text-xs font-black text-slate-900 mb-3 tracking-wider">
            Vehicles Status
          </h4>

          <div className="flex items-center justify-between">
            {/* Donut Chart with SVG */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                />
                {/* Good Segment (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray={`${goodDash} ${circumference - goodDash}`}
                  strokeDashoffset="0"
                />
                {/* Attention Segment (Orange) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#F97316"
                  strokeWidth="12"
                  strokeDasharray={`${attentionDash} ${circumference - attentionDash}`}
                  strokeDashoffset={`${-goodDash}`}
                />
                {/* Overdue Segment (Red) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray={`${overdueDash} ${circumference - overdueDash}`}
                  strokeDashoffset={`${-(goodDash + attentionDash)}`}
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-slate-900 leading-none">{total}</span>
                <span className="text-[9px] font-bold text-slate-400">Total</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2 flex-1 pl-6">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-700">Good</span>
                </div>
                <span className="font-extrabold text-slate-900">{good}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="font-bold text-slate-700">Attention</span>
                </div>
                <span className="font-extrabold text-slate-900">{attention}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="font-bold text-slate-700">Overdue</span>
                </div>
                <span className="font-extrabold text-slate-900">{overdue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="mb-2">
          <h4 className="text-xs font-black text-slate-900 tracking-wider mb-2.5">
            Recent Alerts
          </h4>
          <div className="space-y-2">
            {stats.alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-orange-50/50 hover:bg-orange-50 rounded-xl p-2.5 border border-orange-100 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <p className="text-xs font-bold text-slate-800 flex-1 truncate">
                  {alert.message}
                </p>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button: View All Vehicles */}
      <div className="pt-3 mt-auto">
        <button
          onClick={() => onNavigate('my_vehicles')}
          className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 font-extrabold py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Car className="w-4 h-4" />
          <span>View All Vehicles</span>
        </button>
      </div>
    </div>
  );
};
