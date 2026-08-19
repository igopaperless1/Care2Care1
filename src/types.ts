export type AccountType = "personal" | "family" | "professional" | "property" | "community";

export type PatientCategory = "Elderly" | "Kids" | "Sick/Ill" | "Wounded/Handicapped" | "General";

export interface WaterLog {
  id: string;
  amountMl: number;
  time: string;
  timestamp: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  takenToday: boolean;
  photoUrl?: string;
  purpose?: string;
  warnings?: string;
}

export interface VitalSign {
  id: string;
  timestamp: number;
  dateStr: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRateBpm: number;
  spO2Percent: number;
  temperatureF: number;
  bloodSugarMgDl: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  category: PatientCategory;
  avatarUrl: string;
  waterCurrentMl: number;
  waterGoalMl: number;
  waterLogs: WaterLog[];
  medications: Medication[];
  vitals: VitalSign[];
  mood: "Great" | "Calm" | "Tired" | "Anxious" | "In Pain";
  sleepHours: number;
  caregiverNotes: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  lastCheckIn: string;
  status: "Stable" | "Attention Needed" | "Critical";
  relationship?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: "Medical" | "Personal" | "Financial" | "Property" | "Legal" | "Education";
  fileType: string;
  uploadDate: string;
  encrypted: boolean;
  contentSnippet?: string;
  tags?: string[];
}

export interface MemoEntry {
  id: string;
  authorName: string;
  relation: string;
  message: string;
  favoriteMemory: string;
  favoriteSong: string;
  sticker: string;
  date: string;
  voiceNoteUrl?: string;
}

export interface CalendarConversion {
  gregorianDate: string;
  vikramSambat: string;
  nepalSambat: string;
  islamicHijri: string;
  chineseLunar: string;
  hebrew: string;
  ethiopian: string;
  persianSolar: string;
  julian: string;
  coptic: string;
  mayan: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: "Doctor" | "Nurse" | "Caregiver" | "Physiotherapist" | "Plumber" | "Electrician" | "Handyman" | "Tutor";
  rating: number;
  reviewsCount: number;
  phone: string;
  availableNow: boolean;
  location: string;
  hourlyRate: string;
}

export interface VehicleItem {
  id: string;
  name: string;
  plateNumber: string;
  vehicleType: "Car" | "Motorcycle" | "Tractor / Farm Vehicle" | "Truck" | "EV";
  nextServiceDate: string;
  fuelStatus: string;
  pucExpiry: string;
  notes: string;
}

export interface FarmRecord {
  id: string;
  plotName: string;
  cropType: string;
  areaAcres: number;
  wateringIntervalDays: number;
  fertilizerUsed: string;
  expectedHarvestDate: string;
  notes: string;
}

export interface FinancialRecord {
  id: string;
  title: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  accountMode: "personal" | "professional";
}

export interface PetItem {
  id: string;
  name: string;
  species: "Dog" | "Cat" | "Bird" | "Livestock" | "Other";
  breed: string;
  ageYears: number;
  vaccinationStatus: string;
  lastVetVisit: string;
  medicationNotes: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  phone: string;
  healthCategory: "General" | "Elderly" | "Kids" | "Sick/Ill" | "Special Needs";
  status: "Healthy" | "Care Required" | "Medication Active";
  notes: string;
}

// ============================================================
// NUTRITION & FOOD TRACKER - DATA MODELS
// ============================================================

export interface FoodItem {
  id: string;
  userId: string;
  name: string;
  brand: string;
  calories: number;           // kcal per serving
  protein: number;            // grams per serving
  carbs: number;              // grams per serving
  fats: number;               // grams per serving
  fiber: number;              // grams per serving
  sugar: number;              // grams per serving
  sodium: number;             // mg per serving
  servingSize: string;        // e.g., "1 cup", "100g"
  servingUnit: string;        // g, ml, cup, tbsp, etc.
  barcode: string;            // Optional barcode
  isCustom: boolean;          // User-created or from database
  category?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealLog {
  id: string;
  userId: string;
  date: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Beverage";
  foodId: string;             // Reference to FoodItem or custom
  foodName: string;           // Custom name if not in database
  quantity: number;           // Number of servings
  servingSize: string;        // e.g., "1 cup", "100g"
  calories: number;           // Auto-calculated or manual
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  notes: string;
  photo: string;
  mealTime: string;           // Time of meal
  location: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionWaterLog {
  id: string;
  userId: string;
  date: string;
  amountMl: number;
  time: string;
  source: string;             // Bottle, Glass, Tap, etc.
  notes: string;
  createdAt: string;
}

export interface NutritionGoal {
  id: string;
  userId: string;
  dailyCalories: number;
  dailyProtein: number;       // grams
  dailyCarbs: number;         // grams
  dailyFats: number;          // grams
  dailyFiber: number;         // grams
  dailyWater: number;         // ml
  weeklyMealPlan?: string;     // JSON or reference
  dietType?: string;
  allergies?: string[];
  avoidFoods?: string[];
  breakfastReminder?: boolean;
  lunchReminder?: boolean;
  dinnerReminder?: boolean;
  waterReminder?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyNutritionSummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  totalWater: number;
  meals: MealLog[];
  waterLogs: NutritionWaterLog[];
}

// ============================================================
// FINANCE & BUDGET TRACKER - DATA MODELS
// ============================================================

export interface FinancialTransaction {
  id: string;
  userId: string;
  type: "income" | "expense" | "transfer";
  category: string;
  subCategory: string;
  amount: number;
  currency: string;              // Default: USD
  date: string;                  // YYYY-MM-DD
  description: string;
  paymentMethod: string;         // Cash, Card, Bank Transfer, UPI, etc.
  merchant: string;              // Where transaction occurred
  receiptPhoto: string;          // URL to photo
  isRecurring: boolean;
  recurrencePattern: string;     // Daily, Weekly, Monthly, Yearly
  recurrenceEndDate: string;     // Optional
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialBudget {
  id: string;
  userId: string;
  category: string;
  subCategory: string;
  amount: number;
  spent: number;
  month: string;                 // MM-YYYY or YYYY-MM
  year: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string;
  priority: "High" | "Medium" | "Low";
  category: string;              // Emergency, Vacation, House, etc.
  monthlyContribution: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialRecurringTransaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  frequency: "Daily" | "Weekly" | "Monthly" | "Yearly";
  dayOfMonth: number;            // For monthly
  dayOfWeek: number;             // For weekly
  startDate: string;
  endDate: string;               // Optional
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyFinancialSummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;           // (Savings / Income) * 100
  budgetCompliance: number;      // % of budgets met
  topSpendingCategory: string;
  topIncomeCategory: string;
  cashFlow: number;
  createdAt: string;
}

// ============================================================
// GARDEN & FARM MANAGEMENT - DATA MODELS
// ============================================================

export interface GardenFarm {
  id: string;
  userId: string;
  name: string;
  type: string;                    // Vegetable, Flower, Herb, Farm, etc.
  location: string;
  area: number;                    // Square feet / Acres
  areaUnit: string;                // sq ft, acres, hectares
  soilType: string;                // Sandy, Clay, Loamy, etc.
  phLevel: number;                 // 0-14
  sunlight: string;                // Full Sun, Partial, Shade
  waterSource: string;             // Tap, Well, Rainwater
  notes: string;
  photos: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlantCrop {
  id: string;
  gardenId: string;
  name: string;
  type: string;                    // Vegetable, Fruit, Herb, Flower, Grain
  variety: string;                 // Specific variety
  quantity: number;                // Number of plants/seeds
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate: string;
  status: string;                  // Seedling, Growing, Flowering, Harvesting, Done
  healthStatus: string;            // Healthy, Needs Attention, Pests, Diseased
  growthNotes: string;
  wateringFrequency: string;       // Daily, Weekly, etc.
  fertilizerSchedule: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlantingRecord {
  id: string;
  plantId: string;
  gardenId: string;
  date: string;
  action: string;                  // Sowed, Transplanted, Pruned, Fertilized
  description: string;
  quantity: number;
  notes: string;
  photos: string[];
  createdAt: string;
}

export interface IrrigationLog {
  id: string;
  gardenId: string;
  date: string;
  duration: number;                // Minutes
  method: string;                  // Drip, Sprinkler, Manual, Rain
  volume: number;                  // Liters/Gallons
  source: string;                  // Tap, Well, Rainwater
  notes: string;
  createdAt: string;
}

export interface FertilizerLog {
  id: string;
  gardenId: string;
  plantId?: string;                 // Optional - specific plant
  date: string;
  name: string;                    // Fertilizer name
  type: string;                    // Organic, Chemical, Compost
  quantity: number;                // Kg / Liters
  method: string;                  // Spread, Spray, Mixed
  notes: string;
  createdAt: string;
}

export interface PestControlLog {
  id: string;
  gardenId: string;
  plantId?: string;                 // Optional - specific plant
  date: string;
  pestType: string;                // Aphids, Caterpillars, etc.
  severity: string;                // Low, Medium, High
  treatment: string;               // Organic, Chemical, Natural
  treatmentMethod: string;         // Spray, Sprinkle, Remove
  notes: string;
  photos: string[];
  createdAt: string;
}

export interface HarvestLog {
  id: string;
  gardenId: string;
  plantId: string;
  date: string;
  quantity: number;
  unit: string;                    // kg, lbs, pieces, bunches
  quality: string;                 // Excellent, Good, Fair, Poor
  notes: string;
  photos: string[];
  createdAt: string;
}

export interface GardenExpense {
  id: string;
  gardenId: string;
  date: string;
  category: string;                // Seeds, Soil, Tools, Fertilizer, etc.
  amount: number;
  description: string;
  receiptPhoto: string;
  notes: string;
  createdAt: string;
}

export interface CalendarSystemInfo {
  id: string;
  name: string;
  code: string;                 // Unique code for conversion
  type: 'solar' | 'lunar' | 'lunisolar' | 'historical' | 'other';
  region: string;               // Where primarily used
  description: string;
  epoch: string;                // Year 0 reference
  daysInWeek?: number;
}

export interface CalendarDateResult {
  year: number;
  month: number;
  day: number;
  monthName: string;
  dayName: string;
  formatted: string;
  dayOfWeek: string;
  weekNumber: number;
  dayOfYear: number;
  isLeapYear: boolean;
  era: string;
  lunarPhase?: string;
  zodiac?: string;
  notes?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
}

export interface CalendarHoliday {
  id: string;
  name: string;
  calendarSystem: string;
  date: string;                // In that calendar system or MM-DD
  description: string;
  type: string;                // Religious, National, Cultural
  region: string;
}

export interface CalendarFestival {
  id: string;
  name: string;
  calendarSystem: string;
  date: string;
  description: string;
  traditions: string[];
  region: string;
}

export interface CalendarConversionHistoryItem {
  id: string;
  userId?: string;
  fromSystem: string;
  toSystem: string;
  fromDate: string;
  toDate: string;
  formattedFrom: string;
  formattedTo: string;
  convertedAt: string;
}

// ============================================================
// SOS & EMERGENCY - DATA MODELS
// ============================================================

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;          // Family, Friend, Neighbor, Doctor, etc.
  phone: string;
  email: string;
  address: string;
  priority: 'primary' | 'secondary' | 'tertiary';
  isActive: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SOSAlert {
  id: string;
  userId: string;
  type: string;                  // Medical, Fire, Police, Accident, etc.
  timestamp: string;
  location: string;
  latitude: number;
  longitude: number;
  message: string;
  recipients: string[];          // Emergency contact IDs
  status: 'pending' | 'sent' | 'failed' | 'responded';
  response: string;              // Response from recipient
  responseTime: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyService {
  id: string;
  name: string;
  type: string;                  // Police, Ambulance, Fire, Hospital, Helpline
  phone: string;
  alternativePhone: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;              // From user's location
  operatingHours: string;
  is24Hours: boolean;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  steps: string[];               // Step-by-step safety instructions
  emergencyContacts: string[];   // Contact IDs
  emergencyMessage: string;
  locationDetails: string;
  escapeRoutes: string[];
  safePlaces: string[];
  importantDocuments: string[];
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyMessageTemplate {
  id: string;
  userId: string;
  name: string;
  type: string;                  // Medical, Fire, Police, etc.
  subject: string;
  message: string;
  includeLocation: boolean;
  includeTime: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocationShare {
  id: string;
  userId: string;
  contactId: string;
  startedAt: string;
  endedAt: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
  address: string;
  sharingMethod: 'sms' | 'email' | 'whatsapp' | 'app';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// INVENTORY MANAGEMENT DATA MODELS
// ============================================================

export interface InventoryItem {
  id: string;
  userId: string;
  businessId: string;               // Reference to business
  name: string;                     // Item name (Required)
  category: string;                 // Item category (Required)
  subCategory?: string;
  sku: string;                      // Stock Keeping Unit
  barcode: string;                  // Barcode number
  description?: string;
  
  // Unit & Quantity
  unitType: string;                 // Weight, Number, Length, Size, Carton, Liquid, Area, Custom
  unit: string;                     // kg, gm, piece, meter, etc.
  currentStock: number;             // Current quantity (Required)
  minimumStock: number;             // Minimum stock level (Required)
  maximumStock?: number;            // Maximum stock level
  reorderPoint: number;             // When to reorder
  
  // Pricing
  costPrice: number;                // Cost per unit (Required)
  sellingPrice: number;             // Selling price per unit (Required)
  wholesalePrice?: number;          // Wholesale price
  discountRate?: number;            // Discount percentage
  taxRate?: number;                 // Tax percentage
  
  // Supplier
  supplierName?: string;
  supplierContact?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  supplierAddress?: string;
  
  // Tracking
  reorderQuantity?: number;         // Quantity to reorder
  reorderReminder?: boolean;        // Enable reorder reminder
  reorderReminderLevel?: number;    // Stock level to trigger reminder
  location?: string;                // Warehouse/Shelf location
  expiryDate?: string;              // Expiry date
  batchNumber?: string;             // Batch number
  manufacturingDate?: string;
  warrantyPeriod?: string;
  
  // Additional
  images?: string[];                // Item images
  notes?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryUsageLog {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  category: string;
  quantityReduced: number;
  unit: string;
  previousStock: number;
  newStock: number;
  date: string;
  time: string;
  reason: string;
  updatedBy?: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  userId: string;
  type: 'in' | 'out' | 'adjustment' | 'return' | 'damage';
  quantity: number;
  unit: string;
  previousStock: number;
  newStock: number;
  date: string;
  time: string;
  reference?: string;               // Invoice/Order number
  notes?: string;
  proofPhoto?: string;
  signature?: string;
  createdBy?: string;
  createdAt: string;
}

export interface InventorySupplier {
  id: string;
  userId: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  category?: string;
  itemsSupplied?: string[];
  paymentTerms?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCategory {
  id: string;
  userId: string;
  name: string;
  parentId?: string;                // For sub-categories
  description?: string;
  icon?: string;
  color?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAlert {
  id: string;
  userId: string;
  itemId: string;
  type: 'low_stock' | 'reorder' | 'expiry' | 'custom';
  message: string;
  triggeredAt: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
}

export interface InventorySummary {
  totalItems: number;
  totalValue: number;               // (currentStock * costPrice)
  totalSellingValue: number;        // (currentStock * sellingPrice)
  lowStockItems: number;
  outOfStockItems: number;
  categories: { name: string; count: number }[];
  topSellingItems: { name: string; quantity: number }[];
  dailySummary: { date: string; in: number; out: number }[];
  weeklySummary: { week: string; in: number; out: number }[];
  monthlySummary: { month: string; in: number; out: number }[];
}

// ============================================================
// MENSTRUAL CYCLE TRACKER DATA MODELS
// ============================================================

export interface CycleRecord {
  id: string;
  userId: string;
  startDate: string;                    // Period start date (YYYY-MM-DD)
  endDate: string;                      // Period end date (YYYY-MM-DD)
  cycleLength: number;                  // Total cycle length (days)
  periodLength: number;                 // Period duration (days)
  flowIntensity: 'Light' | 'Medium' | 'Heavy'; // Flow intensity
  flowColor?: string;                   // Bright Red, Dark Brown, Pink, etc.
  clots?: boolean;
  painLevel: number;                    // 1-10
  symptoms: string[];                   // Cramps, Headache, Fatigue, etc.
  mood: string[];                       // Happy, Sad, Irritable, Anxious, etc.
  basalTemperature?: number;            // °C
  weight?: number;                      // kg
  bloodPressure?: string;               // e.g. "120/80"
  medications?: string[];
  foodCravings?: string[];
  exerciseLevel?: string;               // Low, Medium, High
  sleepQuality?: string;                // Poor, Fair, Good, Excellent
  sexualActivity?: boolean;
  protected?: boolean;
  notes?: string;
  isPregnant?: boolean;
  pregnancyWeeks?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CyclePrediction {
  userId: string;
  nextPeriodStart: string;              // Predicted next period start
  nextPeriodEnd: string;                // Predicted next period end
  ovulationDate: string;                // Predicted ovulation date
  fertileWindowStart: string;           // Fertile window start
  fertileWindowEnd: string;             // Fertile window end
  lutealPhaseStart: string;             // Luteal phase start
  confidence: number;                   // Prediction confidence %
  cyclePattern: 'Regular' | 'Irregular' | 'Variable';
  averageCycleLength: number;
  shortestCycle: number;
  longestCycle: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenstrualSymptom {
  id: string;
  userId: string;
  date: string;
  cycleId?: string;
  type: 'Physical' | 'Emotional' | 'Behavioral';
  name: string;
  severity: number;                     // 1-5
  notes?: string;
  createdAt: string;
}

export interface MenstrualMedication {
  id: string;
  userId: string;
  name: string;
  type: 'Hormonal' | 'Pain Relief' | 'Contraceptive' | 'Supplement' | 'Other';
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FertilityTracking {
  id: string;
  userId: string;
  date: string;
  ovulationTest?: 'Positive' | 'Negative' | 'Inconclusive';
  cervicalMucus?: 'Dry' | 'Sticky' | 'Creamy' | 'Egg-white';
  cervicalPosition?: 'Low' | 'Medium' | 'High';
  basalTemperature?: number;
  opkResult?: 'Positive' | 'Negative';
  notes?: string;
  createdAt: string;
}

export interface MenstrualReminder {
  id: string;
  userId: string;
  type: 'Period' | 'Ovulation' | 'Pill' | 'Check-up' | 'Log';
  title: string;
  description?: string;
  daysBefore: number;                   // Days before event
  time: string;                         // HH:MM
  isEnabled: boolean;
  isRecurring: boolean;
  recurrencePattern?: 'Monthly' | 'Daily' | 'Weekly';
  notificationType?: 'Push' | 'Email' | 'SMS';
  sound?: string;
  vibration?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PregnancyRecord {
  id: string;
  userId: string;
  startDate: string;                    // LMP Date
  dueDate: string;                      // Estimated due date
  currentWeek: number;
  currentTrimester: number;             // 1, 2, 3
  weightGain?: number;
  bloodPressure?: string;
  fetalHeartbeat?: string;
  ultrasoundDate?: string;
  doctorName?: string;
  hospital?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenstrualUserSettings {
  userId: string;
  averageCycleLength: number;           // Default 28
  periodLength: number;                 // Default 5
  ovulationDay: number;                 // Default 14
  lutealPhaseLength: number;            // Default 14
  privacyMode: 'Private' | 'Partner' | 'Doctor';
  partnerName?: string;
  partnerEmail?: string;
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// HYBRID STORAGE - COMPLETE DATA MODELS
// ============================================================

export interface StorageFile {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'image' | 'video' | 'audio' | 'document' | 'backup';
  fileSize: number;                 // Bytes
  mimeType: string;
  localPath: string;                // Local file path
  localUri: string;                 // Content URI for access / base64 preview
  cloudId: string;                  // Google Drive file ID
  cloudUrl: string;                 // Google Drive shareable link
  cloudFolder: string;              // Folder name in Drive
  thumbnail?: string;               // Thumbnail base64 or URL
  hash?: string;                    // File hash for deduplication
  metadata?: Record<string, any>;
  tags?: string[];
  isBackedUp: boolean;
  isDeleted: boolean;               // Soft delete flag
  createdAt: string;
  updatedAt: string;
}

export interface StorageSettings {
  userId: string;
  storageType: 'local' | 'cloud' | 'hybrid';
  defaultLocation: 'internal' | 'external' | 'cloud';
  autoBackup: boolean;
  autoBackupNetwork: 'wifi' | 'cellular' | 'both';
  autoBackupFrequency: 'realtime' | 'daily' | 'weekly' | 'manual';
  cloudFolderName: string;
  maxLocalStorage: number;          // In MB
  maxCloudStorage: number;          // In MB
  compressImages: boolean;
  compressQuality: number;          // 1-100
  keepLocalCopy: boolean;
  keepCloudCopy: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackupJob {
  id: string;
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  type: 'manual' | 'auto' | 'scheduled';
  progress: number;                 // 0-100
  totalFiles: number;
  uploadedFiles: number;
  failedFiles: number;
  startTime: string;
  endTime?: string;
  files: StorageFile[];
  error?: string;
  logs?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RestoreJob {
  id: string;
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;                 // 0-100
  totalFiles: number;
  restoredFiles: number;
  failedFiles: number;
  startTime: string;
  endTime?: string;
  files: StorageFile[];
  error?: string;
  logs?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GoogleDriveAuth {
  userId: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: string;
  email: string;
  name: string;
  isConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// SERVICE SETUP & CUSTOMIZATION TYPES
// ============================================================

export interface ServiceFeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface ServiceCustomOption {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'boolean';
  value: any;
  options?: string[]; // for select
  unit?: string;
}

export interface ServiceSetupConfig {
  serviceId: string;               // e.g. 'water', 'finance', 'medicine', 'menstrual', etc.
  serviceName: string;
  presetTemplate: string;           // e.g. 'basic', 'pro', 'elderly', 'minimal'
  isEnabled: boolean;
  features: ServiceFeatureToggle[];
  customOptions: ServiceCustomOption[];
  reminderFrequency: string;       // e.g. 'realtime', 'daily', 'custom'
  notificationChannels: {
    inApp: boolean;
    sound: boolean;
    push: boolean;
    sms: boolean;
    email: boolean;
  };
  storageMode: 'local' | 'cloud' | 'hybrid';
  updatedAt: string;
}


// ============================================================
// PASSWORD MANAGEMENT SERVICE DATA MODELS
// ============================================================

export interface PasswordEntry {
  id: string;
  userId: string;
  platformName: string;
  platformUrl: string;
  username: string;
  password: string; // Encrypted string
  category: string; // Email, Banking, Social, Professional, Shopping, Utilities, Websites, Other
  notes: string;
  passphrase?: string; // Seed phrase or recovery passphrase
  imageUrl?: string; // Screenshot or captured image URL
  customDetails?: Array<{ id: string; label: string; value: string }>; // Dynamic multi-detail filler fields
  icon: string;
  color: string;
  isFavorite: boolean;
  isActive: boolean;
  lastUsed: string;
  expiryDate: string;
  strength: 'weak' | 'medium' | 'strong';
  createdAt: string;
  updatedAt: string;
}

export interface PasswordHistory {
  id: string;
  passwordId: string;
  oldPassword: string;
  newPassword: string;
  changedAt: string;
  changedReason: string;
  createdAt: string;
}

export interface MasterPasswordSettings {
  userId: string;
  isEnabled: boolean;
  masterPassword: string; // Hash
  biometricEnabled: boolean;
  biometricType: 'fingerprint' | 'face_id' | 'none';
  autoLockMinutes: number;
  lastUnlockedAt: string;
  recoveryEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordShare {
  id: string;
  passwordId: string;
  sharedWithUserId: string;
  sharedWithEmail?: string;
  permission: 'view' | 'edit' | 'manage';
  sharedAt: string;
  expiresAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordCategory {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityAuditLog {
  id: string;
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AppState {

  onboardingStep: number; // 0 = Welcome, 1 = Role Selection, 2 = Module Selection, 3 = Essentials, 4 = Dashboard Ready
  activeModules: string[];
  isOnboardingComplete: boolean;
  selectedRoles: string[];
  primaryMotivation: string;
  essentialsData?: {
    startingBalance?: number;
    monthlyBudget?: number;
    firstMedicineName?: string;
    firstMedicineDosage?: string;
    waterGoalMl?: number;
    staffCount?: number;
  };
}

// 21-Day Gamification & Adaptive Behavioral Engine Types
export type ChallengeCategory =
  | "Personal Growth"
  | "Health"
  | "Mental Health"
  | "Learning"
  | "Lifestyle"
  | "Productivity"
  | "Self Love"
  | "Positivity"
  | "Recovery"
  | "Mindfulness"
  | "Fitness"
  | "Bad Habits to Avoid"
  | "Physical"
  | "Custom";

export type BehaviorDirection =
  | "build"
  | "strengthen"
  | "maintain"
  | "reduce"
  | "pause"
  | "stop"
  | "replace"
  | "control"
  | "recover"
  | "custom";

export type ChallengeArchetype =
  | "habit"
  | "fitness"
  | "nutrition"
  | "mindfulness"
  | "productivity"
  | "learning"
  | "social"
  | "addiction"
  | "screen_time"
  | "finance"
  | "sleep"
  | "custom";

export type MeasurementType =
  | "count"
  | "duration"
  | "quantity"
  | "frequency"
  | "interval"
  | "time_window"
  | "percentage"
  | "yes_no"
  | "scale"
  | "free_response";

export interface UrgeLog {
  id: string;
  challengeId: string;
  timestamp: string;
  dayNumber: number;
  urgeIntensity: number; // 0-10
  triggerType: string;
  triggerDescription?: string;
  actionTaken: "delay" | "alternative" | "reflected" | "episode_occurred";
  delayMinutes?: number;
  alternativeAction?: string;
  reflectionNote?: string;
  isOvercome: boolean;
  recoveryPointsEarned: number;
}

export interface TriggerProfile {
  id: string;
  challengeId: string;
  triggerType: string;
  description: string;
  count: number;
  lastOccurred?: string;
  hourlyDistribution?: Record<number, number>; // 0-23 hours count
  dominantEmotion?: string;
}

export interface DailyBehaviorMetric {
  id: string;
  userId?: string;
  challengeId: string;
  date: string; // YYYY-MM-DD
  dayNumber: number;
  goalsTotal: number;
  goalsCompleted: number;
  completionRate: number; // 0 - 100
  urgesReported: number;
  urgesOvercome: number;
  averageUrgeIntensity: number; // 0 - 10
  recoveryActionsCompleted: number;
  pointsEarned: number;
  createdAt: string;
}

export interface WeeklyBehaviorSummary {
  weekStartDate: string;
  weekEndDate: string;
  totalActiveChallenges: number;
  overallCompletionPercentage: number;
  completionTrendVsLastWeek: number; // e.g. +12%
  totalUrgesLogged: number;
  totalUrgesOvercome: number;
  averageUrgeIntensity: number;
  topTriggers: { triggerType: string; count: number }[];
  topInterventions: { name: string; count: number }[];
  totalRecoveryPoints: number;
  dailyBreakdown: {
    date: string;
    dayLabel: string;
    completedPercentage: number;
    urgesCount: number;
  }[];
}

export interface HourlyUrgeHeatmapPoint {
  hour: number; // 0-23
  hourLabel: string; // "12 AM", "1 AM", ...
  urgeCount: number;
  intensityAvg: number;
  dominantTrigger?: string;
}

export interface RecoveryAction {
  id: string;
  title: string;
  description: string;
  category: "reflection" | "breathing" | "trigger_audit" | "micro_delay" | "hydration_stretch" | "environment_shift";
  durationMinutes: number;
}

export interface ChallengeDayTask {
  dayNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
  scratchedAt?: string;
  userNotes?: string;
  objective?: string;
  whyItMatters?: string;
  estimatedTimeMinutes?: number;
  measurementType?: MeasurementType;
  targetValue?: string | number;
  possibleRecoveryAction?: string;
  alternativeAction?: string;
  reflectionPrompt?: string;
  urgeStateEnabled?: boolean;
  recoveryActionCompleted?: boolean;
  uniquePenalty?: {
    title: string;
    description: string;
    type: "pushups" | "squats" | "meditation" | "hydration" | "walk" | "freeze_token" | "reading" | "custom";
    repsOrMins: number;
  };
}

export interface RestrictedContentConsent {
  id: string;
  userId?: string;
  category: "adult_content" | "substances" | "sexual_compulsion" | "general_sensitive";
  isAdult: boolean;
  ageConfirmed: boolean;
  consentGivenAt: string;
  minimumAge: number;
  status: "active" | "denied" | "revoked";
  userAgent?: string;
}

export interface HabitChallenge {
  id: string;
  userId?: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  currentDay: number;
  totalDays: number;
  status: "Active" | "Not Started" | "Completed" | "Paused";
  streakCount: number;
  lastCompletedDate?: string;
  icon: string;
  color: string;
  missedDays: number;
  completedDays: number[];
  tasks?: ChallengeDayTask[];
  penaltyCount?: number;
  createdAt?: string;

  // Behavioral Engine Evolutions
  behaviorDirection?: BehaviorDirection;
  challengeArchetype?: ChallengeArchetype;
  measurementType?: MeasurementType;
  baselineDescription?: string;
  baselineValue?: string | number;
  dailyTimeAvailableMinutes?: number;
  safetyPathwayText?: string;
  triggers?: string[];
  urgeInterventions?: string[];
  initialDelayMinutes?: number;
  progressionStyle?: "gradual" | "balanced" | "aggressive";
  isPrivate?: boolean;
  discreetNotifications?: boolean;
  urgeLogs?: UrgeLog[];
  triggerProfiles?: TriggerProfile[];
  replacementBehavior?: string;
  lastEpisodeTimestamp?: string;
  currentIntervalMinutes?: number;
  recoveryActionTaken?: string;

  // Age-Gating & Safety Protection Architecture
  isSensitive?: boolean;
  sensitiveCategory?: "adult_content" | "substances" | "general_sensitive" | "none";
  requiresAgeGate?: boolean;
  isAgeVerified?: boolean;
  isPinProtected?: boolean;
  pinCode?: string;
  isLocked?: boolean;

  customPenaltyType?: "pushups" | "squats" | "meditation" | "hydration" | "walk" | "freeze_token" | "cold_shower" | "custom";
  customPenaltyRepsOrMins?: number;
  customPenaltyText?: string;
  dailyPenalties?: Record<number, { title: string; description: string; type: string; repsOrMins: number }>;
  likesCount?: number;
  isLiked?: boolean;
  notificationsEnabled?: boolean;
  reminderTime?: string;
  notes?: Record<number, string>;

  // Lifelong Continuation Architecture (Post-Day 21 Journey)
  isLifelongContinuation?: boolean;
  lifelongDayCount?: number;
  formationCompletedAt?: string;
  lifelongLogsCount?: number;
  lifelongHistory?: Array<{
    day: number;
    date: string;
    completed: boolean;
    note?: string;
    reductionValue?: string | number;
  }>;
  reductionGoalTarget?: string | number;
  daysWithinTargetCount?: number;
  bestSmokeFreeIntervalMinutes?: number;
}

export interface ChallengePenalty {
  id: string;
  userId?: string;
  challengeId: string;
  challengeTitle?: string;
  dayNumber?: number;
  penaltyType: "pushups" | "squats" | "meditation" | "hydration" | "walk" | "freeze_token" | "cold_shower" | "reading" | "custom";
  penaltyDescription: string;
  repsOrMins?: number;
  isPaid: boolean;
  dateIssued: string;
  datePaid?: string;
}

export interface ChallengeQuestTask {
  id: string;
  title: string;
  coinReward: number;
  targetCount: number;
  currentCount: number;
  isCollected: boolean;
  actionKey?: string;
}

// ============================================================
// DASHBOARD & HOME DISPLAY PREFERENCES - DATA MODELS
// ============================================================

export interface DashboardTodayAttentionFilters {
  medicine: boolean;
  challenges: boolean;
  water_habits: boolean;
  finance_bills: boolean;
  calendar_events: boolean;
  staff_pending_tasks: boolean;
}

export interface DashboardContinueResumeLogic {
  enabled_services: string[];
  max_items: number;
}

export interface DashboardPinnedServices {
  custom_list: string[];
  max_items: number;
  auto_update?: boolean;
}

export interface DashboardChallengeVisibility {
  show_challenge_button: boolean;
  show_streak_daily: boolean;
}

export interface DashboardPreferences {
  today_attention_filters: DashboardTodayAttentionFilters;
  continue_resume_logic: DashboardContinueResumeLogic;
  pinned_services: DashboardPinnedServices;
  challenge_visibility: DashboardChallengeVisibility;
  sync_sub_accounts?: boolean;
}

export const DEFAULT_PERSONAL_DASHBOARD_PREFS: DashboardPreferences = {
  today_attention_filters: {
    medicine: true,
    challenges: true,
    water_habits: true,
    finance_bills: false,
    calendar_events: false,
    staff_pending_tasks: false
  },
  continue_resume_logic: {
    enabled_services: ["mood", "habit", "finance", "water", "yoga", "vitals"],
    max_items: 2
  },
  pinned_services: {
    custom_list: ["yoga", "medicine", "finance", "mood", "vitals", "water"],
    max_items: 6,
    auto_update: true
  },
  challenge_visibility: {
    show_challenge_button: true,
    show_streak_daily: true
  },
  sync_sub_accounts: false
};

export const DEFAULT_PROFESSIONAL_DASHBOARD_PREFS: DashboardPreferences = {
  today_attention_filters: {
    medicine: false,
    challenges: false,
    water_habits: false,
    finance_bills: true,
    calendar_events: true,
    staff_pending_tasks: true
  },
  continue_resume_logic: {
    enabled_services: ["finance", "staff_payroll", "inventory", "contracts", "jobs", "custom_store"],
    max_items: 2
  },
  pinned_services: {
    custom_list: ["finance", "staff_payroll", "inventory", "contracts", "jobs", "paperless"],
    max_items: 6,
    auto_update: true
  },
  challenge_visibility: {
    show_challenge_button: false,
    show_streak_daily: false
  },
  sync_sub_accounts: true
};

export const DEFAULT_SUBACCOUNT_DASHBOARD_PREFS: DashboardPreferences = {
  today_attention_filters: {
    medicine: true,
    challenges: true,
    water_habits: true,
    finance_bills: false,
    calendar_events: true,
    staff_pending_tasks: false
  },
  continue_resume_logic: {
    enabled_services: ["medicine", "vitals", "mood", "water", "elderly", "kids"],
    max_items: 2
  },
  pinned_services: {
    custom_list: ["medicine", "vitals", "water", "mood", "elderly", "sos"],
    max_items: 6,
    auto_update: true
  },
  challenge_visibility: {
    show_challenge_button: true,
    show_streak_daily: true
  },
  sync_sub_accounts: false
};

// ============================================================================
// LIFELONG PROGRESSION, CARE ARCHETYPES & 21-DAY STABILIZATION TYPES
// ============================================================================

export type ServiceArchetype =
  | "nourish"          // Water, Nutrition, Sleep, Exercise, Walking (Build and maintain)
  | "heal_protect"     // Mood, Mental wellbeing, Medicine, Care, Vitals (Monitor and support)
  | "build_grow"       // Finance, Learning, Career, Productivity, Farm (Accumulate and improve)
  | "order_protect";   // Vehicles, Property, Pets, Family, Relationships, Passwords (Maintain and prevent neglect)

export type CareLifecycleStage =
  | "ignite"     // Days 1-21: Habit formation, progressive daily tasks, momentum
  | "stabilize"  // Days 22-60: Consistency calendar, increasing independence, smart reminders
  | "integrate"  // Day 61+: Lifelong maintenance, passive health score, minimal UI
  | "recovery"   // Gentle reset: 3-day or 7-day supportive restart when consistency slips
  | "review";    // Milestone review: 7d, 14d, 21d, 60d, quarterly

export interface LifelongServiceProfile {
  serviceId: string;
  serviceName: string;
  archetype: ServiceArchetype;
  stage: CareLifecycleStage;
  dayInCurrentStage: number;
  totalActiveDays: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  consistencyScorePercent: number; // 0 - 100%
  primaryGoalText: string;
  dailyTargetLabel: string;
  dailyTargetUnit: string;
  dailyTargetValue: number;
  activeChallengeId?: string;
  careTone: "supportive" | "gentle" | "empowering";
  milestoneHistory: {
    milestoneDay: number; // 7, 14, 21, 60, 90, 365
    completedAt: string;
    stage: CareLifecycleStage;
    celebrationNote: string;
  }[];
}

export interface LifelongSetupConfig {
  serviceId: string;
  goal: string;
  currentBaseline: string;
  targetValue: number;
  targetUnit: string;
  frequency: "daily" | "weekdays" | "weekends" | "multiple_daily" | "weekly" | "custom";
  preferredTime: string; // e.g. "08:00" or "morning"
  reminderEnabled: boolean;
  reminderStyle: "gentle" | "motivational" | "minimal" | "direct" | "encouraging";
  careArchetype: ServiceArchetype;
}


