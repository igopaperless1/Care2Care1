import { Patient, ServiceProvider, MemoEntry, DocumentItem } from "./types";

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "pat-1",
    name: "Eleanor Vance (Grandma)",
    age: 78,
    category: "Elderly",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    waterCurrentMl: 1800,
    waterGoalMl: 2500,
    waterLogs: [
      { id: "w-1", amountMl: 250, time: "10:30 AM", timestamp: Date.now() - 7200000 },
      { id: "w-2", amountMl: 500, time: "08:45 AM", timestamp: Date.now() - 13500000 },
      { id: "w-3", amountMl: 350, time: "07:15 AM", timestamp: Date.now() - 18000000 },
      { id: "w-4", amountMl: 700, time: "Yesterday 09:00 PM", timestamp: Date.now() - 86400000 },
    ],
    medications: [
      { id: "m-1", name: "Lisopril Blood Pressure", dosage: "10mg", frequency: "Daily Morning", time: "08:00 AM", takenToday: true, purpose: "Blood pressure regulation" },
      { id: "m-2", name: "Metformin Glycemia", dosage: "500mg", frequency: "Twice daily", time: "01:00 PM", takenToday: false, purpose: "Blood sugar control" },
      { id: "m-3", name: "Calcium & Vitamin D3", dosage: "1000IU", frequency: "Daily Night", time: "08:00 PM", takenToday: false, purpose: "Bone density support" }
    ],
    vitals: [
      { id: "v-1", timestamp: Date.now(), dateStr: "Today 10:00 AM", bloodPressureSystolic: 124, bloodPressureDiastolic: 82, heartRateBpm: 71, spO2Percent: 98, temperatureF: 98.6, bloodSugarMgDl: 108 },
      { id: "v-2", timestamp: Date.now() - 86400000, dateStr: "Yesterday", bloodPressureSystolic: 128, bloodPressureDiastolic: 84, heartRateBpm: 74, spO2Percent: 97, temperatureF: 98.4, bloodSugarMgDl: 114 }
    ],
    mood: "Calm",
    sleepHours: 7.5,
    caregiverNotes: "Completed morning walk. Reminded about 1pm Metformin.",
    emergencyContact: {
      name: "Dr. Sarah Vance (Daughter)",
      phone: "+1 (555) 019-2834",
      relation: "Primary Healthcare Proxy"
    },
    lastCheckIn: "10 mins ago",
    status: "Stable"
  },
  {
    id: "pat-2",
    name: "Leo Miller (Kids Care)",
    age: 7,
    category: "Kids",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    waterCurrentMl: 1200,
    waterGoalMl: 1600,
    waterLogs: [
      { id: "w-k1", amountMl: 200, time: "11:00 AM", timestamp: Date.now() - 5000000 },
      { id: "w-k2", amountMl: 500, time: "08:00 AM", timestamp: Date.now() - 15000000 }
    ],
    medications: [
      { id: "m-k1", name: "Pediatric Multivitamin Gummies", dosage: "1 Gummy", frequency: "Daily Morning", time: "08:30 AM", takenToday: true },
      { id: "m-k2", name: "Allergy Relief Syrup", dosage: "5ml", frequency: "As needed", time: "06:00 PM", takenToday: false }
    ],
    vitals: [
      { id: "v-k1", timestamp: Date.now(), dateStr: "Today 09:00 AM", bloodPressureSystolic: 100, bloodPressureDiastolic: 65, heartRateBpm: 92, spO2Percent: 99, temperatureF: 98.2, bloodSugarMgDl: 95 }
    ],
    mood: "Great",
    sleepHours: 9.0,
    caregiverNotes: "Polished homework assignment. Hydration goal on track.",
    emergencyContact: {
      name: "Mark Miller (Father)",
      phone: "+1 (555) 438-9201",
      relation: "Parent"
    },
    lastCheckIn: "25 mins ago",
    status: "Stable"
  },
  {
    id: "pat-3",
    name: "Arthur Pendelton (Post-Op Sick)",
    age: 62,
    category: "Sick/Ill",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    waterCurrentMl: 900,
    waterGoalMl: 2200,
    waterLogs: [
      { id: "w-a1", amountMl: 300, time: "09:30 AM", timestamp: Date.now() - 9000000 }
    ],
    medications: [
      { id: "m-a1", name: "Post-Op Analgesic", dosage: "400mg", frequency: "Every 6 hrs", time: "12:00 PM", takenToday: false, purpose: "Post surgery pain management" },
      { id: "m-a2", name: "Broad Spectrum Antibiotic", dosage: "500mg", frequency: "Twice daily", time: "08:00 AM", takenToday: true }
    ],
    vitals: [
      { id: "v-a1", timestamp: Date.now(), dateStr: "Today 11:00 AM", bloodPressureSystolic: 135, bloodPressureDiastolic: 88, heartRateBpm: 84, spO2Percent: 96, temperatureF: 99.8, bloodSugarMgDl: 125 }
    ],
    mood: "Tired",
    sleepHours: 6.0,
    caregiverNotes: "Slight temperature elevation noted (99.8°F). Hydration needed.",
    emergencyContact: {
      name: "St. Jude Surgical Clinic Emergency Line",
      phone: "+1 (555) 911-0022",
      relation: "Primary Attending Physician"
    },
    lastCheckIn: "1 hour ago",
    status: "Attention Needed"
  }
];

export const INITIAL_SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: "sp-1",
    name: "Dr. Alistair Ross, MD",
    category: "Doctor",
    rating: 4.9,
    reviewsCount: 128,
    phone: "+1 (555) 321-9876",
    availableNow: true,
    location: "Metro Health Center (2.4 km)",
    hourlyRate: "$90/visit"
  },
  {
    id: "sp-2",
    name: "Elena Rostova, RN",
    category: "Nurse",
    rating: 5.0,
    reviewsCount: 94,
    phone: "+1 (555) 876-5432",
    availableNow: true,
    location: "Home Care Station (1.1 km)",
    hourlyRate: "$45/hr"
  },
  {
    id: "sp-3",
    name: "Grace Caregiving Services",
    category: "Caregiver",
    rating: 4.8,
    reviewsCount: 210,
    phone: "+1 (555) 654-3210",
    availableNow: true,
    location: "Citywide Dispatch",
    hourlyRate: "$35/hr"
  },
  {
    id: "sp-4",
    name: "Apex Master Plumber & Leak Repair",
    category: "Plumber",
    rating: 4.7,
    reviewsCount: 88,
    phone: "+1 (555) 432-1098",
    availableNow: true,
    location: "Mobile Unit (3 km)",
    hourlyRate: "$60/job"
  },
  {
    id: "sp-5",
    name: "Spark & Volt Electricians",
    category: "Electrician",
    rating: 4.9,
    reviewsCount: 156,
    phone: "+1 (555) 210-9876",
    availableNow: false,
    location: "Westside District",
    hourlyRate: "$55/hr"
  }
];

export const INITIAL_MEMO_ENTRIES: MemoEntry[] = [
  {
    id: "memo-1",
    authorName: "Aunt Sarah",
    relation: "Family",
    message: "Always remember to take time for yourself and smile! Your dedication to family care is inspiring.",
    favoriteMemory: "Family picnic at Lake Tahoe in 2004",
    favoriteSong: "You've Got a Friend - Carole King",
    sticker: "🌟",
    date: "Aug 14, 2004"
  },
  {
    id: "memo-2",
    authorName: "David Miller",
    relation: "Childhood Friend",
    message: "Keep shining brother! Care2Care keeps us all connected no matter how far we travel.",
    favoriteMemory: "Building the treehouse behind school",
    favoriteSong: "Sweet Child O' Mine",
    sticker: "🎸",
    date: "May 22, 2008"
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Grandma Medical Insurance Policy 2026",
    category: "Medical",
    fileType: "PDF",
    uploadDate: "2026-01-10",
    encrypted: true,
    contentSnippet: "Comprehensive Medicare Supplemental Plan B covering inpatient and daily caregiver visits.",
    tags: ["medical", "insurance", "medicare", "grandma", "health"]
  },
  {
    id: "doc-2",
    title: "Vaccination Record - Leo (Childcare)",
    category: "Medical",
    fileType: "PDF",
    uploadDate: "2025-09-15",
    encrypted: true,
    contentSnippet: "MMR, DTaP, Polio & Booster complete.",
    tags: ["vaccine", "pediatric", "childcare", "leo", "immunization"]
  },
  {
    id: "doc-3",
    title: "Property Deed & Farm Land Record",
    category: "Property",
    fileType: "PDF",
    uploadDate: "2024-06-20",
    encrypted: true,
    contentSnippet: "Parcel 402 North Ridge Acreage title certificate and boundary survey.",
    tags: ["deed", "property", "land", "farm", "legal", "ownership"]
  }
];

export const INITIAL_VEHICLES = [
  {
    id: "v-1",
    name: "Family SUV - Honda CR-V",
    plateNumber: "6XYZ892",
    vehicleType: "Car" as const,
    nextServiceDate: "2026-09-15",
    fuelStatus: "78% Full",
    pucExpiry: "2027-02-10",
    notes: "Tire rotation and oil change due at 45,000 km."
  },
  {
    id: "v-2",
    name: "Farm Utility Tractor - John Deere",
    plateNumber: "FARM-TRK-01",
    vehicleType: "Tractor / Farm Vehicle" as const,
    nextServiceDate: "2026-08-01",
    fuelStatus: "90% Diesel",
    pucExpiry: "Exempt",
    notes: "Hydraulic oil inspection & plow attachment check."
  }
];

export const INITIAL_FARM_RECORDS = [
  {
    id: "farm-1",
    plotName: "North Acreage Plot #1",
    cropType: "Organic Apples & Berries",
    areaAcres: 4.5,
    wateringIntervalDays: 2,
    fertilizerUsed: "Organic Bio-Compost NPK 5-5-5",
    expectedHarvestDate: "2026-10-20",
    notes: "Drip irrigation line active. Soil moisture optimal."
  },
  {
    id: "farm-2",
    plotName: "South Meadow Garden",
    cropType: "Herbal Medicine & Vegetables",
    areaAcres: 1.2,
    wateringIntervalDays: 1,
    fertilizerUsed: "Natural Worm Castings",
    expectedHarvestDate: "2026-08-30",
    notes: "Tomatoes, spinach and chamomile flowering well."
  }
];

export const INITIAL_FINANCIAL_RECORDS = [
  {
    id: "fin-1",
    title: "Caregiver Monthly Stipend & Meds",
    type: "expense" as const,
    amount: 850,
    category: "Healthcare & Caregiving",
    date: "2026-07-20",
    accountMode: "personal" as const
  },
  {
    id: "fin-2",
    title: "Farm Produce Direct Sales",
    type: "income" as const,
    amount: 1420,
    category: "Farm & Land Income",
    date: "2026-07-22",
    accountMode: "professional" as const
  },
  {
    id: "fin-3",
    title: "Vehicle Fuel & Maintenance",
    type: "expense" as const,
    amount: 120,
    category: "Transport & Logistics",
    date: "2026-07-24",
    accountMode: "personal" as const
  }
];

export const INITIAL_PETS = [
  {
    id: "pet-1",
    name: "Max",
    species: "Dog" as const,
    breed: "Golden Retriever",
    ageYears: 4,
    vaccinationStatus: "Up to Date (Rabies & DHPP)",
    lastVetVisit: "2026-05-12",
    medicationNotes: "Monthly flea & tick preventative given on 1st of each month."
  },
  {
    id: "pet-2",
    name: "Luna",
    species: "Cat" as const,
    breed: "Siamese",
    ageYears: 2,
    vaccinationStatus: "Up to Date (FVRCP)",
    lastVetVisit: "2026-03-20",
    medicationNotes: "Healthy coat, sensitive stomach diet."
  }
];

export const INITIAL_FAMILY_MEMBERS = [
  {
    id: "fam-1",
    name: "Eleanor Vance",
    relation: "Grandmother",
    age: 78,
    phone: "+1 (555) 019-2834",
    healthCategory: "Elderly" as const,
    status: "Medication Active" as const,
    notes: "Requires daily hydration log and afternoon BP check."
  },
  {
    id: "fam-2",
    name: "Leo Miller",
    relation: "Grandson",
    age: 7,
    phone: "+1 (555) 438-9201",
    healthCategory: "Kids" as const,
    status: "Healthy" as const,
    notes: "Enrolled in school soccer. Daily gummies."
  },
  {
    id: "fam-3",
    name: "Arthur Pendelton",
    relation: "Uncle",
    age: 62,
    phone: "+1 (555) 911-0022",
    healthCategory: "Sick/Ill" as const,
    status: "Care Required" as const,
    notes: "Post-op recovery. Temp check every 6 hours."
  }
];

