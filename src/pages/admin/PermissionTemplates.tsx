import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  Lock,
  Store,
  Users,
  Heart,
  DollarSign,
  FileText,
  Sliders,
  Sparkles,
  ArrowUpRight,
  X,
  Save
} from "lucide-react";

export interface PermissionTemplate {
  id: string;
  name: string;
  category: "Retail" | "Family & Kids" | "Senior Care" | "Medical Staff";
  description: string;
  assignedSubAccountsCount: number;
  permissions: {
    canViewVitals: boolean;
    canLogVitals: boolean;
    canViewInventory: boolean;
    canManagePOS: boolean;
    canClockIn: boolean;
    canManagePayroll: boolean;
    canAccessFinance: boolean;
    canUseAI: boolean;
  };
}

const DEFAULT_TEMPLATES: PermissionTemplate[] = [
  {
    id: "tpl-101",
    name: "Retail Employee Standard",
    category: "Retail",
    description: "Restricted to POS checkout, inventory scanning, and staff clock-in/out.",
    assignedSubAccountsCount: 64,
    permissions: {
      canViewVitals: false,
      canLogVitals: false,
      canViewInventory: true,
      canManagePOS: true,
      canClockIn: true,
      canManagePayroll: false,
      canAccessFinance: false,
      canUseAI: true
    }
  },
  {
    id: "tpl-102",
    name: "Child & Student Member",
    category: "Family & Kids",
    description: "Allows chore tracking, habit logging, and basic AI homework tutor access.",
    assignedSubAccountsCount: 142,
    permissions: {
      canViewVitals: false,
      canLogVitals: true,
      canViewInventory: false,
      canManagePOS: false,
      canClockIn: false,
      canManagePayroll: false,
      canAccessFinance: false,
      canUseAI: true
    }
  },
  {
    id: "tpl-103",
    name: "Senior Resident / Patient Caregiver",
    category: "Senior Care",
    description: "Grants vital sign logging, pill reminder verification, and family updates.",
    assignedSubAccountsCount: 88,
    permissions: {
      canViewVitals: true,
      canLogVitals: true,
      canViewInventory: false,
      canManagePOS: false,
      canClockIn: true,
      canManagePayroll: false,
      canAccessFinance: false,
      canUseAI: false
    }
  }
];

interface PermissionTemplatesProps {
  showToast: (msg: string) => void;
}

export const PermissionTemplatesPage: React.FC<PermissionTemplatesProps> = ({ showToast }) => {
  const [templates, setTemplates] = useState<PermissionTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTpl, setSelectedTpl] = useState<PermissionTemplate | null>(templates[0]);
  const [isEditing, setIsEditing] = useState(false);

  // New Template Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTplName, setNewTplName] = useState("");
  const [newTplCategory, setNewTplCategory] = useState<PermissionTemplate["category"]>("Retail");
  const [newTplDesc, setNewTplDesc] = useState("");

  const handleTogglePermission = (key: keyof PermissionTemplate["permissions"]) => {
    if (!selectedTpl) return;
    setSelectedTpl({
      ...selectedTpl,
      permissions: {
        ...selectedTpl.permissions,
        [key]: !selectedTpl.permissions[key]
      }
    });
  };

  const handleSaveTemplateChanges = () => {
    if (!selectedTpl) return;
    setTemplates((prev) => prev.map((t) => (t.id === selectedTpl.id ? selectedTpl : t)));
    showToast(
      `Saved rule changes for "${selectedTpl.name}". Automatically synced to ${selectedTpl.assignedSubAccountsCount} sub-accounts.`
    );
    setIsEditing(false);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplName.trim()) return;

    const created: PermissionTemplate = {
      id: `tpl-${Date.now()}`,
      name: newTplName,
      category: newTplCategory,
      description: newTplDesc || "Custom permission template created by Superadmin.",
      assignedSubAccountsCount: 0,
      permissions: {
        canViewVitals: false,
        canLogVitals: false,
        canViewInventory: true,
        canManagePOS: false,
        canClockIn: true,
        canManagePayroll: false,
        canAccessFinance: false,
        canUseAI: true
      }
    };

    setTemplates([created, ...templates]);
    setSelectedTpl(created);
    setIsNewModalOpen(false);
    setNewTplName("");
    setNewTplDesc("");
    showToast(`Created template: "${created.name}"`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Permission Templates & Automated Rule Sync</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Define reusable security rules for retail staff, children, and caregivers. Edits automatically propagate across linked sub-accounts.
            </p>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Template</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: TEMPLATE CARDS LIST */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Available Role Templates ({templates.length})
          </h2>

          {templates.map((tpl) => {
            const isSelected = selectedTpl?.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  setSelectedTpl(tpl);
                  setIsEditing(false);
                }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isSelected ? "bg-emerald-400 text-slate-950" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tpl.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? "text-indigo-200" : "text-slate-500"
                    }`}
                  >
                    {tpl.assignedSubAccountsCount} Active Users
                  </span>
                </div>

                <h3 className="font-extrabold text-sm">{tpl.name}</h3>
                <p className={`text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  {tpl.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* COLUMN 2 & 3: PERMISSION TOGGLE EDITOR */}
        <div className="lg:col-span-2">
          {selectedTpl ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                    Active Editor
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">{selectedTpl.name}</h2>
                  <p className="text-xs text-slate-500">{selectedTpl.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveTemplateChanges}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Auto-Sync Rules</span>
                  </button>
                </div>
              </div>

              {/* TOGGLES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. View Health Vitals */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">View Health Vitals & Records</p>
                    <p className="text-[10px] text-slate-500">Access patient blood pressure, heart rate & meds.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTpl.permissions.canViewVitals}
                    onChange={() => handleTogglePermission("canViewVitals")}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer rounded-md"
                  />
                </div>

                {/* 2. Log Vitals */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">Log Daily Vitals / Water / Meds</p>
                    <p className="text-[10px] text-slate-500">Allow submitting vitals and water logs.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTpl.permissions.canLogVitals}
                    onChange={() => handleTogglePermission("canLogVitals")}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer rounded-md"
                  />
                </div>

                {/* 3. Retail POS & Inventory */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">Retail Inventory & POS Sales</p>
                    <p className="text-[10px] text-slate-500">Scan barcodes, ring up cash sales, check stock.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTpl.permissions.canManagePOS}
                    onChange={() => handleTogglePermission("canManagePOS")}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer rounded-md"
                  />
                </div>

                {/* 4. Staff Clock-In / Out */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">Staff Attendance & Clock-In</p>
                    <p className="text-[10px] text-slate-500">Enable shift timekeeping and attendance badge.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTpl.permissions.canClockIn}
                    onChange={() => handleTogglePermission("canClockIn")}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer rounded-md"
                  />
                </div>

                {/* 5. HR Payroll Access */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">HR Payroll & Salaries</p>
                    <p className="text-[10px] text-slate-500">View staff daily rates and probation statuses.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTpl.permissions.canManagePayroll}
                    onChange={() => handleTogglePermission("canManagePayroll")}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer rounded-md"
                  />
                </div>

                {/* 6. Gemini AI Assistant */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">Gemini AI Assistant & OCR</p>
                    <p className="text-[10px] text-slate-500">Allow AI prescription scanning and summaries.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTpl.permissions.canUseAI}
                    onChange={() => handleTogglePermission("canUseAI")}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer rounded-md"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs text-indigo-900 font-bold">
                <span>Auto-Propagation Status: Connected to {selectedTpl.assignedSubAccountsCount} Active Accounts</span>
                <span className="text-emerald-700 font-mono">Status: Ready</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 font-bold text-xs">
              Select a permission template from the list to view or edit security rules.
            </div>
          )}
        </div>
      </div>

      {/* CREATE NEW TEMPLATE MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Create Permission Template</span>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Template Name:</label>
                <input
                  type="text"
                  required
                  value={newTplName}
                  onChange={(e) => setNewTplName(e.target.value)}
                  placeholder="e.g. Night Shift Nurse Template"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Category:</label>
                <select
                  value={newTplCategory}
                  onChange={(e) => setNewTplCategory(e.target.value as PermissionTemplate["category"])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="Retail">Retail & POS</option>
                  <option value="Family & Kids">Family & Kids</option>
                  <option value="Senior Care">Senior Care</option>
                  <option value="Medical Staff">Medical Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Description:</label>
                <textarea
                  value={newTplDesc}
                  onChange={(e) => setNewTplDesc(e.target.value)}
                  placeholder="Summary of allowed permissions..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
