import React, { useState } from "react";
import {
  X,
  Plus,
  Sprout,
  Droplets,
  FlaskConical,
  Bug,
  Award,
  Package,
  Clock,
  Trees,
  Check
} from "lucide-react";
import {
  FarmGardenItem,
  FarmTask,
  CropItem,
  IrrigationZone,
  FertilizerRecord,
  PestObservation,
  HarvestRecord,
  InventoryItem,
  TimeActivityLog
} from "./types";

interface FarmModalsProps {
  modalType: string | null;
  activeFarm: FarmGardenItem;
  onClose: () => void;
  onAddFarm: (farm: FarmGardenItem) => void;
  onAddTask: (task: FarmTask) => void;
  onAddCrop: (crop: CropItem) => void;
  onAddIrrigation: (zone: IrrigationZone) => void;
  onAddFertilizer: (fert: FertilizerRecord) => void;
  onAddPest: (pest: PestObservation) => void;
  onAddHarvest: (harvest: HarvestRecord) => void;
  onAddInventory: (inv: InventoryItem) => void;
  onAddTimeLog: (timeLog: TimeActivityLog) => void;
}

export const FarmModals: React.FC<FarmModalsProps> = ({
  modalType,
  activeFarm,
  onClose,
  onAddFarm,
  onAddTask,
  onAddCrop,
  onAddIrrigation,
  onAddFertilizer,
  onAddPest,
  onAddHarvest,
  onAddInventory,
  onAddTimeLog
}) => {
  if (!modalType) return null;

  // 1. ADD FARM / PLOT FORM
  const [farmName, setFarmName] = useState("");
  const [farmType, setFarmType] = useState<"Farm" | "Garden" | "Greenhouse" | "Orchard">("Farm");
  const [farmCategory, setFarmCategory] = useState("Vegetable Farm • Pokhara, Nepal");
  const [farmLocation, setFarmLocation] = useState("Pokhara, Nepal");
  const [farmArea, setFarmArea] = useState("10");
  const [farmAreaUnit, setFarmAreaUnit] = useState<"acres" | "sq ft" | "hectares" | "ropani" | "bigha">("acres");
  const [farmSoil, setFarmSoil] = useState("Rich Loamy Alluvial");
  const [farmPhoto, setFarmPhoto] = useState("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80");

  // 2. ADD TASK FORM
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState<any>("irrigation");
  const [taskField, setTaskField] = useState("Vegetable Field - Block A");
  const [taskTime, setTaskTime] = useState("08:00 AM");
  const [taskBadge, setTaskBadge] = useState<any>("Today");
  const [taskNotes, setTaskNotes] = useState("");

  // 3. ADD CROP FORM
  const [cropName, setCropName] = useState("");
  const [cropVariety, setCropVariety] = useState("");
  const [cropType, setCropType] = useState<any>("Vegetable");
  const [cropSowing, setCropSowing] = useState("15 May 2025");
  const [cropTransplant, setCropTransplant] = useState("01 Jun 2025");
  const [cropStatus, setCropStatus] = useState<any>("Growing");
  const [cropQty, setCropQty] = useState("200");
  const [cropPhoto, setCropPhoto] = useState("https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&auto=format&fit=crop&q=80");

  // 4. ADD IRRIGATION FORM
  const [zoneName, setZoneName] = useState("Zone E - Fruit Trees");
  const [zoneCrop, setZoneCrop] = useState("Avocado & Citrus");
  const [zoneMethod, setZoneMethod] = useState<any>("Drip Irrigation");
  const [zoneTime, setZoneTime] = useState("Tomorrow, 06:30 AM");
  const [zoneDuration, setZoneDuration] = useState("30");
  const [zoneVolume, setZoneVolume] = useState("350");

  // 5. ADD FERTILIZER FORM
  const [fertCropTarget, setFertCropTarget] = useState("Tomato - Greenhouse 1");
  const [fertName, setFertName] = useState("Organic Compost");
  const [fertType, setFertType] = useState<any>("Organic");
  const [fertDate, setFertDate] = useState("18 May 2025");
  const [fertDueBadge, setFertDueBadge] = useState<any>("Tomorrow");
  const [fertQty, setFertQty] = useState("50");
  const [fertUnit, setFertUnit] = useState<any>("kg");
  const [fertCost, setFertCost] = useState("1500");
  const [fertMethod, setFertMethod] = useState<any>("Soil Dressing");

  // 6. ADD PEST FORM
  const [pestCropTarget, setPestCropTarget] = useState("Tomato - Greenhouse 1");
  const [pestName, setPestName] = useState("Aphids");
  const [pestField, setPestField] = useState("Greenhouse Rows 1-3");
  const [pestRisk, setPestRisk] = useState<any>("Low");
  const [pestTreatment, setPestTreatment] = useState("Neem Oil 5ml/L spray");

  // 7. ADD HARVEST FORM
  const [harvCrop, setHarvCrop] = useState("Tomato");
  const [harvDate, setHarvDate] = useState("15 May 2025");
  const [harvQty, setHarvQty] = useState("30");
  const [harvQuality, setHarvQuality] = useState<any>("Good");
  const [harvField, setHarvField] = useState("Greenhouse 1");
  const [harvBuyer, setHarvBuyer] = useState("Local Organic Supermarket");
  const [harvPhoto, setHarvPhoto] = useState("https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&auto=format&fit=crop&q=80");

  // 8. ADD INVENTORY FORM
  const [invName, setInvName] = useState("");
  const [invCategory, setInvCategory] = useState<any>("Seeds");
  const [invQty, setInvQty] = useState("10");
  const [invUnit, setInvUnit] = useState<any>("packets");
  const [invMin, setInvMin] = useState("3");
  const [invLoc, setInvLoc] = useState("Dry Warehouse Shed A");
  const [invSupplier, setInvSupplier] = useState("Agri Supply Nepal");

  // 9. TIME LOG FORM
  const [timeActName, setTimeActName] = useState("Field Weeding & Mulching");
  const [timeCategory, setTimeCategory] = useState<any>("weeding");
  const [timeStart, setTimeStart] = useState("08:00 AM");
  const [timeEnd, setTimeEnd] = useState("09:30 AM");
  const [timeMins, setTimeMins] = useState("90");

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 my-8">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900 capitalize">
              {modalType === "farm" && "Add New Farm or Plot"}
              {modalType === "task" && "Add New Field Task"}
              {modalType === "crop" && "Add New Crop to Farm"}
              {modalType === "irrigation" && "Add Irrigation Zone Task"}
              {modalType === "fertilizer" && "Add Fertilizer Application"}
              {modalType === "pest" && "Log Pest or Disease Observation"}
              {modalType === "harvest" && "Add Harvest Record"}
              {modalType === "inventory" && "Add Inventory Stock Item"}
              {modalType === "time" && "Log Manual Field Work Time"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. FARM FORM */}
        {modalType === "farm" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Farm Name</label>
              <input
                type="text"
                placeholder="e.g. Sunrise Organic Farm"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                <select
                  value={farmType}
                  onChange={(e) => setFarmType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Farm">Farm (Commercial/Crops)</option>
                  <option value="Garden">Kitchen / Backyard Garden</option>
                  <option value="Greenhouse">Polyhouse / Greenhouse</option>
                  <option value="Orchard">Fruit Orchard</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Pokhara, Nepal"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Total Area</label>
                <input
                  type="number"
                  value={farmArea}
                  onChange={(e) => setFarmArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Unit</label>
                <select
                  value={farmAreaUnit}
                  onChange={(e) => setFarmAreaUnit(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="acres">Acres</option>
                  <option value="ropani">Ropani</option>
                  <option value="bigha">Bigha</option>
                  <option value="hectares">Hectares</option>
                  <option value="sq ft">sq ft</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                if (!farmName) return;
                onAddFarm({
                  id: "farm-" + Date.now(),
                  name: farmName,
                  type: farmType,
                  categoryDesc: `${farmType} • ${farmLocation}`,
                  location: farmLocation,
                  area: Number(farmArea) || 1,
                  areaUnit: farmAreaUnit,
                  status: "Active",
                  healthScore: 90,
                  healthLabel: "Excellent",
                  activeCropsCount: 1,
                  totalTasksCount: 5,
                  completedTasksCount: 2,
                  inProgressTasksCount: 1,
                  pendingTasksCount: 2,
                  nextTaskText: "Tomorrow: Irrigation",
                  soilType: farmSoil,
                  phLevel: 6.5,
                  waterSource: "Drip System",
                  sunlight: "Full Sun",
                  photoUrl: farmPhoto,
                  createdAt: new Date().toISOString().split("T")[0]
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Save Farm Plot
            </button>
          </div>
        )}

        {/* 2. TASK FORM */}
        {modalType === "task" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Irrigation - Drip System"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="irrigation">Irrigation / Watering</option>
                  <option value="fertilizer">Fertilizer Application</option>
                  <option value="weeding">Weeding</option>
                  <option value="pest">Pest Inspection</option>
                  <option value="support">Plant Support & Tying</option>
                  <option value="sowing">Sowing / Planting</option>
                  <option value="harvest">Harvesting</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Field Location</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetable Field - Block A"
                  value={taskField}
                  onChange={(e) => setTaskField(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Scheduled Time</label>
                <input
                  type="text"
                  placeholder="08:00 AM"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Due</label>
                <select
                  value={taskBadge}
                  onChange={(e) => setTaskBadge(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="In 2 Days">In 2 Days</option>
                  <option value="In 3 Days">In 3 Days</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                if (!taskTitle) return;
                onAddTask({
                  id: "t-" + Date.now(),
                  farmId: activeFarm.id,
                  title: taskTitle,
                  category: taskCategory,
                  fieldLocation: taskField,
                  scheduledTime: taskTime,
                  date: new Date().toISOString().split("T")[0],
                  dueBadge: taskBadge,
                  status: "pending",
                  notes: taskNotes
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Add Task
            </button>
          </div>
        )}

        {/* 3. CROP FORM */}
        {modalType === "crop" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Crop Name</label>
              <input
                type="text"
                placeholder="e.g. Tomato, Cabbage, Strawberry"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Variety</label>
                <input
                  type="text"
                  placeholder="e.g. F1 Hybrid Heirloom"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Vegetable">Vegetable</option>
                  <option value="Leafy Greens">Leafy Greens</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Herb">Herb</option>
                  <option value="Root">Root</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sowing Date</label>
                <input
                  type="text"
                  value={cropSowing}
                  onChange={(e) => setCropSowing(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={cropStatus}
                  onChange={(e) => setCropStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Growing">Growing</option>
                  <option value="Nursery">Nursery</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Harvesting">Harvesting</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                if (!cropName) return;
                onAddCrop({
                  id: "crop-" + Date.now(),
                  farmId: activeFarm.id,
                  name: cropName,
                  variety: cropVariety || "Special Selection",
                  type: cropType,
                  sowingDate: cropSowing,
                  transplantDate: cropTransplant,
                  status: cropStatus,
                  healthStatus: "Excellent",
                  quantity: Number(cropQty) || 100,
                  unit: "plants",
                  photoUrl: cropPhoto
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Add Crop
            </button>
          </div>
        )}

        {/* 4. IRRIGATION FORM */}
        {modalType === "irrigation" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Zone Name</label>
              <input
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Method</label>
                <select
                  value={zoneMethod}
                  onChange={(e) => setZoneMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Drip Irrigation">Drip Irrigation</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Manual Hose">Manual Hose</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Schedule</label>
                <input
                  type="text"
                  value={zoneTime}
                  onChange={(e) => setZoneTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>
            <button
              onClick={() => {
                onAddIrrigation({
                  id: "zone-" + Date.now(),
                  farmId: activeFarm.id,
                  zoneName,
                  cropGroup: zoneCrop,
                  method: zoneMethod,
                  scheduledTime: zoneTime,
                  durationMinutes: Number(zoneDuration) || 30,
                  volumeLiters: Number(zoneVolume) || 300,
                  status: "Scheduled"
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Add Irrigation Task
            </button>
          </div>
        )}

        {/* 5. FERTILIZER FORM */}
        {modalType === "fertilizer" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fertilizer Name</label>
              <input
                type="text"
                placeholder="e.g. Vermicompost, NPK 19:19:19"
                value={fertName}
                onChange={(e) => setFertName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Crop / Field</label>
                <input
                  type="text"
                  value={fertCropTarget}
                  onChange={(e) => setFertCropTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                <select
                  value={fertType}
                  onChange={(e) => setFertType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Organic">Organic</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Bio-fertilizer">Bio-fertilizer</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  value={fertQty}
                  onChange={(e) => setFertQty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cost (NPR)</label>
                <input
                  type="number"
                  value={fertCost}
                  onChange={(e) => setFertCost(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>
            <button
              onClick={() => {
                onAddFertilizer({
                  id: "fert-" + Date.now(),
                  farmId: activeFarm.id,
                  cropTarget: fertCropTarget,
                  fertilizerName: fertName,
                  type: fertType,
                  scheduledDate: fertDate,
                  dueBadge: fertDueBadge,
                  status: "Upcoming",
                  quantity: Number(fertQty) || 10,
                  unit: fertUnit,
                  costNpr: Number(fertCost) || 1000,
                  applicationMethod: fertMethod
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Save Application Plan
            </button>
          </div>
        )}

        {/* 6. PEST FORM */}
        {modalType === "pest" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pest / Disease Name</label>
              <input
                type="text"
                placeholder="e.g. Aphids, Whiteflies, Leaf Spot"
                value={pestName}
                onChange={(e) => setPestName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Crop Target</label>
                <input
                  type="text"
                  value={pestCropTarget}
                  onChange={(e) => setPestCropTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Risk Severity</label>
                <select
                  value={pestRisk}
                  onChange={(e) => setPestRisk(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Treatment Plan</label>
              <input
                type="text"
                placeholder="e.g. Neem Oil spray 5ml/L"
                value={pestTreatment}
                onChange={(e) => setPestTreatment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <button
              onClick={() => {
                onAddPest({
                  id: "pest-" + Date.now(),
                  farmId: activeFarm.id,
                  cropTarget: pestCropTarget,
                  pestName,
                  pestCategory: "Insect",
                  fieldLocation: pestField,
                  date: "Today",
                  riskLevel: pestRisk,
                  status: "Active",
                  treatment: pestTreatment,
                  treatmentStatus: "Applied"
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Log Observation
            </button>
          </div>
        )}

        {/* 7. HARVEST FORM */}
        {modalType === "harvest" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Harvested Crop</label>
              <input
                type="text"
                placeholder="e.g. Lettuce, Spinach, Cabbage"
                value={harvCrop}
                onChange={(e) => setHarvCrop(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  value={harvQty}
                  onChange={(e) => setHarvQty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quality Grade</label>
                <select
                  value={harvQuality}
                  onChange={(e) => setHarvQuality(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                onAddHarvest({
                  id: "harv-" + Date.now(),
                  farmId: activeFarm.id,
                  cropName: harvCrop,
                  date: harvDate,
                  quantityKg: Number(harvQty) || 20,
                  quality: harvQuality,
                  fieldLocation: harvField,
                  unitPriceNpr: 80,
                  totalValueNpr: (Number(harvQty) || 20) * 80,
                  buyerOrStorage: harvBuyer,
                  photoUrl: harvPhoto
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Save Harvest Record
            </button>
          </div>
        )}

        {/* 8. INVENTORY FORM */}
        {modalType === "inventory" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Tomato F1 Seeds"
                value={invName}
                onChange={(e) => setInvName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={invCategory}
                  onChange={(e) => setInvCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="Pesticides">Pesticides</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Tools & Gear">Tools & Gear</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quantity</label>
                <input
                  type="number"
                  value={invQty}
                  onChange={(e) => setInvQty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!invName) return;
                onAddInventory({
                  id: "inv-" + Date.now(),
                  farmId: activeFarm.id,
                  name: invName,
                  category: invCategory,
                  quantity: Number(invQty) || 5,
                  unit: invUnit,
                  minThreshold: Number(invMin) || 2,
                  costNpr: 500,
                  storageLocation: invLoc,
                  supplier: invSupplier,
                  status: "In Stock"
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Add to Stock
            </button>
          </div>
        )}

        {/* 9. MANUAL TIME LOG */}
        {modalType === "time" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Activity Name</label>
              <input
                type="text"
                value={timeActName}
                onChange={(e) => setTimeActName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={timeMins}
                  onChange={(e) => setTimeMins(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={timeCategory}
                  onChange={(e) => setTimeCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="weeding">Weeding</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="support">Support</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                const mins = Number(timeMins) || 45;
                const hrs = Math.floor(mins / 60);
                const rem = mins % 60;
                const formatted = `${hrs.toString().padStart(2, "0")}h ${rem.toString().padStart(2, "0")}m`;
                onAddTimeLog({
                  id: "time-" + Date.now(),
                  farmId: activeFarm.id,
                  activityName: timeActName,
                  category: timeCategory,
                  date: "Today, 15 May 2025",
                  startTime: timeStart,
                  endTime: timeEnd,
                  durationMinutes: mins,
                  durationFormatted: formatted,
                  workerName: "Roshan Gurung"
                });
                onClose();
              }}
              className="w-full py-3 bg-[#FF5A36] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs mt-2"
            >
              Record Time Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
