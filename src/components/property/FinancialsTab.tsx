import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Download,
  Plus,
  CheckCircle2,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  FileText
} from 'lucide-react';
import { RentPaymentEntry, PropertyItem } from './propertyTypes';

interface FinancialsTabProps {
  properties: PropertyItem[];
  payments: RentPaymentEntry[];
  onLogPayment: (payment: RentPaymentEntry) => void;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({
  properties,
  payments,
  onLogPayment
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');
  const [showLogModal, setShowLogModal] = useState(false);

  // Form state
  const [newPropId, setNewPropId] = useState(properties[0]?.id || 'prop-lakeview');
  const [newTenantName, setNewTenantName] = useState('Roshan Singh');
  const [newAmount, setNewAmount] = useState(50000);
  const [newMethod, setNewMethod] = useState<'eSewa' | 'Khalti' | 'Bank Transfer' | 'Cash' | 'Cheque'>('eSewa');

  const monthlyIncome = 50000;
  const monthlyExpenses = 12450;
  const netProfit = monthlyIncome - monthlyExpenses;
  const expenseRatio = Math.round((monthlyExpenses / monthlyIncome) * 100);

  // 6 months trend data (mirroring mockup)
  const trendMonths = [
    { month: 'Nov', income: 45000, expense: 18000 },
    { month: 'Dec', income: 52000, expense: 25000 },
    { month: 'Jan', income: 50000, expense: 19000 },
    { month: 'Feb', income: 56000, expense: 22000 },
    { month: 'Mar', income: 48000, expense: 14000 },
    { month: 'Apr', income: 68000, expense: 21000 }
  ];

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === newPropId) || properties[0];

    const entry: RentPaymentEntry = {
      id: `rent-${Date.now()}`,
      propertyId: prop.id,
      propertyName: prop.name,
      tenantName: newTenantName,
      month: 'May',
      year: 2025,
      amount: Number(newAmount),
      dueDate: '2025-05-05',
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: newMethod,
      status: 'Paid'
    };

    onLogPayment(entry);
    setShowLogModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header with Month Selector */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">Financial Overview</h2>
          <p className="text-xs font-bold text-slate-500">Real estate cash flow, rental yield and expenses</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-1.5 bg-orange-50/70 border border-orange-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="This Month">This Month</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="This Year">This Year</option>
          </select>

          <button
            onClick={() => setShowLogModal(true)}
            className="px-3.5 py-1.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Rent</span>
          </button>
        </div>
      </div>

      {/* Income vs Expense & Donut Widget (Exact mockup matching) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Donut & Net Profit Card (5 cols) */}
        <div className="md:col-span-5 bg-white border border-orange-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Income vs Expense
            </span>
            <div className="flex items-center justify-between mt-3">
              {/* Stats column */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Income</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">
                    NPR {monthlyIncome.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5A36]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]"></span>
                    <span>Expenses</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">
                    NPR {monthlyExpenses.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Visual Circular Donut SVG */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  {/* Background Track */}
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Income segment (Emerald) */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="75, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Expense segment (Orange) */}
                  <path
                    className="text-[#FF5A36]"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-75"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xs font-black text-slate-900">75%</span>
                  <span className="text-[9px] font-bold text-slate-400 block">Profit</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-orange-50/60 border border-orange-200/80 rounded-2xl">
            <span className="text-[10px] font-black uppercase text-slate-400 block">
              Net Profit
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              NPR {netProfit.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% higher than last quarter</span>
            </div>
          </div>
        </div>

        {/* Right Column: Last 6 Months Trend (7 cols) - Matching Mockup SVG */}
        <div className="md:col-span-7 bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Last 6 Months Trend
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="w-2.5 h-1 bg-emerald-500 rounded-full"></span> Income
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#FF5A36]">
                  <span className="w-2.5 h-1 bg-[#FF5A36] rounded-full"></span> Expenses
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400">In Thousands (NPR)</span>
          </div>

          {/* Interactive Trend SVG Chart */}
          <div className="relative h-44 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140">
              {/* Grid Lines */}
              <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="10" x2="500" y2="10" stroke="#f1f5f9" strokeWidth="1" />

              {/* Income Line (Emerald) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points="40,75 120,50 200,60 280,40 360,65 440,20"
              />
              {/* Income Dots */}
              {[[40, 75], [120, 50], [200, 60], [280, 40], [360, 65], [440, 20]].map(
                ([x, y], idx) => (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#10b981"
                    className="hover:r-6 cursor-pointer transition-all"
                  />
                )
              )}

              {/* Expense Line (Orange) */}
              <polyline
                fill="none"
                stroke="#FF5A36"
                strokeWidth="2.5"
                points="40,105 120,80 200,95 280,85 360,110 440,90"
              />
              {/* Expense Dots */}
              {[[40, 105], [120, 80], [200, 95], [280, 85], [360, 110], [440, 90]].map(
                ([x, y], idx) => (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#FF5A36"
                    className="hover:r-6 cursor-pointer transition-all"
                  />
                )
              )}

              {/* X Axis Labels */}
              {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((label, idx) => (
                <text
                  key={idx}
                  x={40 + idx * 80}
                  y="135"
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-400"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Rent Payment Ledger */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Rental Collection Ledger</h3>
          <span className="text-xs font-bold text-slate-400">
            {payments.length} Payments Recorded
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {payments.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0">
                  {p.month.slice(0, 3)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{p.propertyName}</h4>
                  <p className="text-[10px] font-bold text-slate-500">
                    Tenant: {p.tenantName} • Paid via {p.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-slate-900">
                  NPR {p.amount.toLocaleString()}
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-600">
                  ✓ {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Payment Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl space-y-4 border border-orange-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Log Rental Payment</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property</label>
                <select
                  value={newPropId}
                  onChange={(e) => setNewPropId(e.target.value)}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (NPR)
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="eSewa">eSewa</option>
                    <option value="Khalti">Khalti</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
