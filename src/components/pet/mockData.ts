import {
  PetProfile,
  PetOverviewMetrics,
  PetHealthRecordItem,
  PetReminderItem,
  PetMealItem,
  PetNutritionSummary,
  PetWalkSession,
  PetBathroomEntry,
  PetGroomingTask,
  PetNoteMediaItem,
  PetProductItem,
  PetCommunityTopic
} from "./types";

export const INITIAL_PET_PROFILE: PetProfile = {
  id: "pet_buddy_01",
  name: "Buddy",
  gender: "Male",
  breed: "Golden Retriever",
  ageYears: 2,
  ageMonths: 3,
  dob: "10 Feb 2023",
  weight: 28.5,
  weightUnit: "kg",
  color: "Golden",
  microchipId: "985 113 002 456 789",
  isSpayedNeutered: true,
  bloodGroup: "DEA 1.1 Positive",
  allergies: ["None"],
  dietType: "Home Cooked + Kibble",
  healthScore: 92,
  healthStatus: "Excellent",
  avatarUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
  primaryVet: "Dr. Sharma",
  vetClinic: "All Paws Veterinary Care",
  vetPhone: "+1 (555) 392-8819"
};

export const INITIAL_OVERVIEW_METRICS: PetOverviewMetrics = {
  walkMinutes: 45,
  foodMealsDone: 2,
  foodMealsTotal: 2,
  waterTimesDone: 3,
  waterTimesTotal: 4,
  bathroomTimes: 2
};

export const INITIAL_HEALTH_RECORDS: PetHealthRecordItem[] = [
  // Upcoming
  {
    id: "rec_up_1",
    title: "Rabies Vaccine",
    category: "Vaccinations",
    date: "2025-05-20",
    dueDateStr: "20 May 2025",
    isUpcoming: true,
    statusText: "In 5 Days",
    doctorName: "Dr. Sharma"
  },
  {
    id: "rec_up_2",
    title: "DHPP Booster",
    category: "Vaccinations",
    date: "2025-06-10",
    dueDateStr: "10 Jun 2025",
    isUpcoming: true,
    statusText: "In 26 Days",
    doctorName: "Dr. Sharma"
  },
  {
    id: "rec_up_3",
    title: "Bordetella Vaccine",
    category: "Vaccinations",
    date: "2025-07-25",
    dueDateStr: "25 Jul 2025",
    isUpcoming: true,
    statusText: "In 71 Days",
    doctorName: "Dr. Sharma"
  },
  {
    id: "rec_up_4",
    title: "Bi-Annual Dental & Hip Check",
    category: "Checkups",
    date: "2025-08-15",
    dueDateStr: "15 Aug 2025",
    isUpcoming: true,
    statusText: "In 92 Days",
    doctorName: "Dr. Alistair"
  },
  // Past Records
  {
    id: "rec_past_1",
    title: "DHPP Vaccine",
    category: "Vaccinations",
    date: "2024-05-10",
    dueDateStr: "10 May 2024",
    isUpcoming: false,
    statusText: "Completed",
    doctorName: "Dr. Sharma",
    photoProofUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "rec_past_2",
    title: "Rabies Vaccine",
    category: "Vaccinations",
    date: "2024-05-20",
    dueDateStr: "20 May 2024",
    isUpcoming: false,
    statusText: "Completed",
    doctorName: "Dr. Sharma",
    photoProofUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "rec_past_3",
    title: "Anti Tick Treatment",
    category: "Tests",
    date: "2024-04-15",
    dueDateStr: "15 Apr 2024",
    isUpcoming: false,
    statusText: "Completed",
    doctorName: "Dr. Sharma",
    photoProofUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=200"
  }
];

export const INITIAL_REMINDERS: PetReminderItem[] = [
  {
    id: "rem_1",
    title: "Rabies Vaccine",
    scheduleText: "20 May 2025",
    dueInText: "In 5 Days",
    enabled: true,
    categoryIcon: "💉",
    category: "Vaccination"
  },
  {
    id: "rem_2",
    title: "DHPP Booster",
    scheduleText: "10 Jun 2025",
    dueInText: "In 26 Days",
    enabled: true,
    categoryIcon: "💉",
    category: "Vaccination"
  },
  {
    id: "rem_3",
    title: "Deworming",
    scheduleText: "10 Jun 2025",
    dueInText: "In 10 Days",
    enabled: true,
    categoryIcon: "💊",
    category: "Medication"
  },
  {
    id: "rem_4",
    title: "Flea & Tick Treatment",
    scheduleText: "18 May 2025",
    dueInText: "In 3 Days",
    enabled: true,
    categoryIcon: "☀️",
    category: "Care"
  },
  {
    id: "rem_5",
    title: "Vet Check-up",
    scheduleText: "15 Jun 2025",
    dueInText: "In 31 Days",
    enabled: true,
    categoryIcon: "🩺",
    category: "Vet"
  },
  {
    id: "rem_6",
    title: "Birthday",
    scheduleText: "10 Feb 2026",
    dueInText: "In 295 Days",
    enabled: true,
    categoryIcon: "🎂",
    category: "Celebration"
  },
  {
    id: "rem_7",
    title: "Nail Trim",
    scheduleText: "Every 30 Days",
    dueInText: "Due in 12 Days",
    enabled: true,
    categoryIcon: "✂️",
    category: "Grooming"
  }
];

export const INITIAL_MEALS: PetMealItem[] = [
  {
    id: "meal_1",
    type: "Breakfast",
    time: "8:00 AM",
    description: "Kibble + Boiled Egg",
    isCompleted: true,
    calories: 380
  },
  {
    id: "meal_2",
    type: "Lunch",
    time: "1:00 PM",
    description: "Chicken + Rice + Veggies",
    isCompleted: true,
    calories: 450
  },
  {
    id: "meal_3",
    type: "Dinner",
    time: "7:00 PM",
    description: "Kibble",
    isCompleted: true,
    calories: 360
  }
];

export const INITIAL_NUTRITION_SUMMARY: PetNutritionSummary = {
  proteinPercent: 45,
  carbsPercent: 25,
  fatsPercent: 20,
  fiberPercent: 10
};

export const INITIAL_WALK: PetWalkSession = {
  id: "walk_today",
  dateStr: "14 May 2025",
  durationMinutes: 45,
  durationSeconds: 20,
  distanceKm: 2.85,
  caloriesKcal: 185,
  mood: "Good",
  notes: "Buddy loved chasing butterflies in the park and had great energy throughout.",
  routeCoordinates: [
    { lat: 37.7749, lng: -122.4194 },
    { lat: 37.7755, lng: -122.418 },
    { lat: 37.7765, lng: -122.4172 },
    { lat: 37.778, lng: -122.416 },
    { lat: 37.7795, lng: -122.4145 }
  ]
};

export const INITIAL_BATHROOM_LOGS: PetBathroomEntry[] = [
  { id: "bath_1", dateStr: "14 May 2025", type: "Poop", time: "7:30 AM", status: "Normal" },
  { id: "bath_2", dateStr: "14 May 2025", type: "Urine", time: "7:32 AM", status: "Normal" },
  { id: "bath_3", dateStr: "14 May 2025", type: "Poop", time: "1:15 PM", status: "Soft" },
  { id: "bath_4", dateStr: "14 May 2025", type: "Urine", time: "1:17 PM", status: "Normal" },
  { id: "bath_5", dateStr: "14 May 2025", type: "Poop", time: "7:05 PM", status: "Normal" },
  { id: "bath_6", dateStr: "14 May 2025", type: "Urine", time: "7:06 PM", status: "Slight Yellow" }
];

export const INITIAL_GROOMING_TASKS: PetGroomingTask[] = [
  {
    id: "groom_1",
    name: "Bath",
    frequencyText: "Every 15 Days",
    dueText: "Due in 5 Days",
    enabled: true,
    isDoneToday: false,
    icon: "🛁"
  },
  {
    id: "groom_2",
    name: "Nail Trim",
    frequencyText: "Every 30 Days",
    dueText: "Due in 12 Days",
    enabled: true,
    isDoneToday: false,
    icon: "✂️"
  },
  {
    id: "groom_3",
    name: "Ear Clean",
    frequencyText: "Every 15 Days",
    dueText: "Due in 5 Days",
    enabled: true,
    isDoneToday: false,
    icon: "👂"
  },
  {
    id: "groom_4",
    name: "Teeth Brushing",
    frequencyText: "Daily",
    dueText: "Done today",
    enabled: true,
    isDoneToday: true,
    icon: "🪥"
  },
  {
    id: "groom_5",
    name: "Fur Brushing",
    frequencyText: "3 times a week",
    dueText: "Done today",
    enabled: true,
    isDoneToday: true,
    icon: "🪮"
  }
];

export const INITIAL_NOTES_MEDIA: PetNoteMediaItem[] = [
  {
    id: "note_1",
    category: "Vet Advice",
    title: "Joint Supplement Recommendation",
    content: "Dr. Sharma suggested joint supplement with glucosamine & chondroitin.",
    dateStr: "10 May 2025",
    mediaType: "note"
  },
  {
    id: "note_2",
    category: "Allergy Note",
    title: "Chicken Feather Sensitivity",
    content: "Buddy is allergic to chicken feathers. Avoid feather-stuffed dog toys.",
    dateStr: "02 Apr 2025",
    mediaType: "note"
  },
  {
    id: "note_3",
    category: "Behavior Note",
    title: "Evening Energy Surge",
    content: "More active in the evening after 6 PM. Good time for fetch training.",
    dateStr: "20 Mar 2025",
    mediaType: "note"
  }
];

export const INITIAL_PRODUCTS: PetProductItem[] = [
  {
    id: "prod_1",
    title: "Premium Dog Food",
    subtitle: "High protein & healthy whole meats",
    category: "Food & Nutrition",
    icon: "🥫",
    description: "Grain-free formula packed with real deboned salmon, sweet potatoes, and essential amino acids for vibrant canine vitality.",
    rating: 4.9,
    price: "$48.99",
    badge: "Top Pick"
  },
  {
    id: "prod_2",
    title: "Multivitamin Chews",
    subtitle: "Daily health & immunity support",
    category: "Supplements",
    icon: "💊",
    description: "Tasty bacon-flavored chewables formulated with vitamins A, C, D3, E, and bioactive prebiotics for gut defense.",
    rating: 4.8,
    price: "$24.50"
  },
  {
    id: "prod_3",
    title: "Omega 3 Supplement",
    subtitle: "For shiny skin & silky coat",
    category: "Skin & Coat",
    icon: "🐟",
    description: "Pure wild Alaskan salmon oil providing optimal EPA & DHA fatty acids to eliminate dry flaking and joint stiffness.",
    rating: 4.9,
    price: "$29.99"
  },
  {
    id: "prod_4",
    title: "Flea & Tick Protection",
    subtitle: "Monthly waterproof spot-on protection",
    category: "Preventatives",
    icon: "🧴",
    description: "Fast-acting topical formulation killing adult fleas, ticks, flea eggs, and larvae on contact for 30 consecutive days.",
    rating: 4.7,
    price: "$39.00"
  },
  {
    id: "prod_5",
    title: "Soothing Oatmeal Shampoo",
    subtitle: "Gentle & cruelty free hypoallergenic",
    category: "Grooming & Hygiene",
    icon: "🧼",
    description: "Natural colloidal oatmeal and organic aloe vera formula designed to calm irritated skin and leave coat smelling fresh.",
    rating: 4.8,
    price: "$18.25"
  }
];

export const INITIAL_COMMUNITY_TOPICS: PetCommunityTopic[] = [
  {
    id: "comm_1",
    title: "Share a moment",
    subtitle: "Post photos, stories & ask questions",
    icon: "📸",
    memberCount: "14.2k Pet Parents",
    actionText: "Create Post",
    category: "moments"
  },
  {
    id: "comm_2",
    title: "Find Playmates",
    subtitle: "Connect with pets near your neighborhood",
    icon: "🐕",
    memberCount: "820 Local Dogs Nearby",
    actionText: "Explore Paws",
    category: "playmates"
  },
  {
    id: "comm_3",
    title: "Expert Q&A",
    subtitle: "Ask certified vets & get real-time answers",
    icon: "👩‍⚕️",
    memberCount: "45 Certified Vets Online",
    actionText: "Ask Question",
    category: "qa"
  },
  {
    id: "comm_4",
    title: "Pet Events",
    subtitle: "Weekend dog runs, adoption fairs & meetups",
    icon: "📅",
    memberCount: "6 Upcoming Events",
    actionText: "View Events",
    category: "events"
  }
];
