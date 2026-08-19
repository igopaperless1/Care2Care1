import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Send,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Sliders,
  UserCheck,
  Building2,
  X,
  Bell
} from "lucide-react";
import { UserAccount } from "../../layouts/AdminLayout";

interface UsersPageProps {
  users: UserAccount[];
  onUpdateUserStatus: (userId: string, newStatus: "Active" | "Suspended" | "Banned") => void;
  onUpdateUserPlanAndRole: (userId: string, newPlan: UserAccount["plan"], newRole: UserAccount["role"]) => void;
  onSendUserWarning: (userId: string, warningMessage: string) => void;
  onSendUserNotification: (userId: string, title: string, message: string) => void;
  showToast: (msg: string) => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({
  users,
  onUpdateUserStatus,
  onUpdateUserPlanAndRole,
  onSendUserWarning,
  onSendUserNotification,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals state
  const [selectedUserForWarn, setSelectedUserForWarn] = useState<UserAccount | null>(null);
  const [warnText, setWarnText] = useState("");

  const [selectedUserForNotify, setSelectedUserForNotify] = useState<UserAccount | null>(null);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMsg, setNotifyMsg] = useState("");

  const [selectedUserForBan, setSelectedUserForBan] = useState<UserAccount | null>(null);

  const [selectedUserForRolePlan, setSelectedUserForRolePlan] = useState<UserAccount | null>(null);
  const [editRole, setEditRole] = useState<UserAccount["role"]>("user");
  const [editPlan, setEditPlan] = useState<UserAccount["plan"]>("Free");

  // Filtered users calculation
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.businessName && u.businessName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesPlan = planFilter === "all" || u.plan === planFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesPlan && matchesStatus;
  });

  const handleConfirmWarn = () => {
    if (!selectedUserForWarn || !warnText.trim()) return;
    onSendUserWarning(selectedUserForWarn.id, warnText);
    showToast(`Warning sent to ${selectedUserForWarn.name}!`);
    setSelectedUserForWarn(null);
    setWarnText("");
  };

  const handleConfirmNotify = () => {
    if (!selectedUserForNotify || !notifyMsg.trim()) return;
    onSendUserNotification(selectedUserForNotify.id, notifyTitle || "Notice from Care2Care Admin", notifyMsg);
    showToast(`Notification sent to ${selectedUserForNotify.name}!`);
    setSelectedUserForNotify(null);
    setNotifyTitle("");
    setNotifyMsg("");
  };

  const handleConfirmBan = () => {
    if (!selectedUserForBan) return;
    onUpdateUserStatus(selectedUserForBan.id, "Banned");
    showToast(`Account and linked sub-accounts permanently banned for ${selectedUserForBan.name}`);
    setSelectedUserForBan(null);
  };

  const handleConfirmRolePlan = () => {
    if (!selectedUserForRolePlan) return;
    onUpdateUserPlanAndRole(selectedUserForRolePlan.id, editPlan, editRole);
    showToast(`Updated role & plan for ${selectedUserForRolePlan.name}`);
    setSelectedUserForRolePlan(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* PAGE HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2E7D32]" />
              <span>User & Account Management</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Super-admin controls to inspect users, issue warnings, manage plan tiers, suspend accounts, and auto-lock sub-accounts.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
            Showing <span className="text-[#2E7D32] font-black">{filteredUsers.length}</span> of {users.length} Total Users
          </div>
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email or shop..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Filter: All Roles</option>
            <option value="admin">Admin / Superuser</option>
            <option value="user">Standard User</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Filter: All Plans</option>
            <option value="Free">Free Plan</option>
            <option value="Premium">Premium ($4.99/mo)</option>
            <option value="Family">Family ($9.99/mo)</option>
            <option value="Enterprise">Enterprise ($29.99/mo)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Filter: All Statuses</option>
            <option value="Active">Active Users</option>
            <option value="Suspended">Suspended Users</option>
            <option value="Banned">Banned Users</option>
          </select>
        </div>
      </div>

      {/* USER DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role & Plan</th>
                <th className="py-3.5 px-4">Sub-Accounts</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined / Activity</th>
                <th className="py-3.5 px-4 text-right">Actions & Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-bold">
                    No users matching search filters found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 text-xs shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{u.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                            {u.businessName && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded-md mt-0.5">
                                <Building2 className="w-3 h-3" /> {u.businessName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role & Plan */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {u.role === "admin" ? "Super Admin" : "Standard"}
                          </span>
                          <div className="text-[11px] font-extrabold text-slate-800">
                            {u.plan} Tier
                          </div>
                        </div>
                      </td>

                      {/* Sub Accounts */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                          {u.subAccountsCount || (u.plan === "Enterprise" ? 12 : u.plan === "Family" ? 5 : 1)} Linked
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 w-fit ${
                            u.status === "Active"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : u.status === "Suspended"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {u.status === "Active" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : u.status === "Suspended" ? (
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          <span>{u.status}</span>
                        </span>
                      </td>

                      {/* Joined / Last Login */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        <div>Joined: {u.createdAt}</div>
                        <div className="text-slate-400 font-bold">Active: {u.lastLogin}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WARN BUTTON */}
                          <button
                            onClick={() => setSelectedUserForWarn(u)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl border border-amber-200 transition-all cursor-pointer"
                            title="Send Warning Alert"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>

                          {/* NOTIFY BUTTON */}
                          <button
                            onClick={() => setSelectedUserForNotify(u)}
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 transition-all cursor-pointer"
                            title="Send Push Notification"
                          >
                            <Bell className="w-4 h-4" />
                          </button>

                          {/* EDIT PLAN / ROLE BUTTON */}
                          <button
                            onClick={() => {
                              setSelectedUserForRolePlan(u);
                              setEditRole(u.role);
                              setEditPlan(u.plan);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition-all cursor-pointer"
                            title="Modify Plan or Role"
                          >
                            <Sliders className="w-4 h-4" />
                          </button>

                          {/* SUSPEND / UNSUSPEND BUTTON */}
                          <button
                            onClick={() => {
                              const targetStatus = u.status === "Active" ? "Suspended" : "Active";
                              onUpdateUserStatus(u.id, targetStatus);
                              showToast(
                                targetStatus === "Suspended"
                                  ? `Suspended account & auto-locked sub-accounts for ${u.name}`
                                  : `Re-activated account for ${u.name}`
                              );
                            }}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                              u.status === "Suspended"
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 hover:bg-amber-100 text-amber-800 border-slate-200"
                            }`}
                            title={u.status === "Suspended" ? "Re-activate Account" : "Suspend & Lock Sub-Accounts"}
                          >
                            {u.status === "Suspended" ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>

                          {/* BAN PERMANENTLY BUTTON */}
                          <button
                            onClick={() => setSelectedUserForBan(u)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-all cursor-pointer"
                            title="Ban Account Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: WARN USER */}
      {selectedUserForWarn && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 font-black text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Issue Personalized Warning</span>
              </div>
              <button onClick={() => setSelectedUserForWarn(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Send an in-app system warning directly to <strong className="text-slate-900">{selectedUserForWarn.name}</strong> ({selectedUserForWarn.email}).
            </p>

            <textarea
              value={warnText}
              onChange={(e) => setWarnText(e.target.value)}
              placeholder="e.g. Warning: Your sub-account API quota exceeded allowed limit. Please review your terms."
              rows={4}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForWarn(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWarn}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Send Warning Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NOTIFY USER */}
      {selectedUserForNotify && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-sm">
                <Bell className="w-5 h-5" />
                <span>Send Notification Message</span>
              </div>
              <button onClick={() => setSelectedUserForNotify(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={notifyTitle}
              onChange={(e) => setNotifyTitle(e.target.value)}
              placeholder="Notification Title (e.g. System Maintenance Notice)"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <textarea
              value={notifyMsg}
              onChange={(e) => setNotifyMsg(e.target.value)}
              placeholder="Write message details..."
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForNotify(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNotify}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BAN USER CONFIRMATION */}
      {selectedUserForBan && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2 text-rose-600 font-black text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>Confirm Permanent Account Ban</span>
              </div>
              <button onClick={() => setSelectedUserForBan(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <p className="text-xs text-rose-900 font-extrabold">⚠️ Warning: Irreversible Destruction Action</p>
              <p className="text-[11px] text-rose-700 font-medium">
                Are you sure you want to ban <strong className="text-rose-950">{selectedUserForBan.name}</strong> ({selectedUserForBan.email})?
              </p>
              <p className="text-[10px] text-rose-600 font-bold pt-1">
                This will automatically erase/lock their family tree, inventory, staff payrolls, and linked sub-accounts!
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForBan(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBan}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Yes, Ban & Lock Sub-Accounts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT ROLE & PLAN */}
      {selectedUserForRolePlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <Sliders className="w-5 h-5 text-[#2E7D32]" />
                <span>Modify Plan & Role</span>
              </div>
              <button onClick={() => setSelectedUserForRolePlan(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Updating account configuration for <strong className="text-slate-900">{selectedUserForRolePlan.name}</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Subscription Plan Tier:</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as UserAccount["plan"])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="Free">Free Plan ($0/mo)</option>
                  <option value="Premium">Premium Plan ($4.99/mo)</option>
                  <option value="Family">Family Suite ($9.99/mo)</option>
                  <option value="Enterprise">Enterprise Workspace ($29.99/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Account System Role:</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserAccount["role"])}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Super Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForRolePlan(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRolePlan}
                className="px-4 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
