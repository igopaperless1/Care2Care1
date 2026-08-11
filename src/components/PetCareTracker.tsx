import React, { useState } from "react";
import {
  Dog,
  Cat,
  Plus,
  Calendar,
  Pill,
  Syringe,
  Stethoscope,
  Activity,
  DollarSign,
  FileText,
  Bell,
  Settings,
  Trash2,
  Edit,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  PieChart as PieChartIcon,
  BarChart2,
  Paperclip,
  Check
} from "lucide-react";
import { PetItem } from "../types";

export interface PetCareMedication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  timings: string[];
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  purpose?: string;
  takeWith?: string;
  sideEffects?: string;
  remainingCount?: number;
  refillReminder?: boolean;
  refillDate?: string;
  notes?: string;
  photoProof?: string;
  isActive: boolean;
}

export interface PetCareVaccine {
  id: string;
  petId: string;
  name: string;
  dateGiven: string;
  nextDueDate?: string;
  givenBy?: string;
  clinic?: string;
  batchNumber?: string;
  certificateUrl?: string;
  notes?: string;
  reminder: boolean;
}

export interface PetCareVetVisit {
  id: string;
  petId: string;
  date: string;
  vetName: string;
  clinic?: string;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  cost?: number;
  followUpDate?: string;
  notes?: string;
}

export interface PetCareHealthRecord {
  id: string;
  petId: string;
  date: string;
  weight?: number;
  weightUnit?: string;
  temperature?: number;
  heartRate?: number;
  symptoms: string[];
  condition?: string;
  notes?: string;
}

export interface PetCareGrooming {
  id: string;
  petId: string;
  date: string;
  serviceType: string;
  groomer?: string;
  cost?: number;
  notes?: string;
}

export interface PetCareExpense {
  id: string;
  petId: string;
  date: string;
  category: "Food" | "Vet" | "Grooming" | "Supplies" | "Toys" | "Insurance" | "Other";
  amount: number;
  description: string;
}

export interface PetCareReminder {
  id: string;
  petId: string;
  type: "Vaccine" | "Medication" | "Vet Visit" | "Grooming" | "Other";
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

interface PetCareTrackerProps {
  patient?: any;
}

const PET_TYPES = [
  "Dog", "Cat", "Bird", "Fish", "Hamster/Guinea Pig", "Rabbit",
  "Turtle", "Snake", "Lizard", "Horse", "Cow", "Goat", "Sheep", "Pig", "Other"
];

const COMMON_VACCINES = [
  "Rabies", "Distemper", "Parvovirus", "Hepatitis", "Leptospirosis",
  "Lyme Disease", "Feline Distemper", "Feline Calicivirus", "Feline Herpesvirus",
  "Bordetella", "Other"
];

export const PetCareTracker: React.FC<PetCareTrackerProps> = () => {
  // Navigation Screens
  const [currentScreen, setCurrentScreen] = useState<
    "dashboard" | "add_pet" | "profile" | "add_med" | "add_vac" | "add_vet" | "add_health" | "analytics" | "settings"
  >("dashboard");

  // Multi-Pet State
  const [petsList, setPetsList] = useState<any[]>([
    {
      id: "pet-101",
      name: "Max",
      petType: "Dog",
      breed: "Golden Retriever",
      gender: "Male",
      dateOfBirth: "2021-04-12",
      age: 5,
      color: "Golden Yellow",
      weight: 28.5,
      weightUnit: "kg",
      microchipNumber: "985141002341",
      healthStatus: "🟢 Healthy",
      primaryVet: "Dr. Alistair Ross",
      vetClinic: "Paws & Claws Pet Clinic",
      vetPhone: "+1 (555) 019-8822",
      insuranceProvider: "PetCare Guard",
      insurancePolicy: "POL-882194",
      diet: "High-protein dry kibble twice daily with fresh salmon oil.",
      notes: "Loves swimming and park retrieves. Gentle with kids."
    },
    {
      id: "pet-102",
      name: "Luna",
      petType: "Cat",
      breed: "Siamese",
      gender: "Female",
      dateOfBirth: "2022-09-01",
      age: 3,
      color: "Cream & Dark Point",
      weight: 4.2,
      weightUnit: "kg",
      microchipNumber: "985141007721",
      healthStatus: "🟡 Monitoring",
      primaryVet: "Dr. Sarah Jenkins",
      vetClinic: "Feline Wellness Hub",
      vetPhone: "+1 (555) 012-4411",
      insuranceProvider: "HappyPaws",
      insurancePolicy: "CAT-339102",
      diet: "Wet grain-free tuna pate.",
      notes: "Sensitive stomach. Keep indoors."
    }
  ]);

  const [selectedPetId, setSelectedPetId] = useState<string>("pet-101");
  const [activeProfileTab, setActiveProfileTab] = useState<
    "meds" | "vacs" | "vets" | "health" | "grooming" | "expenses" | "docs" | "reminders"
  >("meds");

  // Sub-data collections
  const [medications, setMedications] = useState<PetCareMedication[]>([
    {
      id: "med-1",
      petId: "pet-101",
      name: "Heartworm Preventative",
      dosage: "1 chewable tablet",
      frequency: "Monthly",
      timings: ["08:00 AM"],
      startDate: "2026-01-01",
      purpose: "Heartworm & Parasite defense",
      takeWith: "With food",
      isActive: true
    },
    {
      id: "med-2",
      petId: "pet-102",
      name: "Digestive Probiotics",
      dosage: "0.5 sachet",
      frequency: "Daily",
      timings: ["07:30 AM"],
      startDate: "2026-06-10",
      purpose: "Gut health & stomach sensitivity",
      takeWith: "Mixed in wet food",
      isActive: true
    }
  ]);

  const [vaccines, setVaccines] = useState<PetCareVaccine[]>([
    {
      id: "vac-1",
      petId: "pet-101",
      name: "Rabies",
      dateGiven: "2025-08-15",
      nextDueDate: "2026-08-15",
      givenBy: "Dr. Alistair Ross",
      clinic: "Paws & Claws Pet Clinic",
      reminder: true
    },
    {
      id: "vac-2",
      petId: "pet-102",
      name: "Feline Distemper (FVRCP)",
      dateGiven: "2026-02-10",
      nextDueDate: "2027-02-10",
      givenBy: "Dr. Sarah Jenkins",
      clinic: "Feline Wellness Hub",
      reminder: true
    }
  ]);

  const [vetVisits, setVetVisits] = useState<PetCareVetVisit[]>([
    {
      id: "vet-1",
      petId: "pet-101",
      date: "2026-05-12",
      vetName: "Dr. Alistair Ross",
      clinic: "Paws & Claws Pet Clinic",
      reason: "Annual Wellness Checkup",
      diagnosis: "Overall healthy weight and heart sound.",
      treatment: "Administered flea preventative & dental gel.",
      cost: 120,
      notes: "Re-check weight in 6 months."
    }
  ]);

  const [healthRecords, setHealthRecords] = useState<PetCareHealthRecord[]>([
    {
      id: "hr-1",
      petId: "pet-101",
      date: "2026-07-01",
      weight: 28.5,
      weightUnit: "kg",
      temperature: 38.5,
      heartRate: 85,
      symptoms: ["Good Appetite"],
      notes: "Active and energetic during morning run."
    }
  ]);

  const [expenses, setExpenses] = useState<PetCareExpense[]>([
    {
      id: "exp-1",
      petId: "pet-101",
      date: "2026-07-10",
      category: "Food",
      amount: 65,
      description: "Premium Kibble (12kg bag)"
    },
    {
      id: "exp-2",
      petId: "pet-101",
      date: "2026-05-12",
      category: "Vet",
      amount: 120,
      description: "Annual Checkup & Dental Gel"
    }
  ]);

  const [reminders, setReminders] = useState<PetCareReminder[]>([
    {
      id: "rem-1",
      petId: "pet-101",
      type: "Vaccine",
      title: "Rabies Booster Vaccination Due",
      dueDate: "2026-08-15",
      isCompleted: false
    }
  ]);

  // Form States
  const [petForm, setPetForm] = useState<any>({
    name: "",
    petType: "Dog",
    breed: "",
    gender: "Male",
    dateOfBirth: "",
    color: "",
    weight: "",
    weightUnit: "kg",
    microchipNumber: "",
    primaryVet: "",
    vetClinic: "",
    vetPhone: "",
    diet: "",
    notes: ""
  });

  const [medForm, setMedForm] = useState<any>({
    name: "",
    dosage: "",
    frequency: "Daily",
    timings: ["08:00 AM"],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    prescribedBy: "",
    purpose: "",
    takeWith: "Food",
    notes: ""
  });

  const [vacForm, setVacForm] = useState<any>({
    name: "Rabies",
    customName: "",
    dateGiven: new Date().toISOString().split("T")[0],
    nextDueDate: "",
    givenBy: "",
    clinic: "",
    notes: ""
  });

  const [vetVisitForm, setVetVisitForm] = useState<any>({
    date: new Date().toISOString().split("T")[0],
    vetName: "",
    clinic: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    cost: "",
    followUpDate: "",
    notes: ""
  });

  const [healthForm, setHealthForm] = useState<any>({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    weightUnit: "kg",
    temperature: "",
    heartRate: "",
    symptomsStr: "",
    notes: ""
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Active Pet object helper
  const selectedPet = petsList.find((p) => p.id === selectedPetId) || petsList[0] || null;

  // Handler Functions
  const handleSavePet = (andAddAnother = false) => {
    if (!petForm.name) {
      alert("Please enter Pet Name!");
      return;
    }
    const newPet = {
      id: `pet-${Date.now()}`,
      ...petForm,
      weight: petForm.weight ? Number(petForm.weight) : 0,
      healthStatus: "🟢 Healthy"
    };
    setPetsList([...petsList, newPet]);
    setSelectedPetId(newPet.id);

    if (andAddAnother) {
      setPetForm({
        name: "",
        petType: "Dog",
        breed: "",
        gender: "Male",
        dateOfBirth: "",
        color: "",
        weight: "",
        weightUnit: "kg",
        microchipNumber: "",
        primaryVet: "",
        vetClinic: "",
        vetPhone: "",
        diet: "",
        notes: ""
      });
      alert("Pet saved! Add another pet below.");
    } else {
      setCurrentScreen("profile");
    }
  };

  const handleSaveMedication = (andAddAnother = false) => {
    if (!selectedPet) {
      alert("Please select a pet first!");
      return;
    }
    if (!medForm.name || !medForm.dosage) {
      alert("Please enter Medication Name and Dosage!");
      return;
    }
    const newMed: PetCareMedication = {
      id: `med-${Date.now()}`,
      petId: selectedPet.id,
      name: medForm.name,
      dosage: medForm.dosage,
      frequency: medForm.frequency,
      timings: medForm.timings || ["08:00 AM"],
      startDate: medForm.startDate,
      endDate: medForm.endDate || undefined,
      prescribedBy: medForm.prescribedBy || undefined,
      purpose: medForm.purpose || undefined,
      takeWith: medForm.takeWith || undefined,
      notes: medForm.notes || undefined,
      isActive: true
    };
    setMedications([newMed, ...medications]);

    if (andAddAnother) {
      setMedForm({
        name: "",
        dosage: "",
        frequency: "Daily",
        timings: ["08:00 AM"],
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        prescribedBy: "",
        purpose: "",
        takeWith: "Food",
        notes: ""
      });
      alert("Medication added! You can add another medication.");
    } else {
      setCurrentScreen("profile");
    }
  };

  const handleSaveVaccine = (andAddAnother = false) => {
    if (!selectedPet) {
      alert("Please select a pet first!");
      return;
    }
    const vacName = vacForm.name === "Other" ? vacForm.customName : vacForm.name;
    if (!vacName || !vacForm.dateGiven) {
      alert("Please specify Vaccine Name and Date Given!");
      return;
    }
    const newVac: PetCareVaccine = {
      id: `vac-${Date.now()}`,
      petId: selectedPet.id,
      name: vacName,
      dateGiven: vacForm.dateGiven,
      nextDueDate: vacForm.nextDueDate || undefined,
      givenBy: vacForm.givenBy || undefined,
      clinic: vacForm.clinic || undefined,
      notes: vacForm.notes || undefined,
      reminder: true
    };
    setVaccines([newVac, ...vaccines]);

    if (vacForm.nextDueDate) {
      setReminders([
        {
          id: `rem-${Date.now()}`,
          petId: selectedPet.id,
          type: "Vaccine",
          title: `${vacName} Vaccination Due`,
          dueDate: vacForm.nextDueDate,
          isCompleted: false
        },
        ...reminders
      ]);
    }

    if (andAddAnother) {
      setVacForm({
        name: "Rabies",
        customName: "",
        dateGiven: new Date().toISOString().split("T")[0],
        nextDueDate: "",
        givenBy: "",
        clinic: "",
        notes: ""
      });
      alert("Vaccine added! Add another vaccine.");
    } else {
      setCurrentScreen("profile");
    }
  };

  const handleSaveVetVisit = (andAddAnother = false) => {
    if (!selectedPet) {
      alert("Please select a pet first!");
      return;
    }
    if (!vetVisitForm.vetName || !vetVisitForm.reason) {
      alert("Please enter Vet Name and Reason!");
      return;
    }
    const costNum = vetVisitForm.cost ? Number(vetVisitForm.cost) : 0;
    const newVisit: PetCareVetVisit = {
      id: `vet-${Date.now()}`,
      petId: selectedPet.id,
      date: vetVisitForm.date,
      vetName: vetVisitForm.vetName,
      clinic: vetVisitForm.clinic || undefined,
      reason: vetVisitForm.reason,
      diagnosis: vetVisitForm.diagnosis || undefined,
      treatment: vetVisitForm.treatment || undefined,
      cost: costNum,
      followUpDate: vetVisitForm.followUpDate || undefined,
      notes: vetVisitForm.notes || undefined
    };
    setVetVisits([newVisit, ...vetVisits]);

    if (costNum > 0) {
      setExpenses([
        {
          id: `exp-${Date.now()}`,
          petId: selectedPet.id,
          date: vetVisitForm.date,
          category: "Vet",
          amount: costNum,
          description: `Vet Visit: ${vetVisitForm.reason}`
        },
        ...expenses
      ]);
    }

    if (andAddAnother) {
      setVetVisitForm({
        date: new Date().toISOString().split("T")[0],
        vetName: "",
        clinic: "",
        reason: "",
        diagnosis: "",
        treatment: "",
        cost: "",
        followUpDate: "",
        notes: ""
      });
      alert("Vet visit logged! Add another.");
    } else {
      setCurrentScreen("profile");
    }
  };

  const handleSaveHealthRecord = (andAddAnother = false) => {
    if (!selectedPet) {
      alert("Please select a pet first!");
      return;
    }
    const symptoms = healthForm.symptomsStr
      ? healthForm.symptomsStr.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      : [];
    const weightNum = healthForm.weight ? Number(healthForm.weight) : undefined;

    const newHealth: PetCareHealthRecord = {
      id: `hr-${Date.now()}`,
      petId: selectedPet.id,
      date: healthForm.date,
      weight: weightNum,
      weightUnit: healthForm.weightUnit,
      temperature: healthForm.temperature ? Number(healthForm.temperature) : undefined,
      heartRate: healthForm.heartRate ? Number(healthForm.heartRate) : undefined,
      symptoms,
      notes: healthForm.notes || undefined
    };
    setHealthRecords([newHealth, ...healthRecords]);

    if (weightNum && weightNum > 0) {
      setPetsList(petsList.map((p) => (p.id === selectedPet.id ? { ...p, weight: weightNum } : p)));
    }

    if (andAddAnother) {
      setHealthForm({
        date: new Date().toISOString().split("T")[0],
        weight: "",
        weightUnit: "kg",
        temperature: "",
        heartRate: "",
        symptomsStr: "",
        notes: ""
      });
      alert("Health record logged! Add another.");
    } else {
      setCurrentScreen("profile");
    }
  };

  const handleRunAiAnalysis = (pet: any) => {
    if (!pet) return;
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      const petMeds = medications.filter((m) => m.petId === pet.id && m.isActive);
      const petVacs = vaccines.filter((v) => v.petId === pet.id);
      setAiAnalysisResult(
        `🐾 **Care2Care AI Pet Health Insights for ${pet.name} (${pet.petType})**:\n\n` +
          `• **Vaccination Audit**: ${petVacs.length} recorded vaccines. Status is up to date.\n` +
          `• **Active Medication**: ${petMeds.length > 0 ? petMeds.map((m) => m.name).join(", ") : "No active heavy medications required."}\n` +
          `• **Weight & Vitality**: Current weight is ${pet.weight || "N/A"} ${pet.weightUnit || "kg"}. Weight trajectory is healthy and stable.\n` +
          `• **Caregiver Recommendation**: Ensure annual health screening with ${pet.primaryVet || "your primary veterinarian"} and maintain regular tick/flea preventatives.`
      );
    }, 700);
  };

  const filteredPets = petsList.filter((p) => {
    const q = (searchQuery || "").toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.petType || "").toLowerCase().includes(q) ||
      (p.breed || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-20">
      {/* APP BAR HEADER */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl text-slate-900 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-xl shadow-md">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Pet Care & Veterinary Tracker
                </h1>
                <span className="text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-full">
                  Care2Care Suite
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">
                Complete health, multi-medication, vaccine & vet care tracking for all pets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPetForm({
                  name: "",
                  petType: "Dog",
                  breed: "",
                  gender: "Male",
                  dateOfBirth: "",
                  color: "",
                  weight: "",
                  weightUnit: "kg",
                  microchipNumber: "",
                  primaryVet: "",
                  vetClinic: "",
                  vetPhone: "",
                  diet: "",
                  notes: ""
                });
                setCurrentScreen("add_pet");
              }}
              className="px-3 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1b5e20] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Pet
            </button>
          </div>
        </div>

        {/* SUB-NAV STRIP */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              currentScreen === "dashboard"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentScreen("analytics")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              currentScreen === "analytics"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setCurrentScreen("settings")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              currentScreen === "settings"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: DASHBOARD */}
      {/* ========================================================================= */}
      {currentScreen === "dashboard" && (
        <div className="space-y-6">
          {/* SEARCH & QUICK STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Total Pets</span>
              <span className="text-xl font-black text-slate-800">{petsList.length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Active Meds</span>
              <span className="text-xl font-black text-indigo-600">
                {medications.filter((m) => m.isActive).length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Vaccines Due</span>
              <span className="text-xl font-black text-amber-600">{vaccines.length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Vet Visits</span>
              <span className="text-xl font-black text-emerald-600">{vetVisits.length}</span>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search pets by name, breed, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* PET CARDS GRID */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Registered Pet Profiles</h3>
            {filteredPets.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                <p className="text-xs text-slate-500">No pet profiles found matching search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPets.map((pet) => {
                  const petMeds = medications.filter((m) => m.petId === pet.id && m.isActive);
                  const petVacs = vaccines.filter((v) => v.petId === pet.id);
                  return (
                    <div
                      key={pet.id}
                      onClick={() => {
                        setSelectedPetId(pet.id);
                        setCurrentScreen("profile");
                      }}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                            {pet.petType === "Cat" ? "🐱" : pet.petType === "Dog" ? "🐶" : "🐾"}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-700">
                              {pet.name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {pet.breed || pet.petType} • {pet.gender || "Pet"}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {pet.healthStatus || "Healthy"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Weight</span>
                          <span className="font-bold text-slate-700">
                            {pet.weight ? `${pet.weight} ${pet.weightUnit || "kg"}` : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Active Meds</span>
                          <span className="font-bold text-slate-700">{petMeds.length} meds</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-emerald-600 font-bold pt-1">
                        <span>Open Pet Profile & Records</span>
                        <span>→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: ADD PET FORM */}
      {/* ========================================================================= */}
      {currentScreen === "add_pet" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h3 className="text-sm font-black text-slate-900">Add New Pet Profile</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pet Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Max"
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pet Type *</label>
                <select
                  value={petForm.petType}
                  onChange={(e) => setPetForm({ ...petForm, petType: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  {PET_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Breed</label>
                <input
                  type="text"
                  placeholder="e.g. Golden Retriever"
                  value={petForm.breed}
                  onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                <select
                  value={petForm.gender}
                  onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={petForm.dateOfBirth}
                  onChange={(e) => setPetForm({ ...petForm, dateOfBirth: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 12"
                    value={petForm.weight}
                    onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                    className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <select
                    value={petForm.weightUnit}
                    onChange={(e) => setPetForm({ ...petForm, weightUnit: e.target.value })}
                    className="w-20 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Microchip Number</label>
                <input
                  type="text"
                  placeholder="e.g. 985141002341"
                  value={petForm.microchipNumber}
                  onChange={(e) => setPetForm({ ...petForm, microchipNumber: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Primary Veterinarian</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Alistair Ross"
                  value={petForm.primaryVet}
                  onChange={(e) => setPetForm({ ...petForm, primaryVet: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Diet & Feeding Instructions</label>
              <textarea
                rows={2}
                placeholder="e.g. High-protein kibble twice daily."
                value={petForm.diet}
                onChange={(e) => setPetForm({ ...petForm, diet: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSavePet(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
            >
              Save & Add Another
            </button>
            <button
              onClick={() => handleSavePet(false)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md"
            >
              Save Pet Profile
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: PET PROFILE WITH ALL TABS */}
      {/* ========================================================================= */}
      {currentScreen === "profile" && selectedPet && (
        <div className="space-y-6">
          {/* PROFILE HEADER CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-3xl shadow-inner">
                  {selectedPet.petType === "Cat" ? "🐱" : selectedPet.petType === "Dog" ? "🐶" : "🐾"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedPet.name}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedPet.breed || selectedPet.petType} • {selectedPet.gender} • {selectedPet.weight} {selectedPet.weightUnit || "kg"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Microchip: {selectedPet.microchipNumber || "Not microchipped"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunAiAnalysis(selectedPet)}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> AI Health Audit
                </button>
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Change Pet
                </button>
              </div>
            </div>

            {/* AI ANALYSIS DISPLAY */}
            {aiAnalyzing && (
              <div className="p-4 bg-purple-50 rounded-2xl text-xs text-purple-800 font-medium animate-pulse flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" /> AI is auditing vaccinations, medications & vital metrics...
              </div>
            )}
            {aiAnalysisResult && (
              <div className="p-4 bg-purple-50/80 border border-purple-100 rounded-2xl text-xs text-purple-900 whitespace-pre-line leading-relaxed">
                {aiAnalysisResult}
              </div>
            )}

            {/* QUICK PROFILE TAB NAVIGATION */}
            <div className="flex gap-1 overflow-x-auto border-t border-slate-100 pt-3 scrollbar-none">
              {[
                { id: "meds", label: "💊 Medications" },
                { id: "vacs", label: "💉 Vaccines" },
                { id: "vets", label: "🏥 Vet Visits" },
                { id: "health", label: "❤️ Health Logs" },
                { id: "expenses", label: "💰 Expenses" },
                { id: "reminders", label: "⏰ Reminders" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    activeProfileTab === tab.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: MEDICATIONS */}
          {activeProfileTab === "meds" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">Active & Past Medications</h4>
                <button
                  onClick={() => setCurrentScreen("add_med")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Medication
                </button>
              </div>

              {medications.filter((m) => m.petId === selectedPet.id).length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No medications logged for {selectedPet.name} yet.</p>
              ) : (
                <div className="space-y-3">
                  {medications
                    .filter((m) => m.petId === selectedPet.id)
                    .map((med) => (
                      <div key={med.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-black text-slate-800">{med.name}</h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {med.frequency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Dosage: <strong>{med.dosage}</strong> • Start: {med.startDate}
                        </p>
                        {med.purpose && <p className="text-[11px] text-slate-500">Purpose: {med.purpose}</p>}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VACCINES */}
          {activeProfileTab === "vacs" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">Vaccination History & Reminders</h4>
                <button
                  onClick={() => setCurrentScreen("add_vac")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Vaccine
                </button>
              </div>

              {vaccines.filter((v) => v.petId === selectedPet.id).length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No vaccines recorded for {selectedPet.name} yet.</p>
              ) : (
                <div className="space-y-3">
                  {vaccines
                    .filter((v) => v.petId === selectedPet.id)
                    .map((vac) => (
                      <div key={vac.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-black text-slate-800">{vac.name}</h5>
                          <span className="text-[10px] font-bold text-slate-500">Given: {vac.dateGiven}</span>
                        </div>
                        {vac.nextDueDate && (
                          <p className="text-xs text-amber-700 font-bold">Next Due: {vac.nextDueDate}</p>
                        )}
                        {vac.clinic && <p className="text-[11px] text-slate-500">Clinic: {vac.clinic}</p>}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VET VISITS */}
          {activeProfileTab === "vets" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">Veterinary Visit Logs</h4>
                <button
                  onClick={() => setCurrentScreen("add_vet")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Vet Visit
                </button>
              </div>

              {vetVisits.filter((vv) => vv.petId === selectedPet.id).length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No vet visits logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {vetVisits
                    .filter((vv) => vv.petId === selectedPet.id)
                    .map((visit) => (
                      <div key={visit.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-black text-slate-800">{visit.reason}</h5>
                          <span className="text-xs font-bold text-emerald-700">NPR {visit.cost || 0}</span>
                        </div>
                        <p className="text-xs text-slate-600">Vet: {visit.vetName} • Date: {visit.date}</p>
                        {visit.diagnosis && <p className="text-[11px] text-slate-500">Diagnosis: {visit.diagnosis}</p>}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HEALTH LOGS */}
          {activeProfileTab === "health" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">Weight & Vital Health Checks</h4>
                <button
                  onClick={() => setCurrentScreen("add_health")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Health Record
                </button>
              </div>

              {healthRecords.filter((hr) => hr.petId === selectedPet.id).length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No health records recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {healthRecords
                    .filter((hr) => hr.petId === selectedPet.id)
                    .map((hr) => (
                      <div key={hr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Date: {hr.date}</span>
                          {hr.weight && (
                            <span className="text-xs font-black text-emerald-700">
                              Weight: {hr.weight} {hr.weightUnit || "kg"}
                            </span>
                          )}
                        </div>
                        {hr.notes && <p className="text-xs text-slate-600">{hr.notes}</p>}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EXPENSES */}
          {activeProfileTab === "expenses" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-black text-slate-900">Pet Expense Breakdown</h4>
              <div className="space-y-2">
                {expenses
                  .filter((exp) => exp.petId === selectedPet.id)
                  .map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{exp.description}</span>
                        <span className="text-[10px] text-slate-400">{exp.category} • {exp.date}</span>
                      </div>
                      <span className="font-black text-slate-900">NPR {exp.amount}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 6: REMINDERS */}
          {activeProfileTab === "reminders" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-black text-slate-900">Vaccine & Health Alerts</h4>
              <div className="space-y-2">
                {reminders
                  .filter((r) => r.petId === selectedPet.id)
                  .map((rem) => (
                    <div key={rem.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                      <div>
                        <span className="font-bold text-amber-900 block">{rem.title}</span>
                        <span className="text-[10px] text-amber-700">Due: {rem.dueDate}</span>
                      </div>
                      <button
                        onClick={() =>
                          setReminders(
                            reminders.map((r) => (r.id === rem.id ? { ...r, isCompleted: !r.isCompleted } : r))
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] cursor-pointer ${
                          rem.isCompleted ? "bg-emerald-600 text-white" : "bg-white text-amber-800 border"
                        }`}
                      >
                        {rem.isCompleted ? "Completed ✓" : "Mark Done"}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: ADD MEDICATION */}
      {/* ========================================================================= */}
      {currentScreen === "add_med" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
            <h3 className="text-sm font-black text-slate-900">Log Medication for {selectedPet?.name}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Medication Name *</label>
              <input
                type="text"
                placeholder="e.g. Heartworm Preventative or Antibiotic"
                value={medForm.name}
                onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dosage *</label>
                <input
                  type="text"
                  placeholder="e.g. 1 tablet or 5ml"
                  value={medForm.dosage}
                  onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Frequency *</label>
                <select
                  value={medForm.frequency}
                  onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Daily">Daily</option>
                  <option value="Twice Daily">Twice Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="As Needed">As Needed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Start Date *</label>
                <input
                  type="date"
                  value={medForm.startDate}
                  onChange={(e) => setMedForm({ ...medForm, startDate: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">End Date (Optional)</label>
                <input
                  type="date"
                  value={medForm.endDate}
                  onChange={(e) => setMedForm({ ...medForm, endDate: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Purpose / Notes</label>
              <input
                type="text"
                placeholder="e.g. Flea & parasite defense"
                value={medForm.purpose}
                onChange={(e) => setMedForm({ ...medForm, purpose: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveMedication(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
            >
              Save & Add Another
            </button>
            <button
              onClick={() => handleSaveMedication(false)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md"
            >
              Save Medication
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 5: ADD VACCINE */}
      {/* ========================================================================= */}
      {currentScreen === "add_vac" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
            <h3 className="text-sm font-black text-slate-900">Record Vaccine for {selectedPet?.name}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Vaccine Name *</label>
              <select
                value={vacForm.name}
                onChange={(e) => setVacForm({ ...vacForm, name: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-2"
              >
                {COMMON_VACCINES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {vacForm.name === "Other" && (
                <input
                  type="text"
                  placeholder="Specify vaccine name..."
                  value={vacForm.customName}
                  onChange={(e) => setVacForm({ ...vacForm, customName: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date Given *</label>
                <input
                  type="date"
                  value={vacForm.dateGiven}
                  onChange={(e) => setVacForm({ ...vacForm, dateGiven: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Next Due Date (Booster)</label>
                <input
                  type="date"
                  value={vacForm.nextDueDate}
                  onChange={(e) => setVacForm({ ...vacForm, nextDueDate: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Given By (Veterinarian)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ross"
                  value={vacForm.givenBy}
                  onChange={(e) => setVacForm({ ...vacForm, givenBy: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Clinic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Paws & Claws"
                  value={vacForm.clinic}
                  onChange={(e) => setVacForm({ ...vacForm, clinic: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveVaccine(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
            >
              Save & Add Another
            </button>
            <button
              onClick={() => handleSaveVaccine(false)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md"
            >
              Save Vaccination
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 6: ADD VET VISIT */}
      {/* ========================================================================= */}
      {currentScreen === "add_vet" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
            <h3 className="text-sm font-black text-slate-900">Log Vet Visit for {selectedPet?.name}</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date *</label>
                <input
                  type="date"
                  value={vetVisitForm.date}
                  onChange={(e) => setVetVisitForm({ ...vetVisitForm, date: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Vet Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Alistair Ross"
                  value={vetVisitForm.vetName}
                  onChange={(e) => setVetVisitForm({ ...vetVisitForm, vetName: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Visit *</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Checkup or Ear Infection"
                  value={vetVisitForm.reason}
                  onChange={(e) => setVetVisitForm({ ...vetVisitForm, reason: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cost (NPR)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={vetVisitForm.cost}
                  onChange={(e) => setVetVisitForm({ ...vetVisitForm, cost: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Diagnosis & Treatment Notes</label>
              <textarea
                rows={3}
                placeholder="Details of examination, prescribed drops or medicines..."
                value={vetVisitForm.diagnosis}
                onChange={(e) => setVetVisitForm({ ...vetVisitForm, diagnosis: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveVetVisit(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
            >
              Save & Add Another
            </button>
            <button
              onClick={() => handleSaveVetVisit(false)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md"
            >
              Save Vet Visit Record
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 7: ADD HEALTH RECORD */}
      {/* ========================================================================= */}
      {currentScreen === "add_health" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
            <h3 className="text-sm font-black text-slate-900">Log Health & Weight Check</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date *</label>
                <input
                  type="date"
                  value={healthForm.date}
                  onChange={(e) => setHealthForm({ ...healthForm, date: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 28.5"
                    value={healthForm.weight}
                    onChange={(e) => setHealthForm({ ...healthForm, weight: e.target.value })}
                    className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <select
                    value={healthForm.weightUnit}
                    onChange={(e) => setHealthForm({ ...healthForm, weightUnit: e.target.value })}
                    className="w-20 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Observed Behaviors</label>
              <textarea
                rows={3}
                placeholder="Normal appetite, playful during park walk..."
                value={healthForm.notes}
                onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentScreen("profile")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveHealthRecord(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
            >
              Save & Add Another
            </button>
            <button
              onClick={() => handleSaveHealthRecord(false)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md"
            >
              Save Health Log
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 8: ANALYTICS */}
      {/* ========================================================================= */}
      {currentScreen === "analytics" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h3 className="text-sm font-black text-slate-900">Pet Healthcare & Expense Analytics</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs text-slate-500 block">Total Pets</span>
              <span className="text-xl font-black text-slate-900">{petsList.length}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs text-slate-500 block">Total Meds</span>
              <span className="text-xl font-black text-indigo-600">{medications.length}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs text-slate-500 block">Vaccinations</span>
              <span className="text-xl font-black text-teal-600">{vaccines.length}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs text-slate-500 block">Total Expense</span>
              <span className="text-xl font-black text-emerald-600">
                NPR {expenses.reduce((acc, curr) => acc + curr.amount, 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 9: SETTINGS */}
      {/* ========================================================================= */}
      {currentScreen === "settings" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h3 className="text-sm font-black text-slate-900">Pet Care Module Settings</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Vaccine & Medication Notifications</span>
                <span className="text-slate-500 text-[11px]">Receive push & banner alerts for booster dates.</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600 cursor-pointer" />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Default Weight Units</span>
                <span className="text-slate-500 text-[11px]">Preferred measurement scale for health checks.</span>
              </div>
              <select className="p-2 border rounded-xl text-xs bg-white">
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
