import React from 'react';
import {
  DollarSign,
  Wrench,
  FileText,
  Edit3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Home,
  Shield,
  Phone,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PropertyItem, MaintenanceTicket, PropertyDocument } from './propertyTypes';

interface PropertyDashboardTabProps {
  activeProperty?: PropertyItem;
  tickets: MaintenanceTicket[];
  documents: PropertyDocument[];
  onNavigateTab: (tab: string) => void;
  onOpenLogRent: () => void;
  onOpenAddTicket: () => void;
  onOpenUploadDoc: () => void;
  onOpenEditDetails: () => void;
  onSelectTicket: (ticket: MaintenanceTicket) => void;
}

export const PropertyDashboardTab: React.FC<PropertyDashboardTabProps> = ({
  activeProperty,
  tickets = [],
  documents = [],
  onNavigateTab,
  onOpenLogRent,
  onOpenAddTicket,
  onOpenUploadDoc,
  onOpenEditDetails,
  onSelectTicket
}) => {
  const propertyTickets = (tickets || []).filter(
    (t) => (t && activeProperty?.id && t.propertyId === activeProperty.id) || (t && t.propertyId === 'prop-lakeview')
  );
  const openTickets = propertyTickets.filter((t) => t && t.status !== 'Completed');

  const monthlyRent = Number(activeProperty?.monthlyRent) || 0;
  const annualMaintenance = Number(activeProperty?.annualMaintenanceCost) || 0;
  const deposit = Number(activeProperty?.securityDeposit) || 0;
  const occupancy = activeProperty?.occupancyRate !== undefined ? activeProperty.occupancyRate : 100;
  const photoUrl = activeProperty?.photos?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-4">
      {/* Property Hero Summary Card - Exactly matching the screenshot */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-orange-200/80 shrink-0 bg-slate-100">
              <img
                src={photoUrl}
                alt={activeProperty?.name || 'Property'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeProperty?.name || 'Property Details'}
                </h2>
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    activeProperty?.status === 'Rented Out'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : activeProperty?.status === 'Owner-Occupied'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}
                >
                  {activeProperty?.status || 'Active'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                {activeProperty?.address || 'Kathmandu'}, {activeProperty?.city || 'Bagmati'}, {activeProperty?.country || 'Nepal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('portfolio')}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] text-xs font-black border border-orange-200/80 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Change Property</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4 Primary Financial & Operational Vitals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Monthly Rent */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Monthly Rent</span>
              <DollarSign className="w-3.5 h-3.5 text-[#FF5A36]" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              NPR {monthlyRent.toLocaleString()}
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              Next Due: <strong className="text-[#FF5A36] font-black">{activeProperty?.nextRentDueDate || 'N/A'}</strong>
            </span>
          </div>

          {/* Maintenance Cost */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>This Year • Maintenance</span>
              <Wrench className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-lg font-black text-emerald-600 mt-1">
              NPR {annualMaintenance.toLocaleString()}
            </div>
            <span className="text-[10px] font-bold text-slate-500">Last 12 Months</span>
          </div>

          {/* Security Deposit */}
          <div className="p-3.5 bg-orange-50/50 border border-orange-200 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Security Deposit</span>
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              NPR {deposit.toLocaleString()}
            </div>
            <span className="text-[10px] font-extrabold text-indigo-600">Held in Escrow</span>
          </div>

          {/* Occupancy Rate */}
          <div className="p-3.5 bg-orange-50/50 border border-orange-200 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <span>Occupancy</span>
              <Home className="w-3.5 h-3.5 text-[#FF5A36]" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              {occupancy}%
            </div>
            <span className="text-[10px] font-extrabold text-emerald-600">Since 1 Jan 2025</span>
          </div>
        </div>

        {/* 4 Action Buttons Grid - Exactly as in the design mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={onOpenLogRent}
            className="p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 text-slate-800 text-xs font-black border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Log Rent</span>
          </button>

          <button
            onClick={onOpenAddTicket}
            className="p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 text-slate-800 text-xs font-black border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-[#FF5A36]" />
            <span>Add Ticket</span>
          </button>

          <button
            onClick={onOpenUploadDoc}
            className="p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 text-slate-800 text-xs font-black border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-sky-500" />
            <span>Upload Doc</span>
          </button>

          <button
            onClick={onOpenEditDetails}
            className="p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 text-slate-800 text-xs font-black border border-orange-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-amber-500" />
            <span>Edit Details</span>
          </button>
        </div>
      </div>

      {/* Open Maintenance Tickets Section - Direct visual replica from screenshot */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Open Maintenance Tickets</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Active repair requests and service assignments
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('maintenance')}
            className="text-xs font-black text-[#FF5A36] hover:underline cursor-pointer"
          >
            View All ({tickets.length})
          </button>
        </div>

        {openTickets.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No active maintenance issues!</p>
            <p className="text-[11px] text-slate-400">All systems are running smoothly.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {openTickets.map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => onSelectTicket(tkt)}
                className="p-3.5 bg-[#FFF9F5] hover:bg-orange-50/60 border border-orange-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center shrink-0 mt-0.5">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                        {tkt.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold text-slate-500">
                      <span className="text-slate-400 font-bold">{tkt.ticketNumber}</span>
                      <span>•</span>
                      <span
                        className={`font-black ${
                          tkt.status === 'In Progress'
                            ? 'text-amber-600'
                            : tkt.status === 'Assigned'
                            ? 'text-indigo-600'
                            : 'text-red-500'
                        }`}
                      >
                        {tkt.status}
                      </span>
                      {tkt.assignedContractorName && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600">{tkt.assignedContractorName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs font-black text-slate-900">
                    NPR {(Number(tkt.estimatedCost) || 0).toLocaleString()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
