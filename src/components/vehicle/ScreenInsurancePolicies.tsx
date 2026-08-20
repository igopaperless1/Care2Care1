import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Shield,
  FileText,
  Download,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { InsurancePolicy } from './vehicleTypes';

interface ScreenInsurancePoliciesProps {
  policies: InsurancePolicy[];
  onAddPolicy: (policy: Partial<InsurancePolicy>) => void;
  onBack: () => void;
}

export const ScreenInsurancePolicies: React.FC<ScreenInsurancePoliciesProps> = ({
  policies,
  onAddPolicy,
  onBack
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPolicyType, setNewPolicyType] = useState<InsurancePolicy['policyType']>('Comprehensive (1st Party)');
  const [provider, setProvider] = useState('Himalayan Everest Insurance');
  const [policyNo, setPolicyNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('2026-05-30');
  const [premium, setPremium] = useState(18500);

  const activePolicy = policies[0] || {
    id: 'pol-1',
    vehicleId: 'v1',
    policyType: 'Comprehensive (1st Party)',
    provider: 'Himalayan Everest Insurance',
    policyNumber: 'HEI/12345/2024',
    startDate: '30 May 2024',
    expiryDate: '30 May 2025',
    premium: 18500,
    currency: 'NPR',
    status: 'Active',
    daysLeft: 25
  };

  const handleSavePolicy = () => {
    onAddPolicy({
      policyType: newPolicyType,
      provider,
      policyNumber: policyNo || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate,
      premium: Number(premium),
      currency: 'NPR',
      status: 'Active',
      daysLeft: 365
    });
    setShowAddModal(false);
  };

  return (
    <div id="screen-10-insurance" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between relative">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Insurance & Policies</h2>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Active Policy Highlight Card */}
        <div className="bg-gradient-to-b from-orange-50/70 to-orange-50/20 rounded-2xl p-4 border border-orange-200/80 mb-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                Active Policy
              </span>
              <h3 className="text-xs font-black text-slate-900 leading-tight">
                {activePolicy.policyType}
              </h3>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-700 mt-1">{activePolicy.provider}</p>
          <p className="text-[11px] font-medium text-slate-500">
            Policy No. {activePolicy.policyNumber}
          </p>

          {/* Grid Stats */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-orange-200/50">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold truncate">Start Date</p>
              <p className="text-xs font-extrabold text-slate-900 mt-0.5">30 May 2024</p>
            </div>
            <div className="border-x border-orange-200/50 px-2">
              <p className="text-[10px] text-slate-400 font-semibold truncate">Expiry Date</p>
              <p className="text-xs font-extrabold text-slate-900 mt-0.5">30 May 2025</p>
              <span className="text-[9px] font-black text-orange-600">25 days left</span>
            </div>
            <div className="pl-1">
              <p className="text-[10px] text-slate-400 font-semibold truncate">Premium</p>
              <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                NPR {activePolicy.premium?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* View / Download Policy Button */}
          <button
            onClick={() => alert('Viewing Policy HEI/12345/2024 Document PDF')}
            className="w-full mt-3.5 bg-white hover:bg-orange-50/50 border border-orange-200 text-orange-600 font-extrabold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View / Download Policy</span>
          </button>
        </div>

        {/* All Policies List */}
        <div>
          <h4 className="text-xs font-black text-slate-900 tracking-wider mb-2.5">
            All Policies
          </h4>
          <div className="space-y-2">
            {policies.map((pol) => {
              const isExpired = pol.status === 'Expired';
              const isTax = pol.policyType.includes('Tax');

              return (
                <div
                  key={pol.id}
                  className="bg-white rounded-2xl p-3 border border-slate-100 hover:border-orange-100 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isExpired
                          ? 'bg-red-50 text-red-500'
                          : isTax
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-orange-50 text-orange-500'
                      }`}
                    >
                      {isTax ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-extrabold text-slate-900 truncate">
                        {pol.policyType.replace(' (1st Party)', '').replace(' (Liability)', '')}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {pol.policyNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-bold text-slate-700">
                      {new Date(pol.expiryDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <span
                      className={`text-[10px] font-extrabold ${
                        isExpired
                          ? 'text-red-500'
                          : pol.daysLeft <= 30
                          ? 'text-orange-500'
                          : 'text-emerald-600'
                      }`}
                    >
                      {isExpired ? 'Expired' : `${pol.daysLeft} days`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Button: + Add New Policy */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-add-new-policy"
          onClick={() => setShowAddModal(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Policy</span>
        </button>
      </div>

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs rounded-3xl z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-xl border border-slate-100">
            <h4 className="text-sm font-black text-slate-900 mb-3">Add Policy / Document</h4>
            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-600">Policy Type</label>
                <select
                  value={newPolicyType}
                  onChange={(e) => setNewPolicyType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold mt-1"
                >
                  <option value="Comprehensive (1st Party)">Comprehensive (1st Party)</option>
                  <option value="3rd Party (Liability)">3rd Party (Liability)</option>
                  <option value="Tax Token">Blue Book / Tax Token</option>
                  <option value="Zero Dep">Zero Depreciation</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600">Insurance Provider</label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. Himalayan Everest Insurance"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600">Policy Number</label>
                <input
                  type="text"
                  value={policyNo}
                  onChange={(e) => setPolicyNo(e.target.value)}
                  placeholder="e.g. HEI/55123/2025"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold mt-1 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Premium (NPR)</label>
                  <input
                    type="number"
                    value={premium}
                    onChange={(e) => setPremium(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePolicy}
                className="flex-1 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
