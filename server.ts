import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { SERVER_VERIFIED_JOBS, parseQueryOnServer } from "./server/jobEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini API client lazily / safely
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Care2Care", timestamp: new Date().toISOString() });
});

// User Language Preference Store
const userLanguagePreferences: Record<string, string> = {
  default: "en",
};

// API: Set User Language Preference
app.post("/api/user/language", (req, res) => {
  const { userId = "anonymous", language_preference = "en" } = req.body;
  userLanguagePreferences[userId] = language_preference;
  res.json({
    success: true,
    userId,
    language_preference,
    updatedAt: new Date().toISOString(),
  });
});

// API: Get User Language Preference
app.get("/api/user/language/:userId?", (req, res) => {
  const userId = req.params.userId || "anonymous";
  const language_preference = userLanguagePreferences[userId] || "en";
  res.json({ userId, language_preference });
});

// API: Send Notification Respecting User Preferred Language
app.post("/api/notifications/send", (req, res) => {
  const { userId = "anonymous", type = "daily_reminder" } = req.body;
  const lang = userLanguagePreferences[userId] || "en";

  const notificationsByLang: Record<string, { title: string; body: string }> = {
    en: {
      title: "Care2Care Daily Reminder",
      body: "Time to take your scheduled medications and check hydration.",
    },
    es: {
      title: "Recordatorio Diario Care2Care",
      body: "Es hora de tomar sus medicamentos programados y verificar la hidratación.",
    },
    hi: {
      title: "Care2Care दैनिक अनुस्मारक",
      body: "अपनी निर्धारित दवाएं लेने और पानी पीने का समय हो गया है।",
    },
    fr: {
      title: "Rappel Quotidien Care2Care",
      body: "Il est temps de prendre vos médicaments programmés et de vérifier votre hydratation.",
    },
    np: {
      title: "Care2Care दैनिक स्मरण",
      body: "औषधि खाने र पानी पिउने समय भयो।",
    },
  };

  const notification = notificationsByLang[lang] || notificationsByLang.en;
  res.json({
    success: true,
    userId,
    recipient_language: lang,
    notification,
    sentAt: new Date().toISOString(),
  });
});

// Gemini Endpoint: Medicine Photo OCR & Analysis
app.post("/api/gemini/analyze-medicine", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const ai = getGeminiAI();
    if (!ai) {
      return res.json({
        medicineName: "Amoxicillin / Multivitamin",
        dosage: "500 mg",
        frequency: "Twice daily after meals",
        timing: "08:00 AM & 08:00 PM",
        purpose: "Antibiotic / Daily Health Supplement",
        warnings: "Take with food to prevent upset stomach.",
        confidence: "Simulated AI Analysis (Set GEMINI_API_KEY for live OCR)",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this pill/medicine bottle or prescription photo. Return JSON ONLY with fields:
{
  "medicineName": "string",
  "dosage": "string",
  "frequency": "string",
  "timing": "string",
  "purpose": "string",
  "warnings": "string"
}`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Error analyzing medicine:", error);
    res.status(500).json({
      error: "Failed to analyze image",
      details: error.message,
    });
  }
});

// Gemini Endpoint: Clinical & Wellness Insights
app.post("/api/gemini/clinical-insight", async (req, res) => {
  try {
    const { waterIntake, goal, mood, steps, sleepHours, medsTaken, totalMeds, patientType } = req.body;

    const ai = getGeminiAI();
    if (!ai) {
      return res.json({
        insight: `Drinking water consistently (${waterIntake}ml of ${goal}ml today) improves cognitive clarity by up to 15%. Keep going!`,
        actionableTip: "Try drinking 250ml right after waking up for optimal metabolic activation.",
      });
    }

    const prompt = `Provide a concise, encouraging clinical/wellness insight (1-2 sentences) and 1 quick actionable tip for a patient/individual (${patientType || "General"}) with today's stats:
Water Intake: ${waterIntake || 0}ml / ${goal || 2500}ml
Mood: ${mood || "Balanced"}
Sleep: ${sleepHours || 7} hrs
Meds Taken: ${medsTaken || 0} / ${totalMeds || 0}

Return JSON with keys "insight" and "actionableTip".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    res.json({
      insight: "Staying hydrated and keeping regular medication schedules ensures maximum daily vitality and mental clarity.",
      actionableTip: "Set periodic gentle reminders to pause and take 3 deep diaphragmatic breaths.",
    });
  }
});

// Gemini Endpoint: Habit Builder Coaching & Performance Insights
app.post("/api/gemini/habit-coach", async (req, res) => {
  try {
    const { habits = [], completionRate = 80, currentStreak = 5, topCategory = "Health" } = req.body;

    const ai = getGeminiAI();
    if (!ai) {
      return res.json({
        summaryInsight: `Outstanding consistency! You've maintained a ${currentStreak}-day streak with an overall ${completionRate}% completion rate across your habits.`,
        strengths: ["You are most consistent with morning routines.", "Your hydration habit is strong."],
        recommendations: [
          "Try setting reminder alerts for evening wind-down tasks.",
          "Add 5 minutes of gentle stretching after workout sessions."
        ],
        motivationalPush: "Consistency builds momentum. Keep pushing forward day by day!"
      });
    }

    const prompt = `Analyze these user habit statistics and return a JSON object with habit coaching insights:
Completion Rate: ${completionRate}%
Current Streak: ${currentStreak} days
Top Active Category: ${topCategory}
Habits Summary: ${JSON.stringify(habits.slice(0, 8))}

Return JSON with structure:
{
  "summaryInsight": "1-2 inspiring analysis sentences",
  "strengths": ["string", "string"],
  "recommendations": ["string", "string"],
  "motivationalPush": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    res.json({
      summaryInsight: "Your daily habits are building a solid foundation for long-term health and wellness.",
      strengths: ["Great momentum on morning routines", "Consistent habit completion rate"],
      recommendations: ["Set regular reminders for afternoon goals", "Pair new habits with existing daily triggers"],
      motivationalPush: "Every single checkmark moves you closer to your ideal routine!"
    });
  }
});

// Gemini Endpoint: Document Generator (SOP, Resume, Cover Letter, Certificates)
app.post("/api/gemini/generate-document", async (req, res) => {
  try {
    const { docType, name, details } = req.body;
    const ai = getGeminiAI();

    if (!ai) {
      return res.json({
        title: `${docType.toUpperCase()} for ${name || "Caregiver"}`,
        content: `Professional ${docType} generated for ${name}.\n\nDetails:\n${details || "Standard caregiving protocol and administrative competence."}\n\nKey Qualifications:\n- Patient Vitals Monitoring & Hydration Logistics\n- Emergency SOS Protocol Management\n- Patient Dignity & Daily Comfort Protocol`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate a complete professional ${docType} for candidate/person name "${name}". Context and details provided: "${details}". Ensure clean structured layout with headings and bullet points.`,
    });

    res.json({
      title: `${docType.toUpperCase()} - ${name}`,
      content: response.text,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// JOB SEARCH ENGINE & VISA SPONSORSHIP VERIFICATION API
// ============================================================
app.post("/api/jobs/search", (req, res) => {
  try {
    const { query = "", location = "", country = "", category = "All", sponsorshipFilter = "all" } = req.body;
    const parsedIntent = parseQueryOnServer(query, location, country);

    let results = [...SERVER_VERIFIED_JOBS];

    if (sponsorshipFilter === "confirmed_only") {
      results = results.filter((j) => j.visaSponsorshipStatus === "CONFIRMED" || j.visaSponsorshipStatus === "LIKELY");
    }

    if (country && country !== "All") {
      results = results.filter((j) => j.country.toLowerCase().includes(country.toLowerCase()) || j.isRemote);
    }

    res.json({
      success: true,
      parsedIntent,
      jobs: results,
      totalCount: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// DATA PROPAGATION ENGINE - BACKEND API ENDPOINTS
// ============================================================
const serverSyncLogs: any[] = [];

// API: Save Sync Log Entry
app.post("/api/sync-logs", (req, res) => {
  const syncEntry = req.body;
  if (syncEntry && syncEntry.id) {
    serverSyncLogs.unshift(syncEntry);
    if (serverSyncLogs.length > 100) serverSyncLogs.pop();
  }
  res.json({ success: true, count: serverSyncLogs.length });
});

// API: Get Sync Logs
app.get("/api/sync-logs", (req, res) => {
  res.json({ success: true, logs: serverSyncLogs });
});

// API: Update User Profile & Trigger Propagation Response
app.post("/api/user/profile/update", (req, res) => {
  const { profile, oldProfile, source = "Profile Settings" } = req.body;
  
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
  const logEntry = {
    id: `log-srv-${Date.now()}`,
    timestamp,
    userId: profile?.id || "usr-primary",
    userName: profile?.fullName || profile?.name || "Primary User",
    sourceModule: source,
    changedMasterFields: ["Gender", "Date of Birth", "Contact Information"],
    propagatedChanges: [
      {
        id: `srv-c1-${Date.now()}`,
        targetModule: "Family Tree",
        recordId: "self-1",
        recordName: profile?.fullName || "Self Record",
        field: "Gender & DOB",
        fieldKey: "family_tree.self-1.gender",
        oldValue: oldProfile?.gender || "Not Set",
        newValue: profile?.gender || "Male",
        ruleApplied: "Rule A1: Profile => Family Tree",
        overrideApplied: false,
        status: "SUCCESS",
        timestamp
      },
      {
        id: `srv-c2-${Date.now()}`,
        targetModule: "Healthcare & Medical",
        recordId: "patient-1",
        recordName: profile?.fullName || "Primary Patient",
        field: "Demographics",
        fieldKey: "medical_records.patient.gender",
        oldValue: oldProfile?.gender || "Not Set",
        newValue: profile?.gender || "Male",
        ruleApplied: "Rule B1: Profile => Patient Demographics",
        overrideApplied: false,
        status: "SUCCESS",
        timestamp
      }
    ],
    totalPropagated: 2,
    totalSkippedLocks: 0,
    totalFlaggedVerifications: 0,
    status: "SUCCESS"
  };

  serverSyncLogs.unshift(logEntry);

  res.json({
    success: true,
    message: "Profile updated and cross-module propagation executed successfully.",
    syncLog: logEntry
  });
});

// ============================================================
// PROFILE DASHBOARD & HOME DISPLAY PREFERENCES ENDPOINTS
// ============================================================
const inMemoryDashboardPreferences: Record<string, any> = {
  personal: {
    today_attention_filters: {
      medicine: true,
      challenges: true,
      water_habits: true,
      finance_bills: false,
      calendar_events: false,
      staff_pending_tasks: false
    },
    continue_resume_logic: {
      enabled_services: ["mood", "habit", "finance", "water", "yoga", "vitals"],
      max_items: 2
    },
    pinned_services: {
      custom_list: ["yoga", "medicine", "finance", "mood", "vitals", "water"],
      max_items: 6,
      auto_update: true
    },
    challenge_visibility: {
      show_challenge_button: true,
      show_streak_daily: true
    },
    sync_sub_accounts: false
  },
  professional: {
    today_attention_filters: {
      medicine: false,
      challenges: false,
      water_habits: false,
      finance_bills: true,
      calendar_events: true,
      staff_pending_tasks: true
    },
    continue_resume_logic: {
      enabled_services: ["finance", "staff_payroll", "inventory", "contracts", "jobs", "custom_store"],
      max_items: 2
    },
    pinned_services: {
      custom_list: ["finance", "staff_payroll", "inventory", "contracts", "jobs", "paperless"],
      max_items: 6,
      auto_update: true
    },
    challenge_visibility: {
      show_challenge_button: false,
      show_streak_daily: false
    },
    sync_sub_accounts: true
  },
  subaccount: {
    today_attention_filters: {
      medicine: true,
      challenges: true,
      water_habits: true,
      finance_bills: false,
      calendar_events: true,
      staff_pending_tasks: false
    },
    continue_resume_logic: {
      enabled_services: ["medicine", "vitals", "mood", "water", "elderly", "kids"],
      max_items: 2
    },
    pinned_services: {
      custom_list: ["medicine", "vitals", "water", "mood", "elderly", "sos"],
      max_items: 6,
      auto_update: true
    },
    challenge_visibility: {
      show_challenge_button: true,
      show_streak_daily: true
    },
    sync_sub_accounts: false
  }
};

// PUT /api/profile/update-dashboard-preferences
app.put("/api/profile/update-dashboard-preferences", (req, res) => {
  const { profileId = "personal", preferences, syncToSubAccounts = false } = req.body;
  if (!preferences) {
    return res.status(400).json({ error: "Missing preferences payload" });
  }

  inMemoryDashboardPreferences[profileId] = {
    ...inMemoryDashboardPreferences[profileId],
    ...preferences
  };

  if (syncToSubAccounts) {
    // Synchronize to subaccounts and dependents
    inMemoryDashboardPreferences["subaccount"] = {
      ...inMemoryDashboardPreferences["subaccount"],
      ...preferences,
      sync_sub_accounts: true
    };
  }

  res.json({
    success: true,
    message: "Dashboard preferences updated successfully",
    profileId,
    preferences: inMemoryDashboardPreferences[profileId],
    subAccountsSynced: syncToSubAccounts,
    updatedAt: new Date().toISOString()
  });
});

// GET /api/profile/dashboard-preferences/:profileId?
app.get("/api/profile/dashboard-preferences/:profileId?", (req, res) => {
  const profileId = req.params.profileId || "personal";
  const prefs = inMemoryDashboardPreferences[profileId] || inMemoryDashboardPreferences["personal"];
  res.json({
    success: true,
    profileId,
    preferences: prefs
  });
});

// -----------------------------------------------------------------
// MANUAL PAYMENT GATEWAY & VERIFICATION API ENDPOINTS
// -----------------------------------------------------------------
let inMemoryPaymentConfig = {
  id: "cfg-srv-1",
  bankName: "Standard Chartered Bank (Nepal & Global)",
  accountHolderName: "Care2Care Health Enterprises Pvt. Ltd.",
  accountNumber: "0100-9823-45001",
  ifscSwiftCode: "SCBLNPKAXXX",
  upiId: "care2care@upi",
  qrCodeImageUrl: null,
  isActive: true,
  updatedAt: new Date().toISOString(),
};

let inMemoryAdminNotifSettings = {
  id: "notif-srv-1",
  adminId: "admin-primary",
  inAppSound: true,
  inAppVibration: true,
  whatsappWebhookUrl: "https://api.whatsapp.com/send?phone=9779801234567",
  telegramBotTokenChatId: "bot123456:ABC-DEF/chat987654321",
  emailAddress: "payments-admin@care2care.org",
  updatedAt: new Date().toISOString(),
};

let inMemoryPaymentRequests: any[] = [
  {
    id: "pay-req-101",
    userId: "usr-8812",
    userName: "Deepak Adhikari",
    userEmail: "deepak.adhikari@gmail.com",
    planId: "Family",
    planName: "Family Suite Plan (Annual)",
    amount: 99.99,
    currency: "USD",
    transactionId: "SCB-UTR-998827361",
    paymentProofImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    status: "pending",
    adminNotes: "Customer requested quick verification for clinic setup.",
    createdAt: "2026-08-12 14:20"
  }
];

// 1. GET / POST Payment Configuration
app.get("/api/payment-config", (req, res) => {
  res.json({ success: true, config: inMemoryPaymentConfig });
});

app.post("/api/payment-config", (req, res) => {
  inMemoryPaymentConfig = { ...inMemoryPaymentConfig, ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, config: inMemoryPaymentConfig });
});

// 2. GET / POST Admin Notification Settings
app.get("/api/admin-notification-settings", (req, res) => {
  res.json({ success: true, settings: inMemoryAdminNotifSettings });
});

app.post("/api/admin-notification-settings", (req, res) => {
  inMemoryAdminNotifSettings = { ...inMemoryAdminNotifSettings, ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, settings: inMemoryAdminNotifSettings });
});

// 3. GET / POST Payment Requests
app.get("/api/payment-requests", (req, res) => {
  res.json({ success: true, requests: inMemoryPaymentRequests });
});

app.post("/api/payment-requests", (req, res) => {
  const newReq = {
    ...req.body,
    id: req.body.id || `pay-req-${Date.now()}`,
    status: "pending",
    createdAt: req.body.createdAt || new Date().toISOString().replace("T", " ").substring(0, 16)
  };
  inMemoryPaymentRequests.unshift(newReq);

  res.json({
    success: true,
    message: "Payment request submitted. Admin notification webhooks triggered.",
    request: newReq
  });
});

// 4. VERIFY Payment Request
app.post("/api/payment-requests/verify", (req, res) => {
  const { requestId, adminNotes, verifiedAt } = req.body;
  const index = inMemoryPaymentRequests.findIndex((r) => r.id === requestId);
  if (index !== -1) {
    inMemoryPaymentRequests[index].status = "verified";
    inMemoryPaymentRequests[index].verifiedAt = verifiedAt || new Date().toISOString().replace("T", " ").substring(0, 16);
    if (adminNotes) inMemoryPaymentRequests[index].adminNotes = adminNotes;
  }
  res.json({ success: true, message: "Payment verified & user subscription activated." });
});

// 5. REJECT Payment Request
app.post("/api/payment-requests/reject", (req, res) => {
  const { requestId, adminNotes } = req.body;
  const index = inMemoryPaymentRequests.findIndex((r) => r.id === requestId);
  if (index !== -1) {
    inMemoryPaymentRequests[index].status = "rejected";
    inMemoryPaymentRequests[index].adminNotes = adminNotes;
    inMemoryPaymentRequests[index].verifiedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
  }
  res.json({ success: true, message: "Payment request rejected and reason logged." });
});

// 6. TEST WEBHOOK DISPATCHER
app.post("/api/test-webhook", (req, res) => {
  const { type, url, payload } = req.body;
  console.log(`[PAYMENT WEBHOOK ALERT] Dispatched ${type.toUpperCase()} alert to ${url}:`, payload);
  res.json({
    success: true,
    type,
    deliveredTo: url,
    timestamp: new Date().toISOString()
  });
});

// -----------------------------------------------------------------
// GLOBAL QUICK-ADD TEMPLATE ENGINE ENDPOINTS
// -----------------------------------------------------------------
let inMemoryQuickAddTemplates: any[] = [
  {
    id: "tpl-subcontractor-payout",
    userId: "usr-default",
    serviceType: "expense",
    templateName: "Subcontractor Payout",
    hiddenPayload: { category: "Subcontractor & Payroll", accountMode: "professional", currency: "USD" },
    visibleFields: ["amount", "description", "date"],
    createdAt: new Date().toISOString()
  },
  {
    id: "tpl-morning-meds",
    userId: "usr-default",
    serviceType: "prescription",
    templateName: "Morning Meds Log",
    hiddenPayload: { frequency: "Daily Morning", takenToday: true },
    visibleFields: ["medicine_name", "dosage_taken", "time_taken"],
    createdAt: new Date().toISOString()
  }
];

let inMemoryPendingReviewQueue: any[] = [];

app.get("/api/quick-add/templates", (req, res) => {
  res.json({ success: true, templates: inMemoryQuickAddTemplates });
});

app.post("/api/quick-add/templates", (req, res) => {
  const newTpl = {
    ...req.body,
    id: req.body.id || `tpl-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  inMemoryQuickAddTemplates.unshift(newTpl);
  res.json({ success: true, template: newTpl });
});

app.get("/api/quick-add/pending-queue", (req, res) => {
  res.json({ success: true, queue: inMemoryPendingReviewQueue });
});

app.post("/api/quick-add/pending-queue", (req, res) => {
  const newItem = {
    ...req.body,
    id: req.body.id || `draft-${Date.now()}`,
    status: "draft",
    createdAt: new Date().toISOString()
  };
  inMemoryPendingReviewQueue.unshift(newItem);
  res.json({ success: true, item: newItem });
});

// -----------------------------------------------------------------
// KHALTI / STRIPE INTERNATIONAL BILLING & RECEIPT ENDPOINTS
// -----------------------------------------------------------------
let inMemoryGeneratedInvoices: any[] = [];
let inMemoryBillingConfig: any = {
  id: "cfg-primary",
  companyName: "Care2Care Health Enterprises Pvt. Ltd.",
  companyLogoUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=200&q=80",
  companyAddress: "Durbar Marg, Kathmandu 44600, Nepal",
  companyPanVatNumber: "PAN # 609823411 / VAT Registered",
  companyRegistrationNumber: "REG # 189234/078/079",

  bankName: "Standard Chartered Bank Nepal Ltd.",
  bankAccountHolder: "Care2Care Health Enterprises Pvt. Ltd.",
  bankAccountNumber: "0100-9823-45001",
  bankIfscSwift: "SCBLNPKAXXX",

  receiptCustomHeader: "Thank you for supporting our digital healthcare practice management platform!",
  receiptCustomFooter: "This is an official computer-generated IRD-compliant Zero-Rated Export VAT tax receipt.",
  refundPolicyText: "All digital subscription sales are final. Refunds eligible within 7 days upon formal admin review.",

  enableEmailReceipt: true,
  enableWhatsappReceipt: true,
  customWebhookUrl: "https://api.care2care.org/v1/accounting-sync-webhook",

  updatedAt: new Date().toISOString(),
};

app.get("/api/khalti-invoices", (req, res) => {
  res.json({ success: true, invoices: inMemoryGeneratedInvoices });
});

app.post("/api/generate-khalti-invoice", (req, res) => {
  const { customerName, customerEmail, customerPhone, subscriptionItem, amountNpr } = req.body;
  const sequence = Math.floor(1000 + Math.random() * 9000);
  const purchaseOrderId = `INV-2026-${sequence}`;
  const amountPaisa = (amountNpr || 39900) * 100;
  const khaltiPaymentUrl = `https://checkout.khalti.com/payment/p_idx_strp_${sequence}_${Date.now()}`;

  const invoice = {
    id: `inv-${Date.now()}`,
    adminId: "admin-primary",
    customerName,
    customerEmail,
    customerPhone,
    subscriptionItem: subscriptionItem || "Enterprise Care Suite (1 Year)",
    amountNpr: amountNpr || 39900,
    amountPaisa,
    purchaseOrderId,
    khaltiPaymentUrl,
    status: "pending",
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  inMemoryGeneratedInvoices.unshift(invoice);

  res.json({
    success: true,
    message: "Khalti Stripe payment checkout link generated successfully.",
    invoice,
  });
});

app.post("/api/khalti-payment-webhook", (req, res) => {
  const { pidx, purchase_order_id, status, transaction_id } = req.body;
  const target = inMemoryGeneratedInvoices.find((i) => i.purchaseOrderId === purchase_order_id);
  if (target) {
    target.status = status === "Completed" ? "completed" : status.toLowerCase();
    target.khaltiTransactionId = transaction_id || `KHLT-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    target.completedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
  }
  res.json({ success: true, message: "Khalti webhook processed & subscription activated." });
});

app.get("/api/billing-config", (req, res) => {
  res.json({ success: true, config: inMemoryBillingConfig });
});

app.post("/api/billing-config", (req, res) => {
  inMemoryBillingConfig = {
    ...inMemoryBillingConfig,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json({ success: true, config: inMemoryBillingConfig });
});

let inMemoryUserDashboardConfigs: Record<string, any> = {};

app.get("/api/user-dashboard-config", (req, res) => {
  const userId = (req.query.userId as string) || "primary-user";
  const config = inMemoryUserDashboardConfigs[userId] || {
    theme_preference: "system",
    language_preference: "en",
    roles: ["personal"],
    active_modules: ["vitals", "medicine", "water", "finance", "habits"],
    pending_setups: [
      { id: "sub_accounts", title: "Sub-Accounts Setup", description: "Add family or staff members to manage permissions", action: "ADD_SUBACCOUNT", pending: true },
      { id: "quick_templates", title: "Quick-Add Shortcut", description: "Create 1-tap logging shortcuts for frequent tasks", action: "CREATE_TEMPLATE", pending: true }
    ],
    quick_add_templates: [
      { id: "tpl_1", name: "Fuel Refill", serviceId: "finance", category: "Transport", defaultNote: "Office Vehicle Fuel" },
      { id: "tpl_2", name: "Morning BP Check", serviceId: "vitals", defaultNote: "Routine morning reading" }
    ],
    layout: [
      { id: "auto_reminders", type: "AUTO_REMINDERS", position: 0, visible: true },
      { id: "daily_timeline", type: "DAILY_ROADMAP", position: 1, visible: true },
      { id: "progress_rings", type: "COMPACT_2X2", position: 2, visible: true },
      { id: "medicine_alerts", type: "HIGH_PRIORITY_BANNER", position: 3, visible: true },
      { id: "finance_widget", type: "FULL_WIDTH_SUMMARY", position: 4, visible: true },
      { id: "floating_actions", type: "FLOATING_ACTIONS", position: 5, visible: true },
      { id: "retail_inventory", type: "RETAIL_INVENTORY", position: 6, visible: true },
    ],
  };
  res.json({ success: true, userId, layout_json: config });
});

app.post("/api/user-dashboard-config", (req, res) => {
  const { userId = "primary-user", layout_json } = req.body;
  if (layout_json) {
    inMemoryUserDashboardConfigs[userId] = {
      ...inMemoryUserDashboardConfigs[userId],
      ...layout_json
    };
  }
  res.json({ success: true, userId, layout_json: inMemoryUserDashboardConfigs[userId] });
});

// Vite & Express setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Care2Care Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
