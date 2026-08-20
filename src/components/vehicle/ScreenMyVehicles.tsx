import React, { useState } from 'react';
import {
  ChevronDown,
  LayoutGrid,
  List,
  MoreVertical,
  Plus,
  ChevronRight,
  Car,
  Wrench,
  Shield,
  Trash2
} from 'lucide-react';
import { DetailedVehicle } from './vehicleTypes';
import { VehicleScreenId } from './VehicleSidebar';

interface ScreenMyVehiclesProps {
  vehicles: DetailedVehicle[];
  selectedVehicleId: string;
  onSelectVehicle: (id: string) => void;
  onNavigate: (screen: VehicleScreenId, params?: any) => void;
  onDeleteVehicle?: (id: string) => void;
}

export const ScreenMyVehicles: React.FC<ScreenMyVehiclesProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onNavigate,
  onDeleteVehicle
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = vehicles.filter((v) => {
    if (filterType === 'all') return true;
    return v.type.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div id="screen-2-my-vehicles" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      {/* Top Header & Controls */}
      <div>
        <div className="flex items-center justify-between mb-4">
          {/* Dropdown for All Vehicles */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-900 font-extrabold text-sm py-2 pl-3.5 pr-8 rounded-xl border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="all">All Vehicles ({vehicles.length})</option>
              <option value="car">Cars</option>
              <option value="motorcycle">Bikes & Scooters</option>
              <option value="van">Vans & Commercial</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-orange-500 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-orange-500 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('fleet')}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              title="Fleet view"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vehicle Cards List / Grid */}
        <div className={`space-y-3 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-3 space-y-0' : ''}`}>
          {filtered.map((veh) => {
            const isSelected = veh.id === selectedVehicleId;
            return (
              <div
                key={veh.id}
                id={`vehicle-card-${veh.id}`}
                onClick={() => {
                  onSelectVehicle(veh.id);
                  onNavigate('vehicle_dashboard');
                }}
                className={`relative bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md group ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/10'
                    : 'border-slate-100 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Photo thumbnail */}
                  <div className="w-20 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={
                        veh.photos?.[0] ||
                        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={veh.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-orange-600 transition-colors">
                        {veh.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {veh.licensePlate}
                    </p>

                    {/* Stats & Highlight pills */}
                    <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-xs font-extrabold text-slate-900">
                          {veh.odometer?.toLocaleString()} km
                        </span>
                      </div>
                      <div className="text-slate-300">•</div>
                      <div className="flex items-center gap-1">
                        {veh.nextServiceDaysLeft && veh.nextServiceDaysLeft <= 15 ? (
                          <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Wrench className="w-3 h-3 text-orange-500" />
                            {veh.nextServiceDaysLeft} days Next Service
                          </span>
                        ) : veh.insuranceDaysLeft && veh.insuranceDaysLeft <= 30 ? (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3 text-amber-500" />
                            {veh.insuranceDaysLeft} days Insurance Expiry
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-500">
                            {veh.fuelType} • {veh.ownershipType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Button: + Add New Vehicle */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-add-new-vehicle"
          onClick={() => onNavigate('add_vehicle_step1')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-sm shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Vehicle</span>
        </button>
      </div>
    </div>
  );
};
