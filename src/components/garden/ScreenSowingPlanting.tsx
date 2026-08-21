import React, { useState } from "react";
import {
  Sprout,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  Droplets,
  Heart,
  Edit,
  Trash2
} from "lucide-react";
import { CropItem, FarmGardenItem } from "./types";

interface ScreenSowingPlantingProps {
  activeFarm: FarmGardenItem;
  crops: CropItem[];
  onOpenAddModal: (type: string) => void;
  onDeleteCrop: (cropId: string) => void;
}

export const ScreenSowingPlanting: React.FC<ScreenSowingPlantingProps> = ({
  activeFarm,
  crops,
  onOpenAddModal,
  onDeleteCrop
}) => {
  const [subTab, setSubTab] = useState<"Crops" | "Sowing Schedule" | "Planting Records">("Crops");

  const farmCrops = crops.filter((c) => c.farmId === activeFarm.id);

  return (
    <div className="space-y-4">
      {/* SUBTABS & ADD CROP HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["Crops", "Sowing Schedule", "Planting Records"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                subTab === tab
                  ? "bg-[#FF5A36] text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-orange-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpenAddModal("crop")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Crop</span>
        </button>
      </div>

      {/* CROP CARDS LIST (Matching Screenshot Card 4) */}
      <div className="space-y-3">
        {farmCrops.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-black text-slate-800">No active crops logged</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add your vegetable, herb, or fruit crop to start tracking its growth lifecycle.
            </p>
            <button
              onClick={() => onOpenAddModal("crop")}
              className="mt-4 px-4 py-2 bg-[#FF5A36] text-white text-xs font-black rounded-2xl cursor-pointer"
            >
              + Add Crop
            </button>
          </div>
        ) : (
          farmCrops.map((crop) => {
            const isCompleted = crop.status === "Completed";
            const isNursery = crop.status === "Nursery";

            return (
              <div
                key={crop.id}
                className="bg-white border border-slate-200/80 hover:border-orange-200 rounded-3xl p-4 sm:p-5 shadow-2xs transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* PHOTO & DETAILS */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-2xs border border-orange-100 shrink-0">
                      <img
                        src={crop.photoUrl}
                        alt={crop.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">
                          {crop.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-500">
                          ({crop.variety})
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-1 space-y-0.5">
                        <p>
                          <span className="font-bold text-slate-700">Sowing:</span> {crop.sowingDate}
                        </p>
                        {crop.transplantDate && (
                          <p>
                            <span className="font-bold text-slate-700">Transplant:</span> {crop.transplantDate}
                          </p>
                        )}
                        {crop.actualHarvestDate && (
                          <p>
                            <span className="font-bold text-emerald-700">Harvest:</span> {crop.actualHarvestDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT STATUS BADGE & ACTIONS */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`px-3 py-1 text-xs font-black rounded-xl border ${
                        isCompleted
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : isNursery
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {crop.status}
                    </span>

                    <button
                      onClick={() => onDeleteCrop(crop.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-xl transition-colors cursor-pointer"
                      title="Delete crop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* BOTTOM ACTION BUTTON */}
      <button
        onClick={() => onOpenAddModal("crop")}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span>+ Add New Crop</span>
      </button>
    </div>
  );
};
