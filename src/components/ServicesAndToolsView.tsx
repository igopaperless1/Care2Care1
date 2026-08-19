import React, { useState, useRef } from "react";
import { AccountType, DocumentItem, MemoEntry, ServiceProvider } from "../types";
import { ServiceSetupModal } from "./ServiceSetupModal";
import { ToolsAndUtilitiesSuite } from "./ToolsAndUtilitiesSuite";
import { CashCollectionCreditLedgerTracker } from "./CashCollectionCreditLedgerTracker";
import { CustomStoreMarketplace } from "./CustomStoreMarketplace";
import { TicketQueueManagementTracker } from "./TicketQueueManagementTracker";
import { useLanguage } from "../context/LanguageContext";
import {
  Grid,
  FileText,
  BookOpen,
  QrCode,
  ShieldCheck,
  Download,
  Upload,
  Sparkles,
  Phone,
  Briefcase,
  Users,
  Home,
  User,
  Globe,
  Plus,
  Lock,
  Heart,
  Car,
  Dog,
  DollarSign,
  Wrench,
  Stethoscope,
  Calculator,
  RefreshCw,
  Search,
  Check,
  Mic,
  MicOff,
  Square,
  Play,
  Volume2,
  Trash2,
  Tag,
  Star,
  Sliders,
  HardDrive,
  Cloud,
  ArrowLeft
} from "lucide-react";

interface ServicesAndToolsViewProps {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  documents: DocumentItem[];
  memoEntries: MemoEntry[];
  serviceProviders: ServiceProvider[];
  onAddMemoEntry: (entry: MemoEntry) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
  onSelectCareSubTab?: (subTab: string) => void;
  onBack?: () => void;
}

export const ServicesAndToolsView: React.FC<ServicesAndToolsViewProps> = ({
  accountType,
  setAccountType,
  documents,
  memoEntries,
  serviceProviders,
  onAddMemoEntry,
  onExportBackup,
  onImportBackup,
  onSelectCareSubTab,
  onBack,
}) => {
  const { t, formatNumber, formatCurrency, formatDate, formatTime } = useLanguage();
  const [activeSection, setActiveSection] = useState<"services" | "calc" | "docs" | "memo" | "marketplace" | "backup" | "hotel_sales" | "cash_collector" | "pro_directory" | "custom_store" | "ticket_queue">("services");

  // Active Interactive Service Modal State
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);
  const [serviceFeedback, setServiceFeedback] = useState<string | null>(null);
  const [setupModalService, setSetupModalService] = useState<{ id: string; name: string } | null>(null);

  // Filter Category State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [docSearchQuery, setDocSearchQuery] = useState<string>("");

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // HOTEL DAILY SALES STATE
  const [hotelCart, setHotelCart] = useState<Array<{ id: string; name: string; price: number; qty: number; mealType: string }>>([]);
  const [hotelCustomerType, setHotelCustomerType] = useState<"Walk-in" | "Regular" | "VIP">("Walk-in");
  const [hotelTimeDiscount, setHotelTimeDiscount] = useState<"Morning (10% Off)" | "Afternoon (5% Off)" | "Evening (Standard)">("Morning (10% Off)");
  const [hotelPaymentMethod, setHotelPaymentMethod] = useState<"Cash" | "Credit/Debit" | "QR Transfer">("Cash");
  const [hotelSalesLog, setHotelSalesLog] = useState<Array<{ id: string; time: string; customer: string; method: string; total: number; itemsCount: number }>>([
    { id: "inv-901", time: "08:30 AM", customer: "Walk-in Guest", method: "Cash", total: 120, itemsCount: 3 },
    { id: "inv-902", time: "11:15 AM", customer: "VIP (Room 104)", method: "Credit/Debit", total: 450, itemsCount: 4 },
  ]);
  const [hotelInvoiceModal, setHotelInvoiceModal] = useState<any | null>(null);

  // CASH COLLECTOR SYSTEM STATE
  const [cashStatusFilter, setCashStatusFilter] = useState<string>("ALL");
  const [cashLogs, setCashLogs] = useState<Array<{ id: string; accountHolder: string; depositor: string; collector: string; institution: string; amount: number; emiFreq: string; status: "DONE" | "PENDING" | "SKIPPED" | "COLLECTED"; skipReason?: string; date: string }>>([
    { id: "col-101", accountHolder: "John Smith (AC-9910)", depositor: "John Smith", collector: "Officer Mark Davis", institution: "Care2Care Micro-Finance", amount: 150, emiFreq: "Monthly", status: "DONE", date: "2026-08-04" },
    { id: "col-102", accountHolder: "Sarah Vance (AC-8821)", depositor: "Robert Vance", collector: "Officer Mark Davis", institution: "Care2Care Micro-Finance", amount: 200, emiFreq: "Weekly", status: "SKIPPED", skipReason: "Out of town until Thursday", date: "2026-08-04" },
    { id: "col-103", accountHolder: "David Miller (AC-4402)", depositor: "David Miller", collector: "Officer Lisa Wong", institution: "Care2Care Savings", amount: 350, emiFreq: "Monthly", status: "PENDING", date: "2026-08-05" },
    { id: "col-104", accountHolder: "Anita Patel (AC-1109)", depositor: "Anita Patel", collector: "Officer Lisa Wong", institution: "Care2Care Savings", amount: 100, emiFreq: "Daily", status: "COLLECTED", date: "2026-08-04" },
  ]);
  const [showAddCashModal, setShowAddCashModal] = useState(false);
  const [newCashHolder, setNewCashHolder] = useState("Robert Chen (AC-7731)");
  const [newCashDepositor, setNewCashDepositor] = useState("Robert Chen");
  const [newCashCollector, setNewCashCollector] = useState("Agent Mark Davis");
  const [newCashInst, setNewCashInst] = useState("Care2Care Micro-Finance");
  const [newCashAmount, setNewCashAmount] = useState(250);
  const [newCashStatus, setNewCashStatus] = useState<"DONE" | "PENDING" | "SKIPPED" | "COLLECTED">("DONE");
  const [newCashSkipReason, setNewCashSkipReason] = useState("");

  // PROFESSIONAL DIRECTORY & CAREGIVER MARKETPLACE STATE
  const [proCatFilter, setProCatFilter] = useState<string>("All");
  const [proSearchKw, setProSearchKw] = useState<string>("");
  const [proProviders, setProProviders] = useState<Array<{ id: string; name: string; title: string; category: string; rating: number; rate: string; location: string; verified: boolean; phone: string }>>([
    { id: "p1", name: "David Miller", title: "Master Carpenter & Shuttering Expert", category: "Construction & Trades", rating: 4.9, rate: "$35/hr", location: "Sydney, NSW", verified: true, phone: "+61 400 112 233" },
    { id: "p2", name: "Elena Rostova", title: "Certified Senior & Pediatric Nurse Caregiver", category: "Medical & Healthcare", rating: 5.0, rate: "$30/hr", location: "Auckland, NZ", verified: true, phone: "+64 21 889 012" },
    { id: "p3", name: "Marcus Thorne", title: "Licensed Master Electrician & HVAC Tech", category: "Technical Services", rating: 4.8, rate: "$45/hr", location: "London, UK", verified: true, phone: "+44 7700 900123" },
    { id: "p4", name: "Rapid Response Unit #4", title: "Emergency Paramedic & Ambulance Patrol", category: "Emergency Services", rating: 4.9, rate: "Emergency Line", location: "Toronto, ON", verified: true, phone: "911 / Direct Dispatch" },
    { id: "p5", name: "Sophia Martinez", title: "Corporate Tax Advisor & Legal Consultant", category: "Professional Services", rating: 4.9, rate: "$80/hr", location: "Chicago, IL", verified: true, phone: "+1 (555) 443-2211" },
    { id: "p6", name: "Hope Rescue Foundation", title: "Non-Profit Human Trafficking Rescue Shelter", category: "Organizations", rating: 5.0, rate: "Non-Profit", location: "Global / Regional HQ", verified: true, phone: "+1 (800) 555-SAFE" },
  ]);
  const [matchingModalOpen, setMatchingModalOpen] = useState(false);

  // Favourites state saved in localStorage
  const [favouriteServices, setFavouriteServices] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_favourite_services");
      return saved ? JSON.parse(saved) : ["Menstrual Health & Cycle Care", "Water Drink Notifier", "Medicine Reminder", "Finance & Income Tracker"];
    } catch {
      return ["Menstrual Health & Cycle Care", "Water Drink Notifier", "Medicine Reminder", "Finance & Income Tracker"];
    }
  });

  const toggleFavourite = (serviceName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavouriteServices((prev) => {
      const updated = prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName];
      try {
        localStorage.setItem("care2care_favourite_services", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Microphone Voice Recording State for Memo Entry
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      alert("Microphone access failed or permission denied.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Custom Form & Filler States for Service Modals
  const [waterGoal, setWaterGoal] = useState<number>(2500);
  const [waterSound, setWaterSound] = useState<string>("Gentle Bell");
  const [waterInterval, setWaterInterval] = useState<string>("60 mins");

  const [medFormName, setMedFormName] = useState("Lisinopril 10mg");
  const [medFormFreq, setMedFormFreq] = useState("Twice Daily");
  const [medFormTime, setMedFormTime] = useState("08:00 AM");
  const [medFormFood, setMedFormFood] = useState("After Meal");

  const [yogaRoutine, setYogaRoutine] = useState("Morning Zen & Stretch");
  const [yogaDuration, setYogaDuration] = useState("10 mins");
  const [yogaTimerActive, setYogaTimerActive] = useState(false);
  const [yogaSecondsLeft, setYogaSecondsLeft] = useState(600);

  const [moodSelect, setMoodSelect] = useState("😃 Great");
  const [energyLevel, setEnergyLevel] = useState(8);
  const [moodReflection, setMoodReflection] = useState("Feeling energetic and relaxed today.");

  const [seniorName, setSeniorName] = useState("Grandpa Robert");
  const [seniorMobility, setSeniorMobility] = useState("Walking Aid Required");
  const [seniorContact, setSeniorContact] = useState("+1 (555) 321-7890");

  const [kidName, setKidName] = useState("Little Leo");
  const [kidAge, setKidAge] = useState("6");
  const [kidVaccineDue, setKidVaccineDue] = useState("2026-09-15");

  const [sickCondition, setSickCondition] = useState("Post-Op Hip Recovery");
  const [sickTemp, setSickTemp] = useState("98.6 °F");
  const [sickPainScale, setSickPainScale] = useState(3);

  const [familyRelName, setFamilyRelName] = useState("Great-Grandmother Eleanor");
  const [familyGen, setFamilyGen] = useState("3rd Generation");
  const [familyBirthYear, setFamilyBirthYear] = useState("1938");

  const [staffName, setStaffName] = useState("Nurse Sarah Jenkins");
  const [staffRate, setStaffRate] = useState("$28/hr");
  const [staffProofUrl, setStaffProofUrl] = useState("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80");

  const [idName, setIdName] = useState("Sarah Jenkins");
  const [idRole, setIdRole] = useState("Certified Senior Care Specialist");
  const [idNumber, setIdNumber] = useState("C2C-2026-8891");

  const [farmPlotName, setFarmPlotName] = useState("North Acre Meadow");
  const [farmCropName, setFarmCropName] = useState("Organic Wheat & Barley");
  const [farmAcreage, setFarmAcreage] = useState("4.2 Acres");

  const [gardenPlant, setGardenPlant] = useState("Heirloom Tomatoes & Basil");
  const [gardenWaterFreq, setGardenWaterFreq] = useState("Every 2 Days");

  const [propAddress, setPropAddress] = useState("104 Sunshine Valley Ave");
  const [propIssue, setPropIssue] = useState("HVAC Inspection & Plumbing Check");
  const [propCost, setPropCost] = useState("$150");

  const [socNoticeTitle, setSocNoticeTitle] = useState("Annual Community Health Camp");
  const [socEventDate, setSocEventDate] = useState("2026-08-10");

  const [vehNameVal, setVehNameVal] = useState("Toyota RAV4 Hybrid");
  const [vehPlateVal, setVehPlateVal] = useState("CA-7892-X");
  const [vehFuelVal, setVehFuelVal] = useState("85% Full");

  const [petNameVal, setPetNameVal] = useState("Buddy the Golden Retriever");
  const [petVaccineVal, setPetVaccineVal] = useState("Rabies & DHPP Due Sept 2026");

  const [finTitleVal, setFinTitleVal] = useState("Pharmacy & Medical Care Supplies");
  const [finAmountVal, setFinAmountVal] = useState("120.00");
  const [finTypeVal, setFinTypeVal] = useState<"income" | "expense">("expense");

  // Master Setup State for ServicesAndToolsView Modals
  const [srvCategorySelect, setSrvCategorySelect] = useState<string>("Health & Care");
  const [srvCustomCategoryInput, setSrvCustomCategoryInput] = useState<string>("");
  const [srvTimings, setSrvTimings] = useState<string[]>(["08:00 AM", "02:00 PM", "08:00 PM"]);
  const [srvNewTimingInput, setSrvNewTimingInput] = useState<string>("");
  const [srvRemindBefore, setSrvRemindBefore] = useState<string>("15 mins before");
  const [srvRingtone, setSrvRingtone] = useState<string>("Gentle Bell");
  const [srvCustomAudioName, setSrvCustomAudioName] = useState<string>("");
  const [srvVibration, setSrvVibration] = useState<string>("Gentle Pulse");
  const [srvProofPhotoUrl, setSrvProofPhotoUrl] = useState<string | null>(null);
  const [srvProofVideoName, setSrvProofVideoName] = useState<string | null>(null);
  const [srvProofAudioName, setSrvProofAudioName] = useState<string | null>(null);
  const [srvGpsLocation, setSrvGpsLocation] = useState<string>("GPS: 37.7749° N, 122.4194° W");
  const [srvNotes, setSrvNotes] = useState<string>("");
  const [srvExtraFields, setSrvExtraFields] = useState<Array<{ id: string; label: string; value: string }>>([]);

  // Calculator State
  const [calcInput, setCalcInput] = useState<string>("0");
  const [currencyVal, setCurrencyVal] = useState<number>(100);
  const [currencyFrom, setCurrencyFrom] = useState<string>("USD");
  const [currencyTo, setCurrencyTo] = useState<string>("EUR");

  // Document Generator State
  const [docType, setDocType] = useState<"sop" | "resume" | "idcard" | "visiting">("sop");
  const [docName, setDocName] = useState("");
  const [docDetails, setDocDetails] = useState("");
  const [generatedDoc, setGeneratedDoc] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Memo Book Form
  const [memoAuthor, setMemoAuthor] = useState("");
  const [memoMessage, setMemoMessage] = useState("");
  const [memoMemory, setMemoMemory] = useState("");
  const [memoSong, setMemoSong] = useState("");

  const handleSaveServiceData = (serviceName: string) => {
    setServiceFeedback(`✅ Setup and records updated successfully for ${serviceName}!`);
    setTimeout(() => {
      setServiceFeedback(null);
      setActiveServiceModal(null);
    }, 1200);
  };

  const handleCalcClick = (val: string) => {
    if (val === "C") {
      setCalcInput("0");
    } else if (val === "=") {
      try {
        // Safe evaluation
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, "");
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcInput(String(res));
      } catch {
        setCalcInput("Error");
      }
    } else {
      setCalcInput((prev) => (prev === "0" || prev === "Error" ? val : prev + val));
    }
  };

  const handleGenerateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          name: docName || "Caregiver Staff",
          details: docDetails,
        }),
      });
      const data = await res.json();
      setGeneratedDoc(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddMemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoAuthor || !memoMessage) return;

    const newMemo: MemoEntry = {
      id: "memo-" + Date.now(),
      authorName: memoAuthor,
      relation: "Friend / Family",
      message: memoMessage,
      favoriteMemory: memoMemory || "Cherished memories together",
      favoriteSong: memoSong || "Classic 2000s Hits",
      sticker: "🌟",
      date: new Date().toLocaleDateString(),
      voiceNoteUrl: recordedAudioUrl || undefined,
    };

    onAddMemoEntry(newMemo);
    setMemoAuthor("");
    setMemoMessage("");
    setMemoMemory("");
    setMemoSong("");
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
  };

  const allServicesList = [
    { name: "Menstrual Health & Cycle Care", icon: "🌸", cat: "Personal", desc: "Cycle calendar, fertility predictions, symptom logs & period calculator", subTab: "menstrual" },
    { name: "Water Drink Notifier", icon: "💧", cat: "Personal", desc: "Goal tracking & hourly alerts", subTab: "water" },
    { name: "Medicine Reminder", icon: "💊", cat: "Personal", desc: "OCR scanner & alarms", subTab: "medicine" },
    { name: "Yoga & Meditation", icon: "🧘", cat: "Personal", desc: "Guided breathing & mindfulness", subTab: "yoga" },
    { name: "Mood & Habit Journal", icon: "😊", cat: "Personal", desc: "Daily emotional check-ins", subTab: "mood" },
    { name: "Mental Health & Stress Management", icon: "🧠", cat: "Personal", desc: "Check-ins, PHQ-9, GAD-7, CBT & crisis support", subTab: "mental" },
    { name: "Habit Builder & Addiction Recovery", icon: "📈", cat: "Personal", desc: "Good & bad habits, sobriety & screen time", subTab: "habit" },
    { name: "Exercise Tracker", icon: "🏋️", cat: "Personal", desc: "Workouts, sets, reps & rest timer", subTab: "exercise" },
    { name: "Elderly & Senior Care", icon: "👴", cat: "Family", desc: "Vitals, logs & proxy contacts", subTab: "elderly" },
    { name: "Kids & Pediatric Care", icon: "👶", cat: "Family", desc: "Growth, school & vaccines", subTab: "kids" },
    { name: "Sick & Post-Op Care", icon: "🤕", cat: "Family", desc: "Temperature & analgesic logs", subTab: "sick" },
    { name: "Family Tree Ancestry", icon: "👨‍👩‍👧‍👦", cat: "Family", desc: "7 Generations historical archive", subTab: "family_tree" },
    { name: "Important Life Dates & Milestones", icon: "💝", cat: "Family", desc: "Birthdays, anniversaries, Nwaran, Pasni, Bratabandha & Shraddha tithis", subTab: "life_dates" },
    { name: "Staff & Payroll Care", icon: "💼", cat: "Professional", desc: "Timesheets, salary & proof of work", subTab: "staff_payroll" },
    { name: "Inventory Management", icon: "📦", cat: "Professional", desc: "Stock tracking, reorders, barcode & profit margins", subTab: "inventory" },
    { name: "SOP & Resume Generator", icon: "📄", cat: "Professional", desc: "AI document templates" },
    { name: "ID Card & QR Creator", icon: "🪪", cat: "Professional", desc: "Printable staff badges" },
    { name: "Farm & Crop Planning", icon: "🌾", cat: "Land & Property", desc: "Acreage, crops & fertilizer logs", subTab: "garden" },
    { name: "Garden & Soil Tracker", icon: "🌺", cat: "Land & Property", desc: "Irrigation & pest control", subTab: "garden" },
    { name: "Property Maintenance", icon: "🏠", cat: "Land & Property", desc: "Tenant agreements & repairs", subTab: "property" },
    { name: "Community & Society", icon: "🏛️", cat: "Community", desc: "Events, funds & announcements" },
    { name: "Vehicle Fuel & PUC Care", icon: "🚗", cat: "Property", desc: "Service reminders & mileage", subTab: "vehicles" },
    { name: "Pet & Vet Vaccinations", icon: "🐾", cat: "Family", desc: "Vaccine cards & vet logs", subTab: "pets" },
    { name: "Marketplace & Directory", icon: "🛒", cat: "Professional", desc: "Build online store for physical products, digital files & services with Khalti/eSewa", subTab: "custom_store" },
    { name: "Ticket & Queue Management", icon: "🎟️", cat: "Tools", desc: "Hospital OPD, Passport, Consular, TU & Bank live token counter with vocal announcements", sectionTarget: "ticket_queue" },
    { name: "Cash Collectors & Credit Matrix", icon: "🧾", cat: "Finance", desc: "Field deposit collection grid & retailer credit purchase/sales ledger", sectionTarget: "cash_collector" },
    { name: "Finance & Income Tracker", icon: "💰", cat: "Finance", desc: "Budgets & expense reports", subTab: "finance" },
    { name: "40+ Calendar System", icon: "🌐", cat: "Tools", desc: "Vikram, Hijri, Lunar, Ethiopian", subTab: "calendar" },
    { name: "Emergency SOS Broadcast", icon: "🆘", cat: "Safety", desc: "1-Tap coordinates broadcast", subTab: "sos" },
  ];

  const filteredServices = allServicesList
    .filter((s) => {
      const q = (searchQuery || "").toLowerCase();
      const cat = (selectedCategory || "").toLowerCase();
      const matchesCat = selectedCategory === "all" || (s.cat || "").toLowerCase() === cat;
      const matchesSearch = (s.name || "").toLowerCase().includes(q) || (s.desc || "").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      const isFavA = favouriteServices.includes(a.name) ? 1 : 0;
      const isFavB = favouriteServices.includes(b.name) ? 1 : 0;
      return isFavB - isFavA;
    });

  // Currency Exchange Rates simulation
  const currencyRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    INR: 83.5,
    NPR: 133.6,
    CAD: 1.36,
    AUD: 1.51,
  };

  const convertedCurrency = ((currencyVal * (currencyRates[currencyTo] || 1)) / (currencyRates[currencyFrom] || 1)).toFixed(2);

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1 font-bold text-xs shrink-0"
            title="Back to Previous Screen"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-600" /> Care2Care Services Hub
          </h1>
          <p className="text-xs text-slate-500">
            Complete directory of 150+ personal, family, professional, land, document, and utility tools.
          </p>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveSection("services")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "services" ? "bg-emerald-800 text-white shadow-2xs font-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          🗂️ 150+ Services Directory
        </button>
        <button
          onClick={() => setActiveSection("hotel_sales")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "hotel_sales" ? "bg-emerald-800 text-white shadow-2xs font-black" : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          🏨 Small Hotel Daily Sales
        </button>
        <button
          onClick={() => setActiveSection("custom_store")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "custom_store" ? "bg-[#2E7D32] text-white shadow-2xs font-black" : "bg-[#2E7D32]/10 text-[#2E7D32] border border-emerald-300 hover:bg-[#2E7D32]/20"
          }`}
        >
          🛒 Marketplace & Directory
        </button>
        <button
          onClick={() => setActiveSection("ticket_queue")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "ticket_queue" ? "bg-indigo-900 text-white shadow-2xs font-black" : "bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100"
          }`}
        >
          🎟️ Ticket & Queue System
        </button>
        <button
          onClick={() => setActiveSection("cash_collector")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "cash_collector" ? "bg-emerald-800 text-white shadow-2xs font-black" : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          💰 Cash Collector System
        </button>
        <button
          onClick={() => setActiveSection("pro_directory")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "pro_directory" ? "bg-emerald-800 text-white shadow-2xs font-black" : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          👨‍🔧 Trades & Caregiver Directory
        </button>
        <button
          onClick={() => setActiveSection("calc")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "calc" ? "bg-emerald-800 text-white shadow-2xs font-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          🧮 Calculator & Converters
        </button>
        <button
          onClick={() => setActiveSection("docs")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "docs" ? "bg-emerald-800 text-white shadow-2xs font-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          📄 Document Tools
        </button>
        <button
          onClick={() => setActiveSection("memo")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "memo" ? "bg-emerald-800 text-white shadow-2xs font-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          📓 2000s Memo Book
        </button>
        <button
          onClick={() => setActiveSection("backup")}
          className={`py-2 px-3 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === "backup" ? "bg-emerald-800 text-white shadow-2xs font-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          🔐 Offline Backups
        </button>
      </div>

      {/* SECTION: CUSTOM STORE & MARKETPLACE */}
      {activeSection === "custom_store" && (
        <CustomStoreMarketplace onBackToServices={() => setActiveSection("services")} />
      )}

      {/* SECTION: TICKET & QUEUE MANAGEMENT SYSTEM */}
      {activeSection === "ticket_queue" && <TicketQueueManagementTracker />}

      {/* SECTION: SMALL HOTEL DAILY SALES */}
      {activeSection === "hotel_sales" && (
        <div className="space-y-4">
          <div className="bg-emerald-900 text-white rounded-3xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2 text-emerald-100">
                  🏨 Small Hotel & Diner Daily Sales Tracker
                </h3>
                <p className="text-xs text-emerald-200">
                  Pre-set menu billing, time-wise discounts, customer types & cash/credit receipt generator.
                </p>
              </div>
              <span className="text-[10px] bg-emerald-800 text-emerald-300 font-mono px-2.5 py-1 rounded-full border border-emerald-700">
                Karobar POS v2.6
              </span>
            </div>

            {/* Config Controls: Time-wise discount & Customer type & Payment method */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-emerald-300 block mb-1">Time-Wise Slot Discount</label>
                <select
                  value={hotelTimeDiscount}
                  onChange={(e: any) => setHotelTimeDiscount(e.target.value)}
                  className="w-full bg-emerald-950 text-emerald-100 border border-emerald-700 rounded-xl p-2 font-bold"
                >
                  <option value="Morning (10% Off)">🌅 Morning Slot (10% Discount)</option>
                  <option value="Afternoon (5% Off)">☀️ Afternoon Slot (5% Discount)</option>
                  <option value="Evening (Standard)">🌙 Evening Slot (Standard Price)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-emerald-300 block mb-1">Customer Classification</label>
                <select
                  value={hotelCustomerType}
                  onChange={(e: any) => setHotelCustomerType(e.target.value)}
                  className="w-full bg-emerald-950 text-emerald-100 border border-emerald-700 rounded-xl p-2 font-bold"
                >
                  <option value="Walk-in">🚶 Walk-in Guest</option>
                  <option value="Regular">👤 Regular Customer</option>
                  <option value="VIP">⭐ VIP / In-house Resident (10% Off)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-emerald-300 block mb-1">Payment Channel</label>
                <select
                  value={hotelPaymentMethod}
                  onChange={(e: any) => setHotelPaymentMethod(e.target.value)}
                  className="w-full bg-emerald-950 text-emerald-100 border border-emerald-700 rounded-xl p-2 font-bold"
                >
                  <option value="Cash">💵 Cash Settlement</option>
                  <option value="Credit/Debit">💳 Credit / Debit POS Card</option>
                  <option value="QR Transfer">📱 Fonepay / QR Transfer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pre-set Menu Grid */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                🍽️ Pre-Set Hotel Menu Items
              </h4>

              {[
                {
                  cat: "Breakfast Items",
                  icon: "🍳",
                  items: [
                    { id: "b1", name: "Masala Tea", price: 20 },
                    { id: "b2", name: "Filter Coffee", price: 30 },
                    { id: "b3", name: "Double Egg Omelette", price: 50 },
                    { id: "b4", name: "Aloo Paratha", price: 40 },
                    { id: "b5", name: "Butter Toast", price: 25 },
                  ],
                },
                {
                  cat: "Lunch Specialties",
                  icon: "🍛",
                  items: [
                    { id: "l1", name: "Steamed Basmati Rice", price: 100 },
                    { id: "l2", name: "Yellow Daal Fry", price: 80 },
                    { id: "l3", name: "Local Chicken Curry", price: 150 },
                    { id: "l4", name: "Fresh Veg Curry", price: 120 },
                    { id: "l5", name: "Hakka Noodles", price: 130 },
                  ],
                },
                {
                  cat: "Dinner & Grills",
                  icon: "🍲",
                  items: [
                    { id: "d1", name: "Sizzler Steak", price: 250 },
                    { id: "d2", name: "Creamy Alfredo Pasta", price: 180 },
                    { id: "d3", name: "Pan Pizza", price: 300 },
                    { id: "d4", name: "Green Garden Salad", price: 100 },
                    { id: "d5", name: "Hot Mushroom Soup", price: 90 },
                  ],
                },
                {
                  cat: "Beverages & Cold Drinks",
                  icon: "🥤",
                  items: [
                    { id: "v1", name: "Mineral Water (1L)", price: 10 },
                    { id: "v2", name: "Fresh Orange Juice", price: 60 },
                    { id: "v3", name: "Cold Soda / Cola", price: 40 },
                    { id: "v4", name: "Sweet Lassi", price: 50 },
                  ],
                },
              ].map((section) => (
                <div key={section.cat} className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-2">
                  <span className="text-[11px] font-black text-emerald-800 flex items-center gap-1">
                    <span>{section.icon}</span> {section.cat}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {section.items.map((item) => {
                      const inCart = hotelCart.find((c) => c.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className="bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-xl p-2 flex flex-col justify-between cursor-pointer transition-colors"
                          onClick={() => {
                            setHotelCart((prev) => {
                              const existing = prev.find((c) => c.id === item.id);
                              if (existing) {
                                return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
                              }
                              return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, mealType: section.cat }];
                            });
                          }}
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-tight">{item.name}</p>
                            <p className="text-[11px] font-extrabold text-emerald-700 mt-0.5">Rs. {item.price}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                            <span className="text-[10px] font-extrabold text-slate-500">
                              {inCart ? `Qty: ${inCart.qty}` : "+ Add"}
                            </span>
                            <span className="bg-emerald-700 text-white rounded-md text-[10px] font-bold px-1.5 py-0.5">
                              +
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Cart & Billing Checkout Panel */}
            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3 shadow-xs sticky top-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    🛒 Order Cart ({hotelCart.reduce((sum, i) => sum + i.qty, 0)})
                  </h4>
                  {hotelCart.length > 0 && (
                    <button
                      onClick={() => setHotelCart([])}
                      className="text-[10px] font-bold text-rose-600 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {hotelCart.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">
                    No items selected. Tap any menu item to add to bill.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {hotelCart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-500">Rs. {item.price} x {item.qty}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setHotelCart((prev) =>
                                prev
                                  .map((c) => (c.id === item.id ? { ...c, qty: c.qty - 1 } : c))
                                  .filter((c) => c.qty > 0)
                              );
                            }}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 font-bold rounded-md flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="font-extrabold px-1">{item.qty}</span>
                          <button
                            onClick={() => {
                              setHotelCart((prev) =>
                                prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
                              );
                            }}
                            className="w-5 h-5 bg-emerald-600 text-white font-bold rounded-md flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Calculation Summary */}
                {(() => {
                  const subtotal = hotelCart.reduce((sum, i) => sum + i.price * i.qty, 0);
                  const timeDiscPct = hotelTimeDiscount.includes("10%") ? 0.10 : hotelTimeDiscount.includes("5%") ? 0.05 : 0;
                  const vipDiscPct = hotelCustomerType === "VIP" ? 0.10 : 0;
                  const discountAmt = subtotal * (timeDiscPct + vipDiscPct);
                  const grandTotal = Math.max(0, Math.round(subtotal - discountAmt));

                  return (
                    <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs font-semibold text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Subtotal:</span>
                        <span>Rs. {subtotal}</span>
                      </div>
                      {discountAmt > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Applied Discounts:</span>
                          <span>- Rs. {Math.round(discountAmt)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-200 pt-2">
                        <span>Grand Total:</span>
                        <span className="text-emerald-800">Rs. {grandTotal}</span>
                      </div>

                      <button
                        disabled={hotelCart.length === 0}
                        onClick={() => {
                          const newInv = {
                            id: `inv-${Math.floor(1000 + Math.random() * 9000)}`,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            customer: hotelCustomerType,
                            method: hotelPaymentMethod,
                            total: grandTotal,
                            itemsCount: hotelCart.reduce((s, i) => s + i.qty, 0),
                            items: [...hotelCart],
                            subtotal,
                            discountAmt,
                          };
                          setHotelSalesLog([newInv, ...hotelSalesLog]);
                          setHotelInvoiceModal(newInv);
                          setHotelCart([]);
                          showToast(`Recorded Sale #${newInv.id} of Rs. ${grandTotal}!`);
                        }}
                        className={`w-full py-3 rounded-2xl font-black text-xs text-white shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          hotelCart.length === 0
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-emerald-800 hover:bg-emerald-900 active:scale-98"
                        }`}
                      >
                        📄 Settle & Print Invoice (Rs. {grandTotal})
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Recent Sales Ledger */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                📊 Daily Sales Revenue Ledger
              </h4>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                Total Revenue Today: Rs. {hotelSalesLog.reduce((s, l) => s + l.total, 0)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-2">Invoice ID</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Method</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hotelSalesLog.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 font-semibold text-slate-700">
                      <td className="p-2 font-mono text-emerald-800 font-bold">{log.id}</td>
                      <td className="p-2">{log.time}</td>
                      <td className="p-2">{log.customer}</td>
                      <td className="p-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {log.method}
                        </span>
                      </td>
                      <td className="p-2 text-right font-extrabold text-slate-900">Rs. {log.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: CASH COLLECTOR SYSTEM & CREDIT LEDGER MATRIX */}
      {activeSection === "cash_collector" && (
        <CashCollectionCreditLedgerTracker onBackToFinance={() => setActiveSection("services")} />
      )}

      {/* SECTION: PROFESSIONAL DIRECTORY & CAREGIVER MARKETPLACE */}
      {activeSection === "pro_directory" && (
        <div className="space-y-4">
          <div className="bg-emerald-900 text-white rounded-3xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2 text-emerald-100">
                  👨‍🔧 Trades & Caregiver Directory Marketplace
                </h3>
                <p className="text-xs text-emerald-200">
                  6 Category verified service providers, ratings, hourly rates & direct employer matching.
                </p>
              </div>
              <button
                onClick={() => setMatchingModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-sm cursor-pointer"
              >
                🤝 Caregiver Matchmaker
              </button>
            </div>

            {/* Category Pill Filters */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-bold">
              {[
                "All",
                "Construction & Trades",
                "Technical Services",
                "Medical & Healthcare",
                "Emergency Services",
                "Professional Services",
                "Organizations",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProCatFilter(cat)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    proCatFilter === cat
                      ? "bg-emerald-500 text-slate-950 font-black"
                      : "bg-emerald-950 text-emerald-200 border border-emerald-800 hover:bg-emerald-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {proProviders
              .filter((p) => proCatFilter === "All" || p.category === proCatFilter)
              .map((prov) => (
                <div key={prov.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-2xs hover:border-emerald-500 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{prov.name}</h4>
                      <p className="text-xs font-semibold text-emerald-800">{prov.title}</p>
                    </div>
                    {prov.verified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <span>⭐ {prov.rating} / 5.0</span>
                    <span className="text-emerald-700">{prov.rate}</span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    📍 {prov.location}
                  </p>

                  <button
                    onClick={() => showToast(`Contacting ${prov.name} at ${prov.phone}...`)}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    📞 Contact & Hire ({prov.phone})
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SECTION 1: 150+ SERVICES DIRECTORY & SEARCH */}
      {activeSection === "services" && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" /> Categorized Services Explorer
              </h3>
              <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full">
                150+ Active
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search services (e.g. water, farm, payroll, pet)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-800 text-white placeholder-slate-400 border border-slate-700 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            {/* Category Filter Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-bold">
              {["all", "personal", "family", "professional", "land & property", "community", "finance", "safety"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-xl transition-all capitalize cursor-pointer ${
                    selectedCategory === cat ? "bg-emerald-500 text-slate-950 font-extrabold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FEATURED 3 MAJOR BUSINESS SERVICES QUICK LAUNCHER BANNER */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-600 rounded-3xl p-4 sm:p-5 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                  ⭐ 3 Major Business & Care Services Suite
                </h4>
                <p className="text-[11px] text-emerald-100/90 font-medium">
                  Direct access to specialized POS, cash collector ledger & caregiver marketplace.
                </p>
              </div>
              <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-full uppercase">
                Active Tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setActiveSection("hotel_sales")}
                className="bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-600/80 p-3.5 rounded-2xl cursor-pointer transition-all space-y-1.5 shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-100 flex items-center gap-1">
                    🏨 Small Hotel Sales
                  </span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-md font-bold">
                    POS
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 font-medium leading-tight">
                  Pre-set menu, time-based discounts (10% morning), cash/card POS receipt printer.
                </p>
                <button className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl mt-1 cursor-pointer transition-colors">
                  Launch Hotel POS →
                </button>
              </div>

              <div
                onClick={() => setActiveSection("cash_collector")}
                className="bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-600/80 p-3.5 rounded-2xl cursor-pointer transition-all space-y-1.5 shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-100 flex items-center gap-1">
                    💰 Cash Collector
                  </span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-md font-bold">
                    Ledger
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 font-medium leading-tight">
                  Account holder, depositor, collector, status badges (DONE/SKIPPED) & reasons.
                </p>
                <button className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl mt-1 cursor-pointer transition-colors">
                  Open Cash Collector →
                </button>
              </div>

              <div
                onClick={() => setActiveSection("pro_directory")}
                className="bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-600/80 p-3.5 rounded-2xl cursor-pointer transition-all space-y-1.5 shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-100 flex items-center gap-1">
                    👨‍🔧 Trades & Caregivers
                  </span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-md font-bold">
                    Market
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 font-medium leading-tight">
                  6 category providers, verified ratings, rates & caregiver employer matchmaker.
                </p>
                <button className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl mt-1 cursor-pointer transition-colors">
                  Explore Directory →
                </button>
              </div>
            </div>
          </div>

          {/* Categorized Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {filteredServices.map((serv, idx) => {
              const isFav = favouriteServices.includes(serv.name);
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (serv.subTab && onSelectCareSubTab) {
                      onSelectCareSubTab(serv.subTab);
                    } else {
                      setActiveServiceModal(serv.name);
                    }
                  }}
                  className={`bg-white border rounded-2xl p-3.5 space-y-1 text-left shadow-2xs transition-all cursor-pointer group relative ${
                    isFav
                      ? "border-amber-300 bg-gradient-to-br from-amber-50/40 via-white to-white ring-1 ring-amber-300/50 shadow-xs"
                      : "border-slate-100 hover:border-indigo-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg group-hover:scale-110 transition-transform">{serv.icon}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-700 text-slate-600 px-1.5 py-0.5 rounded-full uppercase">
                        {serv.cat}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const sId = serv.subTab || serv.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
                          setSetupModalService({ id: sId, name: serv.name });
                        }}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                        title="⚙️ Choose & Setup Features for this Service"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleFavourite(serv.name, e)}
                        className="p-1 rounded-full hover:bg-amber-100/70 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                        title={isFav ? "Remove from Favourites" : "Add to Favourites"}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? "text-amber-400 fill-amber-400" : ""}`} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 flex items-center justify-between gap-1">
                    <span>{serv.name}</span>
                    {isFav && <span className="text-[9px] font-black text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded-md">⭐ Priority</span>}
                  </h4>
                  <p className="text-[10px] text-slate-400">{serv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: CALCULATOR & CONVERTERS SUITE */}
      {activeSection === "calc" && (
        <ToolsAndUtilitiesSuite onShowToast={showToast} />
      )}

      {/* SECTION 3: DOCUMENT TOOLS & GENERATOR */}
      {activeSection === "docs" && (
        <div className="space-y-4">
          {/* SEARCH INPUT BAR FOR DOCUMENTS & TAGS */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search documents by title or tag (e.g., Medical, Deed, Insurance, Grandma)..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
              />
              {docSearchQuery && (
                <button
                  onClick={() => setDocSearchQuery("")}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 cursor-pointer shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
            {docSearchQuery && (
              <p className="text-[10px] text-slate-500 font-medium px-1">
                Showing {documents.filter((doc) => {
                  const q = docSearchQuery.trim().toLowerCase();
                  if (!q) return true;
                  const matchTitle = (doc.title || "").toLowerCase().includes(q);
                  const matchCategory = (doc.category || "").toLowerCase().includes(q);
                  const matchSnippet = (doc.contentSnippet || "").toLowerCase().includes(q);
                  const matchTags = doc.tags ? doc.tags.some((t) => t.toLowerCase().includes(q)) : false;
                  return matchTitle || matchCategory || matchSnippet || matchTags;
                }).length} matching documents for "{docSearchQuery}"
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> AI Document Creator & ID Card Generator
            </h3>

            <form onSubmit={handleGenerateDoc} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Document Type</label>
                <select
                  value={docType}
                  onChange={(e: any) => setDocType(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  <option value="sop">Statement of Purpose (SOP)</option>
                  <option value="resume">Caregiver Resume / CV</option>
                  <option value="idcard">Staff ID Card Data</option>
                  <option value="visiting">Visiting Business Card</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500">Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Vance"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500">Key Context & Experience</label>
                <textarea
                  placeholder="e.g. 10 years elderly care experience, CPR certified..."
                  value={docDetails}
                  onChange={(e) => setDocDetails(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                {isGenerating ? "Generating Document with AI..." : "Generate Professional Document"}
              </button>
            </form>

            {generatedDoc && (
              <div className="bg-slate-50 border border-indigo-100 rounded-2xl p-4 text-xs space-y-2">
                <h4 className="font-bold text-indigo-900">{generatedDoc.title}</h4>
                <div className="whitespace-pre-wrap text-slate-700 max-h-48 overflow-y-auto bg-white p-3 rounded-xl border border-slate-200">
                  {generatedDoc.content}
                </div>
              </div>
            )}
          </div>

          {/* Encrypted Vault List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Encrypted Document Vault</h3>
            {documents
              .filter((doc) => {
                const q = docSearchQuery.trim().toLowerCase();
                if (!q) return true;
                const matchTitle = (doc.title || "").toLowerCase().includes(q);
                const matchCategory = (doc.category || "").toLowerCase().includes(q);
                const matchSnippet = (doc.contentSnippet || "").toLowerCase().includes(q);
                const matchTags = doc.tags ? doc.tags.some((t) => t.toLowerCase().includes(q)) : false;
                return matchTitle || matchCategory || matchSnippet || matchTags;
              })
              .map((doc) => (
                <div key={doc.id} className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.fileType}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{doc.title}</h4>
                        <p className="text-[10px] text-slate-400">{doc.category} • Uploaded {doc.uploadDate}</p>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                      <Lock className="w-2.5 h-2.5" /> Encrypted
                    </span>
                  </div>

                  {/* Document Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-50">
                      {doc.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" /> #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SECTION 4: 2000s RETRO FAMILY MEMO BOOK */}
      {activeSection === "memo" && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" /> 2000s Retro Family & Friend Memo Book
            </h3>
            <p className="text-xs text-amber-800/80">
              Collect cherished love notes, favorite songs, family memories, voice notes, and stickers across generations!
            </p>

            <form onSubmit={handleAddMemoSubmit} className="space-y-3 bg-white/80 p-4 rounded-2xl border border-amber-200">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name / Author"
                  value={memoAuthor}
                  onChange={(e) => setMemoAuthor(e.target.value)}
                  className="text-xs font-bold bg-white border border-amber-200 rounded-xl p-2.5"
                />
                <input
                  type="text"
                  placeholder="Favorite Song"
                  value={memoSong}
                  onChange={(e) => setMemoSong(e.target.value)}
                  className="text-xs font-bold bg-white border border-amber-200 rounded-xl p-2.5"
                />
              </div>

              <textarea
                placeholder="Write a sweet memo or note for family..."
                value={memoMessage}
                onChange={(e) => setMemoMessage(e.target.value)}
                rows={2}
                className="w-full text-xs bg-white border border-amber-200 rounded-xl p-2.5"
              />

              {/* INTEGRATED DEVICE MICROPHONE VOICE NOTE RECORDER */}
              <div className="bg-amber-100/60 p-3 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-amber-700" /> Record Short Voice Note
                  </span>
                  {isRecording && (
                    <span className="text-[10px] text-red-600 bg-red-100 px-2 py-0.5 rounded-full font-bold animate-pulse">
                      🔴 Recording {recordingSeconds}s
                    </span>
                  )}
                </div>

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Mic className="w-3.5 h-3.5" /> Start Microphone Recording
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Square className="w-3.5 h-3.5" /> Stop & Save Voice Note ({recordingSeconds}s)
                  </button>
                )}

                {recordedAudioUrl && (
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-900">
                      <span>🎧 Recorded Audio Note Ready</span>
                      <button
                        type="button"
                        onClick={() => setRecordedAudioUrl(null)}
                        className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                    <audio controls src={recordedAudioUrl} className="w-full h-8" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
              >
                Sign Memo Book
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {memoEntries.map((entry) => (
              <div key={entry.id} className="bg-white border border-amber-100 rounded-2xl p-4 space-y-2.5 shadow-2xs relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{entry.sticker}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{entry.authorName}</h4>
                      <p className="text-[10px] text-slate-400">{entry.relation} • {entry.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                    🎵 {entry.favoriteSong}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50">
                  "{entry.message}"
                </p>

                {/* Display Voice Note Audio Player if present */}
                {entry.voiceNoteUrl && (
                  <div className="bg-amber-100/40 p-2.5 rounded-xl border border-amber-200/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-900">
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" /> Attached Voice Note
                    </div>
                    <audio controls src={entry.voiceNoteUrl} className="w-full h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: MARKETPLACE & SERVICE DIRECTORY */}
      {activeSection === "marketplace" && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">On-Demand Care & Maintenance Directory</h3>
          <div className="space-y-2">
            {serviceProviders.map((sp) => (
              <div key={sp.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{sp.name}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                      {sp.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ⭐ {sp.rating} ({sp.reviewsCount} reviews) • {sp.location}
                  </p>
                  <p className="text-xs font-bold text-emerald-700 mt-1">{sp.hourlyRate}</p>
                </div>

                <a
                  href={`tel:${sp.phone}`}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: OFFLINE BACKUPS & HYBRID CLOUD STORAGE */}
      {activeSection === "backup" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Hybrid Storage & Google Drive Cloud Backup
                  </h4>
                  <p className="text-xs text-slate-300">
                    Local device storage + Google Drive cloud sync & auto backups
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store offline photos, PDFs, audio notes, and service backups safely on your local device or sync securely with your personal Google Drive account.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onSelectCareSubTab && onSelectCareSubTab("hybrid_storage")}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <Cloud className="w-4 h-4" /> Launch Hybrid Storage & Drive Manager
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Privacy & Data Backups</h3>
                <p className="text-[11px] text-slate-400">End-to-End Encryption with full offline capability</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onExportBackup}
                className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" /> Export Encrypted JSON
              </button>

              <label className="py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs cursor-pointer">
                <Upload className="w-4 h-4 text-blue-600" /> Import Backup JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        onImportBackup(reader.result as string);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC INTERACTIVE SERVICE MODAL FOR ALL 20+ SERVICES */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" /> {activeServiceModal}
              </h3>
              <button
                onClick={() => setActiveServiceModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {serviceFeedback && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl animate-fade-in">
                {serviceFeedback}
              </div>
            )}

            {/* Custom Content for Each Specific Service */}
            <div className="space-y-3 text-xs">
              {/* 1. Water Drink Notifier */}
              {activeServiceModal === "Water Drink Notifier" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Target Daily Goal: {waterGoal} ml</label>
                    <input
                      type="range"
                      min="1000"
                      max="5000"
                      step="250"
                      value={waterGoal}
                      onChange={(e) => setWaterGoal(Number(e.target.value))}
                      className="w-full accent-cyan-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Alert Sound</label>
                      <select value={waterSound} onChange={(e) => setWaterSound(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                        <option value="Gentle Bell">Gentle Bell</option>
                        <option value="Water Splash">Water Splash</option>
                        <option value="Soft Chime">Soft Chime</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Reminder Interval</label>
                      <select value={waterInterval} onChange={(e) => setWaterInterval(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                        <option value="30 mins">30 mins</option>
                        <option value="60 mins">60 mins</option>
                        <option value="120 mins">120 mins</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Medicine Reminder */}
              {activeServiceModal === "Medicine Reminder" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Medicine Name & Dosage</label>
                    <input type="text" value={medFormName} onChange={(e) => setMedFormName(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Frequency</label>
                      <select value={medFormFreq} onChange={(e) => setMedFormFreq(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                        <option value="Daily">Daily</option>
                        <option value="Twice Daily">Twice Daily</option>
                        <option value="Thrice Daily">Thrice Daily</option>
                        <option value="SOS / As Needed">SOS / As Needed</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Timing</label>
                      <input type="text" value={medFormTime} onChange={(e) => setMedFormTime(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Food Relation</label>
                    <select value={medFormFood} onChange={(e) => setMedFormFood(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                      <option value="After Meal">After Meal</option>
                      <option value="Before Meal">Before Meal</option>
                      <option value="With Water">With Water</option>
                      <option value="Empty Stomach">Empty Stomach</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 3. Yoga & Meditation */}
              {activeServiceModal === "Yoga & Meditation" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Select Guided Session</label>
                    <select value={yogaRoutine} onChange={(e) => setYogaRoutine(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                      <option value="Morning Zen & Stretch">Morning Zen & Stretch</option>
                      <option value="Stress Release & Deep Breath">Stress Release & Deep Breath</option>
                      <option value="Posture Reset">Posture Reset</option>
                      <option value="Sleep Meditation">Sleep Meditation</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Duration: {yogaDuration}</label>
                    <div className="flex gap-2">
                      {["5 mins", "10 mins", "15 mins", "20 mins"].map((dur) => (
                        <button
                          key={dur}
                          onClick={() => setYogaDuration(dur)}
                          className={`flex-1 py-1.5 rounded-xl border font-bold ${yogaDuration === dur ? "bg-purple-600 text-white" : "bg-slate-50 text-slate-700"}`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Mood & Habit Journal */}
              {activeServiceModal === "Mood & Habit Journal" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Today's Mood Check-in</label>
                    <div className="flex justify-between bg-slate-50 p-2 border rounded-xl">
                      {["😃 Great", "😌 Calm", "😔 Tired", "😟 Anxious", "😣 Pain"].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMoodSelect(m)}
                          className={`p-1.5 rounded-lg text-xs font-bold ${moodSelect === m ? "bg-amber-100 border-amber-300 border text-amber-900" : "text-slate-600"}`}
                        >
                          {m.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Energy Index: {energyLevel} / 10</label>
                    <input type="range" min="1" max="10" value={energyLevel} onChange={(e) => setEnergyLevel(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Daily Reflection Note</label>
                    <textarea rows={2} value={moodReflection} onChange={(e) => setMoodReflection(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl" />
                  </div>
                </div>
              )}

              {/* 5. Elderly & Senior Care */}
              {activeServiceModal === "Elderly & Senior Care" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Senior Resident / Loved One</label>
                    <input type="text" value={seniorName} onChange={(e) => setSeniorName(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Mobility Care Level</label>
                    <select value={seniorMobility} onChange={(e) => setSeniorMobility(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                      <option value="Independent">Independent</option>
                      <option value="Walking Aid Required">Walking Aid Required</option>
                      <option value="Wheelchair Support">Wheelchair Support</option>
                      <option value="Full Care Bedrest">Full Care Bedrest</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Emergency Proxy Phone</label>
                    <input type="text" value={seniorContact} onChange={(e) => setSeniorContact(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                </div>
              )}

              {/* 6. Kids & Pediatric Care */}
              {activeServiceModal === "Kids & Pediatric Care" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Child Name</label>
                      <input type="text" value={kidName} onChange={(e) => setKidName(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Age (Years)</label>
                      <input type="text" value={kidAge} onChange={(e) => setKidAge(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Next Vaccine Due Date</label>
                    <input type="date" value={kidVaccineDue} onChange={(e) => setKidVaccineDue(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                </div>
              )}

              {/* 7. Sick & Post-Op Care */}
              {activeServiceModal === "Sick & Post-Op Care" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Condition / Post-Op Notes</label>
                    <input type="text" value={sickCondition} onChange={(e) => setSickCondition(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Body Temp</label>
                      <input type="text" value={sickTemp} onChange={(e) => setSickTemp(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Pain Index: {sickPainScale} / 10</label>
                      <input type="range" min="1" max="10" value={sickPainScale} onChange={(e) => setSickPainScale(Number(e.target.value))} className="w-full accent-rose-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Family Tree Ancestry */}
              {activeServiceModal === "Family Tree Ancestry" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Relative Name</label>
                    <input type="text" value={familyRelName} onChange={(e) => setFamilyRelName(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Generation Hierarchy</label>
                      <select value={familyGen} onChange={(e) => setFamilyGen(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                        <option value="1st Generation">1st Generation (Self)</option>
                        <option value="2nd Generation">2nd Generation (Parents)</option>
                        <option value="3rd Generation">3rd Generation (Grandparents)</option>
                        <option value="4th Generation">4th Generation (Ancestors)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Birth Year</label>
                      <input type="text" value={familyBirthYear} onChange={(e) => setFamilyBirthYear(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                  </div>
                </div>
              )}

              {/* 9. Staff & Payroll Care */}
              {activeServiceModal === "Staff & Payroll Care" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Staff Member Name</label>
                    <input type="text" value={staffName} onChange={(e) => setStaffName(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Salary / Hourly Rate</label>
                    <input type="text" value={staffRate} onChange={(e) => setStaffRate(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Proof of Work Attachment</label>
                    <div className="flex items-center gap-2">
                      <img src={staffProofUrl} alt="Proof" className="w-10 h-10 rounded-lg object-cover border" />
                      <input type="text" value={staffProofUrl} onChange={(e) => setStaffProofUrl(e.target.value)} className="flex-1 p-2 bg-slate-50 border rounded-xl text-[10px]" />
                    </div>
                  </div>
                </div>
              )}

              {/* 10. ID Card & QR Creator */}
              {activeServiceModal === "ID Card & QR Creator" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Card Holder</label>
                      <input type="text" value={idName} onChange={(e) => setIdName(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">Role/Designation</label>
                      <input type="text" value={idRole} onChange={(e) => setIdRole(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                  </div>
                  {/* Badge Card Live Preview */}
                  <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-3.5 rounded-2xl border border-indigo-800 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-indigo-300 font-bold uppercase">
                      <span>Care2Care Official Staff</span>
                      <span>{idNumber}</span>
                    </div>
                    <p className="font-bold text-sm text-amber-300">{idName}</p>
                    <p className="text-[10px] text-slate-300">{idRole}</p>
                  </div>
                </div>
              )}

              {/* Fallback for other domain services */}
              {["Farm & Crop Planning", "Garden & Soil Tracker", "Property Maintenance", "Community & Society", "Vehicle Fuel & PUC Care", "Pet & Vet Vaccinations", "Finance & Income Tracker"].includes(activeServiceModal) && (
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">{activeServiceModal} Target Record</label>
                    <input
                      type="text"
                      value={activeServiceModal.includes("Vehicle") ? vehNameVal : activeServiceModal.includes("Pet") ? petNameVal : activeServiceModal.includes("Finance") ? finTitleVal : activeServiceModal.includes("Farm") ? farmPlotName : activeServiceModal.includes("Garden") ? gardenPlant : activeServiceModal.includes("Property") ? propAddress : socNoticeTitle}
                      onChange={(e) => {
                        if (activeServiceModal.includes("Vehicle")) setVehNameVal(e.target.value);
                        else if (activeServiceModal.includes("Pet")) setPetNameVal(e.target.value);
                        else if (activeServiceModal.includes("Finance")) setFinTitleVal(e.target.value);
                        else if (activeServiceModal.includes("Farm")) setFarmPlotName(e.target.value);
                        else if (activeServiceModal.includes("Garden")) setGardenPlant(e.target.value);
                        else if (activeServiceModal.includes("Property")) setPropAddress(e.target.value);
                        else setSocNoticeTitle(e.target.value);
                      }}
                      className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Status & Priority</label>
                    <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                      Active Monitoring & Automated Sync
                    </span>
                  </div>
                </div>
              )}

              {/* COMMON UNIVERSAL MASTER SETUP PANEL (TIMINGS, REMINDERS, PROOF & CUSTOM FIELDS) */}
              <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
                <span className="font-extrabold text-slate-800 text-[11px] block text-indigo-900 uppercase tracking-wide">
                  ⚙️ Advanced Schedule, Reminders & Proof Capture
                </span>

                {/* Category & Others option */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Category & Classification</label>
                  <select
                    value={srvCategorySelect}
                    onChange={(e) => setSrvCategorySelect(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-bold text-xs"
                  >
                    <option value="Health & Care">🏥 Health & Medical Care</option>
                    <option value="Family & Senior">👴 Family & Senior Care</option>
                    <option value="Kids & Pediatric">👶 Kids & Pediatric Care</option>
                    <option value="Vehicle & Fleet">🚗 Vehicle & Maintenance</option>
                    <option value="Farm & Crop">🌾 Farm, Garden & Crops</option>
                    <option value="Financial & Income">💰 Financial & Expense Tracking</option>
                    <option value="Pets & Animals">🐾 Pets & Animal Care</option>
                    <option value="Others">➕ Others (Custom Category...)</option>
                  </select>

                  {srvCategorySelect === "Others" && (
                    <input
                      type="text"
                      placeholder="Enter Custom Category Name..."
                      value={srvCustomCategoryInput}
                      onChange={(e) => setSrvCustomCategoryInput(e.target.value)}
                      className="w-full p-2 mt-1 bg-amber-50 border border-amber-300 rounded-xl font-bold text-xs"
                    />
                  )}
                </div>

                {/* Multi-Schedule Timings */}
                <div className="bg-slate-50 p-2.5 rounded-xl border space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                    <span>Alert Timings ({srvTimings.length})</span>
                    <span className="text-emerald-700">Multi-Schedule Enabled</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {srvTimings.map((t, idx) => (
                      <span key={idx} className="bg-white border px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                        ⏰ {t}
                        <button onClick={() => setSrvTimings(srvTimings.filter((_, i) => i !== idx))} className="text-rose-500 font-bold">✕</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="time"
                      value={srvNewTimingInput}
                      onChange={(e) => setSrvNewTimingInput(e.target.value)}
                      className="p-1.5 bg-white border rounded-lg font-bold text-[11px] flex-1"
                    />
                    <button
                      onClick={() => {
                        if (srvNewTimingInput) {
                          setSrvTimings([...srvTimings, srvNewTimingInput]);
                          setSrvNewTimingInput("");
                        }
                      }}
                      className="px-2.5 py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px]"
                    >
                      + Add Time
                    </button>
                  </div>
                </div>

                {/* Ringtone & Audio Upload */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Alert Ringtone</label>
                    <select
                      value={srvRingtone}
                      onChange={(e) => setSrvRingtone(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-xl font-bold text-[11px]"
                    >
                      <option value="Gentle Bell">🔔 Gentle Bell</option>
                      <option value="Alarm Chime">⏰ Alarm Chime</option>
                      <option value="Water Splash">💧 Water Splash</option>
                      <option value="Siren Alert">🚨 High Pitch Siren</option>
                      <option value="Custom Audio">🎙️ Custom Audio Upload</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Custom Sound File</label>
                    <label className="p-2 bg-slate-50 border border-dashed hover:border-indigo-500 rounded-xl font-bold text-[10px] text-slate-700 flex items-center justify-center cursor-pointer">
                      <Upload className="w-3 h-3 text-indigo-600 mr-1" />
                      {srvCustomAudioName ? srvCustomAudioName.slice(0, 10) + "..." : "Upload Audio"}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSrvCustomAudioName(file.name);
                            setSrvRingtone("Custom Audio");
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Proof Capture (Photo, Video, GPS) */}
                <div className="bg-slate-50 p-2.5 rounded-xl border space-y-2">
                  <span className="text-[10px] font-bold text-slate-600 block">Proof Attachment & GPS Verification</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <label className="p-2 bg-white border rounded-xl text-center cursor-pointer hover:bg-indigo-50 transition-all">
                      <span className="text-xs block">📷</span>
                      <span className="text-[9px] font-bold text-slate-700">Photo Proof</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setSrvProofPhotoUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    <label className="p-2 bg-white border rounded-xl text-center cursor-pointer hover:bg-indigo-50 transition-all">
                      <span className="text-xs block">📹</span>
                      <span className="text-[9px] font-bold text-slate-700">{srvProofVideoName ? "Video Added" : "Video"}</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSrvProofVideoName(file.name);
                        }}
                      />
                    </label>

                    <label className="p-2 bg-white border rounded-xl text-center cursor-pointer hover:bg-indigo-50 transition-all">
                      <span className="text-xs block">🎙️</span>
                      <span className="text-[9px] font-bold text-slate-700">{srvProofAudioName ? "Audio Added" : "Voice Note"}</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSrvProofAudioName(file.name);
                        }}
                      />
                    </label>
                  </div>

                  {srvProofPhotoUrl && (
                    <div className="relative rounded-xl overflow-hidden border max-h-24 bg-slate-900 flex justify-center">
                      <img src={srvProofPhotoUrl} alt="Proof" className="h-24 object-cover w-full" />
                      <button onClick={() => setSrvProofPhotoUrl(null)} className="absolute top-1 right-1 bg-slate-900/80 text-white font-bold text-[10px] w-5 h-5 rounded-full">✕</button>
                    </div>
                  )}

                  <div className="text-[9px] font-bold text-slate-500 bg-white p-1.5 rounded-lg border flex justify-between items-center">
                    <span>📍 {srvGpsLocation}</span>
                    <button onClick={() => setSrvGpsLocation("GPS: 37.7749° N, 122.4194° W (Stamped)")} className="text-indigo-600 font-bold">Stamp</button>
                  </div>
                </div>

                {/* Custom Extra Fields */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-600">Custom Attributes</span>
                    <button
                      onClick={() => setSrvExtraFields([...srvExtraFields, { id: String(Date.now()), label: "", value: "" }])}
                      className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md"
                    >
                      + Add Field
                    </button>
                  </div>
                  {srvExtraFields.map((f, idx) => (
                    <div key={f.id} className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Key"
                        value={f.label}
                        onChange={(e) => {
                          const up = [...srvExtraFields];
                          up[idx].label = e.target.value;
                          setSrvExtraFields(up);
                        }}
                        className="w-1/3 p-1.5 bg-slate-50 border rounded-lg font-bold text-[10px]"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={f.value}
                        onChange={(e) => {
                          const up = [...srvExtraFields];
                          up[idx].value = e.target.value;
                          setSrvExtraFields(up);
                        }}
                        className="flex-1 p-1.5 bg-slate-50 border rounded-lg font-bold text-[10px]"
                      />
                      <button onClick={() => setSrvExtraFields(srvExtraFields.filter((_, i) => i !== idx))} className="text-rose-500 font-bold px-1 text-xs">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSaveServiceData(activeServiceModal)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-sm cursor-pointer"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTEL DIGITAL INVOICE RECEIPT MODAL */}
      {hotelInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="text-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black text-emerald-900">🏨 CARE2CARE HOTEL & DINER</h3>
              <p className="text-[10px] text-slate-500 font-mono">Tax Invoice / Cash Receipt</p>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mt-2 bg-slate-50 p-2 rounded-xl">
                <span>Receipt #{hotelInvoiceModal.id}</span>
                <span>{hotelInvoiceModal.time}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-800">
              <div className="flex justify-between text-slate-500 font-semibold text-[11px]">
                <span>Customer Type: <strong className="text-slate-800">{hotelInvoiceModal.customer}</strong></span>
                <span>Pay Method: <strong className="text-slate-800">{hotelInvoiceModal.method}</strong></span>
              </div>

              <table className="w-full text-left mt-2 divide-y divide-slate-100">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {hotelInvoiceModal.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-1.5 font-bold">{item.name}</td>
                      <td className="py-1.5 text-center font-bold">{item.qty}</td>
                      <td className="py-1.5 text-right font-extrabold text-slate-900">Rs. {item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-slate-200 pt-2 space-y-1 font-semibold text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>Rs. {hotelInvoiceModal.subtotal}</span>
                </div>
                {hotelInvoiceModal.discountAmt > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Savings:</span>
                    <span>- Rs. {Math.round(hotelInvoiceModal.discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-black text-base border-t border-slate-200 pt-1">
                  <span>Paid Amount:</span>
                  <span className="text-emerald-800">Rs. {hotelInvoiceModal.total}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setHotelInvoiceModal(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs cursor-pointer"
              >
                Done
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                🖨️ Print / Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CASH DEPOSIT MODAL */}
      {showAddCashModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900">💰 Log Field Cash Collection</h3>
              <button onClick={() => setShowAddCashModal(false)} className="text-slate-400 font-bold text-xs">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Account Holder Name & ID</label>
                <input
                  type="text"
                  value={newCashHolder}
                  onChange={(e) => setNewCashHolder(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Depositor Name</label>
                <input
                  type="text"
                  value={newCashDepositor}
                  onChange={(e) => setNewCashDepositor(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Field Collection Officer</label>
                <input
                  type="text"
                  value={newCashCollector}
                  onChange={(e) => setNewCashCollector(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Collection Status</label>
                  <select
                    value={newCashStatus}
                    onChange={(e: any) => setNewCashStatus(e.target.value)}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                  >
                    <option value="DONE">✅ DONE</option>
                    <option value="PENDING">🟡 PENDING</option>
                    <option value="SKIPPED">🔴 SKIPPED</option>
                    <option value="COLLECTED">⏳ COLLECTED</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Amount ($)</label>
                  <input
                    type="number"
                    value={newCashAmount}
                    onChange={(e) => setNewCashAmount(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>
              </div>

              {newCashStatus === "SKIPPED" && (
                <div>
                  <label className="font-bold text-rose-600 block mb-1">Reason for Skipping Collection</label>
                  <input
                    type="text"
                    placeholder="e.g. Out of town, Address closed..."
                    value={newCashSkipReason}
                    onChange={(e) => setNewCashSkipReason(e.target.value)}
                    className="w-full p-2 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl font-bold"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddCashModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const entry = {
                    id: `col-${Math.floor(100 + Math.random() * 900)}`,
                    accountHolder: newCashHolder,
                    depositor: newCashDepositor,
                    collector: newCashCollector,
                    institution: newCashInst,
                    amount: newCashAmount,
                    emiFreq: "Monthly",
                    status: newCashStatus,
                    skipReason: newCashStatus === "SKIPPED" ? newCashSkipReason : undefined,
                    date: new Date().toISOString().split("T")[0],
                  };
                  setCashLogs([entry, ...cashLogs]);
                  setShowAddCashModal(false);
                  showToast(`Saved Collection Record #${entry.id}!`);
                }}
                className="flex-1 py-2.5 bg-emerald-800 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-sm"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAREGIVER MATCHMAKER MODAL */}
      {matchingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900">🤝 Caregiver Employer Matchmaker</h3>
              <button onClick={() => setMatchingModalOpen(false)} className="text-slate-400 font-bold text-xs">✕</button>
            </div>
            <p className="text-xs text-slate-500">
              Specify your family or patient care preferences to get paired with background-checked certified care specialists.
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Care Specialty Needed</label>
                <select className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                  <option>Elderly Dementia & Mobility Support</option>
                  <option>Pediatric Newborn & Toddler Care</option>
                  <option>Post-Operative Recovery Nursing</option>
                  <option>Physiotherapy & Rehabilitation</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Schedule & Shift Type</label>
                <select className="w-full p-2 bg-slate-50 border rounded-xl font-bold">
                  <option>Full-Time Live-In Caregiver</option>
                  <option>Part-Time Day Hours (4-8 hrs)</option>
                  <option>Night Shift Vigil Care</option>
                  <option>Emergency Weekend Coverage</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                setMatchingModalOpen(false);
                showToast("Matching requested! Our coordinator will contact you in 15 mins.");
              }}
              className="w-full py-3 bg-emerald-800 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm"
            >
              🔍 Submit Caregiver Match Request
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl border border-emerald-600 flex items-center gap-2 animate-bounce">
          <span>🔔</span> {toastMessage}
        </div>
      )}

      {/* Service Setup Modal */}
      {setupModalService && (
        <ServiceSetupModal
          serviceId={setupModalService.id}
          serviceName={setupModalService.name}
          isOpen={!!setupModalService}
          onClose={() => setSetupModalService(null)}
        />
      )}
    </div>
  );
};
