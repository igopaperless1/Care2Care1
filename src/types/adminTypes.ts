export type AdminTab =
  | "dashboard"
  | "users"
  | "roles"
  | "user_activity"
  | "payment_requests"
  | "verification_queue"
  | "transactions"
  | "plans_pricing"
  | "invoices_reports"
  | "services"
  | "service_analytics"
  | "activity_logs"
  | "system_health"
  | "notifications"
  | "announcements"
  | "support_tickets"
  | "feedback"
  | "settings"
  | "admin_settings"
  | "developer_api"
  | "audit_logs"
  | "overview"
  | "workspaces"
  | "permissions"
  | "finance"
  | "payment_verification"
  | "payment_settings"
  | "international_billing"
  | "billing_settings"
  | "system"
  | "audit"
  | "synclogs"
  | "paperless";

export type AdminConsoleMode = "superadmin" | "workspace";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "manager" | "caregiver";
  plan: "Free" | "Premium" | "Family" | "Enterprise";
  status: "Active" | "Suspended" | "Banned";
  createdAt: string;
  lastLogin: string;
  coins?: number;
  businessName?: string;
  subAccountsCount?: number;
  avatarUrl?: string;
  country?: string;
}

export interface ActivityFeedItem {
  id: string;
  user: string;
  action: string;
  category: "Health" | "Payment" | "Challenge" | "Medicine" | "User" | "System";
  timestamp: string;
  iconType: "water" | "payment" | "yoga" | "medicine" | "user" | "bell";
}

export interface PaymentRequestItem {
  id: string;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  currency: string;
  timeElapsed: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
  method: string;
}

export interface VerificationQueueItem {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  proofUrl: string;
  paymentMethod: string;
  txnId: string;
  submittedAt: string;
  status: "Pending" | "Verified" | "Rejected";
}

export interface SupportTicketItem {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: "Billing" | "Technical" | "Health Data" | "General";
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  timeAgo: string;
  messagesCount: number;
}

export interface ServiceUsageItem {
  id: string;
  name: string;
  category: string;
  activeUsers: number;
  totalEvents: number;
  trend: string;
  status: "active" | "maintenance" | "beta";
  healthScore: number;
}

export interface PlatformHealthStats {
  serverStatus: "Operational" | "Degraded" | "Down";
  database: "Operational" | "Degraded" | "Down";
  storage: "Operational" | "Degraded" | "Down";
  apiServices: "Operational" | "Degraded" | "Down";
  backupStatus: "Up to date" | "Pending" | "Error";
  healthScorePercent: number;
}
