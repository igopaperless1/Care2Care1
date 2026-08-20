import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TenantInfo, PropertyItem } from './propertyTypes';

interface TenantsTabProps {
  tenants: TenantInfo[];
  properties: PropertyItem[];
  onAddTenant: (tenant: TenantInfo) => void;
}

export const TenantsTab: React.FC<TenantsTabProps> = ({
  tenants,
  properties,
  onAddTenant
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New tenant form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [propId, setPropId] = useState(properties[0]?.id || 'prop-lakeview');
  const [rent, setRent] = useState(50000);
  const [deposit, setDeposit] = useState(100000);

  const filteredTenants = tenants.filter(
    (t) =>
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const prop = properties.find((p) => p.id === propId) || properties[0];

    const newTenant: TenantInfo = {
      id: `ten-${Date.now()}`,
      propertyId: prop.id,
      propertyName: prop.name,
      fullName: name,
      phone: phone || '+977 9851000000',
      email: email || 'tenant@example.com',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      occupation: occupation || 'Professional',
      emergencyContact: '+977 9800000000',
      moveInDate: '2025-01-01',
      leaseStart: '2025-01-01',
      leaseEnd: '2026-01-01',
      monthlyRent: Number(rent),
      securityDeposit: Number(deposit),
      rentStatus: 'Paid'
    };

    onAddTenant(newTenant);
    setShowAddModal(false);
    setName('');
    setPhone('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">Leases & Tenants</h2>
          <p className="text-xs font-bold text-slate-500">
            Active lease agreements, occupant details, and rent statuses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Tenant</span>
        </button>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTenants.map((tenant) => (
          <div
            key={tenant.id}
            className="p-5 bg-white border border-orange-100 rounded-3xl shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    tenant.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={tenant.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border border-orange-200"
                />
                <div>
                  <h3 className="text-sm font-black text-slate-900">{tenant.fullName}</h3>
                  <p className="text-[11px] font-bold text-slate-500">{tenant.occupation}</p>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Active Lease
              </span>
            </div>

            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl space-y-1.5 text-xs font-bold text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Leased Property</span>
                <span className="font-black text-slate-900">{tenant.propertyName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monthly Rent</span>
                <span className="font-black text-[#FF5A36]">
                  NPR {tenant.monthlyRent.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security Deposit</span>
                <span className="font-black text-slate-900">
                  NPR {tenant.securityDeposit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${tenant.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${tenant.email}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Expires: {tenant.leaseEnd}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl space-y-4 border border-orange-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add New Tenant & Lease</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTenant} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Property to Lease
                </label>
                <select
                  value={propId}
                  onChange={(e) => setPropId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Giri"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 98..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Doctor / Engineer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Rent (NPR)
                  </label>
                  <input
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Security Deposit (NPR)
                  </label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
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
                  Save Lease
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
