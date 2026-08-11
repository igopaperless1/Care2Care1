import React, { useState } from "react";
import { Patient } from "../types";
import {
  Baby,
  Ruler,
  Syringe,
  GraduationCap,
  Activity,
  Award,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  Search,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Heart,
  Stethoscope,
  Shield,
  FileText,
  User,
  Users,
  Camera,
  Download,
  Filter,
  Check,
  ChevronRight,
  Info,
  BookOpen,
  Dumbbell,
  Palette,
  Music,
  Code,
  Smile,
  Zap,
  TrendingUp,
  Brain,
  MessageSquare
} from "lucide-react";

interface KidsCareTrackerProps {
  patient?: Patient;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface ChildProfile {
  id: string;
  fullName: string;
  nickName?: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: "Male" | "Female" | "Other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  allergies: string;
  medicalConditions: string;
  profilePhoto?: string;
  notes?: string;
  parentName: string;
  parentRelationship: "Father" | "Mother" | "Grandparent" | "Guardian" | "Uncle/Aunt" | "Teacher";
  parentPhone: string;
  parentEmail: string;
  address: string;
  emergencyContact: EmergencyContact;
  schoolName: string;
  schoolGrade: string;
  schoolPhone: string;
  teacherName: string;
  schoolAddress: string;
  schoolSchedule: string;
  pediatricianName: string;
  pediatricianClinic: string;
  pediatricianPhone: string;
  pediatricianAddress: string;
  lastVisitDate: string;
  autoVaccineSchedule: boolean;
}

export interface GrowthRecord {
  id: string;
  childId: string;
  date: string;
  heightCm: number;
  weightKg: number;
  headCircumferenceCm?: number;
  bmi: number;
  heightPercentile: number;
  weightPercentile: number;
  bmiPercentile: number;
  notes?: string;
  photoProof?: string;
}

export interface VaccinationRecord {
  id: string;
  childId: string;
  vaccineName: string;
  doseNumber: number;
  dateGiven?: string;
  nextDueDate: string;
  givenBy?: string;
  facility?: string;
  batchNumber?: string;
  notes?: string;
  photoProof?: string;
  reminder: boolean;
  isCompleted: boolean;
}

export interface SchoolReport {
  id: string;
  childId: string;
  date: string;
  subject: string;
  grade: string;
  teachersComments: string;
  areasForImprovement?: string;
  strengths?: string;
  nextSteps?: string;
  photoProof?: string;
}

export interface ActivityRecord {
  id: string;
  childId: string;
  name: string;
  category: "Sports" | "Arts/Crafts" | "Music" | "Dance" | "Academic/STEM" | "Language" | "Social" | "Other";
  schedule: string;
  durationMinutes: number;
  location: string;
  instructor: string;
  notes?: string;
}

export interface MilestoneRecord {
  id: string;
  childId: string;
  ageRange: "0-3 Months" | "4-6 Months" | "7-9 Months" | "10-12 Months" | "1-2 Years" | "2-3 Years" | "3-4 Years" | "4-5 Years" | "5-6 Years";
  category: "Social/Emotional" | "Language" | "Motor";
  description: string;
  achieved: boolean;
  achievedDate?: string;
  notes?: string;
}

export const KidsCareTracker: React.FC<KidsCareTrackerProps> = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "add_child" | "analytics" | "settings"
  >("dashboard");

  const [childProfileSubTab, setChildProfileSubTab] = useState<
    "growth" | "vaccines" | "school" | "health" | "activities" | "milestones"
  >("growth");

  // Selected Child ID
  const [selectedChildId, setSelectedChildId] = useState<string>("child-1");

  // Feedback Notification Toast
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // ==================== STATE: CHILDREN PROFILES ====================
  const [children, setChildren] = useState<ChildProfile[]>([
    {
      id: "child-1",
      fullName: "Leo Miller",
      nickName: "Leo",
      dateOfBirth: "2021-03-15",
      gender: "Male",
      bloodGroup: "A+",
      allergies: "Peanuts (Mild), Dust Mites",
      medicalConditions: "Mild Seasonal Asthma",
      parentName: "Sarah Miller",
      parentRelationship: "Mother",
      parentPhone: "+1 (555) 234-5678",
      parentEmail: "sarah.miller@example.com",
      address: "742 Evergreen Terrace, Springfield",
      emergencyContact: {
        name: "David Miller",
        phone: "+1 (555) 876-5432",
        relationship: "Father",
      },
      schoolName: "St. Jude Elementary School",
      schoolGrade: "Kindergarten B",
      schoolPhone: "+1 (555) 999-0011",
      teacherName: "Mrs. Emma Thompson",
      schoolAddress: "123 School Lane, Springfield",
      schoolSchedule: "Mon-Fri 08:30 AM - 02:30 PM",
      pediatricianName: "Dr. Robert Vance, MD",
      pediatricianClinic: "Sunshine Pediatric Center",
      pediatricianPhone: "+1 (555) 444-3322",
      pediatricianAddress: "450 Health Avenue, Suite 200",
      lastVisitDate: "2025-11-10",
      autoVaccineSchedule: true,
    },
    {
      id: "child-2",
      fullName: "Maya Miller",
      nickName: "May",
      dateOfBirth: "2024-06-10",
      gender: "Female",
      bloodGroup: "O+",
      allergies: "None known",
      medicalConditions: "None",
      parentName: "Sarah Miller",
      parentRelationship: "Mother",
      parentPhone: "+1 (555) 234-5678",
      parentEmail: "sarah.miller@example.com",
      address: "742 Evergreen Terrace, Springfield",
      emergencyContact: {
        name: "David Miller",
        phone: "+1 (555) 876-5432",
        relationship: "Father",
      },
      schoolName: "Little Angels Daycare & Nursery",
      schoolGrade: "Toddler Group",
      schoolPhone: "+1 (555) 888-1122",
      teacherName: "Ms. Clara Bennett",
      schoolAddress: "88 Sunshine Blvd, Springfield",
      schoolSchedule: "Mon-Thu 09:00 AM - 01:00 PM",
      pediatricianName: "Dr. Robert Vance, MD",
      pediatricianClinic: "Sunshine Pediatric Center",
      pediatricianPhone: "+1 (555) 444-3322",
      pediatricianAddress: "450 Health Avenue, Suite 200",
      lastVisitDate: "2025-12-05",
      autoVaccineSchedule: true,
    },
  ]);

  // Active Child
  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];

  // Helper to Calculate Age
  const calculateAgeStr = (dobStr: string) => {
    const dob = new Date(dobStr);
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < dob.getDate())) {
      years--;
      months += 12;
    }
    if (years === 0) return `${months} Months`;
    return `${years} yrs ${months > 0 ? `${months} mos` : ""}`;
  };

  // ==================== STATE: GROWTH RECORDS ====================
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([
    {
      id: "gr-1",
      childId: "child-1",
      date: "2026-01-15",
      heightCm: 110,
      weightKg: 18.5,
      headCircumferenceCm: 51,
      bmi: 15.3,
      heightPercentile: 75,
      weightPercentile: 65,
      bmiPercentile: 58,
      notes: "Growing steady on 75th percentile. Active, eating well.",
    },
    {
      id: "gr-2",
      childId: "child-1",
      date: "2025-09-10",
      heightCm: 106,
      weightKg: 17.2,
      headCircumferenceCm: 50.5,
      bmi: 15.3,
      heightPercentile: 73,
      weightPercentile: 62,
      bmiPercentile: 56,
      notes: "Routine 4-year checkup at Sunshine Pediatric.",
    },
    {
      id: "gr-3",
      childId: "child-2",
      date: "2026-01-10",
      heightCm: 85,
      weightKg: 11.8,
      headCircumferenceCm: 47.5,
      bmi: 16.3,
      heightPercentile: 80,
      weightPercentile: 72,
      bmiPercentile: 65,
      notes: "18-month checkup complete.",
    },
  ]);

  // Modal for Add Growth
  const [showAddGrowthModal, setShowAddGrowthModal] = useState<boolean>(false);
  const [gDate, setGDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [gHeight, setGHeight] = useState<number>(112);
  const [gWeight, setGWeight] = useState<number>(19.0);
  const [gHead, setGHead] = useState<number>(51.5);
  const [gNotes, setGNotes] = useState<string>("");

  const handleSaveGrowth = () => {
    if (!gHeight || !gWeight) {
      showFeedback("Please enter height and weight!");
      return;
    }
    const heightM = gHeight / 100;
    const calculatedBmi = Number((gWeight / (heightM * heightM)).toFixed(1));
    const newRecord: GrowthRecord = {
      id: `gr-${Date.now()}`,
      childId: selectedChildId,
      date: gDate,
      heightCm: gHeight,
      weightKg: gWeight,
      headCircumferenceCm: gHead,
      bmi: calculatedBmi,
      heightPercentile: Math.min(95, Math.max(10, Math.round(gHeight * 0.68))),
      weightPercentile: Math.min(95, Math.max(10, Math.round(gWeight * 3.4))),
      bmiPercentile: 55,
      notes: gNotes || "Routine growth measurement.",
    };
    setGrowthRecords([newRecord, ...growthRecords]);
    showFeedback(`Logged growth entry for ${selectedChild.fullName}! 📈`);
    setShowAddGrowthModal(false);
    setGNotes("");
  };

  // ==================== STATE: VACCINATIONS ====================
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([
    {
      id: "vac-1",
      childId: "child-1",
      vaccineName: "MMR (Measles, Mumps, Rubella)",
      doseNumber: 2,
      dateGiven: "2025-03-20",
      nextDueDate: "2027-03-20",
      givenBy: "Dr. Robert Vance",
      facility: "Sunshine Pediatric Center",
      batchNumber: "MMR-908821",
      reminder: true,
      isCompleted: true,
      notes: "Booster completed without fever.",
    },
    {
      id: "vac-2",
      childId: "child-1",
      vaccineName: "DPT (Diphtheria, Pertussis, Tetanus)",
      doseNumber: 5,
      dateGiven: "2025-06-15",
      nextDueDate: "2031-06-15",
      givenBy: "Nurse Nancy",
      facility: "City Health Clinic",
      batchNumber: "DPT-5521A",
      reminder: true,
      isCompleted: true,
      notes: "5th dose booster administered.",
    },
    {
      id: "vac-3",
      childId: "child-1",
      vaccineName: "Influenza (Annual Flu Shot)",
      doseNumber: 4,
      nextDueDate: "2026-10-15",
      reminder: true,
      isCompleted: false,
      notes: "Scheduled for Autumn flu season.",
    },
    {
      id: "vac-4",
      childId: "child-2",
      vaccineName: "Chickenpox (Varicella)",
      doseNumber: 1,
      dateGiven: "2025-06-12",
      nextDueDate: "2028-06-12",
      givenBy: "Dr. Robert Vance",
      facility: "Sunshine Pediatric Center",
      batchNumber: "VAR-11029",
      reminder: true,
      isCompleted: true,
      notes: "Dose 1 administered.",
    },
  ]);

  // Modal for Add Vaccination
  const [showAddVaccineModal, setShowAddVaccineModal] = useState<boolean>(false);
  const [vName, setVName] = useState<string>("MMR (Measles, Mumps, Rubella)");
  const [vDose, setVDose] = useState<number>(1);
  const [vDateGiven, setVDateGiven] = useState<string>(new Date().toISOString().split("T")[0]);
  const [vNextDue, setVNextDue] = useState<string>("2027-01-01");
  const [vGivenBy, setVGivenBy] = useState<string>("Dr. Robert Vance");
  const [vFacility, setVFacility] = useState<string>("Sunshine Pediatric Center");
  const [vBatch, setVBatch] = useState<string>("BATCH-7782");
  const [vNotes, setVNotes] = useState<string>("");

  const handleSaveVaccine = () => {
    const newVac: VaccinationRecord = {
      id: `vac-${Date.now()}`,
      childId: selectedChildId,
      vaccineName: vName,
      doseNumber: vDose,
      dateGiven: vDateGiven,
      nextDueDate: vNextDue,
      givenBy: vGivenBy,
      facility: vFacility,
      batchNumber: vBatch,
      notes: vNotes || "Vaccine logged successfully.",
      reminder: true,
      isCompleted: true,
    };
    setVaccinations([newVac, ...vaccinations]);
    showFeedback(`Logged vaccination "${vName}" for ${selectedChild.fullName}! 💉`);
    setShowAddVaccineModal(false);
    setVNotes("");
  };

  // ==================== STATE: SCHOOL PROGRESS REPORTS ====================
  const [schoolReports, setSchoolReports] = useState<SchoolReport[]>([
    {
      id: "sr-1",
      childId: "child-1",
      date: "2026-01-10",
      subject: "Mathematics & Counting",
      grade: "A+",
      teachersComments: "Leo demonstrates outstanding numerical comprehension, quickly solving addition puzzles up to 20.",
      strengths: "Fast mental arithmetic, logical reasoning",
      areasForImprovement: "Patience during group listening exercises",
      nextSteps: "Introduce basic subtraction concepts.",
    },
    {
      id: "sr-2",
      childId: "child-1",
      date: "2025-12-18",
      subject: "English Reading & Phonics",
      grade: "A",
      teachersComments: "Reads simple three-letter and four-letter sight words with clear pronunciation.",
      strengths: "Phonics recognition, enthusiastic reader",
      areasForImprovement: "Handwriting neatness on line guides",
      nextSteps: "Encourage 10 mins daily storybook reading at home.",
    },
  ]);

  // Modal for Add School Report
  const [showAddSchoolModal, setShowAddSchoolModal] = useState<boolean>(false);
  const [srSubject, setSrSubject] = useState<string>("Mathematics & Logic");
  const [srGrade, setSrGrade] = useState<string>("A");
  const [srComments, setSrComments] = useState<string>("");
  const [srStrengths, setSrStrengths] = useState<string>("");
  const [srAreas, setSrAreas] = useState<string>("");

  const handleSaveSchoolReport = () => {
    if (!srSubject.trim()) {
      showFeedback("Please enter subject name!");
      return;
    }
    const newReport: SchoolReport = {
      id: `sr-${Date.now()}`,
      childId: selectedChildId,
      date: new Date().toISOString().split("T")[0],
      subject: srSubject,
      grade: srGrade,
      teachersComments: srComments || "Good overall class participation.",
      strengths: srStrengths || "Creative thinking, teamwork",
      areasForImprovement: srAreas || "Focus during independent work",
    };
    setSchoolReports([newReport, ...schoolReports]);
    showFeedback(`Logged School Report for ${srSubject}! 🏫`);
    setShowAddSchoolModal(false);
    setSrComments("");
  };

  // ==================== STATE: EXTRACURRICULAR ACTIVITIES ====================
  const [activities, setActivities] = useState<ActivityRecord[]>([
    {
      id: "act-1",
      childId: "child-1",
      name: "Junior Soccer League",
      category: "Sports",
      schedule: "Saturdays 09:00 AM - 10:30 AM",
      durationMinutes: 90,
      location: "Springfield Community Sports Field",
      instructor: "Coach Mike Henderson",
      notes: "Position: Forward. Great sportsmanship and stamina.",
    },
    {
      id: "act-2",
      childId: "child-1",
      name: "Little Mozarts Piano Class",
      category: "Music",
      schedule: "Wednesdays 04:00 PM - 05:00 PM",
      durationMinutes: 60,
      location: "Harmony Music School Studio 3",
      instructor: "Ms. Elena Rostova",
      notes: "Practicing 'Twinkle Twinkle Little Star' and scale exercises.",
    },
  ]);

  // Modal for Add Activity
  const [showAddActModal, setShowAddActModal] = useState<boolean>(false);
  const [actName, setActName] = useState<string>("");
  const [actCategory, setActCategory] = useState<ActivityRecord["category"]>("Sports");
  const [actSchedule, setActSchedule] = useState<string>("Tuesdays 04:00 PM");
  const [actDuration, setActDuration] = useState<number>(60);
  const [actLocation, setActLocation] = useState<string>("Community Gym");
  const [actInstructor, setActInstructor] = useState<string>("Coach Sam");

  const handleSaveActivity = () => {
    if (!actName.trim()) {
      showFeedback("Please enter activity name!");
      return;
    }
    const newAct: ActivityRecord = {
      id: `act-${Date.now()}`,
      childId: selectedChildId,
      name: actName,
      category: actCategory,
      schedule: actSchedule,
      durationMinutes: actDuration,
      location: actLocation,
      instructor: actInstructor,
    };
    setActivities([newAct, ...activities]);
    showFeedback(`Added activity "${actName}"! ⚽`);
    setShowAddActModal(false);
    setActName("");
  };

  // ==================== STATE: DEVELOPMENTAL MILESTONES ====================
  const [milestones, setMilestones] = useState<MilestoneRecord[]>([
    {
      id: "ms-1",
      childId: "child-1",
      ageRange: "4-5 Years",
      category: "Motor",
      description: "Hops and stands on one foot up to 5 seconds",
      achieved: true,
      achievedDate: "2025-08-10",
      notes: "Mastered at playground park.",
    },
    {
      id: "ms-2",
      childId: "child-1",
      ageRange: "4-5 Years",
      category: "Language",
      description: "Speaks in sentences of 5-6 words and tells simple stories",
      achieved: true,
      achievedDate: "2025-09-01",
    },
    {
      id: "ms-3",
      childId: "child-1",
      ageRange: "4-5 Years",
      category: "Social/Emotional",
      description: "Enjoys playing with other children & cooperates in groups",
      achieved: true,
      achievedDate: "2025-10-15",
    },
    {
      id: "ms-4",
      childId: "child-1",
      ageRange: "5-6 Years",
      category: "Motor",
      description: "Rides a bicycle with training wheels & catches a bounced ball",
      achieved: false,
    },
  ]);

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newlyAchieved = !m.achieved;
          return {
            ...m,
            achieved: newlyAchieved,
            achievedDate: newlyAchieved ? new Date().toISOString().split("T")[0] : undefined,
          };
        }
        return m;
      })
    );
    showFeedback("Updated milestone achievement!");
  };

  // ==================== STATE: ADD CHILD FORM ====================
  const [newChildName, setNewChildName] = useState<string>("");
  const [newChildDob, setNewChildDob] = useState<string>("2022-05-10");
  const [newChildGender, setNewChildGender] = useState<ChildProfile["gender"]>("Male");
  const [newChildBlood, setNewChildBlood] = useState<ChildProfile["bloodGroup"]>("O+");
  const [newChildAllergies, setNewChildAllergies] = useState<string>("None");
  const [newChildParent, setNewChildParent] = useState<string>("Sarah Miller");
  const [newChildRel, setNewChildRel] = useState<ChildProfile["parentRelationship"]>("Mother");
  const [newChildPhone, setNewChildPhone] = useState<string>("+1 (555) 234-5678");
  const [newChildSchool, setNewChildSchool] = useState<string>("Sunnybrook Academy");
  const [newChildGrade, setNewChildGrade] = useState<string>("Nursery");
  const [newChildPediatrician, setNewChildPediatrician] = useState<string>("Dr. Robert Vance");

  const handleSaveNewChild = () => {
    if (!newChildName.trim()) {
      showFeedback("Please enter Child's Full Name!");
      return;
    }
    const newChild: ChildProfile = {
      id: `child-${Date.now()}`,
      fullName: newChildName,
      dateOfBirth: newChildDob,
      gender: newChildGender,
      bloodGroup: newChildBlood,
      allergies: newChildAllergies,
      medicalConditions: "None",
      parentName: newChildParent,
      parentRelationship: newChildRel,
      parentPhone: newChildPhone,
      parentEmail: "parent@example.com",
      address: "Springfield, USA",
      emergencyContact: {
        name: newChildParent,
        phone: newChildPhone,
        relationship: newChildRel,
      },
      schoolName: newChildSchool,
      schoolGrade: newChildGrade,
      schoolPhone: "+1 (555) 000-1111",
      teacherName: "Ms. Adams",
      schoolAddress: "Springfield",
      schoolSchedule: "Mon-Fri 08:00 AM - 02:00 PM",
      pediatricianName: newChildPediatrician,
      pediatricianClinic: "Sunshine Pediatric",
      pediatricianPhone: "+1 (555) 444-3322",
      pediatricianAddress: "Medical Center",
      lastVisitDate: new Date().toISOString().split("T")[0],
      autoVaccineSchedule: true,
    };

    setChildren([...children, newChild]);
    setSelectedChildId(newChild.id);
    showFeedback(`Added profile for ${newChildName}! 🎉`);
    setNewChildName("");
    setActiveTab("profile");
  };

  // Filtered child data
  const currentChildGrowth = growthRecords.filter((g) => g.childId === selectedChildId);
  const currentChildVaccines = vaccinations.filter((v) => v.childId === selectedChildId);
  const currentChildSchool = schoolReports.filter((s) => s.childId === selectedChildId);
  const currentChildAct = activities.filter((a) => a.childId === selectedChildId);
  const currentChildMilestones = milestones.filter((m) => m.childId === selectedChildId);

  const completedVaccinesCount = currentChildVaccines.filter((v) => v.isCompleted).length;
  const latestGrowth = currentChildGrowth[0] || { heightCm: 110, weightKg: 18.5, bmi: 15.3, heightPercentile: 75 };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-xl shadow-md">
              👶
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Kids & Pediatric Care
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Growth, Vaccines, School Reports, Activities & Milestones</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("add_child")}
            className="py-2 px-3 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Add Child</span>
          </button>
        </div>

        {/* Child Selector Tabs Header */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          {children.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedChildId(c.id);
                if (activeTab !== "profile" && activeTab !== "dashboard") setActiveTab("profile");
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
                selectedChildId === c.id
                  ? "bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs font-black"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>{c.gender === "Male" ? "👦" : "👧"}</span>
              <span>{c.fullName}</span>
              <span className="text-[10px] opacity-80">({calculateAgeStr(c.dateOfBirth)})</span>
            </button>
          ))}
        </div>

        {/* Main Sub-Navigation Bar */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "dashboard" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> All Kids
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "profile" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Baby className="w-3.5 h-3.5" /> Child Profile
          </button>
          <button
            onClick={() => setActiveTab("add_child")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "add_child" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Add Child
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "analytics" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "settings" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Global Toast Message */}
      {feedbackMsg && (
        <div className="bg-sky-50 border border-sky-200 text-sky-900 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-sky-700 font-black">✕</button>
        </div>
      )}

      {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Main Hero Summary */}
          <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-extrabold text-sky-100 uppercase tracking-wider">KIDS CARE DASHBOARD</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black">{children.length} Children Tracked</span>
                </div>
                <p className="text-xs text-sky-100 font-medium pt-1">
                  All growth charts, pediatric vaccines & school records up to date
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-sky-200 block">Vaccine Compliance</span>
                <span className="text-2xl font-black text-emerald-300">95%</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/20 text-xs font-bold text-center text-sky-100">
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-sm font-black">{children.length}</span>
                <span className="text-[9px] uppercase">Children</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-sm font-black">{vaccinations.length}</span>
                <span className="text-[9px] uppercase">Vaccines</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-sm font-black">{schoolReports.length}</span>
                <span className="text-[9px] uppercase">Reports</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-sm font-black">{activities.length}</span>
                <span className="text-[9px] uppercase">Activities</span>
              </div>
            </div>
          </div>

          {/* Gemini AI Pediatric Assistant Insight */}
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200 p-4 rounded-3xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" /> Gemini AI Pediatric Insight
              </span>
              <span className="text-[10px] bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded-full">
                AI Guidance
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "Leo's height (110cm) is on the 75th percentile according to WHO growth standards. His upcoming Influenza annual flu booster is due in October 2026. Excellent academic progress in Kindergarten Mathematics!"
            </p>
          </div>

          {/* Children Overview Cards Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Children Profiles</h3>

            <div className="grid md:grid-cols-2 gap-3">
              {children.map((child) => {
                const childGrowth = growthRecords.filter((g) => g.childId === child.id)[0];
                const childVac = vaccinations.filter((v) => v.childId === child.id);
                const vacDone = childVac.filter((v) => v.isCompleted).length;

                return (
                  <div
                    key={child.id}
                    onClick={() => {
                      setSelectedChildId(child.id);
                      setActiveTab("profile");
                    }}
                    className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-sky-300 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 font-black text-2xl flex items-center justify-center">
                          {child.gender === "Male" ? "👦" : "👧"}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">{child.fullName}</h4>
                          <p className="text-[11px] text-slate-500 font-bold">
                            {calculateAgeStr(child.dateOfBirth)} • Blood: <span className="text-rose-600 font-extrabold">{child.bloodGroup}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">{child.schoolName} ({child.schoolGrade})</p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-extrabold">
                        🟢 Healthy
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center text-xs font-bold">
                      <div>
                        <span className="block font-black text-sky-900 text-xs">{childGrowth?.heightCm || 110} cm</span>
                        <span className="text-[9px] text-slate-500">Height</span>
                      </div>
                      <div>
                        <span className="block font-black text-sky-900 text-xs">{childGrowth?.weightKg || 18.5} kg</span>
                        <span className="text-[9px] text-slate-500">Weight</span>
                      </div>
                      <div>
                        <span className="block font-black text-emerald-700 text-xs">{vacDone}/{childVac.length || 2}</span>
                        <span className="text-[9px] text-slate-500">Vaccines</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold pt-1 text-sky-700">
                      <span>View Full Profile & Records →</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Care Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setActiveTab("profile");
                setChildProfileSubTab("growth");
                setShowAddGrowthModal(true);
              }}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-sky-300 transition-all text-left space-y-1 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
                📈
              </div>
              <h3 className="font-black text-slate-900 text-xs">Log Growth Entry</h3>
              <p className="text-[10px] text-slate-500 font-medium">Height, Weight & BMI</p>
            </button>

            <button
              onClick={() => {
                setActiveTab("profile");
                setChildProfileSubTab("vaccines");
                setShowAddVaccineModal(true);
              }}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-sky-300 transition-all text-left space-y-1 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                💉
              </div>
              <h3 className="font-black text-slate-900 text-xs">Log Vaccination</h3>
              <p className="text-[10px] text-slate-500 font-medium">Dose, Date & Facility</p>
            </button>

            <button
              onClick={() => {
                setActiveTab("profile");
                setChildProfileSubTab("school");
                setShowAddSchoolModal(true);
              }}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-sky-300 transition-all text-left space-y-1 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                🏫
              </div>
              <h3 className="font-black text-slate-900 text-xs">School Progress</h3>
              <p className="text-[10px] text-slate-500 font-medium">Grades & Teacher Notes</p>
            </button>

            <button
              onClick={() => {
                setActiveTab("profile");
                setChildProfileSubTab("activities");
                setShowAddActModal(true);
              }}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-sky-300 transition-all text-left space-y-1 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                ⚽
              </div>
              <h3 className="font-black text-slate-900 text-xs">Extracurricular</h3>
              <p className="text-[10px] text-slate-500 font-medium">Sports, Music & Arts</p>
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: CHILD PROFILE & DETAILED CARE ==================== */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          {/* Selected Child Hero Header */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-black text-3xl flex items-center justify-center shadow-md">
                  {selectedChild.gender === "Male" ? "👦" : "👧"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900">{selectedChild.fullName}</h2>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-extrabold">
                      {selectedChild.nickName ? `"${selectedChild.nickName}"` : "Child"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold pt-0.5">
                    Age: {calculateAgeStr(selectedChild.dateOfBirth)} (DOB: {selectedChild.dateOfBirth}) • Blood: <span className="text-rose-600 font-black">{selectedChild.bloodGroup}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Parent: {selectedChild.parentName} ({selectedChild.parentRelationship}) • 📞 {selectedChild.parentPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddGrowthModal(true)}
                  className="py-2 px-3 bg-sky-600 text-white font-black rounded-xl text-xs shadow-xs hover:bg-sky-700 cursor-pointer"
                >
                  + Log Growth
                </button>
                <button
                  onClick={() => setShowAddVaccineModal(true)}
                  className="py-2 px-3 bg-emerald-600 text-white font-black rounded-xl text-xs shadow-xs hover:bg-emerald-700 cursor-pointer"
                >
                  + Log Vaccine
                </button>
              </div>
            </div>

            {/* Sub-tabs for Child Profile */}
            <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
              <button
                onClick={() => setChildProfileSubTab("growth")}
                className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  childProfileSubTab === "growth" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Ruler className="w-3.5 h-3.5" /> Growth
              </button>
              <button
                onClick={() => setChildProfileSubTab("vaccines")}
                className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  childProfileSubTab === "vaccines" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Syringe className="w-3.5 h-3.5" /> Vaccines
              </button>
              <button
                onClick={() => setChildProfileSubTab("school")}
                className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  childProfileSubTab === "school" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> School
              </button>
              <button
                onClick={() => setChildProfileSubTab("health")}
                className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  childProfileSubTab === "health" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" /> Health
              </button>
              <button
                onClick={() => setChildProfileSubTab("activities")}
                className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  childProfileSubTab === "activities" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Activities
              </button>
              <button
                onClick={() => setChildProfileSubTab("milestones")}
                className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  childProfileSubTab === "milestones" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Milestones
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: GROWTH CHARTS & HISTORY */}
          {childProfileSubTab === "growth" && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900">Growth Tracking & WHO Standards</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Height, Weight, Head Circumference & BMI Percentiles</p>
                </div>
                <button
                  onClick={() => setShowAddGrowthModal(true)}
                  className="py-1.5 px-3 bg-sky-600 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-sky-700"
                >
                  + Add Entry
                </button>
              </div>

              {/* Current Growth Percentile Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-extrabold text-sky-700 uppercase">Height</span>
                  <span className="block text-xl font-black text-sky-950 pt-1">{latestGrowth.heightCm} cm</span>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-200/80 px-2 py-0.5 rounded-full inline-block mt-1">
                    {latestGrowth.heightPercentile}th Percentile (WHO)
                  </span>
                </div>

                <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-extrabold text-teal-700 uppercase">Weight</span>
                  <span className="block text-xl font-black text-teal-950 pt-1">{latestGrowth.weightKg} kg</span>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-200/80 px-2 py-0.5 rounded-full inline-block mt-1">
                    {(latestGrowth as any).weightPercentile || 65}th Percentile (WHO)
                  </span>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-extrabold text-indigo-700 uppercase">BMI Score</span>
                  <span className="block text-xl font-black text-indigo-950 pt-1">{latestGrowth.bmi}</span>
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-200/80 px-2 py-0.5 rounded-full inline-block mt-1">
                    Normal Healthy
                  </span>
                </div>
              </div>

              {/* Growth History Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-800">Measurement History</h4>
                <div className="space-y-2 text-xs">
                  {currentChildGrowth.map((g) => (
                    <div key={g.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 block">{g.date}</span>
                        <p className="text-[11px] text-slate-600 font-medium">
                          Height: <b>{g.heightCm} cm</b> • Weight: <b>{g.weightKg} kg</b> • BMI: <b>{g.bmi}</b>
                        </p>
                        {g.notes && <p className="text-[10px] text-slate-500 italic pt-0.5">{g.notes}</p>}
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
                          {g.heightPercentile}th %ile
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: VACCINATION SCHEDULE & RECORDS */}
          {childProfileSubTab === "vaccines" && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900">Vaccination Records & Schedule</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Pediatric vaccine compliance, doses & upcoming due dates</p>
                </div>
                <button
                  onClick={() => setShowAddVaccineModal(true)}
                  className="py-1.5 px-3 bg-emerald-600 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-emerald-700"
                >
                  + Log Vaccine
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {currentChildVaccines.map((v) => (
                  <div key={v.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💉</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs">{v.vaccineName}</h4>
                          <p className="text-[10px] text-slate-500 font-bold">
                            Dose #{v.doseNumber} • {v.facility || "Pediatric Clinic"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                          v.isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {v.isCompleted ? "✓ Completed" : "⏳ Upcoming Due"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-700 pt-1 border-t">
                      <div>
                        <span>Date Administered: </span>
                        <b className="text-slate-900">{v.dateGiven || "Pending"}</b>
                      </div>
                      <div>
                        <span>Next Due Date: </span>
                        <b className="text-sky-900">{v.nextDueDate}</b>
                      </div>
                    </div>
                    {v.notes && <p className="text-[10px] text-slate-500 italic">{v.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: SCHOOL & ACADEMICS */}
          {childProfileSubTab === "school" && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900">School & Academic Performance</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Progress reports, teacher feedback, grades & strengths</p>
                </div>
                <button
                  onClick={() => setShowAddSchoolModal(true)}
                  className="py-1.5 px-3 bg-indigo-600 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-indigo-700"
                >
                  + Add Progress Report
                </button>
              </div>

              {/* School Details Header */}
              <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between font-black text-indigo-950">
                  <span>🏫 {selectedChild.schoolName}</span>
                  <span>Class: {selectedChild.schoolGrade}</span>
                </div>
                <p className="text-[11px] text-indigo-800 font-medium">
                  Teacher: <b>{selectedChild.teacherName}</b> • Schedule: {selectedChild.schoolSchedule}
                </p>
              </div>

              {/* Reports List */}
              <div className="space-y-3 text-xs">
                {currentChildSchool.map((sr) => (
                  <div key={sr.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-slate-900">{sr.subject}</h4>
                        <span className="text-[10px] text-slate-500 font-bold">{sr.date}</span>
                      </div>
                      <span className="text-sm font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-xl">
                        Grade: {sr.grade}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                      <p className="font-extrabold text-slate-900">Teacher's Comments:</p>
                      <p className="font-medium text-slate-600">{sr.teachersComments}</p>
                    </div>

                    {sr.strengths && (
                      <p className="text-[11px] font-semibold text-emerald-800">
                        🌟 Strengths: <span className="font-medium text-slate-700">{sr.strengths}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 4: HEALTH, ALLERGIES & PEDIATRICIAN */}
          {childProfileSubTab === "health" && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-xs font-black text-slate-900">Health Profile & Pediatrician Details</h3>
                <p className="text-[10px] text-slate-500 font-medium">Allergies, chronic conditions & doctor contacts</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-2">
                  <span className="font-black text-rose-900 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Allergies & Precautions
                  </span>
                  <p className="font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-rose-200">
                    {selectedChild.allergies || "None known"}
                  </p>
                </div>

                <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl space-y-2">
                  <span className="font-black text-sky-900 text-xs flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-sky-600" /> Pediatrician Info
                  </span>
                  <div className="bg-white p-2.5 rounded-xl border border-sky-200 text-[11px] space-y-1 font-medium text-slate-700">
                    <p className="font-black text-slate-900">{selectedChild.pediatricianName}</p>
                    <p>{selectedChild.pediatricianClinic}</p>
                    <p>📞 {selectedChild.pediatricianPhone}</p>
                    <p className="text-[10px] text-slate-500 pt-1">Last Checkup Visit: {selectedChild.lastVisitDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 5: EXTRACURRICULAR ACTIVITIES */}
          {childProfileSubTab === "activities" && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900">Extracurricular Activities</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Sports, music, arts, dance & swimming schedule</p>
                </div>
                <button
                  onClick={() => setShowAddActModal(true)}
                  className="py-1.5 px-3 bg-amber-600 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-amber-700"
                >
                  + Add Activity
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {currentChildAct.map((act) => (
                  <div key={act.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-slate-900">{act.name}</h4>
                      <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                        {act.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-bold">
                      🗓️ {act.schedule} ({act.durationMinutes} mins)
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      📍 {act.location} • Instructor: <b>{act.instructor}</b>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 6: DEVELOPMENTAL MILESTONES */}
          {childProfileSubTab === "milestones" && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-xs font-black text-slate-900">Developmental Milestones Checklist</h3>
                <p className="text-[10px] text-slate-500 font-medium">Age-based motor, language & social emotional progress</p>
              </div>

              <div className="space-y-2 text-xs">
                {currentChildMilestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={m.achieved}
                        onChange={() => {}}
                        className="w-4 h-4 accent-sky-600 cursor-pointer"
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900">{m.description}</h4>
                        <p className="text-[10px] text-slate-500 font-bold">
                          Age: {m.ageRange} • Category: <span className="text-sky-700">{m.category}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        m.achieved ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {m.achieved ? "Achieved ✓" : "In Progress"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: ADD NEW CHILD FORM ==================== */}
      {activeTab === "add_child" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Add Child - Full Profile Form</h2>
            <p className="text-[10px] text-slate-500 font-medium">Create a complete record for your child, grandchild or ward</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Section 1: Basic Info */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border">
              <h3 className="font-black text-slate-800">1. Basic Child Information</h3>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="e.g. Leo Miller"
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={newChildDob}
                    onChange={(e) => setNewChildDob(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={newChildGender}
                    onChange={(e) => setNewChildGender(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Blood Group *</label>
                  <select
                    value={newChildBlood}
                    onChange={(e) => setNewChildBlood(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Known Allergies / Medical Notes</label>
                <input
                  type="text"
                  value={newChildAllergies}
                  onChange={(e) => setNewChildAllergies(e.target.value)}
                  placeholder="e.g. Peanuts, Dust Mites, Asthma"
                  className="w-full p-2.5 border rounded-xl font-bold bg-white"
                />
              </div>
            </div>

            {/* Section 2: Parent/Guardian Info */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border">
              <h3 className="font-black text-slate-800">2. Parent / Guardian Info</h3>

              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Parent Name *</label>
                  <input
                    type="text"
                    value={newChildParent}
                    onChange={(e) => setNewChildParent(e.target.value)}
                    placeholder="Sarah Miller"
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Relationship *</label>
                  <select
                    value={newChildRel}
                    onChange={(e) => setNewChildRel(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Uncle/Aunt">Uncle/Aunt</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={newChildPhone}
                    onChange={(e) => setNewChildPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: School Info */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border">
              <h3 className="font-black text-slate-800">3. School & Grade Info</h3>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">School / Daycare Name</label>
                  <input
                    type="text"
                    value={newChildSchool}
                    onChange={(e) => setNewChildSchool(e.target.value)}
                    placeholder="St. Jude Elementary"
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Class / Grade</label>
                  <input
                    type="text"
                    value={newChildGrade}
                    onChange={(e) => setNewChildGrade(e.target.value)}
                    placeholder="Kindergarten B"
                    className="w-full p-2.5 border rounded-xl font-bold bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveNewChild}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-2xl shadow-md cursor-pointer"
            >
              💾 Save Child Profile
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: ANALYTICS & REPORTS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Kids Care Analytics & Growth Reports</h2>
            <p className="text-[10px] text-slate-500 font-medium">Growth velocity, vaccine compliance & academic summaries</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
            <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl">
              <span className="block text-xl font-black text-sky-950">95%</span>
              <span className="text-[10px] text-sky-700 uppercase">Vaccine Rate</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="block text-xl font-black text-emerald-950">75th %ile</span>
              <span className="text-[10px] text-emerald-700 uppercase">WHO Growth</span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl">
              <span className="block text-xl font-black text-indigo-950">A+ Avg</span>
              <span className="text-[10px] text-indigo-700 uppercase">Academic Score</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Pediatric Care Settings</h2>
            <p className="text-[10px] text-slate-500 font-medium">Configure growth standards, vaccine auto-reminders & units</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-2xl border space-y-1">
              <label className="font-extrabold text-slate-800 block">Growth Chart Standard</label>
              <select className="w-full p-2 border rounded-xl font-bold bg-white">
                <option value="WHO">WHO Growth Standards (World Health Organization)</option>
                <option value="CDC">CDC Growth Charts (Centers for Disease Control)</option>
                <option value="Indian">Indian Academy of Pediatrics (IAP)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border space-y-1">
              <label className="font-extrabold text-slate-800 block">Measurement Units</label>
              <select className="w-full p-2 border rounded-xl font-bold bg-white">
                <option value="metric">Metric (Centimeters / Kilograms)</option>
                <option value="imperial">Imperial (Inches / Pounds)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* Modal 1: Add Growth Record */}
      {showAddGrowthModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-sm">Log Growth Entry for {selectedChild.fullName}</h3>
              <button onClick={() => setShowAddGrowthModal(false)} className="font-black text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={gDate}
                  onChange={(e) => setGDate(e.target.value)}
                  className="w-full p-2 border rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Height (cm) *</label>
                  <input
                    type="number"
                    value={gHeight}
                    onChange={(e) => setGHeight(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={gWeight}
                    onChange={(e) => setGWeight(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Head Circumference (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={gHead}
                  onChange={(e) => setGHead(Number(e.target.value))}
                  className="w-full p-2 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Notes</label>
                <input
                  type="text"
                  value={gNotes}
                  onChange={(e) => setGNotes(e.target.value)}
                  placeholder="e.g. Pediatrician visit"
                  className="w-full p-2 border rounded-xl font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddGrowthModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button onClick={handleSaveGrowth} className="px-4 py-2 bg-sky-600 text-white font-black rounded-xl">
                  Save Growth
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add Vaccination */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-sm">Log Vaccination for {selectedChild.fullName}</h3>
              <button onClick={() => setShowAddVaccineModal(false)} className="font-black text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Vaccine Name *</label>
                <select value={vName} onChange={(e) => setVName(e.target.value)} className="w-full p-2 border rounded-xl font-bold">
                  <option value="BCG">BCG</option>
                  <option value="Hepatitis B">Hepatitis B</option>
                  <option value="DPT (Diphtheria, Pertussis, Tetanus)">DPT</option>
                  <option value="Polio (IPV/OPV)">Polio</option>
                  <option value="Hib">Hib</option>
                  <option value="MMR (Measles, Mumps, Rubella)">MMR</option>
                  <option value="Chickenpox (Varicella)">Chickenpox</option>
                  <option value="Influenza (Annual Flu Shot)">Influenza (Flu)</option>
                  <option value="Rotavirus">Rotavirus</option>
                  <option value="Typhoid">Typhoid</option>
                  <option value="COVID-19">COVID-19</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Dose #</label>
                  <input type="number" value={vDose} onChange={(e) => setVDose(Number(e.target.value))} className="w-full p-2 border rounded-xl font-bold" />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Date Given</label>
                  <input type="date" value={vDateGiven} onChange={(e) => setVDateGiven(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Facility / Clinic</label>
                <input type="text" value={vFacility} onChange={(e) => setVFacility(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddVaccineModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button onClick={handleSaveVaccine} className="px-4 py-2 bg-emerald-600 text-white font-black rounded-xl">
                  Save Vaccine Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Add School Progress Report */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-sm">Add School Report for {selectedChild.fullName}</h3>
              <button onClick={() => setShowAddSchoolModal(false)} className="font-black text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Subject *</label>
                  <input type="text" value={srSubject} onChange={(e) => setSrSubject(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Grade *</label>
                  <input type="text" value={srGrade} onChange={(e) => setSrGrade(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Teacher's Comments</label>
                <textarea value={srComments} onChange={(e) => setSrComments(e.target.value)} className="w-full p-2 border rounded-xl font-medium h-16" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddSchoolModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button onClick={handleSaveSchoolReport} className="px-4 py-2 bg-indigo-600 text-white font-black rounded-xl">
                  Save Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Add Activity */}
      {showAddActModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-sm">Add Extracurricular Activity</h3>
              <button onClick={() => setShowAddActModal(false)} className="font-black text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Activity Name *</label>
                <input type="text" value={actName} onChange={(e) => setActName(e.target.value)} placeholder="e.g. Junior Soccer" className="w-full p-2 border rounded-xl font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Category</label>
                  <select value={actCategory} onChange={(e) => setActCategory(e.target.value as any)} className="w-full p-2 border rounded-xl font-bold">
                    <option value="Sports">Sports</option>
                    <option value="Arts/Crafts">Arts/Crafts</option>
                    <option value="Music">Music</option>
                    <option value="Dance">Dance</option>
                    <option value="Academic/STEM">Academic/STEM</option>
                    <option value="Language">Language</option>
                  </select>
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Schedule</label>
                  <input type="text" value={actSchedule} onChange={(e) => setActSchedule(e.target.value)} className="w-full p-2 border rounded-xl font-bold" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddActModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button onClick={handleSaveActivity} className="px-4 py-2 bg-amber-600 text-white font-black rounded-xl">
                  Save Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
