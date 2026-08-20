import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  ChevronRight,
  User,
  ArrowRight,
  Check,
  Building,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import {
  MaintenanceTicket,
  TicketStatus,
  TicketCategory,
  PropertyItem,
  VendorContact
} from './propertyTypes';

interface MaintenanceTicketsTabProps {
  tickets: MaintenanceTicket[];
  properties: PropertyItem[];
  vendors: VendorContact[];
  selectedTicket: MaintenanceTicket | null;
  onSelectTicket: (ticket: MaintenanceTicket | null) => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onAddTicket: (ticket: MaintenanceTicket) => void;
  onAddAfterPhoto: (ticketId: string, photoUrl: string) => void;
}

export const MaintenanceTicketsTab: React.FC<MaintenanceTicketsTabProps> = ({
  tickets,
  properties,
  vendors,
  selectedTicket,
  onSelectTicket,
  onUpdateTicketStatus,
  onAddTicket,
  onAddAfterPhoto
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWorkflowView, setShowWorkflowView] = useState(false);

  // New ticket state
  const [newPropId, setNewPropId] = useState(properties[0]?.id || 'prop-lakeview');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TicketCategory>('Plumbing');
  const [newVendorId, setNewVendorId] = useState<string>(vendors[0]?.id || '');
  const [newEstimatedCost, setNewEstimatedCost] = useState<number>(1500);

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'All') return true;
    return t.status === filterStatus;
  });

  const activeTicket = selectedTicket || tickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const prop = properties.find((p) => p.id === newPropId) || properties[0];
    const vendor = vendors.find((v) => v.id === newVendorId);

    const ticket: MaintenanceTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `#TKT-00${tickets.length + 10}`,
      propertyId: prop.id,
      propertyName: prop.name,
      title: newTitle,
      description: newDesc,
      category: newCategory,
      priority: 'Medium',
      status: vendor ? 'Assigned' : 'Reported',
      reportedDate: 'Today',
      reportedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportedBy: 'Property Owner',
      assignedContractorId: vendor?.id,
      assignedContractorName: vendor?.name,
      assignedContractorContact: vendor?.phone,
      assignedContractorAvatar: vendor?.avatar,
      assignedDate: vendor ? 'Today' : undefined,
      estimatedCost: Number(newEstimatedCost) || 1000,
      currency: 'NPR',
      beforePhotos: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
      ],
      afterPhotos: [],
      workflowSteps: [
        {
          status: 'Reported',
          label: 'Reported',
          timestamp: 'Just now',
          note: `Reported by Owner: ${newTitle}`,
          actor: 'Owner',
          completed: true
        },
        {
          status: 'Assigned',
          label: 'Assigned',
          timestamp: vendor ? 'Assigned' : 'Pending',
          note: vendor ? `Assigned to ${vendor.name}` : 'Contractor unassigned',
          actor: 'System',
          completed: !!vendor
        },
        {
          status: 'In Progress',
          label: 'In Progress',
          timestamp: 'Pending work start',
          note: 'Awaiting dispatch',
          actor: vendor?.name || 'Contractor',
          completed: false
        },
        {
          status: 'Completed',
          label: 'Completed',
          timestamp: 'Pending resolution',
          note: 'Verification and sign-off',
          actor: 'Tenant / Manager',
          completed: false
        }
      ]
    };

    onAddTicket(ticket);
    setShowAddModal(false);
    onSelectTicket(ticket);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Reported', 'Assigned', 'In Progress', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-[#FF5A36] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-orange-50 border border-slate-200/80'
              }`}
            >
              {st} ({st === 'All' ? tickets.length : tickets.filter((t) => t.status === st).length})
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-2xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Maintenance Ticket</span>
        </button>
      </div>

      {/* Main Ticket Layout - 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Tickets Queue List (4 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredTickets.map((tkt) => {
            const isSelected = activeTicket?.id === tkt.id;
            return (
              <div
                key={tkt.id}
                onClick={() => onSelectTicket(tkt)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-[#FF5A36] ring-2 ring-[#FF5A36]/20 shadow-md'
                    : 'border-orange-100 hover:border-orange-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#FF5A36]">
                    {tkt.ticketNumber}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      tkt.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : tkt.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : tkt.status === 'Assigned'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {tkt.status}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900 mt-1.5">{tkt.title}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                  <Building className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">{tkt.propertyName}</span>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[11px] font-bold">
                  <span className="text-slate-400">{tkt.reportedDate}</span>
                  <span className="text-slate-900 font-black">
                    NPR {(Number(tkt.estimatedCost) || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Ticket Detail & Workflow Screen (7 cols) - Matching Mockup */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
              {/* Ticket Top Meta */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#FF5A36]">
                    {activeTicket.ticketNumber}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                      activeTicket.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : activeTicket.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : activeTicket.status === 'Assigned'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {activeTicket.status}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeTicket.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-1">
                  <Building className="w-3.5 h-3.5 text-orange-500" />
                  <span>{activeTicket.propertyName}</span>
                  <span>•</span>
                  <span>Reported on {activeTicket.reportedDate}, {activeTicket.reportedTime || '10:30 AM'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Description
                </span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed bg-[#FFF9F5] p-3.5 rounded-2xl border border-orange-200/60">
                  {activeTicket.description}
                </p>
              </div>

              {/* Assigned Contractor Card */}
              {activeTicket.assignedContractorName && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Assigned Contractor
                  </span>
                  <div className="p-3.5 bg-white border border-orange-200/80 rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          activeTicket.assignedContractorAvatar ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={activeTicket.assignedContractorName}
                        className="w-10 h-10 rounded-xl object-cover border border-orange-200"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-900">
                          {activeTicket.assignedContractorName}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500">
                          {activeTicket.category} Specialist • Ram Bahadur
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${activeTicket.assignedContractorContact || '+9779851029384'}`}
                      className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white border border-orange-200 flex items-center justify-center transition-colors cursor-pointer"
                      title="Call Contractor"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Estimated Cost */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Estimated Cost
                </span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  NPR {(Number(activeTicket.estimatedCost) || 0).toLocaleString()}
                </div>
              </div>

              {/* Before & After Photos (Exact replica from screenshot) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Photos
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Before */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 mb-1 block">Before</span>
                    <div className="h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                      {activeTicket.beforePhotos[0] ? (
                        <img
                          src={activeTicket.beforePhotos[0]}
                          alt="Before photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                          No before photo
                        </div>
                      )}
                    </div>
                  </div>

                  {/* After */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 mb-1 block">After</span>
                    {activeTicket.afterPhotos[0] ? (
                      <div className="h-32 rounded-2xl overflow-hidden border border-emerald-300 bg-emerald-50">
                        <img
                          src={activeTicket.afterPhotos[0]}
                          alt="After photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          onAddAfterPhoto(
                            activeTicket.id,
                            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
                          )
                        }
                        className="h-32 w-full rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 hover:bg-orange-50 flex flex-col items-center justify-center gap-1 text-slate-600 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Camera className="w-5 h-5 text-[#FF5A36]" />
                        <span>Add after photo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Workflow Timeline */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">
                    Ticket Status Workflow
                  </h4>
                </div>

                <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-200">
                  {activeTicket.workflowSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          step.completed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {step.completed ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{step.label}</span>
                          <span className="text-[10px] font-bold text-slate-400">{step.timestamp}</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 mt-0.5">{step.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Action Button (Mark as In Progress / Mark as Completed) */}
              <div className="pt-2">
                {activeTicket.status === 'Reported' && (
                  <button
                    onClick={() => onUpdateTicketStatus(activeTicket.id, 'Assigned')}
                    className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all cursor-pointer"
                  >
                    Assign Contractor
                  </button>
                )}
                {activeTicket.status === 'Assigned' && (
                  <button
                    onClick={() => onUpdateTicketStatus(activeTicket.id, 'In Progress')}
                    className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all cursor-pointer"
                  >
                    Mark as In Progress
                  </button>
                )}
                {activeTicket.status === 'In Progress' && (
                  <button
                    onClick={() => onUpdateTicketStatus(activeTicket.id, 'Completed')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl shadow-xs transition-all cursor-pointer"
                  >
                    Mark as Completed & Settle
                  </button>
                )}
                {activeTicket.status === 'Completed' && (
                  <div className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 text-center text-xs font-black rounded-2xl">
                    ✓ Ticket Successfully Resolved & Logged
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center text-slate-400">
              Select a ticket to view details
            </div>
          )}
        </div>
      </div>

      {/* Add Maintenance Ticket Modal (Exact UI from screenshot) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-5 border border-orange-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add Maintenance Ticket</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property</label>
                <select
                  value={newPropId}
                  onChange={(e) => setNewPropId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AC not cooling properly"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TicketCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Painting">Painting</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assign Contractor (Optional)
                  </label>
                  <select
                    value={newVendorId}
                    onChange={(e) => setNewVendorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Cost (NPR)
                </label>
                <input
                  type="number"
                  value={newEstimatedCost}
                  onChange={(e) => setNewEstimatedCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
