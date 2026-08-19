import React, { useState } from "react";
import { AdminLayout, AdminTab, AdminConsoleMode, UserAccount } from "../layouts/AdminLayout";
import { OverviewPage } from "../pages/admin/Overview";
import { UsersPage } from "../pages/admin/Users";
import { WorkspacesPage } from "../pages/admin/Workspaces";
import { PermissionTemplatesPage } from "../pages/admin/PermissionTemplates";
import { FinancePayoutsPage } from "../pages/admin/FinancePayouts";
import { SystemPage, AuditLogEntry } from "../pages/admin/System";
import { AuditLogsPage } from "../pages/admin/AuditLogs";
import { SyncLogsPage } from "../pages/admin/SyncLogsPage";
import { PaymentVerificationTab } from "./admin/PaymentVerificationTab";
import { PaymentSettingsTab } from "./admin/PaymentSettingsTab";
import { InternationalBillingTab } from "./admin/InternationalBillingTab";
import { BillingSettingsTab } from "./admin/BillingSettingsTab";

export type { UserAccount };

interface AdminDashboardProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onCloseAdmin?: () => void;
}

const DEMO_USERS: UserAccount[] = [
  {
    id: "usr-1",
    name: "Admin Superuser",
    email: "admin@care2care.org",
    role: "admin",
    plan: "Enterprise",
    status: "Active",
    createdAt: "2026-01-01",
    lastLogin: "Just now",
    businessName: "Care2Care Global Admin"
  },
  {
    id: "usr-2",
    name: "Eleanor Vance",
    email: "eleanor.vance@family.com",
    role: "user",
    plan: "Family",
    status: "Active",
    createdAt: "2026-02-14",
    lastLogin: "2 hours ago",
    businessName: "Vance Family Estate",
    subAccountsCount: 5
  },
  {
    id: "usr-3",
    name: "Dr. Robert Sterling",
    email: "robert.sterling@clinic.org",
    role: "user",
    plan: "Enterprise",
    status: "Active",
    createdAt: "2026-03-10",
    lastLogin: "Yesterday",
    businessName: "Sterling Medical Clinic",
    subAccountsCount: 12
  },
  {
    id: "usr-4",
    name: "Marcus Miller",
    email: "marcus.miller@gmail.com",
    role: "user",
    plan: "Free",
    status: "Active",
    createdAt: "2026-05-01",
    lastLogin: "3 days ago"
  },
  {
    id: "usr-5",
    name: "Apex Store Manager",
    email: "apex.store@care2care.org",
    role: "user",
    plan: "Enterprise",
    status: "Active",
    createdAt: "2026-01-10",
    lastLogin: "10 mins ago",
    businessName: "Apex Retail Pharmacy & Store",
    subAccountsCount: 8
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-1",
    timestamp: "2026-08-11 06:10",
    adminEmail: "admin@care2care.org",
    action: "SYSTEM_INITIALIZED",
    details: "Care2Care Enterprise Multi-Tenant Console v3.2 initialized."
  },
  {
    id: "audit-2",
    timestamp: "2026-08-10 18:45",
    adminEmail: "admin@care2care.org",
    action: "WORKSPACE_ONBOARDED",
    details: "Onboarded Sterling Medical Clinic with 12 sub-accounts."
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [consoleMode, setConsoleMode] = useState<AdminConsoleMode>("superadmin");
  const [users, setUsers] = useState<UserAccount[]>(DEMO_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      adminEmail: currentUser.email,
      action,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // User Action 1: Update Status (Active, Suspended, Banned)
  const handleUpdateUserStatus = (userId: string, newStatus: "Active" | "Suspended" | "Banned") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    const targetUser = users.find((u) => u.id === userId);
    addAuditLog(
      `USER_${newStatus.toUpperCase()}`,
      `Changed user status for ${targetUser?.name || userId} (${targetUser?.email}) to ${newStatus}. Auto-locked linked sub-accounts.`
    );
  };

  // User Action 2: Update Plan & Role
  const handleUpdateUserPlanAndRole = (
    userId: string,
    newPlan: UserAccount["plan"],
    newRole: UserAccount["role"]
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, plan: newPlan, role: newRole } : u))
    );
    const targetUser = users.find((u) => u.id === userId);
    addAuditLog(
      "USER_ROLE_PLAN_UPDATED",
      `Updated ${targetUser?.name} (${targetUser?.email}) to Plan: ${newPlan}, Role: ${newRole}.`
    );
  };

  // User Action 3: Send Warning
  const handleSendUserWarning = (userId: string, warningMessage: string) => {
    const targetUser = users.find((u) => u.id === userId);
    addAuditLog(
      "USER_WARNING_ISSUED",
      `Issued warning to ${targetUser?.name} (${targetUser?.email}): "${warningMessage}"`
    );
  };

  // User Action 4: Send Targeted Notification
  const handleSendUserNotification = (userId: string, title: string, message: string) => {
    const targetUser = users.find((u) => u.id === userId);
    addAuditLog(
      "NOTIFICATION_SENT",
      `Sent notification to ${targetUser?.name}: [${title}] ${message}`
    );
  };

  // Global Broadcast Notification
  const handleSendGlobalBroadcast = (title: string, message: string) => {
    addAuditLog("GLOBAL_BROADCAST_SENT", `[${title}] ${message}`);
  };

  return (
    <AdminLayout
      currentUser={currentUser}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
      onCloseAdmin={onCloseAdmin}
      consoleMode={consoleMode}
      onConsoleModeChange={setConsoleMode}
      toastMsg={toastMsg}
    >
      {activeTab === "overview" && (
        <OverviewPage
          consoleMode={consoleMode}
          onNavigateTab={setActiveTab}
          totalUsersCount={users.length}
          totalWorkspacesCount={4}
          pendingPayoutsCount={2}
          pendingPayrollCount={12}
          supabaseConnected={false}
          paddleConfigured={true}
        />
      )}

      {activeTab === "users" && (
        <UsersPage
          users={users}
          onUpdateUserStatus={handleUpdateUserStatus}
          onUpdateUserPlanAndRole={handleUpdateUserPlanAndRole}
          onSendUserWarning={handleSendUserWarning}
          onSendUserNotification={handleSendUserNotification}
          showToast={showToast}
        />
      )}

      {activeTab === "workspaces" && (
        <WorkspacesPage showToast={showToast} />
      )}

      {activeTab === "permissions" && (
        <PermissionTemplatesPage showToast={showToast} />
      )}

      {activeTab === "synclogs" && (
        <SyncLogsPage />
      )}

      {activeTab === "finance" && (
        <FinancePayoutsPage showToast={showToast} />
      )}

      {activeTab === "payment_verification" && (
        <PaymentVerificationTab showToast={showToast} />
      )}

      {activeTab === "payment_settings" && (
        <PaymentSettingsTab showToast={showToast} />
      )}

      {activeTab === "international_billing" && (
        <InternationalBillingTab showToast={showToast} />
      )}

      {activeTab === "billing_settings" && (
        <BillingSettingsTab showToast={showToast} />
      )}

      {activeTab === "system" && (
        <SystemPage
          showToast={showToast}
          onSendGlobalBroadcast={handleSendGlobalBroadcast}
        />
      )}

      {activeTab === "audit" && (
        <AuditLogsPage
          auditLogs={auditLogs}
          showToast={showToast}
        />
      )}
    </AdminLayout>
  );
};
