import { FinancialRecord, Medication, VitalSign, WaterLog, Patient } from "../types";

export type ServiceType =
  | "expense"
  | "prescription"
  | "pet_care"
  | "retail_sale"
  | "employee_clockin"
  | "vehicle_mileage"
  | "vital_log"
  | "water_log"
  | "custom";

export interface QuickAddTemplate {
  id: string;
  userId: string;
  serviceType: ServiceType;
  templateName: string;
  hiddenPayload: Record<string, any>;
  visibleFields: string[]; // e.g. ['amount', 'description', 'date', 'merchant', 'dosage_taken', etc.]
  isReminderEnabled?: boolean;
  reminderTime?: string;
  createdAt: string;
}

export interface PendingReviewItem {
  id: string;
  userId: string;
  serviceType: string;
  templateId: string;
  templateName: string;
  draftPayload: Record<string, any>;
  flaggedReason: string;
  status: "draft" | "reviewed" | "dismissed";
  createdAt: string;
}

// Built-in starter templates across all services
export const DEFAULT_QUICK_ADD_TEMPLATES: QuickAddTemplate[] = [
  {
    id: "tpl-subcontractor-payout",
    userId: "usr-default",
    serviceType: "expense",
    templateName: "Subcontractor Payout",
    hiddenPayload: {
      category: "Subcontractor & Payroll",
      accountMode: "professional",
      currency: "USD",
      merchant: "Independent Contractor",
      paymentMethod: "Bank Transfer / UPI",
    },
    visibleFields: ["amount", "description", "date"],
    isReminderEnabled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tpl-morning-meds",
    userId: "usr-default",
    serviceType: "prescription",
    templateName: "Morning Meds Log",
    hiddenPayload: {
      frequency: "Daily Morning",
      purpose: "Prescribed Daily Medicine",
      takenToday: true,
    },
    visibleFields: ["medicine_name", "dosage_taken", "time_taken"],
    isReminderEnabled: true,
    reminderTime: "08:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tpl-gas-refuel",
    userId: "usr-default",
    serviceType: "vehicle_mileage",
    templateName: "Gas Station Refuel",
    hiddenPayload: {
      vehicleType: "Car",
      fuelStatus: "Full Tank",
      notes: "Routine fuel refuel log",
    },
    visibleFields: ["vehicle_name", "fuel_cost", "odometer_reading"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "tpl-staff-clockin",
    userId: "usr-default",
    serviceType: "employee_clockin",
    templateName: "Staff Morning Clock-In",
    hiddenPayload: {
      action: "Clock-In",
      shift: "Morning Shift",
      status: "On Time",
    },
    visibleFields: ["employee_name", "clock_time", "notes"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "tpl-water-log",
    userId: "usr-default",
    serviceType: "water_log",
    templateName: "Hydration Glass Log",
    hiddenPayload: {
      source: "Water Bottle",
    },
    visibleFields: ["water_amount_ml", "time_taken"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "tpl-vitals-check",
    userId: "usr-default",
    serviceType: "vital_log",
    templateName: "Daily Vitals Check-In",
    hiddenPayload: {
      dateStr: "Today",
    },
    visibleFields: ["sys_bp", "dia_bp", "heart_rate", "spo2"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "tpl-pet-care",
    userId: "usr-default",
    serviceType: "pet_care",
    templateName: "Daily Dog Walk & Food",
    hiddenPayload: {
      species: "Dog",
      action: "Walk & Food Refill",
    },
    visibleFields: ["pet_name", "notes", "cost"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "tpl-retail-sale",
    userId: "usr-default",
    serviceType: "retail_sale",
    templateName: "Retail Quick POS Sale",
    hiddenPayload: {
      type: "out",
      reason: "POS Sale",
    },
    visibleFields: ["item_name", "qty_sold", "unit_price"],
    createdAt: new Date().toISOString(),
  },
];

// Helper to get templates from localStorage or fallback defaults
export function getQuickAddTemplates(): QuickAddTemplate[] {
  try {
    const saved = localStorage.getItem("care2care_quick_add_templates");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading quick add templates:", e);
  }
  return DEFAULT_QUICK_ADD_TEMPLATES;
}

export function saveQuickAddTemplate(template: Omit<QuickAddTemplate, "id" | "createdAt">): QuickAddTemplate {
  const current = getQuickAddTemplates();
  const newTpl: QuickAddTemplate = {
    ...template,
    id: `tpl-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newTpl, ...current];
  try {
    localStorage.setItem("care2care_quick_add_templates", JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving template to localStorage", e);
  }
  return newTpl;
}

export function deleteQuickAddTemplate(id: string): void {
  const current = getQuickAddTemplates();
  const updated = current.filter((t) => t.id !== id);
  try {
    localStorage.setItem("care2care_quick_add_templates", JSON.stringify(updated));
  } catch (e) {
    console.error("Error deleting template:", e);
  }
}

// --------------------------------------------------------------------
// PENDING REVIEW QUEUE (Draft Safety Net)
// --------------------------------------------------------------------
export function getPendingReviewQueue(): PendingReviewItem[] {
  try {
    const saved = localStorage.getItem("care2care_pending_review_queue");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading pending review queue", e);
  }
  return [];
}

export function addPendingReviewItem(item: Omit<PendingReviewItem, "id" | "createdAt" | "status">): PendingReviewItem {
  const current = getPendingReviewQueue();
  const newItem: PendingReviewItem = {
    ...item,
    id: `draft-${Date.now()}`,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem("care2care_pending_review_queue", JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return newItem;
}

export function resolvePendingReviewItem(id: string, action: "reviewed" | "dismissed", updatedPayload?: Record<string, any>): void {
  const current = getPendingReviewQueue();
  const updated = current.map((i) => {
    if (i.id === id) {
      return {
        ...i,
        status: action,
        draftPayload: updatedPayload || i.draftPayload,
      };
    }
    return i;
  });
  try {
    localStorage.setItem("care2care_pending_review_queue", JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

// --------------------------------------------------------------------
// CORE LOG ENGINE: Merges Dynamic Inputs + Hidden Payload
// --------------------------------------------------------------------
export interface LogExecutionResult {
  success: boolean;
  isPendingQueue: boolean;
  message: string;
  dataRecord?: any;
}

export function submitQuickAddLog(
  template: QuickAddTemplate,
  typedInputs: Record<string, any>,
  patientId?: string
): LogExecutionResult {
  const mergedPayload: Record<string, any> = {
    ...template.hiddenPayload,
    ...typedInputs,
    date: typedInputs.date || new Date().toISOString().split("T")[0],
    time: typedInputs.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    timestamp: Date.now(),
  };

  // 1. DRAFT & REVIEW SAFETY NET VALIDATION
  let isFlagged = false;
  let flagReason = "";

  if (template.serviceType === "expense") {
    const amount = Number(mergedPayload.amount || 0);
    if (isNaN(amount) || amount <= 0) {
      isFlagged = true;
      flagReason = "Expense amount must be greater than $0.00.";
    } else if (amount > 5000) {
      isFlagged = true;
      flagReason = `Expense amount ($${amount.toLocaleString()}) exceeds $5,000 single transaction threshold requiring manager approval.`;
    }
  } else if (template.serviceType === "vital_log") {
    const sys = Number(mergedPayload.sys_bp || 120);
    if (sys < 60 || sys > 220) {
      isFlagged = true;
      flagReason = `Systolic BP reading (${sys} mmHg) is out of normal physiological safety bounds (60 - 220 mmHg).`;
    }
  } else if (template.serviceType === "employee_clockin") {
    if (!mergedPayload.employee_name || mergedPayload.employee_name.trim().length === 0) {
      isFlagged = true;
      flagReason = "Employee name is missing for HR clock-in record.";
    }
  }

  // IF FLAGGED -> Save to Draft Queue without blocking user workflow!
  if (isFlagged) {
    addPendingReviewItem({
      userId: template.userId || "usr-default",
      serviceType: template.serviceType,
      templateId: template.id,
      templateName: template.templateName,
      draftPayload: mergedPayload,
      flaggedReason: flagReason,
    });

    return {
      success: false,
      isPendingQueue: true,
      message: `Record saved to Pending Draft Queue! Reason: ${flagReason}`,
      dataRecord: mergedPayload,
    };
  }

  // 2. DISPATCH TO TARGET APP MODULE (LocalStorage persistence)
  try {
    if (template.serviceType === "expense") {
      const currentFin: FinancialRecord[] = JSON.parse(localStorage.getItem("care2care_finance") || "[]");
      const newRecord: FinancialRecord = {
        id: `fin-${Date.now()}`,
        title: mergedPayload.description || template.templateName,
        type: "expense",
        amount: Number(mergedPayload.amount || 0),
        category: mergedPayload.category || "General Expense",
        date: mergedPayload.date,
        accountMode: mergedPayload.accountMode || "personal",
      };
      localStorage.setItem("care2care_finance", JSON.stringify([newRecord, ...currentFin]));
    } else if (template.serviceType === "water_log") {
      const currentPatients: Patient[] = JSON.parse(localStorage.getItem("care2care_patients") || "[]");
      if (currentPatients.length > 0) {
        const targetId = patientId || currentPatients[0].id;
        const addMl = Number(mergedPayload.water_amount_ml || 250);
        const updated = currentPatients.map((p) => {
          if (p.id === targetId) {
            const newLog = {
              id: `w-${Date.now()}`,
              amountMl: addMl,
              time: mergedPayload.time,
              timestamp: Date.now(),
            };
            return {
              ...p,
              waterCurrentMl: p.waterCurrentMl + addMl,
              waterLogs: [newLog, ...(p.waterLogs || [])],
            };
          }
          return p;
        });
        localStorage.setItem("care2care_patients", JSON.stringify(updated));
      }
    } else if (template.serviceType === "vital_log") {
      const currentPatients: Patient[] = JSON.parse(localStorage.getItem("care2care_patients") || "[]");
      if (currentPatients.length > 0) {
        const targetId = patientId || currentPatients[0].id;
        const updated = currentPatients.map((p) => {
          if (p.id === targetId) {
            const newVital: VitalSign = {
              id: `v-${Date.now()}`,
              timestamp: Date.now(),
              dateStr: mergedPayload.date,
              bloodPressureSystolic: Number(mergedPayload.sys_bp || 120),
              bloodPressureDiastolic: Number(mergedPayload.dia_bp || 80),
              heartRateBpm: Number(mergedPayload.heart_rate || 72),
              spO2Percent: Number(mergedPayload.spo2 || 98),
              temperatureF: 98.6,
              bloodSugarMgDl: 100,
            };
            return {
              ...p,
              vitals: [newVital, ...(p.vitals || [])],
              lastCheckIn: "Just now",
            };
          }
          return p;
        });
        localStorage.setItem("care2care_patients", JSON.stringify(updated));
      }
    } else if (template.serviceType === "prescription") {
      const currentPatients: Patient[] = JSON.parse(localStorage.getItem("care2care_patients") || "[]");
      if (currentPatients.length > 0) {
        const targetId = patientId || currentPatients[0].id;
        const updated = currentPatients.map((p) => {
          if (p.id === targetId) {
            const newMed: Medication = {
              id: `m-${Date.now()}`,
              name: mergedPayload.medicine_name || "Daily Medicine",
              dosage: mergedPayload.dosage_taken || "1 Tablet",
              frequency: mergedPayload.frequency || "Daily",
              time: mergedPayload.time_taken || mergedPayload.time,
              takenToday: true,
              photoUrl: mergedPayload.photo_url || undefined,
            };
            return {
              ...p,
              medications: [...(p.medications || []), newMed],
            };
          }
          return p;
        });
        localStorage.setItem("care2care_patients", JSON.stringify(updated));
      }
    }
  } catch (e) {
    console.error("Error dispatching record to module storage:", e);
  }

  return {
    success: true,
    isPendingQueue: false,
    message: `Logged "${template.templateName}" successfully!`,
    dataRecord: mergedPayload,
  };
}
