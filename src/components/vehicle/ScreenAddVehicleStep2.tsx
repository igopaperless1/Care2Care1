import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Calendar,
  DollarSign,
  Gauge,
  FileText,
  Check
} from 'lucide-react';
import { DetailedVehicle, OwnershipType, FuelType } from './vehicleTypes';

interface ScreenAddVehicleStep2Props {
  formData: Partial<DetailedVehicle>;
  onChange: (fields: Partial<DetailedVehicle>) => void;
  onSave: () => void;
  onBack: () => void;
}

export const ScreenAddVehicleStep2: React.FC<ScreenAddVehicleStep2Props> = ({
  formData,
  onChange,
  onSave,
  onBack
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleValidateAndSave = () => {
    const errs: Record<string, string> = {};
    if (!formData.purchaseDate) errs.purchaseDate = 'Purchase date is required';
    if (!formData.purchasePrice) errs.purchasePrice = 'Purchase price is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSave();
  };

  return (
    <div id="screen-4-add-vehicle-step2" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Add Vehicle - Details</h2>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="mb-4">
          <h3 className="text-sm font-extrabold text-slate-900">Ownership & Usage</h3>
          <p className="text-[11px] text-slate-400 font-medium">Step 2 of 2 - Financial & usage profile</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          {/* Ownership Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Ownership Type <span className="text-orange-500">*</span>
            </label>
            <select
              value={formData.ownershipType || 'Personal'}
              onChange={(e) => onChange({ ownershipType: e.target.value as OwnershipType })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all cursor-pointer"
            >
              <option value="Personal">Personal</option>
              <option value="Commercial">Commercial</option>
              <option value="Company">Company</option>
              <option value="Leased">Leased</option>
            </select>
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Purchase Date <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.purchaseDate || '2021-03-15'}
                onChange={(e) => onChange({ purchaseDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.purchaseDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.purchaseDate}</p>}
          </div>

          {/* Row: Purchase Price & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Purchase Price <span className="text-orange-500">*</span>
              </label>
              <input
                type="number"
                value={formData.purchasePrice || 2850000}
                onChange={(e) => onChange({ purchasePrice: Number(e.target.value) })}
                placeholder="2,850,000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
              {errors.purchasePrice && <p className="text-[10px] text-red-500 mt-0.5">{errors.purchasePrice}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Currency <span className="text-orange-500">*</span>
              </label>
              <select
                value={formData.currency || 'NPR'}
                onChange={(e) => onChange({ currency: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all cursor-pointer"
              >
                <option value="NPR">NPR</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Current Estimated Value */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Current Estimated Value
            </label>
            <input
              type="number"
              value={formData.currentEstimatedValue || 2350000}
              onChange={(e) => onChange({ currentEstimatedValue: Number(e.target.value) })}
              placeholder="2,350,000"
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
            />
          </div>

          {/* Row: Distance Unit, Current Odometer, Fuel Type */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                Distance Unit *
              </label>
              <select
                value={formData.distanceUnit || 'km'}
                onChange={(e) => onChange({ distanceUnit: e.target.value as 'km' | 'miles' })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-2 py-2 text-xs font-semibold text-slate-900 outline-none transition-all cursor-pointer"
              >
                <option value="km">km</option>
                <option value="miles">miles</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-slate-600 mb-1 truncate">
                Odometer *
              </label>
              <input
                type="number"
                value={formData.odometer || 28560}
                onChange={(e) => onChange({ odometer: Number(e.target.value) })}
                placeholder="28,560"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-2 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                Fuel Type *
              </label>
              <select
                value={formData.fuelType || 'Petrol'}
                onChange={(e) => onChange({ fuelType: e.target.value as FuelType })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-2 py-2 text-xs font-semibold text-slate-900 outline-none transition-all cursor-pointer"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">EV</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Additional Information <span className="font-normal text-slate-400">(Notes Optional)</span>
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="e.g. My daily office commute car."
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Button: Save Vehicle */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-save-vehicle"
          onClick={handleValidateAndSave}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Save Vehicle</span>
        </button>
      </div>
    </div>
  );
};
