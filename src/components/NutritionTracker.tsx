import React, { useState } from "react";
import { Patient } from "../types";
import {
  Utensils,
  Plus,
  Search,
  Droplets,
  Barcode,
  BarChart3,
  Calendar,
  Settings as SettingsIcon,
  Trash2,
  Check,
  X,
  Star,
  Clock,
  Sparkles,
  Heart,
  FileText,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Filter,
  Flame,
  Zap,
  Wheat,
  Beef,
  PieChart as PieIcon,
  Bell,
  ArrowRight,
  CheckCircle2,
  Lock,
  LayoutGrid,
  ShoppingBag,
  BookOpen,
  TrendingUp,
  Share2,
  Activity,
  Award,
  Layers
} from "lucide-react";

export type NutritionTab =
  | "dashboard"
  | "log_meal"
  | "meal_plan"
  | "calories_macros"
  | "nutrients"
  | "history"
  | "analytics"
  | "recipes"
  | "grocery_list"
  | "milestones"
  | "reminders"
  | "settings";

interface NutritionTrackerProps {
  patient?: Patient;
}

export const NutritionTracker: React.FC<NutritionTrackerProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<NutritionTab>("dashboard");
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Nutrition Goal State
  const [calorieGoal, setCalorieGoal] = useState<number>(2100);
  const [consumedCalories, setConsumedCalories] = useState<number>(1250);
  const [proteinGoal, setProteinGoal] = useState<number>(120);
  const [carbsGoal, setCarbsGoal] = useState<number>(250);
  const [fatGoal, setFatGoal] = useState<number>(70);

  // Form State
  const [selectedMealType, setSelectedMealType] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack">("Breakfast");
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [formFoodName, setFormFoodName] = useState("");
  const [formCalories, setFormCalories] = useState(350);

  // Recipe Category Filter
  const [recipeCategory, setRecipeCategory] = useState<"All" | "Breakfast" | "Lunch" | "Dinner" | "Snack">("All");

  // Grocery Checklist State
  const [groceryItems, setGroceryItems] = useState([
    { id: "g1", category: "Fruits", name: "Banana", quantity: "6 pcs", checked: false },
    { id: "g2", category: "Fruits", name: "Apple", quantity: "4 pcs", checked: true },
    { id: "g3", category: "Vegetables", name: "Broccoli", quantity: "1 head", checked: false },
    { id: "g4", category: "Vegetables", name: "Spinach", quantity: "1 bunch", checked: false },
    { id: "g5", category: "Proteins", name: "Chicken Breast", quantity: "500g", checked: true },
    { id: "g6", category: "Proteins", name: "Eggs", quantity: "12 pcs", checked: false },
  ]);
  const [newGroceryName, setNewGroceryName] = useState("");
  const [newGroceryCat, setNewGroceryCat] = useState("Vegetables");

  // Reminders State
  const [mealReminders, setMealReminders] = useState([
    { id: "m1", title: "Breakfast", time: "8:00 AM", enabled: true },
    { id: "m2", title: "Lunch", time: "1:00 PM", enabled: true },
    { id: "m3", title: "Snack", time: "4:30 PM", enabled: true },
    { id: "m4", title: "Dinner", time: "7:30 PM", enabled: true },
  ]);

  const navMenuItems: Array<{ id: NutritionTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "log_meal", label: "Log Meal", icon: Utensils },
    { id: "meal_plan", label: "Meal Plan", icon: FileText },
    { id: "calories_macros", label: "Calories & Macros", icon: PieIcon },
    { id: "nutrients", label: "Nutrients", icon: Layers },
    { id: "history", label: "History", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "recipes", label: "Recipes", icon: BookOpen },
    { id: "grocery_list", label: "Grocery List", icon: ShoppingBag },
    { id: "milestones", label: "Milestones", icon: Award },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Nutrition Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Nutrition & Diet Plan
            </h1>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("log_meal")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Meal</span>
        </button>
      </div>

      {/* HORIZONTAL SCROLLING MENU (AS PER USER REQUIREMENT) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs font-black scale-102"
                  : "bg-white text-slate-700 hover:bg-orange-50 border-slate-200/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#FF5A36]"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* SCREEN 1: NUTRITION DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Summary</span>
                <p className="text-sm font-black text-slate-800">14 May 2025</p>
              </div>
              <button
                onClick={() => showNotification("Nutrition report exported")}
                className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200"
              >
                <Share2 className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>Share</span>
              </button>
            </div>

            {/* Circular Calorie Ring & Breakdown */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" stroke="#FEE2D5" strokeWidth="12" fill="none" />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#FF5A36"
                    strokeWidth="12"
                    strokeDasharray={427}
                    strokeDashoffset={427 * (1 - consumedCalories / calorieGoal)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{consumedCalories}</span>
                  <span className="text-[10px] font-bold text-slate-400">/ {calorieGoal} kcal</span>
                  <span className="text-xs font-black text-[#FF5A36] mt-0.5">60%</span>
                </div>
              </div>

              {/* Macros Breakdown Bars */}
              <div className="space-y-2.5 w-full sm:w-64">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1"><Beef className="w-3.5 h-3.5 text-rose-500" /> Protein</span>
                    <span>75 / {proteinGoal}g</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(75 / proteinGoal) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1"><Wheat className="w-3.5 h-3.5 text-amber-500" /> Carbs</span>
                    <span>140 / {carbsGoal}g</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(140 / carbsGoal) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-sky-500" /> Fat</span>
                    <span>42 / {fatGoal}g</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(42 / fatGoal) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Meals</span>
                <p className="text-sm font-black text-slate-900">3 / 4</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Water</span>
                <p className="text-sm font-black text-sky-600">1.4 / 2.5L</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Steps</span>
                <p className="text-sm font-black text-emerald-600">6,420</p>
              </div>
            </div>

            {/* Next Meal Card */}
            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Next Meal</span>
                  <h4 className="text-xs font-black text-slate-900">Dinner at 7:30 PM</h4>
                  <p className="text-[11px] text-slate-600">Grilled Salmon, Steamed Veggies (450 kcal)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("log_meal")}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Log
              </button>
            </div>

            <button
              onClick={() => setActiveTab("log_meal")}
              className="w-full py-3.5 mt-5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Meal</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: LOG MEAL */}
      {activeTab === "log_meal" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-black text-slate-900">Log Meal</h2>
            <p className="text-xs text-slate-500">Track foods, calories and macronutrients.</p>
          </div>

          {/* Meal Type Pills */}
          <div className="grid grid-cols-4 gap-2">
            {(["Breakfast", "Lunch", "Dinner", "Snack"] as const).map((meal) => (
              <button
                key={meal}
                type="button"
                onClick={() => setSelectedMealType(meal)}
                className={`py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                  selectedMealType === meal
                    ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {meal}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search food or ingredients..."
              value={foodSearchQuery}
              onChange={(e) => setFoodSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
            />
          </div>

          {/* Quick Add Pills */}
          <div>
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">Quick Add</span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Rice 1 cup", kcal: 200 },
                { name: "Chicken 100g", kcal: 165 },
                { name: "Banana 1 med", kcal: 105 },
                { name: "Egg 1 pc", kcal: 78 },
                { name: "Oats 50g", kcal: 190 },
                { name: "Greek Yogurt 150g", kcal: 130 },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setConsumedCalories((prev) => prev + item.kcal);
                    showNotification(`Added ${item.name} (+${item.kcal} kcal)`);
                  }}
                  className="px-3 py-1.5 bg-[#FFF9F5] border border-orange-200 rounded-full text-xs font-bold text-slate-800 hover:bg-orange-100 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-[#FF5A36] font-black">{item.kcal} kcal</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Food Form */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <span className="text-xs font-black text-slate-800">Add Custom Food</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Food name (e.g. Avocado Toast)"
                value={formFoodName}
                onChange={(e) => setFormFoodName(e.target.value)}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
              />
              <input
                type="number"
                placeholder="Calories (kcal)"
                value={formCalories}
                onChange={(e) => setFormCalories(parseInt(e.target.value) || 0)}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (formFoodName.trim()) {
                setConsumedCalories((prev) => prev + formCalories);
                showNotification(`Logged ${formFoodName} (${formCalories} kcal)!`);
                setFormFoodName("");
              } else {
                showNotification("Meal logged successfully!");
              }
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Meal
          </button>
        </div>
      )}

      {/* SCREEN 3: MEAL PLAN */}
      {activeTab === "meal_plan" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Today's Meal Plan</h2>
              <p className="text-xs text-slate-500">Goal: 2,100 kcal • Consumed: 1,250 • Remaining: 850</p>
            </div>
            <button
              onClick={() => showNotification("New meal slot added")}
              className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-[#FF5A36] text-xs font-black rounded-xl hover:bg-orange-100"
            >
              + Add Meal
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                meal: "Breakfast",
                time: "8:00 AM",
                title: "Oats with Milk & Fruits",
                desc: "Rolled oats, almond milk, banana slices, blueberries",
                kcal: 450,
                protein: "14g",
                carbs: "68g",
                fat: "8g",
                completed: true,
              },
              {
                meal: "Lunch",
                time: "1:00 PM",
                title: "Brown Rice, Chicken, Salad",
                desc: "1 cup brown rice, 150g grilled chicken, garden salad",
                kcal: 520,
                protein: "38g",
                carbs: "54g",
                fat: "14g",
                completed: true,
              },
              {
                meal: "Snack",
                time: "4:30 PM",
                title: "Greek Yogurt with Nuts",
                desc: "150g plain greek yogurt, 10 almonds, chia seeds",
                kcal: 180,
                protein: "15g",
                carbs: "12g",
                fat: "9g",
                completed: false,
              },
              {
                meal: "Dinner",
                time: "7:30 PM",
                title: "Planned: Grilled Salmon & Broccoli",
                desc: "180g salmon fillet, steamed broccoli, olive oil",
                kcal: 450,
                protein: "34g",
                carbs: "10g",
                fat: "22g",
                completed: false,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-md">
                      {item.meal}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{item.kcal} kcal</span>
                    {item.completed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                </div>

                <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500">{item.desc}</p>

                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 pt-1">
                  <span>P: {item.protein}</span>
                  <span>C: {item.carbs}</span>
                  <span>F: {item.fat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 4: CALORIES & MACROS */}
      {activeTab === "calories_macros" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-slate-900">Calories & Macros</h2>

          {/* Hourly Timeline Chart */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <span className="text-xs font-black text-slate-800">Hourly Calorie Consumption</span>

            <div className="h-36 flex items-end justify-between gap-1 pt-2 px-1 border-b border-slate-200 pb-2">
              {[
                { time: "8 AM", kcal: 450 },
                { time: "10 AM", kcal: 0 },
                { time: "12 PM", kcal: 100 },
                { time: "1 PM", kcal: 520 },
                { time: "3 PM", kcal: 0 },
                { time: "4 PM", kcal: 180 },
                { time: "6 PM", kcal: 0 },
                { time: "8 PM", kcal: 0 },
              ].map((slot) => {
                const heightPct = (slot.kcal / 600) * 100;
                return (
                  <div key={slot.time} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full max-w-[20px] bg-[#FF5A36] rounded-t-md"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[9px] font-bold text-slate-400">{slot.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Macro Split */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3.5 bg-rose-50 border border-rose-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-rose-600 uppercase">Protein</span>
              <p className="text-base font-black text-slate-900 mt-0.5">75g / 120g</p>
              <span className="text-[10px] text-slate-500">62% reached</span>
            </div>
            <div className="p-3.5 bg-amber-50 border border-amber-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Carbs</span>
              <p className="text-base font-black text-slate-900 mt-0.5">140g / 250g</p>
              <span className="text-[10px] text-slate-500">56% reached</span>
            </div>
            <div className="p-3.5 bg-sky-50 border border-sky-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-sky-600 uppercase">Fat</span>
              <p className="text-base font-black text-slate-900 mt-0.5">42g / 70g</p>
              <span className="text-[10px] text-slate-500">60% reached</span>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5: NUTRIENTS BREAKDOWN */}
      {activeTab === "nutrients" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Nutrients Breakdown</h2>

          <div className="space-y-3">
            {[
              { name: "Fiber", current: "18g", goal: "25g", pct: 72 },
              { name: "Sugars", current: "32g", goal: "50g (limit)", pct: 64 },
              { name: "Sodium", current: "1,800mg", goal: "2,300mg (limit)", pct: 78 },
              { name: "Calcium", current: "800mg", goal: "1,000mg", pct: 80 },
              { name: "Iron", current: "12mg", goal: "18mg", pct: 66 },
              { name: "Vitamin D", current: "400 IU", goal: "600 IU", pct: 67 },
              { name: "Potassium", current: "2,400mg", goal: "3,500mg", pct: 68 },
            ].map((nut) => (
              <div key={nut.name} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{nut.name}</span>
                  <span>{nut.current} / {nut.goal}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: `${nut.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 6: HISTORY */}
      {activeTab === "history" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Nutrition History</h2>
            <span className="text-xs font-black text-slate-800">May 2025</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] font-black text-slate-400 py-1">{d}</div>
            ))}

            {[28, 29, 30].map((d) => (
              <div key={`np-${d}`} className="p-2 text-slate-300 font-bold">{d}</div>
            ))}

            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isSelected = day === 14;
              return (
                <button
                  key={day}
                  onClick={() => showNotification(`Selected May ${day}`)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FF5A36] text-white font-black shadow-xs"
                      : "hover:bg-orange-50 font-bold text-slate-700"
                  }`}
                >
                  <span>{day}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${day % 2 === 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-500 pt-2">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Goal Met</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Partial</span>
          </div>
        </div>
      )}

      {/* SCREEN 7: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-slate-900">Analytics</h2>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Average Calories</span>
              <p className="text-xl font-black text-slate-900">1,820 kcal</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase">Target</span>
              <p className="text-sm font-black text-slate-700">2,100 kcal</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <span className="text-xs font-black text-slate-800 block mb-2">7 Days Calorie Intake</span>
            <div className="h-32 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
              {[
                { day: "Mon", kcal: 1950 },
                { day: "Tue", kcal: 2100 },
                { day: "Wed", kcal: 1850 },
                { day: "Thu", kcal: 2200 },
                { day: "Fri", kcal: 1900 },
                { day: "Sat", kcal: 2050 },
                { day: "Sun", kcal: 1750 },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full max-w-[24px] bg-[#FF5A36] rounded-t-md"
                    style={{ height: `${(bar.kcal / 2500) * 100}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-500">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 8: RECIPES */}
      {activeTab === "recipes" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Healthy Recipes</h2>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {(["All", "Breakfast", "Lunch", "Dinner", "Snack"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setRecipeCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    recipeCategory === cat
                      ? "bg-[#FF5A36] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "Oats with Berries", kcal: 350, time: "10 min", cat: "Breakfast", icon: "🥣" },
              { title: "Grilled Chicken Salad", kcal: 520, time: "20 min", cat: "Lunch", icon: "🥗" },
              { title: "Quinoa Veg Bowl", kcal: 450, time: "25 min", cat: "Dinner", icon: "🍲" },
              { title: "Lentil Soup", kcal: 280, time: "30 min", cat: "Dinner", icon: "🥘" },
            ]
              .filter((r) => recipeCategory === "All" || r.cat === recipeCategory)
              .map((recipe, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:border-orange-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{recipe.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{recipe.title}</h4>
                      <p className="text-[10px] text-slate-500">{recipe.kcal} kcal • {recipe.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showNotification(`Added ${recipe.title} to meal plan`)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 text-[#FF5A36]" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SCREEN 9: GROCERY LIST */}
      {activeTab === "grocery_list" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Grocery List</h2>
            <span className="text-xs font-black text-slate-500">
              {groceryItems.filter((g) => g.checked).length} / {groceryItems.length} Checked
            </span>
          </div>

          <div className="space-y-2.5">
            {groceryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setGroceryItems((prev) =>
                    prev.map((g) => (g.id === item.id ? { ...g, checked: !g.checked } : g))
                  );
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  item.checked
                    ? "bg-slate-50 border-slate-200 opacity-60 line-through"
                    : "bg-white border-slate-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      item.checked ? "bg-[#FF5A36] border-[#FF5A36] text-white" : "border-slate-300"
                    }`}
                  >
                    {item.checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{item.name}</h4>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500">{item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Add Item Form */}
          <div className="p-3 bg-orange-50/50 border border-dashed border-orange-300 rounded-2xl flex items-center gap-2">
            <input
              type="text"
              placeholder="Add item (e.g. Greek Yogurt)"
              value={newGroceryName}
              onChange={(e) => setNewGroceryName(e.target.value)}
              className="flex-1 bg-transparent text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={() => {
                if (newGroceryName.trim()) {
                  setGroceryItems((prev) => [
                    ...prev,
                    {
                      id: `g-${Date.now()}`,
                      category: newGroceryCat,
                      name: newGroceryName.trim(),
                      quantity: "1 pc",
                      checked: false,
                    },
                  ]);
                  setNewGroceryName("");
                  showNotification("Grocery item added!");
                }
              }}
              className="px-3 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              + Add Item
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 10: MILESTONES */}
      {activeTab === "milestones" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Achievements</h2>

          <div className="space-y-3">
            {[
              { title: "Nutrition Starter", desc: "Logged meals for 3 consecutive days", completed: true, badge: "🥗" },
              { title: "3-Day Healthy Streak", desc: "Met calorie and macro goals for 3 days", completed: true, badge: "⚡" },
              { title: "7-Day Streak", desc: "Logged all 4 daily meals for 7 days", completed: true, badge: "🔥" },
              { title: "21-Day Nutrition Challenge", desc: "Completed 21 days of mindful eating", progress: "14/21", completed: false, badge: "🏆" },
              { title: "30-Day Champion", desc: "Reach 30 consecutive days", locked: true, badge: "🔒" },
              { title: "100-Day Legend", desc: "Reach 100 consecutive days", locked: true, badge: "🔒" },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.badge}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{m.title}</h4>
                    <p className="text-[11px] text-slate-500">{m.desc}</p>
                  </div>
                </div>

                <div>
                  {m.completed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {m.progress && !m.completed && (
                    <span className="text-xs font-black text-[#FF5A36] bg-orange-100 px-2.5 py-1 rounded-xl">
                      {m.progress}
                    </span>
                  )}
                  {m.locked && <Lock className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 11: REMINDERS */}
      {activeTab === "reminders" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Meal Reminders</h2>
              <p className="text-xs text-slate-500">Get notified for your scheduled meals.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]"></div>
            </label>
          </div>

          <div className="space-y-3">
            {mealReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#FF5A36]" /> {rem.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">{rem.time} • Daily</p>
                </div>
                <input
                  type="checkbox"
                  checked={rem.enabled}
                  onChange={() => {
                    setMealReminders((prev) =>
                      prev.map((r) => (r.id === rem.id ? { ...r, enabled: !r.enabled } : r))
                    );
                  }}
                  className="accent-[#FF5A36] w-4 h-4 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              showNotification("Meal reminder settings saved!");
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Reminders
          </button>
        </div>
      )}

      {/* SCREEN 12: SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Nutrition Settings</h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Daily Calorie Target</span>
              <span className="font-black text-slate-900">{calorieGoal} kcal</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Macro Ratio</span>
              <span className="font-black text-slate-900">40% Carbs / 30% Protein / 30% Fat</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Units</span>
              <span className="font-black text-slate-900">Metric (grams / kcal)</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Meal Reminders</span>
              <span className="font-black text-emerald-600">4 Active</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => showNotification("Nutrition data exported")}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-200 transition-colors"
            >
              Export Nutrition Data
            </button>
            <button
              onClick={() => showNotification("Nutrition data reset")}
              className="w-full py-2.5 bg-rose-50 text-rose-600 font-bold rounded-2xl text-xs hover:bg-rose-100 transition-colors"
            >
              Reset Nutrition Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
