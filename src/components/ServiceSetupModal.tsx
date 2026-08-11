import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Settings,
  Sliders,
  Bell,
  HardDrive,
  Cloud,
  Zap,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Volume2,
  Smartphone,
  Mail,
  MessageSquare
} from "lucide-react";
import { ServiceSetupConfig } from "../types";
import { serviceSetup } from "../services/serviceSetupService";

interface ServiceSetupModalProps {
  serviceId: string;
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updatedConfig: ServiceSetupConfig) => void;
}

export const ServiceSetupModal: React.FC<ServiceSetupModalProps> = ({
  serviceId,
  serviceName,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [config, setConfig] = useState<ServiceSetupConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"features" | "options" | "notifications" | "storage">("features");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && serviceId) {
      const loaded = serviceSetup.getServiceConfig(serviceId);
      setConfig(loaded);
    }
  }, [isOpen, serviceId]);

  if (!isOpen || !config) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFeature = (featureId: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        features: prev.features.map((f) =>
          f.id === featureId ? { ...f, enabled: !f.enabled } : f
        ),
      };
    });
  };

  const handleOptionChange = (optionId: string, newValue: any) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        customOptions: prev.customOptions.map((opt) =>
          opt.id === optionId ? { ...opt, value: newValue } : opt
        ),
      };
    });
  };

  const handleNotificationToggle = (channel: keyof ServiceSetupConfig["notificationChannels"]) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notificationChannels: {
          ...prev.notificationChannels,
          [channel]: !prev.notificationChannels[channel],
        },
      };
    });
  };

  const handleApplyPreset = (preset: "basic" | "comprehensive" | "caregiver" | "minimal") => {
    const updated = serviceSetup.applyPresetTemplate(serviceId, preset);
    setConfig(updated);
    showToast(`Applied '${preset.toUpperCase()}' preset setup template!`);
  };

  const handleSave = () => {
    if (config) {
      serviceSetup.saveServiceConfig(config);
      if (onSaved) onSaved(config);
      showToast("Service configuration & setup saved successfully!");
      setTimeout(() => {
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center space-x-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight text-white">{serviceName || config.serviceName}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/30 text-emerald-100 border border-emerald-300/30">
                  Custom Setup
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Choose what features, targets, and reminders you want enabled
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Setup Quick Selectors */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick Setup Presets:
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleApplyPreset("minimal")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
            >
              ⚡ Minimal
            </button>
            <button
              onClick={() => handleApplyPreset("basic")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
            >
              ⚖️ Standard
            </button>
            <button
              onClick={() => handleApplyPreset("comprehensive")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
            >
              🚀 Pro Power
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab("features")}
            className={`pb-2.5 px-1 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "features"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modules ({config.features.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("options")}
            className={`pb-2.5 px-1 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "options"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Targets & Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`pb-2.5 px-1 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "notifications"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alert Channels</span>
          </button>
          <button
            onClick={() => setActiveTab("storage")}
            className={`pb-2.5 px-1 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "storage"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Storage & Backup</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* TAB 1: FEATURES & MODULE TOGGLES */}
          {activeTab === "features" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose which tools and components to include in your <strong>{config.serviceName}</strong> workflow:
              </p>

              <div className="space-y-2.5">
                {config.features.map((feature) => (
                  <label
                    key={feature.id}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      feature.enabled
                        ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                        : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="space-y-0.5 pr-4">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {feature.enabled && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        {feature.name}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
                    </div>

                    <input
                      type="checkbox"
                      checked={feature.enabled}
                      onChange={() => handleToggleFeature(feature.id)}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-1 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TARGETS & CUSTOM OPTIONS */}
          {activeTab === "options" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your personalized goals, alert thresholds, and defaults for this service:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {config.customOptions.map((option) => (
                  <div key={option.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      {option.label}
                    </label>

                    {option.type === "number" && (
                      <div className="relative">
                        <input
                          type="number"
                          value={option.value}
                          onChange={(e) => handleOptionChange(option.id, Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {option.unit && (
                          <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                            {option.unit}
                          </span>
                        )}
                      </div>
                    )}

                    {option.type === "text" && (
                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    )}

                    {option.type === "select" && option.options && (
                      <select
                        value={option.value}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {option.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALERT CHANNELS */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select where and how you want to be notified for this service:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer">
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">In-App Popups</div>
                      <div className="text-[10px] text-slate-400">Interactive screen overlay alerts</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notificationChannels.inApp}
                    onChange={() => handleNotificationToggle("inApp")}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer">
                  <div className="flex items-center space-x-2.5">
                    <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">Audio Chime / Sound</div>
                      <div className="text-[10px] text-slate-400">Play chime feedback on alert</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notificationChannels.sound}
                    onChange={() => handleNotificationToggle("sound")}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer">
                  <div className="flex items-center space-x-2.5">
                    <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">Push Notifications</div>
                      <div className="text-[10px] text-slate-400">Device notification bar alerts</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notificationChannels.push}
                    onChange={() => handleNotificationToggle("push")}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 cursor-pointer">
                  <div className="flex items-center space-x-2.5">
                    <MessageSquare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">Emergency SMS</div>
                      <div className="text-[10px] text-slate-400">SMS alert to emergency contact</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notificationChannels.sms}
                    onChange={() => handleNotificationToggle("sms")}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: STORAGE & BACKUP MODE */}
          {activeTab === "storage" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose storage strategy and backup location for <strong>{config.serviceName}</strong> records:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, storageMode: "local" })}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition ${
                    config.storageMode === "local"
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-700"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Local Device</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Private on-device storage</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig({ ...config, storageMode: "cloud" })}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition ${
                    config.storageMode === "cloud"
                      ? "bg-teal-50 dark:bg-teal-950/30 border-teal-500 dark:border-teal-700"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Cloud className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Google Drive</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Direct cloud sync</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig({ ...config, storageMode: "hybrid" })}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition ${
                    config.storageMode === "hybrid"
                      ? "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-500 dark:border-cyan-700"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Hybrid Mode</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Local offline + Drive backup</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Toast */}
        {toastMessage && (
          <div className="mx-5 mb-2 p-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium flex items-center justify-between shadow-lg animate-fadeIn">
            <span>{toastMessage}</span>
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              const reset = serviceSetup.applyPresetTemplate(serviceId, "basic");
              setConfig(reset);
              showToast("Reset service setup to defaults!");
            }}
            className="px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center space-x-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Setup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
