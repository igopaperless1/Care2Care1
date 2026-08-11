import React, { useState } from "react";
import { Patient } from "../types";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit2,
  Share2,
  Download,
  Upload,
  Calendar,
  MapPin,
  Heart,
  Shield,
  FileText,
  Camera,
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  Settings,
  BarChart3,
  Filter,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  BookOpen,
  Award,
  Clock,
  Briefcase,
  GraduationCap,
  Activity,
  Phone,
  Mail,
  Lock,
  Globe,
  Printer,
  FileCode,
  FileSpreadsheet,
  Check,
  RotateCcw
} from "lucide-react";

interface FamilyTreeTrackerProps {
  patient?: Patient;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  maidenName?: string;
  nickname?: string;
  prefix?: string;
  suffix?: string;
  gender: "Male" | "Female" | "Other";
  isSelf: boolean;
  isAlive: boolean;
  dateOfBirth?: string;
  placeOfBirth?: string;
  dateOfDeath?: string;
  placeOfDeath?: string;
  causeOfDeath?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  education?: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  religion?: string;
  caste?: string;
  gotra?: string;
  kula?: string;
  nationality?: string;
  nationalId?: string;
  passportNumber?: string;
  profilePhoto?: string;
  biography?: string;
  notes?: string;
  
  // Relationship Links
  fatherId?: string;
  motherId?: string;
  spouseIds?: string[];
  marriageDates?: { [spouseId: string]: string };
  ceremonyTypes?: { [spouseId: string]: string };
  childrenIds?: string[];
  siblingIds?: string[];

  // Attachments
  documents?: { id: string; title: string; type: string; fileUrl: string }[];
  photos?: string[];
  religiousCeremonies?: string[];
  healthConditions?: string[];
}

export const FamilyTreeTracker: React.FC<FamilyTreeTrackerProps> = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "interactive_tree" | "pedigree" | "descendant" | "fan_chart" | "timeline" | "members_list" | "stats" | "export" | "settings"
  >("interactive_tree");

  const [selectedMemberId, setSelectedMemberId] = useState<string>("mem-self");
  const [treeZoom, setTreeZoom] = useState<number>(1);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("All");
  const [filterReligion, setFilterReligion] = useState<string>("All");

  // Feedback Toast
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Modals
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [showMemberDetailModal, setShowMemberDetailModal] = useState<boolean>(false);

  // ==================== STATE: FAMILY MEMBERS ====================
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "mem-self",
      firstName: "Alex",
      middleName: "David",
      lastName: "Miller",
      gender: "Male",
      isSelf: true,
      isAlive: true,
      dateOfBirth: "1990-06-15",
      placeOfBirth: "Springfield General Hospital, IL",
      permanentAddress: "742 Evergreen Terrace",
      city: "Springfield",
      state: "Illinois",
      country: "USA",
      pincode: "62701",
      phone: "+1 (555) 234-5678",
      email: "alex.miller@example.com",
      occupation: "Senior Software Engineer",
      education: "B.S. Computer Science - University of Illinois",
      bloodGroup: "O+",
      religion: "Christian",
      nationality: "American",
      nationalId: "SSN-XXX-XX-8921",
      profilePhoto: "👨‍💻",
      biography: "Passionate engineer, family historian, and outdoor adventurer.",
      notes: "Root person for this family tree archive.",
      fatherId: "mem-father",
      motherId: "mem-mother",
      spouseIds: ["mem-spouse"],
      marriageDates: { "mem-spouse": "2018-10-20" },
      ceremonyTypes: { "mem-spouse": "Christian Church Wedding & Reception" },
      childrenIds: ["mem-child1", "mem-child2"],
      siblingIds: ["mem-sibling1"],
      religiousCeremonies: ["Baptism", "Confirmation", "Holy Matrimony"],
      healthConditions: ["Mild Seasonal Allergies"],
      documents: [
        { id: "doc-1", title: "Birth Certificate", type: "Official PDF", fileUrl: "birth_cert_alex.pdf" },
        { id: "doc-2", title: "Marriage Certificate", type: "Official PDF", fileUrl: "marriage_cert.pdf" },
      ],
    },
    {
      id: "mem-spouse",
      firstName: "Sarah",
      middleName: "Marie",
      lastName: "Miller",
      maidenName: "Jenkins",
      gender: "Female",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "1992-04-12",
      placeOfBirth: "Chicago, IL",
      permanentAddress: "742 Evergreen Terrace",
      city: "Springfield",
      state: "Illinois",
      country: "USA",
      phone: "+1 (555) 876-5432",
      email: "sarah.m@example.com",
      occupation: "Pediatric Nurse Practitioner",
      education: "M.S. Nursing - Northwestern University",
      bloodGroup: "A+",
      religion: "Christian",
      nationality: "American",
      profilePhoto: "👩‍⚕️",
      fatherId: "mem-spouse-father",
      motherId: "mem-spouse-mother",
      spouseIds: ["mem-self"],
      childrenIds: ["mem-child1", "mem-child2"],
    },
    {
      id: "mem-child1",
      firstName: "Leo",
      lastName: "Miller",
      gender: "Male",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "2021-03-15",
      placeOfBirth: "Springfield, IL",
      bloodGroup: "A+",
      religion: "Christian",
      nationality: "American",
      profilePhoto: "👦",
      fatherId: "mem-self",
      motherId: "mem-spouse",
      siblingIds: ["mem-child2"],
    },
    {
      id: "mem-child2",
      firstName: "Maya",
      lastName: "Miller",
      gender: "Female",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "2024-06-10",
      placeOfBirth: "Springfield, IL",
      bloodGroup: "O+",
      religion: "Christian",
      nationality: "American",
      profilePhoto: "👧",
      fatherId: "mem-self",
      motherId: "mem-spouse",
      siblingIds: ["mem-child1"],
    },
    {
      id: "mem-sibling1",
      firstName: "Ethan",
      lastName: "Miller",
      gender: "Male",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "1994-08-22",
      placeOfBirth: "Springfield, IL",
      occupation: "Architect",
      bloodGroup: "O+",
      religion: "Christian",
      profilePhoto: "👨‍🎨",
      fatherId: "mem-father",
      motherId: "mem-mother",
      siblingIds: ["mem-self"],
    },
    {
      id: "mem-father",
      firstName: "David",
      middleName: "Arthur",
      lastName: "Miller",
      gender: "Male",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "1962-11-05",
      placeOfBirth: "Peoria, IL",
      occupation: "Retired Civil Engineer",
      education: "B.S. Civil Engineering",
      bloodGroup: "O+",
      religion: "Christian",
      nationality: "American",
      profilePhoto: "👴",
      fatherId: "mem-gfather-paternal",
      motherId: "mem-gmother-paternal",
      spouseIds: ["mem-mother"],
      marriageDates: { "mem-mother": "1987-05-18" },
      childrenIds: ["mem-self", "mem-sibling1"],
    },
    {
      id: "mem-mother",
      firstName: "Eleanor",
      middleName: "Grace",
      lastName: "Miller",
      maidenName: "Vance",
      gender: "Female",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "1964-03-30",
      placeOfBirth: "Springfield, IL",
      occupation: "High School Teacher",
      education: "M.A. Literature",
      bloodGroup: "A+",
      religion: "Christian",
      nationality: "American",
      profilePhoto: "👵",
      fatherId: "mem-gfather-maternal",
      motherId: "mem-gmother-maternal",
      spouseIds: ["mem-father"],
      childrenIds: ["mem-self", "mem-sibling1"],
    },
    {
      id: "mem-gfather-paternal",
      firstName: "Arthur",
      middleName: "Edward",
      lastName: "Miller",
      gender: "Male",
      isSelf: false,
      isAlive: false,
      dateOfBirth: "1935-01-12",
      placeOfBirth: "Peoria, IL",
      dateOfDeath: "2018-09-14",
      placeOfDeath: "Springfield, IL",
      causeOfDeath: "Natural Causes / Old Age",
      occupation: "Railroad Superintendent",
      bloodGroup: "O+",
      religion: "Christian",
      profilePhoto: "👴",
      fatherId: "mem-ggfather-paternal",
      motherId: "mem-ggmother-paternal",
      spouseIds: ["mem-gmother-paternal"],
      childrenIds: ["mem-father"],
    },
    {
      id: "mem-gmother-paternal",
      firstName: "Clara",
      middleName: "Rose",
      lastName: "Miller",
      maidenName: "O'Connor",
      gender: "Female",
      isSelf: false,
      isAlive: false,
      dateOfBirth: "1938-07-19",
      placeOfBirth: "Dublin, Ireland",
      dateOfDeath: "2021-02-08",
      placeOfDeath: "Springfield, IL",
      occupation: "Librarian",
      bloodGroup: "O+",
      religion: "Catholic Christian",
      profilePhoto: "👵",
      spouseIds: ["mem-gfather-paternal"],
      childrenIds: ["mem-father"],
    },
    {
      id: "mem-gfather-maternal",
      firstName: "Dr. Robert",
      lastName: "Vance",
      prefix: "Dr.",
      gender: "Male",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "1939-09-25",
      placeOfBirth: "Chicago, IL",
      occupation: "Retired Pediatrician",
      bloodGroup: "AB+",
      religion: "Christian",
      profilePhoto: "👴",
      spouseIds: ["mem-gmother-maternal"],
      childrenIds: ["mem-mother"],
    },
    {
      id: "mem-gmother-maternal",
      firstName: "Evelyn",
      lastName: "Vance",
      maidenName: "Kowalski",
      gender: "Female",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "1942-12-04",
      placeOfBirth: "Milwaukee, WI",
      occupation: "Botanist",
      bloodGroup: "A+",
      religion: "Christian",
      profilePhoto: "👵",
      spouseIds: ["mem-gfather-maternal"],
      childrenIds: ["mem-mother"],
    },
    {
      id: "mem-ggfather-paternal",
      firstName: "William",
      lastName: "Miller",
      gender: "Male",
      isSelf: false,
      isAlive: false,
      dateOfBirth: "1908-03-10",
      placeOfBirth: "London, England",
      dateOfDeath: "1985-11-22",
      placeOfDeath: "Peoria, IL",
      occupation: "Blacksmith & Machinist",
      religion: "Christian",
      profilePhoto: "👴",
      spouseIds: ["mem-ggmother-paternal"],
      childrenIds: ["mem-gfather-paternal"],
    },
    {
      id: "mem-ggmother-paternal",
      firstName: "Margaret",
      lastName: "Miller",
      maidenName: "Smith",
      gender: "Female",
      isSelf: false,
      isAlive: false,
      dateOfBirth: "1912-05-18",
      placeOfBirth: "Liverpool, England",
      dateOfDeath: "1992-04-05",
      placeOfDeath: "Peoria, IL",
      religion: "Christian",
      profilePhoto: "👵",
      spouseIds: ["mem-ggfather-paternal"],
      childrenIds: ["mem-gfather-paternal"],
    },
  ]);

  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0];

  // ==================== ADD MEMBER FORM STATE ====================
  const [fPrefix, setFPrefix] = useState<string>("");
  const [fFirstName, setFFirstName] = useState<string>("");
  const [fMiddleName, setFMiddleName] = useState<string>("");
  const [fLastName, setFLastName] = useState<string>("");
  const [fMaidenName, setFMaidenName] = useState<string>("");
  const [fGender, setFGender] = useState<FamilyMember["gender"]>("Male");
  const [fIsAlive, setFIsAlive] = useState<boolean>(true);
  const [fDob, setFDob] = useState<string>("");
  const [fPob, setFPob] = useState<string>("");
  const [fDod, setFDod] = useState<string>("");
  const [fPod, setFPod] = useState<string>("");
  const [fRelType, setFRelType] = useState<string>("Father"); // Father, Mother, Spouse, Child, Sibling
  const [fRelatedTo, setFRelatedTo] = useState<string>("mem-self");
  const [fReligion, setFReligion] = useState<string>("Christian");
  const [fGotra, setFGotra] = useState<string>("");
  const [fCaste, setFCaste] = useState<string>("");
  const [fOccupation, setFOccupation] = useState<string>("");
  const [fEducation, setFEducation] = useState<string>("");
  const [fBloodGroup, setFBloodGroup] = useState<FamilyMember["bloodGroup"]>("O+");
  const [fPhone, setFPhone] = useState<string>("");
  const [fEmail, setFEmail] = useState<string>("");
  const [fAddress, setFAddress] = useState<string>("");
  const [fBio, setFBio] = useState<string>("");

  const handleAddMember = () => {
    if (!fFirstName.trim() || !fLastName.trim()) {
      showFeedback("Please enter First Name and Last Name!");
      return;
    }

    const newId = `mem-${Date.now()}`;
    const newMember: FamilyMember = {
      id: newId,
      prefix: fPrefix || undefined,
      firstName: fFirstName,
      middleName: fMiddleName || undefined,
      lastName: fLastName,
      maidenName: fMaidenName || undefined,
      gender: fGender,
      isSelf: false,
      isAlive: fIsAlive,
      dateOfBirth: fDob || undefined,
      placeOfBirth: fPob || undefined,
      dateOfDeath: !fIsAlive ? fDod : undefined,
      placeOfDeath: !fIsAlive ? fPod : undefined,
      permanentAddress: fAddress || undefined,
      phone: fPhone || undefined,
      email: fEmail || undefined,
      occupation: fOccupation || undefined,
      education: fEducation || undefined,
      bloodGroup: fBloodGroup,
      religion: fReligion,
      gotra: fGotra || undefined,
      caste: fCaste || undefined,
      biography: fBio || undefined,
      profilePhoto: fGender === "Male" ? "👨" : "👩",
    };

    // Attach relationship
    if (fRelType === "Father") {
      newMember.childrenIds = [fRelatedTo];
      // update target's fatherId
      setMembers((prev) =>
        prev.map((m) => (m.id === fRelatedTo ? { ...m, fatherId: newId } : m)).concat(newMember)
      );
    } else if (fRelType === "Mother") {
      newMember.childrenIds = [fRelatedTo];
      setMembers((prev) =>
        prev.map((m) => (m.id === fRelatedTo ? { ...m, motherId: newId } : m)).concat(newMember)
      );
    } else if (fRelType === "Spouse") {
      newMember.spouseIds = [fRelatedTo];
      setMembers((prev) =>
        prev.map((m) => (m.id === fRelatedTo ? { ...m, spouseIds: [...(m.spouseIds || []), newId] } : m)).concat(newMember)
      );
    } else if (fRelType === "Child") {
      const targetPerson = members.find((m) => m.id === fRelatedTo);
      if (targetPerson?.gender === "Female") {
        newMember.motherId = fRelatedTo;
      } else {
        newMember.fatherId = fRelatedTo;
      }
      setMembers((prev) =>
        prev.map((m) => (m.id === fRelatedTo ? { ...m, childrenIds: [...(m.childrenIds || []), newId] } : m)).concat(newMember)
      );
    } else if (fRelType === "Sibling") {
      newMember.siblingIds = [fRelatedTo];
      setMembers((prev) =>
        prev.map((m) => (m.id === fRelatedTo ? { ...m, siblingIds: [...(m.siblingIds || []), newId] } : m)).concat(newMember)
      );
    } else {
      setMembers((prev) => [...prev, newMember]);
    }

    showFeedback(`Added family member ${fFirstName} ${fLastName}! 🎉`);
    setShowAddMemberModal(false);
    // Reset
    setFFirstName("");
    setFLastName("");
    setFBio("");
  };

  // Helper getters
  const getParents = (person: FamilyMember) => {
    return members.filter((m) => m.id === person.fatherId || m.id === person.motherId);
  };

  const getSpouses = (person: FamilyMember) => {
    return members.filter((m) => person.spouseIds?.includes(m.id));
  };

  const getChildren = (person: FamilyMember) => {
    return members.filter((m) => person.childrenIds?.includes(m.id) || m.fatherId === person.id || m.motherId === person.id);
  };

  const getSiblings = (person: FamilyMember) => {
    return members.filter(
      (m) =>
        m.id !== person.id &&
        ((m.fatherId && m.fatherId === person.fatherId) ||
          (m.motherId && m.motherId === person.motherId) ||
          person.siblingIds?.includes(m.id))
    );
  };

  // Filtered members list
  const filteredMembersList = members.filter((m) => {
    const q = (filterQuery || "").toLowerCase();
    const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
    const queryMatch = fullName.includes(q) || (m.religion ? m.religion.toLowerCase().includes(q) : false);
    const genderMatch = filterGender === "All" || m.gender === filterGender;
    const religionMatch = filterReligion === "All" || m.religion === filterReligion;
    return queryMatch && genderMatch && religionMatch;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              👨‍👩‍👧‍👦
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Family Tree & Ancestry
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Unlimited Generations, Heritage, Gotra & Historical Archive</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs flex items-center gap-1 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ Add Member</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("interactive_tree")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "interactive_tree" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Interactive Tree
          </button>
          <button
            onClick={() => setActiveTab("pedigree")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "pedigree" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Pedigree
          </button>
          <button
            onClick={() => setActiveTab("descendant")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "descendant" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Descendants
          </button>
          <button
            onClick={() => setActiveTab("fan_chart")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "fan_chart" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" /> Fan Chart
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "timeline" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Timeline
          </button>
          <button
            onClick={() => setActiveTab("members_list")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "members_list" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="w-3.5 h-3.5" /> All Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "stats" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Stats
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "export" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "settings" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-amber-700 font-black">✕</button>
        </div>
      )}

      {/* ==================== TAB 1: INTERACTIVE TREE VIEW ==================== */}
      {activeTab === "interactive_tree" && (
        <div className="space-y-4">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-extrabold text-amber-200 uppercase tracking-wider">HERITAGE & ANCESTRY ARCHIVE</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black">{members.length} Members Recorded</span>
                  <span className="text-xs bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full font-bold border border-amber-400/30">
                    5 Generations
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 font-medium pt-1">
                  Root Person: <span className="font-extrabold text-amber-300">Alex Miller</span> • Multi-spousal & religious ceremony support
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-amber-200 block">Zoom Controls</span>
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl mt-1">
                  <button onClick={() => setTreeZoom(Math.max(0.6, treeZoom - 0.2))} className="p-1.5 hover:bg-white/20 rounded-lg cursor-pointer">
                    <ZoomOut className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-xs font-black px-2">{Math.round(treeZoom * 100)}%</span>
                  <button onClick={() => setTreeZoom(Math.min(1.8, treeZoom + 0.2))} className="p-1.5 hover:bg-white/20 rounded-lg cursor-pointer">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Gemini AI Ancestry Assistant */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-3xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Gemini AI Ancestry Insight
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                AI Guidance
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "Your paternal ancestry traces back to London, England (William Miller, b. 1908). Maternal lineage includes Irish heritage (Clara O'Connor, Dublin) and Polish roots (Evelyn Kowalski). All birth and marriage certificates are securely indexed!"
            </p>
          </div>

          {/* Tree Visualization Canvas */}
          <div className="bg-stone-50 border border-slate-200 rounded-3xl p-6 shadow-inner overflow-x-auto space-y-6">
            <div
              className="min-w-[750px] space-y-8 transition-transform origin-top"
              style={{ transform: `scale(${treeZoom})` }}
            >
              {/* Generation 1: Great Great Grandparents */}
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                  Generation 1: Great-Great-Grandparents (1900s)
                </span>
                <div className="flex justify-center gap-4 pt-2">
                  {members.filter((m) => m.id === "mem-ggfather-paternal" || m.id === "mem-ggmother-paternal").map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setShowMemberDetailModal(true);
                      }}
                      className="bg-white p-3 rounded-2xl border-2 border-stone-200 shadow-2xs hover:border-amber-500 cursor-pointer w-48 text-left space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.profilePhoto}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs">{m.firstName} {m.lastName}</h4>
                          <p className="text-[10px] text-slate-500 font-bold">b. {m.dateOfBirth?.split("-")[0]} - d. {m.dateOfDeath?.split("-")[0]}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-amber-800 font-bold bg-amber-50 p-1 rounded-lg">Born in {m.placeOfBirth}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-0.5 h-6 bg-stone-300 mx-auto"></div>

              {/* Generation 2: Grandparents */}
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                  Generation 2: Grandparents (1930s-1940s)
                </span>
                <div className="flex justify-center gap-4 pt-2">
                  {members.filter((m) => ["mem-gfather-paternal", "mem-gmother-paternal", "mem-gfather-maternal", "mem-gmother-maternal"].includes(m.id)).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setShowMemberDetailModal(true);
                      }}
                      className="bg-white p-3 rounded-2xl border-2 border-stone-200 shadow-2xs hover:border-amber-500 cursor-pointer w-48 text-left space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.profilePhoto}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs">{m.firstName} {m.lastName}</h4>
                          <p className="text-[10px] text-slate-500 font-bold">
                            {m.isAlive ? `Age: ${2026 - Number(m.dateOfBirth?.split("-")[0])}` : `d. ${m.dateOfDeath?.split("-")[0]}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-600 font-medium">{m.occupation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-0.5 h-6 bg-stone-300 mx-auto"></div>

              {/* Generation 3: Parents */}
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                  Generation 3: Parents & In-laws
                </span>
                <div className="flex justify-center gap-4 pt-2">
                  {members.filter((m) => ["mem-father", "mem-mother"].includes(m.id)).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setShowMemberDetailModal(true);
                      }}
                      className="bg-white p-3 rounded-2xl border-2 border-amber-300 shadow-2xs hover:border-amber-600 cursor-pointer w-52 text-left space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.profilePhoto}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs">{m.firstName} {m.lastName}</h4>
                          <p className="text-[10px] text-slate-500 font-bold">b. {m.dateOfBirth} • {m.occupation}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-emerald-800 font-bold bg-emerald-50 p-1 rounded-lg">Married in 1987</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-0.5 h-6 bg-amber-500 mx-auto"></div>

              {/* Generation 4: Self, Spouse & Siblings */}
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
                  Generation 4: Self, Spouse & Siblings
                </span>
                <div className="flex justify-center gap-4 pt-2">
                  {members.filter((m) => ["mem-self", "mem-spouse", "mem-sibling1"].includes(m.id)).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setShowMemberDetailModal(true);
                      }}
                      className={`p-3 rounded-2xl border-2 shadow-sm cursor-pointer w-52 text-left space-y-1 ${
                        m.isSelf ? "bg-amber-100 border-amber-600" : "bg-white border-stone-200 hover:border-amber-500"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.profilePhoto}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs">
                            {m.firstName} {m.lastName} {m.isSelf && " (Self)"}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-bold">{m.occupation}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-amber-900 font-extrabold">{m.bloodGroup} • {m.religion}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-0.5 h-6 bg-stone-300 mx-auto"></div>

              {/* Generation 5: Children */}
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
                  Generation 5: Children (Current Era)
                </span>
                <div className="flex justify-center gap-4 pt-2">
                  {members.filter((m) => ["mem-child1", "mem-child2"].includes(m.id)).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setShowMemberDetailModal(true);
                      }}
                      className="bg-white p-3 rounded-2xl border-2 border-stone-200 shadow-2xs hover:border-amber-500 cursor-pointer w-48 text-left space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.profilePhoto}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs">{m.firstName} {m.lastName}</h4>
                          <p className="text-[10px] text-slate-500 font-bold">b. {m.dateOfBirth}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-sky-800 font-bold bg-sky-50 p-1 rounded-lg">Blood: {m.bloodGroup}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: PEDIGREE VIEW ==================== */}
      {activeTab === "pedigree" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Pedigree Ancestor Tree</h2>
            <p className="text-[10px] text-slate-500 font-medium">Direct bloodline ancestors tracing back through father & mother lineages</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border space-y-3">
              <h3 className="font-black text-slate-900 text-xs">Ancestor Direct Lineage of Alex Miller</h3>

              <div className="grid md:grid-cols-2 gap-3">
                {/* Paternal Side */}
                <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Paternal Lineage (Father's Side)
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <p className="font-black text-slate-900">Father: David Arthur Miller (b. 1962)</p>
                      <p className="text-[10px] text-slate-500 font-medium">Civil Engineer • Illinois, USA</p>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <p className="font-black text-slate-900">Grandfather: Arthur Edward Miller (1935-2018)</p>
                      <p className="text-[10px] text-slate-500 font-medium">Railroad Supt. • Peoria, IL</p>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <p className="font-black text-slate-900">Great-Grandfather: William Miller (1908-1985)</p>
                      <p className="text-[10px] text-slate-500 font-medium">Blacksmith • London, England</p>
                    </div>
                  </div>
                </div>

                {/* Maternal Side */}
                <div className="bg-white p-3 rounded-xl border border-sky-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                    Maternal Lineage (Mother's Side)
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <p className="font-black text-slate-900">Mother: Eleanor Grace Vance (b. 1964)</p>
                      <p className="text-[10px] text-slate-500 font-medium">Teacher • Springfield, IL</p>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <p className="font-black text-slate-900">Grandfather: Dr. Robert Vance (b. 1939)</p>
                      <p className="text-[10px] text-slate-500 font-medium">Pediatrician • Chicago, IL</p>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <p className="font-black text-slate-900">Grandmother: Evelyn Kowalski (b. 1942)</p>
                      <p className="text-[10px] text-slate-500 font-medium">Botanist • Milwaukee, WI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: ALL MEMBERS & SEARCH ==================== */}
      {activeTab === "members_list" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Family Members Directory ({members.length})</h2>
              <p className="text-[10px] text-slate-500 font-medium">Search, filter & view comprehensive profiles for every family member</p>
            </div>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="py-2 px-3 bg-amber-600 text-white rounded-xl text-xs font-black hover:bg-amber-700 cursor-pointer"
            >
              + Add Member
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              placeholder="Search name, religion or location..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="p-2.5 border rounded-2xl font-bold bg-slate-50 col-span-1"
            />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="p-2.5 border rounded-2xl font-bold bg-slate-50"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={filterReligion}
              onChange={(e) => setFilterReligion(e.target.value)}
              className="p-2.5 border rounded-2xl font-bold bg-slate-50"
            >
              <option value="All">All Religions</option>
              <option value="Christian">Christian</option>
              <option value="Catholic Christian">Catholic Christian</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
            </select>
          </div>

          {/* Directory List */}
          <div className="space-y-2">
            {filteredMembersList.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMemberId(m.id);
                  setShowMemberDetailModal(true);
                }}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.profilePhoto}</span>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">
                      {m.prefix} {m.firstName} {m.middleName} {m.lastName} {m.isSelf && " (Self)"}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {m.gender} • {m.isAlive ? `Alive (b. ${m.dateOfBirth})` : `Deceased (d. ${m.dateOfDeath})`}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {m.occupation || "N/A"} • {m.religion || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    {m.bloodGroup || "O+"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: FAN CHART VIEW ==================== */}
      {activeTab === "fan_chart" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Fan Chart Ancestry Diagram</h2>
            <p className="text-[10px] text-slate-500 font-medium">Concentric generational ring diagram centered on root person</p>
          </div>

          <div className="bg-stone-900 text-white p-6 rounded-3xl text-center space-y-4">
            <h3 className="text-base font-black text-amber-300">Concentric Generational Radial Fan</h3>

            <div className="w-64 h-64 mx-auto rounded-full border-4 border-amber-500/50 flex items-center justify-center relative bg-stone-800 p-2">
              <div className="w-48 h-48 rounded-full border-4 border-orange-500/50 flex items-center justify-center bg-stone-700">
                <div className="w-32 h-32 rounded-full border-4 border-amber-400 flex items-center justify-center bg-amber-900/80">
                  <div className="text-center space-y-0.5">
                    <span className="text-xl block">👨‍💻</span>
                    <span className="text-xs font-black block">Alex Miller</span>
                    <span className="text-[9px] text-amber-300 font-bold">Root Person</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-bold pt-2 border-t border-stone-700">
              <div className="bg-stone-800 p-2 rounded-xl border border-stone-700">
                <span className="block font-black text-amber-400">Gen 1: Parents</span>
                <span className="text-[10px] text-stone-400">2 Members</span>
              </div>
              <div className="bg-stone-800 p-2 rounded-xl border border-stone-700">
                <span className="block font-black text-orange-400">Gen 2: Grandparents</span>
                <span className="text-[10px] text-stone-400">4 Members</span>
              </div>
              <div className="bg-stone-800 p-2 rounded-xl border border-stone-700">
                <span className="block font-black text-amber-300">Gen 3: Great Grandparents</span>
                <span className="text-[10px] text-stone-400">2 Members</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: TIMELINE VIEW ==================== */}
      {activeTab === "timeline" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Family Historical Timeline</h2>
            <p className="text-[10px] text-slate-500 font-medium">Chronological record of births, marriages, immigrations & milestones</p>
          </div>

          <div className="space-y-3 text-xs border-l-2 border-amber-400 ml-4 pl-4">
            <div className="relative space-y-1">
              <div className="w-3 h-3 rounded-full bg-amber-500 absolute -left-[23px] top-1"></div>
              <span className="font-black text-amber-900 text-xs">2024-06-10</span>
              <p className="font-bold text-slate-900">Birth of Maya Miller</p>
              <p className="text-[10px] text-slate-500 font-medium">Springfield, Illinois • Daughter of Alex & Sarah Miller</p>
            </div>

            <div className="relative space-y-1 pt-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 absolute -left-[23px] top-3"></div>
              <span className="font-black text-amber-900 text-xs">2021-03-15</span>
              <p className="font-bold text-slate-900">Birth of Leo Miller</p>
              <p className="text-[10px] text-slate-500 font-medium">Springfield, Illinois • Son of Alex & Sarah Miller</p>
            </div>

            <div className="relative space-y-1 pt-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 absolute -left-[23px] top-3"></div>
              <span className="font-black text-amber-900 text-xs">2018-10-20</span>
              <p className="font-bold text-slate-900">Holy Matrimony: Alex Miller & Sarah Jenkins</p>
              <p className="text-[10px] text-slate-500 font-medium">Christian Church Ceremony & Reception</p>
            </div>

            <div className="relative space-y-1 pt-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 absolute -left-[23px] top-3"></div>
              <span className="font-black text-amber-900 text-xs">1987-05-18</span>
              <p className="font-bold text-slate-900">Marriage of David Miller & Eleanor Vance</p>
              <p className="text-[10px] text-slate-500 font-medium">Peoria, Illinois</p>
            </div>

            <div className="relative space-y-1 pt-2">
              <div className="w-3 h-3 rounded-full bg-stone-400 absolute -left-[23px] top-3"></div>
              <span className="font-black text-slate-700 text-xs">1908-03-10</span>
              <p className="font-bold text-slate-900">Birth of William Miller (Great-Grandfather)</p>
              <p className="text-[10px] text-slate-500 font-medium">London, England</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: STATS & REPORTS ==================== */}
      {activeTab === "stats" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Family Tree Statistics & Demographics</h2>
            <p className="text-[10px] text-slate-500 font-medium">Gender ratios, lifespans, places of origin & blood groups</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-bold">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
              <span className="block font-black text-amber-950 text-base">{members.length}</span>
              <span className="text-[10px] text-amber-700 uppercase">Total Members</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
              <span className="block font-black text-emerald-950 text-base">
                {members.filter((m) => m.isAlive).length} Alive / {members.filter((m) => !m.isAlive).length} Deceased
              </span>
              <span className="text-[10px] text-emerald-700 uppercase">Vital Status</span>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl">
              <span className="block font-black text-sky-950 text-base">5</span>
              <span className="text-[10px] text-sky-700 uppercase">Generations</span>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-2xl">
              <span className="block font-black text-indigo-950 text-base">77.5 Yrs</span>
              <span className="text-[10px] text-indigo-700 uppercase">Avg Lifespan</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 7: EXPORT & GEDCOM ==================== */}
      {activeTab === "export" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Export & Import Family Tree Data</h2>
            <p className="text-[10px] text-slate-500 font-medium">Standard GEDCOM 5.5.1 genealogy formats, printable PDF books & raw CSV</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
              <h3 className="font-black text-slate-900">Export GEDCOM 5.5.1 Standard</h3>
              <p className="text-[11px] text-slate-600 font-medium">Compatible with Ancestry, FamilySearch, Gramps & MyHeritage.</p>
              <button
                onClick={() => showFeedback("Exported family_tree_archive.ged successfully!")}
                className="w-full py-2.5 bg-amber-600 text-white font-black rounded-xl cursor-pointer hover:bg-amber-700"
              >
                📥 Download GEDCOM File
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
              <h3 className="font-black text-slate-900">Export Family PDF Heritage Book</h3>
              <p className="text-[11px] text-slate-600 font-medium">Printable multi-page document with member biographies & photos.</p>
              <button
                onClick={() => showFeedback("Generated Family Heritage PDF Book!")}
                className="w-full py-2.5 bg-stone-800 text-white font-black rounded-xl cursor-pointer hover:bg-stone-900"
              >
                📄 Download Printable PDF Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 8: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Family Tree Preferences & Privacy</h2>
            <p className="text-[10px] text-slate-500 font-medium">Default views, privacy controls & birthday/anniversary notification alerts</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border">
              <div>
                <span className="font-extrabold text-slate-900 block">Birthday & Anniversary Alerts</span>
                <span className="text-[10px] text-slate-500 font-medium">Receive notifications 3 days before events</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-600 cursor-pointer" />
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border">
              <div>
                <span className="font-extrabold text-slate-900 block">Encrypted Local Backup</span>
                <span className="text-[10px] text-slate-500 font-medium">Store encrypted tree records in device storage</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-600 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 1: ADD MEMBER FORM ==================== */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-black text-slate-900">Add New Family Member</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-500 font-black cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Prefix (e.g. Dr.)"
                  value={fPrefix}
                  onChange={(e) => setFPrefix(e.target.value)}
                  className="p-2 border rounded-xl font-bold bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="First Name *"
                  value={fFirstName}
                  onChange={(e) => setFFirstName(e.target.value)}
                  className="p-2 border rounded-xl font-bold bg-slate-50 col-span-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Middle Name"
                  value={fMiddleName}
                  onChange={(e) => setFMiddleName(e.target.value)}
                  className="p-2 border rounded-xl font-bold bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={fLastName}
                  onChange={(e) => setFLastName(e.target.value)}
                  className="p-2 border rounded-xl font-bold bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={fGender}
                  onChange={(e) => setFGender(e.target.value as any)}
                  className="p-2 border rounded-xl font-bold bg-slate-50"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border">
                  <input
                    type="checkbox"
                    checked={fIsAlive}
                    onChange={(e) => setFIsAlive(e.target.checked)}
                    className="w-4 h-4 accent-amber-600"
                  />
                  <span className="font-extrabold text-slate-800">Person is Living</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block text-[10px]">Date of Birth</label>
                  <input
                    type="date"
                    value={fDob}
                    onChange={(e) => setFDob(e.target.value)}
                    className="w-full p-2 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block text-[10px]">Place of Birth</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={fPob}
                    onChange={(e) => setFPob(e.target.value)}
                    className="w-full p-2 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block text-[10px]">Relationship Type</label>
                  <select
                    value={fRelType}
                    onChange={(e) => setFRelType(e.target.value)}
                    className="w-full p-2 border rounded-xl font-bold bg-slate-50"
                  >
                    <option value="Father">Father of</option>
                    <option value="Mother">Mother of</option>
                    <option value="Spouse">Spouse of</option>
                    <option value="Child">Child of</option>
                    <option value="Sibling">Sibling of</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block text-[10px]">Related To</label>
                  <select
                    value={fRelatedTo}
                    onChange={(e) => setFRelatedTo(e.target.value)}
                    className="w-full p-2 border rounded-xl font-bold bg-slate-50"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} {m.isSelf && "(Self)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Religion (e.g. Christian, Hindu)"
                  value={fReligion}
                  onChange={(e) => setFReligion(e.target.value)}
                  className="p-2 border rounded-xl font-bold bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Gotra / Kula (If applicable)"
                  value={fGotra}
                  onChange={(e) => setFGotra(e.target.value)}
                  className="p-2 border rounded-xl font-bold bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Occupation"
                  value={fOccupation}
                  onChange={(e) => setFOccupation(e.target.value)}
                  className="p-2 border rounded-xl font-bold bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Education"
                  value={fEducation}
                  onChange={(e) => setFEducation(e.target.value)}
                  className="p-2 border rounded-xl font-bold bg-slate-50"
                />
              </div>

              <textarea
                placeholder="Short biography or notes..."
                value={fBio}
                onChange={(e) => setFBio(e.target.value)}
                className="w-full p-2.5 border rounded-2xl font-medium bg-slate-50 h-20"
              />

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddMember}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl shadow-md cursor-pointer"
                >
                  💾 Save Member
                </button>
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="py-3 px-4 bg-slate-200 text-slate-800 font-bold rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: MEMBER PROFILE DETAIL ==================== */}
      {showMemberDetailModal && activeMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeMember.profilePhoto}</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {activeMember.prefix} {activeMember.firstName} {activeMember.middleName} {activeMember.lastName}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold">
                    {activeMember.gender} • {activeMember.isAlive ? "Living" : "Deceased"}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowMemberDetailModal(false)} className="text-slate-500 font-black cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 space-y-1">
                <p className="font-extrabold text-amber-900">Personal Details:</p>
                <p className="text-slate-700 font-medium">Born: {activeMember.dateOfBirth || "N/A"} ({activeMember.placeOfBirth || "N/A"})</p>
                {!activeMember.isAlive && (
                  <p className="text-slate-700 font-medium">Died: {activeMember.dateOfDeath} ({activeMember.placeOfDeath || "N/A"})</p>
                )}
                <p className="text-slate-700 font-medium">Blood Group: <b>{activeMember.bloodGroup || "O+"}</b> • Religion: <b>{activeMember.religion}</b></p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border space-y-1">
                <p className="font-extrabold text-slate-900">Career & Education:</p>
                <p className="text-slate-700 font-medium">Occupation: {activeMember.occupation || "N/A"}</p>
                <p className="text-slate-700 font-medium">Education: {activeMember.education || "N/A"}</p>
              </div>

              {activeMember.biography && (
                <div className="bg-slate-50 p-3 rounded-2xl border space-y-1">
                  <p className="font-extrabold text-slate-900">Biography:</p>
                  <p className="text-slate-700 font-medium leading-relaxed">{activeMember.biography}</p>
                </div>
              )}

              {activeMember.documents && activeMember.documents.length > 0 && (
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900">Attached Documents:</p>
                  {activeMember.documents.map((doc) => (
                    <div key={doc.id} className="p-2 bg-stone-100 rounded-xl flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-800">📄 {doc.title} ({doc.type})</span>
                      <button onClick={() => showFeedback(`Downloading ${doc.title}...`)} className="text-amber-800 font-black hover:underline cursor-pointer">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowMemberDetailModal(false)}
                className="w-full py-2.5 bg-amber-600 text-white font-black rounded-2xl cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
