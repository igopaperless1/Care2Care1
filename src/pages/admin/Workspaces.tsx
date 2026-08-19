import React, { useState } from "react";
import {
  Building2,
  Users,
  Plus,
  Sliders,
  Copy,
  Check,
  Zap,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Shield,
  X,
  Link,
  Store,
  Home,
  Briefcase
} from "lucide-react";

export interface WorkspaceItem {
  id: string;
  name: string;
  type: "Retail Shop" | "Family Hub" | "Senior Care Home" | "Private Clinic" | "Corporate HR";
  ownerEmail: string;
  subAccountsCount: number;
  maxSubAccountsLimit: number;
  aiGenerationsUsed: number;
  aiGenerationsLimit: number;
  status: "Active" | "Restricted";
  createdAt: string;
}

const DEMO_WORKSPACES: WorkspaceItem[] = [
  {
    id: "ws-101",
    name: "Apex Retail Pharmacy & Store",
    type: "Retail Shop",
    ownerEmail: "apex.store@care2care.org",
    subAccountsCount: 8,
    maxSubAccountsLimit: 15,
    aiGenerationsUsed: 420,
    aiGenerationsLimit: 1000,
    status: "Active",
    createdAt: "2026-01-10"
  },
  {
    id: "ws-102",
    name: "Vance Family Estate",
    type: "Family Hub",
    ownerEmail: "eleanor.vance@family.com",
    subAccountsCount: 5,
    maxSubAccountsLimit: 5,
    aiGenerationsUsed: 88,
    aiGenerationsLimit: 250,
    status: "Active",
    createdAt: "2026-02-14"
  },
  {
    id: "ws-103",
    name: "Sterling Medical Clinic",
    type: "Private Clinic",
    ownerEmail: "robert.sterling@clinic.org",
    subAccountsCount: 12,
    maxSubAccountsLimit: 25,
    aiGenerationsUsed: 910,
    aiGenerationsLimit: 2000,
    status: "Active",
    createdAt: "2026-03-01"
  },
  {
    id: "ws-104",
    name: "Sunrise Care Senior Residence",
    type: "Senior Care Home",
    ownerEmail: "director@sunrisecare.org",
    subAccountsCount: 18,
    maxSubAccountsLimit: 30,
    aiGenerationsUsed: 1450,
    aiGenerationsLimit: 1500,
    status: "Active",
    createdAt: "2026-03-20"
  }
];

interface WorkspacesPageProps {
  showToast: (msg: string) => void;
}

export const WorkspacesPage: React.FC<WorkspacesPageProps> = ({ showToast }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(DEMO_WORKSPACES);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Limits Manager Modal state
  const [selectedWsForLimits, setSelectedWsForLimits] = useState<WorkspaceItem | null>(null);
  const [newSubAccountLimit, setNewSubAccountLimit] = useState<number>(10);
  const [newAiLimit, setNewAiLimit] = useState<number>(500);

  // Invite Link Generator Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteWsName, setInviteWsName] = useState("");
  const [inviteWsType, setInviteWsType] = useState<WorkspaceItem["type"]>("Retail Shop");
  const [inviteOwnerEmail, setInviteOwnerEmail] = useState("");
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesSearch =
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || ws.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSaveLimits = () => {
    if (!selectedWsForLimits) return;
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === selectedWsForLimits.id
          ? {
              ...ws,
              maxSubAccountsLimit: newSubAccountLimit,
              aiGenerationsLimit: newAiLimit
            }
          : ws
      )
    );
    showToast(`Updated quota limits for ${selectedWsForLimits.name}`);
    setSelectedWsForLimits(null);
  };

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteWsName.trim() || !inviteOwnerEmail.trim()) return;

    const token = `c2c-invite-${Math.random().toString(36).substring(2, 9)}`;
    const url = `${window.location.origin}/onboard?token=${token}&type=${encodeURIComponent(
      inviteWsType
    )}&email=${encodeURIComponent(inviteOwnerEmail)}`;

    setGeneratedInviteUrl(url);

    // Add new workspace entry
    const newWs: WorkspaceItem = {
      id: `ws-${Date.now()}`,
      name: inviteWsName,
      type: inviteWsType,
      ownerEmail: inviteOwnerEmail,
      subAccountsCount: 1,
      maxSubAccountsLimit: 10,
      aiGenerationsUsed: 0,
      aiGenerationsLimit: 500,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setWorkspaces((prev) => [newWs, ...prev]);
    showToast(`Generated enterprise onboarding link for ${inviteWsName}`);
  };

  const handleCopyInviteLink = () => {
    if (!generatedInviteUrl) return;
    navigator.clipboard.writeText(generatedInviteUrl);
    setCopiedLink(true);
    showToast("Invite link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Workspace & Sub-Accounts Manager</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Multi-tenant administration for Retail Shops, Families, Senior Care Homes & Corporate HR Hubs.
            </p>
          </div>

          <button
            onClick={() => {
              setIsInviteModalOpen(true);
              setGeneratedInviteUrl(null);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard High-Value Client</span>
          </button>
        </div>

        {/* SEARCH AND TYPE FILTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspace or owner email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Workspace Types</option>
            <option value="Retail Shop">Retail Shops & POS</option>
            <option value="Family Hub">Family Hubs</option>
            <option value="Senior Care Home">Senior Care Homes</option>
            <option value="Private Clinic">Private Clinics</option>
          </select>
        </div>
      </div>

      {/* WORKSPACES GRID / TABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorkspaces.map((ws) => {
          const isAiNearLimit = ws.aiGenerationsUsed / ws.aiGenerationsLimit >= 0.8;
          return (
            <div
              key={ws.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-black shrink-0">
                    {ws.type === "Retail Shop" ? (
                      <Store className="w-5 h-5" />
                    ) : ws.type === "Family Hub" ? (
                      <Home className="w-5 h-5" />
                    ) : (
                      <Building2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900">{ws.name}</h2>
                    <p className="text-[11px] text-slate-500 font-medium">{ws.ownerEmail}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {ws.type}
                </span>
              </div>

              {/* QUOTAS AND PROGRESS BARS */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                {/* Sub Accounts Limit */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
                    <span>Sub-Accounts</span>
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="font-black text-slate-900 text-sm">
                    {ws.subAccountsCount} / {ws.maxSubAccountsLimit}
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    {ws.maxSubAccountsLimit - ws.subAccountsCount} slots free
                  </p>
                </div>

                {/* AI Quota */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
                    <span>AI Generations</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="font-black text-slate-900 text-sm">
                    {ws.aiGenerationsUsed} / {ws.aiGenerationsLimit}
                  </div>
                  <p className={`text-[10px] font-bold ${isAiNearLimit ? "text-amber-600" : "text-slate-500"}`}>
                    {Math.round((ws.aiGenerationsUsed / ws.aiGenerationsLimit) * 100)}% used
                  </p>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-mono">Created: {ws.createdAt}</span>

                <button
                  onClick={() => {
                    setSelectedWsForLimits(ws);
                    setNewSubAccountLimit(ws.maxSubAccountsLimit);
                    setNewAiLimit(ws.aiGenerationsLimit);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Limits Manager</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: LIMITS MANAGER */}
      {selectedWsForLimits && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <span>Workspace Quota & Limits Manager</span>
              </div>
              <button onClick={() => setSelectedWsForLimits(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Configuring hard boundaries for <strong className="text-slate-900">{selectedWsForLimits.name}</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  Max Sub-Accounts / Family Members:
                </label>
                <input
                  type="number"
                  value={newSubAccountLimit}
                  onChange={(e) => setNewSubAccountLimit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">Number of staff, kids, or caregivers linked to this workspace.</p>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  Monthly AI Generation Quota (Tokens/Calls):
                </label>
                <input
                  type="number"
                  value={newAiLimit}
                  onChange={(e) => setNewAiLimit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Limits Gemini AI synthesis, OCR prescription scans, and auto-summaries per month.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedWsForLimits(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLimits}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Quota Limits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HIGH VALUE CLIENT ONBOARDING / INVITE LINK GENERATOR */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-indigo-200">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700 font-black text-sm">
                <Link className="w-5 h-5" />
                <span>Onboard Enterprise Client / Generate Invite Link</span>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedInviteUrl ? (
              <form onSubmit={handleGenerateInvite} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Workspace / Business Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteWsName}
                    onChange={(e) => setInviteWsName(e.target.value)}
                    placeholder="e.g. City Central Care Clinic"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Workspace Category:</label>
                  <select
                    value={inviteWsType}
                    onChange={(e) => setInviteWsType(e.target.value as WorkspaceItem["type"])}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Retail Shop">Retail Shop & POS</option>
                    <option value="Family Hub">Family Care Hub</option>
                    <option value="Senior Care Home">Senior Care Residence</option>
                    <option value="Private Clinic">Private Medical Clinic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Owner / Manager Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteOwnerEmail}
                    onChange={(e) => setInviteOwnerEmail(e.target.value)}
                    placeholder="owner@business.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Generate Invite Token
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Invite Link Ready for Onboarding</span>
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Send this link to <strong className="text-emerald-950">{inviteOwnerEmail}</strong> to activate their enterprise workspace automatically.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 text-white rounded-2xl font-mono text-[11px] break-all border border-slate-800 flex items-center justify-between gap-2">
                  <span className="truncate">{generatedInviteUrl}</span>
                  <button
                    onClick={handleCopyInviteLink}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="w-full py-2.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
