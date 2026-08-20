import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Radio,
  Battery,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  Trash2,
  Check,
  Shield,
  Zap
} from "lucide-react";
import { SosAlertItem } from "./types";

interface SosAlertsNotificationsProps {
  alerts: SosAlertItem[];
  onMarkAllRead: () => void;
  onClearAlert: (id: string) => void;
  onNotify: (msg: string) => void;
}

export const SosAlertsNotifications: React.FC<SosAlertsNotificationsProps> = ({
  alerts,
  onMarkAllRead,
  onClearAlert,
  onNotify
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"alerts" | "notifications">("alerts");
  const [selectedAlert, setSelectedAlert] = useState<SosAlertItem | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    if (activeSubTab === "alerts") return a.severity === "warning" || a.severity === "danger";
    return a.severity === "info";
  });

  return (
    <div className="space-y-4">
      {/* TABS (SCREEN 9: Alerts | Notifications) */}
      <div className="flex bg-[#FFF0EB] p-1 rounded-2xl border border-[#FFD9CC]">
        <button
          onClick={() => setActiveSubTab("alerts")}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === "alerts"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Alerts ({alerts.filter((a) => a.severity !== "info").length})
        </button>
        <button
          onClick={() => setActiveSubTab("notifications")}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === "notifications"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Notifications ({alerts.filter((a) => a.severity === "info").length})
        </button>
      </div>

      {/* MARK ALL READ TOP BAR */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500">
          Showing {filteredAlerts.length} items
        </span>
        <button
          onClick={onMarkAllRead}
          className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* ALERTS LIST (SCREEN 9) */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => setSelectedAlert(alert)}
            className={`bg-white border rounded-2xl p-4 shadow-xs transition-all cursor-pointer flex items-center justify-between ${
              !alert.read
                ? "border-orange-300 bg-orange-50/20"
                : "border-[#FFE8DE] hover:border-orange-200"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  alert.severity === "danger"
                    ? "bg-rose-100 text-rose-600"
                    : alert.severity === "warning"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {alert.type === "high_speed" && <Zap className="w-5 h-5" />}
                {alert.type === "geofence" && <MapPin className="w-5 h-5" />}
                {alert.type === "battery_low" && <Battery className="w-5 h-5" />}
                {alert.type === "sos_test" && <Radio className="w-5 h-5" />}
                {alert.type === "checkin_missed" && <Clock className="w-5 h-5" />}
                {alert.type === "general" && <Bell className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {alert.title}
                  </h4>
                  {!alert.read && (
                    <span className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {alert.timestamp}
                </p>
                <p className="text-xs text-slate-600 font-medium line-clamp-1 mt-1">
                  {alert.description}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        ))}
      </div>

      {/* VIEW ALL ALERTS BUTTON (SCREEN 9) */}
      <button
        onClick={() => onNotify("All security telemetry logs synced.")}
        className="w-full py-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 font-black text-xs shadow-xs cursor-pointer"
      >
        View All Alerts
      </button>

      {/* ALERT DETAILS MODAL */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {selectedAlert.title}
              </h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 space-y-2 text-xs">
              <div className="font-bold text-slate-500">
                Timestamp: {selectedAlert.timestamp}
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                {selectedAlert.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClearAlert(selectedAlert.id);
                  setSelectedAlert(null);
                }}
                className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedAlert(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#FF5A36] text-white font-black text-xs hover:bg-[#E63920]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
