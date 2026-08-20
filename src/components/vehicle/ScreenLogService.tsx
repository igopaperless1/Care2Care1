import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Calendar,
  Check,
  Wrench,
  Sparkles
} from 'lucide-react';
import { ServiceRecord } from './vehicleTypes';

interface ScreenLogServiceProps {
  vehicleId: string;
  onSaveService: (record: Partial<ServiceRecord>) => void;
  onBack: () => void;
}

export const ScreenLogService: React.FC<ScreenLogServiceProps> = ({
  vehicleId,
  onSaveService,
  onBack
}) => {
  const [serviceDate, setServiceDate] = useState('2025-05-14');
  const [odometer, setOdometer] = useState(30250);
  const [provider, setProvider] = useState('Dream Auto Care');
  const [cost, setCost] = useState(4800);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Oil Change',
    'Tire Rotation',
    'Brake Pads',
    'Engine Check'
  ]);
  const [notes, setNotes] = useState(
    'Changed engine oil, oil filter and checked all fluid levels.'
  );

  const availableTags = [
    'Oil Change',
    'Tire Rotation',
    'Brake Pads',
    'Engine Check',
    'Battery',
    'Wheel Alignment',
    'AC Filter',
    'Coolant Flush',
    'Transmission Fluid',
    'Spark Plugs'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    onSaveService({
      vehicleId,
      date: serviceDate,
      odometer: Number(odometer),
      provider,
      cost: Number(cost),
      currency: 'NPR',
      serviceTags: selectedTags,
      notes
    });
    onBack();
  };

  return (
    <div id="screen-7-log-service" className="max-w-md mx-auto bg-white min-h-[640px] rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 -ml-1 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900">Log New Service</h2>
          <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3.5">
          {/* Service Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Service Date <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Odometer Reading */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Odometer Reading <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                placeholder="30,250"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
              />
              <span className="text-xs font-bold text-slate-400 absolute right-3 top-1/2 -translate-y-1/2">
                km
              </span>
            </div>
          </div>

          {/* Service Provider */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Service Provider <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Dream Auto Care"
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
            />
          </div>

          {/* Cost (NPR) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Cost (NPR) <span className="text-orange-500">*</span>
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              placeholder="4,800"
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
            />
          </div>

          {/* Service Details (Multi-select Checkboxes) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-600">
                Service Details <span className="font-normal text-slate-400">(Select all that apply)</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableTags.slice(0, 6).map((tag) => {
                const isChecked = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-xs font-bold transition-all text-left ${
                      isChecked
                        ? 'bg-orange-50/80 border-orange-300 text-orange-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Things Done Today */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Specific things done today
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Changed engine oil, oil filter and checked all fluid levels."
              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Button: Save Service */}
      <div className="pt-4 mt-auto">
        <button
          id="btn-save-service"
          onClick={handleSave}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm shadow-orange-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Save Service</span>
        </button>
      </div>
    </div>
  );
};
