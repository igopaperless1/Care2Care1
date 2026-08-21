import React, { useState } from "react";
import {
  Settings,
  Building2,
  Users,
  Barcode,
  Bell,
  Database,
  FileSpreadsheet,
  Sliders,
  ChevronRight,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Store
} from "lucide-react";

interface ScreenSettingsProps {
  onExportBackup: () => void;
  onImportBackup: (data: any) => void;
  onResetDemoData: () => void;
}

export const ScreenSettings: React.FC<ScreenSettingsProps> = ({
  onExportBackup,
  onImportBackup,
  onResetDemoData
}) => {
  const [selectedSettingModal, setSelectedSettingModal] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Care2Care Hardware & Trading");
  const [currency, setCurrency] = useState("NPR (Nepalese Rupee)");
  const [businessType, setBusinessType] = useState("Building Materials & Hardware");

  const settingsList = [
    {
      id: "general",
      title: "General Settings",
      desc: "Company, Currency, Units & Decimal Precision",
      icon: Settings
    },
    {
      id: "warehouses",
      title: "Warehouses",
      desc: "Manage Warehouses, Aisles, Racks & Bins",
      icon: Building2
    },
    {
      id: "users",
      title: "User Management",
      desc: "Add, Edit & Assign Storekeeper / Auditor Roles",
      icon: Users
    },
    {
      id: "barcode",
      title: "Barcode & Labels",
      desc: "Print Settings, Barcode 128 / QR Templates",
      icon: Barcode
    },
    {
      id: "notifications",
      title: "Notifications",
      desc: "Email, SMS, Push Low Stock & Reorder Alerts",
      icon: Bell
    },
    {
      id: "backup",
      title: "Data Backup",
      desc: "Download JSON Backup & Restore Local State",
      icon: Database
    },
    {
      id: "import_export",
      title: "Import / Export",
      desc: "Bulk CSV / Excel Stock Upload & Download",
      icon: FileSpreadsheet
    },
    {
      id: "other",
      title: "Other Settings",
      desc: "Business Type Profiles & Defaults",
      icon: Sliders
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* SETTINGS MENU (Matching Screenshot Card 11) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Settings & Preferences
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Configure system parameters, backups and hardware printers
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {settingsList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedSettingModal(item.id)}
                className="p-4 bg-[#FFF9F5] border border-orange-100 hover:border-orange-300 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-[#FF5A36] group-hover:bg-[#FF5A36] group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] transition-colors" />
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK DATA MANAGEMENT ACTIONS */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-black text-slate-900">
          Data Management & Reset
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onExportBackup}
            className="p-3.5 bg-[#FFF9F5] hover:bg-orange-50 border border-orange-200 rounded-2xl text-xs font-black text-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-[#FF5A36]" />
            <span>Download Backup (JSON)</span>
          </button>

          <label className="p-3.5 bg-[#FFF9F5] hover:bg-orange-50 border border-orange-200 rounded-2xl text-xs font-black text-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-[#FF5A36]" />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target?.result as string);
                      onImportBackup(data);
                    } catch (err) {
                      alert("Invalid JSON file format.");
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>

          <button
            onClick={() => {
              if (confirm("Reset inventory items and history to default demonstration state?")) {
                onResetDemoData();
              }
            }}
            className="p-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl text-xs font-black text-rose-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
