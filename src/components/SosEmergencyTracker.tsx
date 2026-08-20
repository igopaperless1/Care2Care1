import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import {
  ShieldAlert,
  LayoutGrid,
  Users,
  MapPin,
  Sparkles,
  Heart,
  AlertTriangle,
  Bell,
  LifeBuoy,
  Settings as SettingsIcon,
  History,
  Phone,
  FileText,
  Share2,
  CheckCircle2,
  Siren,
  Plus
} from "lucide-react";
import {
  SosTab,
  SosEmergencyContact,
  SosContactGroup,
  SosNearbyService,
  SosMedicalProfile,
  SosIncident,
  SosAlertItem,
  SosHelpResource,
  SosActivityLogItem,
  SosSafetyPlan,
  SosSettingsConfig
} from "./sos/types";
import {
  INITIAL_SOS_CONTACTS,
  INITIAL_CONTACT_GROUPS,
  INITIAL_NEARBY_SERVICES,
  INITIAL_MEDICAL_PROFILE,
  INITIAL_INCIDENTS,
  INITIAL_ALERTS,
  INITIAL_HELP_RESOURCES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SAFETY_PLANS,
  INITIAL_SETTINGS
} from "./sos/data";

import { SosDashboard } from "./sos/SosDashboard";
import { SosEmergencyTrigger } from "./sos/SosEmergencyTrigger";
import { SosContacts } from "./sos/SosContacts";
import { SosNearbyHelp } from "./sos/SosNearbyHelp";
import { SosSafetyToolkit } from "./sos/SosSafetyToolkit";
import { SosMedicalInfo } from "./sos/SosMedicalInfo";
import { SosIncidents } from "./sos/SosIncidents";
import { SosAlertsNotifications } from "./sos/SosAlertsNotifications";
import { SosHelpResources } from "./sos/SosHelpResources";
import { SosSettings } from "./sos/SosSettings";
import { SosActivityLog } from "./sos/SosActivityLog";
import { SosSafetyPlans } from "./sos/SosSafetyPlans";

interface SosEmergencyTrackerProps {
  patient?: Patient;
}

export const SosEmergencyTracker: React.FC<SosEmergencyTrackerProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<SosTab>("dashboard");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // PERSISTENT STATES
  const [contacts, setContacts] = useState<SosEmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_sos_contacts");
      return saved ? JSON.parse(saved) : INITIAL_SOS_CONTACTS;
    } catch {
      return INITIAL_SOS_CONTACTS;
    }
  });

  const [groups, setGroups] = useState<SosContactGroup[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_sos_groups");
      return saved ? JSON.parse(saved) : INITIAL_CONTACT_GROUPS;
    } catch {
      return INITIAL_CONTACT_GROUPS;
    }
  });

  const [nearbyServices, setNearbyServices] = useState<SosNearbyService[]>(INITIAL_NEARBY_SERVICES);

  const [medicalProfile, setMedicalProfile] = useState<SosMedicalProfile>(() => {
    try {
      const saved = localStorage.getItem("care2care_sos_medical");
      return saved ? JSON.parse(saved) : INITIAL_MEDICAL_PROFILE;
    } catch {
      return INITIAL_MEDICAL_PROFILE;
    }
  });

  const [incidents, setIncidents] = useState<SosIncident[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_sos_incidents");
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [alerts, setAlerts] = useState<SosAlertItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_sos_alerts");
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [resources, setResources] = useState<SosHelpResource[]>(INITIAL_HELP_RESOURCES);

  const [activityLogs, setActivityLogs] = useState<SosActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_sos_logs");
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [safetyPlans, setSafetyPlans] = useState<SosSafetyPlan[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_sos_plans");
      return saved ? JSON.parse(saved) : INITIAL_SAFETY_PLANS;
    } catch {
      return INITIAL_SAFETY_PLANS;
    }
  });

  const [settings, setSettings] = useState<SosSettingsConfig>(() => {
    try {
      const saved = localStorage.getItem("care2care_sos_settings");
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("care2care_sos_contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("care2care_sos_medical", JSON.stringify(medicalProfile));
  }, [medicalProfile]);

  useEffect(() => {
    localStorage.setItem("care2care_sos_incidents", JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem("care2care_sos_alerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem("care2care_sos_logs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem("care2care_sos_settings", JSON.stringify(settings));
  }, [settings]);

  // LOG ACTIVITY HELPER
  const addLog = (type: any, title: string, description: string, extra?: any) => {
    const newLog: SosActivityLogItem = {
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      timestamp: new Date().toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }),
      ...extra
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // HANDLERS
  const handleTriggerSos = () => {
    setIsEmergencyActive(true);
    setActiveTab("emergency_sos");
    addLog("sos_sent", "SOS Alert Initiated", "Emergency panic button triggered from dashboard.");
  };

  const handleSosComplete = (message: string, isLiveLocation: boolean) => {
    setIsEmergencyActive(true);
    addLog(
      "sos_sent",
      "SOS Broadcast Dispatched",
      `Distress SMS and Live GPS location broadcast dispatched to ${contacts.length} emergency contacts.`,
      { location: "Kathmandu, Nepal (Tripureshwor)" }
    );
    showNotification("🚨 Emergency distress alert dispatched to all primary contacts!");
  };

  const handleCallContact = (contact: SosEmergencyContact) => {
    addLog("contact_called", `Dialed ${contact.name}`, `Initiated emergency voice call to ${contact.phone}`);
    window.open(`tel:${contact.phone}`, "_self");
  };

  const handleSendSms = (contact: SosEmergencyContact) => {
    const defaultMsg = encodeURIComponent(
      `CARE2CARE EMERGENCY: I need assistance. My location: https://maps.google.com/?q=27.6934,85.3148`
    );
    addLog("location_shared", `SMS Sent to ${contact.name}`, `Dispatched location message to ${contact.phone}`);
    window.open(`sms:${contact.phone}?body=${defaultMsg}`, "_blank");
  };

  const handleBroadcastGroup = (group: SosContactGroup) => {
    addLog("location_shared", `Group Broadcast: ${group.name}`, `Dispatched emergency alert to ${group.memberIds.length} members`);
    showNotification(`Emergency broadcast message sent to ${group.name}!`);
  };

  const handleCallService = (service: SosNearbyService) => {
    addLog("contact_called", `Called ${service.name}`, `Emergency line ${service.phone}`);
    window.open(`tel:${service.phone}`, "_self");
  };

  const handleCallResource = (phone: string, name: string) => {
    addLog("contact_called", `Dialed ${name}`, `Helpline ${phone}`);
    window.open(`tel:${phone}`, "_self");
  };

  const handleAddIncident = (newInc: Omit<SosIncident, "id">) => {
    const inc: SosIncident = {
      ...newInc,
      id: `inc-${Date.now()}`
    };
    setIncidents((prev) => [inc, ...prev]);
    addLog("incident_reported", "Incident Reported", `Submitted report for ${inc.type} at ${inc.location}`);
  };

  const handleExportBackup = () => {
    const data = {
      contacts,
      medicalProfile,
      incidents,
      alerts,
      activityLogs,
      safetyPlans,
      settings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `care2care_sos_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("SOS configuration backup downloaded.");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.contacts) setContacts(parsed.contacts);
        if (parsed.medicalProfile) setMedicalProfile(parsed.medicalProfile);
        if (parsed.incidents) setIncidents(parsed.incidents);
        if (parsed.alerts) setAlerts(parsed.alerts);
        if (parsed.activityLogs) setActivityLogs(parsed.activityLogs);
        if (parsed.safetyPlans) setSafetyPlans(parsed.safetyPlans);
        if (parsed.settings) setSettings(parsed.settings);
        showNotification("SOS backup restored successfully!");
      } catch (err) {
        showNotification("Invalid backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all SOS settings and data to default?")) {
      setContacts(INITIAL_SOS_CONTACTS);
      setMedicalProfile(INITIAL_MEDICAL_PROFILE);
      setIncidents(INITIAL_INCIDENTS);
      setAlerts(INITIAL_ALERTS);
      setActivityLogs(INITIAL_ACTIVITY_LOGS);
      setSafetyPlans(INITIAL_SAFETY_PLANS);
      setSettings(INITIAL_SETTINGS);
      showNotification("Reset to factory defaults.");
    }
  };

  // NAVIGATION MENU ITEMS (Matches 12 screens in user screenshot)
  const navMenuItems: Array<{ id: SosTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "emergency_sos", label: "SOS", icon: Siren, badge: isEmergencyActive ? 1 : undefined },
    { id: "contacts", label: "Emergency Contacts", icon: Users, badge: contacts.length },
    { id: "nearby_help", label: "Nearby Help", icon: MapPin },
    { id: "safety_toolkit", label: "Safety Toolkit", icon: Sparkles },
    { id: "medical_info", label: "Medical Info", icon: Heart },
    { id: "incidents", label: "Incidents", icon: AlertTriangle, badge: incidents.filter((i) => i.status !== "Closed").length },
    { id: "report_incident", label: "Report Incident", icon: Plus },
    { id: "alerts", label: "Alerts & Notifications", icon: Bell, badge: alerts.filter((a) => !a.read).length },
    { id: "resources", label: "Help Resources", icon: LifeBuoy },
    { id: "settings", label: "SOS Settings", icon: SettingsIcon },
    { id: "activity_log", label: "Activity Log", icon: History },
    { id: "safety_plans", label: "Safety Plans", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] p-3 sm:p-5 max-w-5xl mx-auto space-y-4 font-sans text-slate-800">
      {/* NOTIFICATION FEEDBACK TOAST */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-3 rounded-2xl shadow-lg shadow-orange-500/20 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#FFE8DE] rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5A36] to-[#E63920] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Care2Care SOS
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5A36] border border-orange-200">
                Live 24/7 Guard
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Care daily. Live fully. Instant emergency beacon & dispatch
            </p>
          </div>
        </div>

        {/* Quick Direct Panic Call Buttons */}
        <div className="flex items-center gap-2">
          <a
            href="tel:100"
            className="px-3.5 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Police (100)</span>
          </a>
          <a
            href="tel:102"
            className="px-3.5 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Ambulance (102)</span>
          </a>
          <button
            onClick={() => setActiveTab("emergency_sos")}
            className="px-4 py-2 rounded-2xl bg-[#FF5A36] hover:bg-[#E63920] text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Siren className="w-3.5 h-3.5" />
            <span>SOS Panic</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLLING MENU (Water-colored theme matching WaterTracker) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs font-black scale-102"
                  : "bg-white text-slate-700 hover:bg-orange-50 border-slate-200/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#FF5A36]"}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white text-[#FF5A36]" : "bg-orange-100 text-[#FF5A36]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE SCREEN */}
      {activeTab === "dashboard" && (
        <SosDashboard
          userName={patient?.name || "Roshan"}
          contacts={contacts}
          incidents={incidents}
          alerts={alerts}
          nearbyServices={nearbyServices}
          medicalProfile={medicalProfile}
          onTriggerSos={handleTriggerSos}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onCallContact={handleCallContact}
          onQuickTool={(toolId) => setActiveTab("safety_toolkit")}
        />
      )}

      {activeTab === "emergency_sos" && (
        <SosEmergencyTrigger
          contacts={contacts}
          isEmergencyActive={isEmergencyActive}
          onTriggerSosComplete={handleSosComplete}
          onCancelEmergency={() => {
            setIsEmergencyActive(false);
            showNotification("Emergency state cancelled.");
          }}
        />
      )}

      {activeTab === "contacts" && (
        <SosContacts
          contacts={contacts}
          groups={groups}
          onAddContact={(c) => {
            const newC: SosEmergencyContact = {
              ...c,
              id: `c-${Date.now()}`
            };
            setContacts((prev) => [...prev, newC]);
            addLog("settings_updated", "Emergency Contact Added", `Added ${c.name} (${c.relationship})`);
            showNotification(`Added ${c.name} to emergency contacts.`);
          }}
          onUpdateContact={(updated) => {
            setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            showNotification(`Updated ${updated.name}.`);
          }}
          onDeleteContact={(id) => {
            setContacts((prev) => prev.filter((c) => c.id !== id));
            showNotification("Contact removed.");
          }}
          onCallContact={handleCallContact}
          onSendSms={handleSendSms}
          onBroadcastGroup={handleBroadcastGroup}
        />
      )}

      {activeTab === "nearby_help" && (
        <SosNearbyHelp
          services={nearbyServices}
          onCallService={handleCallService}
        />
      )}

      {activeTab === "safety_toolkit" && (
        <SosSafetyToolkit
          contacts={contacts}
          onNotify={showNotification}
        />
      )}

      {activeTab === "medical_info" && (
        <SosMedicalInfo
          medicalProfile={medicalProfile}
          onUpdateMedicalProfile={(updated) => {
            setMedicalProfile(updated);
            addLog("settings_updated", "Medical Profile Updated", `Blood Group: ${updated.bloodGroup}`);
          }}
          onNotify={showNotification}
        />
      )}

      {activeTab === "incidents" && (
        <SosIncidents
          incidents={incidents}
          initialMode="list"
          onAddIncident={handleAddIncident}
          onUpdateIncidentStatus={(id, status) => {
            setIncidents((prev) =>
              prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
            );
          }}
          onNotify={showNotification}
        />
      )}

      {activeTab === "report_incident" && (
        <SosIncidents
          incidents={incidents}
          initialMode="report"
          onAddIncident={handleAddIncident}
          onNotify={showNotification}
        />
      )}

      {activeTab === "alerts" && (
        <SosAlertsNotifications
          alerts={alerts}
          onMarkAllRead={() => {
            setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
            showNotification("All alerts marked as read.");
          }}
          onClearAlert={(id) => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
            showNotification("Alert dismissed.");
          }}
          onNotify={showNotification}
        />
      )}

      {activeTab === "resources" && (
        <SosHelpResources
          resources={resources}
          onCallNumber={handleCallResource}
        />
      )}

      {activeTab === "settings" && (
        <SosSettings
          settings={settings}
          contacts={contacts}
          onUpdateSettings={(newConfig) => {
            setSettings(newConfig);
            addLog("settings_updated", "SOS Settings Updated", `Method: ${newConfig.activationMethod}`);
          }}
          onExportData={handleExportBackup}
          onImportData={handleImportBackup}
          onResetDefaults={handleResetDefaults}
          onNotify={showNotification}
        />
      )}

      {activeTab === "activity_log" && (
        <SosActivityLog
          logs={activityLogs}
          onClearLogs={() => {
            setActivityLogs([]);
            showNotification("Activity logs cleared.");
          }}
          onNotify={showNotification}
        />
      )}

      {activeTab === "safety_plans" && (
        <SosSafetyPlans
          safetyPlans={safetyPlans}
          contacts={contacts}
          onBroadcastPlan={(plan) => {
            addLog("location_shared", `Plan Broadcast: ${plan.name}`, plan.emergencyMessage);
          }}
          onNotify={showNotification}
        />
      )}
    </div>
  );
};
