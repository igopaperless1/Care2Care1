import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Shield,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Settings,
  RefreshCw
} from 'lucide-react';
import { PropertyItem } from './propertyTypes';

interface RemindersAndSettingsTabProps {
  properties: PropertyItem[];
  currency: string;
  onUpdateCurrency: (curr: string) => void;
  onResetDemoData: () => void;
}

export const RemindersAndSettingsTab: React.FC<RemindersAndSettingsTabProps> = ({
  properties,
  currency,
  onUpdateCurrency,
  onResetDemoData
}) => {
  const [taxAlerts, setTaxAlerts] = useState(true);
  const [insuranceAlerts, setInsuranceAlerts] = useState(true);
  const [rentReminders, setRentReminders] = useState(true);

  return (
    <div className="space-y-4">
      {/* Reminders & Alerts Card */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Tax, Insurance & Legal Reminders</h2>
          <p className="text-xs font-bold text-slate-500">
            Automated alerts for property tax deadlines, insurance renewals, and lease expirations
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Tax Reminder */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center font-black">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  Annual Municipal Property Tax (Malpot)
                </h4>
                <p className="text-[10px] font-bold text-slate-500">
                  Pokhara Lakeview Ward 6 • Due on 30 Aug 2025 (NPR 22,000)
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Paid
            </span>
          </div>

          {/* Insurance Policy Expiry */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  Siddhartha Premier Property Comprehensive Insurance
                </h4>
                <p className="text-[10px] font-bold text-slate-500">
                  Policy #POL-PKR-9921 • Expiry on 10 Apr 2026
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Active
            </span>
          </div>

          {/* Lease Expiry Reminder */}
          <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  Tenant Lease Expiration Notice
                </h4>
                <p className="text-[10px] font-bold text-slate-500">
                  Roshan Singh • Lakeview Apartment • Auto-remind 30 days prior
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              31 Dec 2025
            </span>
          </div>
        </div>
      </div>

      {/* Preferences & Configuration */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">Property Service Preferences</h3>
          <p className="text-xs font-bold text-slate-500">Currency, measurement units and data</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Display Currency
            </label>
            <select
              value={currency}
              onChange={(e) => onUpdateCurrency(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              <option value="NPR">Nepalese Rupee (NPR / रु)</option>
              <option value="USD">US Dollar (USD / $)</option>
              <option value="INR">Indian Rupee (INR / ₹)</option>
            </select>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Standard Area Unit
            </label>
            <select className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none">
              <option value="sq ft">Square Feet (sq ft)</option>
              <option value="Ropani">Ropani / Aana (Hilly Region)</option>
              <option value="Bigha">Bigha / Kattha (Terai Region)</option>
              <option value="sq m">Square Meters (sq m)</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 block">Reset Demo Real Estate Data</span>
            <span className="text-[10px] text-slate-400">Restore initial Pokhara and Kathmandu properties</span>
          </div>
          <button
            onClick={onResetDemoData}
            className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] text-xs font-black border border-orange-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
