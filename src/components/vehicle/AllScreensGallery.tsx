import React from 'react';
import {
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { VehicleScreenId } from './VehicleSidebar';

interface AllScreensGalleryProps {
  onSelectScreen: (screenId: VehicleScreenId) => void;
}

export const AllScreensGallery: React.FC<AllScreensGalleryProps> = ({ onSelectScreen }) => {
  const screens = [
    {
      id: 'dashboard' as VehicleScreenId,
      number: 1,
      name: 'Dashboard',
      desc: 'Vehicle overview, odometer, fuel, next service & quick actions',
      tag: 'Overview'
    },
    {
      id: 'my_vehicles' as VehicleScreenId,
      number: 2,
      name: 'My Vehicles',
      desc: 'Multi-vehicle list & grid cards, mileage and status',
      tag: 'Fleet'
    },
    {
      id: 'add_vehicle_step1' as VehicleScreenId,
      number: 3,
      name: 'Add New Vehicle',
      desc: 'General information, brand, model, license & photo picker',
      tag: 'Step 1'
    },
    {
      id: 'add_vehicle_step2' as VehicleScreenId,
      number: 4,
      name: 'Add Vehicle - Details',
      desc: 'Ownership type, purchase price in NPR & fuel profile',
      tag: 'Step 2'
    },
    {
      id: 'vehicle_dashboard' as VehicleScreenId,
      number: 5,
      name: 'Vehicle Dashboard',
      desc: 'Active vehicle hero, odometer, quick tools & reminders',
      tag: 'Detail'
    },
    {
      id: 'service_history' as VehicleScreenId,
      number: 6,
      name: 'Service History',
      desc: 'Chronological logbook, cost in NPR & upcoming to-dos',
      tag: 'Maintenance'
    },
    {
      id: 'log_service' as VehicleScreenId,
      number: 7,
      name: 'Log New Service',
      desc: 'Service provider, cost, checklist tags & notes',
      tag: 'Action'
    },
    {
      id: 'expenses' as VehicleScreenId,
      number: 8,
      name: 'Expenses',
      desc: 'Categorized expense log, fuel, toll, wash & totals',
      tag: 'Financials'
    },
    {
      id: 'add_expense' as VehicleScreenId,
      number: 9,
      name: 'Add Expense',
      desc: 'Manual input & AI Smart Receipt Scan auto-extraction',
      tag: 'AI Powered'
    },
    {
      id: 'insurance' as VehicleScreenId,
      number: 10,
      name: 'Insurance & Policies',
      desc: 'Active policy banner, Blue Book tax token & renewals',
      tag: 'Legal Vault'
    },
    {
      id: 'parking' as VehicleScreenId,
      number: 11,
      name: 'Parking Location',
      desc: 'GPS pin at Pulchowk, directions & proximity safety alert',
      tag: 'GPS Tracker'
    },
    {
      id: 'fleet' as VehicleScreenId,
      number: 12,
      name: 'Fleet Overview',
      desc: '12 vehicle donut health breakdown & critical alert queue',
      tag: 'Analytics'
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Vehicle Service - All 12 Screens</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Care2Care Auto Management System</h2>
            <p className="text-orange-100 text-xs font-medium mt-1">
              Select any screen below or use the sidebar to experience the complete vehicle ecosystem.
            </p>
          </div>

          <button
            onClick={() => onSelectScreen('dashboard')}
            className="bg-white text-orange-600 hover:bg-orange-50 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2 transition-transform active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <span>Launch Screen 1 (Dashboard)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 12 screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {screens.map((screen) => (
          <div
            key={screen.id}
            onClick={() => onSelectScreen(screen.id)}
            className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center shadow-xs">
                  {screen.number}
                </span>
                <span className="text-[10px] font-extrabold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                  {screen.tag}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">
                {screen.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                {screen.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-500 group-hover:text-orange-600">
              <span>Open Screen</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
