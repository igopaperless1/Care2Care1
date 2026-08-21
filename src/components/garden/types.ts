export type FarmTab =
  | "dashboard"
  | "my_farms"
  | "tasks"
  | "sowing"
  | "irrigation"
  | "fertilizer"
  | "pest"
  | "harvest"
  | "inventory"
  | "time_tracking"
  | "weather"
  | "analytics"
  | "settings";

export type FarmType = "Farm" | "Garden" | "Greenhouse" | "Orchard" | "Polyhouse";

export interface FarmGardenItem {
  id: string;
  userId?: string;
  name: string;
  type: FarmType;
  categoryDesc: string; // e.g. "Vegetable Farm", "Kitchen Garden", "Fruit Orchard", "Polyhouse"
  location: string; // e.g. "Pokhara, Nepal"
  area: number;
  areaUnit: "acres" | "sq ft" | "hectares" | "ropani" | "bigha";
  status: "Active" | "Seasonal" | "Resting" | "Planned";
  healthScore: number; // 0 - 100
  healthLabel: "Excellent" | "Good" | "Moderate" | "Needs Care";
  activeCropsCount: number;
  totalTasksCount: number;
  completedTasksCount: number;
  inProgressTasksCount: number;
  pendingTasksCount: number;
  nextTaskText: string;
  soilType: string;
  phLevel: number;
  waterSource: string;
  sunlight: string;
  photoUrl: string;
  createdAt: string;
  notes?: string;
}

export interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  category: "irrigation" | "fertilizer" | "weeding" | "pest" | "support" | "sowing" | "harvest" | "pruning" | "general";
  fieldLocation: string; // e.g. "Vegetable Field - Block A"
  scheduledTime: string; // e.g. "07:00 AM"
  date: string; // e.g. "2026-05-15"
  dueBadge: "Today" | "Tomorrow" | "In 2 Days" | "In 3 Days" | "Overdue";
  status: "pending" | "in_progress" | "done";
  notes?: string;
}

export interface CropItem {
  id: string;
  farmId: string;
  name: string; // e.g. "Tomato", "Cabbage"
  variety: string;
  type: "Vegetable" | "Leafy Greens" | "Fruit" | "Herb" | "Root" | "Grain";
  sowingDate: string; // e.g. "10 Mar 2025"
  transplantDate?: string; // e.g. "25 Apr 2025"
  expectedHarvestDate?: string;
  actualHarvestDate?: string;
  status: "Nursery" | "Growing" | "Flowering" | "Harvesting" | "Completed";
  healthStatus: "Excellent" | "Good" | "Attention" | "Diseased";
  quantity: number;
  unit: "plants" | "beds" | "rows" | "sq m";
  photoUrl: string;
  wateringFrequency?: string;
  fertilizerPlan?: string;
  notes?: string;
}

export interface IrrigationZone {
  id: string;
  farmId: string;
  zoneName: string; // e.g. "Zone A - Vegetables"
  cropGroup: string; // e.g. "Tomato & Peppers"
  method: "Drip Irrigation" | "Sprinkler" | "Flood" | "Manual Hose";
  scheduledTime: string; // e.g. "Today, 07:00 AM"
  durationMinutes: number;
  volumeLiters: number;
  status: "Done" | "Scheduled" | "Upcoming" | "Active";
  lastWatered?: string;
  waterSource?: string;
}

export interface FertilizerRecord {
  id: string;
  farmId: string;
  cropTarget: string; // e.g. "Tomato - Greenhouse 1"
  fertilizerName: string; // e.g. "NPK 19:19:19", "Organic Compost"
  type: "Organic" | "Chemical" | "Bio-fertilizer";
  scheduledDate: string; // e.g. "16 May 2025"
  dueBadge: "Today" | "Tomorrow" | "In 3 Days" | "In 5 Days" | "Completed";
  status: "Upcoming" | "Completed";
  quantity: number;
  unit: "kg" | "L" | "bags" | "grams";
  costNpr: number;
  applicationMethod: "Foliar Spray" | "Soil Dressing" | "Drip Fertigation" | "Broadcasting";
  notes?: string;
}

export interface SoilTestRecord {
  id: string;
  farmId: string;
  fieldName: string;
  testDate: string;
  ph: number;
  nitrogen: "Low" | "Optimal" | "High";
  phosphorus: "Low" | "Optimal" | "High";
  potassium: "Low" | "Optimal" | "High";
  organicMatterPct: number;
  moisturePct: number;
  recommendation: string;
}

export interface PestObservation {
  id: string;
  farmId: string;
  cropTarget: string; // e.g. "Tomato - Greenhouse 1"
  pestName: string; // e.g. "Aphids", "Whiteflies", "Leaf Spot"
  pestCategory: "Insect" | "Fungus" | "Bacteria" | "Virus" | "Weed";
  fieldLocation: string;
  date: string; // e.g. "15 May 2025"
  riskLevel: "Low" | "Medium" | "High" | "Resolved";
  status: "Active" | "Monitoring" | "Resolved";
  treatment: string; // e.g. "Neem Oil 5ml/L + Potassium soap"
  treatmentStatus: "Applied" | "Pending" | "Effective";
  notes?: string;
  photoUrl?: string;
}

export interface HarvestRecord {
  id: string;
  farmId: string;
  cropName: string; // e.g. "Lettuce", "Spinach", "Cabbage", "Radish"
  date: string; // e.g. "10 May 2025"
  quantityKg: number;
  quality: "Excellent" | "Good" | "Fair" | "Poor";
  fieldLocation: string;
  unitPriceNpr: number;
  totalValueNpr: number;
  buyerOrStorage: string;
  photoUrl: string;
  notes?: string;
}

export interface TimeActivityLog {
  id: string;
  farmId: string;
  activityName: string; // e.g. "Irrigation - Drip System"
  category: "irrigation" | "fertilizer" | "weeding" | "support" | "harvest" | "planting" | "scouting";
  date: string; // e.g. "Today, 15 May 2025"
  startTime: string; // "07:00 AM"
  endTime: string; // "07:45 AM"
  durationMinutes: number; // 45
  durationFormatted: string; // "00h 45m"
  workerName?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  farmId: string;
  name: string; // e.g. "Hybrid Tomato Seeds F1", "NPK 19:19:19", "Neem Oil Extract"
  category: "Seeds" | "Fertilizers" | "Pesticides" | "Tools & Gear" | "Packaging" | "Harvested Goods";
  quantity: number;
  unit: "kg" | "packets" | "Liters" | "units" | "bags";
  minThreshold: number;
  costNpr: number;
  storageLocation: string;
  expiryDate?: string;
  supplier?: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface WeatherDayForecast {
  dayName: string; // "Fri, 16 May"
  tempHigh: number;
  tempLow: number;
  condition: string; // "Sunny", "Partly Cloudy", "Rain Shower"
  icon: string;
  rainChance: number; // 20%
  humidity: number;
  windKmH: number;
}

export interface FarmSettingReminder {
  id: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  frequency: "Daily" | "Twice Daily" | "Weekly" | "Custom";
  time: string;
  iconName: string;
}
