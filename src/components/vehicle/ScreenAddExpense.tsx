import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Camera,
  Upload,
  Calendar,
  Check,
  Sparkles,
  Loader2
} from 'lucide-react';
import { VehicleExpense } from './vehicleTypes';

interface ScreenAddExpenseProps {
  vehicleId: string;
  onSaveExpense: (expense: Partial<VehicleExpense>) => void;
  onBack: () => void;
}

export const ScreenAddExpense: React.FC<ScreenAddExpenseProps> = ({
  vehicleId,
  onSaveExpense,
  onBack
}) => {
  const [entryMode, setEntryMode] = useState<'manual' | 'ai_scan'>('manual');
  const [expenseType, setExpenseType] = useState<VehicleExpense['type']>('Fuel');
  const [amount, setAmount] = useState(2900);
  const [date, setDate] = useState('2025-05-13');
  const [odometer, setOdometer] = useState(28560);
  const [description, setDescription] = useState('Petrol fill - NOC Petrol Pump');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleSimulateAIScan = () => {
    setIsScanning(true);
    setScanSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setExpenseType('Fuel');
      setAmount(3250);
      setDate('2025-05-14');
      setOdometer(28800);
      setDescription('Auto-scanned: Sajha Yatayat Petrol Station (22.4 Liters)');
    }, 1200);
  };

  const handleSave = () => {
    onSaveExpense({
      vehicleId,
      type: expenseType,
      amount: Number(amount),
      currency: 'NPR',
      date,
      odometer: Number(odometer),
      description,
      aiScanned: entryMode === 'ai_scan' || scanSuccess
    });
    onBack();
  };

  return (
    <div id="screen-9-add-expense" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Add Expense</h2>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Manual Entry | AI Scan Receipt */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
          <button
            onClick={() => setEntryMode('manual')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              entryMode === 'manual'
                ? 'bg-white text-orange-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setEntryMode('ai_scan')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              entryMode === 'ai_scan'
                ? 'bg-white text-orange-500 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>AI Scan Receipt</span>
          </button>
        </div>

        {/* AI Scan Receipt Box */}
        <div
          onClick={handleSimulateAIScan}
          className="border-2 border-dashed border-orange-200 bg-orange-50/40 hover:bg-orange-50/70 rounded-2xl p-5 mb-4 text-center cursor-pointer transition-all group"
        >
          {isScanning ? (
            <div className="flex flex-col items-center justify-center py-2">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-1.5" />
              <p className="text-xs font-bold text-slate-800">Analyzing receipt with AI...</p>
              <p className="text-[10px] text-slate-400">Extracting vendor, amount & date</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6 text-orange-500" />
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">
                {scanSuccess ? '✓ Receipt Details Extracted' : 'Tap to Scan Receipt'}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                We&apos;ll extract details automatically
              </p>
            </>
          )}
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          {/* Expense Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Expense Type <span className="text-orange-500">*</span>
            </label>
            <select
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all cursor-pointer"
            >
              <option value="Fuel">Fuel</option>
              <option value="Wash">Wash / Detailing</option>
              <option value="Parking">Parking</option>
              <option value="Toll">Toll</option>
              <option value="Maintenance">Maintenance & Repairs</option>
              <option value="Insurance">Insurance</option>
              <option value="Tax">Road Tax / Renewal</option>
              <option value="Fine">Challan / Traffic Fine</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Amount (NPR) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Amount (NPR) <span className="text-orange-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="2,900"
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
            />
          </div>

          {/* Row: Date & Odometer Reading */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Date <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Odometer Reading <span className="text-orange-500">*</span>
              </label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                placeholder="28,560"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
            </div>
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Description <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Petrol fill - NOC Petrol Pump"
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Bottom Button: Save Expense */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-save-expense"
          onClick={handleSave}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Save Expense</span>
        </button>
      </div>
    </div>
  );
};
