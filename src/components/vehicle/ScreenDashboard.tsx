import React from 'react';
import {
  MoreVertical,
  Wrench,
  Shield,
  PlusCircle,
  Clock,
  Car,
  MapPin,
  ChevronRight,
  TrendingUp,
  Receipt,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { DetailedVehicle, VehicleExpense } from './vehicleTypes';
import { VehicleScreenId } from './VehicleSidebar';

interface ScreenDashboardProps {
  vehicle: DetailedVehicle;
  expenses: VehicleExpense[];
  userName?: string;
  onNavigate: (screen: VehicleScreenId, params?: any) => void;
  onQuickAction: (action: string) => void;
}

export const ScreenDashboard: React.FC<ScreenDashboardProps> = ({
  vehicle,
  expenses,
  userName = 'Roshan',
  onNavigate,
  onQuickAction
}) => {
  // Calculate this month's stats
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const fuelCost = expenses
    .filter((e) => e.type === 'Fuel')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalDistance = 1245;

  return (
    <div id="screen-1-dashboard" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
              Good Morning, {userName} <span className="text-lg">👋</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Here&apos;s your vehicle overview
            </p>
          </div>
          <button
            onClick={() => onNavigate('vehicle_dashboard')}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            title="Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Featured Vehicle Hero Card */}
        <div
          onClick={() => onNavigate('vehicle_dashboard')}
          className="bg-gradient-to-b from-slate-50 to-orange-50/30 rounded-2xl p-4 border border-slate-100 mb-4 cursor-pointer hover:border-orange-200 transition-all shadow-xs group"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                {vehicle?.name || 'Honda City'}
              </h2>
              <p className="text-xs font-semibold text-slate-500 tracking-wide mt-0.5">
                {vehicle?.licensePlate || 'BA 3 CHA 1234'}
              </p>
            </div>
            <div className="w-24 h-14 relative flex items-center justify-center">
              <img
                src={
                  vehicle?.photos?.[0] ||
                  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
                }
                alt={vehicle?.name || 'Vehicle'}
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Odometer and Fuel Type */}
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/60">
            <div>
              <p className="text-sm font-black text-slate-900">
                {vehicle?.odometer?.toLocaleString() || '28,560'} km
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Current Odometer</p>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">
                {vehicle?.fuelType || 'Petrol'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Fuel Type</p>
            </div>
          </div>

          {/* Service & Insurance Badges */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('service_history');
              }}
              className="bg-white rounded-xl p-2.5 border border-orange-100 flex items-center gap-2 hover:bg-orange-50/50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <Wrench className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-slate-400 font-semibold truncate">Next Service</p>
                <p className="text-xs font-black text-slate-900 truncate">
                  in {vehicle?.nextServiceDaysLeft || 12} days
                </p>
                <p className="text-[9px] text-slate-400 truncate">
                  {vehicle?.nextServiceDueKm?.toLocaleString() || '15,000'} km
                </p>
              </div>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('insurance');
              }}
              className="bg-white rounded-xl p-2.5 border border-orange-100 flex items-center gap-2 hover:bg-orange-50/50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <Shield className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-slate-400 font-semibold truncate">Insurance Expiry</p>
                <p className="text-xs font-black text-slate-900 truncate">
                  in {vehicle?.insuranceDaysLeft || 25} days
                </p>
                <p className="text-[9px] text-slate-400 truncate">30 May 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <h3 className="text-xs font-black text-slate-800 tracking-wider mb-2.5">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              id="qa-add-expense"
              onClick={() => onNavigate('add_expense')}
              className="bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
                <Receipt className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-orange-600 text-center leading-tight">
                Add Expense
              </span>
            </button>

            <button
              id="qa-log-service"
              onClick={() => onNavigate('log_service')}
              className="bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
                <Wrench className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-orange-600 text-center leading-tight">
                Log Service
              </span>
            </button>

            <button
              id="qa-add-policy"
              onClick={() => onNavigate('insurance')}
              className="bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
                <Shield className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-orange-600 text-center leading-tight">
                Add Policy
              </span>
            </button>

            <button
              id="qa-save-parking"
              onClick={() => onNavigate('parking')}
              className="bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
                <MapPin className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-orange-600 text-center leading-tight">
                Save Parking
              </span>
            </button>
          </div>
        </div>

        {/* This Month Summary */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-800 tracking-wider">
              This Month Summary
            </h3>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-[11px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold truncate">Expenses</p>
              <p className="text-xs font-black text-slate-900 mt-0.5 truncate">
                NPR {totalExpenses ? totalExpenses.toLocaleString() : '14,500'}
              </p>
            </div>
            <div className="border-x border-slate-200/80 px-2">
              <p className="text-[10px] text-slate-400 font-semibold truncate">Fuel Cost</p>
              <p className="text-xs font-black text-slate-900 mt-0.5 truncate">
                NPR {fuelCost ? fuelCost.toLocaleString() : '8,200'}
              </p>
            </div>
            <div className="pl-1">
              <p className="text-[10px] text-slate-400 font-semibold truncate">Distance</p>
              <p className="text-xs font-black text-slate-900 mt-0.5 truncate">
                {totalDistance.toLocaleString()} km
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
