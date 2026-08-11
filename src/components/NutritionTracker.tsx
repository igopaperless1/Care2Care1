import React, { useState, useEffect, useMemo } from "react";
import {
  Utensils,
  Plus,
  Search,
  Droplets,
  Barcode,
  BarChart3,
  Calendar,
  Settings,
  Trash2,
  Edit3,
  Share2,
  Download,
  Check,
  X,
  Star,
  Camera,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  FileText,
  RefreshCw,
  Info,
  Sliders,
  ChevronRight,
  Filter,
  Flame,
  Zap,
  Wheat,
  Beef,
  PieChart as PieIcon,
  Bell,
  ArrowRight
} from "lucide-react";
import { Patient, FoodItem, MealLog, NutritionWaterLog, NutritionGoal } from "../types";

// ==========================================
// SAFE HELPER FUNCTIONS FOR UNFAILING INTEGRITY
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
// PRE-DEFINED FOOD DATABASE (50+ ITEMS)
// ==========================================
const INITIAL_FOOD_DATABASE: FoodItem[] = [
  {
    id: "f1",
    userId: "system",
    name: "Apple (Medium)",
    brand: "Fresh Produce",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fats: 0.3,
    fiber: 4.4,
    sugar: 19,
    sodium: 2,
    servingSize: "1 medium (182g)",
    servingUnit: "piece",
    barcode: "890123456701",
    isCustom: false,
    category: "Fruits",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f2",
    userId: "system",
    name: "Grilled Chicken Breast",
    brand: "Organic Farms",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: "100g",
    servingUnit: "g",
    barcode: "890123456702",
    isCustom: false,
    category: "Protein",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f3",
    userId: "system",
    name: "Steamed White Rice",
    brand: "Golden Grain",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    fiber: 0.4,
    sugar: 0.1,
    sodium: 1,
    servingSize: "1 cup (158g)",
    servingUnit: "cup",
    barcode: "890123456703",
    isCustom: false,
    category: "Grains",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f4",
    userId: "system",
    name: "Brown Rice",
    brand: "Whole Grain Co.",
    calories: 216,
    protein: 5.0,
    carbs: 45,
    fats: 1.8,
    fiber: 3.5,
    sugar: 0.7,
    sodium: 10,
    servingSize: "1 cup (195g)",
    servingUnit: "cup",
    barcode: "890123456704",
    isCustom: false,
    category: "Grains",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f5",
    userId: "system",
    name: "Whole Large Egg",
    brand: "Farm Fresh",
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fats: 4.8,
    fiber: 0,
    sugar: 0.2,
    sodium: 71,
    servingSize: "1 large (50g)",
    servingUnit: "piece",
    barcode: "890123456705",
    isCustom: false,
    category: "Protein",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f6",
    userId: "system",
    name: "Avocado",
    brand: "Fresh Produce",
    calories: 240,
    protein: 3.0,
    carbs: 12,
    fats: 22,
    fiber: 10,
    sugar: 1.0,
    sodium: 11,
    servingSize: "1 medium (150g)",
    servingUnit: "piece",
    barcode: "890123456706",
    isCustom: false,
    category: "Fruits",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f7",
    userId: "system",
    name: "Plain Greek Yogurt (Non-fat)",
    brand: "Chobani",
    calories: 100,
    protein: 17,
    carbs: 6,
    fats: 0.7,
    fiber: 0,
    sugar: 6,
    sodium: 60,
    servingSize: "170g",
    servingUnit: "g",
    barcode: "890123456707",
    isCustom: false,
    category: "Dairy",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f8",
    userId: "system",
    name: "Raw Almonds",
    brand: "Blue Diamond",
    calories: 164,
    protein: 6.0,
    carbs: 6.1,
    fats: 14.2,
    fiber: 3.5,
    sugar: 1.2,
    sodium: 1,
    servingSize: "1 oz (28g)",
    servingUnit: "oz",
    barcode: "890123456708",
    isCustom: false,
    category: "Snacks",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f9",
    userId: "system",
    name: "Banana",
    brand: "Chiquita",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fats: 0.3,
    fiber: 3.1,
    sugar: 14.4,
    sodium: 1,
    servingSize: "1 medium (118g)",
    servingUnit: "piece",
    barcode: "890123456709",
    isCustom: false,
    category: "Fruits",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f10",
    userId: "system",
    name: "Rolled Oatmeal (Cooked)",
    brand: "Quaker",
    calories: 158,
    protein: 6.0,
    carbs: 27,
    fats: 3.2,
    fiber: 4.0,
    sugar: 1.1,
    sodium: 115,
    servingSize: "1 cup (234g)",
    servingUnit: "cup",
    barcode: "890123456710",
    isCustom: false,
    category: "Breakfast",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f11",
    userId: "system",
    name: "Atlantic Salmon Fillet",
    brand: "Sea Catch",
    calories: 206,
    protein: 22,
    carbs: 0,
    fats: 12.3,
    fiber: 0,
    sugar: 0,
    sodium: 61,
    servingSize: "100g",
    servingUnit: "g",
    barcode: "890123456711",
    isCustom: false,
    category: "Protein",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f12",
    userId: "system",
    name: "Whey Protein Isolate Powder",
    brand: "Optimum Nutrition",
    calories: 120,
    protein: 24,
    carbs: 1.5,
    fats: 1.0,
    fiber: 0,
    sugar: 1.0,
    sodium: 130,
    servingSize: "1 scoop (30g)",
    servingUnit: "scoop",
    barcode: "890123456712",
    isCustom: false,
    category: "Supplements",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f13",
    userId: "system",
    name: "Whole Wheat Bread",
    brand: "Nature's Own",
    calories: 80,
    protein: 4.0,
    carbs: 13,
    fats: 1.0,
    fiber: 2.0,
    sugar: 2.0,
    sodium: 130,
    servingSize: "1 slice (35g)",
    servingUnit: "slice",
    barcode: "890123456713",
    isCustom: false,
    category: "Grains",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f14",
    userId: "system",
    name: "Firm Tofu",
    brand: "House Foods",
    calories: 144,
    protein: 17,
    carbs: 3.0,
    fats: 8.5,
    fiber: 2.0,
    sugar: 1.0,
    sodium: 12,
    servingSize: "1/2 cup (126g)",
    servingUnit: "cup",
    barcode: "890123456714",
    isCustom: false,
    category: "Protein",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f15",
    userId: "system",
    name: "Fresh Broccoli (Steamed)",
    brand: "Fresh Produce",
    calories: 55,
    protein: 3.7,
    carbs: 11,
    fats: 0.6,
    fiber: 5.1,
    sugar: 2.2,
    sodium: 60,
    servingSize: "1 cup (150g)",
    servingUnit: "cup",
    barcode: "890123456715",
    isCustom: false,
    category: "Vegetables",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f16",
    userId: "system",
    name: "Sweet Potato (Baked)",
    brand: "Fresh Produce",
    calories: 103,
    protein: 2.3,
    carbs: 24,
    fats: 0.2,
    fiber: 3.8,
    sugar: 7.0,
    sodium: 41,
    servingSize: "1 medium (114g)",
    servingUnit: "piece",
    barcode: "890123456716",
    isCustom: false,
    category: "Vegetables",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f17",
    userId: "system",
    name: "Peanut Butter (Smooth)",
    brand: "Jif",
    calories: 188,
    protein: 8.0,
    carbs: 7.0,
    fats: 16,
    fiber: 2.0,
    sugar: 3.0,
    sodium: 140,
    servingSize: "2 tbsp (32g)",
    servingUnit: "tbsp",
    barcode: "890123456717",
    isCustom: false,
    category: "Snacks",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f18",
    userId: "system",
    name: "Blueberries (Fresh)",
    brand: "Driscoll's",
    calories: 84,
    protein: 1.1,
    carbs: 21,
    fats: 0.5,
    fiber: 3.6,
    sugar: 15,
    sodium: 1,
    servingSize: "1 cup (148g)",
    servingUnit: "cup",
    barcode: "890123456718",
    isCustom: false,
    category: "Fruits",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f19",
    userId: "system",
    name: "Quinoa (Cooked)",
    brand: "Ancient Harvest",
    calories: 222,
    protein: 8.1,
    carbs: 39,
    fats: 3.6,
    fiber: 5.2,
    sugar: 1.6,
    sodium: 13,
    servingSize: "1 cup (185g)",
    servingUnit: "cup",
    barcode: "890123456719",
    isCustom: false,
    category: "Grains",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f20",
    userId: "system",
    name: "Extra Virgin Olive Oil",
    brand: "Borges",
    calories: 119,
    protein: 0,
    carbs: 0,
    fats: 13.5,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    servingSize: "1 tbsp (14g)",
    servingUnit: "tbsp",
    barcode: "890123456720",
    isCustom: false,
    category: "Oils & Fats",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f21",
    userId: "system",
    name: "Canned Tuna in Water",
    brand: "Starkist",
    calories: 120,
    protein: 26,
    carbs: 0,
    fats: 1.0,
    fiber: 0,
    sugar: 0,
    sodium: 300,
    servingSize: "1 can (165g)",
    servingUnit: "can",
    barcode: "890123456721",
    isCustom: false,
    category: "Protein",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f22",
    userId: "system",
    name: "Dark Chocolate 70%",
    brand: "Lindt",
    calories: 170,
    protein: 2.2,
    carbs: 13,
    fats: 12,
    fiber: 3.1,
    sugar: 7.0,
    sodium: 6,
    servingSize: "3 squares (30g)",
    servingUnit: "squares",
    barcode: "890123456722",
    isCustom: false,
    category: "Snacks",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f23",
    userId: "system",
    name: "Black Coffee",
    brand: "Nescafe",
    calories: 2,
    protein: 0.3,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 5,
    servingSize: "1 cup (240ml)",
    servingUnit: "cup",
    barcode: "890123456723",
    isCustom: false,
    category: "Beverages",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f24",
    userId: "system",
    name: "Green Tea (Unsweetened)",
    brand: "Twinings",
    calories: 2,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    servingSize: "1 cup (240ml)",
    servingUnit: "cup",
    barcode: "890123456724",
    isCustom: false,
    category: "Beverages",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f25",
    userId: "system",
    name: "Whole Milk 3.25%",
    brand: "Amul",
    calories: 149,
    protein: 7.7,
    carbs: 11.7,
    fats: 8.0,
    fiber: 0,
    sugar: 12.3,
    sodium: 105,
    servingSize: "1 cup (244ml)",
    servingUnit: "cup",
    barcode: "890123456725",
    isCustom: false,
    category: "Dairy",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f26",
    userId: "system",
    name: "Low-fat Cottage Cheese",
    brand: "Horizon",
    calories: 163,
    protein: 28,
    carbs: 6.1,
    fats: 2.3,
    fiber: 0,
    sugar: 6.1,
    sodium: 918,
    servingSize: "1 cup (226g)",
    servingUnit: "cup",
    barcode: "890123456726",
    isCustom: false,
    category: "Dairy",
    isFavorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f27",
    userId: "system",
    name: "Cooked Lentils (Dal)",
    brand: "Home Style",
    calories: 230,
    protein: 17.9,
    carbs: 39.8,
    fats: 0.8,
    fiber: 15.6,
    sugar: 3.6,
    sodium: 4,
    servingSize: "1 cup (198g)",
    servingUnit: "cup",
    barcode: "890123456727",
    isCustom: false,
    category: "Protein",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f28",
    userId: "system",
    name: "Whole Wheat Chapati / Roti",
    brand: "Fresh Homemade",
    calories: 104,
    protein: 3.1,
    carbs: 20,
    fats: 1.2,
    fiber: 2.8,
    sugar: 0.4,
    sodium: 110,
    servingSize: "1 chapati (40g)",
    servingUnit: "piece",
    barcode: "890123456728",
    isCustom: false,
    category: "Grains",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f29",
    userId: "system",
    name: "Paneer (Indian Cottage Cheese)",
    brand: "Amul Fresh",
    calories: 265,
    protein: 18.3,
    carbs: 1.2,
    fats: 20.8,
    fiber: 0,
    sugar: 1.2,
    sodium: 18,
    servingSize: "100g",
    servingUnit: "g",
    barcode: "890123456729",
    isCustom: false,
    category: "Dairy",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "f30",
    userId: "system",
    name: "Mixed Green Garden Salad",
    brand: "Fresh Green",
    calories: 45,
    protein: 2.0,
    carbs: 9.0,
    fats: 0.4,
    fiber: 3.5,
    sugar: 3.0,
    sodium: 45,
    servingSize: "2 cups (150g)",
    servingUnit: "cup",
    barcode: "890123456730",
    isCustom: false,
    category: "Vegetables",
    isFavorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  }
];

// ==========================================
// INITIAL DEMO MEALS & WATER LOGS
// ==========================================
const TODAY_STR = safeDate(new Date());

const INITIAL_DEMO_MEALS: MealLog[] = [
  {
    id: "m101",
    userId: "pat-1",
    date: TODAY_STR,
    mealType: "Breakfast",
    foodId: "f10",
    foodName: "Rolled Oatmeal with Blueberries & Honey",
    quantity: 1,
    servingSize: "1 cup (234g)",
    calories: 242,
    protein: 7.1,
    carbs: 48,
    fats: 3.7,
    fiber: 7.6,
    sugar: 16.1,
    sodium: 116,
    notes: "Ate well with warm cinnamon tea.",
    photo: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&auto=format&fit=crop&q=80",
    mealTime: "08:15",
    location: "Home Dining Room",
    rating: 5,
    createdAt: `${TODAY_STR}T08:15:00`,
    updatedAt: `${TODAY_STR}T08:15:00`
  },
  {
    id: "m102",
    userId: "pat-1",
    date: TODAY_STR,
    mealType: "Breakfast",
    foodId: "f5",
    foodName: "Whole Large Boiled Egg",
    quantity: 2,
    servingSize: "2 large (100g)",
    calories: 144,
    protein: 12.6,
    carbs: 0.8,
    fats: 9.6,
    fiber: 0,
    sugar: 0.4,
    sodium: 142,
    notes: "Pinch of black pepper.",
    photo: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80",
    mealTime: "08:20",
    location: "Home Dining Room",
    rating: 4,
    createdAt: `${TODAY_STR}T08:20:00`,
    updatedAt: `${TODAY_STR}T08:20:00`
  },
  {
    id: "m103",
    userId: "pat-1",
    date: TODAY_STR,
    mealType: "Lunch",
    foodId: "f2",
    foodName: "Grilled Chicken Breast with Steamed Vegetables",
    quantity: 1.5,
    servingSize: "150g",
    calories: 248,
    protein: 46.5,
    carbs: 0,
    fats: 5.4,
    fiber: 0,
    sugar: 0,
    sodium: 111,
    notes: "Seasoned with olive oil and oregano.",
    photo: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&auto=format&fit=crop&q=80",
    mealTime: "13:00",
    location: "Kitchen Table",
    rating: 5,
    createdAt: `${TODAY_STR}T13:00:00`,
    updatedAt: `${TODAY_STR}T13:00:00`
  },
  {
    id: "m104",
    userId: "pat-1",
    date: TODAY_STR,
    mealType: "Lunch",
    foodId: "f4",
    foodName: "Brown Rice",
    quantity: 1,
    servingSize: "1 cup (195g)",
    calories: 216,
    protein: 5.0,
    carbs: 45,
    fats: 1.8,
    fiber: 3.5,
    sugar: 0.7,
    sodium: 10,
    notes: "Good texture.",
    photo: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&auto=format&fit=crop&q=80",
    mealTime: "13:05",
    location: "Kitchen Table",
    rating: 4,
    createdAt: `${TODAY_STR}T13:05:00`,
    updatedAt: `${TODAY_STR}T13:05:00`
  },
  {
    id: "m105",
    userId: "pat-1",
    date: TODAY_STR,
    mealType: "Snack",
    foodId: "f8",
    foodName: "Raw Almonds",
    quantity: 1,
    servingSize: "1 oz (28g)",
    calories: 164,
    protein: 6.0,
    carbs: 6.1,
    fats: 14.2,
    fiber: 3.5,
    sugar: 1.2,
    sodium: 1,
    notes: "Mid-afternoon snack.",
    photo: "https://images.unsplash.com/photo-1508061252966-177265a7f23c?w=400&auto=format&fit=crop&q=80",
    mealTime: "16:30",
    location: "Living Room",
    rating: 4,
    createdAt: `${TODAY_STR}T16:30:00`,
    updatedAt: `${TODAY_STR}T16:30:00`
  }
];

const INITIAL_DEMO_WATER: NutritionWaterLog[] = [
  {
    id: "w101",
    userId: "pat-1",
    date: TODAY_STR,
    amountMl: 350,
    time: "07:30",
    source: "Glass",
    notes: "Morning warm water",
    createdAt: `${TODAY_STR}T07:30:00`
  },
  {
    id: "w102",
    userId: "pat-1",
    date: TODAY_STR,
    amountMl: 500,
    time: "10:30",
    source: "Bottle",
    notes: "Post workout hydration",
    createdAt: `${TODAY_STR}T10:30:00`
  },
  {
    id: "w103",
    userId: "pat-1",
    date: TODAY_STR,
    amountMl: 400,
    time: "14:15",
    source: "Filtered",
    notes: "After lunch",
    createdAt: `${TODAY_STR}T14:15:00`
  },
  {
    id: "w104",
    userId: "pat-1",
    date: TODAY_STR,
    amountMl: 250,
    time: "17:00",
    source: "Glass",
    notes: "Evening hydration",
    createdAt: `${TODAY_STR}T17:00:00`
  }
];

const DEFAULT_GOALS: NutritionGoal = {
  id: "g1",
  userId: "pat-1",
  dailyCalories: 2000,
  dailyProtein: 120,
  dailyCarbs: 220,
  dailyFats: 65,
  dailyFiber: 30,
  dailyWater: 2500,
  dietType: "Standard Balanced",
  allergies: ["Peanuts (Mild)"],
  avoidFoods: ["Excess Soda", "Processed Fried Food"],
  breakfastReminder: true,
  lunchReminder: true,
  dinnerReminder: true,
  waterReminder: true,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01"
};

interface Props {
  patient: Patient;
}

export const NutritionTracker: React.FC<Props> = ({ patient }) => {
  // Navigation Screens:
  // "dashboard" | "add_meal" | "log_water" | "food_db" | "add_custom_food" | "daily_report" | "weekly_report" | "settings" | "barcode_scanner"
  const [currentScreen, setCurrentScreen] = useState<string>("dashboard");

  // PERSISTED LOCAL STORAGE STATES
  const [foods, setFoods] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_nutrition_foods");
      return saved ? JSON.parse(saved) : INITIAL_FOOD_DATABASE;
    } catch {
      return INITIAL_FOOD_DATABASE;
    }
  });

  const [meals, setMeals] = useState<MealLog[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_nutrition_meals");
      return saved ? JSON.parse(saved) : INITIAL_DEMO_MEALS;
    } catch {
      return INITIAL_DEMO_MEALS;
    }
  });

  const [waterLogs, setWaterLogs] = useState<NutritionWaterLog[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_nutrition_water");
      return saved ? JSON.parse(saved) : INITIAL_DEMO_WATER;
    } catch {
      return INITIAL_DEMO_WATER;
    }
  });

  const [goals, setGoals] = useState<NutritionGoal>(() => {
    try {
      const saved = localStorage.getItem("care2care_nutrition_goals");
      return saved ? JSON.parse(saved) : DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  });

  // Selected Date Filter (Defaults to today)
  const [selectedDate, setSelectedDate] = useState<string>(TODAY_STR);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("care2care_nutrition_foods", JSON.stringify(foods));
    } catch (e) {
      console.error(e);
    }
  }, [foods]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_nutrition_meals", JSON.stringify(meals));
    } catch (e) {
      console.error(e);
    }
  }, [meals]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_nutrition_water", JSON.stringify(waterLogs));
    } catch (e) {
      console.error(e);
    }
  }, [waterLogs]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_nutrition_goals", JSON.stringify(goals));
    } catch (e) {
      console.error(e);
    }
  }, [goals]);

  // Toast / Notification banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Meals & Water for selectedDate
  const dayMeals = useMemo(() => {
    return safeArray<MealLog>(meals).filter((m) => m && m.date === selectedDate);
  }, [meals, selectedDate]);

  const dayWaterLogs = useMemo(() => {
    return safeArray<NutritionWaterLog>(waterLogs).filter((w) => w && w.date === selectedDate);
  }, [waterLogs, selectedDate]);

  // Today's Macro Totals
  const daySummary = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let fiber = 0;
    let sugar = 0;
    let sodium = 0;

    dayMeals.forEach((m) => {
      calories += safeNum(m.calories);
      protein += safeNum(m.protein);
      carbs += safeNum(m.carbs);
      fats += safeNum(m.fats);
      fiber += safeNum(m.fiber);
      sugar += safeNum(m.sugar);
      sodium += safeNum(m.sodium);
    });

    let waterMl = 0;
    dayWaterLogs.forEach((w) => {
      waterMl += safeNum(w.amountMl);
    });

    return {
      totalCalories: Math.round(calories),
      totalProtein: Math.round(protein * 10) / 10,
      totalCarbs: Math.round(carbs * 10) / 10,
      totalFats: Math.round(fats * 10) / 10,
      totalFiber: Math.round(fiber * 10) / 10,
      totalSugar: Math.round(sugar * 10) / 10,
      totalSodium: Math.round(sodium),
      totalWater: waterMl,
      mealsCount: dayMeals.length,
      waterGlasses: Math.round(waterMl / 250)
    };
  }, [dayMeals, dayWaterLogs]);

  // Pre-selected parameters for Add Meal Form
  const [preSelectedMealType, setPreSelectedMealType] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack" | "Beverage">("Breakfast");
  const [selectedFoodForMeal, setSelectedFoodForMeal] = useState<FoodItem | null>(null);

  // Form State for Add Meal
  const [mealForm, setMealForm] = useState({
    mealType: "Breakfast" as "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Beverage",
    mealTime: "08:30",
    date: TODAY_STR,
    location: "Home Dining",
    foodSearch: "",
    selectedFoodId: "",
    customFoodName: "",
    quantity: 1,
    servingSize: "1 serving",
    calories: 150,
    protein: 10,
    carbs: 20,
    fats: 5,
    fiber: 2,
    sugar: 4,
    sodium: 50,
    notes: "",
    photo: "",
    rating: 5
  });

  // When meal form opens or selectedFood changes
  const handleSelectFoodForMeal = (food: FoodItem) => {
    setSelectedFoodForMeal(food);
    const qty = safeNum(mealForm.quantity, 1);
    setMealForm((prev) => ({
      ...prev,
      selectedFoodId: food.id,
      customFoodName: food.name,
      servingSize: food.servingSize || "1 serving",
      calories: Math.round(safeNum(food.calories) * qty),
      protein: Math.round(safeNum(food.protein) * qty * 10) / 10,
      carbs: Math.round(safeNum(food.carbs) * qty * 10) / 10,
      fats: Math.round(safeNum(food.fats) * qty * 10) / 10,
      fiber: Math.round(safeNum(food.fiber) * qty * 10) / 10,
      sugar: Math.round(safeNum(food.sugar) * qty * 10) / 10,
      sodium: Math.round(safeNum(food.sodium) * qty)
    }));
  };

  const handleQuantityChange = (newQty: number) => {
    const qty = Math.max(0.1, newQty);
    if (selectedFoodForMeal) {
      setMealForm((prev) => ({
        ...prev,
        quantity: qty,
        calories: Math.round(safeNum(selectedFoodForMeal.calories) * qty),
        protein: Math.round(safeNum(selectedFoodForMeal.protein) * qty * 10) / 10,
        carbs: Math.round(safeNum(selectedFoodForMeal.carbs) * qty * 10) / 10,
        fats: Math.round(safeNum(selectedFoodForMeal.fats) * qty * 10) / 10,
        fiber: Math.round(safeNum(selectedFoodForMeal.fiber) * qty * 10) / 10,
        sugar: Math.round(safeNum(selectedFoodForMeal.sugar) * qty * 10) / 10,
        sodium: Math.round(safeNum(selectedFoodForMeal.sodium) * qty)
      }));
    } else {
      setMealForm((prev) => ({ ...prev, quantity: qty }));
    }
  };

  const handleSaveMeal = (addAnother = false) => {
    try {
      if (!mealForm.customFoodName.trim()) {
        alert("Please enter or select a food item name.");
        return;
      }
      const newMeal: MealLog = {
        id: "m_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
        userId: patient.id || "pat-1",
        date: safeDate(mealForm.date),
        mealType: mealForm.mealType,
        foodId: mealForm.selectedFoodId || "custom",
        foodName: mealForm.customFoodName,
        quantity: safeNum(mealForm.quantity, 1),
        servingSize: mealForm.servingSize || "1 serving",
        calories: safeNum(mealForm.calories),
        protein: safeNum(mealForm.protein),
        carbs: safeNum(mealForm.carbs),
        fats: safeNum(mealForm.fats),
        fiber: safeNum(mealForm.fiber),
        sugar: safeNum(mealForm.sugar),
        sodium: safeNum(mealForm.sodium),
        notes: mealForm.notes,
        photo: mealForm.photo || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop&q=80",
        mealTime: mealForm.mealTime,
        location: mealForm.location || "Home",
        rating: mealForm.rating,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setMeals((prev) => [newMeal, ...prev]);
      showToast(`Logged ${newMeal.foodName} (${newMeal.calories} kcal)`);

      if (addAnother) {
        setMealForm((prev) => ({
          ...prev,
          foodSearch: "",
          selectedFoodId: "",
          customFoodName: "",
          notes: "",
          photo: ""
        }));
        setSelectedFoodForMeal(null);
      } else {
        setCurrentScreen("dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMeal = (id: string) => {
    if (confirm("Are you sure you want to remove this meal log?")) {
      setMeals((prev) => prev.filter((m) => m.id !== id));
      showToast("Meal removed.");
    }
  };

  // Water Form State
  const [waterForm, setWaterForm] = useState({
    amountMl: 250,
    time: "12:00",
    source: "Glass",
    notes: ""
  });

  const handleSaveWater = () => {
    try {
      if (waterForm.amountMl <= 0) {
        alert("Please enter a valid water amount in ml.");
        return;
      }
      const newWater: NutritionWaterLog = {
        id: "w_" + Date.now(),
        userId: patient.id || "pat-1",
        date: selectedDate,
        amountMl: safeNum(waterForm.amountMl),
        time: waterForm.time || "12:00",
        source: waterForm.source || "Glass",
        notes: waterForm.notes,
        createdAt: new Date().toISOString()
      };
      setWaterLogs((prev) => [newWater, ...prev]);
      showToast(`Added ${newWater.amountMl}ml Water`);
      setCurrentScreen("dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWater = (id: string) => {
    setWaterLogs((prev) => prev.filter((w) => w.id !== id));
    showToast("Water log deleted.");
  };

  // Custom Food Form
  const [customFoodForm, setCustomFoodForm] = useState({
    name: "",
    brand: "",
    calories: 100,
    protein: 5,
    carbs: 15,
    fats: 2,
    fiber: 1,
    sugar: 3,
    sodium: 50,
    servingSizeAmount: 1,
    servingSizeUnit: "cup",
    barcode: "",
    category: "Custom"
  });

  const handleSaveCustomFood = () => {
    try {
      if (!customFoodForm.name.trim()) {
        alert("Please enter a food name.");
        return;
      }
      const newFood: FoodItem = {
        id: "cf_" + Date.now(),
        userId: patient.id || "pat-1",
        name: customFoodForm.name,
        brand: customFoodForm.brand || "Custom Item",
        calories: safeNum(customFoodForm.calories),
        protein: safeNum(customFoodForm.protein),
        carbs: safeNum(customFoodForm.carbs),
        fats: safeNum(customFoodForm.fats),
        fiber: safeNum(customFoodForm.fiber),
        sugar: safeNum(customFoodForm.sugar),
        sodium: safeNum(customFoodForm.sodium),
        servingSize: `${customFoodForm.servingSizeAmount} ${customFoodForm.servingSizeUnit}`,
        servingUnit: customFoodForm.servingSizeUnit,
        barcode: customFoodForm.barcode,
        isCustom: true,
        category: customFoodForm.category || "Custom",
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setFoods((prev) => [newFood, ...prev]);
      showToast(`Saved custom food: ${newFood.name}`);
      setCurrentScreen("food_db");
    } catch (e) {
      console.error(e);
    }
  };

  // Food Database Filter State
  const [dbSearch, setDbSearch] = useState("");
  const [dbCategory, setDbCategory] = useState("All");

  const filteredDbFoods = useMemo(() => {
    return safeArray<FoodItem>(foods).filter((f) => {
      const matchSearch =
        safeStr(f.name).toLowerCase().includes(dbSearch.toLowerCase()) ||
        safeStr(f.brand).toLowerCase().includes(dbSearch.toLowerCase()) ||
        safeStr(f.barcode).includes(dbSearch);
      const matchCat = dbCategory === "All" || f.category === dbCategory;
      return matchSearch && matchCat;
    });
  }, [foods, dbSearch, dbCategory]);

  const toggleFavoriteFood = (id: string) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  // Barcode Simulator State
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [scannerFoundFood, setScannerFoundFood] = useState<FoodItem | null>(null);

  const handleSimulateScan = (code: string) => {
    setScannedBarcode(code);
    const found = foods.find((f) => f.barcode === code) || foods[0];
    setScannerFoundFood(found);
  };

  // Export Daily/Weekly PDF / Text Report
  const handleExportReport = (type: "daily" | "weekly") => {
    const reportText = `CARETOCARE - NUTRITION & FOOD TRACKER REPORT (${type.toUpperCase()})
Date: ${selectedDate}
Patient: ${patient.name}
Total Calories: ${daySummary.totalCalories} / ${goals.dailyCalories} kcal
Protein: ${daySummary.totalProtein}g / ${goals.dailyProtein}g
Carbs: ${daySummary.totalCarbs}g / ${goals.dailyCarbs}g
Fats: ${daySummary.totalFats}g / ${goals.dailyFats}g
Fiber: ${daySummary.totalFiber}g / ${goals.dailyFiber}g
Water Intake: ${daySummary.totalWater}ml / ${goals.dailyWater}ml

Meals Logged (${dayMeals.length}):
${dayMeals.map((m, i) => `${i + 1}. [${m.mealType}] ${m.foodName} - ${m.calories} kcal (${m.quantity} ${m.servingSize})`).join("\n")}
`;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Nutrition_Report_${selectedDate}.txt`;
    a.click();
    showToast("Report downloaded successfully.");
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <Check className="w-5 h-5 text-emerald-200" />
          {toastMessage}
        </div>
      )}

      {/* HEADER / NAVIGATION BAR */}
      <header className="bg-emerald-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600/60 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-emerald-500/30">
              🍽️
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                Nutrition & Food Tracker
              </h1>
              <p className="text-xs text-emerald-200">
                Patient: <span className="font-bold text-white">{patient.name}</span> • Care2Care Health Engine
              </p>
            </div>
          </div>

          {/* Date Selector & Top Quick Links */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/50 text-xs">
              <Calendar className="w-4 h-4 text-emerald-300 mr-2" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => setCurrentScreen("food_db")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === "food_db"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "bg-emerald-700/60 hover:bg-emerald-700 text-white"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Food Database
            </button>

            <button
              onClick={() => setCurrentScreen("settings")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === "settings"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "bg-emerald-700/60 hover:bg-emerald-700 text-white"
              }`}
            >
              <Settings className="w-3.5 h-3.5" /> Goals & Settings
            </button>
          </div>
        </div>

        {/* SUB-NAV TABS BAR */}
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2 border-t border-emerald-700/40 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === "dashboard"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-100 hover:bg-emerald-700/40"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => {
              setMealForm((prev) => ({ ...prev, mealType: "Breakfast" }));
              setSelectedFoodForMeal(null);
              setCurrentScreen("add_meal");
            }}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === "add_meal"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-100 hover:bg-emerald-700/40"
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-300" /> Log Meal
          </button>
          <button
            onClick={() => setCurrentScreen("log_water")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === "log_water"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-100 hover:bg-emerald-700/40"
            }`}
          >
            <Droplets className="w-4 h-4 text-blue-300" /> Log Water
          </button>
          <button
            onClick={() => setCurrentScreen("barcode_scanner")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === "barcode_scanner"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-100 hover:bg-emerald-700/40"
            }`}
          >
            <Barcode className="w-4 h-4 text-amber-300" /> Barcode Scanner
          </button>
          <button
            onClick={() => setCurrentScreen("daily_report")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === "daily_report"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-100 hover:bg-emerald-700/40"
            }`}
          >
            <FileText className="w-4 h-4" /> Daily Report
          </button>
          <button
            onClick={() => setCurrentScreen("weekly_report")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === "weekly_report"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-100 hover:bg-emerald-700/40"
            }`}
          >
            <PieIcon className="w-4 h-4 text-purple-300" /> Weekly Trends
          </button>
          <button
            onClick={() => setCurrentScreen("add_custom_food")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === "add_custom_food"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-100 hover:bg-emerald-700/40"
            }`}
          >
            <Plus className="w-4 h-4" /> Add Custom Food
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* ========================================================= */}
        {/* SCREEN 1: MAIN DASHBOARD                                 */}
        {/* ========================================================= */}
        {currentScreen === "dashboard" && (
          <div className="space-y-6">
            {/* TOP TODAY'S SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Calories Summary Widget */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-4 h-4 text-amber-500" /> Calories
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Goal: {goals.dailyCalories} kcal
                  </span>
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {daySummary.totalCalories}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">/ {goals.dailyCalories} kcal</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {goals.dailyCalories - daySummary.totalCalories > 0
                      ? `${goals.dailyCalories - daySummary.totalCalories} kcal remaining`
                      : `${daySummary.totalCalories - goals.dailyCalories} kcal over goal`}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      daySummary.totalCalories > goals.dailyCalories ? "bg-amber-500" : "bg-emerald-600"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((daySummary.totalCalories / (goals.dailyCalories || 2000)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Protein Widget */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Beef className="w-4 h-4 text-rose-500" /> Protein
                  </span>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    Goal: {goals.dailyProtein}g
                  </span>
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{daySummary.totalProtein}g</span>
                    <span className="text-xs text-slate-400 font-medium">/ {goals.dailyProtein}g</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((daySummary.totalProtein / (goals.dailyProtein || 120)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Carbs Widget */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Wheat className="w-4 h-4 text-amber-600" /> Carbs
                  </span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Goal: {goals.dailyCarbs}g
                  </span>
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{daySummary.totalCarbs}g</span>
                    <span className="text-xs text-slate-400 font-medium">/ {goals.dailyCarbs}g</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((daySummary.totalCarbs / (goals.dailyCarbs || 220)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Fats Widget */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-4 h-4 text-indigo-500" /> Fats
                  </span>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Goal: {goals.dailyFats}g
                  </span>
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{daySummary.totalFats}g</span>
                    <span className="text-xs text-slate-400 font-medium">/ {goals.dailyFats}g</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((daySummary.totalFats / (goals.dailyFats || 65)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-300" /> Quick Nutrition Actions
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Track meals, water intake, or scan barcodes in seconds
                </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => {
                    setMealForm((prev) => ({ ...prev, mealType: "Breakfast" }));
                    setSelectedFoodForMeal(null);
                    setCurrentScreen("add_meal");
                  }}
                  className="flex-1 md:flex-initial bg-white text-emerald-900 font-black px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-50 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Meal
                </button>
                <button
                  onClick={() => setCurrentScreen("log_water")}
                  className="flex-1 md:flex-initial bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-600 transition-all border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Droplets className="w-4 h-4 text-blue-300" /> Log Water
                </button>
                <button
                  onClick={() => setCurrentScreen("barcode_scanner")}
                  className="flex-1 md:flex-initial bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-600 transition-all border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Barcode className="w-4 h-4 text-amber-300" /> Scan Barcode
                </button>
                <button
                  onClick={() => setCurrentScreen("daily_report")}
                  className="flex-1 md:flex-initial bg-emerald-800 text-emerald-100 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition-all border border-emerald-600 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Reports
                </button>
              </div>
            </div>

            {/* WATER INTAKE PROGRESS & MEAL TYPES ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* WATER PROGRESS WIDGET */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" /> Water Intake
                  </h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    {daySummary.totalWater} / {goals.dailyWater} ml
                  </span>
                </div>

                <div className="relative pt-2">
                  <div className="flex justify-between text-xs text-slate-500 font-medium mb-1">
                    <span>Progress: {Math.round((daySummary.totalWater / (goals.dailyWater || 2500)) * 100)}%</span>
                    <span>{daySummary.waterGlasses} Glasses (250ml)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((daySummary.totalWater / (goals.dailyWater || 2500)) * 100))}%`
                      }}
                    />
                  </div>
                </div>

                {/* Quick Add Water Presets */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold mb-2">Quick Add Water:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[150, 250, 350, 500].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          const newWater: NutritionWaterLog = {
                            id: "w_" + Date.now(),
                            userId: patient.id || "pat-1",
                            date: selectedDate,
                            amountMl: amt,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            source: "Glass",
                            notes: "Quick Add",
                            createdAt: new Date().toISOString()
                          };
                          setWaterLogs((prev) => [newWater, ...prev]);
                          showToast(`Added +${amt}ml water!`);
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-xs font-bold transition-all text-center border border-blue-200/50 cursor-pointer"
                      >
                        +{amt}ml
                      </button>
                    ))}
                  </div>
                </div>

                {/* Today's Water Logs */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                  {dayWaterLogs.length === 0 ? (
                    <p className="text-slate-400 italic text-center py-2">No water logged today yet.</p>
                  ) : (
                    dayWaterLogs.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Droplets className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-bold text-slate-700">{w.amountMl} ml</span>
                          <span className="text-slate-400">({w.source})</span>
                          <span className="text-slate-400 text-[10px]">{w.time}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteWater(w.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* MEAL CATEGORIES QUICK ADD */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-emerald-600" /> Today's Meal Logging ({selectedDate})
                    </h3>
                    <button
                      onClick={() => {
                        setMealForm((prev) => ({ ...prev, mealType: "Breakfast" }));
                        setSelectedFoodForMeal(null);
                        setCurrentScreen("add_meal");
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      + Add Item <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Meal Type Quick Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                    {[
                      { label: "Breakfast", icon: "🌅", color: "border-amber-200 bg-amber-50 text-amber-900" },
                      { label: "Lunch", icon: "🌞", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
                      { label: "Dinner", icon: "🌙", color: "border-indigo-200 bg-indigo-50 text-indigo-900" },
                      { label: "Snack", icon: "🍿", color: "border-rose-200 bg-rose-50 text-rose-900" },
                      { label: "Beverage", icon: "🍵", color: "border-teal-200 bg-teal-50 text-teal-900" }
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setMealForm((prev) => ({
                            ...prev,
                            mealType: item.label as any
                          }));
                          setSelectedFoodForMeal(null);
                          setCurrentScreen("add_meal");
                        }}
                        className={`p-3 rounded-xl border text-center transition-all hover:scale-[1.02] cursor-pointer flex flex-col items-center justify-center gap-1 ${item.color}`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs font-black">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* MEALS LIST FOR THE DAY */}
                  <div className="space-y-3">
                    {dayMeals.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-600 font-bold text-sm">No meals logged for {selectedDate}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Click "Add Meal" or tap any meal button above to record food intake.
                        </p>
                      </div>
                    ) : (
                      dayMeals.map((meal) => (
                        <div
                          key={meal.id}
                          className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-100/80 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={meal.photo || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=100&auto=format&fit=crop&q=80"}
                              alt={meal.foodName}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                  {meal.mealType}
                                </span>
                                <span className="text-xs text-slate-400 font-semibold">{meal.mealTime}</span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{meal.foodName}</h4>
                              <p className="text-xs text-slate-500 font-medium">
                                Servings: {meal.quantity} ({meal.servingSize}) • {meal.location}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                            <div className="text-right">
                              <span className="font-black text-slate-900 text-base">{meal.calories} kcal</span>
                              <div className="text-[11px] text-slate-500 font-semibold space-x-1">
                                <span className="text-rose-600">P:{meal.protein}g</span>
                                <span>•</span>
                                <span className="text-amber-600">C:{meal.carbs}g</span>
                                <span>•</span>
                                <span className="text-indigo-600">F:{meal.fats}g</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteMeal(meal.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                              title="Delete log"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: ADD MEAL FORM                                   */}
        {/* ========================================================= */}
        {currentScreen === "add_meal" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-emerald-600" /> Log Meal Intake
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record food details, quantity, and nutrition breakdown
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SECTION 1: MEAL INFO */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                1. Meal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meal Type *</label>
                  <select
                    value={mealForm.mealType}
                    onChange={(e) => setMealForm({ ...mealForm, mealType: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                  >
                    <option value="Breakfast">🌅 Breakfast</option>
                    <option value="Lunch">🌞 Lunch</option>
                    <option value="Dinner">🌙 Dinner</option>
                    <option value="Snack">🍿 Snack</option>
                    <option value="Beverage">🍵 Beverage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={mealForm.mealTime}
                    onChange={(e) => setMealForm({ ...mealForm, mealTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={mealForm.date}
                    onChange={(e) => setMealForm({ ...mealForm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: FOOD SELECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                2. Select Food Item
              </h3>

              {/* Food Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search food database (e.g., Apple, Chicken, Rice)..."
                  value={mealForm.foodSearch}
                  onChange={(e) => setMealForm({ ...mealForm, foodSearch: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              {/* Matching Database Suggestions */}
              {mealForm.foodSearch.trim().length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                  {foods
                    .filter((f) =>
                      f.name.toLowerCase().includes(mealForm.foodSearch.toLowerCase())
                    )
                    .map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          handleSelectFoodForMeal(f);
                          setMealForm((prev) => ({ ...prev, foodSearch: "" }));
                        }}
                        className="w-full text-left p-3 hover:bg-emerald-50 transition-all flex items-center justify-between text-xs cursor-pointer"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{f.name}</span>
                          <span className="text-slate-400 ml-2">({f.brand || "Generic"})</span>
                        </div>
                        <div className="text-emerald-700 font-black">
                          {f.calories} kcal <span className="text-slate-400 font-medium">/ {f.servingSize}</span>
                        </div>
                      </button>
                    ))}
                </div>
              )}

              {/* OR Custom Manual Entry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Food Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Grilled Salmon Salad"
                    value={mealForm.customFoodName}
                    onChange={(e) => setMealForm({ ...mealForm, customFoodName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Serving Size *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 bowl (200g)"
                    value={mealForm.servingSize}
                    onChange={(e) => setMealForm({ ...mealForm, servingSize: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (Servings) *</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(mealForm.quantity - 0.5)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={mealForm.quantity}
                      onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 1)}
                      className="w-full text-center p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(mealForm.quantity + 0.5)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Dining Spot</label>
                  <input
                    type="text"
                    placeholder="e.g. Home, Office, Restaurant"
                    value={mealForm.location}
                    onChange={(e) => setMealForm({ ...mealForm, location: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: NUTRITION VALUES */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                3. Calculated Nutritional Content
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                <div>
                  <label className="block text-xs font-bold text-amber-800">Calories (kcal) *</label>
                  <input
                    type="number"
                    value={mealForm.calories}
                    onChange={(e) => setMealForm({ ...mealForm, calories: safeNum(e.target.value) })}
                    className="w-full mt-1 p-2 bg-white border border-emerald-200 rounded-lg text-xs font-black text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-800">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mealForm.protein}
                    onChange={(e) => setMealForm({ ...mealForm, protein: safeNum(e.target.value) })}
                    className="w-full mt-1 p-2 bg-white border border-rose-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-800">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm({ ...mealForm, carbs: safeNum(e.target.value) })}
                    className="w-full mt-1 p-2 bg-white border border-amber-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-800">Fats (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mealForm.fats}
                    onChange={(e) => setMealForm({ ...mealForm, fats: safeNum(e.target.value) })}
                    className="w-full mt-1 p-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: NOTES & PHOTO */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                4. Notes & Meal Photo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meal Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={mealForm.photo}
                    onChange={(e) => setMealForm({ ...mealForm, photo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Caregiver Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Patient enjoyed the soup, finished entire portion."
                    value={mealForm.notes}
                    onChange={(e) => setMealForm({ ...mealForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentScreen("dashboard")}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveMeal(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-200 cursor-pointer"
              >
                Save & Add Another
              </button>
              <button
                type="button"
                onClick={() => handleSaveMeal(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md hover:bg-emerald-900 cursor-pointer"
              >
                Save Meal Log
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: LOG WATER FORM                                  */}
        {/* ========================================================= */}
        {currentScreen === "log_water" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Droplets className="w-6 h-6 text-blue-500" /> Log Water Intake
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Keep patient hydrated throughout the day
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Preset Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Quick Presets:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[100, 200, 250, 350, 500, 750].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWaterForm({ ...waterForm, amountMl: amt })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        waterForm.amountMl === amt
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      {amt} ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider & Custom Input */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Custom Water Amount (ml) *</label>
                  <span className="text-base font-black text-blue-600">{waterForm.amountMl} ml</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={waterForm.amountMl}
                  onChange={(e) => setWaterForm({ ...waterForm, amountMl: parseInt(e.target.value) || 250 })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Time & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={waterForm.time}
                    onChange={(e) => setWaterForm({ ...waterForm, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source / Vessel</label>
                  <select
                    value={waterForm.source}
                    onChange={(e) => setWaterForm({ ...waterForm, source: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Glass">Glass (250ml)</option>
                    <option value="Bottle">Water Bottle</option>
                    <option value="Filtered">Filtered Tap</option>
                    <option value="Warm Tea">Warm Herbal Tea</option>
                    <option value="Coconut Water">Coconut Water</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Drank after morning medications"
                  value={waterForm.notes}
                  onChange={(e) => setWaterForm({ ...waterForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentScreen("dashboard")}
                className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWater}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-blue-700 cursor-pointer"
              >
                Save Water Intake
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: FOOD DATABASE                                   */}
        {/* ========================================================= */}
        {currentScreen === "food_db" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-emerald-600" /> Food Database & Custom Items
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse {foods.length}+ food items, view nutritional details, or add custom foods
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen("add_custom_food")}
                  className="px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Custom Food
                </button>
              </div>
            </div>

            {/* SEARCH & CATEGORY FILTERS */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search food by name, brand, or barcode..."
                    value={dbSearch}
                    onChange={(e) => setDbSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={dbCategory}
                    onChange={(e) => setDbCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Protein">Protein</option>
                    <option value="Grains">Grains</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Custom">Custom Items</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FOOD ITEMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDbFoods.map((food) => (
                <div
                  key={food.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {food.category || "General"}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">{food.name}</h3>
                        <p className="text-xs text-slate-400">{food.brand || "Generic Fresh Food"}</p>
                      </div>

                      <button
                        onClick={() => toggleFavoriteFood(food.id)}
                        className="p-1 text-amber-400 hover:text-amber-500 cursor-pointer"
                        title="Toggle Favorite"
                      >
                        <Star className={`w-5 h-5 ${food.isFavorite ? "fill-amber-400" : ""}`} />
                      </button>
                    </div>

                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-xs font-black text-slate-900">{food.calories} kcal</span>
                        <p className="text-[11px] text-slate-500">Per {food.servingSize}</p>
                      </div>

                      <div className="text-right text-[11px] font-semibold space-x-1.5">
                        <span className="text-rose-600">P:{food.protein}g</span>
                        <span className="text-amber-600">C:{food.carbs}g</span>
                        <span className="text-indigo-600">F:{food.fats}g</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        handleSelectFoodForMeal(food);
                        setCurrentScreen("add_meal");
                      }}
                      className="flex-1 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log This Food
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 5: ADD CUSTOM FOOD                                 */}
        {/* ========================================================= */}
        {currentScreen === "add_custom_food" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-emerald-600" /> Create Custom Food Item
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add custom recipes or specialized nutritional items to your library
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen("food_db")}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Food Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Homemade Vegetable Soup"
                    value={customFoodForm.name}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Family Recipe"
                    value={customFoodForm.brand}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, brand: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Calories per serving (kcal) *</label>
                  <input
                    type="number"
                    value={customFoodForm.calories}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, calories: safeNum(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Serving Size Amount *</label>
                  <input
                    type="number"
                    value={customFoodForm.servingSizeAmount}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, servingSizeAmount: safeNum(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Serving Unit *</label>
                  <select
                    value={customFoodForm.servingSizeUnit}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, servingSizeUnit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="cup">cup</option>
                    <option value="g">g (grams)</option>
                    <option value="ml">ml (milliliters)</option>
                    <option value="tbsp">tbsp</option>
                    <option value="oz">oz</option>
                    <option value="piece">piece / bowl</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-rose-800">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customFoodForm.protein}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, protein: safeNum(e.target.value) })}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-800">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customFoodForm.carbs}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, carbs: safeNum(e.target.value) })}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-800">Fats (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customFoodForm.fats}
                    onChange={(e) => setCustomFoodForm({ ...customFoodForm, fats: safeNum(e.target.value) })}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentScreen("food_db")}
                className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomFood}
                className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md hover:bg-emerald-900 cursor-pointer"
              >
                Save Food Item
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 6: DAILY REPORT                                    */}
        {/* ========================================================= */}
        {currentScreen === "daily_report" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" /> Daily Nutrition Report
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete breakdown of calories, macros, and meal entries for {selectedDate}
                </p>
              </div>

              <button
                onClick={() => handleExportReport("daily")}
                className="px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" /> Export Report (TXT)
              </button>
            </div>

            {/* MACRO BREAKDOWN STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-400">Total Calories</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{daySummary.totalCalories} kcal</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Target: {goals.dailyCalories} kcal</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs font-bold text-rose-500">Protein</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{daySummary.totalProtein} g</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Target: {goals.dailyProtein} g</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs font-bold text-amber-500">Carbohydrates</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{daySummary.totalCarbs} g</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Target: {goals.dailyCarbs} g</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs font-bold text-indigo-500">Healthy Fats</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{daySummary.totalFats} g</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Target: {goals.dailyFats} g</p>
              </div>
            </div>

            {/* MEALS LISTED IN REPORT */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Detailed Meal Logs for {selectedDate}</h3>
              {dayMeals.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No meal logs recorded for this day.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {dayMeals.map((m) => (
                    <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mr-2">
                          {m.mealType}
                        </span>
                        <span className="font-bold text-slate-900">{m.foodName}</span>
                        <span className="text-slate-400 ml-2">({m.quantity} x {m.servingSize})</span>
                      </div>
                      <div className="font-black text-slate-900">{m.calories} kcal</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 7: WEEKLY REPORT & AI INSIGHTS                     */}
        {/* ========================================================= */}
        {currentScreen === "weekly_report" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <PieIcon className="w-6 h-6 text-purple-600" /> Weekly Trends & AI Nutrition Insights
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of dietary consistency, macronutrient split, and health recommendations
              </p>
            </div>

            {/* AI INSIGHTS CARD */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base text-purple-100">Care2Care AI Dietary Assessment</h3>
              </div>
              <ul className="text-xs space-y-2 text-purple-200 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-white">Protein Intake:</strong> Great job! Daily protein intake is averaging 85% of target goal, supporting muscle retention.
                </li>
                <li>
                  <strong className="text-white">Hydration:</strong> Water intake is slightly below the 2.5L daily recommendation. Consider adding a morning glass preset.
                </li>
                <li>
                  <strong className="text-white">Fiber & Vegetables:</strong> Fiber levels are optimal with oatmeal and green leafy veggies.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 8: BARCODE SCANNER SIMULATION                      */}
        {/* ========================================================= */}
        {currentScreen === "barcode_scanner" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Barcode className="w-6 h-6 text-amber-500" /> Barcode Food Scanner
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Point camera at food packaging barcode or simulate scan below
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SIMULATED CAMERA VIEWFINDER */}
            <div className="relative bg-slate-900 rounded-2xl p-8 text-center text-white space-y-4 overflow-hidden border-2 border-emerald-500/50">
              <div className="w-48 h-28 border-2 border-dashed border-emerald-400 mx-auto rounded-xl flex items-center justify-center relative">
                <div className="w-full h-0.5 bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300 font-semibold">Simulated Camera Active</p>

              {/* Sample Barcode Buttons */}
              <div className="pt-2">
                <p className="text-[11px] text-slate-400 mb-2">Click to simulate scanning item:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {foods.slice(0, 4).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleSimulateScan(f.barcode || "890123456701")}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer"
                    >
                      Scan {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SCAN RESULT DISPLAY */}
            {scannerFoundFood && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800 uppercase">Item Identified!</span>
                  <span className="text-xs text-slate-500">{scannerFoundFood.barcode}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{scannerFoundFood.name}</h4>
                  <p className="text-xs text-slate-500">
                    {scannerFoundFood.calories} kcal • P:{scannerFoundFood.protein}g • C:{scannerFoundFood.carbs}g • F:{scannerFoundFood.fats}g
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleSelectFoodForMeal(scannerFoundFood);
                    setCurrentScreen("add_meal");
                  }}
                  className="w-full py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-all cursor-pointer"
                >
                  Log This Scanned Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 9: GOALS & SETTINGS                                */}
        {/* ========================================================= */}
        {currentScreen === "settings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-emerald-600" /> Daily Nutrition Goals & Settings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure target calories, macros, reminders, and dietary preferences
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Daily Nutritional Targets
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={goals.dailyCalories}
                    onChange={(e) => setGoals({ ...goals, dailyCalories: safeNum(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={goals.dailyProtein}
                    onChange={(e) => setGoals({ ...goals, dailyProtein: safeNum(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={goals.dailyCarbs}
                    onChange={(e) => setGoals({ ...goals, dailyCarbs: safeNum(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={goals.dailyFats}
                    onChange={(e) => setGoals({ ...goals, dailyFats: safeNum(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Water Goal (ml)</label>
                  <input
                    type="number"
                    value={goals.dailyWater}
                    onChange={(e) => setGoals({ ...goals, dailyWater: safeNum(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* REMINDERS TOGGLES */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Reminders & Notifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Breakfast Reminder", key: "breakfastReminder" },
                    { label: "Lunch Reminder", key: "lunchReminder" },
                    { label: "Dinner Reminder", key: "dinnerReminder" },
                    { label: "Water Reminder", key: "waterReminder" }
                  ].map((r) => (
                    <label key={r.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
                      <span>{r.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean((goals as any)[r.key])}
                        onChange={(e) => setGoals({ ...goals, [r.key]: e.target.checked })}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  showToast("Goals & Settings saved!");
                  setCurrentScreen("dashboard");
                }}
                className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md hover:bg-emerald-900 cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NutritionTracker;
