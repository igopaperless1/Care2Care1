import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  ChevronRight,
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { ServiceRecord } from './vehicleTypes';
import { VehicleScreenId } from './VehicleSidebar';

interface ScreenServiceHistoryProps {
  services: ServiceRecord[];
  onNavigate: (screen: VehicleScreenId, params?: any) => void;
  onBack: () => void;
}

export const ScreenServiceHistory: React.FC<ScreenServiceHistoryProps> = ({
  services,
  onNavigate,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'upcoming'>('history');

  const upcomingTasks = [
    {
      id: 'up-1',
      title: 'Periodic Maintenance 30,000 km',
      due: 'in 12 days (15 May 2025)',
      tags: ['Engine Oil', 'Coolant Flush', 'Brake Check'],
      estimatedCost: 'NPR 5,000'
    },
    {
      id: 'up-2',
      title: 'Tire Alignment & Wheel Balance',
      due: 'in 40 days (10 Jun 2025)',
      tags: ['Alignment', 'Rotation'],
      estimatedCost: 'NPR 1,800'
    }
  ];

  return (
    <div id="screen-6-service-history" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Service History</h2>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTab === 'history'
                ? 'bg-white text-orange-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Service History
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-orange-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Upcoming (To-Do)
          </button>
        </div>

        {/* List Content */}
        {activeTab === 'history' ? (
          <div className="space-y-2.5">
            {services.map((item) => (
              <div
                key={item.id}
                className="bg-white hover:bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 hover:border-orange-100 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      {new Date(item.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">•</span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {item.odometer.toLocaleString()} km
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600 truncate mt-1">
                    {item.serviceTags.join(', ')}
                  </p>

                  <p className="text-xs font-black text-slate-900 mt-1">
                    NPR {item.cost.toLocaleString()}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="bg-orange-50/40 rounded-2xl p-4 border border-orange-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{task.title}</h4>
                    <p className="text-[11px] font-bold text-orange-600 mt-0.5">{task.due}</p>
                  </div>
                  <span className="text-xs font-black text-slate-900">{task.estimatedCost}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {task.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-orange-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Button: + Log New Service */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-log-new-service-trigger"
          onClick={() => onNavigate('log_service')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Service</span>
        </button>
      </div>
    </div>
  );
};
