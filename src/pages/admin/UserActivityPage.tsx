import React, { useState } from "react";
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  Clock,
  Smartphone,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye
} from "lucide-react";
import { UserAccount } from "../../types/adminTypes";

interface UserActivityPageProps {
  users?: UserAccount[];
  showToast?: (msg: string) => void;
}

interface SessionLog {
  id: string;
  userName: string;
  userEmail: string;
  action: string;
  service: string;
  ipAddress: string;
  device: string;
  location: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

const DEMO_SESSIONS: SessionLog[] = [
  {
    id: "sess-101",
    userName: "John Doe",
    userEmail: "johndoe@gmail.com",
    action: "Logged 2,000 ml water intake",
    service: "Water Tracker",
    ipAddress: "27.34.20.11",
    device: "Android App v8.5",
    location: "Kathmandu, Nepal",
    timestamp: "2 mins ago",
    status: "success"
  },
  {
    id: "sess-102",
    userName: "Jane Smith",
    userEmail: "jane.smith@gmail.com",
    action: "Renewed Annual Subscription via QR",
    service: "Financial Hub",
    ipAddress: "103.21.144.9",
    device: "Chrome / macOS",
    location: "Pokhara, Nepal",
    timestamp: "5 mins ago",
    status: "success"
  },
  {
    id: "sess-103",
    userName: "Mike Johnson",
    userEmail: "mike.johnson@gmail.com",
    action: "Completed 7-Day Yoga Challenge quest",
    service: "Yoga & Habit Quest",
    ipAddress: "152.58.12.88",
    device: "iOS Safari",
    location: "New Delhi, India",
    timestamp: "12 mins ago",
    status: "success"
  },
  {
    id: "sess-104",
    userName: "Sarah Brown",
    userEmail: "sarah.brown@gmail.com",
    action: "Added Metformin 500mg reminder",
    service: "Medicine Service",
    ipAddress: "73.189.44.102",
    device: "Android App v8.5",
    location: "San Francisco, USA",
    timestamp: "18 mins ago",
    status: "success"
  },
  {
    id: "sess-105",
    userName: "Robert Wilson",
    userEmail: "robert.wilson@gmail.com",
    action: "Created sub-account (Emma Wilson - Child)",
    service: "User & Sub-Accounts",
    ipAddress: "86.124.90.3",
    device: "Windows Chrome",
    location: "London, UK",
    timestamp: "25 mins ago",
    status: "success"
  },
  {
    id: "sess-106",
    userName: "Emily Parker",
    userEmail: "emily.p@gmail.com",
    action: "Submitted Bank Transfer Proof NPR 5,000",
    service: "Manual Payment",
    ipAddress: "27.34.19.45",
    device: "Android App v8.5",
    location: "Lalitpur, Nepal",
    timestamp: "2h 15m ago",
    status: "warning"
  },
  {
    id: "sess-107",
    userName: "David Lee",
    userEmail: "david.lee@outlook.com",
    action: "Failed 2-Factor PIN entry",
    service: "Security Auth",
    ipAddress: "182.74.55.19",
    device: "Firefox / Ubuntu",
    location: "Sydney, Australia",
    timestamp: "5h 30m ago",
    status: "error"
  }
];

export const UserActivityPage: React.FC<UserActivityPageProps> = ({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [logs, setLogs] = useState<SessionLog[]>(DEMO_SESSIONS);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchService = filterService === "all" || log.service === filterService;
    const matchStatus = filterStatus === "all" || log.status === filterStatus;
    return matchSearch && matchService && matchStatus;
  });

  const handleExportLogs = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["User,Email,Action,Service,IP,Device,Location,Time,Status"]
        .concat(
          filteredLogs.map(
            (l) =>
              `"${l.userName}","${l.userEmail}","${l.action}","${l.service}","${l.ipAddress}","${l.device}","${l.location}","${l.timestamp}","${l.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `user_activity_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast("User activity logs downloaded as CSV");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#FFF9F5] dark:bg-[#131d38] border border-orange-200/80 dark:border-[#1e294b] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                Live Audit & Telemetry
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {filteredLogs.length} Events Recorded
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              User Activity & Live Telemetry
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="px-4 py-2.5 bg-white dark:bg-[#1a274c] hover:bg-orange-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black rounded-2xl border border-slate-200/80 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#FF5A36]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setLogs([...DEMO_SESSIONS]);
              if (showToast) showToast("Activity logs refreshed");
            }}
            className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Live Stream</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, action, IP, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Services</option>
            <option value="Water Tracker">Water Tracker</option>
            <option value="Financial Hub">Financial Hub</option>
            <option value="Yoga & Habit Quest">Yoga & Habit Quest</option>
            <option value="Medicine Service">Medicine Service</option>
            <option value="User & Sub-Accounts">User & Sub-Accounts</option>
            <option value="Manual Payment">Manual Payment</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Failed / Error</option>
          </select>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white dark:bg-[#131d38] rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-[#1e294b]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Action & Service</th>
                <th className="p-4">Device & IP</th>
                <th className="p-4">Location</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-orange-50/40 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{log.userName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{log.userEmail}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-800 dark:text-slate-200 font-semibold">{log.action}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {log.service}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{log.ipAddress}</div>
                    <div className="text-[11px] text-slate-500">{log.device}</div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.location}</span>
                  </td>
                  <td className="p-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4 text-center">
                    {log.status === "success" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Success
                      </span>
                    )}
                    {log.status === "warning" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        Pending
                      </span>
                    )}
                    {log.status === "error" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
