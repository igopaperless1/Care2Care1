import React, { useState } from "react";
import {
  X,
  Search,
  ShieldAlert,
  Pill,
  Droplets,
  Footprints,
  Sparkles,
  Smile,
  Heart,
  Baby,
  Users,
  Dog,
  DollarSign,
  Briefcase,
  FileText,
  Car,
  Home,
  Sprout,
  Utensils,
  Calendar,
  Activity,
  Compass,
  Siren,
  PhoneCall,
  Dumbbell,
  Brain,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

interface QuickActionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tab: "home" | "track" | "plan" | "care" | "more", subTab?: string) => void;
  onOpenSosModal?: () => void;
}

interface ServiceCategory {
  title: string;
  items: {
    id: string;
    label: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    tab: "home" | "track" | "plan" | "care" | "more";
    subTab?: string;
    isSosTrigger?: boolean;
  }[];
}

export const QuickActionOverlay: React.FC<QuickActionOverlayProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onOpenSosModal
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const categories: ServiceCategory[] = [
    {
      title: "🚨 Emergency & Critical Safety",
      items: [
        {
          id: "sos_alert",
          label: "Instant SOS Alert",
          desc: "Hold for live GPS distress broadcast",
          icon: <ShieldAlert className="w-5 h-5" />,
          color: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          tab: "care",
          subTab: "sos",
          isSosTrigger: true
        },
        {
          id: "sos_page",
          label: "SOS & Location Tracker",
          desc: "Contacts, location sharing & helplines",
          icon: <Compass className="w-5 h-5" />,
          color: "text-red-600",
          bgColor: "bg-red-50/80",
          borderColor: "border-red-200",
          tab: "care",
          subTab: "sos"
        },
        {
          id: "calendar_converter",
          label: "40+ Calendar System Converter",
          desc: "Convert dates across Vikram Sambat, Hijri, Lunar & 35+ more",
          icon: <Calendar className="w-5 h-5" />,
          color: "text-indigo-700",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          tab: "care",
          subTab: "calendar"
        }
      ]
    },
    {
      title: "💊 Health & Daily Vitals",
      items: [
        {
          id: "medicine",
          label: "Medicine & Prescriptions",
          desc: "Dosage schedules & AI OCR scanner",
          icon: <Pill className="w-5 h-5" />,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          tab: "care",
          subTab: "medicine"
        },
        {
          id: "water",
          label: "Water Intake Notifier",
          desc: "Hydration goals & smart alarms",
          icon: <Droplets className="w-5 h-5" />,
          color: "text-cyan-600",
          bgColor: "bg-cyan-50",
          borderColor: "border-cyan-200",
          tab: "care",
          subTab: "water"
        },
        {
          id: "steps",
          label: "Steps & Calorie Tracker",
          desc: "Pedometer & daily walk targets",
          icon: <Footprints className="w-5 h-5" />,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          tab: "care",
          subTab: "steps"
        },
        {
          id: "yoga",
          label: "Yoga & Mindfulness",
          desc: "Guided meditation & breathing timers",
          icon: <Sparkles className="w-5 h-5" />,
          color: "text-teal-600",
          bgColor: "bg-teal-50",
          borderColor: "border-teal-200",
          tab: "care",
          subTab: "yoga"
        },
        {
          id: "mood",
          label: "Mood & Habit Journal",
          desc: "Daily check-in & emotional logs",
          icon: <Smile className="w-5 h-5" />,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          tab: "care",
          subTab: "mood"
        },
        {
          id: "exercise",
          label: "Exercise & Workouts",
          desc: "Workout sets & calorie logs",
          icon: <Dumbbell className="w-5 h-5" />,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          tab: "care",
          subTab: "exercise"
        },
        {
          id: "mental",
          label: "Mental Health & Stress",
          desc: "Symptom logs & relaxation exercises",
          icon: <Brain className="w-5 h-5" />,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          tab: "care",
          subTab: "mental"
        }
      ]
    },
    {
      title: "👴 Family & Specialized Care",
      items: [
        {
          id: "elderly",
          label: "Elderly & Senior Care",
          desc: "Vitals, proxy care & caregiver logs",
          icon: <Heart className="w-5 h-5" />,
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          tab: "care",
          subTab: "elderly"
        },
        {
          id: "kids",
          label: "Kids & Pediatric Care",
          desc: "Growth charts & vaccination schedules",
          icon: <Baby className="w-5 h-5" />,
          color: "text-sky-600",
          bgColor: "bg-sky-50",
          borderColor: "border-sky-200",
          tab: "care",
          subTab: "kids"
        },
        {
          id: "family_tree",
          label: "Family Tree Ancestry",
          desc: "7-generation lineage & identity records",
          icon: <Users className="w-5 h-5" />,
          color: "text-amber-700",
          bgColor: "bg-amber-50/90",
          borderColor: "border-amber-200",
          tab: "care",
          subTab: "family_tree"
        },
        {
          id: "life_dates",
          label: "💝 Important Life Dates & Milestones",
          desc: "Birthdays, anniversaries, Nwaran, Pasni, Bratabandha & Shraddha tithis",
          icon: <Heart className="w-5 h-5" />,
          color: "text-pink-700",
          bgColor: "bg-pink-50",
          borderColor: "border-pink-200",
          tab: "care",
          subTab: "life_dates"
        },
        {
          id: "pets",
          label: "Pet Care & Vet Records",
          desc: "Vaccinations, grooming & pet feeding",
          icon: <Dog className="w-5 h-5" />,
          color: "text-emerald-700",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          tab: "care",
          subTab: "pets"
        }
      ]
    },
    {
      title: "💼 Assets, Finance & Property",
      items: [
        {
          id: "finance",
          label: "Finance & Budget Tracker",
          desc: "Income, expenses & account balances",
          icon: <DollarSign className="w-5 h-5" />,
          color: "text-emerald-800",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          tab: "care",
          subTab: "finance"
        },
        {
          id: "job_search",
          label: "Job Search & Career Builder",
          desc: "Search jobs, ATS resumes, cover letters, SOP & employer posting",
          icon: <Briefcase className="w-5 h-5" />,
          color: "text-indigo-700",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          tab: "care",
          subTab: "jobs"
        },
        {
          id: "staff_payroll",
          label: "Staff & Payroll Manager",
          desc: "Employee attendance, salary & pay slips",
          icon: <Briefcase className="w-5 h-5" />,
          color: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          tab: "care",
          subTab: "staff_payroll"
        },
        {
          id: "paperless",
          label: "📄 IGOPaperless Studio",
          desc: "Virtual visiting cards, ID passes, certificates, contracts & QR tools",
          icon: <FileText className="w-5 h-5" />,
          color: "text-cyan-800",
          bgColor: "bg-cyan-50",
          borderColor: "border-cyan-200",
          tab: "care",
          subTab: "paperless"
        },
        {
          id: "contracts",
          label: "Contracts & Deeds Manager",
          desc: "Bilingual legal templates & witness records",
          icon: <FileText className="w-5 h-5" />,
          color: "text-slate-800",
          bgColor: "bg-slate-100",
          borderColor: "border-slate-300",
          tab: "care",
          subTab: "contracts"
        },
        {
          id: "vehicles",
          label: "Vehicle Care & Maintenance",
          desc: "Fuel mileage, service logs & tax renewals",
          icon: <Car className="w-5 h-5" />,
          color: "text-indigo-800",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          tab: "care",
          subTab: "vehicles"
        },
        {
          id: "property",
          label: "Property & Land Registry",
          desc: "Plot details, tax receipts & tenants",
          icon: <Home className="w-5 h-5" />,
          color: "text-teal-800",
          bgColor: "bg-teal-50",
          borderColor: "border-teal-200",
          tab: "care",
          subTab: "property"
        },
        {
          id: "garden",
          label: "Garden & Farm Manager",
          desc: "Crops, yield logs, soil & livestock",
          icon: <Sprout className="w-5 h-5" />,
          color: "text-emerald-900",
          bgColor: "bg-emerald-100/60",
          borderColor: "border-emerald-300",
          tab: "care",
          subTab: "garden"
        },
        {
          id: "nutrition",
          label: "Nutrition & Meal Planner",
          desc: "Calorie targets, macros & meal prep",
          icon: <Utensils className="w-5 h-5" />,
          color: "text-amber-800",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          tab: "care",
          subTab: "nutrition"
        }
      ]
    }
  ];

  const handleItemClick = (
    tab: "home" | "track" | "plan" | "care" | "more",
    subTab?: string,
    isSosTrigger?: boolean
  ) => {
    if (isSosTrigger && onOpenSosModal) {
      onOpenSosModal();
    }
    onSelectAction(tab, subTab);
    onClose();
  };

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/40">
              Global Quick Menu
            </span>
            <h2 className="text-xl font-black tracking-tight">What do you need?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search any service (e.g. SOS, Medicine, Vehicles, Pet Care, Finance, Farm)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* OVERLAY CONTENT SCROLLABLE LIST */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto grow">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-bold text-slate-600">No matching service found.</p>
              <p className="text-xs text-slate-400">Try searching for 'SOS', 'Water', 'Pet', or 'Finance'.</p>
            </div>
          ) : (
            filteredCategories.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
                  {cat.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.tab, item.subTab, item.isSosTrigger)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs ${item.bgColor} ${item.borderColor}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs ${item.color}`}
                      >
                        {item.icon}
                      </div>
                      <div className="space-y-0.5 min-w-0 grow">
                        <p className={`text-xs font-black flex items-center justify-between ${item.color}`}>
                          <span className="truncate">{item.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
