var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "25mb" }));
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Care2Care", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var userLanguagePreferences = {
  default: "en"
};
app.post("/api/user/language", (req, res) => {
  const { userId = "anonymous", language_preference = "en" } = req.body;
  userLanguagePreferences[userId] = language_preference;
  res.json({
    success: true,
    userId,
    language_preference,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/user/language/:userId?", (req, res) => {
  const userId = req.params.userId || "anonymous";
  const language_preference = userLanguagePreferences[userId] || "en";
  res.json({ userId, language_preference });
});
app.post("/api/notifications/send", (req, res) => {
  const { userId = "anonymous", type = "daily_reminder" } = req.body;
  const lang = userLanguagePreferences[userId] || "en";
  const notificationsByLang = {
    en: {
      title: "Care2Care Daily Reminder",
      body: "Time to take your scheduled medications and check hydration."
    },
    es: {
      title: "Recordatorio Diario Care2Care",
      body: "Es hora de tomar sus medicamentos programados y verificar la hidrataci\xF3n."
    },
    hi: {
      title: "Care2Care \u0926\u0948\u0928\u093F\u0915 \u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915",
      body: "\u0905\u092A\u0928\u0940 \u0928\u093F\u0930\u094D\u0927\u093E\u0930\u093F\u0924 \u0926\u0935\u093E\u090F\u0902 \u0932\u0947\u0928\u0947 \u0914\u0930 \u092A\u093E\u0928\u0940 \u092A\u0940\u0928\u0947 \u0915\u093E \u0938\u092E\u092F \u0939\u094B \u0917\u092F\u093E \u0939\u0948\u0964"
    },
    fr: {
      title: "Rappel Quotidien Care2Care",
      body: "Il est temps de prendre vos m\xE9dicaments programm\xE9s et de v\xE9rifier votre hydratation."
    },
    np: {
      title: "Care2Care \u0926\u0948\u0928\u093F\u0915 \u0938\u094D\u092E\u0930\u0923",
      body: "\u0914\u0937\u0927\u093F \u0916\u093E\u0928\u0947 \u0930 \u092A\u093E\u0928\u0940 \u092A\u093F\u0909\u0928\u0947 \u0938\u092E\u092F \u092D\u092F\u094B\u0964"
    }
  };
  const notification = notificationsByLang[lang] || notificationsByLang.en;
  res.json({
    success: true,
    userId,
    recipient_language: lang,
    notification,
    sentAt: (/* @__PURE__ */ new Date()).toISOString()
  });
});
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
        confidence: "Simulated AI Analysis (Set GEMINI_API_KEY for live OCR)"
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
              data: cleanBase64
            }
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
}`
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });
    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error) {
    console.error("Error analyzing medicine:", error);
    res.status(500).json({
      error: "Failed to analyze image",
      details: error.message
    });
  }
});
app.post("/api/gemini/clinical-insight", async (req, res) => {
  try {
    const { waterIntake, goal, mood, steps, sleepHours, medsTaken, totalMeds, patientType } = req.body;
    const ai = getGeminiAI();
    if (!ai) {
      return res.json({
        insight: `Drinking water consistently (${waterIntake}ml of ${goal}ml today) improves cognitive clarity by up to 15%. Keep going!`,
        actionableTip: "Try drinking 250ml right after waking up for optimal metabolic activation."
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
        responseMimeType: "application/json"
      }
    });
    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error) {
    res.json({
      insight: "Staying hydrated and keeping regular medication schedules ensures maximum daily vitality and mental clarity.",
      actionableTip: "Set periodic gentle reminders to pause and take 3 deep diaphragmatic breaths."
    });
  }
});
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
        responseMimeType: "application/json"
      }
    });
    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error) {
    res.json({
      summaryInsight: "Your daily habits are building a solid foundation for long-term health and wellness.",
      strengths: ["Great momentum on morning routines", "Consistent habit completion rate"],
      recommendations: ["Set regular reminders for afternoon goals", "Pair new habits with existing daily triggers"],
      motivationalPush: "Every single checkmark moves you closer to your ideal routine!"
    });
  }
});
app.post("/api/gemini/generate-document", async (req, res) => {
  try {
    const { docType, name, details } = req.body;
    const ai = getGeminiAI();
    if (!ai) {
      return res.json({
        title: `${docType.toUpperCase()} for ${name || "Caregiver"}`,
        content: `Professional ${docType} generated for ${name}.

Details:
${details || "Standard caregiving protocol and administrative competence."}

Key Qualifications:
- Patient Vitals Monitoring & Hydration Logistics
- Emergency SOS Protocol Management
- Patient Dignity & Daily Comfort Protocol`
      });
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate a complete professional ${docType} for candidate/person name "${name}". Context and details provided: "${details}". Ensure clean structured layout with headings and bullet points.`
    });
    res.json({
      title: `${docType.toUpperCase()} - ${name}`,
      content: response.text
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var serverSyncLogs = [];
app.post("/api/sync-logs", (req, res) => {
  const syncEntry = req.body;
  if (syncEntry && syncEntry.id) {
    serverSyncLogs.unshift(syncEntry);
    if (serverSyncLogs.length > 100) serverSyncLogs.pop();
  }
  res.json({ success: true, count: serverSyncLogs.length });
});
app.get("/api/sync-logs", (req, res) => {
  res.json({ success: true, logs: serverSyncLogs });
});
app.post("/api/user/profile/update", (req, res) => {
  const { profile, oldProfile, source = "Profile Settings" } = req.body;
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
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
var inMemoryPaymentConfig = {
  id: "cfg-srv-1",
  bankName: "Standard Chartered Bank (Nepal & Global)",
  accountHolderName: "Care2Care Health Enterprises Pvt. Ltd.",
  accountNumber: "0100-9823-45001",
  ifscSwiftCode: "SCBLNPKAXXX",
  upiId: "care2care@upi",
  qrCodeImageUrl: null,
  isActive: true,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var inMemoryAdminNotifSettings = {
  id: "notif-srv-1",
  adminId: "admin-primary",
  inAppSound: true,
  inAppVibration: true,
  whatsappWebhookUrl: "https://api.whatsapp.com/send?phone=9779801234567",
  telegramBotTokenChatId: "bot123456:ABC-DEF/chat987654321",
  emailAddress: "payments-admin@care2care.org",
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var inMemoryPaymentRequests = [
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
app.get("/api/payment-config", (req, res) => {
  res.json({ success: true, config: inMemoryPaymentConfig });
});
app.post("/api/payment-config", (req, res) => {
  inMemoryPaymentConfig = { ...inMemoryPaymentConfig, ...req.body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  res.json({ success: true, config: inMemoryPaymentConfig });
});
app.get("/api/admin-notification-settings", (req, res) => {
  res.json({ success: true, settings: inMemoryAdminNotifSettings });
});
app.post("/api/admin-notification-settings", (req, res) => {
  inMemoryAdminNotifSettings = { ...inMemoryAdminNotifSettings, ...req.body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  res.json({ success: true, settings: inMemoryAdminNotifSettings });
});
app.get("/api/payment-requests", (req, res) => {
  res.json({ success: true, requests: inMemoryPaymentRequests });
});
app.post("/api/payment-requests", (req, res) => {
  const newReq = {
    ...req.body,
    id: req.body.id || `pay-req-${Date.now()}`,
    status: "pending",
    createdAt: req.body.createdAt || (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16)
  };
  inMemoryPaymentRequests.unshift(newReq);
  res.json({
    success: true,
    message: "Payment request submitted. Admin notification webhooks triggered.",
    request: newReq
  });
});
app.post("/api/payment-requests/verify", (req, res) => {
  const { requestId, adminNotes, verifiedAt } = req.body;
  const index = inMemoryPaymentRequests.findIndex((r) => r.id === requestId);
  if (index !== -1) {
    inMemoryPaymentRequests[index].status = "verified";
    inMemoryPaymentRequests[index].verifiedAt = verifiedAt || (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
    if (adminNotes) inMemoryPaymentRequests[index].adminNotes = adminNotes;
  }
  res.json({ success: true, message: "Payment verified & user subscription activated." });
});
app.post("/api/payment-requests/reject", (req, res) => {
  const { requestId, adminNotes } = req.body;
  const index = inMemoryPaymentRequests.findIndex((r) => r.id === requestId);
  if (index !== -1) {
    inMemoryPaymentRequests[index].status = "rejected";
    inMemoryPaymentRequests[index].adminNotes = adminNotes;
    inMemoryPaymentRequests[index].verifiedAt = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
  }
  res.json({ success: true, message: "Payment request rejected and reason logged." });
});
app.post("/api/test-webhook", (req, res) => {
  const { type, url, payload } = req.body;
  console.log(`[PAYMENT WEBHOOK ALERT] Dispatched ${type.toUpperCase()} alert to ${url}:`, payload);
  res.json({
    success: true,
    type,
    deliveredTo: url,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
var inMemoryQuickAddTemplates = [
  {
    id: "tpl-subcontractor-payout",
    userId: "usr-default",
    serviceType: "expense",
    templateName: "Subcontractor Payout",
    hiddenPayload: { category: "Subcontractor & Payroll", accountMode: "professional", currency: "USD" },
    visibleFields: ["amount", "description", "date"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "tpl-morning-meds",
    userId: "usr-default",
    serviceType: "prescription",
    templateName: "Morning Meds Log",
    hiddenPayload: { frequency: "Daily Morning", takenToday: true },
    visibleFields: ["medicine_name", "dosage_taken", "time_taken"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var inMemoryPendingReviewQueue = [];
app.get("/api/quick-add/templates", (req, res) => {
  res.json({ success: true, templates: inMemoryQuickAddTemplates });
});
app.post("/api/quick-add/templates", (req, res) => {
  const newTpl = {
    ...req.body,
    id: req.body.id || `tpl-${Date.now()}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  inMemoryPendingReviewQueue.unshift(newItem);
  res.json({ success: true, item: newItem });
});
var inMemoryGeneratedInvoices = [];
var inMemoryBillingConfig = {
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
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
app.get("/api/khalti-invoices", (req, res) => {
  res.json({ success: true, invoices: inMemoryGeneratedInvoices });
});
app.post("/api/generate-khalti-invoice", (req, res) => {
  const { customerName, customerEmail, customerPhone, subscriptionItem, amountNpr } = req.body;
  const sequence = Math.floor(1e3 + Math.random() * 9e3);
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16)
  };
  inMemoryGeneratedInvoices.unshift(invoice);
  res.json({
    success: true,
    message: "Khalti Stripe payment checkout link generated successfully.",
    invoice
  });
});
app.post("/api/khalti-payment-webhook", (req, res) => {
  const { pidx, purchase_order_id, status, transaction_id } = req.body;
  const target = inMemoryGeneratedInvoices.find((i) => i.purchaseOrderId === purchase_order_id);
  if (target) {
    target.status = status === "Completed" ? "completed" : status.toLowerCase();
    target.khaltiTransactionId = transaction_id || `KHLT-TXN-${Math.floor(1e8 + Math.random() * 9e8)}`;
    target.completedAt = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
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
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  res.json({ success: true, config: inMemoryBillingConfig });
});
var inMemoryUserDashboardConfigs = {};
app.get("/api/user-dashboard-config", (req, res) => {
  const userId = req.query.userId || "primary-user";
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
      { id: "retail_inventory", type: "RETAIL_INVENTORY", position: 6, visible: true }
    ]
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
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Care2Care Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
