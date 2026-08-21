import React, { useState, useEffect } from "react";
import {
  FarmTab,
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
import {
  INITIAL_FARMS,
  INITIAL_TASKS,
  INITIAL_CROPS,
  INITIAL_IRRIGATION_ZONES,
  INITIAL_FERTILIZERS,
  INITIAL_PESTS,
  INITIAL_HARVESTS,
  INITIAL_INVENTORY,
  INITIAL_TIME_LOGS
} from "./mockData";
import { FarmHeader } from "./FarmHeader";
import { FarmNavScroll } from "./FarmNavScroll";
import { ScreenDashboard } from "./ScreenDashboard";
import { ScreenMyFarms } from "./ScreenMyFarms";
import { ScreenTasksSchedule } from "./ScreenTasksSchedule";
import { ScreenSowingPlanting } from "./ScreenSowingPlanting";
import { ScreenIrrigation } from "./ScreenIrrigation";
import { ScreenSoilFertilizer } from "./ScreenSoilFertilizer";
import { ScreenTimeTracking } from "./ScreenTimeTracking";
import { ScreenPestDisease } from "./ScreenPestDisease";
import { ScreenHarvestYield } from "./ScreenHarvestYield";
import { ScreenInventory } from "./ScreenInventory";
import { ScreenWeather } from "./ScreenWeather";
import { ScreenReportsAnalytics } from "./ScreenReportsAnalytics";
import { ScreenSettingsReminders } from "./ScreenSettingsReminders";
import { FarmModals } from "./FarmModals";
import { CheckCircle2 } from "lucide-react";

interface FarmGardenServiceProps {
  onBack?: () => void;
}

export const FarmGardenService: React.FC<FarmGardenServiceProps> = ({ onBack }) => {
  // 1. STATE MANAGEMENT with LocalStorage persistence
  const [activeTab, setActiveTab] = useState<FarmTab>("dashboard");
  const [activeFarmId, setActiveFarmId] = useState<string>("farm-1");
  const [modalType, setModalType] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [farms, setFarms] = useState<FarmGardenItem[]>(() => {
    const saved = localStorage.getItem("care2care_garden_farms");
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });

  const [tasks, setTasks] = useState<FarmTask[]>(() => {
    const saved = localStorage.getItem("care2care_garden_tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [crops, setCrops] = useState<CropItem[]>(() => {
    const saved = localStorage.getItem("care2care_garden_crops");
    return saved ? JSON.parse(saved) : INITIAL_CROPS;
  });

  const [irrigationZones, setIrrigationZones] = useState<IrrigationZone[]>(() => {
    const saved = localStorage.getItem("care2care_garden_irrigation");
    return saved ? JSON.parse(saved) : INITIAL_IRRIGATION_ZONES;
  });

  const [fertilizers, setFertilizers] = useState<FertilizerRecord[]>(() => {
    const saved = localStorage.getItem("care2care_garden_fertilizers");
    return saved ? JSON.parse(saved) : INITIAL_FERTILIZERS;
  });

  const [pests, setPests] = useState<PestObservation[]>(() => {
    const saved = localStorage.getItem("care2care_garden_pests");
    return saved ? JSON.parse(saved) : INITIAL_PESTS;
  });

  const [harvests, setHarvests] = useState<HarvestRecord[]>(() => {
    const saved = localStorage.getItem("care2care_garden_harvests");
    return saved ? JSON.parse(saved) : INITIAL_HARVESTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("care2care_garden_inventory");
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [timeLogs, setTimeLogs] = useState<TimeActivityLog[]>(() => {
    const saved = localStorage.getItem("care2care_garden_time_logs");
    return saved ? JSON.parse(saved) : INITIAL_TIME_LOGS;
  });

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem("care2care_garden_farms", JSON.stringify(farms));
  }, [farms]);
  useEffect(() => {
    localStorage.setItem("care2care_garden_tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("care2care_garden_crops", JSON.stringify(crops));
  }, [crops]);
  useEffect(() => {
    localStorage.setItem("care2care_garden_irrigation", JSON.stringify(irrigationZones));
  }, [irrigationZones]);
  useEffect(() => {
    localStorage.setItem("care2care_garden_fertilizers", JSON.stringify(fertilizers));
  }, [fertilizers]);
  useEffect(() => {
    localStorage.setItem("care2care_garden_pests", JSON.stringify(pests));
  }, [pests]);
  useEffect(() => {
    localStorage.setItem("care2care_garden_harvests", JSON.stringify(harvests));
  }, [harvests]);
  useEffect(() => {
    localStorage.setItem("care2care_garden_inventory", JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem("care2care_garden_time_logs", JSON.stringify(timeLogs));
  }, [timeLogs]);

  // Current active farm
  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0] || INITIAL_FARMS[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // HANDLERS
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === "done" ? "pending" : "done";
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
    showToast("Task status updated!");
  };

  const handleToggleZoneStatus = (zoneId: string) => {
    setIrrigationZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextStatus = z.status === "Done" ? "Scheduled" : "Done";
          return { ...z, status: nextStatus };
        }
        return z;
      })
    );
    showToast("Irrigation zone updated!");
  };

  const handleResolvePest = (pestId: string) => {
    setPests((prev) =>
      prev.map((p) => (p.id === pestId ? { ...p, status: "Resolved", riskLevel: "Low" } : p))
    );
    showToast("Pest marked as resolved!");
  };

  const handleExportPdf = () => {
    window.print();
    showToast("Generating comprehensive agricultural PDF report...");
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-800 font-sans pb-16">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

      {/* STICKY TOP HEADER & NAVIGATION */}
      <div className="sticky top-0 z-30 bg-[#FFF9F5]/95 backdrop-blur-md pt-3 pb-2 border-b border-orange-100/80 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* HEADER */}
          <FarmHeader
            currentTab={activeTab}
            activeFarm={activeFarm}
            farms={farms}
            onSelectFarm={(id) => {
              setActiveFarmId(id);
              showToast("Switched active farm");
            }}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAddModal={(type) => setModalType(type)}
            onExportPdf={handleExportPdf}
            onBack={onBack}
          />

          {/* HORIZONTAL SCROLL NAV TABS (12 Section Icons Matching Reference) */}
          <FarmNavScroll
            currentTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        </div>
      </div>

      {/* MAIN CONTENT VIEW CONTAINER */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-4">
        {activeTab === "dashboard" && (
          <ScreenDashboard
            activeFarm={activeFarm}
            farms={farms}
            tasks={tasks}
            crops={crops}
            irrigationZones={irrigationZones}
            fertilizers={fertilizers}
            harvests={harvests}
            onNavigate={(tab) => setActiveTab(tab)}
            onToggleTask={handleToggleTask}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}

        {activeTab === "my_farms" && (
          <ScreenMyFarms
            farms={farms}
            activeFarmId={activeFarmId}
            onSelectFarm={(id) => setActiveFarmId(id)}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAddModal={(type) => setModalType(type)}
            onDeleteFarm={(id) => {
              setFarms((prev) => prev.filter((f) => f.id !== id));
              showToast("Farm deleted");
            }}
          />
        )}

        {activeTab === "tasks" && (
          <ScreenTasksSchedule
            activeFarm={activeFarm}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onOpenAddModal={(type) => setModalType(type)}
            onDeleteTask={(id) => {
              setTasks((prev) => prev.filter((t) => t.id !== id));
              showToast("Task removed");
            }}
          />
        )}

        {activeTab === "sowing" && (
          <ScreenSowingPlanting
            activeFarm={activeFarm}
            crops={crops}
            onOpenAddModal={(type) => setModalType(type)}
            onDeleteCrop={(id) => {
              setCrops((prev) => prev.filter((c) => c.id !== id));
              showToast("Crop removed");
            }}
          />
        )}

        {activeTab === "irrigation" && (
          <ScreenIrrigation
            activeFarm={activeFarm}
            irrigationZones={irrigationZones}
            onOpenAddModal={(type) => setModalType(type)}
            onToggleZoneStatus={handleToggleZoneStatus}
          />
        )}

        {activeTab === "fertilizer" && (
          <ScreenSoilFertilizer
            activeFarm={activeFarm}
            fertilizers={fertilizers}
            onOpenAddModal={(type) => setModalType(type)}
            onToggleFertilizer={() => {}}
          />
        )}

        {activeTab === "pest" && (
          <ScreenPestDisease
            activeFarm={activeFarm}
            pests={pests}
            onOpenAddModal={(type) => setModalType(type)}
            onResolvePest={handleResolvePest}
          />
        )}

        {activeTab === "harvest" && (
          <ScreenHarvestYield
            activeFarm={activeFarm}
            harvests={harvests}
            onOpenAddModal={(type) => setModalType(type)}
            onDeleteHarvest={(id) => {
              setHarvests((prev) => prev.filter((h) => h.id !== id));
              showToast("Harvest record removed");
            }}
          />
        )}

        {activeTab === "inventory" && (
          <ScreenInventory
            activeFarm={activeFarm}
            inventory={inventory}
            onOpenAddModal={(type) => setModalType(type)}
            onDeleteInventory={(id) => {
              setInventory((prev) => prev.filter((i) => i.id !== id));
              showToast("Inventory item removed");
            }}
          />
        )}

        {activeTab === "time_tracking" && (
          <ScreenTimeTracking
            activeFarm={activeFarm}
            timeLogs={timeLogs}
            onAddTimeLog={(log) => {
              setTimeLogs((prev) => [log, ...prev]);
              showToast("Activity time saved!");
            }}
            onOpenAddModal={(type) => setModalType(type)}
          />
        )}

        {activeTab === "weather" && (
          <ScreenWeather activeFarm={activeFarm} />
        )}

        {activeTab === "analytics" && (
          <ScreenReportsAnalytics
            activeFarm={activeFarm}
            onExportPdf={handleExportPdf}
          />
        )}

        {activeTab === "settings" && (
          <ScreenSettingsReminders activeFarm={activeFarm} />
        )}
      </main>

      {/* ALL ADD MODALS */}
      <FarmModals
        modalType={modalType}
        activeFarm={activeFarm}
        onClose={() => setModalType(null)}
        onAddFarm={(farm) => {
          setFarms((prev) => [farm, ...prev]);
          setActiveFarmId(farm.id);
          showToast("New farm plot created!");
        }}
        onAddTask={(task) => {
          setTasks((prev) => [task, ...prev]);
          showToast("Task added successfully!");
        }}
        onAddCrop={(crop) => {
          setCrops((prev) => [crop, ...prev]);
          showToast("New crop registered!");
        }}
        onAddIrrigation={(zone) => {
          setIrrigationZones((prev) => [...prev, zone]);
          showToast("Irrigation task scheduled!");
        }}
        onAddFertilizer={(fert) => {
          setFertilizers((prev) => [fert, ...prev]);
          showToast("Fertilizer scheduled!");
        }}
        onAddPest={(pest) => {
          setPests((prev) => [pest, ...prev]);
          showToast("Pest observation recorded!");
        }}
        onAddHarvest={(harvest) => {
          setHarvests((prev) => [harvest, ...prev]);
          showToast("Harvest logged!");
        }}
        onAddInventory={(inv) => {
          setInventory((prev) => [inv, ...prev]);
          showToast("Stock item added!");
        }}
        onAddTimeLog={(timeLog) => {
          setTimeLogs((prev) => [timeLog, ...prev]);
          showToast("Time log recorded!");
        }}
      />
    </div>
  );
};
