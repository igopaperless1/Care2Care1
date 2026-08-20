import React from 'react';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  Wrench,
  Receipt,
  Fuel,
  Shield,
  FileText,
  Bell,
  MapPin,
  BarChart3,
  Truck,
  Settings,
  PawPrint,
  Grid
} from 'lucide-react';

export type VehicleScreenId =
  | 'all_screens'
  | 'dashboard'
  | 'my_vehicles'
  | 'add_vehicle_step1'
  | 'add_vehicle_step2'
  | 'vehicle_dashboard'
  | 'service_history'
  | 'log_service'
  | 'expenses'
  | 'add_expense'
  | 'insurance'
  | 'parking'
  | 'fleet'
  | 'fuel_log'
  | 'documents'
  | 'reminders'
  | 'settings';

interface VehicleSidebarProps {
  currentScreen: VehicleScreenId;
  onSelectScreen: (screen: VehicleScreenId) => void;
  vehicleCount: number;
  isMobileDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const VehicleSidebar: React.FC<VehicleSidebarProps> = ({
  currentScreen,
  onSelectScreen,
  vehicleCount,
  isMobileDrawer,
  onCloseDrawer
}) => {
  const navItems = [
    { id: 'all_screens' as VehicleScreenId, label: 'All Screens (Overview)', icon: Grid, badge: '12' },
    { id: 'dashboard' as VehicleScreenId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my_vehicles' as VehicleScreenId, label: 'My Vehicles', icon: Car, badge: vehicleCount > 0 ? String(vehicleCount) : undefined },
    { id: 'add_vehicle_step1' as VehicleScreenId, label: 'Add Vehicle', icon: PlusCircle },
    { id: 'service_history' as VehicleScreenId, label: 'Services & Maintenance', icon: Wrench },
    { id: 'expenses' as VehicleScreenId, label: 'Expenses', icon: Receipt },
    { id: 'fuel_log' as VehicleScreenId, label: 'Fuel Log', icon: Fuel },
    { id: 'insurance' as VehicleScreenId, label: 'Insurance & Policies', icon: Shield },
    { id: 'documents' as VehicleScreenId, label: 'Documents', icon: FileText },
    { id: 'reminders' as VehicleScreenId, label: 'Reminders', icon: Bell },
    { id: 'parking' as VehicleScreenId, label: 'Parking Location', icon: MapPin },
    { id: 'fleet' as VehicleScreenId, label: 'Fleet Overview', icon: Truck },
    { id: 'settings' as VehicleScreenId, label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: VehicleScreenId) => {
    onSelectScreen(id);
    if (isMobileDrawer && onCloseDrawer) {
      onCloseDrawer();
    }
  };

  return (
    <aside
      id="care2care-vehicle-sidebar"
      className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full min-h-[600px] select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-200">
            <PawPrint className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">Care2Care</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">Care daily. Live fully.</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="py-3 px-3 flex-1 overflow-y-auto space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || 
            (item.id === 'service_history' && (currentScreen === 'vehicle_dashboard' || currentScreen === 'log_service')) ||
            (item.id === 'add_vehicle_step1' && currentScreen === 'add_vehicle_step2') ||
            (item.id === 'expenses' && currentScreen === 'add_expense');

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${
                isActive
                  ? 'bg-orange-50 text-orange-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Graphic / Illustration */}
      <div className="p-4 border-t border-slate-100 bg-gradient-to-b from-transparent to-orange-50/40">
        <div className="bg-orange-50/80 rounded-2xl p-3 border border-orange-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <Car className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">Smart Vehicle Vault</p>
            <p className="text-[10px] text-slate-500 truncate">Sync reminders & logs</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
