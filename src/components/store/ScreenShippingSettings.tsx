import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Save,
  Check
} from "lucide-react";
import { StoreProfileModel, StoreTab } from "./types";

interface ShippingZone {
  id: string;
  name: string;
  rate: number;
  sla: string;
  active: boolean;
}

interface ScreenShippingSettingsProps {
  storeProfile: StoreProfileModel;
  onUpdateProfile: (updated: Partial<StoreProfileModel>) => void;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenShippingSettings: React.FC<ScreenShippingSettingsProps> = ({
  storeProfile,
  onUpdateProfile,
  onNavigate
}) => {
  const [zones, setZones] = useState<ShippingZone[]>([
    { id: "z1", name: "Inside Kathmandu Valley (Ring Road & Suburbs)", rate: 100, sla: "24 - 48 Hours", active: true },
    { id: "z2", name: "Pokhara, Chitwan, Butwal & Terai Hubs", rate: 150, sla: "2 - 3 Days", active: true },
    { id: "z3", name: "Hilly & Remote Mountain Regions (Nepal Post)", rate: 250, sla: "4 - 6 Days", active: true }
  ]);

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(storeProfile.freeShippingThreshold || 2000);
  const [enableCod, setEnableCod] = useState(true);
  const [enablePickup, setEnablePickup] = useState(storeProfile.enableLocalPickup || false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProfile({
      freeShippingThreshold,
      enableLocalPickup: enablePickup
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Shipping Zones & Logistics Settings</h3>
            <p className="text-xs text-slate-500">Configure delivery pricing, partner courier integrations, and SLA</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/25 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Delivery Zones Table */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Zones & Tariff Matrix</h4>

        <div className="space-y-2.5">
          {zones.map((z, idx) => (
            <div
              key={z.id}
              className="p-3.5 bg-orange-50/40 rounded-2xl border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">{z.name}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Estimated SLA: <strong className="text-slate-700">{z.sla}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-bold">NPR</span>
                  <input
                    type="number"
                    value={z.rate}
                    onChange={(e) => {
                      const copy = [...zones];
                      copy[idx].rate = Number(e.target.value);
                      setZones(copy);
                    }}
                    className="w-20 px-2 py-1 bg-white border border-orange-200 rounded-xl text-xs font-black text-slate-900 text-center"
                  />
                </div>

                <input
                  type="checkbox"
                  checked={z.active}
                  onChange={(e) => {
                    const copy = [...zones];
                    copy[idx].active = e.target.checked;
                    setZones(copy);
                  }}
                  className="w-4 h-4 accent-[#FF5A36] rounded cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Global Shipping Policies */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Free Shipping & Fulfillment Policies</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 block">Free Shipping Threshold</span>
            <p className="text-[11px] text-slate-500">Waive all delivery fees when total cart exceeds this amount</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-600">NPR</span>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-28 px-3 py-1.5 bg-white border border-orange-200 rounded-xl text-xs font-black text-slate-900"
              />
            </div>
          </div>

          <div className="p-3.5 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Cash on Delivery (COD)</span>
              <input
                type="checkbox"
                checked={enableCod}
                onChange={(e) => setEnableCod(e.target.checked)}
                className="w-4 h-4 accent-[#FF5A36] rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">Allow customers to pay via cash upon doorstep delivery</p>
          </div>
        </div>

        {/* Integrated Courier Partners */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-700 block mb-2">Integrated Courier Dispatchers</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: "Pathao Express", status: "Active Connected", badge: "API Live" },
              { name: "Nepal Can Move", status: "Active Connected", badge: "API Live" },
              { name: "Speedex Cargo", status: "Active Connected", badge: "Manual Dispatch" },
              { name: "Nepal Post", status: "Active Connected", badge: "Hills & Remote" }
            ].map((p) => (
              <div key={p.name} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                <div className="text-xs font-bold text-slate-900">{p.name}</div>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {p.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
