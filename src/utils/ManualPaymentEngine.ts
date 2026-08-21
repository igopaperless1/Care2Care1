// ManualPaymentEngine.ts
// Enterprise-Grade Manual Payment, Verification & Live Notification Engine

export interface PaymentConfiguration {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscSwiftCode: string;
  upiId: string;
  qrCodeImageUrl: string | null;
  isActive: boolean;
  updatedAt: string;
}

export type PaymentRequestStatus = "pending" | "verified" | "rejected" | "expired";

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  paymentProofImageUrl: string;
  status: PaymentRequestStatus;
  adminNotes?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface AdminNotificationSettings {
  id: string;
  adminId: string;
  inAppSound: boolean;
  inAppVibration: boolean;
  whatsappWebhookUrl: string;
  telegramBotTokenChatId: string;
  emailAddress: string;
  updatedAt: string;
}

const PAYMENT_CONFIG_KEY = "care2care_manual_payment_config";
const PAYMENT_REQUESTS_KEY = "care2care_manual_payment_requests";
const ADMIN_NOTIF_SETTINGS_KEY = "care2care_admin_notif_settings";

// Default Initial Seed Configuration
const DEFAULT_PAYMENT_CONFIG: PaymentConfiguration = {
  id: "cfg-default-1",
  bankName: "Standard Chartered Bank (Nepal & Global)",
  accountHolderName: "Blessikaa Health & Life Enterprises Pvt. Ltd.",
  accountNumber: "0100-9823-45001",
  ifscSwiftCode: "SCBLNPKAXXX",
  upiId: "blessikaa@upi",
  qrCodeImageUrl: null,
  isActive: true,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_NOTIF_SETTINGS: AdminNotificationSettings = {
  id: "notif-cfg-1",
  adminId: "admin-primary",
  inAppSound: true,
  inAppVibration: true,
  whatsappWebhookUrl: "https://api.whatsapp.com/send?phone=9779801234567",
  telegramBotTokenChatId: "bot123456:ABC-DEF/chat987654321",
  emailAddress: "payments-admin@blessikaa.org",
  updatedAt: new Date().toISOString(),
};

// -------------------------------------------------------------
// WEB AUDIO SOUND CHIME SYNTHESIZER (No external mp3 needed)
// -------------------------------------------------------------
export function playAdminAlertSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Two-tone payment ping chime (880Hz then 1760Hz)
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(880, now, 0.15); // A5 note
    playNote(1320, now + 0.12, 0.3); // E6 note
  } catch (e) {
    console.warn("Audio Context playback prevented or unsupported:", e);
  }
}

// VIBRATION FEEDBACK
export function triggerVibration() {
  try {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([150, 80, 150]);
    }
  } catch (e) {
    // ignore vibration error
  }
}

// -------------------------------------------------------------
// LOCAL STORAGE & REST API HANDLERS
// -------------------------------------------------------------

export function getPaymentConfiguration(): PaymentConfiguration {
  try {
    const raw = localStorage.getItem(PAYMENT_CONFIG_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PAYMENT_CONFIG;
  } catch (e) {
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export function savePaymentConfiguration(config: PaymentConfiguration): void {
  try {
    config.updatedAt = new Date().toISOString();
    localStorage.setItem(PAYMENT_CONFIG_KEY, JSON.stringify(config));

    // Async sync to server endpoint
    fetch("/api/payment-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    }).catch(() => {});
  } catch (e) {
    console.error("Error saving payment config:", e);
  }
}

export function getAdminNotificationSettings(): AdminNotificationSettings {
  try {
    const raw = localStorage.getItem(ADMIN_NOTIF_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_NOTIF_SETTINGS;
  } catch (e) {
    return DEFAULT_NOTIF_SETTINGS;
  }
}

export function saveAdminNotificationSettings(settings: AdminNotificationSettings): void {
  try {
    settings.updatedAt = new Date().toISOString();
    localStorage.setItem(ADMIN_NOTIF_SETTINGS_KEY, JSON.stringify(settings));

    fetch("/api/admin-notification-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    }).catch(() => {});
  } catch (e) {
    console.error("Error saving notification settings:", e);
  }
}

export function getPaymentRequests(): PaymentRequest[] {
  try {
    const raw = localStorage.getItem(PAYMENT_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : getInitialDemoRequests();
  } catch (e) {
    return getInitialDemoRequests();
  }
}

export function savePaymentRequests(requests: PaymentRequest[]): void {
  try {
    localStorage.setItem(PAYMENT_REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error("Error saving payment requests:", e);
  }
}

// CREATE NEW PAYMENT REQUEST (User Payment Wizard Step 4)
export function submitPaymentRequest(
  data: Omit<PaymentRequest, "id" | "status" | "createdAt">
): PaymentRequest {
  const newReq: PaymentRequest = {
    ...data,
    id: `pay-req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "pending",
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  const currentRequests = getPaymentRequests();
  const updated = [newReq, ...currentRequests];
  savePaymentRequests(updated);

  // Sync to Backend API
  fetch("/api/payment-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newReq),
  }).catch(() => {});

  // Trigger Admin Notification Engine
  triggerAdminNotificationEngine(newReq);

  return newReq;
}

// VERIFY PAYMENT REQUEST (Admin Action)
export function verifyAndActivatePayment(requestId: string, adminNotes?: string): boolean {
  const requests = getPaymentRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return false;

  const req = requests[index];
  req.status = "verified";
  req.verifiedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
  if (adminNotes) req.adminNotes = adminNotes;

  requests[index] = req;
  savePaymentRequests(requests);

  // Update user's active plan in local storage profile
  try {
    const userRaw = localStorage.getItem("care2care_user_profile");
    if (userRaw) {
      const user = JSON.parse(userRaw);
      user.plan = req.planName.toLowerCase().includes("family")
        ? "Family"
        : req.planName.toLowerCase().includes("enterprise")
        ? "Enterprise"
        : "Premium";
      user.subscriptionStatus = "active";
      localStorage.setItem("care2care_user_profile", JSON.stringify(user));
    }
  } catch (e) {
    console.error("Error updating user subscription plan:", e);
  }

  // Sync to Backend API
  fetch("/api/payment-requests/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, adminNotes, verifiedAt: req.verifiedAt }),
  }).catch(() => {});

  return true;
}

// REJECT PAYMENT REQUEST (Admin Action)
export function rejectPaymentRequest(requestId: string, adminNotes: string): boolean {
  const requests = getPaymentRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return false;

  const req = requests[index];
  req.status = "rejected";
  req.adminNotes = adminNotes;
  req.verifiedAt = new Date().toISOString().replace("T", " ").substring(0, 16);

  requests[index] = req;
  savePaymentRequests(requests);

  // Sync to Backend API
  fetch("/api/payment-requests/reject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, adminNotes }),
  }).catch(() => {});

  return true;
}

// -------------------------------------------------------------
// LIVE NOTIFICATION ENGINE (In-App + External Webhooks)
// -------------------------------------------------------------
export function triggerAdminNotificationEngine(req: PaymentRequest) {
  const notifSettings = getAdminNotificationSettings();

  // 1. In-App Audio & Vibration Feedback
  if (notifSettings.inAppSound) {
    playAdminAlertSound();
  }
  if (notifSettings.inAppVibration) {
    triggerVibration();
  }

  // 2. External WhatsApp Webhook Alert
  if (notifSettings.whatsappWebhookUrl) {
    const message = `🚨 NEW PAYMENT VERIFICATION REQUEST! User: ${req.userName} (${req.userEmail}) submitted $${req.amount} for ${req.planName}. TxID: ${req.transactionId}. Review in Admin Console.`;
    fetch("/api/test-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "whatsapp",
        url: notifSettings.whatsappWebhookUrl,
        payload: { text: message, requestId: req.id, amount: req.amount },
      }),
    }).catch(() => {});
  }

  // 3. Telegram Bot Notification
  if (notifSettings.telegramBotTokenChatId) {
    const message = `💳 *New Manual Bank Payment Received*\n\n*User:* ${req.userName} (${req.userEmail})\n*Plan:* ${req.planName}\n*Amount:* $${req.amount}\n*Ref / UTR:* \`${req.transactionId}\`\n\n[Open Admin Verification Panel](https://ais-dev-tcofm5sh44zdqnsfnpct42-637635370207.asia-southeast1.run.app)`;
    fetch("/api/test-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "telegram",
        url: notifSettings.telegramBotTokenChatId,
        payload: { text: message, requestId: req.id },
      }),
    }).catch(() => {});
  }

  // 4. Email Alert
  if (notifSettings.emailAddress) {
    fetch("/api/test-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "email",
        url: notifSettings.emailAddress,
        payload: {
          subject: `[Care2Care Payment Alert] New $${req.amount} transfer from ${req.userName}`,
          body: `A new payment request requires verification.\nUser: ${req.userEmail}\nTransaction ID: ${req.transactionId}\nPlan: ${req.planName}`,
        },
      }),
    }).catch(() => {});
  }
}

// DEMO INITIAL PAYMENT REQUESTS FOR IMMEDIATE PREVIEW
function getInitialDemoRequests(): PaymentRequest[] {
  return [
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
      paymentProofImageUrl:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      status: "pending",
      adminNotes: "Customer requested quick verification for clinic setup.",
      createdAt: "2026-08-12 14:20",
    },
    {
      id: "pay-req-102",
      userId: "usr-4410",
      userName: "Sujan Shakya",
      userEmail: "sujan.shakya@outlook.com",
      planId: "Premium",
      planName: "Premium Single (Monthly)",
      amount: 4.99,
      currency: "USD",
      transactionId: "NBL-98127394812",
      paymentProofImageUrl:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80",
      status: "verified",
      adminNotes: "Bank transfer verified against SCB statement. Account activated.",
      createdAt: "2026-08-11 11:05",
      verifiedAt: "2026-08-11 11:30",
    },
    {
      id: "pay-req-103",
      userId: "usr-1209",
      userName: "Rupa Thapa",
      userEmail: "rupa.thapa@care2care.np",
      planId: "Enterprise",
      planName: "Enterprise Clinic Tier",
      amount: 299.99,
      currency: "USD",
      transactionId: "TXN-INVALID-000",
      paymentProofImageUrl:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
      status: "rejected",
      adminNotes: "Screenshot blurry and transaction ID did not match bank ledger. Please re-upload.",
      createdAt: "2026-08-10 09:15",
      verifiedAt: "2026-08-10 10:00",
    },
  ];
}
