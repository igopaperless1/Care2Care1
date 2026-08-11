import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ShieldAlert,
  Phone,
  PhoneCall,
  MapPin,
  Users,
  UserPlus,
  AlertTriangle,
  Flame,
  Siren,
  Car,
  Heart,
  Home,
  Compass,
  FileText,
  Share2,
  History,
  Settings,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  ArrowLeft,
  ChevronRight,
  Download,
  Upload,
  Clock,
  Sparkles,
  Info,
  Send,
  MessageSquare,
  Globe,
  Radio,
  Copy,
  ExternalLink,
  Shield,
  LifeBuoy,
  Volume2,
  VolumeX,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Activity
} from "lucide-react";
import {
  Patient,
  EmergencyContact,
  SOSAlert,
  EmergencyService,
  SafetyPlan,
  EmergencyMessageTemplate,
  LocationShare
} from "../types";

// ==========================================
// SAFE UTILITIES
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
// DEFAULT / DEMO DATA
// ==========================================
const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: "ec-1",
    userId: "user-1",
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+1 (555) 234-5678",
    email: "jane.doe@example.com",
    address: "124 Maple Street, Springfield",
    priority: "primary",
    isActive: true,
    notes: "Primary contact. Has house key and medical proxy.",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10"
  },
  {
    id: "ec-2",
    userId: "user-1",
    name: "Dr. Robert Smith",
    relationship: "Primary Physician",
    phone: "+1 (555) 876-5432",
    email: "dr.smith@medicalcenter.org",
    address: "Springfield General Medical Clinic",
    priority: "secondary",
    isActive: true,
    notes: "Cardiologist & Primary Healthcare provider.",
    createdAt: "2026-01-12",
    updatedAt: "2026-01-12"
  },
  {
    id: "ec-3",
    userId: "user-1",
    name: "Michael Chen",
    relationship: "Brother / Neighbor",
    phone: "+1 (555) 345-6789",
    email: "m.chen@example.com",
    address: "128 Maple Street, Springfield",
    priority: "tertiary",
    isActive: true,
    notes: "Lives 2 doors down. Available during evenings.",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15"
  }
];

const DEFAULT_SERVICES: EmergencyService[] = [
  {
    id: "es-1",
    name: "Police Emergency Dispatch",
    type: "Police",
    phone: "100",
    alternativePhone: "911",
    address: "Central Police HQ, City Center",
    latitude: 27.7172,
    longitude: 85.324,
    distance: 1.2,
    operatingHours: "24/7",
    is24Hours: true,
    notes: "Immediate crime, security, and safety response.",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "es-2",
    name: "Ambulance & Paramedic Response",
    type: "Ambulance",
    phone: "102",
    alternativePhone: "911",
    address: "General Hospital Emergency Wing",
    latitude: 27.718,
    longitude: 85.325,
    distance: 0.8,
    operatingHours: "24/7",
    is24Hours: true,
    notes: "Cardiac & trauma equipped quick ambulance service.",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "es-3",
    name: "Fire & Rescue Brigade",
    type: "Fire",
    phone: "101",
    alternativePhone: "911",
    address: "Station 4, Fire Department",
    latitude: 27.715,
    longitude: 85.32,
    distance: 2.1,
    operatingHours: "24/7",
    is24Hours: true,
    notes: "Firefighting, hazardous spill & building extraction.",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "es-4",
    name: "Women's Safety Helpline",
    type: "Helpline",
    phone: "109",
    alternativePhone: "+1-800-799-7233",
    address: "National Protection Bureau",
    latitude: 27.72,
    longitude: 85.33,
    distance: 3.5,
    operatingHours: "24/7",
    is24Hours: true,
    notes: "Confidential domestic & personal security assistance.",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "es-5",
    name: "Child & Youth Emergency Helpline",
    type: "Helpline",
    phone: "1098",
    alternativePhone: "+1-800-422-4453",
    address: "Youth Protection Services",
    latitude: 27.71,
    longitude: 85.31,
    distance: 4.0,
    operatingHours: "24/7",
    is24Hours: true,
    notes: "Pediatric welfare, lost child, and protection assistance.",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  }
];

const DEFAULT_SAFETY_PLANS: SafetyPlan[] = [
  {
    id: "sp-1",
    userId: "user-1",
    name: "Home Medical / Cardiac Crisis Plan",
    description: "Emergency protocol if experiencing chest pain, difficulty breathing, or sudden collapse.",
    steps: [
      "Press the 🆘 SOS alert button immediately or call 102 Ambulance.",
      "Unlock front door if able so first responders can enter quickly.",
      "Sit upright in a comfortable position; loosen tight clothing around neck and waist.",
      "Take prescribed emergency aspirin or nitroglycerin if recommended by doctor.",
      "Notify primary emergency contact (Jane Doe) via automatic SOS SMS broadcast."
    ],
    emergencyContacts: ["ec-1", "ec-2"],
    emergencyMessage: "EMERGENCY: Experiencing medical distress at home. Ambulance called. Please come immediately!",
    locationDetails: "Home Address: 124 Maple Street. Key code: 4821. Front porch light is ON.",
    escapeRoutes: ["Front Main Entrance", "Back Garden Patio Gate"],
    safePlaces: ["Living Room Couch", "Front Porch"],
    importantDocuments: ["Medical Insurance Card", "Medication List (on fridge)", "Allergy Record"],
    notes: "Medical binder is located in the top drawer of the hallway cabinet.",
    isActive: true,
    createdAt: "2026-01-05",
    updatedAt: "2026-01-05"
  },
  {
    id: "sp-2",
    userId: "user-1",
    name: "Fire & Disaster Evacuation Plan",
    description: "Evacuation procedure in case of house fire, smoke, or natural disaster.",
    steps: [
      "Alert all household members loudly and activate SOS alert.",
      "Feel door handles before opening; if hot, use secondary window escape route.",
      "Crawl low under smoke towards the nearest exit.",
      "Assemble at the designated safe location: Elm Park North Gate.",
      "Call Fire Brigade 101 once outside and perform head count."
    ],
    emergencyContacts: ["ec-1", "ec-3"],
    emergencyMessage: "FIRE EMERGENCY: Evacuating house now! Meeting at Elm Park North Gate.",
    locationDetails: "124 Maple Street - Meeting point: Elm Park North Gate (100 meters north).",
    escapeRoutes: ["Front Door", "Master Bedroom Ground Window", "Kitchen Back Gate"],
    safePlaces: ["Elm Park North Gate", "Neighbor Michael's Driveway (128 Maple)"],
    importantDocuments: ["Passport & ID Folder", "Property Deed", "Emergency Cash Bag"],
    notes: "Fire extinguishers located in Kitchen pantry and Garage.",
    isActive: true,
    createdAt: "2026-01-08",
    updatedAt: "2026-01-08"
  }
];

const DEFAULT_TEMPLATES: EmergencyMessageTemplate[] = [
  {
    id: "emt-1",
    userId: "user-1",
    name: "Medical Emergency Default",
    type: "Medical Emergency 🚨",
    subject: "URGENT MEDICAL SOS ALERT",
    message: "SOS! I am having a medical emergency and need immediate assistance. Please check my GPS location and contact emergency services if I do not respond.",
    includeLocation: true,
    includeTime: true,
    isDefault: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "emt-2",
    userId: "user-1",
    name: "Personal Safety / Threat Alert",
    type: "Personal Safety 🚨",
    subject: "SAFETY ALERT - ASSISTANCE NEEDED",
    message: "URGENT: I feel unsafe or am in danger at my current location. Please check on me or notify police if you cannot reach me.",
    includeLocation: true,
    includeTime: true,
    isDefault: false,
    createdAt: "2026-01-02",
    updatedAt: "2026-01-02"
  },
  {
    id: "emt-3",
    userId: "user-1",
    name: "Accident / Vehicle Crash",
    type: "Accident 🚗",
    subject: "VEHICLE ACCIDENT ALERT",
    message: "EMERGENCY: I have been involved in a vehicle accident. Sending my live GPS coordinates. Please dispatch help!",
    includeLocation: true,
    includeTime: true,
    isDefault: false,
    createdAt: "2026-01-03",
    updatedAt: "2026-01-03"
  }
];

const DEFAULT_ALERTS: SOSAlert[] = [
  {
    id: "alt-1",
    userId: "user-1",
    type: "Medical Emergency 🚨",
    timestamp: "2026-07-20 14:32:00",
    location: "124 Maple Street, Springfield (27.7172° N, 85.3240° E)",
    latitude: 27.7172,
    longitude: 85.324,
    message: "SOS! I am having a medical emergency and need immediate assistance.",
    recipients: ["Jane Doe", "Dr. Robert Smith"],
    status: "responded",
    response: "Jane Doe acknowledged and arrived at scene. Ambulance arrived at 14:41.",
    responseTime: "2 mins",
    notes: "False alarm resolved after resting. Vitals restored to normal.",
    createdAt: "2026-07-20",
    updatedAt: "2026-07-20"
  }
];

const HELPLINES_DIRECTORY = [
  { name: "Suicide Prevention & Crisis Lifeline", code: "988 / 116 123", desc: "24/7 free, confidential emotional support and intervention.", type: "Mental Health", region: "National / Global" },
  { name: "National Domestic Violence Hotline", code: "1-800-799-7233", desc: "Confidential safety planning and crisis support for personal safety.", type: "Safety", region: "National" },
  { name: "Crisis Text Line", code: "Text HOME to 741741", desc: "24/7 mental health text response line.", type: "Text Crisis", region: "Global" },
  { name: "Poison Control Center", code: "1-800-222-1222", desc: "Immediate guidance for accidental chemical or drug ingestion.", type: "Toxicology", region: "National" },
  { name: "Disaster Distress Helpline", code: "1-800-985-5990", desc: "Support for natural disasters, fires, floods, and severe weather.", type: "Disaster", region: "National" }
];

// Country emergency presets data
const COUNTRY_PRESETS: Record<string, { id: string; countryName: string; flag: string; police: { number: string; title: string }; ambulance: { number: string; title: string }; fire: { number: string; title: string }; helpline: { number: string; title: string } }> = {
  NP: {
    id: "NP",
    countryName: "Nepal",
    flag: "🇳🇵",
    police: { number: "100", title: "Nepal Police" },
    ambulance: { number: "102", title: "Ambulance Service" },
    fire: { number: "101", title: "Fire Brigade" },
    helpline: { number: "1098", title: "Child & Women Helpline" }
  },
  IN: {
    id: "IN",
    countryName: "India",
    flag: "🇮🇳",
    police: { number: "100", title: "Police Emergency" },
    ambulance: { number: "102", title: "Ambulance" },
    fire: { number: "101", title: "Fire Service" },
    helpline: { number: "112", title: "National Emergency 112" }
  },
  US: {
    id: "US",
    countryName: "USA & Canada",
    flag: "🇺🇸 🇨🇦",
    police: { number: "911", title: "Police 911" },
    ambulance: { number: "911", title: "Ambulance 911" },
    fire: { number: "911", title: "Fire 911" },
    helpline: { number: "988", title: "Suicide & Crisis Lifeline" }
  },
  UK: {
    id: "UK",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    police: { number: "999", title: "Police 999" },
    ambulance: { number: "999", title: "NHS Ambulance 999" },
    fire: { number: "999", title: "Fire Service 999" },
    helpline: { number: "111", title: "NHS Health Advice 111" }
  },
  AU: {
    id: "AU",
    countryName: "Australia",
    flag: "🇦🇺",
    police: { number: "000", title: "Police (Triple Zero)" },
    ambulance: { number: "000", title: "Ambulance (000)" },
    fire: { number: "000", title: "Fire Rescue (000)" },
    helpline: { number: "13 11 14", title: "Lifeline Crisis Line" }
  },
  EU: {
    id: "EU",
    countryName: "European Union",
    flag: "🇪🇺",
    police: { number: "112", title: "Police 112" },
    ambulance: { number: "112", title: "Ambulance 112" },
    fire: { number: "112", title: "Fire 112" },
    helpline: { number: "116 123", title: "Mental Health Support" }
  },
  NZ: {
    id: "NZ",
    countryName: "New Zealand",
    flag: "🇳🇿",
    police: { number: "111", title: "Police 111" },
    ambulance: { number: "111", title: "St John Ambulance" },
    fire: { number: "111", title: "Fire and Emergency" },
    helpline: { number: "0800 611 116", title: "Healthline NZ" }
  },
  UAE: {
    id: "UAE",
    countryName: "United Arab Emirates",
    flag: "🇦🇪",
    police: { number: "999", title: "Police 999" },
    ambulance: { number: "998", title: "Ambulance 998" },
    fire: { number: "997", title: "Civil Defence 997" },
    helpline: { number: "996", title: "Coast Guard" }
  },
  JP: {
    id: "JP",
    countryName: "Japan",
    flag: "🇯🇵",
    police: { number: "110", title: "Police 110" },
    ambulance: { number: "119", title: "Ambulance 119" },
    fire: { number: "119", title: "Fire 119" },
    helpline: { number: "0570-000-911", title: "Japan Helpline" }
  }
};

interface SosEmergencyTrackerProps {
  patient?: Patient;
}

export const SosEmergencyTracker: React.FC<SosEmergencyTrackerProps> = ({ patient }) => {
  // NAVIGATION SCREENS:
  // "dashboard" | "alert_form" | "contacts" | "add_contact" | "edit_contact" |
  // "services" | "safety_plans" | "create_plan" | "edit_plan" | "location_share" |
  // "helplines" | "history" | "settings"
  const [screen, setScreen] = useState<string>("dashboard");

  // TOAST / NOTIFICATION
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // PERSISTENT DATA
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem("c2c_sos_contacts");
      return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  });

  const [services, setServices] = useState<EmergencyService[]>(() => {
    try {
      const saved = localStorage.getItem("c2c_sos_services");
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  const [safetyPlans, setSafetyPlans] = useState<SafetyPlan[]>(() => {
    try {
      const saved = localStorage.getItem("c2c_sos_plans");
      return saved ? JSON.parse(saved) : DEFAULT_SAFETY_PLANS;
    } catch {
      return DEFAULT_SAFETY_PLANS;
    }
  });

  const [templates, setTemplates] = useState<EmergencyMessageTemplate[]>(() => {
    try {
      const saved = localStorage.getItem("c2c_sos_templates");
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  const [alertsHistory, setAlertsHistory] = useState<SOSAlert[]>(() => {
    try {
      const saved = localStorage.getItem("c2c_sos_history");
      return saved ? JSON.parse(saved) : DEFAULT_ALERTS;
    } catch {
      return DEFAULT_ALERTS;
    }
  });

  // COUNTRY EMERGENCY CONFIGURATION STATE
  const [selectedCountryKey, setSelectedCountryKey] = useState<string>(() => {
    return localStorage.getItem("c2c_sos_country") || "NP";
  });

  // CUSTOMIZABLE COUNTRY HOTLINES
  const [countryHotlines, setCountryHotlines] = useState(() => {
    try {
      const saved = localStorage.getItem("c2c_sos_custom_hotlines");
      return saved ? JSON.parse(saved) : COUNTRY_PRESETS;
    } catch {
      return COUNTRY_PRESETS;
    }
  });

  useEffect(() => {
    localStorage.setItem("c2c_sos_country", selectedCountryKey);
  }, [selectedCountryKey]);

  useEffect(() => {
    localStorage.setItem("c2c_sos_custom_hotlines", JSON.stringify(countryHotlines));
  }, [countryHotlines]);

  const currentCountry = countryHotlines[selectedCountryKey] || COUNTRY_PRESETS.NP;

  // AUTO-DETECT GEOLOCATION & MAP COUNTRY HOTLINE
  const detectGeolocationCountry = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.");
      return;
    }

    showToast("🛰️ Detecting live GPS position & mapping regional hotlines...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let detectedKey = "US"; // Default fallback

        // Geofence / Regional bounding mapping
        if (latitude >= 26.0 && latitude <= 30.5 && longitude >= 80.0 && longitude <= 88.5) {
          detectedKey = "NP"; // Nepal
        } else if (latitude >= 6.0 && latitude <= 35.5 && longitude >= 68.0 && longitude <= 97.5) {
          detectedKey = "IN"; // India
        } else if (latitude >= 49.0 && latitude <= 61.0 && longitude >= -11.0 && longitude <= 2.0) {
          detectedKey = "UK"; // United Kingdom
        } else if (latitude >= -44.0 && latitude <= -10.0 && longitude >= 112.0 && longitude <= 154.0) {
          detectedKey = "AU"; // Australia
        } else if (latitude >= 22.0 && latitude <= 26.5 && longitude >= 51.0 && longitude <= 56.5) {
          detectedKey = "UAE"; // UAE
        } else if (latitude >= 30.0 && latitude <= 46.0 && longitude >= 128.0 && longitude <= 146.0) {
          detectedKey = "JP"; // Japan
        } else if (latitude >= 24.0 && latitude <= 50.0 && longitude >= -125.0 && longitude <= -66.0) {
          detectedKey = "US"; // USA / Canada
        } else if (latitude >= 35.0 && latitude <= 70.0 && longitude >= -10.0 && longitude <= 40.0) {
          detectedKey = "EU"; // European Union
        }

        setSelectedCountryKey(detectedKey);
        const regionObj = COUNTRY_PRESETS[detectedKey] || COUNTRY_PRESETS.US;
        showToast(`📍 GPS Auto-Mapped: ${regionObj.flag} ${regionObj.countryName} (Primary Helpline: ${regionObj.police.number})`);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        showToast("📍 Using default location hotline preset.");
      },
      { timeout: 8000 }
    );
  };

  // CALL EMERGENCY SERVICE & DISPATCH ALERT LOCATION
  const handleCallEmergency = (serviceName: string, phoneNumber: string) => {
    // 1. Trigger actual tel link call
    const cleanNum = phoneNumber.replace(/[^0-9+]/g, "");
    if (cleanNum) {
      window.location.href = `tel:${cleanNum}`;
    }

    // 2. Dispatch emergency record in history
    const newAlert: SOSAlert = {
      id: "alt-" + Date.now(),
      userId: "user-1",
      type: `Emergency Call: ${serviceName} (${phoneNumber})`,
      timestamp: new Date().toLocaleString(),
      location: `Country: ${currentCountry.countryName} • GPS: 27.7172° N, 85.3240° E`,
      latitude: 27.7172,
      longitude: 85.324,
      message: `DISPATCH ALERT: Call placed to ${serviceName} (${phoneNumber}) in ${currentCountry.countryName}. Live location and patient details broadcasted to emergency proxies.`,
      recipients: contacts.filter((c) => c.isActive).map((c) => c.name),
      status: "sent",
      response: `Dispatched call to ${phoneNumber} & sent SMS location alert.`,
      responseTime: "Immediate",
      notes: `Service: ${serviceName} (${phoneNumber})`,
      createdAt: safeDate(new Date()),
      updatedAt: safeDate(new Date())
    };

    setAlertsHistory((prev) => [newAlert, ...prev]);
    showToast(`🚨 Calling ${serviceName} (${phoneNumber}) & Broadcasting Live GPS Location to Emergency Contacts!`);
  };
  const [isLocationSharing, setIsLocationSharing] = useState<boolean>(() => {
    try {
      return localStorage.getItem("c2c_sos_loc_sharing") === "true";
    } catch {
      return false;
    }
  });
  const [locationShareDuration, setLocationShareDuration] = useState<string>("1 Hour");
  const [sharedContactIds, setSharedContactIds] = useState<string[]>(["ec-1"]);

  // SETTINGS STATE
  const [sosHoldDuration, setSosHoldDuration] = useState<number>(3); // seconds
  const [autoSendLocation, setAutoSendLocation] = useState<boolean>(true);
  const [autoSendContacts, setAutoSendContacts] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);

  // SAVE TO LOCALSTORAGE
  useEffect(() => {
    try {
      localStorage.setItem("c2c_sos_contacts", JSON.stringify(contacts));
    } catch (e) {
      console.error(e);
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem("c2c_sos_services", JSON.stringify(services));
    } catch (e) {
      console.error(e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem("c2c_sos_plans", JSON.stringify(safetyPlans));
    } catch (e) {
      console.error(e);
    }
  }, [safetyPlans]);

  useEffect(() => {
    try {
      localStorage.setItem("c2c_sos_history", JSON.stringify(alertsHistory));
    } catch (e) {
      console.error(e);
    }
  }, [alertsHistory]);

  useEffect(() => {
    try {
      localStorage.setItem("c2c_sos_loc_sharing", String(isLocationSharing));
    } catch (e) {
      console.error(e);
    }
  }, [isLocationSharing]);

  // SOS BUTTON PRESS / HOLD COUNTDOWN
  const [isHoldingSos, setIsHoldingSos] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const holdIntervalRef = useRef<any>(null);

  const startSosHold = () => {
    setIsHoldingSos(true);
    setHoldProgress(0);
    let count = 0;
    const step = 100 / (sosHoldDuration * 10); // 10 ticks per second
    holdIntervalRef.current = setInterval(() => {
      count += step;
      if (count >= 100) {
        clearInterval(holdIntervalRef.current);
        setIsHoldingSos(false);
        setHoldProgress(100);
        triggerSosAlertNow("Medical Emergency 🚨");
      } else {
        setHoldProgress(count);
      }
    }, 100);
  };

  const cancelSosHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHoldingSos(false);
    setHoldProgress(0);
  };

  // IMMEDIATE TRIGGER FUNCTION
  const triggerSosAlertNow = (type = "Medical Emergency 🚨") => {
    const newAlert: SOSAlert = {
      id: "alt-" + Date.now(),
      userId: "user-1",
      type: type,
      timestamp: new Date().toLocaleString(),
      location: "124 Maple Street, Springfield (GPS: 27.7172° N, 85.3240° E)",
      latitude: 27.7172,
      longitude: 85.324,
      message: `URGENT SOS ALERT! Type: ${type}. Immediate assistance requested. Live location shared with emergency contacts.`,
      recipients: contacts.filter((c) => c.isActive).map((c) => c.name),
      status: "sent",
      response: "Alert broadcasted to primary contacts & nearby emergency dispatches via SMS/App.",
      responseTime: "Just now",
      notes: "Auto-dispatched via Care2Care SOS engine.",
      createdAt: safeDate(new Date()),
      updatedAt: safeDate(new Date())
    };

    setAlertsHistory((prev) => [newAlert, ...prev]);
    showToast(`🚨 SOS EMERGENCY ALERT SENT! Dispatched to ${newAlert.recipients.length} contacts.`);
  };

  // FORM EDIT STATES
  // Contact Form
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [cName, setCName] = useState("");
  const [cRelation, setCRelation] = useState("Family");
  const [cPhone, setCPhone] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cAddress, setCAddress] = useState("");
  const [cPriority, setCPriority] = useState<"primary" | "secondary" | "tertiary">("primary");
  const [cNotes, setCNotes] = useState("");

  const handleOpenAddContact = () => {
    setEditingContactId(null);
    setCName("");
    setCRelation("Family");
    setCPhone("");
    setCEmail("");
    setCAddress("");
    setCPriority("primary");
    setCNotes("");
    setScreen("add_contact");
  };

  const handleOpenEditContact = (c: EmergencyContact) => {
    setEditingContactId(c.id);
    setCName(c.name);
    setCRelation(c.relationship);
    setCPhone(c.phone);
    setCEmail(c.email);
    setCAddress(c.address);
    setCPriority(c.priority);
    setCNotes(c.notes);
    setScreen("edit_contact");
  };

  const handleSaveContact = () => {
    if (!cName.trim() || !cPhone.trim()) {
      showToast("Please enter contact name and phone number!");
      return;
    }

    if (editingContactId) {
      setContacts((prev) =>
        prev.map((item) =>
          item.id === editingContactId
            ? {
                ...item,
                name: cName.trim(),
                relationship: cRelation,
                phone: cPhone.trim(),
                email: cEmail.trim(),
                address: cAddress.trim(),
                priority: cPriority,
                notes: cNotes.trim(),
                updatedAt: safeDate(new Date())
              }
            : item
        )
      );
      showToast("Emergency contact updated.");
    } else {
      const newC: EmergencyContact = {
        id: "ec-" + Date.now(),
        userId: "user-1",
        name: cName.trim(),
        relationship: cRelation,
        phone: cPhone.trim(),
        email: cEmail.trim(),
        address: cAddress.trim(),
        priority: cPriority,
        isActive: true,
        notes: cNotes.trim(),
        createdAt: safeDate(new Date()),
        updatedAt: safeDate(new Date())
      };
      setContacts((prev) => [newC, ...prev]);
      showToast("New emergency contact added!");
    }
    setScreen("contacts");
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this emergency contact?")) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      showToast("Emergency contact deleted.");
    }
  };

  // FORM EDIT SAFETY PLAN
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [spName, setSpName] = useState("");
  const [spDesc, setSpDesc] = useState("");
  const [spSteps, setSpSteps] = useState<string[]>([""]);
  const [spMessage, setSpMessage] = useState("");
  const [spLocationDetails, setSpLocationDetails] = useState("");
  const [spEscapeRoutes, setSpEscapeRoutes] = useState<string[]>([""]);
  const [spSafePlaces, setSpSafePlaces] = useState<string[]>([""]);
  const [spDocs, setSpDocs] = useState<string[]>([""]);

  const handleOpenAddPlan = () => {
    setEditingPlanId(null);
    setSpName("");
    setSpDesc("");
    setSpSteps(["Call 102 Ambulance or 100 Police immediately.", "Notify primary emergency contacts.", "Evacuate through safe exit if needed."]);
    setSpMessage("EMERGENCY ALERT: Following safety plan protocol. Assistance needed!");
    setSpLocationDetails("Home Address: 124 Maple Street. Key code: 4821.");
    setSpEscapeRoutes(["Main Door", "Back Patio Door"]);
    setSpSafePlaces(["Front Lawn", "Neighbor's Driveway"]);
    setSpDocs(["ID Cards", "Medical Records"]);
    setScreen("create_plan");
  };

  const handleSaveSafetyPlan = () => {
    if (!spName.trim()) {
      showToast("Please enter a plan name!");
      return;
    }

    const cleanSteps = spSteps.filter((s) => s.trim().length > 0);
    const cleanRoutes = spEscapeRoutes.filter((r) => r.trim().length > 0);
    const cleanPlaces = spSafePlaces.filter((p) => p.trim().length > 0);
    const cleanDocs = spDocs.filter((d) => d.trim().length > 0);

    if (editingPlanId) {
      setSafetyPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlanId
            ? {
                ...p,
                name: spName.trim(),
                description: spDesc.trim(),
                steps: cleanSteps,
                emergencyMessage: spMessage.trim(),
                locationDetails: spLocationDetails.trim(),
                escapeRoutes: cleanRoutes,
                safePlaces: cleanPlaces,
                importantDocuments: cleanDocs,
                updatedAt: safeDate(new Date())
              }
            : p
        )
      );
      showToast("Safety plan updated.");
    } else {
      const newPlan: SafetyPlan = {
        id: "sp-" + Date.now(),
        userId: "user-1",
        name: spName.trim(),
        description: spDesc.trim(),
        steps: cleanSteps,
        emergencyContacts: contacts.map((c) => c.id),
        emergencyMessage: spMessage.trim(),
        locationDetails: spLocationDetails.trim(),
        escapeRoutes: cleanRoutes,
        safePlaces: cleanPlaces,
        importantDocuments: cleanDocs,
        notes: "Created via Care2Care Safety Planner",
        isActive: true,
        createdAt: safeDate(new Date()),
        updatedAt: safeDate(new Date())
      };
      setSafetyPlans((prev) => [newPlan, ...prev]);
      showToast("New safety plan created successfully!");
    }
    setScreen("safety_plans");
  };

  // FULL SOS FORM CUSTOM ALERT STATE
  const [customFormType, setCustomFormType] = useState("Medical Emergency 🚨");
  const [customFormSeverity, setCustomFormSeverity] = useState<"low" | "medium" | "high" | "critical">("critical");
  const [customFormDesc, setCustomFormDesc] = useState("");
  const [customFormMsg, setCustomFormMsg] = useState("SOS! I need immediate help. Please check my GPS location!");
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(contacts.map((c) => c.id));

  const handleSendCustomSosForm = () => {
    const selectedRecipientNames = contacts
      .filter((c) => selectedRecipientIds.includes(c.id))
      .map((c) => c.name);

    const newAlert: SOSAlert = {
      id: "alt-" + Date.now(),
      userId: "user-1",
      type: `${customFormType} (${customFormSeverity.toUpperCase()})`,
      timestamp: new Date().toLocaleString(),
      location: "124 Maple Street, Springfield (GPS: 27.7172° N, 85.3240° E)",
      latitude: 27.7172,
      longitude: 85.324,
      message: customFormMsg + (customFormDesc ? ` Notes: ${customFormDesc}` : ""),
      recipients: selectedRecipientNames.length > 0 ? selectedRecipientNames : ["Emergency Services (100 / 102)"],
      status: "sent",
      response: "Broadcasted via GPS multi-channel dispatch.",
      responseTime: "Just now",
      notes: "Custom manual SOS submission",
      createdAt: safeDate(new Date()),
      updatedAt: safeDate(new Date())
    };

    setAlertsHistory((prev) => [newAlert, ...prev]);
    showToast(`🚨 SOS ALERT DISPATCHED TO ${newAlert.recipients.length} RECIPIENTS!`);
    setScreen("dashboard");
  };

  // EXPORT / IMPORT BACKUP JSON
  const handleExportData = () => {
    const data = {
      contacts,
      services,
      safetyPlans,
      templates,
      alertsHistory,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `care2care_sos_emergency_backup_${Date.now()}.json`;
    a.click();
    showToast("Exported complete SOS & Emergency data backup.");
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.contacts) setContacts(parsed.contacts);
        if (parsed.services) setServices(parsed.services);
        if (parsed.safetyPlans) setSafetyPlans(parsed.safetyPlans);
        if (parsed.alertsHistory) setAlertsHistory(parsed.alertsHistory);
        showToast("SOS & Emergency data restored successfully!");
      } catch {
        showToast("Error importing file. Invalid format.");
      }
    };
    reader.readAsText(file);
  };

  // SERVICE FILTER
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceCategory, setServiceCategory] = useState("All");

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchCat = serviceCategory === "All" || s.type === serviceCategory;
      const matchSearch =
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.phone.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.address.toLowerCase().includes(serviceSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [services, serviceSearch, serviceCategory]);

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-red-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-red-700 flex items-center gap-3 text-xs md:text-sm font-extrabold animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          {toastMsg}
        </div>
      )}

      {/* TOP HEADER - INTEGRATED ROUNDED CARD WITH NESTED SUBMENUS */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 pt-2">
        <header className="bg-gradient-to-r from-red-950 via-red-900 to-slate-950 text-white shadow-xl rounded-[2rem] border border-red-800/60 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-red-800/40 pb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setScreen("dashboard")}
                className="w-12 h-12 bg-red-800/80 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-red-600/50 hover:bg-red-700 cursor-pointer shrink-0"
              >
                🆘
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                  SOS & Emergency Suite
                  <span className="text-[10px] bg-red-800 text-red-100 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-red-600">
                    LIVE GPS
                  </span>
                </h1>
                <p className="text-xs text-red-200/90 font-medium">
                  One-Tap Distress Alert • Live Location Sharing • Crisis Helplines & Safety Protocols
                </p>
              </div>
            </div>
          </div>

          {/* Sub-menu bar strictly inside the rounded box */}
          <div className="bg-red-950/70 p-2 rounded-2xl border border-red-800/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setScreen("dashboard")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                screen === "dashboard"
                  ? "bg-white text-red-950 shadow-md font-extrabold"
                  : "text-red-200 hover:bg-red-900/60 hover:text-white"
              }`}
            >
              <Radio className="w-4 h-4 text-red-500" /> Dashboard
            </button>
            <button
              onClick={() => setScreen("contacts")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                screen.includes("contact")
                  ? "bg-white text-red-950 shadow-md font-extrabold"
                  : "text-red-200 hover:bg-red-900/60 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 text-amber-300" /> Contacts ({contacts.length})
            </button>
            <button
              onClick={() => setScreen("services")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                screen === "services"
                  ? "bg-white text-red-950 shadow-md font-extrabold"
                  : "text-red-200 hover:bg-red-900/60 hover:text-white"
              }`}
            >
              <Siren className="w-4 h-4 text-sky-300" /> Services
            </button>
            <button
              onClick={() => setScreen("history")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                screen === "history"
                  ? "bg-white text-red-950 shadow-md font-extrabold"
                  : "text-red-200 hover:bg-red-900/60 hover:text-white"
              }`}
            >
              <History className="w-4 h-4" /> Logs
            </button>
            <button
              onClick={() => setScreen("settings")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ml-auto ${
                screen === "settings"
                  ? "bg-white text-red-950 shadow-md font-extrabold"
                  : "text-red-200 hover:bg-red-900/60 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        </header>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* ========================================================= */}
        {/* SCREEN 1: MAIN SOS DASHBOARD                               */}
        {/* ========================================================= */}
        {screen === "dashboard" && (
          <div className="space-y-6">
            {/* ONE-TAP HUGE SOS BUTTON HERO PANEL */}
            <div className="bg-gradient-to-br from-red-950 via-slate-900 to-red-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-red-800/50 relative overflow-hidden flex flex-col items-center text-center space-y-6">
              {/* Background ambient glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-1">
                <span className="text-xs font-black tracking-widest text-red-400 uppercase bg-red-900/60 px-3 py-1 rounded-full border border-red-700/50">
                  Instant Emergency Broadcast
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Press & Hold for Emergency</h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                  Hold the button for {sosHoldDuration} seconds to send live GPS coordinates and distress SMS to all {contacts.length} emergency contacts & responders.
                </p>
              </div>

              {/* PULSING SOS BUTTON WITH RING HOLD ANIMATION */}
              <div className="relative flex items-center justify-center my-4">
                {/* Hold progress ring */}
                {isHoldingSos && (
                  <div
                    className="absolute inset-0 -m-4 rounded-full border-4 border-amber-400 animate-spin"
                    style={{ clipPath: `polygon(0 0, 100% 0, 100% ${holdProgress}%, 0 ${holdProgress}%)` }}
                  />
                )}

                <button
                  onMouseDown={startSosHold}
                  onMouseUp={cancelSosHold}
                  onTouchStart={startSosHold}
                  onTouchEnd={cancelSosHold}
                  className={`relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full font-black text-2xl sm:text-3xl tracking-wider text-white flex flex-col items-center justify-center gap-1 shadow-2xl transition-transform active:scale-95 cursor-pointer border-4 border-red-400/80 ${
                    isHoldingSos ? "bg-red-700 scale-105 shadow-red-500/50" : "bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 animate-pulse"
                  }`}
                >
                  <ShieldAlert className="w-12 h-12 sm:w-16 sm:h-16 text-amber-300 drop-shadow-md" />
                  <span>{isHoldingSos ? `${Math.ceil((100 - holdProgress) / (100 / sosHoldDuration))}s...` : "TAP / HOLD SOS"}</span>
                  <span className="text-[10px] font-bold text-red-200 tracking-normal">Hold {sosHoldDuration}s to Dispatch</span>
                </button>
              </div>

              {/* QUICK DIRECT INSTANT TRIGGER ALTERNATIVES */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => triggerSosAlertNow("Medical Emergency 🚨")}
                  className="bg-red-800/80 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-red-600/50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  🚨 Quick Medical
                </button>
                <button
                  onClick={() => triggerSosAlertNow("Police Emergency 🚓")}
                  className="bg-blue-900/80 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-blue-600/50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  🚓 Police Alert
                </button>
                <button
                  onClick={() => triggerSosAlertNow("Fire Emergency 🚒")}
                  className="bg-amber-800/80 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-amber-600/50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  🚒 Fire Alert
                </button>
                <button
                  onClick={() => setScreen("alert_form")}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-600 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  📝 Detailed SOS Form
                </button>
              </div>
            </div>

            {/* QUICK STATS & LIVE LOCATION STATUS BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => setScreen("contacts")}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-red-400 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Emergency Contacts</span>
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{contacts.length} Active</p>
                <p className="text-[11px] text-slate-500 font-medium">Primary: {contacts.filter((c) => c.priority === "primary").length}</p>
              </div>

              <div
                onClick={() => setScreen("location_share")}
                className={`p-4 rounded-2xl border shadow-xs transition-all cursor-pointer space-y-1 ${
                  isLocationSharing ? "bg-emerald-50 border-emerald-400 text-emerald-950" : "bg-white border-slate-200 hover:border-indigo-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">Live Location GPS</span>
                  <MapPin className={`w-5 h-5 ${isLocationSharing ? "text-emerald-600 animate-bounce" : "text-slate-400"}`} />
                </div>
                <p className="text-xl font-black">{isLocationSharing ? "Sharing Active 🟢" : "Disabled"}</p>
                <p className="text-[11px] font-medium">{isLocationSharing ? "Shared with contacts" : "Tap to start tracking"}</p>
              </div>

              <div
                onClick={() => setScreen("services")}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-400 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Emergency Services</span>
                  <Siren className="w-5 h-5 text-sky-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{services.length} Listed</p>
                <p className="text-[11px] text-slate-500 font-medium">Police, Ambulance, Fire</p>
              </div>

              <div
                onClick={() => setScreen("safety_plans")}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Safety Plans</span>
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{safetyPlans.length} Protocols</p>
                <p className="text-[11px] text-slate-500 font-medium">Evacuation & Medical</p>
              </div>
            </div>

            {/* EMERGENCY SERVICES QUICK DIAL GRID WITH COUNTRY SELECTOR */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-red-600" />
                  <div>
                    <h3 className="font-black text-slate-900 text-base">One-Touch Emergency Hotline Numbers</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Configured for your country or custom preferences</p>
                  </div>
                </div>

                {/* COUNTRY SELECTOR & GPS DETECT BUTTON */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={detectGeolocationCountry}
                    className="text-xs font-black text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Auto-detect country via GPS"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" /> GPS Detect
                  </button>

                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <span className="text-base">{currentCountry.flag}</span>
                    <select
                      value={selectedCountryKey}
                      onChange={(e) => {
                        setSelectedCountryKey(e.target.value);
                        showToast(`Emergency hotlines updated for ${COUNTRY_PRESETS[e.target.value]?.countryName || "Selected Country"}`);
                      }}
                      className="bg-transparent text-xs font-black text-slate-800 cursor-pointer outline-none"
                    >
                      {Object.values(COUNTRY_PRESETS).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {c.countryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setScreen("services")}
                    className="text-xs font-extrabold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    Manage Numbers
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* POLICE */}
                <button
                  type="button"
                  onClick={() => handleCallEmergency(currentCountry.police.title, currentCountry.police.number)}
                  className="p-3.5 bg-blue-50 hover:bg-blue-100 active:scale-98 rounded-2xl border border-blue-200 text-blue-950 flex flex-col items-center text-center gap-1 font-bold transition-all cursor-pointer shadow-2xs group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🚓</span>
                  <span className="text-xs uppercase font-extrabold text-blue-900">{currentCountry.police.title}</span>
                  <span className="text-lg font-black text-blue-700">{currentCountry.police.number}</span>
                  <span className="text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full font-extrabold">Call & Dispatch SOS</span>
                </button>

                {/* AMBULANCE */}
                <button
                  type="button"
                  onClick={() => handleCallEmergency(currentCountry.ambulance.title, currentCountry.ambulance.number)}
                  className="p-3.5 bg-red-50 hover:bg-red-100 active:scale-98 rounded-2xl border border-red-200 text-red-950 flex flex-col items-center text-center gap-1 font-bold transition-all cursor-pointer shadow-2xs group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🚑</span>
                  <span className="text-xs uppercase font-extrabold text-red-900">{currentCountry.ambulance.title}</span>
                  <span className="text-lg font-black text-red-700">{currentCountry.ambulance.number}</span>
                  <span className="text-[10px] bg-red-200/80 text-red-900 px-2 py-0.5 rounded-full font-extrabold">Call & Dispatch SOS</span>
                </button>

                {/* FIRE */}
                <button
                  type="button"
                  onClick={() => handleCallEmergency(currentCountry.fire.title, currentCountry.fire.number)}
                  className="p-3.5 bg-amber-50 hover:bg-amber-100 active:scale-98 rounded-2xl border border-amber-200 text-amber-950 flex flex-col items-center text-center gap-1 font-bold transition-all cursor-pointer shadow-2xs group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🚒</span>
                  <span className="text-xs uppercase font-extrabold text-amber-900">{currentCountry.fire.title}</span>
                  <span className="text-lg font-black text-amber-700">{currentCountry.fire.number}</span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-extrabold">Call & Dispatch SOS</span>
                </button>

                {/* HELPLINE */}
                <button
                  type="button"
                  onClick={() => handleCallEmergency(currentCountry.helpline.title, currentCountry.helpline.number)}
                  className="p-3.5 bg-purple-50 hover:bg-purple-100 active:scale-98 rounded-2xl border border-purple-200 text-purple-950 flex flex-col items-center text-center gap-1 font-bold transition-all cursor-pointer shadow-2xs group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">💔</span>
                  <span className="text-xs uppercase font-extrabold text-purple-900">{currentCountry.helpline.title}</span>
                  <span className="text-lg font-black text-purple-700">{currentCountry.helpline.number}</span>
                  <span className="text-[10px] bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full font-extrabold">Call & Dispatch SOS</span>
                </button>
              </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleOpenAddContact}
                className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Add Contact</p>
                  <p className="text-[10px] text-slate-500 font-medium">Assign emergency proxy</p>
                </div>
              </button>

              <button
                onClick={() => setScreen("location_share")}
                className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Share Location</p>
                  <p className="text-[10px] text-slate-500 font-medium">Live GPS broadcast</p>
                </div>
              </button>

              <button
                onClick={handleOpenAddPlan}
                className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Safety Plan</p>
                  <p className="text-[10px] text-slate-500 font-medium">Create protocols</p>
                </div>
              </button>

              <button
                onClick={() => setScreen("helplines")}
                className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-left transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Helplines</p>
                  <p className="text-[10px] text-slate-500 font-medium">Crisis & Mental Health</p>
                </div>
              </button>
            </div>

            {/* RECENT ALERTS HISTORY SUMMARY */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <History className="w-5 h-5 text-red-600" /> Recent Emergency Dispatches ({alertsHistory.length})
                </h3>
                <button
                  onClick={() => setScreen("history")}
                  className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                >
                  View All Logs ➔
                </button>
              </div>

              {alertsHistory.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">No recent emergency alerts triggered.</p>
              ) : (
                <div className="space-y-3">
                  {alertsHistory.slice(0, 3).map((alt) => (
                    <div key={alt.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-red-900 bg-red-100 px-2.5 py-0.5 rounded-md">
                          {alt.type}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{alt.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-800 font-semibold">{alt.message}</p>
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>📍 {alt.location}</span>
                        <span className="font-bold text-emerald-700">Status: {alt.status.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: FULL SOS ALERT FORM                             */}
        {/* ========================================================= */}
        {screen === "alert_form" && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScreen("dashboard")}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-red-600" /> Detailed Emergency Alert Form
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Configure customized SOS broadcast parameters</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* EMERGENCY TYPE */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Emergency Category *
                </label>
                <select
                  value={customFormType}
                  onChange={(e) => setCustomFormType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-red-500"
                >
                  <option value="Medical Emergency 🚨">🚨 Medical Emergency</option>
                  <option value="Fire Emergency 🚒">🚒 Fire Emergency</option>
                  <option value="Police Emergency 🚓">🚓 Police / Crime Emergency</option>
                  <option value="Accident 🚗">🚗 Traffic / Vehicle Accident</option>
                  <option value="Natural Disaster 🌊">🌊 Natural Disaster (Earthquake/Flood)</option>
                  <option value="Home Emergency 🏠">🏠 Home Security Intrusion</option>
                  <option value="Lost Person 📍">📍 Lost Person / Disorientation</option>
                  <option value="Mental Health Crisis 💔">💔 Mental Health / Emotional Crisis</option>
                  <option value="Personal Safety 🚨">🚨 Personal Safety Threat</option>
                </select>
              </div>

              {/* SEVERITY LEVEL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Severity Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["low", "medium", "high", "critical"] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setCustomFormSeverity(sev)}
                      className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        customFormSeverity === sev
                          ? sev === "critical"
                            ? "bg-red-700 text-white ring-2 ring-red-400"
                            : sev === "high"
                            ? "bg-amber-600 text-white ring-2 ring-amber-300"
                            : "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* MESSAGE TEMPLATES DROPDOWN */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Quick Message Template
                </label>
                <select
                  onChange={(e) => {
                    const tmpl = templates.find((t) => t.id === e.target.value);
                    if (tmpl) setCustomFormMsg(tmpl.message);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-xs bg-white"
                >
                  <option value="">-- Choose Template --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CUSTOM MESSAGE TEXTAREA */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Broadcast Message</label>
                <textarea
                  rows={3}
                  value={customFormMsg}
                  onChange={(e) => setCustomFormMsg(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* ADDITIONAL NOTES */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Additional Context / Medical Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Allergy to penicillin, front key under doormat..."
                  value={customFormDesc}
                  onChange={(e) => setCustomFormDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50"
                />
              </div>

              {/* RECIPIENTS CHECKBOXES */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Alert Recipients ({selectedRecipientIds.length} Selected)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {contacts.map((c) => (
                    <label key={c.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRecipientIds.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipientIds((prev) => [...prev, c.id]);
                          } else {
                            setSelectedRecipientIds((prev) => prev.filter((id) => id !== c.id));
                          }
                        }}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <div className="text-xs font-bold text-slate-800">
                        {c.name} ({c.relationship}) - <span className="text-slate-500">{c.phone}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScreen("dashboard")}
                  className="px-5 py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendCustomSosForm}
                  className="px-6 py-3 rounded-xl text-xs font-black bg-red-700 hover:bg-red-800 text-white flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" /> DISPATCH SOS ALERT NOW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: EMERGENCY CONTACTS LIST                         */}
        {/* ========================================================= */}
        {screen === "contacts" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-red-600" /> Emergency Contacts Directory
                </h2>
                <p className="text-xs text-slate-500 font-medium">Designated family, physicians, and trusted proxies</p>
              </div>

              <button
                onClick={handleOpenAddContact}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Emergency Contact
              </button>
            </div>

            {/* CONTACT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          c.priority === "primary"
                            ? "bg-red-100 text-red-900 border border-red-200"
                            : c.priority === "secondary"
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-blue-100 text-blue-900 border border-blue-200"
                        }`}
                      >
                        {c.priority} Proxy
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{c.relationship}</span>
                    </div>

                    <h3 className="font-black text-slate-900 text-base">{c.name}</h3>

                    <div className="space-y-1 text-xs text-slate-600 font-medium">
                      <p className="flex items-center gap-1.5 font-bold text-indigo-900">
                        <Phone className="w-3.5 h-3.5 text-indigo-600" /> {c.phone}
                      </p>
                      {c.email && <p className="truncate">📧 {c.email}</p>}
                      {c.address && <p className="truncate">📍 {c.address}</p>}
                      {c.notes && <p className="text-[11px] text-slate-500 italic pt-1">"{c.notes}"</p>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer border border-emerald-200"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Call
                      </a>
                      <a
                        href={`sms:${c.phone}`}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer border border-indigo-200"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> SMS
                      </a>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditContact(c)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: ADD / EDIT EMERGENCY CONTACT FORM               */}
        {/* ========================================================= */}
        {(screen === "add_contact" || screen === "edit_contact") && (
          <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScreen("contacts")}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-slate-900">
                  {editingContactId ? "Edit Emergency Contact" : "Add Emergency Contact"}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Relationship *</label>
                  <select
                    value={cRelation}
                    onChange={(e) => setCRelation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Priority Level *</label>
                  <select
                    value={cPriority}
                    onChange={(e) => setCPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50"
                  >
                    <option value="primary">Primary (Call First)</option>
                    <option value="secondary">Secondary</option>
                    <option value="tertiary">Tertiary</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={cEmail}
                  onChange={(e) => setCEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Home Address</label>
                <input
                  type="text"
                  placeholder="Street address..."
                  value={cAddress}
                  onChange={(e) => setCAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Has door key code..."
                  value={cNotes}
                  onChange={(e) => setCNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScreen("contacts")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveContact}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-red-700 hover:bg-red-800 text-white cursor-pointer shadow-md"
                >
                  Save Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 5: EMERGENCY SERVICES DIRECTORY                     */}
        {/* ========================================================= */}
        {screen === "services" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Siren className="w-6 h-6 text-sky-600" /> Emergency Services Directory
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Police, Ambulance, Fire, Hospitals & Crisis Responders</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                  </div>

                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="All">All Categories</option>
                    <option value="Police">Police</option>
                    <option value="Ambulance">Ambulance</option>
                    <option value="Fire">Fire Brigade</option>
                    <option value="Helpline">Helplines</option>
                  </select>
                </div>
              </div>

              {/* SERVICES LIST GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {filteredServices.map((s) => (
                  <div key={s.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-sky-900 bg-sky-100 px-2.5 py-0.5 rounded-md uppercase">
                          {s.type}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {s.operatingHours}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 text-base">{s.name}</h3>

                      <p className="text-xs text-slate-600 font-medium">📍 {s.address}</p>
                      <p className="text-[11px] text-slate-500">{s.notes}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleCallEmergency(s.name, s.phone)}
                        className="bg-red-700 hover:bg-red-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <PhoneCall className="w-4 h-4" /> Call {s.phone}
                      </button>

                      <span className="text-xs font-bold text-slate-500">~{s.distance} km away</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 6 & 7: SAFETY PLANS MANAGEMENT                    */}
        {/* ========================================================= */}
        {screen === "safety_plans" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-amber-600" /> Crisis & Safety Protocols
                </h2>
                <p className="text-xs text-slate-500 font-medium">Pre-planned instructions for medical, fire, and evacuation scenarios</p>
              </div>

              <button
                onClick={handleOpenAddPlan}
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Create Safety Plan
              </button>
            </div>

            <div className="space-y-4">
              {safetyPlans.map((plan) => (
                <div key={plan.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">{plan.name}</h3>
                      <p className="text-xs text-slate-500">{plan.description}</p>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
                      Active Protocol
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Step-By-Step Emergency Action Steps:</h4>
                    <ol className="list-decimal list-inside text-xs font-semibold text-slate-800 space-y-1 pl-1">
                      {plan.steps.map((st, idx) => (
                        <li key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs">
                      <span className="font-bold text-amber-900 block mb-1">📍 Escape Routes & Safe Assembly:</span>
                      <p className="font-semibold text-amber-950">{plan.escapeRoutes.join(" • ") || "N/A"}</p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/60 text-xs">
                      <span className="font-bold text-blue-900 block mb-1">📄 Crucial Documents to Carry:</span>
                      <p className="font-semibold text-blue-950">{plan.importantDocuments.join(" • ") || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREATE / EDIT SAFETY PLAN FORM */}
        {(screen === "create_plan" || screen === "edit_plan") && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScreen("safety_plans")}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-slate-900">Create New Safety Plan</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Plan Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Earthquake & Structural Evacuation"
                  value={spName}
                  onChange={(e) => setSpName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Short Description</label>
                <input
                  type="text"
                  placeholder="Purpose of this protocol..."
                  value={spDesc}
                  onChange={(e) => setSpDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50"
                />
              </div>

              {/* DYNAMIC STEPS LIST */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase">Action Steps</label>
                  <button
                    type="button"
                    onClick={() => setSpSteps((prev) => [...prev, ""])}
                    className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    + Add Step
                  </button>
                </div>
                {spSteps.map((stepVal, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder={`Step ${idx + 1} instruction...`}
                      value={stepVal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSpSteps((prev) => prev.map((s, i) => (i === idx ? val : s)));
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    />
                    {spSteps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSpSteps((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Location & Entry Key Details</label>
                <textarea
                  rows={2}
                  placeholder="Home key code, lockbox info, gate porch..."
                  value={spLocationDetails}
                  onChange={(e) => setSpLocationDetails(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScreen("safety_plans")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSafetyPlan}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-amber-700 hover:bg-amber-800 text-white cursor-pointer shadow-md"
                >
                  Save Protocol Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 8: LOCATION SHARING                                 */}
        {/* ========================================================= */}
        {screen === "location_share" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setScreen("dashboard")}
                    className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Compass className="w-6 h-6 text-emerald-600" /> Live GPS Location Sharing
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Broadcast real-time position with active emergency contacts</p>
                  </div>
                </div>
              </div>

              {/* LOCATION MAP SIMULATION BOX */}
              <div className="relative h-56 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center text-white">
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                <div className="relative z-10 flex flex-col items-center gap-2 text-center p-4">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center animate-ping">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-black text-emerald-300">GPS Position Locked</p>
                  <p className="text-xs font-mono text-slate-300">Lat: 27.7172° N, Long: 85.3240° E</p>
                  <p className="text-[11px] text-slate-400 font-medium">124 Maple Street, Springfield • Accuracy ~5 meters</p>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase block">Tracking Status</span>
                    <span className="text-base font-black text-slate-900">
                      {isLocationSharing ? "🟢 Live Broadcast ON" : "⚪ Tracking Off"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsLocationSharing(!isLocationSharing);
                      showToast(isLocationSharing ? "Location sharing stopped." : "Live GPS location sharing started!");
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
                      isLocationSharing ? "bg-red-700 hover:bg-red-800 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isLocationSharing ? "Stop Sharing" : "Start Live Sharing"}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Share Via Direct Channels:</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => showToast("Location link generated for WhatsApp!")}
                      className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      💬 WhatsApp
                    </button>
                    <button
                      onClick={() => showToast("SMS location broadcast prepared!")}
                      className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      📱 SMS Alert
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://care2care.app/location/live_track_82739");
                        showToast("Live GPS tracking link copied to clipboard!");
                      }}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 9: CRISIS HELPLINES DIRECTORY                      */}
        {/* ========================================================= */}
        {screen === "helplines" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <LifeBuoy className="w-6 h-6 text-purple-600" /> Crisis & Mental Health Helplines
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Free, confidential 24/7 crisis support lines</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HELPLINES_DIRECTORY.map((hl, idx) => (
                  <div key={idx} className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-purple-900 bg-purple-200 px-2.5 py-0.5 rounded-md uppercase">
                          {hl.type}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{hl.region}</span>
                      </div>

                      <h3 className="font-black text-slate-900 text-base">{hl.name}</h3>
                      <p className="text-xs text-slate-600 font-medium">{hl.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-purple-200/60 flex items-center justify-between">
                      <span className="text-sm font-black text-purple-950 font-mono">{hl.code}</span>
                      <a
                        href={`tel:${hl.code.split(" ")[0]}`}
                        className="bg-purple-900 hover:bg-purple-800 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 10: ALERT HISTORY LOGS                             */}
        {/* ========================================================= */}
        {screen === "history" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <History className="w-6 h-6 text-red-600" /> SOS Alert Dispatch History
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Audit log of all triggered emergency alerts and responses</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportData}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export Backup JSON
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Clear all alert history logs?")) {
                        setAlertsHistory([]);
                        showToast("History logs cleared.");
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>
              </div>

              {alertsHistory.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-8">No historical alert dispatches found.</p>
              ) : (
                <div className="space-y-3">
                  {alertsHistory.map((alt) => (
                    <div key={alt.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-red-900 bg-red-100 px-3 py-1 rounded-lg">
                          {alt.type}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{alt.timestamp}</span>
                      </div>

                      <p className="text-sm font-bold text-slate-900">{alt.message}</p>

                      <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-200/80">
                        <p>📍 <span className="font-bold">Location:</span> {alt.location}</p>
                        <p>👥 <span className="font-bold">Recipients:</span> {alt.recipients.join(", ")}</p>
                        <p>💬 <span className="font-bold text-emerald-700">Response Log:</span> {alt.response}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 11: SETTINGS & PREFERENCES                          */}
        {/* ========================================================= */}
        {screen === "settings" && (
          <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScreen("dashboard")}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-slate-900">SOS System Preferences</h2>
              </div>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-800">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span>SOS Button Hold Duration</span>
                <select
                  value={sosHoldDuration}
                  onChange={(e) => setSosHoldDuration(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                >
                  <option value={1}>1 Second (Instant)</option>
                  <option value={3}>3 Seconds (Standard)</option>
                  <option value={5}>5 Seconds (Safe Hold)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span>Auto-Send Live GPS Location</span>
                <input
                  type="checkbox"
                  checked={autoSendLocation}
                  onChange={(e) => setAutoSendLocation(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span>Sound Alert on Countdown</span>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button
                  onClick={handleExportData}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" /> Export Complete Backup JSON
                </button>

                <label className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-300">
                  <Upload className="w-4 h-4" /> Import Backup File
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
