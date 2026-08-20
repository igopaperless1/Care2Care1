import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Camera,
  Upload,
  X,
  Car,
  Check
} from 'lucide-react';
import { DetailedVehicle, VehicleType } from './vehicleTypes';
import { VehicleScreenId } from './VehicleSidebar';

interface ScreenAddVehicleStep1Props {
  formData: Partial<DetailedVehicle>;
  onChange: (fields: Partial<DetailedVehicle>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ScreenAddVehicleStep1: React.FC<ScreenAddVehicleStep1Props> = ({
  formData,
  onChange,
  onNext,
  onBack
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const samplePhotos = [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80'
  ];

  const handleAddPhoto = () => {
    const nextPhoto = samplePhotos[formData.photos?.length || 0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80';
    const current = formData.photos || [];
    onChange({ photos: [...current, nextPhoto] });
  };

  const handleRemovePhoto = (index: number) => {
    const current = formData.photos || [];
    onChange({ photos: current.filter((_, i) => i !== index) });
  };

  const handleValidateAndNext = () => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) errs.name = 'Vehicle name is required';
    if (!formData.brand?.trim()) errs.brand = 'Brand is required';
    if (!formData.model?.trim()) errs.model = 'Model is required';
    if (!formData.licensePlate?.trim()) errs.licensePlate = 'License plate is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div id="screen-3-add-vehicle-step1" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Add New Vehicle</h2>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="mb-4">
          <h3 className="text-sm font-extrabold text-slate-900">General Information</h3>
          <p className="text-[11px] text-slate-400 font-medium">Step 1 of 2 - Basic vehicle specifications</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-3.5">
          {/* Row: Vehicle Name & Vehicle Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Vehicle Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="e.g. Honda City"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Vehicle Type <span className="text-orange-500">*</span>
              </label>
              <select
                value={formData.type || 'Car'}
                onChange={(e) => onChange({ type: e.target.value as VehicleType })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all cursor-pointer"
              >
                <option value="Car">Car</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Scooter">Scooter</option>
                <option value="Van">Van</option>
                <option value="Bus">Bus</option>
                <option value="Truck">Truck</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row: Brand & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Brand <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => onChange({ brand: e.target.value })}
                placeholder="e.g. Honda"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
              {errors.brand && <p className="text-[10px] text-red-500 mt-0.5">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Model <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={formData.model || ''}
                onChange={(e) => onChange({ model: e.target.value })}
                placeholder="e.g. City VX"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
              {errors.model && <p className="text-[10px] text-red-500 mt-0.5">{errors.model}</p>}
            </div>
          </div>

          {/* Row: Manufacturing Year & License Plate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Manufacturing Year
              </label>
              <input
                type="number"
                value={formData.year || 2021}
                onChange={(e) => onChange({ year: Number(e.target.value) })}
                placeholder="2021"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                License Plate No. <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={formData.licensePlate || ''}
                onChange={(e) => onChange({ licensePlate: e.target.value })}
                placeholder="BA 3 CHA 1234"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all uppercase"
              />
              {errors.licensePlate && (
                <p className="text-[10px] text-red-500 mt-0.5">{errors.licensePlate}</p>
              )}
            </div>
          </div>

          {/* Chassis / VIN */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Chassis / VIN No.
            </label>
            <input
              type="text"
              value={formData.chassisNumber || ''}
              onChange={(e) => onChange({ chassisNumber: e.target.value })}
              placeholder="e.g. MAK12345678901234"
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all uppercase"
            />
          </div>

          {/* Photos (Upload or Capture) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Photos <span className="font-normal text-slate-400">(Upload or Capture)</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(formData.photos || samplePhotos).slice(0, 3).map((photoUrl, idx) => (
                <div
                  key={idx}
                  className="w-16 h-14 rounded-xl border border-slate-200 overflow-hidden relative group shrink-0 bg-slate-50"
                >
                  <img
                    src={photoUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPhoto}
                className="w-14 h-14 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-50 text-orange-500 flex flex-col items-center justify-center gap-1 shrink-0 transition-colors"
                title="Add photo"
              >
                <Camera className="w-4 h-4" />
                <span className="text-[9px] font-bold">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button: Next */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-add-vehicle-next"
          onClick={handleValidateAndNext}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
};
