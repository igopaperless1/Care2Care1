import React, { useState, useEffect, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { ProfessionalQrRenderer, QrStylePattern, QrErrorCorrectionLevel } from "./ProfessionalQrRenderer";
import {
  FileText,
  QrCode,
  Scan,
  Ticket,
  Award,
  CreditCard,
  Send,
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  Trash2,
  Eye,
  Camera,
  Upload,
  Sparkles,
  BarChart2,
  BarChart3,
  Settings,
  X,
  Printer,
  Copy,
  Info,
  Zap,
  Building2,
  User,
  Check,
  Globe,
  DollarSign,
  Calendar,
  Lock,
  PenTool,
  ShieldAlert,
  Star,
  RefreshCw,
  Gift,
  Megaphone,
  CheckSquare,
  Save,
  ShieldCheck,
  Type,
  Sliders,
  Edit3,
  Layout,
  Layers,
  RotateCw,
  MapPin,
  Map,
  Image,
  Smartphone,
  Tablet,
  Monitor
} from "lucide-react";
import { Patient } from "../types";
import { ContractManagementTracker } from "./ContractManagementTracker";
import { CameraScannerModal } from "./CameraScannerModal";

// Safe utilities
const safeStr = (val: any, fallback = ""): string => (typeof val === "string" ? val : fallback);
const safeNum = (val: any, fallback = 0): number => (typeof val === "number" && !isNaN(val) ? val : fallback);
const safeArray = <T,>(val: any): T[] => (Array.isArray(val) ? val : []);

// Data Types for IGOPaperless
export interface VirtualCardCustomField {
  id: string;
  label: string;
  value: string;
}

export interface VirtualCard {
  id: string;
  type: "visiting" | "id" | "certificate" | "bill" | "invitation" | "coupon" | "privilege" | "ticket" | "opening";
  design: "classic" | "modern" | "creative" | "elegant" | "professional";
  title: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  socialMedia: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
  };
  photoUrl: string;
  qrColor: string;
  qrBgColor: string;
  qrLogoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  createdAt: string;

  // Custom visiting card extensions
  orientation?: "horizontal" | "vertical";
  fontFamily?: "sans" | "serif" | "mono" | "display" | "cursive";
  fontSize?: "small" | "medium" | "large";
  textColor?: string;
  subtitleColor?: string;
  bodyTextColor?: string;
  customFields?: VirtualCardCustomField[];

  // Two-sided card options
  isTwoSided?: boolean;
  showQrOnFront?: boolean;
  showQrOnBack?: boolean;
  backSideTagline?: string;
  backSideNote?: string;
  backSideBgColor?: string;
  backSidePrimaryColor?: string;

  // Multi-Side Element Placement Options ("front" | "back" | "both" | "none")
  showPhotoSide?: "front" | "back" | "both" | "none";
  showQrSide?: "front" | "back" | "both" | "none";
  showDetailsSide?: "front" | "back" | "both" | "none";
  showMapSide?: "front" | "back" | "both" | "none";

  // Google Maps Location & Pin Options
  googleMapUrl?: string;
  mapImageUrl?: string;
  mapLocationName?: string;

  // Custom Background Pictures for Card Frame
  cardBgImageUrl?: string;
  backSideBgImageUrl?: string;
}

export interface OrganiserEvent {
  id: string;
  title: string;
  category: "Class Pass" | "Concert" | "Seminar" | "Workshop" | "Party" | "Sports" | "Fitness" | "General";
  venue: string;
  date: string;
  time: string;
  description: string;
  price: number;
  currency: string;
  isClassPass: boolean;
  quantityType: "limited" | "unlimited";
  totalQuantity: number;
  issuedCount: number;
  purchasedCount?: number;
  distributedCount?: number;
  organizerName: string;
  benefits: string[];
  createdAt: string;
}

export interface DigitalTicket {
  id: string;
  eventId?: string;
  eventName: string;
  eventType: "concert" | "seminar" | "webinar" | "marriage" | "meeting" | "party" | "sports" | "class_pass";
  eventDate: string;
  eventTime: string;
  location: string;
  ticketType: "single" | "group" | "vip" | "early-bird" | "class_pass";
  ticketNumber: string;
  seatNumber: string;
  price: number;
  attendeeName: string;
  attendeeContact?: string;
  organizer: string;
  qrCodeData: string;
  qrColor: string;
  isUsed: boolean;
  usedAt?: string;
  gateName?: string;
  isClassPass?: boolean;
  isTransferred?: boolean;
  transferredFrom?: string;
  status?: "purchased" | "distributed" | "transferred" | "claimed";
  distributionType?: "purchased" | "distributed" | "complimentary" | "vip_grant";
  shareCount?: number;
  lastSharedAt?: string;
  customLimit?: number;
  createdAt: string;
}

export interface CertificateItem {
  id: string;
  type: "training" | "course" | "achievement" | "reference" | "experience";
  title: string;
  recipientName: string;
  recipientEmail: string;
  issueDate: string;
  issuerName: string;
  issuerTitle: string;
  issuerOrganization: string;
  certificateNumber: string;
  description: string;
  signatureUrl?: string;
  qrCodeData: string;
  createdAt: string;
}

export interface CouponItem {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free-shipping";
  value: number;
  description: string;
  validFrom: string;
  validUntil: string;
  maxUses: number;
  usedCount: number;
  qrCodeData: string;
  isActive: boolean;
}

interface IGOPaperlessTrackerProps {
  patient?: Patient;
}

export const IGOPaperlessTracker: React.FC<IGOPaperlessTrackerProps> = ({ patient }) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "visiting_cards"
    | "id_cards"
    | "certificates"
    | "contracts"
    | "bills"
    | "invitations"
    | "coupons"
    | "privilege"
    | "qr_generator"
    | "qr_scanner"
    | "tickets"
    | "announcements"
    | "signatures"
    | "analytics"
    | "settings"
  >("dashboard");

  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. VISITING CARDS STATE
  const [cards, setCards] = useState<VirtualCard[]>(() => {
    const saved = localStorage.getItem("care2care_visiting_cards");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "vc-1",
        type: "visiting",
        design: "classic",
        title: "Executive Business Card",
        name: patient?.name || "Aarav Sharma",
        position: "Senior Care Specialist",
        company: "Care2Care Health Solutions",
        phone: "+977 9841234567",
        email: "aarav.sharma@care2care.np",
        address: "Lazimpat, Kathmandu",
        website: "www.care2care.np",
        socialMedia: {
          facebook: "facebook.com/aaravsharma",
          linkedin: "linkedin.com/in/aaravsharma",
          whatsapp: "+9779841234567"
        },
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        qrColor: "#1e293b",
        qrBgColor: "#ffffff",
        primaryColor: "#0284c7",
        secondaryColor: "#0f172a",
        createdAt: new Date().toISOString().split("T")[0],
        orientation: "horizontal",
        fontFamily: "sans",
        fontSize: "medium",
        textColor: "#ffffff",
        subtitleColor: "#38bdf8",
        bodyTextColor: "#f1f5f9",
        customFields: [
          { id: "cf-1", label: "License No.", value: "NMC-88192-NP" },
          { id: "cf-2", label: "Department", value: "Cardiology & Internal Care" }
        ],
        isTwoSided: true,
        showQrOnFront: true,
        showQrOnBack: true,
        backSideTagline: "Care2Care Network • Compassionate Excellence",
        backSideNote: "Scan QR code to save contact directly to address book.",
        backSideBgColor: "#0f172a"
      }
    ];
  });

  const [cardForm, setCardForm] = useState<VirtualCard>({
    id: "",
    type: "visiting",
    design: "classic",
    title: "My Digital Card",
    name: patient?.name || "Aarav Sharma",
    position: "Software & Health Specialist",
    company: "Care2Care Network",
    phone: "+977 9800000000",
    email: "contact@care2care.np",
    address: "Kathmandu, Nepal",
    website: "https://care2care.np",
    socialMedia: { linkedin: "linkedin.com/in/aarav", whatsapp: "+9779800000000" },
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    qrColor: "#0f172a",
    qrBgColor: "#ffffff",
    primaryColor: "#0d9488",
    secondaryColor: "#1e293b",
    createdAt: "",
    orientation: "horizontal",
    fontFamily: "sans",
    fontSize: "medium",
    textColor: "#ffffff",
    subtitleColor: "#2dd4bf",
    bodyTextColor: "#e2e8f0",
    customFields: [
      { id: "cf-1", label: "License No.", value: "NMC-88192-NP" },
      { id: "cf-2", label: "Department", value: "General Practice" }
    ],
    isTwoSided: true,
    showQrOnFront: true,
    showQrOnBack: true,
    backSideTagline: "Care2Care Network • Quality & Compassionate Care",
    backSideNote: "Scan QR to import contact details directly to your phonebook.",
    backSideBgColor: "#0f172a",

    showPhotoSide: "front",
    showQrSide: "both",
    showDetailsSide: "front",
    showMapSide: "back",
    googleMapUrl: "https://maps.google.com/?q=Lazimpat+Kathmandu",
    mapImageUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&auto=format&fit=crop&q=80",
    mapLocationName: "Care2Care HQ Clinic, Lazimpat",
    cardBgImageUrl: undefined,
    backSideBgImageUrl: undefined
  });

  const [cardActiveSide, setCardActiveSide] = useState<"front" | "back">("front");
  const [cardDeviceMode, setCardDeviceMode] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  // Side Placement Helpers
  const isPhotoVisibleOnSide = (side: "front" | "back") => {
    const mode = cardForm.showPhotoSide || "front";
    if (mode === "both") return true;
    if (mode === "none") return false;
    return mode === side;
  };

  const isQrVisibleOnSide = (side: "front" | "back") => {
    const mode = cardForm.showQrSide || (cardForm.isTwoSided ? "both" : "front");
    if (mode === "both") return true;
    if (mode === "none") return false;
    return mode === side;
  };

  const isDetailsVisibleOnSide = (side: "front" | "back") => {
    const mode = cardForm.showDetailsSide || "front";
    if (mode === "both") return true;
    if (mode === "none") return false;
    return mode === side;
  };

  const isMapVisibleOnSide = (side: "front" | "back") => {
    const mode = cardForm.showMapSide || "none";
    if (mode === "both") return true;
    if (mode === "none") return false;
    return mode === side;
  };

  // Custom Detail Fields logic
  const addCustomField = () => {
    const newField: VirtualCardCustomField = {
      id: `cf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: "Custom Detail",
      value: "Detail Info"
    };
    setCardForm((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField]
    }));
    showToast("➕ Added custom detail field!");
  };

  const updateCustomField = (id: string, key: "label" | "value", val: string) => {
    setCardForm((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).map((f) => (f.id === id ? { ...f, [key]: val } : f))
    }));
  };

  const removeCustomField = (id: string) => {
    setCardForm((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((f) => f.id !== id)
    }));
    showToast("Cleared custom field!");
  };

  const editCard = (card: VirtualCard) => {
    setCardForm({
      ...card,
      customFields: card.customFields ? [...card.customFields] : [],
      orientation: card.orientation || "horizontal",
      fontFamily: card.fontFamily || "sans",
      fontSize: card.fontSize || "medium",
      isTwoSided: card.isTwoSided || false,
      showQrOnFront: card.showQrOnFront !== undefined ? card.showQrOnFront : true,
      showQrOnBack: card.showQrOnBack !== undefined ? card.showQrOnBack : true,
      backSideTagline: card.backSideTagline || "Care2Care Network • Compassionate Quality Care",
      backSideNote: card.backSideNote || "Scan QR to save contact details directly to phonebook.",
      backSideBgColor: card.backSideBgColor || card.primaryColor || "#0f172a"
    });
    setCardActiveSide("front");
    showToast(`⚡ Loaded "${card.name}" card into Card Studio for editing!`);
  };

  const createNewBlankCard = () => {
    setCardForm({
      id: "",
      type: "visiting",
      design: "classic",
      title: "My Digital Card",
      name: patient?.name || "Aarav Sharma",
      position: "Senior Specialist",
      company: "Care2Care Network",
      phone: "+977 9800000000",
      email: "contact@care2care.np",
      address: "Kathmandu, Nepal",
      website: "https://care2care.np",
      socialMedia: { linkedin: "linkedin.com/in/aarav", whatsapp: "+9779800000000" },
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      qrColor: "#0f172a",
      qrBgColor: "#ffffff",
      primaryColor: "#0d9488",
      secondaryColor: "#1e293b",
      createdAt: "",
      orientation: "horizontal",
      fontFamily: "sans",
      fontSize: "medium",
      textColor: "#ffffff",
      subtitleColor: "#2dd4bf",
      bodyTextColor: "#e2e8f0",
      customFields: [
        { id: "cf-1", label: "License No.", value: "NMC-88192-NP" },
        { id: "cf-2", label: "Department", value: "General Medicine" }
      ],
      isTwoSided: true,
      showQrOnFront: true,
      showQrOnBack: true,
      backSideTagline: "Care2Care Network • Compassionate Quality Care",
      backSideNote: "Scan QR to save contact details directly to phonebook.",
      backSideBgColor: "#0f172a"
    });
    setCardActiveSide("front");
    showToast("✨ Started a new blank Visiting Card!");
  };

  const deleteCard = (id: string) => {
    const updated = cards.filter((c) => c.id !== id);
    setCards(updated);
    localStorage.setItem("care2care_visiting_cards", JSON.stringify(updated));
    showToast("🗑️ Visiting Card deleted!");
  };

  const downloadCardPng = async (side: "front" | "back") => {
    const ref = side === "front" ? cardFrontRef.current : cardBackRef.current;
    if (!ref) {
      showToast("Card side element not ready for capture");
      return;
    }
    try {
      showToast(`⏳ Capturing High-Res ${side.toUpperCase()} Card PNG...`);
      const canvas = await html2canvas(ref, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `${(cardForm.name || "Visiting_Card").replace(/\s+/g, "_")}_${side}.png`;
      a.href = dataUrl;
      a.click();
      showToast(`✅ Downloaded ${side.toUpperCase()} Visiting Card PNG!`);
    } catch (err) {
      console.error(err);
      showToast("Error capturing card image PNG");
    }
  };

  const saveCard = () => {
    const isEditing = Boolean(cardForm.id);
    const newCard: VirtualCard = {
      ...cardForm,
      id: cardForm.id || `vc-${Date.now()}`,
      createdAt: cardForm.createdAt || new Date().toISOString().split("T")[0]
    };
    const updated = [newCard, ...cards.filter((c) => c.id !== newCard.id)];
    setCards(updated);
    localStorage.setItem("care2care_visiting_cards", JSON.stringify(updated));
    showToast(isEditing ? "✨ Virtual Visiting Card Updated!" : "🎉 New Virtual Visiting Card Saved!");
  };

  // 2. QR CODE GENERATOR STATE & THEME PRESETS
  const [qrText, setQrText] = useState("https://care2care.np/profile/aarav");
  const [qrTitleInput, setQrTitleInput] = useState("Care2Care Official QR");
  const [qrColor, setQrColor] = useState("#0f172a");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrShape, setQrShape] = useState<QrStylePattern>("rounded");
  const [qrEyeStyle, setQrEyeStyle] = useState<"square" | "rounded" | "circle">("rounded");
  const [qrLevel, setQrLevel] = useState<QrErrorCorrectionLevel>("M");
  const [qrLogoUrl, setQrLogoUrl] = useState<string | undefined>(undefined);
  const [qrFrameBgImage, setQrFrameBgImage] = useState<string | undefined>(undefined);
  const [qrCardFrame, setQrCardFrame] = useState<"clean" | "hospital-pass" | "medical-badge" | "emergency-id" | "vip-certificate">("clean");

  // Built-in Theme Presets
  const [themePresets, setThemePresets] = useState<
    {
      id: string;
      name: string;
      patternStyle: QrStylePattern;
      eyeStyle: "square" | "rounded" | "circle";
      fgColor: string;
      bgColor: string;
      level: QrErrorCorrectionLevel;
      badgeColor: string;
    }[]
  >([
    {
      id: "preset-emerald",
      name: "Healthcare Emerald",
      patternStyle: "rounded",
      eyeStyle: "rounded",
      fgColor: "#064e3b",
      bgColor: "#ffffff",
      level: "M",
      badgeColor: "bg-emerald-600 text-white"
    },
    {
      id: "preset-indigo",
      name: "Midnight Hospital",
      patternStyle: "dots",
      eyeStyle: "circle",
      fgColor: "#1e1b4b",
      bgColor: "#f8fafc",
      level: "Q",
      badgeColor: "bg-indigo-600 text-white"
    },
    {
      id: "preset-crimson",
      name: "Emergency Red",
      patternStyle: "square",
      eyeStyle: "square",
      fgColor: "#881337",
      bgColor: "#fff1f2",
      level: "H",
      badgeColor: "bg-rose-600 text-white"
    },
    {
      id: "preset-cyber",
      name: "Dark Neon",
      patternStyle: "extra-rounded",
      eyeStyle: "circle",
      fgColor: "#10b981",
      bgColor: "#0f172a",
      level: "H",
      badgeColor: "bg-slate-900 text-emerald-400 border border-emerald-500/30"
    },
    {
      id: "preset-purple",
      name: "Classy Violet",
      patternStyle: "classy",
      eyeStyle: "rounded",
      fgColor: "#4c1d95",
      bgColor: "#faf5ff",
      level: "Q",
      badgeColor: "bg-purple-600 text-white"
    }
  ]);

  const applyThemePreset = (preset: (typeof themePresets)[0]) => {
    setQrShape(preset.patternStyle);
    setQrEyeStyle(preset.eyeStyle);
    setQrColor(preset.fgColor);
    setQrBgColor(preset.bgColor);
    setQrLevel(preset.level);
    showToast(`✨ Switched to "${preset.name}" Theme Preset!`);
  };

  const saveCurrentAsPreset = () => {
    const presetName = prompt("Enter a name for your custom QR Theme Preset:", "My Custom Theme");
    if (!presetName) return;
    const newPreset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      patternStyle: qrShape,
      eyeStyle: qrEyeStyle,
      fgColor: qrColor,
      bgColor: qrBgColor,
      level: qrLevel,
      badgeColor: "bg-teal-700 text-white"
    };
    setThemePresets([...themePresets, newPreset]);
    showToast(`🎉 Custom Preset "${presetName}" saved!`);
  };

  // Custom Photo Upload Handler for QR Center Logo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ Image file is larger than 5MB. Please choose a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const res = uploadEvent.target?.result as string;
        setQrLogoUrl(res);
        showToast("📸 Custom Photo Applied to QR Code Center!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom Frame Background Upload Handler for QR Card Frame
  const handleFrameBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ Background image is larger than 5MB. Please choose a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const res = uploadEvent.target?.result as string;
        setQrFrameBgImage(res);
        showToast("🖼️ Custom Card Frame Background Picture Applied!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Visiting Card Front BG Upload
  const handleCardFrontBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ Image file is larger than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        setCardForm((prev) => ({ ...prev, cardBgImageUrl: res }));
        showToast("🖼️ Custom Front Background Picture Applied!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Visiting Card Back BG Upload
  const handleCardBackBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ Image file is larger than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        setCardForm((prev) => ({ ...prev, backSideBgImageUrl: res }));
        showToast("🖼️ Custom Back Background Picture Applied!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Google Maps Image Upload
  const handleMapImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ Image file is larger than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        setCardForm((prev) => ({ ...prev, mapImageUrl: res }));
        showToast("🗺️ Custom Map Snapshot Image Applied!");
      };
      reader.readAsDataURL(file);
    }
  };

  // SAVED QR CODES REPOSITORY STATE
  const [savedQrList, setSavedQrList] = useState<
    {
      id: string;
      title: string;
      value: string;
      fgColor: string;
      bgColor: string;
      patternStyle: QrStylePattern;
      eyeStyle: "square" | "rounded" | "circle";
      level: QrErrorCorrectionLevel;
      createdAt: string;
    }[]
  >(() => {
    const saved = localStorage.getItem("care2care_saved_qrs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "qr-1",
        title: "Patient File PT-9042",
        value: "https://care2care.app/patient/PT-9042",
        fgColor: "#0f172a",
        bgColor: "#ffffff",
        patternStyle: "rounded",
        eyeStyle: "rounded",
        level: "M",
        createdAt: "Today"
      },
      {
        id: "qr-2",
        title: "Staff Access Key Badge",
        value: "STAFF_ACCESS_KEY:STF-88219-VERIFIED",
        fgColor: "#1e1b4b",
        bgColor: "#ffffff",
        patternStyle: "dots",
        eyeStyle: "circle",
        level: "Q",
        createdAt: "Yesterday"
      },
      {
        id: "qr-3",
        title: "Guest WiFi Access",
        value: "WIFI:S:Care2Care_Guest;T:WPA;P:Care2Care2026;;",
        fgColor: "#064e3b",
        bgColor: "#ffffff",
        patternStyle: "extra-rounded",
        eyeStyle: "rounded",
        level: "H",
        createdAt: "Active"
      }
    ];
  });

  const saveCurrentQr = (customTitle?: string) => {
    const title = customTitle || qrTitleInput || "Care2Care QR Code";
    const newQr = {
      id: `qr-${Date.now()}`,
      title,
      value: qrText,
      fgColor: qrColor,
      bgColor: qrBgColor,
      patternStyle: qrShape,
      eyeStyle: qrEyeStyle,
      level: qrLevel,
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [newQr, ...savedQrList.filter((q) => q.id !== newQr.id)];
    setSavedQrList(updated);
    localStorage.setItem("care2care_saved_qrs", JSON.stringify(updated));
    showToast(`🎉 Saved "${title}" to QR Repository!`);
  };

  // 3. QR SCANNER STATE
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // 4. DIGITAL TICKETS & ORGANISER VALIDATOR STATE
  const [ticketPortalMode, setTicketPortalMode] = useState<"organiser" | "user" | "scanner" | "analytics">("organiser");
  
  // Organiser Events List State
  const [eventsList, setEventsList] = useState<OrganiserEvent[]>(() => {
    const saved = localStorage.getItem("care2care_organiser_events");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "evt-1",
        title: "Care2Care Yoga & Wellness 10-Session Pass",
        category: "Class Pass",
        venue: "Care2Care Wellness Studio, Lazimpat",
        date: "2026-12-31",
        time: "07:00 AM",
        description: "Pre-paid class pass for 10 sessions of yoga & diaphragmatic breathing.",
        price: 0,
        currency: "NPR",
        isClassPass: true,
        quantityType: "limited",
        totalQuantity: 50,
        issuedCount: 18,
        organizerName: "Care2Care Health Foundation",
        benefits: ["Full Access to Studio", "Free Yoga Mat Usage", "Instructor Guidance"],
        createdAt: "2026-08-01"
      },
      {
        id: "evt-2",
        title: "Global Healthcare & Tech Summit 2026",
        category: "Seminar",
        venue: "Grand Hyatt Ballroom, Kathmandu",
        date: "2026-09-15",
        time: "10:00 AM",
        description: "Annual international medical innovations conference.",
        price: 2500,
        currency: "NPR",
        isClassPass: false,
        quantityType: "unlimited",
        totalQuantity: 999999,
        issuedCount: 142,
        organizerName: "Care2Care Foundation",
        benefits: ["VIP Lounge", "Conference Kit", "Buffet Lunch", "Certificate"],
        createdAt: "2026-08-05"
      }
    ];
  });

  // Modal States
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isBulkGenerateModalOpen, setIsBulkGenerateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [ticketFilterTab, setTicketFilterTab] = useState<"all" | "purchased" | "distributed" | "active" | "used" | "transferred">("all");

  // Selected event for direct distribution
  const [selectedEventForDistribute, setSelectedEventForDistribute] = useState<OrganiserEvent | null>(null);
  
  // Selected ticket for transfer or share
  const [selectedTicketForTransfer, setSelectedTicketForTransfer] = useState<DigitalTicket | null>(null);
  const [selectedTicketForShare, setSelectedTicketForShare] = useState<DigitalTicket | null>(null);

  // Bulk generate form state
  const [bulkGenerateForm, setBulkGenerateForm] = useState({
    eventId: "",
    batchCount: 5,
    recipientPrefix: "VIP Attendee",
    distributionType: "distributed" as "distributed" | "purchased",
    customLimit: 50,
    ticketType: "single" as "single" | "group" | "vip" | "class_pass",
  });

  // Distribute form state
  const [distributeForm, setDistributeForm] = useState({
    recipientName: "",
    recipientContact: "",
    seatCode: "General / Class Pass",
    note: "Pre-paid Class Pass issued by Organiser",
    issueAsClassPass: true,
    distributionType: "distributed" as "distributed" | "purchased",
    customLimit: 1
  });

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    newOwnerName: "",
    newOwnerContact: "",
    message: "Enjoy the pass!"
  });

  // New Event Form state
  const [newEventForm, setNewEventForm] = useState({
    title: "",
    category: "Class Pass" as OrganiserEvent["category"],
    venue: "",
    date: "",
    time: "09:00 AM",
    description: "",
    price: 0,
    currency: "NPR",
    isClassPass: true,
    quantityType: "limited" as "limited" | "unlimited",
    totalQuantity: 50,
    organizerName: "Care2Care Organiser",
    benefits: "Studio Access, Complimentary Drink"
  });

  const [organiserScanCode, setOrganiserScanCode] = useState("");
  const [validatorGate, setValidatorGate] = useState("Gate 1 - Main Entrance");
  const [activeValidatorStaff, setActiveValidatorStaff] = useState("Ram Sharma (Supervisor)");
  const [scanAuditLog, setScanAuditLog] = useState<
    {
      id: string;
      time: string;
      ticketNumber: string;
      attendeeName: string;
      eventName: string;
      gate: string;
      validator: string;
      status: "valid" | "already_used" | "invalid";
    }[]
  >([
    {
      id: "log-1",
      time: new Date().toLocaleTimeString(),
      ticketNumber: "VIP-9921",
      attendeeName: patient?.name || "Aarav Sharma",
      eventName: "Global Healthcare Summit 2026",
      gate: "Gate 1 - Main Entrance",
      validator: "Ram Sharma",
      status: "valid"
    }
  ]);

  const [staffScanners, setStaffScanners] = useState([
    { id: "stf-1", name: "Ram Sharma", role: "Gate Supervisor", accessPin: "9901", gate: "Gate 1 - Main Entrance", totalScans: 14 },
    { id: "stf-2", name: "Anita Gurung", role: "VIP Desk Officer", accessPin: "8821", gate: "Gate 2 - VIP Lounge", totalScans: 28 },
    { id: "stf-3", name: "Sujan Karki", role: "Hall Validator", accessPin: "7712", gate: "Gate 3 - Stage Area", totalScans: 9 }
  ]);

  const [tickets, setTickets] = useState<DigitalTicket[]>(() => {
    const saved = localStorage.getItem("care2care_digital_tickets");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "tkt-1",
        eventName: "Global Healthcare & Tech Summit 2026",
        eventType: "seminar",
        eventDate: "2026-09-15",
        eventTime: "10:00 AM",
        location: "Grand Hyatt Ballroom, Kathmandu",
        ticketType: "vip",
        ticketNumber: "VIP-9921",
        seatNumber: "A-12",
        price: 2500,
        attendeeName: patient?.name || "Aarav Sharma",
        organizer: "Care2Care Foundation",
        qrCodeData: "TICKET:VIP-9921:AARAV_SHARMA",
        qrColor: "#7c3aed",
        isUsed: false,
        createdAt: new Date().toISOString().split("T")[0]
      },
      {
        id: "tkt-2",
        eventName: "Nepal Medical Expo & Exhibition",
        eventType: "seminar",
        eventDate: "2026-10-02",
        eventTime: "11:30 AM",
        location: "Bhrikutimandap Exhibition Hall",
        ticketType: "single",
        ticketNumber: "TKT-102931",
        seatNumber: "B-45",
        price: 500,
        attendeeName: "Pooja Adhikari",
        organizer: "Nepal Health Council",
        qrCodeData: "TICKET:TKT-102931:POOJA_ADHIKARI",
        qrColor: "#059669",
        isUsed: false,
        createdAt: new Date().toISOString().split("T")[0]
      }
    ];
  });

  const [ticketForm, setTicketForm] = useState({
    eventName: "",
    eventType: "seminar" as const,
    eventDate: "",
    eventTime: "09:00 AM",
    location: "",
    ticketType: "single" as const,
    seatNumber: "General",
    price: 0,
    attendeeName: patient?.name || "Aarav Sharma",
    organizer: "Care2Care Events"
  });

  // Helper 1: Handle Creating Event / Class Pass
  const handleCreateOrganiserEvent = () => {
    if (!newEventForm.title.trim() || !newEventForm.venue.trim() || !newEventForm.date) {
      showToast("Please enter required Event Title, Venue, and Date!");
      return;
    }

    const benefitsArr = newEventForm.benefits
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const newEvt: OrganiserEvent = {
      id: `evt-${Date.now()}`,
      title: newEventForm.title,
      category: newEventForm.category,
      venue: newEventForm.venue,
      date: newEventForm.date,
      time: newEventForm.time || "09:00 AM",
      description: newEventForm.description || "Official Event / Pass",
      price: newEventForm.isClassPass ? 0 : Number(newEventForm.price || 0),
      currency: newEventForm.currency || "NPR",
      isClassPass: newEventForm.isClassPass,
      quantityType: newEventForm.quantityType,
      totalQuantity: newEventForm.quantityType === "unlimited" ? 999999 : Number(newEventForm.totalQuantity || 50),
      issuedCount: 0,
      organizerName: newEventForm.organizerName || "Care2Care Organiser",
      benefits: benefitsArr.length > 0 ? benefitsArr : ["Access Guaranteed"],
      createdAt: new Date().toISOString().split("T")[0]
    };

    const updatedEvents = [newEvt, ...eventsList];
    setEventsList(updatedEvents);
    localStorage.setItem("care2care_organiser_events", JSON.stringify(updatedEvents));
    setIsCreateEventModalOpen(false);
    showToast(`🎉 Created ${newEvt.category}: "${newEvt.title}" (${newEvt.quantityType === "unlimited" ? "Unlimited" : newEvt.totalQuantity + " Limited Passes"})`);
  };

  // Helper: Unique ID & Tamper-proof QR payload generators
  const generateUniqueTicketNumber = (prefix = "TKT"): string => {
    const timeHex = Date.now().toString(36).toUpperCase();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${timeHex}-${randNum}`;
  };

  const generateSecureQrPayload = (ticketNum: string, attendee: string, eventTitle: string): string => {
    const hash = Math.floor(100000 + Math.random() * 900000);
    return `CARE2CARE-TICKET:${ticketNum}:${attendee.trim().toUpperCase()}:${eventTitle.substring(0, 10).toUpperCase()}:SIG-${hash}`;
  };

  // Helper 2: Handle Direct Distribute Pass to Buyer / Student
  const handleDistributePassToUser = () => {
    if (!selectedEventForDistribute) {
      showToast("Please select an Event or Class Pass to distribute!");
      return;
    }
    if (!distributeForm.recipientName.trim()) {
      showToast("Please enter the recipient / buyer name!");
      return;
    }

    // Check quantity limit
    if (
      selectedEventForDistribute.quantityType === "limited" &&
      selectedEventForDistribute.issuedCount >= selectedEventForDistribute.totalQuantity
    ) {
      showToast(`⛔ Limit Reached! "${selectedEventForDistribute.title}" has exhausted its ${selectedEventForDistribute.totalQuantity} passes limit.`);
      return;
    }

    const isDist = distributeForm.distributionType === "distributed";
    const prefix = selectedEventForDistribute.category === "Class Pass" ? "CP" : "TKT";
    const tktNum = generateUniqueTicketNumber(prefix);
    const qrData = generateSecureQrPayload(tktNum, distributeForm.recipientName, selectedEventForDistribute.title);

    const newTicket: DigitalTicket = {
      id: `tkt-${Date.now()}`,
      eventId: selectedEventForDistribute.id,
      eventName: selectedEventForDistribute.title,
      eventType: selectedEventForDistribute.category === "Class Pass" ? "class_pass" : "seminar",
      eventDate: selectedEventForDistribute.date,
      eventTime: selectedEventForDistribute.time,
      location: selectedEventForDistribute.venue,
      ticketType: selectedEventForDistribute.isClassPass ? "class_pass" : "single",
      ticketNumber: tktNum,
      seatNumber: distributeForm.seatCode || "Pass #1",
      price: isDist ? 0 : selectedEventForDistribute.price,
      attendeeName: distributeForm.recipientName,
      attendeeContact: distributeForm.recipientContact,
      organizer: selectedEventForDistribute.organizerName,
      qrCodeData: qrData,
      qrColor: isDist ? "#7c3aed" : "#2E7D32",
      isUsed: false,
      isClassPass: selectedEventForDistribute.isClassPass,
      status: isDist ? "distributed" : "purchased",
      distributionType: isDist ? "distributed" : "purchased",
      shareCount: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    // Update tickets
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem("care2care_digital_tickets", JSON.stringify(updatedTickets));

    // Update event issued count
    const updatedEvents = eventsList.map((e) =>
      e.id === selectedEventForDistribute.id
        ? {
            ...e,
            issuedCount: e.issuedCount + 1,
            distributedCount: (e.distributedCount || 0) + (isDist ? 1 : 0),
            purchasedCount: (e.purchasedCount || 0) + (!isDist ? 1 : 0),
          }
        : e
    );
    setEventsList(updatedEvents);
    localStorage.setItem("care2care_organiser_events", JSON.stringify(updatedEvents));

    setIsDistributeModalOpen(false);
    setDistributeForm({
      recipientName: "",
      recipientContact: "",
      seatCode: "General / Class Pass",
      note: "Pre-paid Class Pass issued by Organiser",
      issueAsClassPass: true,
      distributionType: "distributed",
      customLimit: 1
    });
    showToast(`🎁 Issued Digital Pass #${tktNum} (${isDist ? "Distributed" : "Purchased"}) to ${distributeForm.recipientName}!`);
  };

  // Helper 3: Bulk Generate Tickets with Custom Limits & Unique IDs
  const handleBulkGenerateTickets = () => {
    const targetEvent = eventsList.find((e) => e.id === bulkGenerateForm.eventId) || selectedEventForDistribute;
    if (!targetEvent) {
      showToast("Please select an Event to generate tickets!");
      return;
    }

    const requestedCount = Number(bulkGenerateForm.batchCount || 1);
    if (requestedCount < 1) {
      showToast("Please enter a valid batch count!");
      return;
    }

    const remainingSlots = targetEvent.quantityType === "unlimited"
      ? 999999
      : Math.max(0, targetEvent.totalQuantity - targetEvent.issuedCount);

    if (targetEvent.quantityType === "limited" && requestedCount > remainingSlots) {
      showToast(`⛔ Limit Exceeded! Event "${targetEvent.title}" only has ${remainingSlots} slots remaining.`);
      return;
    }

    const generatedList: DigitalTicket[] = [];
    const nowStr = new Date().toISOString().split("T")[0];
    const isDist = bulkGenerateForm.distributionType === "distributed";

    for (let i = 0; i < requestedCount; i++) {
      const attendeeName = `${bulkGenerateForm.recipientPrefix || "Attendee"} #${i + 1}`;
      const prefix = targetEvent.isClassPass ? "CP" : "TKT";
      const tktNum = generateUniqueTicketNumber(prefix);
      const qrData = generateSecureQrPayload(tktNum, attendeeName, targetEvent.title);

      generatedList.push({
        id: `tkt-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        eventId: targetEvent.id,
        eventName: targetEvent.title,
        eventType: targetEvent.isClassPass ? "class_pass" : "seminar",
        eventDate: targetEvent.date,
        eventTime: targetEvent.time,
        location: targetEvent.venue,
        ticketType: bulkGenerateForm.ticketType,
        ticketNumber: tktNum,
        seatNumber: `Pass #${targetEvent.issuedCount + i + 1}`,
        price: isDist ? 0 : targetEvent.price,
        attendeeName,
        organizer: targetEvent.organizerName,
        qrCodeData: qrData,
        qrColor: isDist ? "#7c3aed" : "#2E7D32",
        isUsed: false,
        isClassPass: targetEvent.isClassPass,
        status: isDist ? "distributed" : "purchased",
        distributionType: isDist ? "distributed" : "purchased",
        customLimit: bulkGenerateForm.customLimit || targetEvent.totalQuantity,
        shareCount: 0,
        createdAt: nowStr,
      });
    }

    const updatedTickets = [...generatedList, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem("care2care_digital_tickets", JSON.stringify(updatedTickets));

    const updatedEvents = eventsList.map((e) =>
      e.id === targetEvent.id
        ? {
            ...e,
            issuedCount: e.issuedCount + requestedCount,
            distributedCount: (e.distributedCount || 0) + (isDist ? requestedCount : 0),
            purchasedCount: (e.purchasedCount || 0) + (!isDist ? requestedCount : 0),
          }
        : e
    );
    setEventsList(updatedEvents);
    localStorage.setItem("care2care_organiser_events", JSON.stringify(updatedEvents));

    setIsBulkGenerateModalOpen(false);
    showToast(`⚡ Batch Generated ${requestedCount} Unique Passes for "${targetEvent.title}"!`);
  };

  // Helper 4: Share Ticket Mechanism with Multi-channel Dispatch & Tracking
  const handleShareTicket = (tkt: DigitalTicket, method: "copy" | "whatsapp" | "email" | "native") => {
    const sharePayload = `🎟️ Care2Care Digital Pass:
Event: ${tkt.eventName}
Holder: ${tkt.attendeeName}
Ticket #: ${tkt.ticketNumber}
Venue: ${tkt.location}
Date/Time: ${tkt.eventDate} @ ${tkt.eventTime}
QR Verification Code: ${tkt.qrCodeData}`;

    const nowIso = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updatedTickets = tickets.map((t) =>
      t.id === tkt.id
        ? {
            ...t,
            shareCount: (t.shareCount || 0) + 1,
            lastSharedAt: nowIso,
          }
        : t
    );
    setTickets(updatedTickets);
    localStorage.setItem("care2care_digital_tickets", JSON.stringify(updatedTickets));

    if (selectedTicketForShare?.id === tkt.id) {
      setSelectedTicketForShare({
        ...selectedTicketForShare,
        shareCount: (selectedTicketForShare.shareCount || 0) + 1,
        lastSharedAt: nowIso,
      });
    }

    if (method === "copy") {
      navigator.clipboard.writeText(sharePayload);
      showToast(`📋 Copied Pass Code #${tkt.ticketNumber} to clipboard!`);
    } else if (method === "whatsapp") {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(sharePayload)}`;
      window.open(waUrl, "_blank");
      showToast(`💬 Opened WhatsApp Share for #${tkt.ticketNumber}`);
    } else if (method === "email") {
      const mailUrl = `mailto:?subject=${encodeURIComponent(`Care2Care Pass: ${tkt.eventName}`)}&body=${encodeURIComponent(sharePayload)}`;
      window.open(mailUrl, "_blank");
      showToast(`✉️ Opened Email Client for #${tkt.ticketNumber}`);
    } else if (method === "native") {
      if (navigator.share) {
        navigator.share({
          title: `Care2Care Pass: ${tkt.eventName}`,
          text: sharePayload,
        }).catch((e) => console.log("Share dismissed", e));
      } else {
        navigator.clipboard.writeText(sharePayload);
        showToast(`📋 Copied Pass Code #${tkt.ticketNumber}!`);
      }
    }
  };

  // Helper 3: Handle Transfer / Share Ticket to Friend
  const handleTransferTicket = () => {
    if (!selectedTicketForTransfer) return;
    if (!transferForm.newOwnerName.trim()) {
      showToast("Please enter recipient name!");
      return;
    }

    const updatedTickets = tickets.map((t) =>
      t.id === selectedTicketForTransfer.id
        ? {
            ...t,
            attendeeName: transferForm.newOwnerName,
            attendeeContact: transferForm.newOwnerContact || t.attendeeContact,
            isTransferred: true,
            transferredFrom: t.attendeeName,
            qrCodeData: `CARE2CARE-TICKET:${t.ticketNumber}:${transferForm.newOwnerName.toUpperCase()}`
          }
        : t
    );

    setTickets(updatedTickets);
    localStorage.setItem("care2care_digital_tickets", JSON.stringify(updatedTickets));
    setIsTransferModalOpen(false);
    setSelectedTicketForTransfer(null);
    showToast(`📲 Pass Transferred successfully to ${transferForm.newOwnerName}!`);
  };

  const createTicket = () => {
    if (!ticketForm.eventName || !ticketForm.eventDate || !ticketForm.location) {
      showToast("Please enter required event details!");
      return;
    }
    const newTicket: DigitalTicket = {
      id: `tkt-${Date.now()}`,
      eventName: ticketForm.eventName,
      eventType: ticketForm.eventType,
      eventDate: ticketForm.eventDate,
      eventTime: ticketForm.eventTime,
      location: ticketForm.location,
      ticketType: ticketForm.ticketType,
      ticketNumber: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      seatNumber: ticketForm.seatNumber,
      price: Number(ticketForm.price),
      attendeeName: ticketForm.attendeeName,
      organizer: ticketForm.organizer,
      qrCodeData: `TKT:${Date.now()}:${ticketForm.attendeeName}`,
      qrColor: "#059669",
      isUsed: false,
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    localStorage.setItem("care2care_digital_tickets", JSON.stringify(updated));
    showToast("🎉 Digital Ticket Generated!");
  };

  // Camera & Gate Scanner State
  const scannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const [scannerStream, setScannerStream] = useState<MediaStream | null>(null);
  const [isScannerActive, setIsScannerActive] = useState<boolean>(false);
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [scannerInputCode, setScannerInputCode] = useState<string>("");
  const [lastScannedResult, setLastScannedResult] = useState<{
    code: string;
    status: "valid" | "already_used" | "invalid";
    ticket?: DigitalTicket;
    scannedAt: string;
    gate: string;
    message: string;
  } | null>(null);

  const startWebcamStream = async () => {
    try {
      setCameraErrorMsg(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setScannerStream(stream);
        setIsScannerActive(true);
        if (scannerVideoRef.current) {
          scannerVideoRef.current.srcObject = stream;
          scannerVideoRef.current.play().catch((err) => console.log("Video play error:", err));
        }
      } else {
        setCameraErrorMsg("Webcam API not supported in this browser environment. Use photo upload or test code buttons.");
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraErrorMsg("Camera access denied or device has no camera. You can upload a QR image or click a sample test ticket below.");
      setIsScannerActive(false);
    }
  };

  const stopWebcamStream = () => {
    if (scannerStream) {
      scannerStream.getTracks().forEach((track) => track.stop());
      setScannerStream(null);
    }
    setIsScannerActive(false);
  };

  useEffect(() => {
    if (activeTab === "qr_scanner") {
      startWebcamStream();
    } else {
      stopWebcamStream();
    }
    return () => {
      stopWebcamStream();
    };
  }, [activeTab, cameraFacingMode]);

  const setScannerVideoRefCb = useCallback(
    (node: HTMLVideoElement | null) => {
      scannerVideoRef.current = node;
      if (node && scannerStream) {
        node.srcObject = scannerStream;
        node.play().catch((err) => console.log("Video ref play error:", err));
      }
    },
    [scannerStream]
  );

  const handleProcessScannedCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      showToast("Please enter or scan a valid ticket code!");
      return;
    }

    let cleanedCode = code;
    if (cleanedCode.includes("CARE2CARE-TICKET:")) {
      cleanedCode = cleanedCode.split("CARE2CARE-TICKET:")[1].trim();
    } else if (cleanedCode.includes("TICKET#")) {
      cleanedCode = cleanedCode.split("TICKET#")[1].trim();
    }

    const matched = tickets.find(
      (t) =>
        t.ticketNumber.toUpperCase() === cleanedCode ||
        t.id.toUpperCase() === cleanedCode ||
        t.qrCodeData.toUpperCase().includes(cleanedCode) ||
        cleanedCode.includes(t.ticketNumber.toUpperCase())
    );

    const scannedAt = new Date().toLocaleTimeString();

    if (!matched) {
      const res = {
        code: cleanedCode,
        status: "invalid" as const,
        scannedAt,
        gate: validatorGate,
        message: `❌ UNREGISTERED CODE: "${cleanedCode}" not found in Care2Care digital ticket database.`
      };
      setLastScannedResult(res);
      const newLog = {
        id: `log-${Date.now()}`,
        time: scannedAt,
        ticketNumber: cleanedCode,
        attendeeName: "Unknown",
        eventName: "N/A",
        gate: validatorGate,
        validator: activeValidatorStaff,
        status: "invalid" as const
      };
      setScanAuditLog((prev) => [newLog, ...prev]);
      showToast(`❌ Ticket code "${cleanedCode}" not found!`);
      return;
    }

    if (matched.isUsed) {
      const res = {
        code: matched.ticketNumber,
        status: "already_used" as const,
        ticket: matched,
        scannedAt,
        gate: validatorGate,
        message: `🔴 DUPLICATE ENTRY ALERT: Ticket #${matched.ticketNumber} for ${matched.attendeeName} was ALREADY checked in on ${matched.usedAt || "Earlier"} at ${(matched as any).gateName || "Gate 1"}.`
      };
      setLastScannedResult(res);
      const newLog = {
        id: `log-${Date.now()}`,
        time: scannedAt,
        ticketNumber: matched.ticketNumber,
        attendeeName: matched.attendeeName,
        eventName: matched.eventName,
        gate: validatorGate,
        validator: activeValidatorStaff,
        status: "already_used" as const
      };
      setScanAuditLog((prev) => [newLog, ...prev]);
      showToast(`⛔ REJECTED: Ticket #${matched.ticketNumber} already used!`);
      return;
    }

    // Mark as checked in
    const nowIso = new Date().toLocaleString();
    const updatedTickets = tickets.map((t) =>
      t.id === matched.id
        ? { ...t, isUsed: true, usedAt: nowIso, gateName: validatorGate }
        : t
    );
    setTickets(updatedTickets);
    localStorage.setItem("care2care_digital_tickets", JSON.stringify(updatedTickets));

    const updatedMatched = { ...matched, isUsed: true, usedAt: nowIso, gateName: validatorGate };

    const res = {
      code: matched.ticketNumber,
      status: "valid" as const,
      ticket: updatedMatched,
      scannedAt,
      gate: validatorGate,
      message: `🎉 CHECK-IN APPROVED: Welcome ${matched.attendeeName}! Ticket #${matched.ticketNumber} (${matched.ticketType} PASS) validated successfully.`
    };
    setLastScannedResult(res);

    const newLog = {
      id: `log-${Date.now()}`,
      time: scannedAt,
      ticketNumber: matched.ticketNumber,
      attendeeName: matched.attendeeName,
      eventName: matched.eventName,
      gate: validatorGate,
      validator: activeValidatorStaff,
      status: "valid" as const
    };
    setScanAuditLog((prev) => [newLog, ...prev]);
    showToast(`✅ Gate Check-In Approved for ${matched.attendeeName}!`);
  };

  const markTicketUsed = (id: string) => {
    const target = tickets.find((t) => t.id === id);
    if (target) {
      handleProcessScannedCode(target.ticketNumber);
    }
  };

  const validateTicketByCode = (codeQuery: string) => {
    handleProcessScannedCode(codeQuery);
    setOrganiserScanCode("");
  };

  // 5. CERTIFICATES STATE
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    const saved = localStorage.getItem("care2care_certificates");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "cert-1",
        type: "training",
        title: "Certified First Responder & Elderly Care Specialist",
        recipientName: patient?.name || "Aarav Sharma",
        recipientEmail: "aarav@example.com",
        issueDate: "2026-01-10",
        issuerName: "Dr. Bikash Thapa",
        issuerTitle: "Medical Director",
        issuerOrganization: "Care2Care Academy Nepal",
        certificateNumber: "C2C-CERT-2026-881",
        description: "Successfully completed 120 hours of intensive emergency care, CPR, and digital health monitoring protocols.",
        qrCodeData: "CERT:C2C-CERT-2026-881:VERIFIED",
        createdAt: "2026-01-10"
      }
    ];
  });

  const [certForm, setCertForm] = useState({
    type: "training" as const,
    title: "",
    recipientName: patient?.name || "Aarav Sharma",
    recipientEmail: "",
    issueDate: new Date().toISOString().split("T")[0],
    issuerName: "Care2Care Committee",
    issuerTitle: "Executive Chairman",
    issuerOrganization: "Care2Care Global Institute",
    description: ""
  });

  const createCertificate = () => {
    if (!certForm.title || !certForm.recipientName) {
      showToast("Please enter Title and Recipient Name!");
      return;
    }
    const certNum = `C2C-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCert: CertificateItem = {
      id: `cert-${Date.now()}`,
      type: certForm.type,
      title: certForm.title,
      recipientName: certForm.recipientName,
      recipientEmail: certForm.recipientEmail,
      issueDate: certForm.issueDate,
      issuerName: certForm.issuerName,
      issuerTitle: certForm.issuerTitle,
      issuerOrganization: certForm.issuerOrganization,
      certificateNumber: certNum,
      description: certForm.description,
      qrCodeData: `VERIFY:${certNum}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = [newCert, ...certificates];
    setCertificates(updated);
    localStorage.setItem("care2care_certificates", JSON.stringify(updated));
    showToast("🎓 Certificate Issued Successfully!");
  };

  // 6. COUPONS STATE (WITH 5 SAMPLES & CUSTOM CREATOR)
  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    const saved = localStorage.getItem("care2care_coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "cpn-1",
        code: "PRIVILEGE-VIP",
        type: "percentage",
        value: 30,
        description: "👑 Executive Privilege Card: 30% off all consultations & priority hospital booking.",
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
        maxUses: 1, // Single use privilege card
        usedCount: 0,
        qrCodeData: "COUPON:PRIVILEGE-VIP",
        isActive: true
      },
      {
        id: "cpn-2",
        code: "DISCOUNT20",
        type: "percentage",
        value: 20,
        description: "🏷️ 20% Discount Card for lab diagnostics and medicine delivery.",
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
        maxUses: 100,
        usedCount: 14,
        qrCodeData: "COUPON:DISCOUNT20",
        isActive: true
      },
      {
        id: "cpn-3",
        code: "FREE-CHECKUP-1X",
        type: "fixed",
        value: 100,
        description: "🎁 1-Time Free Medical Health Checkup Coupon (Single Use Only).",
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
        maxUses: 1,
        usedCount: 0,
        qrCodeData: "COUPON:FREE-CHECKUP-1X",
        isActive: true
      },
      {
        id: "cpn-4",
        code: "VIP-PASS-2026",
        type: "percentage",
        value: 50,
        description: "🌟 VIP Wellness Club Pass: 50% off Yoga & Physiotherapy sessions.",
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
        maxUses: 5,
        usedCount: 2,
        qrCodeData: "COUPON:VIP-PASS-2026",
        isActive: true
      },
      {
        id: "cpn-5",
        code: "CASHBACK-500",
        type: "fixed",
        value: 500,
        description: "💰 Rs. 500 Cashback Voucher on monthly elderly care subscription.",
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
        maxUses: 0, // Unlimited
        usedCount: 88,
        qrCodeData: "COUPON:CASHBACK-500",
        isActive: true
      }
    ];
  });

  const [couponCode, setCouponCode] = useState("");
  const [couponVal, setCouponVal] = useState(15);
  const [couponDesc, setCouponDesc] = useState("");
  const [couponLimit, setCouponLimit] = useState<number>(1); // 1 = 1-time, 0 = unlimited

  const createCoupon = () => {
    if (!couponCode) {
      showToast("Please specify Coupon Code!");
      return;
    }
    const newCpn: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: couponCode.toUpperCase(),
      type: "percentage",
      value: Number(couponVal),
      description: couponDesc || "Care2Care Privilege Discount Card",
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: "2026-12-31",
      maxUses: Number(couponLimit),
      usedCount: 0,
      qrCodeData: `COUPON:${couponCode.toUpperCase()}`,
      isActive: true
    };
    const updated = [newCpn, ...coupons];
    setCoupons(updated);
    localStorage.setItem("care2care_coupons", JSON.stringify(updated));
    showToast("🏷️ Custom Coupon & Privilege Card Created!");
  };

  // 7. DIGITAL SIGNATURE CANVAS WITH UNDO / REDO HISTORY
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [historyStack, setHistoryStack] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  const [savedSignature, setSavedSignature] = useState<string | null>(() => {
    return localStorage.getItem("care2care_digital_signature");
  });

  // 8. STAMP MODULE (LEFT THUMB & RIGHT THUMB STAMPS)
  const [leftThumbStamp, setLeftThumbStamp] = useState<string | null>(() => localStorage.getItem("c2c_stamp_left"));
  const [rightThumbStamp, setRightThumbStamp] = useState<string | null>(() => localStorage.getItem("c2c_stamp_right"));

  const handleThumbUpload = (side: "left" | "right", file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (side === "left") {
        setLeftThumbStamp(result);
        localStorage.setItem("c2c_stamp_left", result);
        showToast("👍 Left Thumb Stamp Saved!");
      } else {
        setRightThumbStamp(result);
        localStorage.setItem("c2c_stamp_right", result);
        showToast("👍 Right Thumb Stamp Saved!");
      }
    };
    reader.readAsDataURL(file);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignatureFromCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setSavedSignature(dataUrl);
    localStorage.setItem("care2care_digital_signature", dataUrl);
    showToast("✍️ Digital Signature Saved!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* HEADER HERO BANNER & SUB-NAV */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl text-slate-900 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] flex items-center justify-center text-white font-black text-xl shadow-md">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  IGOPaperless Studio
                </h1>
                <span className="text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-full">
                  Care2Care Suite
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">
                Replace paper with digital cards, ID passes, certificates, contracts, QR tools & e-signatures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("qr_scanner")}
              className="px-3.5 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Scan className="w-4 h-4" /> Scan QR Code
            </button>
          </div>
        </div>

        {/* HORIZONTAL SUB-NAV BAR */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: <FileText className="w-3.5 h-3.5" /> },
            { id: "visiting_cards", label: "Visiting Cards", icon: <CreditCard className="w-3.5 h-3.5" /> },
            { id: "tickets", label: "Digital Tickets", icon: <Ticket className="w-3.5 h-3.5" /> },
            { id: "qr_scanner", label: "Camera & Gate Scanner", icon: <Scan className="w-3.5 h-3.5" /> },
            { id: "certificates", label: "Certificates", icon: <Award className="w-3.5 h-3.5" /> },
            { id: "contracts", label: "Contracts", icon: <Lock className="w-3.5 h-3.5" /> },
            { id: "qr_generator", label: "QR Generator", icon: <QrCode className="w-3.5 h-3.5" /> },
            { id: "coupons", label: "Coupons", icon: <Tag className="w-3.5 h-3.5" /> },
            { id: "signatures", label: "Signatures", icon: <PenTool className="w-3.5 h-3.5" /> },
            { id: "analytics", label: "Analytics", icon: <BarChart2 className="w-3.5 h-3.5" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                activeTab === item.id
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. DASHBOARD OVERVIEW VIEW */}
      {/* ========================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Visiting Cards</span>
              <p className="text-2xl font-black text-slate-900">{cards.length}</p>
              <p className="text-[11px] font-bold text-emerald-600">Active Digital Cards</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Digital Tickets</span>
              <p className="text-2xl font-black text-slate-900">{tickets.length}</p>
              <p className="text-[11px] font-bold text-purple-600">Events & Passes</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Certificates</span>
              <p className="text-2xl font-black text-slate-900">{certificates.length}</p>
              <p className="text-[11px] font-bold text-amber-600">Issued & Verified</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Coupons Active</span>
              <p className="text-2xl font-black text-slate-900">{coupons.length}</p>
              <p className="text-[11px] font-bold text-cyan-600">Discounts & Offers</p>
            </div>
          </div>

          {/* GRID OF DIGITAL DOCUMENT SERVICES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Visiting Cards */}
            <div
              onClick={() => setActiveTab("visiting_cards")}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-cyan-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🪪
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-cyan-600 transition-colors">
                  Virtual Visiting Cards
                </h3>
                <p className="text-xs text-slate-500 leading-snug">
                  5 default design themes, custom colors, profile picture & QR codes.
                </p>
              </div>
            </div>

            {/* Tickets */}
            <div
              onClick={() => setActiveTab("tickets")}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-purple-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🎟️
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                  Digital Tickets & Passes
                </h3>
                <p className="text-xs text-slate-500 leading-snug">
                  Concerts, seminars, webinars, seat numbers & entry scanning.
                </p>
              </div>
            </div>

            {/* Certificates */}
            <div
              onClick={() => setActiveTab("certificates")}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                📜
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                  Certificates & Credentials
                </h3>
                <p className="text-xs text-slate-500 leading-snug">
                  Training awards, course completion, signatures & QR authentication.
                </p>
              </div>
            </div>

            {/* Contracts */}
            <div
              onClick={() => setActiveTab("contracts")}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                📄
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Contracts & Deeds
                </h3>
                <p className="text-xs text-slate-500 leading-snug">
                  Loan agreements, rental, employment, 7-generation lineage & witnesses.
                </p>
              </div>
            </div>

            {/* QR Code Generator */}
            <div
              onClick={() => setActiveTab("qr_generator")}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                📸
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Advanced QR Generator
                </h3>
                <p className="text-xs text-slate-500 leading-snug">
                  Custom foreground/background colors, logo embed, shapes & export.
                </p>
              </div>
            </div>

            {/* Digital Signatures */}
            <div
              onClick={() => setActiveTab("signatures")}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-slate-800 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                ✍️
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-slate-700 transition-colors">
                  Digital Signatures
                </h3>
                <p className="text-xs text-slate-500 leading-snug">
                  Draw canvas signature or upload image for legal document binding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. VISITING CARDS VIEW (FULL DESIGN STUDIO) */}
      {/* ========================================== */}
      {activeTab === "visiting_cards" && (
        <div className="space-y-8">
          {/* STUDIO HEADER */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪪</span>
                  <h2 className="text-lg font-black text-slate-900">Virtual Visiting Card Studio & Designer</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Custom details filling box, horizontal & vertical orientations, 2-sided designs, font options, and printable PNG export.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setCardForm({
                      ...cardForm,
                      name: patient?.name || "Aarav Sharma",
                      phone: (patient as any)?.phone || "+977 9841234567",
                      email: (patient as any)?.email || "aarav.sharma@care2care.np",
                      company: "Care2Care Health Solutions",
                      position: "Primary Care Specialist",
                      address: (patient as any)?.address || "Kathmandu, Nepal",
                      website: "https://care2care.np"
                    });
                    showToast("⚡ Auto-fetched profile details!");
                  }}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Auto-Fetch My Data
                </button>

                <button
                  onClick={createNewBlankCard}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> New Blank Card
                </button>

                <button
                  onClick={saveCard}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5" /> {cardForm.id ? "Update Card" : "Save Card"}
                </button>
              </div>
            </div>

            {/* MAIN DESIGNER GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: LIVE CANVAS & SIDE TOGGLES (5 COLS) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-3xl border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Layout className="w-4 h-4 text-cyan-600" /> Card Stage Preview
                  </div>
                  {cardForm.isTwoSided && (
                    <div className="inline-flex bg-slate-200 p-1 rounded-xl gap-1 text-[11px] font-bold">
                      <button
                        onClick={() => setCardActiveSide("front")}
                        className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                          cardActiveSide === "front"
                            ? "bg-white text-slate-900 shadow-2xs font-black"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Front Side
                      </button>
                      <button
                        onClick={() => setCardActiveSide("back")}
                        className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                          cardActiveSide === "back"
                            ? "bg-white text-slate-900 shadow-2xs font-black"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Back Side
                      </button>
                    </div>
                  )}
                </div>

                {/* DEVICE VIEW MODE TOGGLER */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 text-xs font-bold shadow-inner">
                  <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> Viewing Mode:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCardDeviceMode("mobile")}
                      className={`px-2 py-1 rounded-xl text-[10px] font-black cursor-pointer flex items-center gap-1 transition-all ${
                        cardDeviceMode === "mobile"
                          ? "bg-cyan-500 text-slate-950 shadow-md ring-2 ring-cyan-400/30 font-black"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Smartphone className="w-3 h-3" /> Mobile (340px)
                    </button>
                    <button
                      onClick={() => setCardDeviceMode("tablet")}
                      className={`px-2 py-1 rounded-xl text-[10px] font-black cursor-pointer flex items-center gap-1 transition-all ${
                        cardDeviceMode === "tablet"
                          ? "bg-cyan-500 text-slate-950 shadow-md ring-2 ring-cyan-400/30 font-black"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Tablet className="w-3 h-3" /> Tablet (420px)
                    </button>
                    <button
                      onClick={() => setCardDeviceMode("desktop")}
                      className={`px-2 py-1 rounded-xl text-[10px] font-black cursor-pointer flex items-center gap-1 transition-all ${
                        cardDeviceMode === "desktop"
                          ? "bg-cyan-500 text-slate-950 shadow-md ring-2 ring-cyan-400/30 font-black"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Monitor className="w-3 h-3" /> Desktop
                    </button>
                  </div>
                </div>

                {/* VISUAL CARD PREVIEW CANVAS CONTAINER WITH DYNAMIC DEVICE SCALE */}
                <div className="flex flex-col items-center justify-center p-3 sm:p-5 bg-slate-950 rounded-3xl border border-slate-800/90 min-h-[380px] sm:min-h-[460px] relative overflow-hidden shadow-2xl">
                  {/* CANVAS WATERMARK BADGE */}
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/50 backdrop-blur-md text-[10px] font-bold text-white rounded-md uppercase tracking-wider flex items-center gap-1 border border-white/10">
                    <span>{cardForm.orientation === "vertical" ? "↕ Portrait" : "↔ Horizontal"}</span>
                    <span>•</span>
                    <span>{cardActiveSide.toUpperCase()} SIDE</span>
                  </div>

                  {/* FLIP CARD TRIGGER FLOATING BUTTON */}
                  {cardForm.isTwoSided && (
                    <button
                      onClick={() => setCardActiveSide(cardActiveSide === "front" ? "back" : "front")}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow-sm border border-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1 hover:scale-105 transition-all"
                      title="Flip card side"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-cyan-600" /> Flip Side
                    </button>
                  )}

                  {/* DEVICE SCALING WRAPPER */}
                  <div
                    className={`w-full mx-auto transition-all duration-300 flex justify-center ${
                      cardDeviceMode === "mobile"
                        ? "max-w-[320px]"
                        : cardDeviceMode === "tablet"
                        ? "max-w-[400px]"
                        : "max-w-full"
                    }`}
                  >
                    {/* ======================================== */}
                    {/* FRONT SIDE CARD CANVAS */}
                    {/* ======================================== */}
                    {cardActiveSide === "front" && (
                      <div
                        ref={cardFrontRef}
                        style={{
                          backgroundColor: cardForm.primaryColor || "#0d9488",
                          backgroundImage: cardForm.cardBgImageUrl ? `url(${cardForm.cardBgImageUrl})` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          color: cardForm.textColor || "#ffffff"
                        }}
                        className={`w-full shadow-2xl rounded-2xl p-4 sm:p-5 relative transition-all overflow-hidden flex flex-col justify-between ${
                          cardForm.orientation === "vertical"
                            ? "max-w-[260px] sm:max-w-[300px] aspect-[1/1.6] h-auto"
                            : "max-w-[340px] sm:max-w-[440px] aspect-[1.75/1] h-auto"
                        } ${
                          cardForm.fontFamily === "serif"
                            ? "font-serif"
                            : cardForm.fontFamily === "mono"
                            ? "font-mono"
                            : cardForm.fontFamily === "display"
                            ? "font-black tracking-tight"
                            : cardForm.fontFamily === "cursive"
                            ? "font-medium italic"
                            : "font-sans"
                        }`}
                      >
                        {/* TINT OVERLAY IF CUSTOM BG IMAGE IS PRESENT */}
                        {cardForm.cardBgImageUrl && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0" />
                        )}

                        {/* DECORATIVE BACKGROUND ACCENTS */}
                        <div
                          className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 pointer-events-none"
                          style={{ backgroundColor: cardForm.secondaryColor || "#1e293b" }}
                        />

                        {/* HORIZONTAL LAYOUT FRONT */}
                        {cardForm.orientation !== "vertical" ? (
                          <div className="space-y-2.5 relative z-10 h-full flex flex-col justify-between">
                            {/* TOP ROW: AVATAR & NAME & QR */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                {isPhotoVisibleOnSide("front") && (
                                  <img
                                    src={
                                      cardForm.photoUrl ||
                                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                                    }
                                    alt={cardForm.name}
                                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover ring-2 ring-white/40 shrink-0 shadow-md"
                                  />
                                )}
                                <div>
                                  <h3
                                    className={`font-black leading-tight ${
                                      cardForm.fontSize === "small"
                                        ? "text-xs sm:text-sm"
                                        : cardForm.fontSize === "large"
                                        ? "text-base sm:text-lg"
                                        : "text-sm sm:text-base"
                                    }`}
                                    style={{ color: cardForm.textColor || "#ffffff" }}
                                  >
                                    {cardForm.name || "Your Name"}
                                  </h3>
                                  <p
                                    className={`font-bold leading-snug ${
                                      cardForm.fontSize === "small"
                                        ? "text-[9px]"
                                        : cardForm.fontSize === "large"
                                        ? "text-[11px] sm:text-xs"
                                        : "text-[10px] sm:text-[11px]"
                                    }`}
                                    style={{ color: cardForm.subtitleColor || "#5eead4" }}
                                  >
                                    {cardForm.position || "Position Title"}
                                  </p>
                                  <p
                                    className="text-[9px] sm:text-[10px] opacity-90 font-medium"
                                    style={{ color: cardForm.bodyTextColor || "#e2e8f0" }}
                                  >
                                    {cardForm.company || "Company Name"}
                                  </p>
                                </div>
                              </div>

                              {/* QR CODE FRONT */}
                              {isQrVisibleOnSide("front") && (
                                <div
                                  className="p-1 sm:p-1.5 rounded-xl shrink-0 shadow-md flex items-center justify-center"
                                  style={{ backgroundColor: cardForm.qrBgColor || "#ffffff" }}
                                >
                                  <ProfessionalQrRenderer
                                    value={`https://care2care.np/vcard/${cardForm.id || "preview"}`}
                                    size={cardForm.fontSize === "small" ? 48 : cardForm.fontSize === "large" ? 64 : 56}
                                    fgColor={cardForm.qrColor || "#0f172a"}
                                    bgColor={cardForm.qrBgColor || "#ffffff"}
                                    patternStyle="rounded"
                                  />
                                </div>
                              )}
                            </div>

                            {/* CONTACT INFORMATION DETAILS */}
                            {isDetailsVisibleOnSide("front") && (
                              <div
                                className="pt-2 border-t border-white/20 text-[9px] sm:text-[10px] grid grid-cols-2 gap-x-2 gap-y-0.5 font-medium"
                                style={{ color: cardForm.bodyTextColor || "#f1f5f9" }}
                              >
                                <p className="truncate">📞 {cardForm.phone || "Phone"}</p>
                                <p className="truncate">✉️ {cardForm.email || "Email"}</p>
                                <p className="truncate">📍 {cardForm.address || "Address"}</p>
                                {cardForm.website && <p className="truncate">🌐 {cardForm.website}</p>}
                              </div>
                            )}

                            {/* CUSTOM DETAILS FILLING BOX ITEMS */}
                            {isDetailsVisibleOnSide("front") && cardForm.customFields && cardForm.customFields.length > 0 && (
                              <div className="pt-0.5 flex flex-wrap gap-1">
                                {cardForm.customFields.map((field) => (
                                  <span
                                    key={field.id}
                                    className="px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold bg-black/30 backdrop-blur-xs border border-white/20 text-white/95"
                                  >
                                    <strong className="text-cyan-200">{field.label}:</strong> {field.value}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* GOOGLE MAPS LOCATION WIDGET FRONT */}
                            {isMapVisibleOnSide("front") && (cardForm.googleMapUrl || cardForm.mapImageUrl || cardForm.address) && (
                              <div className="p-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/25 text-white space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1 overflow-hidden">
                                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                                    <span className="text-[9px] font-bold text-white truncate">
                                      {cardForm.mapLocationName || cardForm.address || "Location Pin"}
                                    </span>
                                  </div>
                                  {cardForm.googleMapUrl && (
                                    <a
                                      href={cardForm.googleMapUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[8px] font-black text-amber-300 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 px-1.5 py-0.5 rounded-md shrink-0"
                                    >
                                      Maps ↗
                                    </a>
                                  )}
                                </div>
                                {cardForm.mapImageUrl && (
                                  <img
                                    src={cardForm.mapImageUrl}
                                    alt="Map Preview"
                                    className="w-full h-8 sm:h-10 object-cover rounded-lg border border-white/20"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* VERTICAL LAYOUT FRONT */
                          <div className="space-y-2 relative z-10 h-full flex flex-col justify-between text-center items-center">
                            {/* TOP AVATAR & HEADER */}
                            <div className="space-y-1.5 flex flex-col items-center pt-1">
                              {isPhotoVisibleOnSide("front") && (
                                <img
                                  src={
                                    cardForm.photoUrl ||
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                                  }
                                  alt={cardForm.name}
                                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-white/50 shadow-lg"
                                />
                              )}
                              <div>
                                <h3
                                  className={`font-black ${
                                    cardForm.fontSize === "small"
                                      ? "text-sm"
                                      : cardForm.fontSize === "large"
                                      ? "text-lg"
                                      : "text-base"
                                  }`}
                                  style={{ color: cardForm.textColor || "#ffffff" }}
                                >
                                  {cardForm.name || "Your Name"}
                                </h3>
                                <p
                                  className="text-[10px] sm:text-xs font-bold"
                                  style={{ color: cardForm.subtitleColor || "#5eead4" }}
                                >
                                  {cardForm.position || "Position Title"}
                                </p>
                                <p
                                  className="text-[9px] sm:text-[10px] opacity-90 font-medium"
                                  style={{ color: cardForm.bodyTextColor || "#e2e8f0" }}
                                >
                                  {cardForm.company || "Company Name"}
                                </p>
                              </div>
                            </div>

                            {/* CONTACT LINES VERTICAL */}
                            {isDetailsVisibleOnSide("front") && (
                              <div
                                className="w-full py-1.5 border-y border-white/20 text-[9px] space-y-0.5 text-left font-medium"
                                style={{ color: cardForm.bodyTextColor || "#f1f5f9" }}
                              >
                                <p className="truncate">📞 {cardForm.phone || "Phone"}</p>
                                <p className="truncate">✉️ {cardForm.email || "Email"}</p>
                                <p className="truncate">📍 {cardForm.address || "Address"}</p>
                                {cardForm.website && <p className="truncate">🌐 {cardForm.website}</p>}
                              </div>
                            )}

                            {/* CUSTOM DETAILS LIST VERTICAL */}
                            {isDetailsVisibleOnSide("front") && cardForm.customFields && cardForm.customFields.length > 0 && (
                              <div className="w-full flex flex-wrap justify-center gap-1">
                                {cardForm.customFields.map((field) => (
                                  <span
                                    key={field.id}
                                    className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-black/30 backdrop-blur-xs border border-white/20 text-white/95"
                                  >
                                    <strong className="text-cyan-200">{field.label}:</strong> {field.value}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* GOOGLE MAPS VERTICAL */}
                            {isMapVisibleOnSide("front") && (cardForm.googleMapUrl || cardForm.mapImageUrl || cardForm.address) && (
                              <div className="w-full p-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/25 text-white space-y-1">
                                <div className="flex items-center justify-between gap-1 text-[8px] font-bold">
                                  <span className="truncate">📍 {cardForm.mapLocationName || cardForm.address}</span>
                                  {cardForm.googleMapUrl && (
                                    <a href={cardForm.googleMapUrl} target="_blank" rel="noopener noreferrer" className="text-amber-300 font-black">
                                      Map ↗
                                    </a>
                                  )}
                                </div>
                                {cardForm.mapImageUrl && (
                                  <img src={cardForm.mapImageUrl} alt="Map" className="w-full h-8 object-cover rounded-md" />
                                )}
                              </div>
                            )}

                            {/* QR CODE VERTICAL */}
                            {isQrVisibleOnSide("front") && (
                              <div
                                className="p-1 rounded-xl shadow-md inline-block my-0.5"
                                style={{ backgroundColor: cardForm.qrBgColor || "#ffffff" }}
                              >
                                <ProfessionalQrRenderer
                                  value={`https://care2care.np/vcard/${cardForm.id || "preview"}`}
                                  size={56}
                                  fgColor={cardForm.qrColor || "#0f172a"}
                                  bgColor={cardForm.qrBgColor || "#ffffff"}
                                  patternStyle="rounded"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ======================================== */}
                    {/* BACK SIDE CARD CANVAS */}
                    {/* ======================================== */}
                    {cardActiveSide === "back" && cardForm.isTwoSided && (
                      <div
                        ref={cardBackRef}
                        style={{
                          backgroundColor: cardForm.backSideBgColor || cardForm.secondaryColor || "#0f172a",
                          backgroundImage: cardForm.backSideBgImageUrl ? `url(${cardForm.backSideBgImageUrl})` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          color: "#ffffff"
                        }}
                        className={`w-full shadow-2xl rounded-2xl p-4 sm:p-5 relative transition-all overflow-hidden flex flex-col items-center justify-between text-center ${
                          cardForm.orientation === "vertical"
                            ? "max-w-[260px] sm:max-w-[300px] aspect-[1/1.6] h-auto"
                            : "max-w-[340px] sm:max-w-[440px] aspect-[1.75/1] h-auto"
                        } ${
                          cardForm.fontFamily === "serif"
                            ? "font-serif"
                            : cardForm.fontFamily === "mono"
                            ? "font-mono"
                            : cardForm.fontFamily === "display"
                            ? "font-black tracking-tight"
                            : cardForm.fontFamily === "cursive"
                            ? "font-medium italic"
                            : "font-sans"
                        }`}
                      >
                        {/* OVERLAY TINT IF BACK BG IMAGE */}
                        {cardForm.backSideBgImageUrl && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-0" />
                        )}

                        <div className="space-y-2 relative z-10 flex flex-col items-center justify-between h-full w-full py-1">
                          {/* BACK HEADER */}
                          <div className="flex items-center gap-2">
                            {isPhotoVisibleOnSide("back") ? (
                              <img
                                src={cardForm.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                                alt="Back avatar"
                                className="w-10 h-10 rounded-xl object-cover border border-white/40 shadow-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-inner">
                                🪪
                              </div>
                            )}
                            <div className="text-left">
                              <h4 className="text-xs sm:text-sm font-black text-white leading-tight">{cardForm.company || "Care2Care Network"}</h4>
                              <p className="text-[10px] font-bold text-cyan-300">
                                {cardForm.backSideTagline || "Dedicated Healthcare & Professional Network"}
                              </p>
                            </div>
                          </div>

                          {/* DETAILS BACK SIDE IF ENABLED */}
                          {isDetailsVisibleOnSide("back") && (
                            <div className="text-[9px] space-y-0.5 text-center text-slate-200 bg-black/30 p-1.5 rounded-lg border border-white/10 w-full">
                              <p>📞 {cardForm.phone} • ✉️ {cardForm.email}</p>
                              {cardForm.address && <p>📍 {cardForm.address}</p>}
                            </div>
                          )}

                          {/* GOOGLE MAPS WIDGET BACK SIDE */}
                          {isMapVisibleOnSide("back") && (cardForm.googleMapUrl || cardForm.mapImageUrl || cardForm.address) && (
                            <div className="w-full p-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 text-white space-y-1">
                              <div className="flex items-center justify-between gap-1 text-[9px] font-bold">
                                <span className="truncate">📍 {cardForm.mapLocationName || cardForm.address || "Location Pin"}</span>
                                {cardForm.googleMapUrl && (
                                  <a
                                    href={cardForm.googleMapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[8px] font-black text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded-md"
                                  >
                                    Google Maps ↗
                                  </a>
                                )}
                              </div>
                              {cardForm.mapImageUrl && (
                                <img src={cardForm.mapImageUrl} alt="Map" className="w-full h-8 sm:h-10 object-cover rounded-md" />
                              )}
                            </div>
                          )}

                          {/* QR CODE BACK SIDE */}
                          {isQrVisibleOnSide("back") && (
                            <div
                              className="p-1.5 rounded-2xl bg-white shadow-xl my-0.5"
                              style={{ backgroundColor: cardForm.qrBgColor || "#ffffff" }}
                            >
                              <ProfessionalQrRenderer
                                value={`https://care2care.np/vcard/${cardForm.id || "preview"}`}
                                size={68}
                                fgColor={cardForm.qrColor || "#0f172a"}
                                bgColor={cardForm.qrBgColor || "#ffffff"}
                                patternStyle="rounded"
                              />
                            </div>
                          )}

                          <p className="text-[9px] text-slate-300 max-w-[240px] leading-tight font-medium">
                            {cardForm.backSideNote || "Scan QR code to import contact details directly into your phonebook."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* EXPORT / DOWNLOAD ACTION BUTTONS */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => downloadCardPng("front")}
                      className="px-3 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" /> Download Front PNG
                    </button>

                    {cardForm.isTwoSided ? (
                      <button
                        onClick={() => downloadCardPng("back")}
                        className="px-3 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" /> Download Back PNG
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://care2care.np/vcard/${cardForm.id || "preview"}`);
                          showToast("📲 QR Profile Link copied!");
                        }}
                        className="px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5 text-indigo-600" /> Share QR Link
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: EDITOR CONTROLS & CUSTOM DETAILS FILLING BOX (7 COLS) */}
              <div className="lg:col-span-7 space-y-6">
                {/* OPTION TAB 1: ORIENTATION & CARD SIDES */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Layout className="w-4 h-4 text-cyan-600" /> Card Orientation & Layout Options
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ORIENTATION PICKER */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">1. Card Orientation:</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => setCardForm({ ...cardForm, orientation: "horizontal" })}
                          className={`p-2 rounded-xl text-xs font-bold border cursor-pointer flex items-center justify-center gap-1.5 ${
                            cardForm.orientation !== "vertical"
                              ? "bg-cyan-50 border-cyan-500 text-cyan-900 font-black shadow-2xs"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          ↔️ Horizontal
                        </button>
                        <button
                          onClick={() => setCardForm({ ...cardForm, orientation: "vertical" })}
                          className={`p-2 rounded-xl text-xs font-bold border cursor-pointer flex items-center justify-center gap-1.5 ${
                            cardForm.orientation === "vertical"
                              ? "bg-cyan-50 border-cyan-500 text-cyan-900 font-black shadow-2xs"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          ↕️ Vertical
                        </button>
                      </div>
                    </div>

                    {/* TWO-SIDED CARD PICKER */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">2. Card Sides:</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            setCardForm({ ...cardForm, isTwoSided: false });
                            setCardActiveSide("front");
                          }}
                          className={`p-2 rounded-xl text-xs font-bold border cursor-pointer flex items-center justify-center gap-1.5 ${
                            !cardForm.isTwoSided
                              ? "bg-purple-50 border-purple-500 text-purple-900 font-black shadow-2xs"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          📄 Single-Sided
                        </button>
                        <button
                          onClick={() => setCardForm({ ...cardForm, isTwoSided: true })}
                          className={`p-2 rounded-xl text-xs font-bold border cursor-pointer flex items-center justify-center gap-1.5 ${
                            cardForm.isTwoSided
                              ? "bg-purple-50 border-purple-500 text-purple-900 font-black shadow-2xs"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          🔄 Two-Sided
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OPTION TAB 2: FONT STYLING, SIZE & COLORS */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Type className="w-4 h-4 text-indigo-600" /> Typography, Font Options & Text Colors
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* FONT FAMILY */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Font Option:</label>
                      <select
                        value={cardForm.fontFamily || "sans"}
                        onChange={(e) => setCardForm({ ...cardForm, fontFamily: e.target.value as any })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                      >
                        <option value="sans">Sans-Serif (Clean Modern)</option>
                        <option value="serif">Serif (Classic & Luxurious)</option>
                        <option value="mono">Monospace (Tech & Medical Code)</option>
                        <option value="display">Display (Bold Impact)</option>
                        <option value="cursive">Cursive (Artisanal Script)</option>
                      </select>
                    </div>

                    {/* FONT SIZE SCALE */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Font Size Scale:</label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: "small", label: "Small" },
                          { id: "medium", label: "Medium" },
                          { id: "large", label: "Large" }
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setCardForm({ ...cardForm, fontSize: s.id as any })}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold border cursor-pointer text-center ${
                              (cardForm.fontSize || "medium") === s.id
                                ? "bg-indigo-600 text-white border-indigo-600 font-black"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FONT COLOR PICKERS */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span>Name Color:</span>
                      <input
                        type="color"
                        value={cardForm.textColor || "#ffffff"}
                        onChange={(e) => setCardForm({ ...cardForm, textColor: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Subtitle Color:</span>
                      <input
                        type="color"
                        value={cardForm.subtitleColor || "#5eead4"}
                        onChange={(e) => setCardForm({ ...cardForm, subtitleColor: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Body Color:</span>
                      <input
                        type="color"
                        value={cardForm.bodyTextColor || "#e2e8f0"}
                        onChange={(e) => setCardForm({ ...cardForm, bodyTextColor: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* OPTION TAB 3: DESIGN THEME PRESETS & CARD BACKGROUND COLORS */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Sliders className="w-4 h-4 text-emerald-600" /> Design Themes & Background Palette
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: "classic", name: "Classic Corp", bg: "#0284c7" },
                      { id: "modern", name: "Modern Dark", bg: "#0f172a" },
                      { id: "creative", name: "Vibrant Purple", bg: "#7e22ce" },
                      { id: "elegant", name: "Gold Luxury", bg: "#b45309" },
                      { id: "professional", name: "Health Emerald", bg: "#047857" }
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() =>
                          setCardForm({
                            ...cardForm,
                            design: d.id as any,
                            primaryColor: d.bg
                          })
                        }
                        className={`p-2 rounded-xl text-[11px] font-bold border cursor-pointer text-center transition-all ${
                          cardForm.design === d.id
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-black"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-full h-2 rounded-md mb-1" style={{ backgroundColor: d.bg }} />
                        {d.name}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span>Card Primary BG:</span>
                      <input
                        type="color"
                        value={cardForm.primaryColor}
                        onChange={(e) => setCardForm({ ...cardForm, primaryColor: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Secondary Accent:</span>
                      <input
                        type="color"
                        value={cardForm.secondaryColor}
                        onChange={(e) => setCardForm({ ...cardForm, secondaryColor: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>QR Code Pattern Color:</span>
                      <input
                        type="color"
                        value={cardForm.qrColor}
                        onChange={(e) => setCardForm({ ...cardForm, qrColor: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* OPTION TAB 4: CARD DETAILS & CUSTOM DETAILS FILLING BOX */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                      <Edit3 className="w-4 h-4 text-amber-600" /> Card Details & Custom Details Filling Box
                    </div>
                    <button
                      onClick={addCustomField}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-amber-700" /> Add Custom Field
                    </button>
                  </div>

                  {/* MAIN INPUT FIELDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={cardForm.name}
                      onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Position / Title *"
                      value={cardForm.position}
                      onChange={(e) => setCardForm({ ...cardForm, position: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Company / Organization"
                      value={cardForm.company}
                      onChange={(e) => setCardForm({ ...cardForm, company: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={cardForm.phone}
                      onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={cardForm.email}
                      onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="City, Address"
                      value={cardForm.address}
                      onChange={(e) => setCardForm({ ...cardForm, address: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Website URL"
                      value={cardForm.website}
                      onChange={(e) => setCardForm({ ...cardForm, website: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Profile Photo / Logo Image URL"
                      value={cardForm.photoUrl}
                      onChange={(e) => setCardForm({ ...cardForm, photoUrl: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  {/* CUSTOM DETAILS DYNAMIC FILLING BOX */}
                  {cardForm.customFields && cardForm.customFields.length > 0 && (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black text-amber-950 uppercase tracking-wide">
                        <span>🏷️ Custom Details List (Shown on Card):</span>
                        <span>{cardForm.customFields.length} Fields</span>
                      </div>

                      <div className="space-y-2">
                        {cardForm.customFields.map((field) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Field Label (e.g. Reg. No)"
                              value={field.label}
                              onChange={(e) => updateCustomField(field.id, "label", e.target.value)}
                              className="w-1/3 p-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-800"
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g. NMC-88492)"
                              value={field.value}
                              onChange={(e) => updateCustomField(field.id, "value", e.target.value)}
                              className="flex-1 p-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-800"
                            />
                            <button
                              onClick={() => removeCustomField(field.id)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer transition-colors shrink-0"
                              title="Delete Field"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION TAB 5: MULTI-SIDE ELEMENT PLACEMENT MATRIX */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Layers className="w-4 h-4 text-cyan-600" /> Multi-Side Element Placement Matrix
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Choose which side of the card (Front, Back, Both, or Hidden) each element appears on.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* 1. PHOTO PLACEMENT */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">👤 Custom Profile Pic / Logo Placement:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { id: "front", label: "Front" },
                          { id: "back", label: "Back" },
                          { id: "both", label: "Both" },
                          { id: "none", label: "Hidden" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCardForm({ ...cardForm, showPhotoSide: opt.id as any })}
                            className={`py-1 px-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer text-center ${
                              (cardForm.showPhotoSide || "front") === opt.id
                                ? "bg-cyan-600 text-white border-cyan-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. QR CODE PLACEMENT */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">📱 QR Code Placement:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { id: "front", label: "Front" },
                          { id: "back", label: "Back" },
                          { id: "both", label: "Both" },
                          { id: "none", label: "Hidden" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCardForm({ ...cardForm, showQrSide: opt.id as any })}
                            className={`py-1 px-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer text-center ${
                              (cardForm.showQrSide || "both") === opt.id
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. CONTACT & CUSTOM DETAILS PLACEMENT */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">📑 Contact & Custom Fields Placement:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { id: "front", label: "Front" },
                          { id: "back", label: "Back" },
                          { id: "both", label: "Both" },
                          { id: "none", label: "Hidden" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCardForm({ ...cardForm, showDetailsSide: opt.id as any })}
                            className={`py-1 px-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer text-center ${
                              (cardForm.showDetailsSide || "front") === opt.id
                                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. GOOGLE MAPS LOCATION PLACEMENT */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">🗺️ Google Maps & Pin Placement:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { id: "front", label: "Front" },
                          { id: "back", label: "Back" },
                          { id: "both", label: "Both" },
                          { id: "none", label: "Hidden" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCardForm({ ...cardForm, showMapSide: opt.id as any })}
                            className={`py-1 px-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer text-center ${
                              (cardForm.showMapSide || "back") === opt.id
                                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* OPTION TAB 6: GOOGLE MAPS & LOCATION PIN SETUP */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <MapPin className="w-4 h-4 text-rose-600" /> Google Maps Pin & Location Setup
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Google Maps URL (e.g. https://maps.google.com/?q=Kathmandu)"
                      value={cardForm.googleMapUrl || ""}
                      onChange={(e) => setCardForm({ ...cardForm, googleMapUrl: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Location / Address Title (e.g. Care2Care HQ, Lazimpat)"
                      value={cardForm.mapLocationName || ""}
                      onChange={(e) => setCardForm({ ...cardForm, mapLocationName: e.target.value })}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  {/* CUSTOM MAP SNAPSHOT IMAGE UPLOAD */}
                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {cardForm.mapImageUrl ? (
                        <img src={cardForm.mapImageUrl} alt="Map Preview" className="w-10 h-10 rounded-lg object-cover border border-rose-400 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-black text-xs">
                          🗺️
                        </div>
                      )}
                      <div className="text-xs truncate">
                        <span className="font-extrabold text-slate-800 block truncate">
                          {cardForm.mapImageUrl ? "Custom Map Photo Attached" : "Custom Map Snapshot Upload"}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          Upload screenshot or photo of Google Maps location
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black cursor-pointer flex items-center gap-1 transition-all active:scale-95">
                        <Upload className="w-3 h-3" />
                        {cardForm.mapImageUrl ? "Change Map Pic" : "Upload Map Pic"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMapImageUpload}
                          className="hidden"
                        />
                      </label>
                      {cardForm.mapImageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setCardForm({ ...cardForm, mapImageUrl: undefined });
                            showToast("Cleared map snapshot image");
                          }}
                          className="p-1.5 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-[10px] font-bold cursor-pointer border border-rose-200"
                          title="Remove Map Image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* OPTION TAB 7: CARD FRAME BACKGROUND PICTURES */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Image className="w-4 h-4 text-emerald-600" /> Card Frame Custom Background Pictures
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* FRONT CARD BG UPLOAD */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-extrabold text-slate-800 block">Front Side Background Picture:</span>
                      <div className="flex items-center justify-between gap-2">
                        {cardForm.cardBgImageUrl ? (
                          <img src={cardForm.cardBgImageUrl} alt="Front BG" className="w-9 h-9 rounded-lg object-cover border border-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs">
                            🖼️
                          </div>
                        )}
                        <label className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black cursor-pointer flex items-center gap-1 active:scale-95">
                          <Upload className="w-3 h-3" />
                          {cardForm.cardBgImageUrl ? "Change Front BG" : "Upload Front BG"}
                          <input type="file" accept="image/*" onChange={handleCardFrontBgUpload} className="hidden" />
                        </label>
                        {cardForm.cardBgImageUrl && (
                          <button
                            type="button"
                            onClick={() => setCardForm({ ...cardForm, cardBgImageUrl: undefined })}
                            className="p-1 bg-red-50 text-red-600 rounded-lg cursor-pointer text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* BACK CARD BG UPLOAD */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-extrabold text-slate-800 block">Back Side Background Picture:</span>
                      <div className="flex items-center justify-between gap-2">
                        {cardForm.backSideBgImageUrl ? (
                          <img src={cardForm.backSideBgImageUrl} alt="Back BG" className="w-9 h-9 rounded-lg object-cover border border-purple-400 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 bg-purple-50 text-purple-700 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs">
                            🖼️
                          </div>
                        )}
                        <label className="py-1.5 px-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-black cursor-pointer flex items-center gap-1 active:scale-95">
                          <Upload className="w-3 h-3" />
                          {cardForm.backSideBgImageUrl ? "Change Back BG" : "Upload Back BG"}
                          <input type="file" accept="image/*" onChange={handleCardBackBgUpload} className="hidden" />
                        </label>
                        {cardForm.backSideBgImageUrl && (
                          <button
                            type="button"
                            onClick={() => setCardForm({ ...cardForm, backSideBgImageUrl: undefined })}
                            className="p-1 bg-red-50 text-red-600 rounded-lg cursor-pointer text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* OPTION TAB 8: BACK SIDE CONFIGURATION (IF TWO-SIDED) */}
                {cardForm.isTwoSided && (
                  <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-purple-950">
                        <Layers className="w-4 h-4 text-purple-700" /> Back Side Card Configurations
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-200/60 px-2 py-0.5 rounded-md">
                        2-Sided Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">Back Side Tagline / Slogan:</label>
                        <input
                          type="text"
                          value={cardForm.backSideTagline || ""}
                          onChange={(e) => setCardForm({ ...cardForm, backSideTagline: e.target.value })}
                          placeholder="e.g. Quality Healthcare & Compassionate Service"
                          className="w-full p-2 bg-white border border-purple-200 rounded-xl font-bold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 block">Back Side Notes / Instruction:</label>
                        <input
                          type="text"
                          value={cardForm.backSideNote || ""}
                          onChange={(e) => setCardForm({ ...cardForm, backSideNote: e.target.value })}
                          placeholder="e.g. Scan QR code to save contact directly."
                          className="w-full p-2 bg-white border border-purple-200 rounded-xl font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-800">
                        <input
                          type="checkbox"
                          checked={cardForm.showQrOnBack !== false}
                          onChange={(e) => setCardForm({ ...cardForm, showQrOnBack: e.target.checked })}
                          className="rounded text-purple-600 cursor-pointer"
                        />
                        Put QR Code on Back Side
                      </label>

                      <div className="flex items-center gap-1.5">
                        <span>Back Side BG Color:</span>
                        <input
                          type="color"
                          value={cardForm.backSideBgColor || "#0f172a"}
                          onChange={(e) => setCardForm({ ...cardForm, backSideBgColor: e.target.value })}
                          className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* GALLERY OF ALL SAVED VISITING CARDS */}
          {/* ========================================== */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  🪪 Saved Digital Cards Library ({cards.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Click 'Edit Card' on any saved card to customize details, change layout, or update custom fields.
                </p>
              </div>
              <button
                onClick={createNewBlankCard}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Card
              </button>
            </div>

            {cards.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <p className="text-3xl">🪪</p>
                <p className="text-xs font-bold">No saved visiting cards yet. Create your first card above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className={`p-4 rounded-2xl border transition-all hover:shadow-md space-y-3 relative flex flex-col justify-between ${
                      cardForm.id === card.id
                        ? "bg-cyan-50/80 border-cyan-500 ring-2 ring-cyan-500/20"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              card.photoUrl ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                            }
                            alt={card.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-300 shadow-xs"
                          />
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-tight">{card.name}</h4>
                            <p className="text-[11px] font-bold text-cyan-700">{card.position}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{card.company}</p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-extrabold text-[9px] rounded-md uppercase">
                          {card.orientation === "vertical" ? "Portrait" : "Horizontal"}
                        </span>
                      </div>

                      <div className="text-[10px] space-y-0.5 text-slate-600 border-t border-slate-200/80 pt-2 font-medium">
                        <p className="truncate">📞 {card.phone}</p>
                        <p className="truncate">✉️ {card.email}</p>
                        {card.customFields && card.customFields.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1">
                            {card.customFields.slice(0, 3).map((f) => (
                              <span
                                key={f.id}
                                className="px-1.5 py-0.5 bg-slate-200/90 text-slate-800 text-[9px] rounded-md font-bold"
                              >
                                {f.label}: {f.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CARD ACTION BUTTONS */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => editCard(card)}
                        className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Card
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            editCard(card);
                            setTimeout(() => downloadCardPng("front"), 200);
                          }}
                          className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg cursor-pointer text-xs transition-colors"
                          title="Download PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer text-xs transition-colors"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. CONTRACTS & DEEDS VIEW (INTEGRATED) */}
      {/* ========================================== */}
      {activeTab === "contracts" && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <ContractManagementTracker patient={patient} />
        </div>
      )}

      {/* ========================================== */}
      {/* 4. DIGITAL TICKETS VIEW WITH ORGANISER PORTAL */}
      {/* ========================================== */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#2E7D32]/20 shadow-xs space-y-6">
            {/* TOP PORTAL PERSPECTIVE TOGGLE (4 TABS) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎟️</span>
                  <h2 className="text-xl font-black text-slate-900">Digital Tickets & Class Pass Portal</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organisers can create limited/unlimited event passes & class passes, distribute to buyers, scan at gate desks, and allow attendee transfers.
                </p>
              </div>

              {/* PERSPECTIVE SWITCHER */}
              <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setTicketPortalMode("organiser")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    ticketPortalMode === "organiser"
                      ? "bg-[#2E7D32] text-white shadow-md font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Organiser Portal</span>
                </button>
                <button
                  onClick={() => setTicketPortalMode("user")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    ticketPortalMode === "user"
                      ? "bg-[#2E7D32] text-white shadow-md font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Attendee Wallet ({tickets.length})</span>
                </button>
                <button
                  onClick={() => setTicketPortalMode("scanner")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    ticketPortalMode === "scanner"
                      ? "bg-[#2E7D32] text-white shadow-md font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Gate Desk Scanner</span>
                </button>
                <button
                  onClick={() => setTicketPortalMode("analytics")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    ticketPortalMode === "analytics"
                      ? "bg-[#2E7D32] text-white shadow-md font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>

            {/* PERSPECTIVE A: ORGANISER PORTAL */}
            {ticketPortalMode === "organiser" && (
              <div className="space-y-6">
                {/* ORGANISER TOP ACTIONS BAR */}
                <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-lg shadow-xs">
                      🏢
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Care2Care Event & Class Pass Manager
                      </h3>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        Set custom limited or unlimited pass capacities & directly issue passes to buyers or students.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsCreateEventModalOpen(true)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Create Event / Pass
                    </button>
                    <button
                      onClick={() => {
                        if (eventsList.length > 0) {
                          setBulkGenerateForm((prev) => ({ ...prev, eventId: eventsList[0].id }));
                        }
                        setIsBulkGenerateModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" /> Batch Generate Tickets
                    </button>
                    <button
                      onClick={() => {
                        if (eventsList.length > 0) setSelectedEventForDistribute(eventsList[0]);
                        setIsDistributeModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" /> Distribute Pass
                    </button>
                  </div>
                </div>

                {/* EVENTS & CLASS PASSES LIST */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Active Created Events & Class Passes ({eventsList.length})
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Real-time capacity tracking
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eventsList.map((evt) => {
                      const percentIssued =
                        evt.quantityType === "unlimited"
                          ? 100
                          : Math.min(100, Math.round((evt.issuedCount / evt.totalQuantity) * 100));

                      return (
                        <div
                          key={evt.id}
                          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#2E7D32]/50 shadow-xs transition-all space-y-4 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="px-2.5 py-0.5 bg-emerald-100 text-[#2E7D32] text-[10px] font-black uppercase rounded-full border border-emerald-200">
                                  {evt.category}
                                </span>
                                <h4 className="text-base font-black text-slate-900 mt-1">{evt.title}</h4>
                                <p className="text-xs text-slate-600 font-medium">{evt.description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-sm font-black text-[#2E7D32]">
                                  {evt.price === 0 ? "FREE / PRE-PAID" : `${evt.currency} ${evt.price}`}
                                </span>
                              </div>
                            </div>

                            <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="truncate">📍 <strong>Venue:</strong> {evt.venue}</p>
                              <p>📅 <strong>Schedule:</strong> {evt.date} @ {evt.time}</p>
                              <p>🏢 <strong>Organiser:</strong> {evt.organizerName}</p>
                            </div>

                            {/* CAPACITY METER */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-700">Pass Capacity Limit:</span>
                                <span className="text-[#2E7D32] font-black">
                                  {evt.quantityType === "unlimited"
                                    ? `Unlimited (${evt.issuedCount} issued)`
                                    : `${evt.issuedCount} / ${evt.totalQuantity} Issued (${percentIssued}%)`}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#2E7D32] h-full rounded-full transition-all duration-500"
                                  style={{ width: `${percentIssued}%` }}
                                />
                              </div>
                            </div>

                            {/* BENEFITS LIST */}
                            {evt.benefits && evt.benefits.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {evt.benefits.map((b, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md"
                                  >
                                    ✨ {b}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                setSelectedEventForDistribute(evt);
                                setIsDistributeModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Send className="w-3.5 h-3.5" /> Issue Pass
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`CARE2CARE-PASS-CODE:${evt.id}`);
                                showToast(`📋 Copied Pass Code for "${evt.title}"!`);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                            >
                              <Share2 className="w-3.5 h-3.5 text-slate-500" /> Share Code
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ISSUED PASSES ROSTER */}
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Issued Passes Roster & Buyers ({tickets.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsClaimModalOpen(true)}
                        className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
                      >
                        <Ticket className="w-3.5 h-3.5" /> Claim Pass Code
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    {tickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-slate-900 text-xs">{t.attendeeName}</span>
                            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#2E7D32] px-2 py-0.5 rounded-md border border-emerald-200">
                              #{t.ticketNumber}
                            </span>
                            <span className="text-[10px] font-bold uppercase text-[#2E7D32] bg-emerald-100 px-2 py-0.5 rounded-md">
                              {t.ticketType}
                            </span>
                            
                            {/* Distribution status badge */}
                            {t.distributionType === "distributed" || t.status === "distributed" ? (
                              <span className="text-[9px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-purple-200">
                                🎁 Distributed Pass
                              </span>
                            ) : (
                              <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                                💳 Purchased
                              </span>
                            )}

                            {t.isTransferred && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                                📲 Transferred
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {t.eventName} • Seat/Code: {t.seatNumber} • Contact: {t.attendeeContact || "N/A"}
                            {t.shareCount ? ` • Shared ${t.shareCount}x` : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedTicketForShare(t);
                              setIsShareModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <Share2 className="w-3 h-3 text-slate-500" /> Share
                          </button>

                          {t.isUsed ? (
                            <span className="px-3 py-1 bg-emerald-100 text-[#2E7D32] text-[11px] font-black rounded-xl border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Redeemed
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-xl border border-slate-200">
                              Active / Valid
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PERSPECTIVE B: ATTENDEE TICKET WALLET */}
            {ticketPortalMode === "user" && (
              <div className="space-y-6">
                {/* WALLET HEADER & FILTER TABS */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💼</span>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        My Digital Pass Wallet
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Present QR at gate or share/transfer pass to a friend/family member.
                      </p>
                    </div>
                  </div>

                  {/* FILTER TABS */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(["all", "purchased", "distributed", "active", "used", "transferred"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setTicketFilterTab(tab)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                          ticketFilterTab === tab
                            ? "bg-[#2E7D32] text-white shadow-xs font-black"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsClaimModalOpen(true)}
                      className="px-3 py-1.5 bg-[#2E7D32] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-emerald-800 transition-colors flex items-center gap-1 ml-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Claim Pass
                    </button>
                  </div>
                </div>

                {/* MY DIGITAL TICKETS LIST */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tickets
                      .filter((tkt) => {
                        if (ticketFilterTab === "purchased") return tkt.status === "purchased" || tkt.distributionType === "purchased";
                        if (ticketFilterTab === "distributed") return tkt.status === "distributed" || tkt.distributionType === "distributed";
                        if (ticketFilterTab === "active") return !tkt.isUsed;
                        if (ticketFilterTab === "used") return tkt.isUsed;
                        if (ticketFilterTab === "transferred") return tkt.isTransferred;
                        return true;
                      })
                      .map((tkt) => (
                      <div
                        key={tkt.id}
                        className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all shadow-md ${
                          tkt.isUsed
                            ? "bg-slate-900 text-slate-300 border-slate-800"
                            : "bg-white text-slate-900 border-[#2E7D32]/30 ring-1 ring-[#2E7D32]/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase bg-[#2E7D32] text-white px-2.5 py-0.5 rounded-full">
                                {tkt.ticketType} PASS
                              </span>
                              
                              {/* Distribution Badge */}
                              {tkt.distributionType === "distributed" || tkt.status === "distributed" ? (
                                <span className="text-[9px] font-black uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                                  🎁 Distributed Pass
                                </span>
                              ) : (
                                <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                                  💳 Purchased
                                </span>
                              )}

                              <span className="text-[10px] font-mono font-bold text-[#2E7D32]">
                                #{tkt.ticketNumber}
                              </span>
                            </div>

                            <h3 className="text-base font-black leading-snug">{tkt.eventName}</h3>
                            <p className="text-xs font-medium">👤 Holder: <strong className="text-[#2E7D32]">{tkt.attendeeName}</strong></p>
                            <p className="text-xs text-slate-500">📍 Venue: {tkt.location}</p>
                            <p className="text-xs text-slate-500">
                              📅 Date: {tkt.eventDate} @ {tkt.eventTime} (Seat/Code: {tkt.seatNumber})
                            </p>
                            {tkt.isTransferred && (
                              <p className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                                📲 Transferred from: {tkt.transferredFrom}
                              </p>
                            )}
                            {tkt.shareCount && tkt.shareCount > 0 ? (
                              <p className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                                📤 Shared {tkt.shareCount}x • Last: {tkt.lastSharedAt || "Recently"}
                              </p>
                            ) : null}
                          </div>

                          {/* QR CODE DISPLAY */}
                          <div className="p-2 bg-white rounded-2xl shrink-0 shadow-lg border border-slate-200 flex flex-col items-center">
                            <ProfessionalQrRenderer
                              value={tkt.qrCodeData}
                              size={72}
                              fgColor={tkt.qrColor || "#2E7D32"}
                              bgColor="#ffffff"
                              patternStyle="rounded"
                            />
                            <span className="text-[8px] font-mono font-bold text-slate-600 mt-1">
                              {tkt.ticketNumber}
                            </span>
                          </div>
                        </div>

                        {/* STATUS FOOTER & ACTIONS */}
                        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                          {!tkt.isUsed ? (
                            <div className="flex items-center gap-2 text-[#2E7D32] text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                              <span>Valid Pass</span>
                            </div>
                          ) : (
                            <div className="p-2 w-full bg-red-950/80 border border-red-800/80 rounded-xl text-red-200 text-[11px] font-bold flex items-center justify-between">
                              <span>🔴 REDEEMED / CHECKED IN</span>
                              <span className="text-[10px] text-red-300 font-normal">
                                {tkt.usedAt || "Scanned"}
                              </span>
                            </div>
                          )}

                          {!tkt.isUsed && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedTicketForShare(tkt);
                                  setIsShareModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-all"
                              >
                                <Share2 className="w-3.5 h-3.5 text-slate-600" /> Share Pass
                              </button>
                              <button
                                onClick={() => markTicketUsed(tkt.id)}
                                className="px-3 py-1.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                              >
                                Check In
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PERSPECTIVE C: GATE DESK SCANNER */}
            {ticketPortalMode === "scanner" && (
              <div className="space-y-6">
                {/* GATE VALIDATION SCANNER DESK */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" /> Gate Scanner & Real-Time Pass Validator
                      </h3>
                      <p className="text-xs text-slate-400">
                        Scan or enter pass code to verify authenticity and check in attendees instantly.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={validatorGate}
                        onChange={(e) => setValidatorGate(e.target.value)}
                        className="bg-slate-950 text-emerald-300 border border-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 outline-none"
                      >
                        <option value="Gate 1 - Main Entrance">Gate 1 - Main Entrance</option>
                        <option value="Gate 2 - Studio Entrance">Gate 2 - Studio Entrance</option>
                        <option value="Gate 3 - VIP Lounge">Gate 3 - VIP Lounge</option>
                      </select>

                      <button
                        onClick={() => {
                          setActiveTab("qr_scanner");
                          setIsCameraModalOpen(true);
                          showToast("📷 Launching Live Camera Scanner for Gate Validation...");
                        }}
                        className="px-3 py-1.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-white" /> Open Camera Scanner
                      </button>
                    </div>
                  </div>

                  {/* DIRECT TICKET CODE LOOKUP FORM */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Type or paste Ticket / Pass Code (e.g. CP-992102, TKT-102931)..."
                        value={organiserScanCode}
                        onChange={(e) => setOrganiserScanCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") validateTicketByCode(organiserScanCode);
                        }}
                        className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs font-black text-emerald-300 placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#2E7D32]"
                      />
                    </div>
                    <button
                      onClick={() => validateTicketByCode(organiserScanCode)}
                      className="py-3 px-6 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-lg cursor-pointer transition-all active:scale-98"
                    >
                      Validate & Check-In
                    </button>
                  </div>

                  {/* GATE STATS SUMMARY */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total Passes Issued</p>
                      <p className="text-xl font-black text-white">{tickets.length}</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Checked In</p>
                      <p className="text-xl font-black text-emerald-400">
                        {tickets.filter((t) => t.isUsed).length}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Pending Entrance</p>
                      <p className="text-xl font-black text-amber-400">
                        {tickets.filter((t) => !t.isUsed).length}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Gate Desk Staff</p>
                      <p className="text-xs font-black text-emerald-300 truncate">{activeValidatorStaff}</p>
                    </div>
                  </div>
                </div>

                {/* SCAN AUDIT LOG */}
                <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                    📜 Live Gate Validation Scan Stream
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {scanAuditLog.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              log.status === "valid"
                                ? "bg-emerald-400"
                                : log.status === "already_used"
                                ? "bg-amber-400"
                                : "bg-rose-500"
                            }`}
                          />
                          <span className="text-slate-400">{log.time}</span>
                          <span className="font-bold text-white">{log.ticketNumber}</span>
                          <span className="text-slate-300">({log.attendeeName})</span>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            log.status === "valid"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : log.status === "already_used"
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-rose-950 text-rose-300 border border-rose-800"
                          }`}
                        >
                          {log.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PERSPECTIVE D: PASS ANALYTICS */}
            {ticketPortalMode === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-1">
                    <span className="text-xs font-black text-[#2E7D32] uppercase">Total Active Events</span>
                    <p className="text-3xl font-black text-slate-900">{eventsList.length}</p>
                    <p className="text-[11px] text-slate-600 font-medium">Class passes & webinars active</p>
                  </div>
                  <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-1">
                    <span className="text-xs font-black text-[#2E7D32] uppercase">Passes Issued</span>
                    <p className="text-3xl font-black text-[#2E7D32]">{tickets.length}</p>
                    <p className="text-[11px] text-slate-600 font-medium">Distributed to users</p>
                  </div>
                  <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-1">
                    <span className="text-xs font-black text-[#2E7D32] uppercase">Redemption Rate</span>
                    <p className="text-3xl font-black text-slate-900">
                      {tickets.length > 0
                        ? `${Math.round((tickets.filter((t) => t.isUsed).length / tickets.length) * 100)}%`
                        : "0%"}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">Gate desk scans verified</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* CAMERA & GATE SCANNER HUB */}
      {/* ========================================== */}
      {activeTab === "qr_scanner" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            {/* HUB HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-2xl bg-purple-100 text-purple-700">
                    <Scan className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl font-black text-slate-900">
                    Live Camera Gate Scanner & Digital Ticket Validator
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Scan attendee QR codes via device webcam, upload ticket images, or validate passes instantly at entry gates.
                </p>
              </div>

              {/* GATE CONTROL SELECTOR & MODAL LAUNCHER */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsCameraModalOpen(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> Popup Modal Scanner
                </button>

                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 text-white">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300">Gate:</span>
                  <select
                    value={validatorGate}
                    onChange={(e) => setValidatorGate(e.target.value)}
                    className="bg-slate-950 text-amber-300 border border-slate-700 text-xs font-bold rounded-xl px-2.5 py-1 outline-none"
                  >
                    <option value="Gate 1 - Main Entrance">Gate 1 - Main Entrance</option>
                    <option value="Gate 2 - VIP Lounge">Gate 2 - VIP Lounge</option>
                    <option value="Gate 3 - Stage Area">Gate 3 - Stage Area</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MAIN TWO-COLUMN CAMERA SCANNER INTERFACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: LIVE WEBCAM VIEWFINDER & CONTROLS (7 COLS) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3 relative shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isScannerActive ? "bg-emerald-400 animate-ping" : "bg-red-500"}`} />
                      <span className="text-xs font-black text-white">
                        {isScannerActive ? "CAMERA LIVE STREAMING" : "CAMERA STANDBY"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {cameraFacingMode === "environment" ? "📷 Rear Lens" : "🤳 Front Lens"}
                    </span>
                  </div>

                  {/* WEBCAM VIDEO CONTAINER */}
                  <div className="relative bg-black rounded-2xl overflow-hidden min-h-[260px] sm:min-h-[320px] flex items-center justify-center border border-slate-800">
                    <video
                      ref={setScannerVideoRefCb}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-[280px] sm:h-[340px] object-cover"
                    />

                    {/* TARGET SCANNER OVERLAY FRAME & ANIMATED LASER */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-emerald-400/80 rounded-3xl relative shadow-[0_0_30px_rgba(52,211,153,0.3)] flex items-center justify-center">
                        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-[0_0_15px_#22d3ee]" />
                        <span className="text-[10px] font-black uppercase text-emerald-300 bg-black/60 px-3 py-1 rounded-full border border-emerald-500/40 tracking-wider">
                          Position Ticket QR Here
                        </span>
                      </div>
                    </div>

                    {/* ERROR OVERLAY IF CAMERA DENIED */}
                    {cameraErrorMsg && (
                      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs p-6 flex flex-col items-center justify-center text-center space-y-3">
                        <ShieldAlert className="w-10 h-10 text-amber-400 animate-bounce" />
                        <p className="text-xs text-slate-300 font-medium max-w-sm">{cameraErrorMsg}</p>
                        <button
                          onClick={startWebcamStream}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Re-Request Camera Permissions
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CAMERA ACTION CONTROLS */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"));
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Switch Lens
                      </button>

                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-amber-400" /> Upload QR Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const sampleTickets = ["TKT-102931", "VIP-9921", "PASS-40291"];
                              const code = sampleTickets[Math.floor(Math.random() * sampleTickets.length)];
                              handleProcessScannedCode(code);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <button
                      onClick={() => {
                        const sampleTickets = ["TKT-102931", "VIP-9921", "PASS-40291"];
                        const code = sampleTickets[Math.floor(Math.random() * sampleTickets.length)];
                        handleProcessScannedCode(code);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
                    >
                      <Camera className="w-4 h-4" /> Capture & Validate Frame
                    </button>
                  </div>
                </div>

                {/* DIRECT TICKET CODE INPUT BAR */}
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-2">
                  <span className="text-xs font-black text-slate-800 block">⌨️ Direct Code / Barcode Lookup:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type ticket code (e.g. VIP-9921, TKT-102931)..."
                      value={scannerInputCode}
                      onChange={(e) => setScannerInputCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleProcessScannedCode(scannerInputCode);
                          setScannerInputCode("");
                        }
                      }}
                      className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => {
                        handleProcessScannedCode(scannerInputCode);
                        setScannerInputCode("");
                      }}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: SCAN RESULT CARD & TICKET DETAILS (5 COLS) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 min-h-[380px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gate Scan Verification Result
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">
                        {lastScannedResult ? lastScannedResult.scannedAt : "Ready"}
                      </span>
                    </div>

                    {!lastScannedResult ? (
                      <div className="py-12 text-center space-y-3 text-slate-400">
                        <Scan className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                        <p className="text-xs font-bold">No Ticket Scanned Yet</p>
                        <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                          Position ticket QR code in camera view, upload image, or click one of the quick test passes below.
                        </p>
                      </div>
                    ) : lastScannedResult.status === "valid" ? (
                      /* VALID TICKET CARD */
                      <div className="p-4 bg-emerald-950/80 border-2 border-emerald-500/80 rounded-2xl text-white space-y-3 shadow-lg animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                            ✓
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                              VALID PASS • CHECKED IN
                            </span>
                            <h3 className="text-base font-black text-emerald-200 leading-tight mt-1">
                              {lastScannedResult.ticket?.attendeeName}
                            </h3>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-800/50 space-y-1 text-xs">
                          <p className="text-slate-300">🎟️ <strong>Ticket #:</strong> <span className="text-cyan-300 font-mono font-bold">{lastScannedResult.ticket?.ticketNumber}</span></p>
                          <p className="text-slate-300">🎪 <strong>Event:</strong> {lastScannedResult.ticket?.eventName}</p>
                          <p className="text-slate-300">📍 <strong>Venue:</strong> {lastScannedResult.ticket?.location}</p>
                          <p className="text-slate-300">🪑 <strong>Seat:</strong> {lastScannedResult.ticket?.seatNumber}</p>
                          <p className="text-slate-300">🚪 <strong>Gate:</strong> <span className="text-amber-300 font-bold">{lastScannedResult.gate}</span></p>
                        </div>

                        <p className="text-xs font-bold text-emerald-300 bg-emerald-900/60 p-2 rounded-lg border border-emerald-700/50">
                          {lastScannedResult.message}
                        </p>
                      </div>
                    ) : lastScannedResult.status === "already_used" ? (
                      /* ALREADY USED / REJECTED CARD */
                      <div className="p-4 bg-red-950/90 border-2 border-red-500/90 rounded-2xl text-white space-y-3 shadow-lg animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                            ✕
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-full">
                              REJECTED • DUPLICATE ENTRY
                            </span>
                            <h3 className="text-base font-black text-red-200 leading-tight mt-1">
                              {lastScannedResult.ticket?.attendeeName}
                            </h3>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950/80 rounded-xl border border-red-800/50 space-y-1 text-xs">
                          <p className="text-slate-300">🎟️ <strong>Ticket #:</strong> <span className="text-red-300 font-mono font-bold">{lastScannedResult.ticket?.ticketNumber}</span></p>
                          <p className="text-slate-300">⏱️ <strong>Original Check-In:</strong> <span className="text-amber-300 font-bold">{lastScannedResult.ticket?.usedAt}</span></p>
                          <p className="text-slate-300">🚪 <strong>Previous Gate:</strong> {(lastScannedResult.ticket as any)?.gateName || "Gate 1"}</p>
                        </div>

                        <p className="text-xs font-bold text-red-300 bg-red-900/60 p-2 rounded-lg border border-red-700/50">
                          {lastScannedResult.message}
                        </p>
                      </div>
                    ) : (
                      /* INVALID CODE CARD */
                      <div className="p-4 bg-amber-950/80 border-2 border-amber-500/80 rounded-2xl text-white space-y-3 shadow-lg animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shrink-0">
                            !
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                              INVALID TICKET CODE
                            </span>
                            <h3 className="text-sm font-black text-amber-200 leading-tight mt-1">
                              Code: {lastScannedResult.code}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs font-bold text-amber-300 bg-amber-900/60 p-2 rounded-lg border border-amber-700/50">
                          {lastScannedResult.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* QUICK SIMULATE ACTIVE TICKETS BUTTONS */}
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <span className="text-[11px] font-bold text-slate-400 block">⚡ Quick Test Scan Active Passes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tickets.map((tkt) => (
                        <button
                          key={tkt.id}
                          onClick={() => handleProcessScannedCode(tkt.ticketNumber)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border ${
                            tkt.isUsed
                              ? "bg-slate-800 text-slate-400 border-slate-700"
                              : "bg-purple-950 text-purple-200 border-purple-700 hover:bg-purple-900"
                          }`}
                        >
                          {tkt.isUsed ? "🔴" : "🟢"} #{tkt.ticketNumber} ({tkt.attendeeName.split(" ")[0]})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT SCAN AUDIT LOG TABLE */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" /> Real-Time Gate Scan Audit Log ({scanAuditLog.length})
                </h3>
                <span className="text-[10px] text-slate-500">Live timestamped check-in record</span>
              </div>

              <div className="divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
                {scanAuditLog.length === 0 ? (
                  <p className="p-4 text-center text-slate-400 italic">No scan logs recorded yet in this session.</p>
                ) : (
                  scanAuditLog.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{log.attendeeName}</span>
                          <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            #{log.ticketNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{log.eventName} • {log.gate} ({log.time})</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          log.status === "valid"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : log.status === "already_used"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. CERTIFICATES & CREDENTIALS BUILDER */}
      {/* ========================================== */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Certificate & Credential Generator Studio</h2>
                <p className="text-xs text-slate-500">Design awards, course completions, upload signatures, and share to social media.</p>
              </div>
            </div>

            {/* CREATOR FORM */}
            <div className="bg-amber-50/60 p-5 rounded-3xl border border-amber-200/80 space-y-3">
              <h3 className="text-xs font-black uppercase text-amber-950">Issue New Official Certificate</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Certificate Title (e.g. Elderly Care Excellence) *"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Recipient Name *"
                  value={certForm.recipientName}
                  onChange={(e) => setCertForm({ ...certForm, recipientName: e.target.value })}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Issuer Name (e.g. Dr. Bikash Thapa)"
                  value={certForm.issuerName}
                  onChange={(e) => setCertForm({ ...certForm, issuerName: e.target.value })}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Organization / Academy Name"
                  value={certForm.issuerOrganization}
                  onChange={(e) => setCertForm({ ...certForm, issuerOrganization: e.target.value })}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="date"
                  value={certForm.issueDate}
                  onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <button
                  onClick={createCertificate}
                  className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  Generate & Issue Certificate
                </button>
              </div>
            </div>

            {/* LIST OF ISSUED CERTIFICATES WITH LIVE PRINT PREVIEW */}
            <div className="grid grid-cols-1 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300/80 shadow-xl space-y-6 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-200/80 pb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                        🎓
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-amber-800 uppercase bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {cert.certificateNumber}
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">{cert.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast("📲 Sharing Certificate to WhatsApp & Social Media...")}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                      <button
                        onClick={() => showToast("📄 Downloaded Printable Certificate PDF!")}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>

                  <div className="text-center py-4 space-y-3 max-w-2xl mx-auto">
                    <p className="text-xs uppercase font-black tracking-widest text-slate-400">This is proud to certify that</p>
                    <h4 className="text-3xl font-black text-amber-900 underline decoration-amber-400/60 decoration-2">{cert.recipientName}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {cert.description || "has successfully satisfied all requirements and standards set forth by Care2Care Global Health & Technology Board."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-amber-200/80 pt-4 text-xs font-bold text-slate-700">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Issued By</p>
                      <p className="font-black text-slate-900">{cert.issuerName}</p>
                      <p className="text-[11px] text-slate-500">{cert.issuerOrganization}</p>
                    </div>

                    <div className="w-16 h-16 bg-white p-1 rounded-xl border border-amber-200 flex items-center justify-center">
                      <QrCode className="w-14 h-14 text-amber-900" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 6. COUPONS & PRIVILEGE CARDS SECTION */}
      {/* ========================================== */}
      {activeTab === "coupons" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Coupons & Privilege Pass Creator</h2>
                <p className="text-xs text-slate-500">Generate discount codes, privilege cards, and 1-time free coupons with QR validation.</p>
              </div>
            </div>

            {/* CREATE FORM */}
            <div className="bg-cyan-50/60 p-4 rounded-2xl border border-cyan-200 space-y-3">
              <h3 className="text-xs font-black uppercase text-cyan-950">Create Custom Coupon / Privilege Card</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. VIP2026) *"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Discount % or Rs. Value *"
                  value={couponVal}
                  onChange={(e) => setCouponVal(Number(e.target.value))}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <select
                  value={couponLimit}
                  onChange={(e) => setCouponLimit(Number(e.target.value))}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <option value={1}>1-Time Single Use Pass</option>
                  <option value={5}>Limited (5 Uses)</option>
                  <option value={100}>Standard (100 Uses)</option>
                  <option value={0}>Unlimited Usage</option>
                </select>
                <button
                  onClick={createCoupon}
                  className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl cursor-pointer"
                >
                  Generate Coupon
                </button>
              </div>
              <input
                type="text"
                placeholder="Description / Terms & Conditions"
                value={couponDesc}
                onChange={(e) => setCouponDesc(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            {/* SAMPLES & SAVED COUPONS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {coupons.map((cpn) => (
                <div
                  key={cpn.id}
                  className="p-5 rounded-3xl bg-gradient-to-tr from-slate-900 via-cyan-950 to-slate-900 text-white border border-cyan-800/60 shadow-xl space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-cyan-300 uppercase bg-cyan-900/60 px-3 py-1 rounded-full border border-cyan-700/50">
                      {cpn.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">
                      {cpn.maxUses === 1 ? "1-Time Pass" : cpn.maxUses === 0 ? "Unlimited" : `Max ${cpn.maxUses} Uses`}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-cyan-300">{cpn.value}% / Rs.{cpn.value} OFF</h3>
                  <p className="text-xs text-slate-300 font-medium leading-snug">{cpn.description}</p>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Redeemed</p>
                      <p className="text-xs font-black text-white">{cpn.usedCount} times</p>
                    </div>

                    <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center text-slate-900 shadow-md">
                      <QrCode className="w-12 h-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. ADVANCED QR GENERATOR */}
      {/* ========================================== */}
      {activeTab === "qr_generator" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900">Advanced Custom QR Code Generator</h2>
                <p className="text-xs text-slate-500 font-medium">Create custom branded QR codes for Patient records, Staff badges, WiFi & Document Links</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-black px-3 py-1 rounded-full border border-emerald-300">
                Custom Styling & Brand Logo Supported
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CONFIG FORM */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">QR Code Category</label>
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "patient") setQrText("https://care2care.app/patient/PT-9042");
                        else if (val === "wifi") setQrText("WIFI:S:Care2Care_Guest;T:WPA;P:Care2Care2026;;");
                        else if (val === "staff") setQrText("STAFF_ACCESS_KEY:STF-88219-VERIFIED");
                        else setQrText("https://care2care.app/document/DOC-2026-991");
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="url">🔗 Web Link / Document URL</option>
                      <option value="patient">🏥 Patient Medical File</option>
                      <option value="staff">🪪 Staff Digital Badge ID</option>
                      <option value="wifi">📶 Office Guest WiFi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">QR Title / Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Ward A Patient Log"
                      value={qrTitleInput}
                      onChange={(e) => setQrTitleInput(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">QR Data Content / URL / Text</label>
                  <textarea
                    rows={3}
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Foreground Color</label>
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-full h-10 rounded-xl cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Background Color</label>
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-full h-10 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>

                {/* THEME PRESETS SECTION */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Theme Presets
                    </label>
                    <button
                      type="button"
                      onClick={saveCurrentAsPreset}
                      className="text-[10px] font-extrabold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-300 px-2 py-0.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Save Preset
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {themePresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyThemePreset(preset)}
                        className={`py-1.5 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                          qrShape === preset.patternStyle && qrColor === preset.fgColor
                            ? "bg-slate-900 text-white border-slate-800 shadow-xs ring-2 ring-emerald-400/40"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${preset.badgeColor}`} />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Foreground Color</label>
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-full h-10 rounded-xl cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Background Color</label>
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-full h-10 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>

                {/* CUSTOM PHOTO UPLOAD SECTION */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" /> Custom Photo Upload
                    </label>
                    <span className="text-[10px] text-slate-500 font-semibold">Center Logo / Photo</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {qrLogoUrl ? (
                        <img src={qrLogoUrl} alt="Center Photo" className="w-8 h-8 rounded-lg object-cover border border-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Upload className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-xs truncate">
                        <span className="font-extrabold text-slate-800 block truncate">
                          {qrLogoUrl ? "Custom Photo Attached" : "Embed Center Logo/Pic"}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          Appears in center box of generated QR
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black cursor-pointer flex items-center gap-1 transition-all active:scale-95">
                        <Upload className="w-3 h-3" />
                        {qrLogoUrl ? "Change Photo" : "Upload Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {qrLogoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setQrLogoUrl(undefined);
                            showToast("Cleared center custom photo");
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-[10px] font-bold cursor-pointer"
                          title="Remove Custom Photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD BACKGROUND GALLERY & CUSTOM PIC UPLOAD */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-indigo-600" /> Card Frame Background Gallery
                    </label>
                    <span className="text-[10px] text-indigo-600 font-extrabold capitalize bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Frame: {qrCardFrame.replace("-", " ")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: "clean", label: "Clean Canvas", style: "border-slate-300 bg-white" },
                      { id: "hospital-pass", label: "Hospital Pass", style: "border-emerald-500 bg-emerald-50 text-emerald-900" },
                      { id: "medical-badge", label: "Medical Badge", style: "border-indigo-500 bg-indigo-50 text-indigo-900" },
                      { id: "emergency-id", label: "Emergency Card", style: "border-rose-500 bg-rose-50 text-rose-900" },
                      { id: "vip-certificate", label: "Care Certificate", style: "border-amber-500 bg-amber-50 text-amber-900" }
                    ].map((frame) => (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => {
                          setQrCardFrame(frame.id as any);
                          showToast(`Card Frame set to ${frame.label}`);
                        }}
                        className={`py-2 px-1 text-[10px] rounded-xl font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center active:scale-95 ${
                          qrCardFrame === frame.id
                            ? "bg-slate-900 text-white border-slate-900 font-black shadow-xs ring-2 ring-indigo-400"
                            : `${frame.style} hover:opacity-90`
                        }`}
                      >
                        {frame.label}
                      </button>
                    ))}
                  </div>

                  {/* CUSTOM PIC UPLOAD BUTTON FOR CARD FRAME BACKGROUND */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {qrFrameBgImage ? (
                        <img src={qrFrameBgImage} alt="Frame BG" className="w-8 h-8 rounded-lg object-cover border border-indigo-400 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Image className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-xs truncate">
                        <span className="font-extrabold text-slate-800 block truncate">
                          {qrFrameBgImage ? "Custom Frame Pic Applied" : "Upload Custom Frame BG Pic"}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          Custom background picture for QR card frame
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black cursor-pointer flex items-center gap-1 transition-all active:scale-95">
                        <Upload className="w-3 h-3" />
                        {qrFrameBgImage ? "Change BG Pic" : "Upload Frame BG Pic"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFrameBgUpload}
                          className="hidden"
                        />
                      </label>
                      {qrFrameBgImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setQrFrameBgImage(undefined);
                            showToast("Cleared frame custom background picture");
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-[10px] font-bold cursor-pointer"
                          title="Remove Frame Background Picture"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">QR Data Pattern Style</label>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Active: {qrShape}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {(["square", "rounded", "dots", "classy", "extra-rounded"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setQrShape(s);
                          showToast(`Pattern updated to ${s}`);
                        }}
                        className={`py-2.5 px-1.5 text-xs rounded-xl font-bold border capitalize cursor-pointer transition-all ${
                          qrShape === s
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800 font-black shadow-sm ring-2 ring-emerald-500/30"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Corner Eye Frame Shape</label>
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Eye: {qrEyeStyle}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["square", "rounded", "circle"] as const).map((eye) => (
                      <button
                        key={eye}
                        type="button"
                        onClick={() => {
                          setQrEyeStyle(eye);
                          showToast(`Eye style updated to ${eye}`);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold border capitalize cursor-pointer transition-all ${
                          qrEyeStyle === eye
                            ? "bg-indigo-950 text-indigo-300 border-indigo-800 font-black shadow-sm ring-2 ring-indigo-500/30"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {eye}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Error Correction Level (Readability)</label>
                    <span className="text-[10px] font-black uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      ECC: Level {qrLevel}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { code: "L", label: "Low (7%)" },
                      { code: "M", label: "Medium (15%)" },
                      { code: "Q", label: "Quartile (25%)" },
                      { code: "H", label: "High (30%)" },
                    ].map((lvl) => (
                      <button
                        key={lvl.code}
                        type="button"
                        onClick={() => {
                          setQrLevel(lvl.code as QrErrorCorrectionLevel);
                          showToast(`ECC level set to ${lvl.code}`);
                        }}
                        className={`py-2 px-1 text-[11px] rounded-xl font-bold border cursor-pointer transition-all ${
                          qrLevel === lvl.code
                            ? "bg-teal-950 text-teal-300 border-teal-800 font-black shadow-sm ring-2 ring-teal-500/30"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                        title={`Error correction ${lvl.label}`}
                      >
                        {lvl.code} ({lvl.label.split(" ")[1]})
                      </button>
                    ))}
                  </div>
                </div>

                {/* CREATE & SAVE QR CODE ACTION BUTTON */}
                <button
                  type="button"
                  onClick={() => saveCurrentQr()}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Save className="w-4 h-4" /> Save & Register Custom QR Code
                </button>
              </div>

              {/* LIVE QR PREVIEW CARD WITH REAL VECTOR PATTERN & TRANSITION ANIMATION */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
                <div
                  className={`p-5 rounded-3xl shadow-xl border flex flex-col items-center justify-center space-y-3 relative group transition-all duration-300 transform animate-in fade-in zoom-in-95 hover:scale-[1.02] ${
                    qrCardFrame === "hospital-pass"
                      ? "bg-gradient-to-b from-emerald-500/10 via-white to-emerald-500/5 border-emerald-300 ring-4 ring-emerald-500/20"
                      : qrCardFrame === "medical-badge"
                      ? "bg-gradient-to-b from-indigo-500/10 via-white to-indigo-500/5 border-indigo-300 ring-4 ring-indigo-500/20"
                      : qrCardFrame === "emergency-id"
                      ? "bg-gradient-to-b from-rose-500/10 via-white to-rose-500/5 border-rose-300 ring-4 ring-rose-500/20"
                      : qrCardFrame === "vip-certificate"
                      ? "bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 border-amber-300 ring-4 ring-amber-500/20"
                      : "border-slate-200"
                  }`}
                  style={{
                    backgroundColor: qrCardFrame === "clean" && !qrFrameBgImage ? qrBgColor : undefined,
                    backgroundImage: qrFrameBgImage ? `url(${qrFrameBgImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  {/* Card Frame Header Badge */}
                  {qrCardFrame !== "clean" && (
                    <div className="w-full text-center pb-2 border-b border-slate-200/60 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">
                        {qrCardFrame.replace("-", " ")}
                      </span>
                    </div>
                  )}

                  <div className="transition-transform duration-300 transform group-hover:scale-[1.01]">
                    <ProfessionalQrRenderer
                      key={`${qrShape}-${qrEyeStyle}-${qrLevel}-${qrColor}-${qrBgColor}-${qrText}-${qrLogoUrl}-${qrCardFrame}`}
                      value={qrText}
                      size={220}
                      fgColor={qrColor}
                      bgColor={qrBgColor}
                      level={qrLevel}
                      patternStyle={qrShape}
                      eyeStyle={qrEyeStyle}
                      showLogo={true}
                      logoUrl={qrLogoUrl}
                      showActionButtons={true}
                    />
                  </div>

                  <div className="text-center pt-1">
                    <span className="text-[11px] font-black uppercase tracking-wider block" style={{ color: qrColor }}>
                      {qrTitleInput || "Care2Care Verified QR"}
                    </span>
                    <span className="text-[9px] font-bold opacity-75 max-w-[200px] truncate block" style={{ color: qrColor }}>
                      {qrText}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SAVED QR CODES REPOSITORY */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Saved QR Codes Library ({savedQrList.length})
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">
                  Click any card to load or re-edit styling
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {savedQrList.map((qrItem) => (
                  <div
                    key={qrItem.id}
                    onClick={() => {
                      setQrText(qrItem.value);
                      setQrTitleInput(qrItem.title);
                      setQrColor(qrItem.fgColor);
                      setQrBgColor(qrItem.bgColor);
                      setQrShape(qrItem.patternStyle);
                      setQrEyeStyle(qrItem.eyeStyle);
                      setQrLevel(qrItem.level);
                      showToast(`⚡ Loaded "${qrItem.title}" settings!`);
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 hover:border-emerald-500 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-black shrink-0 group-hover:scale-110 transition-transform">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div className="text-xs overflow-hidden">
                        <h4 className="font-extrabold text-slate-900 truncate">{qrItem.title}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          Style: {qrItem.patternStyle} • {qrItem.eyeStyle} eye
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const remaining = savedQrList.filter((q) => q.id !== qrItem.id);
                        setSavedQrList(remaining);
                        localStorage.setItem("care2care_saved_qrs", JSON.stringify(remaining));
                        showToast(`Removed "${qrItem.title}"`);
                      }}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer shrink-0"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 6. DIGITAL SIGNATURE CANVAS & THUMB STAMP */}
      {/* ========================================== */}
      {activeTab === "signatures" && (
        <div className="space-y-6">
          {/* DIGITAL SIGNATURE CANVAS WITH BACK / FORWARD UNDO REDO */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Digital Canvas Signature</h2>
                <p className="text-xs text-slate-500">Draw signature with back/forward undo controls to bind to documents.</p>
              </div>

              {/* BACK / FORWARD BUTTONS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    clearCanvas();
                    showToast("↩️ Undo: Reverted stroke");
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  ◀️ Back
                </button>
                <button
                  onClick={() => {
                    showToast("▶️ Forward: Restored stroke");
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  Forward ▶️
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <canvas
                ref={canvasRef}
                width={500}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl cursor-crosshair w-full max-w-lg touch-none"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Clear Canvas
                </button>
                <button
                  onClick={saveSignatureFromCanvas}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Signature
                </button>
              </div>

              {savedSignature && (
                <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-500">Currently Stored Digital Signature:</p>
                  <img
                    src={savedSignature}
                    alt="Saved Signature"
                    className="h-16 mx-auto border border-slate-200 bg-white p-2 rounded-xl shadow-xs"
                  />
                </div>
              )}
            </div>
          </div>

          {/* TWO BOX THUMB STAMP CAMERA CAPTURE SECTION */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Thumb Print Stamp Capture (Side-by-Side)</h2>
              <p className="text-xs text-slate-500">
                Click a box to launch camera or upload photo of your stamped thumb print on white paper.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* LEFT THUMB BOX */}
              <div className="p-5 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-3 relative">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  👈 LEFT THUMB STAMP
                </span>

                {leftThumbStamp ? (
                  <div className="space-y-2">
                    <img src={leftThumbStamp} alt="Left Thumb" className="w-28 h-28 object-contain bg-white rounded-2xl p-2 border border-slate-200 shadow-md" />
                    <button
                      onClick={() => {
                        setLeftThumbStamp(null);
                        localStorage.removeItem("c2c_stamp_left");
                      }}
                      className="text-[11px] font-bold text-red-600 hover:underline"
                    >
                      Remove Stamp
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center space-y-2 py-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black shadow-xs">
                      📷
                    </div>
                    <span className="text-xs font-bold text-slate-700">Click to Capture / Upload Left Thumb Stamp</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleThumbUpload("left", e.target.files[0]);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* RIGHT THUMB BOX */}
              <div className="p-5 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-3 relative">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  👉 RIGHT THUMB STAMP
                </span>

                {rightThumbStamp ? (
                  <div className="space-y-2">
                    <img src={rightThumbStamp} alt="Right Thumb" className="w-28 h-28 object-contain bg-white rounded-2xl p-2 border border-slate-200 shadow-md" />
                    <button
                      onClick={() => {
                        setRightThumbStamp(null);
                        localStorage.removeItem("c2c_stamp_right");
                      }}
                      className="text-[11px] font-bold text-red-600 hover:underline"
                    >
                      Remove Stamp
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center space-y-2 py-4">
                    <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-black shadow-xs">
                      📷
                    </div>
                    <span className="text-xs font-bold text-slate-700">Click to Capture / Upload Right Thumb Stamp</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleThumbUpload("right", e.target.files[0]);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================== */}
      {/* MODAL 1: CREATE EVENT / CLASS PASS MODAL */}
      {/* ========================================== */}
      {isCreateEventModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎟️</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Create Event or Class Pass</h3>
                  <p className="text-xs text-slate-500">Define ticket limits, pre-paid passes, venue & perks.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateEventModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Care2Care Yoga & Wellness 10-Session Pass"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newEventForm.category}
                    onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  >
                    <option value="Class Pass">Class Pass (Pre-paid / Sessions)</option>
                    <option value="Concert">Concert / Musical</option>
                    <option value="Seminar">Seminar / Conference</option>
                    <option value="Workshop">Workshop / Training</option>
                    <option value="Sports">Sports / Fitness</option>
                    <option value="Party">Party / Celebration</option>
                    <option value="General">General Ticket</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue / Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Care2Care Studio, Lazimpat"
                    value={newEventForm.venue}
                    onChange={(e) => setNewEventForm({ ...newEventForm, venue: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM"
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>
              </div>

              {/* CAPACITY QUANTITY LIMIT CONTROLS */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#2E7D32]">Pass Quantity Limit Type:</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 cursor-pointer font-bold text-slate-800">
                      <input
                        type="radio"
                        name="qtyType"
                        checked={newEventForm.quantityType === "limited"}
                        onChange={() => setNewEventForm({ ...newEventForm, quantityType: "limited" })}
                        className="accent-[#2E7D32]"
                      />
                      Limited Number Input
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer font-bold text-slate-800">
                      <input
                        type="radio"
                        name="qtyType"
                        checked={newEventForm.quantityType === "unlimited"}
                        onChange={() => setNewEventForm({ ...newEventForm, quantityType: "unlimited" })}
                        className="accent-[#2E7D32]"
                      />
                      Unlimited
                    </label>
                  </div>
                </div>

                {newEventForm.quantityType === "limited" && (
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">Set Custom Quantity Limit (Number of Tickets):</label>
                    <input
                      type="number"
                      min={1}
                      max={100000}
                      value={newEventForm.totalQuantity}
                      onChange={(e) => setNewEventForm({ ...newEventForm, totalQuantity: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl font-black text-slate-900 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
                    />
                    <p className="text-[10px] text-slate-500">
                      Organiser cannot distribute more passes than this custom limit.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Benefits / Features (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Studio Access, Free Mat Usage, Instructor Guidance"
                  value={newEventForm.benefits}
                  onChange={(e) => setNewEventForm({ ...newEventForm, benefits: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Additional terms or instructions..."
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setIsCreateEventModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrganiserEvent}
                className="px-5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Publish Event / Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: DISTRIBUTE / ISSUE PASS MODAL */}
      {/* ========================================== */}
      {isDistributeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Distribute Pass to Buyer</h3>
                  <p className="text-xs text-slate-500">Directly issue pre-paid pass or class pass to attendee.</p>
                </div>
              </div>
              <button
                onClick={() => setIsDistributeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Event / Class Pass *</label>
                <select
                  value={selectedEventForDistribute?.id || ""}
                  onChange={(e) => {
                    const evt = eventsList.find((item) => item.id === e.target.value);
                    if (evt) setSelectedEventForDistribute(evt);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                >
                  {eventsList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({e.quantityType === "unlimited" ? "Unlimited" : `${e.issuedCount}/${e.totalQuantity} Limit`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient / Buyer Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sita Sharma"
                  value={distributeForm.recipientName}
                  onChange={(e) => setDistributeForm({ ...distributeForm, recipientName: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number or Email</label>
                <input
                  type="text"
                  placeholder="e.g. +977-9841234567"
                  value={distributeForm.recipientContact}
                  onChange={(e) => setDistributeForm({ ...distributeForm, recipientContact: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Seat Code / Pass Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. Class Pass #12 or Row A-05"
                  value={distributeForm.seatCode}
                  onChange={(e) => setDistributeForm({ ...distributeForm, seatCode: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setIsDistributeModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDistributePassToUser}
                className="px-5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Confirm & Issue Digital Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: TRANSFER / SHARE TICKET MODAL */}
      {/* ========================================== */}
      {isTransferModalOpen && selectedTicketForTransfer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📲</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Transfer Pass to Friend</h3>
                  <p className="text-xs text-slate-500">Pass #{selectedTicketForTransfer.ticketNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <p className="font-black text-[#2E7D32]">{selectedTicketForTransfer.eventName}</p>
              <p className="text-slate-600">Current Holder: {selectedTicketForTransfer.attendeeName}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Recipient Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh KC"
                  value={transferForm.newOwnerName}
                  onChange={(e) => setTransferForm({ ...transferForm, newOwnerName: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Phone / Email</label>
                <input
                  type="text"
                  placeholder="e.g. ramesh@example.com"
                  value={transferForm.newOwnerContact}
                  onChange={(e) => setTransferForm({ ...transferForm, newOwnerContact: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTransferTicket}
                className="px-5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Transfer Pass Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 4: CLAIM PASS CODE MODAL */}
      {/* ========================================== */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔑</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Claim Pass Code</h3>
                  <p className="text-xs text-slate-500">Enter invite code or class pass voucher code.</p>
                </div>
              </div>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Enter Pass Code / Voucher *</label>
                <input
                  type="text"
                  placeholder="e.g. CARE2CARE-PASS-CODE:evt-1"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast("🎉 Pass Code Claimed! Pass added to your Attendee Wallet.");
                  setIsClaimModalOpen(false);
                }}
                className="px-5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Claim Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 5: BULK BATCH TICKET GENERATION MODAL */}
      {/* ========================================== */}
      {isBulkGenerateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Batch Generate Unique Tickets</h3>
                  <p className="text-xs text-slate-500">Generate multiple passes with custom limits & unique IDs.</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkGenerateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Event / Class Pass *</label>
                <select
                  value={bulkGenerateForm.eventId}
                  onChange={(e) => setBulkGenerateForm({ ...bulkGenerateForm, eventId: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                >
                  <option value="">-- Choose Event --</option>
                  {eventsList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} (Cap: {e.quantityType === "unlimited" ? "Unlimited" : e.totalQuantity - e.issuedCount + " left"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Pass Count *</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={bulkGenerateForm.batchCount}
                    onChange={(e) => setBulkGenerateForm({ ...bulkGenerateForm, batchCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-black text-purple-700 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Limit per Event</label>
                  <input
                    type="number"
                    min={1}
                    value={bulkGenerateForm.customLimit}
                    onChange={(e) => setBulkGenerateForm({ ...bulkGenerateForm, customLimit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attendee Name Prefix</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Attendee, Yoga Student"
                  value={bulkGenerateForm.recipientPrefix}
                  onChange={(e) => setBulkGenerateForm({ ...bulkGenerateForm, recipientPrefix: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Distribution Status Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkGenerateForm({ ...bulkGenerateForm, distributionType: "distributed" })}
                    className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                      bulkGenerateForm.distributionType === "distributed"
                        ? "bg-purple-100 border-purple-400 text-purple-900 font-black shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    🎁 Distributed Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkGenerateForm({ ...bulkGenerateForm, distributionType: "purchased" })}
                    className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                      bulkGenerateForm.distributionType === "purchased"
                        ? "bg-emerald-100 border-emerald-400 text-emerald-900 font-black shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    💳 Purchased Ticket
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setIsBulkGenerateModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkGenerateTickets}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" /> Generate {bulkGenerateForm.batchCount} Passes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 6: PASS SHARING & DISPATCH MODAL */}
      {/* ========================================== */}
      {isShareModalOpen && selectedTicketForShare && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-[#2E7D32]">
                  <Share2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Share Pass / Transfer</h3>
                  <p className="text-xs text-slate-500">Dispatch digital pass to attendee or friend.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsShareModalOpen(false);
                  setSelectedTicketForShare(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TICKET DETAILS PREVIEW CARD */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-[#2E7D32] text-white px-2.5 py-0.5 rounded-full">
                  #{selectedTicketForShare.ticketNumber}
                </span>
                {selectedTicketForShare.distributionType === "distributed" ? (
                  <span className="text-[10px] font-black bg-purple-900 text-purple-200 px-2 py-0.5 rounded-md border border-purple-700">
                    🎁 Distributed Pass
                  </span>
                ) : (
                  <span className="text-[10px] font-black bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-700">
                    💳 Purchased Ticket
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-black text-white">{selectedTicketForShare.eventName}</h4>
                <p className="text-xs text-slate-300">👤 Holder: {selectedTicketForShare.attendeeName}</p>
                <p className="text-xs text-slate-400">📅 {selectedTicketForShare.eventDate} @ {selectedTicketForShare.eventTime}</p>
              </div>

              {selectedTicketForShare.shareCount && selectedTicketForShare.shareCount > 0 ? (
                <p className="text-[10px] text-amber-300 font-mono">
                  📤 Shared {selectedTicketForShare.shareCount} times (Last: {selectedTicketForShare.lastSharedAt || "Just now"})
                </p>
              ) : null}
            </div>

            {/* MULTI-CHANNEL SHARE ACTION BUTTONS */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">Select Sharing Channel:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleShareTicket(selectedTicketForShare, "copy")}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <Copy className="w-4 h-4 text-slate-600" /> Copy Pass Code
                </button>

                <button
                  onClick={() => handleShareTicket(selectedTicketForShare, "whatsapp")}
                  className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Send className="w-4 h-4 text-white" /> WhatsApp
                </button>

                <button
                  onClick={() => handleShareTicket(selectedTicketForShare, "email")}
                  className="p-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-2xl cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  ✉️ Email Invite
                </button>

                <button
                  onClick={() => handleShareTicket(selectedTicketForShare, "native")}
                  className="p-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-2xl cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Share2 className="w-4 h-4 text-white" /> Share Via Phone
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end border-t border-slate-100">
              <button
                onClick={() => {
                  setIsShareModalOpen(false);
                  setSelectedTicketForShare(null);
                }}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP CAMERA SCANNER MODAL */}
      <CameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        initialMode="qr"
        onScanQrCode={(code) => handleProcessScannedCode(code)}
      />
    </div>
  );
};
