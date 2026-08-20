import React, { useState } from "react";
import {
  Shield,
  Key,
  Lock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Folder,
  FileText,
  Share2,
  Clock,
  Sliders,
  User,
  Plus,
  CheckCircle2
} from "lucide-react";
import { PasswordTab, VaultItem } from "./passwords/types";
import { INITIAL_VAULT_ITEMS } from "./passwords/data";
import { PasswordDashboard } from "./passwords/PasswordDashboard";
import { PasswordAllItems } from "./passwords/PasswordAllItems";
import { PasswordItemDetailsModal } from "./passwords/PasswordItemDetailsModal";
import { PasswordGeneratorView } from "./passwords/PasswordGeneratorView";
import { PasswordSecurityCheckup } from "./passwords/PasswordSecurityCheckup";
import { PasswordBreachMonitor } from "./passwords/PasswordBreachMonitor";
import { PasswordFoldersView } from "./passwords/PasswordFoldersView";
import { PasswordSecureNotes } from "./passwords/PasswordSecureNotes";
import { PasswordSharingCenter } from "./passwords/PasswordSharingCenter";
import { PasswordActivityLog } from "./passwords/PasswordActivityLog";
import { PasswordSettingsView } from "./passwords/PasswordSettingsView";
import { PasswordProfileVault } from "./passwords/PasswordProfileVault";

export const PasswordTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PasswordTab>("dashboard");
  const [items, setItems] = useState<VaultItem[]>(INITIAL_VAULT_ITEMS);
  const [selectedItem, setSelectedItem] = useState<VaultItem>(INITIAL_VAULT_ITEMS[0]);
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const navMenuItems: Array<{ id: PasswordTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: Shield },
    { id: "all_items", label: "All Items", icon: Lock },
    { id: "item_details", label: "Item Details", icon: Key },
    { id: "generator", label: "Generator", icon: Sparkles },
    { id: "security_checkup", label: "Security Checkup", icon: ShieldCheck },
    { id: "breach_monitor", label: "Breach Monitor", icon: ShieldAlert },
    { id: "folders", label: "Folders", icon: Folder },
    { id: "secure_notes", label: "Secure Notes", icon: FileText },
    { id: "sharing_center", label: "Sharing", icon: Share2 },
    { id: "activity_log", label: "Activity Log", icon: Clock },
    { id: "settings", label: "Settings", icon: Sliders },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isFavorite: !it.isFavorite } : it))
    );
  };

  const handleSelectItem = (item: VaultItem) => {
    setSelectedItem(item);
    setActiveTab("item_details");
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showNotification("Item deleted securely.");
    setActiveTab("all_items");
  };

  const handleSelectFolder = (folderName: string) => {
    setSelectedFolderFilter(folderName);
    setActiveTab("all_items");
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Password Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">AES-256 GCM</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Vault & Credential Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("generator")}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Generate Password</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLLING PILL BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border whitespace-nowrap ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                  : "bg-[#FFF9F5] hover:bg-[#FFF2EB] text-slate-700 border-orange-200/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN SCREEN RENDER */}
      {activeTab === "dashboard" && (
        <PasswordDashboard
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenAddItem={() => {
            showNotification("Ready to create new credential.");
            setActiveTab("all_items");
          }}
          totalCount={items.length}
          weakCount={3}
          reusedCount={7}
          compromisedCount={0}
          securityScore={82}
        />
      )}

      {activeTab === "all_items" && (
        <PasswordAllItems
          items={items}
          onSelectItem={handleSelectItem}
          onToggleFavorite={handleToggleFavorite}
          onAddNewItem={() => {
            const newItem: VaultItem = {
              id: "v-" + Date.now(),
              title: "New Service",
              username: "user@example.com",
              password: "SecurePassword123!",
              website: "https://example.com",
              category: "Personal",
              folder: "Personal",
              brandColor: "#FF5A36",
              isFavorite: false,
              strength: "strong",
              lastModified: "Just now",
              createdAt: "Today",
            };
            setItems((prev) => [newItem, ...prev]);
            handleSelectItem(newItem);
            showNotification("Added new draft item to vault.");
          }}
          selectedCategory={selectedFolderFilter}
        />
      )}

      {activeTab === "item_details" && (
        <PasswordItemDetailsModal
          item={selectedItem}
          onBack={() => setActiveTab("all_items")}
          onShare={(it) => {
            showNotification(`Opening share center for ${it.title}`);
            setActiveTab("sharing_center");
          }}
          onDelete={handleDeleteItem}
        />
      )}

      {activeTab === "generator" && <PasswordGeneratorView />}

      {activeTab === "security_checkup" && (
        <PasswordSecurityCheckup
          onFixWeakPasswords={() => {
            showNotification("3 weak passwords flagged for batch update.");
            setActiveTab("all_items");
          }}
        />
      )}

      {activeTab === "breach_monitor" && <PasswordBreachMonitor />}

      {activeTab === "folders" && (
        <PasswordFoldersView onSelectFolder={handleSelectFolder} />
      )}

      {activeTab === "secure_notes" && <PasswordSecureNotes />}

      {activeTab === "sharing_center" && <PasswordSharingCenter />}

      {activeTab === "activity_log" && <PasswordActivityLog />}

      {activeTab === "settings" && <PasswordSettingsView />}

      {activeTab === "profile" && <PasswordProfileVault />}
    </div>
  );
};
