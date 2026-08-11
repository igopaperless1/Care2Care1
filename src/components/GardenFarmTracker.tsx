import React, { useState, useEffect, useMemo } from "react";
import {
  Sprout,
  Sun,
  Droplets,
  Bug,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Settings,
  X,
  Check,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  Camera,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  ArrowLeft,
  FileText,
  Thermometer,
  CloudRain,
  Wind,
  ShieldAlert,
  BarChart2,
  Share2,
  Download,
  AlertCircle,
  Scissors
} from "lucide-react";
import {
  Patient,
  GardenFarm,
  PlantCrop,
  IrrigationLog,
  FertilizerLog,
  PestControlLog,
  HarvestLog,
  GardenExpense,
  WeatherData
} from "../types";

// ==========================================
// SAFE UTILITIES
// ==========================================
function safeStr(val: any, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

function safeNum(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

function safeArray<T>(val: any): T[] {
  return Array.isArray(val) ? val : [];
}

function safeDate(val: any): string {
  if (!val) return new Date().toISOString().split("T")[0];
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

// ==========================================
// CONSTANTS & CATEGORIES
// ==========================================
const GARDEN_TYPES = [
  "🌱 Vegetable Garden",
  "🌸 Flower Garden",
  "🌿 Herb Garden",
  "🌳 Fruit Garden / Orchard",
  "🌾 Farm (Crops)",
  "🏠 Backyard Garden",
  "🌱 Hydroponic Garden",
  "🌿 Medicinal Garden",
  "🌼 Community Garden"
];

const PLANT_TYPES = [
  "🥬 Leafy Greens (Lettuce, Spinach, Kale)",
  "🍅 Fruits (Tomatoes, Peppers, Eggplant)",
  "🥕 Root Vegetables (Carrots, Potatoes, Beets)",
  "🌿 Herbs (Basil, Mint, Rosemary, Thyme)",
  "🌸 Flowers (Roses, Marigolds, Sunflowers)",
  "🌾 Grains (Wheat, Rice, Corn)",
  "🥦 Brassicas (Broccoli, Cauliflower, Cabbage)",
  "🍓 Berries (Strawberries, Blueberries)",
  "📦 Other / Custom"
];

const SOIL_TYPES = ["Loamy (Ideal)", "Sandy", "Clay", "Silty", "Peaty", "Chalky"];
const SUNLIGHT_OPTIONS = ["Full Sun (6+ hrs)", "Partial Sun (3-6 hrs)", "Shade / Indirect"];
const WATER_SOURCES = ["Tap Water", "Well Water", "Rainwater Harvesting", "Canal / River", "Hydroponic Reservoir"];
const PLANT_STATUSES = ["Seedling", "Growing", "Flowering", "Harvesting", "Done"];
const HEALTH_STATUSES = ["Healthy 🟢", "Needs Attention 🟡", "Pests Detected 🔴", "Diseased 🔴"];

// ==========================================
// DEMO DATA
// ==========================================
const TODAY_STR = safeDate(new Date());

const DEMO_GARDENS: GardenFarm[] = [
  {
    id: "g-101",
    userId: "pat-1",
    name: "Organic Backyard Vegetable Plot",
    type: "🌱 Vegetable Garden",
    location: "South Backyard Zone A",
    area: 450,
    areaUnit: "sq ft",
    soilType: "Loamy (Ideal)",
    phLevel: 6.5,
    sunlight: "Full Sun (6+ hrs)",
    waterSource: "Rainwater Harvesting",
    notes: "Enriched with organic compost every spring.",
    photos: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop&q=80"
    ],
    isActive: true,
    createdAt: "2026-05-10",
    updatedAt: TODAY_STR
  },
  {
    id: "g-102",
    userId: "pat-1",
    name: "Aromatic Medicinal & Herb Bed",
    type: "🌿 Herb Garden",
    location: "Patio Raised Beds",
    area: 120,
    areaUnit: "sq ft",
    soilType: "Sandy",
    phLevel: 6.2,
    sunlight: "Partial Sun (3-6 hrs)",
    waterSource: "Tap Water",
    notes: "Herbs for daily therapeutic tea & kitchen culinary preparation.",
    photos: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?w=500&auto=format&fit=crop&q=80"
    ],
    isActive: true,
    createdAt: "2026-06-01",
    updatedAt: TODAY_STR
  }
];

const DEMO_PLANTS: PlantCrop[] = [
  {
    id: "p-201",
    gardenId: "g-101",
    name: "Cherry Tomatoes",
    type: "🍅 Fruits (Tomatoes, Peppers, Eggplant)",
    variety: "Sweet 100 Heirloom",
    quantity: 8,
    plantingDate: "2026-05-15",
    expectedHarvestDate: "2026-08-10",
    actualHarvestDate: "",
    status: "Flowering",
    healthStatus: "Healthy 🟢",
    growthNotes: "Staked and pruned lower suckers.",
    wateringFrequency: "Daily morning",
    fertilizerSchedule: "Bi-weekly organic fish emulsion",
    photos: [
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-05-15",
    updatedAt: TODAY_STR
  },
  {
    id: "p-202",
    gardenId: "g-101",
    name: "Curly Kale & Spinach",
    type: "🥬 Leafy Greens (Lettuce, Spinach, Kale)",
    variety: "Lacinato Dinosaur",
    quantity: 15,
    plantingDate: "2026-06-01",
    expectedHarvestDate: "2026-07-30",
    actualHarvestDate: "2026-07-25",
    status: "Harvesting",
    healthStatus: "Healthy 🟢",
    growthNotes: "Abundant green yields, cut-and-come-again harvest.",
    wateringFrequency: "Every 2 days",
    fertilizerSchedule: "Monthly compost tea",
    photos: [
      "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=500&auto=format&fit=crop&q=80"
    ],
    createdAt: "2026-06-01",
    updatedAt: TODAY_STR
  },
  {
    id: "p-203",
    gardenId: "g-102",
    name: "Holy Basil (Tulsi)",
    type: "🌿 Herbs (Basil, Mint, Rosemary, Thyme)",
    variety: "Rama Sacred Tulsi",
    quantity: 6,
    plantingDate: "2026-06-05",
    expectedHarvestDate: "2026-08-01",
    actualHarvestDate: "",
    status: "Growing",
    healthStatus: "Healthy 🟢",
    growthNotes: "Pinch tips for bushier growth and fragrant leaves.",
    wateringFrequency: "Daily",
    fertilizerSchedule: "Vermicompost once a month",
    photos: [],
    createdAt: "2026-06-05",
    updatedAt: TODAY_STR
  }
];

const DEMO_HARVESTS: HarvestLog[] = [
  {
    id: "h-301",
    gardenId: "g-101",
    plantId: "p-202",
    date: TODAY_STR,
    quantity: 2.5,
    unit: "kg",
    quality: "Excellent",
    notes: "Crisp organic kale leaves picked fresh for breakfast smoothies.",
    photos: [],
    createdAt: TODAY_STR
  }
];

const DEMO_IRRIGATION: IrrigationLog[] = [
  {
    id: "i-401",
    gardenId: "g-101",
    date: TODAY_STR,
    duration: 30,
    method: "Drip Irrigation",
    volume: 60,
    source: "Rainwater Harvesting",
    notes: "Morning deep soil root soaking.",
    createdAt: TODAY_STR
  }
];

const DEMO_FERTILIZERS: FertilizerLog[] = [
  {
    id: "f-501",
    gardenId: "g-101",
    plantId: "p-201",
    date: "2026-07-20",
    name: "Organic Liquid Seaweed & Neem",
    type: "Organic",
    quantity: 1.5,
    method: "Foliar Spray",
    notes: "Boosted flowering vigor.",
    createdAt: "2026-07-20"
  }
];

const DEMO_PESTS: PestControlLog[] = [
  {
    id: "pest-601",
    gardenId: "g-101",
    plantId: "p-201",
    date: "2026-07-15",
    pestType: "Aphids",
    severity: "Low",
    treatment: "Organic Neem Oil Solution",
    treatmentMethod: "Evening Spray",
    notes: "Cleared after 2 treatments.",
    photos: [],
    createdAt: "2026-07-15"
  }
];

const DEMO_EXPENSES: GardenExpense[] = [
  {
    id: "e-701",
    gardenId: "g-101",
    date: "2026-05-12",
    category: "Seeds & Saplings",
    amount: 45,
    description: "Organic heirloom seeds pack",
    receiptPhoto: "",
    notes: "Purchased from local nursery.",
    createdAt: "2026-05-12"
  },
  {
    id: "e-702",
    gardenId: "g-101",
    date: "2026-05-14",
    category: "Soil & Fertilizer",
    amount: 80,
    description: "Vermicompost & organic mulch bags",
    receiptPhoto: "",
    notes: "Enriched soil bed.",
    createdAt: "2026-05-14"
  }
];

interface Props {
  patient: Patient;
}

export const GardenFarmTracker: React.FC<Props> = ({ patient }) => {
  // SCREENS: "dashboard" | "add_garden" | "profile" | "add_plant" | "add_irrigation" | "add_fertilizer" | "add_pest" | "add_harvest" | "analytics" | "settings"
  const [screen, setScreen] = useState<string>("dashboard");
  const [selectedGardenId, setSelectedGardenId] = useState<string>("g-101");
  const [profileTab, setProfileTab] = useState<string>("overview"); // overview, plants, irrigation, fertilizer, pest, harvest, expenses, photos, analytics

  // LOCAL STORAGE PERSISTENCE
  const [gardens, setGardens] = useState<GardenFarm[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_gardens");
      return saved ? JSON.parse(saved) : DEMO_GARDENS;
    } catch {
      return DEMO_GARDENS;
    }
  });

  const [plants, setPlants] = useState<PlantCrop[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_garden_plants");
      return saved ? JSON.parse(saved) : DEMO_PLANTS;
    } catch {
      return DEMO_PLANTS;
    }
  });

  const [harvests, setHarvests] = useState<HarvestLog[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_garden_harvests");
      return saved ? JSON.parse(saved) : DEMO_HARVESTS;
    } catch {
      return DEMO_HARVESTS;
    }
  });

  const [irrigations, setIrrigations] = useState<IrrigationLog[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_garden_irrigations");
      return saved ? JSON.parse(saved) : DEMO_IRRIGATION;
    } catch {
      return DEMO_IRRIGATION;
    }
  });

  const [fertilizers, setFertilizers] = useState<FertilizerLog[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_garden_fertilizers");
      return saved ? JSON.parse(saved) : DEMO_FERTILIZERS;
    } catch {
      return DEMO_FERTILIZERS;
    }
  });

  const [pests, setPests] = useState<PestControlLog[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_garden_pests");
      return saved ? JSON.parse(saved) : DEMO_PESTS;
    } catch {
      return DEMO_PESTS;
    }
  });

  const [expenses, setExpenses] = useState<GardenExpense[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_garden_expenses");
      return saved ? JSON.parse(saved) : DEMO_EXPENSES;
    } catch {
      return DEMO_EXPENSES;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("care2care_gardens", JSON.stringify(gardens));
    } catch (e) {
      console.error(e);
    }
  }, [gardens]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_garden_plants", JSON.stringify(plants));
    } catch (e) {
      console.error(e);
    }
  }, [plants]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_garden_harvests", JSON.stringify(harvests));
    } catch (e) {
      console.error(e);
    }
  }, [harvests]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_garden_irrigations", JSON.stringify(irrigations));
    } catch (e) {
      console.error(e);
    }
  }, [irrigations]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_garden_fertilizers", JSON.stringify(fertilizers));
    } catch (e) {
      console.error(e);
    }
  }, [fertilizers]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_garden_pests", JSON.stringify(pests));
    } catch (e) {
      console.error(e);
    }
  }, [pests]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_garden_expenses", JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Selected Garden object
  const activeGarden = useMemo(() => {
    return (
      gardens.find((g) => g.id === selectedGardenId) ||
      gardens[0] || {
        id: "g-default",
        name: "My Garden",
        type: "🌱 Vegetable Garden",
        location: "Home Plot",
        area: 200,
        areaUnit: "sq ft",
        soilType: "Loamy",
        phLevel: 6.5,
        sunlight: "Full Sun",
        waterSource: "Tap Water",
        notes: "",
        photos: [],
        isActive: true,
        createdAt: TODAY_STR,
        updatedAt: TODAY_STR
      }
    );
  }, [gardens, selectedGardenId]);

  // Active Garden's specific items
  const gardenPlants = useMemo(() => {
    return plants.filter((p) => p.gardenId === activeGarden.id);
  }, [plants, activeGarden.id]);

  const gardenHarvests = useMemo(() => {
    return harvests.filter((h) => h.gardenId === activeGarden.id);
  }, [harvests, activeGarden.id]);

  const gardenIrrigations = useMemo(() => {
    return irrigations.filter((i) => i.gardenId === activeGarden.id);
  }, [irrigations, activeGarden.id]);

  const gardenFertilizers = useMemo(() => {
    return fertilizers.filter((f) => f.gardenId === activeGarden.id);
  }, [fertilizers, activeGarden.id]);

  const gardenPests = useMemo(() => {
    return pests.filter((p) => p.gardenId === activeGarden.id);
  }, [pests, activeGarden.id]);

  const gardenExpenses = useMemo(() => {
    return expenses.filter((e) => e.gardenId === activeGarden.id);
  }, [expenses, activeGarden.id]);

  // FORM STATES
  // 1. ADD GARDEN FORM
  const [gardenForm, setGardenForm] = useState({
    name: "",
    type: GARDEN_TYPES[0],
    location: "",
    area: 250,
    areaUnit: "sq ft",
    soilType: SOIL_TYPES[0],
    phLevel: 6.5,
    sunlight: SUNLIGHT_OPTIONS[0],
    waterSource: WATER_SOURCES[0],
    notes: "",
    photoUrl: ""
  });

  const handleSaveGarden = () => {
    try {
      if (!gardenForm.name.trim()) {
        alert("Please provide a name for your Garden or Farm.");
        return;
      }
      const newGarden: GardenFarm = {
        id: "g_" + Date.now(),
        userId: patient.id || "pat-1",
        name: gardenForm.name,
        type: gardenForm.type,
        location: gardenForm.location || "Home Garden",
        area: safeNum(gardenForm.area, 100),
        areaUnit: gardenForm.areaUnit,
        soilType: gardenForm.soilType,
        phLevel: safeNum(gardenForm.phLevel, 6.5),
        sunlight: gardenForm.sunlight,
        waterSource: gardenForm.waterSource,
        notes: gardenForm.notes,
        photos: gardenForm.photoUrl ? [gardenForm.photoUrl] : [],
        isActive: true,
        createdAt: TODAY_STR,
        updatedAt: TODAY_STR
      };

      setGardens((prev) => [newGarden, ...prev]);
      setSelectedGardenId(newGarden.id);
      showToast(`Garden "${newGarden.name}" added successfully!`);
      setScreen("profile");
    } catch (e) {
      console.error(e);
    }
  };

  // 2. ADD PLANT FORM
  const [plantForm, setPlantForm] = useState({
    name: "",
    type: PLANT_TYPES[0],
    variety: "",
    quantity: 5,
    plantingDate: TODAY_STR,
    expectedHarvestDate: safeDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)),
    status: "Growing",
    healthStatus: "Healthy 🟢",
    growthNotes: "",
    wateringFrequency: "Daily",
    fertilizerSchedule: "Weekly",
    photoUrl: ""
  });

  const handleSavePlant = (addAnother = false) => {
    try {
      if (!plantForm.name.trim()) {
        alert("Please enter a plant or crop name.");
        return;
      }
      const newPlant: PlantCrop = {
        id: "p_" + Date.now(),
        gardenId: activeGarden.id,
        name: plantForm.name,
        type: plantForm.type,
        variety: plantForm.variety || "Standard Variety",
        quantity: safeNum(plantForm.quantity, 1),
        plantingDate: safeDate(plantForm.plantingDate),
        expectedHarvestDate: safeDate(plantForm.expectedHarvestDate),
        actualHarvestDate: "",
        status: plantForm.status,
        healthStatus: plantForm.healthStatus,
        growthNotes: plantForm.growthNotes,
        wateringFrequency: plantForm.wateringFrequency,
        fertilizerSchedule: plantForm.fertilizerSchedule,
        photos: plantForm.photoUrl ? [plantForm.photoUrl] : [],
        createdAt: TODAY_STR,
        updatedAt: TODAY_STR
      };

      setPlants((prev) => [newPlant, ...prev]);
      showToast(`Plant "${newPlant.name}" added to ${activeGarden.name}`);

      if (addAnother) {
        setPlantForm((prev) => ({
          ...prev,
          name: "",
          variety: "",
          growthNotes: ""
        }));
      } else {
        setScreen("profile");
        setProfileTab("plants");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. ADD IRRIGATION LOG
  const [irrigationForm, setIrrigationForm] = useState({
    date: TODAY_STR,
    duration: 20,
    method: "Drip Irrigation",
    volume: 40,
    source: "Rainwater Harvesting",
    notes: ""
  });

  const handleSaveIrrigation = () => {
    try {
      const newLog: IrrigationLog = {
        id: "i_" + Date.now(),
        gardenId: activeGarden.id,
        date: safeDate(irrigationForm.date),
        duration: safeNum(irrigationForm.duration, 15),
        method: irrigationForm.method,
        volume: safeNum(irrigationForm.volume, 30),
        source: irrigationForm.source,
        notes: irrigationForm.notes,
        createdAt: TODAY_STR
      };

      setIrrigations((prev) => [newLog, ...prev]);
      showToast("Irrigation session logged.");
      setScreen("profile");
      setProfileTab("irrigation");
    } catch (e) {
      console.error(e);
    }
  };

  // 4. ADD FERTILIZER LOG
  const [fertilizerForm, setFertilizerForm] = useState({
    plantId: "",
    date: TODAY_STR,
    name: "Organic Compost / Fish Emulsion",
    type: "Organic",
    quantity: 1,
    method: "Soil Mix",
    notes: ""
  });

  const handleSaveFertilizer = () => {
    try {
      const newLog: FertilizerLog = {
        id: "f_" + Date.now(),
        gardenId: activeGarden.id,
        plantId: fertilizerForm.plantId || undefined,
        date: safeDate(fertilizerForm.date),
        name: fertilizerForm.name,
        type: fertilizerForm.type,
        quantity: safeNum(fertilizerForm.quantity, 1),
        method: fertilizerForm.method,
        notes: fertilizerForm.notes,
        createdAt: TODAY_STR
      };

      setFertilizers((prev) => [newLog, ...prev]);
      showToast("Fertilizer application logged.");
      setScreen("profile");
      setProfileTab("fertilizer");
    } catch (e) {
      console.error(e);
    }
  };

  // 5. ADD PEST CONTROL LOG
  const [pestForm, setPestForm] = useState({
    plantId: "",
    date: TODAY_STR,
    pestType: "Aphids",
    severity: "Low",
    treatment: "Neem Oil Spray",
    treatmentMethod: "Evening Spray",
    notes: "",
    photoUrl: ""
  });

  const handleSavePest = () => {
    try {
      const newLog: PestControlLog = {
        id: "pest_" + Date.now(),
        gardenId: activeGarden.id,
        plantId: pestForm.plantId || undefined,
        date: safeDate(pestForm.date),
        pestType: pestForm.pestType,
        severity: pestForm.severity,
        treatment: pestForm.treatment,
        treatmentMethod: pestForm.treatmentMethod,
        notes: pestForm.notes,
        photos: pestForm.photoUrl ? [pestForm.photoUrl] : [],
        createdAt: TODAY_STR
      };

      setPests((prev) => [newLog, ...prev]);
      showToast("Pest control activity recorded.");
      setScreen("profile");
      setProfileTab("pest");
    } catch (e) {
      console.error(e);
    }
  };

  // 6. ADD HARVEST LOG
  const [harvestForm, setHarvestForm] = useState({
    plantId: "",
    date: TODAY_STR,
    quantity: 1.5,
    unit: "kg",
    quality: "Excellent",
    notes: "",
    photoUrl: ""
  });

  const handleSaveHarvest = () => {
    try {
      if (!harvestForm.plantId && gardenPlants.length > 0) {
        harvestForm.plantId = gardenPlants[0].id;
      }
      const newHarvest: HarvestLog = {
        id: "h_" + Date.now(),
        gardenId: activeGarden.id,
        plantId: harvestForm.plantId || (gardenPlants[0]?.id || "p-1"),
        date: safeDate(harvestForm.date),
        quantity: safeNum(harvestForm.quantity, 1),
        unit: harvestForm.unit,
        quality: harvestForm.quality,
        notes: harvestForm.notes,
        photos: harvestForm.photoUrl ? [harvestForm.photoUrl] : [],
        createdAt: TODAY_STR
      };

      setHarvests((prev) => [newHarvest, ...prev]);
      showToast(`Harvest recorded: ${newHarvest.quantity} ${newHarvest.unit}!`);
      setScreen("profile");
      setProfileTab("harvest");
    } catch (e) {
      console.error(e);
    }
  };

  // 7. ADD EXPENSE LOG
  const [expenseForm, setExpenseForm] = useState({
    date: TODAY_STR,
    category: "Seeds & Saplings",
    amount: 25,
    description: "Garden store supplies",
    notes: ""
  });

  const handleSaveExpense = () => {
    try {
      const newExp: GardenExpense = {
        id: "e_" + Date.now(),
        gardenId: activeGarden.id,
        date: safeDate(expenseForm.date),
        category: expenseForm.category,
        amount: safeNum(expenseForm.amount, 10),
        description: expenseForm.description,
        receiptPhoto: "",
        notes: expenseForm.notes,
        createdAt: TODAY_STR
      };

      setExpenses((prev) => [newExp, ...prev]);
      showToast(`Garden expense of $${newExp.amount} logged.`);
      setScreen("profile");
      setProfileTab("expenses");
    } catch (e) {
      console.error(e);
    }
  };

  // Delete helpers
  const handleDeleteGarden = (id: string) => {
    if (confirm("Are you sure you want to delete this garden and its recorded plants & logs?")) {
      setGardens((prev) => prev.filter((g) => g.id !== id));
      showToast("Garden deleted.");
      setScreen("dashboard");
    }
  };

  const handleDeletePlant = (id: string) => {
    if (confirm("Delete this plant record?")) {
      setPlants((prev) => prev.filter((p) => p.id !== id));
      showToast("Plant removed.");
    }
  };

  // Export Garden Report
  const handleExportGardenReport = (format: "txt" | "csv") => {
    let content = "";
    if (format === "csv") {
      content = "Date,Garden,Plant,Harvest Quantity,Unit,Quality,Notes\n";
      gardenHarvests.forEach((h) => {
        const p = plants.find((p) => p.id === h.plantId);
        content += `"${h.date}","${activeGarden.name}","${p?.name || "Crop"}",${h.quantity},"${h.unit}","${h.quality}","${h.notes}"\n`;
      });
    } else {
      content = `CARETOCARE - GARDEN & FARM MANAGEMENT REPORT
Garden: ${activeGarden.name}
Type: ${activeGarden.type}
Location: ${activeGarden.location} (${activeGarden.area} ${activeGarden.areaUnit})
Soil: ${activeGarden.soilType} | pH: ${activeGarden.phLevel}

ACTIVE CROPS (${gardenPlants.length}):
${gardenPlants.map((p, i) => `${i + 1}. ${p.name} (${p.variety}) - ${p.quantity} plants [${p.status} - ${p.healthStatus}]`).join("\n")}

HARVEST RECORD (${gardenHarvests.length}):
${gardenHarvests.map((h, i) => `${i + 1}. [${h.date}] ${h.quantity} ${h.unit} (${h.quality})`).join("\n")}

TOTAL EXPENSES: $${gardenExpenses.reduce((sum, e) => sum + safeNum(e.amount), 0)}
`;
    }

    const blob = new Blob([content], {
      type: format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Garden_Report_${activeGarden.name.replace(/\s+/g, "_")}.${format}`;
    a.click();
    showToast(`Exported ${format.toUpperCase()} report.`);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <Check className="w-5 h-5 text-emerald-200" />
          {toastMsg}
        </div>
      )}

      {/* HEADER BAR */}
      <header className="bg-emerald-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-700/60 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-emerald-500/30">
              🌿
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                Garden & Farm Management
              </h1>
              <p className="text-xs text-emerald-200">
                Care2Care Organic Farming & Horticultural Suite • Caregiver / Patient Plot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScreen("add_garden")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Garden / Farm
            </button>
            <button
              onClick={() => setScreen("analytics")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                screen === "analytics"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "bg-emerald-800 hover:bg-emerald-700 text-white"
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Reports
            </button>
            <button
              onClick={() => setScreen("settings")}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                screen === "settings"
                  ? "bg-white text-emerald-900"
                  : "bg-emerald-800 hover:bg-emerald-700 text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SUB NAV TAB BAR FOR GARDENS */}
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2 border-t border-emerald-800/60 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setScreen("dashboard")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              screen === "dashboard"
                ? "bg-emerald-700 text-white font-bold shadow-xs"
                : "text-emerald-200 hover:bg-emerald-800/50"
            }`}
          >
            <Layers className="w-4 h-4" /> All Gardens
          </button>

          {gardens.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setSelectedGardenId(g.id);
                setScreen("profile");
              }}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                screen === "profile" && selectedGardenId === g.id
                  ? "bg-white text-emerald-950 font-bold shadow-xs"
                  : "text-emerald-100 hover:bg-emerald-800/50"
              }`}
            >
              <span>{g.type.split(" ")[0] || "🌿"}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* MAIN BODY AREA */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* ========================================================= */}
        {/* SCREEN 1: MAIN GARDEN DASHBOARD                          */}
        {/* ========================================================= */}
        {screen === "dashboard" && (
          <div className="space-y-6">
            {/* OVERVIEW STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sprout className="w-4 h-4 text-emerald-600" /> Total Plots
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900">{gardens.length}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {gardens.reduce((sum, g) => sum + safeNum(g.area), 0)} Total Sq Ft
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sun className="w-4 h-4 text-amber-500" /> Active Crops
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Growing
                  </span>
                </div>
                <p className="text-3xl font-black text-amber-600">{plants.length}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Across all garden zones
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-4 h-4 text-purple-600" /> Total Harvests
                  </span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    Yield
                  </span>
                </div>
                <p className="text-3xl font-black text-purple-700">
                  {harvests.reduce((sum, h) => sum + safeNum(h.quantity), 0)}{" "}
                  <span className="text-sm font-semibold text-slate-500">kg</span>
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {harvests.length} total harvest logs
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-rose-600" /> Garden Expenses
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    Invested
                  </span>
                </div>
                <p className="text-3xl font-black text-rose-600">
                  ${expenses.reduce((sum, e) => sum + safeNum(e.amount), 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Seeds, soil & equipment</p>
              </div>
            </div>

            {/* QUICK ACTIONS BANNER */}
            <div className="bg-emerald-800 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" /> Care2Care Garden Operations
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Record daily irrigation, log fresh harvests, or track organic pest treatments
                </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => setScreen("add_plant")}
                  className="flex-1 md:flex-initial bg-white text-emerald-950 font-black px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-50 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-600" /> Add Plant
                </button>
                <button
                  onClick={() => setScreen("add_irrigation")}
                  className="flex-1 md:flex-initial bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-600 transition-all border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Droplets className="w-4 h-4 text-cyan-300" /> Log Water
                </button>
                <button
                  onClick={() => setScreen("add_harvest")}
                  className="flex-1 md:flex-initial bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-600 transition-all border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-purple-300" /> Log Harvest
                </button>
              </div>
            </div>

            {/* GARDEN / FARM CARDS GRID */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-700" /> Managed Garden & Farm Plots
                </h2>
                <button
                  onClick={() => setScreen("add_garden")}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  + Add New Plot
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gardens.map((g) => {
                  const plotPlants = plants.filter((p) => p.gardenId === g.id);
                  const plotHarvests = harvests.filter((h) => h.gardenId === g.id);
                  const image =
                    g.photos && g.photos[0]
                      ? g.photos[0]
                      : "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop&q=80";

                  return (
                    <div
                      key={g.id}
                      onClick={() => {
                        setSelectedGardenId(g.id);
                        setScreen("profile");
                      }}
                      className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={image}
                          alt={g.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-emerald-900/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                          {g.type}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                          {g.area} {g.areaUnit}
                        </div>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {g.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {g.location} • Soil:{" "}
                            {g.soilType} (pH {g.phLevel})
                          </p>
                        </div>

                        {/* ACTIVE CROPS PREVIEW */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Active Crops ({plotPlants.length})
                          </p>
                          {plotPlants.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No crops planted yet.</p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {plotPlants.slice(0, 4).map((p) => (
                                <span
                                  key={p.id}
                                  className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-100"
                                >
                                  {p.name} ({p.quantity})
                                </span>
                              ))}
                              {plotPlants.length > 4 && (
                                <span className="text-xs font-bold text-slate-400 self-center">
                                  +{plotPlants.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                          <span>Harvest Logs: {plotHarvests.length} entries</span>
                          <span className="text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Open Profile <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: ADD GARDEN / FARM FORM                         */}
        {/* ========================================================= */}
        {screen === "add_garden" && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-700" /> Register New Garden or Farm Plot
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Set up location, soil specifics, sunlight exposure & water details
                </p>
              </div>
              <button
                onClick={() => setScreen("dashboard")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveGarden();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Garden / Farm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Backyard Herb & Tomato Bed"
                  value={gardenForm.name}
                  onChange={(e) => setGardenForm({ ...gardenForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Garden Type *
                  </label>
                  <select
                    value={gardenForm.type}
                    onChange={(e) => setGardenForm({ ...gardenForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    {GARDEN_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location / Zone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., South Yard / Balcony Deck"
                    value={gardenForm.location}
                    onChange={(e) => setGardenForm({ ...gardenForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Plot Area
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={gardenForm.area}
                      onChange={(e) =>
                        setGardenForm({ ...gardenForm, area: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                    <select
                      value={gardenForm.areaUnit}
                      onChange={(e) => setGardenForm({ ...gardenForm, areaUnit: e.target.value })}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
                    >
                      <option value="sq ft">sq ft</option>
                      <option value="acres">acres</option>
                      <option value="sq m">sq m</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Soil Type
                  </label>
                  <select
                    value={gardenForm.soilType}
                    onChange={(e) => setGardenForm({ ...gardenForm, soilType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    {SOIL_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Soil pH Level
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={gardenForm.phLevel}
                    onChange={(e) =>
                      setGardenForm({ ...gardenForm, phLevel: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Sunlight Exposure
                  </label>
                  <select
                    value={gardenForm.sunlight}
                    onChange={(e) => setGardenForm({ ...gardenForm, sunlight: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  >
                    {SUNLIGHT_OPTIONS.map((sun) => (
                      <option key={sun} value={sun}>
                        {sun}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Water Source
                  </label>
                  <select
                    value={gardenForm.waterSource}
                    onChange={(e) => setGardenForm({ ...gardenForm, waterSource: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  >
                    {WATER_SOURCES.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={gardenForm.photoUrl}
                  onChange={(e) => setGardenForm({ ...gardenForm, photoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notes & Soil Amendments
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe compost type, companion planting strategy, or pest history..."
                  value={gardenForm.notes}
                  onChange={(e) => setGardenForm({ ...gardenForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScreen("dashboard")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs cursor-pointer"
                >
                  Save Garden Plot
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: GARDEN PROFILE (WITH 9 SUB-TABS)               */}
        {/* ========================================================= */}
        {screen === "profile" && (
          <div className="space-y-6">
            {/* PROFILE HEADER CARD */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="h-48 w-full bg-emerald-900 relative">
                <img
                  src={
                    activeGarden.photos && activeGarden.photos[0]
                      ? activeGarden.photos[0]
                      : "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000&auto=format&fit=crop&q=80"
                  }
                  alt={activeGarden.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-2 text-white">
                  <div>
                    <span className="text-xs font-bold bg-emerald-700/80 px-3 py-1 rounded-full text-emerald-100 backdrop-blur-md">
                      {activeGarden.type}
                    </span>
                    <h2 className="text-2xl font-black mt-1">{activeGarden.name}</h2>
                    <p className="text-xs text-emerald-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {activeGarden.location} • Area:{" "}
                      {activeGarden.area} {activeGarden.areaUnit}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteGarden(activeGarden.id)}
                      className="p-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl backdrop-blur-md transition-all cursor-pointer"
                      title="Delete Plot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* TABS NAVIGATION BAR */}
              <div className="flex items-center gap-1 overflow-x-auto p-2 bg-slate-50 border-t border-slate-200 text-xs font-bold scrollbar-none">
                {[
                  { id: "overview", label: "📋 Overview" },
                  { id: "plants", label: `🌱 Plants (${gardenPlants.length})` },
                  { id: "irrigation", label: `💧 Water (${gardenIrrigations.length})` },
                  { id: "fertilizer", label: `🧪 Fertilizer (${gardenFertilizers.length})` },
                  { id: "pest", label: `🐛 Pest Control (${gardenPests.length})` },
                  { id: "harvest", label: `🌾 Harvest (${gardenHarvests.length})` },
                  { id: "expenses", label: `💰 Expenses (${gardenExpenses.length})` },
                  { id: "analytics", label: "📊 Analytics" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      profileTab === tab.id
                        ? "bg-emerald-800 text-white shadow-xs font-black"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {profileTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-slate-800 text-base">Plot Specifications & Soil Profile</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Soil Type</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{activeGarden.soilType}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">pH Level</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{activeGarden.phLevel} (pH)</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Sunlight</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{activeGarden.sunlight}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Water Source</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{activeGarden.waterSource}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Created Date</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{activeGarden.createdAt}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Crops</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{gardenPlants.length} Plant Types</p>
                    </div>
                  </div>

                  {activeGarden.notes && (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-slate-500 uppercase">Soil & Agronomy Notes</p>
                      <p className="text-sm text-slate-700 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 mt-1 font-medium">
                        {activeGarden.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-slate-800 text-base">Quick Action Hub</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setScreen("add_plant")}
                      className="w-full bg-emerald-700 text-white font-bold p-3 rounded-xl text-xs hover:bg-emerald-800 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">🌱 Plant New Crops</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setScreen("add_irrigation")}
                      className="w-full bg-slate-100 text-slate-800 font-bold p-3 rounded-xl text-xs hover:bg-slate-200 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">💧 Record Water Log</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setScreen("add_harvest")}
                      className="w-full bg-slate-100 text-slate-800 font-bold p-3 rounded-xl text-xs hover:bg-slate-200 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">🌾 Log Crop Harvest</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PLANTS */}
            {profileTab === "plants" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base">Active Crops in {activeGarden.name}</h3>
                  <button
                    onClick={() => setScreen("add_plant")}
                    className="bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Plant
                  </button>
                </div>

                {gardenPlants.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 font-medium">
                    No plants recorded in this garden yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gardenPlants.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {p.type.split(" ")[0]} {p.status}
                            </span>
                            <h4 className="font-bold text-slate-900 text-base mt-1">{p.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">{p.variety}</p>
                          </div>
                          <button
                            onClick={() => handleDeletePlant(p.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-medium bg-slate-50 p-2.5 rounded-xl">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">
                              Quantity
                            </span>
                            <span className="text-slate-800 font-bold">{p.quantity} plants</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">
                              Health
                            </span>
                            <span className="font-bold">{p.healthStatus}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">
                              Planted
                            </span>
                            <span>{p.plantingDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">
                              Est. Harvest
                            </span>
                            <span>{p.expectedHarvestDate || "N/A"}</span>
                          </div>
                        </div>

                        {p.growthNotes && (
                          <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                            "{p.growthNotes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: IRRIGATION */}
            {profileTab === "irrigation" && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base">Irrigation & Water Logs</h3>
                  <button
                    onClick={() => setScreen("add_irrigation")}
                    className="bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Log Water
                  </button>
                </div>

                {gardenIrrigations.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No watering logs recorded.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {gardenIrrigations.map((i) => (
                      <div key={i.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {i.method} ({i.duration} mins)
                          </p>
                          <p className="text-slate-500">
                            {i.date} • {i.volume} Liters • Source: {i.source}
                          </p>
                        </div>
                        <span className="font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg">
                          💧 {i.volume} L
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: FERTILIZER */}
            {profileTab === "fertilizer" && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base">Fertilizer & Soil Nutrition Logs</h3>
                  <button
                    onClick={() => setScreen("add_fertilizer")}
                    className="bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Log Fertilizer
                  </button>
                </div>

                {gardenFertilizers.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No fertilizer logs recorded.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {gardenFertilizers.map((f) => (
                      <div key={f.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{f.name}</p>
                          <p className="text-slate-500">
                            {f.date} • Method: {f.method} • Type: {f.type}
                          </p>
                        </div>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          🧪 {f.quantity} kg/L
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PEST CONTROL */}
            {profileTab === "pest" && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base">Pest Control & Plant Pathology Logs</h3>
                  <button
                    onClick={() => setScreen("add_pest")}
                    className="bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Log Pest Control
                  </button>
                </div>

                {gardenPests.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No pest issues reported.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {gardenPests.map((p) => (
                      <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {p.pestType} (Severity: {p.severity})
                          </p>
                          <p className="text-slate-500">
                            {p.date} • Treatment: {p.treatment} ({p.treatmentMethod})
                          </p>
                        </div>
                        <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                          🐛 Treatment Done
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: HARVEST */}
            {profileTab === "harvest" && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base">Crop Harvest History</h3>
                  <button
                    onClick={() => setScreen("add_harvest")}
                    className="bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Log Harvest
                  </button>
                </div>

                {gardenHarvests.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No harvest logs recorded yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {gardenHarvests.map((h) => {
                      const pl = plants.find((p) => p.id === h.plantId);
                      return (
                        <div key={h.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {pl?.name || "Crop Harvest"} ({h.quantity} {h.unit})
                            </p>
                            <p className="text-slate-500">
                              {h.date} • Quality: {h.quality}
                            </p>
                          </div>
                          <span className="font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">
                            🌾 {h.quantity} {h.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: EXPENSES */}
            {profileTab === "expenses" && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base">Garden Plot Expenses</h3>
                  <button
                    onClick={() => setExpenseForm({ ...expenseForm, date: TODAY_STR })}
                    className="bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Expense
                  </button>
                </div>

                {gardenExpenses.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No expenses logged.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {gardenExpenses.map((e) => (
                      <div key={e.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{e.description}</p>
                          <p className="text-slate-500">
                            {e.date} • Category: {e.category}
                          </p>
                        </div>
                        <span className="font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">
                          -${e.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: ANALYTICS */}
            {profileTab === "analytics" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" /> Agronomy & Yield Analytics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-800 uppercase">Total Harvest Volume</p>
                    <p className="text-2xl font-black text-emerald-900 mt-1">
                      {gardenHarvests.reduce((sum, h) => sum + safeNum(h.quantity), 0)} kg
                    </p>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
                    <p className="text-xs font-bold text-cyan-800 uppercase">Water Applied</p>
                    <p className="text-2xl font-black text-cyan-900 mt-1">
                      {gardenIrrigations.reduce((sum, i) => sum + safeNum(i.volume), 0)} Liters
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <p className="text-xs font-bold text-purple-800 uppercase">Plot Investment</p>
                    <p className="text-2xl font-black text-purple-900 mt-1">
                      ${gardenExpenses.reduce((sum, e) => sum + safeNum(e.amount), 0)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleExportGardenReport("csv")}
                    className="bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export Complete Garden CSV Statement
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: ADD PLANT FORM                                 */}
        {/* ========================================================= */}
        {screen === "add_plant" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-700" /> Add Plant / Crop
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Adding to <span className="font-bold text-emerald-700">{activeGarden.name}</span>
                </p>
              </div>
              <button
                onClick={() => setScreen("profile")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePlant(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Plant / Crop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cherry Tomatoes / Holy Basil"
                  value={plantForm.name}
                  onChange={(e) => setPlantForm({ ...plantForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Crop Category
                  </label>
                  <select
                    value={plantForm.type}
                    onChange={(e) => setPlantForm({ ...plantForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  >
                    {PLANT_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Variety
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Roma Heirloom"
                    value={plantForm.variety}
                    onChange={(e) => setPlantForm({ ...plantForm, variety: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Quantity / Seed Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={plantForm.quantity}
                    onChange={(e) => setPlantForm({ ...plantForm, quantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Planting Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={plantForm.plantingDate}
                    onChange={(e) => setPlantForm({ ...plantForm, plantingDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Expected Harvest Date
                  </label>
                  <input
                    type="date"
                    value={plantForm.expectedHarvestDate}
                    onChange={(e) =>
                      setPlantForm({ ...plantForm, expectedHarvestDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Health Status
                  </label>
                  <select
                    value={plantForm.healthStatus}
                    onChange={(e) => setPlantForm({ ...plantForm, healthStatus: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  >
                    {HEALTH_STATUSES.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Growth & Care Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Watering schedule, pruning tips..."
                  value={plantForm.growthNotes}
                  onChange={(e) => setPlantForm({ ...plantForm, growthNotes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSavePlant(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                >
                  Save & Add Another
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setScreen("profile")}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer"
                  >
                    Save Plant
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 5: ADD IRRIGATION LOG                             */}
        {/* ========================================================= */}
        {screen === "add_irrigation" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-600" /> Log Irrigation Activity
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Plot: <span className="font-bold text-emerald-700">{activeGarden.name}</span>
                </p>
              </div>
              <button
                onClick={() => setScreen("profile")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveIrrigation();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={irrigationForm.date}
                    onChange={(e) => setIrrigationForm({ ...irrigationForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={irrigationForm.duration}
                    onChange={(e) =>
                      setIrrigationForm({ ...irrigationForm, duration: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Method
                  </label>
                  <select
                    value={irrigationForm.method}
                    onChange={(e) => setIrrigationForm({ ...irrigationForm, method: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Sprinkler System">Sprinkler System</option>
                    <option value="Manual Hose / Watering Can">Manual Hose / Can</option>
                    <option value="Rainfall / Natural">Rainfall / Natural</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Volume (Liters)
                  </label>
                  <input
                    type="number"
                    value={irrigationForm.volume}
                    onChange={(e) =>
                      setIrrigationForm({ ...irrigationForm, volume: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScreen("profile")}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-cyan-700 text-white hover:bg-cyan-800 cursor-pointer"
                >
                  Save Water Log
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 8: ADD HARVEST LOG                                */}
        {/* ========================================================= */}
        {screen === "add_harvest" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-700" /> Record Harvest Yield
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Plot: <span className="font-bold text-emerald-700">{activeGarden.name}</span>
                </p>
              </div>
              <button
                onClick={() => setScreen("profile")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveHarvest();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Harvested Crop *
                </label>
                <select
                  value={harvestForm.plantId}
                  onChange={(e) => setHarvestForm({ ...harvestForm, plantId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                >
                  {gardenPlants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.variety})
                    </option>
                  ))}
                  {gardenPlants.length === 0 && <option value="p-default">General Harvest</option>}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={harvestForm.date}
                    onChange={(e) => setHarvestForm({ ...harvestForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={harvestForm.quantity}
                    onChange={(e) =>
                      setHarvestForm({ ...harvestForm, quantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Unit
                  </label>
                  <select
                    value={harvestForm.unit}
                    onChange={(e) => setHarvestForm({ ...harvestForm, unit: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="pieces">pieces</option>
                    <option value="bunches">bunches</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Quality Grade
                </label>
                <select
                  value={harvestForm.quality}
                  onChange={(e) => setHarvestForm({ ...harvestForm, quality: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white"
                >
                  <option value="Excellent">Excellent ⭐⭐⭐</option>
                  <option value="Good">Good ⭐⭐</option>
                  <option value="Fair">Fair ⭐</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScreen("profile")}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-purple-700 text-white hover:bg-purple-800 cursor-pointer"
                >
                  Save Harvest
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 9: ANALYTICS & REPORTS                             */}
        {/* ========================================================= */}
        {screen === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-emerald-700" /> Garden & Farm Comprehensive Analytics
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Yield metrics, expense breakdown & AI Agronomy Insights
                  </p>
                </div>
                <button
                  onClick={() => handleExportGardenReport("csv")}
                  className="bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export CSV Report
                </button>
              </div>

              {/* OVERVIEW SUMMARY CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Plots</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{gardens.length}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-800 uppercase">Total Yield</p>
                  <p className="text-2xl font-black text-emerald-950 mt-1">
                    {harvests.reduce((sum, h) => sum + safeNum(h.quantity), 0)} kg
                  </p>
                </div>
                <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
                  <p className="text-xs font-bold text-cyan-800 uppercase">Irrigation Logged</p>
                  <p className="text-2xl font-black text-cyan-950 mt-1">
                    {irrigations.reduce((sum, i) => sum + safeNum(i.volume), 0)} L
                  </p>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="text-xs font-bold text-rose-800 uppercase">Total Investment</p>
                  <p className="text-2xl font-black text-rose-950 mt-1">
                    ${expenses.reduce((sum, e) => sum + safeNum(e.amount), 0)}
                  </p>
                </div>
              </div>

              {/* GEMINI AI INSIGHTS CARD */}
              <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
                <h3 className="font-bold text-base flex items-center gap-2 text-emerald-200">
                  <Sparkles className="w-5 h-5 text-amber-300" /> Gemini AI Agronomy Recommendations
                </h3>
                <ul className="text-xs space-y-2 text-emerald-100 font-medium list-disc pl-5">
                  <li>
                    <strong>Tomato Yield Optimization:</strong> Nitrogen fish emulsion applied in late July increased flowering by 25%.
                  </li>
                  <li>
                    <strong>Water Conservation:</strong> Drip irrigation saves 40% water compared to manual watering.
                  </li>
                  <li>
                    <strong>Companion Planting:</strong> Plant marigolds beside kale beds to naturally repel aphids.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 10: SETTINGS                                      */}
        {/* ========================================================= */}
        {screen === "settings" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Settings className="w-5 h-5 text-emerald-700" /> Garden Suite Preferences
            </h2>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span>Irrigation & Watering Reminders</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-700 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span>Pest Check Alerts</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-700 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span>Harvest Readiness Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-700 cursor-pointer" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => {
                  if (confirm("Reset garden demo data?")) {
                    localStorage.removeItem("care2care_gardens");
                    localStorage.removeItem("care2care_garden_plants");
                    localStorage.removeItem("care2care_garden_harvests");
                    window.location.reload();
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Reset Demo Data
              </button>
              <button
                onClick={() => setScreen("dashboard")}
                className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-700 text-white cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
