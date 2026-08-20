import React, { useState } from "react";
import {
  History,
  Radio,
  MapPin,
  Phone,
  FileText,
  Settings,
  Sparkles,
  CheckCircle2,
  Clock,
  Trash2,
  Download
} from "lucide-react";
import { SosActivityLogItem } from "./types";

interface SosActivityLogProps {
  logs: SosActivityLogItem[];
  onClearLogs?: () => void;
  onNotify: (msg: string) => void;
}

export const SosActivityLog: React.FC<SosActivityLogProps> = ({
  logs,
  onClearLogs,
  onNotify
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"all" | "sos_events">("all");

  const filteredLogs = logs.filter((log) => {
    if (activeSubTab === "sos_events") {
      return log.type === "sos_sent" || log.type === "location_shared" || log.type === "contact_called";
    }
    return true;
  });

  const handleExportAuditTrail = () => {
    const text = JSON.stringify(logs, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `care2care_sos_activity_log_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("Activity audit trail exported.");
  };

  return (
    <div className="space-y-4">
      {/* TABS (SCREEN 12: All Activities | SOS Events) */}
      <div className="flex bg-[#FFF0EB] p-1 rounded-2xl border border-[#FFD9CC]">
        <button
          onClick={() => setActiveSubTab("all")}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === "all"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All Activities ({logs.length})
        </button>
        <button
          onClick={() => setActiveSubTab("sos_events")}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === "sos_events"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          SOS Events
        </button>
      </div>

      {/* TIMELINE LIST (SCREEN 12) */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white border border-[#FFE8DE] rounded-2xl p-4 shadow-xs flex items-start gap-3.5 hover:border-orange-200 transition-all"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                log.type === "sos_sent"
                  ? "bg-red-100 text-red-600"
                  : log.type === "location_shared"
                  ? "bg-orange-100 text-[#FF5A36]"
                  : log.type === "contact_called"
                  ? "bg-amber-100 text-amber-600"
                  : log.type === "incident_reported"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {log.type === "sos_sent" && <Radio className="w-5 h-5" />}
              {log.type === "location_shared" && <MapPin className="w-5 h-5" />}
              {log.type === "contact_called" && <Phone className="w-5 h-5" />}
              {log.type === "incident_reported" && <FileText className="w-5 h-5" />}
              {log.type === "settings_updated" && <Settings className="w-5 h-5" />}
              {log.type === "toolkit_used" && <Sparkles className="w-5 h-5" />}
              {log.type === "checkin" && <CheckCircle2 className="w-5 h-5" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  {log.title}
                </h4>
                <span className="text-[10px] font-semibold text-slate-400">
                  {log.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                {log.description}
              </p>
              {log.location && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#FF5A36] mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{log.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* VIEW FULL LOG / EXPORT BUTTON (SCREEN 12) */}
      <button
        onClick={handleExportAuditTrail}
        className="w-full py-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 font-black text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>View & Export Full Activity Log</span>
      </button>
    </div>
  );
};
