// ============================================================
// src/services/serviceSetupService.ts
// Service Choice, Configuration & Preset Setup Engine for All Services
// ============================================================

import { ServiceSetupConfig, ServiceFeatureToggle, ServiceCustomOption } from "../types";

const SERVICE_CONFIG_PREFIX = "care2care_service_config_";

export const DEFAULT_SERVICES_SETUP: Record<string, ServiceSetupConfig> = {
  water: {
    serviceId: "water",
    serviceName: "Water & Hydration Notifier",
    presetTemplate: "balanced",
    isEnabled: true,
    features: [
      { id: "reminders", name: "Interval Drink Reminders", description: "Send automated alerts every 1-2 hours", enabled: true },
      { id: "dehydration_alert", name: "Dehydration Warning", description: "Flag when no water is logged for over 4 hours", enabled: true },
      { id: "cup_presets", name: "Quick Cup Presets", description: "Buttons for 250ml, 500ml, 750ml, 1L", enabled: true },
      { id: "sound_effects", name: "Gulp Audio Feedback", description: "Play audio feedback when water is logged", enabled: true },
      { id: "weather_sync", name: "Weather-based Goal Auto-Adjust", description: "Increase target during warm days", enabled: false },
    ],
    customOptions: [
      { id: "dailyGoalMl", label: "Daily Target Volume", type: "number", value: 3000, unit: "ml" },
      { id: "reminderIntervalMins", label: "Reminder Interval", type: "number", value: 60, unit: "mins" },
      { id: "defaultCupMl", label: "Default Cup Size", type: "number", value: 250, unit: "ml" },
    ],
    reminderFrequency: "daily",
    notificationChannels: { inApp: true, sound: true, push: true, sms: false, email: false },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },

  medicine: {
    serviceId: "medicine",
    serviceName: "Medicine & Prescription Reminder",
    presetTemplate: "comprehensive",
    isEnabled: true,
    features: [
      { id: "pill_photo_proof", name: "Require Photo Verification", description: "Require a photo before marking medicine as taken", enabled: false },
      { id: "caregiver_alert", name: "Notify Caregiver on Missed Dose", description: "Alert primary emergency contact if dose is delayed by 30m", enabled: true },
      { id: "refill_tracker", name: "Low Pill Count Refill Alerts", description: "Remind to restock when pills fall below 5 doses", enabled: true },
      { id: "interaction_checker", name: "Drug Interaction Warning", description: "Check potential contraindications", enabled: true },
    ],
    customOptions: [
      { id: "gracePeriodMins", label: "Dose Grace Period", type: "number", value: 30, unit: "mins" },
      { id: "refillThreshold", label: "Refill Warning Threshold", type: "number", value: 5, unit: "pills" },
    ],
    reminderFrequency: "realtime",
    notificationChannels: { inApp: true, sound: true, push: true, sms: true, email: false },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },

  finance: {
    serviceId: "finance",
    serviceName: "Finance & Budgeting Tracker",
    presetTemplate: "power_user",
    isEnabled: true,
    features: [
      { id: "receipt_scanner", name: "AI Receipt Camera Scanner", description: "Extract expense amounts from photos", enabled: true },
      { id: "budget_caps", name: "Category Budget Cap Alerts", description: "Alert when spending reaches 80% of budget limit", enabled: true },
      { id: "recurring_bills", name: "Recurring Subscription Reminders", description: "Upcoming bill payment notifications", enabled: true },
      { id: "currency_converter", name: "Multi-Currency Exchange", description: "Support international conversions", enabled: true },
    ],
    customOptions: [
      { id: "currencySymbol", label: "Primary Currency", type: "select", value: "USD ($)", options: ["USD ($)", "EUR (€)", "GBP (£)", "INR (₹)", "NPR (रू)", "JPY (¥)"] },
      { id: "monthlyBudgetCap", label: "Overall Monthly Budget Cap", type: "number", value: 2500, unit: "$" },
    ],
    reminderFrequency: "daily",
    notificationChannels: { inApp: true, sound: false, push: true, sms: false, email: true },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },

  garden: {
    serviceId: "garden",
    serviceName: "Garden & Farm Tracker",
    presetTemplate: "balanced",
    isEnabled: true,
    features: [
      { id: "irrigation_alerts", name: "Smart Irrigation Schedules", description: "Watering alerts based on crop species", enabled: true },
      { id: "pest_journal", name: "Pest & Disease Diagnosis Log", description: "Track photos and treatments of crop issues", enabled: true },
      { id: "harvest_yield", name: "Harvest Yield Analytics", description: "Log total weight harvested per crop plot", enabled: true },
      { id: "fertilizer_reminders", name: "Organic Fertilizer Schedule", description: "Timely alerts for compost and nutrients", enabled: true },
    ],
    customOptions: [
      { id: "measurementUnit", label: "Area Unit", type: "select", value: "Sq Feet", options: ["Sq Feet", "Acres", "Hectares", "Ropani / Bigha"] },
      { id: "defaultWateringTime", label: "Preferred Watering Time", type: "text", value: "07:00 AM" },
    ],
    reminderFrequency: "daily",
    notificationChannels: { inApp: true, sound: true, push: true, sms: false, email: false },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },

  nutrition: {
    serviceId: "nutrition",
    serviceName: "Nutrition & Food Log",
    presetTemplate: "balanced",
    isEnabled: true,
    features: [
      { id: "macro_breakdown", name: "Macro-Nutrient Pie Chart", description: "Protein, Carbs, and Fats visualizer", enabled: true },
      { id: "barcode_scanner", name: "Food Barcode Reader", description: "Instant lookup for packaged nutrition info", enabled: true },
      { id: "fasting_timer", name: "Intermittent Fasting Clock", description: "16:8 or 12:12 fasting window counter", enabled: false },
    ],
    customOptions: [
      { id: "targetCalories", label: "Daily Calorie Target", type: "number", value: 2200, unit: "kcal" },
      { id: "targetProtein", label: "Daily Protein Target", type: "number", value: 120, unit: "g" },
    ],
    reminderFrequency: "daily",
    notificationChannels: { inApp: true, sound: false, push: true, sms: false, email: false },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },

  inventory: {
    serviceId: "inventory",
    serviceName: "Inventory & Stock Manager",
    presetTemplate: "business",
    isEnabled: true,
    features: [
      { id: "low_stock_warning", name: "Low Stock Alert Notifications", description: "Highlight items near minimum safety threshold", enabled: true },
      { id: "expiry_tracker", name: "Perishable Expiry Date Counter", description: "Warn 7 days before goods expire", enabled: true },
      { id: "supplier_directory", name: "Vendor Contact Directory", description: "Quick re-order contact phone and email", enabled: true },
      { id: "barcode_tagging", name: "SKU Barcode Generator", description: "Generate printable barcode stickers", enabled: true },
    ],
    customOptions: [
      { id: "expiryWarningDays", label: "Expiry Warning Buffer", type: "number", value: 7, unit: "days" },
      { id: "lowStockThreshold", label: "Default Low Stock Cutoff", type: "number", value: 10, unit: "units" },
    ],
    reminderFrequency: "daily",
    notificationChannels: { inApp: true, sound: true, push: true, sms: false, email: true },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },

  sos: {
    serviceId: "sos",
    serviceName: "SOS & Emergency Safety Service",
    presetTemplate: "high_priority",
    isEnabled: true,
    features: [
      { id: "one_tap_sos", name: "One-Tap Instant SOS Siren", description: "Loud audio siren + instant GPS location broadcast", enabled: true },
      { id: "sms_broadcast", name: "Emergency SMS Contact Broadcast", description: "Sends SMS to up to 3 emergency contacts", enabled: true },
      { id: "fall_detection", name: "Shake/Fall Emergency Trigger", description: "Auto-trigger SOS when device is shaken heavily", enabled: false },
      { id: "live_gps_share", name: "Live GPS Location Sharing", description: "Continuous tracking link sent to family", enabled: true },
    ],
    customOptions: [
      { id: "sosCountdownSecs", label: "SOS Cancellation Countdown", type: "number", value: 5, unit: "seconds" },
      { id: "sirenVolume", label: "Siren Audio Level", type: "select", value: "Maximum (100%)", options: ["Maximum (100%)", "Medium (50%)", "Mute Siren (Silent Alert)"] },
    ],
    reminderFrequency: "realtime",
    notificationChannels: { inApp: true, sound: true, push: true, sms: true, email: true },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },

  calendar: {
    serviceId: "calendar",
    serviceName: "Multi-Calendar & Festival Converter",
    presetTemplate: "cultural",
    isEnabled: true,
    features: [
      { id: "festival_reminders", name: "Cultural Festival & Holiday Alerts", description: "Notifications for Nepal Sambat, Vikram Sambat, Hijri, Lunar festivals", enabled: true },
      { id: "live_conversion", name: "Real-time Date Converter Matrix", description: "Convert between 10+ global calendar systems", enabled: true },
      { id: "horoscope_panchang", name: "Panchang & Tithi Calculator", description: "Daily astrological and lunar phase indicators", enabled: true },
    ],
    customOptions: [
      { id: "primaryCalendar", label: "Primary Calendar System", type: "select", value: "Gregorian (AD)", options: ["Gregorian (AD)", "Vikram Sambat (BS)", "Nepal Sambat (NS)", "Islamic Hijri (AH)", "Chinese Lunar"] },
    ],
    reminderFrequency: "daily",
    notificationChannels: { inApp: true, sound: false, push: true, sms: false, email: false },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },

  menstrual: {
    serviceId: "menstrual",
    serviceName: "Menstrual Health & Cycle Care",
    presetTemplate: "comprehensive",
    isEnabled: true,
    features: [
      { id: "cycle_prediction", name: "AI Ovulation & Period Forecast", description: "Predict upcoming cycle start and fertile windows", enabled: true },
      { id: "symptom_mood_log", name: "Symptom & Mood Journal", description: "Track cramps, headache, fatigue, cravings", enabled: true },
      { id: "partner_sharing", name: "Private Partner Notification", description: "Optionally share cycle status with partner", enabled: false },
      { id: "privacy_lock", name: "PIN / Biometric Lock Screen", description: "Secure private cycle health data", enabled: true },
    ],
    customOptions: [
      { id: "avgCycleDays", label: "Average Cycle Duration", type: "number", value: 28, unit: "days" },
      { id: "avgPeriodDays", label: "Average Period Duration", type: "number", value: 5, unit: "days" },
    ],
    reminderFrequency: "daily",
    notificationChannels: { inApp: true, sound: false, push: true, sms: false, email: false },
    storageMode: "hybrid",
    updatedAt: new Date().toISOString(),
  },
};

export class ServiceSetupService {
  private static instance: ServiceSetupService;

  public static getInstance(): ServiceSetupService {
    if (!ServiceSetupService.instance) {
      ServiceSetupService.instance = new ServiceSetupService();
    }
    return ServiceSetupService.instance;
  }

  public getServiceConfig(serviceId: string): ServiceSetupConfig {
    try {
      const saved = localStorage.getItem(`${SERVICE_CONFIG_PREFIX}${serviceId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(`Error loading setup config for service ${serviceId}:`, e);
    }

    if (DEFAULT_SERVICES_SETUP[serviceId]) {
      return DEFAULT_SERVICES_SETUP[serviceId];
    }

    // Generic fallback config
    return {
      serviceId,
      serviceName: `${serviceId.toUpperCase()} Service`,
      presetTemplate: "balanced",
      isEnabled: true,
      features: [
        { id: "daily_logging", name: "Daily Entry Logging", description: "Enable regular tracking entries", enabled: true },
        { id: "automated_alerts", name: "Automated Reminders", description: "Push notifications on schedule", enabled: true },
        { id: "analytics_charts", name: "Progress Analytics", description: "Charts and monthly summaries", enabled: true },
      ],
      customOptions: [
        { id: "dailyTarget", label: "Daily Goal Target", type: "number", value: 10, unit: "units" },
      ],
      reminderFrequency: "daily",
      notificationChannels: { inApp: true, sound: true, push: true, sms: false, email: false },
      storageMode: "hybrid",
      updatedAt: new Date().toISOString(),
    };
  }

  public saveServiceConfig(config: ServiceSetupConfig): void {
    config.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(`${SERVICE_CONFIG_PREFIX}${config.serviceId}`, JSON.stringify(config));
    } catch (e) {
      console.error(`Failed to save setup config for ${config.serviceId}:`, e);
    }
  }

  public applyPresetTemplate(serviceId: string, template: "basic" | "comprehensive" | "caregiver" | "minimal"): ServiceSetupConfig {
    const config = this.getServiceConfig(serviceId);
    config.presetTemplate = template;

    if (template === "minimal") {
      config.features.forEach((f) => (f.enabled = f.id.includes("reminder") || f.id.includes("one_tap")));
    } else if (template === "comprehensive") {
      config.features.forEach((f) => (f.enabled = true));
    } else if (template === "basic") {
      config.features.forEach((f, idx) => (f.enabled = idx < 2));
    }

    this.saveServiceConfig(config);
    return config;
  }
}

export const serviceSetup = ServiceSetupService.getInstance();
