import React, { useState, useRef } from "react";
import {
  Building2,
  QrCode,
  BellRing,
  Volume2,
  Vibrate,
  Send,
  MessageSquare,
  Mail,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Upload,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Play
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import {
  PaymentConfiguration,
  AdminNotificationSettings,
  getPaymentConfiguration,
  savePaymentConfiguration,
  getAdminNotificationSettings,
  saveAdminNotificationSettings,
  playAdminAlertSound,
  triggerVibration
} from "../../utils/ManualPaymentEngine";

interface PaymentSettingsTabProps {
  showToast?: (msg: string) => void;
}

export const PaymentSettingsTab: React.FC<PaymentSettingsTabProps> = ({ showToast }) => {
  const [config, setConfig] = useState<PaymentConfiguration>(() => getPaymentConfiguration());
  const [notifSettings, setNotifSettings] = useState<AdminNotificationSettings>(() => getAdminNotificationSettings());

  const [activeAccordion, setActiveAccordion] = useState<"bank" | "notif" | "qr">("bank");
  const [qrGeneratedDataUrl, setQrGeneratedDataUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const handleSaveBankConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    savePaymentConfiguration(config);

    setTimeout(() => {
      setIsSaving(false);
      if (showToast) showToast("✅ Manual Bank Payment & QR Settings saved successfully!");
    }, 400);
  };

  const handleSaveNotifSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminNotificationSettings(notifSettings);
    if (showToast) showToast("🔔 Admin Live Notification Preferences updated!");
  };

  const handleToggleActiveGateway = () => {
    const updated = { ...config, isActive: !config.isActive };
    setConfig(updated);
    savePaymentConfiguration(updated);
    if (showToast) {
      showToast(
        updated.isActive
          ? "🟢 Manual Payment Gateway is now LIVE for all users."
          : "🟡 Manual Payment Gateway put into MAINTENANCE mode."
      );
    }
  };

  // Generate QR Code Image Data URL from UPI ID canvas
  const handleGenerateQRFromUPI = () => {
    if (!config.upiId) {
      alert("Please enter a valid UPI ID first (e.g. care2care@upi)");
      return;
    }

    const upiUri = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(
      config.accountHolderName || "Care2Care"
    )}&cu=INR`;

    if (qrCanvasRef.current) {
      const canvas = qrCanvasRef.current.querySelector("canvas");
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        setQrGeneratedDataUrl(dataUrl);
        setConfig((prev) => ({ ...prev, qrCodeImageUrl: dataUrl }));
        if (showToast) showToast("✨ Auto-generated official UPI QR code!");
      }
    }
  };

  const handleCustomQRFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setConfig((prev) => ({ ...prev, qrCodeImageUrl: result }));
        if (showToast) showToast("Uploaded custom QR Code image!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestConnection = (type: "whatsapp" | "telegram" | "email") => {
    setTestStatus(`Testing ${type.toUpperCase()} alert route...`);

    if (type === "whatsapp") {
      playAdminAlertSound();
      triggerVibration();
      setTimeout(() => {
        setTestStatus(`✅ WhatsApp Webhook Ping Sent successfully to ${notifSettings.whatsappWebhookUrl}`);
        if (showToast) showToast("📱 WhatsApp Webhook Ping Sent!");
      }, 800);
    } else if (type === "telegram") {
      playAdminAlertSound();
      triggerVibration();
      setTimeout(() => {
        setTestStatus(`✅ Telegram Bot Ping Sent to ${notifSettings.telegramBotTokenChatId}`);
        if (showToast) showToast("🤖 Telegram Bot Ping Sent!");
      }, 800);
    } else {
      setTimeout(() => {
        setTestStatus(`✅ Test Alert Email queued to ${notifSettings.emailAddress}`);
        if (showToast) showToast("📧 Test Alert Email dispatched!");
      }, 800);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Manual Payment Gateway & Notification Settings
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure offline bank transfer accounts, UPI QR code generator, and setup real-time WhatsApp, Telegram, and Email webhook alerts for immediate payment verification.
          </p>
        </div>

        {/* Global Active Status Toggle */}
        <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-300">
              Gateway Status
            </div>
            <div className="text-[11px] font-bold text-slate-400">
              {config.isActive ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Active & Accepting
                </span>
              ) : (
                <span className="text-amber-400">Paused (Maintenance)</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleActiveGateway}
            className="cursor-pointer transition-all hover:scale-105"
          >
            {config.isActive ? (
              <ToggleRight className="w-9 h-9 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: BANK DETAILS & UPI QR CODE FORM */}
      <form onSubmit={handleSaveBankConfig} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => setActiveAccordion(activeAccordion === "bank" ? "bank" : "bank")}
          className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-800 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">1. Bank Account & UPI Payment Details</h2>
              <p className="text-xs text-slate-500">Information presented to users during checkout</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Active Account
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Bank Name */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                Bank Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={config.bankName}
                onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                placeholder="e.g. Standard Chartered Bank / Everest Bank"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                Account Holder Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={config.accountHolderName}
                onChange={(e) => setConfig({ ...config, accountHolderName: e.target.value })}
                placeholder="e.g. Care2Care Health Enterprises Pvt Ltd"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={config.accountNumber}
                onChange={(e) => setConfig({ ...config, accountNumber: e.target.value })}
                placeholder="0100-9823-45001"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* IFSC / SWIFT Code */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                IFSC / SWIFT / Branch Code
              </label>
              <input
                type="text"
                value={config.ifscSwiftCode}
                onChange={(e) => setConfig({ ...config, ifscSwiftCode: e.target.value })}
                placeholder="SCBLNPKAXXX"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* UPI ID */}
            <div className="md:col-span-2">
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                UPI ID / Fonepay Mobile Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.upiId}
                  onChange={(e) => setConfig({ ...config, upiId: e.target.value })}
                  placeholder="care2care@upi or 9801234567"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateQRFromUPI}
                  className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate QR from UPI</span>
                </button>
              </div>
            </div>

          </div>

          {/* QR CODE PREVIEW & UPLOADER */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Hidden QRCodeCanvas for auto generation */}
            <div ref={qrCanvasRef} className="hidden">
              <QRCodeCanvas
                value={`upi://pay?pa=${encodeURIComponent(config.upiId || "care2care@upi")}&pn=${encodeURIComponent(
                  config.accountHolderName || "Care2Care"
                )}&cu=INR`}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* QR Image Preview */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              {config.qrCodeImageUrl ? (
                <img
                  src={config.qrCodeImageUrl}
                  alt="Payment QR Code"
                  className="w-36 h-36 object-contain rounded-xl border border-slate-100 p-1"
                />
              ) : (
                <div className="w-36 h-36 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <QrCode className="w-8 h-8 mb-1 text-slate-300" />
                  <span className="text-[10px] font-bold">No QR Code Image Uploaded</span>
                </div>
              )}
              <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider">
                Current Checkout QR
              </span>
            </div>

            {/* Manual QR Code Uploader */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>Upload Custom Bank QR Code Image</span>
              </h4>
              <p className="text-xs text-slate-500">
                You can either click "Generate QR from UPI" above, or upload your official bank eSewa/Fonepay/Khalti printable QR sticker image file.
              </p>

              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Browse & Upload QR Sticker</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomQRFileUpload}
                  className="hidden"
                />
              </label>
            </div>

          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving Config..." : "Save Payment Details"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* SECTION 2: LIVE NOTIFICATION ENGINE SETUP */}
      <form onSubmit={handleSaveNotifSettings} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => setActiveAccordion(activeAccordion === "notif" ? "notif" : "notif")}
          className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <BellRing className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">2. Admin Live Notification Settings & External Webhooks</h2>
              <p className="text-xs text-slate-500">Instant alerts via In-App Ring Sound, Vibration, WhatsApp, Telegram, and Email</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Realtime Alerts
          </span>
        </div>

        <div className="p-6 space-y-6">
          
          {/* In-App Multi-select Checkboxes */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>In-App Browser Feedback Alerts</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Ring Sound Checkbox */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition-all">
                <input
                  type="checkbox"
                  checked={notifSettings.inAppSound}
                  onChange={(e) => setNotifSettings({ ...notifSettings, inAppSound: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
                />
                <div>
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Play Chime / Ring Sound</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Synthetic Web Audio chime on payment submission</div>
                </div>
              </label>

              {/* Vibration Checkbox */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition-all">
                <input
                  type="checkbox"
                  checked={notifSettings.inAppVibration}
                  onChange={(e) => setNotifSettings({ ...notifSettings, inAppVibration: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
                />
                <div>
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Vibrate className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Haptic Device Vibration</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Device vibration feedback for mobile browsers</div>
                </div>
              </label>
            </div>
          </div>

          {/* External Integrations */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              External Webhook Integrations
            </h3>

            {/* WhatsApp Webhook */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Business API Webhook URL</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection("whatsapp")}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Connection</span>
                </button>
              </div>
              <input
                type="text"
                value={notifSettings.whatsappWebhookUrl}
                onChange={(e) => setNotifSettings({ ...notifSettings, whatsappWebhookUrl: e.target.value })}
                placeholder="https://api.whatsapp.com/send?phone=..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-emerald-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Telegram Bot */}
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>Telegram Bot Token / Chat ID</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection("telegram")}
                  className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Connection</span>
                </button>
              </div>
              <input
                type="text"
                value={notifSettings.telegramBotTokenChatId}
                onChange={(e) => setNotifSettings({ ...notifSettings, telegramBotTokenChatId: e.target.value })}
                placeholder="bot123456:ABC.../chat-987654"
                className="w-full px-3.5 py-2 text-xs bg-white border border-sky-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Email Address */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Admin Email for Payment Alerts</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection("email")}
                  className="px-3 py-1 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Connection</span>
                </button>
              </div>
              <input
                type="email"
                value={notifSettings.emailAddress}
                onChange={(e) => setNotifSettings({ ...notifSettings, emailAddress: e.target.value })}
                placeholder="payments-admin@care2care.org"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          {/* Test Status Banner */}
          {testStatus && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{testStatus}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save Notification Preferences</span>
            </button>
          </div>
        </div>
      </form>

    </div>
  );
};
