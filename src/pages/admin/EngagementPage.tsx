import React, { useState } from "react";
import {
  Bell,
  Megaphone,
  Headset,
  Star,
  Send,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertTriangle,
  User,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { SupportTicketItem } from "../../types/adminTypes";

interface EngagementPageProps {
  initialSubTab?: "notifications" | "announcements" | "support_tickets" | "feedback";
  showToast?: (msg: string) => void;
}

const DEMO_TICKETS: SupportTicketItem[] = [
  {
    id: "tkt-101",
    userName: "Emma Watson",
    userEmail: "emma.w@gmail.com",
    subject: "Fonepay QR Receipt uploaded but subscription pending",
    category: "Billing",
    priority: "High",
    status: "Open",
    timeAgo: "15 mins ago",
    messagesCount: 2
  },
  {
    id: "tkt-102",
    userName: "Liam Clark",
    userEmail: "liam.clark@outlook.com",
    subject: "Sub-account invitation link expired",
    category: "Technical",
    priority: "Medium",
    status: "In Progress",
    timeAgo: "2 hours ago",
    messagesCount: 4
  },
  {
    id: "tkt-103",
    userName: "Dr. Maya Sharma",
    userEmail: "maya.sharma@clinic.np",
    subject: "Requesting custom IRD Tax invoice with PAN header",
    category: "Billing",
    priority: "Low",
    status: "Resolved",
    timeAgo: "1 day ago",
    messagesCount: 5
  }
];

export const EngagementPage: React.FC<EngagementPageProps> = ({
  initialSubTab = "notifications",
  showToast
}) => {
  const [subTab, setSubTab] = useState(initialSubTab);

  // Broadcast Notification Form
  const [targetAudience, setTargetAudience] = useState("all");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");

  // Announcements List
  const [announcements, setAnnouncements] = useState([
    {
      id: "ann-1",
      title: "🎉 New 46+ Life OS Services Live",
      body: "We have upgraded all patient health trackers, garden farm management, and password vault.",
      date: "14 May 2025",
      status: "Active"
    },
    {
      id: "ann-2",
      title: "⚠️ Scheduled Database Optimization",
      body: "Cloud sync will undergo a 2-minute maintenance window at 2:00 AM UTC.",
      date: "10 May 2025",
      status: "Expired"
    }
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnBody, setNewAnnBody] = useState("");

  // Tickets
  const [tickets, setTickets] = useState<SupportTicketItem[]>(DEMO_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [replyText, setReplyText] = useState("");

  // Feedback
  const [feedbacks] = useState([
    { id: "fb-1", user: "Ram Shrestha", rating: 5, comment: "The water service and medication reminders are exceptionally smooth and helpful for my parents!", date: "Yesterday" },
    { id: "fb-2", user: "Sophie Dubois", rating: 5, comment: "Love the multi-language support and QR verification. Everything works reliably.", date: "3 days ago" },
    { id: "fb-3", user: "Alexander Wright", rating: 4, comment: "Clean interface, would love even more export charts for vital signs.", date: "1 week ago" }
  ]);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifBody) return;
    if (showToast) showToast(`Broadcast sent to ${targetAudience === "all" ? "all users" : targetAudience + " users"}!`);
    setNotifTitle("");
    setNotifBody("");
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnBody) return;
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle,
      body: newAnnBody,
      date: new Date().toLocaleDateString(),
      status: "Active"
    };
    setAnnouncements([newAnn, ...announcements]);
    setNewAnnTitle("");
    setNewAnnBody("");
    if (showToast) showToast("Announcement published successfully!");
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyText) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, status: "Resolved", messagesCount: t.messagesCount + 1 } : t
      )
    );
    if (showToast) showToast(`Reply sent to ${selectedTicket.userName}! Ticket resolved.`);
    setReplyText("");
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#FFF9F5] dark:bg-[#131d38] border border-orange-200/80 dark:border-[#1e294b] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            {subTab === "notifications" && <Bell className="w-6 h-6" />}
            {subTab === "announcements" && <Megaphone className="w-6 h-6" />}
            {subTab === "support_tickets" && <Headset className="w-6 h-6" />}
            {subTab === "feedback" && <Star className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                Engagement & Support Hub
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {subTab === "notifications" && "Push Notifications & Broadcast Center"}
              {subTab === "announcements" && "Platform Banner Announcements"}
              {subTab === "support_tickets" && "Support Tickets Helpdesk"}
              {subTab === "feedback" && "User Feedback & Ratings"}
            </h1>
          </div>
        </div>

        {/* Sub-tab switcher */}
        <div className="bg-white dark:bg-[#1a274c] p-1 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center shadow-xs overflow-x-auto">
          <button
            onClick={() => setSubTab("notifications")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === "notifications" ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setSubTab("announcements")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === "announcements" ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setSubTab("support_tickets")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === "support_tickets" ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Tickets (3)
          </button>
          <button
            onClick={() => setSubTab("feedback")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === "feedback" ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Feedback
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS TAB */}
      {subTab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSendNotification} className="bg-white dark:bg-[#131d38] p-6 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#FF5A36]" /> Send Push Notification
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold"
              >
                <option value="all">All Registered Users (24,680)</option>
                <option value="premium">Active Premium Users Only (7,842)</option>
                <option value="free">Free Tier Users (16,838)</option>
                <option value="enterprise">Clinics & Enterprise (240)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Daily Health Reminder or Special Update"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Message Body</label>
              <textarea
                rows={3}
                placeholder="Write message content here..."
                value={notifBody}
                onChange={(e) => setNotifBody(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Now</span>
            </button>
          </form>

          <div className="bg-white dark:bg-[#131d38] p-6 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white">Recent Notification History</h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-[#0f172a] rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">💧 Daily Hydration & Medicine Alert</span>
                  <span className="text-[10px] text-slate-400">Today, 8:00 AM</span>
                </div>
                <p className="text-[11px] text-slate-500">Delivered to 24,680 active devices (99.4% open rate)</p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-[#0f172a] rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">🌟 Weekend Yoga & Recovery Challenge</span>
                  <span className="text-[10px] text-slate-400">2 days ago</span>
                </div>
                <p className="text-[11px] text-slate-500">Delivered to Premium Users (7,842 devices)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {subTab === "announcements" && (
        <div className="space-y-6">
          <form onSubmit={handleAddAnnouncement} className="bg-white dark:bg-[#131d38] p-6 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#FF5A36]" /> Post New System Announcement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Announcement Title"
                value={newAnnTitle}
                onChange={(e) => setNewAnnTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium"
                required
              />
              <input
                type="text"
                placeholder="Announcement details..."
                value={newAnnBody}
                onChange={(e) => setNewAnnBody(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium"
                required
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#FF5A36] text-white text-xs font-black rounded-2xl shadow-xs cursor-pointer"
            >
              Publish Banner
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">{ann.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    ann.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {ann.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{ann.body}</p>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  Published: {ann.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TICKETS TAB */}
      {subTab === "support_tickets" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#131d38] rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0f172a] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-[#1e294b]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Subject & Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Time</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {tickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-orange-50/40 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{tkt.userName}</div>
                      <div className="text-[11px] text-slate-400">{tkt.userEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{tkt.subject}</div>
                      <span className="text-[10px] text-slate-400">{tkt.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        tkt.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {tkt.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        tkt.status === "Resolved" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {tkt.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{tkt.timeAgo}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedTicket(tkt)}
                        className="px-3 py-1.5 bg-[#FF5A36] text-white rounded-xl font-bold text-xs cursor-pointer"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ticket Reply Modal */}
          {selectedTicket && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#131d38] w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-[#1e294b] shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-black text-base text-slate-900 dark:text-white">Ticket: {selectedTicket.subject}</h4>
                  <span className="text-xs text-slate-400">From: {selectedTicket.userName}</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Type your official administrative reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    className="px-4 py-2 bg-[#FF5A36] text-white rounded-xl text-xs font-black"
                  >
                    Send & Resolve
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FEEDBACK TAB */}
      {subTab === "feedback" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-900 dark:text-white">{fb.user}</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(fb.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">"{fb.comment}"</p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Received: {fb.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
