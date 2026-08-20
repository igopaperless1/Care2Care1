import React from 'react';
import {
  ChevronLeft,
  MoreVertical,
  MapPin,
  Receipt,
  Wrench,
  Shield,
  Calendar,
  Clock,
  Car,
  Bell,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DetailedVehicle } from './vehicleTypes';
import { VehicleScreenId } from './VehicleSidebar';

interface ScreenVehicleDashboardProps {
  vehicle: DetailedVehicle;
  onNavigate: (screen: VehicleScreenId, params?: any) => void;
  onBack: () => void;
}

export const ScreenVehicleDashboard: React.FC<ScreenVehicleDashboardProps> = ({
  vehicle,
  onNavigate,
  onBack
}) => {
  return (
    <div id="screen-5-vehicle-dashboard" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Vehicle Dashboard</h2>
          <button
            onClick={() => onNavigate('my_vehicles')}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Card Header */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
          <div className="flex items-center justify-between">
            {/* Vehicle Image */}
            <div className="w-28 h-20 relative flex items-center justify-center">
              <img
                src={
                  vehicle?.photos?.[0] ||
                  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
                }
                alt={vehicle?.name || 'Vehicle'}
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Vehicle Title & Badge */}
            <div className="text-right">
              <h3 className="text-base font-extrabold text-slate-900">{vehicle?.name || 'Honda City'}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{vehicle?.licensePlate || 'BA 3 CHA 1234'}</p>
              <div className="mt-1.5 inline-block">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/70 text-center">
            <div>
              <p className="text-xs font-black text-slate-900">{vehicle?.odometer?.toLocaleString() || '28,560'} km</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Odometer</p>
            </div>
            <div className="border-x border-slate-200/70">
              <p className="text-xs font-black text-slate-900">{vehicle?.fuelType || 'Petrol'}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Fuel Type</p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">{vehicle?.ownershipType || 'Personal'}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Ownership</p>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => onNavigate('parking')}
            className="p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 flex flex-col items-center justify-center gap-1.5 transition-all group shadow-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
              <MapPin className="w-4 h-4 text-orange-500 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 group-hover:text-orange-600 leading-tight">
              Save Parking
            </span>
          </button>

          <button
            onClick={() => onNavigate('add_expense')}
            className="p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 flex flex-col items-center justify-center gap-1.5 transition-all group shadow-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
              <Receipt className="w-4 h-4 text-orange-500 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 group-hover:text-orange-600 leading-tight">
              Add Expense
            </span>
          </button>

          <button
            onClick={() => onNavigate('log_service')}
            className="p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 flex flex-col items-center justify-center gap-1.5 transition-all group shadow-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
              <Wrench className="w-4 h-4 text-orange-500 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 group-hover:text-orange-600 leading-tight">
              Log Service
            </span>
          </button>

          <button
            onClick={() => onNavigate('insurance')}
            className="p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 flex flex-col items-center justify-center gap-1.5 transition-all group shadow-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
              <Shield className="w-4 h-4 text-orange-500 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 group-hover:text-orange-600 leading-tight">
              Add Policy
            </span>
          </button>
        </div>

        {/* Upcoming Reminders Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
          <h4 className="text-xs font-black text-slate-900 tracking-wider mb-3">
            Upcoming
          </h4>

          <div className="space-y-3">
            {/* Next Service */}
            <div
              onClick={() => onNavigate('service_history')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-sky-500" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Next Service</p>
                  <p className="text-[10px] text-slate-400 font-medium">15,000 km / 15 May 2025</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg">
                12 days left
              </span>
            </div>

            {/* Insurance Expiry */}
            <div
              onClick={() => onNavigate('insurance')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Insurance Expiry</p>
                  <p className="text-[10px] text-slate-400 font-medium">30 May 2025</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                25 days left
              </span>
            </div>

            {/* Tax Renewal */}
            <div
              onClick={() => onNavigate('insurance')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Tax Renewal</p>
                  <p className="text-[10px] text-slate-400 font-medium">24 Aug 2025</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                110 days left
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button: View All Reminders */}
      <div className="pt-4 mt-auto">
        <button
          onClick={() => onNavigate('reminders')}
          className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 font-extrabold py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span>View All Reminders</span>
        </button>
      </div>
    </div>
  );
};
