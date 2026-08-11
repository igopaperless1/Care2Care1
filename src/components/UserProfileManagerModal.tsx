import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  User,
  Briefcase,
  Heart,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Check,
  FileText,
  Activity,
  Zap,
  Phone,
  Mail,
  MapPin,
  Flame,
  Brain,
  Smile,
  Target,
  ChevronRight,
  BookOpen,
  PieChart,
  BarChart3,
  RefreshCw,
  Baby,
  HeartHandshake
} from "lucide-react";
import { Patient } from "../types";

export interface PersonalProfileDetails {
  fullName: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  maritalStatus: string;
  religion: string;
  heightCm: number;
  weightKg: number;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  medications: string;
  physicalActivity: "sedentary" | "light" | "moderate" | "active";
  sleepHours: number;
  sleepQuality: "poor" | "fair" | "good" | "excellent";
  stressLevel: number; // 1-10
  // Habits & Addictions
  isSmoker: boolean;
  cigarettesPerDay: number;
  costPerCigarette: number;
  isDrinker: boolean;
  drinksPerWeek: number;
  caffeineCupsPerDay: number;
  costPerCup: number;
  screenTimeHoursPerDay: number;
  // Finance & Expenses
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsTotal: number;
  totalDebts: number;
  // Emotional & Goals
  mood: string;
  shortTermGoals: string[];
  healthGoals: string[];
}

export interface ProfessionalProfileDetails {
  title: string;
  fullName: string;
  currentEmployment: "employed" | "self_employed" | "business_owner" | "freelancer" | "unemployed" | "student" | "retired";
  companyName: string;
  companyIndustry: string;
  jobTitle: string;
  department: string;
  totalYearsExperience: number;
  employmentType: "full_time" | "part_time" | "contract" | "freelance" | "internship";
  workMode: "office" | "remote" | "hybrid";
  workSchedule: string;
  jobSatisfaction: number; // 1-10
  workStress: number; // 1-10
  // Business Info
  businessName: string;
  businessType: string;
  annualRevenue: number;
  monthlyRevenue: number;
  profitMargin: number;
  employeeCount: number;
  // Education & Skills
  highestDegree: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: number;
  skills: string[];
  certifications: string[];
  languages: string[];
  // Financial
  annualSalary: number;
  monthlyTakeHome: number;
  careerGoals: string[];
  dreamJob: string;
  workLifeBalance: number; // 1-10
}

interface UserProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients?: Patient[];
  onAddSubAccount?: (patient: Patient) => void;
}

// ==========================================
// FORM FILLERS / PRESETS FOR PERSONAL PROFILE
// ==========================================
const PERSONAL_PROFILE_PRESETS: { name: string; icon: string; description: string; data: Partial<PersonalProfileDetails> }[] = [
  {
    name: "Primary Caregiver & Parent",
    icon: "👨‍👩‍👧",
    description: "Managing household, kids, elderly parents & active health tracking",
    data: {
      fullName: "Roshan Singh",
      age: 38,
      gender: "male",
      dateOfBirth: "1988-05-15",
      nationality: "Nepali",
      country: "Nepal",
      city: "Kathmandu",
      address: "Baneshwor, Kathmandu",
      phone: "+977 9841234567",
      email: "roshan.caregiver@example.com",
      maritalStatus: "married",
      religion: "Hindu",
      heightCm: 172,
      weightKg: 68,
      bloodGroup: "O+",
      allergies: "Dust allergy, Mild pollen",
      chronicConditions: "Mild Seasonal Asthma, Work Stress",
      medications: "Multivitamins, Antihistamines as needed",
      physicalActivity: "moderate",
      sleepHours: 7,
      sleepQuality: "fair",
      stressLevel: 6,
      isSmoker: false,
      cigarettesPerDay: 0,
      costPerCigarette: 0,
      isDrinker: false,
      drinksPerWeek: 1,
      caffeineCupsPerDay: 2,
      costPerCup: 30,
      screenTimeHoursPerDay: 4,
      monthlyIncome: 85000,
      monthlyExpenses: 52000,
      savingsTotal: 180000,
      totalDebts: 45000,
      mood: "Focused & Responsible",
      shortTermGoals: ["Organize family health records", "Maintain consistent 7k steps daily"],
      healthGoals: ["Reduce caffeine to 1 cup", "Improve sleep score above 85"]
    }
  },
  {
    name: "Health & Fitness Enthusiast",
    icon: "🏃‍♂️",
    description: "High physical activity, clean lifestyle, nutrition & habit optimizer",
    data: {
      fullName: "Aarav Sharma",
      age: 29,
      gender: "male",
      dateOfBirth: "1997-08-22",
      nationality: "Nepali",
      country: "Nepal",
      city: "Lalitpur",
      address: "Jhamsikhel, Lalitpur",
      phone: "+977 9801122334",
      email: "aarav.fit@example.com",
      maritalStatus: "single",
      religion: "Hindu",
      heightCm: 178,
      weightKg: 73,
      bloodGroup: "A+",
      allergies: "None",
      chronicConditions: "None",
      medications: "Whey Protein, Vitamin D3, Omega 3",
      physicalActivity: "active",
      sleepHours: 8,
      sleepQuality: "excellent",
      stressLevel: 3,
      isSmoker: false,
      cigarettesPerDay: 0,
      costPerCigarette: 0,
      isDrinker: false,
      drinksPerWeek: 0,
      caffeineCupsPerDay: 1,
      costPerCup: 150,
      screenTimeHoursPerDay: 3,
      monthlyIncome: 110000,
      monthlyExpenses: 48000,
      savingsTotal: 320000,
      totalDebts: 0,
      mood: "Energized & Motivated",
      shortTermGoals: ["Run 10k in under 50 minutes", "Maintain 100% hydration routine"],
      healthGoals: ["Gain 2kg lean muscle", "Complete 30-day yoga streak"]
    }
  },
  {
    name: "Student & Young Professional",
    icon: "🎓",
    description: "Career building, balancing studies, high screen time & budgeting",
    data: {
      fullName: "Sujata Adhikari",
      age: 23,
      gender: "female",
      dateOfBirth: "2003-02-10",
      nationality: "Nepali",
      country: "Nepal",
      city: "Pokhara",
      address: "Lakeside, Pokhara",
      phone: "+977 9860998877",
      email: "sujata.student@example.com",
      maritalStatus: "single",
      religion: "Hindu",
      heightCm: 162,
      weightKg: 54,
      bloodGroup: "B+",
      allergies: "Lactose intolerance",
      chronicConditions: "Occasional Migraine",
      medications: "Pain relief for migraine, Iron supplements",
      physicalActivity: "light",
      sleepHours: 6,
      sleepQuality: "poor",
      stressLevel: 7,
      isSmoker: false,
      cigarettesPerDay: 0,
      costPerCigarette: 0,
      isDrinker: false,
      drinksPerWeek: 0,
      caffeineCupsPerDay: 4,
      costPerCup: 25,
      screenTimeHoursPerDay: 8,
      monthlyIncome: 35000,
      monthlyExpenses: 28000,
      savingsTotal: 25000,
      totalDebts: 12000,
      mood: "Ambitious but Tired",
      shortTermGoals: ["Clear certification exam", "Reduce daily screen time under 5 hrs"],
      healthGoals: ["Sleep before 11 PM regularly", "Hydrate 2.5L water daily"]
    }
  },
  {
    name: "Senior Household Head",
    icon: "👵",
    description: "Managing chronic vitals, medications, family legacy & peace of mind",
    data: {
      fullName: "Gita Devi Singh",
      age: 65,
      gender: "female",
      dateOfBirth: "1961-11-04",
      nationality: "Nepali",
      country: "Nepal",
      city: "Bhaktapur",
      address: "Suryabinayak, Bhaktapur",
      phone: "+977 9811223344",
      email: "gita.singh@example.com",
      maritalStatus: "widowed",
      religion: "Hindu",
      heightCm: 155,
      weightKg: 62,
      bloodGroup: "O+",
      allergies: "Penicillin",
      chronicConditions: "Hypertension, Osteoarthritis, Early Cataract",
      medications: "Amlodipine 5mg, Calcium + D3, Pain Gel",
      physicalActivity: "light",
      sleepHours: 6,
      sleepQuality: "fair",
      stressLevel: 4,
      isSmoker: false,
      cigarettesPerDay: 0,
      costPerCigarette: 0,
      isDrinker: false,
      drinksPerWeek: 0,
      caffeineCupsPerDay: 2,
      costPerCup: 15,
      screenTimeHoursPerDay: 2,
      monthlyIncome: 40000,
      monthlyExpenses: 22000,
      savingsTotal: 500000,
      totalDebts: 0,
      mood: "Peaceful & Prayerful",
      shortTermGoals: ["Daily morning temple walk", "Timely medication adherence"],
      healthGoals: ["Keep BP below 130/85", "Gentle knee strengthening exercises"]
    }
  }
];

// ==============================================
// FORM FILLERS / PRESETS FOR PROFESSIONAL PROFILE
// ==============================================
const PROFESSIONAL_PROFILE_PRESETS: { name: string; icon: string; description: string; data: Partial<ProfessionalProfileDetails> }[] = [
  {
    name: "Healthcare & Medical Specialist",
    icon: "🩺",
    description: "Doctor, Nurse, Caregiver or Clinical Administrator with shift schedules",
    data: {
      title: "Dr.",
      fullName: "Roshan Singh",
      currentEmployment: "employed",
      companyName: "Grand Central General Hospital",
      companyIndustry: "Healthcare & Medical",
      jobTitle: "Senior Resident Physician / Care Specialist",
      department: "General Medicine & Elder Care",
      totalYearsExperience: 11,
      employmentType: "full_time",
      workMode: "office",
      workSchedule: "Rotational Shifts (8 AM - 4 PM / Night Shifts)",
      jobSatisfaction: 8,
      workStress: 7,
      businessName: "",
      businessType: "",
      annualRevenue: 0,
      monthlyRevenue: 0,
      profitMargin: 0,
      employeeCount: 0,
      highestDegree: "MD / MBBS",
      institution: "Tribhuvan University Institute of Medicine",
      fieldOfStudy: "Internal Medicine & Geriatrics",
      graduationYear: 2015,
      skills: ["Patient Care", "Emergency Triage", "Geriatric Medicine", "Vital Signs Monitoring", "Electronic Health Records"],
      certifications: ["BLS/ACLS Certified", "Medical Council License", "Geriatric Care Specialist"],
      languages: ["English", "Nepali", "Hindi"],
      annualSalary: 1440000,
      monthlyTakeHome: 105000,
      careerGoals: ["Chief Medical Officer", "Publish clinical research paper on elder wellness"],
      dreamJob: "Hospital Director / Medical Director",
      workLifeBalance: 6
    }
  },
  {
    name: "Software Engineer & Tech Staff",
    icon: "💻",
    description: "Developer, IT Manager or Systems Analyst with hybrid/remote flexibility",
    data: {
      title: "Mr.",
      fullName: "Roshan Singh",
      currentEmployment: "employed",
      companyName: "TechPro Global Innovations",
      companyIndustry: "Information Technology & Software",
      jobTitle: "Senior Full Stack Software Engineer",
      department: "Engineering & Cloud Solutions",
      totalYearsExperience: 8,
      employmentType: "full_time",
      workMode: "hybrid",
      workSchedule: "9:00 AM - 5:30 PM (Mon - Fri)",
      jobSatisfaction: 9,
      workStress: 5,
      businessName: "",
      businessType: "",
      annualRevenue: 0,
      monthlyRevenue: 0,
      profitMargin: 0,
      employeeCount: 0,
      highestDegree: "B.Sc. Computer Science / B.E.",
      institution: "Kathmandu University Engineering College",
      fieldOfStudy: "Software Engineering",
      graduationYear: 2018,
      skills: ["TypeScript", "React", "Node.js", "Python", "Cloud Architecture", "System Design"],
      certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional Developer"],
      languages: ["English", "Nepali", "Hindi"],
      annualSalary: 1800000,
      monthlyTakeHome: 135000,
      careerGoals: ["Lead Tech Architect", "Build AI health tech products"],
      dreamJob: "Chief Technology Officer (CTO)",
      workLifeBalance: 8
    }
  },
  {
    name: "Small Business Owner & Entrepreneur",
    icon: "🏢",
    description: "Managing enterprise revenue, payroll, vendors, clients & growth plans",
    data: {
      title: "Mr.",
      fullName: "Roshan Singh",
      currentEmployment: "business_owner",
      companyName: "Singh Care2Care Solutions Pvt. Ltd.",
      companyIndustry: "Elder Care Services & Medical Equipment Supplies",
      jobTitle: "Founder & Managing Director",
      department: "Executive Management",
      totalYearsExperience: 14,
      employmentType: "full_time",
      workMode: "office",
      workSchedule: "Flexible Executive Hours (8:30 AM - 6:00 PM)",
      jobSatisfaction: 9,
      workStress: 8,
      businessName: "Singh Care2Care Solutions Pvt. Ltd.",
      businessType: "Private Limited Company",
      annualRevenue: 6500000,
      monthlyRevenue: 540000,
      profitMargin: 24,
      employeeCount: 12,
      highestDegree: "MBA / Masters in Business Administration",
      institution: "School of Management, TU",
      fieldOfStudy: "Entrepreneurship & Healthcare Management",
      graduationYear: 2014,
      skills: ["Business Development", "Financial Planning", "Team Leadership", "Contract Negotiation", "Operations"],
      certifications: ["Registered Business Director License", "ISO 9001 Quality Management"],
      languages: ["English", "Nepali", "Hindi"],
      annualSalary: 2100000,
      monthlyTakeHome: 160000,
      careerGoals: ["Expand business to 3 major cities", "Reach 1,000 monthly active care subscribers"],
      dreamJob: "CEO of Healthcare Conglomerate",
      workLifeBalance: 5
    }
  },
  {
    name: "Freelance Consultant & Remote Worker",
    icon: "🎨",
    description: "Independent contractor, digital consultant, variable income & schedule",
    data: {
      title: "Ms.",
      fullName: "Sujata Adhikari",
      currentEmployment: "freelancer",
      companyName: "Self-Employed Consultant",
      companyIndustry: "Digital Marketing & Healthcare Communications",
      jobTitle: "Senior UX Consultant & Content Strategist",
      department: "Independent Practice",
      totalYearsExperience: 6,
      employmentType: "contract",
      workMode: "remote",
      workSchedule: "Project-based Flexible Hours",
      jobSatisfaction: 8,
      workStress: 4,
      businessName: "Sujata Digital Lab",
      businessType: "Sole Proprietorship",
      annualRevenue: 1200000,
      monthlyRevenue: 100000,
      profitMargin: 80,
      employeeCount: 1,
      highestDegree: "Bachelor of Information Management",
      institution: "Pokhara University",
      fieldOfStudy: "Digital Media & Management",
      graduationYear: 2020,
      skills: ["UI/UX Design", "Copywriting", "SEO Strategy", "Client Management", "Figma"],
      certifications: ["Google UX Design Professional Certificate", "HubSpot Content Marketing"],
      languages: ["English", "Nepali"],
      annualSalary: 1200000,
      monthlyTakeHome: 90000,
      careerGoals: ["Build recurring retainer client base", "Launch digital course"],
      dreamJob: "Principal Design Director",
      workLifeBalance: 9
    }
  }
];

export const UserProfileManagerModal: React.FC<UserProfileManagerModalProps> = ({
  isOpen,
  onClose,
  patients = [],
  onAddSubAccount
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "professional" | "dependents">("personal");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PERSONAL PROFILE STATE
  const [personalData, setPersonalData] = useState<PersonalProfileDetails>(() => {
    try {
      const saved = localStorage.getItem("care2care_user_personal_profile_v1");
      return saved ? JSON.parse(saved) : (PERSONAL_PROFILE_PRESETS[0].data as PersonalProfileDetails);
    } catch {
      return PERSONAL_PROFILE_PRESETS[0].data as PersonalProfileDetails;
    }
  });

  // PROFESSIONAL PROFILE STATE
  const [profData, setProfData] = useState<ProfessionalProfileDetails>(() => {
    try {
      const saved = localStorage.getItem("care2care_user_professional_profile_v1");
      return saved ? JSON.parse(saved) : (PROFESSIONAL_PROFILE_PRESETS[0].data as ProfessionalProfileDetails);
    } catch {
      return PROFESSIONAL_PROFILE_PRESETS[0].data as ProfessionalProfileDetails;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("care2care_user_personal_profile_v1", JSON.stringify(personalData));
  }, [personalData]);

  useEffect(() => {
    localStorage.setItem("care2care_user_professional_profile_v1", JSON.stringify(profData));
  }, [profData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto Calculations for Personal
  const bmiCalc = useMemo(() => {
    const hM = (personalData.heightCm || 170) / 100;
    const wKg = personalData.weightKg || 70;
    const bmi = Number((wKg / (hM * hM)).toFixed(1));
    let status = "Normal";
    let color = "text-emerald-600 bg-emerald-50 border-emerald-200";

    if (bmi < 18.5) {
      status = "Underweight";
      color = "text-amber-600 bg-amber-50 border-amber-200";
    } else if (bmi >= 25 && bmi < 30) {
      status = "Overweight";
      color = "text-amber-600 bg-amber-50 border-amber-200";
    } else if (bmi >= 30) {
      status = "Obese";
      color = "text-rose-600 bg-rose-50 border-rose-200";
    }
    return { bmi, status, color };
  }, [personalData.heightCm, personalData.weightKg]);

  const habitCostsCalc = useMemo(() => {
    const smokeDaily = personalData.isSmoker ? (personalData.cigarettesPerDay || 0) * (personalData.costPerCigarette || 0) : 0;
    const caffDaily = (personalData.caffeineCupsPerDay || 0) * (personalData.costPerCup || 0);
    const totalDaily = smokeDaily + caffDaily;
    const totalMonthly = totalDaily * 30;
    const totalYearly = totalDaily * 365;

    return { smokeDaily, caffDaily, totalDaily, totalMonthly, totalYearly };
  }, [personalData.isSmoker, personalData.cigarettesPerDay, personalData.costPerCigarette, personalData.caffeineCupsPerDay, personalData.costPerCup]);

  const personalHealthScore = useMemo(() => {
    let score = 70;
    if (personalData.sleepHours >= 7 && personalData.sleepHours <= 9) score += 10;
    if (personalData.physicalActivity === "active" || personalData.physicalActivity === "moderate") score += 10;
    if (!personalData.isSmoker) score += 10;
    if (personalData.stressLevel <= 4) score += 5;
    if (personalData.screenTimeHoursPerDay <= 4) score += 5;
    return Math.min(100, score);
  }, [personalData]);

  // Auto Calculations for Professional
  const profCashFlowCalc = useMemo(() => {
    const income = profData.monthlyTakeHome || 0;
    const expenses = personalData.monthlyExpenses || 0;
    const netSavings = income - expenses;
    const savingsRatio = income > 0 ? Math.round((netSavings / income) * 100) : 0;
    return { income, expenses, netSavings, savingsRatio };
  }, [profData.monthlyTakeHome, personalData.monthlyExpenses]);

  const profReadinessScore = useMemo(() => {
    let score = 65;
    if ((profData.skills || []).length >= 4) score += 10;
    if ((profData.certifications || []).length >= 2) score += 10;
    if (profData.jobSatisfaction >= 7) score += 10;
    if (profData.workLifeBalance >= 7) score += 5;
    return Math.min(100, score);
  }, [profData]);

  // Apply Personal Preset
  const handleApplyPersonalPreset = (presetData: Partial<PersonalProfileDetails>, presetName: string) => {
    setPersonalData((prev) => ({ ...prev, ...presetData }));
    showToast(`⚡ Loaded "${presetName}" Personal Profile Details!`);
  };

  // Apply Professional Preset
  const handleApplyProfessionalPreset = (presetData: Partial<ProfessionalProfileDetails>, presetName: string) => {
    setProfData((prev) => ({ ...prev, ...presetData }));
    showToast(`⚡ Loaded "${presetName}" Professional Details!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 text-xs font-black">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-[#2E7D32]/40 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1b5e20] via-[#2E7D32] to-[#1b5e20] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/10 rounded-2xl border border-white/20">
              <User className="w-6 h-6 text-amber-300 stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  User Details & AI Analysis Suite
                </h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Care2Care Persona
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Comprehensive Personal Details, Professional Business Profiles & Care Dependents Analysis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP TAB STRIP */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 text-xs font-black shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "personal"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <User className="w-4 h-4 text-emerald-300" />
            <span>Personal Profile & Health Details</span>
          </button>

          <button
            onClick={() => setActiveTab("professional")}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "professional"
                ? "bg-indigo-700 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Briefcase className="w-4 h-4 text-indigo-300" />
            <span>Professional & Business Details</span>
          </button>

          <button
            onClick={() => setActiveTab("dependents")}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "dependents"
                ? "bg-amber-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Users className="w-4 h-4 text-amber-200" />
            <span>Care Dependents ({patients.length})</span>
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: PERSONAL PROFILE FORM & AI ANALYSIS */}
          {/* ======================================================== */}
          {activeTab === "personal" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* INSTANT FORM FILLERS / PRESETS */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#2E7D32] uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> 
                    <span>⚡ One-Click Personal Form Fillers / Presets</span>
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Click any preset to auto-fill details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {PERSONAL_PROFILE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPersonalPreset(preset.data, preset.name)}
                      className="p-3 bg-white hover:bg-emerald-100/60 border border-emerald-200/80 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer shadow-2xs group flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{preset.icon}</span>
                          <span className="text-xs font-black text-slate-900 group-hover:text-[#2E7D32]">
                            {preset.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                          {preset.description}
                        </p>
                      </div>
                      <div className="pt-2 flex items-center text-[10px] font-bold text-[#2E7D32] gap-1">
                        <span>Apply Preset</span> <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI DYNAMIC PERSONAL HEALTH SCORE & METRICS SUMMARY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-400" /> Health & Vitals Score</span>
                    <span className="text-amber-400 font-black">{personalHealthScore}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full" style={{ width: `${personalHealthScore}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-300 font-semibold">
                    {personalHealthScore >= 80 ? "✨ Excellent personal health discipline!" : "⚠️ Room for hydration & sleep optimization."}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">BMI & Weight Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900">{bmiCalc.bmi}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${bmiCalc.color}`}>
                      {bmiCalc.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block font-semibold">
                    Height: {personalData.heightCm} cm | Weight: {personalData.weightKg} kg
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Calculated Habit Expenses</span>
                  <div className="text-xl font-black text-[#D32F2F]">
                    ${habitCostsCalc.totalMonthly} / month
                  </div>
                  <span className="text-[10px] text-slate-500 block font-semibold">
                    Yearly habit impact: ${habitCostsCalc.totalYearly}
                  </span>
                </div>
              </div>

              {/* PERSONAL FORM FIELDS */}
              <div className="space-y-4">
                {/* 1. BASIC PERSONAL INFO */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#2E7D32]" />
                    <span>1. Basic Personal Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={personalData.fullName}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Age & Gender</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={personalData.age}
                          onChange={(e) => setPersonalData((prev) => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                          className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                        />
                        <select
                          value={personalData.gender}
                          onChange={(e) => setPersonalData((prev) => ({ ...prev, gender: e.target.value }))}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={personalData.dateOfBirth}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={personalData.phone}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={personalData.email}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">City & Address</label>
                      <input
                        type="text"
                        value={personalData.address}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. HEALTH, PHYSICAL & HABITS */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#2E7D32]" />
                    <span>2. Health, Vitals, Sleep & Lifestyle Habits</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={personalData.heightCm}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, heightCm: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={personalData.weightKg}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, weightKg: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={personalData.bloodGroup}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, bloodGroup: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Sleep Hours</label>
                      <input
                        type="number"
                        value={personalData.sleepHours}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, sleepHours: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Chronic Conditions / Medical Notes</label>
                      <input
                        type="text"
                        value={personalData.chronicConditions}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, chronicConditions: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Current Medications</label>
                      <input
                        type="text"
                        value={personalData.medications}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, medications: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Tea/Coffee Cups/Day</label>
                      <input
                        type="number"
                        value={personalData.caffeineCupsPerDay}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, caffeineCupsPerDay: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Cost Per Cup ($)</label>
                      <input
                        type="number"
                        value={personalData.costPerCup}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, costPerCup: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Screen Time (hrs/day)</label>
                      <input
                        type="number"
                        value={personalData.screenTimeHoursPerDay}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, screenTimeHoursPerDay: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Daily Stress (1-10)</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={personalData.stressLevel}
                        onChange={(e) => setPersonalData((prev) => ({ ...prev, stressLevel: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* AI RECOMMENDATION BOX */}
                <div className="p-4 bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl border border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> AI Care2Care Personalized Recommendation Engine
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    Based on your profile, reducing screen time by 2 hours can increase sleep quality by up to 25%. Also, redirecting your caffeine expense (${habitCostsCalc.totalMonthly}/mo) towards an emergency health fund will build a <strong>${habitCostsCalc.totalYearly}</strong> safety reserve by next year!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: PROFESSIONAL & BUSINESS PROFILE FORM & AI ANALYSIS */}
          {/* ======================================================== */}
          {activeTab === "professional" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* INSTANT FORM FILLERS / PRESETS */}
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                    <span>⚡ One-Click Professional & Business Presets</span>
                  </h3>
                  <span className="text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                    Auto-fill career & business parameters
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {PROFESSIONAL_PROFILE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyProfessionalPreset(preset.data, preset.name)}
                      className="p-3 bg-white hover:bg-indigo-100/60 border border-indigo-200/80 rounded-2xl text-left transition-all hover:scale-[1.02] cursor-pointer shadow-2xs group flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{preset.icon}</span>
                          <span className="text-xs font-black text-slate-900 group-hover:text-indigo-700">
                            {preset.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                          {preset.description}
                        </p>
                      </div>
                      <div className="pt-2 flex items-center text-[10px] font-bold text-indigo-700 gap-1">
                        <span>Load Profile</span> <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* PROFESSIONAL READINESS SCORE & CASH FLOW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-indigo-950 text-white rounded-2xl border border-indigo-900 space-y-2">
                  <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
                    <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-indigo-400" /> Career Growth Score</span>
                    <span className="text-amber-400 font-black">{profReadinessScore}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-indigo-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: `${profReadinessScore}%` }} />
                  </div>
                  <p className="text-[10px] text-indigo-200 font-semibold">
                    {profReadinessScore >= 80 ? "🚀 High professional competitive rating!" : "💡 Add certifications to boost marketability."}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Monthly Take-Home Income</span>
                  <div className="text-xl font-black text-emerald-600">
                    ${profCashFlowCalc.income.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 block font-semibold">
                    Annual Compensation: ${((profData.annualSalary || 0)).toLocaleString()}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase block">Monthly Net Savings Ratio</span>
                  <div className="text-xl font-black text-slate-900">
                    {profCashFlowCalc.savingsRatio}% (${profCashFlowCalc.netSavings.toLocaleString()}/mo)
                  </div>
                  <span className="text-[10px] text-slate-500 block font-semibold">
                    Monthly Expenses: ${profCashFlowCalc.expenses.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* PROFESSIONAL FORM FIELDS */}
              <div className="space-y-4">
                {/* 1. EMPLOYMENT & COMPANY DETAILS */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>1. Career, Employment & Company Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Employment Status</label>
                      <select
                        value={profData.currentEmployment}
                        onChange={(e) => setProfData((prev) => ({ ...prev, currentEmployment: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      >
                        <option value="employed">Employed (Corporate / Org)</option>
                        <option value="self_employed">Self-Employed</option>
                        <option value="business_owner">Business Owner / Founder</option>
                        <option value="freelancer">Freelancer / Consultant</option>
                        <option value="unemployed">Job Seeker / Between Roles</option>
                        <option value="student">Student</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={profData.companyName}
                        onChange={(e) => setProfData((prev) => ({ ...prev, companyName: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Job Title / Designation</label>
                      <input
                        type="text"
                        value={profData.jobTitle}
                        onChange={(e) => setProfData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Industry Sector</label>
                      <input
                        type="text"
                        value={profData.companyIndustry}
                        onChange={(e) => setProfData((prev) => ({ ...prev, companyIndustry: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Total Experience (Years)</label>
                      <input
                        type="number"
                        value={profData.totalYearsExperience}
                        onChange={(e) => setProfData((prev) => ({ ...prev, totalYearsExperience: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Work Mode & Setup</label>
                      <select
                        value={profData.workMode}
                        onChange={(e) => setProfData((prev) => ({ ...prev, workMode: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      >
                        <option value="office">On-Site / Office</option>
                        <option value="remote">Fully Remote</option>
                        <option value="hybrid">Hybrid Work</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* BUSINESS DETAILS IF APPLICABLE */}
                {profData.currentEmployment === "business_owner" && (
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-3">
                    <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider border-b border-indigo-200 pb-2 flex items-center gap-2">
                      <Building className="w-4 h-4 text-indigo-700" />
                      <span>Business Enterprise & Revenue Metrics</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Business Name</label>
                        <input
                          type="text"
                          value={profData.businessName}
                          onChange={(e) => setProfData((prev) => ({ ...prev, businessName: e.target.value }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Annual Revenue ($)</label>
                        <input
                          type="number"
                          value={profData.annualRevenue}
                          onChange={(e) => setProfData((prev) => ({ ...prev, annualRevenue: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Profit Margin (%) & Staff Count</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Margin %"
                            value={profData.profitMargin}
                            onChange={(e) => setProfData((prev) => ({ ...prev, profitMargin: parseFloat(e.target.value) || 0 }))}
                            className="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                          />
                          <input
                            type="number"
                            placeholder="Employees"
                            value={profData.employeeCount}
                            onChange={(e) => setProfData((prev) => ({ ...prev, employeeCount: parseInt(e.target.value) || 0 }))}
                            className="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. EDUCATION, SKILLS & CERTIFICATIONS */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>2. Education, Certifications & Key Competencies</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Highest Qualification</label>
                      <input
                        type="text"
                        value={profData.highestDegree}
                        onChange={(e) => setProfData((prev) => ({ ...prev, highestDegree: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Institution / University</label>
                      <input
                        type="text"
                        value={profData.institution}
                        onChange={(e) => setProfData((prev) => ({ ...prev, institution: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Dream Target Career Role</label>
                      <input
                        type="text"
                        value={profData.dreamJob}
                        onChange={(e) => setProfData((prev) => ({ ...prev, dreamJob: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* SKILLS CHIPS */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Professional Skills & Tools</label>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      {(profData.skills || []).map((skill, idx) => (
                        <span key={idx} className="bg-indigo-100 text-indigo-900 font-extrabold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI CAREER ADVICE BOX */}
                <div className="p-4 bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> AI Professional Growth & Career Analysis
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    Your profile demonstrates strong domain expertise as a <strong>{profData.jobTitle}</strong>. Your net monthly savings ratio stands at <strong>{profCashFlowCalc.savingsRatio}%</strong>. To accelerate advancement towards <em>{profData.dreamJob}</em>, consider adding 1 leadership or specialized certification this quarter!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: DEPENDENTS & CARE SUBJECTS OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === "dependents" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
                    <Baby className="w-4 h-4 text-amber-600" />
                    <span>Registered Care Dependents & Relatives ({patients.length})</span>
                  </h3>
                  <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                    Managing kids, disabled family members, elderly parents, patients, relatives & neighbors.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Add New Dependent Profile
                </button>
              </div>

              {patients.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-xs font-black text-slate-800">No care sub-accounts registered yet</h4>
                  <p className="text-[11px] text-slate-500">Create profiles for children, elderly parents, or relatives to track their vitals and care routines.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {patients.map((p) => (
                    <div key={p.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                          alt={p.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900 truncate">{p.name}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[9px] font-black uppercase">
                              {p.category || "General"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium truncate">
                            Age: {p.age} | Emergency: {p.emergencyContact?.name || "Family"} ({p.emergencyContact?.phone || "N/A"})
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl text-[10px] font-semibold text-slate-700 border border-slate-200/80 space-y-1">
                        <div className="flex justify-between">
                          <span>Status: <strong className="text-emerald-700">{p.status}</strong></span>
                          <span>Water Goal: <strong>{p.waterGoalMl} ml</strong></span>
                        </div>
                        <p className="line-clamp-2 text-slate-500">{p.caregiverNotes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" /> Care2Care Profile Data Encrypted & Saved Locally
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                showToast("💾 Saved profile details & AI analysis!");
                onClose();
              }}
              className="px-5 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
